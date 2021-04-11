---
title: Azure Industrial IoT Platform
description: This article provides an overview of the Industrial IoT Platform and its components.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: conceptual
ms.date: 3/22/2021
---

# What is the Industrial IoT (IIoT) Platform?

The Azure Industrial IoT Platform is a Microsoft suite of modules and services that are deployed on Azure. These modules and services have fully embraced openness. Specifically, we apply Azure's managed Platform as a Service (PaaS) offering, open-source software licensed via MIT license, open international standards for communication (OPC UA, AMQP, MQTT, HTTP) and interfaces (Open API), and open industrial data models (OPC UA) on the edge and in the cloud.

## Enabling shopfloor connectivity 

The Azure Industrial IoT Platform covers industrial connectivity of shopfloor assets (including discovery of OPC UA-enabled assets), normalizes their data into OPC UA format and transmits asset telemetry data to Azure in OPC UA PubSub format. There, it stores the telemetry data in a cloud database. In addition, the platform enables secure access to the shopfloor assets via OPC UA from the cloud. Device management capabilities (including security configuration) is also built in. The OPC UA functionality has been built using Docker container technology for easy deployment and management. For non-OPC UA-enabled assets, we have partnered with the leading industrial connectivity providers and helped them port their OPC UA adapter software to Azure IoT Edge. These adapters are available in the Azure Marketplace.

## Industrial IoT components: IoT Edge modules and cloud microservices

The edge services are implemented as Azure IoT Edge modules and run on-premises. The cloud microservices are implemented as ASP.NET microservices with a REST interface and run on managed Azure Kubernetes Services or stand-alone on Azure App Service. For both edge and cloud services, we have provided pre-built Docker containers in the Microsoft Container Registry (MCR), removing this step for the customer. The edge and cloud services are leveraging each other and must be used together. We have also provided easy-to-use deployment scripts that allow one to deploy the entire platform with a single command.

## Next steps

Now that you have learned what the Azure Industrial IoT Platform is, you can learn about the OPC Publisher:

> [!div class="nextstepaction"]
> [What is the OPC Publisher?](overview-what-is-opc-publisher.md)