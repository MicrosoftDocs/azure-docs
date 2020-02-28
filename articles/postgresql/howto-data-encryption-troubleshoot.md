---
title: Data encryption for Azure Database for PostgreSQL - Single server troubleshooting
description: Learn how to troubleshoot the data encryption for your Azure Database for PostgreSQL - Single server
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 02/13/2020
---

# Troubleshooting data encryption with customer-managed keys in Azure Database for PostgreSQL - Single server

This article describes how to identify and resolve common issues/errors that occur on an Azure Database for PostgreSQL - Single server configured with Data Encryption using customer-managed key.

## Introduction

When data encryption is configured to use a customer-managed key in Azure Key Vault, continuous access to this key is required for the server to stay available. If the server loses access to the customer-managed key in Azure Key Vault, the server will start denying all connections with the appropriate error message and change its state to ***Inaccessible*** in the Azure portal.

If an inaccessible Azure Database for PostgreSQL - Single server is no longer needed, it can be deleted immediately to stop incurring costs. All other actions on the server are not permitted until access to the Azure key vault has been restored and the server is back available. Changing the data encryption option from ‘Yes’(customer-managed) to ‘No’ (service-managed) on an inaccessible the server is also not possible while a server is encrypted with customer-managed. You must revalidate the key manually to make the server back available. This is necessary to protect the data from unauthorized access while permissions to the customer-managed key have been revoked.

## Common errors causing server to become inaccessible

Most issues that occur when you use data encryption with Azure Key Vault are caused by one of the following misconfigurations-

The key vault is unavailable or doesn't exist

* The key vault was accidentally deleted.
* An intermittent network error causes the key vault to be unavailable.

No permissions to access the key vault or the key doesn't exist

* The key was accidentally deleted, disabled or the key expired.
* The Azure Database for PostgreSQL - Single server instance-managed identity was accidentally deleted.
* Permissions granted to the Azure Database for PostgreSQL managed identity for the keys aren't sufficient (they don't include Get, Wrap, and Unwrap).
* Permissions for the Azure Database for PostgreSQL Single server instance-managed identity were revoked or deleted.

## Identify and resolve common errors

### Errors on the key vault

#### Disabled key vault

* AzureKeyVaultKeyDisabledMessage
* **Explanation** : The operation could not be completed on server because the Azure Key Vault key is disabled.

#### Missing key vault permissions

* AzureKeyVaultMissingPermissionsMessage
* The server does not have the required Get, Wrap, and Unwrap permissions to the Azure Key Vault permissions. Grant any missing permissions to the service principal with ID.

### Mitigation

* Confirm that the customer-managed key is present in Key Vault:
* Identify the key vault, then go to the key vault in the Azure portal.
* Ensure that the key identified by the key URI is present.

## Next steps

[Set up data encryption with a customer-managed key for your Azure database for PostgreSQL by using the Azure portal](howto-data-encryption-portal.md).
