---
title: Workflow common parameters in Azure Stack validation as a service| Microsoft Docs
description: Workflow common parameters for Azure Stack validation as a service
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

# Workflow common parameters for Azure Stack validation as a service

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Common parameters include values such as environment variables and user credentials required by all tests in validation as a service (VaaS). You define these values at the workflow level. You save the values when you create or modify a workflow. At schedule time, the workflow loads the values for the test. 

## Environment parameters

Environment parameters describe the Azure Stack environment under test. These values must be provided by generating and uploading your stamp configuration file `&lt;link&gt;. [How to get the stamp info link].`

| Parameter name | Required | Type | Description |
|----------------------------------|----------|------|---------------------------------------------------------------------------------------------------------------------------------|
| Azure Stack build | Required |  | Build number of the Azure Stack deployment (for example, 1.0.170330.9) |
| OEM version | Yes |  | Version number of the OEM package used during Azure Stack deployment. |
| OEM signature | Yes |  | Signature of the OEM package used during Azure Stack deployment. |
| AAD tenant ID | Required |  | Azure Active Directory tenant GUID specified during Azure Stack deployment.|
| Region | Required |  | Azure Stack deployment region. |
| Tenant Resource Manager endpoint | Required |  | Endpoint for tenant Azure Resource Manager operations (for example, https://management.<ExternalFqdn>) |
| Admin Resource Manager endpoint | Yes |  | Endpoint for Tenant Azure Resource Manager operations (for example, https://adminmanagement.<ExternalFqdn>) |
| External FQDN | Yes |  | External fully qualified domain name used as the suffix for endpoints. (for example, local.azurestack.external or redmond.contoso.com). |
| Number of nodes | Yes |  | Number of nodes on the deployment. |

## Test parameters

Common test parameters include sensitive information that can't stored in configuration files, and must be manually provided.

| Parameter name | Required | Type | Description |
|--------------------------------|------------------------------------------------------------------------------|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tenant username | Required |  | Azure Active Directory Tenant Admin that was either provisioned already or needs to be provisioned by the Service Admin in the AAD Directory. For details on provisioning tenant account, see [Get started with Azure AD](https://docs.microsoft.com/azure/active-directory/get-started-azure-ad). This value is used by the test to perform tenant level operations such as deploying templates to provision resources (VMs, storage accounts etc.) and execute workloads. This value is used by the test to perform tenant level operations such as deploying templates to provision resources (VMs, storage accounts etc.) and execute workloads. |
| Tenant password | Required |  | Password for the tenant user. |
| Service Administrator username | Required: Solution Validation, Package Validation<br>Not required: Test Pass |  | Azure Active Directory Admin of the AAD Directory Tenant specified during Azure Stack deployment. |
| Service Administrator password | Required: Solution Validation, Package Validation<br>Not required: Test Pass |  | Password for the Service Administrator user. |
| Cloud Administrator username | Required |  | Azure Stack domain administrator account (for example, contoso\cloudadmin). Search for User Role="CloudAdmin" in the configuration file and select the value in the UserName tag in the configuration file. |
| Cloud Administrator password | Required |  | Password for the Cloud Administrator user. |
| Diagnostics Connection String | Required |  | A SAS URI to an Azure Storage Account to which diagnostics logs will be copied during test execution. Instructions for generating the SAS URI are located [Set up a blob storage account](azure-stack-vaas-set-up-account.md). |


## Next steps

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).
