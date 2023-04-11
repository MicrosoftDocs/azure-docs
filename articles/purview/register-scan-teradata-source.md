---
title: Connect to and manage Teradata
description: This guide describes how to connect to Teradata in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Teradata source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 03/31/2023
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Teradata in Microsoft Purview

This article outlines how to register Teradata, and how to authenticate and interact with Teradata in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan)| [Yes](#scan)| No | [Yes*](#lineage)| No |

\* *Besides the lineage on assets within the data source, lineage is also supported if dataset is used as a source/sink in [Data Factory](how-to-link-azure-data-factory.md) or [Synapse pipeline](how-to-lineage-azure-synapse-analytics.md).*

The supported Teradata database versions are 12.x to 17.x.

When scanning Teradata source, Microsoft Purview supports:

- Extracting technical metadata including:

    - Server
    - Databases
    - Tables including the columns, foreign keys, indexes, and constraints
    - Views including the columns
    - Stored procedures including the parameter dataset and result set
    - Functions including the parameter dataset

- Fetching static lineage on assets relationships among tables, views and stored procedures.

When setting up scan, you can choose to scan an entire Teradata server, or scope the scan to a subset of databases matching the given name(s) or name pattern(s).

### Required permissions for scan

Microsoft Purview supports basic authentication (username and password) for scanning Teradata. The user should have SELECT permission granted for every individual system table listed below: 

```sql
grant select on dbc.tvm to [user]; 
grant select on dbc.dbase to [user]; 
grant select on dbc.tvfields to [user]; 
grant select on dbc.udtinfo to [user]; 
grant select on dbc.idcol to [user]; 
grant select on dbc.udfinfo to [user];
```

To retrieve data types of view columns, Microsoft Purview issues a prepare statement for `select * from <view>` for each of the view queries and parse the metadata that contains the data type details for better performance. It requires the SELECT data permission on views. If the permission is missing, view column data types will be skipped.

For classification, user also needs to have read permission on the tables/views to retrieve sample data.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

    * Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.

    * Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

    * Download the [Teradata JDBC driver](https://downloads.teradata.com/) on the machine where your self-hosted integration runtime is running. Note down the folder path which you will use to set up the scan.

        > [!Note]
        > The driver should be accessible by the self-hosted integration runtime. By default, self-hosted integration runtime uses [local service account "NT SERVICE\DIAHostService"](manage-integration-runtimes.md#service-account-for-self-hosted-integration-runtime). Make sure it has "Read and execute" and "List folder contents" permission to the driver folder.

## Register

This section describes how to register Teradata in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Steps to register

1.  Navigate to your Microsoft Purview account.
1.  Select **Data Map** on the left navigation.
1.  Select **Register**
1.  On Register sources, select **Teradata**. Select **Continue**

    :::image type="content" source="media/register-scan-teradata-source/register-sources.png" alt-text="register Teradata options" border="true":::

On the **Register sources (Teradata)** screen, do the following:

1.  Enter a **Name** that the data source will be listed with in the Catalog.

1.  Enter the **Host** name to connect to a Teradata source. It can also be an IP address of the server.

1.  Select a collection or create a new one (Optional)

1.  Finish to register the data source.

    :::image type="content" source="media/register-scan-teradata-source/register-sources-2.png" alt-text="register Teradata" border="true":::

## Scan

Follow the steps below to scan Teradata to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

1. In the Management Center, select **Integration runtimes**. Make sure a self-hosted integration runtime is set up. If it isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to set up a self-hosted integration runtime

1. Select the **Data Map** tab on the left pane in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

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

        Usage of NOT and special characters aren't acceptable

    1. **Driver location**: Specify the path to the JDBC driver location in your machine where self-host integration runtime is running, e.g. `D:\Drivers\Teradata`. It's the path to valid JAR folder location. Make sure the driver is accessible by the self-hosted integration runtime, learn more from [prerequisites section](#prerequisites).

    1. **Stored procedure details**: Controls the number of details imported from stored procedures:

        - Signature: The name and parameters of stored procedures.
        - Code, signature: The name, parameters and code of stored procedures.
        - Lineage, code, signature: The name, parameters and code of stored procedures, and the data lineage derived from the code.
        - None: Stored procedure details aren't included.
        
    1. **Maximum memory available:** Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of Teradata source to be scanned.

        > [!Note]
        > As a rule of thumb, please provide 2GB memory for every 1000 tables

        :::image type="content" source="media/register-scan-teradata-source/setup-scan.png" alt-text="setup scan" border="true":::

1. Select **Continue**.

1. Select a **scan rule set** for classification. You can choose between the system default, existing custom rule sets, or [create a new rule set](create-a-scan-rule-set.md) inline.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Lineage

After scanning your Teradata source, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details. 

Go to the asset -> lineage tab, you can see the asset relationship when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported Teradata lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

:::image type="content" source="media/register-scan-teradata-source/lineage.png" alt-text="Teradata lineage view" border="true":::

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
