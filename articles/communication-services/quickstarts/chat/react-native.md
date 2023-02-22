---
title: Use the Chat SDK with React Native
titleSuffix: An Azure Communication Services quickstart
description: Learn how to use the Azure Communication Services Chat SDK with React Native.
author: ashwinder
ms.author: askaur
ms.date: 11/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Use the Chat SDK with React Native

In this quickstart, you set up the packages in the Azure Communication Services Chat JavaScript SDK to support chat in your React Native app. The steps described in the quickstart are supported for Azure Communication Services JavaScript Chat SDK 1.1.1 and later.

## Set up the chat packages to work with React Native

Currently, Communication Services chat packages are available as Node packages. Because not all Node modules are compatible with React Native, the modules require a React Native port to work.

After you [initialize your React Native project](https://reactnative.dev/docs/environment-setup#installing-dependencies), complete the following steps to make `@azure/communication-chat` work with React Native. The steps install the packages that contain React Native ports of the Node Core modules that are required in `@azure/communication-chat`.

1. Install `node-libs-react-native`:

   ```console
   npm install node-libs-react-native --save-dev
   ```

1. Install `stream-browserify`:

   ```console
   npm install stream-browserify --save-dev
   ```

1. Install `react-native-get-random-values`:

   ```console
   npm install react-native-get-random-values --save-dev
   ```

1. Install `react-native-url-polyfill`:

   ```console
   npm install react-native-url-polyfill --save-dev
   ```

1. Update _metro.config.js_ to use React Native-compatible Node Core modules:

   ```javascript
   module.exports = {
       // ...
       resolver: {
           extraNodeModules: {
               ...require('stream-browserify'),
               ...require('node-libs-react-native'),
               net: require.resolve('node-libs-react-native/mock/net'),
               tls: require.resolve('node-libs-react-native/mock/tls')
       }
   };
   }
   ```

1. Add the following `import` commands at the top of your entry point file:

   ```javascript
   import 'node-libs-react-native/globals';
   import 'react-native-get-random-values';
   import 'react-native-url-polyfill/auto';
   ```

1. Install Communication Services packages:

   ```console
   npm install @azure/communication-common@1.1.0 --save

   npm install @azure/communication-signaling@1.0.0-beta.11 --save

   npm install @azure/communication-chat@1.1.1 --save
   ```

## Next steps

In this quickstart, you learned how to set up the required Communication Services packages to add chat to your app in a React Native environment.

Learn how to [use the Chat SDK to start a chat](./get-started.md?pivots=programming-language-javascript).
