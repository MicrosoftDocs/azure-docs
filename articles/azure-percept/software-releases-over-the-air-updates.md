---
title: Software releases for Azure Percept DK OTA updates
description: Information and download links for the Azure Percept DK over-the-air update packages
author: yvonne-dq
ms.author: hschang
ms.service: azure-percept
ms.topic: conceptual
ms.date: 10/04/2022
ms.custom: template-concept
---


# Software releases for OTA updates

[!INCLUDE [Retirement note](./includes/retire.md)]


>[!CAUTION]
>**The OTA update on Azure Percept DK is no longer supported. For information on how to proceed, please visit [Update the Azure Percept DK over a USB-C cable connection](./how-to-update-via-usb.md).**

The OTA update is built for users who tend to always keep the dev kit up to date. That's why only the hard-stop versions and the latest version are provided here. To change your dev kit to a specific (older) version, use the USB cable update. Refer to [Update the Azure Percept DK over a USB-C cable connection](./how-to-update-via-usb.md). Also use the USB update if you want to jump to a much advanced version.

>[!CAUTION]
>Dev kit doesn't support SW version downgrade with OTA. The Device Update for IoT Hub framework will NOT block deploying an image with version older than the current one. However doing so to dev kit will result in loss of data and functionality.

>[!IMPORTANT]
>Be sure to check the following document before you decide to go with either OTA or USB cable update.
>
>[How to determine your update strategy](./how-to-determine-your-update-strategy.md)

## Hard-stop version of OTA

Microsoft would service each dev kit release with OTA packages. However, as there are breaking changes for dev kit OS/firmware, or the OTA platform, OTA directly from an old version to a much-advanced version may be problematic. Generally, when a breaking change happens, Microsoft will make sure that the OTA update process transitions the old system seamlessly to **the very first version that introduces/deliver this breaking change**. This specific version becomes a hard-stop version for OTA. Take a known hard-stop version: **June release** as an example. OTA will work if a user updates the dev kit from 2104 to 2106, then from 2106 to 2107. However, it will NOT work if a user tries to skip the hard-stop (2106) and update the dev kit from 2104 directly to 2107.

:::image type="content" source="./media/azure-percept-devkit-software-releases-ota-update/hard-stop-illustrate.png" alt-text="Hard-stop version of OTA":::

## Recommendations for applying the OTA update

**Scenario 1:** Frequently (monthly) update the dev kit to make sure it’s always up to date

- There should be no problem if you always do OTA to update the dev kit from last release to the newly released version.

**Scenario 2:** Do update while few versions might be skipped.

1. Identify the current software version of dev kit.
1. Review the OTA package release list to look for any hard-stop version between the current version and target version.
    - If there is, you need to sequentially deploy the hard-stop version(s) until you can deploy the latest update package.
    - If there isn't, then you can directly deploy the latest OTA package to the dev kit.

## Identify the current software version of dev kit

**Option 1:**

1. Sign in to the [Azure Percept Studio](./overview-azure-percept-studio.md).
1. In **Devices**, choose your dev kit device.
1. In the **General** tab, look for the **Model** and **SW Version** information.

**Option 2:**

1. View the **IoT Edge Device** of **IoT Hub** service from Microsoft Azure portal.
1. Choose your dev kit device from the device list.
1. Select **Device twin**.
1. Scroll through the device twin properties and locate **"model"** and **"swVersion"** under **"deviceInformation"** and make a note of their values.

## Identify the OTA package(s) to be deployed

>[!IMPORTANT]
>If the current version of your dev kit isn't included in any of the releases below, it's NOT supported for OTA update. Please do a USB cable update to get to the latest version.

>[!CAUTION]
>Make sure you are using the **old version** of the Device Update for IoT Hub. To do that, navigate to **Device management > Updates** in your IoT Hub, select the **switch to the older version** link in the banner. For more information, please refer to [Update Azure Percept DK over-the-air](./how-to-update-over-the-air.md).

**Latest release:**

|Release|Applicable Version(s)|Download Links|Note|
|---|---|---|---|
|June Service Release (2206)|2021.106.111.115,<br>2021.107.129.116,<br>2021.109.129.108, <br>2021.111.124.109, <br>2022.101.112.106, <br>2022.102.109.102, <br>2022.103.110.103|[2022.106.120.102 OTA update package](<https://download.microsoft.com/download/b/7/1/b71877b8-4882-4447-b3f3-8359ee8341e2/2022.106.120.102 OTA update package.zip>)|Make sure you are using the **old version** of the Device Update for IoT Hub. To do that, navigate to **Device management > Updates** in your IoT Hub, select the **switch to the older version** link in the banner. For more information, please refer to [Update Azure Percept DK over-the-air](./how-to-update-over-the-air.md).|

**Hard-stop releases:**

|Release|Applicable Version(s)|Download Links|Note|
|---|---|---|---|
|June Service Release (2106)|2021.102.108.112, 2021.104.110.103, 2021.105.111.122 |[2021.106.111.115 OTA manifest (for PE-101)](https://download.microsoft.com/download/d/f/0/df0f17dc-d2fb-42ff-aaa5-98edf4d6d1e8/aduimportmanifest_PE-101_2021.106.111.115_v3.json)<br>[2021.106.111.115 OTA manifest (for APDK-101)](https://download.microsoft.com/download/d/f/0/df0f17dc-d2fb-42ff-aaa5-98edf4d6d1e8/aduimportmanifest_Azure-Percept-DK_2021.106.111.115_v3.json) <br>[2021.106.111.115 OTA update package](https://download.microsoft.com/download/d/f/0/df0f17dc-d2fb-42ff-aaa5-98edf4d6d1e8/Microsoft-Azure-Percept-DK-2021.106.111.115.swu) |Be sure to use the correct manifest based on "model name" (PE-101/APDK-101)|

## Next steps

[Update your Azure Percept DK over-the-air (OTA)](./how-to-update-over-the-air.md)
