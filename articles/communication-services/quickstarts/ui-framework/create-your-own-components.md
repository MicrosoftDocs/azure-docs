---
title: Getting started with UI Framework Composites
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to join an Teams meeting with the Azure Communication Calling SDK
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Getting started with UI Framework Composites

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications.

In this quickstart, you'll learn how create your own components using the pre-defined state interface offered by UI Framework. This is ideal for developers who need more customization and want to use their own design assets for the experience. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../access-tokens.md).

## Setting up

### Create a new Node.js application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir calling-quickstart && cd calling-quickstart
```

TBD

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```console
npm install @azure/communication-ui --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

## Initialize Communications Provider using access token

Using the required user access token, developers can initialize the UI Framework. The UI Framework uses the given token to then initialize and provide identity to the components used. Before initializing lets first import the UI Framework package.

```javascript

import {CommunicationsProvider} from "@azure/communication-ui"

```

To initialize the `CommunicationsProvider` do the following:

```javascript

<Provider>
    <CommunicationsProvider accessToken = {"INSERT ACCESS TOKEN"}>

        {/*Insert Chat or Calling Provider code from next step*/}

    </CommunicationsProvider>
</Provider>

```

Once initialized, this provider allows developers to build their own layout using UI Framework Components as well as any additional layout logic. The provider takes care of initializing all the underlying logic and properly connecting the different components together.

## Initialize Chat and Calling Providers using access token

Once you have initialized the `CommunicationsProvider`, we can now add the next layer before we add discrete components to build the communications experience. Depending on your need for calling or chat requirements you will need to initialize the calling and chat providers.

In the snippet below we initialize both the `CallingProvider` and the `ChatProvider`. Developers can choose which one to use depending on the type of communication experience they look to build or use both when both modalities are required.

```javascript

<Provider>
    <CommunicationsProvider accessToken = {"INSERT ACCESS TOKEN"}>
        <CallingProvider callSettings={...}>
            {/*Insert calling components code from next step*/}
        </CallingProvider>

        <ChatProvider chatSettings={...}>
            {/*Insert chat components code from next step*/}
        </ChatProvider>
    </CommunicationsProvider>
</Provider>

```

Moving forward in this quickstart, we will only use the `ChatProvider` to build a chat experience.

## Defining chatSettings to start or join a chat

In order to start or join a call, `chatSettings` must be passed to the `ChatProvider` for it to correct initialize the chat experience.

```javascript

chatSettings = {
    threadId = "THREAD_ID", //Optional, Azure Communication Services Thread ID. If not provided, a new thread will be created
}

```

Now that the chat is fully configured, the necessary UI Framework components can be added.

## Create a new component using provider

We will start by creating a new file called `customComponent.tsx` where we will create the component. We will start by importing the UI Framework. 

```javascript

import  {
    connectFuncsToContext, 
    ChatMessagePropsFromContext, 
    ChatMessageWithStatus} from "@azure/communication-ui"

```

Once imported, we will generate a simple thread that will connect to the Chat provider and help pass messages that the custom component will render.

```javascript

const SimpleChatThread  = (props: ChatMessagePropsFromContext): JSX.Element => {
    return(
        <div>
            {props.chatMessages?.map((message: ChatMessageWithStatus) => (
                <div key={message.id ?? message.clientMessageId}> {`${message.senderDisplayName}: ${message.content}`}</div>
            ))}
        </div>
    );
};

```

## Add your custom component to your application

Now that we have our custom component ready, we will import it and add it to our layout.

```javascript

import {SimpleChatThread } from "./customComponent.tsx"

<Provider>
    <CommunicationsProvider accessToken = {"INSERT ACCESS TOKEN"}>
        <ChatProvider chatSettings={...}>
            <SimpleChatThread  />
        </ChatProvider>
    </CommunicationsProvider>
</Provider>

```

## Run quickstart

TBD

TBD Screenshot 

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- TODO