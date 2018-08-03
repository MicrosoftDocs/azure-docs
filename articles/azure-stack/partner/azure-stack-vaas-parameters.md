---
title: Workflow common parameters in Azure Stack Validation as a Service| Microsoft Docs
description: Workflow common parameters for Azure Stack Validation as a Service
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Workflow common parameters for Azure Stack Validation as a Service

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Common parameters include values such as environment variables and user credentials required by all tests in Validation as a Service (VaaS). These values are defined at the workflow level when you create or modify a workflow. When scheduling tests, these values are passed as parameters to each test under the workflow.

## Environment parameters

Environment parameters describe the Azure Stack environment under test. These values must be provided by generating and uploading an Azure Stack stamp information file for the specific instance you are testing.

> [!NOTE]
> Environment parameters cannot be modified after creating a workflow.

### Generate the stamp information file

1. Log in to DVM machine or any machine that has access to the Azure Stack environment.
2. Execute the following commands in an elevated PowerShell window:
    ```PowerShell
    $params = Invoke-RestMethod -Method Get -Uri 'https://ASAppGateway:4443/ServiceTypeId/4dde37cc-6ee0-4d75-9444-7061e156507f/CloudDefinition/GetStampInformation'
    ConvertTo-Json $params > stampinfoproperties.json
    ```

## Test parameters

Common test parameters include sensitive information that can't stored in configuration files. These must be manually provided.

Parameter    | Description
-------------|-----------------
Tenant Administrator User                            | Azure Active Directory Tenant Administrator that was provisioned by the service administrator in the AAD directory. This user performs tenant-level operations such as deploying templates to provision resources (VMs, storage accounts, etc.) and executing workloads. For details on provisioning the tenant account, see [Add a new Azure Stack tenant](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-add-new-user-aad).
Service Administrator User             | Azure Active Directory Administrator of the AAD Directory Tenant specified during Azure Stack deployment. Search for `AADTenant` in the stamp information file and select the value in the `UniqueName` tag <TODO where are tags?>.
Cloud Administrator User               | Azure Stack domain administrator account (e.g., `contoso\cloudadmin`). Search for `User Role="CloudAdmin"` in the stamp information file and select the value in the `UserName` tag.
Diagnostics Connection String          | A SAS URI to an Azure Storage Account to which diagnostics logs will be copied during test execution. For instructions on generating the SAS URI, see [Set up a blob storage account](azure-stack-vaas-set-up-account.md) <TODO move this>. |