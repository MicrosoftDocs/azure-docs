---
title: Tutorial - Use Azure Key Vault with an Azure web app in .NET | Microsoft Docs
description: Tutorial - Configure an ASP.NET core application to read a secret from Key vault
services: key-vault
documentationcenter: 
author: prashanthyv
manager: rajvijan

ms.assetid: 0e57f5c7-6f5a-46b7-a18a-043da8ca0d83
ms.service: key-vault
ms.workload: identity
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: pryerram
ms.custom: mvc
#Customer intent: As a developer I want to use Azure Key vault to store secrets for my app, so that they are kept secure.
---
# Tutorial: Use Azure Key Vault with an Azure web app in .NET

Azure Key Vault helps you protect secrets such as API keys and database connection strings. It provides you with access to your applications, services, and IT resources.

In this tutorial, you learn how to create an Azure web application that can read information from an Azure key vault. The process uses managed identities for Azure resources. For more information about Azure web applications, see [Azure Web Apps](../app-service/app-service-web-overview.md).

The article shows you how to:

> [!div class="checklist"]
> * Create a key vault.
> * Store a secret in the key vault.
> * Retrieve a secret from the key vault.
> * Create an Azure web application.
> * Enable a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the web app.
> * Grant the required permissions for the web application to read data from the key vault.
> * Run the web application on Azure.

