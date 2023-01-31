---
title: Configure IP firewall rules for Azure Service Bus
description: How to use Firewall Rules to allow connections from specific IP addresses to Azure Service Bus. 
ms.topic: article
ms.date: 02/18/2022
---

# Allow access to Azure Service Bus namespace from specific IP addresses or ranges
By default, Service Bus namespaces are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

This feature is helpful in scenarios in which Azure Service Bus should be only accessible from certain well-known sites. Firewall rules enable you to configure rules to accept traffic originating from specific IPv4 addresses. For example, if you use Service Bus with [Azure Express Route][express-route], you can create a **firewall rule** to allow traffic from only your on-premises infrastructure IP addresses or addresses of a corporate NAT gateway. 

## IP firewall rules
The IP firewall rules are applied at the Service Bus namespace level. Therefore, the rules apply to all connections from clients using any **supported protocol** (AMQP (5671) and HTTPS (443)). Any connection attempt from an IP address that doesn't match an allowed IP rule on the Service Bus namespace is rejected as unauthorized. The response doesn't mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.

## Important points
- Firewalls and Virtual Networks are supported only in the **premium** tier of Service Bus. If upgrading to the **premier** tier isn't an option, we recommend that you keep the Shared Access Signature (SAS) token secure and share with only authorized users. For information about SAS authentication, see [Authentication and authorization](service-bus-authentication-and-authorization.md#shared-access-signature).
- Specify **at least one IP firewall rule or virtual network rule** for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network. If there are no IP and virtual network rules, the namespace can be accessed over the public internet (using the access key).  
- Implementing firewall rules can prevent other Azure services from interacting with Service Bus. As an exception, you can allow access to Service Bus resources from certain **trusted services** even when IP filtering is enabled. For a list of trusted services, see [Trusted services](#trusted-microsoft-services). 

    The following Microsoft services are required to be on a virtual network
    - Azure App Service
    - Azure Functions

## Use Azure portal
This section shows you how to use the Azure portal to create IP firewall rules for a Service Bus namespace. 

1. Navigate to your **Service Bus namespace** in the [Azure portal](https://portal.azure.com).
2. On the left menu, select **Networking** option under **Settings**.  

    > [!NOTE]
    > You see the **Networking** tab only for **premium** namespaces.  
1. On the **Networking** page, for **Public network access**, you can set one of the three following options. Choose **Selected networks** option to allow access from only specified IP addresses. 
    - **Disabled**. This option disables any public access to the namespace. The namespace will be accessible only through [private endpoints](private-link-service.md). 
  
        :::image type="content" source="./media/service-bus-ip-filtering/public-access-disabled.png" alt-text="Networking page - public access tab - public network access is disabled.":::
    - **Selected networks**. This option enables public access to the namespace using an access key from selected networks. 

        > [!IMPORTANT]
        > If you choose **Selected networks**, add at least one IP firewall rule or a virtual network that will have access to the namespace. Choose **Disabled** if you want to restrict all traffic to this namespace over [private endpoints](private-link-service.md) only.   
    
        :::image type="content" source="./media/service-bus-ip-filtering/selected-networks.png" alt-text="Networking page with the selected networks option selected." lightbox="./media/service-bus-ip-filtering/selected-networks.png":::    
    - **All networks** (default). This option enables public access from all networks using an access key. If you select the **All networks** option, Service Bus accepts connections from any IP address (using the access key). This setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range. 

        :::image type="content" source="./media/service-bus-ip-filtering/firewall-all-networks-selected.png" alt-text="Screenshot of the Azure portal Networking page. The option to allow access from All networks is selected on the Firewalls and virtual networks tab.":::
1. To allow access from only specified IP address, select the **Selected networks** option if it isn't already selected. In the **Firewall** section, follow these steps:
    1. Select **Add your client IP address** option to give your current client IP the access to the namespace. 
    2. For **address range**, enter a specific IPv4 address or a range of IPv4 address in CIDR notation. 
    3. Specify whether you want to **allow trusted Microsoft services to bypass this firewall**. 

        >[!WARNING]
        > If you select the **Selected networks** option and don't add at least one IP firewall rule or a virtual network on this page, the namespace can be accessed over public internet (using the access key).    

        :::image type="content" source="./media/service-bus-ip-filtering/firewall-selected-networks-trusted-access-disabled.png" lightbox="./media/service-bus-ip-filtering/firewall-selected-networks-trusted-access-disabled.png" alt-text="Screenshot of the Azure portal Networking page. The option to allow access from Selected networks is selected and the Firewall section is highlighted.":::
3. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to show up on the portal notifications.

    > [!NOTE]
    > To restrict access to specific virtual networks, see [Allow access from specific networks](service-bus-service-endpoints.md).

[!INCLUDE [service-bus-trusted-services](./includes/service-bus-trusted-services.md)]

## Use Resource Manager template
This section has a sample Azure Resource Manager template that adds a virtual network and a firewall rule to an existing Service Bus namespace.

**ipMask** is a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 70.37.104.0/24 represents the 256 IPv4 addresses from 70.37.104.0 to 70.37.104.255, with 24 indicating the number of significant prefix bits for the range.

> [!NOTE]
> The default value of the `defaultAction` is `Allow`. When adding virtual network or firewalls rules, make sure you set the `defaultAction` to `Deny`.


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "serviceBusNamespaceName": {
            "defaultValue": "contososbusns",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.ServiceBus/namespaces",
            "apiVersion": "2021-06-01-preview",
            "name": "[parameters('serviceBusNamespaceName')]",
            "location": "East US",
            "sku": {
                "name": "Premium",
                "tier": "Premium",
                "capacity": 1
            },
            "properties": {
                "disableLocalAuth": false,
                "zoneRedundant": true
            }
        },
        {
            "type": "Microsoft.ServiceBus/namespaces/networkRuleSets",
            "apiVersion": "2021-06-01-preview",
            "name": "[concat(parameters('serviceBusNamespaceName'), '/default')]",
            "location": "East US",
            "dependsOn": [
                "[resourceId('Microsoft.ServiceBus/namespaces', parameters('serviceBusNamespaceName'))]"
            ],
            "properties": {
                "publicNetworkAccess": "Enabled",
                "defaultAction": "Allow",
                "virtualNetworkRules": [],
                "ipRules": [
                    {
                        "ipMask":"10.1.1.1",
                        "action":"Allow"
                    },
                    {
                        "ipMask":"11.0.0.0/24",
                        "action":"Allow"
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

## default action and public network access 

### REST API

The default value of the `defaultAction` property was `Deny` for API version **2021-01-01-preview and earlier**. However, the deny rule isn't enforced unless you set IP filters or virtual network (VNet) rules. That is, if you didn't have any IP filters or VNet rules, it's treated as `Allow`. 

From API version **2021-06-01-preview onwards**, the default value of the `defaultAction` property is `Allow`, to accurately reflect the service-side enforcement. If the default action is set to `Deny`, IP filters and VNet rules are enforced. If the default action is set to `Allow`, IP filters and VNet rules aren't enforced. The service remembers the rules when you turn them off and then back on again. 

The API version **2021-06-01-preview onwards** also introduces a new property named `publicNetworkAccess`. If it's set to `Disabled`, operations are restricted to private links only. If it's set to `Enabled`, operations are allowed over the public internet. 

For more information about these properties, see [Create or Update Network Rule Set](/rest/api/servicebus/preview/namespaces-network-rule-set/create-or-update-network-rule-set) and [Create or Update Private Endpoint Connections](/rest/api/servicebus/preview/private-endpoint-connections/create-or-update).

> [!NOTE]
> None of the above settings bypass validation of claims via SAS or Azure AD authentication. The authentication check always runs after the service validates the network checks that are configured by `defaultAction`, `publicNetworkAccess`, `privateEndpointConnections` settings.

### Azure portal

Azure portal always uses the latest API version to get and set properties.  If you had previously configured your namespace using **2021-01-01-preview and earlier** with `defaultAction` set to `Deny`, and specified zero IP filters and VNet rules, the portal would have previously checked **Selected Networks** on the **Networking** page of your namespace. Now, it checks the **All networks** option. 

:::image type="content" source="./media/service-bus-ip-filtering/firewall-all-networks-selected.png" alt-text="Screenshot of the Azure portal Networking page. The option to allow access from All networks is selected on the Firewalls and virtual networks tab.":::

## Next steps

For constraining access to Service Bus to Azure virtual networks, see the following link:

- [Virtual Network Service Endpoints for Service Bus][lnk-vnet]

<!-- Links -->

[lnk-deploy]: ../azure-resource-manager/templates/deploy-powershell.md
[lnk-vnet]: service-bus-service-endpoints.md
[express-route]:  ../expressroute/expressroute-faqs.md#supported-services
