import { RemoteMethodCall } from 'remote-method-call'
import { MethodCall } from './MethodCall'

/**
 * A remote method call API. It is a simple mapping from a method name to
 * an endpoint which calls the method.
 */
export class RemoteMethodApi<RemoteMethodCallType extends RemoteMethodCall = any, ResultType = any> {

    methods: { [methodName: string]: MethodCall<RemoteMethodCallType> | ((parameters: any) => Promise<ResultType>) } = {}

    /**
     * Get all the message id that can be handled
     */
    get methodNames(): string[] {
        return Object.keys(this.methods)
    }

    /**
     * Executes the method which was called remotely.
     *
     * @param rmc May be on object of type RemoteMethodCall or a JSON string containing an object matching the type RemoteMethodCall
     */
    async callMethod(rmc: RemoteMethodCallType): Promise<ResultType> {
        const method = rmc.method

        if (method != undefined && method in this.methods) {
            const methodCall = this.methods[method]

            try {
                if (typeof methodCall === 'function') {
                    return await methodCall(rmc)
                }
                else {
                    return await methodCall.callMethod(rmc)
                }
            }
            catch (e) {
                return this.onMethodError(e, rmc)
            }
        }
        else {
            return this.onRemoteMethodNotSupported(rmc)
        }
    }

    onMethodError(e: any, rmc: RemoteMethodCallType): any {
        return {
            error: `There was an error while executing remote method '${rmc.method}': ${e.message}`
        }
    }

    onRemoteMethodNotSupported(rmc: RemoteMethodCallType): any {
        return {
            error: `Remote method '${rmc.method}' not supported.`
        }
    }
}