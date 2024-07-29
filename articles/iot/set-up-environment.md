---
title: Tutorial - Set up the IoT resources you need for IoT Plug and Play | Microsoft Docs
description: Tutorial - Create an IoT Hub and Device Provisioning Service instance to use with the IoT Plug and Play quickstarts and tutorials.
author: dominicbetts
ms.author: dobett
ms.date: 1/23/2024
ms.topic: tutorial
ms.service: iot
ms.custom: mode-other, devx-track-azurecli 
ms.devlang: azurecli
---

# Tutorial: Set up your environment for the IoT Plug and Play quickstarts and tutorials

Before you can complete any of the IoT Plug and Play quickstarts and tutorials, you need to configure an IoT hub and the Device Provisioning Service (DPS) in your Azure subscription. You'll also need local copies of the model files used by the sample applications and the Azure IoT explorer tool.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [azure-cli-prepare-your-environment-h3](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

## Create the resources

Create an Azure resource group for the resources:

```azurecli-interactive
az group create --name my-pnp-resourcegroup --location centralus
```

Create an IoT hub. The following command uses the name `my-pnp-hub` as an example for the name of the IoT hub to create. Choose a unique name for your IoT hub to use in place of `my-pnp-hub`:

```azurecli-interactive
az iot hub create --name my-pnp-hub --resource-group my-pnp-resourcegroup --sku F1 --partition-count 2
```

Create a DPS instance. The following command uses the name `my-pnp-dps` as an example for the name of the DPS instance to create. Choose a unique name for your DPS instance to use in place of `my-pnp-dps`:

```azurecli-interactive
az iot dps create --name my-pnp-dps --resource-group my-pnp-resourcegroup
```

To link the DPS instance to your IoT hub, use the following commands. Replace `my-pnp-dps` and `my-pnp-hub` with the unique names you chose previously:

```azurecli-interactive
hubConnectionString=$(az iot hub connection-string show -n my-pnp-hub --key primary --query connectionString -o tsv)
az iot dps linked-hub create --dps-name my-pnp-dps --resource-group my-pnp-resourcegroup --location centralus --connection-string $hubConnectionString
```

## Retrieve the settings

Some quickstarts and tutorials use the connection string for your IoT hub. You also need the connection string when you set up the Azure IoT explorer tool. Retrieve the connection string and make a note of it now. Replace `my-pnp-hub` with the unique name you chose for your IoT hub:

```azurecli-interactive
az iot hub connection-string show -n my-pnp-hub --key primary --query connectionString
```

Most of the quickstarts and tutorials use the *ID scope* of your DPS configuration. Retrieve the ID scope and make a note of it now. Replace `my-pnp-dps` with the unique name you chose for your DPS instance:

```azurecli-interactive
az iot dps show --name my-pnp-dps --query properties.idScope
```

All the quickstarts and tutorials use a DPS device enrollment. Use the following command to create a `my-pnp-device` *individual device enrollment* in your DPS instance. Replace `my-pnp-dps` with the unique name you chose for your DPS instance. Make a note of the registration ID and primary key values to use in the quickstarts and tutorials:

```azurecli-interactive
az iot dps enrollment create --attestation-type symmetrickey --dps-name my-pnp-dps --resource-group my-pnp-resourcegroup --enrollment-id my-pnp-device --device-id my-pnp-device --query '{registrationID:registrationId,primaryKey:attestation.symmetricKey.primaryKey}'
```

## Create environment variables

Create five environment variables to configure the samples in the quickstarts and tutorials to use the Device Provisioning Service (DPS) to connect to your IoT hub:

* **IOTHUB_DEVICE_SECURITY_TYPE**: the value `DPS`.
* **IOTHUB_DEVICE_DPS_ID_SCOPE**: the DPS ID scope you made a note of previously.
* **IOTHUB_DEVICE_DPS_DEVICE_ID**: the value `my-pnp-device`.
* **IOTHUB_DEVICE_DPS_DEVICE_KEY**: the enrollment primary key you made a note of previously.
* **IOTHUB_DEVICE_DPS_ENDPOINT**: the value `global.azure-devices-provisioning.net`

The service samples need the following environment variables to identify the hub and device to connect to:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `my-pnp-device`.

For example, in a Linux bash shell:

```bash
export IOTHUB_DEVICE_SECURITY_TYPE="DPS"
export IOTHUB_DEVICE_DPS_ID_SCOPE="<Your ID scope>"
export IOTHUB_DEVICE_DPS_DEVICE_ID="my-pnp-device"
export IOTHUB_DEVICE_DPS_DEVICE_KEY="<Your enrolment primary key>"
export IOTHUB_DEVICE_DPS_ENDPOINT="global.azure-devices-provisioning.net"
export IOTHUB_CONNECTION_STRING="<Your IoT hub connection string>"
export IOTHUB_DEVICE_ID="my-pnp-device"
```

For example, at the Windows command line:

```cmd
set IOTHUB_DEVICE_SECURITY_TYPE=DPS
set IOTHUB_DEVICE_DPS_ID_SCOPE=<Your ID scope>
set IOTHUB_DEVICE_DPS_DEVICE_ID=my-pnp-device
set IOTHUB_DEVICE_DPS_DEVICE_KEY=<Your enrolment primary key>
set IOTHUB_DEVICE_DPS_ENDPOINT=global.azure-devices-provisioning.net
set IOTHUB_CONNECTION_STRING=<Your IoT hub connection string>
set IOTHUB_DEVICE_ID=my-pnp-device
```

## Download the model files

The quickstarts and tutorials use sample model files for the temperature controller and thermostat devices. To download the sample model files:

1. Create a folder called *models* on your local machine.

1. Right-click [TemperatureController.json](https://raw.githubusercontent.com/Azure/opendigitaltwins-dtdl/master/DTDL/v2/samples/TemperatureController.json) and save the JSON file to the *models* folder.

1. Right-click [Thermostat.json](https://raw.githubusercontent.com/Azure/opendigitaltwins-dtdl/master/DTDL/v2/samples/Thermostat.json) and save the JSON file to the *models* folder.

## Install the Azure IoT explorer

The quickstarts and tutorials use the **Azure IoT explorer** tool. Go to [Azure IoT explorer releases](https://github.com/Azure/azure-iot-explorer/releases) and expand the list of assets for the most recent release. Download and install the most recent version of the application for your operating system.

The first time you run the tool, you're prompted for the IoT hub connection string. Use the connection string you made a note of previously.

Configure the tool to use the model files you downloaded previously. From the home page in the tool, select **IoT Plug and Play Settings**, then **+ Add > Local folder**. Select the *models* folder you created previously. Then select **Save** to save the settings.

To learn more, see [Install and use Azure IoT explorer](../iot/howto-use-iot-explorer.md).

## Clean up resources

You can use the IoT hub and DPS instance for all the IoT Plug and Play quickstarts and tutorials, so you only need to complete the steps in this article once. When you're finished, you can remove them from your subscription with the following command:

```azurecli-interactive
az group delete --name my-pnp-resourcegroup
```

## Next steps

Now that you've set up your environment, you can try one of the quickstarts or tutorials such as:

> [!div class="nextstepaction"]
> [Connect a sample IoT Plug and Play device application to IoT Hub](tutorial-connect-device.md)
