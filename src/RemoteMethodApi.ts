import { RemoteMethodCall, Result } from 'coderitter-api-remote-method-call'
import Log from 'mega-nice-log'
import LocalMethodCall from './LocalMethodCall'

let log = new Log('RemoteMethodApi.ts')

/**
 * A remote method call API. It is a simple mapping from a method name to
 * an endpoint which calls the method.
 */
export default class RemoteMethodApi {

  methods: {[methodName: string]: LocalMethodCall|((remoteMethodCall: RemoteMethodCall) => Promise<Result>)} = {}

  /**
   * Get all the message id that can be handled 
   */
  get methodNames(): string[] {
    return Object.keys(this.methods)
  }
  
  /**
   * Executes the method which was called remotely.
   * 
   * @param remoteMethodCall May be on object of type RemoteMethodCall or a JSON string containing an object matching the type RemoteMethodCall
   */
  async callMethod(remoteMethodCall: RemoteMethodCall): Promise<any> {
    let l = log.mt('callMethod')
    l.user('remoteMethodCall =', remoteMethodCall)

    let methodName = remoteMethodCall.methodName

    if (methodName != undefined && methodName in this.methods) {
      let methodCall = this.methods[methodName]

      try {
        if (typeof methodCall === 'function') {
          l.user('Remote method call handler is a function')
          let result = await methodCall(remoteMethodCall)
          l.user('result =', result)
          return result
        }
        else if (typeof methodCall.callMethod === 'function') {
          l.user('Remote method call handler implements interface LocalMethodCall')
          let result = await methodCall.callMethod(remoteMethodCall)
          l.user('result =', result)
          return result
        }
        else {
          l.error('Attached remote method call hanlder not supported')
        }
      }
      catch (e) {
        l.error('There was an error executing the called remote method', e)
        return this.onMethodError(e, remoteMethodCall)
      }
    }
    else {
      l.warn(`Remote method '${methodName}' not supported.`, this.methodNames)
      return this.onRemoteMethodNotSupported(remoteMethodCall)
    }
  }

  onMethodError(e: any, remoteMethodCall: RemoteMethodCall): any {
    return Result.remoteError(`There was an error with your request. We just were informed that it happened and we will look into the issue. Please try again later.`)
  }

  onRemoteMethodNotSupported(remoteMethodCall: RemoteMethodCall): any {
    return Result.remoteError(`Remote method '${remoteMethodCall.methodName}' not supported.`)
  }
}