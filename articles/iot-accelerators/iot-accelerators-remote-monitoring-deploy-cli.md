---
title: Deploy the Java Remote Monitoring solution - Azure | Microsoft Docs 
description: This tutorial shows you how to provision the Remote Monitoring solution accelerator using the CLI.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 09/12/2018
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator using the CLI

This tutorial shows you how to provision the Remote Monitoring solution accelerator. You deploy the solution using the CLI. You can also deploy the solution using the web-based UI at azureiotsuite.com, to learn about this option see [Deploy the Remote Monitoring solution accelerator](quickstart-remote-monitoring-deploy.md).

## Prerequisites

To deploy the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

To run the CLI, you need [Node.js](https://nodejs.org/) installed on your local machine.

## Install the CLI

To install the CLI, run the following command in your command-line environment:

```cmd/sh
npm install iot-solutions -g
```

## Sign in to the CLI

Before you can deploy the solution accelerator, you must sign in to your Azure subscription using the CLI as follows:

```cmd/sh
pcs login
```

Follow the on-screen instructions to complete the sign-in process.

## Deployment options

When you deploy the solution accelerator, there are several options that configure the deployment process:

| Option | Values | Description |
| ------ | ------ | ----------- |
| SKU    | `basic`, `standard`, `local` | A _basic_ deployment is intended for test and demonstrations, it deploys all the microservices to a single virtual machine. A _standard_ deployment is intended for production, it deploys the microservices to multiple virtual machines. A _local_ deployment configures a Docker container to run the microservices on your local machine, and uses Azure services, such as storage and Cosmos DB, in the cloud. |
| Runtime | `dotnet`, `java` | Selects the language implementation of the microservices. |

To learn about how to use the local deployment, see [Running the Remote Monitoring solution locally](iot-accelerators-remote-monitoring-deploy-local.md).

## Basic vs. Standard Deployments

### Basic
Basic deployment is geared toward showcasing the solution. To reduce the cost
of this demonstration, all the microservices are deployed in a single
virtual machine; this is not considered a production-ready architecture.

Our Standard deployment option should be used when you are ready to customize
a production-ready architecture, built for scale and extensibility.

Creating a Basic solution will result in the following Azure services being
provisioned into your Azure subscription at cost: 

| Count | Resource                       | Type         | Used For |
|-------|--------------------------------|--------------|----------|
| 1     | [Linux Virtual Machine](https://azure.microsoft.com/services/virtual-machines/) | Standard D1 V2  | Hosting microservices |
| 1     | [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/)                  | S1 – Standard tier | Device management and communication |
| 1     | [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/)              | Standard        | Storing configuration data, rules, alarms, and other cold storage |  
| 1     | [Azure Storage Account](https://docs.microsoft.com/azure/storage/common/storage-introduction#types-of-storage-accounts)  | Standard        | Storage for VM and streaming checkpoints |
| 1     | [Web Application](https://azure.microsoft.com/services/app-service/web/)        |                 | Hosting front-end web application |
| 1     | [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)        |                 | Managing user identities and security |
| 1     | [Azure Maps](https://azure.microsoft.com/services/azure-maps/)        | Standard                | Viewing asset locations |
| 1     | [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)        |   3 units              | Enabling real-time analytics |
| 1     | [Azure Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/)        |       S1          | Provisioning devices at scale |
| 1     | [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/)        |   S1 – 1 unit              | Storage for messages data and enables deep-dive telemetry analysis |



### Standard
The standard deployment is a production-ready deployment a developer can
customize and extend to meet their needs. For reliability and scale, application
microservices are built as Docker containers and deployed using an orchestrator
([Kubernetes](https://kubernetes.io/) by default). The orchestrator is
responsible for deployment, scaling, and management of the application.

Creating a Standard solution will result in the following Azure services being
provisioned into your Azure subscription at cost:

| Count | Resource                                     | SKU / Size      | Used For |
|-------|----------------------------------------------|-----------------|----------|
| 4     | [Linux Virtual Machines](https://azure.microsoft.com/services/virtual-machines/)   | Standard D2 V2  | 1 master and 3 agents for hosting microservices with redundancy |
| 1     | [Azure Container Service](https://azure.microsoft.com/services/container-service/) |                 | [Kubernetes](https://kubernetes.io) orchestrator |
| 1     | [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/)                     | S2 – Standard tier | Device management, command and control |
| 1     | [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/)                 | Standard        | Storing configuration data, and device telemetry like rules, alarms, and messages |
| 5     | [Azure Storage Accounts](https://docs.microsoft.com/azure/storage/common/storage-introduction#types-of-storage-accounts)    | Standard        | 4 for VM storage, and 1 for the streaming checkpoints |
| 1     | [App Service](https://azure.microsoft.com/services/app-service/web/)             | S1 Standard     | Application gateway over SSL |
| 1     | [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)        |                 | Managing user identities and security |
| 1     | [Azure Maps](https://azure.microsoft.com/services/azure-maps/)        | Standard                | Viewing asset locations |
| 1     | [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)        |   3 units              | Enabling real-time analytics |
| 1     | [Azure Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/)        |       S1          | Provisioning devices at scale |
| 1     | [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/)        |   S1 – 1 unit              | Storage for messages data and enables deep-dive telemetry analysis |

> Pricing information for these services can be found
[here](https://azure.microsoft.com/pricing). Usage amounts and billing details
for your subscription can be found in the
[Azure Portal](https://portal.azure.com/).

## Deploy the solution accelerator

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

When you run the `pcs` command to deploy a solution, you are asked for:

- A name for your solution. This name must be unique.
- The Azure subscription to use.
- A location.
- Credentials for the virtual machines that host the microservices. You can use these credentials to access the virtual machines for troubleshooting.

When the `pcs` command finishes, it displays the URL of your new solution accelerator deployment. The `pcs` command also creates a file `{deployment-name}-output.json` with additional information such as the name of the IoT Hub that was provisioned for you.

For more information about the command-line parameters, run:

```cmd/sh
pcs -h
```

For more information about the CLI, see [How to use the CLI](https://github.com/Azure/pcs-cli/blob/master/README.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Configure the solution accelerator
> * Deploy the solution accelerator
> * Sign in to the solution accelerator

Now that you have deployed the Remote Monitoring solution, the next step is to [explore the capabilities of the solution dashboard](./quickstart-remote-monitoring-deploy.md).

<!-- Next tutorials in the sequence -->
