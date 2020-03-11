---
title: Encrypt your application source at rest
description: Encrypt your application data in Azure Storage and deploy it as a package file.
ms.topic: article
ms.date: 03/06/2020
---

# Encryption at rest using customer-managed keys

Encrypting your web app's application data at rest requires an Azure Storage Account and an Azure Key Vault. These services are used when you run your app from a deployment package.

  - [Azure Storage provides encryption at rest](../storage/common/storage-service-encryption.md). You can use system-provided keys or your own, customer-managed keys. This is where your application data is stored when it's not running in a web app in Azure.
  - [Running from a deployment package](deploy-run-package.md) is a deployment feature of App Service. It allows you to deploy your site content from an Azure Storage Account using a Shared Access Signature (SAS) URL.
  - [Key Vault references](app-service-key-vault-reference.md) are a security feature of App Service. It allows you to import secrets at runtime as application settings. Use this to encrypt the SAS URL of your Azure Storage Account.

## Create an Azure Storage account

First, [create an Azure Storage account](../storage/common/storage-account-create.md) and [encrypt it with customer managed keys](../storage/common/storage-service-encryption.md#customer-managed-keys-with-azure-key-vault). Once the storage account is created, use the [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload package files.

Next, use the Storage Explorer to [generate an SAS](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows#generate-a-sas-in-storage-explorer). 

> [!NOTE]
> Save this SAS URL, this is used later to enable secure access of the deployment package at runtime.

## Configure running from a package from your storage account
  
Once you upload your file to Blob storage and have an SAS URL for the file, set the `WEBSITE_RUN_FROM_PACKAGE` application setting to the SAS URL. The following example does it by using Azure CLI:

```
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_RUN_FROM_PACKAGE="<your-SAS-URL>"
```

Adding this application setting causes your web app to restart. After the app has restarted, browse to it and make sure that the app has started correctly using the deployment package. If the application didn't start correctly, see the [Run from package troubleshooting guide](deploy-run-package.md#troubleshooting).

## Encrypt the application setting using Key Vault references

Now you can replace the value of the `WEBSITE_RUN_FROM_PACKAGE` application setting with a Key Vault reference to the SAS-encoded URL. This keeps the SAS URL encrypted in Key Vault, which provides an extra layer of security.

1. Use the following [`az keyvault create`](/cli/azure/keyvault#az-keyvault-create) command to create a Key Vault instance.       

    ```azurecli    
    az keyvault create --name "Contoso-Vault" --resource-group <group-name> --location eastus    
    ```    

1. Follow [these instructions to grant your app access](app-service-key-vault-references.md#granting-your-app-access-to-key-vault) to your key vault:

1. Use the following [`az keyvault secret set`](/cli/azure/keyvault/secret#az-keyvault-secret-set) command to add your external URL as a secret in your key vault:   

    ```azurecli    
    az keyvault secret set --vault-name "Contoso-Vault" --name "external-url" --value "<SAS-URL>"    
    ```    

1.  Use the following [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command to create the `WEBSITE_RUN_FROM_PACKAGE` application setting with the value as a Key Vault reference to the external URL:

    ```azurecli    
    az webapp config appsettings set --settings WEBSITE_RUN_FROM_PACKAGE="@Microsoft.KeyVault(SecretUri=https://Contoso-Vault.vault.azure.net/secrets/external-url/<secret-version>"    
    ```

Updating this application setting causes your web app to restart. After the app has restarted, browse to it make sure it has started correctly using the Key Vault reference.

## Summary

Your application files are now encrypted at rest in your storage account. When your web app starts, it retrieves the SAS URL from your key vault. Finally, the web app loads the application files from storage. 

If you need to revoke the web app's access to your storage account, you can either revoke access to the key vault or rotate the storage account keys, which invalidates the SAS URL.

## Frequently Asked Questions

### Is there any additional charge for running my web app from the deployment package?

Only the cost associated with the Azure Storage Account and any applicable egress charges.

### What happens if the SAS token expires or rotates?

If the SAS URL is invalidated for any reason, the web app will continue to run with the last downloaded version of the package file. You must update the value of `WEBSITE_RUN_FROM_PACKAGE` with the new SAS URL for the web app to reestablish a connection to the storage account.

### How does running from the deployment package affect my web app?

- Running your app from the deployment package makes `wwwroot/` read-only. Your app receives an error when it attempts to write to this directory.
- TAR and GZIP formats are not supported.
- This feature is not compatible with local cache.

## Next steps

- [Key Vault references for App Service](app-service-key-vault-references.md)
- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
