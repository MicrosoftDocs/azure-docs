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

This article describes a solution for an automated data ingestion path from [OPC Unified Architecture (OPC UA)](https://opcfoundation.org)-enabled manufacturing assets in multiple factories to digital twins hosted in an Azure Digital Twins instance.

:::image type="content" source="media/how-to-ingest-opcua-data/opcua-to-azure-digital-twins-diagram.png" alt-text="Architectural diagram of the O P C U A to Azure Digital Twins solution." lightbox="media/how-to-ingest-opcua-data/opcua-to-azure-digital-twins-diagram.png":::

Below is a summary of the data flow in this solution.
*	The solution simulates the operation of eight OPC UA-enabled production lines in six locations, with each production line featuring assembly, test, and packaging machines. These machines are controlled by separate Manufacturing Execution Systems.
*	The UA Cloud Publisher reads OPC UA data from each simulated factory and forwards it via OPC UA Pub Sub to Azure Event Hubs. 
*	The UA Cloud Twin reads and processes the OPC UA data from Azure Event Hubs and forwards it to an Azure Digital Twins instance. 
*	The UA Cloud Twin also automatically creates digital twins in Azure Digital Twins on-the-fly, mapping each OPC UA element (publishers, servers, namespaces and nodes) to a separate digital twin.
*	The UA Cloud Twin also automatically updates the state of digital twins based on the data changes in their corresponding OPC UA nodes. 
*	Updates to digital twins in Azure Digital Twins are automatically historized to an Azure Data Explorer cluster via the [data history](concepts-data-history.md) feature. Data history generates time-series data, which can be used for analytics, such as OEE calculation and predictive maintenance scenarios.

Below is a description of the components in this solution.

| Component | Description |
| --- | --- |
| Industrial Assets | A set of simulated OPC-UA enabled production lines hosted in Docker containers |
| [UA Cloud Publisher](https://github.com/barnstee/ua-cloudpublisher) | This edge application converts OPC UA Client/Server requests into OPC UA PubSub cloud messages. It's hosted in a Docker container. |
| [Azure Event Hubs](../event-hubs/event-hubs-about.md) | The cloud message broker that receives OPC UA PubSub messages from edge gateways and stores them until they're retrieved by subscribers like the UA Cloud Twin. Separately, it's also used to forward data history events emitted from the ADT instance to the ADX cluster. |
| [UA Cloud Twin](https://github.com/digitaltwinconsortium/UA-CloudTwin) | This cloud application converts OPC UA PubSub cloud messages into digital twin updates. It also creates digital twins automatically by processing the cloud messages. Twins are instantiated from models in ISA95-compatible DTDL ontology. It's hosted in a Docker container. |
| [Azure Digital Twins](overview.md) | The platform that enables the creation of a digital representation of real-world assets, places, business processes, and people. |
| [Azure Data Explorer](../synapse-analytics/data-explorer/data-explorer-overview.md) | The time-series database and front-end dashboard service for advanced cloud analytics, including built-in anomaly detection and predictions. |

## Mapping OPC UA Data to the ISA95 Hierarchy Model

* UA Cloud Twin takes the OPC UA Publisher ID and creates ISA95 Area assets for each one.

* UA Cloud Twin takes the combination of the OPC UA Application URI and the OPC UA Namespace URIs discovered in the OPC UA telemetry stream (specifically, in the OPC UA PubSub metadata messages) and creates ISA95 Work Center assets for each one. UA Cloud Publisher sends the OPC UA PubSub metadata messages to a separate broker topic to make sure all metadata can be read by UA Cloud Twin before the processing of the telemetry messages starts.

* UA Cloud Twin takes each OPC UA Field discovered in the received Dataset metadata and creates an ISA95 Work Unit asset for each.

## Installation

Click on the button below to deploy all required resources.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdigitaltwinconsortium%2FManufacturingOntologies%2Fmain%2FDeployment%2Farm.json)

Once the deployment is complete, log in to the deployed Windows VM via Remote Desktop (Connect -> Download RDP file in the [Azure portal](https://portal.azure.com)), using the credentials you provided during deployment and download and install Docker Desktop from [here](https://www.docker.com/products/docker-desktop), including the Windows Subsystem for Linux (WSL) integration. After installation on the VM and a required system restart, accept the license terms and install the WSL Linux kernel by following the instructions. Then restart the VM one more time and verify that Docker Desktop is running in the Windows System Tray and enable Kubernetes under Settings -> Kubernetes -> Enable Kubernetes -> Apply & restart.

:::image type="content" source="media/how-to-ingest-opcua-data/Kubernetes.png" alt-text="Screenshot of Docker Desktop Settings." lightbox="media/how-to-ingest-opcua-data/Kubernetes.png":::

## Running the Production Line Simulation

On the deployed VM, download the required files from [here](https://github.com/digitaltwinconsortium/ManufacturingOntologies/archive/refs/heads/main.zip) and extract to a directory of your choice. Then navigate to the OnPremAssets directory of the unzipped content and run the StartSimulation command from the OnPremAssets folder in a command prompt by supplying the primary key connection string of your Event Hubs namespace. The primary key connection string can be read in the [Azure portal](https://portal.azure.com) under your Event Hubs' "share access policy" -> "RootManagedSharedAccessKey".

```
StartSimulation Endpoint=sb://ontologies.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=abcdefgh=
```

Note: If you restart Docker Desktop at any time, you'll need to stop and then restart the simulation, too!

You can use [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) to monitor twin property updates and add more relationships to the digital twins created. To enable access, assign the [Azure Digital Twins Data Owner role](how-to-set-up-instance-portal.md#assign-the-role-using-azure-identity-management-iam) to your instance. Then [open](quickstart-azure-digital-twins-explorer.md#open-instance-in-azure-digital-twins-explorer) Azure Digital Twins Explorer from the Azure portal. To add more context, you can add "Next" and "Previous" relationships between machines on each production line.

:::image type="content" source="media/how-to-ingest-opcua-data/azure-digital-twins-explorer.png" alt-text="Screenshot of using Azure Digital Twins Explorer to monitor twin property updates." lightbox="media/how-to-ingest-opcua-data/azure-digital-twins-explorer.png":::

You can also set up [data history](concepts-data-history.md) in your Azure Digital Twins instance to historize your contextualized OPC UA data to the Azure Data Explorer that was deployed in this solution. You can navigate to the [Azure Digital Twins service configuration](how-to-use-data-history.md?tabs=portal#set-up-data-history-connection) in the Azure portal and follow the wizard to set this up.

## Next steps

Visit the [Digital Twin Consortium's Manufacturing Ontologies GitHub page](https://github.com/digitaltwinconsortium/ManufacturingOntologies#next-steps) for a range of next steps you can take, including setting up 3D scenes for your production lines, calculating [OEE](https://www.oee.com), enabling the [digital feedback loop](https://thenewstack.io/the-digital-feedback-loop-powering-next-generation-businesses), onboarding your on-prem Kubernetes cluster to [Azure Arc](../azure-arc/overview.md) for management from the cloud or for replacing the simulation with a real production line to connect your own industrial assets to this solution.

Or, visit the [Azure Data Explorer documentation](../synapse-analytics/data-explorer/data-explorer-overview.md) to learn how to create no-code dashboards for condition monitoring, yield or maintenance predictions or anomaly detection.

## About OPC UA

The OPC Unified Architecture (OPC UA) is a platform independent, service-oriented architecture for industrial verticals. It's used for machine-to-machine communication, machine-to-SCADA system communication, Manufacturing Execution System communication, and more recently also for field-level communication and cloud communication. It comes with best-in-class security and rich data modeling capabilities and is a leading standard for modeling and communicating with industrial assets. Microsoft has been a member of the OPC Foundation, OPC UA's non-profit governing body since its foundation. Microsoft has been integrating OPC UA into its products since 2015 and has been instrumental in defining the use of OPC UA in the cloud.
