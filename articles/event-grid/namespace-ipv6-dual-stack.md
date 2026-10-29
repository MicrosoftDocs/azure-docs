---
title: Configure IPv6 dual-stack support for Azure Event Grid namespaces (preview)
description: Learn how to configure the preview of IPv4 and IPv6 dual-stack connectivity for Azure Event Grid namespace public endpoints.
author: Connected-Seth
ms.author: seshanmugam
ms.topic: how-to
ms.date: 10/13/2026
ms.custom: devx-track-arm-template, devx-track-bicep, devx-track-azurecli, devx-track-azurepowershell
ai-usage: ai-assisted
# Customer intent: As an Azure administrator, I want to enable IPv4 and IPv6 connectivity for an Event Grid namespace so that clients can use either protocol to connect to supported public endpoints.
---

# Configure IPv6 dual-stack support for Azure Event Grid namespaces (preview)

Azure Event Grid namespaces support IPv4 and IPv6 dual-stack connectivity during preview. After you enable dual stack, supported clients can use IPv4 or IPv6 to connect to supported namespace public endpoints.

> [!IMPORTANT]
> IPv6 dual-stack support for Azure Event Grid namespaces is currently in preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Supported scenarios

During preview, IPv6 dual-stack support applies to Event Grid namespaces. It supports the following scenarios:

- Create a new Event Grid namespace with dual stack enabled.
- Convert an existing IPv4 Event Grid namespace to dual stack.
- Configure IPv4 and IPv6 firewall rules.
- Publish events to namespace topics over IPv4 or IPv6.
- Receive events by using pull delivery over IPv4 or IPv6.
- Connect supported MQTT clients to the public MQTT broker endpoint over IPv4 or IPv6.
- Continue using existing IPv4 clients after dual stack is enabled.

## How dual-stack connectivity works during preview

The available network protocol preferences are:

- **IPv4**: The default for a namespace that isn't enabled for dual stack.
- **Dual stack**: Enables supported public endpoints to accept IPv4 and IPv6 connections.

Enabling dual stack doesn't require existing IPv4 clients to migrate to IPv6. Whether a client uses IPv4 or IPv6 depends on the client's capabilities and networking environment.

## Prerequisites

Before you begin, you need:

- An Azure subscription.
- Permission to create or update an Event Grid namespace.
- An IPv6-capable client and network environment if you plan to validate IPv6 connectivity.
- An Event Grid namespace without a private endpoint if you plan to convert an existing namespace to dual stack.

## Supported public endpoints

During preview, IPv6 dual-stack support applies to the following public endpoints:

- Namespace topic publish endpoints.
- Pull delivery endpoints.
- MQTT broker endpoints.

Using IPv6 doesn't change the application-layer authentication, authorization, or Transport Layer Security (TLS) requirements for these endpoints.

> [!WARNING]
> During preview, IPv6 dual-stack support is available only for public endpoints. Private endpoints aren't supported with dual-stack-enabled Event Grid namespaces. You can't enable dual stack on a namespace that has a private endpoint, and you can't create a private endpoint for a dual-stack-enabled namespace. If you require private endpoint connectivity, keep the namespace **Network protocol preference** set to **IPv4**.

## Create a dual-stack Event Grid namespace (preview)

To create an Event Grid namespace with dual stack enabled:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Event Grid Namespaces**, and then select **Event Grid Namespaces** from the results.
1. On the **Event Grid Namespaces** page, select **Create**.
1. On the **Basics** page, configure the required namespace settings.
1. Select **Next: Networking**.
1. On the **Networking** page, locate **Network protocol preference**.
1. Select **Dual stack**.

    :::image type="content" source="media/namespace-ipv6-dual-stack/create-namespace-dual-stack.png" alt-text="Screenshot of the Azure portal Networking configuration for a new Event Grid namespace with Dual stack selected." lightbox="media/namespace-ipv6-dual-stack/create-namespace-dual-stack.png":::

1. Configure public network access.
1. Configure IPv4 and IPv6 firewall rules if you need to restrict public access.
1. Continue through the remaining namespace configuration, and then select **Review + create**.
1. Review the configuration, and then select **Create**.

### Create-flow example

Suppose a manufacturing solution uses the namespace `contoso-manufacturing-ns`. Existing applications use IPv4, while newer clients and devices can use IPv6. The administrator creates the namespace with **Dual stack** selected. Existing applications continue to connect over IPv4, and IPv6-capable clients can connect over IPv6 to supported namespace public endpoints.

