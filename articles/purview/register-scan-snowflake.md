---
title: Govern Snowflake
description: This guide describes how to connect to Snowflake in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Snowflake source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 10/21/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Govern Snowflake in Microsoft Purview

This article outlines how to register Snowflake, and how to authenticate and interact with Snowflake in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| [Yes](#lineage) | No|

When scanning Snowflake source, Microsoft Purview supports:

- Extracting technical metadata including:

    - Server
    - Databases
    - Schemas
    - Tables including the columns, foreign keys and unique constraints
    - Views including the columns
    - Stored procedures including the parameter dataset and result set
    - Functions including the parameter dataset
    - Pipes
    - Stages
    - Streams including the columns
    - Tasks
    - Sequences

- Fetching static lineage on assets relationships among tables, views, and streams.

When setting up scan, you can choose to scan one or more Snowflake database(s) entirely, or further scope the scan to a subset of schemas matching the given name(s) or name pattern(s).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active [Microsoft Purview account](create-catalog-portal.md).
- You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

> [!NOTE]
> **If your data store is not publicly accessible** (if your data store limits access from on-premises network, private network or specific IPs, etc.), **you will need to configure a self hosted integration runtime to connect to it**.

- If your data store isn't publicly accessible, set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).
    - Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.
    - Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

### Required permissions for scan

Microsoft Purview supports basic authentication (username and password) for scanning Snowflake. The default role of the given user will be used to perform the scan. The Snowflake user must have usage rights on a warehouse and the database(s) to be scanned, and read access to system tables in order to access advanced metadata.

Here's a sample walkthrough to create a user specifically for Microsoft Purview scan and set up the permissions. If you choose to use an existing user, make sure it has adequate rights to the warehouse and database objects.

1. Set up a `purview_reader` role. You need _ACCOUNTADMIN_ rights to do this.

   ```sql
   USE ROLE ACCOUNTADMIN;
   
   --create role to allow read only access - this will later be assigned to the Microsoft Purview user
   CREATE OR REPLACE ROLE purview_reader;
   
   --make sysadmin the parent role
   GRANT ROLE purview_reader TO ROLE sysadmin;
   ```

2. Create a warehouse for Microsoft Purview to use and grant rights.

   ```sql
   --create warehouse - account admin required
   CREATE OR REPLACE WAREHOUSE purview_wh WITH 
       WAREHOUSE_SIZE = 'XSMALL' 
       WAREHOUSE_TYPE = 'STANDARD' 
       AUTO_SUSPEND = 300 
       AUTO_RESUME = TRUE 
       MIN_CLUSTER_COUNT = 1 
       MAX_CLUSTER_COUNT = 2 
       SCALING_POLICY = 'STANDARD';
   
   --grant rights to the warehouse
   GRANT USAGE ON WAREHOUSE purview_wh TO ROLE purview_reader;
   ```

3. Create a user `purview` for Microsoft Purview scan.

   ```sql
   CREATE OR REPLACE USER purview 
       PASSWORD = '<password>'; 
   
   --note the default role will be used during scan
   ALTER USER purview SET DEFAULT_ROLE = purview_reader;
       
   --add user to purview_reader role
   GRANT ROLE purview_reader TO USER purview;
   ```

4. Grant reader rights to the database objects.

    ```sql
    GRANT USAGE ON DATABASE <your_database_name> TO purview_reader;

    --grant reader access to all the database structures that purview can currently scan
    GRANT USAGE ON ALL SCHEMAS IN DATABASE <your_database_name> TO role purview_reader;
    GRANT USAGE ON ALL FUNCTIONS IN DATABASE <your_database_name> TO role purview_reader;
    GRANT USAGE ON ALL PROCEDURES IN DATABASE <your_database_name> TO role purview_reader;
    GRANT SELECT ON ALL TABLES IN DATABASE <your_database_name> TO role purview_reader;
    GRANT SELECT ON ALL VIEWS IN DATABASE <your_database_name> TO role purview_reader;
    GRANT USAGE, READ on ALL STAGES IN DATABASE <your_database_name> TO role purview_reader;

    --grant reader access to any future objects that could be created
    GRANT USAGE ON FUTURE SCHEMAS IN DATABASE <your_database_name> TO role purview_reader;
    GRANT USAGE ON FUTURE FUNCTIONS IN DATABASE <your_database_name> TO role purview_reader;
    GRANT USAGE ON FUTURE PROCEDURES IN DATABASE <your_database_name> TO role purview_reader;
    GRANT SELECT ON FUTURE TABLES IN DATABASE <your_database_name> TO role purview_reader;
    GRANT SELECT ON FUTURE VIEWS IN DATABASE <your_database_name> TO role purview_reader;
    GRANT USAGE, READ ON FUTURE STAGES IN DATABASE <your_database_name> TO role purview_reader;
    ```

## Register

This section describes how to register Snowflake in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Steps to register

To register a new Snowflake source in your data catalog, follow these steps:

1. Navigate to your Microsoft Purview account in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **Snowflake**. Select **Continue**.

On the **Register sources (Snowflake)** screen, follow these steps:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **server** URL used to connect to the Snowflake account in the form of `<account_identifier>.snowflakecomputing.com`, for example, `xy12345.east-us-2.azure.snowflakecomputing.com`. Learn more about Snowflake [account identifier](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html#).

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-snowflake/register-sources.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan Snowflake to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Authentication for a scan

The supported authentication type for a Snowflake source is **Basic authentication**.

### Create and run scan

To create and run a new scan, follow these steps:

1. If your server is publicly accessible, skip to step two. Otherwise, you'll need to make sure your self-hosted integration runtime is configured:
    1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/), got to the Management Center, and select **Integration runtimes**.
    1. Make sure a self-hosted integration runtime is available. If one isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to set up a self-hosted integration runtime.

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/), navigate to **Sources**.

