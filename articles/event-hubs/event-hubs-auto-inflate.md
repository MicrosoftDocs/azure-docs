---
title: Automatically Scale-up your Azure Event Hubs Throughput Units | Microsoft Docs
description: Enable auto-inflate on your namespace to automatically scale-up your throughput units
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/08/2017
ms.author: shvija
---

# Automatically Scale-up your Azure Event Hubs Throughput Units

## Overview
Event Hubs customers increase their usage after onboarding on to the service. This requires increasing the predetermined throughput units to scale your Event Hubs to handle greater transfer rates. Auto-inflate feature of Event Hubs automatically scales up the number of Throughput Units (TU) to meet usage needs. This prevents throttling scenarios, where

* data ingress rates exceed set Throughput Units
* data egress request rates exceed set Throughput Units

## How does Auto-Inflate work?
Event Hubs traffic is controlled by throughput units. A single throughput unit allows 1 MB per second of ingress and twice that amount of egress. Standard Event Hubs can be configured with 1-20 throughput units. Auto-Inflate lets you start small with minimum required throughput units and lets you scale-up automatically to the limit you want the number of throughput units you want to grow to, depending on the increase in your traffic. This gives the following benefits:
1.	This provides an efficient scaling mechanism to start small and scale-up as you grow
2.	Once enabled, you can automatically scale-up to the specified upper limit without hitting throttling issues
3.	Gives you more control on scaling as you control when and how much to scale

## How do I enable Auto-Inflate on my namespace?
You can enable or disable Auto-Inflate on your namespace,
1.	Through the portal (this will be available starting June 12 2017)
2.	Through Azure Resource Manager template

### Enabling Auto-Inflate through the portal
You can enable the auto-Inflate feature on your namespace when creating your Event Hubs namespace 
![](./media/event-hubs-auto-inflate/event-hubs-auto-inflate1.png)

With this option turned on, you can start small on your throughput units and scale-up as your usage need increases. The upper limit for inflation does not affect your pricing as pricing depends on the number of TUs being using for the hour.
You can also enable the auto-inflate using the Scale option on your settings blade in the portal 
![](./media/event-hubs-auto-inflate/event-hubs-auto-inflate2.png)

### Enabling Auto-Inflate using Azure Resource Manager template
Auto-inflate can be enabled while deploying using Azure Resource Manager template. By setting the 
"isAutoInflateEnabled": true property and specifying the maximum throughput units that you want to inflate up to as, "maximumThroughputUnits": 10.
```json
"resources": [
        {
            "apiVersion": "2017-04-01",
            "name": "[parameters('namespaceName')]",
            "type": "Microsoft.EventHub/Namespaces",
            "location": "[variables('location')]",
            "sku": {
                "name": "Standard",
                "tier": "Standard"
            },
            "properties": {
                "isAutoInflateEnabled": true,
                "maximumThroughputUnits": 10
            },
            "resources": [
                {
                    "apiVersion": "2017-04-01",
                    "name": "[parameters('eventHubName')]",
                    "type": "EventHubs",
                    "dependsOn": [
                        "[concat('Microsoft.EventHub/namespaces/', parameters('namespaceName'))]"
                    ],
                    "properties": {},
                    "resources": [
                        {
                            "apiVersion": "2017-04-01",
                            "name": "[parameters('consumerGroupName')]",
                            "type": "ConsumerGroups",
                            "dependsOn": [
                                "[parameters('eventHubName')]"
                            ],
                            "properties": {}
                        }
                    ]
                }
            ]
        }
    ]
```
 For the complete template, see [Create Event Hubs namespace and enable inflate](https://github.com/Azure/azure-quickstart-templates/tree/master/201-eventhubs-create-namespace-and-enable-inflate) template on GitHub.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an Event Hub](event-hubs-create.md)


