---
title: Encrypt Your Application Source at Rest
description: Learn how to encrypt your application data in Azure Storage and deploy it as a package file.
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 03/31/2026
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
# customer intent: As a developer, I want to encrypt my application data in Azure Storage to help protect it from unauthorized access. 

---

# Encrypt data at rest by using customer-managed keys

Encrypting your web app's application data at rest requires an Azure Storage account and Azure Key Vault. These services are used when you run your app from a deployment package.

  - [Azure Storage provides encryption at rest](../storage/common/storage-service-encryption.md). You can use system-provided keys or your own customer-managed keys. Azure Storage is where your application data is stored when it's not running in a web app in Azure.
  - [Running from a deployment package](deploy-run-package.md) is a deployment feature of App Service. It enables you to deploy your site content from an Azure Storage account by using a shared access signature (SAS) URL.
  - [Key Vault references](app-service-key-vault-references.md) is a security feature of App Service. It enables you to import secrets at runtime as application settings. Use this feature to encrypt the SAS URL of your Azure Storage account.

## Set up encryption at rest

### Create an Azure Storage account

Start by creating a storage account. 

1. [Create an Azure Storage account](../storage/common/storage-account-create.md) and [encrypt it with customer-managed keys](../storage/common/customer-managed-keys-overview.md). After the storage account is created, use [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload package files.

1. Use Storage Explorer to [generate an SAS](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows#generate-a-sas-in-storage-explorer) for the package files. 

> [!NOTE]
> Save this SAS URL. You use it later to enable secure access of the deployment package at runtime.

### Configure running from a package from your storage account
  
After you upload your file to Blob Storage and have an SAS URL for the file, set the `WEBSITE_RUN_FROM_PACKAGE` application setting to the SAS URL. The following example configures this setting by using Azure CLI:

```
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_RUN_FROM_PACKAGE="<your-SAS-URL>"
```

Adding this application setting causes your web app to restart. After the app restarts, browse to it and make sure that the app started correctly with the deployment package. If the application didn't start correctly, see the [Run from package troubleshooting guide](deploy-run-package.md#troubleshooting).

### Encrypt the application setting by using Key Vault references

You can now replace the value of the `WEBSITE_RUN_FROM_PACKAGE` application setting with a Key Vault reference to the SAS-encoded URL. Doing so keeps the SAS URL encrypted in Key Vault to provide an extra layer of security.

1. Use the following [`az keyvault create`](/cli/azure/keyvault#az-keyvault-create) command to create a Key Vault instance.       

    ```azurecli    
    az keyvault create --name "Contoso-Vault" --resource-group <group-name> --location eastus    
    ```    

1. Follow [these instructions to grant your app access](app-service-key-vault-references.md#grant-your-app-access-to-a-key-vault) to your key vault:

   1. Use the following [`az keyvault secret set`](/cli/azure/keyvault/secret#az-keyvault-secret-set) command to add your external URL as a secret in your key vault:   

       ```azurecli    
       az keyvault secret set --vault-name "Contoso-Vault" --name "external-url" --value "<SAS-URL>"    
       ```    

   1.  Use the following [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command to create the `WEBSITE_RUN_FROM_PACKAGE` application setting with the value as a Key Vault reference to the external URL:

       ```azurecli    
       az webapp config appsettings set --settings WEBSITE_RUN_FROM_PACKAGE="@Microsoft.KeyVault(SecretUri=https://Contoso-Vault.vault.azure.net/secrets/external-url/<secret-version>"    
       ```

    The `<secret-version>` is in the output of the preceding `az keyvault secret set` command.

Updating this application setting causes your web app to restart. After the app restarts, browse to it make sure it started correctly with the Key Vault reference.

## How to rotate the access token

It's best practice to periodically rotate the SAS key of your storage account. To ensure the web app doesn't lose access, you must also update the SAS URL in Key Vault.

1. Rotate the SAS key by going to your storage account in the Azure portal. Under **Security + Networking** > **Access keys**, select the icon to rotate the SAS key.

1. Copy the new SAS URL, and use the following command to set the updated SAS URL in your key vault:

    ```azurecli    
    az keyvault secret set --vault-name "Contoso-Vault" --name "external-url" --value "<SAS-URL>"    
    ``` 

1. Update the key vault reference in your application setting to the new secret version:

    ```azurecli    
    az webapp config appsettings set --settings WEBSITE_RUN_FROM_PACKAGE="@Microsoft.KeyVault(SecretUri=https://Contoso-Vault.vault.azure.net/secrets/external-url/<secret-version>"    
    ```

    The `<secret-version>` is in the output of the preceding `az keyvault secret set` command.

## How to revoke the web app's data access

There are two methods for revoking the web app's access to the storage account. 

### Rotate the SAS key for the Azure Storage account

If the SAS key for the storage account is rotated, the web app will no longer have access to the storage account, but it will continue to run with the last downloaded version of the package file. Restart the web app to clear the last downloaded version.

### Remove the web app's access to Key Vault

You can revoke the web app's access to the site data by disabling the web app's access to Key Vault. To disable this access, remove the role assignment or access policy for the web app's identity. This identity is the one you created when you set up encryption.

## Summary

Your application files are now encrypted at rest in your storage account. When your web app starts, it retrieves the SAS URL from your key vault. Finally, the web app loads the application files from the storage account. 

If you need to revoke the web app's access to your storage account, you can either revoke access to the key vault or rotate the storage account keys. Both of these actions invalidate the SAS URL.

## Frequently asked questions

### Is there any extra charge for running my web app from the deployment package?

Only the cost associated with the Azure Storage account and any applicable egress charges.

### How does running from the deployment package affect my web app?

- Running your app from the deployment package makes `wwwroot/` read-only. Your app receives an error when it attempts to write to this directory.
- TAR and gzip formats aren't supported.
- This feature isn't compatible with local cache.

## Related content

- [Key Vault references for App Service](app-service-key-vault-references.md)
- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)