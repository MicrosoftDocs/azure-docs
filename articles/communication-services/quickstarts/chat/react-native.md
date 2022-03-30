---
title: Using Chat SDK with React Native
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to use the Azure Communication Chat SDK with React Native
author: askaur
ms.author: askaur
ms.date: 11/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Using Chat SDK with React Native

In this quickstart, we'll set up the Chat JavaScript SDK with React Native. This is supported for Azure Communication JavaScript Chat SDK v1.1.1 and later. 

## Setting up with React Native

The following steps will be required to run Azure Communication JavaScript Chat SDK with React Native after [initializing your React Native project](https://reactnative.dev/docs/environment-setup#installing-dependencies). 

ACS chat packages currently available are Node packages. Since not all Node modules are compatible with React Native, they require a React Native port in order to work. To make @azure/communication-chat work with React Native, you will need to install the below mentioned packages that contain React Native ports of the Node core required in @azure/communication-chat.

1. Install `node-libs-react-native` 
   ``` console
   npm install node-libs-react-native --save-dev
   ```
2. Install `stream-browserify` 
   ``` console
   npm install stream-browserify --save-dev
   ```
3. Install `react-native-get-random-values` 
   ``` console
   npm install react-native-get-random-values --save-dev
   ```
4. Install `react-native-url-polyfill` 
   ``` console
   npm install react-native-url-polyfill --save-dev
   ```
5. Update _metro.config.js_ to use React Native compatible Node Core modules
   ```JavaScript
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
   ```
6. Add following _import_ on top of your entry point file
   ```JavaScript
   import 'node-libs-react-native/globals';
   import 'react-native-get-random-values';
   import 'react-native-url-polyfill/auto';
   ```
7. Install Communication Service packages
   ```console
   npm install @azure/communication-common@1.1.0 --save

   npm install @azure/communication-signaling@1.0.0-beta.11 --save

   npm install @azure/communication-chat@1.1.1 --save
   ```

## Next steps
In this quickstart you learned:
> [!div class="checklist"]
> * Communication Services packages required to add chat to your app
> * How to set up Chat SDK for use in React Native environment

For a step by step guide on how to use Chat SDK to start a chat, refer to the [quickstart](./get-started.md?pivots=programming-language-javascript).

