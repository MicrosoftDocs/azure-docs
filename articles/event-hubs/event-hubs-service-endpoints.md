---
title: Virtual Network service endpoints - Azure Event Hubs | Microsoft Docs
description: This article provides information on how to add a Microsoft.EventHub service endpoint to a virtual network. 
ms.topic: article
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 02/15/2023
---

# Allow access to Azure Event Hubs namespaces from specific virtual networks 

The integration of Event Hubs with [Virtual Network (VNet) Service Endpoints][vnet-sep] enables secure access to messaging capabilities from workloads such as virtual machines that are bound to virtual networks, with the network traffic path being secured on both ends. 

Once configured to bound to at least one virtual network subnet service endpoint, the respective Event Hubs namespace no longer accepts traffic from anywhere but authorized subnets in virtual networks. From the virtual network perspective, binding an Event Hubs namespace to a service endpoint configures an isolated networking tunnel from the virtual network subnet to the messaging service. 

The result is a private and isolated relationship between the workloads bound to the subnet and the respective Event Hubs namespace, in spite of the observable network address of the messaging service endpoint being in a public IP range. There's an exception to this behavior. Enabling a service endpoint, by default, enables the `denyall` rule in the [IP firewall](event-hubs-ip-filtering.md) associated with the virtual network. You can add specific IP addresses in the IP firewall to enable access to the Event Hubs public endpoint. 

