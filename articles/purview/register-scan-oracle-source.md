---
title: Connect to and manage Oracle
description: This guide describes how to connect to Oracle in Azure Purview, and use Azure Purview's features to scan and manage your Oracle source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/11/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Oracle in Azure Purview

This article outlines how to register Oracle, and how to authenticate and interact with Oracle in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| [Yes**](how-to-lineage-oracle.md)|

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

The supported Oracle server versions are 6i to 19c. Proxy server is not supported when scanning Oracle source.

When scanning Oracle source, Azure Purview supports:

- Extracting technical metadata including:

    - Server
    - Schemas
    - Packages
    - Tables including the columns, foreign keys, indexes, triggers and unique constraints
    - Views including the columns and triggers
    - Stored procedures including the parameter dataset and result set
    - Functions including the parameter dataset
    - Sequences
    - Synonyms
    - Types including the type attributes

- Fetching static lineage on assets relationships among tables, views and stored procedures.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

* Ensure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the virtual machine where the self-hosted integration runtime is installed.

* Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

* Manually download an Oracle JDBC driver from [here](https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html) onto your virtual machine where self-hosted integration runtime is running.

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

## Register

This section describes how to register Oracle in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Prerequisites for registration

A read-only access to system tables is required.

The user should have permission to create a session as well as role SELECT\_CATALOG\_ROLE assigned. Alternatively, the user may have SELECT permission granted for every individual system table that this connector queries metadata from:

```sql
grant create session to [user];
grant select on all_users to [user];
grant select on dba_objects to [user];
grant select on dba_tab_comments to [user];
grant select on dba_external_locations to [user];
grant select on dba_directories to [user];
grant select on dba_mviews to [user];
grant select on dba_clu_columns to [user];
grant select on dba_tab_columns to [user];
grant select on dba_col_comments to [user];
grant select on dba_constraints to [user];
grant select on dba_cons_columns to [user];
grant select on dba_indexes to [user];
grant select on dba_ind_columns to [user];
grant select on dba_procedures to [user];
grant select on dba_synonyms to [user];
grant select on dba_views to [user];
grant select on dba_source to [user];
grant select on dba_triggers to [user];
grant select on dba_arguments to [user];
grant select on dba_sequences to [user];
grant select on dba_dependencies to [user];
grant select on dba_type_attrs to [user];
grant select on V_$INSTANCE to [user];
grant select on v_$database to [user];
```

### Authentication for registration

The only supported authentication for an Oracle source is **Basic authentication**.

### Steps to register

To register a new Oracle source in your data catalog, do the following:

1. Navigate to your Azure Purview account in the [Azure Purview Studio](https://web.purview.azure.com/resource/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **Oracle**. Select **Continue**.

    :::image type="content" source="media/register-scan-oracle-source/register-sources.png" alt-text="register sources" border="true":::

On the **Register sources (Oracle)** screen, do the following:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **Host** name to connect to an Oracle source. This can either be:
    * A host name used by JDBC to connect to the database server. For example: `MyDatabaseServer.com`
    * An IP address. For example: `192.169.1.2`
    * Its fully qualified JDBC connection string. For example:

         ```
        jdbc:oracle:thin:@(DESCRIPTION=(LOAD_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=oracleserver1)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=oracleserver2)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=oracleserver3)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=orcl)))
        ```

1. Enter the **Port number** used by JDBC to connect to the database server (1521 by default for Oracle).

1. Enter the **Oracle service name** used by JDBC to connect to the database server.

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-oracle-source/register-sources-2.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan Oracle to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

To create and run a new scan, do the following:

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

1. Navigate to **Sources**.

1. Select the registered Oracle source.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured
        self-hosted integration runtime

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select Basic Authentication while creating a credential.
        * Provide the user name used by JDBC to connect to the database server in the User name input field.
        * Store the user password used by JDBC to connect to the database server in the secret key.

    1. **Schema**: List subset of schemas to import expressed as a semicolon separated list. For example, `schema1; schema2`. All user schemas are imported if that list is empty. All system schemas (for example, SysAdmin) and objects are ignored by default. When the list is empty, all available schemas are imported.

        Acceptable schema name patterns using SQL LIKE expressions syntax include using %. For example: `A%; %B; %C%; D`
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters are not acceptable.

    1. **Driver location**: Specify the path to the JDBC driver location in your VM where self-host integration runtime is running. This should be the path to valid JAR folder location.

        > [!Note]
        > The driver should be accessible to all accounts in the VM. Please do not install in a user account.

    1. **Maximum memory available**: Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of Oracle source to be scanned.

        > [!Note]
        > As a rule of thumb, please provide 1GB memory for every 1000 tables

        :::image type="content" source="media/register-scan-oracle-source/scan.png" alt-text="scan oracle" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
