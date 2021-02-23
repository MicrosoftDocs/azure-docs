---
title: Azure Resource Manager Template Sample - App Service
description: Creates an App Service app with a public endpoint, and a Front Door profile.
services: frontdoor
author: johndowns
ms.author: jodowns
ms.service: frontdoor
ms.topic: sample
ms.date: 02/23/2021
---

# Create an Azure App Service app and Front Door

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

This sample template creates an App Service app as well as a Front Door profile, and uses the App Service's public IP address with [access restrictions](../../app-service/app-service-ip-restrictions.md) to enforce that incoming connections must come through Front Door.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Overview

This sample deploys:

- An App Service plan and application without private endpoints enabled.
- A Front Door profile, endpoint, origin group, and origin to direct traffic to the App Service application. This can be configured to use the standard or premium Front Door SKU types.
- [App Service access restrictions](../../app-service/app-service-ip-restrictions.md) to block access to the application unless they have come through Front Door. The traffic is checked to ensure it has come from the `AzureFrontDoor.Backend` service tag, and also that the `X-Azure-FDID` header is configured with your specific Front Door instance's ID.

The following diagram illustrates the components of this sample.

![Architecture diagram showing traffic inspected by App Service access restrictions.](../media/sample-app-service/diagram.png)

## Sample template

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "eastus"
    },
    "appName": {
      "type": "string",
      "defaultValue": "[format('app-{0}', uniqueString(resourceGroup().id))]"
    },
    "appServicePlanSkuName": {
      "type": "string",
      "defaultValue": "S1"
    },
    "appServicePlanCapacity": {
      "type": "int",
      "defaultValue": 1
    },
    "frontDoorEndpointName": {
      "type": "string",
      "defaultValue": "[format('myappsvc-{0}', uniqueString(resourceGroup().id))]"
    },
    "frontDoorSkuName": {
      "type": "string",
      "defaultValue": "Standard_AzureFrontDoor",
      "allowedValues": [
        "Standard_AzureFrontDoor",
        "Premium_AzureFrontDoor"
      ]
    }
  },
  "functions": [],
  "variables": {
    "appServicePlanName": "AppServicePlan",
    "frontDoorProfileName": "MyFrontDoor",
    "frontDoorOriginGroupName": "MyOriginGroup",
    "frontDoorOriginName": "MyAppServiceOrigin",
    "frontDoorOriginPath": "",
    "frontDoorRouteName": "MyRoute"
  },
  "resources": [
    {
      "type": "Microsoft.Cdn/profiles",
      "apiVersion": "2020-09-01",
      "name": "[variables('frontDoorProfileName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('frontDoorSkuName')]"
      },
      "properties": {}
    },
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2020-06-01",
      "name": "[variables('appServicePlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('appServicePlanSkuName')]",
        "capacity": "[parameters('appServicePlanCapacity')]"
      },
      "kind": "app"
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2020-06-01",
      "name": "[parameters('appName')]",
      "location": "[parameters('location')]",
      "kind": "app",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
        "httpsOnly": true,
        "siteConfig": {
          "ipSecurityRestrictions": [
            {
              "tag": "ServiceTag",
              "ipAddress": "AzureFrontDoor.Backend",
              "action": "Allow",
              "priority": 100,
              "headers": {
                "x-azure-fdid": [
                  "[reference(resourceId('Microsoft.Cdn/profiles', variables('frontDoorProfileName'))).frontDoorId]"
                ]
              },
              "name": "Allow traffic from Front Door"
            }
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
        "[resourceId('Microsoft.Cdn/profiles', variables('frontDoorProfileName'))]"
      ]
    },
    {
      "type": "Microsoft.Cdn/profiles/afdEndpoints",
      "apiVersion": "2020-09-01",
      "name": "[format('{0}/{1}', variables('frontDoorProfileName'), parameters('frontDoorEndpointName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "originResponseTimeoutSeconds": 240,
        "enabledState": "Enabled"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles', variables('frontDoorProfileName'))]"
      ]
    },
    {
      "type": "Microsoft.Cdn/profiles/originGroups",
      "apiVersion": "2020-09-01",
      "name": "[format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName'))]",
      "properties": {
        "loadBalancingSettings": {
          "sampleSize": 4,
          "successfulSamplesRequired": 3
        },
        "healthProbeSettings": {
          "probePath": "/",
          "probeRequestType": "HEAD",
          "probeProtocol": "Http",
          "probeIntervalInSeconds": 100
        },
        "trafficRestorationTimeToHealedOrNewEndpointsInMinutes": null
      },
      "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles', variables('frontDoorProfileName'))]"
      ]
    },
    {
      "type": "Microsoft.Cdn/profiles/originGroups/origins",
      "apiVersion": "2020-09-01",
      "name": "[format('{0}/{1}', format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName')), variables('frontDoorOriginName'))]",
      "properties": {
        "hostName": "[reference(resourceId('Microsoft.Web/sites', parameters('appName'))).defaultHostName]",
        "httpPort": 80,
        "httpsPort": 443,
        "originHostHeader": "[reference(resourceId('Microsoft.Web/sites', parameters('appName'))).defaultHostName]",
        "priority": 1,
        "weight": 1000,
        "sharedPrivateLinkResource": null
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/sites', parameters('appName'))]",
        "[resourceId('Microsoft.Cdn/profiles/originGroups', split(format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName')), '/')[0], split(format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName')), '/')[1])]"
      ]
    },
    {
      "type": "Microsoft.Cdn/profiles/afdEndpoints/routes",
      "apiVersion": "2020-09-01",
      "name": "[format('{0}/{1}', format('{0}/{1}', variables('frontDoorProfileName'), parameters('frontDoorEndpointName')), variables('frontDoorRouteName'))]",
      "properties": {
        "customDomains": [],
        "originGroup": {
          "id": "[resourceId('Microsoft.Cdn/profiles/originGroups', split(format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName')), '/')[0], split(format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName')), '/')[1])]"
        },
        "originPath": "[if(not(equals(variables('frontDoorOriginPath'), '')), variables('frontDoorOriginPath'), null())]",
        "ruleSets": null,
        "supportedProtocols": [
          "Http",
          "Https"
        ],
        "patternsToMatch": [
          "/*"
        ],
        "compressionSettings": {
          "contentTypesToCompress": [
            "application/eot",
            "application/font",
            "application/font-sfnt",
            "application/javascript",
            "application/json",
            "application/opentype",
            "application/otf",
            "application/pkcs7-mime",
            "application/truetype",
            "application/ttf",
            "application/vnd.ms-fontobject",
            "application/xhtml+xml",
            "application/xml",
            "application/xml+rss",
            "application/x-font-opentype",
            "application/x-font-truetype",
            "application/x-font-ttf",
            "application/x-httpd-cgi",
            "application/x-javascript",
            "application/x-mpegurl",
            "application/x-opentype",
            "application/x-otf",
            "application/x-perl",
            "application/x-ttf",
            "font/eot",
            "font/ttf",
            "font/otf",
            "font/opentype",
            "image/svg+xml",
            "text/css",
            "text/csv",
            "text/html",
            "text/javascript",
            "text/js",
            "text/plain",
            "text/richtext",
            "text/tab-separated-values",
            "text/xml",
            "text/x-script",
            "text/x-component",
            "text/x-java-source"
          ],
          "isCompressionEnabled": true
        },
        "queryStringCachingBehavior": "IgnoreQueryString",
        "forwardingProtocol": "HttpsOnly",
        "linkToDefaultDomain": "Enabled",
        "httpsRedirect": "Enabled"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/afdEndpoints', split(format('{0}/{1}', variables('frontDoorProfileName'), parameters('frontDoorEndpointName')), '/')[0], split(format('{0}/{1}', variables('frontDoorProfileName'), parameters('frontDoorEndpointName')), '/')[1])]",
        "[resourceId('Microsoft.Cdn/profiles/originGroups', split(format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName')), '/')[0], split(format('{0}/{1}', variables('frontDoorProfileName'), variables('frontDoorOriginGroupName')), '/')[1])]"
      ]
    }
  ],
  "outputs": {
    "frontDoorEndpointHostName": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Cdn/profiles/afdEndpoints', split(format('{0}/{1}', variables('frontDoorProfileName'), parameters('frontDoorEndpointName')), '/')[0], split(format('{0}/{1}', variables('frontDoorProfileName'), parameters('frontDoorEndpointName')), '/')[1])).hostName]"
    }
  }
}
```

## Validate deployment

Once you have deployed the Azure Resource Manager template, wait a few minutes before you attempt to access your Front Door endpoint to allow time for Front Door to propagate the settings throughout its network.

You can then access the Front Door endpoint. You should see an App Service welcome page.

You can also attempt to access the App Service hostname directly. You should see a _Forbidden_ error, since your App Service instance has been configured to block requests that don't come through your Front Door profile.

## Next steps

For more information on Azure Resource Manager templates, see [Azure Resource Manager templates documentation](../../azure-resource-manager/templates/).

Additional Front Door samples can be found in the [Azure Front Door resource manager template samples](resource-manager-template-samples.md)
