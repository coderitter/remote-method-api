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

It also uses [`coderitter-api`](https://github.com/c0deritter/coderitter-api) and [`coderitter-api-log`](https://github.com/c0deritter/mega-nice-log/tree/coderitter-api).

### Register remote methods

```typescript
import { RemoteMethodApi } from 'coderitter-api-remote-method-api'

let api = new RemoteMethodApi

api.methods['user.create'] = async (parameter: any) => {
  // create the user and return anything that suits your architecture
  return {
    status: 'success'
  }
}

let remoteMethodCall: RemoteMethodCall = {
  methodName: 'user.create',
  parameter: new User('Ruben')
}

let result = await api.callMethod(remoteMethodCall)

result == 'success'
```

### Reaction to thrown exceptions inside the remotely called method

If the remotely called method throws an exception then the [`coderitter-api`](https://github.com/c0deritter/coderitter-api) class `Result` with a set remote error is returned.

```typescript
Result.remoteError(`There was an error with your request. We just were informed that it happened and we will look into the issue. Please try again later.`)
```

### Reaction to not supported remote method calls

If the remotely called method is not supported then the [`coderitter-api`](https://github.com/c0deritter/coderitter-api) class `Result` with a set remote error is returned.

```typescript
Result.remoteError(`Remote method '${methodName}' not supported.`)
```

### Create a sophisticated remote method call handler with LocalMethodCall interface

Instead of assigning a remote method call directly as a function you can also assign any object satisfying the interface `LocalMethodCall`.

```typescript
export default interface LocalMethodCall {
  callMethod(parameter: any): Promise<any>
}
```