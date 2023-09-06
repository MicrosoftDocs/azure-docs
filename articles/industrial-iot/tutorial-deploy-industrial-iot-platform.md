---
title: Deploy the Azure Industrial IoT Platform
description: In this tutorial, you learn how to deploy the IIoT Platform.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.custom: ignite-2022
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
- The Microsoft Azure Active Directory (Azure AD) app registrations used for authentication require Global Administrator, Application
Administrator, or Cloud Application Administrator rights to provide tenant-wide admin consent (see below for further options)
- The supported operating systems for deployment are Windows, Linux and Mac
- IoT Edge supports Windows 10 IoT Enterprise LTSC and Ubuntu Linux 16.08/18.04 LTS Linux

## Main components

The Azure Industrial IoT Platform is a Microsoft suite of modules (OPC Publisher, OPC Twin, Discovery) and services that are deployed on Azure. The cloud microservices (Registry, OPC Twin, OPC Publisher, Edge Telemetry Processor, Registry Onboarding Processor, Edge Event Processor, Registry Synchronization) are implemented as ASP.NET microservices with a REST interface and run on managed Azure Kubernetes Services or stand-alone on Azure App Service. The deployment can deploy the platform, an entire simulation environment and a Web UI (Industrial IoT Engineering Tool).
The deployment script allows to select which set of components to deploy.
- Minimum dependencies:
    - [IoT Hub](https://azure.microsoft.com/services/iot-hub/) to communicate with the edge and ingress raw OPC UA telemetry data
    - [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) to persist state that is not persisted in IoT Hub
    - [Service Bus](https://azure.microsoft.com/services/service-bus/) as integration event bus
    - [Event Hubs](https://azure.microsoft.com/services/event-hubs/) contains processed and contextualized OPC UA telemetry data
    - [Key Vault](https://azure.microsoft.com/services/key-vault/) to manage secrets and certificates
    - [Storage](https://azure.microsoft.com/product-categories/storage/) for Event Hubs checkpointing
- Standard dependencies: Minimum +
    - [SignalR Service](https://azure.microsoft.com/services/signalr-service/) used to scale out asynchronous API notifications, Azure AD app registrations,
    - [Device Provisioning Service](../iot-dps/index.yml) used for deploying and provisioning the simulation gateways
    - [Time Series Insights](https://azure.microsoft.com/services/time-series-insights/)
    - Workbook, Log Analytics, [Application Insights](https://azure.microsoft.com/services/monitor/) for operations monitoring
- Microservices:
    - App Service Plan, [App Service](https://azure.microsoft.com/services/app-service/) for hosting the cloud microservices
- UI (Web app):
    - App Service Plan (shared with microservices), [App Service](https://azure.microsoft.com/services/app-service/) for hosting the Industrial IoT Engineering Tool cloud application
- Simulation:
    - [Virtual machine](https://azure.microsoft.com/services/virtual-machines/), Virtual network, IoT Edge used for a factory simulation to show the capabilities of the platform and to generate sample telemetry
- [Azure Kubernetes Service](/azure/aks/learn/quick-kubernetes-deploy-cli) should be used to host the cloud microservices

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

    - `minimum`: Minimum dependencies
    - `local`: Minimum and standard dependencies
    - `services`: Local and microservices
    - `simulation`: Minimum dependencies and simulation components
    - `app`: Services and UI
    - `all` (default): App and simulation

3. The microservices and the UI are web applications that require authentication, this requires three app registrations in the Azure AD. If the required rights are missing, there are two possible solutions:

    - Ask the Azure AD admin to grant tenant-wide admin consent for the application
    - An Azure AD admin can create the Azure AD applications. The deploy/scripts folder contains the aad-register.ps1 script to perform the Azure AD registration separately from the deployment. The output of the script is a file containing the relevant information to be used as part of deployment and must be passed to the deploy.ps1 script in the same folder using the `-aadConfig` argument.
        ```bash
        cd deploy/scripts
        ./aad-register.ps1 -Name <application-name> -Output aad.json
        ./deploy.ps1 -aadConfig aad.json
        ```


## Other hosting and deployment methods

Other hosting and deployment methods:

- For production deployments that require staging, rollback, scaling, and resilience, the platform can be deployed into [Azure Kubernetes Service (AKS)](/azure/aks/learn/quick-kubernetes-deploy-cli)
- Deploying Azure Industrial IoT Platform microservices into an existing Kubernetes cluster using [Helm](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/api-management/how-to-deploy-self-hosted-gateway-kubernetes-helm.md).
- Deploying [Azure Kubernetes Service (AKS) cluster on top of Azure Industrial IoT Platform created by deployment script and adding Azure Industrial IoT components into the cluster](https://github.com/Azure/Industrial-IoT/blob/main/docs/deploy/howto-add-aks-to-ps1.md).

References:
- [Deploying Azure Industrial IoT Platform](/azure/industrial-iot/tutorial-deploy-industrial-iot-platform)
- [How to deploy platform into AKS](/azure/aks/learn/quick-kubernetes-deploy-cli)


## Next steps
Now that you have deployed the IIoT Platform, you can learn how to customize configuration of the components:

> [!div class="nextstepaction"]
> [Customize the configuration of the components](tutorial-configure-industrial-iot-components.md)
