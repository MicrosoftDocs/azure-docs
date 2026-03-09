---
title: Configure Salesforce source system
description: Learn how to configure Salesforce as a source system in Business Process Solutions, including prerequisites, creating a Salesforce connection, and setting up the source system.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure Salesforce source system

In this article, we'll describe the steps required to configure Salesforce source system in Business Process Solutions. This document contains steps on prerequisites needed in your Azure environment and details on how to set up the connection in your Business Process Solution item.

## Prerequisites

Before we create source system for salesforce, use the following steps to create a connection to the salesforce system from Microsoft Fabric:

1. To create a new connection, navigate to your workspace and click on the settings button on the top right of the page.
2. Click on the **Manage connections and gateways** button.

   :::image type="content" source="./media/configure-salesforce-source-system/open-settings.png" alt-text="Screenshot showing how to open the settings page." lightbox="./media/configure-salesforce-source-system/open-settings.png":::
3. Click on **New** Button.

   :::image type="content" source="./media/configure-salesforce-source-system/new-connection.png" alt-text="Screenshot showing the manage connections and gateways page." lightbox="./media/configure-salesforce-source-system/new-connection.png":::
4. In the new connection input, select the Type as **Cloud**.
5. Enter the connection name.
6. Select Connection type as **Salesforce**.
7. Enter the Login Server URL.
8. In the class info, enter '**object**'.
9. For the authentication method, select **OAuth** and click on **Edit credentials** to Enter the user name and password for the connection.
   :::image type="content" source="./media/configure-salesforce-source-system/create-salesforce-connection.png" alt-text="Screenshot showing how to enter Salesforce connection details." lightbox="./media/configure-salesforce-source-system/create-salesforce-connection.png":::
10. Click on **Create** Button to create the connection.
11. Once the connection is created, open the connection and copy the connection ID and keep it handy.

## Configure Salesforce source system

Use the following steps to configure your source system:

1. On the home screen, click on **Configure source system** button.
2. Click on the **New source system** button.
   :::image type="content" source="./media/configure-salesforce-source-system/create-source-system.png" alt-text="Screenshot showing the new source system button." lightbox="./media/configure-salesforce-source-system/create-source-system.png":::
3. Enter the required field inputs. In System connection, add the Fabric SQL and Salesforce connection IDs. Click **Create** to begin deployment.
   :::image type="content" source="./media/configure-salesforce-source-system/create-salesforce-system.png" alt-text="Screenshot showing the source system details input form." lightbox="./media/configure-salesforce-source-system/create-salesforce-system.png":::
4. You can monitor the deployment status by refreshing the page using the refresh button.
5. Once the deployment is done, you should be able to see the resources deployed to your workspace.

## Next steps

Now that you have configured Salesforce source system in your Business Process Solution item, you can proceed to configure dataset and relationships.

- [Configure Dataset in Business Process Solutions](configure-dataset.md)
