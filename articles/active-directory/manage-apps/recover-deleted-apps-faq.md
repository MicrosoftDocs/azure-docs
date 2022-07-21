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

This page answers frequently asked questions about deleting and restoring deleted application registrations and service principals.

## When I create applications, I'm getting Directory_QuotaExceeded error. How can I avoid this problem?
A non-admin user can create no more than 250 Azure AD resources that include applications and service principals. Both active resources and deleted resources that are available to restore count toward this quota. Even if you delete more applications that you don't need, they'll still add count to the quota. Hence, to free up the quota, you need to [permanently delete](/graph/api/directory-deleteditems-delete?tabs=http) objects in the deleted items container. You can learn more about the service limits through [this link](/azure/azure-resource-manager/management/azure-subscription-service-limits?msclkid=6cb6cc54c68711ec93eb9539fce3cc28#active-directory-limits).

The quota limit set for Azure AD resources is applicable when creating applications or service principals using a delegated flow such as using Azure AD app registrations or Enterprise apps portal. Creating applications using the Microsoft Graph API programmatically using application flow won't have this restriction. 

## Where can I find all the deleted applications and service principals?

Soft-deleted application and service principal objects go into the [deleted items](/graph/api/resources/directory?tabs=http) container and remain available to restore for up to 30 days. After 30 days, they're permanently deleted, and this frees up the quota. 
You find the deleted applications by using one of the following approaches:

- Using the Azure portal 
 
Recently deleted application objects can be found under the **Deleted applications** tab on the App registrations blade of Azure portal.

  :::image type="content" source="media/delete-application-portal/recover-deleted-apps.png" alt-text="Screenshot shows list of deleted items.":::
 
- Using the Microsoft Graph API

Recently deleted application and service principal objects can be found using the [List deletedItems](/graph/api/directory-deleteditems-list?tabs=http) API. 

- Using PowerShell

Recently deleted application and service principal objects can be found using the 
[Get-AzureADMSDeletedDirectoryObject](/powershell/module/azuread/get-azureadmsdeleteddirectoryobject?tabs=http) cmdlet.

## How do I restore deleted applications or service principals?

- Using Microsoft Graph API

Deleted objects can be restored using the [Restore deleted item](/graph/api/directory-deleteditems-restore?tabs=http) API. 

- Using PowerShell

Deleted objects can be restored using the [Restore-AzureADMSDeletedDirectoryObject](/powershell/module/azuread/restore-azureadmsdeleteddirectoryobject?tabs=http) cmdlet.

## How do I permanently delete soft deleted applications or service principals?

- Using the Microsoft Graph API

Soft deleted objects can be permanently deleted by using the [Permanently delete an item from deleted items](/graph/api/directory-deleteditems-delete?tabs=http) API.

- Using PowerShell

Soft deleted objects can be permanently deleted using the [Remove-AzureADMSDeletedDirectoryObject](/powershell/module/azuread/remove-azureadmsdeleteddirectoryobject?tabs=http) cmdlet.

## Can I configure the interval in which applications and service principals are permanently deleted by Azure AD?

No. You can’t configure the periodicity of hard deletion.

## I restored a deleted application using the App registrations portal experience. I don't see the SAML SSO configurations I made to the app prior to deletion.

The SAML SSO configurations are stored on the service principal object. When you restore an application from the App registrations UI, it recovers the app object but creates a new service principal.  Hence, the SAML SSO configurations done earlier to the app are lost when restoring a deleted application using the App registrations UI.

To correct this problem, delete the new service principal the app registrations experience created and restore the original service principal using the [Microsoft Graph API](/graph/api/directory-deleteditems-restore?tabs=http) or the [Microsoft Graph PowerShell cmdlet](/powershell/module/azuread/restore-azureadmsdeleteddirectoryobject?tabs=http). 

If you recorded the object ID of the service principal before deleting the application, use the [Restore deleted item](/graph/api/directory-deleteditems-restore?tabs=http) API to recover the service principal. Otherwise, use the [list deleted items](/graph/api/directory-deleteditems-list?tabs=http) API to fetch the deleted service principal and filter the results by the client's application ID (**appId**) property using the following syntax:

`https://graph.microsoft.com/v1.0/directory/deletedItems/microsoft.graph.servicePrincipal?$filter=appId eq '{appId}'`

## Why can’t I recover managed identities?

[Managed identities](../managed-identities-azure-resources/overview.md) are a special type of service principals. Deleted managed identities can’t be recovered currently. 

## I can’t see the provisioning data from a recovered service principal. How can I recover it back?

After recovering an SP, you may initially see the error in the following screenshot. This issue will resolve itself between 40 mins and 1 day. If you would like the provisioning job to start immediately, you can hit restart to force the provisioning service to run again. Hitting restart will trigger an initial cycle that can take time for customers with 100 K+ users or group memberships. 
 
:::image type="content" source="media/delete-application-portal/recover-user-provisioning.png" alt-text="Screenshot of recovering user provisioning data.":::

## I recovered my application that was configured for application proxy. I can’t see app proxy configurations after the recovery. How can I recover it back?

App proxy configurations can't be recovered through the portal UI. Use the API to recover app proxy settings. Expect a delay of up to 24 hours as the app proxy data gets synced back.

## I can’t see the policies I set on the service principal object after the recovery. How can I recover them?

Policies can't be recovered currently. When you restore a service principal, you'll have to configure the policies again.

## Next steps

- [Delete a service principal](delete-application-portal.md)
- [Delete an application registration](../develop/howto-restore-app.md)