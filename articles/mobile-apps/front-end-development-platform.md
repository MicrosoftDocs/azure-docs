---
title: Choose the front-end development platform
description: This page provides information on the front-end platform to choose when building a mobile application.
author: elamalani
manager: elamalani
ms.service: vs-appcenter
ms.assetid: 355f0959-aa7f-472c-a6c7-9eecea3a34b9
ms.topic: conceptual
ms.date: 08/08/2019
ms.author: emalani
---
# Choose the front end development platform for building mobile applications

As the first step towards building a mobile app, you must choose the platforms you prefer. 
## Native platforms
Building a native app requires platform-specific programming languages, SDks, development environment and other tools provided by OS vendors. There are three types of native platfporms to choose from. 

### iOS
Created and developed by Apple, apps built on iOS runs on Apple devices, namely iPhone and iPad. 

**Programming Language** - Objective-C, Swift
**Toolkit** - Apple Xcode
**SDK** - iOS SDK

### Android
Designed by Google and the most popular OS in the world, apps built on Android can run on a range of smartphones and tablets.

**Programming Language** - Java, Kotlin 
**Toolkit** - Android Studio and Android Developer Tools 
**SDK** - Android SDK

### Windows
**Programming Language** - C#
**Toolkit** - Visual Studio
**SDK** - Windows SDK

### Pros and Cons of native app development
**Pros**
- Responsive
- High Performance and ablity to interface with native libraries
- Good user experience
- Highly secure

**Cons**
- App runs only on one platform
- More developer resource and expensive to build an app
- Lower code reuse

## Cross-platforms
Cross-platform apps gives you the power to write native mobile applications once, share code, and run them on iOS, Android, and Windows.

### Xamarin
Owned by Microsoft, [Xamarin](https://visualstudio.microsoft.com/xamarin/) lets you build robust, cross-platform mobile apps in C#, with a class library and runtime that works across all many platforms, including iOS, Android, and Windows, while still compiling native (non-interpreted) applications that are highly performant. Xamarin combines all of the abilities of the native platforms and adds a number of powerful features of its own.

**Programming Language** - C#
**IDE** - Visual Studio on Windows or Mac

### React Native
Released by Facebook in 2015, [React Native](https://facebook.github.io/react-native/) is an [open source](https://github.com/facebook/react-native) JavaScript framework  for writing real, natively rendering mobile applications for iOS and Android. It’s based on React, Facebook’s JavaScript library for building user interfaces, but instead of targeting the browser, it targets mobile platforms. React Native uses native components instead of web components as building blocks.
 
**Programming Language** - JavaScript
**IDE** - Visual Studio Code

### Unity
 Unity enables to craft high-quality 2D/3D applications (mostly games) for different platforms including Windows, iOS, Android and Xbox.

### NativeScript
### C++

### Pros and Cons of cross-platform development
**Pros**
- Code reusability  as its possible to create one codebase for different platforms at the same time
- Wide audience as the app can be used iOS, Android and Windows users
- Dramatic reduction in development time
- Easy to launch and update

**Cons**
- Lower performance
- Lack of flexibility
- Platform limitations as each platform has a unique set of features and functionality to make the native app more creative
- Poor UX - Developing an app for different OS can be a bit challenging.
- Tool limitation

## Next steps
* Try the [Project Acoustics Unity sample content](unity-quickstart.md) or [Unreal sample content](unreal-quickstart.md)
