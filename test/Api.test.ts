import { expect } from 'chai'
import 'mocha'
import { RemoteMethodCall } from 'remote-method-call'
import { MethodCall } from '../src/MethodCall'
import { RemoteMethodApi } from '../src/RemoteMethodApi'

describe('Api', function() {
  describe('callMethod', function() {
    it('should call the method given directly by a function', async function() {
      let api = new RemoteMethodApi

      api.methods['a'] = async (rmc: RemoteMethodCall): Promise<any> => {
        return rmc.parameters.p1
      }

      let remoteMethodCall: RemoteMethodCall = {
        method: 'a',
        parameters: {
          p1: 'p1'
        }  
      }

      let result = await api.callMethod(remoteMethodCall)

      expect(result).to.equal('p1')
    })

    it('should call the method given as object with interface MethodCall', async function() {
      let api = new RemoteMethodApi
      let methodCall: MethodCall = {
        callMethod: async (remoteMethodCall: RemoteMethodCall): Promise<any> => {
          return remoteMethodCall.parameters.p1
        }
      }

      api.methods['a'] = methodCall

      let remoteMethodCall: RemoteMethodCall = {
        method: 'a',
        parameters: {
          p1: 'p1'
        }  
      }

      let result = await api.callMethod(remoteMethodCall)

      expect(result).to.equal('p1')
    })

    it('should return a remote method not supported error', async function() {
      let api = new RemoteMethodApi

      let remoteMethodCall: RemoteMethodCall = {
        method: 'a',
        parameters: {
          p1: 'p1'
        }  
      }

      let result: any = await api.callMethod(remoteMethodCall)

      expect(result.error).to.be.a('string')
    })

    it('should return an error if there was an exception thrown by the called method', async function() {
      let api = new RemoteMethodApi

      api.methods['a'] = async (parameter: any): Promise<any> => {
        throw new Error('TestError')
      }

      let remoteMethodCall: RemoteMethodCall = {
        method: 'a',
        parameters: {
          p1: 'p1'
        }  
      }

      let result: any = await api.callMethod(remoteMethodCall)

      expect(result.error).to.be.a('string')
    })
  })
})