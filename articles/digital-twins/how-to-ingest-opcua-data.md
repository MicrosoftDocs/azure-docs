---
# Mandatory fields.
title: Ingest OPC UA data with Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Steps to get your industrial OPC UA data into Azure Digital Twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/4/2022
ms.topic: how-to
ms.service: digital-twins
# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingesting OPC UA data with Azure Digital Twins

The [OPC Unified Architecture (OPC UA)](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a platform independent, service-oriented architecture for industrial verticals. It is used for machine to machine communication and more recently also for field-level communication and cloud communication. It comes with best-in-class secuirty and a rich data modelling capabilities. Microsoft has been a member of the OPC Foundation, OPC UA's non-profit governing body since its foundation. Microsoft has been integrating OPC UA into its products since 2015 and has been instrumental in defining the use of OPC UA in the cloud.

Getting OPC UA data to flow from on-premises systems to Azure Digital Twins in the cloud requires two applications and a message broker service to be deployed. This article shows how to configure these apps and services.

## Architecture

Here are the components that will be included in this solution.

 :::image type="content" source="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png" alt-text="Drawing of the opc ua to Azure Digital Twins architecture" lightbox="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png":::    

| Component | Description |
| --- | --- |
| Industrial Assets | OPC UA-enabled assets. A set of simulated production lines is provided until you are ready to connect your own physical assets. |
| Kubernetes | Kubernetes is a Docker container orchistration system deployed at the Edge in fault-tolerant industrial gateways. |
| [UA Cloud Publisher](https://github.com/barnstee/ua-cloudpublisher) | This reference implementation converts OPC UA Client/Server requests into OPC UA PubSub cloud messages. |
| [Azure IoT Hub](../../iot-hub/about-iot-hub.md) | The cloud message broker that receives OPC UA PubSub messages from Edge gateways and stores them until they are retrieved by subscribers like the UA Cloud Twin. |
| [UA Cloud Twin](https://github.com/digitaltwinconsortium/UA-CloudTwin) | This cloud application converts OPC UA PubSub cloud messages into Azure Digital Twins service updates, leveraging the ISA95 ontology to create digital twins automatically. |
| [Azure Digital Twins](../overview.md) | The platform that enables the creation of a digital representation of real-world things, places, business processes, and people. |

## Installation

For step-by-step instructions, including a simple "Deploy to Azure" button, please see [here](https://github.com/digitaltwinconsortium/ManufacturingOntologies#automatic-installation-of-production-line-simulation-and-cloud-services).

After installation completes, you can use Azure Digital Twins Explorer to manually monitor twin property updates.

:::image type="content" source="media/how-to-ingest-opcua-data/adt-explorer-2.png" alt-text="Screenshot of using azure digital twins explorer to monitor twin property updates":::

## Next steps

In this article, you set up a full data flow for getting OPC UA data into Azure Digital Twins from simulated production lines.

Next, use the instructions [here](https://github.com/digitaltwinconsortium/ManufacturingOntologies#replacing-the-production-line-simulation-with-a-real-production-line) to connect your own industrial assets.
