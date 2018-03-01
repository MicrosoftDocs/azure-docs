---
title: Set up Device Provisioning using Azure CLI | Microsoft Docs
description: Azure Quickstart - Set up the Azure IoT Hub Device Provisioning Service using Azure CLI
services: iot-dps
keywords: 
author: JimacoMS2
ms.author: v-jamebr
ms.date: 02/26/2018
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Set up the IoT Hub Device Provisioning Service with Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This QuickStart details using the Azure CLI to create an IoT hub and an  IoT Hub Device Provisioning Service and to link the two services together. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!IMPORTANT]
> Both the IoT hub and the provisioning service you create in this QuickStart will be publicly discoverable as DNS endpoints. Make sure to avoid any sensitive information if you decide to change the names used for these resources.
>


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]


## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *my-sample-resource-group* in the *westus* location.

```azurecli-interactive 
az group create --name my-sample-resource-group --location westus
```

> [!TIP]
> The example creates the resource group in the West US location. You can view a list of available locations by running the command `az account list-locations -o table`.
>
>

## Create an IoT hub

Create an IoT IoT hub with the [az iot hub create](/cli/azure/iot/hub#az_iot_hub_create) command. 

The following example creates an IoT hub named *my-sample-hub* in the *westus* location.  

```azurecli-interactive 
az iot hub create --name my-sample-hub --resource-group my-sample-resource-group --location westus
```

## Create a provisioning service

Create a provisioning service with the [az iot dps create](/cli/azure/iot/dps#az_iot_dps_create) command. 

The following example creates an provisioning service named *my-sample-dps* in the *westus* location.  

```azurecli-interactive 
az iot dps create --name my-sample-dps --resource-group my-sample-resource-group --location westus
```

> [!TIP]
> The example creates the provisioning service in the West US location. You can view a list of available locations by running the command `az provider show --namespace Microsoft.Devices --query "resourceTypes[?resourceType=='ProvisioningServices'].locations | [0]" --out table` or by going to the [Azure Status](https://azure.microsoft.com/en-us/status/) page and searching for "Device Provisioning Service".
>


## Get the connection string for your IoT hub

You need your IoT Hub's connection string to link it to the device provisioning service. Use the [az iot hub show-connection-string](/cli/azure/iot/hub#az_iot_hub_show_connection_string) command to get the connection string and use its output to set a variable that you will use when you link the two resources. 

The following example sets the *hubConnectionString* variable to the value of the connection string for the primary key of the hub's *iothubowner* policy. You can specify a different policy with the `--policy-name` parameter. The command uses the Azure CLI [query](/cli/azure/query-azure-cli) and [output](/cli/azure/format-output-azure-cli#tsv-output-format) options to extract the connection string from the command output.

```azurecli-interactive 
hubConnectionString=$(az iot hub show-connection-string --name my-sample-hub --key primary --query connectionString -o tsv)
```

You can use the `echo` command to see the connection string.

```azurecli-interactive 
echo $hubConnectionString
```

## Link the IoT hub to the provisioning service

Link the IoT hub to your provisioning service with the [az iot dps linked-hub create](/cli/azure/iot/dps/linked-hub#az_iot_dps_linked_hub_create) command. 

The following example links an IoT hub named *my-sample-hub* in the *westus* location to a device provisioning service named *my-sample-dps*. It uses the connection string for *my-sample-hub* stored in the *hubConnectionString* variable in the previous step.

```azurecli-interactive 
az iot dps linked-hub create --dps-name my-sample-dps --resource-group my-sample-resource-group --connection-string $hubConnectionString --location westus
```

## Verify your provisioning service

Get the details of your provisioning service with the [az iot dps show](/cli/azure/iot/dps#az_iot_dps_show) command.

The following example gets the details of a provisioning service named *my-sample-dps*. The linked IoT hub is shown in the *properties.iotHubs* collection.

```azurecli-interactive
az iot dps show --name my-sample-dps
```

## Clean up resources

Other Quickstarts in this collection build upon this Quickstart. If you plan to continue on to work with subsequent Quickstarts or with the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, you can use the following commands to delete the provisioning service, the IoT hub or the resource group and all of its resources.

To delete the provisioning service, run the [az iot dps delete](/cli/azure/iot/dps#az_iot_dps_delete) command:

```azurecli-interactive
az iot dps delete --name my-sample-dps --resource-group my-sample-resource-group
```
To delete the IoT hub, run the [az iot hub delete](/cli/azure/iot/hub#az_iot_hub_delete) command:

```azurecli-interactive
az iot hub delete --name my-sample-hub --resource-group my-sample-resource-group
```

To delete a resource group and all its resources, run the [az group delete](/cli/azure/group#az_group_delete) command:

```azurecli-interactive
az group delete --name my-sample-resource-group
```

## Next steps

In this Quickstart, you’ve deployed an IoT hub and a Device Provisioning Service instance, and linked the two resources. To learn how to use this set up to provision a simulated device, continue to the Quickstart for creating simulated device.

> [!div class="nextstepaction"]
> [Quickstart to create simulated device](./quick-create-simulated-device.md)


<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-CLI-install]: https://docs.microsoft.com/cli/azure/install-az-cli2
[lnk-login-command]: https://docs.microsoft.com/cli/azure/get-started-with-az-cli2
[lnk-az-account-command]: https://docs.microsoft.com/cli/azure/account
[lnk-az-register-command]: https://docs.microsoft.com/cli/azure/provider
[lnk-az-addcomponent-command]: https://docs.microsoft.com/cli/azure/component
[lnk-az-resource-command]: https://docs.microsoft.com/cli/azure/resource
[lnk-az-iot-command]: https://docs.microsoft.com/cli/azure/iot
[lnk-iot-pricing]: https://azure.microsoft.com/pricing/details/iot-hub/
[lnk-devguide]: iot-hub-devguide.md
[lnk-portal]: iot-hub-create-through-portal.md 
