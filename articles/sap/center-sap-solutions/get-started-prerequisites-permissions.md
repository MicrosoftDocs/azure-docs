---
title: Permissions and prerequisites - Azure Workload Center for SAP
description: Learn the permissions and prerequisites required to onboard SAP workloads to Azure Workload Center for SAP. Get started today.
ms.date: 11/06/2026
ms.topic: get-started
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Permissions and prerequisites for Azure Workload Center for SAP

## Get access to the preview

The Workload Virtual Instance (WVI) experience is currently available in limited preview for non-production SAP environments.

To access the limited preview, [register your interest in the Azure Workload Center for SAP preview](https://aka.ms/workloadcenter/SAP-signup).

After you submit the form, the Azure Workload Center for SAP product team reviews your request and provides access to the preview for eligible customers.

## Prerequisites for onboarding an existing SAP on Azure system as a WVI

Before you begin onboarding your workloads to Azure Workload Center for SAP, ensure the following prerequisites. When you meet these prerequisites, the experience enables capabilities such as configuration validation and workload health observability by default:

- **Opt in for preview feature**: Your Azure subscription must be registered to use Microsoft.Workloads Resource Provider and Microsoft.CloudHealth Resource Provider.

  - Go to Azure portal.

  - Search for your subscription and open the corresponding blade.

  - On the left side menu, go to **Settings** -> **Resource providers**.

  - Search for "Microsoft.Workloads", select it, and select **Register**.

    :::image type="content" source="media/prerequisites-permissions/register-microsoft-workloads-provider.png" lightbox="media/prerequisites-permissions/register-microsoft-workloads-provider.png" alt-text="Screenshot of Resource providers page with Microsoft.Workloads selected and Register button highlighted.":::

  - Search for "Microsoft.CloudHealth", select it, and select **Register**.

## Permissions required for onboarding

### Azure subscription and permissions setup

- Identify the subscription ID and resource group where you create the WVI and its components.

- Create or identify a storage account. Use this account during workload onboarding as WVI to store the output of the discovery scripts that run on your SAP VMs.

### User permissions

- You must have **Contributor** access on the resource group where you create the WVI.

Or:

- You can create a custom role with the following permissions:

  - Microsoft.Workloads/virtualInstances/write

  - Microsoft.Workloads/virtualInstances/read

  - Microsoft.Workloads/virtualInstances/instanceMonitors/read

  - Microsoft.Workloads/virtualInstances/instanceMonitors/write

  - Microsoft.CloudHealth/healthmodels/read

  - Microsoft.CloudHealth/healthmodels/write

<!-- -->

- You must have the **Microsoft.ManagedIdentity/userAssignedIdentities/\*/assign/action** permission on the selected user-assigned managed identity. This permission is required to associate the managed identity with the workload virtual instance (WVI).

- You must have **Reader** access on the Azure resources which are part of your workloads.

### User-assigned managed identity requirements

- Create a **user-assigned managed identity** **with Reader, Monitoring Reader, and Virtual Machine Contributor roles** on the subscription or resource groups where your actual workloads exist. The Azure Workload Center for SAP service uses this identity to access the workload resources, run configuration validations to identify drifts in your Azure resource and OS level configurations, and enable workload health observability.

  Or:

  Create a **user-assigned managed identity** with  
**read** permission on resources which form part of your workloads and **Run Command Write permission** for running the OS configuration checks with the following permissions:

  - Microsoft.Compute/virtualMachines/runCommand/write

  - Microsoft.Compute/virtualMachines/runCommand/read

<!-- -->

- The user-assigned managed identity must also have **Contributor** **role** on the subscription or resource group where you expect to create the WVI.

  Or:

  The user-assigned managed identity must have a **custom role** that includes **all permissions from the Monitoring Contributor role**, as well as **all permissions associated with the Microsoft.CloudHealth** resource provider.

- The user-assigned managed identity must have **Storage Blob Data Contributor** on the storage account.

## Prerequisites for using Azure Copilot Run SAP Agent

- **Azure Copilot access:** You must have access to Azure Copilot. By default, Azure Copilot is available to all users in a tenant unless the tenant admin restricts access.

- **SAP workload onboarding:** The SAP workload that you want to investigate must be onboarded to Azure Workload Center for SAP as a workload virtual instance (WVI).

- **Resource access:** You must have the required permissions to access the workload and the Azure resources that you want to investigate.

Individual Run SAP agent scenarios can have additional prerequisites. Review the prerequisites for the scenario that you want to use before you begin.
