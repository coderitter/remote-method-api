import { expect } from 'chai'
import { Result } from 'coderitter-api'
import 'mocha'
import { RemoteMethodCall } from 'remote-method-call'
import LocalMethodCall from '../src/LocalMethodCall'
import RemoteMethodApi from '../src/RemoteMethodApi'

describe('Api', function() {
  describe('callMethod', function() {
    it('should call the method given directly by a function', async function() {
      let api = new RemoteMethodApi

      api.methods['a'] = async (parameter: any): Promise<any> => {
        return parameter.p1
      }

      let remoteMethodCall: RemoteMethodCall = {
        methodName: 'a',
        parameter: {
          p1: 'p1'
        }  
      }

      let result = await api.callMethod(remoteMethodCall)

      expect(result).to.equal('p1')
    })

    it('should call the method given as object with interface LocalMethodCall', async function() {
      let api = new RemoteMethodApi
      let localMethodCall: LocalMethodCall = {
        callMethod: async (parameter: any): Promise<any> => {
          return parameter.p1
        }
      }

      api.methods['a'] = localMethodCall

      let remoteMethodCall: RemoteMethodCall = {
        methodName: 'a',
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
        methodName: 'a',
        parameter: {
          p1: 'p1'
        }  
      }

      let result: Result<any> = await api.callMethod(remoteMethodCall)

      expect(result).to.be.instanceOf(Result)
      expect(result.isRemoteError()).to.be.true
    })

    it('should return an error if there was an exception thrown by the called method', async function() {
      let api = new RemoteMethodApi

      api.methods['a'] = async (parameter: any): Promise<any> => {
        throw new Error('TestError')
      }

      let remoteMethodCall: RemoteMethodCall = {
        methodName: 'a',
        parameter: {
          p1: 'p1'
        }  
      }

      let result: Result<any> = await api.callMethod(remoteMethodCall)

      expect(result).to.be.instanceOf(Result)
      expect(result.isRemoteError()).to.be.true
    })
  })
})