## Convert an existing namespace to dual stack (preview)

The namespace can't have a private endpoint before you enable dual stack.

1. In the [Azure portal](https://portal.azure.com), open your existing Event Grid namespace.
1. On the namespace menu, select **Networking**.
1. Locate **Network protocol preference**.
1. Change the setting from **IPv4** to **Dual stack**.

    :::image type="content" source="media/namespace-ipv6-dual-stack/update-namespace-dual-stack.png" alt-text="Screenshot of the Azure portal network protocol preference for an existing Event Grid namespace with Dual stack selected." lightbox="media/namespace-ipv6-dual-stack/update-namespace-dual-stack.png":::

1. Review the public network access settings.
1. Add IPv6 firewall rules for clients that require IPv6 access.
1. Select **Save**.
1. Confirm that the update finishes successfully.

### Update-flow example

Suppose an organization has an IPv4 namespace named `contoso-events-ns`. The administrator opens **Networking**, changes **Network protocol preference** to **Dual stack**, adds the required IPv6 firewall rules, and saves the configuration. Existing IPv4 clients continue to connect, while approved IPv6 clients can connect through supported namespace public endpoints. This scenario assumes that the namespace doesn't have a private endpoint.

## Configure dual stack programmatically (preview)

The `2026-06-15-preview` management API adds the `properties.ipAddressType` property for Event Grid namespaces. Set the property to:

- `IPv4` to support only IPv4 addresses.
- `DualStack` to support both IPv4 and IPv6 addresses.

> [!IMPORTANT]
> Before you set `ipAddressType` to `DualStack`, ensure that the namespace doesn't have a private endpoint. During preview, you can't use private endpoints and dual-stack connectivity together.

> [!NOTE]
> The current `az eventgrid namespace` commands and `Az.EventGrid` cmdlets don't expose a dedicated parameter for `ipAddressType`. The following Azure CLI and Azure PowerShell examples call the management REST API. SDK-specific examples aren't included because the currently published Event Grid management SDK models don't expose this preview property.

### Create a namespace by using Bicep or an ARM template

The following examples create a Standard namespace with dual stack enabled.

# [Bicep](#tab/bicep)

```bicep
param namespaceName string
param location string = resourceGroup().location

resource eventGridNamespace 'Microsoft.EventGrid/namespaces@2026-06-15-preview' = {
  name: namespaceName
  location: location
  sku: {
    name: 'Standard'
    capacity: 1
  }
  properties: {
    ipAddressType: 'DualStack'
    isZoneRedundant: false
    publicNetworkAccess: 'Enabled'
  }
}
```

# [ARM template](#tab/arm-template)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "namespaceName": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.EventGrid/namespaces",
      "apiVersion": "2026-06-15-preview",
      "name": "[parameters('namespaceName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard",
        "capacity": 1
      },
      "properties": {
        "ipAddressType": "DualStack",
        "isZoneRedundant": false,
        "publicNetworkAccess": "Enabled"
      }
    }
  ]
}
```

---

If you deploy either example over an existing namespace, include the complete desired configuration for that namespace so that you don't unintentionally change other settings.

### Create a namespace by using the REST API

Use a `PUT` request to create a namespace with dual stack enabled:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventGrid/namespaces/{namespaceName}?api-version=2026-06-15-preview
```

Request body:

```json
{
  "location": "eastus",
  "sku": {
    "name": "Standard",
    "capacity": 1
  },
  "properties": {
    "ipAddressType": "DualStack",
    "isZoneRedundant": false,
    "publicNetworkAccess": "Enabled"
  }
}
```

### Update an existing namespace

Use a `PATCH` request to change an existing namespace from IPv4 to dual stack. Replace the placeholders before you run an example.

# [REST](#tab/rest)

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventGrid/namespaces/{namespaceName}?api-version=2026-06-15-preview
Content-Type: application/json

{
  "properties": {
    "ipAddressType": "DualStack"
  }
}
```

# [Azure CLI](#tab/azure-cli)

```azurecli
subscriptionId=$(az account show --query id --output tsv)
resourceId="/subscriptions/${subscriptionId}/resourceGroups/<resource-group-name>/providers/Microsoft.EventGrid/namespaces/<namespace-name>"

