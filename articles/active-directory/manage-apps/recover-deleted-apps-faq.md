---
title: Frequently asked questions about recovering deleted apps
titleSuffix: Azure AD
description: Find answers to frequently asked questions (FAQs) about recovering deleted apps and service principals.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: reference
ms.date: 05/24/2022
ms.author: jomondi
ms.reviewer: sureshja
ms.collection: M365-identity-device-management

---

# Recover deleted applications in Azure Active Directory FAQs

## When creating applications, I'm getting Directory_QuotaExceeded error. Deleting some of the applications that I no longer need didn’t help. How can I avoid this problem?
A non-admin user can create no more than 250 Azure AD resources that include applications and service principals. Both active resources and deleted resources that are available to restore count toward this quota. Hence, to free up the quota, you need to [permanently delete](https://docs.microsoft.com/graph/api/directory-deleteditems-delete?view=graph-rest-1.0&tabs=http) objects in the deleted items container. You can learn more about the service limits through [this link](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits?msclkid=6cb6cc54c68711ec93eb9539fce3cc28#active-directory-limits).

The quota limit set for Azure AD resources is applicable when creating applications or service principals using a delegated flow such as using Azure AD app registrations or Enterprise apps portal. Creating applications using the Microsoft Graph API programmatically using application flow won't have this restriction. 

## Where can I find all the deleted applications and service principals?

Soft-deleted application and service principal objects go into the [deleted items](https://docs.microsoft.com/graph/api/resources/directory?view=graph-rest-1.0) container and remain available to restore for up to 30 days. After 30 days, they're permanently deleted, and this frees up the quota. 
You find the deleted applications by using one of the following approaches. You can also restore or permanently delete them as well:

- Using the Azure portal 
 
Recently deleted application objects can be found under the **Deleted applications** tab on the App registrations blade of Azure portal.

  :::image type="content" source="media/delete-application-portal/recover-deleted-apps.png" alt-text="Browse in the enterprise application gallery for the application that you want to add.":::
 
- Using the Microsoft Graph API

Recently, deleted application and service principal objects can be found using the [List deletedItems](https://docs.microsoft.com/graph/api/directory-deleteditems-list?view=graph-rest-1.0&tabs=http) API. These objects can be restored using the [Restore deleted item](https://docs.microsoft.com/graph/api/directory-deleteditems-restore?view=graph-rest-1.0&tabs=http) API or can be permanently deleted by using the [Permanently delete an item from deleted items](https://docs.microsoft.com/graph/api/directory-deleteditems-delete?view=graph-rest-1.0&tabs=http) API.

- Using PowerShell

Recently deleted application and service principal objects can be found using the 
[Get-AzureADMSDeletedDirectoryObject](https://docs.microsoft.com/powershell/module/azuread/get-azureadmsdeleteddirectoryobject?view=azureadps-2.0) cmdlet. They can be restored using the [Restore-AzureADMSDeletedDirectoryObject](https://docs.microsoft.com/powershell/module/azuread/restore-azureadmsdeleteddirectoryobject?msclkid=714eb4d6c68b11ecb04e57b37eec9c19&view=azureadps-2.0) cmdlet or permanently deleted using the [Remove-AzureADMSDeletedDirectoryObject](https://docs.microsoft.com/powershell/module/azuread/remove-azureadmsdeleteddirectoryobject?view=azureadps-2.0) cmdlet. 

## When I deleted an application, service principal for the application is also deleted in my tenant. Why?

Any changes that you make to your application object are also reflected in its service principal object in the application's home tenant only (the tenant where it was registered). This means that deleting an application object will also delete its home tenant service principal object. However, restoring that application object won't restore its corresponding service principal. Restoring the application object will create a new service principal instead of restoring the old one. 

If you recorded the object ID of the service principal before deleting the application, use the [Restore deleted item](https://docs.microsoft.com/graph/api/directory-deleteditems-restore?view=graph-rest-1.0&tabs=http) API to recover the service principal. Otherwise, you'll first need to use the [list deleted items](https://docs.microsoft.com/graph/api/directory-deleteditems-list?view=graph-rest-1.0&tabs=http) API to fetch all the deleted service principals. To get the object ID of the service principal you want to restore, filter the results by including the client application's ID in the HTTP request. 

## Can I configure the interval in which applications and service principals are permanently deleted by Azure AD?
No. You can’t configure the periodicity of hard deletion.

## I restored a deleted application using the App registrations portal experience. I had my app configured with SAML SSO. I don't see the SAML SSO configurations I made to the app prior to deletion.

When you restore an application from the App registrations UI, it recovers the app object but creates a new service principal. This is a known issue that will be fixed soon. To correct this problem, delete the new service principal the app registrations experience created and restore the original service principal using the REST API or the PowerShell cmdlet. 

## Why can’t I recover managed identities?

[Managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview?msclkid=5447238ec68411ec8d4f2a5b007a64fb) are a special type of service principals. Deleted managed identities can’t be recovered currently. 

## I can’t see the provisioning data from a recovered service principal. How can I recover it back?

After recovering an SP, you may initially see the error in the following screenshot. This issue will resolve itself between 40 mins and 1 day. If you would like the provisioning job to start immediately, you can hit restart to force the provisioning service to run again. Hitting restart will trigger an initial cycle that can take time for customers with 100 K+ users or group memberships. 
 
:::image type="content" source="media/delete-application-portal/recover-user-provisioning.png" alt-text="Browse in the enterprise application gallery for the application that you want to add.":::

## I recovered my application that was configured for application proxy. I can’t see app proxy configurations after the recovery. How can I recover it back?

App proxy configurations can't be recovered through the portal UI. Use the API to recover app proxy settings. Expect a delay of up to 24 hours as the app proxy data gets synced back.
