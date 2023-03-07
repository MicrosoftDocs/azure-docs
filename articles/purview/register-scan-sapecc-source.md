---
title: Connect to and manage an SAP ECC source
description: This guide describes how to connect to SAP ECC in Microsoft Purview, and use Microsoft Purview's features to scan and manage your SAP ECC source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/01/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage SAP ECC in Microsoft Purview

This article outlines how to register SAP ECC, and how to authenticate and interact with SAP ECC in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | No | No | No| [Yes*](#lineage)| No |

\* *Besides the lineage on assets within the data source, lineage is also supported if dataset is used as a source/sink in [Data Factory](how-to-link-azure-data-factory.md) or [Synapse pipeline](how-to-lineage-azure-synapse-analytics.md).*

When scanning SAP ECC source, Microsoft Purview supports:

- Extracting technical metadata including:

    - Instance
    - Application components
    - Packages
    - Tables including the fields, foreign keys, indexes, and index members
    - Views including the fields
    - Transactions
    - Programs
    - Classes
    - Function groups
    - Function modules
    - Domains including the domain values
    - Data elements

- Fetching static lineage on assets relationships among tables and views.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

    >[!NOTE]
    >Scanning SAP ECC is a memory intensive operation, you are recommended to install Self-hosted Integration Runtime on a machine with at least 128GB RAM.

    * Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.

    * Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

    * Download the 64-bit [SAP Connector for Microsoft .NET 3.0](https://support.sap.com/en/product/connectors/msnet.html) from SAP\'s website and install it on the self-hosted integration runtime machine. During installation, make sure you select the **Install Assemblies to GAC** option in the **Optional setup steps** window.

        :::image type="content" source="media/register-scan-saps4hana-source/requirement.png" alt-text="pre-requisite" border="true":::

    * The connector reads metadata from SAP using the [SAP Java Connector (JCo)](https://support.sap.com/en/product/connectors/jco.html) 3.0 API. Make sure the Java Connector is available on your virtual machine where self-hosted integration runtime is installed. Make sure that you're using the correct JCo distribution for your environment. For example: on a Microsoft Windows machine, make sure the sapjco3.jar and sapjco3.dll files are available. Note down the folder path which you will use to set up the scan.

        > [!Note]
        > The driver should be accessible by the self-hosted integration runtime. By default, self-hosted integration runtime uses [local service account "NT SERVICE\DIAHostService"](manage-integration-runtimes.md#service-account-for-self-hosted-integration-runtime). Make sure it has "Read and execute" and "List folder contents" permission to the driver folder.

    * Self-hosted integration runtime communicates with the SAP server over dispatcher port 32NN and gateway port 33NN, where NN is your SAP instance number from 00 to 99. Make sure the outbound traffic is allowed on your firewall.

* Deploy the metadata extraction ABAP function module on the SAP server by following the steps mentioned in [ABAP functions deployment guide](abap-functions-deployment-guide.md). You'll need an ABAP developer account to create the RFC function module on the SAP server. For scan execution, the user account requires sufficient permissions to connect to the SAP server and execute the following RFC function modules:

    * STFC_CONNECTION (check connectivity)
    * RFC_SYSTEM_INFO (check system information)
    * OCS_GET_INSTALLED_COMPS (check software versions)
    * Z_MITI_DOWNLOAD (main metadata import, the function module you create following the Purview guide)
    
    The underlying SAP Java Connector (JCo) libraries may call additional RFC function modules e.g. RFC_PING, RFC_METADATA_GET, etc., refer to [SAP support note 460089](https://launchpad.support.sap.com/#/notes/460089) for details.

## Register

This section describes how to register SAP ECC in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

The only supported authentication for SAP ECC source is **Basic authentication**.

### Steps to register

1. Navigate to your Microsoft Purview account.
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **SAP ECC**. Select **Continue.**

    :::image type="content" source="media/register-scan-sapecc-source/register-sapecc.png" alt-text="register SAPECC options" border="true":::

On the **Register sources (SAP ECC)** screen, do the following:

1. Enter a **Name** that the data source will be listed within the
    Catalog.

1. Enter the **Application server** name to connect to SAP ECC source. It can also be an IP address of the SAP application server host.

1. Enter the SAP **System number**. This is a two-digit integer between 00 and 99.

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-sapecc-source/register-sapecc-2.png" alt-text="register SAPECC" border="true":::

## Scan

Follow the steps below to scan SAP ECC to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

1. Navigate to **Sources**

1. Select the registered SAP ECC source.

1. Select **+ New scan**

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:

        * Select Basic Authentication while creating a credential.
        * Provide a user ID to connect to SAP server in the User name input field.
        * Store the user password used to connect to SAP server in the secret key.

    1. **Client ID**: Enter the SAP Client ID. This is a three-digit numeric number from 000 to 999.

    1. **JCo library path**: Specify the directory path where the JCo libraries are located, e.g. `D:\Drivers\SAPJCo`. Make sure the path is accessible by the self-hosted integration runtime, learn more from [prerequisites section](#prerequisites).

    1. **Maximum memory available:** Maximum memory (in GB) available on the Self-hosted Integration Runtime machine to be used by scanning processes. This is dependent on the size of SAP ECC source to be scanned. It's recommended to provide large available memory, for example,  100.

        :::image type="content" source="media/register-scan-sapecc-source/scan-sapecc-inline.png" alt-text="scan SAPECC" lightbox="media/register-scan-sapecc-source/scan-sapecc-expanded.png" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Lineage

After scanning your SAP ECC source, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details. 

Go to the asset -> lineage tab, you can see the asset relationship when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported SAP ECC lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

:::image type="content" source="media/register-scan-sapecc-source/lineage.png" alt-text="SAP ECC lineage view" border="true":::

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
