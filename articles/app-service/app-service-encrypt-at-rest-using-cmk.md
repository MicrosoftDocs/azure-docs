---
title: Configure customer-managed keys for encrypting your application source at rest
description: Encrypt your application data in Azure Storage and deploy using Run From Package.
ms.topic: article
ms.date: 03/06/2020
---

# Encryption at rest using customer-managed keys

Encrypting your Webapp's application data at rest requires an Azure Storage Account and an Azure Key Vault. These services will be used in conjunction with Run From Package.

  - [Azure Storage provides Encryption at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption). You can use system-provided keys or your own, customer-managed keys. This is where your application data will be stored when it is not running in an Azure Webapp.
  - [Run From Package]((https://docs.microsoft.com/azure/app-service/deploy-run-package)) is a deployment feature of App Service. It allows you to deploy your site content from an Azure Storage Account using a Shared Access Signature (SAS) URL.
  - [Key Vault References](https://docs.microsoft.com/azure/app-service/app-service-key-vault-reference) are a security feature of App Service. It allows you to import secrets at runtime as app settings. This will be used to encrypt the SAS URL of your Azure Storage Account.

## Create an Azure Storage account
  
First, follow [these instructions](https://docs.microsoft.com/azure/storage/common/storage-service-encryption#customer-managed-keys-with-azure-key-vault) to create an Azure Storage Account and encrypt it with Customer Managed Keys. Once the Storage Account is created, use the [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer) to upload package files. 

Next, use the Storage Explorer to [generate a Shared Access Signature](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows#generate-a-sas-in-storage-explorer) (SAS). Save this SAS URL, this will later be used to enable the App Service runtime to access the package securely.

## Configure Run From Package with your storage account
  
Once you upload your file to Blob storage and have an SAS URL for the file, set the `WEBSITE_RUN_FROM_PACKAGE` app setting to the SAS URL. The following example does it by using Azure CLI:

```
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_RUN_FROM_PACKAGE="<your-SAS-URL>"
```

Adding this app setting will cause your Webapp to restart. Once the Webapp has restarted, browse to it to ensure the application has correctly started with the package in the Storage Account. If the application does not start correctly, see the [Run From Package troubleshooting guide](https://docs.microsoft.com/azure/app-service/deploy-run-package#troubleshooting).

## Encrypt the application setting using Key Vault References

Now we will replace the value for `WEBSITE_RUN_FROM_PACKAGE` with a Key Vault reference to the SAS-encoded URL. This will keep the SAS URL encrypted in Key Vault, providing an extra layer of security.

1. Create an Azure Key Vault.    

    ```azurecli    
    az keyvault create --name "Contoso-Vault" --resource-group <group-name> --location eastus    
    ```    

1. Follow these instructions to [grant your app access](https://docs.microsoft.com/azure/app-service/app-service-key-vault-references#granting-your-app-access-to-key-vault) to Key Vault.

1. Add your external URL as a secret in Key Vault.    

    ```azurecli    
    az keyvault secret set --vault-name "Contoso-Vault" --name "external-url" --value "<SAS-URL>"    
    ```    

1. Create the `WEBSITE_RUN_FROM_PACKAGE` app setting and set the value as a Key Vault Reference to the external URL.

    ```azurecli    
    az webapp config appsettings set --settings WEBSITE_RUN_FROM_PACKAGE="@Microsoft.KeyVault(SecretUri=https://Contoso-Vault.vault.azure.net/secrets/external-url/<secret-version>"    
    ```

Updating this app setting will cause your Webapp to restart. Once the webapp has restarted, browse to it to ensure it has started correctly with the Key Vault reference.

## Summary

Your application files are now encrypted at rest in Azure Storage. When your Webapp starts, it wil retrieve the SAS URL from Azure Key Vault. Finally, the Webapp will load the application files from Azure Storage. 

If you want to revoke the Webapp's access to your data, you can either revoke access to the Key Vault or rotate the storage account keys, which will invalidate SAS URL.

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
