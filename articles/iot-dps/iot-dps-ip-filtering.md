---
title: Microsoft Azure IoT DPS IP connection filters
description: How to use IP filtering to block connections from specific IP addresses to your Azure IoT DPS instance. 
author: kgremban
ms.author: kgremban
ms.service: iot-dps
ms.custom: devx-track-arm-template
services: iot-dps
ms.topic: how-to
ms.date: 11/12/2021
---

# Use Azure IoT DPS IP connection filters

Security is an important aspect of any IoT solution. Sometimes you need to explicitly specify the IP addresses from which devices can connect as part of your security configuration. The *IP filter* feature for an Azure IoT Hub Device Provisioning Service (DPS) enables you to configure rules for rejecting or accepting traffic from specific IPv4 addresses.

## When to use

There are two specific use-cases where it is useful to block connections to a DPS endpoint from certain IP addresses:

* Your DPS should receive traffic only from a specified range of IP addresses and reject everything else. For example, you are using your DPS with [Azure Express Route](../expressroute/expressroute-faqs.md#supported-services) to create private connections between a DPS instance and your devices.

* You need to reject traffic from IP addresses that have been identified as suspicious by the DPS administrator.

## IP filter rules limitations

Note the following limitations if IP filtering is enabled:

* You might not be able to use the Azure portal to manage enrollments. If this occurs, you can add the IP address of one or more machines to the `ipFilterRules` and manage enrollments in the DPS instance from those machines with Azure CLI, PowerShell, or service APIs.

  This scenario is most likely to happen when you want to use IP filtering to allow access only to selected IP addresses. In this case, you configure rules to enable certain addresses or address ranges and a default rule that blocks all other addresses (0.0.0.0/0). This default rule will block Azure portal from performing operations like managing enrollments on the DPS instance. For more information, see [IP filter rule evaluation](iot-dps-ip-filtering.md#ip-filter-rule-evaluation) later in this article.

## How filter rules are applied

The IP filter rules are applied at the DPS instance level. Therefore the IP filter rules apply to all connections from devices and back-end apps using any supported protocol.

Any connection attempt from an IP address that matches a rejecting IP rule in your DPS instance receives an unauthorized 401 status code and description. The response message does not mention the IP rule.

> [!IMPORTANT]
> Rejecting IP addresses can prevent other Azure Services from interacting with the DPS instance.

## Default setting

By default, IP filtering is disabled and **Public network access** is set to *All networks*. This default setting means that your DPS accepts connections from any IP address, or conforms to a rule that accepts the 0.0.0.0/0 IP address range.

:::image type="content" source="./media/iot-dps-ip-filtering/ip-filter-default.png" alt-text="IoT DPS default IP filter settings.":::

## Add an IP filter rule

To add an IP filter rule:

1. Go to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select your Device Provisioning Service.

4. In the **Settings** menu on the left-side, select *Networking*.

5. Under **Public network access**, select *Selected IP ranges*

6. Select **+ Add IP Filter Rule**.

    :::image type="content" source="./media/iot-dps-ip-filtering/ip-filter-add-rule.png" alt-text="Add an IP filter rule to an IoT DPS.":::

7. Fill in the following fields:

    | Field | Description|
    |-------|------------|
    | **Name** |A unique, case-insensitive, alphanumeric string up to 128 characters long. Only the ASCII 7-bit alphanumeric characters plus `{'-', ':', '/', '\', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '''}` are accepted.|
    | **Address Range** |A single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 192.168.100.0/22 represents the 1024 IPv4 addresses from 192.168.100.0 to 192.168.103.255.|
    | **Action** |Select either **Allow** or **Block**.|

    :::image type="content" source="./media/iot-dps-ip-filtering/ip-filter-after-selecting-add.png" alt-text="After selecting Add an IP Filter rule.":::

8. Select **Save**. You should see an alert notifying you that the update is in progress.

    :::image type="content" source="./media/iot-dps-ip-filtering/ip-filter-save-new-rule.png" alt-text="Notification about saving an IP filter rule.":::

    >[!Note]
    > **+ Add IP Filter Rule** is disabled when you reach the maximum of 100 IP filter rules.

## Edit an IP filter rule

To edit an existing rule:

1. Select the IP filter rule data you want to change.

    :::image type="content" source="./media/iot-dps-ip-filtering/ip-filter-rule-edit.png" alt-text="Edit an IP filter rule.":::

2. Make the change.

3. Select **Save** .

## Delete an IP filter rule

To delete an IP filter rule:

1. Select the delete icon on the row of the IP rule you wish to delete.

    :::image type="content" source="./media/iot-dps-ip-filtering/ip-filter-delete-rule.png" alt-text="Delete an IoT DPS IP filter rule.":::

2. Select **Save**.

## IP filter rule evaluation

IP filter rules are applied in order. The first rule that matches the IP address determines the accept or reject action.

For example, if you want to accept addresses in the range 192.168.100.0/22 and reject everything else, the first rule in the grid should accept the address range 192.168.100.0/22. The next rule should reject all addresses by using the range 0.0.0.0/0.

To change the order of your IP filter rules:

1. Select the rule you want to move.

2. Drag and drop the rule to the desired location.

3. Select **Save**.

## Update IP filter rules using Azure Resource Manager templates

There are two ways you can update your DPS IP filter:

1. Call the IoT Hub Resource REST API method. To learn how to update your IP filter rules using REST,  see `IpFilterRule` in the [Definitions section](/rest/api/iothub/iot-hub-resource/update#definitions) of the [Iot Hub Resource - Update method](/rest/api/iothub/iot-hub-resource/update).

2. Use the Azure Resource Manager templates. For guidance on how to use the Resource Manager templates, see [Azure Resource Manager templates](../azure-resource-manager/templates/overview.md). The examples that follow show you how to create, edit, and delete DPS IP filter rules with Azure Resource Manager templates.

    >[!NOTE]
    >Azure CLI and Azure PowerShell don't currently support DPS IP filter rules updates.

### Add an IP filter rule

The following template example creates a new IP filter rule named "AllowAll" that accepts all traffic.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#", 
    "contentVersion": "1.0.0.0", 
    "parameters": {
        "iotDpsName": {
            "type": "string",
            "defaultValue": "[resourceGroup().name]",
            "minLength": 3,
            "metadata": {
                "description": "Specifies the name of the IoT DPS service."
            }
        }, 
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for Iot DPS resource."
            }
        }        
    }, 
    "variables": {
        "iotDpsApiVersion": "2020-01-01"
    }, 
    "resources": [
        {
            "type": "Microsoft.Devices/provisioningServices",
            "apiVersion": "[variables('iotDpsApiVersion')]",
            "name": "[parameters('iotDpsName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "S1",
                "tier": "Standard",
                "capacity": 1
            },
            "properties": {
                "IpFilterRules": [
                    {
                        "FilterName": "AllowAll",
                        "Action": "Accept",
                        "ipMask": "0.0.0.0/0"
                    }
                ]
            }            
        }
    ]
}
```

Update the IP filter rule attributes of the template based on your requirements.

| Attribute                | Description |
| ------------------------ | ----------- |
| **FilterName**           | Provide a name for the IP Filter rule. This must be a unique, case-insensitive, alphanumeric string up to 128 characters long. Only the ASCII 7-bit alphanumeric characters plus `{'-', ':', '/', '\', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '''}` are accepted. |
| **Action**               | Accepted values are **Accept** or **Reject** as the action for the IP filter rule. |
| **ipMask**               | Provide a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 192.168.100.0/22 represents the 1024 IPv4 addresses from 192.168.100.0 to 192.168.103.255. |


### Update an IP filter rule

The following template example updates the IP filter rule named "AllowAll", shown previously, to reject all traffic.

```json
{ 
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",  
    "contentVersion": "1.0.0.0",  
    "parameters": { 
        "iotDpsName": { 
            "type": "string", 
            "defaultValue": "[resourceGroup().name]", 
            "minLength": 3, 
            "metadata": { 
                "description": "Specifies the name of the IoT DPS service." 
            } 
        },  
        "location": { 
            "type": "string", 
            "defaultValue": "[resourceGroup().location]", 
            "metadata": { 
                "description": "Location for Iot DPS resource." 
            } 
        }        
    },  
    "variables": { 
        "iotDpsApiVersion": "2020-01-01" 
    },  
    "resources": [ 
        { 
            "type": "Microsoft.Devices/provisioningServices", 
            "apiVersion": "[variables('iotDpsApiVersion')]", 
            "name": "[parameters('iotDpsName')]", 
            "location": "[parameters('location')]", 
            "sku": { 
                "name": "S1", 
                "tier": "Standard", 
                "capacity": 1 
            }, 
            "properties": { 
                "IpFilterRules": [ 
                    { 
                        "FilterName": "AllowAll", 
                        "Action": "Reject", 
                        "ipMask": "0.0.0.0/0" 
                    } 
                ] 
            }             
        } 
    ] 
}
```

### Delete an IP filter rule

The following template example deletes all IP filter rules for the DPS instance.

```json
{ 
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",  
    "contentVersion": "1.0.0.0",  
    "parameters": { 
        "iotDpsName": { 
            "type": "string", 
            "defaultValue": "[resourceGroup().name]", 
            "minLength": 3, 
            "metadata": { 
                "description": "Specifies the name of the IoT DPS service." 
            } 
        },  
        "location": { 
            "type": "string", 
            "defaultValue": "[resourceGroup().location]", 
            "metadata": { 
                "description": "Location for Iot DPS resource." 
            } 
        }        
    },  
    "variables": { 
        "iotDpsApiVersion": "2020-01-01" 
    },  
    "resources": [ 
        { 
            "type": "Microsoft.Devices/provisioningServices", 
            "apiVersion": "[variables('iotDpsApiVersion')]", 
            "name": "[parameters('iotDpsName')]", 
            "location": "[parameters('location')]", 
            "sku": { 
                "name": "S1", 
                "tier": "Standard", 
                "capacity": 1 
            }, 
            "properties": { 
            }             
        } 
    ] 
}
```

## Next steps

To further explore the managing DPS, see:

* [Understanding IoT DPS IP addresses](iot-dps-understand-ip-address.md)
* [Set up DPS using the Azure CLI](quick-setup-auto-provision-cli.md)
* [Control access to DPS](how-to-control-access.md)
