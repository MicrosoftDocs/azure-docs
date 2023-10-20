---
title: Set up a linked service and dataset for the SAP CDC connector
titleSuffix: Azure Data Factory
description: Learn how to set up a linked service and source dataset to use with the SAP CDC (change data capture) connector in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 07/20/2023
ms.author: ulrichchrist
---

# Set up a linked service and source dataset for the SAP CDC connector

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Learn how to set up the linked service and source dataset for the SAP CDC connector in Azure Data Factory.

## Set up a linked service

To set up an SAP CDC linked service:

1. In Azure Data Factory Studio, go to the Manage hub of your data factory. In the menu under **Connections**, select **Linked services**. Select **New** to create a new linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-linked-service.png" alt-text="Screenshot of the Manage hub in Azure Data Factory Studio, with the New linked service button highlighted.":::

1. In **New linked service**, search for **SAP**. Select **SAP CDC**, and then select **Continue**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-selection.png" alt-text="Screenshot of the linked service source selection, with SAP CDC selected.":::

1. Set the linked service properties. Many of the properties are similar to SAP Table linked service properties. For more information, see [Linked service properties](connector-sap-table.md?tabs=data-factory#linked-service-properties).

   1. In **Name**, enter a unique name for the linked service.
   1. In **Connect via integration runtime**, select your self-hosted integration runtime.
   1. In **Server name**, enter the mapped server name for your SAP system.
   1. In **Subscriber name**, enter a unique name to register and identify this Data Factory connection as a subscriber that consumes data packages that are produced in the Operational Delta Queue (ODQ) by your SAP system. For example, you might name it `<YOUR_DATA_FACTORY_NAME>_<YOUR_LINKED_SERVICE_NAME>`. Make sure to only use upper case letters. Also be sure that the total character count doesn't exceed 32 characters, or SAP will truncate the name. This can be an issue if your factory and linked services both have long names.

    Make sure you assign a unique subscriber name to every linked service connecting to the same SAP system. This will make monitoring and trouble shooting on SAP side much easier.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-configuration.png" alt-text="Screenshot of the SAP CDC linked service configuration.":::

1. Select **Test connection**, and then select **Create**.

## Set up the source dataset

1. In Azure Data Factory Studio, go to the Author hub of your data factory. In **Factory Resources**, under **Datasets** > **Dataset Actions**, select **New dataset**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-dataset.png" alt-text="Screenshot that shows creating a new pipeline in the Data Factory Studio Author hub.":::  

1. In **New dataset**, search for **SAP**. Select **SAP CDC**, and then select **Continue**.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-selection.png" alt-text="Screenshot of the SAP CDC dataset type in the New dataset dialog.":::

1. In **Set properties**, enter a name for the SAP CDC linked service data source. In **Linked service**, select the dropdown and select **New**.

1. Select your SAP CDC linked service for the new source dataset and set the rest of the properties for the linked service:

   1. In **Connect via integration runtime**, select your self-hosted integration runtime.

   1. In **ODP context**, select the context of the ODP data extraction. Here are some examples:

       - To extract ABAP CDS views from S/4HANA, select **ABAP_CDS**.
       - To extract InfoProviders or InfoObjects from SAP BW or BW/4HANA, select **BW**.
       - To extract SAP extractors from SAP ECC, select **SAPI**.
       - To extract SAP application tables from SAP source systems via SAP LT replication server as a proxy, select **SLT~\<your queue alias\>**.

       If you want to extract SAP application tables, but you don’t want to use SAP Landscape Transformation Replication Server (SLT) as a proxy, you can create SAP extractors by using the RSO2 transaction code or Core Data Services (CDS) views with the tables. Then, extract the tables directly from your SAP source systems by using either an **SAPI** or an **ABAP_CDS** context.

   1. For **ODP name**, under the selected data extraction context, select the name of the data source object to extract. If you connect to your SAP source system by using SLT as a proxy, the **Preview data** feature currently isn't supported.

      To enter the selections directly, select the **Edit** checkbox.
  
    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-configuration.png" alt-text="Screenshot of the SAP CDC dataset configuration page.":::

1. Select **OK** to create your new SAP CDC source dataset.

## Set up a mapping data flow using the SAP CDC dataset as a source

To set up a mapping data flow using the SAP CDC dataset as a source, follow [Transform data with the SAP CDC connector](connector-sap-change-data-capture.md#transform-data-with-the-sap-cdc-connector)

## Next steps

[Debug the SAP CDC connector by sending self-hosted integration runtime logs](sap-change-data-capture-debug-shir-logs.md)
