---
title: Quickstart – Microsoft Azure confidential ledger with the Azure portal
description: Learn to use the Microsoft Azure confidential ledger through the Azure portal
author: msmbaldwin
ms.author: mbaldwin
ms.date: 11/14/2022
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: mode-ui
---

# Quickstart: Create a confidential ledger using the Azure portal

Azure confidential ledger is a cloud service that provides a high integrity store for sensitive data logs and records that require data to be kept intact. For more information on Azure confidential ledger, and for examples of what can be stored in a confidential ledger, see [About Microsoft Azure confidential ledger](overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

In this quickstart, you create a confidential ledger with the [Azure portal](https://portal.azure.com). 

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a confidential ledger

1. From the Azure portal menu, or from the Home page, select **Create a resource**.

1. In the Search box, enter "Confidential Ledger", select said application, and then choose **Create**.

1. On the Create confidential ledger section, provide the following information:
    - **Name**: Provide a unique name.
    - **Subscription**: Choose the desired subscription.
    - **Resource Group**: Select **Create new*** and enter a resource group name.
    - **Location**: In the pull-down menu, choose a location.
    - Leave the other options to their defaults.
   
1. Select the **Security** tab.

1. You must now add a Microsoft Entra ID-based or certificate-based user to your confidential ledger with a role of "Administrator." In this quickstart, we'll add a Microsoft Entra ID-based user. Select **+ Add Microsoft Entra ID-Based User**.

1. You must add a Microsoft Entra ID-based or Certificate-based user. Search the right-hand pane for your email address. Select your row, and then choose **Select** at the bottom of the pane. Your user profile may already be in the Microsoft Entra ID-based user section, in which case you cannot add yourself again.

1. In the **Ledger Role** drop-down field, select **Administrator**.

1. Select **Review + Create**. After validation has passed, select **Create**.

When the deployment is complete. select **Go to resource**.

:::image type="content" source="./media/confidential-ledger-portal-quickstart.png" alt-text="ACL portal create screen":::

Take note of the two properties listed below:
- **confidential ledger name**: In the example, it is "test-create-ledger-demo." You will use this name for other steps.
- **Ledger endpoint**: In the example, this endpoint is `https://test-create-ledger-demo.confidential-ledger.azure.net/`. 

You will need these property names to transact with the confidential ledger from the data plane.
 
## Clean up resources

Other Azure confidential ledger articles build upon this quickstart. If you plan to continue on to work with subsequent articles, you may wish to leave these resources in place. 

When no longer needed, delete the resource group, which deletes the confidential ledger and related resources. To delete the resource group through the portal:

1.	Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this quickstart in the search results, select it.

1.	Select **Delete resource group**.

1.	In the **TYPE THE RESOURCE GROUP NAME:** box, enter the name of the resource group, and select **Delete**.

## Next steps

In this quickstart, you created a confidential ledger by using the Azure portal. To learn more about Azure confidential ledger and how to integrate it with your applications, continue on to the articles below.

- [Overview of Microsoft Azure confidential ledger](overview.md)
