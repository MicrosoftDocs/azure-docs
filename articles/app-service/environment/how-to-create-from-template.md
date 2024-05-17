---
title: Create an App Service Environment (ASE) v3 with Azure Resource Manager
description: Learn how to create an external or ILB App Service Environment v3 by using an Azure Resource Manager template.
author: madsd
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 03/09/2023
ms.author: madsd
---
# Create an App Service Environment by using an Azure Resource Manager template

App Service Environment can be created using an Azure Resource Manager template allowing you to do repeatable deployment.

> [!NOTE]
> This article is about App Service Environment v3, which is used with isolated v2 App Service plans.

## Overview

Azure App Service Environment can be created with an internet-accessible endpoint or an endpoint on an internal address in an Azure Virtual Network. When created with an internal endpoint, that endpoint is provided by an Azure component called an internal load balancer (ILB). The App Service Environment on an internal IP address is called an ILB ASE. The App Service Environment with a public endpoint is called an External ASE. 

An ASE can be created by using the Azure portal or an Azure Resource Manager template. This article walks through the steps and syntax you need to create an External ASE or ILB ASE with Resource Manager templates. Learn [how to create an App Service Environment in Azure portal](./creation.md).

When you create an App Service Environment in the Azure portal, you can create your virtual network at the same time or choose a pre-existing virtual network to deploy into. 

When you create an App Service Environment from a template, you must start with: 

* An Azure Virtual Network.
* A subnet in that virtual network. We recommend a subnet size of `/24` with 256 addresses to accommodate future growth and scaling needs. After the App Service Environment is created, you can't change the size.
* The location you want to deploy into.

## Configuring the App Service Environment

The basic Resource Manager template that creates an App Service Environment looks like this:

```json
{
    "type": "Microsoft.Web/hostingEnvironments",
    "apiVersion": "2022-03-01",
    "name": "[parameters('aseName')]",
    "location": "[resourceGroup().location]",
    "kind": "ASEV3",
    "properties": {
        "internalLoadBalancingMode": "Web, Publishing",
        "virtualNetwork": {
            "id": "[parameters('subnetResourceId')]"
        },
        "networkingConfiguration": { },
        "customDnsSuffixConfiguration": { }
    },
    "identity": {
        "type": "SystemAssigned"
    }
}
```

In addition to the core properties, there are other configuration options that you can use to configure your App Service Environment.

* *name*: Required. This parameter defines a unique App Service Environment name. The name must be no more than 36 characters.
* *virtualNetwork -> id*: Required. Specifies the resource ID of the subnet. Subnet must be empty and delegated to Microsoft.Web/hostingEnvironments
* *internalLoadBalancingMode*: Required. In most cases, set this property to "Web, Publishing", which means both HTTP/HTTPS traffic and FTP traffic is on an internal VIP (Internal Load Balancer). If this property is set to "None", all traffic remains on the public VIP (External Load Balancer).
* *zoneRedundant*: Optional. Defines with true/false if the App Service Environment will be deployed into Availability Zones (AZ). For more information, see [Regions and availability zones](./overview-zone-redundancy.md).
* *dedicatedHostCount*: Optional. In most cases, set this property to 0 or left out. You can set it to 2 if you want to deploy your App Service Environment with physical hardware isolation on dedicated hosts. 
* *upgradePreference*: Optional. Defines if upgrade is started automatically or a 15 day windows to start the deployment is given. Valid values are "None", "Early", "Late", "Manual". More information [about upgrade preference](./how-to-upgrade-preference.md).
* *clusterSettings*: Optional. For more information, see [cluster settings](./app-service-app-service-environment-custom-settings.md).
* *networkingConfiguration -> allowNewPrivateEndpointConnections*: Optional. For more information, see [networking configuration](./configure-network-settings.md#allow-new-private-endpoint-connections).
* *networkingConfiguration -> remoteDebugEnabled*: Optional. For more information, see [networking configuration](./configure-network-settings.md#remote-debugging-access).
* *networkingConfiguration -> ftpEnabled*: Optional. For more information, see [networking configuration](./configure-network-settings.md#ftp-access).
* *networkingConfiguration -> inboundIpAddressOverride*: Optional. Allow you to create an App Service Environment with your own Azure Public IP address (specify the resource ID) or define a static IP for ILB deployments. This setting can't be changed after the App Service Environment is created.
* *customDnsSuffixConfiguration*: Optional. Allows you to specify a custom domain suffix for the App Service Environment. Requires a valid certificate from a Key Vault and access using a Managed Identity. For more information about the specific parameters, see [configuration custom domain suffix](./how-to-custom-domain-suffix.md).

> [!NOTE]
> The properties `dnsSuffix`, `multiSize`, `frontEndScaleFactor`, `userWhitelistedIpRanges`, and `ipSslAddressCount` are not supported when creating App Service Environment v3.

### Deploying the App Service Environment

After creating the ARM template, for example named *azuredeploy.json* and optionally a parameters file for example named *azuredeploy.parameters.json*, you can create the App Service Environment by using the Azure CLI code snippet. Change the file paths to match the Resource Manager template-file locations on your machine. Remember to supply your own value for the resource group name:

```azurecli
templatePath="PATH/azuredeploy.json"
parameterPath="PATH/azuredeploy.parameters.json"

az deployment group create --resource-group "YOUR-RG-NAME-HERE" --template-file $templatePath --parameters $parameterPath
```

Creating the App Service Environment usually takes about an hour, but if it is a zone redundant App Service Environment or we are experiencing unexpected demand in a region, the creation process can take several hours to complete.

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](./using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](./networking.md)

> [!div class="nextstepaction"]
> [Certificates in App Service Environment v3](./overview-certificates.md)
