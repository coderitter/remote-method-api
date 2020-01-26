# Remote Method API

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

api.methods['user.create'] = async (parameter: any) => {
  // create the user and return anything that suits your architecture
  return {
    status: 'success'
  }
}

let remoteMethodCall: RemoteMethodCall = {
  methodName: 'user.create',
  parameter: new User('Ruben') // use mega-nice-json to transfer real real classes
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

### Create a sophisticated remote method call handler with LocalMethodCall interface

Instead of assigning a remote method call directly as a function you can also assign any object satisfying the interface `LocalMethodCall`.

```typescript
export default interface LocalMethodCall {
  callMethod(parameter: any): Promise<any>
}
```