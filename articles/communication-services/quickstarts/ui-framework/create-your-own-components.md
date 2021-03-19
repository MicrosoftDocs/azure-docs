---
title: Create your own UI Framework component
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to build a custom component compatible with the UI Framework
author: ddematheu2
ms.author: dademath
ms.date: 03/10/2021
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Create your Own UI Framework Component

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications.

In this quickstart, you'll learn how create your own components using the pre-defined state interface offered by UI Framework. This approach is ideal for developers who need more customization and want to use their own design assets for the experience. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (Node 12 Recommended).
- An active Communication Services resource. [Create a Communication Services resource](./../create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](./../access-tokens.md).

UI Framework requires a React environment to be set up. Next we will do that. If you already have a React App, you can skip this section.

### Set Up React App

We'll use the create-react-app template for this quickstart. For more information, see: [Get Started with React](https://reactjs.org/docs/create-a-new-react-app.html)

```console

npx create-react-app my-app

cd my-app

```

At the end of this process you should have a full application inside of the folder `my-app`. For this quickstart, we'll be modifying files inside of the `src` folder.

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript. Move the provided tarball (Private Preview) over to the my-app directory.

```console

//For Private Preview install tarball

npm install --save ./{path for tarball}

```

The `--save` option lists the library as a dependency in your **package.json** file.

### Run Create React App

Let's test the Create React App installation by running:

```console

npm run start   

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| Provider| Fluent UI provider that allows developers to modify underlying Fluent UI components|
| CallingProvider| Calling Provider to instantiate a call. Required to add base components|
| ChatProvider | Chat Provider to instantiate a chat thread. Required to add base components|
| connectFuncsToContext | Method to connect UI Framework components with underlying providers using mappers |
| MapToChatMessageProps | Chat message data layer mapper which provides components with chat message props |


## Initialize Chat Providers using Azure Communication Services credentials

For this quickstart we will use chat as an example, for more information on calling, see [Base Components Quickstart](./get-started-with-components.md) and [Composite Components Quickstart](./get-started-with-composites.md).

Go to the `src` folder inside of `my-app` and look for the file `app.js`. Here we'll drop the following code to initialize our Chat Provider. This provider is in charge of maintaining the context of the call and chat experiences. To initialize the components, you'll need an access token retrieved from Azure Communication Services. For details on how to do get an access token, see: [create and manage access tokens](./../access-tokens.md).

UI Framework Components follow the same general architecture for the rest of the service. The components don't generate access tokens, group IDs, or thread IDs. These elements come from services that go through the proper steps to generate these IDs and pass them to the client application. For more information, see [Client Server Architecture](./../../concepts/client-and-server-architecture.md).

`App.js`
```javascript

import {CallingProvider, ChatProvider} from "@azure/acs-ui-sdk"

function App(props) {

  return (
    <ChatProvider
    token={/*Insert the Azure Communication Services access token*/}
    userId={/*Insert the Azure Communication Services user id*/}
    displayName={/*Insert Display Name to be used for the user*/}
    threadId={/*Insert id for group chat thread to be joined*/}
    endpointUrl={/*Insert the environment URL for the Azure Resource used*/}
    refreshTokenCallback={/*Optional, Insert refresh token call back function*/}
    >
        //  Add Chat Components Here
    </ChatProvider>
  );
}

export default App;

```

Once initialized, this provider lets you build your own layout using UI Framework Component and any extra layout logic. The provider takes care of initializing all the underlying logic and properly connecting the different components together. Next we'll create a custom component using UI Framework mappers to connect to our chat provider.


## Create a custom component using mappers

We will start by creating a new file called `SimpleChatThread.js` where we will create the component. We will start by importing the UI Framework components we will need. Here, we will use out of the box html and react to create a fully custom component for a simple chat thread. Using the `connectFuncsToContext` method, we will use the `MapToChatMessageProps` mapper to map props to  `SimpleChatThread` custom components. These props will give us access to the chat messages being sent and received to populate them onto our simple thread.

`SimpleChatThread.js`
```javascript

import {connectFuncsToContext, MapToChatMessageProps} from "@azure/acs-ui-sdk"

function SimpleChatThread(props) {

    return (
        <div>
            {props.chatMessages?.map((message) => (
                <div key={message.id ?? message.clientMessageId}> {`${message.senderDisplayName}: ${message.content}`}</div>
            ))}
        </div>
    );
}

export default connectFuncsToContext(SimpleChatThread, MapToChatMessageProps);

```

## Add your custom component to your application

Now that we have our custom component ready, we will import it and add it to our layout.

```javascript

import {CallingProvider, ChatProvider} from "@azure/acs-ui-sdk"
import SimpleChatThread from "./SimpleChatThread"

function App(props) {

  return (
        <ChatProvider ... >
            <SimpleChatThread />
        </ChatProvider>
  );
}

export default App;

```

## Run quickstart

To run the code above, use the command:

```console

npm run start   

```

To fully test the capabilities, you will need a second client with chat functionality to send messages that will be received by our Simple Chat Thread. See our [Calling Hero Sample](./../../samples/calling-hero-sample.md) and [Chat Hero Sample](./../../samples/chat-hero-sample.md) as potential options.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Try UI Framework Composite Components](./get-started-with-composites.md)

For more information, see the following resources:
- [UI Framework Overview](../../concepts/ui-framework/ui-sdk-overview.md)
- [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md)
- [UI Framework Base Components Quickstart](./get-started-with-components.md)
