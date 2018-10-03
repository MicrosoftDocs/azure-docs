---
title: Add Key Vault support to your ASP.NET project using Visual Studio | Microsoft Docs
description: Use this tutorial to help you learn how to add Key Vault support to an ASP.NET or ASP.NET Core web application.
services: key-vault
author: ghogen
manager: douge
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 04/15/2018
ms.author: ghogen
---
# Add Key Vault to your web application by using Visual Studio Connected Services

In this tutorial, you will learn how to easily add everything you need to start using Azure Key Vault to manage your secrets for web projects in Visual Studio, whether you are using ASP.NET Core or any type of ASP.NET project. By using the Connected Services feature in Visual Studio 2017, you can have Visual Studio automatically add all the NuGet packages and configuration settings you need to connect to Key Vault in Azure. 

For details on the changes that Connected Services makes in your project to enable Key Vault, see [Key Vault Connected Service - What happened to my ASP.NET 4.7.1 project](vs-key-vault-aspnet-what-happened.md) or [Key Vault Connected Service - What happened to my ASP.NET Core project](vs-key-vault-aspnet-core-what-happened.md).

## Prerequisites

- **An Azure subscription**. If you do not have one, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
- **Visual Studio 2017 version 15.7** with the **Web Development** workload installed. [Download it now](https://aka.ms/vsdownload?utm_source=mscom&utm_campaign=msdocs).
- For ASP.NET (not Core), you need the .NET Framework 4.7.1 Development Tools, which are not installed by default. To install them, launch the Visual Studio Installer, choose **Modify**, and then choose **Individual Components**, then on the right-hand side, expand **ASP.NET and web development**, and choose **.NET Framework 4.7.1 Development Tools**.
- An ASP.NET 4.7.1 or ASP.NET Core 2.0 web project open.

## Add Key Vault support to your project

1. In **Solution Explorer**, choose **Add** > **Connected Service**.
   The Connected Service page appears with services you can add to your project.
1. In the menu of available services, choose **Secure Secrets With Azure Key Vault**.

   ![Choose "Secure Secrets With Azure Key Vault"](media/vs-key-vault-add-connected-service/KeyVaultConnectedService1.PNG)

   If you've signed into Visual Studio, and have an Azure subscription associated with your account, a page appears with a dropdown list with your subscriptions. Make sure that you're signed into Visual Studio, and that the account you're signed in with is the same account that you use for your Azure subscription.

1. Select the subscription you want to use, and then choose a new or existing Key Vault, or choose the Edit link to modify the automatically generated name.

   ![Select your subscription](media/vs-key-vault-add-connected-service/KeyVaultConnectedService3.PNG)

1. Type the name you want to use for the Key Vault.

   ![Rename the Key Vault and choose a resource group](media/vs-key-vault-add-connected-service/KeyVaultConnectedService-Edit.PNG)

1. Select an existing Resource Group, or choose to create a new one with an automatically generated unqiue name.  If you want to create a new group with a different name, you can use the [Azure Portal](https://portal.azure.com), and then close the page and restart to reload the list of resource groups.
1. Choose the region in which to create the Key Vault. If your web application is hosted in Azure, choose the region that hosts the web application for optimum performance.
1. Choose a pricing model. For details, see [Key Vault Pricing](https://azure.microsoft.com/pricing/details/key-vault/).
1. Choose OK to accept the configuration choices.
1. Choose **Add** to create the Key Vault. The create process might fail if you choose a name that was already used.  If that happens, use the **Edit** link to rename the Key Vault and try again.

   ![Adding connected service to project](media/vs-key-vault-add-connected-service/KeyVaultConnectedService4.PNG)

1. Now, add a secret in your Key Vault in Azure. To get to the right place in the portal, click on the link for Manage secrets stored in this Key Vault. If you closed the page or the project, you can navigate to it in the [Azure portal](https://portal.azure.com) by choosing **All Services**, under **Security**, choose **Key Vault**, then choose the Key Vault you just created.

   ![Navigating to the portal](media/vs-key-vault-add-connected-service/manage-secrets-link.jpg)

1. In the Key Vault section for the key vault you created, choose **Secrets**, then **Generate/Import**.

   ![Generate/Import a secret](media/vs-key-vault-add-connected-service/generate-secrets.jpg)

1. Enter a secret, such as "MySecret", and give it any string value as a test, then choose the **Create** button.

   ![Create a secret](media/vs-key-vault-add-connected-service/create-a-secret.jpg)

1. (optional) Enter another secret, but this time put it into a category by naming it "Secrets--MySecret". This syntax specifies a category "Secrets" that contains a secret "MySecret."
 
Now, you can access your secrets in code. The next steps are different depending on whether you are using ASP.NET 4.7.1 or ASP.NET Core.

## Access your secrets in code (ASP.NET Core projects)

The connection to Key Vault is set up at startup by a class that implements [Microsoft.AspNetCore.Hosting.IHostingStartup](/dotnet/api/microsoft.aspnetcore.hosting.ihostingstartup?view=aspnetcore-2.1) using a way of extending startup behavior that is described in [Enhance an app from an external assembly in ASP.NET Core with IHostingStartup](/aspnet/core/fundamentals/host/platform-specific-configuration). The startup class uses two environment variables that contain the Key Vault connection information: ASPNETCORE_HOSTINGSTARTUP__KEYVAULT__CONFIGURATIONENABLED, set to true, and ASPNETCORE_HOSTINGSTARTUP__KEYVAULT__CONFIGURATIONVAULT, set to your Key Vault URL. These are added to the launchsettings.json file when you run through the **Add Connected Service** process.

To access your secrets:

1. In Visual Studio, in your ASP.NET Core project, you can now reference these secrets by using the following expressions in code:
 
   ```csharp
      config["MySecret"] // Access a secret without a section
      config["Secrets:MySecret"] // Access a secret in a section
      config.GetSection("Secrets")["MySecret"] // Get the configuration section and access a secret in it.
   ```

1. On a .cshtml page, say About.cshtml, add the @inject directive near the top of the file to set up a variable you can use to access the Key Vault configuration.

   ```cshtml
      @inject Microsoft.Extensions.Configuration.IConfiguration config
   ```

1. As a test, you can confirm that the value of the secret is available by displaying it on one of the pages. Use @config to reference the config variable.
 
   ```cshtml
      <p> @config["MySecret"] </p>
      <p> @config.GetSection("Secrets")["MySecret"] </p>
      <p> @config["Secrets:MySecret"] </p>
   ```

1. Build and run the web application, navigate to the About page, and see the "secret" value.

## Access your secrets in code (ASP.NET 4.7.1 projects)

The connection to your Key Vault is set up by the ConfigurationBuilder class using information that was added to your web.config file when you run through the **Add Connected Service** process.

To access your secrets:

1. Modify web.config as follows. The keys are placeholders that will be replaced by the AzureKeyVault ConfigurationBuilder with the values of secrets in Key Vault.

   ```xml
     <appSettings configBuilders="AzureKeyVault">
       <add key="webpages:Version" value="3.0.0.0" />
       <add key="webpages:Enabled" value="false" />
       <add key="ClientValidationEnabled" value="true" />
       <add key="UnobtrusiveJavaScriptEnabled" value="true" />
       <add key="MySecret" value="dummy1"/>
       <add key="Secrets--MySecret" value="dummy2"/>
     </appSettings>
   ```

1. In the HomeController, in the About controller method, add the following lines to retrieve the secret and store it in the ViewBag.
 
   ```csharp
            var secret = ConfigurationManager.AppSettings["MySecret"];
            var secret2 = ConfigurationManager.AppSettings["Secrets--MySecret"];
            ViewBag.Secret = $"Secret: {secret}";
            ViewBag.Secret2 = $"Secret2: {secret2}";
   ```

1. In the About.cshtml view, add the following to display the value of the secret (for testing only).

   ```csharp
      <h3>@ViewBag.Secret</h3>
      <h3>@ViewBag.Secret2</h3>
   ```

Congratulations, you have now confirmed that your web app can use Key Vault to access securely stored secrets.

## Clean up resources

When no longer needed, delete the resource group. This deletes the Key Vault and related resources. To delete the resource group through the portal:

1. Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this QuickStart in the search results, select it.
2. Select **Delete resource group**.
3. In the **TYPE THE RESOURCE GROUP NAME:** box type in the name of the resource group and select **Delete**.

## Next steps

Learn more about Key Vault development by reading the [Key Vault Developer's Guide](key-vault-developers-guide.md)