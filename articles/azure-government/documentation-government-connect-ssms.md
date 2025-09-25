---
title: Connect to Azure Government with SQL Server Management Studio
description: Manage your subscription in Azure Government by connecting with SQL Server Management Studio (SSMS).
services: azure-government
ms.service: azure-government
ms.topic: article
ms.date: 10/01/2021
ms.custom: sfi-image-nochange
---

# Develop with SQL Server Management Studio 

To use SQL Server Management Studio (SSMS) with Azure Government, specify Azure Government as the environment to connect to, rather than global Azure. To connect to computers that are running SQL Server in your Azure Government subscription, you must configure SSMS to connect to the Azure Government cloud. 

For general information about SSMS, see the [SSMS documentation](/sql/ssms/download-sql-server-management-studio-ssms).

If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.

## Prerequisites

- Review [Guidance for developers](./documentation-government-developer-guide.md). This article discusses Azure Government's unique URLs and endpoints for managing your environment. You must know about these endpoints in order to connect to Azure Government. 
- Review [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md) and click on a service of interest to see variations between Azure Government and global Azure.

## Set up an Azure SQL Server firewall rule

Before you connect to Azure Government from SSMS, you must set up an Azure SQL Server firewall rule to allow your local IP address to access your computer that's running SQL Server. 

Follow these steps to [Manage firewall rules by using the Azure portal](/azure/azure-sql/database/firewall-configure#use-the-azure-portal-to-manage-server-level-ip-firewall-rules).

## Specify Azure Government as the environment to connect

1. Open SSMS. Browse to **Tools** > **Options** > **Azure Services**.

    ![SSMS Tools](./media/documentation-government-connect-with-ssms-img1.png)

2. In the **Select an Azure Cloud** drop-down, select **AzureUSGovernment**.

    ![SSMS Options](./media/documentation-government-connect-with-ssms-img2.png)

3. Browse to **File** > **Connect Object Explorer**. Enter the name of your computer that's running SQL Server. Enter your authentication information. 

    >[!Note]
    >The name of the computer that's running SQL Server ends with **.usgovcloudapi.net**.
    >
    >

    ![Connect to a computer that's running SQL Server](./media/documentation-government-connect-with-ssms-img3.png)

SSMS is now connected to your Azure Government subscription.

## Next steps

- Read more about [Azure Storage](../storage/index.yml). 
- Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/).
- Get help on Stack Overflow by using the [`azure-gov`](https://stackoverflow.com/questions/tagged/azure-gov) tag.
