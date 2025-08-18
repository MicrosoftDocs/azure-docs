---
title: Configure IP Firewall Rules for Azure Event Hubs Namespaces
description: Learn how to configure IP firewall rules for Azure Event Hubs namespaces to restrict access from specific IP addresses and CIDR ranges using Azure portal, CLI, or PowerShell.
#customer intent: As a network administrator, I want to configure IP firewall rules for my Azure Event Hubs namespace so that I can restrict access to only specific IP addresses and improve security
ms.topic: how-to
ms.custom:
  - devx-track-azurepowershell, devx-track-azurecli
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/25/2025
  - ai-gen-description
ms.date: 07/25/2025
---

# Allow access to Azure Event Hubs namespaces from specific IP addresses or ranges
By default, Event Hubs namespaces are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 and IPv6 addresses or address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

This feature is helpful in scenarios in which Azure Event Hubs should be only accessible from certain well-known sites. Firewall rules enable you to configure rules to accept traffic originating from specific IPv4 and IPv6 addresses. For example, if you use Event Hubs with [Azure Express Route][express-route], you can create a **firewall rule** to allow traffic from only your on-premises infrastructure IP addresses. 

## IP firewall rules
You specify IP firewall rules at the Event Hubs namespace level. So, the rules apply to all connections from clients using any supported protocol. Any connection attempt from an IP address that doesn't match an allowed IP rule on the Event Hubs namespace is rejected as unauthorized. The response doesn't mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.


