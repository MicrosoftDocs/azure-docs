---
title: Azure role-based access control (RBAC) and Azure Device Update for IoT Hub
description: Understand how Azure Device Update for IoT Hub uses Azure role-based access control (RBAC) to provide authentication and authorization for users and service APIs.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/21/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure RBAC and Azure Device Update for IoT Hub

For users and applications to access Azure Device Update for IoT Hub, they must be granted access to the Device Update resource. The Device Update service principal must also get access to its associated IoT hub to deploy updates and manage devices.

This article explains how Device Update and Azure IoT Hub use Azure role-based access control (Azure RBAC) to provide authentication and authorization for users and service APIs. The article also describes Microsoft Entra ID authentication for Device Update REST APIs, and support for managed identities in Device Update and Azure IoT Hub.

## Device Update access control roles

Device Update supports the following RBAC roles. For more information, see [Configure access control to the Device Update account](configure-access-control-device-update.md#configure-access-control-for-device-update-account).

|   Role Name   | Description  |
| :--------- | :---- |
|  Device Update Administrator | Has access to all Device Update resources  |
|  Device Update Reader| Can view all updates and deployments |
|  Device Update Content Administrator | Can view, import, and delete updates  |
|  Device Update Content Reader | Can view updates  |
|  Device Update Deployments Administrator | Can manage deployments of updates to devices|
|  Device Update Deployments Reader| Can view deployments of updates to devices |

You can assign a combination of roles to provide the right level of access. For example, you can use the Device Update Content Administrator role to import and manage updates, but you need the Device Update Deployments Reader role to view the progress of an update. Conversely, with the Device Update Reader role you can view all updates, but you need the Device Update Deployments Administrator role to deploy an update to devices.

## Device Update service principal access to IoT Hub

Device Update communicates with its associated IoT hub to deploy and manage updates at scale. To enable this communication, you need to grant the Device Update service principal access to the IoT hub with IoT Hub Data Contributor role.

Granting this permission allows the following deployment, device and update management, and diagnostic actions:

- Create deployment
- Cancel deployment
- Retry deployment 
- Get device

You can set this permission from the IoT hub **Access Control (IAM)** page. For more information, see [Configure IoT hub access for the Device Update service principal](configure-access-control-device-update.md#configure-access-for-azure-device-update-service-principal-in-linked-iot-hub).

## Device Update REST APIs

Device Update uses Microsoft Entra ID for authentication to its REST APIs. To get started, you need to create and configure a client application.

<a name='create-client-azure-ad-app'></a>
### Create a client Microsoft Entra app

To integrate an application or service with Microsoft Entra ID, first [register a client application with Microsoft Entra ID](../active-directory/develop/quickstart-register-app.md). Client application setup varies depending on the authorization flow you need: users, applications, or managed identities. For example:

- To call Device Update from a mobile or desktop application, select **Public client/native (mobile & desktop)** in **Select a platform** and enter `https://login.microsoftonline.com/common/oauth2/nativeclient` for the **Redirect URI**.
- To call Device Update from a website with implicit sign-on, use **Web** platform. Under **Implicit grant and hybrid flows**, select **Access tokens (used for implicit flows)**.

  >[!NOTE]
  >Use the most secure authentication flow available. Implicit flow authentication requires a high degree of trust in the application, and carries risks that aren't present in other flows. You should use this flow only when other more secure flows, such as managed identities, aren't viable.

### Configure permissions

Next, grant permissions to your app to call Device Update.

1. Go to the **API permissions** page of your app and select **Add a permission**.
1. Go to **APIs my organization uses** and search for **Azure Device Update**.
1. Select **user_impersonation** permission and select **Add permissions**.

### Request authorization token

The Device Update REST API requires an OAuth 2.0 authorization token in the request header. The following sections show examples of some ways to request an authorization token.

#### Azure CLI

```azurecli
az login
az account get-access-token --resource 'https://api.adu.microsoft.com/'
```

#### PowerShell MSAL Library

[`MSAL.PS`](https://github.com/AzureAD/MSAL.PS) PowerShell module is a wrapper over [Microsoft Authentication Library for .NET (MSAL .NET)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) that supports various authentication methods.

- User credentials:

  ```powershell
  $clientId = '<app_id>'
  $tenantId = '<tenant_id>'
  $authority = "https://login.microsoftonline.com/$tenantId/v2.0"
  $Scope = 'https://api.adu.microsoft.com/user_impersonation'
  
  Get-MsalToken -ClientId $clientId -TenantId $tenantId -Authority $authority -Scopes $Scope
  ```

- User credentials with device code:

  ```powershell
  $clientId = '<app_id>’
  $tenantId = '<tenant_id>’
  $authority = "https://login.microsoftonline.com/$tenantId/v2.0"
  $Scope = 'https://api.adu.microsoft.com/user_impersonation'
  
  Get-MsalToken -ClientId $clientId -TenantId $tenantId -Authority $authority -Scopes $Scope -Interactive -DeviceCode
  ```

- App credentials:

  ```powershell
  $clientId = '<app_id>’
  $tenantId = '<tenant_id>’
  $cert = '<client_certificate>'
  $authority = "https://login.microsoftonline.com/$tenantId/v2.0"
  $Scope = 'https://api.adu.microsoft.com/.default'
  
  Get-MsalToken -ClientId $clientId -TenantId $tenantId -Authority $authority -Scopes $Scope -ClientCertificate $cert
  ```

## Support for managed identities

Managed identities provide Azure services with secure, automatically managed Microsoft Entra ID identities. Managed identities eliminate the need for developers to manage credentials by providing identities. Device Update supports system-assigned managed identities.

To add a system-assigned managed identity for Device Update:

1. In the Azure portal, go to your Device Update account.
1. In the left navigation, select **Settings** > **Identity**.
1. Under **System assigned** on the **Identity** page, set **Status** to **On**.
1. Select **Save**, and then select **Yes**.

To add a system-assigned managed identity for IoT Hub:

1. In the Azure portal, go to your IoT hub.
1. In the left navigation, select **Security settings** > **Identity**.
1. Under **System-assigned** on the **Identity** page, select **On** under **Status**.
1. Select **Save**, and then select **Yes**.

To remove system-assigned managed identity from a Device Update account or IoT hub, set or select **Off** on the **Identity** page, and then select **Save**.

## Related content

- [Create Azure Device Update for IoT Hub resources](create-device-update-account.md)
- [Configure access control for Device Update resources](configure-access-control-device-update.md)