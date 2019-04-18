---
title: Deploy the Remote Monitoring solution using CLI - Azure | Microsoft Docs 
description: This how-to guide shows you how to provision the Remote Monitoring solution accelerator using the CLI.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 03/08/2019
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator using the CLI

This how-to guide shows you how to deploy the Remote Monitoring solution accelerator. You deploy the solution using the CLI. You can also deploy the solution using the web-based UI at azureiotsolutions.com, to learn about this option see the [Deploy the Remote Monitoring solution accelerator](quickstart-remote-monitoring-deploy.md) quickstart.

## Prerequisites

To deploy the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

To run the CLI, you need [Node.js](https://nodejs.org/) installed on your local machine.

## Install the CLI

To install the CLI, run the following command in your command-line environment:

```cmd/sh
npm install iot-solutions -g
```

## Sign in to the CLI

Before you can deploy the solution accelerator, you must sign in to your Azure subscription using the CLI:

```cmd/sh
pcs login
```

Follow the on-screen instructions to complete the sign-in process.

## Deployment options

When you deploy the solution accelerator, there are several options that configure the deployment process:

| Option | Values | Description |
| ------ | ------ | ----------- |
| SKU    | `basic`, `standard`, `local` | A _basic_ deployment is intended for test and demonstrations, it deploys all the microservices to a single virtual machine. A _standard_ deployment is intended for production, it deploys the microservices to several virtual machines. A _local_ deployment configures a Docker container to run the microservices on your local machine, and uses Azure cloud services, such as storage and Cosmos DB. |
| Runtime | `dotnet`, `java` | Selects the language implementation of the microservices. |

To learn how to use the local deployment option, see [Running the Remote Monitoring solution locally](iot-accelerators-remote-monitoring-deploy-local.md).

## Basic and standard deployments

This section summarizes the key differences between a basic and standard deployment.

### Basic

You can do a basic deployment from [azureiotsolutions.com](https://www.azureiotsolutions.com/Accelerators) or using the CLI.

Basic deployment is geared toward showcasing the solution. To reduce costs, all the microservices are deployed in a single virtual machine. This deployment doesn't use a production-ready architecture.

A basic deployment creates the following services in your Azure subscription:

| Count | Resource                       | Type         | Used For |
|-------|--------------------------------|--------------|----------|
| 1     | [Linux Virtual Machine](https://azure.microsoft.com/services/virtual-machines/) | Standard D1 V2  | Hosting microservices |
| 1     | [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/)                  | S1 – Standard tier | Device management and communication |
| 1     | [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/)              | Standard        | Storing configuration data, rules, alerts, and other cold storage |  
| 1     | [Azure Storage Account](https://docs.microsoft.com/azure/storage/common/storage-introduction#types-of-storage-accounts)  | Standard        | Storage for VM and streaming checkpoints |
| 1     | [Web Application](https://azure.microsoft.com/services/app-service/web/)        |                 | Hosting front-end web application |
| 1     | [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)        |                 | Managing user identities and security |
| 1     | [Azure Maps](https://azure.microsoft.com/services/azure-maps/)        | Standard                | Viewing asset locations |
| 1     | [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)        |   3 units              | Enabling real-time analytics |
| 1     | [Azure Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/)        |       S1          | Provisioning devices at scale |
| 1     | [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/)        |   S1 – 1 unit              | Storage for messages data and enables deep-dive telemetry analysis |

### Standard

You can do a standard deployment only using the CLI.

A standard deployment is a production-ready deployment that a developer can customize and extend. Use the standard deployment option when you're ready to customize a production-ready architecture, built for scale and extensibility. Application microservices are built as Docker containers and deployed using the Azure Kubernetes Service. The Kubernetes orchestrator deploys, scales, and manages the microservices.

A standard deployment creates the following services in your Azure subscription:

| Count | Resource                                     | SKU / Size      | Used For |
|-------|----------------------------------------------|-----------------|----------|
| 1     | [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service)| Use a fully managed Kubernetes container orchestration service, defaults to 3 agents|
| 1     | [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/)                     | S2 – Standard tier | Device management, command and control |
| 1     | [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/)                 | Standard        | Storing configuration data, and device telemetry like rules, alerts, and messages |
| 5     | [Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-introduction#types-of-storage-accounts)    | Standard        | 4 for VM storage, and 1 for the streaming checkpoints |
| 1     | [App Service](https://azure.microsoft.com/services/app-service/web/)             | S1 Standard     | Application gateway over SSL |
| 1     | [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)        |                 | Managing user identities and security |
| 1     | [Azure Maps](https://azure.microsoft.com/services/azure-maps/)        | Standard                | Viewing asset locations |
| 1     | [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)        |   3 units              | Enabling real-time analytics |
| 1     | [Azure Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/)        |       S1          | Provisioning devices at scale |
| 1     | [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/)        |   S1 – 1 unit              | Storage for messages data and enables deep-dive telemetry analysis |

> [!NOTE]
> You can find pricing information for these services at [https://azure.microsoft.com/pricing](https://azure.microsoft.com/pricing). You can find usage and billing details for your subscription in the [Azure Portal](https://portal.azure.com/).

## Deploy the solution accelerator

Deployment examples:

### Example: deploy .NET version

The following example shows how to deploy the basic, .NET version of the Remote Monitoring solution accelerator:

```cmd/sh
pcs -t remotemonitoring -s basic -r dotnet
```

### Example: deploy Java version

The following example shows how to deploy the standard, Java version of the Remote Monitoring solution accelerator:

```cmd/sh
pcs -t remotemonitoring -s standard -r java
```

### pcs command options

When you run the `pcs` command to deploy a solution, you're asked for:

- A name for your solution. This name must be unique.
- The Azure subscription to use.
- A location.
- Credentials for the virtual machines that host the microservices. You can use these credentials to access the virtual machines for troubleshooting.

When the `pcs` command finishes, it displays the URL of your new solution accelerator. The `pcs` command also creates a file `{deployment-name}-output.json` that contains information such as the name of the IoT Hub that it created.

For more information about the command-line parameters, run:

```cmd/sh
pcs -h
```

For more information about the CLI, see [How to use the CLI](https://github.com/Azure/pcs-cli/blob/master/README.md).

## Next steps

In this how-to guide, you learned how to:

> [!div class="checklist"]
> * Configure the solution accelerator
> * Deploy the solution accelerator
> * Sign in to the solution accelerator

Now that you've deployed the Remote Monitoring solution, the next step is to [explore the capabilities of the solution dashboard](./quickstart-remote-monitoring-deploy.md).

<!-- Next how-to guides in the sequence -->
