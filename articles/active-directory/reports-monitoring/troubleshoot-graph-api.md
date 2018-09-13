---

title: 'Troubleshoot errors in Azure Active Directory reporting API | Microsoft Docs'
description: Provides you with a resolution to errors while calling Azure Active Directory Reporting APIs.
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 0030c5a4-16f0-46f4-ad30-782e7fea7e40
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 01/15/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Troubleshoot errors in Azure Active Directory reporting API

This article lists the common error messages you may run into while accessing activity reports using the MS Graph API and steps for their resolution.

### 500 HTTP internal server error while accessing Microsoft Graph V2 endpoint

We do not currently support the Microsoft Graph v2 endpoint - make sure to access the activity logs using the Microsoft Graph v1 endpoint.

### Error: Failed to get user roles from AD Graph

You may get this error message when trying to access sign-ins using Graph Explorer. Make sure you are signed in to your account using both of the sign-in buttons in the Graph Explorer UI, as shown in the following image. 

![Graph Explorer](./media/troubleshoot-graph-api/graph-explorer.png)

### Error: Failed to do premium license check from AD Graph 

If you run into this error message while trying to access sign-ins using Graph Explorer, choose **Modify Permissions** underneath your account on the left nav, and select **Tasks.ReadWrite** and **Directory.Read.All**. 

![Modify permissions UI](./media/troubleshoot-graph-api/modify-permissions.png)


### Error: Neither tenant is B2C or tenant doesn't have premium license

Accessing sign-in reports requires an Azure Active Directory premium 1 (P1) license. If you see this error message while accessing sign-ins, make sure that your tenant is licensed with an Azure AD P1 license.

### Error: User is not in the allowed roles 

If you see this error message while trying to access audit logs or sign-ins using the API, make sure that your account is part of the **Security Reader** or **Report Reader** role in your Azure Active Directory tenant. 

### Error: Application missing AAD 'Read directory data' permission 

Please follow the steps in the [Prerequisites to access the Azure Active Directory reporting API](howto-configure-prerequisites-for-reporting-api.md) to ensure your application is running with the right set of permissions. 

### Error: Application missing MSGraph API 'Read all audit log data' permission

Please follow the steps in the [Prerequisites to access the Azure Active Directory reporting API](howto-configure-prerequisites-for-reporting-api.md) to ensure your application is running with the right set of permissions. 

## Next Steps

[Use the audit API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/directoryaudit)
[Use the sign-in activity report API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/signin)