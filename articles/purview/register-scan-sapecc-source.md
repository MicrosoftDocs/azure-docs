---
title: Connect to and manage an SAP ECC source
description: This guide describes how to connect to SAP ECC in Azure Purview, and use Azure Purview's features to scan and manage your SAP ECC source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/20/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage SAP ECC in Azure Purview

This article outlines how to register SAP ECC, and how to authenticate and interact with SAP ECC in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | No | No | No| [Yes*](#lineage)|

\* *Besides the lineage on assets within the data source, lineage is also supported if dataset is used as a source/sink in [Data Factory](how-to-link-azure-data-factory.md) or [Synapse pipeline](how-to-lineage-azure-synapse-analytics.md).*

When scanning SAP ECC source, Azure Purview supports:

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

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

    >[!NOTE]
    >Scanning SAP ECC is a memory intensive operation, you are recommended to install Self-hosted Integration Runtime on a machine with at least 128GB RAM.

* Ensure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the virtual machine where the self-hosted integration runtime is installed.

* Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

* Download the 64-bit [SAP Connector for Microsoft .NET 3.0](https://support.sap.com/en/product/connectors/msnet.html) from SAP\'s website and install it on the self-hosted integration runtime machine. During installation, make sure you select the **Install Assemblies to GAC** option in the **Optional setup steps** window.

    :::image type="content" source="media/register-scan-saps4hana-source/requirement.png" alt-text="pre-requisite" border="true":::

* The connector reads metadata from SAP using the [SAP Java Connector (JCo)](https://support.sap.com/en/product/connectors/jco.html) 3.0 API. Make sure the Java Connector is available on your virtual machine where self-hosted integration runtime is installed. Make sure that you are using the correct JCo distribution for your environment. For example: on a Microsoft Windows machine, make sure the sapjco3.jar and sapjco3.dll files are available.

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

* Deploy the metadata extraction ABAP function module on the SAP server by following the steps mentioned in [ABAP functions deployment guide](abap-functions-deployment-guide.md). You will need an ABAP developer account to create the RFC function module on the SAP server. The user account requires sufficient permissions to connect to the SAP server and execute the following RFC function modules:
  * STFC_CONNECTION (check connectivity)
  * RFC_SYSTEM_INFO (check system information)

## Register

This section describes how to register SAP ECC in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Authentication for registration

The only supported authentication for SAP ECC source is **Basic authentication**.

### Steps to register

1. Navigate to your Azure Purview account.
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

Follow the steps below to scan SAP ECC to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

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

    1. **JCo library path**: The directory path where the JCo libraries are located.

    1. **Maximum memory available:** Maximum memory (in GB) available on the Self-hosted Integration Runtime machine to be used by scanning processes. This is dependent on the size of SAP ECC source to be scanned. It's recommended to provide large available memory e.g. 100.

        :::image type="content" source="media/register-scan-sapecc-source/scan-sapecc.png" alt-text="scan SAPECC" border="true":::

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

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
