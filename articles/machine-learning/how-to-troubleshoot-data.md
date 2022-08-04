---
title: Troubleshoot data
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and resolve data access issues.
author: Man-MSFT
ms.author: mafong
ms.reviewer: nibaccam
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.date: 08/03/2022
ms.topic: troubleshooting
ms.custom: devx-track-python, mldata, references_regions, sdkv2
---

# Troubleshoot data access errors

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

In this guide, learn how to identify and resolve known issues in your automated machine learning experiments with the [Azure Machine Learning SDK](/python/api/overview/azure/ml/intro).

## Error Codes

Error codes are hierarchical, with `.` delimiters. The more segments there are, the more specific the error classification.

For example, if `A.B.C` you should refer to the `A.B.C` code, though both `A` and `A.B` error codes are applicable.

| Error code                                                                                                       | Explanation                                           | Resolution                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ScriptExecution.StreamAccess.Authentication                                                                      | The method of authentication to storage failed.       | Check your access - if a credentialled datastore is involved, ensure that the credential is valid. If identity access is used (credential is not there or a direct URI is used), then ensure that the user or compute identity has sufficient access. This is usually in the form of Storage Blob Data Reader or above RBAC. |
| ScriptExecution.DatabaseQuery                                                                                    | The SQL query provided was invalid                    | Check that the SQL is valid. query                                                                                                                                                                                                                                                                                           |
| ScriptExecution.StreamAccess.NotFound                                                                            | The specified file or folder path does not exist.     | Check the provided path for typos or if using a datastore, that the right datastore is used (including the datastore's account & container). Note that this is not an authentication issue.                                                                                                                                  |
| ScriptExecution.DatabaseConnection.Authentication                                                                | The method of authentication to SQL failed.           | Check your access - if a credentialled datastore is used, that the service principal or username/password combination is valid. If identity access, check that the user or compute identity is given SQL access.                                                                                                             |
| ScriptExecution.StreamAccess.Authentication.AzureIdentityAccessTokenResolution.FirewallSettingsResolutionFailure | The firewall settings do not permit this data access. | Check that your logged in session is within compatible network settings with the storage account, and if Workspace MSI is used, that that has Reader access to the storage account.                                                                                                                                          |
