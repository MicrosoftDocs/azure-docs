---
title: Connect to and manage Teradata
description: This guide describes how to connect to Teradata in Azure Purview, and use Azure Purview's features to scan and manage your Teradata source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/20/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Teradata in Azure Purview

This article outlines how to register Teradata, and how to authenticate and interact with Teradata in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| [Yes*](#lineage)|

\* *Besides the lineage on assets within the data source, lineage is also supported if dataset is used as a source/sink in [Data Factory](how-to-link-azure-data-factory.md) or [Synapse pipeline](how-to-lineage-azure-synapse-analytics.md).*

The supported Teradata database versions are 12.x to 17.x.

When scanning Teradata source, Azure Purview supports:

- Extracting technical metadata including:

    - Server
    - Databases
    - Tables including the columns, foreign keys, indexes, and constraints
    - Views including the columns
    - Stored procedures including the parameter dataset and result set
    - Functions including the parameter dataset

- Fetching static lineage on assets relationships among tables, views and stored procedures.

When setting up scan, you can choose to scan an entire Teradata server, or scope the scan to a subset of databases matching the given name(s) or name pattern(s).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

* Ensure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the virtual machine where the self-hosted integration runtime is installed.

* Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

* You will have to manually download Teradata's JDBC Driver on your virtual machine where self-hosted integration runtime is running. The executable JAR file can be downloaded from the Teradata [website](https://downloads.teradata.com/).

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Please do not install in a user account.

## Register

This section describes how to register Teradata in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Authentication for registration

The only supported authentication for a Teradata source is **Basic authentication**. Make sure to have Read access to the Teradata source being scanned.

### Steps to register

1.  Navigate to your Azure Purview account.
1.  Select **Data Map** on the left navigation.
1.  Select **Register**
1.  On Register sources, select **Teradata**. Select **Continue**

    :::image type="content" source="media/register-scan-teradata-source/register-sources.png" alt-text="register Teradata options" border="true":::

On the **Register sources (Teradata)** screen, do the following:

1.  Enter a **Name** that the data source will be listed with in the Catalog.

1.  Enter the **Host** name to connect to a Teradata source. It can also be an IP address or a fully qualified connection string to the     server.

1.  Select a collection or create a new one (Optional)

1.  Finish to register the data source.

    :::image type="content" source="media/register-scan-teradata-source/register-sources-2.png" alt-text="register Teradata" border="true":::

## Scan

Follow the steps below to scan Teradata to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

1. In the Management Center, select **Integration runtimes**. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md) to set up a self-hosted integration runtime

1. Select the **Data Map** tab on the left pane in the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the registered Teradata source.

1. Select **New scan**

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select Basic Authentication while creating a credential.
        * Provide a user name to connect to database server in the User name input field
        * Store the database server password in the secret key.

        To understand more on credentials, refer to the link [here](./manage-credentials.md)

    1. **Schema**: List subset of databases to import expressed as a semicolon separated list. For Example: `schema1; schema2`. All user databases are imported if that list is empty. All system databases (for example, SysAdmin) and objects are ignored by default.

        Acceptable database name patterns using SQL LIKE expressions syntax include using %. For example: `A%; %B; %C%; D`
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters are not acceptable

    1. **Driver location**: Specify the path to the JDBC driver location in your VM where self-host integration runtime is running. This should be the path to valid JAR folder location.

    1. **Maximum memory available:** Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of Teradata source to be scanned.

        > [!Note]
        > As a rule of thumb, please provide 2GB memory for every 1000 tables

        :::image type="content" source="media/register-scan-teradata-source/setup-scan.png" alt-text="setup scan" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Lineage

After scanning your Teradata source, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details. 

Go to the asset -> lineage tab, you can see the asset relationship when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported Teradata lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

:::image type="content" source="media/register-scan-teradata-source/lineage.png" alt-text="Teradata lineage view" border="true":::

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
