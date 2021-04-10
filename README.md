# Remote Method API

A simple mapping from a remote method name to a the execution of code.

The Remote Method API is an alternative to REST. Instead of limiting oneself to the built-in and inextensible HTTP methods POST, PUT, PATCH, DELETE and GET, with a Remote Method API you can use as many methods as you need and also name them as you like. The HTTP method names do not fit with the standard CRUD (create, read, update, delete) method names.

## Related packages

This package uses the interface `RemoteMethodCall` of package [remote-method-call](https://github.com/c0deritter/remote-method-call).

To carry out a remote method call from inside the browser take a look at the package [postonly-request](https://github.com/c0deritter/postonly-request). It uses the HTTP usage style POSTonly which minimizes the locations were parameters are put into. Basically does it use the POST HTTP method only and every parameter is put inside the body of the HTTP message. It is an alternative to the REST usage style of HTTTP.

There is also a [branch](https://github.com/c0deritter/remote-method-api/tree/coderitter-api) which is adjusted for the use with the Coderitter API architecture.

## Install

`npm install remote-method-api`

## Overview

This package works in conjunction with [`remote-method-call`](https://github.com/c0deritter/remote-method-call) which provides a simple interface to describe a remote method call.

```typescript
interface RemoteMethodCall {
  methodName: string
  parameter?: any
}
```

### Register remote methods

```typescript
import { RemoteMethodApi } from 'remote-method-api'

let api = new RemoteMethodApi

// register remote methods
api.methods = {
  'User.create': async (parameter: any) => { return 'success' },
  'User.read': async (parameter: any) => { return [] },
  'User.update': async (parameter: any) => { return 'success' },
  'User.delete': async (parameter: any) => { return 'success' }
}
```

### Call a remote method

```typescript
let remoteMethodCall: RemoteMethodCall = {
  methodName: 'User.create',
  // the parameter can be of any type
  parameter: { name: 'Ruben' }
}

let result = await api.callMethod(remoteMethodCall)

result == 'success'
```

### React to thrown exceptions inside the remotely called method

If the remotely called method throws an exception then a simple object containing an error property with an error message is returned by method `callMethod`.

```typescript
{ error: `There was an error while executing remote method '${methodName}': ${e.message}` }
```

You can customize this behaviour by subclassing `RemoteMethodApi`.

```typescript
class YourApi extends RemoteMethodApi {
  onMethodError(error: any, methodName: string, parameter: any): any {
    return new YourError(error, methodName, parameter)
  }
}
```

### React to not supported remote method calls

If the remotely called method is not supported then a simple object containing an error property with an error message is return by method `callMethod`.

```typescript
{ error: `Remote method '${methodName}' not supported.` }
```

You can customize this behaviour by subclassing `RemoteMethodApi`.

```typescript
class YourApi extends RemoteMethodApi {
  onRemoteMethodNotSupported(methodName: string, parameter: any): any {
    return new YourError(methodName, parameter)
  }
}
```

### Create a sophisticated remote method call handler with MethodCall interface

Instead of assigning a remote method call directly as a function you can also assign any object satisfying the interface `MethodCall`.

```typescript
import { MethodCall } from 'remote-method-call'

export default interface MethodCall {
  callMethod(parameter: any): Promise<any>
}
```