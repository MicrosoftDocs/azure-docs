---
title: Add Key Vault support to your ASP.NET project using Visual Studio - Azure Key Vault | Microsoft Docs
description: Use this tutorial to help you learn how to add Key Vault support to an ASP.NET or ASP.NET Core web application.
services: key-vault
author: ghogen
manager: jillfra
ms.service: key-vault
ms.custom: "vs-azure, devx-track-csharp"
ms.topic: how-to
ms.date: 08/07/2019
ms.author: ghogen
---
# Add Key Vault to your web application by using Visual Studio Connected Services

In this tutorial, you will learn how to easily add everything you need to start using Azure Key Vault to manage your secrets for web projects in Visual Studio, whether you are using ASP.NET Core or any type of ASP.NET project. By using the Connected Services feature in Visual Studio, you can have Visual Studio automatically add all the NuGet packages and configuration settings you need to connect to Key Vault in Azure.

For details on the changes that Connected Services makes in your project to enable Key Vault, see [Key Vault Connected Service - What happened to my ASP.NET 4.7.1 project](#how-your-aspnet-framework-project-is-modified) or [Key Vault Connected Service - What happened to my ASP.NET Core project](#how-your-aspnet-core-project-is-modified).

## Prerequisites

- **An Azure subscription**. If you don't have a subscription, sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
- **Visual Studio 2019 version 16.3** or later [Download it now](https://aka.ms/vsdownload?utm_source=mscom&utm_campaign=msdocs).


## Add Key Vault support to your project

Before you begin, make sure that you're signed into Visual Studio. Sign in with the same account that you use for your Azure subscription. Then open an ASP.NET 4.7.1 or later, or ASP.NET Core 2.0 web project, and do the follow steps:

1. In **Solution Explorer**, right-click the project that you want to add the Key Vault support to, and choose **Add** > **Connected Service** > **Add**.
   The Connected Service page appears with services you can add to your project.
1. In the menu of available services, choose **Azure Key Vault** and click **Next**.

   ![Choose "Azure Key Vault"](../media/vs-key-vault-add-connected-service/key-vault-connected-service.png)

1. Select the subscription you want to use, and then choose a existing Key Vault and click **Finish**. 

   ![Select your subscription](../media/vs-key-vault-add-connected-service/key-vault-connected-service-select-vault.png)

Now, connection to Key Vault is established and you can access your secrets in code. The next steps are different depending on whether you are using ASP.NET 4.7.1 or ASP.NET Core.

## Access your secrets in code (ASP.NET Core)

1. Open one of the page files, such as *Index.cshtml.cs* and write the following code:
   1. Include a reference to `Microsoft.Extensions.Configuration` by this using directive:

       ```csharp
       using Microsoft.Extensions.Configuration;
       ```

   1. Add the configuration variable.

      ```csharp
      private static IConfiguration _configuration;
      ```

   1. Add this constructor or replace the existing constructor with this:

       ```csharp
       public IndexModel(IConfiguration configuration)
       {
           _configuration = configuration;
       }
       ```

   1. Update the `OnGet` method. Update the placeholder value shown here with the secret name you created in the above commands.

       ```csharp
       public void OnGet()
       {
           ViewData["Message"] = "My key val = " + _configuration["<YourSecretNameStoredInKeyVault>"];
       }
       ```

   1. To confirm the value at runtime, add code to display `ViewData["Message"]` to the *.cshtml* file to display the secret in a message.

      ```cshtml
          <p>@ViewData["Message"]</p>
      ```

You can run the app locally to verify that the secret is obtained successfully from the Key Vault.

## Access your secrets (ASP.NET)
You can set up the configuration so that the web.config file has a dummy value in the `appSettings` element that is replaced by the true value at runtime. You can then access this via the `ConfigurationManager.AppSettings` data structure.

1. In Solution Explorer, right-click on your project, and select Manage NuGet Packages. In the Browse tab, locate and install [Microsoft.Configuration.ConfigurationBuilders.Azure](https://www.nuget.org/packages/Microsoft.Configuration.ConfigurationBuilders.Azure/)
 
1. Open your web.config file, and write the following code:
    1. Add `configSections` and `configBuilders`:
        ```xml
         <configSections>
            <section
                name="configBuilders"
                type="System.Configuration.ConfigurationBuildersSection, System.Configuration, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"
                restartOnExternalChanges="false"
                requirePermission="false" />
         </configSections>
         <configBuilders>
            <builders>
            <add
                    name="AzureKeyVault"
                    vaultName="vaultname"
                    type="Microsoft.Configuration.ConfigurationBuilders.AzureKeyVaultConfigBuilder, Microsoft.Configuration.ConfigurationBuilders.Azure, Version=1.0.0.0, Culture=neutral"
                    vaultUri="https://vaultname.vault.azure.net" />
            </builders>
         </configBuilders>
        ```
    1. Find the appSettings tag, add an attribute `configBuilders="AzureKeyVault"`, and add a line:
        ```xml
         <add key="<secretNameInYourKeyVault>" value="dummy"/>
        ```

1. Edit the `About` method in *HomeController.cs*, to display the value for confirmation.

   ```csharp
   public ActionResult About()
   {
       ViewBag.Message = "Key vault value = " + ConfigurationManager.AppSettings["<secretNameInYourKeyVault>"];
   }
   ```
1. Run the app locally under the debugger, switch to the **About** tab, and verify that the value from the Key Vault is displayed.

## Troubleshooting

If your Key Vault is running on an different Microsoft account than the one you're logged in to Visual Studio (for example, the Key Vault is running on your work account, but Visual Studio is using your private account) you get an error in your Program.cs file, that Visual Studio can't get access to the Key Vault. To fix this issue:

1. Go to the [Azure portal](https://portal.azure.com) and open your Key Vault.

1. Choose **Access policies**, then **Add Access Policy**, and choose the account you are logged in with as Principal.

1. In Visual Studio, choose **File** > **Account Settings**.
Select **Add an account** from the **All account** section. Sign in with the account you have chosen as Principal of your access policy.

1. Choose **Tools** > **Options**, and look for **Azure Service Authentication**. Then select the account you just added to Visual Studio.

Now, when you debug your application, Visual Studio connects to the account your Key Vault is located on.

## How your ASP.NET Core project is modified

This section identifies the exact changes made to an ASP.NET project when adding the Key Vault connected service using Visual Studio.

### Added references for ASP.NET Core

Affects the project file .NET references and NuGet package references.

| Type | Reference |
| --- | --- |
| NuGet | Microsoft.AspNetCore.AzureKeyVault.HostingStartup |

### Added files for ASP.NET Core

- `ConnectedService.json` added, which records some information about the Connected Service provider, version, and a link the documentation.

### Project file changes for ASP.NET Core

- Added the Connected Services ItemGroup and `ConnectedServices.json` file.

### launchsettings.json changes for ASP.NET Core

- Added the following environment variable entries to both the IIS Express profile and the profile that matches your web project name:

    ```json
      "environmentVariables": {
        "ASPNETCORE_HOSTINGSTARTUP__KEYVAULT__CONFIGURATIONENABLED": "true",
        "ASPNETCORE_HOSTINGSTARTUP__KEYVAULT__CONFIGURATIONVAULT": "<your keyvault URL>"
      }
    ```

### Changes on Azure for ASP.NET Core

- Created a resource group (or used an existing one).
- Created a Key Vault in the specified resource group.

## How your ASP.NET Framework project is modified

This section identifies the exact changes made to an ASP.NET project when adding the Key Vault connected service using Visual Studio.

### Added references for ASP.NET Framework

Affects the project file .NET references and `packages.config` (NuGet references).

| Type | Reference |
| --- | --- |
| .NET; NuGet | Azure.Identity |
| .NET; NuGet | Azure.Security.KeyVault.Keys |
| .NET; NuGet | Azure.Security.KeyVault.Secrets |

> [!IMPORTANT] 
> By default Azure.Identity 1.1.1 is installed, which does not support Visual Studio Credential. You can update package reference manually to 1.2+ use Visual Studio Credential.

### Added files for ASP.NET Framework

- `ConnectedService.json` added, which records some information about the Connected Service provider, version, and a link to the documentation.

### Project file changes for ASP.NET Framework

- Added the Connected Services ItemGroup and ConnectedServices.json file.
- References to the .NET assemblies described in the [Added references](#added-references-for-aspnet-framework) section.

## Next steps

If you followed this tutorial, your Key Vault permissions are set up to run with your own Azure subscription, but that might not be desirable for a production scenario. You can create a managed identity to manage Key Vault access for your app. See [How to Authenticate to Key Vault](./authentication.md) and [Assign a Key Vault access policy](./assign-access-policy-portal.md).

Learn more about Key Vault development by reading the [Key Vault Developer's Guide](developers-guide.md).