---
title: Configure an SAP Source System with Open Mirroring
description: Learn how to configure SAP S/4HANA and SAP ECC source systems with open mirroring in Business Process Solutions, including setting up source system connections.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure an SAP source system with open mirroring

This article describes how to configure SAP S/4HANA and SAP ECC source systems by using open mirroring. In this scenario, Business Process Solutions processes the extracted data, and non-Microsoft tools handle data ingestion. Configure data extraction directly within the extraction solution that you chose.

## Prerequisites

### Set up a Fabric SQL Database connection

Business Process Solutions uses a Fabric SQL Database connection to read and orchestrate data processing. You must create this connection before you configure source system connections. To set up the connection, follow these steps:

1. To create a new connection, go to your workspace and select **Settings** in the upper-right corner.
1. Select **Manage connections and gateways**.

   :::image type="content" source="./media/deploy-workload-item/open-settings.png" alt-text="Screenshot that shows how to open the Settings page." lightbox="./media/deploy-workload-item/open-settings.png":::

1. Select **New**.

   :::image type="content" source="./media/deploy-workload-item/new-connection.jpg" alt-text="Screenshot that shows how to create a new connection." lightbox="./media/deploy-workload-item/new-connection.jpg":::

1. In the new connection input, select **Cloud** as the type.
1. Enter the connection name.
1. For the connection type, select **Fabric SQL Database**.
1. For the authentication method, select **OAuth** > **Edit Credentials** and enter the details.
1. Select **Create** to create the connection.

   :::image type="content" source="./media/deploy-workload-item/enter-connection-details.jpg" alt-text="Screenshot that shows how to enter connection details for a new connection." lightbox="./media/deploy-workload-item/enter-connection-details.jpg":::

1. Open the connection, copy the connection ID, and keep it handy.

   :::image type="content" source="./media/deploy-workload-item/copy-connection-details.png" alt-text="Screenshot that shows how to copy the connection ID." lightbox="./media/deploy-workload-item/copy-connection-details.png":::

## Configure an SAP S/4 HANA source system with open mirroring

To configure your SAP S/4 HANA source system with open mirroring, follow these steps:

1. On the home screen, select **Configure source system**.
     
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/configure-source-system.png" alt-text="Screenshot that shows Configure source system." lightbox="./media/configure-source-system-with-open-mirroring/configure-source-system.png":::

1. Select **New source system**.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system.png" alt-text="Screenshot that shows New source system." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system.png":::

1. Enter the inputs for the fields.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-om-source-system.png" alt-text="Screenshot that shows the SAP S/4HANA input fields for source system configuration." lightbox="./media/configure-source-system-with-open-mirroring/create-om-source-system.png":::

1. In the **System connection** section, select the name of the mirroring partner. Add the connection ID for the connection that you created in the prerequisites in [Configure an SAP source system with Data Factory](../business-process-solutions/configure-source-system-with-data-factory.md#prerequisites). Select **Create** to start the deployment.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/enter-om-details.png" alt-text="Screenshot that shows how to enter SQL connection details." lightbox="./media/configure-source-system-with-open-mirroring/enter-om-details.png":::

1. Monitor the deployment status by using the refresh button to refresh the page.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/source-system-creating.png" alt-text="Screenshot that shows the deployment status monitoring view." lightbox="./media/configure-source-system-with-open-mirroring/source-system-creating.png":::

1. After the deployment is finished, you can see the resources that are deployed to your workspace.

## Configure an SAP ECC source system with open mirroring

1. On the home screen, select **Configure source system**.
     
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/configure-source-system.png" alt-text="Screenshot that shows Configure source system." lightbox="./media/configure-source-system-with-open-mirroring/configure-source-system.png":::

1. Select **New source system**.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system.png" alt-text="Screenshot that shows  selecting New source system." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system.png":::

1. Enter the inputs for the fields.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system-mirror.png" alt-text="Screenshot that shows the SAP ECC input fields for source system configuration." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system-mirror.png":::

1. In the **System connection** section, select the name of the mirroring partner. Add the connection ID for the connection that you created in the prerequisites in [Configure an SAP source system with Azure Data Factory](../business-process-solutions/configure-source-system-with-data-factory.md#prerequisites). Select **Create** to start the deployment.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/enter-system-details.png" alt-text="Screenshot that shows entering SQL connection details for open mirroring." lightbox="./media/configure-source-system-with-open-mirroring/enter-system-details.png":::

1. You can monitor the deployment status by using the refresh button to refresh the page.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/monitor-sap-source-system-creation.png" alt-text="Screenshot that shows the deployment status monitoring view for sap ecc system." lightbox="./media/configure-source-system-with-open-mirroring/monitor-sap-source-system-creation.png":::

1. After the deployment is finished, you can see the resources that are deployed to your workspace.

## Next step

>[!div class="nextstepaction"]
>[Configure insights in Business Process Solutions](configure-insights.md)