---
title: Connect to Azure Government with SQL Server Management Studio | Microsoft Docs
description: Information on managing your subscription in Azure Government by connecting with SSMS
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
ms.date: 09/06/2017
ms.author: yujhong
---


# Connect to Azure Government with SQL Server Management Studio 
To use SSMS with Azure Government, you need to specify Azure Government as the environment to connect to instead of Azure Public. 
To connect to SQL Servers in your Azure Government subscription, you must configure SSMS to connect to the Azure Government cloud. 

For general information on SSMS, [navigate to the documentation](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).

## Setting up Azure SQL Server Firewall Rule
Before you connect to Azure Government from SSMS, you must set up an Azure SQL Server Firewall rule to allow your local IP address to access your Azure SQL Server. Follow the steps for "Manage Firewall rules using the Azure Portal" [here](../sql-database/sql-database-firewall-configure.md#manage-firewall-rules-using-the-azure-portal). 

## Specifying Azure Government as the environment to connect to
1. Open SSMS and navigate to **Tools -> Options -> Azure Services:**

    ![img1](./media/documentation-government-connect-with-ssms-img1.png)
2. Select the dropdown under **"Select an Azure Cloud"** and click on **"AzureUSGovernment":**

    ![img2](./media/documentation-government-connect-with-ssms-img2.png)

3. Navigate to **File -> Connect Object Explorer** and enter in your Azure SQL server name and authentication. 

    >[!Note]
    >Notice that the server name ends with ".usgovcloudapi.net"
    >
    >

    ![img3](./media/documentation-government-connect-with-ssms-img3.png)

Now that you have completed the steps above, your SSMS is now connected to your Azure Government subscription.

## Next Steps
* Read more about [Azure Storage](https://docs.microsoft.com/azure/storage/). 
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the "[azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)" tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government)
