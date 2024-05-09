---
title: Import on-premises servers in a VMware environment using RVTools XLSX (preview)
description: Learn how to import on-premises servers in a VMware environment by using the RVTools XLSX (preview).
author: snehasudhirG
ms.author: sudhirsneha
ms.topic: tutorial
ms.date: 03/22/2024
ms.service: azure-migrate
#Customer intent: As an VMware admin, I want to import my on-premises servers running in a VMware environment.
---

# Tutorial: Import servers running in a VMware environment with RVTools XLSX (preview)

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to discover the servers that are running in your VMware environment by using RVTools XLSX (preview). When you use this tool, you can control the data shared in the file and there's no need to set up the Azure Migrate appliance to discover servers. [Learn more](migrate-support-matrix-vmware.md#import-servers-by-using-rvtools-xlsx-preview).


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare an Azure account.
> * Set up an Azure Migrate project.
> * Import the RVTools XLSX file.

> [!NOTE]
> Tutorials show you the quickest path for trying out a scenario. They use default options where possible.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, ensure that you have the following prerequisites in place:

- Less than 20,000 servers in a single RVTools XLSX file.
- The file format should be XLSX.
- File sensitivity is set to **General** or file protection is set to **Any user**.
- [Operating system names](migrate-support-matrix.md) specified in the RVTools XLSX (preview) file contains and matches the supported names.
- The XLSX file should contain the vInfo & vDisk sheets and the VM, Powerstate, Disks, CPUs, Memory, Provisioned MiB, In use MiB, OS according to the configuration file, VM UUID columns from the vInfo sheet and the VM, Capacity MiB columns from the vDisk sheet should be present.

> [!NOTE]
> The number of disks that will be seen in the discovered and assessed machines will be one. However, the total configured and used storage capacity is being considered from the RVTools file import.
 

## Prepare an Azure user account

To create a project and register the Azure Migrate appliance, you must have an Azure user account that has the following permissions:

- Contributor or Owner permissions in Azure subscription. Complete the procedure to [set Contributor or Owner permissions in the Azure subscription](tutorial-discover-vmware.md#prepare-an-azure-user-account)
- Permissions to register Microsoft Entra apps.
- Owner or Contributor and User Access Administrator permission at subscription level to create an instance of Azure Key Vault, which is used during the agentless server migration.


## Set up an Azure Migrate project

Follow the instructions on [how to set up an Azure Migrate project](tutorial-discover-import.md#set-up-a-project).


## Import the servers using the RVTools XLSX file (preview)

To import the servers using RVTools XLSX (preview) file, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Migrate**.
1. Under **Migration goals**, select **Servers, databases and web apps**.
1. On **Azure Migrate | Servers, databases and web apps** page, under **Assessment tools**, select **Discover** and then select **Using import**.

    :::image type="content" source="./media/tutorial-import-vmware-using-rvtools-xlsx/navigation-using-import.png" alt-text="Screenshot that shows how to navigate to the RVTools import option." lightbox="./media/tutorial-import-vmware-using-rvtools-xlsx/navigation-using-import.png":::

1. In **Discover** page, in **File type**, select **VMware inventory (RVTools XLSX)**.
1. In the **Step 1: Import the file** section, select the RVTools XLSX file and then select **Import**.

    :::image type="content" source="./media/tutorial-import-vmware-using-rvtools-xlsx/select-import.png" alt-text="Screenshot that shows to upload, check status and selecting import." lightbox="./media/tutorial-import-vmware-using-rvtools-xlsx/select-import.png":::

    We recommend that you don't close the browser tab or attempt to import again while the current import is in progress. The import status provides information on the following:
    - If there are warnings in the status, you can either fix them or continue without addressing them.
    - To improve assessment accuracy, improve the server information as suggested in warnings. 
    - If the import status appears as **Failed**, you must fix the errors to continue with the import.
    
      :::image type="content" source="./media/tutorial-import-vmware-using-rvtools-xlsx/failed-status.png" alt-text="Screenshot that shows to status as failed." lightbox="./media/tutorial-import-vmware-using-rvtools-xlsx/failed-status.png"::: 
   
    - To view and fix errors, follow these steps:
        - Select *Download error details.XLSX* file. This operation downloads the XLSX with warnings included.
        - Review and address the errors as necessary.
        - Upload the modified file again.

When the **Import status** is marked as **Complete**, it implies that the server information is successfully imported.

## Update server information
To update the information for a server, follow these steps:

1. In the *Download error details.XLSX* file, update the rows.
1. To reimport the data, follow the steps from 1-5 in the [Import using the RVTools XLSX file (preview)](#import-the-servers-using-the-rvtools-xlsx-file-preview).

> [!NOTE]
> Currently, we don't support deleting servers after you import them into project.

## Verify servers in Azure portal

To verify that the servers appear in the Azure portal after importing, follow these steps:

1. Go to Azure Migrate dashboard.
1. On the **Azure Migrate | Servers, databases and web apps >** page, in  **Azure Migrate: Discovery and assessment** section, select the icon that displays the count for Discovered servers.
1. Select the **Import based** tab.


## Next steps

- Learn on [key benefits and limitations of using RVTools.XLSX](migrate-support-matrix-vmware.md#import-servers-by-using-rvtools-xlsx-preview).
