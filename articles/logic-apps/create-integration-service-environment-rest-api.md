---
title: Create integration service environments (ISEs) with Logic Apps REST API
description: Create an integration service environment (ISE) to access Azure virtual networks (VNETs) using the Azure Logic Apps REST API.
services: logic-apps
ms.suite: integration
ms.reviewer: rarayudu, azla
ms.topic: how-to
ms.date: 11/04/2022
---

# Create an integration service environment (ISE) by using the Logic Apps REST API

> [!IMPORTANT]
>
> On August 31, 2024, the ISE resource will retire, due to its dependency on Azure Cloud Services (classic), 
> which retires at the same time. Before the retirement date, export any logic apps from your ISE to Standard 
> logic apps so that you can avoid service disruption. Standard logic app workflows run in single-tenant Azure 
> Logic Apps and provide the same capabilities plus more.
>
> Starting November 1, 2022, you can no longer create new ISE resources. However, ISE resources existing 
> before this date are supported through August 31, 2024. For more information, see the following resources:
>
> - [ISE Retirement - what you need to know](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/ise-retirement-what-you-need-to-know/ba-p/3645220)
> - [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
> - [Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
> - [Export ISE workflows to a Standard logic app](export-from-ise-to-standard-logic-app.md)
> - [Integration Services Environment will be retired on 31 August 2024 - transition to Logic Apps Standard](https://azure.microsoft.com/updates/integration-services-environment-will-be-retired-on-31-august-2024-transition-to-logic-apps-standard/)
> - [Cloud Services (classic) deployment model is retiring on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)

For scenarios where your logic apps and integration accounts need access to an [Azure virtual network](../virtual-network/virtual-networks-overview.md), you can create an [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) by using the Logic Apps REST API. To learn more about ISEs, see [Access to Azure Virtual Network resources from Azure Logic Apps](connect-virtual-network-vnet-isolated-environment-overview.md).

This article shows you how to create an ISE by using the Logic Apps REST API in general. Optionally, you can also enable a [system-assigned or user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) on your ISE, but only by using the Logic Apps REST API at this time. This identity lets your ISE authenticate access to secured resources, such as virtual machines and other systems or services, that are in or connected to an Azure virtual network. That way, you don't have to sign in with your credentials.

For more information about other ways to create an ISE, see these articles:

* [Create an ISE by using the Azure portal](../logic-apps/connect-virtual-network-vnet-isolated-environment.md)
* [Create an ISE by using the sample Azure Resource Manager quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.logic/integration-service-environment)
* [Create an ISE that supports using customer-managed keys for encrypting data at rest](customer-managed-keys-integration-service-environment.md)

## Prerequisites

* The same [prerequisites](../logic-apps/connect-virtual-network-vnet-isolated-environment.md#prerequisites) and [access requirements](../logic-apps/connect-virtual-network-vnet-isolated-environment.md#enable-access) as when you create an ISE in the Azure portal

* Any additional resources that you want to use with your ISE so that you can include their information in the ISE definition, for example: 

  * To enable self-signed certificate support, you need to include information about that certificate in the ISE definition.

  * To enable the user-assigned managed identity, you need to create that identity in advance and include the `objectId`, `principalId` and `clientId` properties and their values in the ISE definition. For more information, see [Create a user-assigned managed identity in the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

* A tool that you can use to create your ISE by calling the Logic Apps REST API with an HTTPS PUT request. For example, you can use [Postman](https://www.getpostman.com/downloads/), or you can build a logic app that performs this task.

## Create the ISE

To create your ISE by calling the Logic Apps REST API, make this HTTPS PUT request:

`PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/integrationServiceEnvironments/{integrationServiceEnvironmentName}?api-version=2019-05-01`

> [!IMPORTANT]
> The Logic Apps REST API 2019-05-01 version requires that you make your own HTTP PUT request for ISE connectors.

Deployment usually takes within two hours to finish. Occasionally, deployment might take up to four hours. To check deployment status, in the [Azure portal](https://portal.azure.com), on your Azure toolbar, select the notifications icon, which opens the notifications pane.

> [!NOTE]
> If deployment fails or you delete your ISE, Azure might take up to an hour before releasing your subnets. 
> This delay means you might have to wait before reusing those subnets in another ISE.
>
> If you delete your virtual network, Azure generally takes up to two hours 
> before releasing up your subnets, but this operation might take longer. 
> When deleting virtual networks, make sure that no resources are still connected. 
> See [Delete virtual network](../virtual-network/manage-virtual-network.md#delete-a-virtual-network).

## Request header

In the request header, include these properties:

* `Content-type`: Set this property value to `application/json`.

* `Authorization`: Set this property value to the bearer token for the customer who has access to the Azure subscription or resource group that you want to use.

<a name="request-body"></a>

## Request body

In the request body, provide the resource definition to use for creating your ISE, including information for additional capabilities that you want to enable on your ISE, for example:

* To create an ISE that permits using a self-signed certificate and certificate issued by Enterprise Certificate Authority that's installed at the `TrustedRoot` location, include the `certificates` object inside the ISE definition's `properties` section, as this article later describes.

* To create an ISE that uses a system-assigned or user-assigned managed identity, include the `identity` object with the managed identity type and other required information in the ISE definition, as this article later describes.

* To create an ISE that uses customer-managed keys and Azure Key Vault to encrypt data at rest, include the [information that enables customer-managed key support](customer-managed-keys-integration-service-environment.md). You can set up customer-managed keys *only at creation*, not afterwards.

### Request body syntax

Here is the request body syntax, which describes the properties to use when you create your ISE:

```json
{
   "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Logic/integrationServiceEnvironments/{ISE-name}",
   "name": "{ISE-name}",
   "type": "Microsoft.Logic/integrationServiceEnvironments",
   "location": "{Azure-region}",
   "sku": {
      "name": "Premium",
      "capacity": 1
   },
   // Include the `identity` object to enable the system-assigned identity or user-assigned identity
   "identity": {
      "type": <"SystemAssigned" | "UserAssigned">,
      // When type is "UserAssigned", include the following "userAssignedIdentities" object:
      "userAssignedIdentities": {
         "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{user-assigned-managed-identity-object-ID}": {
            "principalId": "{principal-ID}",
            "clientId": "{client-ID}"
         }
      }
   },
   "properties": {
      "networkConfiguration": {
         "accessEndpoint": {
            // Your ISE can use the "External" or "Internal" endpoint. This example uses "External".
            "type": "External"
         },
         "subnets": [
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-1}",
            },
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-2}",
            },
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-3}",
            },
            {
               "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Network/virtualNetworks/{virtual-network-name}/subnets/{subnet-4}",
            }
         ]
      },
      // Include `certificates` object to enable self-signed certificate and the certificate issued by Enterprise Certificate Authority
      "certificates": {
         "testCertificate": {
            "publicCertificate": "{base64-encoded-certificate}",
            "kind": "TrustedRoot"
         }
      }
   }
}
```

### Request body example

This example request body shows the sample values:

```json
{
   "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Logic/integrationServiceEnvironments/Fabrikam-ISE",
   "name": "Fabrikam-ISE",
   "type": "Microsoft.Logic/integrationServiceEnvironments",
   "location": "WestUS2",
   "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
         "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/*********************************": {
            "principalId": "*********************************",
            "clientId": "*********************************"
         }
      }
   },
   "sku": {
      "name": "Premium",
      "capacity": 1
   },
   "properties": {
      "networkConfiguration": {
         "accessEndpoint": {
            // Your ISE can use the "External" or "Internal" endpoint. This example uses "External".
            "type": "External"
         },
         "subnets": [
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-1",
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-2",
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-3",
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-4",
            }
         ]
      },
      "certificates": {
         "testCertificate": {
            "publicCertificate": "LS0tLS1CRUdJTiBDRV...",
            "kind": "TrustedRoot"
         }
      }
   }
}
```

## Add custom root certificates

You often use an ISE to connect to custom services on your virtual network or on premises. These custom services are often protected by a certificate that's issued by custom root certificate authority, such as an Enterprise Certificate Authority or a self-signed certificate. For more information about using self-signed certificates, see [Secure access and data - Access for outbound calls to other services and systems](../logic-apps/logic-apps-securing-a-logic-app.md#secure-outbound-requests). For your ISE to successfully connect to these services through Transport Layer Security (TLS), your ISE needs access to these root certificates.

#### Considerations for adding custom root certificates

Before you update your ISE with a custom trusted root certificate, review these considerations:

* Make sure that you upload the root certificate *and* all the intermediate certificates. The maximum number of certificates is 20.

* The subject name on the certificate must match the host name for the target endpoint that you want to call from Azure Logic Apps. 

* Uploading root certificates is a replacement operation where the latest upload overwrites previous uploads. For example, if you send a request that uploads one certificate, and then send another request to upload another certificate, your ISE uses only the second certificate. If you need to use both certificates, add them together in the same request.  

* Uploading root certificates is an asynchronous operation that might take some time. To check the status or result, you can send a `GET` request by using the same URI. The response message has a `provisioningState` field that returns the `InProgress` value when the upload operation is still working. When `provisioningState` value is `Succeeded`, the upload operation is complete.

#### Request syntax

To update your ISE with a custom trusted root certificate, send the following HTTPS PATCH request to the [Azure Resource Manager URL, which differs based on your Azure environment](../azure-resource-manager/management/control-plane-and-data-plane.md#control-plane), for example:

| Environment | Azure Resource Manager URL |
|-------------|----------------------------|
| Azure global (multi-tenant) | `PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/integrationServiceEnvironments/{integrationServiceEnvironmentName}?api-version=2019-05-01` |
| Azure Government | `PATCH https://management.usgovcloudapi.net/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/integrationServiceEnvironments/{integrationServiceEnvironmentName}?api-version=2019-05-01` |
| Microsoft Azure operated by 21Vianet | `PATCH https://management.chinacloudapi.cn/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/integrationServiceEnvironments/{integrationServiceEnvironmentName}?api-version=2019-05-01` |
|||

#### Request body syntax for adding custom root certificates

Here is the request body syntax, which describes the properties to use when you add root certificates:

```json
{
   "id": "/subscriptions/{Azure-subscription-ID}/resourceGroups/{Azure-resource-group}/providers/Microsoft.Logic/integrationServiceEnvironments/{ISE-name}",
   "name": "{ISE-name}",
   "type": "Microsoft.Logic/integrationServiceEnvironments",
   "location": "{Azure-region}",
   "properties": {
      "certificates": {
         "testCertificate1": {
            "publicCertificate": "{base64-encoded-certificate}",
            "kind": "TrustedRoot"
         },
         "testCertificate2": {
            "publicCertificate": "{base64-encoded-certificate}",
            "kind": "TrustedRoot"
         }
      }
   }
}
```

## Next steps

* [Add resources to integration service environments](../logic-apps/add-artifacts-integration-service-environment-ise.md)
* [Manage integration service environments](../logic-apps/ise-manage-integration-service-environment.md#check-network-health)
