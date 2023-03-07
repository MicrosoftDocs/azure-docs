---
title: Tutorial to configure Saviynt with Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Learn to configure Azure AD B2C with Saviynt for cross-application integration for better security, governance, and compliance. 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/07/2023
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial to configure Saviynt with Azure Active Directory B2C

Learn to integrate Azure Active Directory B2C (Azure AD B2C) with the Saviynt Security Manager platform, which has visibility, security, and governance. Saviynt incorporates application risk and governance, infrastructure management, privileged account management, and customer risk analysis.

Learn more: [Saviynt for Azure AD B2C](https://saviynt.com/integrations/azure-ad/for-b2c/)

Use the following instructions to set up access control delegated administration for Azure AD B2C users. Saviynt determines if a user is authorized to manage Azure AD B2C users with:

* Feature level security to determine if users can perform an operation. 
  * For example, create user, update user, reset user password, and so on
* Field level security to determine if users can read/write user attributes during user management operations 
  * For example, a Help Desk agent can update a phone number; other attributes are read-only
* Data level security to determine if users can perform an operation on another user
  * For example, a Help Desk administrator for the United Kingdom region manages UK users

## Prerequisites

To get started, you need:

* An Azure AD subscription
  * If you don't have on, get an [Azure free account](https://azure.microsoft.com/free/)
* An [Azure AD B2C tenant](./tutorial-create-tenant.md) linked to your Azure subscription
* Go to saviynt.com [Contact Us](https://saviynt.com/contact-us/) to request a demo

## Scenario description

The Saviynt integration includes the following components:

* **Azure AD B2C** – The business-to-customer identity as a service that enables custom control of how your customers sign up, sign in, and manage their profiles
  * See, [Azure AD B2C, Get started](https://azure.microsoft.com/services/active-directory/external-identities/b2c/) 
* **Saviynt for Azure AD B2C** – The identity governance platform that provides fine grained delegated administration for user life-cycle management and access governance of Azure AD B2C users.  
  * See, [Saviynt for Azure AD B2C](https://saviynt.com/integrations/azure-ad/for-b2c/)
* **Microsoft Graph API** – This API provides the interfaces for Saviynt to manage the Azure AD B2C users and their access in Azure AD B2C
  * [Microsoft Graph API](/graph/use-the-api)
    

The following architecture diagram shows the implementation.

![Image showing saviynt architecture diagram](./media/partner-saviynt/saviynt-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | A delegated administrator starts a manage Azure AD B2C user operation through Saviynt.
| 2. | Saviynt verifies with its authorization engine if the delegated administrator can do the specific operation.
| 3. | Saviynt’s authorization engine sends an authorization success/failure response.
| 4. | Saviynt allows the delegated administrator to do the required operation.
| 5. | Saviynt invokes Microsoft Graph API along with user attributes to manage the user in Azure AD B2C
| 6. | Microsoft Graph API will in turn create/update/delete the user in Azure AD B2C.
| 7. | Azure AD B2C will send a success/failure response.
| 8. | Microsoft Graph API will then return the response to Saviynt.

## Onboard with Saviynt

1. To create a Saviynt account, contact [Saviynt](https://saviynt.com/contact-us/)

2. Create delegated administration policies and assign users as delegated administrators with various roles.

## Configure Azure AD B2C with Saviynt

### Create an Azure AD Application for Saviynt

1. Sign in to the [Azure portal](https://portal.azure.com/#home).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the Azure portal, search and select **Azure AD B2C**.
1. Select **App registrations** > **New registration**.
1. Enter a Name for the application. For example, Saviynt and select **Create**.
1. Go to **API Permissions** and select **+ Add a permission.**
1. The Request API permissions page appears. Select **Microsoft APIs** tab and select **Microsoft Graph** as commonly used Microsoft APIs.
1. Go to the next page, and select **Application permissions**.
1. Select **Directory**, and select **Directory.Read.All** and **Directory.ReadWrite.All** checkboxes.
1. Select **Add Permissions**. Review the permissions added.
1. Select **Grant admin consent for Default Directory** > **Save**.
1. Go to **Certificates and Secrets** and select **+ Add Client Secret**. Enter the client secret description, select the expiry option, and select **Add**.
1. The Secret key is generated and displayed in the Client secret section. You'll need to use it later.

1. Go to **Overview** and get the **Client ID** and **Tenant ID**.
1. Tenant ID, client ID, and client secret will be needed to  complete the setup in Saviynt.

### Enable Saviynt to Delete users

The below steps explain how to enable Saviynt to perform user delete operations in Azure AD B2C.

>[!NOTE]
>[Evaluate the risk before granting admin roles access to a service principal.](../active-directory/develop/app-objects-and-service-principals.md)

1. Install the latest version of MSOnline PowerShell Module on a Windows workstation/server.

2. Connect to AzureAD PowerShell module and execute the following commands:

```powershell
Connect-msolservice #Enter Admin credentials of the Azure portal
$webApp = Get-MsolServicePrincipal –AppPrincipalId “<ClientId of Azure AD Application>”
Add-MsolRoleMember -RoleName "Company Administrator" -RoleMemberType ServicePrincipal -RoleMemberObjectId $webApp.ObjectId
```

## Test the solution

Browse to your Saviynt application tenant and test user life-cycle management and access governance use case.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)

- [Create a web API application](./add-web-api-application.md)
