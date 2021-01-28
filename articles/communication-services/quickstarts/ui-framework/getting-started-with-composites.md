---
title: Getting started with UI Framework SDK Composite Components
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to get started with UI Framework Composite Components
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Getting started with UI Framework Composites

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications. In this quickstart, you'll learn how integrate UI Framework Composite Components into your application to build communication experiences.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (Node 12 Recommended).
- An active Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A User Access Token to instantiate the call composite. Learn how to [create and manage user access tokens](../../access-tokens.md).

## Setting up

Open your terminal or command window create a new directory for your app, and navigate to it.

```console

mkdir ui-framework-quickstart && cd ui-framework-quickstart

```

UI Framework requires a React environment to be setup. Next we will do that. If you already have a React App, you can skip this section.

### Set Up React App

We will use the create-react-app template for this quickstart. For more information see: [Getting Started with React](https://reactjs.org/docs/create-a-new-react-app.html)

```console

npx create-react-app my-app

cd my-app

```

At the end of this process you should have a full application inside of the folder `my-app`. For this quickstart, we will be modifying files inside of the `src` folder.

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```console

npm install @azure/acs-ui-sdk --save 

//Private Preview install tarball

npm install --save ./{path for tarball}

```

The `--save` option lists the library as a dependency in your **package.json** file.

### Run Create React App

Lets test the Create React App installation by running:

```console

yarn start 

or

npm start

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI SDK client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| Provider| Fluent UI provider that allows developers to modify underlying Fluent UI components|
| GroupCall | Composite component that renders a group calling experience with participant gallery and controls. |
| GroupChat | Composite component that renders a group chat experience with chat thread and input |


## Initialize Group Call and Group Chat Composite Components

Go to the `src` folder inside of `my-app` and look for the file `app.js`. Here we will drop the following code to initialize our Composite Components for Group Chat and Calling. Developers can choose which one to use depending on the type of communication experience they look to build or use both when both modalities are required. To initialize the components you will require an access token retrieved from Azure Communication Services. For details on how to do this see: [create and manage user access tokens](../../access-tokens.md).

`App.js`
```javascript

import {GroupCall, GroupChat} from "@azure/acs-ui-sdk"
import { Provider } from '@fluentui/react-northstar';
import { svgIconStyles } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/es/themes/teams/siteVariables';

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

function App(){

    <Provider theme={iconTheme}>
        <GroupCall
            config={{
                displayName={DISPLAY_NAME}, //Required, Display name for the user entering the call
                userId={USERID}, //Required, Azure Communication Services user id retrieved from authentication service
                token={TOKEN}, // Required, Azure Communication Services access token retrieved from authentication service
                refreshTokenCallback={CALLBACK}, //Optional, Callback to refresh the token in case it expires
                groupId={GROUPID}, //Required, Id for group call that will be joined. (GUID)
            }}
            onEndCall = { () => {
                //Optional, Action to be performed when the call ends
            }}
        />

        <GroupChat 
            config={{
                displayName={DISPLAY_NAME}, //Required, Display name for the user entering the call
                userId={USERID}, //Required, Azure Communication Services user id retrieved from authentication service
                token={TOKEN}, // Required, Azure Communication Services access token retrieved from authentication service
                threadId={THREADID}, //Required, Id for group chat thread that will be joined.
                environmentURL={ENDPOINT_URL}, //Required, URL for Azure endpoint being used for Azure Communication Services
            }}
            onRenderAvatar = { () => {
                //Optional, ???
            }}
            refreshToken = { () => {
                //Optional, function to refresh the access token in case it expires
            }}
            options = {
                //Optional, options to define chat behavior
                sendBoxMaxLength: number | undefined //Optional, Limit the max send box length based on viewport size change.
            }
        />

    </Provider>
}

export default App;

```

## Run quickstart

To run the code above use the command:

```console

yarn start

or 

npm start

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- TODO
