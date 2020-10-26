---
title: Use customer-managed keys or BYOK
description: In this tutorial, use customer-managed keys or bring your own key (BYOK) with an Azure Media Services storage account.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: tutorial
ms.date: 10/18/2020
---

# Tutorial: Use customer-managed keys or BYOK with Media Services

With the 2020-05-01 API, you can use a customer-managed RSA key with an Azure Media Services account that has a system-managed identity. This tutorial includes a Postman collection and environment to send REST requests to Azure services. The services used are:

- Azure Active Directory (Azure AD) application registration for Postman
- Microsoft Graph API
- Azure Storage
- Azure Key Vault
- Azure Media Services

In this tutorial, you'll learn to use Postman to:

> [!div class="checklist"]
> - Get tokens for use with Azure services.
> - Create a resource group and a storage account.
> - Create a Media Services account with a system-managed identity.
> - Create a key vault for storing a customer-managed RSA key.
> - Update the Media Services account to use the RSA key with the storage account.
> - Use variables in Postman.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free/).

## Prerequisites

1. Register a service principal with the appropriate permissions.
1. Install [Postman](https://www.postman.com).
1. Download the Postman collection for this tutorial at [Azure Samples: media-services-customer-managed-keys-byok](https://github.com/Azure-Samples/media-services-customer-managed-keys-byok).

### Register a service principal with the needed permissions

1. [Create a service principal](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).
1. Go to [Option 2: Create a new application secret](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#authentication-two-options) to get the service principal secret.

   > [!IMPORTANT]
   >Copy and save the secret for later use. You can't access the secret after you leave the secret page in the portal.

1. Assign permissions to the service principal, as shown in the following screenshot:

   :::image type="complex" source="./media/tutorial-byok/service-principal-permissions-1.png" alt-text="Screenshot showing the permissions needed for the service principal.":::
   Permissions are listed by service, permission name, type, and then description. Azure Key Vault: user impersonation, delegated, full access to Azure Key Vault. Azure Service Management: user impersonation, delegated, access Azure Service Management as organization user. Azure Storage: user impersonation, delegated, access Azure Storage. Media services: user impersonation, delegated, access media services. Microsoft Graph: user.read, delegated, sign in and read user profile.
   :::image-end:::

### Install Postman

If you haven't already installed Postman for use with Azure, you can get it at [postman.com](https://www.postman.com/).

### Download and import the collection

Download the Postman collection for this tutorial at [Azure Samples: media-services-customer-managed-keys-byok](https://github.com/Azure-Samples/media-services-customer-managed-keys-byok).

## Install the Postman collection and environment

1. Run Postman.
1. Select **Import**.
1. Select **Upload files**.
1. Go to where you saved the collection and environment files.
1. Select the collection and environment files.
1. Select **Open**. A warning appears that says the files won't be imported as an API, but as collections. This warning is fine. It's what you want.

The collection now shows in your collections as BYOK. Also, the environment variables appear in your environments.

### Understand the REST API requests in the collection

The collection provides the following REST API requests.

> [!NOTE]
>
>- The requests must be sent in the sequence provided.
>- Most requests have test scripts that dynamically create global variables for the next request in the sequence.
>- You don't need to manually create global variables.

In Postman, you'll see these variables contained within brackets. For example, `{{bearerToken}}`.

1. Get an Azure AD token: The test sets the global variable **bearerToken**.
2. Get a Microsoft Graph token: The test sets the global variable **graphToken**.
3. Get service principal details: The test sets the global variable **servicePrincipalObjectId**.
4. Create a storage account: The test sets the global variable **storageAccountId**.
5. Create a Media Services account with a system-managed identity: The test sets the global variable **principalId**.
6. Create a key vault to grant access to the service principal: The test sets the global variable **keyVaultId**.
7. Get a Key Vault token: The test sets the global variable **keyVaultToken**.
8. Create the RSA key in the key vault: The test sets the global variable **keyId**.
9. Update the Media Services account to use the key with the storage account: There's no test script for this request.

## Define environment variables

1. Select the environment's drop-down list to switch to the environment you downloaded.
1. Establish your environment variables in Postman. They're also used as variables contained within brackets. For example, `{{tenantId}}`.

    - **tenantId**: Your tenant ID.
    - **servicePrincipalId**: The ID of the service principal you establish with your favorite method, such as portal or CLI.
    - **servicePrincipalSecret**: The secret created for the service principal.
    - **subscription**: Your subscription ID.
    - **storageName**: The name you want to give to your storage.
    - **accountName**: The Media Services account name you want to use.
    - **keyVaultName**: The key vault name you want to use.
    - **resourceLocation**: The location **CentralUs** or where you want to put your resources. This collection has only been tested with **CentralUs**.
    - **resourceGroup**: The resource group name.

    The following variables are standard for working with Azure resources. So, there's no need to change them.

    - **armResource**: `https://management.core.windows.net`
    - **graphResource**: `https://graph.windows.net/`
    - **keyVaultResource**: `https://vault.azure.net`
    - **armEndpoint**: `management.azure.com`
    - **graphEndpoint**: `graph.windows.net`
    - **aadEndpoint**: `login.microsoftonline.com`
    - **keyVaultDomainSuffix**: `vault.azure.net`

## Send the requests

After you define your environment variables, you can run the requests one at a time in the previous sequence. Or, you can use Postman's runner to run the collection.

## Change the key

Media Services automatically detects when the key is changed. Create another key version for the same key to test this process. Media Services should detect the key in less than 15 minutes.

## Clean up resources

If you're not going to continue to use the resources that you created and *you don't want to continue to be billed*, delete them.

## Next steps

Go to the next article to learn how to:
> [!div class="nextstepaction"]
> [Encode a remote file based on URL and stream the video with REST](stream-files-tutorial-with-rest.md)