Before proceeding, read [Key Vault basic concepts](key-vault-whatis.md#basic-concepts).

## Prerequisites

* On Windows:
  * [.NET Core 2.1 SDK or later](https://www.microsoft.com/net/download/windows)

* On Mac:
  * [Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/)

* All platforms:
  * [Git](https://git-scm.com/downloads)
  * An Azure subscription <br />(If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.)
  * [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.4 or later, available for Windows, Mac, and Linux
  * [.NET Core](https://www.microsoft.com/net/download/dotnet-core/2.1)

## Managed Service Identity and how it works

Azure Key Vault stores credentials securely so they aren’t in your code. However, you need to authenticate to Azure Key Vault to retrieve your keys. To authenticate to Key Vault, you need a credential. It's a classic bootstrap dilemma. Managed Service Identity (MSI) solves this issue by providing a _bootstrap identity_ that simplifies the process.

When you enable MSI for an Azure service (for example: Virtual Machines, App Service, or Functions), Azure creates a [Service Principal](key-vault-whatis.md#basic-concepts). MSI does this for the instance of the service in Azure Active Directory (Azure AD) and injects the credentials for the Service Principal into that instance.

![MSI diagram](media/MSI.png)

Next, your code calls a local metadata service available on the Azure resource to get an access token. Your code uses the access token it gets from the local MSI_ENDPOINT to authenticate to an Azure Key Vault service.

## Sign in to Azure

To sign in to Azure by using the Azure CLI, enter:

```azurecli
az login
```

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

1. Create a resource group by using the [az group create](/cli/azure/group#az-group-create) command.
1. Select a resource group name and fill in the placeholder. The following example creates a resource group in the West US location:

   ```azurecli
   # To list locations: az account list-locations --output table
   az group create --name "<YourResourceGroupName>" --location "West US"
   ```

You use this resource group throughout this tutorial.

## Create a key vault

To create a key vault in your resource group, provide the following information:

* Key vault name: a string of 3 to 24 characters that can contain only numbers, letters, and hyphens (for example: 0-9, a-z, A-Z, and - )
* Resource group name
* Location: **West US**

Enter the following command in the Azure CLI:

```azurecli
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "West US"
```

At this point, your Azure account is the only one that's authorized to perform any operations on this new vault.

## Add a secret to the key vault

Now you can add a secret. It might be a SQL connection string or any other information that you need to keep both secure and available to your application.

Type the following command to create a secret in the key vault called **AppSecret**. This secret stores the value **MySecret**.

```azurecli
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

To view the value contained in the secret as plain text, enter the following command:

```azurecli
az keyvault secret show --name "AppSecret" --vault-name "<YourKeyVaultName>"
```

This command shows the secret information, including the URI. After you complete these steps, you should have a URI to a secret in a key vault. Make note of this information. You'll need it in a later step.

## Create a .NET Core web app

Follow this [tutorial](../app-service/app-service-web-get-started-dotnet.md) to create a .NET Core web app and **publish** it to Azure. You can also watch the following video:

>[!VIDEO https://www.youtube.com/embed/EdiiEH7P-bU]

## Open and edit the solution

1. Browse to the **Pages** > **About.cshtml.cs** file.
2. Install these NuGet packages:
   - [AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication)
   - [KeyVault](https://www.nuget.org/packages/Microsoft.Azure.KeyVault)
3. Import the following code in the About.cshtml.cs file:

   ```
    using Microsoft.Azure.KeyVault;
    using Microsoft.Azure.KeyVault.Models;
    using Microsoft.Azure.Services.AppAuthentication;
   ```

4. Your code in the AboutModel class should like this:

   ```
    public class AboutModel : PageModel
    {
        public string Message { get; set; }

        public async Task OnGetAsync()
        {
            Message = "Your application description page.";
            int retries = 0;
            bool retry = false;
            try
            {
                /* The below 4 lines of code shows you how to use AppAuthentication library to fetch secrets from your Key Vault*/
                AzureServiceTokenProvider azureServiceTokenProvider = new AzureServiceTokenProvider();
                KeyVaultClient keyVaultClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));
                var secret = await keyVaultClient.GetSecretAsync("https://<YourKeyVaultName>.vault.azure.net/secrets/AppSecret")
                        .ConfigureAwait(false);
                Message = secret.Value;

                /* The below do while logic is to handle throttling errors thrown by Azure Key Vault. It shows how to do exponential backoff which is the recommended client side throttling*/
                do
                {
                    long waitTime = Math.Min(getWaitTime(retries), 2000000);
                    secret = await keyVaultClient.GetSecretAsync("https://<YourKeyVaultName>.vault.azure.net/secrets/AppSecret")
                        .ConfigureAwait(false);
                    retry = false;
                } 
                while(retry && (retries++ < 10));
            }
            /// <exception cref="KeyVaultErrorException">
            /// Thrown when the operation returned an invalid status code
            /// </exception>
            catch (KeyVaultErrorException keyVaultException)
            {
                Message = keyVaultException.Message;
                if((int)keyVaultException.Response.StatusCode == 429)
                    retry = true;
            }
        }

        // This method implements exponential backoff incase of 429 errors from Azure Key Vault
        private static long getWaitTime(int retryCount)
        {
            long waitTime = ((long)Math.Pow(2, retryCount) * 100L);
            return waitTime;
        }

        // This method fetches a token from Azure Active Directory which can then be provided to Azure Key Vault to authenticate
        public async Task<string> GetAccessTokenAsync()
        {
            var azureServiceTokenProvider = new AzureServiceTokenProvider();
            string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync("https://vault.azure.net");
            return accessToken;
        }
    }
    ```

## Run the app

1. From the main menu of Visual Studio 2017, select **Debug** > **Start** with or without debugging. 
1. When the browser appears, go to the **About** page.
1. The value for **AppSecret** is displayed.

## Enable a managed identity for the web app

Azure Key Vault provides a way to securely store credentials and other secrets, but your code needs to authenticate to Key Vault to retrieve them. [Managed identities for Azure resources overview](../active-directory/managed-identities-azure-resources/overview.md) helps to solve this problem by giving Azure services an automatically managed identity in Azure AD. You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

1. In the Azure CLI, run the assign-identity command to create the identity for this application:

   ```azurecli

   az webapp identity assign --name "<YourAppName>" --resource-group "<YourResourceGroupName>"

   ```

   >[!NOTE]
   >You have to replace \<YourAppName\> with the name of the published app on Azure. For example, if your published app name was **MyAwesomeapp.azurewebsites.net**, replace \<YourAppName\> with **MyAwesomeapp**.

1. Make a note of the `PrincipalId` when you publish the application to Azure. The output of the command in step 1 should be in the following format:

   ```
   {
     "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "type": "SystemAssigned"
   }
   ```

>[!NOTE]
>The command in this procedure is the equivalent of going to the [portal](https://portal.azure.com) and switching the **Identity / System assigned** setting to **On** in the web application properties.

## Assign permissions to your application to read secrets from Key Vault

Replace \<YourKeyVaultName\> with the name of your key vault and \<PrincipalId\> with the value of the **PrincipalId** in the following command:

```azurecli
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <PrincipalId> --secret-permissions get list
```

This command gives the identity (MSI) of the app service permissions to do **get** and **list** operations on your key vault.

## Publish the web application to Azure

Publish your web app to Azure once again to see that your live web app can fetch the secret value.

1. In Visual Studio, select the **key-vault-dotnet-core-quickstart** project.
2. Select **Publish** > **Start**.
3. Select **Create**.

When you run the application, you should see that it can retrieve your secret value.

Now, you've now successfully created a web app in .NET that stores and fetches its secrets from Key Vault.

## Next steps

>[!div class="nextstepaction"]
>[Azure Key Vault Developer's Guide](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-developers-guide)
