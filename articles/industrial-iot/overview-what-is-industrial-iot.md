---
title: Azure Industrial IoT Overview
description: This article provides an overview of Industrial IoT. It explains the shop floor connectivity and security components in IIoT.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: overview
ms.date: 3/22/2021
---

# What is Industrial IoT (IIoT)?

![Industrial Iot](media/overview-what-is-Industrial-IoT/icon-255-px.png)

Microsoft Azure Industrial Internet of Things (IIoT) is a suite of Azure cloud microservices and Azure IoT Edge modules. Azure  Industrial IoT integrates the power of the cloud into industrial and manufacturing shop floors. Using industry-standard open interfaces such as the [open platform communications unified architecture (OPC UA)](https://opcfoundation.org/about/opc-technologies/opc-ua/), Azure IIoT provides you with the ability to integrate data from assets and sensors - including those systems that are already operating on your factory floor - into the Azure cloud. Having your data in the cloud enables it to be used more rapidly and flexibly as feedback for developing transformative business and industrial processes.

## Discover, register, and manage your Industrial Assets with Azure

The Azure Industrial IoT Platform allows plant operators to discover OPC UA-enabled servers in a factory network and register them in Azure IoT Hub. Operations personnel can subscribe and react to events on the factory floor from anywhere in the world. Azure IIoT will enable the reception of alerts and alarms, and will allow reaction to them in real time.

Azure IIoT provides a set of microservices that connect to OPC UA systems on the shop floor. The microservices REST APIs mirror the OPC UA systems functionality. The REST APIs enable your cloud applications to browse OPC UA server address spaces, read/write values of OPC UA nodes, and execute OPC UA methods. Components at the factory floor are implemented as Azure IoT Edge modules. The cloud microservices are ASP.NET microservices with a REST interface and run on managed Azure Kubernetes Services or standalone on Azure App Service. Azure IoT Edge modules and Azure IIoT cloud services are available as pre-built Docker containers in the Microsoft Container Registry (MCR).

The edge modules and cloud services collaborate closely and must be used together. Azure IIoT provides easy-to-use deployment scripts that allow to deploy the entire platform with a single command.

The REST APIs can be used with any programming language through its exposed Open API specification (Swagger). When integrating OPC UA into cloud management solutions, developers are free to choose technology that matches their skills, interests, and architecture choices. For example, a full stack web developer who develops an application for an alarm and event dashboard can write logic to respond to events in JavaScript or TypeScript without ramping up on an OPC UA SDK, C, C++, Java or C#.

## Manage certificates and trust groups

Azure Industrial IoT manages OPC UA Application Certificates and Trust Lists of factory floor machinery and control systems to keep OPC UA client to server communication secure. It restricts which client is allowed to talk to which server. Storage of private keys and signing of certificates is backed by Azure Key Vault, which supports hardware-based security (HSM).

## Industrial IoT Components

Azure IIoT solutions are built from specific components:

- **At least one Azure IoT Hub.**
- **IoT Edge devices.**
- **Industrial Edge Modules.**

### IoT Hub

The [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) acts as a central message hub for secure, bi-directional communications between any IoT application and the devices it manages. It's an open and flexible cloud platform as a service (PaaS) that supports open-source SDKs and multiple protocols.

Gathering your industrial and business data onto an IoT Hub lets you store your data securely, perform business and efficiency analyses on it, and generate reports from it. You can process your combined data with Microsoft Azure services and tools, for example [Azure Stream Analytics](../stream-analytics/index.yml), or visualize in your Business Intelligence platform of choice such as [Power BI](https://powerbi.microsoft.com).

### IoT Edge devices

The [edge services](https://azure.microsoft.com/services/iot-edge/) are implemented as Azure IoT Edge modules and run on-premises. The cloud microservices are implemented as ASP.NET microservices with a REST interface and run on managed Azure Kubernetes Services or stand-alone on Azure App Service. For both edge and cloud services, we have provided pre-built Docker containers in the Microsoft Container Registry (MCR), removing this step for the customer. The edge and cloud services are applying each other and must be used together. We have also provided easy-to-use deployment scripts that allow one to deploy the entire platform with a single command.

An IoT Edge device is composed of an IoT Edge Runtime and IoT Edge Modules.

- **Edge Modules** are docker containers, which are the smallest unit of computation, like OPC Publisher and OPC Twin.
- **Edge device** is used to deploy such modules, which act as mediator between OPC UA server and IoT Hub in cloud.

### Industrial IoT Edge Modules

- **OPC Publisher**: The OPC Publisher module connects to OPC UA server systems and publishes JSON encoded telemetry data from these servers in OPC UA "Pub/Sub" format to Azure. The OPC Publisher can run in two modes:
  - In combination with and controlled by the Industrial-IoT cloud microservices (orchestrated mode)
  - Configured by a local configuration file to allow operation without any Industrial-IoT cloud microservice (standalone mode)
- **OPC Twin**: The OPC Twin module enables connection from the cloud to OPC UA server systems on the factory network. OPC Twin provides access to OPC UA server systems through REST APIs exposed by the Industrial-IoT cloud microservices. In contrast to OPC Publisher, in OPC Twin, working in standalone mode (module only) isn't supported. The OPC Twin module must work in combination with the Industrial-IoT cloud microservices.
- **Discovery**: The Discovery module works only in combination with the Industrial-IoT cloud microservices. The Discovery module implements OPC UA server system discovery and reports the results to the Industrial-IoT cloud microservices. In contrast to OPC Publisher, in the Discovery module, working in standalone mode (module only) isn't supported. The Discovery module must work in combination with the Industrial-IoT cloud microservices.

## Next steps

You can read more about the OPC Publisher or get started with deploying the IIoT Platform:

> [!div class="nextstepaction"]
> [What is the OPC Publisher?](overview-what-is-opc-publisher.md)

> [!div class="nextstepaction"]
> [Deploy the Industrial IoT Platform](tutorial-deploy-industrial-iot-platform.md)
>