---
title: Configure the minimum TLS version for an Event Hubs namespace using ARM
titleSuffix: Event Hubs
description: Configure an Azure Event Hubs namespace to use a minimum version of Transport Layer Security (TLS).
services: event-hubs
author: EldertGrootenboer

ms.service: event-hubs
ms.topic: article
ms.date: 04/25/2022
ms.author: egrootenboer
---

# Configure the minimum TLS version for an Event Hubs namespace using ARM (Preview)

To configure the minimum TLS version for an Event Hubs namespace, set the  `MinimumTlsVersion`  version property. When you create an Event Hubs namespace with an Azure Resource Manager template, the `MinimumTlsVersion` property is set to 1.2 by default, unless explicitly set to another version.

> [!NOTE]
> Namespaces created using an api-version prior to 2022-01-01-preview will have 1.0 as the value for `MinimumTlsVersion`. This behavior was the prior default, and is still there for backwards compatibility.

## Create a template to configure the minimum TLS version

To configure the minimum TLS version for an Event Hubs namespace with a template, create a template with the  `MinimumTlsVersion`  property set to 1.0, 1.1, or 1.2. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose  **Create a resource**.
2. In  **Search the Marketplace** , type  **custom deployment** , and then press  **ENTER**.
3. Choose **Custom deployment (deploy using custom templates) (preview)**, choose  **Create** , and then choose  **Build your own template in the editor**.
4. In the template editor, paste in the following JSON to create a new namespace and set the minimum TLS version to TLS 1.2. Remember to replace the placeholders in angle brackets with your own values.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {
            "eventHubNamespaceName": "[concat(uniqueString(subscription().subscriptionId), 'tls')]"
        },
        "resources": [
            {
            "name": "[variables('eventHubNamespaceName')]",
            "type": "Microsoft.EventHub/namespaces",
            "apiVersion": "2022-01-01-preview",
            "location": "westeurope",
            "properties": {
                "minimumTlsVersion": "1.2"
            },
            "dependsOn": [],
            "tags": {}
            }
        ]
    }
    ```

5. Save the template.
6. Specify resource group parameter, then choose the  **Review + create**  button to deploy the template and create a namespace with the  `MinimumTlsVersion`  property configured.

> [!NOTE]
> After you update the minimum TLS version for the Event Hubs namespace, it may take up to 30 seconds before the change is fully propagated.

Configuring the minimum TLS version requires api-version 2022-01-01-preview or later of the Azure Event Hubs resource provider.

## Check the minimum required TLS version for a namespace

To check the minimum required TLS version for your Event Hubs namespace, you can query the Azure Resource Manager API. You will need a Bearer token to query against the API, which you can retrieve using [ARMClient](https://github.com/projectkudu/ARMClient) by executing the following commands.

```powershell
.\ARMClient.exe login
.\ARMClient.exe token <your-subscription-id>
```

Once you have your bearer token, you can use the script below in combination with something like [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to query the API.

```http
@token = Bearer <Token received from ARMClient>
@subscription = <your-subscription-id>
@resourceGroup = <your-resource-group-name>
@namespaceName = <your-namespace-name>

###
GET https://management.azure.com/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.EventHub/namespaces/{{namespaceName}}?api-version=2022-01-01-preview
content-type: application/json
Authorization: {{token}}
```

The response should look something like the below, with the minimumTlsVersion set under the properties.

```json
{
  "sku": {
    "name": "Premium",
    "tier": "Premium",
    "capacity": 1
  },
  "id": "/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group-name>/providers/Microsoft.EventHub/namespaces/<your-namespace-name>",
  "name": "<your-namespace-name>",
  "type": "Microsoft.EventHub/Namespaces",
  "location": "West Europe",
  "properties": {
    "minimumTlsVersion": "1.2",
    "publicNetworkAccess": "Enabled",
    "disableLocalAuth": false,
    "zoneRedundant": true,
    "isAutoInflateEnabled": false,
    "maximumThroughputUnits": 0,
    "kafkaEnabled": true,
    "provisioningState": "Succeeded",
    "status": "Active"
  }
}
```

## Test the minimum TLS version from a client

To test that the minimum required TLS version for an Event Hubs namespace forbids calls made with an older version, you can configure a client to use an older version of TLS. For more information about configuring a client to use a specific version of TLS, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md).

When a client accesses an Event Hubs namespace using a TLS version that does not meet the minimum TLS version configured for the namespace, Azure Event Hubs returns error code 401 (Unauthorized) and a message indicating that the TLS version that was used is not permitted for making requests against this Event Hubs namespace.

> [!NOTE]
> Due to limitations in the confluent library, errors coming from an invalid TLS version will not surface when connecting through the Kafka protocol. Instead a general exception will be shown.

> [!NOTE]
> When you configure a minimum TLS version for an Event Hubs namespace, that minimum version is enforced at the application layer. Tools that attempt to determine TLS support at the protocol layer may return TLS versions in addition to the minimum required version when run directly against the Event Hubs namespace endpoint.

## Next steps

See the following documentation for more information.

- [Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Hubs namespace](transport-layer-security-enforce-minimum-version.md)
- [Configure Transport Layer Security (TLS) for an Event Hubs client application](transport-layer-security-configure-client-version.md)
- [Use Azure Policy to audit for compliance of minimum TLS version for an Event Hubs namespace](transport-layer-security-audit-minimum-version.md)
