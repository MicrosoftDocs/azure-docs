---
title: Azure Service Bus IP connection filters | Microsoft Docs
description: How to use IP filtering to block connections from specific IP addresses for to Azure Service Bus. You can block connections from individual or ranges of IP addresses.
services: service-bus
documentationcenter: ''
author: clemensv
manager: timlt
editor: ''

ms.assetid: f833eac3-5b5f-46a7-a47b-f4f6fc927f3f
ms.service: service-bus
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/23/2018
ms.author: clemensv

---

# Use IP filters

In scenarios where Service Bus shall only be accessible from certain well-known sites, the _IP filter_ feature enables you to configure rules for rejecting or accepting traffic originating from specific IPv4 addresses. These addresses may, for instance, be those of a corporate NAT gateway.

## When to use

There are two specific use-cases when it is useful to block the Service Bus endpoints for certain IP addresses:

- Your Service Bus should receive traffic only from a specified range of IP addresses and reject everything else. For example, you are using Service Bus with [Azure Express Route] to create private connections to your on-premises infrastructure.
- You need to reject traffic from IP addresses that have been identified as suspicious by the Service Bus administrator.

## How filter rules are applied

The IP filter rules are applied at the Service Bus namespace level. Therefore the rules apply to all connections from clients using any supported protocol.

Any connection attempt from an IP address that matches a rejecting IP rule on the Service Bus namespace is rejected as unauthorized. The response does not mention the IP rule.

## Default setting

By default, the **IP Filter** grid in the portal for Service Bus is empty. This default setting means that your hub accepts connections any IP address. This default setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range.

## IP filter rule evaluation

IP filter rules are applied in order and the first rule that matches the IP address determines the accept or reject action.

For example, if you want to accept addresses in the range 70.37.104.0/24 and reject everything else, the first rule in the grid should accept the address range 70.37.104.0/24. The next rule should reject all addresses by using the range 0.0.0.0/0.

> [!NOTE]
> Rejecting IP addresses can prevent other Azure Services (such as Azure Stream Analytics, Azure Virtual Machines, or the Device Explorer in the portal) from interacting with Event Hubs.


### Creating a virtual network rule with ARM templates

The following ARM template allows adding a virtual network rule to an existing Event Hubs 
namespace.

Template parameters:

- **ipFilterRuleName** must be a unique, case-insensitive, alphanumeric string up to 128 characters long.
- **ipFilterAction** is either **Reject** or **Accept** as the action to apply for the IP filter rule.
- **ipMask** is a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 70.37.104.0/24 represents the 256 IPv4 addresses from 70.37.104.0 to 70.37.104.255, with 24 indicating the number of significant prefix bits for the range.

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
		  "ipFilterRuleName":{  
			 "type":"string",
			 "metadata":{  
				"description":"Name of the Authorization rule"
			 }
		  },
		  "ipFilterAction":{  
			 "type":"string",
			 "allowedValues": ["Reject", "Accept"],
			 "metadata":{  
				"description":"IP Filter Action"
			 }
		  },
		  "IpMask":{  
			 "type":"string",
			 "metadata":{  
				"description":"IP Mask"
			 }
		  }
	  },
	"resources": [
        {
            "apiVersion": "2018-01-01-preview",
            "name": "[concat(parameters('namespaceName'), '/', parameters('ipFilterRuleName'))]",
            "type": "Microsoft.ServiceBus/Namespaces/IPFilterRules",
            "properties": {
				"FilterName":"[parameters('ipFilterRuleName')]",
				"Action":"[parameters('ipFilterAction')]",				
                "IpMask": "[parameters('IpMask')]"
            }
        } 
    ]
}
```

To deploy the template follow the instructions for [Azure Resource Manager][lnk-deploy].

## Next steps

For constraining access to Service Bus to Azure virtual networks see

- [Virtual Network Service Endpoints for Service Bus][lnk-vnet]

<!-- Links -->

[Azure Express Route]:  https://azure.microsoft.com/documentation/articles/expressroute-faqs/#supported-services
[lnk-deploy]: ../azure-resource-manager/resource-group-template-deploy
[lnk-vnet]: service-bus=service-endpoints.md