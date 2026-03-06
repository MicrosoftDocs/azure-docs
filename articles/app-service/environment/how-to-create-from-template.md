---
title: Create App Service Environment Using ARM Template
description: Learn how to create an external or internal load balancer (ILB) App Service Environment v3 by using a customized Azure Resource Manager template.
author: seligj95
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 03/04/2026
ms.author: jordanselig
ms.service: azure-app-service
#customer intent: As a developer, I want to customize an ARM template for deploying an App Service Environment v3, so I can reuse the template to deploy environments in the future.
---
# Create an App Service Environment by using an Azure Resource Manager template

An App Service Environment v3 can be created in the Azure portal or by using an Azure Resource Manager template (ARM template).

In the Azure portal, you create an App Service Environment with a specific configuration for immediate deployment. When you [create the environment in the portal](creation.md), you select or create the supporting resources at the same time, including the resource group for the deployment region, and the virtual network with subnet. 

When you create an App Service Environment from a template, you access a configuration that's available for repeatable deployment of the same environment or other App Service Environments. The template specifies the property set for the App Service Environment, along with the virtual network and subnet to use for the deployment.

This article walks through the steps and syntax you need to create an External App Service Environment or internal load balancer (ILB) App Service Environment from an ARM template.

## Prerequisites

- To build the App Service Environment ARM template, you need to determine the type of environment to configure. You can create the environment with an internet-accessible endpoint or an endpoint on an internal address in an Azure Virtual Network instance. 

   When the environment is created with an internal endpoint, the endpoint is provided by an Azure component, the _internal load balancer (ILB)_. An App Service Environment on an internal IP address is referred to as an _ILB App Service Environment_. An App Service Environment with a public endpoint is referred to as an _External App Service Environment_. 

- The virtual network specified in the template must define a subnet:

   - The recommended subnet size is `/24` with 256 addresses to accommodate future growth and scaling needs.
   - The subnet must be empty, which means no network interface cards (NICs), virtual machines, private endpoints, and so on.
   - The subnet must be delegated to `Microsoft.Web/hostingEnvironments`.
   
   Keep in mind that after you create an App Service Environment with the template, you can't change the subnet size.

- When you create an App Service Environment from an ARM template, the resource group you specify must be in a region that has sufficient availability to support deployment of the environment created from the template.

## Review the ARM template properties

The following JSON shows a basic ARM template that creates an App Service Environment.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "aseName": {
        "type": "string"
    },
    "subnetResourceId": {
        "type": "string"
    }
  },
  "variables": {},
  "resources": [
    "type": "Microsoft.Web/hostingEnvironments",
    "apiVersion": "2025-03-01",
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

The following table describes the core properties and other options you can use to configure your App Service Environment.

| Property | Required | Description |
| --- | :---: | --- |
| `name` | Yes | Define a unique App Service Environment name. The name must be a string of no more than 36 characters. |
| `virtualNetwork` -> `id` | Yes | Specify the resource ID of the subnet. The subnet must be empty and delegated to `Microsoft.Web/hostingEnvironments`. |
| `internalLoadBalancingMode` | Yes | Identify the type of load balancer for the ILB App Service Environment.<br> - The most common value is `Web, Publishing`, which means both HTTP/HTTPS traffic and FTP traffic is on an internal VIP (Internal Load Balancer).<br> - When the value is `None`, all traffic remains on the public VIP (External Load Balancer). |
| `zoneRedundant` | No | Indicate whether the App Service Environment is deployable to an availability zone. The value is boolean True or False. For more information, see [Reliability in Azure App Service](/azure/reliability/reliability-app-service). |
| `dedicatedHostCount` | No | Specify how many hosts to dedicate for the App Service Environment.<br> - The most common value is 0 or unspecified.<br> - To deploy your App Service Environment with physical hardware isolation on dedicated hosts, set the value to 2. |
| `upgradePreference` | No | Specify your preference for automatic upgrades. There are four possible values:<br> - `None`: (Default) Upgrade automatically during the upgrade process for the region.<br> - `Early`: Upgrade automatically with a high prioritization compared with other resources in the region.<br> - `Late`: Upgrade automatically with a low prioritization compared with other resources in the region.<br> - `Manual`: Receive a notification when an upgrade is available, and start the process within 15 days. After 15 days, the upgrade occurs with other automatic upgrades in the region.<br> For more information, see [Upgrade preference for App Service Environment planned maintenance](how-to-upgrade-preference.md). |
| `clusterSettings` | No | Customize the behavior of the App Service Environment. For more information, see [Custom configuration settings for App Service Environments](app-service-app-service-environment-custom-settings.md). |
| `networkingConfiguration` -> `allowNewPrivateEndpointConnections` | No | Specify whether to allow creation of a new private endpoint connection for an ILB App Service Environment or External App Service Environment. By default, the option is disabled. For more information, see [Network configuration settings > Allow new private endpoint connections](configure-network-settings.md#allow-new-private-endpoint-connections). |
| `networkingConfiguration` -> `remoteDebugEnabled` | No | Specify whether to enable remote debugging for the App Service Environment. By default, the option is disabled. For more information, see [Network configuration settings > Remote debugging access](configure-network-settings.md#remote-debugging-access). |
| `networkingConfiguration` -> `ftpEnabled` | No | Specify whether to allow FTP connections to the App Service Environment. By default, the option is disabled. For more information, see [Network configuration settings > FTP access](configure-network-settings.md#ftp-access). |
| `networkingConfiguration` -> `inboundIpAddressOverride` |  No | Use this setting to create an App Service Environment with your own Azure Public IP address (specify the resource ID) or define a static IP for ILB deployments. This setting can't be changed after the App Service Environment is created. |
| `customDnsSuffixConfiguration` | No | Use this setting to specify a custom domain suffix for the App Service Environment. For more information about the specific parameters, see [Custom domain suffix for App Service Environments](how-to-custom-domain-suffix.md).<br> **Important**: To set this option, you must have an existing key vault, a valid certificate secret from Azure Key Vault, and access with a managed identity for Azure resources through Microsoft Entra ID. |

> [!NOTE]
> An App Service Environment v3 doesn't support the following properties: `dnsSuffix`, `multiSize`, `frontEndScaleFactor`, `userWhitelistedIpRanges`, and `ipSslAddressCount`.

## Create the ARM template

Create the template by following these steps:

1. Paste the sample ARM template into a new JSON file and modify the properties for your configuration.

1. Save the JSON file, such as *azuredeploy.json*. Note the file save location for later use.

1. (Optional) Relocate the parameter settings from the template JSON file into a parameters JSON file, such as *azuredeploy.parameters.json*. Note the file save location for later use.

## Deploy the App Service Environment

After you prepare the template, you can create the App Service Environment from the template by using the Azure CLI.

Update the `templatePath` and `parameterPath` values to point to the locations of your ARM template file and parameters file on your machine. Enter the name of your resource group for the `<resource_group>` value.

```azurecli
templatePath="PATH/azuredeploy.json"
parameterPath="PATH/azuredeploy.parameters.json"

az deployment group create --resource-group <resource_group> --template-file $templatePath --parameters $parameterPath
```

> [!TIP]
> It's helpful to confirm your template can successfully create the App Service Environment before you run the `az deployment group create` command. Validate the template by running the `az deployment group validate` command with your resource values.

Creating the App Service Environment usually takes about an hour, but if it's a zone-redundant App Service Environment or the target region is experiencing unexpected demand, the creation process can take several hours to complete.

## Related content

- [Use an App Service Environment](using.md)
- [App Service Environment networking](networking.md)
- [Certificates and the App Service Environment](overview-certificates.md)
