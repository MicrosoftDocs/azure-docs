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

## Configure an SAP S/4 HANA source system with open mirroring

To configure your SAP S/4 HANA source system with open mirroring, follow these steps:

1. On the home screen, select **Configure source system**.
1. Select **New source system**.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system.png" alt-text="Screenshot that shows New source system." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system.png":::

1. Enter the inputs for the fields.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-om-source-system.png" alt-text="Screenshot that shows the SAP S/4HANA input fields for source system configuration." lightbox="./media/configure-source-system-with-open-mirroring/create-om-source-system.png":::

1. In the **System connection** section, select the name of the mirroring partner. Add the connection ID for the connection that you created in the prerequisites in [Configure an SAP source system with Data Factory](../business-process-solutions/configure-source-system-with-data-factory.md#prerequisites). Select **Create** to start the deployment.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/enter-om-details.png" alt-text="Screenshot that shows how to enter SQL connection details." lightbox="./media/configure-source-system-with-open-mirroring/enter-om-details.png":::

1. Monitor the deployment status by using the refresh button to refresh the page.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/source-system-creating.png" alt-text="Screenshot that shows the deployment status monitoring view." lightbox="./media/configure-source-system-with-open-mirroring/source-system-creating.png":::

1. After the deployment is finished, you can see the resources that are deployed to your workspace.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/deployed-resources.png" alt-text="Screenshot that shows the deployed resources in the workspace." lightbox="./media/configure-source-system-with-open-mirroring/deployed-resources.png":::

## Configure an SAP ECC source system with open mirroring

1. On the home screen, select **Configure source system**.
1. Select **New source system**.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system.png" alt-text="Screenshot that shows  selecting New source system." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system.png":::

1. Enter the inputs for the fields.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system-mirror.png" alt-text="Screenshot that shows the SAP ECC input fields for source system configuration." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system-mirror.png":::

1. In the **System connection** section, select the name of the mirroring partner. Add the connection ID for the connection that you created in the prerequisites in [Configure an SAP source system with Azure Data Factory](../business-process-solutions/configure-source-system-with-data-factory.md#prerequisites). Select **Create** to start the deployment.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/enter-system-details.png" alt-text="Screenshot that shows entering SQL connection details for open mirroring." lightbox="./media/configure-source-system-with-open-mirroring/enter-system-details.png":::

1. You can monitor the deployment status by using the refresh button to refresh the page.

   :::image type="content" source="./media/configure-source-system-with-open-mirroring/source-system-creating.png" alt-text="Screenshot that shows the deployment status monitoring view." lightbox="./media/configure-source-system-with-open-mirroring/source-system-creating.png":::

1. After the deployment is finished, you can see the resources that are deployed to your workspace.

## Next step

>[!div class="nextstepaction"]
>[Configure insights in Business Process Solutions](configure-insights.md)