import { RemoteMethodCall } from 'remote-method-call'
import LocalMethodCall from './LocalMethodCall'

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
    let methodName = remoteMethodCall.methodName
    let parameter = remoteMethodCall.parameter

    if (methodName != undefined && methodName in this.methods) {
      let methodCall = this.methods[methodName]

      try {
        if (typeof methodCall === 'function') {
          return await methodCall(parameter)
        }
        else {
          return await methodCall.callMethod(parameter)
        }
      }
      catch (e) {
        return this.onMethodError(e, methodName, parameter)
      }
    }
    else {
      return this.onRemoteMethodNotSupported(methodName, parameter)
    }
  }

  onMethodError(e: any, methodName: string, parameter: any): any {
    return {
      error: `There was an error while executing remote method '${methodName}': ${e.message}`
    }
  }

  onRemoteMethodNotSupported(methodName: string, parameter: any): any {
    return {
      error: `Remote method '${methodName}' not supported.`
    }
  }
}