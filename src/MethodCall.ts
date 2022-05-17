import { RemoteMethodCall, Result } from 'coderitter-api-remote-method-call'

/**
 * The simple interface of a remote method call.
 */
export interface MethodCall {

  /**
   * Call the method.
   * 
   * @param remoteMethodCall The whole remote method call containing the parameters for the method and potentially more
   */
  callMethod(remoteMethodCall: RemoteMethodCall): Promise<Result>
}
