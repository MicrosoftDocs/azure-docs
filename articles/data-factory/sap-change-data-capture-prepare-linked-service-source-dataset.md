---
title: SAP change data capture solution (Preview) - Prepare linked service and dataset
titleSuffix: Azure Data Factory
description: This article introduces and describes preparation of the linked service and source dataset for SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Prepare the SAP ODP linked service and source dataset for the SAP CDC solution in Azure Data Factory (Preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article introduces and describes preparation of the linked service and source dataset for SAP change data capture (Preview) in Azure Data Factory.

## Prepare the SAP ODP linked service

To prepare SAP ODP linked service, complete the following steps:

1.	On ADF Studio, go to the **Linked services** section of **Manage** hub and select the **New** button to create a new linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-new-linked-service.png" alt-text="Screenshot of the manage hub in Azure Data Factory with the New Linked Service button highlighted.":::

1.	Search for _SAP_ and select _SAP CDC (Preview)_.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-selection.png" alt-text="Screenshot of the linked service source selection with SAP CDC (Preview) selected.":::

1.	Set SAP ODP linked service properties, many of them are similar to SAP Table linked service properties, see [Linked service properties](connector-sap-table.md?tabs=data-factory#linked-service-properties).
    1.	For the **Connect via integration runtime** property, select your SHIR.
    1.	For the **Server name** property, enter the mapped server name for your SAP system.
    1.	For the **Subscriber name** property, enter a unique name to register and identify this ADF connection as a subscriber that consumes data packages produced in ODQ by your SAP system.  For example, you can name it <_your ADF name_>_<_your linked service name_>.

    When using extraction mode "Delta", the combination of Subscriber name (maintained in the linked service) and Subscriber process has to be unique for every copy activity reading from the same ODP source object to ensure that the ODP framework can distinguish these copy activities and provide the correct chances.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-linked-service-configuration.png" alt-text="Screenshot of the SAP ODP linked service configuration.":::

1.	Test the connection and create your new SAP ODP linked service.

## Prepare the SAP ODP source dataset

To prepare an ADF copy activity with an SAP ODP data source, complete the following steps:

1.	On ADF Studio, go to the **Datasets** section of the **Author** hub, select the **…** button to drop down the **Dataset Actions** menu, and select the **New dataset** item.

1.	Search for _SAP_ and select _SAP CDC (Preview)_.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-selection.png" alt-text="Screenshot of the SAP CDC (Preview) dataset type on the New dataset dialog.":::

1.	Select your new SAP CDC linked service for the new source dataset and set the rest of its properties.
    1.	For the **Connect via integration runtime** property, select your SHIR.
    1.	For the **Context** property, select the context of data extraction via ODP, such as: 
        - _ABAP_CDS_ for extracting ABAP CDS views from S/4HANA
        - _BW_ for extracting InfoProviders or InfoObjects from SAP BW or BW/4HANA
        - _SAPI_ for extracting SAP extractors from SAP ECC
        - _SLT~_<_your queue alias_> for extracting SAP application tables from SAP source systems via SLT replication server as a proxy

        If you want to extract SAP application tables, but don’t want to use SLT replication server as a proxy, you can create SAP extractors via RSO2 transaction code/CDS views on top of those tables and extract them directly from your SAP source systems in _SAPI/ABAP_CDS_ context, respectively.
    1.	For the **Object name** property, select the name of data source object to extract under the selected data extraction context.  If you connect to your SAP source system via SLT replication server as a proxy, the **Preview data** feature isn't supported for now.
    1.	Check the **Edit** check boxes, if loading the dropdown menu selections takes too long and you want to type them yourself.
    
    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-source-dataset-configuration.png" alt-text="Screenshot of the SAP CDC (Preview) dataset configuration page.":::

1.	Select the **OK** button to create your new SAP ODP source dataset.

## Next steps

[Debug ADF copy activity issues by sending SHIR logs](sap-change-data-capture-debug-shir-logs.md)