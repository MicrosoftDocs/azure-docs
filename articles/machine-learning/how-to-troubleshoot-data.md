---
title: Troubleshoot data
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and resolve data access issues.
author: Man-MSFT
ms.author: mafong
ms.reviewer: ssalgado
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.date: 08/03/2022
ms.topic: troubleshooting
ms.custom: devx-track-python, mldata, references_regions, sdkv2
---

# Troubleshoot data access errors

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

In this guide, learn how to identify and resolve known issues with data access with the [Azure Machine Learning SDK](/python/api/overview/azure/ml/intro).

## Error Codes

Error codes are hierarchical, with `.` delimiters between segments. The more segments there are, the more specific the error classification.

## ScriptExecution.DatabaseConnection

### ScriptExecution.DatabaseConnection.NotFound

Issue: The database defined in the datastore cannot be found.

Mitigation: Check if the database still exists in Azure portal or linked to from the Azure Machine Learning Studio datastore details page.

### ScriptExecution.DatabaseConnection.Authentication

Issue: The method of authentication to SQL failed.

Mitigation Check your access or contact your data admin - if a datastore with credential is used, that the service principal or username/password combination is valid and given access. If identity access, check that the user or compute identity is given SQL access.

Errors also include:

- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.InvalidResource
- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.FirewallSettingsResolutionFailure

## ScriptExecution.DatabaseQuery

### ScriptExecution.DatabaseQuery.Unexpected

TBD

### ScriptExecution.DatabaseQuery.TimeoutExpired

Issue: The SQL query timed out. The SQL took longer to run than the specified query timeout or the default.

Mitigation: Increase the specified query timeout of the data asset. In case of Azure Machine Learning Studio SQL preview, there will have a fixed query timeout, but the data asset defined value will be honored for jobs.

## ScriptExecution.StreamAccess

### ScriptExecution.StreamAccess.Authentication

Issue: The method of authentication to storage failed.

Mitigation: Check your access or contact your data admin. If the data asset uses a datastore with credential, ensure that the credential is valid. If identity access is used (credential is not there or a direct URI is used), then ensure that the user or compute identity has sufficient access. The RBAC required is Reader and Storage Blob Data Reader or above.

Errors also include:

- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.FirewallSettingsResolutionFailure
  - Issue: The identity does not have permission to read firewall settings of the target storage account.
  - Mitigation: The workspace MSI or user identity needs to be assigned the Reader role.
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.PrivateEndpointResolutionFailure
  - Issue: The target storage account is using a virtual network but the logged in session is not connecting to the workspace via private endpoint.
  - Mitigation: Add a private endpoint to the workspace and ensure that the virtual network or subnet of the private endpoint is allowed by the storage virtual network settings. Add the user's public IP to the storage firewall whitelist.
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.NetworkIsolationViolated
  - Issue: The firewall settings do not permit this data access.
  - Mitigation: Check that your logged in session is within compatible network settings with the storage account, and if Workspace MSI is used, that that has Reader access to the storage account.
- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.InvalidResource
  - Issue: The storage account under the subscription and resource group could not be found.
  - Mitigation: Check the subscription ID and resource group defined in the datastore and update if needed. This may not be the same as the subscription ID or resource group of the workspace in case of a cross subscription or cross resource group storage account.
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.Unexpected

### ScriptExecution.StreamAccess.NotFound

The specified file or folder path does not exist.

Check the provided path for typos or if using a datastore, that the right datastore is used (including the datastore's account & container). In the case of an HSN enabled Blob storage, otherwise known as ADLS Gen2, or an `abfs[s]` URI, that storage ACLs may restrict particular folders or paths. This will appear as a "NotFound" error instead of an "Authentication" error.

### ScriptExecution.StreamAccess.Validation

Errors include:

- ScriptExecution.StreamAccess.Validation.TextFile-InvalidEncoding
- ScriptExecution.StreamAccess.Validation.StorageRequest-InvalidUri

## Next steps

- See more information on [data concepts in Azure Machine Learning](concept-data.md)

- [Identity-based data access to storage services on Azure](how-to-identity-based-data-access.md).

- [Read and write data in a job](how-to-read-write-data-v2.md)
