---
title: Set up the Microsoft Discovery onboarding tool
description: Get the latest Discovery onboarding tool, sign in to Azure, and prepare the resources needed before generating a configuration.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 10/28/2026
# Customer intent: As a platform administrator, I want to prepare the onboarding runner so that I can execute the stages with consistent inputs and appropriate access.
---

# Set up the Microsoft Discovery onboarding tool

Get the latest onboarding tool and prepare the resources needed for Stage 1. This task doesn't deploy Discovery or configure its final networking.

## Prerequisites

- PowerShell 7 or later on Windows, macOS, or Linux.
- Git, or an approved way to download and extract the complete [Discovery repository](https://github.com/microsoft/discovery).
- For live checks and execution: [Azure CLI](/cli/azure/install-azure-cli), an enabled Discovery subscription, and the appropriate [stage permissions](reference-deployment-permissions.md).
- To create resources: permission to create the target resource group, user-assigned managed identity (UAMI), and storage account. Reader access isn't enough.

Offline previews of Stages 2-5 need only PowerShell, the tool files, and a configuration. They don't need Azure access. Stage 1 can parse a workbook offline, but skipped Azure checks don't prove readiness.

## Obtain the complete tool

1. Get the latest files from the repository's `main` branch:

   ```powershell
   git clone --branch main https://github.com/microsoft/discovery.git
   Set-Location .\discovery
   ```

   If you already cloned the repository, run these commands from its root directory instead:

   ```powershell
   git switch main
   git pull --ff-only origin main
   ```

   Resolve any local changes or branch conflicts before updating. Don't check out a specific commit.

1. Enter the scripts directory:

   ```powershell
   Set-Location .\utilities\onboarding-tool\scripts
   pwsh --version
   Get-ChildItem
   ```

   Confirm that the five stage directories and `lib` are present. Keep the complete `utilities/onboarding-tool` folder: the scripts need its modules, workbooks, dependency specifications, and templates.

Run all stage examples from a PowerShell 7 prompt in this directory. On macOS or Linux, you can also run a script from bash or zsh with `pwsh ./<stage>/<script>.ps1`.

The stage scripts read `.xlsx` files without ImportExcel. The separate persona-role assignment utility has its own module requirements.

## Confirm deployment choices

Confirm your deployment path in the [planning overview](concept-deployment-planning.md). Before filling in the workbook, review [network choices](how-to-plan-deployment-network.md) and [resource naming rules](reference-resource-naming.md).

Stage 2 [registers the providers](how-to-register-resource-providers.md) it needs. A [container registry](how-to-configure-container-registry.md) is needed for custom tool images, not for this guide's Q&A test. These linked procedures aren't additional onboarding stages.

## Select the live Azure context

Skip this section for an offline preview.

1. Sign in and select the intended subscription:

   ```powershell
   az login
   az account set --subscription "<subscription-id>"
   az account show --query "{tenantId:tenantId,name:name,id:id}" -o table
   ```

1. Confirm the tenant and subscription. If `Microsoft.Discovery` isn't available, contact your Microsoft account representative to request service access. Provider registration alone doesn't enable the service.
1. Review [permissions by stage](reference-deployment-permissions.md). Activate elevated access only when needed, and keep it active until the task and cleanup finish.

## Identify or create the initial dependencies

Before Stage 1, create or identify a platform resource group, UAMI, and project storage account. The tool doesn't create the identity or account. You can create storage before the Discovery network; Stage 2 configures its networking later.

1. Identify the approved resource group and region. For a new group, run:

   ```powershell
   az group create --name "<platform-resource-group>" --location "<region>"
   ```

1. [Create or identify a UAMI](how-to-configure-managed-identity.md#create-a-user-assigned-managed-identity) and save its full resource ID:

   ```powershell
   az identity show --resource-group "<platform-resource-group>" --name "<uami-name>" --query "{id:id,principalId:principalId}" -o json
   ```

   If needed, use the linked procedure to create it. Stage 2 assigns its roles after the network and storage exist.

1. [Create or identify a StorageV2 account](how-to-configure-project-storage.md#create-a-storage-account) and save its name, resource group, and resource ID:

   ```powershell
   az storage account show --resource-group "<storage-resource-group>" --name "<storage-account-name>" --query "{id:id,name:name,location:location}" -o json
   ```

   Project storage is required even without Bookshelf. Get owner approval for a shared account: Stage 2 changes its firewall, CORS, containers, and private endpoints.

1. Check [quota and capacity](concept-quota-reservation.md) in the selected region. Supported Discovery home regions are East US, Sweden Central, and UK South. Region support doesn't guarantee model or VM capacity.

Set `controlPlaneRegion` for Discovery control-plane resources and `workloadRegion` for the VNet, subnets, and managed-resource-group resources. The regions can differ. For an existing network, prepare it in `workloadRegion` before Stage 1. Otherwise, Stage 2 can create it from your approved plan.

## Prepare runner access and output handling

The computer running live stages must reach Azure control-plane endpoints. For a private workspace, run Stage 5 from a location with access to its private data-plane endpoint. Users viewing project outputs also need browser access to blob storage.

The examples save reports in `.\out`, which the tool creates when needed. Treat configuration and reports as sensitive customer data. Don't commit them, even though `out` is git-ignored.

Before continuing, confirm the Azure context, resource IDs, network plan, and required permissions.

For help with results or failures, see [reports and artifacts](reference-deployment-reports.md) and [onboarding troubleshooting](troubleshoot-deployment-tool.md).

## Next step

> [!div class="nextstepaction"]
> [Create an onboarding configuration](how-to-create-deployment-configuration.md)
