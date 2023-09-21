---
title: 'Create an enterprise application from a multi-tenant application'
description: Create an enterprise application using the client ID for a multi-tenant application.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 07/26/2022
ms.author: jomondi
ms.reviewer: karavar
ms.custom: mode-other, devx-track-azurecli
zone_pivot_groups: enterprise-apps-cli
#Customer intent: As an administrator of a Microsoft Entra tenant, I want to create an enterprise application using client ID for a multi-tenant application provided by a service provider or independent software vendor.
---

# Create an enterprise application from a multi-tenant application in Microsoft Entra ID

In this article, you'll learn how to create an enterprise application in your tenant using the client ID for a multi-tenant application. An enterprise application refers to a service principal within a tenant. The service principal discussed in this article is the local representation, or application instance, of a global application object in a single tenant or directory. 

Before you proceed to add the application using any of these options, check whether the enterprise application is already in your tenant by attempting to sign in to the application. If the sign-in is successful, the enterprise application already exists in your tenant.

If you have verified that the application isn't in your tenant, proceed with any of the following ways to add the enterprise application to your tenant.

## Prerequisites

To add an enterprise application to your Microsoft Entra tenant, you need:

- A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, or Application Administrator.
- The client ID (also called appId in Microsoft Graph) of the multi-tenant application.


## Create an enterprise application

:::zone pivot="admin-consent-url"

If you've been provided with the admin consent URL, navigate to the URL through a web browser to [grant tenant-wide admin consent](grant-admin-consent.md) to the application. Granting tenant-wide admin consent to the application will add it to your tenant. The tenant-wide admin consent URL has the following format:

```http
https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&client_id=248e869f-0e5c-484d-b5ea1fba9563df41&redirect_uri=https://www.your-app-url.com
```
where:

- `{client-id}` is the application's client ID (also known as appId).

:::zone-end

:::zone pivot="msgraph-powershell"

1. Run `connect-MgGraph -Scopes "Application.ReadWrite.All"` and sign in with a Global Administrator user account.
1. Run the following command to create the enterprise application:

   ```powershell
   New-MgServicePrincipal -AppId fc876dd1-6bcb-4304-b9b6-18ddf1526b62
   ```
1. To  delete the enterprise application you created, run the command:

   ```powershell
   Remove-MgServicePrincipal
      -ServicePrincipalId <objectID>
   ```
:::zone-end
:::zone pivot="ms-graph"

You can use an API client such as [Graph Explorer](https://aka.ms/ge) to work with Microsoft Graph.

1. Grant the client app the *Application.ReadWrite.All* permission.

1. To create the enterprise application, run the following query. The appId is the client ID of the application.
   
   ```http
   POST https://graph.microsoft.com/v1.0/servicePrincipals
   Content-type: application/json
   
   {
     "appId": "fc876dd1-6bcb-4304-b9b6-18ddf1526b62"
   }
   
   ```

1. To delete the enterprise application you created, run the query.

    ```http
    DELETE https://graph.microsoft.com/v1.0/servicePrincipals(appId='fc876dd1-6bcb-4304-b9b6-18ddf1526b62')
    ```	
:::zone-end
:::zone pivot="azure-cli"
1. To create the enterprise application, run the following command:
   
   ```azurecli
   az ad sp create --id fc876dd1-6bcb-4304-b9b6-18ddf1526b62
   ```

1. To  delete the enterprise application you created, run the command:

   ```azurecli
   az ad sp delete --id
   ```

:::zone-end

## Next steps

- [Add RBAC role to the enterprise application](../../role-based-access-control/role-assignments-portal.md)
- [Assign users to your application](add-application-portal-assign-users.md)
