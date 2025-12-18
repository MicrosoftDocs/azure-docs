---
title: Import on-premises servers in a VMware environment using RVTools XLSX (preview)
description: Learn how to import on-premises servers in a VMware environment by using the RVTools XLSX (preview).
author: habibaum
ms.author: v-uhabiba
ms.topic: tutorial
ms.date: 05/12/2025
ms.service: azure-migrate
ms.custom: vmware-scenario-422
# Customer intent: As a VMware administrator, I want to import my on-premises server data using RVTools XLSX, so that I can efficiently migrate my servers to Azure without needing to set up additional discovery tools.
---

# Tutorial: Import servers running in a VMware environment with RVTools XLSX (preview)

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to discover the servers that are running in your VMware environment by using RVTools XLSX (preview). When you use this tool, you can control the data shared in the file and there's no need to set up the Azure Migrate appliance to discover servers. [Learn more](migrate-support-matrix-vmware.md#import-servers-using-rvtools-xlsx-preview).

> [!NOTE]
> * RVTools had a supply chain attack on May 12, 2025. The attack injected malware to the RVTools installer. Customers should download RVTools only from official websites and verify that the installer’s file hash matches on the official website. Customers should run anti-malware software to find any harmful programs.
> * Microsoft doesn't own or support RVTools. Customers use the software at their own risk.

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
- [Operating system names](tutorial-discover-import.md#supported-operating-system-names) specified in the RVTools XLSX (preview) file contains and matches the supported names.
- The XLSX file should contain the vInfo, vHost, vDatastore, vSnapshot, vPartition & vMemory sheets. The columns in these sheets are as follows:
    - **vInfo** - VM, Powerstate, CPUs, Memory, Provisioned MiB, In use MiB, OS according to the configuration file, VM UUID.
    - **vHost** - Host, Cluster, Datacenter, Config status, in Maintenance Mode, in Quarantine Mode, CPU Model, Speed, #CPU, Cores per CPU, # Cores, CPU usage %, # Memory, Memory usage %, VM Used memory, VM Memory Swapped, VM Memory Ballooned, #NICs, # vCPUs, vRAM, ESX Version, Vendor, Model, Object ID, UUID, 
    - **vDatastore** - Name, Type, Hosts, Capacity MiB, Provisioned MiB, In Use MiB, Object ID
    - **vSnapshot** - VM, Powerstate, Size MiB (vmsn), Size MiB (total), Quiesced, Datacenter, Cluster, Host, VM UUID
    - **vPartition** - VM, VM UUID, Capacity MiB, Consumed MiB.
    - **vMemory** - VM, VM UUID, Size MiB, Reservation.

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
    :::image type="content" source="./media/tutorial-discover-vmware/azure-migrate.png" alt-text="Screenshot that shows how to navigate to Azure Migrate on Azure portal." lightbox="./media/tutorial-discover-vmware/azure-migrate.png":::

1. Click on **View all projects** to navigate to the list of all projects created in your subscription.
    :::image type="content" source="./media/tutorial-discover-vmware/view-projects.png" alt-text="Screenshot that shows how to navigate to all projects created." lightbox="./media/tutorial-discover-vmware/view-projects.png":::

1. Click on the search bar to filter the project you want to import the RVTools file into.

    :::image type="content" source="./media/tutorial-discover-vmware/view-project.png" alt-text="Screenshot that shows how to filter project." lightbox="./media/tutorial-discover-vmware/view-project.png":::

1. Click on the name of the project you want to open.
1. If you are importing data for the first time, click on **Start discovery** and then on **Using custom import**.
    :::image type="content" source="./media/tutorial-discover-vmware/start-import.png" alt-text="Screenshot that shows how to start discovery using file import." lightbox="./media/tutorial-discover-vmware/start-import.png":::
 
1. In the **File type** drop-down, choose **VMware inventory (RVTools XLSX)**.

    :::image type="content" source="./media/tutorial-discover-vmware/file-drop-down.png" alt-text="Screenshot that shows file type drop-down and to choose RVTools XLSX." lightbox="./media/tutorial-discover-vmware/file-drop-down.png":::

1. Click on **Browse** and choose the RVTools XLSX file you want to import and click on **Import**.
1. We recommend that you don't close the browser tab or attempt to import again while the current import is in progress. The import status provides information on the following:
    - If there are warnings in the status, you can either fix them or continue without addressing them.
    - To improve assessment accuracy, improve the server information as suggested in warnings. 

    :::image type="content" source="./media/tutorial-discover-vmware/import-successful.png" alt-text="Screenshot that shows RVTools XLSX successful." lightbox="./media/tutorial-discover-vmware/import-successful.png":::

    - If the import status appears as **Failed**, you must fix the errors to continue with the import.
    
      :::image type="content" source="./media/tutorial-import-vmware-using-rvtools-xlsx/failed-status.png" alt-text="Screenshot that shows to status as failed." lightbox="./media/tutorial-import-vmware-using-rvtools-xlsx/failed-status.png"::: 
   
    - To view and fix errors, follow these steps:
        - Click on **Download this file, rectify the errors and re-upload the file.**. This downloads the XLSX with warnings and errors included.
        - Review and address the errors as necessary.
        - Upload the modified file again.

1. When the **Import status** is marked as **Complete**, it implies that the server information is successfully imported.

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

- Learn on [key benefits and limitations of using RVTools.XLSX](migrate-support-matrix-vmware.md#import-servers-using-rvtools-xlsx-preview).
