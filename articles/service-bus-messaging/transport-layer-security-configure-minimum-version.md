---
title: Configure the minimum TLS version for a Service Bus namespace using ARM
titleSuffix: Service Bus
description: Configure an Azure Service Bus namespace to use a minimum version of Transport Layer Security (TLS).
author: EldertGrootenboer
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: article
ms.date: 10/28/2024
ms.author: egrootenboer
---

# Configure the minimum TLS version for a Service Bus namespace

Azure Service Bus namespaces permit clients to send and receive data by using TLS 1.2 and later versions. To enforce stricter security measures, you can configure your Service Bus namespace to require that clients use a newer version of TLS. If a Service Bus namespace requires a minimum version of TLS, then any requests made by using an older version fail. For conceptual information about this feature, see [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace](transport-layer-security-enforce-minimum-version.md).

You can configure the minimum TLS version using the Azure portal or Azure Resource Manager (ARM) template. 

> [!WARNING]
> As of 20 October 2025, TLS 1.0 and TLS 1.1 will no longer be supported on Azure Service Bus. The minimum TLS version will be 1.2 for all Service Bus deployments. 

## Specify the minimum TLS version in the Azure portal
You can specify the minimum TLS version when creating a Service Bus namespace in the Azure portal on the **Advanced** tab. 

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/create-namespace-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version when creating a namespace.":::

You can also specify the minimum TLS version for an existing namespace on the **Configuration** page.

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/existing-namespace-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version for an existing namespace.":::

## Use Azure CLI
To **create a namespace with the minimum TLS version set to 1.3**, use the [`az servicebus namespace create`](/cli/azure/servicebus/namespace#az-servicebus-namespace-create) command with `--min-tls` set to `1.3`.

```azurecli-interactive
az servicebus namespace create \
    --name mynamespace \
    --resource-group myresourcegroup \
    --min-tls 1.3
```

## Use Azure PowerShell
To **create a namespace with the minimum TLS version set to 1.3**, use the [`New-AzServiceBusNamespace`](/powershell/module/az.servicebus/new-azservicebusnamespace) command with `-MinimumTlsVersion` set to `1.3`. 

```azurepowershell-interactive
New-AzServiceBusNamespace `
    -ResourceGroup myresourcegroup `
    -Name mynamespace `
    -MinimumTlsVersion 1.3
```


## Create a template to configure the minimum TLS version
To configure the minimum TLS version for a Service Bus namespace, set the  `MinimumTlsVersion`  version property to 1.2 or 1.3. When you create a Service Bus namespace by using an Azure Resource Manager template, the `MinimumTlsVersion` property defaults to 1.2 unless you explicitly set it to another version.

> [!NOTE]
> If you create a namespace by using an api-version earlier than 2022-01-01-preview, the `MinimumTlsVersion` value is 1.0. This value was the default in earlier versions and remains for backward compatibility.

The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, select  **Create a resource**.
1. In  **Search the Marketplace** , type  **custom deployment** , and then press  **ENTER**.
1. Select **Custom deployment (deploy using custom templates) (preview)**, select  **Create** , and then select  **Build your own template in the editor**.
1. In the template editor, paste the following template to create a new namespace and set the minimum TLS version to TLS 1.2. Remember to replace the placeholders in angle brackets with your own values.

# [Bicep](#tab/bicep)

```bicep
@description('Name of the Service Bus namespace')
param serviceBusNamespaceName string = 'sb${uniqueString(subscription().subscriptionId)}tls'

@description('Location for all resources.')
param location string = 'westeurope'

@allowed([
  '1.2'
  '1.3'
])
@description('Minimum TLS version')
param minimumTlsVersion string = '1.2'

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: serviceBusNamespaceName
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    minimumTlsVersion: minimumTlsVersion
  }
}
```

# [ARM template](#tab/arm)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "serviceBusNamespaceName": {
            "type": "string",
            "defaultValue": "[concat(uniqueString(subscription().subscriptionId), 'tls')]",
            "metadata": {
                "description": "Name of the Service Bus namespace"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "westeurope",
            "metadata": {
                "description": "Location for all resources."
            }
        },
        "minimumTlsVersion": {
            "type": "string",
            "defaultValue": "1.2",
            "allowedValues": [
                "1.2",
                "1.3"
            ],
            "metadata": {
                "description": "Minimum TLS version"
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.ServiceBus/namespaces",
            "apiVersion": "2024-01-01",
            "name": "[parameters('serviceBusNamespaceName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard"
            },
            "properties": {
                "minimumTlsVersion": "[parameters('minimumTlsVersion')]"
            }
        }
    ]
}
```

---

5. Save the template.
6. Specify the resource group parameter, and then select the  **Review + create**  button to deploy the template and create a namespace with the  `MinimumTlsVersion`  property configured.

> [!NOTE]
> After you update the minimum TLS version for the Service Bus namespace, it can take up to 30 seconds before the change is fully propagated.

Configuring the minimum TLS version requires api-version 2022-01-01-preview or later of the Azure Service Bus resource provider.

## Check the minimum required TLS version for a namespace

To check the minimum required TLS version for your Service Bus namespace, query the Azure Resource Manager API. You need a Bearer token to query the API. Retrieve the token by using [ARMClient](https://github.com/projectkudu/ARMClient) and running the following commands.

```powershell
.\ARMClient.exe login
.\ARMClient.exe token <your-subscription-id>
```

After you get your bearer token, use the following script along with a tool like [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to query the API.

```http
@token = Bearer <Token received from ARMClient>
@subscription = <your-subscription-id>
@resourceGroup = <your-resource-group-name>
@namespaceName = <your-namespace-name>

###
GET https://management.azure.com/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.ServiceBus/namespaces/{{namespaceName}}?api-version=2022-01-01-preview
content-type: application/json
Authorization: {{token}}
```

The response looks like the following example, with the `minimumTlsVersion` set under the properties.

```json
{
  "sku": {
    "name": "Premium",
    "tier": "Premium"
  },
  "id": "/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group-name>/providers/Microsoft.ServiceBus/namespaces/<your-namespace-name>",
  "name": "<your-namespace-name>",
  "type": "Microsoft.ServiceBus/Namespaces",
  "location": "West Europe",
  "tags": {},
  "properties": {
    "minimumTlsVersion": "1.2",
    "publicNetworkAccess": "Enabled",
    "disableLocalAuth": false,
    "zoneRedundant": false,
    "provisioningState": "Succeeded",
    "status": "Active"
  }
}
```

## TLS version used by a client

To test that the minimum required TLS version for a Service Bus namespace blocks calls that use an older version, configure a client to use an older version of TLS. 

> [!NOTE]
> The runtime automatically uses the most recent TLS version available on the client application's host machine. Don't override this behavior. For more information, see [Select TLS version](/dotnet/core/extensions/sslstream-best-practices#select-tls-version).

When a client accesses a Service Bus namespace by using a TLS version that doesn't meet the minimum TLS version configured for the namespace, Azure Service Bus returns error code 401 (Unauthorized) and a message indicating that the TLS version isn't permitted for making requests against this Service Bus namespace.

> [!NOTE]
> When you configure a minimum TLS version for a Service Bus namespace, the application layer enforces that minimum version. Tools that attempt to determine TLS support at the protocol layer might return TLS versions in addition to the minimum required version when run directly against the Service Bus namespace endpoint.

## Next steps

For more information, see the following documentation:

- [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace](transport-layer-security-enforce-minimum-version.md)
- [Use Azure Policy to audit for compliance of minimum TLS version for a Service Bus namespace](transport-layer-security-audit-minimum-version.md)
