---
title: Azure AD v2 UWP Getting Started - Configure | Microsoft Docs
description: How Universal Windows Platform (XAML) applications can call an API that require access tokens by Azure Active Directory v2 endpoint
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/03/2017
ms.author: andret

---

## Add the application’s registration information to your app
In this step, you need to add the Application Id to your project.

1.	Open `App.xaml.cs` and replace the line containing the `ClientId` with:

```csharp
private static string ClientId = "[Enter the application Id here]";
```

### What is Next

[Test and Validate](active-directory-mobileanddesktopapp-windowsdesktop-test.md)
