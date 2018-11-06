---
title: Prepare for a production Azure IoT Edge solution | Microsoft Docs 
description: Learn how to take your Azure IoT Edge solution from development to production, including setting your devices up with the appropriate certificates and making a deployment plan for future code updates. 
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 11/01/2017
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# How to prepare your IoT Edge solution for production

When you're ready to take your IoT Edge solution from development into production, make sure that it's configured for ongoing performance.

The information provided in this article is not all equal. To help you prioritize, each section starts with lists that divide the work into two sections: **important** to complete before going to production, or **helpful** for you to know.

## Device configuration

IoT Edge devices can be anything from a Raspberry Pi to a laptop to a virtual machine running on a server. You may have access to the device either physically or through a virtual connection, or it may be isolated for extended periods of time. Either way, you want to make sure that it's configured to perform appropriately. 

* **Important**
    * Install production certificates
    * Have a device management plan
    * Use Moby as the container engine

* **Helpful**
    * Ensure the system time is accurate
    * Choose upstream protocol

### Install production certificates

Every IoT Edge device in production needs a device certificate authority (CA) certificate installed on it, and then declared to the IoT Edge runtime in the config.yaml file. To make development and testing easier, the IoT Edge runtime creates temporary certificates if none are declared in the config.yaml file, but these certificates expire and aren't secure for production scenarios. 

To understand the role of the device CA certificate, see [How Azure IoT Edge uses certificates](iot-edge-certs.md).

The steps to install certificates on an IoT Edge device and point to them from the config.yaml file are detailed in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md). The steps for configuring the certificates are the same whether the device is going to be used as a gateway or not. That article provides scripts to generate sample certificates for testing only. Don't use those sample certificates in production. 

### Have a device management plan

Before you put any device in production you should know how you're going to manage future updates. For an IoT Edge device, the list of components to update may include:

* Device firmware
* Operating system libraries
* Container engine, like Moby
* IoT Edge daemon
* CA certificates



## Deployment

* **Important**

* **Helpful**
    * Choose upstream protocol
    * Optimize for performance on constrained devices
    * Cap the Edge Hub memory
    * Do not use debug versions of module images

## Container management

* **Important**
    * Use a private container registry
    * Use tags to manage versions

* **Helpful**

## Networking

* **Important**

* **Helpful**
    * Review outbound/inbound configuration
    * Whitelist connections

## Solution management

* **Important**

* **Helpful**
    * Set up logs and diagnostics
    * Consider tests and CI/CD pipelines