## Important points
- This feature isn't supported in the **basic** tier.
- Enabling virtual networks for your Event Hubs namespace blocks incoming requests by default, unless requests originate from a service operating from allowed virtual networks. Requests that are blocked include those from other Azure services, from the Azure portal, from logging and metrics services, and so on. As an exception, you can allow access to Event Hubs resources from certain **trusted services** even when virtual networks are enabled. For a list of trusted services, see [Trusted services](#trusted-microsoft-services).
- Specify **at least one IP rule or virtual network rule** for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network. If there are no IP and virtual network rules, the namespace can be accessed over the public internet (using the access key).  

## Advanced security scenarios enabled by VNet integration 

Solutions that require tight and compartmentalized security, and where virtual network subnets provide the segmentation between the compartmentalized services, still need communication paths between services residing in those compartments.

Any immediate IP route between the compartments, including those carrying HTTPS over TCP/IP, carries the risk of exploitation of vulnerabilities from the network layer on up. Messaging services provide insulated communication paths, where messages are even written to disk as they transition between parties. Workloads in two distinct virtual networks that are both bound to the same Event Hubs instance can communicate efficiently and reliably via messages, while the respective network isolation boundary integrity is preserved.
 
That means your security sensitive cloud solutions not only gain access to Azure industry-leading reliable and scalable asynchronous messaging capabilities, but they can now use messaging to create communication paths between secure solution compartments that are inherently more secure than what is achievable with any peer-to-peer communication mode, including HTTPS and other TLS-secured socket protocols.

## Bind event hubs to virtual networks

**Virtual network rules** are the firewall security feature that controls whether your Azure Event Hubs namespace accepts connections from a particular virtual network subnet.

Binding an Event Hubs namespace to a virtual network is a two-step process. You first need to create a **virtual Network service endpoint** on a virtual network's subnet and enable it for **Microsoft.EventHub** as explained in the [service endpoint overview][vnet-sep] article. Once you've added the service endpoint, you bind the Event Hubs namespace to it with a **virtual network rule**.

The virtual network rule is an association of the Event Hubs namespace with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Event Hubs namespace. Event Hubs itself never establishes outbound connections, doesn't need to gain access, and is therefore never granted access to your subnet by enabling this rule.

## Use Azure portal
When creating a namespace, you can either allow public only (from all networks) or private only (only via private endpoints) access to the namespace. Once the namespace is created, you can allow access from specific IP addresses or from specific virtual networks (using network service endpoints). 

### Configure public access when creating a namespace
To enable public access, select **Public access** on the **Networking** page of the namespace creation wizard. 

:::image type="content" source="./media/event-hubs-firewall/create-namespace-public-access.png" alt-text="Screenshot showing the Networking page of the Create namespace wizard with Public access option selected.":::

After you create the namespace, select **Networking** on the left menu of the **Service Bus Namespace** page. You see that **All Networks** option is selected. You can select **Selected Networks** option and allow access from specific IP addresses or specific virtual networks. The next section provides you details on specifying the networks from which the access is allowed. 

### Configure selected networks for an existing namespace
This section shows you how to use Azure portal to add a virtual network service endpoint. To limit access, you need to integrate the virtual network service endpoint for this Event Hubs namespace.

1. Navigate to your **Event Hubs namespace** in the [Azure portal](https://portal.azure.com).
4. Select **Networking** under **Settings** on the left menu. 
1. On the **Networking** page, for **Public network access**, you can set one of the three following options. Choose **Selected networks** option to allow access only from specific virtual networks.

    Here are more details about options available in the **Public network access** page:
    - **Disabled**. This option disables any public access to the namespace. The namespace is accessible only through [private endpoints](private-link-service.md). 
    - **Selected networks**. This option enables public access to the namespace using an access key from selected networks. 

        > [!IMPORTANT]
        > If you choose **Selected networks**, add at least one IP firewall rule or a virtual network that will have access to the namespace. Choose **Disabled** if you want to restrict all traffic to this namespace over [private endpoints](private-link-service.md) only.
    - **All networks** (default). This option enables public access from all networks using an access key. If you select the **All networks** option, the event hub accepts connections from any IP address (using the access key). This setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range. 
1. To restrict access to specific networks, choose the **Selected Networks** option at the top of the page if it isn't already selected.
2. In the **Virtual networks** section of the page, select **+Add existing virtual network***. Select **+ Create new virtual network** if you want to create a new VNet. 

    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/add-vnet-menu.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/add-vnet-menu.png" alt-text="Selection of Add existing virtual network menu item.":::

    > [!IMPORTANT]
    > If you choose **Selected networks**, add at least one IP firewall rule or a virtual network that will have access to the namespace. Choose **Disabled** if you want to restrict all traffic to this namespace over [private endpoints](private-link-service.md) only.
3. Select the virtual network from the list of virtual networks, and then pick the **subnet**. You have to enable the service endpoint before adding the virtual network to the list. If the service endpoint isn't enabled, the portal prompts you to enable it.
   
    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/select-subnet.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/select-subnet.png" alt-text="Image showing the selection of a subnet.":::
4. You should see the following successful message after the service endpoint for the subnet is enabled for **Microsoft.EventHub**. Select **Add** at the bottom of the page to add the network. 

    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/subnet-service-endpoint-enabled.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/subnet-service-endpoint-enabled.png" alt-text="Image showing the selection of a subnet and enabling an endpoint.":::

    > [!NOTE]
    > If you are unable to enable the service endpoint, you may ignore the missing virtual network service endpoint using the Resource Manager template. This functionality is not available on the portal.
5. Specify whether you want to **allow trusted Microsoft services to bypass this firewall**. See [Trusted Microsoft services](#trusted-microsoft-services) for details. 
6. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to show up on the portal notifications.

    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/save-vnet.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/save-vnet.png" alt-text="Image showing the saving of virtual network.":::

    > [!NOTE]
    > To restrict access to specific IP addresses or ranges, see [Allow access from specific IP addresses or ranges](event-hubs-ip-filtering.md).

[!INCLUDE [event-hubs-trusted-services](./includes/event-hubs-trusted-services.md)]

## Use Resource Manager template
The following sample Resource Manager template adds a virtual network rule to an existing Event Hubs namespace. For the network rule, it specifies the ID of a subnet in a virtual network. 

The ID is a fully qualified Resource Manager path for the virtual network subnet. For example, `/subscriptions/{id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/default` for the default subnet of a virtual network.

When adding virtual network or firewalls rules, set the value of `defaultAction` to `Deny`.


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "eventhubNamespaceName": {
        "type": "string",
        "metadata": {
          "description": "Name of the Event Hubs namespace"
        }
      },
      "virtualNetworkName": {
        "type": "string",
        "metadata": {
          "description": "Name of the Virtual Network Rule"
        }
      },
      "subnetName": {
        "type": "string",
        "metadata": {
          "description": "Name of the Virtual Network Sub Net"
        }
      },
      "location": {
        "type": "string",
        "metadata": {
          "description": "Location for Namespace"
        }
      }
    },
    "variables": {
      "namespaceNetworkRuleSetName": "[concat(parameters('eventhubNamespaceName'), concat('/', 'default'))]",
      "subNetId": "[resourceId('Microsoft.Network/virtualNetworks/subnets/', parameters('virtualNetworkName'), parameters('subnetName'))]"
    },
    "resources": [
      {
        "apiVersion": "2018-01-01-preview",
        "name": "[parameters('eventhubNamespaceName')]",
        "type": "Microsoft.EventHub/namespaces",
        "location": "[parameters('location')]",
        "sku": {
          "name": "Standard",
          "tier": "Standard"
        },
        "properties": { }
      },
      {
        "apiVersion": "2017-09-01",
        "name": "[parameters('virtualNetworkName')]",
        "location": "[parameters('location')]",
        "type": "Microsoft.Network/virtualNetworks",
        "properties": {
          "addressSpace": {
            "addressPrefixes": [
              "10.0.0.0/23"
            ]
          },
          "subnets": [
            {
              "name": "[parameters('subnetName')]",
              "properties": {
                "addressPrefix": "10.0.0.0/23",
                "serviceEndpoints": [
                  {
                    "service": "Microsoft.EventHub"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        "apiVersion": "2018-01-01-preview",
        "name": "[variables('namespaceNetworkRuleSetName')]",
        "type": "Microsoft.EventHub/namespaces/networkruleset",
        "dependsOn": [
          "[concat('Microsoft.EventHub/namespaces/', parameters('eventhubNamespaceName'))]"
        ],
        "properties": {
          "publicNetworkAccess": "Enabled",
          "defaultAction": "Deny",
          "virtualNetworkRules": 
          [
            {
              "subnet": {
                "id": "[variables('subNetId')]"
              },
              "ignoreMissingVnetServiceEndpoint": false
            }
          ],
          "ipRules":[],
          "trustedServiceAccessEnabled": false
        }
      }
    ],
    "outputs": { }
  }
```

To deploy the template, follow the instructions for [Azure Resource Manager][lnk-deploy].

> [!IMPORTANT]
> If there are no IP and virtual network rules, all the traffic flows into the namespace even if you set the `defaultAction` to `deny`.  The namespace can be accessed over the public internet (using the access key). Specify at least one IP rule or virtual network rule for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network.  

## Use Azure CLI
Use [`az eventhubs namespace network-rule-set`](/cli/azure/eventhubs/namespace/network-rule-set) add, list, update, and remove commands to manage virtual network rules for a Service Bus namespace.

## Use Azure PowerShell
Use the following Azure PowerShell commands to add, list, remove, update, and delete network rules for a Service Bus namespace. 

- [`Add-AzEventHubVirtualNetworkRule`](/powershell/module/az.eventhub/add-azeventhubvirtualnetworkrule) to add a virtual network rule.
- [`New-AzEventHubVirtualNetworkRuleConfig`](/powershell/module/az.eventhub/new-azeventhubipruleconfig) and [`Set-AzEventHubNetworkRuleSet`](/powershell/module/az.eventhub/set-azeventhubnetworkruleset) together to add a virtual network rule.
- [`Remove-AzEventHubVirtualNetworkRule`](/powershell/module/az.eventhub/remove-azeventhubvirtualnetworkrule) to remove s virtual network rule.


## default action and public network access 

### REST API

The default value of the `defaultAction` property was `Deny` for API version **2021-01-01-preview and earlier**. However, the deny rule isn't enforced unless you set IP filters or virtual network (VNet) rules. That is, if you didn't have any IP filters or VNet rules, it's treated as `Allow`. 

From API version **2021-06-01-preview onwards**, the default value of the `defaultAction` property is `Allow`, to accurately reflect the service-side enforcement. If the default action is set to `Deny`, IP filters and VNet rules are enforced. If the default action is set to `Allow`, IP filters and VNet rules aren't enforced. The service remembers the rules when you turn them off and then back on again. 

The API version **2021-06-01-preview onwards** also introduces a new property named `publicNetworkAccess`. If it's set to `Disabled`, operations are restricted to private links only. If it's set to `Enabled`, operations are allowed over the public internet. 

For more information about these properties, see [Create or Update Network Rule Set](/rest/api/eventhub/controlplane-preview/namespaces-network-rule-set/create-or-update-network-rule-set) and [Create or Update Private Endpoint Connections](/rest/api/eventhub/controlplane-preview/private-endpoint-connections/create-or-update).

> [!NOTE]
> None of the above settings bypass validation of claims via SAS or Microsoft Entra authentication. The authentication check always runs after the service validates the network checks that are configured by `defaultAction`, `publicNetworkAccess`, `privateEndpointConnections` settings.

### Azure portal

Azure portal always uses the latest API version to get and set properties.  If you had previously configured your namespace using **2021-01-01-preview and earlier** with `defaultAction` set to `Deny`, and specified zero IP filters and VNet rules, the portal would have previously checked **Selected Networks** on the **Networking** page of your namespace. Now, it checks the **All networks** option. 

:::image type="content" source="./media/event-hubs-firewall/firewall-all-networks-selected.png" lightbox="./media/event-hubs-firewall/firewall-all-networks-selected.png" alt-text="Screenshot that shows the Public access page with the All networks option selected.":::


## Next steps

For more information about virtual networks, see the following links:

- [Azure virtual network service endpoints][vnet-sep]
- [Azure Event Hubs IP filtering][ip-filtering]

[vnet-sep]: ../virtual-network/virtual-network-service-endpoints-overview.md
[lnk-deploy]: ../azure-resource-manager/templates/deploy-powershell.md
[ip-filtering]: event-hubs-ip-filtering.md
