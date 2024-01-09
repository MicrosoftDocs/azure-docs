---
title: Import on-premises servers in a VMware environment using RVTools XLSX (preview)
description: Learn how to import on-premises servers in a VMware environment by using the RVTools XLSX (preview).
author: snehasudhirG
ms.author: sudhirsneha
ms.topic: tutorial
ms.date: 01/09/2024
ms.service: azure-migrate
#Customer intent: As an VMware admin, I want to import my on-premises servers running in a VMware environment.
---

# Tutorial: Import servers running in a VMware environment with RVTools XLSX (preview)

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to discover the servers that are running in your VMware environment by using RVTools XLSX (preview). When you are using the tool, you can control the data you share in the file and there's no need to set up the Azure Migrate appliance to discover servers. [Learn more]


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare an Azure account.
> * Set up an Azure Migrate project.
> * Import the RVTools XLSX file.

> [!NOTE]
> Tutorials show you the quickest path for trying out a scenario. They use default options where possible.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, check that you have these prerequisites in place:

- Ensure that you have 20,000 servers in a single XLSX file and in an Azure Migrate project.
- Ensure that the operating system names specified in the RVTools XLSX (preview) file contains and matches the supported names.
- Ensure that the file protection is set to **General** or **Any user**.

## Prepare an Azure user account

To create a project and register the Azure Migrate appliance, you must have an Azure account that has the following permissions:

- Contributor or Owner permissions in Azure subscription
- Permissions to register Microsoft Entra apps
- Owner or Contributor and User Access Administrator permission at subscription level to create an instance of Azure Key Vault, which is used during the agentless server migration.
- Complete the procedure to [set Contributor or Owner permissions in the Azure subscription](tutorial-discover-vmware.md#prepare-an-azure-user-account).


## Set up an Azure Migrate project

Follow the instructions on [how to set up an Azure Migrate project](tutorial-discover-import.md#set-up-a-project).


## Import using the RVTools XLSX file(preview)

To import the servers using RVTools XLSX (preview) file, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Migrate**.
1. Under **Migration goals**, select **Servers, databases and web apps**.
1. On **Azure Migrate | Servers, databases and web apps** page, under **Assessment tools**, select **Discover** and then select **Using import**.

    :::image type="content" source="./media/tutorial-import-vmware-using-rvtools-xlsx/navigation-using-import.png" alt-text="Screenshot that shows how to navigate to the RVTools import option." lightbox="./media/tutorial-import-vmware-using-rvtools-xlsx/navigation-using-import.png":::

1. In **Discover** page, in **File type**, select **VMware inventory (RVTools XLSX)**.
1. In the **Import the file** section, select the RVTools XLSX file and then select **Import**.

    :::image type="content" source="./media/tutorial-import-vmware-using-rvtools-xlsx/select-import.png" alt-text="Screenshot that shows to upload, check status and selecting import." lightbox="./media/tutorial-import-vmware-using-rvtools-xlsx/select-import.png":::

    We recommend that you don't close the browser tab or attempt to import again while the current import is in progress. The import status provides information on the following:
    - If there are warnings in the status, you can either fix them or continue without addressing them.
    - To improve assessment accuracy, improve the server information as suggested in warnings. 
    - If the import status appears as **Failed**, you must fix the errors to continue with the import.
      :::image type="content" source="./media/tutorial-import-vmware-using-rvtools-xlsx/failed-status.png" alt-text="Screenshot that shows to status as failed." lightbox="./media/tutorial-import-vmware-using-rvtools-xlsx/failed-status.png.png"::: 
   
    - To view and fix warnings, follow these steps:
        - Select *Download warning details.XLSX*. This operation downloads the XLSX with warnings included.
        - Review and address the errors as necessary.
        - Upload the modified file again.

When the **Import status** is marked as **Complete**, it implies that the server information is successfully imported.

 
## Next steps

- Learn how to [assess servers to migrate to Azure VMs](./tutorial-assess-vmware-azure-vm.md).
- Learn how to [assess servers running SQL Server to migrate to Azure SQL](./tutorial-assess-sql.md).
- Learn how to [assess web apps to migrate to Azure App Service](./tutorial-assess-webapps.md).
- Review [data the Azure Migrate appliance collects](discovered-metadata.md#collected-metadata-for-vmware-servers) during discovery.
