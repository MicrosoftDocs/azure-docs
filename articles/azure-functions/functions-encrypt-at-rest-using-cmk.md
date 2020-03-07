---
title: Configure customer-managed keys for encrypting your application source at rest
description: Encrypt your application data in Azure Storage and deploy using Run From Package.
ms.topic: article
ms.date: 03/06/2020
---

## Core components

Encrypting your Webapp's application data at rest requires the use of an Azure Storage Account and Azure Key Vault.

  - [Azure Storage provides Encryption at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption). You can use system-provided keys your customer managed keys. This is where your application data will be stored when it is not running in an Azure Webapp.
  - [Run From Package]((https://docs.microsoft.com/azure/app-service/deploy-run-package)) is a deployment feature of App Service. It allows you to deploy your site content from an Azure Storage Account
      - This requires an application setting with your Azure Storage Account URI and SAS key
  - [Key Vault References]() are a security feature of App Service. It allows you to import secrets at runtime. This will be used to encrypt the SAS-encoded URI of your Azure Storage Account.

## Configure Encryption at Rest

### Create an Azure Storage account. 
  
  - Follow these instructions to create an Azure Storage Account and encrypt it with Customer Managed Keys.
  - https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption#customer-managed-keys-with-azure-key-vault

### Configure Run From Package with your storage account
  
  -  Add the App Setting as shown here: https://docs.microsoft.com/en-us/azure/app-service/deploy-run-package#run-from-external-url-instead
  - Test that this deploys correctly

### Encrypt the application setting using Key Vault References
  - Now we will replace the App Setting with a Key Vault reference to secure the SAS-encoded URI 
  - https://docs.microsoft.com/en-us/azure/app-service/app-service-key-vault-references

## Summary

  - Overview of what we accomplished
  - If you want to revoke access to your data, you can either revoke access to the Key Vault or rotate storage account keys (which would invalidate SAS URI)

## Frequently Asked Questions

### Is there any additional charge for using Run From Package?

Only the cost associated with the Azure Storage Account and any applicable egress charges.

### How does Run From Package affect my Webapp?

- Using Run From Package makes `wwwroot/` read-only. Your app will receive an error if it attempts to write to this directory.
- TAR and GZIP formats are not supported.
- This feature is not compatible with local cache.

## Next steps

- [Key Vault references for App Service](app-service-key-vault-references.md)
- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
