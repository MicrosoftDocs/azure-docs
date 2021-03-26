---
# Mandatory fields.
title: Enable private access with Private Link (preview) - CLI
titleSuffix: Azure Digital Twins
description: See how to enable private access for Azure Digital Twins solutions with Private Link, using the Azure CLI.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 02/09/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable private access with Private Link (preview): Azure CLI

[!INCLUDE [digital-twins-private-link-selector.md](../../includes/digital-twins-private-link-selector.md)]

This article describes the different ways to [enable Private Link with a private endpoint for an Azure Digital Twins instance](concepts-security.md#private-network-access-with-azure-private-link-preview) (currently in preview). Configuring a private endpoint for your Azure Digital Twins instance enables you to secure your Azure Digital Twins instance and eliminate public exposure, as well as avoid data exfiltration from your [Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md).

This article walks through the process using the [**Azure CLI**](/cli/azure/what-is-azure-cli).

Here are the steps that are covered in this article: 
1. Turn on Private Link and configure a private endpoint for an Azure Digital Twins instance.
1. Disable or enable public network access flags, to restrict API access to Private Link connections only.

## Prerequisites

Before you can set up a private endpoint, you'll need an [**Azure Virtual Network (VNet)**](../virtual-network/virtual-networks-overview.md) where the endpoint can be deployed. If you don't have a VNet already, you can follow one of the Azure Virtual Network [quickstarts](../virtual-network/quick-create-portal.md) to set this up.

## Manage private endpoints for an Azure Digital Twins instance 

When using the [Azure CLI](/cli/azure/what-is-azure-cli), you can set up private endpoints with Private Link on an Azure Digital Twins instance that already exists (it cannot be added as part of instance creation). You can then continue to view and manage them through additional CLI commands. 

>[!TIP]
> You can also set up a Private Link endpoint through the Private Link service, instead of through your Azure Digital Twins instance. This also gives the same configuration options and the same end result.
>
> For more details about setting up Private Link resources, see Private Link documentation for the [Azure portal](../private-link/create-private-endpoint-portal.md), [Azure CLI](../private-link/create-private-endpoint-cli.md), [ARM templates](../private-link/create-private-endpoint-template.md), or [PowerShell](../private-link/create-private-endpoint-powershell.md).

### Add a private endpoint to an existing instance

To create a private endpoint and link it to an Azure Digital Twins instance, use the [**az network private-endpoint create**](/cli/azure/network/private-endpoint#az_network_private_endpoint_create) command. Identify the Azure Digital Twins instance by using its fully qualified ID in the `--private-connection-resource-id` parameter.

Here is an example that uses the command to create a private endpoint, with only the required parameters.

```azurecli-interactive
az network private-endpoint create --connection-name {private_link_service_connection} -n {name_for_private_endpoint} -g {resource_group} --subnet {subnet_ID} --private-connection-resource-id "/subscriptions/{subscription_ID}/resourceGroups/{resource_group}/providers/Microsoft.DigitalTwins/digitalTwinsInstances/{Azure_Digital_Twins_instance_name}" 
```

For a full list of required and optional parameters, as well as more private endpoint creation examples, see the [**az network private-endpoint create** reference documentation](/cli/azure/network/private-endpoint#az_network_private_endpoint_create).

### Manage private endpoint connections on the instance

Once a private endpoint has been created for your Azure Digital Twins instance, you can use the [**az dt network private-endpoint connection**](/cli/azure/ext/azure-iot/dt/network/private-endpoint/connection) commands to continue managing private endpoint **connections** with respect to the instance. Operations include:
* Show a private endpoint connection
* Set the state of the private-endpoint connection
* Delete the private-endpoint connection
* List all the private-endpoint connections for an instance

For more information and examples, see the [**az dt network private-endpoint** reference documentation](/cli/azure/ext/azure-iot/dt/network/private-endpoint).

### Manage other Private Link information on an Azure Digital Twins instance

You can get additional information about the Private Link status of your instance with the [**az dt network private-link**](/cli/azure/ext/azure-iot/dt/network/private-link) commands. Operations include:
* List private links associated with an Azure Digital Twins instance
* Show a private link associated with the instance

For more information and examples, see the [**az dt network private-link** reference documentation](/cli/azure/ext/azure-iot/dt/network/private-link).

## Disable / enable public network access flags

You can configure your Azure Digital Twins instance to deny all public connections and allow only connections through private endpoints to enhance the network security. This action is done with a **public network access flag**. 

This policy allows you to restrict API access to Private Link connections only. When the public network access flag is set to *disabled*, all REST API calls to the Azure Digital Twins instance data plane from the public cloud will return `403, Unauthorized`. Alternatively, when the policy is set to *disabled* and a request is made through a private endpoint, the API call will succeed.

This article shows how to update the value of the network flag using either the [Azure CLI](/cli/azure/) or the [ARMClient command tool](https://github.com/projectkudu/ARMClient). For instructions on how to do it with the Azure portal, see the [portal version](how-to-enable-private-link-portal.md) of this article.

### Use the Azure CLI

In the Azure CLI, you can disable or enable public network access by adding a `--public-network-access` parameter to the `az dt create` command. While this command can also be used to create a new instance, you can use it to edit the properties of an existing instance by providing it the name of an instance that already exists. (For more information about this command, see its [reference documentation](/cli/azure/ext/azure-iot/dt#ext_azure_iot_az_dt_create) or the [general instructions for setting up an Azure Digital Twins instance](how-to-set-up-instance-cli.md#create-the-azure-digital-twins-instance)).

To **disable** public network access for an Azure Digital Twins instance, use the `--public-network-access` parameter like this:

```azurecli-interactive
az dt create -n {name_of_existing_instance} -g {resource_group} --public-network-access Disabled
```

To **enable** public network access on an instance where it's currently disabled, use the following similar command:

```azurecli-interactive
az dt create -n {name_of_existing_instance} -g {resource_group} --public-network-access Enabled
```

### Use the ARMClient command tool 

With the [ARMClient command tool](https://github.com/projectkudu/ARMClient), public network access is enabled or disabled using the commands below. 

To **disable** public network access:
  
```cmd/sh
armclient login 

armclient PATCH /subscriptions/<your-Azure-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.DigitalTwins/digitalTwinsInstances/<your-Azure-Digital-Twins-instance>?api-version=2020-12-01 "{ 'properties': { 'publicNetworkAccess': 'disabled' } }"  
```

To **enable** public network access:  
  
```cmd/sh
armclient login 

armclient PATCH /subscriptions/<your-Azure-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.DigitalTwins/digitalTwinsInstances/<your-Azure-Digital-Twins-instance>?api-version=2020-12-01 "{ 'properties': { 'publicNetworkAccess': 'enabled' } }"  
``` 

## Next steps

Learn more about Private Link for Azure: 
* [*What is Azure Private Link service?*](../private-link/private-link-service-overview.md)