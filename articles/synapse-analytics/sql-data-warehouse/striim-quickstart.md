---
title: Striim quick start
description: Get started quickly with Striim and Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 08/20/2024
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
---
# Striim Azure Synapse Analytics Marketplace Offering Install Guide

This quickstart assumes that you already have a preexisting instance of Azure Synapse Analytics.

1. Search for Striim in the Azure Marketplace, and select the "Striim for Data Integration to Azure Synapse Analytics (Staged)" option.

1. Configure the Striim Azure Virtual Machine (VM) with specified properties, noting down the Striim cluster name, password, and admin password.

1. Once deployed, select `<VM Name>-masternode` in the Azure portal, select **Connect**, and copy the sign in using VM local account. 

1. Download the [Microsoft JDBC Driver for SQL Server](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server-support-matrix). Use the [latest supported version specified by Striim](https://www.striim.com/docs/). Install to your local machine. 

1. Open a command-line window, and change directories to where you downloaded the JDBC driver. SCP the driver file to your Striim VM, getting the address and password from the Azure portal.

1. Open another command-line window, or use an ssh utility to ssh into the Striim cluster.

    :::image type="content" source="media/striim-quickstart/ssh.png" alt-text="Screenshot from the Azure portal of SSH into the cluster.":::

1. Execute the following commands to move the file into Striim's lib directory, and start and stop the server.

   1. `sudo su`
   1. `cd /tmp`
   1. `mv sqljdbc42.jar /opt/striim/lib`
   1. `systemctl stop striim-node`
   1. `systemctl stop striim-dbms`
   1. `systemctl start striim-dbms`
   1. `systemctl start striim-node`

    :::image type="content" source="media/striim-quickstart/start-striim.png" alt-text="Screenshot from the Azure portal of starting the Striim cluster.":::

1. Now, open your favorite browser and navigate to `<DNS Name>:9080`.

    :::image type="content" source="media/striim-quickstart/navigate.png" alt-text="Screenshot from the Azure portal of the sign in screen." lightbox="media/striim-quickstart/navigate.png":::

1. Sign in with the username and the password you set up in the Azure portal, and select your preferred wizard to get started, or go to the Apps page to start using the drag and drop UI.

    :::image type="content" source="media/striim-quickstart/login.png" alt-text="Screenshot from the Azure portal of a sign in with server credentials." lightbox="media/striim-quickstart/login.png":::

## Related content

- [Blog: Enabling real-time data warehousing with Azure SQL Data Warehouse](https://azure.microsoft.com/blog/enabling-real-time-data-warehousing-with-azure-sql-data-warehouse/)
- [Blog: Announcing Striim Cloud integration with Azure Synapse Analytics for continuous data integration](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/announcing-striim-cloud-integration-with-azure-synapse-analytics/ba-p/3593753)
