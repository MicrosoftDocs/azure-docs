---
title: Create a Azure Arc data controller in the Azure Portal
description: Create a Azure Arc data controller in the Azure Portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Create a Azure Arc data controller in the Azure Portal

> [!NOTE]
>  This scenario is not completed end:end yet, but you can start to try out the experience and provide us feedback on it.

## Connectivity Modes

In the future there will be two modes in which you can run your Azure Arc enabled data services:

- **Indirectly connected** - There is no direct connection to Azure.  Data is sent to Azure only through an export/upload process.  All Azure Arc data services deployments work in this mode today in preview.
- **Directly connected** - In this mode there will be a dependency on the Azure Arc enabled Kubernetes service to provide a direct connection between Azure and the Kubernetes cluster on which the Azure Arc enabled data services are running.  This will enable more capabilities and will also enable you to use the Azure Portal and the Azure CLI to manage your Azure Arc enabled data services just like you manage your data services in Azure PaaS.  This connectivity mode is not yet available in preview, but will be coming soon.

You can read more about the difference between the [connectivity modes](/docs/connectivity.md).

In the indirectly connected mode, you can use the Azure Portal to generate a script for you that can then be downloaded and executed against your Kubernetes cluster.  In the upcoming directly connected mode you will be able to provision the data controller directly from the portal through the Azure Arc enabled Kubernetes connection.  More details on the directly connected mode deployment of a data controller will be provided soon.  For now this scenario document covers how to use the Azure portal in the indirectly connected mode.

## Using the Azure Portal to create a Azure Arc data controller

Many of the experiences for Azure Arc start in the Azure Portal even though the resource to be created or managed is outside of Azure infrastructure.  The user experience pattern in these cases, especially when there is no direct connectivity between Azure and the customer environment is to use the Azure Portal to generate a script which can then be downloaded and executed in the customer environment to establish a secure connection back to Azure.  For example, Azure Arc enabled for servers follows this pattern to [create Arc connected machines](/azure-arc/servers/onboard-portal).

In this scenario, you will see the initial experience for creating a data controller resource in the Azure Portal.  The experience will be changing as we evolve the design and thinking, but we value your early feedback on it so we are publishing the scenario documentation now.

Steps:

1) First, log in to the Azure Portal using the special URL [https://aka.ms/arcdata](https://aka.ms/arcdata).
2) Click on Create a Resource.
3) In the Marketplace search box, type 'Azure Arc' and hit enter.
4) In the search results, click on 'Azure Arc data controller'.
5) Click on the Create button.
6) Choose a Subscription, resource group and region just like you would for any other resource that you would create in the Azure portal.
7) Enter a name for your data controller.
8) Enter the name of a namespace that you want to create in your Kubernetes cluster where the data controller will be deployed.
9) Choose a connection mode (Disconnected is fine for now; it doesn't really make a difference at the moment).
10) Click the Review and Generate button at the bottom of the page.
11) On the next screen, you will see a summary of your selections and a script that is generated.  You can click the Download button to download the script.  In the future we will, offer options to download the script in Linux/macOS bash script format or PowerShell.  In the future, you will be able to run the generated script against your Kubernetes cluster to deploy the data controller and then export the data out of the Azure arc data controller and upload it to Azure similar to the scenario '[View data controller in Azure Portal](/scenarios/022-view-data-controller-in-azure-portal.md)'.

> [!NOTE]
>   This script will not actually work to deploy a data controller yet.  This scenario is just to give you an idea of what is coming.  To actually create a data controller if you haven't already please follow the instructions in the '[Create data controller](/scenarios/002-create-data-controller.md)' scenario.
