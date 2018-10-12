---
title: Virtual Network service endpoints and rules for Azure Event Hubs | Microsoft Docs
description: Add a Microsoft.EventHub service endpoint to a virtual network. 
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.date: 08/16/2018
ms.author: shvija

---

# Use Virtual Network service endpoints with Azure Event Hubs

The integration of Event Hubs with [Virtual Network (VNet) Service Endpoints][vnet-sep] enables secure access to messaging capabilities from workloads such as virtual machines that are bound to virtual networks, with the network traffic path being secured on both ends. 

> [!IMPORTANT]
> Virtual networks are supported in **standard** and **dedicated** tiers of Event Hubs. It's not supported in basic tier. 

Once configured to be bound to at least one virtual network subnet service endpoint, the respective Event Hubs namespace no longer accepts traffic from anywhere but authorized virtual network(s). From the virtual network perspective, binding an Event Hubs namespace to a service endpoint configures an isolated networking tunnel from the virtual network subnet to the messaging service.

The result is a private and isolated relationship between the workloads bound to the subnet and the respective Event Hubs namespace, in spite of the observable network address of the messaging service endpoint being in a public IP range.

## Advanced security scenarios enabled by VNet integration 

Solutions that require tight and compartmentalized security, and where virtual network subnets provide the segmentation between the compartmentalized services, generally still need communication paths between services residing in those compartments.

Any immediate IP route between the compartments, including those carrying HTTPS over TCP/IP, carries the risk of exploitation of vulnerabilities from the network layer on up. Messaging services provide completely insulated communication paths, where messages are even written to disk as they transition between parties. Workloads in two distinct virtual networks that are both bound to the same Event Hubs instance can communicate efficiently and reliably via messages, while the respective network isolation boundary integrity is preserved.
 
That means your security sensitive cloud solutions not only gain access to Azure industry-leading reliable and scalable asynchronous messaging capabilities, but they can now use messaging to create communication paths between secure solution compartments that are inherently more secure than what is achievable with any peer-to-peer communication mode, including HTTPS and other TLS-secured socket protocols.

## Bind Event Hubs to Virtual Networks

*Virtual network rules* are the firewall security feature that controls whether your Azure Event Hubs server accepts connections from a particular virtual network subnet.

Binding an Event Hubs namespace to a virtual network is a two-step process. You first need to create a **Virtual Network service endpoint** on a Virtual Network subnet and enable it for "Microsoft.EventHub" as explained in the [service endpoint overview][vnet-sep]. Once you have added the service endpoint, you bind the Event Hubs namespace to it with a *virtual network rule*.

The virtual network rule is a named association of the Event Hubs namespace with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Event Hubs namespace. Event Hubs itself never establishes outbound connections, does not need to gain access, and is therefore never granted access to your subnet by enabling this rule.

### Create a virtual network rule with Azure Resource Manager templates

The following Resource Manager template enables adding a virtual network rule to an existing Event Hubs 
namespace.

Template parameters:

* **namespaceName**: Event Hubs namespace.
* **vnetRuleName**: Name for the Virtual Network rule to be created.
* **virtualNetworkingSubnetId**: Fully qualified Resource Manager path for the virtual network subnet; for example, `subscriptions/{id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/default` for the default subnet of a virtual network.

```json
{  
   "$schema":"http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
   "contentVersion":"1.0.0.0",
   "parameters":{	  
		  "namespaceName":{  
			 "type":"string",
			 "metadata":{  
				"description":"Name of the namespace"
			 }
		  },
		  "vnetRuleName":{  
			 "type":"string",
			 "metadata":{  
				"description":"Name of the Authorization rule"
			 }
		  },
		  "virtualNetworkSubnetId":{  
			 "type":"string",
			 "metadata":{  
				"description":"subnet Azure Resource Manager ID"
			 }
		  }
	  },
	"resources": [
        {
            "apiVersion": "2018-01-01-preview",
            "name": "[concat(parameters('namespaceName'), '/', parameters('vnetRuleName'))]",
            "type":"Microsoft.EventHub/namespaces/VirtualNetworkRules",			
            "properties": {			    
                "virtualNetworkSubnetId": "[parameters('virtualNetworkSubnetId')]"	
            }
        } 
    ]
}
```

To deploy the template, follow the instructions for [Azure Resource Manager][lnk-deploy].

## Next steps

For more information about virtual networks, see the following links:

- [Azure virtual network service endpoints][vnet-sep]
- [Azure Event Hubs IP filtering][ip-filtering]

[vnet-sep]: ../virtual-network/virtual-network-service-endpoints-overview.md
[lnk-deploy]: ../azure-resource-manager/resource-group-template-deploy.md
[ip-filtering]: event-hubs-ip-filtering.md