---
title: 'Tutorial: Use SAP Deployment Automation Framework with DevOps'
description: This tutorial shows you how to use SAP Deployment Automation Framework by using Azure DevOps Services.
author: mimergel
ms.author: mimergel
ms.reviewer: kimforss
ms.date: 10/19/2022
ms.topic: tutorial
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Tutorial: Use SAP Deployment Automation Framework with DevOps

This tutorial shows you how to perform the deployment activities of [SAP Deployment Automation Framework](deployment-framework.md) by using Azure DevOps Services.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy the control plane (deployer infrastructure and library).
> * Deploy the workload zone (landscape and system).
> * Deploy the SAP infrastructure.
> * Install the HANA database.
> * Install the SCS server.
> * Load the HANA database.
> * Install the primary application server.
> * Download the SAP software.
> * Install SAP.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

   > [!Note]
   > The free Azure account might not be sufficient to run the deployment.

- A service principal with Contributor permissions in the target subscriptions. For more information, see [Prepare the deployment credentials](deploy-control-plane.md#prepare-the-deployment-credentials).
- A configured Azure DevOps instance. For more information, see [Configure Azure DevOps Services for SAP Deployment Automation](configure-devops.md).
- For the `SAP software acquisition` and the `Configuration and SAP installation` pipelines, a configured self-hosted agent.

The self-hosted agent virtual machine is deployed as part of the control plane deployment.

## Overview

These steps reference and use the [default naming convention](naming.md) for the automation framework. Example values are also used for naming throughout the configurations. This tutorial uses the following names:

- The Azure DevOps Services project name is `SAP-Deployment`.
- The Azure DevOps Services repository name is `sap-automation`.
- The control plane environment is named `MGMT`. It's in the region West Europe (`WEEU`) and is installed in the virtual network `DEP00`. The deployer configuration name is `MGMT-WEEU-DEP00-INFRASTRUCTURE`.
- The SAP workload zone has the environment name `DEV`. It's in the same region as the control plane and uses the virtual network `SAP01`. The SAP workload zone configuration name is `DEV-WEEU-SAP01-INFRASTRUCTURE`.
- The SAP system with SID `X00` is installed in this SAP workload zone. The configuration name for the SAP system is `DEV-WEEU-SAP01-X00`.

| Artifact type | Configuration name              | Location        |
| ------------- | ------------------------------- | --------------- |
| Control plane | MGMT-WEEU-DEP00-INFRASTRUCTURE  | westeurope      |
| Workload zone | DEP-WEEU-SAP01-INFRASTRUCTURE   | westeurope      |
| SAP system    | DEP-WEEU-SAP01-X00              | westeurope      |

The following diagram shows the deployed infrastructure.

 :::image type="content" source="media/devops/automation-devops-tutorial-design.png" alt-text="Diagram that shows the DevOps tutorial infrastructure design.":::

> [!Note]
> In this tutorial, the X00 SAP system is deployed with the following configuration:
>
> * Standalone deployment
> * HANA DB VM SKU: Standard_M32ts
> * ASCS VM SKU: Standard_D4s_v3
> * APP VM SKU: Standard_D4s_v3

## Deploy the control plane

The deployment uses the configuration defined in the Terraform variable files located in the `samples/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` and `samples/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folders.

Ensure that the `Deployment_Configuration_Path` variable in the `SDAF-General` variable group is set to `samples/WORKSPACES`.

Run the pipeline by selecting the `Deploy control plane` pipeline from the **Pipelines** section. Enter `MGMT-WEEU-DEP00-INFRASTRUCTURE` as the deployer configuration name and `MGMT-WEEU-SAP_LIBRARY` as the SAP library configuration name.

:::image type="content" source="media/devops/automation-run-pipeline.png" alt-text="Screenshot that shows the DevOps tutorial Run pipeline dialog.":::

You can track the progress in the Azure DevOps Services portal. After the deployment is finished, you can see the control plane details on the **Extensions** tab.

 :::image type="content" source="media/devops/automation-run-pipeline-control-plane.png" alt-text="Screenshot that shows the DevOps Run pipeline results.":::

## Deploy the workload zone

The deployment uses the configuration defined in the Terraform variable file located in the `samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE` folder.

Run the pipeline by selecting the `Deploy workload zone` pipeline from the **Pipelines** section. Enter `DEV-WEEU-SAP01-INFRASTRUCTURE` as the workload zone configuration name and `MGM` as the deployer environment name.

You can track the progress in the Azure DevOps Services portal. After the deployment is finished, you can see the workload zone details on the **Extensions** tab.

## Deploy the SAP system

The deployment uses the configuration defined in the Terraform variable file located in the `samples/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00` folder.

Run the pipeline by selecting the `SAP system deployment` pipeline from the **Pipelines** section. Enter `DEV-WEEU-SAP01-X00` as the SAP system configuration name.

You can track the progress in the Azure DevOps Services portal. After the deployment is finished, you can see the SAP system details on the **Extensions** tab.

## Download the SAP software

Run the pipeline by selecting the `SAP software acquisition` pipeline from the **Pipelines** section. Enter `S41909SPS03_v0011ms` as the name of Bill of Materials, `MGMT` as the control plane environment name, and `MGMT` and `WEEU` as the control plane (SAP library) location code.

You can track the progress in the Azure DevOps portal.

## Run the configuration and SAP installation pipeline

Run the pipeline by selecting the `Configuration and SAP installation` pipeline from the **Pipelines** section. Enter `DEV-WEEU-SAP01-X00` as the SAP system configuration name and `S41909SPS03_v0010ms` as the Bill of Materials name.

Choose the playbooks to run.

:::image type="content" source="media/devops/automation-os-sap.png" alt-text="Screenshot that shows the DevOps tutorial, OS, and SAP configuration.":::

You can track the progress in the Azure DevOps Services portal.

## Run the repository update pipeline

Run the pipeline by selecting the `Repository updater` pipeline from the **Pipelines** section. Enter `https://github.com/Azure/sap-automation.git` as the source repository and `main` as the source branch to update from.

Only select **Force the update** if the update fails.

## Run the removal pipeline

Run the pipeline by selecting the `Deployment removal` pipeline from the **Pipelines** section.

### SAP system removal

Enter `DEV-WEEU-SAP01-X00` as the SAP system configuration name.

### SAP workload zone removal

Enter `DEV-WEEU-SAP01-INFRASTRUCTURE` as the SAP workload zone configuration name.

### Control plane removal

Enter `MGMT-WEEU-DEP00-INFRASTRUCTURE` as the deployer configuration name and enter `MGMT-WEEU-SAP_LIBRARY` as the SAP library configuration name.

## Next step

> [!div class="nextstepaction"]
> [Configure control plane](configure-control-plane.md)
