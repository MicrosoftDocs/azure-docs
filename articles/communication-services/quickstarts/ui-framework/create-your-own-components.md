---
title: Create your Own UI Framework Component
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to join an Teams meeting with the Azure Communication Calling SDK
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Create your Own UI Framework Component

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications.

In this quickstart, you'll learn how create your own components using the pre-defined state interface offered by UI Framework. This is ideal for developers who need more customization and want to use their own design assets for the experience. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (Node 12 Recommended).
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

## Initialize Calling and Chat Providers using Azure Communication Services credentials

Using the required user access token and user id, developers can initialize the UI Framework calling and chat provides. The UI Framework uses the given token and user id to then initialize and provide identity to the components used. 

Before initializing lets first import the UI Framework package.

```javascript

import {CallingProvider, ChatProvider} from "@azure/communication-ui"

```

To initialize the `CommunicationsProvider` do the following:

```javascript

<Provider theme={/*Insert Fluent Theme*/}>
    <CallingProvider
    displayName={/*Insert Display Name to be used for the user*/}
    groupId={/*Insert GUID for group call to be joined*/}
    userId={/*Insert the Azure Communication Services user id */}
    token={/*Insert the Azure Communication Services access token*/}
    refreshTokenCallback={/*Insert refresh token call back function*/}
  >
  // Add Calling Components Here
  </CallingProvider>
</Provider>

<Provider theme={/*Insert Fluent Theme*/}>
    <ChatProvider
    token={/*Insert the Azure Communication Services access token*/}
    userId={/*Insert the Azure Communication Services user id*/}
    displayName={/*Insert Display Name to be used for the user*/}
    threadId={/*Insert id for group chat thread to be joined*/}
    environmentUrl={/*Insert the enviornment URL for the Azure Resource used*/}
    refreshTokenCallback={/*Insert refresh token call back function*/}
  >
  //  Add Chat Components Here
  </ChatProvider>
</Provider>

```

Once initialized, this provider allows developers to build their own layout using UI Framework Components as well as any additional layout logic. The provider takes care of initializing all the underlying logic and properly connecting the different components together.


## Create a new component using provider

We will start by creating a new file called `customComponent.tsx` where we will create the component. We will start by importing the UI Framework. 

```javascript

import  {
    connectFuncsToContext, 
    ChatMessagePropsFromContext, 
    ChatMessage,
    MapToChatMessageProps} from "@azure/communication-ui"

```

Once imported, we will generate a simple thread that will connect to the Chat provider and help pass messages that the custom component will render.

```javascript

const SimpleChatThread  = (props: MapToChatMessageProps): JSX.Element => {
    return(
        <div>
            {props.chatMessages?.map((message: ChatMessage) => (
                <div key={message.id ?? message.clientMessageId}> {`${message.senderDisplayName}: ${message.content}`}</div>
            ))}
        </div>
    );
};

export default connectFuncsToContext(SimpleChatThread, MapToChatMessageProps)

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