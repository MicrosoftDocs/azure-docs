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

# Introduction

This solution provides an automated ingestion path from OPC UA-enabled manufacturing assets in multiple simulated factories to digital twins in an Azure Digital Twins service. More specifically, the example:
* Simulates 8 OPC UA production lines in 6 locations, with each production line featuring a assembly, test and packaging machines. These machines are controlled by a seperate Manufacturing Execution System.

:::image type="content" source="media/how-to-ingest-opcua-data/productionline.png" alt-text="Drawing of the opc ua production line" lightbox="media/how-to-ingest-opcua-data/production-line-3.png":::

* The UA Cloud Publisher reads OPC UA data from each simulated factory and forwards it via OPC UA Pub Sub over MQTT to Azure IoT Hub. UA Cloud Publisher runs in a Docker container for easy deployment.

* The UA Cloud Twin reads and processes the OPC UA data from IoT Hub and forwards it to Azire Digital Twins service. UA Cloud Twin runs in a Docker container for easy deployment.

* The UA Cloud Twin creates digital twins in Azure Digital Twins service automatically and on-the-fly, mapping each OPC UA element (publishers, server namespaces and nodes) to a seperate digital twin.

* The UA Cloud Twin also automatically updates each digital twin on OPC UA node data changes. This allows the historization of digital twin time-series data in Azure Data Explorer for condition monitoring, OEE calculation and predictive maitenance scenarios.

## About OPC UA

The [OPC Unified Architecture (OPC UA)](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a platform independent, service-oriented architecture for industrial verticals. It's used for machine to machine communication, machine to SCADA system or Manufacturing Execution System communication and more recently also for field-level communication and cloud communication. It comes with best-in-class security and rich data modeling capabilities and represents the standard bar none for modeling and communicating with industrial assets. Microsoft has been a member of the OPC Foundation, OPC UA's non-profit governing body since its foundation. Microsoft has been integrating OPC UA into its products since 2015 and has been instrumental in defining the use of OPC UA in the cloud.

Using the solution outlined below has several advantages over traditional mechanisms:

1. **Open**: By using open standards like OPC UA and the ISA95 ontology, you aren't locked into a solution architecture you'll never be able to leave again.

2. **Cost optimized**: By using OPC UA and ISA95 data models you should already be familiar with, you can save money and effort and use what you already have.

3. **Time optimized**: Since the ingestion happens automatically, it eliminates the need for you to create a digital twin ontology from scratch.

Learn more about the [manufacturing ontologies](https://github.com/digitaltwinconsortium/ManufacturingOntologies) used in this solution.

## Architecture

Here are the components required for this solution.

 :::image type="content" source="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png" alt-text="Drawing of the opc ua to Azure Digital Twins architecture" lightbox="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png":::

| Component | Description |
| --- | --- |
| Industrial Assets | OPC UA-enabled assets. A set of simulated production lines is provided until you're ready to connect your own physical assets. |
| Kubernetes | Kubernetes is a Docker container orchestration system deployed at the Edge in fault-tolerant industrial gateways. |
| [UA Cloud Publisher](https://github.com/barnstee/ua-cloudpublisher) | This reference implementation converts OPC UA Client/Server requests into OPC UA PubSub cloud messages. |
| [Azure IoT Hub](../iot-hub/about-iot-hub.md) | The cloud message broker that receives OPC UA PubSub messages from Edge gateways and stores them until they're retrieved by subscribers like the UA Cloud Twin. |
| [UA Cloud Twin](https://github.com/digitaltwinconsortium/UA-CloudTwin) | This cloud application converts OPC UA PubSub cloud messages into Azure Digital Twins service updates, using the ISA95 ontology to create digital twins automatically. |
| [Azure Digital Twins](overview.md) | The platform that enables the creation of a digital representation of real-world things, places, business processes, and people. |

## Installation

Click on the button below, it will deploy all required resources.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdigitaltwinconsortium%2FManufacturingOntologies%2Fmain%2FDeployment%2Farm.json)

Once the deployment is complete in the Azure portal, follow these steps to configure the production line simulation.

1. In the deployed IoT Hub, create six devices and call them publisher.munich.corp.contoso, publisher.capetown.corp.contoso, publisher.mumbai.corp.contoso, publisher.seattle.corp.contoso, publisher.beijing.corp.contoso and publisher.rio.corp.contoso.

2. Log in to the deployed VM using the credentials you provided during deployment and download and install Docker Desktop from the [Docker Desktop page](https://www.docker.com/products/docker-desktop), including the Windows Subsystem for Linux (WSL) integration. After installation and a required system restart, accept the license terms and install the WSL2 Linux kernel by following the instructions. Then verify that Docker Desktop is running in the Windows System Tray and enable Kubernetes in Settings.

3. On the VM, browse to the [Digital Twin Consortium's Manufacturing Ontologies repo](https://github.com/digitaltwinconsortium/ManufacturingOntologies) and select Code -> Download Zip. Unzip the contents to a directory of your choice. Navigate to the OnPremAssets directory of the Zip you downloaded and edit the settings.json file for each publisher directory located in the Config directory. Replace [myiothub] with the name of your IoT Hub and replace [publisherkey] with the primary key of the six IoT Hub publisher devices you've created earlier. This data can be accessed by clicking on the names of the devices in the Azure portal.

4. On the VM, run the StartSimulation.cmd script from the OnPremAssets folder in a cmd prompt window. A total of eight production lines will be started, each with three stations each (assembly, test and packaging) as well as an MES per line and a UA Cloud Publisher instance per factory location. There are six locations in total: Munich, Cape town, Mumbai, Seattle, Beijing and Rio. Then check your IoT Hub in the Azure portal to verify that OPC UA telemetry is flowing to the cloud.

5. Under Access Control -> Role Assignments of your Azure Digital Twin service instance in the Azure portal, add a new Role Assignment of type "Azure Digital Twins Data Owner" and assign it's access to "Managed Identity". Under "Select Users", select your previously deployed Azure Web App service instance.

6. Open the URL of the deployed Azure Web App service in a browser and fill in the two fields under Settings and click Apply. The Azure Event Hubs connection string can be read for Azure IoT Hub under "Built-in Endpoints" -> "Event Hub-compatible endpoint" in the Azure portal.

You can use Azure Digital Twins Explorer to monitor twin property updates and add additional relationships to the digital twins created, for example the order of machines in your production lines.

:::image type="content" source="media/how-to-ingest-opcua-data/adt-explorer-2.png" alt-text="Screenshot of using azure digital twins explorer to monitor twin property updates":::

7. Set up the [Data History](https://learn.microsoft.com/en-us/azure/digital-twins/concepts-data-history) feature in the Azure Digital Twins service to historize your contextualized OPC UA data to Azure Data Explorer deployed in this solution. You can find the wizard to set this up in the Azure Digital Twins service configuration in the Azure portal. 

## Next steps

Setup Azure Data Explorer also allows you to create condition monitoring [dashboards](https://learn.microsoft.com/en-us/azure/data-explorer/azure-data-explorer-dashboards) with a few clicks.

Use the instructions [replacing the simulation with a real production line instructions](https://github.com/digitaltwinconsortium/ManufacturingOntologies#replacing-the-production-line-simulation-with-a-real-production-line) to connect your own industrial assets.
