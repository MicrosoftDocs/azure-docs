---
title: Configure SAP source system with Open Mirroring
description: Learn how to configure SAP S/4HANA and SAP ECC source systems with Open Mirroring in Business Process Solutions, including setting up source system connections.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure SAP source system with Open Mirroring

This article describes how to configure SAP S/4HANA and SAP ECC source systems using Open Mirroring. In this scenario, Business Process Solutions processes the extracted data, while data ingestion is handled by third-party tools. Data extraction should be configured directly within your chosen extraction solution.

## Configure SAP S/4 HANA source system with Open Mirroring

Use the following steps to configure your SAP S/4 HANA source system with Open Mirroring.

1. On the home screen, click on **Configure source system** button.
2. Click on the **New source system** button.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system.png" alt-text="Screenshot showing the new source system button." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system.png":::
3. Provide the inputs for the fields.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-om-source-system.png" alt-text="Screenshot showing the SAP S/4HANA input fields for source system configuration." lightbox="./media/configure-source-system-with-open-mirroring/create-om-source-system.png":::
4. In the System connection section, Select the name of the mirroring partner, and add the connection ID for the connection we created in the prerequisite step. Finally click on **Create** button to start the deployment.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/enter-om-details.png" alt-text="Screenshot showing how to enter SQL connection details." lightbox="./media/configure-source-system-with-open-mirroring/enter-om-details.png":::
5. You can monitor the deployment status by refreshing the page using the refresh button.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/source-system-creating.png" alt-text="Screenshot showing the deployment status monitoring view." lightbox="./media/configure-source-system-with-open-mirroring/source-system-creating.png":::
6. Once the deployment is done, you should be able to see the resources deployed to your workspace.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/deployed-resources.png" alt-text="Screenshot showing the deployed resources in the workspace." lightbox="./media/configure-source-system-with-open-mirroring/deployed-resources.png":::

## Configure SAP ECC source system with Open Mirroring

1. On the home screen, click on **Configure source system** button.
2. Click on the **New source system** button.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system.png" alt-text="Screenshot showing how to click the new source system button." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system.png":::
3. Provide the inputs for the fields.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/create-source-system-mirror.png" alt-text="Screenshot showing the SAP ECC input fields for source system configuration." lightbox="./media/configure-source-system-with-open-mirroring/create-source-system-mirror.png":::
4. In the System connection section, Select the name of the mirroring partner, and add the connection ID for the connection we created in the prerequisite step. Finally click on **Create** button to start the deployment.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/enter-system-details.png" alt-text="Screenshot showing how to enter SQL connection details for open mirroring." lightbox="./media/configure-source-system-with-open-mirroring/enter-system-details.png":::
5. You can monitor the deployment status by refreshing the page using the refresh button.
   :::image type="content" source="./media/configure-source-system-with-open-mirroring/source-system-creating.png" alt-text="Screenshot showing the deployment status monitoring view." lightbox="./media/configure-source-system-with-open-mirroring/source-system-creating.png":::
6. Once the deployment is done, you should be able to see the resources deployed to your workspace.

## Next steps

Once this configuration is complete, you can proceed to set up the dataset.

- [Configure Dataset in Business Process Solutions](configure-dataset.md)
