---
title: Azure IoT Hub IP connection filters | Microsoft Docs
description: How to use IP filtering to block connections from specific IP addresses for to your Azure IoT hub. You can block connections from individual or ranges of IP addresses.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 05/25/2020
ms.author: robinsh
---

# Use IP filters

Security is an important aspect of any IoT solution based on Azure IoT Hub. Sometimes you need to explicitly specify the IP addresses from which devices can connect as part of your security configuration. The *IP filter* feature enables you to configure rules for rejecting or accepting traffic from specific IPv4 addresses.

## When to use

There are two specific use-cases when it is useful to block the IoT Hub endpoints for certain IP addresses:

* Your IoT hub should receive traffic only from a specified range of IP addresses and reject everything else. For example, you are using your IoT hub with [Azure Express Route](https://azure.microsoft.com/documentation/articles/expressroute-faqs/#supported-services) to create private connections between an IoT hub and your on-premises infrastructure.

* You need to reject traffic from IP addresses that have been identified as suspicious by the IoT hub administrator.

## How filter rules are applied

The IP filter rules are applied at the IoT Hub service level. Therefore, the IP filter rules apply to all connections from devices and back-end apps using any supported protocol. However,  clients reading directly from the [built-in Event Hub compatible endpoint](iot-hub-devguide-messages-read-builtin.md) (not via the IoT Hub connection string) are not bound to the IP filter rules. 

Any connection attempt from an IP address that matches a rejecting IP rule in your IoT hub receives an unauthorized 401 status code and description. The response message does not mention the IP rule. Rejecting IP addresses can prevent other Azure services such as Azure Stream Analytics, Azure Virtual Machines, or the Device Explorer in Azure portal from interacting with the IoT hub.

> [!NOTE]
> If you must use Azure Stream Analytics (ASA) to read messages from an IoT hub with IP filter enabled, use the event hub-compatible name and endpoint of your IoT hub to manually add an [Event Hubs stream input](../stream-analytics/stream-analytics-define-inputs.md#stream-data-from-event-hubs) in the ASA.

## Default setting

By default, the **IP Filter** grid in the portal for an IoT hub is empty. This default setting means that your hub accepts connections from any IP address. This default setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range.

To get to the IP Filter settings page, select **Networking**, **Public access**, then choose **Selected IP Ranges**:

:::image type="content" source="media/iot-hub-ip-filtering/ip-filter-default.png" alt-text="IoT Hub default IP filter settings":::

## Add or edit an IP filter rule

To add an IP filter rule, select **+ Add IP Filter Rule**.

:::image type="content" source="./media/iot-hub-ip-filtering/ip-filter-add-rule.png" alt-text="Add an IP filter rule to an IoT hub":::

After selecting **Add IP Filter Rule**, fill in the fields.

:::image type="content" source="./media/iot-hub-ip-filtering/ip-filter-after-selecting-add.png" alt-text="After selecting Add an IP Filter rule":::

* Provide a **name** for the IP Filter rule. This must be a unique, case-insensitive, alphanumeric string up to 128 characters long. Only the ASCII 7-bit alphanumeric characters plus `{'-', ':', '/', '\', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '''}` are accepted.

* Provide a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 192.168.100.0/22 represents the 1024 IPv4 addresses from 192.168.100.0 to 192.168.103.255.

* Select **Allow** or **Block** as the **action** for the IP filter rule.

After filling in the fields, select **Save** to save the rule. You see an alert notifying you that the update is in progress.

:::image type="content" source="./media/iot-hub-ip-filtering/ip-filter-save-new-rule.png" alt-text="Notification about saving an IP filter rule":::

The **Add** option is disabled when you reach the maximum of 10 IP filter rules.

To edit an existing rule, select the data you want to change, make the change, then select **Save** to save your edit.

## Delete an IP filter rule

To delete an IP filter rule, select the trash can icon on that row and then select **Save**. The rule is removed and the change is saved.

:::image type="content" source="./media/iot-hub-ip-filtering/ip-filter-delete-rule.png" alt-text="Delete an IoT Hub IP filter rule":::

## Retrieve and update IP filters using Azure CLI

Your IoT Hub's IP filters can be retrieved and updated through [Azure  CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).

To retrieve current IP filters of your IoT Hub, run:

```azurecli-interactive
az resource show -n <iothubName> -g <resourceGroupName> --resource-type Microsoft.Devices/IotHubs
```

This will return a JSON object where your existing IP filters are listed under the `properties.ipFilterRules` key:

```json
{
...
    "properties": {
        "ipFilterRules": [
        {
            "action": "Reject",
            "filterName": "MaliciousIP",
            "ipMask": "6.6.6.6/6"
        },
        {
            "action": "Allow",
            "filterName": "GoodIP",
            "ipMask": "131.107.160.200"
        },
        ...
        ],
    },
...
}
```

To add a new IP filter for your IoT Hub, run:

```azurecli-interactive
az resource update -n <iothubName> -g <resourceGroupName> --resource-type Microsoft.Devices/IotHubs --add properties.ipFilterRules "{\"action\":\"Reject\",\"filterName\":\"MaliciousIP\",\"ipMask\":\"6.6.6.6/6\"}"
```

To remove an existing IP filter in your IoT Hub, run:

```azurecli-interactive
az resource update -n <iothubName> -g <resourceGroupName> --resource-type Microsoft.Devices/IotHubs --add properties.ipFilterRules <ipFilterIndexToRemove>
```

Note that `<ipFilterIndexToRemove>` must correspond to the ordering of IP filters in your IoT Hub's `properties.ipFilterRules`.

## Retrieve and update IP filters using Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Your IoT Hub's IP filters can be retrieved and set through [Azure PowerShell](/powershell/azure/overview).

```powershell
# Get your IoT Hub resource using its name and its resource group name
$iothubResource = Get-AzResource -ResourceGroupName <resourceGroupNmae> -ResourceName <iotHubName> -ExpandProperties

# Access existing IP filter rules
$iothubResource.Properties.ipFilterRules |% { Write-host $_ }

# Construct a new IP filter
$filter = @{'filterName'='MaliciousIP'; 'action'='Reject'; 'ipMask'='6.6.6.6/6'}

# Add your new IP filter rule
$iothubResource.Properties.ipFilterRules += $filter

# Remove an existing IP filter rule using its name, e.g., 'GoodIP'
$iothubResource.Properties.ipFilterRules = @($iothubResource.Properties.ipFilterRules | Where 'filterName' -ne 'GoodIP')

# Update your IoT Hub resource with your updated IP filters
$iothubResource | Set-AzResource -Force
```

## Update IP filter rules using REST

You may also retrieve and modify your IoT Hub's IP filter using Azure resource Provider's REST endpoint. See `properties.ipFilterRules` in [createorupdate method](https://docs.microsoft.com/rest/api/iothub/iothubresource/createorupdate).

## IP filter rule evaluation

IP filter rules are applied in order and the first rule that matches the IP address determines the accept or reject action.

For example, if you want to accept addresses in the range 192.168.100.0/22 and reject everything else, the first rule in the grid should accept the address range 192.168.100.0/22. The next rule should reject all addresses by using the range 0.0.0.0/0.

You can change the order of your IP filter rules in the grid by clicking the three vertical dots at the start of a row and using drag and drop.

To save your new IP filter rule order, click **Save**.

:::image type="content" source="media/iot-hub-ip-filtering/ip-filter-rule-order.png" alt-text="Change the order of your IoT HUb IP filter rules":::

## Next steps

To further explore the capabilities of IoT Hub, see:

* [IoT Hub metrics](iot-hub-metrics.md)
