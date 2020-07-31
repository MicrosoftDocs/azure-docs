---
title: Place a telephone call
description: TODO
author: stkozak    
manager: rampras
services: azure-communication-services

ms.author: stkozak
ms.date: 06/23/2020
ms.topic: overview
ms.service: azure-communication-services

---
# Quickstart: Place a telephone call

> [!IMPORTANT]
> Azure Communication Services is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Communication Services lets you acquire multiple telephone (PSTN) numbers that can be used to place calls.

## Prerequisites
To be able to place an outgoing telephone call, you need following:

- **Deployed Azure Communication Service resource.** Please follow a quickstart to [create an Azure Communication Resource](./create-a-communication-resource).
- **An ACS configured telephone number(s).** Check out the quick start for telephone number management for more information on how to acquire a telephone number. NOTE: For private preview, please contact Nikolay Muravlyannikov (nmurav@microsoft.com) to aquire telephone numbers for your resource.
- **Download ACS Management SDK and deploy via Azure Functions** 
- **Download Client SDK with Sample application** 

## Issue a user access token

To place an outgoing telephone call on behalf of a user, you need to issue aa access token for that user. Please follow this [guide to issue a user access token](../concepts/user-access-tokens).

NOTE: Please make sure you issue a token with "void:pstn" token scope. If you do not have a token with such scope, the telephone call will fail.

## Initialize Client SDK
To create a `CallClient` you have to use `CallClientFactory.create` method that asynchronously returns a `CallClient` object once it's initialized

To create call client you have to pass a `CommunicationUserCredential` object.

#### [Javascript](#tab/javascript)
```ts
const userToken = '<user token>';
const fetchNewUserTokenFunc = async () => {
// return new token
};

const communicationUserCredential = new CommunicationUserCredential(fetchNewUserTokenFunc, userToken);
const callClient = await CallClientFactory.create(communicationUserCredential);
```

## Place an outgoing telephone call

You can initiate a callout to a phone number using the Call method of the CallClient you initialized in the previous step. If you don't specify any Caller ID, one of your aquired numbers from the Azure Communication Service resource will be used as a Caller ID and that is what a callee will see.

##### Make 1:1 call to user or 1:n call with users and PSTN

#### [Javascript](#tab/javascript)
```js
const placeCallOptions = {};
oneToOneCall = callClient.call(['+1234567890'], placeCallOptions);
```

## Place an outgoing telephone call with explicitly selected Caller ID (Available soon)
In case you want to initiate a callout to a phone number using specific Caller ID, you can use following code to do so. Please note that the number you use as a Caller ID has to belong the to Azure Communication Service resource you used to initialize the CallClient, otherwise the callout will fail.

#### [Javascript](#tab/javascript)
```js
const placeCallOptions = { fromCallerId: '+14250000001' };
oneToOneCall = callClient.call(['+1234567890'], placeCallOptions);
```
---