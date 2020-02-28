---
title: Data encryption for Azure Database for MySQL troubleshooting
description: Learn how to troubleshoot the data encryption for your Azure Database for MySQL
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 02/13/2020
---

# Troubleshooting data encryption with customer-managed keys in Azure Database for MySQL

This article describes how to identify and resolve common issues that can occur on an Azure Database for MySQL configured with data encryption using a customer-managed key.

## Introduction

When you configure data encryption to use a customer-managed key in Azure Key Vault, servers require continuous access to the key. If the server loses access to the customer-managed key in Azure Key Vault, it will deny all connections, return the appropriate error message, and change its state to ***Inaccessible*** in the Azure portal.

If you no longer need an inaccessible Azure Database for MySQL server, you can delete it to stop incurring costs. No other actions on the server are permitted until access to the Azure Key Vault has been restored and the server is available. It's also not possible to change the data encryption option from `Yes`(customer-managed) to `No` (service-managed) on an inaccessible server when it's encrypted with a customer-managed key. You'll have to revalidate the key manually before the server is accessible again. This action is necessary to protect the data from unauthorized access while permissions to the customer-managed key are revoked.

## Common errors that cause the server to become inaccessible

Most issues that occur when you use data encryption with Azure Key Vault are caused by one of the following misconfigurations:

The key vault is unavailable or doesn't exist

* The key vault was accidentally deleted.
* An intermittent network error causes the key vault to be unavailable.

No permissions to access the key vault or the key doesn't exist

* The key was accidentally deleted, disabled or the key expired.
* The Azure Database for MySQL instance-managed identity was accidentally deleted.
* Permissions granted to the Azure Database for MySQL server managed identity for the keys aren't sufficient (they don't include Get, Wrap, and Unwrap).
* Permissions for the Azure Database for MySQL server instance-managed identity were revoked.

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

[Set up data encryption with a customer-managed key for your Azure database for MySQL by using the Azure portal](howto-data-encryption-portal.md).
