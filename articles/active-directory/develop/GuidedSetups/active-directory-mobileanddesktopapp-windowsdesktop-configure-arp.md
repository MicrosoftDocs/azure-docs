---
title: Azure AD v2 Windows Desktop Getting Started - Config | Microsoft Docs
description: How a Windows Desktop .NET (XAML) application can get an access token and call an API protected by Azure Active Directory v2 endpoint.
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/09/2017
ms.author: ryanwi
ms.custom: aaddev

ms.collection: M365-identity-device-management
---

# Add the application’s registration information to your app
In this step, you need to add the Application Id to your project.

1.	Open `App.xaml.cs` and replace the line containing the `ClientId` with:

```csharp
private static string ClientId = "[Enter the application Id here]";
```

### What is Next

[!INCLUDE [Test and Validate](../../../../includes/active-directory-develop-guidedsetup-windesktop-test.md)]
