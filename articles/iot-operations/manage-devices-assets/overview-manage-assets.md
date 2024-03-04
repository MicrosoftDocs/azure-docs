---
title: Manage assets overview
titleSuffix: Azure IoT Operations
description: Understand the options to manage the assets that are part of your Azure IoT Operations Preview solution.
author: timlt
ms.author: timlt
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 10/24/2023
---

# Manage assets in Azure IoT Operations Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In Azure IoT Operations, a key task is to manage the assets that are part of your solution. This article defines what assets are, overviews the services you use to manage them, and explains the most common use cases for the services.

## Understand assets
Assets are a core component of Azure IoT Operations.

An *asset* in an industrial edge environment is a device, a machine, a process, or an entire system. These assets are the real assets that exist in manufacturing, retail, energy, healthcare, and other sectors. 

An *asset* in Azure IoT Operations is a logical entity (an asset instance) that you create to represent a real asset. An Azure IoT Operations asset can emit telemetry, and can have properties (writable data points), and commands (executable data points) that describe its behavior and characteristics. You use these asset instances in the software to manage the real assets in your industrial edge environment. 

## Understand services for managing assets
Azure IoT Operations includes several services that let you perform key tasks required to manage your assets. 

The following diagram shows the high-level architecture of Azure IoT Operations. The services that you use to manage assets are highlighted in red. 

:::image type="content" source="media/overview-manage-assets/azure-iot-operations-architecture.png" alt-text="Diagram that highlights the services used to manage assets." lightbox="media/overview-manage-assets/azure-iot-operations-architecture.png":::

- **Azure IoT Operations Experience (preview)**.  The Operations Experience portal is a web app that lets you create and manage assets, and configure data processing pipelines. The portal simplifies the task of managing assets. Operations Experience is the recommended service to manage assets. 
- **Azure Device Registry (preview)**.  The Device Registry is a service that projects industrial assets as Azure resources. It works together with the Operations Experience to streamline the process of managing assets. Device Registry lets you manage all your assets in the cloud, as true Azure resources contained in a single unified registry. 
- **Azure IoT Akri (preview)**. Azure IoT Akri is a service that discovers assets at the edge. The service can detect and create assets in the address space of an OPC UA Server. 
- **Azure IoT OPC UA Broker (preview)**. OPC UA Broker is a data exchange service that enables assets to exchange data with Azure IoT Operations, based on the widely used OPC UA standard. Azure IoT Operations uses OPC UA Broker to exchange data between OPC UA servers and the Azure IoT MQ service. 

Each of these services is explained in greater detail in the following sections that discuss use cases for managing assets. 

## Create and manage assets remotely
The following tasks are useful for operations teams in sectors such as industry, retail, and health. 
- Create assets remotely
- Subscribe to OPC UA tags to access asset data
- Create data pipelines to modify and exchange data with the cloud

The Operations Experience portal lets operations teams perform all these tasks in a simplified web interface. The portal uses the other services described previously, to enable all these tasks. 

The Operations Experience portal uses the OPC UA Broker service, which exchanges data with local OPC UA servers. OPC UA servers are software applications that communicate with assets. OPC UA servers expose OPC UA tags that represent data points. OPC UA tags provide real-time or historical data about the status, performance, quality, or condition of assets.

A [data pipeline](../process-data/overview-data-processor.md) is a sequence of stages that process and transform data from one or more sources to one or more destinations. A data pipeline can perform various operations on the data, such as filtering, aggregating, enriching, validating, or analyzing.

The Operations Experience portal lets users create assets and subscribe to OPC UA tags in a user-friendly interface. Users can create custom assets by providing asset details and configurations. Users can create or import tags, subscribe to them, and assign them to an asset. The portal also lets users create data pipelines by defining the sources, destinations, stages, and rules of the pipeline. Users can configure the parameters and logic of each stage using graphical tools or code editors.

