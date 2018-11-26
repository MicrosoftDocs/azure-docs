---
title: Azure Event Hubs Firewalls | Microsoft Docs
description: Use Firewalls to allow connections from specific IP addresses to Azure Event Hubs. 
services: event-hubs
documentationcenter: ''
author: spelluru
manager: timlt

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.date: 10/08/2018
ms.author: spelluru

---

# Use Firewalls

For scenarios in which Azure Event Hubs should be only accessible from certain well-known sites, firewalls enable you to configure rules for accepting traffic originating from specific IPv4 addresses. For example, these addresses may be those of a corporate NAT gateway.

## When to use

If you are looking to setup your Event Hubs namespace such that it should receive traffic from only a specified range of IP addresses and reject everything else, then you can leverage a *Firewall* to block Event Hub endpoints from other IP addresses.For example, you are using Event Hubs with [Azure Express Route][express-route] to create private connections to your on-premises infrastructure. 

## How filter rules are applied

The IP filter rules are applied at the Event Hubs namespace level. Therefore, the rules apply to all connections from clients using any supported protocol.

Any connection attempt from an IP address that does not match an allowed IP rule on the Event Hubs namespace is rejected as unauthorized. The response does not mention the IP rule.

## Default setting

By default, the **IP Filter** grid in the portal for Event Hubs is empty. This default setting means that your event hub accepts connections from any IP address. This default setting is equivalent to a rule that accepts the 0.0.0.0/0 IP address range.

## IP filter rule evaluation

IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.

> [!NOTE]
> Rejecting IP addresses can prevent other Azure services (such as Azure Stream Analytics, Azure Virtual Machines, or the Device Explorer in the portal) from interacting with Event Hubs.

### Creating a Firewall rule with Azure Resource Manager templates

> [!IMPORTANT]
> Virtual networks are supported in **standard** and **dedicated** tiers of Event Hubs. It's not supported in basic tier. 

The following Resource Manager template enables adding an IP filter rule to an existing Event Hubs namespace.

Template parameters:

- **ipFilterRuleName** must be a unique, case-insensitive, alphanumeric string, up to 128 characters long. This is optional and is auto-generated on creation.
- **ipFilterAction** currently supports **Accept** as the action to apply for the IP filter rule.
- **ipMask** is a single IPv4 address or a block of IP addresses in CIDR notation. For example, in CIDR notation 70.37.104.0/24 represents the 256 IPv4 addresses from 70.37.104.0 to 70.37.104.255, with 24 indicating the number of significant prefix bits for the range.

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
            "type": "Microsoft.EventHub/Namespaces/IPFilterRules",
            "properties": {
				"FilterName":"[parameters('ipFilterRuleName')]",
				"Action":"[parameters('ipFilterAction')]",				
                "IpMask": "[parameters('IpMask')]"
            }
        } 
    ]
}
```

To deploy the template, follow the instructions for [Azure Resource Manager][lnk-deploy].

## Next steps

For constraining access to Event Hubs to Azure virtual networks, see the following link:

- [Virtual Network Service Endpoints for Event Hubs][lnk-vnet]

<!-- Links -->

[express-route]:  /azure/expressroute/expressroute-faqs#supported-services
[lnk-deploy]: ../azure-resource-manager/resource-group-template-deploy.md
[lnk-vnet]: event-hubs-service-endpoints.md