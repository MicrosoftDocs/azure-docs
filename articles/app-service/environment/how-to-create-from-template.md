---
title: Create an App Service Environment (ASE) v3 with ARM
description: Learn how to create an external or ILB App Service Environment v3 by using an Azure Resource Manager template.
author: madsd
ms.topic: how-to
ms.date: 01/20/2023
ms.author: madsd
---
# Create an App Service Environment by using an Azure Resource Manager template

App Service Environment cas be created using an Azure Resource Manager template. This allows you to do repeatable deployment.

> [!NOTE]
> This article is about App Service Environment v3, which is used with isolated v2 App Service plans.

## Overview

Azure App Service Environment can be created with an internet-accessible endpoint or an endpoint on an internal address in an Azure Virtual Network. When created with an internal endpoint, that endpoint is provided by an Azure component called an internal load balancer (ILB). The App Service Environment on an internal IP address is called an ILB ASE. The App Service Environment with a public endpoint is called an External ASE. 

An ASE can be created by using the Azure portal or an Azure Resource Manager template. This article walks through the steps and syntax you need to create an External ASE or ILB ASE with Resource Manager templates. Learn [how to create an App Service Environment in Azure portal](./creation.md).

When you create an App Service Environment in the Azure portal, you can create your virtual network at the same time or choose a preexisting virtual network to deploy into. 

When you create an App Service Environment from a template, you must start with: 

* An Azure Virtual Network.
* A subnet in that virtual network. We recommend a subnet size of `/24` with 256 addresses to accommodate future growth and scaling needs. After the App Service Environment is created, you can't change the size.
* When you creating an App Service Environment into preexisting virtual network and subnet, the existing resource group name, virtual network name and subnet name are required.
* The subscription you want to deploy into.
* The location you want to deploy into.

To automate your App Service Environment creation, follow they guidelines in the sections below. 

## Configuring the App Service Environment

The core Resource Manager template that creates an App Service Environment looks like this:

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

Besides the core properties, there are many additional configuration options that you can use to configure your App Service Environment.

* *name*: Required. This parameter defines an unique App Service Environment name. 
* *virtualNetwork -> id*: Required. Specifies the resource id of the subnet. Subnet must be empty and delegated to Microsoft.Web/hostingEnvironments
* *internalLoadBalancingMode*: Required. In most cases, set this to "Web, Publishing", which means both HTTP/HTTPS traffic and FTP traffic is on an internal VIP (Internal Load Balancer). If this property is set to "None", all traffic remains on the public VIP (External Load Balancer).
* *zoneRedundant*: Optional. Defines with true/false if the App Service Environment will be deployed into Availability Zones (AZ). Refer to to [this article](./zone-redundancy.md) for more information.
* *dedicatedHostCount*: Optional. In most cases, set this to 0 or left out. You can set it to 2 if you want to deploy your App Service Environment with physical hardware isolation on dedicated hosts. 
* *upgradePreference*: Optional. Defines if upgrade is started automatically or a 15 day windows to start the deployment is given. Valid values are "None", "Early", "Late", "Manual". More information [about upgrade preference](./how-to-upgrade-preference.md).
* *clusterSettings*: Optional. Various cluster settings exist to tailor the specific instance. These settings can impact the functionality of the instance and can take several hours to apply. See more information about [cluster settings here](./app-service-app-service-environment-custom-settings.md).
* *networkingConfiguration -> allowNewPrivateEndpointConnections*: Optional. See [networking configuration](./configure-network-settings.md#allow-new-private-endpoint-connections) for more information about this property.
* *networkingConfiguration -> remoteDebugEnabled*: Optional. See [networking configuration](./configure-network-settings.md#remote-debugging-access) for more information about this property.
* *networkingConfiguration -> ftpEnabled*: Optional. See [networking configuration](./configure-network-settings.md#ftp-access) for more information about this property.
* *networkingConfiguration -> inboundIpAddressOverride*: Optional. Allow you to create an App Service Environment with your own Azure Public IP address (specify the resource id) or define a static IP for ILB deployments. This cannot be changed after the App Service Environment is created.
* *customDnsSuffixConfiguration*: Optional. Allows you to specify a custom domain suffix for the App Service Environment. Requires a valid certificate from a Key Vault and access using a Managed Identity. See [configuration custom domain suffix](./how-to-custom-domain-suffix.md) for more information about the specific parameters.

### Deploying the App Service Environment

After creating the ARM template, for example named *azuredeploy.json* and optionally a parameters file for example named *azuredeploy.parameters.json*, you can create the App Service Environment by using the Azure CLI code snippet below. Change the file paths to match the Resource Manager template-file locations on your machine. Remember to supply your own value for the resource group name:

```bash
templatePath="PATH/azuredeploy.json"
parameterPath="PATH/azuredeploy.parameters.json"

az deployment group create --resource-group "YOUR-RG-NAME-HERE" --template-file $templatePath --parameters $parameterPath
```

It takes about two hours for the App Service Environment to be created.

## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](./using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](./networking.md)

> [!div class="nextstepaction"]
> [Certificates in App Service Environment v3](./overview-certificates.md)