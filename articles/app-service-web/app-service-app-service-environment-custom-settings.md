<properties
	pageTitle="Custom Settings for App Service Environments"
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
Since App Service Environments are isolated to a single customer, there are certain configuration settings that can be applied exclusively to an App Service Environment. This article documents the various customizations that are available and specific to App Service Environments.

You can store App Service Environment customizations by using an array in the new attribute "clusterSettings". This attribute is found in the "Properties" dictionary of the *hostingEnvironments* Azure Resource Manager entity.

The following abbreviated Resource Manager template snippet shows the "clusterSettings" attribute:


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

The "clusterSettings" attribute can be included in a Resource Manager template to update the App Service Environment.

Alternatively, the attribute value can be updated by using [Azure Resource Explorer](https://resources.azure.com).  In Resource Explorer, go to the node for the App Service Environment (**subscriptions** --> **resourceGroups** --> **providers** --> **Micrososft.Web** --> **hostingEnvironments**), and then click the specific App Service Environment that you want to update.

In the right-hand browser window, click **Read/Write** in the upper toolbar to allow interactive editing in Resource Explorer.  Then click the blue **Edit** button to make the Resource Manager template editable.  Scroll all the way to the bottom of the right-hand browser window.  The "clusterSettings" attribute is at the very bottom where you can enter or update its value.

Type in (or copy and paste) the array of configuration value(s) you want in the "clusterSettings" attribute.  Then click the green **PUT** button that's located at the top of the right-hand browser window to commit the change to the App Service Environment.

Regardless of the approach that you take to update the App Service Environment, after the change is submitted, it takes roughly 30 minutes multiplied by the number of front ends in the App Service Environment for the change to take effect. For example, if an App Service Environment has four front ends, it will take roughly two hours for the configuration update to finish. While the configuration change is being rolled out, no other scaling operations or configuration change operations can take place in the App Service Environment.

## Disable TLS 1.0 ##
A recurring request from customers, especially those dealing with PCI compliance audits, is the ability to explicitly disable TLS 1.0 for their apps.

TLS 1.0 can be disabled with the following *clusterSettings* entry:

        "clusterSettings": [
            {
                "name": "DisableTls1.0",
                "value": "1"
            }
        ],



## Getting started
The Azure Quickstart Resource Manager template site includes a template with the base definition for [creating an App Service Environment](https://azure.microsoft.com/documentation/templates/201-web-app-ase-create/).


<!-- LINKS -->

<!-- IMAGES -->
