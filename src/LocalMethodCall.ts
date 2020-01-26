/**
 * The simple interface of a remote method call.
 */
export default interface LocalMethodCall {

  /**
   * Call the method.
   * 
   * @param parameter The parameter for the method.
   */
  callMethod(parameter: any): Promise<any>
}
