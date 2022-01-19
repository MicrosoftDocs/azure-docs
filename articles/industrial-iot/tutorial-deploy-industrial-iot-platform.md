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

- Minimum dependencies: IoT Hub, Cosmos DB, Service Bus, Event Hub, Key Vault, Storage
- Standard dependencies: Minimum + SignalR Service, AAD app
registrations, Device Provisioning Service, Time Series Insights, Workbook, Log Analytics,
Application Insights
- Microservices: App Service Plan, App Service
- UI (Web app): App Service Plan (shared with microservices), App Service
- Simulation: Virtual machine, Virtual network, IoT Edge
- Azure Kubernetes Service

## Installation types

- Minimum: Minimum dependencies
- Local: Minimum and the standard dependencies
- Services: Local and the microservices
- Simulation: Minimum dependencies and the simulation components
- App: Services and the UI
- All (default): App and the simulation

## Deployment

1. To get started with the deployment of the IIoT Platform, clone the repository from the command prompt or terminal.

    git clone https://github.com/Azure/Industrial-IoT
    cd Industrial-IoT

2. Start the guided deployment, the script will collect the required information, such as Azure account, subscription, target resource and group and application name.

    On Windows:
        ```
        .\deploy -version <version>
        ```

    On Linux or Mac:
        ```
        ./deploy.sh -version <version>
        ```

    Replace \<version> with the version you want to deploy.

3. The microservices and the UI are web applications that require authentication, this requires three app registrations in the AAD. If the required rights are missing, there are two possible solutions:

    - Ask the AAD admin to grant tenant-wide admin consent for the application
    - An AAD admin can create the AAD applications. The deploy/scripts folder contains the aad- register.ps1 script to perform the AAD registration separately from the deployment. The output of the script is a file containing the relevant information to be used as part of deployment and must be passed to the deploy.ps1 script in the same folder using the -
    aadConfig argument.
        ```bash
        cd deploy/scripts
        ./aad-register.ps1 -Name <application-name> -Output aad.json
        ./deploy.ps1 -aadConfig aad.json
        ```

For production deployments that require staging, rollback, scaling, and resilience, the platform can be deployed into [Azure Kubernetes Service (AKS)](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-aks.md)

References:
- [Deploying Azure Industrial IoT Platform](https://github.com/Azure/Industrial-IoT/tree/master/docs/deploy)
- [How to deploy all-in-one](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-all-in-one.md)
- [How to deploy platform into AKS](https://github.com/Azure/Industrial-IoT/blob/master/docs/deploy/howto-deploy-aks.md)


## Next steps
Now that you have deployed the IIoT Platform, you can learn how to customize configuration of the components:

> [!div class="nextstepaction"]
> [Customize the configuration of the components](tutorial-configure-industrial-iot-components.md)
