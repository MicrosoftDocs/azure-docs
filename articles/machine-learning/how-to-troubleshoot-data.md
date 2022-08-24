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

The database defined in the datastore cannot be found.

Check if the database still exists in Azure portal or linked to from the Azure Machine Learning Studio datastore details page.

### ScriptExecution.DatabaseConnection.Authentication

The method of authentication to SQL failed.

Check your access or contact your data admin - if a credentialled datastore is used, that the service principal or username/password combination is valid and given access. If identity access, check that the user or compute identity is given SQL access.

Errors also include:

- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.InvalidResource
- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.FirewallSettingsResolutionFailure

## ScriptExecution.DatabaseQuery

### ScriptExecution.DatabaseQuery.Unexpected

TBD

### ScriptExecution.DatabaseQuery.TimeoutExpired

The SQL query timed out.

The SQL took longer to run than the specified query timeout or the default. In case of Azure Machine Learning Studio SQL preview, there will have a fixed query timeout, but the data asset defined value will be honored for jobs.

## ScriptExecution.StreamAccess

### ScriptExecution.StreamAccess.Authentication

The method of authentication to storage failed.

Check your access or contact your data admin - if a credentialled datastore is involved, ensure that the credential is valid. If identity access is used (credential is not there or a direct URI is used), then ensure that the user or compute identity has sufficient access. This is usually in the form of Storage Blob Data Reader or above RBAC.

Errors also include:

- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.FirewallSettingsResolutionFailure
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.PrivateEndpointResolutionFailure
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.NetworkIsolationViolated
  - The firewall settings do not permit this data access. Check that your logged in session is within compatible network settings with the storage account, and if Workspace MSI is used, that that has Reader access to the storage account.
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.Unexpected
- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.InvalidResource

### ScriptExecution.StreamAccess.NotFound

The specified file or folder path does not exist.

Check the provided path for typos or if using a datastore, that the right datastore is used (including the datastore's account & container). Note that this is not an authentication issue.

### ScriptExecution.StreamAccess.Validation

Errors include:

- ScriptExecution.StreamAccess.Validation.TextFile-InvalidEncoding
- ScriptExecution.StreamAccess.Validation.StorageRequest-InvalidUri

## Next steps

- See more information on [data concepts in Azure Machine Learning](concept-data.md)

- [Identity-based data access to storage services on Azure](how-to-identity-based-data-access.md).

- [Read and write data in a job](how-to-read-write-data-v2.md)
