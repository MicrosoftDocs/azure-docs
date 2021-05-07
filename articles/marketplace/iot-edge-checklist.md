---
title: Pre-certification checklist for IoT Edge module offers in Azure Marketplace
description: Learn about the specific certification requirements for publishing IoT Edge module offers in Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 03/01/2021
---

# Pre-certification checklist for IoT Edge modules

> [!NOTE]
> We highly recommended publishers review this checklist and validate module functionality before submitting for certifications. This will accelerate your certification process by reducing the need for changes and resubmissions.

## Validation of image

Once the Edge module image is ready for submission, perform these steps to ensure the image works the way Microsoft expects.

### Steps to perform in the Azure portal

1. Open the [Azure portal](https://partner.microsoft.com/).
1. Create a Resource Group.
1. Create an IoT Hub.
1. Create an IoT Edge Device.
1. Copy the connection string and save it in Notepad.
1. Select the set **Modules on Edge Device Created**.
1. Add the ACR details where the latest version of image resides.
1. Select **Add IoT Edge Module** and provide:
    - The image URI in Module Setting
    - The environmental variable (the same as what is added in Partner Center)
    - The container create options (the same as what is added in Partner Center)
    - The module twin setting (the same as what is added in Partner Center)
1. Add routes (the same as what is added in Partner Center).
1. Select **Review + Create**.

Edge modules are deployed on the Edge device created on Azure.

### Steps to perform on the device

#### Device details

The certification team uses the following hardware to validate images on different architectures:

- For X64 images, an Azure VM having configuration size as Standard D2s v3 running Ubuntu Server 18.04/ Ubuntu Server 16.04.
- For Azure Resource Manager 32 images, a Raspberry Pi 3 Model B.
- For Azure Resource Manager 64 images, a NVIDIA Jetson Nano 4Gb.

#### Steps

1. Ensure devices/VM created can be accessed through Putty.
1. Download [IoT Edge Runtime](../iot-edge/how-to-install-iot-edge.md) onto the device.
1. Update the connection string copied in step 5 to the config.yaml file.
1. Restart the Edge Module with `sudo systemctl restart iotedge`.
1. Check if the module is deployed on device with `sudo iotedge list`; it should be in running state.
1. Ensure the logs of the module deployed with `sudo iotedge logs “Module Name“ -f` do not have any errors. If there are known errors, describe this in the Partner Center **Notes to reviewer** before submitting the offer.

## Metadata validation

Verify the following:

- Latest tag is listed in both Partner Center and the Azure Container Registry.
- Minimum hardware requirement is added in the offer description.
- Azure container registry username and password are updated and added in Partner Center.
- Accuracy of desired **Twin Property** *if applicable*.
- Accuracy of desired **Environmental variables** *if applicable*.
- Accuracy of desired **Create Options** *if applicable*.
- Lead Management connection string is present.
- Privacy policy present
- Terms of use present
- Add supported IoT Edge Device Link from [Azure IoT Device Catalog](https://devicecatalog.azure.com/devices?certificationBadgeTypes=IoTEdgeCompatible) 

## Next steps

- [Deploy modules from the commercial marketplace](../iot-edge/how-to-deploy-modules-portal.md#deploy-from-azure-marketplace)
- [Publish the Edge Module in Partner Center](./partner-center-portal/azure-iot-edge-module-creation.md)
- [Deploy IoT Edge Module](../iot-edge/quickstart-linux.md)