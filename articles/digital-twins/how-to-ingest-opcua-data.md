---
# Mandatory fields.
title: Ingest OPC UA data with Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Steps to get your industrial OPC UA data into Azure Digital Twins
author: barnstee
ms.author: erichb # Microsoft employees only
ms.date: 11/18/2022
ms.topic: how-to
ms.service: digital-twins
# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingesting OPC UA data with Azure Digital Twins

This article describes a solution for an automated ingestion path from [OPC Unified Architecture (OPC UA)](https://opcfoundation.org/about/opc-technologies/opc-ua/) manufacturing assets to Azure Digital Twins.

## About OPC UA 

The OPC UA is a platform independent, service-oriented architecture for industrial verticals. It's used for machine-to-machine communication, machine-to-SCADA-system communication, and manufacturing execution systems communication. More recently, it's also been used for field-level communication and cloud communication. It comes with best-in-class security and rich data modeling capabilities, and represents the standard for modeling and communicating with industrial assets. Microsoft has been a member of the OPC Foundation, OPC UA's non-profit governing body, since its inception. Microsoft has been integrating OPC UA into its products since 2015, and has been instrumental in defining the use of OPC UA in the cloud.

Using the solution described in this article to ingest OPC UA data into Azure Digital Twins has several advantages over traditional mechanisms:

* **Open**: By using open standards like OPC UA and the [ISA95](https://en.wikipedia.org/wiki/ANSI/ISA-95) ontology, you aren't locked into a solution architecture that might otherwise be difficult to leave.
* **Cost optimized**: If you're already using OPC UA and ISA95 data models, you can save money and effort by using resources that you already have.
* **Time optimized**: Since the ingestion in this solution is set up to happen automatically, it eliminates the need to create a digital twin ontology from scratch.

## Solution overview

This solution provides an automated ingestion path from OPC UA-enabled manufacturing assets in multiple simulated factories to digital twins in an Azure Digital Twins service. 

The example simulates eight OPC UA production lines in six locations, with each production line featuring assembly, test, and packaging machines. These machines are controlled by a separate manufacturing execution system. The solution uses a set of [manufacturing ontologies](https://github.com/digitaltwinconsortium/ManufacturingOntologies) for modeling the environment. 

:::image type="content" source="media/how-to-ingest-opcua-data/production-line.png" alt-text="Screenshot showing a graph with nodes representing the O P C U A production line." lightbox="media/how-to-ingest-opcua-data/production-line.png":::

The data flow is as follows:

1. The UA Cloud Publisher reads OPC UA data from each simulated factory, and forwards it via OPC UA PubSub over MQTT to Azure IoT Hub. UA Cloud Publisher runs in a Docker container to simplify deployment.

1. The UA Cloud Twin reads and processes the OPC UA data from IoT Hub, and forwards it to the Azure Digital Twins service. UA Cloud Twin runs in a Docker container to simplify deployment.

1. The UA Cloud Twin creates digital twins in Azure Digital Twins automatically and on-demand, mapping each OPC UA element (including publishers, server namespaces, and nodes) to a separate digital twin.

    The UA Cloud Twin also automatically updates each digital twin when there are data changes in the OPC UA node. This allows the [historization of digital twin time-series data](concepts-data-history.md) in Azure Data Explorer for condition monitoring, OEE calculation, and predictive maintenance scenarios.

## Architecture

Here are the components required for this solution.

:::image type="content" source="media/how-to-ingest-opcua-data/opcua-to-azure-digital-twins-diagram.png" alt-text="Architectural diagram of the O P C U A to Azure Digital Twins solution." lightbox="media/how-to-ingest-opcua-data/opcua-to-azure-digital-twins-diagram.png":::

| Component | Description |
| --- | --- |
| Industrial Assets | OPC UA-enabled assets. A set of simulated production lines is provided until you're ready to connect your own physical assets. |
| Kubernetes | Kubernetes is a Docker container orchestration system, deployed at the edge in fault-tolerant industrial gateways. |
| [UA Cloud Publisher](https://github.com/barnstee/ua-cloudpublisher) | This reference implementation converts OPC UA Client/Server requests into OPC UA PubSub cloud messages. |
| [Azure IoT Hub](../iot-hub/about-iot-hub.md) | The cloud message broker that receives OPC UA PubSub messages from edge gateways and stores them until they're retrieved by subscribers like the UA Cloud Twin. |
| [UA Cloud Twin](https://github.com/digitaltwinconsortium/UA-CloudTwin) | This cloud application converts OPC UA PubSub cloud messages into Azure Digital Twins service updates, using the ISA95 ontology to create digital twins automatically. |
| [Azure Digital Twins](overview.md) | The platform that enables the creation of a digital representation of real-world things, places, business processes, and people. |

## Installation

Start by selecting the button below to deploy all required resources for this solution.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdigitaltwinconsortium%2FManufacturingOntologies%2Fmain%2FDeployment%2Farm.json)

Once the deployment is complete in the Azure portal, follow these steps to configure the production line simulation.

1. In the IoT Hub that was deployed, create six devices and call them *publisher.munich.corp.contoso*, *publisher.capetown.corp.contoso*, *publisher.mumbai.corp.contoso*, *publisher.seattle.corp.contoso*, *publisher.beijing.corp.contoso*, and *publisher.rio.corp.contoso*.

2. Log in to the deployed VM using the credentials you provided during deployment. Download and install Docker Desktop from the [Docker Desktop page](https://www.docker.com/products/docker-desktop), including the Windows Subsystem for Linux (WSL) integration. After installation and a required system restart, accept the license terms and install the WSL2 Linux kernel by following the instructions. Then, verify that Docker Desktop is running in the Windows System Tray and enable Kubernetes in Settings.

3. On the VM, browse to the [Digital Twin Consortium's Manufacturing Ontologies repo](https://github.com/digitaltwinconsortium/ManufacturingOntologies) and select **Code** and **Download Zip**. Unzip the contents to a directory of your choice. Navigate to the *OnPremAssets* directory of the zip you downloaded, and edit the *settings.json* file for each publisher directory located in the Config directory. Replace `[myiothub]` with the name of your IoT Hub, and replace `[publisherkey]` with the primary key of the six IoT Hub publisher devices you created earlier. This data can be accessed by clicking on the names of the devices in the Azure portal.

4. On the VM, run the *StartSimulation.cmd* script from the *OnPremAssets* folder in a command prompt window. A total of eight production lines will be started, each with three stations (assembly, test and packaging). There is also an MES per line, and a UA Cloud Publisher instance per factory location. There are six locations in total: Munich, Cape town, Mumbai, Seattle, Beijing and Rio. Next, check your IoT Hub in the [Azure portal](https://portal.azure.com) to verify that OPC UA telemetry is flowing to the cloud.

5. Under your Azure Digital Twins instance in the [Azure portal](https://portal.azure.com), navigate to **Access Control** and then **Role Assignments**. Add a new role assignment of type *Azure Digital Twins Data Owner*, and assign its access to **Managed Identity**. Under **Select Users**, select your previously deployed Azure Web App service instance.

6. Open the URL of the deployed Azure Web App service in a browser, fill in the two fields under **Settings**, and select **Apply**. The Azure Event Hubs connection string for the Azure IoT Hub can be read in the [Azure portal](https://portal.azure.com) under **Built-in Endpoints** and **Event Hub-compatible endpoint**. You can use [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) to monitor twin property updates and add additional relationships to the digital twins created, such as the order of machines in your production lines.

:::image type="content" source="media/how-to-ingest-opcua-data/azure-digital-twins-explorer.png" alt-text="Screenshot of using Azure Digital Twins Explorer to monitor twin property updates." lightbox="media/how-to-ingest-opcua-data/azure-digital-twins-explorer.png":::

7. Set up [data history](concepts-data-history.md) in your Azure Digital Twins instance to historize your contextualized OPC UA data to the Azure Data Explorer that was deployed in this solution. You can navigate to the Azure Digital Twins service configuration in the [Azure portal](https://portal.azure.com) and follow the wizard to set this up.

## Next steps

Use the instructions for [replacing the simulation with a real production line](https://github.com/digitaltwinconsortium/ManufacturingOntologies#replacing-the-production-line-simulation-with-a-real-production-line) to connect your own industrial assets into this solution.

Or, visit the Azure Data Explorer documentation to see how to create [condition monitoring dashboards](../data-explorer/azure-data-explorer-dashboards.md).