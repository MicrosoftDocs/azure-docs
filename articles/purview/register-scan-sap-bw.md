---
title: Connect to and manage an SAP Business Warehouse
description: This guide describes how to connect to SAP Business Warehouse in Microsoft Purview, and use Microsoft Purview's features to scan and manage your SAP BW source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/20/2023
ms.custom: template-how-to
---

# Connect to and manage SAP Business Warehouse in Microsoft Purview

This article outlines how to register SAP Business Warehouse (BW), and how to authenticate and interact with SAP BW in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | No | No | No| No|No|No|

The supported SAP BW versions are 7.3 to 7.5. SAP BW/4HANA isn't supported.

When scanning SAP BW source, Microsoft Purview supports extracting technical metadata including:

- Instance
- InfoArea
- InfoSet
- InfoSet query
- Classic InfoSet
- InfoObject including unit of measurement, time characteristic, navigation attribute, data packet characteristic, currency, characteristic, field, and key figure
- Data store object (DSO)
- Aggregation level
- Open hub destination
- Query including the query condition
- Query view
- HybridProvider
- MultiProvider
- InfoCube
- Aggregate
- Dimension
- Time dimension

### Known limitations

When object is deleted from the data source, currently the subsequent scan won't automatically remove the corresponding asset in Microsoft Purview.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview resource](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md). The minimal supported Self-hosted Integration Runtime version is 5.15.8079.1.

    * Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.

    * Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

    * The connector reads metadata from SAP using the [SAP Java Connector (JCo)](https://support.sap.com/en/product/connectors/jco.html) 3.0 API. Make sure the Java Connector is available on your machine where self-hosted integration runtime is installed. Make sure that you use the correct JCo distribution for your environment, and the **sapjco3.jar** and **sapjco3.dll** files are available.

        > [!Note]
        > The driver should be accessible to all accounts in the machine. Don't put it in a path under user account.

    * Self-hosted integration runtime communicates with the SAP server over dispatcher port 32NN and gateway port 33NN, where NN is your SAP instance number from 00 to 99. Make sure the outbound traffic is allowed on your firewall.

* Deploy the metadata extraction ABAP function module on the SAP server by following the steps mentioned in [ABAP functions deployment guide](abap-functions-deployment-guide.md). You need an ABAP developer account to create the RFC function module on the SAP server. For scan execution, the user account requires sufficient permissions to connect to the SAP server and execute the following RFC function modules:

    * STFC_CONNECTION (check connectivity)
    * RFC_SYSTEM_INFO (check system information)
    * OCS_GET_INSTALLED_COMPS (check software versions)
    * Z_MITI_BW_DOWNLOAD (main metadata import, the function module you create following the Purview guide)
    
    The underlying SAP Java Connector (JCo) libraries may call additional RFC function modules e.g. RFC_PING, RFC_METADATA_GET, etc., refer to [SAP support note 460089](https://launchpad.support.sap.com/#/notes/460089) for details.

## Register

This section describes how to register SAP BW in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

The only supported authentication for SAP BW source is **Basic authentication**.

### Steps to register

1. Open the Microsoft Purview governance portal by:

   - Browsing directly to [https://web.purview.azure.com](https://web.purview.azure.com) and selecting your Microsoft Purview account.
   - Opening the [Azure portal](https://portal.azure.com), searching for and selecting the Microsoft Purview account. Selecting the [**the Microsoft Purview governance portal**](https://web.purview.azure.com/) button.
1. Select **Data Map** on the left navigation.
1. Select **Register**.
1. In **Register sources**, select **SAP BW** > **Continue**.  

On the **Register sources (SAP BW)** screen, do the following:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **Application server** name to connect to SAP BW source. It can also be an IP address of the SAP application server host.

1. Enter the SAP **System number**. It's an integer between 0 and 99.

1. Select a collection or create a new one (Optional).

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-sap-bw/register-sap-bw.png" alt-text="Screenshot of registering an SAP BW source." border="true":::

## Scan

Follow the steps below to scan SAP BW to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

1. Navigate to **Sources**

1. Select the registered SAP BW source.

1. Select **+ New scan**

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:

        * Select Basic Authentication while creating a credential.
        * Provide a user ID to connect to SAP server in the User name input field.
        * Store the user password used to connect to SAP server in the secret key.

    1. **Client ID**: Enter the SAP Client ID. It's a three-digit numeric number from 000 to 999.

    1. **JCo library path**: Specify the directory path where the JCo libraries are located, e.g. `D:\Drivers\SAPJCo`. Make sure the path is accessible by the self-hosted integration runtime, learn more from [prerequisites section](#prerequisites).

    1. **Maximum memory available:** Maximum memory (in GB) available on the Self-hosted Integration Runtime machine to be used by scanning processes. This is dependent on the size of SAP BW source to be scanned. 

        :::image type="content" source="media/register-scan-sap-bw/scan-sap-bw.png" alt-text="Screenshot of setting up an SAP BW scan." border="true":::

1. Select **Test connection**.

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Search Data Catalog](how-to-search-catalog.md)
- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Supported data sources and file types](azure-purview-connector-overview.md)