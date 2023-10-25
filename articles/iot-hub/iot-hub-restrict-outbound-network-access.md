---
title: Restrict IoT Hub outbound network access and data loss prevention
description: This article describes how to configure IoT Hub to egress to trusted locations only.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 08/24/2021
ms.custom: ['Role: Cloud Development']
---

# Restrict outbound network access for Azure IoT Hub

IoT Hub supports data egress to other services through [routing to custom endpoints](iot-hub-devguide-messages-d2c.md), [file upload](iot-hub-devguide-file-upload.md), and [device identity export](iot-hub-bulk-identity-mgmt.md). For extra security in an enterprise environment, use the `restrictOutboundNetworkAccess` API to restrict an IoT hub egress to only explicitly approved destinations. Currently, this feature isn't available in Azure portal.

## Enabling the restriction

To enable the feature, use any method to update the IoT Hub resource properties (a `PUT`) to set the `restrictOutboundNetworkAccess` to `true` while including an `allowedFqdnList` containing Fully Qualified Domain Names (FQDNs) as an array. 

An example showing the JSON representation to use with the [create or update method](/rest/api/iothub/iothubresource/createorupdate):

```json
{
...
            "properties": {
              ...
                "restrictOutboundNetworkAccess": true,
                "allowedFqdnList": [
                    "my-eventhub.servicebus.windows.net",
                    "iothub-ns-built-in-endpoint-2917414-51ea2487eb.servicebus.windows.net"
                ]
              ...
            },
            "sku": {
                "name": "S1",
                "capacity": 1
            }
        }
    }
}
```
To make the same update using Azure CLI, run

```azurecli-interactive
az resource update -n <iothubName> -g <resourceGroupName> --resource-type Microsoft.Devices/IotHubs --set properties.restrictOutboundNetworkAccess=true properties.allowedFqdnList="['my-eventhub.servicebus.windows.net','iothub-ns-built-in-endpoint-2917414-51ea2487eb.servicebus.windows.net']"
```

## Restricting outbound network access with existing routes

Once `restrictOutboundNetworkAccess` is set to `true`, attempts to emit data to destinations outside of the allowed FQDNs fail. Even existing configured routes stop working if the custom endpoint isn't included in the allowed FQDN list.

## Built-in endpoint

If `restrictOutboundNetworkAccess` is set to `true`, the built-in event hub compatible endpoint isn't exempt for the restriction. In other words, you must include the built-in endpoint FQDN in the allowed FQDN list for it to continue to work.

## Next steps

- To use managed identity for data egress, see [IoT Hub support for managed identities](iot-hub-managed-identity.md).
- To restrict inbound network access, see [Managing public network access for your IoT hub](iot-hub-public-network-access.md) and [IoT Hub support for virtual networks with Private Link](virtual-network-support.md).