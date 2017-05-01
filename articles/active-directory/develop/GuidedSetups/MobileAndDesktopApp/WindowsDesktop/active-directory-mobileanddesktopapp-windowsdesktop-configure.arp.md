---
title: Implementing Sign-in with Microsoft on a Windows Desktop Application - Configure
description: How a Windows Desktop .NET (XAML) application can get an access token and call an API protected by Azure Active Directory v2 endpoint. | Microsoft Azure | Microsoft Azure
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
ms.date:
ms.author: andret

---
<div id="RedirectURLUX"/>

#Add the application’s registration information to your App
In this step, you need to add the Application Id to your project.

1.	Open App.xaml.cs and replace the line containing the `ClientId` with:

```csharp
private static string ClientId = "your_application_id_here";
```

### What is Next

[Test and Validate](active-directory-mobileanddesktopapp-windowsdesktop-test.md)
