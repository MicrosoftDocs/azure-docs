---
ms.topic: include
ms.date: 07/18/2023
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
---

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 
1. Sign in to Azure, if you aren't already signed in.
1. In the **Resources** section, select Add (**+**), and then select **Create Resource Group**.

    :::image type="content" source="../media/tutorial-javascript-overview/visual-studio-code-create-resource-group.png" alt-text="Screenshot of Visual Studio Code, in Azure explorer, showing **Create Resource Group** option.":::
1. Enter a resource group name, such as `cognitive-search-demo-rg`. 
1. Enter a region:

   * For Node.js, select `West US 2`. This is the recommended region for the Azure Function programming model (PM) v4 preview. 
   * For C# and Python, we recommend the following regions, supported by Azure Static Web Apps as of this writing: `West US 2`, `East US 2`, `West Europe`, `Central US`, `East Asia`

Use this resource group for all resources created during this tutorial. A resource group gives you a logical unit to manage the resources, including deleting them when you're finished.
