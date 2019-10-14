---
title: Choose the front-end development platform for building client apps
description: Learn the supported native and cross platform languages to build client apps.
author: elamalani
manager: elamalani
ms.service: vs-appcenter
ms.assetid: 355f0959-aa7f-472c-a6c7-9eecea3a34b9
ms.topic: conceptual
ms.date: 08/08/2019
ms.author: emalani
---
# Choose Mobile Development Framework
Developers can use client-side technologies to build mobile apps themselves, using specific frameworks and patterns for a cross-platform approach. Developers can build native (native-single-platform using languages like Objective-C and Java) apps, cross-platform apps using Xamarin, .NET, and C#), and hybrid (using Cordova) and its variants, depending upon their decision factors.

## Native platforms
Building a native app requires platform-specific programming languages, SDKs, development environment and other tools provided by OS vendors.

### 1. **iOS**
Created and developed by Apple, apps built on iOS runs on Apple devices, namely iPhone and iPad.

- **Programming Language** - Objective-C, Swift
- **Toolkit** - Apple Xcode
- **SDK** - iOS SDK

### 2. **Android**
Designed by Google and the most popular OS in the world, apps built on Android can run on a range of smartphones and tablets.

- **Programming Language** - Java, Kotlin 
- **Toolkit** - Android Studio and Android Developer Tools 
- **SDK** - Android SDK

### 3. **Windows**
- **Programming Language** - C#
- **Toolkit** - Visual Studio
- **SDK** - Windows SDK

### **Pros**
- Good user experience
- Responsive apps with high Performance and ability to interface with native libraries
- Highly secure apps

### **Cons**
- App runs only on one platform
- More developer resource and expensive to build an app
- Lower code reuse

## Cross-platforms and Hybrid apps
Cross-platform apps gives you the power to write native mobile applications once, share code, and run them on iOS, Android, and Windows.

### 1. **Xamarin**
Owned by Microsoft, [Xamarin](https://visualstudio.microsoft.com/xamarin/) lets you build robust, cross-platform mobile apps in C#, with a class library and runtime that works across all many platforms, including iOS, Android, and Windows, while still compiling native (non-interpreted) applications that are highly performant. Xamarin combines all of the abilities of the native platforms and adds a number of powerful features of its own.

- **Programming Language** - C#
- **IDE** - Visual Studio on Windows or Mac

### 2. **React Native**
Released by Facebook in 2015, [React Native](https://facebook.github.io/react-native/) is an [open source](https://github.com/facebook/react-native) JavaScript framework  for writing real, natively rendering mobile applications for iOS and Android. It’s based on React, Facebook’s JavaScript library for building user interfaces, but instead of targeting the browser, it targets mobile platforms. React Native uses native components instead of web components as building blocks.
 
- **Programming Language** - JavaScript
- **IDE** - Visual Studio Code

### 3. **Unity**
 Unity enables to craft high-quality 2D/3D applications (mostly games) with C# and Unity for different target platforms including Windows, iOS, Android, and Xbox.

### 4. **Cordova**
Cordova lets you build Hybrid apps using Visual Studio Tools for Apache Codova or Visual Studio Code with extensions for Cordova. With the Hybrid approach, you can share components with websites and reuse web server-based apps with hosted web apps approaches based on Cordova.

### **Pros**
- Code reusability as it's possible to create one codebase for different platforms at the same time
- Cater to a wider audience across many platforms
- Dramatic reduction in development time
- Easy to launch and update

###  **Cons**
- Lower performance
- Lack of flexibility
- Each platform has a unique set of features and functionality to make the native app more creative
- Increased UI design time
- Tool limitation