1. Select the registered Snowflake source.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the Azure auto-resolved integration runtime if your server is publicly accessible, or your configured self-hosted integration runtime if it isn't publicly available.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select **Basic Authentication** while creating a credential.
        * Provide the user name used to connect to Snowflake in the User name input field.
        * Store the user password used to connect to Snowflake in the secret key.

    1. **Warehouse**: Specify the name of the warehouse instance used to empower scan in capital case. The default role assigned to the user specified in the credential must have USAGE rights on this warehouse.

    1. **Databases**: Specify one or more database instance names to import in capital case. Separate the names in the list with a semi-colon (;). The default role assigned to the user specified in the credential must have adequate rights on the database objects.

    1. **Schema**: List subset of schemas to import expressed as a semicolon separated list. For example, `schema1; schema2`. All user schemas are imported if that list is empty. All system schemas and objects are ignored by default.
        
        Acceptable schema name patterns using SQL LIKE expressions syntax include using %. For example: `A%; %B; %C%; D`:
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters aren't acceptable.

    1. **Maximum memory available** (applicable when using self-hosted integration runtime): Maximum memory (in GB) available on customer's VM to be used by scanning processes. It's dependent on the size of Snowflake source to be scanned.

        > [!Note]
        > As a rule of thumb, please provide 1GB memory for every 1000 tables.

        :::image type="content" source="media/register-scan-snowflake/scan.png" alt-text="scan Snowflake" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Lineage

After scanning your Snowflake source, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details. 

Go to the asset -> lineage tab, you can see the asset relationship when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported Snowflake lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

:::image type="content" source="media/register-scan-snowflake/lineage.png" alt-text="Snowflake lineage view" border="true":::
> [!NOTE]
> If a view was created by tables from different databases, scan all databases simultaneously using the names in the semicolon (;) list.
        
## Troubleshooting tips

- Check your account identifer in the source registration step. Don't include `https://` part at the front.
- Make sure the warehouse name and database name are in capital case on the scan setup page.
- Check your key vault. Make sure there are no typos in the password.
- Check the credential you set up in Microsoft Purview. The user you specify must have a default role with the necessary access rights to both the warehouse and the database you're trying to scan. See [Required permissions for scan](#required-permissions-for-scan). USE `DESCRIBE USER;` to verify the default role of the user you've specified for Microsoft Purview.
- Use Query History in Snowflake to see if any activity is coming across. 
  - If there's a problem with the account identifer or password, you won't see any activity.
  - If there's a problem with the default role, you should at least see a `USE WAREHOUSE . . .` statement.
  - You can use the [QUERY_HISTORY_BY_USER table function](https://docs.snowflake.com/en/sql-reference/functions/query_history.html) to identify what role is being used by the connection. Setting up a dedicated Microsoft Purview user will make troubleshooting easier.

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
