---
title: Striim quick start
description: Get started quickly with Striim and Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 10/12/2018
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: seo-lt-2019
---

# Striim Azure Synapse Analytics Marketplace Offering Install Guide

This quickstart assumes that you already have a pre-existing instance of Azure Synapse Analytics.

Search for Striim in the Azure Marketplace, and select the Striim for Data Integration to Azure Synapse Analytics (Staged) option 

![Install Striim][install]

Configure the Striim VM with specified properties, noting down the Striim cluster name, password, and admin password

![Configure Striim][configure]

Once deployed, click on \<VM Name>-masternode in the Azure portal, click Connect, and copy the Login using VM local account 

![Connect Striim to Azure Synapse Analytics][connect]

Download the [Microsoft JDBC Driver 4.2 for SQL Server](https://www.microsoft.com/download/details.aspx?id=54671) file to your local machine. 

Open a command-line window, and change directories to where you downloaded the JDBC driver. SCP the driver file to your Striim VM, getting the address and password from the Azure portal.

![Copy driver file to your VM][copy-jar]

Open another command-line window, or use an ssh utility to ssh into the Striim cluster.

![SSH into the cluster][ssh]

Execute the following commands to move the file into Striim's lib directory, and start and stop the server.

   1. sudo su
   2. cd /tmp
   3. mv sqljdbc42.jar /opt/striim/lib
   4. systemctl stop striim-node
   5. systemctl stop striim-dbms
   6. systemctl start striim-dbms
   7. systemctl start striim-node

![Start the Striim cluster][start-striim]

Now, open your favorite browser and navigate to \<DNS Name>:9080

![Navigate to the login screen][navigate]

Log in with the username and the password you set up in the Azure portal, and select your preferred wizard to get started, or go to the Apps page to start using the drag and drop UI

![Log in with server credentials][login]



[install]: ./media/striim-quickstart/install.png
[configure]: ./media/striim-quickstart/configure.png
[connect]:./media/striim-quickstart/connect.png
[copy-jar]:./media/striim-quickstart/copy-jar.png
[ssh]:./media/striim-quickstart/ssh.png
[start-striim]:./media/striim-quickstart/start-striim.png
[navigate]:./media/striim-quickstart/navigate.png
[login]:./media/striim-quickstart/login.png
