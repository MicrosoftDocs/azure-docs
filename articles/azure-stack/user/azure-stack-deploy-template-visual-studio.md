---
title: Deploy templates with Visual Studio in Azure Stack | Microsoft Docs
description: Learn how to deploy templates with Visual Studio in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 628da2ae-64cc-42e0-b8b7-a6a3724cb974
ms.service: azure-stack
ms.custom: vs-azure
ms.workload: azure-vs
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2018
ms.author: sethm
ms.reviewer:

---
# Deploy templates in Azure Stack using Visual Studio

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can use Visual Studio to deploy Azure Resource Manager templates to Azure Stack.

## To deploy a template

1. [Install and connect](azure-stack-install-visual-studio.md) to Azure Stack with Visual Studio.
2. Open Visual Studio.
3. Select **File**, and then select **New**. In **New Project**, select **Azure Resource Group**.
4. Enter a **Name** for the new project, and then select **OK**.
5. In **Select Azure Template**, pick **Azure Stack Quickstart** from the drop-down list.
6. Select **101-create-storage-account**, and then select **OK**.
7. In your new project, expand the **Templates** node in **Solution Explorer** to see the available templates.
8. In **Solution Explorer**, pick the name of your project, and then select **Deploy**. Select **New Deployment**.
9. In **Deploy to Resource Group**, use the **Subscription** drop-down list to select your Microsoft Azure Stack subscription.
10. From the **Resource Group** list, choose an existing resource group or create a new one.
11. From the **Resource group location** list, choose a location, and then select **Deploy**.
12. In **Edit Parameters**, provide values for the parameters (which vary by template), and then select **Save**.

## Next steps

* [Deploy templates with the command line](azure-stack-deploy-template-command-line.md)
* [Develop templates for Azure Stack](azure-stack-develop-templates.md)
