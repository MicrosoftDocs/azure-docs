---
title: Secure Azure Event Hubs Using Virtual Network Integration
description: Discover how to bind Azure Event Hubs to virtual networks for private, secure communication between workloads.
#customer intent: As an IT admin, I want to bind Event Hubs namespaces to virtual networks so that I can isolate messaging services from public internet access.  
ms.topic: article
ms.date: 07/28/2025
ms.custom:
  - devx-track-azurepowershell, devx-track-azurecli
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/28/2025
  - ai-gen-description
  - sfi-image-nochange
---

# Allow access to Azure Event Hubs namespaces from specific virtual networks 
Azure Event Hubs provides a secure and scalable messaging platform for cloud-based solutions. By integrating Event Hubs with Azure Virtual Network service endpoints, you can enhance security by isolating messaging services from public internet access. This guide explains how to configure virtual network rules, enable private communication between workloads, and implement advanced security scenarios for your Event Hubs namespaces. Whether you're using the Azure portal, Resource Manager templates, CLI, or PowerShell, this article provides step-by-step instructions to help you securely bind Event Hubs to virtual networks.

## Overview
The integration of Event Hubs with [Virtual Network service endpoints][vnet-sep] enables secure access to messaging capabilities from workloads such as virtual machines that are bound to virtual networks, with the network traffic path being secured on both ends. 

Once configured to bind to at least one virtual network subnet service endpoint, the respective Event Hubs namespace accepts traffic only from authorized subnets in virtual networks. From the virtual network perspective, binding an Event Hubs namespace to a service endpoint creates an isolated networking tunnel from the virtual network subnet to the messaging service. 

The result is a private and isolated relationship between the workloads bound to the subnet and the respective Event Hubs namespace, even though the observable network address of the messaging service endpoint is in a public IP range. There's an exception to this behavior. By default, enabling a service endpoint activates the `denyall` rule in the [IP firewall](event-hubs-ip-filtering.md) associated with the virtual network. You can add specific IP addresses in the IP firewall to enable access to the Event Hubs public endpoint. 

