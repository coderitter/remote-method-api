import { expect } from 'chai'
import { RemoteMethodCall, Result } from 'coderitter-api-remote-method-call'
import 'mocha'
import { MethodCall } from '../src/MethodCall'
import { RemoteMethodApi } from '../src/RemoteMethodApi'

describe('Api', function() {
  describe('callMethod', function() {
    it('should call the method given directly by a function', async function() {
      let api = new RemoteMethodApi

      api.methods['a'] = async (remoteMethodCall: RemoteMethodCall): Promise<any> => {
        return remoteMethodCall.parameter.p1
      }

      let remoteMethodCall: RemoteMethodCall = {
        method: 'a',
        parameter: {
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
          return remoteMethodCall.parameter.p1
        }
      }

      api.methods['a'] = methodCall

      let remoteMethodCall: RemoteMethodCall = {
        method: 'a',
        parameter: {
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
        parameter: {
          p1: 'p1'
        }  
      }

      let result: Result = await api.callMethod(remoteMethodCall)

      expect(result).to.be.instanceOf(Result)
      expect(result.isRemoteError()).to.be.true
    })

    it('should return an error if there was an exception thrown by the called method', async function() {
      let api = new RemoteMethodApi

      api.methods['a'] = async (parameter: any): Promise<any> => {
        throw new Error('TestError')
      }

      let remoteMethodCall: RemoteMethodCall = {
        method: 'a',
        parameter: {
          p1: 'p1'
        }  
      }

      let result: Result = await api.callMethod(remoteMethodCall)

      expect(result).to.be.instanceOf(Result)
      expect(result.isRemoteError()).to.be.true
    })
  })
})