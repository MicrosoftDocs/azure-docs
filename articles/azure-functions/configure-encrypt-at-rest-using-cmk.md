---
title: Encrypt your application source at rest
description: Encrypt your application data in Azure Storage and deploy it as a package file.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/06/2020
---

# Encrypt your application data at rest using customer-managed keys

Encrypting your function app's application data at rest requires an Azure Storage Account and an Azure Key Vault. These services are used when you run your app from a deployment package.

  - [Azure Storage provides encryption at rest](../storage/common/storage-service-encryption.md). You can use system-provided keys or your own, customer-managed keys. This is where your application data is stored when it's not running in a function app in Azure.
  - [Running from a deployment package](run-functions-from-deployment-package.md) is a deployment feature of App Service. It allows you to deploy your site content from an Azure Storage Account using a Shared Access Signature (SAS) URL.
  - [Key Vault references](../app-service/app-service-key-vault-references.md) are a security feature of App Service. It allows you to import secrets at runtime as application settings. Use this to encrypt the SAS URL of your Azure Storage Account.

## Set up encryption at rest

### Create an Azure Storage account

First, [create an Azure Storage account](../storage/common/storage-account-create.md) and [encrypt it with customer managed keys](../storage/common/customer-managed-keys-overview.md). Once the storage account is created, use the [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload package files.

Next, use the Storage Explorer to [generate an SAS](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows#generate-a-sas-in-storage-explorer). 

> [!NOTE]
> Save this SAS URL, this is used later to enable secure access of the deployment package at runtime.

### Configure running from a package from your storage account
  
Once you upload your file to Blob storage and have an SAS URL for the file, set the `WEBSITE_RUN_FROM_PACKAGE` application setting to the SAS URL. The following example does it by using Azure CLI:

```
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_RUN_FROM_PACKAGE="<your-SAS-URL>"
```

Adding this application setting causes your function app to restart. After the app has restarted, browse to it and make sure that the app has started correctly using the deployment package. If the application didn't start correctly, see the [Run from package troubleshooting guide](run-functions-from-deployment-package.md#troubleshooting).

### Encrypt the application setting using Key Vault references

Now you can replace the value of the `WEBSITE_RUN_FROM_PACKAGE` application setting with a Key Vault reference to the SAS-encoded URL. This keeps the SAS URL encrypted in Key Vault, which provides an extra layer of security.

1. Use the following [`az keyvault create`](/cli/azure/keyvault#az-keyvault-create) command to create a Key Vault instance.       

    ```azurecli    
    az keyvault create --name "Contoso-Vault" --resource-group <group-name> --location eastus    
    ```    

1. Follow [these instructions to grant your app access](../app-service/app-service-key-vault-references.md#grant-your-app-access-to-a-key-vault) to your key vault:

1. Use the following [`az keyvault secret set`](/cli/azure/keyvault/secret#az-keyvault-secret-set) command to add your external URL as a secret in your key vault:   

    ```azurecli    
    az keyvault secret set --vault-name "Contoso-Vault" --name "external-url" --value "<SAS-URL>"    
    ```    

1.  Use the following [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command to create the `WEBSITE_RUN_FROM_PACKAGE` application setting with the value as a Key Vault reference to the external URL:

    ```azurecli    
    az webapp config appsettings set --settings WEBSITE_RUN_FROM_PACKAGE="@Microsoft.KeyVault(SecretUri=https://Contoso-Vault.vault.azure.net/secrets/external-url/<secret-version>"    
    ```

    The `<secret-version>` will be in the output of the previous `az keyvault secret set` command.

Updating this application setting causes your function app to restart. After the app has restarted, browse to it make sure it has started correctly using the Key Vault reference.

## How to rotate the access token

It is best practice to periodically rotate the SAS key of your storage account. To ensure the function app does not inadvertently lose access, you must also update the SAS URL in Key Vault.

1. Rotate the SAS key by navigating to your storage account in the Azure portal. Under **Settings** > **Access keys**, select the icon to rotate the SAS key.

1. Copy the new SAS URL, and use the following command to set the updated SAS URL in your key vault:

    ```azurecli    
    az keyvault secret set --vault-name "Contoso-Vault" --name "external-url" --value "<SAS-URL>"    
    ``` 

1. Update the key vault reference in your application setting to the new secret version:

    ```azurecli    
    az webapp config appsettings set --settings WEBSITE_RUN_FROM_PACKAGE="@Microsoft.KeyVault(SecretUri=https://Contoso-Vault.vault.azure.net/secrets/external-url/<secret-version>"    
    ```

    The `<secret-version>` will be in the output of the previous `az keyvault secret set` command.

## How to revoke the function app's data access

There are two methods to revoke the function app's access to the storage account. 

### Rotate the SAS key for the Azure Storage account

If the SAS key for the storage account is rotated, the function app will no longer have access to the storage account, but it will continue to run with the last downloaded version of the package file. Restart the function app to clear the last downloaded version.

### Remove the function app's access to Key Vault

You can revoke the function app's access to the site data by disabling the function app's access to Key Vault. To do this, remove the access policy for the function app's identity. This is the same identity you created earlier while configuring key vault references.

## Summary

Your application files are now encrypted at rest in your storage account. When your function app starts, it retrieves the SAS URL from your key vault. Finally, the function app loads the application files from the storage account. 

If you need to revoke the function app's access to your storage account, you can either revoke access to the key vault or rotate the storage account keys, both of which invalidate the SAS URL.

## Frequently Asked Questions

### Is there any additional charge for running my function app from the deployment package?

Only the cost associated with the Azure Storage Account and any applicable egress charges.

### How does running from the deployment package affect my function app?

- Running your app from the deployment package makes `wwwroot/` read-only. Your app receives an error when it attempts to write to this directory.
- TAR and GZIP formats are not supported.
- This feature is not compatible with local cache.

## Next steps

- [Key Vault references for App Service](../app-service/app-service-key-vault-references.md)
- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
