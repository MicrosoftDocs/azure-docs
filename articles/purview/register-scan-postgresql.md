---
title: Connect to and manage PostgreSQL
description: This guide describes how to connect to PostgreSQL in Azure Purview, and use Azure Purview's features to scan and manage your PostgreSQL source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 01/11/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Connect to and manage PostgreSQL in Azure Purview (Preview)

This article outlines how to register PostgreSQL, and how to authenticate and interact with PostgreSQL in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

> [!IMPORTANT]
> PostgreSQL as a source is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| Yes|

The supported PostgreSQL server versions are 8.4 to 12.x.

When scanning PostgreSQL source, Azure Purview supports:

- Extracting technical metadata including:

    - Server
    - Databases
    - Schemas
    - Tables including the columns
    - Views including the columns
    
- Fetching static lineage on assets relationships among tables and views.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md). The minimal supported Self-hosted Integration Runtime version is 5.11.7953.1.

* Ensure [JDK 11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html) is installed on the virtual machine where the self-hosted integration runtime is installed.

* Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

* The PostgreSQL user must have read access to system tables in order to access advanced metadata.

## Register

This section describes how to register PostgreSQL in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Steps to register

To register a new PostgreSQL source in your data catalog, do the following:

1. Navigate to your Azure Purview account in the [Azure Purview Studio](https://web.purview.azure.com/resource/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **PostgreSQL**. Select **Continue**.

On the **Register sources (PostgreSQL)** screen, do the following:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **Server** name to connect to a PostgreSQL source. This can either be:
    * A host name used to connect to the database server. For example: `MyDatabaseServer.com`
    * An IP address. For example: `192.169.1.2`
    * Its fully qualified JDBC connection string. For example:

        ```
        jdbc:postgresql://COMPUTER_NAME_OR_IP:PORT/DATABASE_NAME
        ```

1. Enter the **Port** used to connect to the database server (5432 by default for PostgreSQL).

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-postgresql/register-sources.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan PostgreSQL to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Authentication for a scan

The supported authentication type for a PostgreSQL source is **Basic authentication**.

### Create and run scan

To create and run a new scan, do the following:

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

1. Navigate to **Sources**.

1. Select the registered PostgreSQL source.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured
        self-hosted integration runtime

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select **Basic Authentication** while creating a credential.
        * Provide the user name used to connect to the database server in the User name input field.
        * Store the user password used to connect to the database server in the secret key.

    1. **Database**： Specify the name of the database instance to import.

    1. **Schema**: List subset of schemas to import expressed as a semicolon separated list. For example, `schema1; schema2`. All user schemas are imported if that list is empty. All system schemas (for example, SysAdmin) and objects are ignored by default. When the list is empty, all available schemas are imported.
        
        Acceptable schema name patterns using SQL LIKE expressions syntax include using %. For example: `A%; %B; %C%; D`
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters are not acceptable.

    1. **Maximum memory available**: Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of PostgreSQL source to be scanned.

        > [!Note]
        > As a rule of thumb, please provide 1GB memory for every 1000 tables

        :::image type="content" source="media/register-scan-postgresql/scan.png" alt-text="scan PostgreSQL" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