## Important points
- This feature isn't supported in the **basic** tier.
- Turning on firewall rules for your Event Hubs namespace blocks incoming requests by default, unless requests originate from a service operating from allowed public IP addresses. Requests that are blocked include the requests from other Azure services, from the Azure portal, from logging and metrics services, and so on. As an exception, you can allow access to Event Hubs resources from certain **trusted services** even when the IP filtering is enabled. For a list of trusted services, see [Trusted Microsoft services](#trusted-microsoft-services).
- Specify **at least one IP firewall rule or virtual network rule** for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network. If there are no IP and virtual network rules, the namespace can be accessed over the public internet (using the access key).  


## Configure firewall rules using Azure portal

When creating a namespace, you can either allow public only (from all networks) or private only (only via private endpoints) access to the namespace. Once the namespace is created, you can allow access from specific IP addresses or from specific virtual networks (using network service endpoints). 

### Configure public access when creating a namespace
To enable public access, select **Public access** on the **Networking** page of the namespace creation wizard. 

:::image type="content" source="./media/event-hubs-firewall/create-namespace-public-access.png" alt-text="Screenshot showing the Networking page of the Create namespace wizard with Public access option selected.":::

After you create the namespace, select **Networking** on the left menu of the **Event Hubs Namespace** page. You see that **All Networks** option is selected. You can select **Selected Networks** option and allow access from specific IP addresses or specific virtual networks. The next section provides you details on configuring IP firewall to specify the IP addresses from which the access is allowed. 

### Configure IP firewall for an existing namespace
This section shows you how to use the Azure portal to create IP firewall rules for an Event Hubs namespace. 

1. Navigate to your **Event Hubs namespace** in the [Azure portal](https://portal.azure.com).
4. Select **Networking** under **Settings** on the left menu. 
1. On the **Networking** page, for **Public network access**, choose **Selected networks** option to allow access from only specified IP addresses. 

    Here are more details about options available in the **Public network access** page:
    - **Disabled**. This option disables any public access to the namespace. The namespace is accessible only through [private endpoints](private-link-service.md). 
    - **Selected networks**. This option enables public access to the namespace using an access key from selected networks. 

        > [!IMPORTANT]
        > If you choose **Selected networks**, add at least one IP firewall rule or a virtual network that will have access to the namespace. Choose **Disabled** if you want to restrict all traffic to this namespace over [private endpoints](private-link-service.md) only.
    - **All networks** (default). This option enables public access from all networks using an access key. If you select the **All networks** option, the event hub accepts connections from any IP address (using the access key). This setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range. 
1. To restrict access to **specific IP addresses**, select **Selected networks** option, and then follow these steps: 
    1. In the **Firewall** section, select **Add your client IP address** option to give your current client IP the access to the namespace. 
    3. For **address range**, enter specific IPv4 or IPv6 addresses or address ranges in CIDR notation.
    
        > [!IMPORTANT]
        > When the service starts supporting IPv6 connections in the future and clients automatically switch to using IPv6, your clients break if you have only IPv4 addresses, not IPv6 addresses. Therefore, we recommend that you add IPv6 addresses to the list of allowed IP addresses now so that your clients don't break when the service eventually switches to supporting IPv6. 
    1. Specify whether you want to **allow trusted Microsoft services to bypass this firewall**. See [Trusted Microsoft services](#trusted-microsoft-services) for details. 

        :::image type="content" source="./media/event-hubs-firewall/firewall-selected-networks-trusted-access-disabled.png" lightbox="./media/event-hubs-firewall/firewall-selected-networks-trusted-access-disabled.png" alt-text="Firewall section highlighted in the Public access tab of the Networking page.":::
3. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to show up on the portal notifications.

    > [!NOTE]
    > To restrict access to specific virtual networks, see [Allow access from specific networks](event-hubs-service-endpoints.md).

[!INCLUDE [event-hubs-trusted-services](./includes/event-hubs-trusted-services.md)]


## Configure firewall rules using Resource Manager templates

> [!IMPORTANT]
> The Firewall feature isn't supported in the basic tier.

The following Resource Manager template enables adding an IP filter rule to an existing Event Hubs namespace.

**ipMask** in the template is a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 70.37.104.0/24 represents the 256 IPv4 addresses from 70.37.104.0 to 70.37.104.255, with 24 indicating the number of significant prefix bits for the range.

> [!NOTE]
> The default value of the `defaultAction` is `Allow`. When adding virtual network or firewalls rules, make sure you set the `defaultAction` to `Deny`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespace_name": {
            "defaultValue": "contosoehub1333",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.EventHub/namespaces",
            "apiVersion": "2022-01-01-preview",
            "name": "[parameters('namespace_name')]",
            "location": "East US",
            "sku": {
                "name": "Standard",
                "tier": "Standard",
                "capacity": 1
            },
            "properties": {
                "minimumTlsVersion": "1.2",
                "publicNetworkAccess": "Enabled",
                "disableLocalAuth": false,
                "zoneRedundant": true,
                "isAutoInflateEnabled": false,
                "maximumThroughputUnits": 0,
                "kafkaEnabled": true
            }
        },
        {
            "type": "Microsoft.EventHub/namespaces/authorizationrules",
            "apiVersion": "2022-01-01-preview",
            "name": "[concat(parameters('namespace_name'), '/RootManageSharedAccessKey')]",
            "location": "eastus",
            "dependsOn": [
                "[resourceId('Microsoft.EventHub/namespaces', parameters('namespace_name'))]"
            ],
            "properties": {
                "rights": [
                    "Listen",
                    "Manage",
                    "Send"
                ]
            }
        },
        {
            "type": "Microsoft.EventHub/namespaces/networkRuleSets",
            "apiVersion": "2022-01-01-preview",
            "name": "[concat(parameters('namespace_name'), '/default')]",
            "location": "East US",
            "dependsOn": [
                "[resourceId('Microsoft.EventHub/namespaces', parameters('namespace_name'))]"
            ],
            "properties": {
                "publicNetworkAccess": "Enabled",
                "defaultAction": "Deny",
                "virtualNetworkRules": [],
                "ipRules": [
                    {
                        "ipMask": "10.1.1.1",
                        "action": "Allow"
                    },
                    {
                        "ipMask": "11.0.0.0/24",
                        "action": "Allow"
                    },
                    {
                        "ipMask": "172.72.157.204",
                        "action": "Allow"
                    }
                ]
            }
        }
    ]
}
```

To deploy the template, follow the instructions for [Azure Resource Manager][lnk-deploy].

> [!IMPORTANT]
> If there are no IP and virtual network rules, all the traffic flows into the namespace even if you set the `defaultAction` to `deny`. The namespace can be accessed over the public internet (using the access key). Specify at least one IP rule or virtual network rule for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network.  

## Configure firewall rules using Azure CLI
Use [`az eventhubs namespace network-rule-set`](/cli/azure/eventhubs/namespace/network-rule-set) add, list, update, and remove commands to manage IP firewall rules for an Event Hubs namespace.

## Configure firewall rules using Azure PowerShell
Use the [`Set-AzEventHubNetworkRuleSet`](/powershell/module/az.eventhub/set-azeventhubnetworkruleset) cmdlet to add one or more IP firewall rules. An example from the article:

```azurepowershell-interactive
$ipRule1 = New-AzEventHubIPRuleConfig -IPMask 2.2.2.2 -Action Allow
$ipRule2 = New-AzEventHubIPRuleConfig -IPMask 3.3.3.3 -Action Allow
$virtualNetworkRule1 = New-AzEventHubVirtualNetworkRuleConfig -SubnetId '/subscriptions/subscriptionId/resourcegroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVirtualNetwork/subnets/default'
$networkRuleSet = Get-AzEventHubNetworkRuleSet -ResourceGroupName myResourceGroup -NamespaceName myNamespace
$networkRuleSet.IPRule += $ipRule1
$networkRuleSet.IPRule += $ipRule2
$networkRuleSet.VirtualNetworkRule += $virtualNetworkRule1
Set-AzEventHubNetworkRuleSet -ResourceGroupName myResourceGroup -NamespaceName myNamespace -IPRule $ipRule1,$ipRule2 -VirtualNetworkRule $virtualNetworkRule1,$virtualNetworkRule2,$virtualNetworkRule3
```

## Default action and public network access 

### REST API

The default value of the `defaultAction` property was `Deny` for API version **2021-01-01-preview and earlier**. However, the deny rule isn't enforced unless you set IP filters or virtual network rules. That is, if you didn't have any IP filters or virtual network rules, it's treated as `Allow`. 

From API version **2021-06-01-preview onwards**, the default value of the `defaultAction` property is `Allow`, to accurately reflect the service-side enforcement. If the default action is set to `Deny`, IP filters and virtual network rules are enforced. If the default action is set to `Allow`, IP filters and virtual network rules aren't enforced. The service remembers the rules when you turn them off and then back on again. 

The API version **2021-06-01-preview onwards** also introduces a new property named `publicNetworkAccess`. If it's set to `Disabled`, operations are restricted to private links only. If it's set to `Enabled`, operations are allowed over the public internet. 

For more information about these properties, see [Create or Update Network Rule Set](/rest/api/eventhub/namespaces/create-or-update-network-rule-set) and [Create or Update Private Endpoint Connections](/rest/api/eventhub/private-endpoint-connections/create-or-update).

> [!NOTE]
> None of the above settings bypass validation of claims via SAS or Microsoft Entra authentication. The authentication check always runs after the service validates the network checks that are configured by `defaultAction`, `publicNetworkAccess`, `privateEndpointConnections` settings.

### Azure portal

Azure portal always uses the latest API version to get and set properties. If you had configured your namespace using **2021-01-01-preview and earlier** with `defaultAction` set to `Deny`, and specified zero IP filters and virtual network rules, the portal would have previously checked **Selected Networks** on the **Networking** page of your namespace. Now, it checks the **All networks** option. 

:::image type="content" source="./media/event-hubs-firewall/firewall-all-networks-selected.png" lightbox="./media/event-hubs-firewall/firewall-all-networks-selected.png" alt-text="Screenshot that shows the Public access page with the All networks option selected.":::





## Next steps

For constraining access to Event Hubs to Azure virtual networks, see the following link:

- [Virtual Network Service Endpoints for Event Hubs][lnk-vnet]

<!-- Links -->

[express-route]:  ../expressroute/expressroute-faqs.md#supported-services

[lnk-deploy]: ../azure-resource-manager/templates/deploy-powershell.md

[lnk-vnet]: event-hubs-service-endpoints.md
