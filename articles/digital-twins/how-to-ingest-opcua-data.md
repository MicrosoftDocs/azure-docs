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

Here are the components required for this solution.

 :::image type="content" source="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png" alt-text="Drawing of the opc ua to Azure Digital Twins architecture" lightbox="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png":::    

| Component | Description |
| --- | --- |
| Industrial Assets | OPC UA-enabled assets. A set of simulated production lines is provided until you are ready to connect your own physical assets. |
| Kubernetes | Kubernetes is a Docker container orchistration system deployed at the Edge in fault-tolerant industrial gateways. |
| [UA Cloud Publisher](https://github.com/barnstee/ua-cloudpublisher) | This reference implementation converts OPC UA Client/Server requests into OPC UA PubSub cloud messages. |
| [Azure IoT Hub](../iot-hub/about-iot-hub.md) | The cloud message broker that receives OPC UA PubSub messages from Edge gateways and stores them until they are retrieved by subscribers like the UA Cloud Twin. |
| [UA Cloud Twin](https://github.com/digitaltwinconsortium/UA-CloudTwin) | This cloud application converts OPC UA PubSub cloud messages into Azure Digital Twins service updates, leveraging the ISA95 ontology to create digital twins automatically. |
| [Azure Digital Twins](overview.md) | The platform that enables the creation of a digital representation of real-world things, places, business processes, and people. |

## Installation

Click on the button below, it will deploy all required resources.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdigitaltwinconsortium%2FManufacturingOntologies%2Fmain%2FDeployment%2Farm.json)

Once the deployment is complete in the Azure Portal, please follow these steps to configure the production line simulation.

1. In the deployed IoT Hub, create 6 devices and call them publisher.munich.corp.contoso, publisher.capetown.corp.contoso, publisher.mumbai.corp.contoso, publisher.seattle.corp.contoso, publisher.beijing.corp.contoso and publisher.rio.corp.contoso.

2. Login to the deployed VM using the credentials you provided during deployment and download and install Docker Desktop from the [Docker Desktop page](https://www.docker.com/products/docker-desktop), including the Windows Subsystem for Linux (WSL) integration. After installation and a required system restart, accept the license terms and install the WSL2 Linux kernel by following the instructions. Then verify that Docker Desktop is running in the Windows System Tray and enable Kubernetes in Settings.

3. On the VM, browse to the [Digital Twin Consortium's Manufacturing Ontologies repo](https://github.com/digitaltwinconsortium/ManufacturingOntologies) and select Code -> Download Zip. Unzip the contents to a directory of your choice. Navigate to the OnPremAssets directory of the Zip you just downloaded and edit the settings.json file for each publisher directory located in the Config directory. Replace [myiothub] with the name of your IoT Hub and replace [publisherkey] with the primary key of the 6 IoT Hub publisher devices you have created earlier. This data can be accessed by clicking on the names of the devices in the Azure Portal.

4. On the VM, run the StartSimulation.cmd script from the OnPremAssets folder in a cmd prompt window. This will run the simulation. A total of 8 production lines will be started, each with 3 stations each (assembly, test and packaging) as well as an MES per line and a UA Cloud Publisher instance per factory location. There are 6 locations in total: Munich, Capetown, Mumbai, Seattle, Beijing and Rio. Then check your IoT Hub in the Azure Portal to verify that OPC UA telemetry is flowing to the cloud.

5. Under Access Control -> Role Assignments of your Azure Digital Twin service instance in the Azure Portal, add a new Role Assignment of type "Azure Digital Twins Data Owner", assign it's access to "Managed Identity" and under "Select Users", select your previously deployed Azure Web App service instance.

6. Open the URL of the deployed Azure Web App service in a browser and fill in the two fields under Settings and click Apply. The Azure Event Hub connection string can be read for Azure IoT Hub under "Built-in Endpoints"->"Event Hub-compatible endpoint" in the Azure Portal.

7. Connect the deployed Azure Data Explorer directly to the deployed IoT Hub by following the steps in the lower half of the article from the [how to use Azure Data Explorer for OPC UA article](https://www.linkedin.com/pulse/using-azure-data-explorer-opc-ua-erich-barnstedt/). Then, import the Station nodeset file into your ADX instance, using the [Digital Twin Consortium's UA Cloud Viewer](https://github.com/digitaltwinconsortium/UA-CloudViewer). Once you do that, you can e.g. calculate the OEE using the [Azure Data Explorer queries](https://github.com/digitaltwinconsortium/ManufacturingDTDLOntologies/tree/main/ADXQueries).

After installation completes, you can use Azure Digital Twins Explorer to manually monitor twin property updates.

:::image type="content" source="media/how-to-ingest-opcua-data/adt-explorer-2.png" alt-text="Screenshot of using azure digital twins explorer to monitor twin property updates":::

## Next steps

In this article, you set up a full data flow for getting OPC UA data into Azure Digital Twins from simulated production lines.

Next, use the instructions [replacing the simulation with a real production line instructions](https://github.com/digitaltwinconsortium/ManufacturingOntologies#replacing-the-production-line-simulation-with-a-real-production-line) to connect your own industrial assets.
