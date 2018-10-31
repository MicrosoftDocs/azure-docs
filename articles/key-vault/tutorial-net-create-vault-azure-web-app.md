---
title: Tutorial: How to use Azure Key Vault with Azure Web App in .NET | Microsoft Docs
description: Tutorial Configure an ASP.Net core application to read a secret from Key vault
services: key-vault
documentationcenter: 
author: pryerram
manager: rajvijan

ms.assetid: 0e57f5c7-6f5a-46b7-a18a-043da8ca0d83
ms.service: key-vault
ms.workload: identity
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: pryerram
ms.custom: mvc
Customer intent: As a developer I want to use Azure Key vault to store secrets for my app, so that they are kept secure.
---
# Tutorial: Part 1 - How to use Azure Key Vault with Azure Web App in .NET

Azure Key Vault helps you to protect secrets such as API Keys, Database Connection strings needed to access your applications, services, and IT resources.

In this tutorial, you follow the necessary steps for getting an Azure web application to read information from Azure Key Vault by using managed identities for Azure resources. This tutorial is based on [Azure Web Apps](../app-service/app-service-web-overview.md). In the following you learn how to:

> [!div class="checklist"]
> * Create a key vault.
> * Store a secret in the key vault.
> * Retrieve a secret from the key vault.
> * Create an Azure web application.
> * Enable a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the web app.
> * Grant the required permissions for the web application to read data from the key vault.
> * Run the Web Application on Azure

Before we go any further, please read the [basic concepts](key-vault-whatis.md#basic-concepts).

## Prerequisites

* On Windows:
  * .NET Core cross-platform development
  * [.NET Core 2.1 SDK or later](https://www.microsoft.com/net/download/windows)

* On Mac:
  * See [What’s New in Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/).

* All platforms:
  * Git ([download](https://git-scm.com/downloads)).
  * An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  * [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.4 or later. This is available for Windows, Mac, and Linux.
  * [.NET Core](https://www.microsoft.com/net/download/dotnet-core/2.1)

## What is Managed Service Identity and how does it work?
 Before we go any further let's understand MSI. Azure Key Vault can store credentials securely so they aren’t in your code, but to retrieve them you need to authenticate to Azure Key Vault. To authenticate to Key Vault, you need a credential! A classic bootstrap problem. Through the magic of Azure and Azure AD, MSI provides a “bootstrap identity” that makes it much simpler to get things started.

Here’s how it works! When you enable MSI for an Azure service such as Virtual Machines, App Service, or Functions, Azure creates a [Service Principal](key-vault-whatis.md#basic-concepts) for the instance of the service in Azure Active Directory, and injects the credentials for the Service Principal into the instance of the service. 

![MSI](media/MSI.png)

Next, Your code calls a local metadata service available on the Azure resource to get an access token.
Your code uses the access token it gets from the local MSI_ENDPOINT to authenticate to an Azure Key Vault service. 

Now let's begin the tutorial

## Log in to Azure

To log in to Azure by using the Azure CLI, enter:

```azurecli
az login
```

## Create a resource group

Create a resource group by using the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Select a resource group name and fill in the placeholder.
The following example creates a resource group in the West US location:

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "West US"
```

The resource group that you just created is used throughout this article.

## Create a key vault

Next you create a key vault in the resource group that you created in the previous step. Provide the following information:

* Key vault name: The name must be a string of 3-24 characters and must contain only (0-9, a-z, A-Z, and -).
* Resource group name.
* Location: **West US**.

```azurecli
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "West US"
```

At this point, your Azure account is the only one that's authorized to perform any operations on this new vault.

## Add a secret to the key vault

We're adding a secret to help illustrate how this works. You might be storing a SQL connection string or any other information that you need to keep securely but make available to your application.

Type the following commands to create a secret in the key vault called **AppSecret**. This secret will store the value **MySecret**.

```azurecli
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

To view the value contained in the secret as plain text:

```azurecli
az keyvault secret show --name "AppSecret" --vault-name "<YourKeyVaultName>"
```

This command shows the secret information, including the URI. After you complete these steps, you should have a URI to a secret in a key vault. Make note of this information. You'll need it in a later step.

## Create a .NET Core Web App

Follow this [tutorial](../app-service/app-service-web-get-started-dotnet.md) to create a .NET Core Web App and **publish** it to Azure **OR** watch the video below
> [!VIDEO https://www.youtube.com/embed/3AsaOO6aOw4]

## Open and edit the solution

1. Navigate to Pages > About.cshtml.cs file.
2. Install these 2 Nuget packages
    - [AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication)
    - [KeyVault](https://www.nuget.org/packages/Microsoft.Azure.KeyVault)
3. Import the following in About.cshtml.cs file

    ```
    using Microsoft.Azure.KeyVault;
    using Microsoft.Azure.KeyVault.Models;
    using Microsoft.Azure.Services.AppAuthentication;
    ```
4. Your code in the AboutModel class should look like below
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

From the main menu of Visual Studio 2017, select **Debug** > **Start** with/without debugging. When the browser appears, go to the **About** page. The value for **AppSecret** is displayed.

## Enable a managed identity for the web app

Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Key Vault to retrieve them. [Managed identities for Azure resources overview](../active-directory/managed-identities-azure-resources/overview.md) makes solving this problem simpler, by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

1. Return to the Azure CLI.
2. Run the assign-identity command to create the identity for this application: 

   ```azurecli
   az webapp identity assign --name "<YourAppName>" --resource-group "<YourResourceGroupName>"
   ```
   Please **NOTE** - Replace <YourAppName> with the name of the published app on Azure i.e. if your published app name was MyAwesomeapp.azurewebsites.net then replace <YourAppName> with MyAwesomeapp

>[!NOTE]
>The command in this procedure is the equivalent of going to the portal and switching the **Identity / System assigned** setting to **On** in the web application properties.

## Assign permissions to your application to read secrets from Key Vault

Make a note of the output when you publish the application to Azure. It should be of the format:
        
        {
          "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "SystemAssigned"
        }
        
Then, run this command by using the name of your key vault and the value of **PrincipalId**:

```azurecli

az keyvault set-policy --name '<YourKeyVaultName>' --object-id <PrincipalId> --secret-permissions get list

```

## Publish the web application to Azure

Publish this app to Azure once again to see it live as a web app, and to see that you can fetch the secret value:

1. In Visual Studio, select the **key-vault-dotnet-core-quickstart** project.
2. Select **Publish** > **Start**.
3. Select **Create**.

<<<<<<< HEAD
<<<<<<< HEAD
In the above command you are giving the Identity (MSI) of the App Service permissions to do **get** and **list** operations on your Key Vault. <br />
Now when you run the application, you should see your secret value retrieved. 
=======
Now when you run the application, you should see your secret value retrieved. In the above command you are giving the Identity(MSI) of the App Service permissions to do **get** and **list** operations on your Key Vault
>>>>>>> dce462ad89eacf012b249cba06bc6d69439ca8a9
=======
In the above command you are giving the Identity (MSI) of the App Service permissions to do **get** and **list** operations on your Key Vault. <br />
Now when you run the application, you should see your secret value retrieved. 
>>>>>>> e42d393d2810ab60c9a8a8f3e58c7be19924e62f
