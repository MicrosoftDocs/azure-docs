---
title: Azure IoT Hub classic IP filter (deprecated)
description: How to upgrade from classic IP filter and what are the benefits
author: kgremban

ms.author: kgremban 
ms.service: iot-hub
ms.topic: upgrade-and-migration-article
ms.date: 10/16/2020
---

# IoT Hub classic IP filter and how to upgrade 

The upgraded IP filter for IoT Hub protects the built-in endpoint and is secure by default. While we strive to never make breaking changes, the enhanced security model of the upgraded IP filter is incompatible with classic IP filter, so we announce its retirement. To learn more about the new upgraded IP filter, see [What's new](#whats-new) and [IoT hub IP filters](iot-hub-ip-filtering.md).

To avoid service disruption, you must perform the guided upgrade before the migration deadline, at which point the upgrade will be performed automatically. To learn more about the migration timeline, see [Azure update](https://aka.ms/ipfilterv2azupdate).

## How to upgrade

1.	Visit Azure portal
2.	Navigate to your IoT hub.
3.	Select **Networking** from the left-side menu.
4.	You should see a banner prompting you to upgrade your IP Filter to the new model. Select **Yes** to continue.
    :::image type="content" source="media/iot-hub-ip-filter-classic/ip-filter-upgrade-banner.png" alt-text="Image showing the banner prompt to upgrade from classic IP filter":::
5.	Since the new IP Filter blocks all IP by default, the upgrade removes your individual deny rules but gives you a chance to review them before saving. Carefully review the rules to make sure they work for you.
6.	Follow prompts to finish upgrading.

## What's new

### Secure by default

Classic IP filter implicitly allows all IP addresses to connect to the IoT Hub by default, which doesn't align well with the most common network security scenarios. Typically, you would want only trusted IP addresses to be able to connect to your IoT hub and reject everything else. To achieve this goal with classic IP filter, it's a multi-step process. For example, if you want to only accept traffic from `192.168.100.0/22`, you must

1. Configure a single *allow* rule for `192.168.100.0/22`.
1. Configure a different *block* rule for `0.0.0.0/0` (the "block all" rule)
1. Make sure the rules are ordered correctly, with the allow rule ordered above the block rule.

In practice, this multi-step process causes confusion. Users didn't configure the "block all" rule or didn't order the rules correctly, resulting in unintended exposure. 

The new IP filter blocks all IP addresses by default. Only the IP ranges that you explicitly add are allowed to connect to IoT Hub. In the above example, steps 2 and 3 aren't needed anymore. This new behavior simplifies configuration and abides by the [secure by default principle](https://wikipedia.org/wiki/Secure_by_default).

### Protect the built-in Event Hub compatible endpoint

Classic IP filter cannot be applied to the built-in endpoint. This limitation means that, event with a block all rule (block `0.0.0.0/0`) configured, the built-in endpoint is still accessible from any IP address.

The new IP filter provides an option to apply rules to the built-in endpoint, which reduces exposure to network security threats.

:::image type="content" source="media/iot-hub-ip-filter-classic/ip-filter-built-in-endpoint.png" alt-text="Image showing the toggle to apply to the built-in endpoint or not":::

> [!NOTE]
> This option isn't available to free (F1) IoT hubs. To apply IP filter rules to the built-in endpoint, use a paid IoT hub.

### API impact

The upgraded IP filter is available in IoT Hub resource API from `2020-08-31` (as well as `2020-08-31-preview`) and onwards. Classic IP filter is still available in all API versions, but will be removed in a future API version near the migration deadline. To learn more about the migration timeline, see [Azure update](https://aka.ms/ipfilterv2azupdate).

## Tip: try the changes before they apply

Since the new IP filter blocks all IP address by default, individual block rules are no longer compatible. So, the guided upgrade process removes these individual block rules. 

To try to the change in with classic IP filter:

1. Visit the **Networking** tab in your IoT hub
1. Note down your existing IP filter (classic) configuration, in case you want to roll back
1. Next to rules with **Block**, Select the trash icon to remove them
1. Add another rule at the bottom with `0.0.0.0/0`, and choose **Block**
1. Select **Save**

This configuration mimics how the new IP filter behaves after upgrading from classic. One exception is the built-in endpoint protection, which is not possible to try using classic IP filter. However, that feature is optional, so you don't have to use it if you think it might break something.

## Tip: check diagnostic logs for all IP connections to your IoT hub

To ensure a smooth transition, check your diagnostic logs under the Connections category. Look for the `maskedIpAddress` property to see if the ranges are as you expect. Remember: the new IP filter will block all IP addresses that haven't been explicitly added.

## IoT Hub classic IP filter documentation (retired)

> [!IMPORTANT]
> Below is the original documentation for classic IP filter, which is being retired.

Security is an important aspect of any IoT solution based on Azure IoT Hub. Sometimes you need to explicitly specify the IP addresses from which devices can connect as part of your security configuration. The *IP filter* feature enables you to configure rules for rejecting or accepting traffic from specific IPv4 addresses.

### When to use

There are two specific use-cases when it is useful to block the IoT Hub endpoints for certain IP addresses:

* Your IoT hub should receive traffic only from a specified range of IP addresses and reject everything else. For example, you are using your IoT hub with [Azure Express Route](../expressroute/expressroute-faqs.md#supported-services) to create private connections between an IoT hub and your on-premises infrastructure.

* You need to reject traffic from IP addresses that have been identified as suspicious by the IoT hub administrator.

### How filter rules are applied

The IP filter rules are applied at the IoT Hub service level. Therefore, the IP filter rules apply to all connections from devices and back-end apps using any supported protocol. However,  clients reading directly from the [built-in Event Hub compatible endpoint](iot-hub-devguide-messages-read-builtin.md) (not via the IoT Hub connection string) are not bound to the IP filter rules. 

Any connection attempt from an IP address that matches a rejecting IP rule in your IoT hub receives an unauthorized 401 status code and description. The response message does not mention the IP rule. Rejecting IP addresses can prevent other Azure services such as Azure Stream Analytics, Azure Virtual Machines, or the Device Explorer in Azure portal from interacting with the IoT hub.

> [!NOTE]
> If you must use Azure Stream Analytics (ASA) to read messages from an IoT hub with IP filter enabled, use the event hub-compatible name and endpoint of your IoT hub to manually add an [Event Hubs stream input](../stream-analytics/stream-analytics-define-inputs.md#stream-data-from-event-hubs) in the ASA.

### Default setting

By default, the **IP Filter** grid in the portal for an IoT hub is empty. This default setting means that your hub accepts connections from any IP address. This default setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range.

To get to the IP Filter settings page, select **Networking**, **Public access**, then choose **Selected IP Ranges**:

:::image type="content" source="media/iot-hub-ip-filter-classic/ip-filter-default.png" alt-text="IoT Hub default IP filter settings":::

### Add or edit an IP filter rule

To add an IP filter rule, select **+ Add IP Filter Rule**.

:::image type="content" source="./media/iot-hub-ip-filter-classic/ip-filter-add-rule.png" alt-text="Add an IP filter rule to an IoT hub":::

After selecting **Add IP Filter Rule**, fill in the fields.

:::image type="content" source="./media/iot-hub-ip-filter-classic/ip-filter-after-selecting-add.png" alt-text="After selecting Add an IP Filter rule":::

* Provide a **name** for the IP Filter rule. This must be a unique, case-insensitive, alphanumeric string up to 128 characters long. Only the ASCII 7-bit alphanumeric characters plus `{'-', ':', '/', '\', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '''}` are accepted.

* Provide a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 192.168.100.0/22 represents the 1024 IPv4 addresses from 192.168.100.0 to 192.168.103.255.

* Select **Allow** or **Block** as the **action** for the IP filter rule.

After filling in the fields, select **Save** to save the rule. You see an alert notifying you that the update is in progress.

:::image type="content" source="./media/iot-hub-ip-filter-classic/ip-filter-save-new-rule.png" alt-text="Notification about saving an IP filter rule":::

The **Add** option is disabled when you reach the maximum of 10 IP filter rules.

To edit an existing rule, select the data you want to change, make the change, then select **Save** to save your edit.

### Delete an IP filter rule

To delete an IP filter rule, select the trash can icon on that row and then select **Save**. The rule is removed and the change is saved.

:::image type="content" source="./media/iot-hub-ip-filter-classic/ip-filter-delete-rule.png" alt-text="Delete an IoT Hub IP filter rule":::

### Retrieve and update IP filters using Azure CLI

Your IoT Hub's IP filters can be retrieved and updated through [Azure  CLI](/cli/azure/).

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

### Retrieve and update IP filters using Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Your IoT Hub's IP filters can be retrieved and set through [Azure PowerShell](/powershell/azure/).

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

### Update IP filter rules using REST

You may also retrieve and modify your IoT Hub's IP filter using Azure resource Provider's REST endpoint. See `properties.ipFilterRules` in [createorupdate method](/rest/api/iothub/iothubresource/createorupdate).

### IP filter rule evaluation

IP filter rules are applied in order and the first rule that matches the IP address determines the accept or reject action.

For example, if you want to accept addresses in the range 192.168.100.0/22 and reject everything else, the first rule in the grid should accept the address range 192.168.100.0/22. The next rule should reject all addresses by using the range 0.0.0.0/0.

You can change the order of your IP filter rules in the grid by clicking the three vertical dots at the start of a row and using drag and drop.

To save your new IP filter rule order, click **Save**.

:::image type="content" source="media/iot-hub-ip-filter-classic/ip-filter-rule-order.png" alt-text="Change the order of your IoT Hub IP filter rules":::

## Next steps

To further explore the capabilities of IoT Hub, see:

* [Use IP filters](iot-hub-ip-filtering.md)
