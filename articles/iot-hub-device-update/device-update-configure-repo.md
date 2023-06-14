---
title: 'Configure package repository for package updates | Microsoft Docs'
description: Follow an example to configure package repository for package updates.
author: kgremban 
ms.author: kgremban
ms.date: 8/8/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---
# Introduction to configuring package repository

This article describes how to configure or modify the source package repository used with [Package updates](device-update-ubuntu-agent.md).

Such as:
- You need to deliver over-the-air updates to your devices from a private package repository with approved versions of libraries and components
- You need devices to get packages from a specific vendor's repository

Following this document, learn how to configure a package repository using [OSConfig for IoT](/azure/osconfig/overview-osconfig-for-iot) and deploy packages based updates from that repository to your device fleet using [Device Update for IoT Hub](understand-device-update.md). Package-based updates are targeted updates that alter only a specific component or application on the device. They lead to lower consumption of bandwidth and help reduce the time to download and install the update. Package-based updates also typically allow for less downtime of devices when you apply an update and avoid the overhead of creating images. 

## Prerequisites

You need an Azure account with an [IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md) and Microsoft Azure Portal or Azure CLI to interact with devices via your IoT Hub. Follow the next steps to get started:
- Create a Device Update account and instance in your IoT Hub. See [how to create it](create-device-update-account.md).
- Install the [IoT Hub Identity Service](https://azure.github.io/iot-identity-service/installation.html) (or skip if [IoT Edge 1.2](../iot-edge/how-to-provision-single-device-linux-symmetric.md?preserve-view=true&tabs=azure-portal%2cubuntu&view=iotedge-2020-11#install-iot-edge) or higher is already installed on the device).
- Install the Device Update agent on the device. See [how to](device-update-ubuntu-agent.md#manually-prepare-a-device).
- Install the OSConfig agent on the device. See [how to](/azure/osconfig/howto-install?tabs=package#step-11-connect-a-device-to-packagesmicrosoftcom).
- Now that both the agent and IoT Hub Identity Service are present on the device, the next step is to configure the device with an identity so it can connect to Azure. See example [here](/azure/osconfig/howto-install?tabs=package#job-2--connect-to-azure)

## How to configure package repository for package updates
Follow the below steps to update Azure IoT Edge on Ubuntu Server 18.04 x64 by configuring a source repository. The tools and concepts in this tutorial still apply even if you plan to use a different OS platform configuration.

1. Configure the package repository of your choice with the OSConfig’s configure package repo module. See [how to](/azure/osconfig/howto-pmc?tabs=portal%2Csingle#example-1--specify-desired-package-sources). This repository should be the location where you wish to store packages to be downloaded to the device.
2. Upload your packages to the above configured repository.
3. Create an [APT manifest](device-update-apt-manifest.md) to provide the Device Update agent with the information it needs to download and install the packages (and their dependencies) from the repository.
4. Follow steps from [here](device-update-ubuntu-agent.md#prerequisites) to do a package update with Device Update. Device Update is used to deploy package updates to a large number of devices and at scale. 
5. Monitor results of the package update by following these [steps](device-update-ubuntu-agent.md#monitor-the-update-deployment).