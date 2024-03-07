---
title: Discover SAP systems with Azure Migrate Discovery and assessment 
description: Learn how to discover SAP systems with the Azure Migrate Discovery and assessment tool.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 03/07/2024
ms.custom: 

---

# Tutorial: Discover SAP systems with Azure Migrate: Discovery and assessment

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to import the server inventory and perform an assessment. You upload a CSV file with server inventory details. Azure Migrate uses this information to generate an assessment report, featuring cost, and sizing recommendations based on cost and performance.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure Migrate project.
> * Import the RVTools XLSX file.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Set up an Azure Migrate project

Set up a migration project:
1. In the Azure portal > **All services**, search for **Azure Migrate**.
1. Under **Services**, select **Azure Migrate**.
1. Click **Discover, Assess and Migrate**.
1. In **Get started**, select **Create project**.
1. In **Create project**, select your Azure subscription and resource group. Create a resource group if you don't have one.
1. In **Project Details**, specify the project name and the geography in which you want to create the project.

    :::image type="content" source="./media/tutorial-discover-sap-systems/create_project.PNG" alt-text="Screenshot that shows how to create a project." lightbox="./media/tutorial-discover-sap-systems/create_project.PNG":::

1. Select **Create**.
1. Wait a few minutes for the project to deploy.

The Azure Migrate: Discovery and assessment tool is added by default to the new project.

## Prepare the Import file for Discovery

download the excel and add server information to it.

and import the discovery file in portal as shown below:

### Download the template

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate | Servers, databases and web apps**, select **Discover**.
1. In **Discover** page, in **File type**, select **SAP® inventory (XLS)**.
1. Select **Download** to download the excel template.

    :::image type="content" source="./media/tutorial-discover-sap-systems/download_template.png/" alt-text="Screenshot that shows how to download a template." lightbox="./media/tutorial-discover-sap-systems/download_template.png":::

> [!Note]
   > Recommended to use a new file for every discovery that you plan to run to avoid any duplication or inadvertent errors propagating from one discovery file to another discovery.
   > For guidance, use the sample import file templates listed [here](https://github.com/Azure/Discovery-and-Assessment-for-SAP-systems-with-AzMigrate/tree/main/Import%20file%20samples) as a guide to prepare the import for your SAP landscape

### Import SAP System inventory
After adding information to the excel template, import the excel file.

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate | Servers, databases and web apps**, select **Discover**.
1. In **Discover** page, in **File type**, select **SAP® inventory (XLS)**.
1. In **How do you want to discover**, select **Import based**.
1. In **Import type**, select **.xls file for SAP Inventory**.

    :::image type="content" source="./media/tutorial-discover-sap-systems/import_excel.png/" alt-text="Screenshot that shows how to import SAP inventory." lightbox="./media/tutorial-discover-sap-systems/import_excel.png":::
 





## Next steps


