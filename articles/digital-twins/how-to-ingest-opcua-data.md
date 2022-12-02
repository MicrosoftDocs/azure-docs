---
# Mandatory fields.
title: Ingest OPC UA data into Azure Digital Twins
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

# Ingest OPC UA data into Azure Digital Twins

This article describes a solution for an automated data ingestion path from [OPC Unified Architecture (OPC UA)](https://opcfoundation.org) manufacturing assets in multiple factories to digital twins hosted in an Azure Digital Twins instance. 

## About OPC UA

The [OPC Unified Architecture (OPC UA)](https://opcfoundation.org) is a platform independent, service-oriented architecture for industrial verticals. It's used for machine-to-machine communication, machine-to-SCADA-system communication, manufacturing execution system communication, and, more recently, field-level communication and cloud communication. It comes with best-in-class security and rich data modeling capabilities, and is a leading standard for modeling and communicating with industrial assets. Microsoft has been a member of the OPC Foundation, OPC UA's non-profit governing body, since its inception. Microsoft has been integrating OPC UA into its products since 2015, and has been instrumental in defining the use of OPC UA in the cloud.

## Solution description

This  solution simulates the operation of eight OPC UA-enabled production lines in six locations, with each production line featuring assembly, test, and packaging machines. These machines are controlled by separate manufacturing execution systems.

Here are the components involved in this solution.

| Component | Description |
| --- | --- |
| Industrial Assets | A set of simulated OPC-UA enabled production lines hosted in Docker containers |
| [UA Cloud Publisher](https://github.com/barnstee/ua-cloudpublisher) | This edge application converts OPC UA Client/Server requests into OPC UA PubSub cloud messages. It's hosted in a Docker container. |
| [Azure Event Hubs](../event-hubs/event-hubs-about.md) | The cloud message broker that receives OPC UA PubSub messages from edge gateways and stores them until they're retrieved by subscribers like the UA Cloud Twin. Separately, it's also used to forward data history events emitted from the ADT instance to the ADX cluster. |
| [UA Cloud Twin](https://github.com/digitaltwinconsortium/UA-CloudTwin) | This cloud application converts OPC UA PubSub cloud messages into digital twin updates. It also creates digital twins automatically by processing the cloud messages. Twins are instantiated from models in ISA95-compatible DTDL ontology. It's hosted in a Docker container. |
| [Azure Digital Twins](overview.md) | The platform that enables the creation of a digital representation of real-world assets, places, business processes, and people. |
| [Azure Data Explorer](../synapse-analytics/data-explorer/data-explorer-overview.md) | The time-series database and front-end dashboard service for advanced cloud analytics, including built-in anomaly detection and predictions. |

Below is a diagram illustrating the data flow through this solution, followed by descriptions of each step.

:::image type="content" source="media/how-to-ingest-opcua-data/opcua-to-azure-digital-twins-diagram.png" alt-text="Architectural diagram of the O P C U A to Azure Digital Twins solution." lightbox="media/how-to-ingest-opcua-data/opcua-to-azure-digital-twins-diagram.png":::

1. The UA Cloud Publisher reads OPC UA data from each simulated factory, and forwards it via OPC UA PubSub to [Azure Event Hubs](../event-hubs/event-hubs-about.md). 
1. The UA Cloud Twin reads and processes the OPC UA data from Azure Event Hubs, and forwards it to an Azure Digital Twins instance. 
    1. The UA Cloud Twin also automatically creates digital twins in Azure Digital Twins in response, mapping each OPC UA element (publishers, servers, namespaces, and nodes) to a separate digital twin.
    1. The UA Cloud Twin also automatically updates the state of digital twins based on the data changes in their corresponding OPC UA nodes. 
1. Updates to digital twins in Azure Digital Twins are automatically historized to an Azure Data Explorer cluster via the [data history](concepts-data-history.md) feature. Data history generates time-series data, which can be used for analytics, such as [OEE (Overall Equipment Effectiveness)](https://www.oee.com) calculation and predictive maintenance scenarios.

### Mapping OPC UA data to the ISA95 hierarchy model

This solution uses [ISA95](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa95) as the modeling system to represent digital twin data received from OPC UA. Here are the steps taken by the UA Cloud Twin to map OPC UA data to the ISA95 hierarchy model.
1. The UA Cloud Twin takes the OPC UA Publisher ID and creates ISA95 Area assets for each one.
1. The UA Cloud Twin takes the combination of the OPC UA Application URI and the OPC UA Namespace URIs discovered in the OPC UA telemetry stream (specifically, in the OPC UA PubSub metadata messages), and creates ISA95 Work Center assets for each one. UA Cloud Publisher sends the OPC UA PubSub metadata messages to a separate broker topic to make sure all metadata can be read by UA Cloud Twin before the processing of the telemetry messages starts.
1. UA Cloud Twin takes each OPC UA Field discovered in the received Dataset metadata and creates an ISA95 Work Unit asset for each.

## Install the solution

Select the button below to use the [Azure portal](https://portal.azure.com) to deploy all of the required resources for this solution.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdigitaltwinconsortium%2FManufacturingOntologies%2Fmain%2FDeployment%2Farm.json)

Once the deployment is complete, follow these steps to finish configuring the simulation.

1. Connect to the deployed Windows VM with an RDP (remote desktop) connection. You can download the RDP file in the [Azure portal](https://portal.azure.com) page for the VM, under the **Connect** options. Log in using the credentials you provided during deployment.
1. Inside the VM, navigate in a browser to the [Docker Desktop page](https://www.docker.com/products/docker-desktop). Download and install the Docker Desktop, including the Windows Subsystem for Linux (WSL) integration. 
1. After installation, the VM will need to restart. Log back in after the restart. 
1. Follow the instructions in the VM to accept the license terms and install the WSL Linux kernel. 
1. Restart the VM one more time and log back in after the restart.
1. In the VM, verify that Docker Desktop is running in the Windows System Tray. Enable Kubernetes under **Settings**, **Kubernetes**, **Enable Kubernetes**, and **Apply & restart**.

:::image type="content" source="media/how-to-ingest-opcua-data/Kubernetes.png" alt-text="Screenshot of Docker Desktop Settings." lightbox="media/how-to-ingest-opcua-data/Kubernetes.png":::

## Run the production line simulation

Once the VM is set up, follow these steps on the virtual machine to run the production line simulation.

1. Browse to the [Digital Twin Consortium's Manufacturing Ontologies repo](https://github.com/digitaltwinconsortium/ManufacturingOntologies) and select **Code** and **Download Zip**. Unzip the contents to a directory of your choice.

1. Open a local command prompt, and navigate to the *OnPremAssets* directory of the unzipped content.
1. From the *OnPremAssets* folder, run the following command to start the simulation. You'll need to supply the *primary key connection string* of the Event Hubs namespace that was [deployed with the solution](#install-the-solution). You can find the primary key connection string value in the [Azure portal](https://portal.azure.com) by opening your Event Hubs namespace, selecting **Shared access policy** from its left menu, and selecting **RootManagedSharedAccessKey**.

    ```
    StartSimulation Endpoint=sb://ontologies.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<primary-key-connection-string-value>
    ```

    This will start the data flow from the simulated production line into Azure Digital Twins.

>[!NOTE]
>If you restart Docker Desktop at any time, you'll need to stop and then restart the simulation, too.

### View results

You can use [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) to monitor twin property updates and add more relationships to the digital twins that are created. For example, you might want to add *Next* and *Previous* relationships between machines on each production line to add more context to your solution.

To access Azure Digital Twins Explorer, first make sure you have the [Azure Digital Twins Data Owner role](how-to-set-up-instance-portal.md#assign-the-role-using-azure-identity-management-iam) on your Azure Digital Twins instance. Then [open the explorer](quickstart-azure-digital-twins-explorer.md#open-instance-in-azure-digital-twins-explorer).

:::image type="content" source="media/how-to-ingest-opcua-data/azure-digital-twins-explorer.png" alt-text="Screenshot of using Azure Digital Twins Explorer to monitor twin property updates." lightbox="media/how-to-ingest-opcua-data/azure-digital-twins-explorer.png":::

You can also set up [data history](concepts-data-history.md) in your Azure Digital Twins instance to historize your contextualized OPC UA data to the Azure Data Explorer that was deployed in this solution. You can navigate to the [Azure Digital Twins service configuration](how-to-use-data-history.md?tabs=portal#set-up-data-history-connection) in the Azure portal and follow the wizard to set this up.

## Next steps

Visit the [Digital Twin Consortium's Manufacturing Ontologies GitHub page](https://github.com/digitaltwinconsortium/ManufacturingOntologies#next-steps) for a range of next steps you can take, including setting up 3D scenes for your production lines, calculating [OEE](https://www.oee.com), enabling the [digital feedback loop](https://thenewstack.io/the-digital-feedback-loop-powering-next-generation-businesses), onboarding your on-premises Kubernetes cluster to [Azure Arc](../azure-arc/overview.md) for management from the cloud, or for replacing the simulation with a real production line to connect your own industrial assets to this solution.

You can also visit the [Azure Data Explorer documentation](../synapse-analytics/data-explorer/data-explorer-overview.md) to learn how to create no-code dashboards for condition monitoring, yield or maintenance predictions, or anomaly detection.