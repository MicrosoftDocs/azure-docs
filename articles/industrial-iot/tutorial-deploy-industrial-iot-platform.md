---
title: Deploy the Azure Industrial IoT Platform
description: In this tutorial, you learn how to deploy the IIoT Platform.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 3/22/2021
---

# Tutorial: Deploy the Azure Industrial IoT Platform

In this tutorial, you learn:

> [!div class="checklist"]
> * About the main components of the IIoT Platform
> * About the different installation types
> * How to deploy the Industrial IoT Platform

## Prerequisites

- An Azure subscription must be created
- Download [Git](https://git-scm.com/downloads)
- The Azure Active Directory (AAD) app registrations used for authentication require Global Administrator, Application
Administrator, or Cloud Application Administrator rights to provide tenant-wide admin consent (see below for further options)
- The supported operating systems for deployment are Windows, Linux and Mac
- IoT Edge supports Windows 10 IoT Enterprise LTSC and Ubuntu Linux 16.08/18.04 LTS Linux

## Main Components

This section lists the different components of the Azure IIoT Platform. The deployment script allows to select which set of components deploy.
- Minimum dependencies: [IoT Hub](https://azure.microsoft.com/services/iot-hub/), [Cosmos DB](https://azure.microsoft.com/services/cosmos-db/), [Service Bus](https://azure.microsoft.com/services/service-bus/), [Event Hub](https://azure.microsoft.com/services/event-hubs/), [Key Vault](https://azure.microsoft.com/services/key-vault/), [Storage](https://azure.microsoft.com/product-categories/storage/)
- Standard dependencies: Minimum + [SignalR Service](https://azure.microsoft.com/services/signalr-service/), AAD app
registrations, [Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/), [Time Series Insights](https://azure.microsoft.com/services/time-series-insights/), Workbook, Log Analytics,
[Application Insights](https://azure.microsoft.com/services/monitor/)
- Microservices: App Service Plan, [App Service](https://azure.microsoft.com/services/app-service/)
- UI (Web app): App Service Plan (shared with microservices), [App Service](https://azure.microsoft.com/services/app-service/)
- Simulation: [Virtual machine](https://azure.microsoft.com/services/virtual-machines/), Virtual network, IoT Edge
- [Azure Kubernetes Service](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-aks.md)

## Deploy Azure IIoT Platform using the deployment script

1. To get started with the deployment of the IIoT Platform, clone the repository from the command prompt or terminal.

    git clone https://github.com/Azure/Industrial-IoT
    cd Industrial-IoT

2. Start the guided deployment. The script will collect the required information, such as Azure account, subscription, target resource and group and application name.

    On Windows:
        ```
        .\deploy -version <version> [-type <deploymentType>]
        ```

    On Linux or Mac:
        ```
        ./deploy.sh -version <version> [-type <deploymentType>]
        ```

    Replace \<version> with the version you want to deploy.

    Replace \<deploymentType> with the type of deployment (optional parameter).

    The types of deployments are the followings:

    - Minimum: Minimum dependencies
    - Local: Minimum and standard dependencies
    - Services: Local and microservices
    - Simulation: Minimum dependencies and simulation components
    - App: Services and UI
    - All (default): App and simulation

3. The microservices and the UI are web applications that require authentication, this requires three app registrations in the AAD. If the required rights are missing, there are two possible solutions:

    - Ask the AAD admin to grant tenant-wide admin consent for the application
    - An AAD admin can create the AAD applications. The deploy/scripts folder contains the aad-register.ps1 script to perform the AAD registration separately from the deployment. The output of the script is a file containing the relevant information to be used as part of deployment and must be passed to the deploy.ps1 script in the same folder using the `-aadConfig` argument.
        ```bash
        cd deploy/scripts
        ./aad-register.ps1 -Name <application-name> -Output aad.json
        ./deploy.ps1 -aadConfig aad.json
        ```


## Other hosting and deployment methods

Other hosting and deployment methods:

- For production deployments that require staging, rollback, scaling, and resilience, the platform can be deployed into [Azure Kubernetes Service (AKS)](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-aks.md)
- Deploying Azure Industrial IoT Platform microservices into an existing Kubernetes cluster using [Helm](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-helm.md).
- Deploying [Azure Kubernetes Service (AKS) cluster on top of Azure Industrial IoT Platform created by deployment script and adding Azure Industrial IoT components into the cluster](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-add-aks-to-ps1.md).

References:
- [Deploying Azure Industrial IoT Platform](https://github.com/Azure/Industrial-IoT/tree/master/docs/deploy)
- [How to deploy all-in-one](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-all-in-one.md)
- [How to deploy platform into AKS](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-aks.md)


## Next steps
Now that you have deployed the IIoT Platform, you can learn how to customize configuration of the components:

> [!div class="nextstepaction"]
> [Customize the configuration of the components](tutorial-configure-industrial-iot-components.md)
