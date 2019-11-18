---
title: Choose the front-end development platform for building client applications with Visual Studio and Azure services
description: Learn about the supported native and cross platform languages to build client applications.
author: elamalani
manager: elamalani
ms.service: vs-appcenter
ms.assetid: 355f0959-aa7f-472c-a6c7-9eecea3a34b9
ms.topic: conceptual
ms.date: 10/22/2019
ms.author: emalani
---
# Choose mobile development framework
Developers can use client-side technologies to build mobile applications themselves, using specific frameworks and patterns for a cross-platform approach. Developers can build native (native-single-platform using languages like Objective-C and Java) applications, cross-platform applications using Xamarin, .NET, and C#), and hybrid (using Cordova) and its variants, depending upon their decision factors.

## Native platforms
Building a native application requires platform-specific programming languages, SDKs, development environment and other tools provided by OS vendors.

### iOS
Created and developed by Apple, apps built on iOS runs on Apple devices, namely iPhone and iPad.

- **Programming languages** - Objective-C, Swift
- **IDE** - Xcode
- **SDK** - iOS SDK

### Android
Designed by Google and the most popular OS in the world, applications built on Android can run on a range of smartphones and tablets.

- **Programming language** - Java, Kotlin 
- **IDE** - Android Studio and Android Developer Tools 
- **SDK** - Android SDK

### Windows
- **Programming language** - C#
- **IDE** - Visual Studio, Visual Studio Code
- **SDK** - Windows SDK

#### Pros
- Good user experience
- Responsive applications with high Performance and ability to interface with native libraries
- Highly secure applications

#### Cons
- Application runs only on one platform
- More developer resource and expensive to build an application
- Lower code reuse

## Cross-platforms and hybrid applications
Cross-platform applications gives you the power to write native mobile applications once, share code, and run them on iOS, Android, and Windows.

### Xamarin
Owned by Microsoft, [Xamarin](https://visualstudio.microsoft.com/xamarin/) lets you build robust, cross-platform mobile applications in C#, with a class library and runtime that works across many platforms, including iOS, Android, and Windows, while still compiling native (non-interpreted) applications that are highly performant. Xamarin combines all of the abilities of the native platforms and adds a number of powerful features of its own.

- **Programming language** - C#
- **IDE** - Visual Studio on Windows or Mac

### React Native
Released by Facebook in 2015, [React Native](https://facebook.github.io/react-native/) is an [open source](https://github.com/facebook/react-native) JavaScript framework  for writing real, natively rendering mobile applications for iOS and Android. It's based on React, Facebook's JavaScript library for building user interfaces, but instead of targeting the browser, it targets mobile platforms. React Native uses native components instead of web components as building blocks.
 
- **Programming language** - JavaScript
- **IDE** - Visual Studio Code

### Unity
 Unity is an engine optimized for creating games which enables developers to craft high-quality 2D/3D applications with C# for different platforms including Windows, iOS, Android, and Xbox.

### Cordova
Cordova lets you build Hybrid applications using Visual Studio Tools for Apache Codova or Visual Studio Code with extensions for Cordova. With the Hybrid approach, you can share components with websites and reuse web server-based applications with hosted web applications approaches based on Cordova.

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
