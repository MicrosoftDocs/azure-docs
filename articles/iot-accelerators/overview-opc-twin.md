---
title: What is OPC Twin - Azure | Microsoft Docs
description: This article provides an overview of OPC Twin. OPC Twin provides discovery, registration, and remote control of industrial devices through REST APIs.
author: dominicbetts
ms.author: dobett
ms.date: 11/26/2018
ms.topic: overview
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# What is OPC Twin?

OPC Twin consists of microservices that use Azure IoT Edge and IoT Hub to connect the cloud and the factory network. OPC Twin provides discovery, registration, and remote control of industrial devices through REST APIs. OPC Twin does not require an OPC Unified Architecture (OPC UA) SDK, is programming language agnostic, and can be included in a serverless workflow. This article describes several OPC Twin use cases.

## Discovery and control
You can use OPC Twin for simple for discovery and registration.

### Simple discovery and registration
OPC Twin allows factory operators to scan the factory network, so that OPC UA servers can be discovered and registered. As an alternative, factory operators can also manually register OPC UA devices using a known discovery URL. ​For example, to connect to all the OPC UA devices after the IoT Edge gateway with an OPC Twin module has  been installed on the factory floor, the factory operator can remotely trigger a scan of the network and visually see all the OPC UA servers. ​
​
### Simple control
OPC Twin allows factory operators to react to events and reconfigure their factory floor machines from the cloud either automatically or manually on the fly. OPC Twin provides REST APIs to invoke services on the OPC UA server, browse its address space as well as to read/write variables and execute methods.​ For example, a boiler uses temperature KPI to control the production line. The temperature sensor publishes the change in data using OPC Publisher. The factory operator receives the alert that the temperature has reached the threshold. The production line cools down automatically through OPC Twin. The factory operator is notified of the cool down.​
​
## Authentication
You can use OPC Twin for simple for authentication and for a simple developer experience.

### Simple authentication 
OPC Twin uses Azure Active Directory (AAD)-based authentication and auditing from end to end. ​For example, OPC Twin enables the application to be built on top of OPC Twin to determine what an operator has performed on a machine. On the machine side, it's through OPC UA auditing. On the cloud side, it's through storing an immutable client audit log and AAD authentication on the REST API.​
​
### Simple developer experience 
OPC Twin can be used with applications written in any programming language through REST APIs. As developers integrate an OPC UA client into a solution, knowledge of the OPC UA SDK is not necessary. OPC Twin can seamlessly integrate into stateless, serverless architectures. ​For example, a full stack web developer who develops an application for an alarm and event dashboard can write the logic to respond to events in JavaScript or TypeScript using OPC Twin without the knowledge of C, C#, or the full OPC UA stack implementation. ​

## Next steps

Now that you have learned about OPC Twin and its uses, here is the suggested next step:

> [!div class="nextstepaction"]
> [What is OPC Vault](overview-opc-vault.md)
