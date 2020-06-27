---
title: Marketplace metering service authentication strategies | Azure Marketplace
description: Metering service authentication strategies supported in the Azure Marketplace. 
author: qianw211
ms.author: dsindona 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 05/21/2020
---

# Marketplace metering service authentication strategies

Marketplace metering service supports two authentication strategies:

* [Azure AD security token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens)
* [Managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) 

We will explain when and how to use the different authentication strategies to securely submit custom meters using Marketplace metering service.

## Using the Azure AD security token

Applicable offer types are transactable SaaS and Azure Applications with managed application plan type.  

Submit custom meters by using a predefined fixed Azure AD application ID to authenticate.

For SaaS offers, this is the only available option. It's a mandatory step for publishing any SaaS offer as described in [register a SaaS application](./pc-saas-registration.md).

For Azure applications with managed application plan, you should consider using this strategy in the following cases:

* You already have a mechanism to communicate with your backend services, and you want to extend this mechanism to emit custom meters from a central service.
* You have complex custom meters logic.  Run this logic in a central location, instead of the managed application resources.

Once you have registered your application, you can programmatically request an Azure AD security token. The publisher is expected to use this token and make a request to resolve it.

For more information about these tokens, see [Azure Active Directory access tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens).

### Get a token based on the Azure AD app

#### HTTP Method

**POST**

#### *Request URL*

**`https://login.microsoftonline.com/*{tenantId}*/oauth2/token`**

#### *URI parameter*

|  **Parameter name** |  **Required**  |  **Description**          |
|  ------------------ |--------------- | ------------------------  |
|  `tenantId`         |   True         | Tenant ID of the registered Azure AD application.   |
| | | |

#### *Request header*

|  **Header name**    |  **Required**  |  **Description**          |
|  ------------------ |--------------- | ------------------------  |
|  `Content-Type`     |   True         | Content type associated with the request. The default value is `application/x-www-form-urlencoded`.  |
| | | |

#### *Request body*

|  **Property name**  |  **Required**  |  **Description**          |
|  ------------------ |--------------- | ------------------------  |
|  `Grant_type`       |   True         | Grant type. Use `client_credentials`. |
|  `Client_id`        |   True         | Client/app identifier associated with the Azure AD app.|
|  `client_secret`    |   True         | Secret associated with the Azure AD app.  |
|  `Resource`         |   True         | Target resource for which the token is requested. Use `20e940b3-4c77-4b0b-9a53-9e16a1b010a7`. |
| | | |

#### *Response*

|  **Name**    |  **Type**  |  **Description**          |
|  ------------------ |--------------- | ----------------------  |
|  `200 OK`     |   `TokenResponse`    | Request succeeded.  |
| | | |

#### *TokenResponse*

Sample response token:

```JSON
  {
      "token_type": "Bearer",
      "expires_in": "3600",
      "ext_expires_in": "0",
      "expires_on": "15251…",
      "not_before": "15251…",
      "resource": "20e940b3-4c77-4b0b-9a53-9e16a1b010a7",
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImlCakwxUmNxemhpeTRmcHhJeGRacW9oTTJZayIsImtpZCI6ImlCakwxUmNxemhpeTRmcHhJeGRacW9oTTJZayJ9…"
  }
```

## Using the Azure-managed identities token

Applicable offer type is Azure applications with managed application plan type.

Using this approach will allow the deployed resources identity to authenticate to send custom meters usage events.  You can embed the code that emits usage within the boundaries of your deployment.

>[!Note]
>Publisher should ensure that the resources that emit usage are locked, so it will not be tampered.

Your managed application can contain different type of resources, from Virtual Machines to Azure Functions.  For more information on how to authenticate using managed identities for different services, see [how to use managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview#how-can-i-use-managed-identities-for-azure-resources).

For example, follow the steps below to authenticate using a Windows VM,

1. Make sure Managed Identity is configured using one of the methods:
    * [Azure portal UI](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)
    * [CLI](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm)
    * [PowerShell](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm)
    * [Azure Resource Manager Template](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm)
    * [REST](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-rest-vm#system-assigned-managed-identity)
    * [Azure SDKs](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm)

1. Get an access token for Marketplace metering service application ID (`20e940b3-4c77-4b0b-9a53-9e16a1b010a7`) using the system identity, RDP to the VM, open PowerShell console and run the command below

    ```powershell
    # curl is an alias to Web-Invoke PowerShell command
    # Get system identity access tokenn
    $MetadataUrl = "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F"
    $Token = curl -H @{"Metadata" = "true"} $MetadataUrl | Select-Object -Expand Content | ConvertFrom-Json
    $Headers = @{}
    $Headers.Add("Authorization","$($Token.token_type) "+ " " + "$($Token.access_token)")
    ```

1. Get the managed app ID from the current resource groups 'ManagedBy' property

    ```powershell
    # Get subscription and resource group
    $metadata = curl -H @{'Metadata'='true'} http://169.254.169.254/metadata/instance?api-version=2019-06-01 | select -ExpandProperty Content | ConvertFrom-Json 
    
    # Make sure the system identity has at least reader permission on the resource group
    $managementUrl = "https://management.azure.com/subscriptions/" + $metadata.compute.subscriptionId + "/resourceGroups/" + $metadata.compute.resourceGroupName + "?api-version=2019-10-01"
    $resourceGroupInfo = curl -Headers $Headers $managementUrl | select -ExpandProperty Content | ConvertFrom-Json
    $managedappId = $resourceGroupInfo.managedBy 
    ```

1. Marketplace metering service requires to report usage on a `resourceID`, and `resourceUsageId` if a managed application.

    ```powershell
    # Get resourceUsageId from the managed app
    $managedAppUrl = "https://management.azure.com" + $managedappId + "\?api-version=2019-07-01"
    $ManagedApp = curl $managedAppUrl -H $Headers | Select-Object -Expand Content | ConvertFrom-Json
    # Use this resource ID to emit usage 
    $resourceUsageId = $ManagedApp.properties.billingDetails.resourceUsageId
    ```

1. Use the [Marketplace metering service API](./marketplace-metering-service-apis.md) to emit usage.

## Next steps

* [Create an Azure application offer](./create-new-azure-apps-offer.md)
* [Create a transactable SaaS offer](./offer-creation-checklist.md)