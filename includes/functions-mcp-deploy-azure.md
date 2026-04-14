---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/20/2026
ms.author: glenga
---

This project is configured to use `azd` to deploy this project to a new function app in a Flex Consumption plan in Azure. The project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex Consumption plan that follows best practices.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. Search for and run the command `Azure Developer CLI (azd): Package, Provision and Deploy (up)`. Then, sign in by using your Azure account.

1. When prompted, select these required deployment parameters:

   | Parameter | Description |
   | ---- | ---- |
   | _Azure subscription_ | Subscription in which your resources are created. |
   | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown. |
   | _vnetEnabled_ | `False` to skip creating virtual network resources, which simplifies the deployment. |

   After the command completes successfully, you see links to the resources you created.
