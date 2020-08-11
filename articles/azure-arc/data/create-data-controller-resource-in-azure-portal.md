---
title: Create an Azure Arc data controller in the Azure portal
description: Create an Azure Arc data controller in the Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Create an Azure Arc data controller in the Azure portal

> [!NOTE]
> This scenario is not completed end:end yet, but you can start to try out the experience and provide us feedback on it.

## Connectivity Modes

- **Indirectly connected** - There is no direct connection to Azure.  Data is sent to Azure only through an export/upload process.  All Azure Arc data services deployments work in this mode today in preview.

You can read more about the difference between the [connectivity modes](connectivity.md).

In the indirectly connected mode, you can use the Azure portal to generate a script for you that can then be downloaded and executed against your Kubernetes cluster.  In the upcoming directly connected mode you will be able to provision the data controller directly from the portal through the Azure Arc enabled Kubernetes connection.  More details on the directly connected mode deployment of a data controller will be provided soon.  For now this scenario document covers how to use the Azure portal in the indirectly connected mode.

## Using the Azure portal to create an Azure Arc data controller

Many of the experiences for Azure Arc start in the Azure portal even though the resource to be created or managed is outside of Azure infrastructure.  The user experience pattern in these cases, especially when there is no direct connectivity between Azure and the customer environment is to use the Azure portal to generate a script which can then be downloaded and executed in the customer environment to establish a secure connection back to Azure.  For example, Azure Arc enabled for servers follows this pattern to [create Arc connected machines](/azure-arc/servers/onboard-portal).

In this scenario, you will see the initial experience for creating a data controller resource in the Azure portal.  The experience will be changing as we evolve the design and thinking, but we value your early feedback on it so we are publishing the scenario documentation now.

Steps:

1. First, log in to the Azure portal using the special URL [https://aka.ms/arcdata](https://aka.ms/arcdata).
1. Click on Create a Resource.
1. In the Marketplace search box, type 'Azure Arc' and hit enter.
1. In the search results, click on 'Azure Arc data controller'.
1. Click on the Create button.
1. Choose a Subscription, resource group and region just like you would for any other resource that you would create in the Azure portal.
1. Enter a name for your data controller.
1. Enter the name of a namespace that you want to create in your Kubernetes cluster where the data controller will be deployed.
1. Choose a connection mode (Disconnected is fine for now; it doesn't really make a difference at the moment).
1. Click the Review and Generate button at the bottom of the page.
1. On the next screen, you will see a summary of your selections and a script that is generated.  You can click the Download button to download the script. 

> [!NOTE]
>   This script will not actually work to deploy a data controller yet.  This scenario is just to give you an idea of what is coming.  To actually create a data controller if you haven't already please follow the instructions in the '[Create data controller](/scenarios/create-data-controller.md)' scenario.
