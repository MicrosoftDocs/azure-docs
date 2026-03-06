---
title: Configure IP firewall rules for Azure Service Bus
description: This article describes how to use Firewall Rules to allow connections from specific IP addresses to Azure Service Bus. 
ms.topic: how-to
ms.date: 12/02/2024
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - sfi-image-nochange
# Customer intent: As an IT administrator, I would like to know how to configure IP firewall rules for an Azure Service Bus namespace. 
---

# Allow access to Azure Service Bus namespace from specific IP addresses or ranges
By default, the internet can access Service Bus namespaces as long as the request contains valid authentication and authorization. By using the IP firewall, you can restrict inbound traffic to a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

This feature is helpful in scenarios where Azure Service Bus should be accessible only from certain well-known sites. Firewall rules enable you to configure rules to accept traffic originating from specific IPv4 addresses. For example, if you use Service Bus with [Azure Express Route][express-route], you can create a **firewall rule** to allow traffic from only your on-premises infrastructure IP addresses or addresses of a corporate NAT gateway. 

## IP firewall rules
Apply the IP firewall rules at the Service Bus namespace level. Therefore, the rules apply to all connections from clients using any **supported protocol** (AMQP (5671) and HTTPS (443)). The Service Bus rejects any connection attempt from an IP address that doesn't match an allowed IP rule on the Service Bus namespace as unauthorized. The response doesn't mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.

> [!NOTE]
> The networking options differ between Service Bus SKUs. The **Standard SKU** supports IP filtering but does not include the "Trusted Services" option. For Premium SKU networking features, please refer to the dedicated Premium SKU networking documentation.

