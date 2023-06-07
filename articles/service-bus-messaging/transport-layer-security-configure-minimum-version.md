---
title: Configure the minimum TLS version for a Service Bus namespace using ARM
titleSuffix: Service Bus
description: Configure an Azure Service Bus namespace to use a minimum version of Transport Layer Security (TLS).
services: service-bus
author: EldertGrootenboer

ms.service: service-bus-messaging
ms.custom: ignite-2022, devx-track-azurepowershell, devx-track-azurecli
ms.topic: article
ms.date: 09/26/2022
ms.author: egrootenboer
---

# Configure the minimum TLS version for a Service Bus namespace

Azure Service Bus namespaces permit clients to send and receive data with TLS 1.0 and above. To enforce stricter security measures, you can configure your Service Bus namespace to require that clients send and receive data with a newer version of TLS. If a Service Bus namespace requires a minimum version of TLS, then any requests made with an older version will fail. For conceptual information about this feature, see [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace](transport-layer-security-enforce-minimum-version.md).

You can configure the minimum TLS version using the Azure portal or Azure Resource Manager (ARM) template. 

## Specify the minimum TLS version in the Azure portal
You can specify the minimum TLS version when creating a Service Bus namespace in the Azure portal on the **Advanced** tab. 

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/create-namespace-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version when creating a namespace.":::

You can also specify the minimum TLS version for an existing namespace on the **Configuration** page.

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/existing-namespace-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version for an existing namespace.":::

## Use Azure CLI
To **create a namespace with minimum TLS version set to 1.2**, use the [`az servicebus namespace create`](/cli/azure/servicebus/namespace#az-servicebus-namespace-create) command with `--min-tls` set to `1.2`.

```azurecli-interactive
az servicebus namespace create \
    --name mynamespace \
    --resource-group myresourcegroup \
    --min-tls 1.2
```

## Use Azure PowerShell
To **create a namespace with minimum TLS version set to 1.2**, use the [`New-AzServiceBusNamespace`](/powershell/module/az.servicebus/new-azservicebusnamespace) command with `-MinimumTlsVersion` set to `1.2`. 

```azurepowershell-interactive
New-AzServiceBusNamespace `
    -ResourceGroup myresourcegroup `
    -Name mynamespace `
    -MinimumTlsVersion 1.2
```


## Create a template to configure the minimum TLS version
To configure the minimum TLS version for a Service Bus namespace, set the  `MinimumTlsVersion`  version property to 1.0, 1.1, or 1.2. When you create a Service Bus namespace with an Azure Resource Manager template, the `MinimumTlsVersion` property is set to 1.2 by default, unless explicitly set to another version.

> [!NOTE]
> Namespaces created using an api-version prior to 2022-01-01-preview will have 1.0 as the value for `MinimumTlsVersion`. This behavior was the prior default, and is still there for backwards compatibility.

The following steps describe how to create a template in the Azure portal.

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
            "serviceBusNamespaceName": "[concat(uniqueString(subscription().subscriptionId), 'tls')]"
        },
        "resources": [
            {
            "name": "[variables('serviceBusNamespaceName')]",
            "type": "Microsoft.ServiceBus/namespaces",
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
> After you update the minimum TLS version for the Service Bus namespace, it may take up to 30 seconds before the change is fully propagated.

Configuring the minimum TLS version requires api-version 2022-01-01-preview or later of the Azure Service Bus resource provider.

## Check the minimum required TLS version for a namespace

To check the minimum required TLS version for your Service Bus namespace, you can query the Azure Resource Manager API. You will need a Bearer token to query against the API, which you can retrieve using [ARMClient](https://github.com/projectkudu/ARMClient) by executing the following commands.

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
GET https://management.azure.com/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.ServiceBus/namespaces/{{namespaceName}}?api-version=2022-01-01-preview
content-type: application/json
Authorization: {{token}}
```

The response should look something like the below, with the minimumTlsVersion set under the properties.

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

## Test the minimum TLS version from a client

To test that the minimum required TLS version for a Service Bus namespace forbids calls made with an older version, you can configure a client to use an older version of TLS. For more information about configuring a client to use a specific version of TLS, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md).

When a client accesses a Service Bus namespace using a TLS version that does not meet the minimum TLS version configured for the namespace, Azure Service Bus returns error code 401 (Unauthorized) and a message indicating that the TLS version that was used is not permitted for making requests against this Service Bus namespace.

> [!NOTE]
> When you configure a minimum TLS version for a Service Bus namespace, that minimum version is enforced at the application layer. Tools that attempt to determine TLS support at the protocol layer may return TLS versions in addition to the minimum required version when run directly against the Service Bus namespace endpoint.

## Next steps

See the following documentation for more information.

- [Enforce a minimum required version of Transport Layer Security (TLS) for requests to a Service Bus namespace](transport-layer-security-enforce-minimum-version.md)
- [Configure Transport Layer Security (TLS) for a Service Bus client application](transport-layer-security-configure-client-version.md)
- [Use Azure Policy to audit for compliance of minimum TLS version for a Service Bus namespace](transport-layer-security-audit-minimum-version.md)