az rest \
  --method patch \
  --url "${resourceId}?api-version=2026-06-15-preview" \
  --body '{"properties":{"ipAddressType":"DualStack"}}'
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$subscriptionId = (Get-AzContext).Subscription.Id
$resourceId = "/subscriptions/$subscriptionId/resourceGroups/<resource-group-name>/providers/Microsoft.EventGrid/namespaces/<namespace-name>"
$payload = @{
    properties = @{
        ipAddressType = "DualStack"
    }
} | ConvertTo-Json -Depth 3

Invoke-AzRestMethod `
    -Method PATCH `
    -Path "$resourceId`?api-version=2026-06-15-preview" `
    -Payload $payload
```

---

The update can return an asynchronous operation. Wait for the operation to finish before you validate connectivity or make another networking change.

### Verify the configuration

Retrieve the namespace by using the same preview API version:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.EventGrid/namespaces/{namespaceName}?api-version=2026-06-15-preview
```

Confirm that the response contains the following values:

```json
{
  "properties": {
    "provisioningState": "Succeeded",
    "ipAddressType": "DualStack"
  }
}
```

## Configure IPv4 and IPv6 firewall rules during preview

During preview, a dual-stack Event Grid namespace supports IPv4 and IPv6 firewall rules. Configure the address ranges independently:

- An IPv4 firewall rule doesn't authorize an IPv6 client address.
- An IPv6 firewall rule doesn't authorize an IPv4 client address.
- Configure a rule for each client protocol that you intend to permit.

For configuration steps, see [Configure IP firewall for Azure Event Grid namespaces](configure-firewall-namespaces.md).

### Firewall example

Suppose an existing IPv4 client is allowed by an IPv4 firewall rule. A new IPv6 client requires a separate IPv6 firewall rule. The IPv4 rule doesn't grant access to the IPv6 client, and the IPv6 rule doesn't grant access to the IPv4 client.

## Publish and receive events

After you enable dual stack, supported clients can use IPv4 or IPv6 to:

- [Publish events to namespace topics](publish-events-namespace-topics-portal.md).
- [Receive events by using pull delivery](pull-delivery-overview.md).

The network protocol doesn't change the normal authentication, authorization, TLS, event format, or operation requirements.

## Connect MQTT clients

During preview, supported MQTT clients can connect to the public MQTT broker endpoint of a dual-stack-enabled Event Grid namespace over IPv4 or IPv6. Existing IPv4 MQTT clients can continue to operate after you enable dual stack.

Using IPv6 doesn't change:

- [MQTT protocol and TLS requirements](mqtt-support.md).
- [MQTT client authentication](mqtt-client-authentication.md).
- [MQTT access control](mqtt-access-control.md).
- Client groups, topic spaces, or permission bindings.

For more information, see [Overview of the MQTT broker feature in Azure Event Grid](mqtt-overview.md).

## Validate IPv6 connectivity

Use the following checklist to validate connectivity from the intended client environment:

- Confirm that the namespace is configured for **Dual stack**.
- Confirm that the namespace doesn't have a private endpoint.
- Confirm that the client environment supports IPv6.
- Confirm that the namespace endpoint is reachable over IPv6.
- Confirm that an applicable IPv6 firewall rule allows the client.
- Confirm that the client can establish a TLS connection.
- Confirm that the client can authenticate.
- Confirm that the intended Event Grid operation succeeds.

For MQTT, validation can include connecting, publishing, and subscribing. For namespace topics and pull delivery, validation can include publishing and receiving events.

## Considerations and limitations

- The feature is in preview.
- The preview applies to supported public endpoints.
- Private endpoints aren't supported with dual-stack-enabled namespaces during preview.
- IPv4 remains available after you enable dual stack.
- IPv4 and IPv6 firewall rules are configured independently.
- The client networking environment must support IPv6 to use IPv6 connectivity.
- Existing authentication, authorization, and TLS requirements continue to apply.
- Push delivery over IPv6 isn't included in this preview documentation.
- IPv6-only mode isn't part of this preview documentation.

## Related content

- [Create, view, and manage Event Grid namespaces](create-view-manage-namespaces.md)
- [Configure IP firewall for Event Grid namespaces](configure-firewall-namespaces.md)
- [Configure private endpoints for Event Grid namespaces](configure-private-endpoints-pull.md)
- [Publish events to namespace topics](publish-events-namespace-topics-portal.md)
- [Pull delivery with HTTP](pull-delivery-overview.md)
- [Overview of the MQTT broker feature](mqtt-overview.md)
- [MQTT features supported by the MQTT broker](mqtt-support.md)
- [MQTT client authentication](mqtt-client-authentication.md)
- [Access control for MQTT clients](mqtt-access-control.md)
