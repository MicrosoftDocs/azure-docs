---
title: SAP deployment automation framework DevOps hands-on lab
description: DevOps Hands-on lab for the SAP Deployment Automation Framework on Azure
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/14/2021
ms.topic: tutorial
ms.service: virtual-machines-sap
---

#  SAP Deployment Automation Framework DevOps - Hands on lab

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

These steps reference and use the [default naming convention](automation-naming.md) for the automation framework. Example values are also used for naming throughout the configurations. In this tutorial the following names are used:
- Azure DevOps project name is `SAP-Deployment` 
- Azure DevOps repository name is `sap-automation` 
- The deployer environment is named `MGMT`, in the region West Europe (`WEEU`) and installed in the virtual network `DEP00`, leading to a deployer configuration called `MGMT-WEEU-DEP00-INFRASTRUCTURE`
- The SAP workload zone get the enfironment name `DEV`, is in the same region and using the virtual network `SAP01`, leading to the SAP workload zone configuration called `DEV-WEEU-SAP01-INFRASTRUCTURE`
- The SAP Systems with SID `X00` will be installed in this SAP workload zone. This leads to the configuration name `DEV-WEEU-SAP01-X00`

> [!Note]
> In this tutorial the X00 SAP system will be deployed with the folowing characteristics:
> * No firewall
> * No high avilability cluster, thus no load balancers
> * HANA DB VM SKU: Standard_M32ts
> * ASCS VM SKU: Standard_D4s_v3

## Prerequisites

1. An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
2. An Azure account with privileges to create a service principal. 
3. A [download of the SAP software](automation-software.md) in your Azure environment.
4. An Azure DevOps account. If you don't have an Azure DevOps account, you can [create a free account](https://azure.microsoft.com/en-us/services/devops/).
5. A service principle with contributor rights on the subscription. Follow these instructions to [create the service principle](https://docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/automation-deploy-control-plane?tabs=linux#prepare-the-deployment-credentials) using [Azure cloud shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview). 

