---
title: Get started with Key Vault Connected Service in Visual Studio (ASP.NET Projects) | Microsoft Docs
description: Use this tutorial to help you learn how to add Key Vault support to an ASP.NET or ASP.NET Core web application.
services: key-vault
author: ghogen
manager: douge
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.workload: azure
ms.topic: conceptual
ms.date: 04/15/2018
ms.author: ghogen
---

# Get started with Key Vault Connected Service in Visual Studio (ASP.NET Projects)

> [!div class="op_single_selector"]
> - [Getting Started](vs-key-vault-aspnet-get-started.md)
> - [What Happened](vs-key-vault-aspnet-what-happened.md)

This article provides additional guidance after you've added Key Vault to an ASP.NET MVC project through the **Add Connected Services** command in Visual Studio. If you've not already added the service to your project, you can do so at any time by following the instructions in [Add Key Vault to your web application by using Visual Studio Connected Services](vs-key-vault-add-connected-service.md).

See [What happened to my ASP.NET project?](vs-key-vault-aspnet-core-what-happened.md) for the changes made to your project when adding the connected service.

1. Add a secret in your Key Vault in Azure. To get to the right place in the portal, click on the link for **Manage secrets stored in this Key Vault**. If you closed the page or the project, you can navigate to it in the [Azure portal](https://portal.azure.com) by choosing **All Services**, under **Security**, choose **Key Vault**, then choose the Key Vault you just created.

   ![Navigating to the portal](media/vs-key-vault-add-connected-service/manage-secrets-link.jpg)

1. In the Key Vault section for the key vault you created, choose **Secrets**, then **Generate/Import**.

   ![Generate/Import a secret](media/vs-key-vault-add-connected-service/generate-secrets.jpg)

1. Enter a secret, such as **MySecret**, and give it any string value as a test, then choose the **Create** button.

   ![Create a secret](media/vs-key-vault-add-connected-service/create-a-secret.jpg)
 
1. (optional) Enter another secret, but this time put it into a category by naming it **Secrets--MySecret**. This syntax specifies a category **Secrets** that contains a secret **MySecret**.

1. Add the following lines to web.config. These values are keys that you will use to get the values of secrets in Key Vault.

   ```xml
   <!-- ClientId and ClientSecret refer to the web application registration with Azure Active Directory -->
    <add key="ClientId" value="clientid" />
    <add key="ClientSecret" value="clientsecret" />

    <!-- SecretUri is the URI for the secret in Azure Key Vault -->
    <add key="SecretUri" value="secreturi" />
   ```

1. Add a new class such as Utils to get a Token for Key Vault. Use the following code in the new class:

   ```csharp
   public class Utils
    {
        //this is an optional property to hold the secret after it is retrieved
        public static string EncryptSecret { get; set; }

        //the method that will be provided to the KeyVaultClient
        public static async Task<string> GetToken(string authority, string resource, string scope)
        {
            var authContext = new AuthenticationContext(authority);
            ClientCredential clientCred = new ClientCredential(WebConfigurationManager.AppSettings["ClientId"],
                        WebConfigurationManager.AppSettings["ClientSecret"]);
            AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);

            if (result == null)
                throw new InvalidOperationException("Failed to obtain token.");

            return result.AccessToken;
        }
    }
   ```

    The GetToken method uses the values from the local appSettings file.

1. Add code to get secrets using Key Vault, using the GetToken callback you just added.

   ```csharp
            var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(Utils.GetToken));
            var sec = await kv.GetSecretAsync(WebConfigurationManager.AppSettings["SecretUri"]);

            //I put a variable in a Utils class to hold the secret for general application use.
            Utils.EncryptSecret = sec.Value;
   ```

Congratulations, you have now enabled your web app to use Key Vault to access securely stored secrets.

# Next steps

Learn more about developing with Key Vault in the [Key Vault Developer's Guide](key-vault-developers-guide.md)