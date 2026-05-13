---
title: Configure a Salesforce Source System
description: Learn how to configure Salesforce as a source system in Business Process Solutions, which includes following prerequisites, creating a Salesforce connection, and setting up the source system.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure a Salesforce source system

This article shows you how to configure a Salesforce source system in Business Process Solutions. To set up your Azure environment, follow the steps in the prerequisites in [Configure an SAP source system with Azure Data Factory](../business-process-solutions/configure-source-system-with-data-factory.md#prerequisites). This article also shows you how to set up the connection in your Business Process Solutions item.

## Prerequisites

Before you create a source system for Salesforce, follow these steps to create a connection to the Salesforce system from Microsoft Fabric:

1. To create a new connection, go to your workspace and select the **Settings** toolbar button in the upper-right corner of the page.
1. Select **Manage connections and gateways**.

   :::image type="content" source="./media/configure-salesforce-source-system/open-settings.png" alt-text="Screenshot that shows the Manage connections and gateways page." lightbox="./media/configure-salesforce-source-system/open-settings.png":::

1. Select **New**.

   :::image type="content" source="./media/configure-salesforce-source-system/new-connection.png" alt-text="Screenshot that shows the New button." lightbox="./media/configure-salesforce-source-system/new-connection.png":::

1. In the **New connection** input area, select the type as **Cloud**.
1. Enter the inputs for the fields:

   - **Connection name**: Enter the name.
   - **Connection type**: Select **Salesforce**.
   - **Login server**: Enter the URL.
   - **Class info**: Enter **object**.
   - **Authentication method**: Select **OAuth**. Select **Edit credentials** to enter the user name and password for the connection.

   :::image type="content" source="./media/configure-salesforce-source-system/create-salesforce-connection.png" alt-text="Screenshot that shows how to enter Salesforce connection details." lightbox="./media/configure-salesforce-source-system/create-salesforce-connection.png":::

1. Select **Create** to create the connection.
1. After the connection is created, open the connection, copy the connection ID, and keep it handy.

## Configure a Salesforce source system

To configure your source system, follow these steps:

1. On the home screen, select **Configure source system**.

   :::image type="content" source="./media/configure-salesforce-source-system/configure-source-system.png" alt-text="Screenshot that shows the Configure source system button." lightbox="./media/configure-salesforce-source-system/configure-source-system.png":::

1. Select **New source system**.

   :::image type="content" source="./media/configure-salesforce-source-system/create-source-system.png" alt-text="Screenshot that shows the New source system button." lightbox="./media/configure-salesforce-source-system/create-source-system.png":::

1. Enter the required field inputs in **System connection**:

   - **Fabric SQL database**: Enter the connection ID.
   - **Salesforce**: Enter the connection ID.
1. Select **Create** to begin deployment.

   :::image type="content" source="./media/configure-salesforce-source-system/create-salesforce-system.png" alt-text="Screenshot that shows the source system details input form." lightbox="./media/configure-salesforce-source-system/create-salesforce-system.png":::

1. Monitor the deployment status by using the refresh button to refresh the page.

   :::image type="content" source="./media/configure-salesforce-source-system/source-system-creating.png" alt-text="Screenshot that shows the deployment status monitoring view." lightbox="./media/configure-salesforce-source-system/source-system-creating.png":::

1. After the deployment is finished, you can see the resources deployed to your workspace.

## Next step

>[!div class="nextstepaction"]
>[Configure insights in Business Process Solutions](configure-insights.md)
