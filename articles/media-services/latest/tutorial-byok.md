---
title: Using customer-managed keys or BYOK
description: This is a tutorial for using customer managed keys or bring your own key (BYOK) with an Azure Media Services storage account.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: tutorial
ms.date: 10/18/2020
---

# Tutorial: Use customer-managed keys or bring your own key (BYOK) with Media Services

With the 2020-05-01 API, you can use a customer managed RSA key with an Azure Media Services account that has a system managed identity. This tutorial includes a Postman collection and environment to send REST requests to Azure services. The services used are:

- Azure Active Directory (Azure AD) application registration for Postman
- Microsoft Graph API
- Azure Storage
- Azure Key Vault
- Media Services

In this tutorial, you'll learn to use Postman to:

> [!div class="checklist"]
> - Get tokens for use with Azure services.
> - Create a resource group and a storage account.
> - Create a Media Services account with a system managed identity.
> - Create a Key Vault for storing a customer-managed RSA key.
> - Update the Media Services account to use the RSA key with the storage account.
> - Use variables in Postman.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free/).

## Prerequisites

- Register a service principal with the appropriate permissions.
- Install [Postman](https://www.postman.com).
- Download the Postman collection for this tutorial at [Azure Samples: media-services-customer-managed-keys-byok](https://github.com/Azure-Samples/media-services-customer-managed-keys-byok)

### Register a service principal with the needed permissions

[Create a service principal](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal). Get the service principal secret at: [Option Two](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#authentication-two-options).

> [!IMPORTANT]
    >Save the secret somewhere. The secret can't be accessed after you leave the secret page in the portal.

The service principal needs the following permissions to perform the tasks in this tutorial:

![Screenshot showing the permissions needed for the service principal.](./media/tutorial-byok/service-principal-permissions-1.png)

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
1. Select **Open**. A warning appears that says the files won't be imported as an API, but as collections. This is expected.

The collection now shows in your Collections as BYOK. Also, the environment variables now appear in your Environments.

### Understand the REST API requests in the collection

The collection provides the following REST API requests. The requests must be sent in the sequence provided. Most requests have test scripts that dynamically create global variables for the next request in the sequence. It isn't necessary to manually create the global variables.

In Postman, you'll see these variables contained within brackets. For example, `{{bearerToken}}`.

1. Get an Azure AD token: The test sets the global variable **bearerToken**.
2. Get a Graph token: The test sets the global variable **graphToken**.
3. Get Service Principal Details: The test sets the global variable **servicePrincipalObjectId**.
4. Create a storage account: The test sets the global variable **storageAccountId**.
5. Create a Media Services Account with a system managed identity: The test sets the global variable **principalId**.
6. Create a Key Vault to grant access to the service principal: The test sets the global variable **keyVaultId**.
7. Get a Key Vault token: The test sets global variable **keyVaultToken**.
8. Create the RSA key in the key vault: The test sets global variable **keyId**.
9. Update the Media Services account to use the key with the storage account: There is no test script for this request.

## Define environment variables

1. Select the environment's drop-down list to switch to the environment you downloaded.
1. Establish your environment variables in Postman. They're also used as variables contained within brackets. For example, `{{tenantId}}`.

    - **tenantId**: Your tenant ID.
    - **servicePrincipalId**: The ID of the service principal you establish with your favorite method. Such as, portal, CLI, and so on.
    - **servicePrincipalSecret**: The secret created for the service principal.
    - **subscription**: Your subscription ID.
    - **storageName**: The name you want to give to your storage.
    - **accountName**: The Media Service account name you want to use.
    - **keyVaultName**: The Key Vault name you want to use.
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

Once you define your environment variables, you can run the requests one at a time in the previous sequence. Or, you can use Postman's runner to run the collection.

## Change the key

Media Services automatically detects when the key is changed. Create another key version for the same key to test this. Media Services should detect this key in less than 15 minutes.

## Clean up resources

If you're not going to continue to use the resources that you created and **you don't want to continue to be billed**, delete them.

## Next steps

Go to the next article to learn how to:
> [!div class="nextstepaction"]
> [Encode a remote file based on URL and stream the video with REST](stream-files-tutorial-with-rest.md)
