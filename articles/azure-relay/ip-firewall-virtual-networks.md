---
title: Configure IP firewall for Azure Relay namespace
description: This article describes how to Use firewall rules to allow connections from specific IP addresses to Azure Relay namespaces. 
ms.topic: article
ms.date: 02/15/2023
---

# Configure IP firewall for an Azure Relay namespace
By default, Relay namespaces are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

This feature is helpful in scenarios in which Azure Relay should be only accessible from certain well-known sites. Firewall rules enable you to configure rules to accept traffic originating from specific IPv4 addresses. For example, if you use Relay with [Azure Express Route](../expressroute/expressroute-faqs.md#supported-services), you can create a **firewall rule** to allow traffic from only your on-premises infrastructure IP addresses. 


## Enable IP firewall rules
The IP firewall rules are applied at the namespace level. Therefore, the rules apply to all connections from clients using any supported protocol. Any connection attempt from an IP address that does not match an allowed IP rule on the namespace is rejected as unauthorized. The response does not mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.

### Use Azure portal
This section shows you how to use the Azure portal to create IP firewall rules for a namespace. 

1. Navigate to your **Relay namespace** in the [Azure portal](https://portal.azure.com).
2. On the left menu, select **Networking**.
1. To restrict access to specific networks and IP addresses, select the **Selected networks** option. In the **Firewall** section, follow these steps:
    1. Select **Add your client IP address** option to give your current client IP the access to the namespace. 
    2. For **address range**, enter a specific IPv4 address or a range of IPv4 address in CIDR notation. 
    3. If you want to allow Microsoft services trusted by the Azure Relay service to bypass this firewall, select **Yes** for **Allow [trusted Microsoft services](#trusted-microsoft-services) to bypass this firewall?**. 
  
        :::image type="content" source="./media/ip-firewall/selected-networks-trusted-access-disabled.png" alt-text="Screenshot showing the Public access tab of the Networking page with the Firewall enabled.":::
1. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to show up on the portal notifications.


### Use Resource Manager template
The following Resource Manager template enables adding an IP filter rule to an existing Relay namespace.

The template takes one parameter: **ipMask**, which is a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 70.37.104.0/24 represents the 256 IPv4 addresses from 70.37.104.0 to 70.37.104.255, with 24 indicating the number of significant prefix bits for the range.

> [!NOTE]
> While there are no deny rules possible, the Azure Resource Manager template has the default action set to **"Allow"** which doesn't restrict connections.
> When making Virtual Network or Firewalls rules, we must change the
> ***"defaultAction"***
> 
> from
> ```json
> "defaultAction": "Allow"
> ```
> to
> ```json
> "defaultAction": "Deny"
> ```
>

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_name": {
            "defaultValue": "contosorelay0215",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Relay/namespaces",
            "apiVersion": "2021-11-01",
            "name": "[parameters('namespaces_name')]",
            "location": "East US",
            "sku": {
                "name": "Standard",
                "tier": "Standard"
            },
            "properties": {}
        },
        {
            "type": "Microsoft.Relay/namespaces/authorizationrules",
            "apiVersion": "2021-11-01",
            "name": "[concat(parameters('namespaces_sprelayns0215_name'), '/RootManageSharedAccessKey')]",
            "location": "eastus",
            "dependsOn": [
                "[resourceId('Microsoft.Relay/namespaces', parameters('namespaces_sprelayns0215_name'))]"
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
            "type": "Microsoft.Relay/namespaces/networkRuleSets",
            "apiVersion": "2021-11-01",
            "name": "[concat(parameters('namespaces_sprelayns0215_name'), '/default')]",
            "location": "East US",
            "dependsOn": [
                "[resourceId('Microsoft.Relay/namespaces', parameters('namespaces_sprelayns0215_name'))]"
            ],
            "properties": {
                "publicNetworkAccess": "Enabled",
                "defaultAction": "Deny",
                "ipRules": [
                    {
                        "ipMask": "172.72.157.204",
                        "action": "Allow"
                    },
                    {
                        "ipMask": "10.1.1.1",
                        "action": "Allow"
                    },
                    {
                        "ipMask": "11.0.0.0/24",
                        "action": "Allow"
                    }
                ]
            }
        }
    ]
}
```

To deploy the template, follow the instructions for [Azure Resource Manager](../azure-resource-manager/templates/deploy-powershell.md).


[!INCLUDE [trusted-services](./includes/trusted-services.md)]

## Next steps
To learn about other network security-related features, see [Network security](network-security.md).


<!-- Links -->

[express-route]:  ../expressroute/expressroute-faqs.md#supported-services
