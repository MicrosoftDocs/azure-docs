---
title: Add Key Vault support to your ASP.NET project using Visual Studio | Microsoft Docs
description: Use this tutorial to help you learn how to add Key Vault support to an ASP.NET or ASP.NET Core web application.
services: key-vault
author: ghogen
manager: douge
tags: azure-resource-manager
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.workload: azure
ms.topic: conceptual
ms.date: 04/15/2018
ms.author: ghogen
---
# Add Key Vault to your web application by using Visual Studio Connected Services

In this tutorial, you will learn how to easily add everything you need to start using Azure Key Vault to manage your secrets for web projects in Visual Studio, whether you are using ASP.NET Core or any type of ASP.NET project. By using the Connected Services feature in Visual Studio 2017, you can have Visual Studio automatically add all the NuGet packages and configuration settings you need to connect to Key Vault in Azure. 

For details on the changes that Connected Services makes in your project to enable Key Vault, see [Key Vault Connected Service - What happened to my ASP.NET project]() or [Key Vault Connected Service - What happened to my ASP.NET Core project]().

## Prerequisites

- **An Azure subscription**. If you do not have one, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
- **Visual Studio 2017 version 15.7** with the **Web Development** workload installed. [Download it now](https://aka.ms/vsdownload).
- An ASP.NET or ASP.NET Core web project open.

## Add Key Vault support to your project

1. In **Solution Explorer**, choose **Add** > **Connected Service**.
   The Connected Service page appears with services you can add to your project.
1. In the menu of available services, choose **Secure Secrets With Azure Key Vault**.

   ![Choose "Secure Secrets With Azure Key Vault"](media/vs-key-vault-add-connected-service/KeyVaultConnectedService1.PNG)

   If you've signed into Visual Studio, and have an Azure subscription associated with your account, a page appears with a dropdown list with your subscriptions.
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

   ![Navigating to the portal](media/manage-secrets-mvlink.jpg)

1. In the Key Vault section for the key vault you created, choose **Secrets**, then **Generate/Import**.

   ![Generate/Import a secret](media/generate-import-secret.jpg)

1. Enter a secret, such as "MySecret", and give it any string value as a test, then choose the **Create** button.
2. 
3. ![Create a secret](media/create-a-secret.jpg)
4. 
5. (optional) Enter another secret, but this time put it into a category by naming it "Secrets--MySecret". This syntax specifies a category "Secrets" that contains a secret "MySecret."
6. In Visual Studio, in your project, you can now reference these secrets by using the following expressions in code:
 
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

## Next steps

Add code to get an access token to manage your secrets, and test your Key Vault with a certificate: [Use Azure Key Vault from a Web Application](/azure/key-vault/key-vault-use-from-web-application#gettoken)
