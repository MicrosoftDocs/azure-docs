---
title: SAP deployment automation framework DevOps hands-on lab
description: DevOps Hands-on lab for the SAP Deployment Automation Framework on Azure
author: mimergel
ms.author: mimergel
ms.reviewer: kimforss
ms.date: 12/14/2021
ms.topic: tutorial
ms.service: virtual-machines-sap
---

#  SAP Deployment Automation Framework DevOps - Hands-on lab

This tutorial shows how to perform the deployment activities of the [SAP deployment automation framework on Azure](automation-deployment-framework.md) using Azure DevOps.

You will perform the following tasks during this lab:

> [!div class="checklist"]
> * Deploy the Control Plane (Deployer Infrastructure & Library)
> * Deploy the Workload Zone (Landscape, System)
> * Download/Upload BOM
> * Configure standard and SAP-specific OS settings
> * Install HANA DB
> * Install SCS server
> * Load HANA DB
> * Install Primary Application Server

These steps reference and use the [default naming convention](automation-naming.md) for the automation framework. Example values are also used for naming throughout the configurations. In this tutorial, the following names are used:
- Azure DevOps project name is `SAP-Deployment` 
- Azure DevOps repository name is `sap-automation` 
- The control plane environment is named `MGMT`, in the region West Europe (`WEEU`) and installed in the virtual network `DEP00`, leading to a deployer configuration called `MGMT-WEEU-DEP00-INFRASTRUCTURE`
- The SAP workload zone has the environment name `DEV` and is in the same region using the virtual network `SAP01`, leading to the SAP workload zone configuration name  `DEV-WEEU-SAP01-INFRASTRUCTURE`
- The SAP System with SID `X00` will be installed in this SAP workload zone. This leads to the configuration name `DEV-WEEU-SAP01-X00`

| Artifact type | Name                            | Location        |
| ------------- | ------------------------------- | --------------- |
| Control Plane | MGMT-WEEU-DEP00-INFRASTRUCTURE  | westeurope      |
| Workload Zone | DEP-WEEU-SAP01-INFRASTRUCTURE   | westeurope      |
| SAP System    | DEP-WEEU-SAP01-X00              | westeurope      |

> [!Note]
> In this tutorial the X00 SAP system will be deployed with the following configuration:
> * Standalone deployment
> * HANA DB VM SKU: Standard_M32ts
> * ASCS VM SKU: Standard_D4s_v3

## Prerequisites

1. An Azure subscription. If you don't have an Azure subscription, you can [create a free account here ](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
2. An Azure account with privileges to create a service principal. 
3. SAP software, see [download of the SAP software](automation-software.md) in your Azure environment.
4. An Azure DevOps organization. If you don't have an Azure DevOps organization, you can [create a free account here](https://azure.microsoft.com/services/devops/).
5. A service principal with contributor rights on the subscription. Follow these instructions to [create the service principal](automation-deploy-control-plane.md?tabs=linux#prepare-the-deployment-credentials) using [Azure Cloud Shell](/azure/cloud-shell/overview). 

> [!Note]
> The free Azure account may not be sufficient to run the deployment

