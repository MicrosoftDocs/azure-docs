---
title: Connect to Azure Government with SQL Server Management Studio | Microsoft Docs
description: Manage your subscription in Azure Government by connecting with SSMS.
services: azure-government
cloud: gov
documentationcenter: ''
author: yujhongmicrosoft
manager: zakramer

ms.assetid: faf269aa-e879-4b0e-a5ba-d4110684616a
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 12/01/2017
ms.author: yujhong
---


# Connect to Azure Government with SQL Server Management Studio 
To use SQL Server Management Studio (SSMS) with Azure Government, specify Azure Government as the environment to connect to, rather than Azure Public. 
To connect to computers that are running SQL Server in your Azure Government subscription, you must configure SSMS to connect to the Azure Government cloud. 

For general information about SSMS, see the [SSMS documentation](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).

## Set up an Azure SQL Server firewall rule
Before you connect to Azure Government from SSMS, you must set up an Azure SQL Server firewall rule to allow your local IP address to access your computer that's running SQL Server. 

Follow these steps to [Manage firewall rules by using the Azure portal](../sql-database/sql-database-firewall-configure.md#manage-firewall-rules-using-the-azure-portal). 

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
* Read more about [Azure Storage](https://docs.microsoft.com/azure/storage/). 
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/).
* Get help on Stack Overflow by using the [`azure-gov`](https://stackoverflow.com/questions/tagged/azure-gov) tag.
* Share feedback or request new features by using the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government).
