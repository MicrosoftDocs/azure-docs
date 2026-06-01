---
title: Deploy SAP infrastructure by using SAP Deployment Automation Framework and Azure DevOps
description: Learn how to deploy SAP infrastructure by using SAP Deployment Automation Framework with Azure DevOps Services.
author: mimergel
ms.author: mimergel
ms.reviewer: kimforss
ms.date: 04/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
# Customer intent: As a DevOps engineer, I want to automate the deployment of SAP infrastructure using a deployment framework, so that I can streamline and manage SAP resources efficiently within Azure DevOps.
---

# Deploy SAP infrastructure by using SAP Deployment Automation Framework and Azure DevOps

[SAP Deployment Automation Framework](deployment-framework.md) provides pipelines in Azure DevOps that automate the entire SAP deployment lifecycle, from control plane setup through SAP software installation. By using these pipelines, you can deploy and manage SAP environments consistently without running scripts manually.

In this article, you:

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

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

  > [!NOTE]
  > The free Azure account might not be sufficient to run the deployment.

- A service principal with Contributor permissions in the target subscriptions. For more information, see [Prepare the deployment credentials](deploy-control-plane.md#prepare-the-deployment-credentials).
- A configured Azure DevOps instance. For more information, see [Configure Azure DevOps Services for SAP Deployment Automation](configure-devops.md).
- For the `SAP software acquisition` and the `Configuration and SAP installation` pipelines, a configured self-hosted agent. The self-hosted agent virtual machine is deployed as part of the control plane deployment.

## Review the deployment configuration

These steps reference and use the [default naming convention](naming.md) for the automation framework. The configurations also use example values for naming. This article uses the following names:

- The Azure DevOps Services project name is `SAP-Deployment`.
- The Azure DevOps Services repository name is `sap-automation`.
- The control plane environment is named `MGMT`. It's in the region West Europe (`WEEU`) and is installed in the virtual network `DEP00`. The deployer configuration name is `MGMT-WEEU-DEP00-INFRASTRUCTURE`.
- The SAP workload zone has the environment name `DEV`. It's in the same region as the control plane and uses the virtual network `SAP01`. The SAP workload zone configuration name is `DEV-WEEU-SAP01-INFRASTRUCTURE`.
- The SAP system with security ID (SID) `X00` is installed in this SAP workload zone. The configuration name for the SAP system is `DEV-WEEU-SAP01-X00`.

| Artifact type | Configuration name              | Location        |
| ------------- | ------------------------------- | --------------- |
| Control plane | MGMT-WEEU-DEP00-INFRASTRUCTURE  | westeurope      |
| Workload zone | DEP-WEEU-SAP01-INFRASTRUCTURE   | westeurope      |
| SAP system    | DEP-WEEU-SAP01-X00              | westeurope      |

The following diagram shows the deployed infrastructure.

:::image type="content" source="media/devops/automation-devops-tutorial-design.png" alt-text="Diagram that shows the deployment infrastructure design.":::

> [!NOTE]
> In this example, the X00 SAP system is deployed with the following virtual machine (VM) configuration:
>
> * Standalone deployment
> * HANA DB VM SKU: Standard_M32ts
> * ASCS VM SKU: Standard_D4s_v3
> * APP VM SKU: Standard_D4s_v3

## Deploy the control plane

The deployment uses the configuration defined in the Terraform variable files located in the `samples/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` and `samples/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folders.

1. Make sure the `Deployment_Configuration_Path` variable in the `SDAF-General` variable group is set to `samples/WORKSPACES`.

1. Select the `Deploy control plane` pipeline from the **Pipelines** section.

1. Enter `MGMT-WEEU-DEP00-INFRASTRUCTURE` as the deployer configuration name and `MGMT-WEEU-SAP_LIBRARY` as the SAP library configuration name.

   :::image type="content" source="media/devops/automation-run-pipeline.png" alt-text="Screenshot that shows the Run pipeline dialog for the control plane deployment.":::

1. Track the progress in the Azure DevOps Services portal. After the deployment finishes, you can see the control plane details on the **Extensions** tab.

   :::image type="content" source="media/devops/automation-run-pipeline-control-plane.png" alt-text="Screenshot that shows the pipeline results for the control plane deployment.":::

## Deploy the workload zone

The deployment uses the configuration defined in the Terraform variable file located in the `samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE` folder.

1. Select the `Deploy workload zone` pipeline from the **Pipelines** section.

1. Enter `DEV-WEEU-SAP01-INFRASTRUCTURE` as the workload zone configuration name and `MGM` as the deployer environment name.

1. Track the progress in the Azure DevOps Services portal. After the deployment finishes, you can see the workload zone details on the **Extensions** tab.

## Deploy the SAP system

The deployment uses the configuration defined in the Terraform variable file located in the `samples/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00` folder.

1. Select the `SAP system deployment` pipeline from the **Pipelines** section.

1. Enter `DEV-WEEU-SAP01-X00` as the SAP system configuration name.

1. Track the progress in the Azure DevOps Services portal. After the deployment finishes, you can see the SAP system details on the **Extensions** tab.

## Download the SAP software

1. Select the `SAP software acquisition` pipeline from the **Pipelines** section.

1. Enter `S41909SPS03_v0011ms` as the Bill of Materials name, `MGMT` as the control plane environment name, and `MGMT` and `WEEU` as the control plane (SAP library) location code.

1. Track the progress in the Azure DevOps Services portal.

## Run the configuration and SAP installation pipeline

1. Select the `Configuration and SAP installation` pipeline from the **Pipelines** section.

1. Enter `DEV-WEEU-SAP01-X00` as the SAP system configuration name and `S41909SPS03_v0010ms` as the Bill of Materials name.

1. Choose the playbooks to run.

   :::image type="content" source="media/devops/automation-os-sap.png" alt-text="Screenshot that shows the OS and SAP configuration options.":::

1. Track the progress in the Azure DevOps Services portal.

## Run the repository update pipeline

1. Select the `Repository updater` pipeline from the **Pipelines** section.

1. In the **Source** repository field, enter `https://github.com/Azure/sap-automation.git`. In the **Source** branch field, enter `main`.

1. Select **Force the update** only if the update fails.

## Run the removal pipeline

1. Select the `Deployment removal` pipeline from the **Pipelines** section.

1. To remove the SAP system, enter `DEV-WEEU-SAP01-X00` as the SAP system configuration name.

1. To remove the SAP workload zone, enter `DEV-WEEU-SAP01-INFRASTRUCTURE` as the SAP workload zone configuration name.

1. To remove the control plane, enter `MGMT-WEEU-DEP00-INFRASTRUCTURE` as the deployer configuration name and `MGMT-WEEU-SAP_LIBRARY` as the SAP library configuration name.

## Related content

- [SAP Deployment Automation Framework](deployment-framework.md)
- [Configure Azure DevOps Services for SAP Deployment Automation](configure-devops.md)
- [Configure control plane](configure-control-plane.md)
- [Deploy the control plane](deploy-control-plane.md)
