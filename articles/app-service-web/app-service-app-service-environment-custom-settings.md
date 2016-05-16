<properties
	pageTitle="Custom settings for App Service Environments"
	description="Custom configuration settings for App Service Environments"
	services="app-service"
	documentationCenter=""
	authors="stefsch"
	manager="nirma"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/08/2016"
	ms.author="stefsch"/>

# Custom configuration settings for App Service Environments

## Overview ##
Because App Service Environments are isolated to a single customer, there are certain configuration settings that can be applied exclusively to App Service Environments. This article documents the various specific customizations that are available for App Service Environments.

You can store App Service Environment customizations by using an array in the new **clusterSettings** attribute. This attribute is found in the "Properties" dictionary of the *hostingEnvironments* Azure Resource Manager entity.

The following abbreviated Resource Manager template snippet shows the **clusterSettings** attribute:


    "resources": [
    {
       "apiVersion": "2015-08-01",
       "type": "Microsoft.Web/hostingEnvironments",
       "name": ...,
       "location": ...,
       "properties": {
          "clusterSettings": [
             {
                 "name": "nameOfCustomSetting",
                 "value": "valueOfCustomSetting"
             }
          ],
          "workerPools": [ ...],
          etc...
       }
    }

The **clusterSettings** attribute can be included in a Resource Manager template to update the App Service Environment.

## Use Azure Resource Explorer to update an App Service Environment
Alternatively, you can update the App Service Environment by using [Azure Resource Explorer](https://resources.azure.com).  

1. In Resource Explorer, go to the node for the App Service Environment (**subscriptions** > **resourceGroups** > **providers** > **Micrososft.Web** > **hostingEnvironments**). Then click the specific App Service Environment that you want to update.

2. In the right pane, click **Read/Write** in the upper toolbar to allow interactive editing in Resource Explorer.  

3. Click the blue **Edit** button to make the Resource Manager template editable.

4. Scroll to the bottom of the right pane. The **clusterSettings** attribute is at the very bottom, where you can enter or update its value.

5. Type (or copy and paste) the array of configuration values you want in the **clusterSettings** attribute.  

6. Click the green **PUT** button that's located at the top of the right pane to commit the change to the App Service Environment.

However you submit the change, it takes roughly 30 minutes multiplied by the number of front ends in the App Service Environment for the change to take effect.
For example, if an App Service Environment has four front ends, it will take roughly two hours for the configuration update to finish. While the configuration change is being rolled out, no other scaling operations or configuration change operations can take place in the App Service Environment.

## Disable TLS 1.0 ##
A recurring question from customers, especially customers who are dealing with PCI compliance audits, is how to explicitly disable TLS 1.0 for their apps.

TLS 1.0 can be disabled through the following **clusterSettings** entry:

        "clusterSettings": [
            {
                "name": "DisableTls1.0",
                "value": "1"
            }
        ],



## Get started
The Azure Quickstart Resource Manager template site includes a template with the base definition for [creating an App Service Environment](https://azure.microsoft.com/documentation/templates/201-web-app-ase-create/).


<!-- LINKS -->

<!-- IMAGES -->
