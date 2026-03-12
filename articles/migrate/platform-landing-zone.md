---
title: Generate and deploy Platform Landing Zone with Azure Migrate 
description: Learn how to generate and deploy Platform Landing Zone with Azure Migrate to set up governance, networking, and core Azure services for migration readiness.
ms.topic: how-to
author: piyushdhore-microsoft  
ms.author: piyushdhore
ms.service: azure-migrate
ms.date: 02/09/2026
ms.reviewer: v-uhabiba
monikerRange:
# Customer intent: This article helps customers generate, customize, and deploy a Platform Landing Zone using Azure Migrate to establish core Azure foundations as part of migration planning.
---

# Generate and deploy a Platform Landing Zone using Azure Migrate agent (preview)

This article describes how to generate a **Platform Landing Zone (PLZ)** by using **Azure Migrate**. It also explains how to iterate on the generated configuration before deploying it with **Visual Studio Code**, **GitHub Copilot Chat**, and the **Azure Model Context Protocol (MCP) server**.

A Platform Landing Zone provides foundational Azure capabilities such as resource organization, governance, identity, networking, and management. Teams use it as a standardized baseline for deploying workloads in Azure.

## Workflow overview

This workflow outlines how to generate a **Platform Landing Zone** from Azure Migrate and then iterate over it and deploy it using Visual Studio Code. The workflow consists of two phases:

- **Generate the Platform Landing Zone**: Generate the design document and Terraform-based infrastructure as code from Azure Migrate.
- **Iterate and deploy the Platform Landing Zone**: Iterate on and deploy the generated landing zone from Visual Studio Code by using the Azure Model Context Protocol (MCP) server.

Generation is initiated from Azure Migrate. Iteration and deployment are performed from Visual Studio Code.

## Prerequisites

Before you begin, ensure that you have the following:

- An Azure Migrate project.
- Visual Studio Code installed.
- GitHub Copilot Chat enabled in Visual Studio Code.
- An Azure subscription with permissions to create and deploy resources required for the platform landing zone.

### Permissions

The required permissions depend on the deployment scenario and the scope at which resources are deployed.

#### Initial tenant or subscription setup

If you are bootstrapping new subscriptions or performing initial tenant setup, Owner permission may be temporarily required at one of the following scopes:

- Tenant root management group
- Management group

#### Platform Landing Zone deployment

For standard Platform Landing Zone deployment, the deployment identity must have the following permissions:

- **Contributor** and **User Access Administrator** at the target management group scope.
- **Contributor** at the target subscription scope.

These permissions are required to create resources, assign policies, and configure role-based access control (RBAC) during deployment.

## End-to-end Platform Landing Zone workflow

The following steps show how to generate a **Platform Landing Zone** using Azure Migrate and then iterate and deploy it using **Visual Studio Code** with **GitHub Copilot Chat** and the **Azure MCP Server**.

### Generate the Platform Landing Zone in Azure Migrate

This section describes how to generate a Platform Landing Zone in Azure Migrate and review the generated artifacts in Visual Studio Code.

1. In the Azure portal, open **Azure Migrate** and then go to your Azure Migrate project.
1. Start the **Azure Migrate Agent** experience.
1. Ask the agent to create a Platform Landing Zone by entering:
    *I want to create a Platform Landing Zone (or PLZ)*.

    :::image type="content" source="./media/platform-landing-zone/agent-help.png" alt-text="Screenshot shows landing zone defaults, recommendations, and options to generate code." lightbox="./media/platform-landing-zone/agent-help.png":::    

1. Complete the guided conversation based on your requirements.
1. When the process completes, download the generated output as a ZIP file.
1. Extract the ZIP file to a local folder.
1. Open the extracted folder in **Visual Studio Code**.

The downloaded ZIP file typically includes the following artifacts:

- Terraform templates for the Platform Landing Zone
- A generated design document
- Configuration files
- Scripts for configuration and deployment
- CI/CD workflow definitions (if applicable)

### Enable iteration in Visual Studio Code by installing the Azure MCP Server

To iterate on the platform landing zone using natural language prompts in Copilot Chat, for example, to denial Distributed Denial of Service (DDoS) or switch to Azure Virtual WAN (vWAN), you must enable the Azure Model Context Protocol (MCP) Server in Visual Studio Code.

#### Install and configure the Azure MCP Server

1. Open the **Visual Studio Code**.
1. Go to **Extensions** and install the **Azure MCP Server** extension.
1. If prompted, select **Switch to Pre-Release Version**.
1. Reload **Visual Studio Code** or restart extensions.
1. Open the **Copilot Chat** and select Tools.
1. Enable **Azure MCP**, and then select **Update tools**.
1. Verify that the `azuremigrate` tool appears in the tools list.

### Iterate on the Platform Landing Zone - Visual Studio Code and MCP

After you enable the Azure Model Context Protocol (MCP) server, use GitHub Copilot Chat in Visual Studio Code to apply changes across the platform landing zone artifacts.

Use Copilot Chat to make updates such as:

- Disable DDoS protection.
- Change Azure regions.
- Switch the network architecture, for example, hub-and-spoke or Virtual WAN.
- Update firewall configurations.
- Modify policy overrides.

Copilot applies changes across the relevant files, including Terraform variables, configuration files, and policy overrides, and summarizes the updates that were made.

### Deploy the Platform Landing Zone

Deploy the platform landing zone by following the deployment instructions included in the generated package, including the README file and deployment scripts.

A typical deployment workflow includes:

1. Update the configuration files, for example, `config/inputs.yaml` with values specific to your environment.
1. Run the configuration update script:

    ```azurepowershell
    .\scripts\powershell\update-config.ps1

    ```

    ```bash
    ./scripts/bash/update-config.ps1
    ```

1. Deploy bootstrap prerequisites:

    ```azurepowershell
    .\scripts\powershell\invoke-terraform.ps1 -ModuleFolderPath "D:\azure-landing-zone-platform\output\bootstrap\v7.0.0\alz\github" -TfvarsFileName "terraform.tfvars.json" -TenantId "tenantId" -AutoApprove
    ```

    ```bash
    ./scripts/bash/invoke-terraform.sh -m "azure-landing-zone-platform/output/bootstrap/v7.0.0/alz/github" -f "terraform.tfvars.json" -t "tenantId" -a
    ```
1. Deploy the platform landing zone by using the provided CI/CD pipeline (GitHub Actions or Azure DevOps) or run Terraform by using the included scripts.

## Design document generation

The design document included in the platform landing zone package uses a template-based approach. Azure Migrate generates the document based on the selected platform landing zone configuration you select, such as region type, network architecture, firewall type, and region selection. The output is a customized Markdown document that matches your chosen configuration.

## Next steps

After deploying the Platform Landing Zone, you can start creating [assessments](concepts-overview.md) or proceeding with [migration](server-migrate-overview.md).