---
title: 'Configure package repository for package updates | Microsoft Docs'
description: Follow an example to configure package repository for package updates.
author: valls 
ms.author: valls
ms.date: 8/8/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---
# Introduction

When managing IoT devices, in some use cases you would need to configure or modify the the source package repository used to store and deliver over-the-air updates to your fleet of devices. 

Such as:
- You need to deliver over-the-air updates to your devices from a private package repository with approved versions of libraries and components
- You need devices to get packages from a specific vendor's repository

Following this document, learn how to configure a package repository using [OSConfig for IoT](https://docs.microsoft.com/azure/osconfig/overview-osconfig-for-iot) and deploy packages based updates from that repository to your device fleet using [Device Update for IoT Hub]( https://docs.microsoft.com/azure/iot-hub-device-update/). Package-based updates are targeted updates that alter only a specific component or application on the device. They lead to lower consumption of bandwidth and help reduce the time to download and install the update. Package-based updates also typically allow for less downtime of devices when you apply an update and avoid the overhead of creating images. 

## Prerequisites

You will need the following to get started:
- An Azure account with an IoT Hub
- At least one Linux device with the OSConfig agent installed and connected to Azure IoT. See [how to](https://docs.microsoft.com/azure/osconfig/osconfig-howto-install).
- Create an Device Update account and instance in your IoT Hub. See [how to](https://docs.microsoft.com/azure/iot-hub-device-update/create-device-update-account)
- Install the Device Update agent to the same Linux device where you have the OSConfig agent installed. See [how to](https://docs.microsoft.com/azure/iot-hub-device-update/device-update-agent-provisioning) on your IoT device
- Use Azure Portal or Azure CLI to interact with the devices via your IoT Hub

## How to configure package repository for package updates
Follow the below steps to update Azure IoT Edge on Ubuntu Server 18.04 x64 by configuring a source repository. The tools and concepts in this tutorial still apply even if you plan to use a different OS platform configuration.

1. Configure the package repository of your choice with the OSConfig’s configure package repo module. See [how to](https://docs.microsoft.com/azure/osconfig/howto-pmc?tabs=portal%2Csingle#example-1--specify-desired-package-sources). This should be the location where you wish to store packages to be downloaded to the device. Customers can use these modules as is or OSConfig is also extensible for customers to write a their own modules. Note: Only available for Linux devices.
2. Upload your packages to the above configured repository.
3. Create an (APT manifest)[ https://docs.microsoft.com/en-us/azure/iot-hub-device-update/device-update-apt-manifest], which provides the Device Update agent with the information it needs to download and install the packages specified in the APT manifest file (and their dependencies) from the repository.
4. Follow steps from [here](https://docs.microsoft.com/azure/iot-hub-device-update/device-update-ubuntu-agent#prerequisites) to do a package update with Device Update. Device Update is used to deploy package updates to a large number of devices and at scale. 
5. Monitor results of the package update by following these [steps](https://docs.microsoft.com/azure/iot-hub-device-update/device-update-ubuntu-agent#monitor-the-update-deployment).