## Manage assets as Azure resources in a centralized registry
In an industrial edge environment with many assets, it's useful for IT and operations teams to have a single centralized registry for devices and assets. Azure Device Registry is a service that provides this capability, and projects industrial assets as Azure resources.  Teams that use Device Registry together with the Operations Experience portal, gain a consistent deployment and management experience across cloud and edge environments. 

Device Registry provides several capabilities that help teams to manage assets:
- **Unified registry**.  The Device Registry serves as the single source of truth for your asset metadata. Having a single registry can streamline and simplify the process of managing assets.  It gives you a way to access and manage this data across Azure, partner, and customer applications running in the cloud or on the edge. 
- **Assets as Azure resources**. Because Device Registry projects assets as true Azure resources, you can manage assets using established Azure features and services. Enterprises can use [Azure Resource Manager](../../azure-resource-manager/management/overview.md), Azure’s native deployment and management service, with industrial assets. Azure Resource Manager provides capabilities such as resource groups, tags, role-based access controls ([RBAC](../../role-based-access-control/overview.md)), policy, logging, and audit.
- **Cloud management of assets**. You use Device Registry within the Operations Experience portal to remotely manage assets in the cloud. All interactions with the asset resource are also available via Azure API and using management tools such as [Azure Resource Graph](../../governance/resource-graph/overview.md). Regardless which method you use to manage assets, changes made in the cloud are synced to the edge and exposed as Custom Resources (CRs) in the Kubernetes cluster.

The following features are supported in Azure Device Registry: 

|Feature  |Supported  |Symbol  |
|---------|---------| :---------: |
|Asset resource management via Azure API | Supported | ``✅`` |
|Asset resource management via Azure IoT Operations Experience| Supported | ``✅`` |
|Asset synchronization to Kubernetes cluster running Azure IoT Operations| Supported | ``✅`` |
|Asset as Azure resource (supports ARG, resource groups, tags, etc.)| Supported | ``✅`` |


## Discover edge assets
A common task in complex edge solutions is to discover assets and add them to your Kubernetes cluster. Azure IoT Akri provides this capability.  It enables you to detect and add OPC UA assets to your cluster. For administrators who attach devices to or remove them from the cluster, using Azure IoT Akri reduces the level of coordination and manual configuration.

An Azure IoT Akri deployment can include fixed-network discovery handlers. Discovery handlers enable assets from known network endpoints to find leaf devices as they appear on device interfaces or local subnets. Examples of network endpoints include OPC UA servers at a fixed IP (without network scanning), and network scanning discovery handlers.

When you install Azure IoT Operations, Azure IoT Akri is installed and configured along with a simulated OPC UA PLC server. Azure IoT Akri should discover the simulated server and expose it as a resource on your cluster, so that you can start to work with asset discovery. 

## Use a common data exchange standard for your edge solution
A critical need in industrial environments is to have a common standard or protocol for machine-to-machine and machine-to-cloud data exchange. By using a widely supported data exchange protocol, you can simplify the process to enable diverse industrial assets to exchange data with each other, with workloads running in your Kubernetes cluster, and with the cloud. [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a specification for a platform independent service-oriented architecture that enables data exchange in industrial environments. 

An industrial environment that uses the OPC UA standard, includes the following basic OPC UA elements:
- An **OPC UA server** is software based on the OPC UA specification that communicates with assets and provides core OPC UA services to those assets. 
- An **OPC UA client**. An OPC UA client is software that interacts with an OPC UA server in a request and response network pattern. An OPC UA client connects to OPC UA servers, and submits requests for actions on data items like reads and writes.

Azure IoT OPC UA Broker is a service in Azure IoT Operations that enables OPC UA servers, your edge solution, and the cloud, to exchange data based on the OPC UA standard. When you install Azure IoT Operations, OPC UA Broker is installed with a simulated thermostat asset, so you can start to test and use the service. 

## Next step
In this overview, you learned what assets are, what Azure IoT Operations services you use to manage them, and some common use cases for managing assets.  Here's the suggested next step to start adding assets and tags in your edge solution:
> [!div class="nextstepaction"]
> [Manage assets remotely](howto-manage-assets-remotely.md)
