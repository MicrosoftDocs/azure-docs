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

# Custom Configuration Settings for App Service Environments

## Overview ##
Since App Service Environments are isolated to a single customer, there are certain configuration settings that can be applied exclusively to an App Service Environment.  This article documents the various App Service Environment specific customizations that are available.

App Service Environment customizations are stored using an array in the new attribute "clusterSettings" found in the "Properties" dictionary of the *hostingEnvironments* ARM entity.

An abbreviated ARM template snippet (below) shows the "clusterSettings" attribute:


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

The "clusterSettings" attribute can be included in an ARM template to update the App Service Environment.

Alternatively the attribute value can be updated using the [Azure Resource Explorer](https://resources.azure.com).  In Azure Resource Explorer, navigate to the node for the App Service Environment (subscriptions --> resourceGroups --> providers --> Micrososft.Web --> hostingEnvironments) and click on the specific App Service Environment to be updated.

In the right-hand browser window, click "Read/Write" in the upper toolbar to allow interactive editing in the Resource Explorer.  Then click the blue "Edit" button to make the ARM template editable.  Scroll all the way to the bottom of the right-hand browser window.  The "clusterSettings" attribute will be at the very bottom where you can enter or update its value.

Type in (or copy and paste) the array of configuration value(s) you want in the "clusterSettings" attribute.  Then click the green "PUT" button located at the top of the right-hand browser window to commit the change to the App Service Environment.

Regardless of the approach taken to update the App Service Environment, once the change is submitted it will take roughly 30 minutes multiplied by the number of front-ends in the App Service Environment for the change to take effect.  For example if an App Service Environment has four front-ends, it will take roughly two hours for the configuration update to complete.  While the configuration change is being rolled out, no other scaling operations or configuration change operations will be possible on the App Service Environment.

## Disabling TLS 1.0 ##
A recurring ask from customers, especially customers dealing with PCI compliance audits, is the ability to explicitly disable TLS 1.0 for their apps.

TLS 1.0 can be disabled with the following *clusterSettings* entry:

        "clusterSettings": [
            {
                "name": "DisableTls1.0",
                "value": "1"
            }
        ],



## Getting started
The Azure Quickstart ARM template site includes a template with the base definition for [creating an App Service Environment](https://azure.microsoft.com/documentation/templates/201-web-app-ase-create/)


<!-- LINKS -->

<!-- IMAGES -->
 
