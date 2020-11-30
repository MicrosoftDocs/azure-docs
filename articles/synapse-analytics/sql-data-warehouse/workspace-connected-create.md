---
title: Enabling Synapse workspace features
description: This document describes how a customer can enable the Synapse workspace features on a dedicated SQL pool (formerly SQL DW).  
services: synapse-analytics
author: antvgski
manager: igorstan
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw 
ms.date: 11/25/2020
ms.author: anvang
ms.reviewer: jrasnick
---

# Enabling Synapse workspace features for a dedicated SQL pool (formerly SQL DW)

Users can enable a existing dedicated SQL pool (formerly SQL DW) to use a workspace and Synapse Studio without impacting automation, connections or tooling. This article explains how to enable workspace features for an existing dedicated SQL pool (formerly SQL DW). Once enabled, you can take advantage of the new feature-rich capabilities in the Synapse workspace using Synapse Studio. 

## Prerequisites

Before you enable the Synapse workspace features on your data warehouse, you must ensure that you have the following
- Rights to create and manage the SQL resources hosted on the SQL logical server.
- Rights to create Synapse resources.
- An Azure Active Directory admin identified on the logical server

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Enabling Synapse workspace features for an existing dedicated SQL pool (formerly SQL DW)

The Synapse workspace features can be enabled on any existing dedicated SQL pool (formerly SQL DW) in a supported region. This capability is only available via the Azure portal.

Follow these steps to create a Synapse workspace for you existing data warehouse.
1. Select an existing dedicated SQL pool (formerly SQL DW) and open the overview page.
2. Select **New Synapse workspace** in the top menu bar or the message immediately below.
3. After reviewing the list of data warehouses that will be made available via the new Synapse workspace on the **Create new Azure Synapse workspace** page. Select **Continue** to proceed.
4. On the Basics page, the existing dedicated SQL pool (the **Project** details section should be pre-populated with the same **Subscription** and **Resource group** that the logical server is deployed under. And under **Workspace details** the **Workspace** name is pre-populated with the same name and region of the SQL logical server to ensure the connection between your new Synapse workspace and the logical server can be created during provisioning process. Post provisioning this connection must be retained to ensure continued access to the dedicated SQL pool (formerly SQL DW) instances via the workspace and Studio.
5. Navigate to Select Data Lake Storage Gen 2.
6. Click **Create new** or select an existing **Data Lake Storage Gen2** before then click **Next: Networking**.
7. Choose a **SQL administrator password** for your **Serverless instance**. Changing this password does not update or change the logical server SQL credentials. If you prefer a system defined password, leave these fields empty. This password can be change at any time within the new workspace. The admin name must be the same used on the SQL Server.
8. Select your preferred **Networking settings** and click **Review + Create** to start workspace provisioning.
9. Select **Goto resource** to open your new workspace.

    > [!NOTE]
    > All dedicated SQL pool (formerly SQL DW) instances hosted on the logical server will be available via the new workspace.

## Post provisioning steps
The following steps must be completed to ensure that your existing dedicated SQL pool (formerly SQL DW) instances can be accessed via the Synapse Studio.
1. In the Synapse workspace overview page select **Connected server**, this will take you to the connected SQL Logical server that hosts you data warehouses. In the essential menu, select **Connected server**.
2. Open **Firewalls and virtual networks** and ensure that your client IP or a predetermined IP range has access to the logical server.
3. Open **Active Directory admin** and ensure that an AAD admin has been set on the logical server.
4. Select one of the dedicated SQL pool (formerly SQL DW) instances hosted on the logical server. In the overview page, select **Launch Synapse Studio** or Go to the [Sign in to the Synapse Studio](https://web.azuresynapse.net) and sign in to your workspace.

5. Open the **Data hub** and expand the dedicated SQL pool in the Object explorer to ensure that you have access and can query your data warehouse.

## Next steps
Getting started with [Synapse Workspace and Studio](../get-started.md).
