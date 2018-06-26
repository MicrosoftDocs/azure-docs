---
title: "Virtual Network service endpoints and rules for Azure Service Bus | Microsoft Docs"
description: "Add a Microsoft.ServiceBus service endpoint to a Virtual Network. Then add the endpoint as a virtual network rule to your Azure Service Bus. You Service Bus then accepts communication from all virtual machines and other nodes on the subnet."
services: service-bus
ms.service: service-bus
author: ClemensV
ms.custom: "VNet Service endpoints"
ms.topic: article
ms.date: 04/19/2018
ms.author: clemensv
---
# Use Virtual Network service endpoints with Azure Service Bus

The integration of Service Bus with [Virtual Network (VNet) Service Endpoints][vnet-sep] enables secure access to messaging capabilities from workloads like virtual machines that are bound to virtual networks, with the network traffic path being secured on both ends. 

Once configured to be bound to at least one virtual network subnet's Service Endpoint, the respective Service Bus namespace will no longer accept traffic from anywhere but authorized virtual network(s). From the virtual network perspective, binding a Service Bus namespace to a service endpoint will configure an isolated networking tunnel from the virtual network subnet to the messaging service.

The result is a private and isolated relationship between the workloads bound to the subnet and the respective Service Bus namespace, in spite of the observable network address of the messaging service endpoint being in a public IP range.

## Advanced security scenarios enabled by VNet integration 

Solutions that require tight and compartmentalized security, and where virtual network subnets provide the segmentation between the compartmentalized services, generally still need communication paths between services residing in those compartments.

Any immediate IP route between the compartments, including those carrying HTTPS over TCP/IP, carries the risk of exploitation of vulnerabilities from the network layer on up. Messaging services provide completely insulated communication paths, where messages are even written to disk as they transition between parties. Workloads in two distinct virtual networks that are both bound to the same Service Bus can communicate efficiently and reliably via messages, while the respective network isolation boundary integrity is completely preserved.
 
That means your security sensitive cloud solutions not only gain access to Azure’s industry-leading reliable and  scalable asynchronous messaging capabilities, but they can now use messaging to create communication paths between secure solution compartments that are inherently more secure than what’s achievable with any peer-to-peer communication mode, including HTTPS and other TLS-secured socket protocols.

## Binding Service Bus to Virtual Networks

*Virtual network rules* are the firewall security feature that controls whether your Azure Service Bus server accepts connections from a particular virtual network subnet.

Binding a Service Bus namespace to a virtual network is a two-step process. You first need to create a **Virtual Network service endpoint** on a Virtual Network subnet and enable it for "Microsoft.ServiceBus" as explained in the [service endpoint overview][vnet-sep]. Once you have added the service endpoint, you need to bind the Service Bus namespace to it with a *virtual network rule*.

The virtual network rule is a named association of the Service Bus namespace with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Service Bus namespace. Mind that Service Bus itself does never establish outbound connections, and therefore does not need to gain access and is therefore never granted access to your subnet by enabling this rule.

### Creating a virtual network rule with ARM templates

The following ARM template allows adding a virtual network rule to an existing Service Bus 
namespace.

Template parameters:

* **namespaceName**: Service Bus namespace
* **vnetRuleName**: Name for the Virtual Network rule to be created
* **virtualNetworkingSubnetId**: Fully qualified ARM path for the virtual network subnet, e.g. */subscriptions/{id}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/default* for the default subnet of a virtual network.

Template:

``` json
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
				"description":"subnet ARM Id"
			 }
		  }
	  },
	"resources": [
        {
            "apiVersion": "2018-01-01-preview",
            "name": "[concat(parameters('namespaceName'), '/', parameters('vnetRuleName'))]",
            "type":"Microsoft.ServiceBus/namespaces/VirtualNetworkRules",			
            "properties": {			    
                "virtualNetworkSubnetId": "[parameters('virtualNetworkSubnetId')]"	
            }
        } 
    ]
}
```

To deploy the template follow the instructions for [Azure Resource Manager][lnk-deploy].

## Related articles

- [Azure virtual network service endpoints][vnet-sep]
- [Azure Service Bus IP filtering][ip-filtering]

[vnet-sep]: ../virtual-network/virtual-network-service-endpoints-overview
[lnk-deploy]: ../azure-resource-manager/resource-group-template-deploy
[ip-filtering]: service-bus-ip-filtering