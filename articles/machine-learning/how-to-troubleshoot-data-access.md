---
title: Troubleshoot data access
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

Data access error codes are hierarchical. Error codes are delimited by the full stop character `.` and are more specific the more segments there are.

## ScriptExecution.DatabaseConnection

### ScriptExecution.DatabaseConnection.NotFound

The database or server defined in the datastore couldn't be found or no longer exists. Check if the database still exists in Azure portal or linked to from the Azure Machine Learning studio datastore details page. If it doesn't exist, recreating it with the same name will enable the existing datastore to be used. If a new server name or database is used, the datastore will have to be deleted, and recreated to use the new name.

### ScriptExecution.DatabaseConnection.Authentication

The authentication failed while trying to connect to the database. The authentication method is stored inside the datastore and supports SQL authentication, service principal, or no stored credential (identity based access). Enabling workspace MSI makes the authentication use the workspace MSI when previewing data in Azure Machine Learning studio. A SQL server user needs to be created for the service principal and workspace MSI (if applicable) and granted classic database permissions. More info can be found [here](/azure/azure-sql/database/authentication-aad-service-principal-tutorial#create-the-service-principal-user-in-azure-sql-database).

Contact your data admin to verify or add the correct permissions to the service principal or user identity.

Errors also include:

- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.InvalidResource
  - The server under the subscription and resource group couldn't be found. Check that the subscription ID and resource group defined in the datastore matches that of the server and update the values if needed.
    > [!NOTE]
    > Use the subscription ID and resource group of the server and not of the workspace. If the datastore is cross subscription or cross resource group server, these will be different.
- ScriptExecution.DatabaseConnection.Authentication.AzureIdentityAccessTokenResolution.FirewallSettingsResolutionFailure
  - The identity doesn't have permission to read firewall settings of the target server. Contact your data admin to the Reader role to the workspace MSI.

## ScriptExecution.DatabaseQuery

### ScriptExecution.DatabaseQuery.TimeoutExpired

The executed SQL query took too long and timed out. The timeout can be specified at time of data asset creation. If a new timeout is needed, a new asset must be created, or a new version of the current asset must be created. In Azure Machine Learning studio SQL preview, there will have a fixed query timeout, but the defined value will always be honored for jobs.

## ScriptExecution.StreamAccess

### ScriptExecution.StreamAccess.Authentication

The authentication failed while trying to connect to the storage account. The authentication method is stored inside the datastore and depending on the datastore type, can support account key, SAS token, service principal or no stored credential (identity based access). Enabling workspace MSI makes the authentication use the workspace MSI when previewing data in Azure Machine Learning studio.

Contact your data admin to verify or add the correct permissions to the service principal or user identity.

> [!IMPORTANT]
> If identity based access is used, the required RBAC role is Storage Blob Data Reader. If workspace MSI is used for Azure Machine Learning studio preview, the required RBAC roles are Storage Blob Data Reader and Reader.

Errors also include:

- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.FirewallSettingsResolutionFailure
  - The identity doesn't have permission to read firewall settings of the target storage account. Contact your data admin to the Reader role to the workspace MSI.
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.PrivateEndpointResolutionFailure
  - The target storage account is using a virtual network but the logged in session isn't connecting to the workspace via a private endpoint. Add a private endpoint to the workspace and ensure that the virtual network or subnet of the private endpoint is allowed by the storage virtual network settings. Add the logged in session's public IP to the storage firewall allowlist.
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.NetworkIsolationViolated
  - The target storage account's firewall settings don't permit this data access. Check that your logged in session is within compatible network settings with the storage account. If Workspace MSI is used, check that it has Reader access to the storage account and to the private endpoints associated with the storage account.
- ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.InvalidResource
  - The storage account under the subscription and resource group couldn't be found. Check that the subscription ID and resource group defined in the datastore matches that of the storage account and update the values if needed.
    > [!NOTE]
    > Use the subscription ID and resource group of the server and not of the workspace. If the datastore is cross subscription or cross resource group server, these will be different.

### ScriptExecution.StreamAccess.NotFound

The specified file or folder path doesn't exist. Check that the provided path exists in Azure portal or if using a datastore, that the right datastore is used (including the datastore's account and container). If the storage account is an HNS enabled Blob storage, otherwise known as ADLS Gen2, or an `abfs[s]` URI, that storage ACLs may restrict particular folders or paths. This error will appear as a "NotFound" error instead of an "Authentication" error.

### ScriptExecution.StreamAccess.Validation

There were validation errors in the request for data access.

Errors also include:

- ScriptExecution.StreamAccess.Validation.TextFile-InvalidEncoding
  - The defined encoding for delimited file parsing isn't applicable for the underlying data. Update the encoding of the MLTable to match the encoding of the file(s).
- ScriptExecution.StreamAccess.Validation.StorageRequest-InvalidUri
  - The requested URI isn't well formatted. We support `abfs[s]`, `wasb[s]`, `https`, and `azureml` URIs.

## Next steps

- See more information on [data concepts in Azure Machine Learning](concept-data.md)

- [Identity-based data access to storage services on Azure](how-to-identity-based-data-access.md).

- [Read and write data in a job](how-to-read-write-data-v2.md)
