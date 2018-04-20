---
title: Deploy the Java remote monitoring solution - Azure | Microsoft Docs 
description: This tutorial shows you how to provision the remote monitoring solution accelerator using the CLI.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 01/29/2018
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Deploy the remote monitoring solution accelerator using the CLI

This tutorial shows you how to provision the remote monitoring solution accelerator. You deploy the solution using the CLI. You can also deploy the solution using the web-based UI at azureiotsuite.com, to learn about this option see [Deploy the remote monitoring solution accelerator](iot-suite-remote-monitoring-deploy.md).

## Prerequisites

To deploy the remote monitoring solution accelerator, you need an active Azure subscription.

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

To learn about how to use the local deployment, see [Running the remote monitoring solution locally](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Running-the-Remote-Monitoring-Solution-Locally#deploy-azure-services-and-set-environment-variables).

## Deploy the solution accelerator

### Example: deploy .NET version

The following example shows how to deploy the basic, .NET version of the remote monitoring solution accelerator:

```cmd/sh
pcs -t remotemonitoring -s basic -r dotnet
```

### Example: deploy Java version

The following example shows how to deploy the standard, Java version of the remote monitoring solution accelerator:

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

Now that you have deployed the remote monitoring solution, the next step is to [explore the capabilities of the solution dashboard](./iot-suite-remote-monitoring-deploy.md).

<!-- Next tutorials in the sequence -->