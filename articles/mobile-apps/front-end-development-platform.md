---
title: Choose the front-end development platform for building client applications with Visual Studio and Azure services
description: Learn about the supported native and cross-platform languages to build client applications.
author: codemillmatt
ms.service: vs-appcenter
ms.assetid: 355f0959-aa7f-472c-a6c7-9eecea3a34b9
ms.topic: conceptual
ms.date: 03/24/2020
ms.author: masoucou
---
# Choose mobile development frameworks
Developers can use client-side technologies to build mobile applications themselves by using specific frameworks and patterns for a cross-platform approach. Based on their decision factors, developers can build:
- Native single-platform applications by using languages like Objective C and Java
- Cross-platform applications by using Xamarin, .NET, and C#
- Hybrid applications by using Cordova and its variants

## Native platforms
Building a native application requires platform-specific programming languages, SDKs, development environments, and other tools provided by OS vendors.

### iOS
Created and developed by Apple, iOS is used to build apps on Apple devices, namely the iPhone and the iPad.

- **Programming languages**: Objective-C, Swift
- **IDE**: Xcode
- **SDK**: iOS SDK

### Android
Designed by Google and the most popular OS in the world, Android is used to build applications that can run on a range of smartphones and tablets.

- **Programming language**: Java, Kotlin 
- **IDE**: Android Studio and Android developer tools 
- **SDK**: Android SDK

### Windows
- **Programming language**: C#
- **IDE**: Visual Studio, Visual Studio Code
- **SDK**: Windows SDK

#### Pros
- Good user experience
- Responsive applications with high performance and the ability to interface with native libraries
- Highly secure applications

#### Cons
- Application runs on only one platform
- More developer resource intensive and expensive to build an application
- Lower code reuse

## Cross-platforms and hybrid applications
Cross-platform applications give you the power to write native mobile applications once, share code, and run them on iOS, Android, and Windows.

### Xamarin
Owned by Microsoft, [Xamarin](https://visualstudio.microsoft.com/xamarin/) is used to build robust, cross-platform mobile applications in C#. Xamarin has a class library and runtime that works across many platforms, such as iOS, Android, and Windows. It also compiles native (non-interpreted) applications that deliver high performance. Xamarin combines all of the abilities of the native platforms and adds a number of powerful features of its own.

- **Programming language**: C#
- **IDE**: Visual Studio on Windows or Mac

### React Native
Released by Facebook in 2015, [React Native](https://facebook.github.io/react-native/) is an [open-source](https://github.com/facebook/react-native) JavaScript framework for writing real, natively rendering mobile applications for iOS and Android. It's based on React, Facebook's JavaScript library for building user interfaces. Instead of targeting the browser, it targets mobile platforms. React Native uses native components instead of web components as building blocks.
 
- **Programming language**: JavaScript
- **IDE**: Visual Studio Code

### Unity
 Unity is an engine optimized for creating games. You can use it to craft high-quality 2D or 3D applications with C# for platforms such as Windows, iOS, Android, and Xbox.

### Cordova
Cordova lets you build hybrid applications by using Visual Studio Tools for Apache Cordova or Visual Studio Code with extensions for Cordova. With the hybrid approach, you can share components with websites and reuse web server-based applications with hosted web application approaches based on Cordova.

#### Pros
- Increased code usability by creating one codebase for multiple platforms
- Cater to a wider audience across many platforms
- Dramatic reduction in development time
- Easy to launch and update

#### Cons
- Lower performance
- Lack of flexibility
- Each platform has a unique set of features and functionality to make the native application more creative
- Increased UI design time
- Tool limitation