## Important points
- This feature isn't supported in the **basic** tier.
- Enabling virtual networks for your Event Hubs namespace blocks incoming requests by default unless requests originate from a service operating from allowed virtual networks. Blocked requests include the requests from other Azure services, the Azure portal, logging and metrics services, and so on. As an exception, you can allow access to Event Hubs resources from certain **trusted services** even when virtual networks are enabled. For a list of trusted services, see [Trusted services](#trusted-microsoft-services).
- Specify **at least one IP rule or virtual network rule** for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network. If there are no IP and virtual network rules, the namespace is accessible over the public internet (using the access key).  

## Advanced security scenarios enabled by virtual network integration 

Solutions that require tight and compartmentalized security, and where virtual network subnets provide the segmentation between the compartmentalized services, still need communication paths between services residing in those compartments.

Any immediate IP route between the compartments, including those carrying HTTPS over TCP/IP, carries the risk of exploitation of vulnerabilities from the network layer on up. Messaging services provide insulated communication paths, where messages are even written to disk as they transition between parties. Workloads in two distinct virtual networks that are both bound to the same Event Hubs instance can communicate efficiently and reliably via messages, while the respective network isolation boundary integrity is preserved.
 
This behavior means your security-sensitive cloud solutions gain access to Azure's reliable, scalable asynchronous messaging capabilities. Messaging creates communication paths between secure solution compartments that are inherently more secure than peer-to-peer communication modes, including HTTPS and other TLS-secured protocols.

## Bind Event Hubs to virtual networks

**Virtual network rules** are the firewall security feature that controls whether your Azure Event Hubs namespace accepts connections from a particular virtual network subnet.

Binding an Event Hubs namespace to a virtual network involves two steps:  
1. Create a **virtual network service endpoint** on a virtual network's subnet and enable it for **Microsoft.EventHub**. See the [service endpoint overview][vnet-sep] for details.  
2. Bind the Event Hubs namespace to the service endpoint using a **virtual network rule**.

The virtual network rule is an association of the Event Hubs namespace with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Event Hubs namespace. Event Hubs doesn't establish outbound connections, doesn't need access, and isn't granted access to your subnet when you enable this rule.

## Use Azure portal
When creating a namespace, you can choose between:  
- **Public access**: Allows access from all networks.  
- **Private access**: Restricts access to private endpoints only.  

After creating the namespace, you can further refine access by specifying IP addresses or virtual networks using network service endpoints.

### Configure public access when creating a namespace
To enable public access, select **Public access** on the **Networking** page in the namespace creation wizard. 

:::image type="content" source="./media/event-hubs-firewall/create-namespace-public-access.png" alt-text="Screenshot of the Networking page in the Create namespace wizard with Public access selected.":::

After creating the namespace, select **Networking** from the left menu of the **Service Bus Namespace** page. The **All Networks** option is selected by default. You can select **Selected Networks** to allow access from specific IP addresses or virtual networks. The next section provides you details on specifying the networks from which the access is allowed. 

### Configure selected networks for an existing namespace
This section shows you how to use Azure portal to add a virtual network service endpoint. To limit access, you need to integrate the virtual network service endpoint for this Event Hubs namespace.

1. Navigate to your **Event Hubs namespace** in the [Azure portal](https://portal.azure.com).
4. Select **Networking** under **Settings** on the left menu. 
1. On the **Networking** page, for **Public network access**, you can set one of the three following options. Choose **Selected networks** option to allow access only from specific virtual networks.

    Here are more details about options available in the **Public network access** page:
    - **Disabled**. This option disables any public access to the namespace. The namespace is accessible only through [private endpoints](private-link-service.md). 
    - **Selected networks**. This option enables public access to the namespace using an access key from selected networks. 

        > [!IMPORTANT]
        > If you choose **Selected networks**, add at least one IP firewall rule or a virtual network that can access your namespace. Choose **Disabled** if you want to restrict all traffic to this namespace over [private endpoints](private-link-service.md) only.
    - **All networks** (default). This option enables public access from all networks using an access key. If you select the **All networks** option, the event hub accepts connections from any IP address (using the access key). This setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range. 
1. To restrict access to specific networks, choose the **Selected Networks** option at the top of the page if it isn't already selected.
2. In the **Virtual networks** section of the page, select **+Add existing virtual network***. Select **+ Create new virtual network** if you want to create a new virtual network. 

    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/add-vnet-menu.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/add-vnet-menu.png" alt-text="Selection of Add existing virtual network menu item.":::

    > [!IMPORTANT]
    > If you choose **Selected networks**, add at least one IP firewall rule or a virtual network that can access your namespace. Choose **Disabled** if you want to restrict all traffic to this namespace over [private endpoints](private-link-service.md) only.
3. Select the virtual network from the list of virtual networks, and then pick the **subnet**. You have to enable the service endpoint before adding the virtual network to the list. If the service endpoint isn't enabled, the portal prompts you to enable it.
   
    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/select-subnet.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/select-subnet.png" alt-text="Image showing the selection of a subnet.":::
4. You see a success message after enabling the service endpoint for the subnet for **Microsoft.EventHub**. Select **Add** at the bottom of the page to add the network. 

    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/subnet-service-endpoint-enabled.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/subnet-service-endpoint-enabled.png" alt-text="Image showing the selection of a subnet and enabling an endpoint.":::

    > [!NOTE]
    > If you're unable to enable the service endpoint, you can ignore the missing virtual network service endpoint using the Resource Manager template. This functionality isn't available on the portal.
5. Specify whether you want to **allow trusted Microsoft services to bypass this firewall**. See [Trusted Microsoft services](#trusted-microsoft-services) for details. 
6. Select **Save** on the toolbar to save the settings. Wait a few minutes for the confirmation to appear in the portal notifications.

    :::image type="content" source="./media/event-hubs-tutorial-vnet-and-firewalls/save-vnet.png" lightbox="./media/event-hubs-tutorial-vnet-and-firewalls/save-vnet.png" alt-text="Image showing the saving of virtual network.":::

    > [!NOTE]
    > To restrict access to specific IP addresses or ranges, see [Allow access from specific IP addresses or ranges](event-hubs-ip-filtering.md).

    > [!NOTE]
    > To delete a Virtual Network rule, first remove any Azure Resource Manager delete lock on the Virtual Network.

[!INCLUDE [event-hubs-trusted-services](./includes/event-hubs-trusted-services.md)]

## Use Resource Manager template
This sample Resource Manager template adds a virtual network rule to an existing Event Hubs namespace. It specifies the ID of a subnet in a virtual network for the network rule. 

The ID is a fully qualified Resource Manager path for the virtual network subnet. For example: `/subscriptions/{id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/default`.

When adding virtual network or firewall rules, set the value of `defaultAction` to `Deny`.


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
> If there are no IP or virtual network rules, all traffic flows into the namespace even if you set the `defaultAction` to `Deny`. The namespace is accessible over the public internet (using the access key). Specify at least one IP rule or virtual network rule for the namespace to allow traffic only from the specified IP addresses or subnet of a virtual network.  

## Use Azure CLI
Use the [`az eventhubs namespace network-rule-set`](/cli/azure/eventhubs/namespace/network-rule-set) add, list, update, and remove commands to manage virtual network rules for a Service Bus namespace.

## Use Azure PowerShell
Use the following Azure PowerShell commands to add, list, update, and delete network rules for a Service Bus namespace. 

- [`Add-AzEventHubVirtualNetworkRule`](/powershell/module/az.eventhub/add-azeventhubvirtualnetworkrule) to add a virtual network rule.
- Use [`New-AzEventHubVirtualNetworkRuleConfig`](/powershell/module/az.eventhub/new-azeventhubipruleconfig) and [`Set-AzEventHubNetworkRuleSet`](/powershell/module/az.eventhub/set-azeventhubnetworkruleset) together to add a virtual network rule.
- [`Remove-AzEventHubVirtualNetworkRule`](/powershell/module/az.eventhub/remove-azeventhubvirtualnetworkrule) to remove a virtual network rule.


## Default action and public network access 

### REST API

The default value of the `defaultAction` property is `Deny` for API version **2021-01-01-preview and earlier**. However, the deny rule isn't enforced unless IP filters or virtual network rules are set. That is, if you didn't have any IP filters or virtual network rules, it's treated as `Allow`. 

Starting with API version **2021-06-01-preview**, the default value of the `defaultAction` property is `Allow` to accurately reflect the service-side enforcement. If the default action is set to `Deny`, IP filters and virtual network rules are enforced. If the default action is set to `Allow`, IP filters and virtual network rules aren't enforced. The service remembers the rules when you turn them off and then back on again. 

The API version **2021-06-01-preview onwards** also introduces a new property named `publicNetworkAccess`. If it's set to `Disabled`, operations are restricted to private links only. If it's set to `Enabled`, operations are allowed over the public internet. 

For more information about these properties, see [Create or Update Network Rule Set](/rest/api/eventhub/namespaces/create-or-update-network-rule-set) and [Create or Update Private Endpoint Connections](/rest/api/eventhub/private-endpoint-connections/create-or-update).

> [!NOTE]
> None of the above settings bypass validation of claims via SAS or Microsoft Entra authentication. The authentication check always runs after the service validates the network checks that are configured by `defaultAction`, `publicNetworkAccess`, `privateEndpointConnections` settings.

### Azure portal

The Azure portal always uses the latest API version to get and set properties. If you had previously configured your namespace using **2021-01-01-preview and earlier** with `defaultAction` set to `Deny`, and specified zero IP filters and virtual network rules, the portal would have previously checked **Selected Networks** on the **Networking** page of your namespace. Now, it checks the **All networks** option. 

:::image type="content" source="./media/event-hubs-firewall/firewall-all-networks-selected.png" lightbox="./media/event-hubs-firewall/firewall-all-networks-selected.png" alt-text="Screenshot of the Public access page with the All networks option selected.":::


## Next steps

Explore more about virtual networks:  
- [Azure virtual network service endpoints][vnet-sep]  
- [Azure Event Hubs IP filtering][ip-filtering]  

Use these resources to deepen your understanding and implement secure networking for Event Hubs.

[vnet-sep]: ../virtual-network/virtual-network-service-endpoints-overview.md
[lnk-deploy]: ../azure-resource-manager/templates/deploy-powershell.md
[ip-filtering]: event-hubs-ip-filtering.md
