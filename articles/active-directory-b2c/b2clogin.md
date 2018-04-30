---
title: Using b2clogin.com| Microsoft Docs
description: Learn about using b2clogin.com instead of login.microsoftonline.com. 
services: active-directory-b2c
documentationcenter: ''
author: davidmu1
manager: mtillman
editor: ''

ms.service: active-directory-b2c
ms.workload: identity
ms.topic: article
ms.date: 04/29/2018
ms.author: davidmu

---

#Using b2clogin.com

>[!IMPORTANT]
>This feature is public preview 
>

You now have the option to use the Azure AD B2C service with `<YourTenantName>.b2clogin.com` instead of using `login.microsoftonline.com`.  We plan to transition all directories to use b2clogin.com by default in the future.  This has many benefits:
* You will no longer share the same cookie header size limit with the other Microsoft products
* You can remove all references to Microsoft in your URL (you can replace `yourtenant.onmicrosoft.com` with your tenant ID)

 