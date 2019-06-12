---
title: Striim quick start with Azure SQL Data Warehouse | Microsoft Docs
description: Get started quickly with Striim and Azure SQL Data Warehouse.
services: sql-data-warehouse
author: mlee3gsd 
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: integration
ms.date: 10/12/2018
ms.author: martinle
ms.reviewer: igorstan
---

# Striim Azure SQL DW Marketplace Offering Install Guide

This quickstart assumes that you already have a pre-existing instance of SQL Data Warehouse.

Search for Striim in the Azure Marketplace, and select the Striim for Data Integration to SQL Data Warehouse (Staged) option 

![Install Striim][install]

Configure the Striim VM with specified properties, noting down the Striim cluster name, password, and admin password

![Configure Striim][configure]

Once deployed, click on \<VM Name>-masternode in the Azure portal, click Connect, and copy the Login using VM local account 

![Connect Striim to SQL Data Warehouse][connect]

Download the sqljdbc42.jar from <https://www.microsoft.com/en-us/download/details.aspx?id=54671> to your local machine. 

Open a command-line window, and change directories to where you downloaded the JDBC jar. SCP the jar file to your Striim VM, getting the address and password from the Azure portal

![Copy jar file to your VM][copy-jar]

Open another command-line window, or use an ssh utility to ssh into the Striim cluster

![SSH into the cluster][ssh]

Execute the following commands to move the JDBC jar file into Striim’s lib directory, and start and stop the server.

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
