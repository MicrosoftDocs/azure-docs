---
title: Securely saving secret application settings for a web application - Azure Key Vault | Microsoft Docs
description: How to securely save secret application settings such as Azure credentials or third party API keys using ASP.NET core Key Vault Provider, User Secret, or .NET 4.7.1 configuration builders
services: visualstudio
author: cawaMS
manager: paulyuk
editor: ''

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 07/17/2019
ms.author: cawa

---

# Securely save secret application settings for a web application

## Overview
This article describes how to securely save secret application configuration settings for Azure applications.

Traditionally all web application configuration settings are saved in configuration files such as Web.config. This practice leads to checking in secret settings such as Cloud credentials to public source control systems like GitHub. Meanwhile, it could be hard to follow security best practice because of the overhead required to change source code and reconfigure development settings.

To make sure the development process is secure, tooling and framework libraries are created to save application secret settings securely with minimal or no source code change.

## ASP.NET and .NET Core applications

### Save secret settings in User Secret store that is outside of source control folder
If you are doing a quick prototype or you don't have internet access, start with moving your secret settings outside of source control folder to User Secret store. User Secret store is a file saved under user profiler folder, so secrets are not checked in to source control. The following diagram demonstrates how [User Secret](https://docs.microsoft.com/aspnet/core/security/app-secrets?tabs=visual-studio) works.

![User Secret keeps secret settings outside of source control](../media/vs-secure-secret-appsettings/aspnetcore-usersecret.PNG)

If you are running .NET core console application, use Key Vault to save your secret securely.

