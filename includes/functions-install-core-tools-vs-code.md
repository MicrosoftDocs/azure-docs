---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/25/2026
ms.author: glenga
---

## Install or update Core Tools

The Azure Functions extension for Visual Studio Code integrates with Azure Functions Core Tools so that you can run and debug your functions locally in Visual Studio Code by using the Azure Functions runtime. Before getting started, install Core Tools locally or update an existing installation to use the latest version.

> [!IMPORTANT]
> If you previously installed Core Tools on Windows by using the MSI installer, uninstall it from **Add or Remove Programs**. An existing MSI-based Core Tools installation might prevent Visual Studio Code from running and updating the correct version of Core Tools.

In Visual Studio Code, select **F1** to open the command palette, and then search for and run the command **Azure Functions: Install or Update Core Tools**.
    
This command tries to either start a package-based installation of the latest version of Core Tools or update an existing package-based installation. If you don't have npm or Homebrew installed on your local computer, [manually install or update Core Tools](../articles/azure-functions/functions-run-local.md#install-the-azure-functions-core-tools).


