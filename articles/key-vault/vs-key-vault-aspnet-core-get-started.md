---
title: Get started with Key Vault Connected Service in Visual Studio (ASP.NET Core Projects) | Microsoft Docs
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

# Get started with Key Vault Connected Service in Visual Studio

> [!div class="op_single_selector"]
> - [Getting Started](vs-key-vault-aspnet-core-get-started.md)
> - [What Happened](vs-key-vault-aspnet-core-what-happened.md)

This article provides additional guidance after you've added Key Vault to an ASP.NET Core project through the **Add Connected Services** command of Visual Studio. If you've not already added the service to your project, you can do so at any time by following the instructions in [Add Key Vault to your web application by using Visual Studio Connected Services](vs-key-vault-add-connected-service.md).

See [What happened to my ASP.NET Core project?](vs-key-vault-aspnet-core-what-happened.md) for the changes made to your project when adding the connected service.

1. Add a secret in your Key Vault in Azure. To get to the right place in the portal, click on the link for Manage secrets stored in this Key Vault. If you closed the page or the project, you can navigate to it in the [Azure portal](https://portal.azure.com) by choosing **All Services**, under **Security**, choose **Key Vault**, then choose the Key Vault you just created.

   ![Navigating to the portal](media/vs-key-vault-add-connected-service/manage-secrets-link.jpg)

1. In the Key Vault section for the key vault you created, choose **Secrets**, then **Generate/Import**.

   ![Generate/Import a secret](media/vs-key-vault-add-connected-service/generate-secrets.jpg)

1. Enter a secret, such as "MySecret", and give it any string value as a test, then choose the **Create** button.

   ![Create a secret](media/vs-key-vault-add-connected-service/create-a-secret.jpg)
 
1. (optional) Enter another secret, but this time put it into a category by naming it **Secrets--MySecret**. This syntax specifies a category **Secrets** that contains a secret **MySecret.**
1. In your Visual Studio project, you can now reference these secrets by using the following expressions in code:
 
   ```csharp
      config["MySecret"] // Access a secret without a section
      config["Secrets:MySecret"] // Access a secret in a section
      config.GetSection("Secrets")["MySecret"] // Get the configuration section and access a secret in it.
   ```

   On a .cshtml page, say About.cshtml, add the @inject directive near the top of the file to set up a variable you can use to access the Key Vault configuration.

   ```cshtml
      @inject Microsoft.Extensions.Configuration.IConfiguration config
   ```

1. You can confirm that the value of the secret is available by displaying it on one of the pages. Use @config to reference the config variable.
 
   ```cshtml
      <p> @config["MySecret"] </p>
      <p> @config.GetSection("Secrets")["MySecret"] </p>
      <p> @config["Secrets:MySecret"] </p>
   ```

1. Build and run the web application, navigate to the About page, and see the "secret" value.

# Next steps

Learn more about developing with Key Vault in the [Key Vault Developer's Guide](key-vault-developers-guide.md)