---
title: Azure Industrial IoT Overview
description: This article provides an overview of Industrial IoT. It explains the shop floor connectivity and security components in IIoT.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: overview
ms.date: 3/22/2021
---

# What is Industrial IoT (IIoT)?

![Industrial Iot](media/overview-what-is-Industrial-IoT/icon-255-px.png)

Microsoft Azure Industrial Internet of Things (IIoT) is a suite of Azure modules and services that integrate the power of the cloud into industrial and manufacturing shop floors. Using industry-standard open interfaces such as the [open platform communications unified architecture (OPC UA)](https://opcfoundation.org/about/opc-technologies/opc-ua/), Azure IIoT provides you with the ability to integrate data from assets and sensors - including those that are already operating on your factory floor - into the Azure cloud. Having your data in the cloud enables it to be used more rapidly and flexibly as feedback for developing transformative business and industrial processes.

## Discover, register, and manage your Industrial Assets with Azure

Azure Industrial IoT allows plant operators to discover OPC UA-enabled servers in a factory network and register them in Azure IoT Hub. Operations personnel can subscribe and react to events on the factory floor from anywhere in the world, receive alerts and alarms, and react to them in real time.

IIoT provides a set of Microservices that implement OPC UA functionality. The Microservices REST APIs mirror the OPC UA services edge-side. They are secured using OAUTH authentication and authorization backed by Azure Active Directory (AAD). This enables your cloud applications to browse server address spaces or read/write variables and execute methods using HTTPS and simple OPC UA JSON payloads. The edge services are implemented as Azure IoT Edge modules and run on-premises. The cloud microservices are implemented as ASP.NET microservices with a REST interface and run on managed Azure Kubernetes Services or stand-alone on Azure App Service. For both edge and cloud services, IIoT provides pre-built Docker containers in the Microsoft Container Registry (MCR), removing this step for the customer. The edge and cloud services are leveraging each other and must be used together. IIoT also provides easy-to-use deployment scripts that allow one to deploy the entire platform with a single command.

In addition, the REST APIs can be used with any programming language through its exposed Open API specification (Swagger). This means when integrating OPC UA into cloud management solutions, developers are free to choose technology that matches their skills, interests, and architecture choices. For example, a full stack web developer who develops an application for an alarm and event dashboard can write logic to respond to events in JavaScript or TypeScript without ramping up on a OPC UA SDK, C, C++, Java or C#.

## Manage certificates and trust groups

Azure Industrial IoT manages OPC UA Application Certificates and Trust Lists of factory floor machinery and control systems to keep OPC UA client to server communication secure. It restricts which client is allowed to talk to which server. Storage of private keys and signing of certificates is backed by Azure Key Vault, which supports hardware based security (HSM).

## Industrial IoT Components

Azure IIoT solutions are built from specific components. These include the following.

- **At least one Azure IoT Hub.**
- **IoT Edge devices.**
- **Industrial Edge Modules.**

### IoT Hub
The [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/ acts as a central message hub for secure, bi-directional communications between any IoT application and the devices it manages. It's an open and flexible cloud platform as a service (PaaS) that supports open-source SDKs and multiple protocols. 

Gathering your industrial and business data onto an IoT Hub lets you store your data securely, perform business and efficiency analyses on it, and generate reports from it. You can also apply Microsoft Azure services and tools, such as [Power BI](https://powerbi.microsoft.com), on your consolidated data.

### IoT Edge devices
The [edge services](https://azure.microsoft.com/services/iot-edge/) are implemented as Azure IoT Edge modules and run on-premises. The cloud microservices are implemented as ASP.NET microservices with a REST interface and run on managed Azure Kubernetes Services or stand-alone on Azure App Service. For both edge and cloud services, we have provided pre-built Docker containers in the Microsoft Container Registry (MCR), removing this step for the customer. The edge and cloud services are leveraging each other and must be used together. We have also provided easy-to-use deployment scripts that allow one to deploy the entire platform with a single command.

An IoT Edge device is composed of Edge Runtime and Edge Modules.
- **Edge Modules** are docker containers, which are the smallest unit of computation, like OPC Publisher and OPC Twin. 
- **Edge device** is used to deploy such modules, which act as mediator between OPC UA server and IoT Hub in cloud.

### Industrial Edge Modules
- **OPC Publisher**: The OPC Publisher runs inside IoT Edge. It connects to OPC UA servers and publishes JSON encoded telemetry data from these servers in OPC UA "Pub/Sub" format to Azure IoT Hub. All transport protocols supported by the Azure IoT Hub client SDK can be used, i.e. HTTPS, AMQP, and MQTT.
- **OPC Twin**: The OPC Twin consists of microservices that use Azure IoT Edge and IoT Hub to connect the cloud and the factory network. OPC Twin provides discovery, registration, and remote control of industrial devices through REST APIs. OPC Twin doesn't require an OPC Unified Architecture (OPC UA) SDK. It's programming language agnostic, and can be included in a serverless workflow.
- **Discovery**: The discovery module, represented by the discoverer identity, provides discovery services on the edge, which include OPC UA server discovery. If discovery is configured and enabled, the module will send the results of a scan probe via the IoT Edge and IoT Hub telemetry path to the Onboarding service. The service processes the results and updates all related Identities in the Registry.

## Next steps
Now that you have learned what Industrial IoT is, you can read about the Industrial IoT Platform and the OPC Publisher:

> [!div class="nextstepaction"]
> [What is the OPC Publisher?](overview-what-is-opc-publisher.md)