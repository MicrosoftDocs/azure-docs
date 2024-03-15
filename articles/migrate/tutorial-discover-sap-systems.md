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

# Tutorial: Discover SAP systems with Azure Migrate: Discovery and Assessment

As part of your migration journey to Azure, discover your on-premises SAP inventory and workloads.

This tutorial explains how to prepare an import file with server inventory details and import them to discover the SAP systems within Azure Migrate.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure Migrate project
> * Prepare an import file.
> * Import the server inventory and perform an assessment

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and use default options. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Set up an Azure Migrate project

To set up a migration project, follow these steps:
1. Sign into [Azure portal](https://ms.portal.azure.com/#home), search for **Azure Migrate**.
1. On the **Get started** page, select **Discover, assess and migrate**.
1. On **Azure Migrate | Servers, databases and web apps**, select **Create project**.
1. On the **Create project** page, do the following:
    1. **Subscription**: Select your Azure subscription.
    1. **Resource group**: Select your resource group. If you don't have a resource group, select **Create new** to create one.
1. Under **PROJECT DETAILS**, do the following:
    1. **Project**: Enter the project name.
    1. **Region**: Select the region in which you want to create the project.
    
> [!Note]
> Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity)

1. Select **Create**. <br/>Wait for a few minutes for the project deployment. The Azure Migrate: Discovery and assessment tool is added by default to the new project.
    
    :::image type="content" source="./media/tutorial-discover-sap-systems/create-project-sap.png" alt-text="Screenshot that shows how to create a project." lightbox="./media/tutorial-discover-sap-systems/create-project-sap.png":::
    
## Prepare the import file

To prepare the import file, do the following:
- Download the template file.
- Add the server inventory details into the template file.
- Import the template file in the portal.

### Download the template

To download the template, follow these steps:
1. On the **Azure Migrate** page, and under **Migration goals**, select **Servers, databases and web apps**.
1. Under **Assessments tools** section, select **Using import** from the **Discover** dropdown menu.
1. On the **Discover** page, in the **File type**, select **SAP® inventory (XLS)**.
1. Select **Download** to download the template.

    :::image type="content" source="./media/tutorial-discover-sap-systems/download-template.png" alt-text="Screenshot that shows how to download a template." lightbox="./media/tutorial-discover-sap-systems/download-template.png":::

> [!Note]
   > To avoid any duplication or inadvertent errors affecting from one discovery file to another discovery file, we recommend you use a new file for every discovery that you plan to run.
   > Use the [sample import file templates](https://github.com/Azure/Discovery-and-Assessment-for-SAP-systems-with-AzMigrate/tree/main/Import%20file%20samples) as guidance to prepare the import of your SAP landscape.

### Add on-premises SAP infrastructure

Collect on-premises SAP system inventory and add it into the template file.
- To collect data, you export it from the SAP system and fill in the template with the [relevant on-premises SAP system inventory](https://microsoftapc.sharepoint.com/teams/SAPEmbrace95/Shared%20Documents/Forms/AllItems.aspx?id=%2Fteams%2FSAPEmbrace95%2FShared%20Documents%2FGeneral%2FEngineering%20New%2FFeature%20Discussions%2FAZ%2DMigrate%2FSAP%5FCOLLECTOR%5FADVISOR%2FE2E%20Tests%2FCases%20V3%20%28SelfHost%29&p=true&ga=1&LOF=1).
- To review sample data, download the [sample import file](https://github.com/Azure/Discovery-and-Assessment-for-SAP-systems-with-AzMigrate/tree/main/Import%20file%20samples).


The following table summarizes the file fields to fill in:
    
| **Template Column** | **Description** |
| --- | --- |
| Server Name | Unique server name or host name of the SAP system to identify each server. Include all the virtual machines attached to an SAP system that you intend to migrate to Azure. |
| Environment | Environment that the server belongs to. Select the most applicable environment from the dropdown menu. |
| SAP Instance Type | The type of SAP instance running on this machine. For example, App, ASCS, DB, and so on. Single-server and distributed architectures are only supported. |
| Instance SID | This is the instance System ID (SID) for the ASCS/AP/DB instance. |
| System SID | SID of SAP System. |
| Landscape SID | SID of the customer's production system in each landscape. |
| Application | Optional column to specify any organizational identifier, such as HR, Finance, Marketing, and so on. |
| SAP Product | SAP application component. For example, SAP S/4HANA 2022, SAP ERP ENHANCE, and so on. |
| SAP Product Version | The version of the SAP product. |
| Operating System | The operating system running on the host server. |
| Database Type | This column is applicable only if **SAP Instance Type** column is **Database**. Select the database such as SQL, Oracle, S4/Hana, and so on from the dropdown list.  |
| SAPS | The SAP Application Performance Standard (SAPS) for each server in the SAP system. |
| CPU | The number of CPUs on the on-premises server. |
| Max. CPUload[%] | The maximum CPU load in percentage of the on-premises server. Exclude the percentage symbol while filling this value. |
| RAM Size (GB) | RAM size in GB of the on-premises server. |
| CPU Type | CPU type of the on-premises server. For example, Xeon Platinum 8171M, and Xeon E5-2673 v3. |
| HW Manufacturer | The manufacturer company of the on-premises server. |
| Model | The on-premises hardware is either a physical server or virtual machine. |
| CPU Mhz | The CPU clock speed of the on-premises server in MHz. |
| Total Disk Size(GB) | Total disk volume capacity in GB of the on-premises server. Include the disk volume for each individual disk and provide the total sum in this column. |
| Total Disk IOPS | Total disk Input/Output Operations Per Second (IOPS) of all the disks on the on-premises server. |
| Source DB Size(GB) | The size of on-premises database in GB. |
| Target HANA RAM Size(GB) | This is an optional field and is **Not Applicable** for all SAP Instance Types except **DB**. Fill this field only when migrating an AnyDb database to SAP S/4HANA and provide the desired target HANA database size. |

### Import SAP Systems inventory
After you add information to the import template file, import the template file from your machine to Azure Migrate.

To import SAP Systems inventory, follow these steps:

1. Under **Migration goals**, select **Servers, databases and web apps**.
1. Under **Assessments tools** section, select **Using import** from the **Discover** dropdown menu.
1. On the **Discover** page, do the following: 
    1. **File type**: select **SAP® inventory (XLS)**.
    1. **How do you want to discover**: select **Import based**.
    1. **Import type**: select **.xls file for SAP Inventory**.

    :::image type="content" source="./media/tutorial-discover-sap-systems/import-excel.png" alt-text="Screenshot that shows how to import SAP inventory." lightbox="./media/tutorial-discover-sap-systems/import-excel.png":::
 
1. Under **Import the file**, upload the .xls file and select **Import**.
1. Review the import details to check for any errors or validation failures.<br> If the import is successful, the SAP systems are discovered.
1. To view the discovered SAP systems, do the following:
    1. Navigate to the **Azure Migrate: Servers, databases and web apps** screen.
    1. Under **Assessment tools**, select the number below **Discovered SAP® systems**. <br/> The discovered SAP systems displayed on the **Discovered SAP® systems** page.
    2. Select a desired system SID.<br> The **Server instance details** blade displays all attributes of servers that make up the SID.


## Next steps
[Assess SAP System for migration](./tutorial-assess-sap-systems.md).