## Important points
- Private Endpoints and Service Endpoints are supported only in the **premium** tier of Service Bus. If upgrading to the **premium** tier isn't an option, you can use IP firewall rules by using the [Azure portal](#use-azure-portal), [Azure Resource Manager templates](#use-a-template), [Azure CLI](#use-azure-cli), [PowerShell](#use-azure-powershell), or [REST API](#rest-api).
- Specify **at least one IP firewall rule or virtual network rule** for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network. If there are no IP and virtual network rules, the namespace is accessible over the public internet (using the access key).  
- Implementing firewall rules can prevent other Azure services from interacting with Service Bus. As an exception, you can allow access to Service Bus resources from certain **trusted services** even when IP filtering is enabled. For a list of trusted services, see [Trusted services](#trusted-microsoft-services). 

    The following services don't support Trusted services and instead utilize a feature called VNet Integration to make outbound calls through a VNet:
    - Azure App Service
    - Azure Functions
    
    For more details, see [Integrate your app with an Azure virtual network](../app-service/overview-vnet-integration.md).

## Use Azure portal

When creating a namespace, you can either allow public only (from all networks) or private only (only via private endpoints) access to the namespace. Once the namespace is created, you can allow access from specific IP addresses or from specific virtual networks (using network service endpoints). 

### Configure public access when creating a namespace
To enable public access, select **Public access** on the **Networking** page of the namespace creation wizard. 

:::image type="content" source="./media/service-bus-ip-filtering/create-namespace-public-access.png" alt-text="Screenshot showing the Networking page of the Create namespace wizard with Public access option selected.":::

After you create the namespace, select **Networking** on the left menu of the **Service Bus Namespace** page. You see that **All Networks** option is selected. You can select **Selected Networks** option and allow access from specific IP addresses or specific virtual networks. The next section provides you details on configuring IP firewall to specify the IP addresses from which the access is allowed. 

### Configure IP firewall for an existing namespace
This section shows you how to use the Azure portal to create IP firewall rules for a Service Bus namespace. 

1. Go to your **Service Bus namespace** in the [Azure portal](https://portal.azure.com).
1. On the left menu, select the **Networking** option under **Settings**.  

    > [!NOTE]
    > You see the **Networking** tab only for **premium** namespaces.  
1. On the **Networking** page, for **Public network access**, you can set one of the three following options. Choose the **Selected networks** option to allow access from only specified IP addresses. 
    - **Disabled**. This option disables any public access to the namespace. The namespace is accessible only through [private endpoints](private-link-service.md).
    
        :::image type="content" source="./media/service-bus-ip-filtering/public-access-disabled-page.png" alt-text="Screenshot that shows the Networking page of a namespace with public access disabled."::: 

        Choose whether you want to allow trusted Microsoft services to bypass the firewall. For the list of trusted Microsoft services for Azure Service Bus, see the [Trusted Microsoft services](#trusted-microsoft-services) section.
    - **Selected networks**. This option enables public access to the namespace from selected networks by using an access key. 

        > [!IMPORTANT]
        > If you choose **Selected networks**, add at least one IP firewall rule or a virtual network that has access to the namespace. Choose **Disabled** if you want to restrict all traffic to this namespace over [private endpoints](private-link-service.md) only.       
    - **All networks** (default). This option enables public access from all networks by using an access key. If you select the **All networks** option, Service Bus accepts connections from any IP address (by using the access key). This setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range. 
1. To allow access from only specified IP address, select the **Selected networks** option if it isn't already selected. In the **Firewall** section, follow these steps:
    1. Select **Add your client IP address** option to give your current client IP the access to the namespace. 
    1. For **address range**, enter a specific IPv4 address or a range of IPv4 address in CIDR notation. 
    1. Specify whether you want to **allow trusted Microsoft services to bypass this firewall**. For the list of trusted Microsoft services for Azure Service Bus, see the [Trusted Microsoft services](#trusted-microsoft-services) section. 

        >[!WARNING]
        > If you select the **Selected networks** option and don't add at least one IP firewall rule or a virtual network on this page, the namespace can't be accessed over public internet (using the access key).    

        :::image type="content" source="./media/service-bus-ip-filtering/firewall-selected-networks-trusted-access-disabled.png" lightbox="./media/service-bus-ip-filtering/firewall-selected-networks-trusted-access-disabled.png" alt-text="Screenshot of the Azure portal Networking page. The option to allow access from Selected networks is selected and the Firewall section is highlighted.":::
1. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to show up on the portal notifications.

    > [!NOTE]
    > To restrict access to specific virtual networks, see [Allow access from specific networks](service-bus-service-endpoints.md).

[!INCLUDE [service-bus-trusted-services](./includes/service-bus-trusted-services.md)]

<a id="use-resource-manager-template"></a>

## Use a template
This section shows sample templates that add a virtual network and a firewall rule to an existing Service Bus namespace.

**ipMask** is a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 70.37.104.0/24 represents the 256 IPv4 addresses from 70.37.104.0 to 70.37.104.255, with 24 indicating the number of significant prefix bits for the range.

> [!NOTE]
> The default value of the `defaultAction` is `Allow`. When you add virtual network or firewall rules, make sure you set the `defaultAction` to `Deny`.

# [Bicep](#tab/bicep)

```bicep
@description('Name of the Service Bus namespace')
param namespaceName string

@description('Location for all resources.')
param location string = resourceGroup().location

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: namespaceName
  location: location
  sku: {
    name: 'Premium'
    tier: 'Premium'
    capacity: 1
  }
  properties: {
    premiumMessagingPartitions: 1
    minimumTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
    zoneRedundant: true
  }

  resource networkRuleSet 'networkRuleSets' = {
    name: 'default'
    properties: {
      publicNetworkAccess: 'Enabled'
      defaultAction: 'Deny'
      virtualNetworkRules: []
      ipRules: [
        {
          ipMask: '10.1.1.1'
          action: 'Allow'
        }
        {
          ipMask: '11.0.0.0/24'
          action: 'Allow'
        }
      ]
    }
  }
}
```

# [ARM template](#tab/arm)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaceName": {
            "type": "string",
            "metadata": {
                "description": "Name of the Service Bus namespace"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.ServiceBus/namespaces",
            "apiVersion": "2024-01-01",
            "name": "[parameters('namespaceName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Premium",
                "tier": "Premium",
                "capacity": 1
            },
            "properties": {
                "premiumMessagingPartitions": 1,
                "minimumTlsVersion": "1.2",
                "publicNetworkAccess": "Enabled",
                "disableLocalAuth": false,
                "zoneRedundant": true
            },
            "resources": [
                {
                    "type": "networkRuleSets",
                    "apiVersion": "2024-01-01",
                    "name": "default",
                    "dependsOn": [
                        "[parameters('namespaceName')]"
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
                            }
                        ]
                    }
                }
            ]
        }
    ]
}
```

---

To deploy the template, follow the instructions for [Azure Resource Manager][lnk-deploy].

> [!IMPORTANT]
> If you don't specify any IP or virtual network rules, all traffic flows into the namespace even if you set the `defaultAction` to `deny`. Users can access the namespace over the public internet (by using the access key). To allow traffic only from the specified IP addresses or subnet of a virtual network, specify at least one IP rule or virtual network rule for the namespace.  

## Use Azure CLI
Use [`az servicebus namespace network-rule-set`](/cli/azure/servicebus/namespace/network-rule-set) add, list, update, and remove commands to manage IP firewall rules for a Service Bus namespace.

## Use Azure PowerShell
Use the following Azure PowerShell commands to add, list, remove, update, and delete IP firewall rules. 

- Use [`New-AzServiceBusIPRuleConfig`](/powershell/module/az.servicebus/new-azservicebusipruleconfig) and [`Set-AzServiceBusNetworkRuleSet`](/powershell/module/az.servicebus/set-azservicebusnetworkruleset) together to add an IP firewall rule.

## Default action and public network access 

### REST API

For API versions **2021-01-01-preview and earlier**, the default value of the `defaultAction` property is `Deny`. However, the deny rule isn't enforced unless you set IP filters or virtual network rules. If you don't set any IP filters or virtual network rules, Service Bus treats the default action as `Allow`. 

From API version **2021-06-01-preview onwards**, the default value of the `defaultAction` property is `Allow`, to accurately reflect the service-side enforcement. If you set the default action to `Deny`, the service enforces IP filters and virtual network rules. If you set the default action to `Allow`, the service doesn't enforce IP filters and virtual network rules. The service remembers the rules when you turn them off and then back on again. 

API versions **2021-06-01-preview onwards** also introduce a new property named `publicNetworkAccess`. If you set it to `Disabled`, operations are restricted to private links only. If you set it to `Enabled`, operations are allowed over the public internet. 

For more information about these properties, see [Create or Update Private Endpoint Connections](/rest/api/servicebus/controlplane-preview/private-endpoint-connections/create-or-update).

> [!NOTE]
> None of the above settings bypass validation of claims via SAS or Microsoft Entra authentication. The authentication check always runs after the service validates the network checks that are configured by `defaultAction`, `publicNetworkAccess`, and `privateEndpointConnections` settings.

### Azure portal

Azure portal always uses the latest API version to get and set properties. If you previously configured your namespace by using **2021-01-01-preview and earlier** with `defaultAction` set to `Deny`, and specified zero IP filters and virtual network rules, the portal previously checked **Selected Networks** on the **Networking** page of your namespace. Now, it checks the **All networks** option. 

:::image type="content" source="./media/service-bus-ip-filtering/firewall-all-networks-selected.png" alt-text="Screenshot of the Azure portal Networking page. The option to allow access from All networks is selected on the Firewalls and virtual networks tab.":::

## Related content

To constrain access to Service Bus to Azure virtual networks, see the following article:

- [Virtual Network Service Endpoints for Service Bus][lnk-vnet]

<!-- Links -->

[lnk-deploy]: ../azure-resource-manager/templates/deploy-powershell.md
[lnk-vnet]: service-bus-service-endpoints.md
[express-route]:  ../expressroute/expressroute-faqs.md#supported-services
