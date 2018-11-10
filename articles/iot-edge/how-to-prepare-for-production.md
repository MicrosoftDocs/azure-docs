---
title: Prepare for a production Azure IoT Edge solution | Microsoft Docs 
description: Learn how to take your Azure IoT Edge solution from development to production, including setting your devices up with the appropriate certificates and making a deployment plan for future code updates. 
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 11/15/2018
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

For steps to update the IoT Edge daemon, see [Update the IoT Edge runtime](how-to-update-iot-edge.md).

### Use Moby as the container engine

Having a container engine on a device is a prerequisite to installing the IoT Edge daemon and runtime. You can use any container engine that you like, but Moby is recommended in production deployments because it is an open-source project and is the only engine officially supported by the IoT Edge supported team. 

## Choose upstream protocol

The protocol (and therefore the port used) for upstream communication to IoT Hub can be configured for both the Edge agent and the Edge hub. The default protocol is AMQP, but you may want to change that depending on your network setup. 

The two runtime modules both have an **UpstreamProtocol** environment variable. The valid values for the variable are: 

* MQTT
* AMQP
* MQTTWS
* AMQPWS

Configure the UpstreamProtocol variable for the Edge agent in the config.yaml file on the device itself. For example, if your IoT Edge device is behind a proxy server that blocks AMQP ports, you may need to configure the Edge agent to use AMQP over WebSocket (AMQPWS) to establish the initial connection to IoT Hub. 

Once your IoT Edge device connects, be sure to continue configuring the UpstreamProtocol variable for both runtime modules in future deployments. An example of this process is provided in [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

## Deployment

* **Helpful**
    * Choose upstream protocol
    * Reduce memory space used by Edge hub
    * Do not use debug versions of module images

### Choose upstream protocol

If you configured the Edge agent on your IoT Edge device to use a different protocol than the default AMQP, then you should declare the same protocol in all subsequent deployments. For example, if your IoT Edge device is behind a proxy server that blocks AMQP ports, you probably configured the device to connect over AMQP over WebSocket (AMQPWS). When you deploy modules to the device, if you don't configure the same APQPWS protocol for the Edge agent and Edge hub, the default AMQP will override the settings and prevent you from connecting again. 

You only have to configure the UpstreamProtocol environment variable for the Edge agent and Edge hub modules. Any additional modules adopt whatever protocol is set in those two. 

An example of this process is provided in [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

### Reduce memory space used by Edge hub

If you're deploying constrained devices with limited memory available, you can configure Edge hub to run in a more streamlined capacity and use less disk space. These configurations do limit the performance of the Edge hub, however, so find the right balance that works for your solution. 

#### Don't optimize for performance on constrained devices

The Edge hub is optimized for performance by default, so attempts to allocate large chunks of memory. This can cause stability problems on smaller devices like the Raspberry Pi. If you're deploying devices with constrained resources, you may want to set the **OptimizeForPerformance** environment variable to **false** on the Edge hub. 

For more information, see [Stability issues on resource constrained devices](troubleshoot.md#stability-issues-on-resource-constrained-devices)

#### Disable unused protocols

Another way to optimize the performance of the Edge hub and reduce its memory usage is to turn off the protocol heads for any protocols that you're not using in your solution. 

Protocol heads are configured by setting boolean environment variables for the Edge hub module in your deployment manifests. The three variables are:

* **amqpSettings__enabled**
* **mqttSettings__enabled**
* **httpSettings__enabled**

All three variables have *two underscores* and can be set to either true or false. 

#### Reduce storage time for messages

The Edge hub module stores messages temporarily if they cannot be delivered to IoT Hub for any reason. You can configure how long the Edge hub holds on to undelivered messages before letting them expire. If you have memory concerns on your device, you can lower the **timeToLiveSecs** value in the Edge hub module twin. 

The default value of the timeToLiveSecs parameter is 7200 seconds, which is two hours. 

### Do not use debug versions of module images

When moving from test scenarios to production scenarios, remember to remove debug configurations from deployment manifests. Check that none of the module images in the deployment manifests have the **.debug** suffix. If you added create options to expose ports in the modules for debugging, remove those as well. 

## Container management

* **Important**
    * Manage access to your container registry
    * Use tags to manage versions

### Manage access to your container registry

Before you deploy modules to production IoT Edge devices, ensure that you control access to your container registry so that outsiders can't access or make changes to your container images. You should use a private, not public, container registry to manage container images. 

In the tutorials and other documentation, we instruct you to use the same container registry credentials on your IoT Edge device as you use on your development machine. These instructions are only intended to help you set up testing and development environments more easily, and should not be followed in a production scenario. Azure Container Registry recommends [authenticating with service principals](../container-registry/container-registry-auth-service-principal.md) when applications or services pull container images in an automated or otherwise unattended manner, as IoT Edge devices do. Create a service principal with read-only access to your container registry, and provide that username and password in the deployment manifest.

### Use tags to manage versions

A tag is a Docker concept that you can use to distinguish between versions of Docker containers. Tags are suffixes like **1.0** that go on the end of a container repository. For example, **mcr.microsoft.com/azureiotedge-agent:1.0**. Tags are mutable and can be changed to point to another container at any time, so your team should agree on a convention to follow as you update your module images moving forward. 

Tags also help you to enforce updates on your IoT Edge devices. When you push an updated version of a module to your container registry, increment the tag. Then, push a new deployment to your devices with the tag incremented. The container engine will recognize the incremented tag as a new version and will pull the latest module version down to your device. 

For an example of a tag convention, see [Update the IoT Edge runtime](how-to-update-iot-edge.md#understand-iot-edge-tags) to learn how IoT Edge uses rolling tags and specific tags to track versions. 

## Networking

* **Helpful**
    * Review outbound/inbound configuration
    * Whitelist connections

### Review outbound/inbound configuration

Communication channels between Azure IoT Hub and IoT Edge are always configured to be outbound. 

## Solution management

* **Important**

* **Helpful**
    * Set up logs and diagnostics
    * Consider tests and CI/CD pipelines