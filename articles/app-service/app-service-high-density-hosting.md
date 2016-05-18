<properties 
	pageTitle="High Density Hosting on Azure App Service" 
	description="High Density Hosting on Azure App Service" 
	authors="btardif" 
	manager="wpickett" 
	editor="" 
	services="app-service\web" 
	documentationCenter=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="05/17/2016" 
	ms.author="byvinyal"/>

#High Density Hosting on Azure App Service#

##Understanding app scaling##

When using App Service, your application will be decoupled from the capacity 
allocated to it by 2 concepts:
 
>**The Application:** Represents the App and its runtime configuration. For 
example what version of .NET should the runtime load? what are the App 
Settings? etc.

>**The App Service Plan:** Defines the characteristics of the capacity, 
available feature set and locality of the application. For example Large (4 
Cores) machine, 4 instances, premium features in East US

An app is always linked to an **App Service Plan** but an **App Service Plan** 
can provide capacity to one or more apps.

What this means is that the platform provides the flexibility to isolate a 
single app, or have multiple apps share resources by sharing an 
**App Service Plan**.

However, when multiple apps share an **App Service Plan**, there will be an 
instance of that app running on each and every instance of that 
**App Service Plan**.

##Per App scaling##
**Per App scaling** is a features that can be enabled at the 
**App Service Plan** level and then leveraged per application.

**Per App Scaling** allows you to scale an app independently of the 
**App Service Plan** being used to host it. This way, an **App Service Plan** 
can be configured to provide 10 instances, but an app can be set to scale to 
only 5 of them.

The ARM template below will create an **App Service Plan** scaled out to 10 
instances and an app configured to use **Per App scaling** and only scale to 
5 instances.

To do this, the App Service Plan is setting the per site scaling property is 
set to true ( `"perSiteScaling": true`) and the App is setting the number of 
workers to use to 1 `"properties": { "numberOfWorkers": "1" }`

    {
        "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters":{
            "appServicePlanName": { "type": "string" },
            "appName": { "type": "string" }
         },
        "resources": [
        {
            "comments": "App Service Plan with per site perSiteScaling = true",
            "type": "Microsoft.Web/serverFarms",
            "sku": {
                "name": "S1",
                "tier": "Standard",
                "size": "S1",
                "family": "S",
                "capacity": 10
                },
            "name": "[parameters('appServicePlanName')]",
            "apiVersion": "2015-08-01",
            "location": "West US",
            "properties": {
                "name": "[parameters('appServicePlanName')]",
                "perSiteScaling": true 
            }
        },
        {
            "type": "Microsoft.Web/sites",
            "name": "[parameters('appName')]",
            "apiVersion": "2015-08-01-preview",
            "location": "West US",
            "dependsOn": [ "[resourceId('Microsoft.Web/serverFarms', parameters('appServicePlanName'))]" ],
            "properties": { "serverFarmId": "[resourceId('Microsoft.Web/serverFarms', parameters('appServicePlanName'))]" },
            "resources": [ {
                    "comments": "",
                    "type": "config",
                    "name": "web",
                    "apiVersion": "2015-08-01",
                    "location": "West US",
                    "dependsOn": [ "[resourceId('Microsoft.Web/Sites', parameters('appName'))]" ],
                    "properties": { "numberOfWorkers": "1" }
             } ]
         }]
    }


##Recommended configuration for High Density Hosting##

**Per App scaling** is a feature that is enabled in both public Azure regions 
as well as in App Service Environments, however the recommended strategy is to 
use App Service Environments to leverage their advanced features and the larger 
pools of capacity.  

Follow the steps listed below as a guideline on how to configure 
**High Density Hosting** for your apps.

1. Configure the **App Service Environment** and choose a **worker pool** that 
will be dedicated to the *high density hosting* scenario.

1. Create a single **App Service Plan** and scale it to use all the available 
capacity on the **worker pool**.

1. Set per site Scaling flag to true on the **App Service Plan**.

1. New sites are created and assigned to that **App Service Plan** with the 
*numberOfWorkers* property set to *1*. This would yield the highest density 
possible on this **worker pool**

1. The number of workers can be configured independently per site, to grant 
additional resources as needed. For example, a high use site could set 
*numberOfWorkers* to *3* to have more processing capacity for that app, while 
low use sites would set *numberOfWorkers* to *1*.