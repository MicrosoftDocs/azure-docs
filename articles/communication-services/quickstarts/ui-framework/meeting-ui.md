---
title: Getting started with UI Meeting SDK
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to user the Meeting UI SDK
author: tophpalmer
ms.author: chpalm
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Getting started with Meeting UI SDK

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

jkojlhj

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A User Access Token to instantiate the SDK client. Learn how to [create and manage user access tokens](../../access-tokens.md).

## Setting up

### Set Up React

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir ui-framework-quickstart && cd ui-framework-quickstart
```

TBD

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for iOS.

```swift
TBD
```


The `--save` option lists the library as a dependency in your **package.json** file.

## Add Meeting element to your application

The Meeting Composite is a complete communications experience you embed as a UI element in your app. 

```swift
TBD
```

## Initialize Communications Provider using access token

The SDK requires a user access token to authenticate to the Azure service and communicate. 

```swift
TBD
```

To initialize the `CommunicationsProvider` do the following:

```swift
TBD
```

**In private preview, only M365 associated Azure user access tokens are supported. In public preview all Azure tokens will be supported.**

## Modifying style and theming
The default style of the Meeting Composite is intentionally generic, but you can adjust colors and other theming elements. To style the app like Teams, use the Teams styling configuration below in <some file>:

```swift
TBD
```

## Modifying display name and avatar image 
The SDK shows personalized UI elements such as user display names and avatar images. You can configure these at run-time using:

```swift
TBD
```

If you're building an experience for an M365 user, you can use code from the <some sample> to obtain the user's displayname and avatar content from Graph APIs.

```swift
TBD
```

## Join a Teams meeting or make a call
Now that the UI is embedded, initialized, and personalized, it can participate in a variety of communication experiences, including:

1. Joining Teams meetings
2. Starting or joining ACS Group Calls
3. Starting ore receiving a 1:1 call to a specfic ACS user (or receive a call from another user)

Calling flows that are in development:

3. Starting or receiving a PSTN phone call from an ACS acquired number
3. Starting or receiving a PSTN phone call using numbers associated with the M365 user and their Teams configuration 

### Joining a Teams meeting

```swift
    // join with meeting link
    call = callAgent.join({meetingLink: meetingLinkInput.value}, {});
```

### Starting or joining an ACS Group Call
In order to start or join a call, `callSettings` must be passed to the `CallingProvider` for it to correct initialize the calling experience.

```swift
         let callees:[CommunicationIdentifier] = [CommunicationUser(identifier: self.callee)]
            self.call = self.callAgent?.call(callees, options: StartCallOptions())

```

### User to user direct calling

In order to start or join a call, `callSettings` must be passed to the `CallingProvider` for it to correct initialize the calling experience.

```swift
         let callees:[CommunicationIdentifier] = [CommunicationUser(identifier: self.callee)]
            self.call = self.callAgent?.call(callees, options: StartCallOptions())

```


## Run quickstart

TBD

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- TODO
