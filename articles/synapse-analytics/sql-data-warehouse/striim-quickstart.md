---
title: Striim quick start
description: Get started quickly with Striim and Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 02/15/2024
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
---

# Striim Azure Synapse Analytics Marketplace Offering Install Guide

This quickstart assumes that you already have a pre-existing instance of Azure Synapse Analytics.

1. Search for Striim in the Azure Marketplace, and select the Striim for Data Integration to Azure Synapse Analytics (Staged) option.

    ![Install Striim][install]

1. Configure the Striim Azure Virtual Machine (VM) with specified properties, noting down the Striim cluster name, password, and admin password.

    ![Configure Striim][configure]

1. Once deployed, select  `<VM Name>-masternode` in the Azure portal, select **Connect**, and copy the sign in using VM local account. 

    ![Connect Striim to Azure Synapse Analytics][connect]

1. Download the [Microsoft JDBC Driver for SQL Server](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server-support-matrix). Use the [latest supported version specified by Striim](https://www.striim.com/docs/). Install to your local machine. 

1. Open a command-line window, and change directories to where you downloaded the JDBC driver. SCP the driver file to your Striim VM, getting the address and password from the Azure portal.

    ![Copy driver file to your VM][copy-jar]

1. Open another command-line window, or use an ssh utility to ssh into the Striim cluster.

    ![SSH into the cluster][ssh]

1. Execute the following commands to move the file into Striim's lib directory, and start and stop the server.

   1. `sudo su`
   1. `cd /tmp`
   1. `mv sqljdbc42.jar /opt/striim/lib`
   1. `systemctl stop striim-node`
   1. `systemctl stop striim-dbms`
   1. `systemctl start striim-dbms`
   1. `systemctl start striim-node`

    ![Start the Striim cluster][start-striim]

1. Now, open your favorite browser and navigate to `<DNS Name>:9080`.

    ![Navigate to the login screen][navigate]

1. Sign in with the username and the password you set up in the Azure portal, and select your preferred wizard to get started, or go to the Apps page to start using the drag and drop UI.

    ![Log in with server credentials][login]

## Related content

- [Blog: Enabling real-time data warehousing with Azure SQL Data Warehouse](https://azure.microsoft.com/blog/enabling-real-time-data-warehousing-with-azure-sql-data-warehouse/)
- [Blog: Announcing Striim Cloud integration with Azure Synapse Analytics for continuous data integration](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-striim-cloud-integration-with-azure-synapse-analytics/ba-p/3593753)

[install]: ./media/striim-quickstart/install.png
[configure]: ./media/striim-quickstart/configure.png
[connect]:./media/striim-quickstart/connect.png
[copy-jar]:./media/striim-quickstart/copy-jar.png
[ssh]:./media/striim-quickstart/ssh.png
[start-striim]:./media/striim-quickstart/start-striim.png
[navigate]:./media/striim-quickstart/navigate.png
[login]:./media/striim-quickstart/login.png