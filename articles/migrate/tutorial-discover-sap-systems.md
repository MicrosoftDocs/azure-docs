---
title: Discover SAP systems with Azure Migrate Discovery and assessment 
description: Learn how to discover SAP systems with the Azure Migrate Discovery and assessment.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 03/07/2024
ms.custom: 

---

# Tutorial: Discover SAP systems with Azure Migrate: discovery and assessment

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial explains how you can import the server inventory and workloads and perform an assessment. You can upload a CSV file with server inventory details and upload it. Azure Migrate uses this information to generate an assessment report, featuring cost, and sizing recommendations based on cost and performance.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure Migrate project.
> * Import the server inventory and perform an assessment.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and use default options. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Set up an Azure Migrate project

To set up a migration project, do the following steps:
1. In the Azure portal > **All services**, search for **Azure Migrate**.
1. Under **Services**, select **Azure Migrate**.
1. Select **Discover, Assess and Migrate**.
1. In **Get started**, select **Create project**.
1. In **Create project**, select your Azure subscription and resource group. Create a resource group if you don't have one.
1. In **Project Details**, specify the project name and geography in which you want to create the project.

    :::image type="content" source="./media/tutorial-discover-sap-systems/create_project.PNG" alt-text="Screenshot that shows how to create a project." lightbox="./media/tutorial-discover-sap-systems/create_project.PNG":::

1. Select **Create**.<br>Wait for a few minutes for the project deployment. The Azure Migrate: Discovery and assessment tool is added by default to the new project.

## Prepare the import file

Download the template file and add the server inventory, and then import the template file in the portal.

### Download the template

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate | Servers, databases and web apps**, select **Discover**.
1. On the **Discover** page, in **File type**, select **SAP® inventory (XLS)**.
1. Select **Download** to download the excel template.

    :::image type="content" source="./media/tutorial-discover-sap-systems/download_template.png" alt-text="Screenshot that shows how to download a template." lightbox="./media/tutorial-discover-sap-systems/download_template.png":::

> [!Note]
   > We recommend you to use a new file for every discovery that you plan to run to avoid any duplication or inadvertent errors propagating from one discovery file to another discovery file.
   > For guidance, use the sample import file templates listed [here](https://github.com/Azure/Discovery-and-Assessment-for-SAP-systems-with-AzMigrate/tree/main/Import%20file%20samples) as a guide to prepare the import for your SAP landscape

### Add on-premises SAP infrastructure

Gather on-premises SAP system inventory and add it to the template file.
- To gather data, you can export it from system and fill in the template with the relevant on-premises SAP system inventory [available here](https://microsoftapc.sharepoint.com/teams/SAPEmbrace95/Shared%20Documents/Forms/AllItems.aspx?id=%2Fteams%2FSAPEmbrace95%2FShared%20Documents%2FGeneral%2FEngineering%20New%2FFeature%20Discussions%2FAZ%2DMigrate%2FSAP%5FCOLLECTOR%5FADVISOR%2FE2E%20Tests%2FCases%20V3%20%28SelfHost%29&p=true&ga=1&LOF=1).
- To review sample data, download our [sample import file](https://github.com/Azure/Discovery-and-Assessment-for-SAP-systems-with-AzMigrate/tree/main/Import%20file%20samples).


The following table summarizes the file fields to fill in:
    
| **Template Column** | **Description** |
| --- | --- |
| Server Name | Unique server name or host name of the SAP system to identify each server. Include all the virtual machines attached to an SAP system that you intend to migrate to Azure. |
| Environment | The server's associated environment. Select the most applicable environment from the dropdown. |
| SAP Instance Type | The type of SAP instance running on this machine, for example, App, ASCS, DB, and so on. Select from the available dropdown values. Only single-server and distributed architectures are supported. |
| Instance SID | This is the Instance SID for the ASCS/AP/DB instance. |
| System SID | System ID of SAP System. |
| Landscape SID | System ID of the customer's production system in each landscape. |
| Application | Optional Column to specify any Organizational identifier, such as HR, Finance, Marketing and so on. |
| SAP Product | SAP Application Component, for example, SAP S/4HANA 2022, SAP ERP ENHANCE and so on. |
| SAP Product  Version | The version of the SAP product. |
| Operating System | The operating system running on the host server. |
| Database Type | This column is applicable only if **SAP Instance Type** column is **Database**. Select the database (SQL, Oracle, S4/Hana, etc.) from the dropdown list.  |
| SAPS | The SAP Application Performance Standard (SAPS) for each server in the SAP system. |
| CPU | Number of CPUs on the on-premises server. |
| Max. CPUload[%] | The maximum CPU load in percentage of the on-premises server. Exclude the percentage symbol while filling this value. |
| RAM Size (GB) | RAM size in GB of the on-premises server. |
| CPU Type | CPU type of the on-premises server. For example, Xeon Platinum 8171M and Xeon E5-2673 v3. |
| HW Manufacturer | The manufacturer company of the on-premises server. |
| Model | Specify whether the on-premises hardware is a physical server or virtual machine. |
| CPU Mhz | The CPU clock speed of the on-premises server in MHz. |
| Total Disk Size(GB) | Total disk volume capacity in GB of the on-premises server. Include the disk volume for each individual disk and provide the total sum in this column. |
| Total Disk IOPS | Total disk IOPS of all disks on the on-premises server. |
| Source DB Size(GB) | The size of on-premises database in GB. |
| Target HANA RAM Size(GB) | This is an optional field and is “Not Applicable” for all SAP Instance Types except “DB”. Fill this field only when migrating an AnyDb database to SAP S/4HANA, and provide the desired target HANA database size. |

### Import SAP System inventory
After you added information to the import template file, proceed to import the template file from your machine to Azure Migrate.

1. In **Migration goals** > **Servers, databases and web apps** > **Azure Migrate | Servers, databases and web apps**, select **Discover**.
1. In **Discover** page, in **File type**, select **SAP® inventory (XLS)**.
1. In **How do you want to discover**, select **Import based**.
1. In **Import type**, select **.xls file for SAP Inventory**.

    :::image type="content" source="./media/tutorial-discover-sap-systems/import_excel.png" alt-text="Screenshot that shows how to import SAP inventory." lightbox="./media/tutorial-discover-sap-systems/import_excel.png":::
 
1. Upload the .xls file and select **Import**.
1. Review the import details to check for any errors or validation failures.<br> The discovered SAP systems are shown on the **Azure Migrate: Discovery and assessment** screen.
1. Select the hyperlink to navigate to a summary page displaying all the discovered SIDs.
1. Select a System SID.<br> The servers that comprise the SID display the details of all their attributes.


## Next steps
[Assess SAP System for migration](./tutorial-assess-sap-systems.md).

