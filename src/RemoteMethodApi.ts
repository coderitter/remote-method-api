import { Result } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { RemoteMethodCall } from 'remote-method-call'
import LocalMethodCall from './LocalMethodCall'

let log = new Log('Api.ts')

/**
 * A remote method call API. It is a simple mapping from a method name to
 * an endpoint which calls the method.
 */
export default class RemoteMethodApi {

  methods: {[methodName: string]: LocalMethodCall|((parameter: any) => Promise<any>)} = {}

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
    let l = log.fn('callMethod')
    l.debug('remoteMethodCall =', remoteMethodCall)

    let methodName = remoteMethodCall.methodName
    let parameter = remoteMethodCall.parameter

    if (methodName != undefined && methodName in this.methods) {
      let methodCall = this.methods[methodName]

      try {
        if (typeof methodCall === 'function') {
          l.debug('Remote method call handler is a function')
          let result = await methodCall(parameter)
          l.debug('result =', result)
          return result
        }
        else if (typeof methodCall.callMethod === 'function') {
          l.debug('Remote method call handler implements interface LocalMethodCall')
          let result = await methodCall.callMethod(parameter)
          l.debug('result =', result)
          return result
        }
        else {
          l.error('Attached remote method call hanlder not supported')
        }
      }
      catch (e) {
        l.error('There was an error executing the called remote method', e)
        return this.onMethodError(e, methodName, parameter)
      }
    }
    else {
      l.warn(`Remote method '${methodName}' not supported.`, this.methodNames)
      return this.onRemoteMethodNotSupported(methodName, parameter)
    }
  }

  onMethodError(e: any, methodName: string, parameter: any): any {
    return Result.remoteError(`There was an error with your request. We just were informed that it happened and we will look into the issue. Please try again later.`)
  }

  onRemoteMethodNotSupported(methodName: string, parameter: any): any {
    return Result.remoteError(`Remote method '${methodName}' not supported.`)
  }
}