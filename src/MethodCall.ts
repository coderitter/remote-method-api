import { RemoteMethodCall } from 'remote-method-call'

/**
 * The simple interface of a remote method call.
 */
export interface MethodCall<RemoteMethodCallType extends RemoteMethodCall = any> {

    /**
     * Call the method.
     *
     * @param remoteMethodCall The whole remote method call containing the parameters for the method and potentially more
     */
    callMethod(remoteMethodCall: RemoteMethodCallType): Promise<any>
}
