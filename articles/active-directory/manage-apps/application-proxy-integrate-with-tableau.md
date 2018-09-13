---
title: Azure Active Directory Application Proxy and Tableau | Microsoft Docs
description: Learn how to use Azure Active Directory (Azure AD) Application Proxy to provide remote access for your Tableau deployment.
services: active-directory
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 08/20/2018
ms.author: barbkess
ms.reviewer: japere
ms.custom: it-pro
---

# Azure Active Directory Application Proxy and Tableau 

Azure Active Directory Application Proxy and Tableau have partnered to ensure you are easily able to use Application Proxy to provide remote access for your Tableau deployment. This article explains how to configure this scenario.  

## Prerequisites 

The scenario in this article assumes that you have:

- [Tableau](https://onlinehelp.tableau.com/current/server/en-us/proxy.htm#azure) configured. 

- An [Application Proxy connector](application-proxy-enable.md) installed. 

 
## Enabling Application Proxy for Tableau 

Application Proxy supports the OAuth 2.0 Grant Flow, which is required for Tableau to work properly. This means that there are no longer any special steps required to enable this application, other than configuring it by following the publishing steps below.


## Publish your applications in Azure 

To publish Tableau, you need to publish an application in the Azure Portal.

For:

- Detailed instructions of steps 1-8, see [Publish applications using Azure AD Application Proxy](application-proxy-publish-azure-portal.md). 
- Information about how to find Tableau values for the App Proxy fields, please see the Tableau documentation.  

**To publish your app**: 


1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator. 

2. Select **Azure Active Directory > Enterprise applications**. 

3. Select **Add** at the top of the blade. 

4. Select **On-premises application**. 

5. Fill out the required fields with information about your new app. Use the following guidance for the settings: 

    - **Internal URL**: This application should have an internal URL that is the Tableau URL itself. For example, `https://adventure-works.tableau.com`. 

    - **Pre-authentication method**: Azure Active Directory (recommended but not required). 

6. Select **Add** at the top of the blade. Your application is added, and the quick start menu opens. 

7. In the quick start menu, select **Assign a user for testing**, and add at least one user to the application. Make sure this test account has access to the on-premises application. 

8. Select **Assign** to save the test user assignment. 

9. (Optional) On the app management page, select **Single sign-on**. Choose **Integrated Windows Authentication** from the drop-down menu, and fill out the required fields based on your Tableau configuration. Select **Save**. 

 

## Testing 

Your application is now ready to test. Access the external URL you used to publish Tableau, and login as a user assigned to both applications.



## Next steps

For more information about Azure AD Application Proxy, see [How to provide secure remote access to on-premises applications](application-proxy.md).