### Save secret settings in Azure Key Vault
If you are developing a project and need to share source code securely, use [Azure Key Vault](https://azure.microsoft.com/services/key-vault/).

1. Create a Key Vault in your Azure subscription. Fill out all required fields on the UI and click *Create* on the bottom of the blade

    ![Create Azure Key Vault](../media/vs-secure-secret-appsettings/create-keyvault.PNG)

2. Grant you and your team members access to the Key Vault. If you have a large team, you can create an [Azure Active Directory group](../../active-directory/active-directory-groups-create-azure-portal.md) and add that security group access to the Key Vault. In the *Secret Permissions* dropdown, check *Get* and *List* under *Secret Management Operations*.
If you already have your web app created, grant the web app access to the Key Vault so it can access the key vault without storing secret configuration in App Settings or files. Search for your web app by its name and add it the same way you grant users access.

    ![Add Key Vault access policy](../media/vs-secure-secret-appsettings/add-keyvault-access-policy.png)

3. Add your secret to Key Vault on the Azure portal. For nested configuration settings, replace ':' with '--' so the Key Vault secret name is valid. ':' is not allowed to be in the name of a Key Vault secret.

    ![Add Key Vault secret](../media/vs-secure-secret-appsettings/add-keyvault-secret.png)

    > [!NOTE]
    > Prior to Visual Studio 2017 V15.6 we used to recommend installing the Azure Services Authentication extension for Visual Studio. But it is deprecated now as the functionality is integrated within the Visual Studio . Hence if you are on an older version of visual Studio 2017 , we suggest you to update to at least VS 2017 15.6 or up so that you can use this functionality natively and access the Key-vault from using the Visual Studio sign-in Identity itself.
    >

4. Add the following NuGet packages to your project:

    ```
    Microsoft.Azure.KeyVault
    Microsoft.Azure.Services.AppAuthentication
    Microsoft.Extensions.Configuration.AzureKeyVault
    ```
5. Add the following code to Program.cs file:

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
             Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((ctx, builder) =>
                {
                    var keyVaultEndpoint = GetKeyVaultEndpoint();
                    if (!string.IsNullOrEmpty(keyVaultEndpoint))
                    {
                        var azureServiceTokenProvider = new AzureServiceTokenProvider();
                        var keyVaultClient = new KeyVaultClient(
                            new KeyVaultClient.AuthenticationCallback(
                                azureServiceTokenProvider.KeyVaultTokenCallback));
                        builder.AddAzureKeyVault(
                        keyVaultEndpoint, keyVaultClient, new DefaultKeyVaultSecretManager());
                    }
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static string GetKeyVaultEndpoint() => Environment.GetEnvironmentVariable("KEYVAULT_ENDPOINT");
    ```
6. Add your Key Vault URL to launchsettings.json file. The environment variable name *KEYVAULT_ENDPOINT* is defined in the code you added in step 6.

    ![Add Key Vault URL as a project environment variable](../media/vs-secure-secret-appsettings/add-keyvault-url.png)

7. Start debugging the project. It should run successfully.

## ASP.NET and .NET applications

.NET 4.7.1 supports Key Vault and Secret configuration builders, which ensures secrets can be moved outside of source control folder without code changes.
To proceed, [download .NET 4.7.1](https://www.microsoft.com/download/details.aspx?id=56115) and migrate your application if it's using an older version of .NET framework.

### Save secret settings in a secret file that is outside of source control folder
If you are writing a quick prototype and don't want to provision Azure resources, go with this option.

1. Install the following NuGet package to your project
    ```
    Microsoft.Configuration.ConfigurationBuilders.Base
    ```

2. Create a file that's similar to the following. Save it under a location outside of your project folder.

    ```xml
    <root>
        <secrets ver="1.0">
            <secret name="secret1" value="foo_one" />
            <secret name="secret2" value="foo_two" />
        </secrets>
    </root>
    ```

3. Define the secret file to be a configuration builder in your Web.config file. Put this section before *appSettings* section.

    ```xml
    <configBuilders>
        <builders>
            <add name="Secrets"
                 secretsFile="C:\Users\AppData\MyWebApplication1\secret.xml" type="Microsoft.Configuration.ConfigurationBuilders.UserSecretsConfigBuilder,
                    Microsoft.Configuration.ConfigurationBuilders, Version=1.0.0.0, Culture=neutral" />
        </builders>
    </configBuilders>
    ```

4. Specify appSettings section is using the secret configuration builder. Make sure there is an entry for the secret setting with a dummy value.

    ```xml
        <appSettings configBuilders="Secrets">
            <add key="webpages:Version" value="3.0.0.0" />
            <add key="webpages:Enabled" value="false" />
            <add key="ClientValidationEnabled" value="true" />
            <add key="UnobtrusiveJavaScriptEnabled" value="true" />
            <add key="secret" value="" />
        </appSettings>
    ```

5. Debug your app. It should run successfully.

### Save secret settings in an Azure Key Vault
Follow instructions from ASP.NET core section to configure a Key Vault for your project.

1. Install the following NuGet package to your project
   ```
   Microsoft.Configuration.ConfigurationBuilders.UserSecrets
   ```

2. Define Key Vault configuration builder in Web.config. Put this section before *appSettings* section. Replace *vaultName* to be the Key Vault name if your Key Vault is in public Azure, or full URI if you are using Sovereign cloud.

    ```xml
    <configSections>
        <section name="configBuilders" type="System.Configuration.ConfigurationBuildersSection, System.Configuration, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" restartOnExternalChanges="false" requirePermission="false" />
    </configSections>
    <configBuilders>
        <builders>
            <add name="AzureKeyVault" vaultName="Test911" type="Microsoft.Configuration.ConfigurationBuilders.AzureKeyVaultConfigBuilder, ConfigurationBuilders, Version=1.0.0.0, Culture=neutral" />
        </builders>
    </configBuilders>
    ```
3. Specify appSettings section is using the Key Vault configuration builder. Make sure there is any entry for the secret setting with a dummy value.

   ```xml
   <appSettings configBuilders="AzureKeyVault">
       <add key="webpages:Version" value="3.0.0.0" />
       <add key="webpages:Enabled" value="false" />
       <add key="ClientValidationEnabled" value="true" />
       <add key="UnobtrusiveJavaScriptEnabled" value="true" />
       <add key="secret" value="" />
   </appSettings>
   ```

4. Start debugging the project. It should run successfully.
