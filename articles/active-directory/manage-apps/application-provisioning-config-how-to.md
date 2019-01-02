---
title: How to configure user provisioning to an Azure AD Gallery application | Microsoft Docs
description: How you can quickly configure rich user account provisioning and deprovisioning to applications already listed in the Azure AD Application Gallery
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: barbkess
ms.reviewer: asteen

---

# How to configure user provisioning to an Azure AD Gallery application

*User account provisioning* is the act of creating, updating, and/or disabling user account records in an application’s local user profile store. Most cloud and SaaS applications store the users role and permissions in their own local user profile store, and presence of such a user record in their local store is *required* for single sign-on and access to work.

In the Azure portal, the **Provisioning** tab in the left navigation pane for an Enterprise App displays what provisioning modes are supported for that app. This can be one of two values:

## Configuring an application for Manual Provisioning

*Manual* provisioning means that user accounts must be created manually using the methods provided by that app. This could mean logging into an administrative portal for that app and adding users using a web-based user interface. Or it could be uploading a spreadsheet with user account detail, using a mechanism provided by that application. Consult the documentation provided by the app, or contact the app developer to determine wat mechanisms are available.

If Manual is the only mode shown for a given application, it means that no automatic Azure AD provisioning connector has been created for the app yet. Or it means the app does not support the pre-requisite user management API upon which to build an automated provisioning connector.

If you would like to request support for automatic provisioning for a given app, you can fill out a request using the [Azure Active Directory Application Requests](https://aka.ms/aadapprequest).

## Configuring an application for Automatic Provisioning

*Automatic* means that an Azure AD provisioning connector has been developed for this application. For more information on the Azure AD provisioning service and how it works, see [Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-app-provisioning).

For more information on how to provision specific users and groups to an application, see [Managing user account provisioning for enterprise apps](https://docs.microsoft.com/azure/active-directory/active-directory-enterprise-apps-manage-provisioning).

The actual steps required to enable and configure automatic provisioning vary depending on the application.

>[!NOTE]
>You should start by finding the setup tutorial specific to setting up provisioning for your application, and following those steps to configure both the app and Azure AD to create the provisioning connection. 
>
>

App tutorials can be found at [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list).

An important thing to consider when setting up provisioning be to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. This includes setting the “matching property” that be used to uniquely identify and match users/groups between the two systems. For more information on this important process.

## Next steps
[Customizing User Provisioning Attribute Mappings for SaaS Applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-customizing-attribute-mappings)

