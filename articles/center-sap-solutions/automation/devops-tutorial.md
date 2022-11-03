---
title: SAP on Azure Deployment Automation Framework DevOps hands-on lab
description: DevOps Hands-on lab for the SAP on Azure Deployment Automation Framework.
author: mimergel
ms.author: mimergel
ms.reviewer: kimforss
ms.date: 10/19/2022
ms.topic: tutorial
ms.service: virtual-machines-sap
---

# SAP on Azure Deployment Automation Framework DevOps - Hands-on lab

This tutorial shows how to perform the deployment activities of the [SAP on Azure Deployment Automation Framework](automation-deployment-framework.md) using Azure DevOps Services.

You'll perform the following tasks during this lab:

> [!div class="checklist"]
> * Deploy the Control Plane (Deployer Infrastructure & Library)
> * Deploy the Workload Zone (Landscape, System)
> * Deploy the SAP Infrastructure
> * Install HANA Database
> * Install SCS server
> * Load HANA Database
> * Install Primary Application Server
> * Download the SAP software
> * Install SAP

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!Note]
> The free Azure account may not be sufficient to run the deployment.

- A Service Principal with 'Contributor' permissions in the target subscriptions. For more information, see [Prepare the deployment credentials](automation-deploy-control-plane.md#prepare-the-deployment-credentials).

- A configured Azure DevOps instance, follow the steps here [Configure Azure DevOps Services for SAP Deployment Automation](automation-configure-devops.md)

- For the 'SAP software acquisition' and the 'Configuration and SAP installation' pipelines a configured self hosted agent.

> [!Note]
> The self hosted agent virtual machine will be deployed as part of the control plane deployment.

## Overview

These steps reference and use the [default naming convention](automation-naming.md) for the automation framework. Example values are also used for naming throughout the configurations. In this tutorial, the following names are used:
- Azure DevOps Services project name is `SAP-Deployment` 
- Azure DevOps Services repository name is `sap-automation` 
- The control plane environment is named `MGMT`, in the region West Europe (`WEEU`) and installed in the virtual network `DEP00`, giving a deployer configuration name: `MGMT-WEEU-DEP00-INFRASTRUCTURE`

- The SAP workload zone has the environment name `DEV` and is in the same region as the control plane using the virtual network `SAP01`, giving the SAP workload zone configuration name: `DEV-WEEU-SAP01-INFRASTRUCTURE`
- The SAP System with SID `X00` will be installed in this SAP workload zone. The configuration name for the SAP System: `DEV-WEEU-SAP01-X00`

| Artifact type | Configuration name              | Location        |
| ------------- | ------------------------------- | --------------- |
| Control Plane | MGMT-WEEU-DEP00-INFRASTRUCTURE  | westeurope      |
| Workload Zone | DEP-WEEU-SAP01-INFRASTRUCTURE   | westeurope      |
| SAP System    | DEP-WEEU-SAP01-X00              | westeurope      |

The deployed infrastructure is shown in the diagram below.

 :::image type="content" source="media/devops/automation-devops-tutorial-design.png" alt-text="Picture showing the DevOps tutorial infrastructure design":::


> [!Note]
> In this tutorial the X00 SAP system will be deployed with the following configuration:
> * Standalone deployment
> * HANA DB VM SKU: Standard_M32ts
> * ASCS VM SKU: Standard_D4s_v3
> * APP VM SKU: Standard_D4s_v3

## Deploy the Control Plane

The deployment will use the configuration defined in the Terraform variable files located in the 'samples/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE' and 'samples/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY' folders. 

Ensure that the 'Deployment_Configuration_Path' variable in the 'SDAF-General' variable group is set to 'samples/WORKSPACES'

Run the pipeline by selecting the _Deploy control plane_ pipeline from the Pipelines section. Enter 'MGMT-WEEU-DEP00-INFRASTRUCTURE' as the Deployer configuration name and 'MGMT-WEEU-SAP_LIBRARY' as the SAP Library configuration name.

:::image type="content" source="media/devops/automation-run-pipeline.png" alt-text="Screenshot of the DevOps tutorial run pipeline dialog.":::

You can track the progress in the Azure DevOps Services portal. Once the deployment is complete, you can see the Control Plane details in the _Extensions_ tab.

 :::image type="content" source="media/devops/automation-run-pipeline-control-plane.png" alt-text="Screenshot of the DevOps run pipeline results.":::


## Deploy the Workload zone

The deployment will use the configuration defined in the Terraform variable file located in the 'samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE' folder.

Run the pipeline by selecting the _Deploy workload zone_ pipeline from the Pipelines section. Enter 'DEV-WEEU-SAP01-INFRASTRUCTURE' as the Workload zone configuration name and 'MGMT' as the Deployer Environment Name.

You can track the progress in the Azure DevOps Services portal. Once the deployment is complete, you can see the Workload Zone details in the _Extensions_ tab.

## Deploy the SAP System

The deployment will use the configuration defined in the Terraform variable file located in the 'samples/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00' folder.

Run the pipeline by selecting the _SAP system deployment_ pipeline from the Pipelines section. Enter 'DEV-WEEU-SAP01-X00' as the SAP System configuration name.

You can track the progress in the Azure DevOps Services portal. Once the deployment is complete, you can see the SAP System details in the _Extensions_ tab.

## Download the SAP Software

Run the pipeline by selecting the _SAP software acquisition_ pipeline from the Pipelines section. Enter 'S41909SPS03_v0011ms' as the Name of Bill of Materials (BoM), 'MGMT' as the Control Plane Environment name: MGMT and 'WEEU' as the
Control Plane (SAP Library) location code.

You can track the progress in the Azure DevOps portal. 

## Run the Configuration and SAP Installation pipeline

Run the pipeline by selecting the _Configuration and SAP installation_ pipeline from the Pipelines section. Enter 'DEV-WEEU-SAP01-X00' as the SAP System configuration name and 'S41909SPS03_v0010ms' as the Bill of Materials name.

Choose the playbooks to execute.

:::image type="content" source="media/devops/automation-os-sap.png" alt-text="Screenshot showing the DevOps tutorial, OS and SAP configuration.":::

You can track the progress in the Azure DevOps Services portal. 

## Run the Repository update pipeline

Run the pipeline by selecting the _Repository updater_ pipeline from the Pipelines section. Enter 'https://github.com/Azure/sap-automation.git' as the Source repository and 'main' as the source branch to update from.

Only choose 'Force the update' if the update fails.


## Run the removal pipeline

Run the pipeline by selecting the _Deployment removal_ pipeline from the Pipelines section.

### SAP System removal

Enter 'DEV-WEEU-SAP01-X00' as the SAP System configuration name.

### SAP Workload Zone removal

Enter 'DEV-WEEU-SAP01-INFRASTRUCTURE' as the SAP workload zone configuration name.

### Control Plane removal

Enter 'MGMT-WEEU-DEP00-INFRASTRUCTURE' as the Deployer configuration name and 'MGMT-WEEU-SAP_LIBRARY' as the 
SAP Library configuration name.
## Next steps

> [!div class="nextstepaction"]
> [Configure Control Plane](automation-configure-control-plane.md)




