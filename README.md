# Remote Method API

A simple mapping from a remote method name to execution of code.

The Remote Method API is an alternative to REST. Instead of limiting oneself to the built-in and inextensible HTTP methods POST, PUT, PATCH, DELETE and GET, with a Remote Method API you can use as many methods as you need and also name them as you like.

## Related packages

This package uses the interface `RemoteMethodCall` of package [remote-method-call](https://github.com/c0deritter/remote-method-call).

To carry out a remote method call from inside the browser take a look at the package [postonly-request](https://github.com/c0deritter/postonly-request). It uses the HTTP usage style POSTonly which minimizes the locations were parameters are put into. Basically does it use the POST HTTP method only and every parameter is put inside the body of the HTTP message. It is an alternative to the REST usage style of HTTP.

## Install

`npm install remote-method-api`

## Overview

This package works in conjunction with [`remote-method-call`](https://github.com/c0deritter/remote-method-call) which provides a simple interface to describe a remote method call.

```typescript
interface RemoteMethodCall {
    method: string
    parameters?: any
}
```

### Register remote methods

```typescript
import { RemoteMethodApi } from 'remote-method-api'

const api = new RemoteMethodApi

// register remote methods
api.methods = {
  'User.get': async (rmc: RemoteMethodCall) => userLogic.get(rmc.parameters),
  'User.count': async (rmc: RemoteMethodCall) => userLogic.count(rmc.parameters),
  'User.store': async (rmc: RemoteMethodCall) => userLogic.store(rmc.parameters),
  'User.delete': async (rmc: RemoteMethodCall) => userLogic.delete(rmc.parameters)
}
```

### Call a remote method

```typescript
const rmc = {
    method: 'User.create',
    parameters: { name: 'Ruben' }
} as RemoteMethodCall

const result = await api.callMethod(rmc)
```

### React to thrown exceptions inside the remotely called method

If the remotely called method throws an exception then a simple object containing an error property with an error message is returned by method `callMethod`.

```typescript
{ error: `There was an error while executing remote method '${method}': ${e.message}` }
```

You can customize this behavior by sub classing `RemoteMethodApi`.

```typescript
class YourApi extends RemoteMethodApi {
    onMethodError(error: any, method: string, parameter: any): any {
        return new YourError(error, method, parameter)
    }
}
```

### React to not supported remote method calls

If the remotely called method is not supported then a simple object containing an error property with an error message is return by method `callMethod`.

```typescript
{ error: `Remote method '${method}' not supported.` }
```

You can customize this behaviour by subclassing `RemoteMethodApi`.

```typescript
class YourApi extends RemoteMethodApi {
    onRemoteMethodNotSupported(method: string, parameter: any): any {
        return new YourError(method, parameter)
    }
}
```

### Create a sophisticated remote method call handler with MethodCall interface

Instead of assigning a remote method call directly as a function you can also assign any object satisfying the interface `MethodCall`.

```typescript
import { MethodCall } from 'remote-method-api'

export default interface MethodCall {
    callMethod(parameter: any): Promise<any>
}
```