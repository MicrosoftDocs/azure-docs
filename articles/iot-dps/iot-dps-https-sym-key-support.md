---
title: How to use raw HTTPS in Azure IoT Hub Device Provisioning Service
description: This article shows how to use symmetric keys over HTTPS in your Device Provisioning Service (DPS) instance
author: kgremban
ms.author: kgremban
ms.date: 08/19/2022
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
manager: lizross
---

# How to use symmetric keys over HTTPS with Azure IoT Hub Device Provisioning Service


## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

## Use an individual enrollment for symmetric key attestation

Use the [az iot dps enrollment create](/cli/azure/iot/dps/enrollment?view=azure-cli-latest#az-iot-dps-enrollment-create) command to create an individual enrollment for symmetric key attestation.

The following command creates an enrollment entry with the default allocation policy for your DPS instance and lets DPS assign the primary and secondary keys for your device. Substitute the name of your resource group and DPS instance. The enrollment ID is the the registration ID for your device.

```azurecli
az iot dps enrollment create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --attestation-type symmetrickey
```

The assigned symmetric keys are returned in the **attestation** property in the response:

```json

{
  "allocationPolicy": null,
  "attestation": {
    "symmetricKey": {
      "primaryKey": "G3vn0IZH9oK3d4wsxFpWBtd2KUrtjI+39dZVRf26To8w9OX0LaFV9yZ93ELXY7voqHEUsNhnb9bt717UP87KxA==",
      "secondaryKey": "4lNxgD3lUAOEOied5/xOocyiUSCAgS+4b9OvXLDi8ug46/CJzIn/3rN6Ys6gW8SMDDxMQDaMRnIoSd1HJ5qn/g=="
    },
    "tpm": null,
    "type": "symmetricKey",
    "x509": null
  },

  ...

}
```

You can also get the primary key with the [az iot dps enrollment show](/cli/azure/iot/dps/enrollment?view=azure-cli-latest#az-iot-dps-enrollment-show) command:

```azurecli
az iot dps enrollment show -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --show-keys true
```

Note down the primary key and the enrollment ID (registration ID), you'll use them later in this article.

## Use an enrollment group for symmetric key attestation

Use the [az iot dps enrollment-group create](/cli/azure/iot/dps/enrollment-group?view=azure-cli-latest#az-iot-dps-enrollment-group-create) command to create an enrollment group for symmetric key attestation.

The following command creates an enrollment group entry with the default allocation policy for your DPS instance and lets DPS assign the primary and secondary keys for the enrollment group. Substitute the name of your resource group and DPS instance.  

```azurecli
az iot dps enrollment create -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id}
```

The assigned symmetric keys are returned in the **attestation** property in the response:

```json

{
  "allocationPolicy": null,
  "attestation": {
    "symmetricKey": {
      "primaryKey": "G3vn0IZH9oK3d4wsxFpWBtd2KUrtjI+39dZVRf26To8w9OX0LaFV9yZ93ELXY7voqHEUsNhnb9bt717UP87KxA==",
      "secondaryKey": "4lNxgD3lUAOEOied5/xOocyiUSCAgS+4b9OvXLDi8ug46/CJzIn/3rN6Ys6gW8SMDDxMQDaMRnIoSd1HJ5qn/g=="
    },
    "tpm": null,
    "type": "symmetricKey",
    "x509": null
  },

  ...

}
```

You can also get the primary key with the [az iot dps enrollment show](/cli/azure/iot/dps/enrollment?view=azure-cli-latest#az-iot-dps-enrollment-show) command:

```azurecli
az iot dps enrollment-group show -g {resource_group_name} --dps-name {dps_name} --enrollment-id {enrollment_id} --show-keys true
```

Note down the primary key, you'll use it later in this article to create a SAS token to authenticate with DPS.

