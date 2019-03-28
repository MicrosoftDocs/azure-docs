---
title: Query a SQL Server Linux Docker container in a virtual network from an Azure Databricks notebook
description: This article describes how to deploy Azure Databricks to your virtual network, also known as VNet injection.
services: azure-databricks
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: azure-databricks
ms.topic: conceptual
ms.date: 03/18/2019
---

# Tutorial: Query a SQL Server Linux Docker container in a virtual network from an Azure Databricks notebook

## Prerequisites

* Create a [Databricks workspace in a virtual network](quickstart-create-databricks-workspace-vnet-injection.md).

## Create a Linux virtual machine

1. In the Azure portal, select the icon for **Virtual Machines**. Then, select **+ Add**.

    ![Add new Azure virtual machine](./media/vnet-injection-sql-server/add-virtual-machine.png)

2. On the Basic tab, Choose Ubuntu Server 16.04 LTS. Change the VM size to B1ms, which has 1 VCPUS and 2GB RAM. The minimum requirement for a Linux SQL Server Docker container is 2GB. Choose an administrator username and password.

    ![Basics tab of new virtual machine configuration](./media/vnet-injection-sql-server/new-virtual-machine-basics.png)

3. Navigate to the **Networking** tab. Choose the virtual network and public subnet you created. Select **Review + create**, then **Create** to deploy the virutal machine.

    ![Networking tab of new virtual machine configuration](./media/vnet-injection-sql-server/new-virtual-machine-networking.png)