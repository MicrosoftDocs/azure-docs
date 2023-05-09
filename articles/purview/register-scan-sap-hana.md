---
title: Connect to and manage SAP HANA
description: This guide describes how to connect to SAP HANA in Microsoft Purview, and how to use Microsoft Purview to scan and manage your SAP HANA source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/20/2023
ms.custom: template-how-to
---

# Connect to and manage SAP HANA in Microsoft Purview

This article outlines how to register SAP HANA, and how to authenticate and interact with SAP HANA in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No|No | No | No |

When scanning SAP HANA source, Microsoft Purview supports extracting technical metadata including:

- Server
- Databases
- Schemas
- Tables including the columns, foreign keys, indexes, and unique constraints
- Views including the columns. Note SAP HANA Calculation Views are not supported now.
- Stored procedures including the parameter dataset and result set
- Functions including the parameter dataset
- Sequences
- Synonyms

When setting up scan, you can choose to scan an entire SAP HANA database, or scope the scan to a subset of schemas matching the given name(s) or name pattern(s).

### Known limitations

When object is deleted from the data source, currently the subsequent scan won't automatically remove the corresponding asset in Microsoft Purview.

## Prerequisites

* You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* You must have an active [Microsoft Purview account](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [Create and configure a self-hosted integration runtime](manage-integration-runtimes.md). The minimal supported Self-hosted Integration Runtime version is 5.13.8013.1.

    * Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.

    * Ensure that Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the machine where the self-hosted integration runtime is running. If you don't have this update installed, [download it now](https://www.microsoft.com/download/details.aspx?id=30679).

    * Download the SAP HANA JDBC driver ([JAR ngdbc](https://mvnrepository.com/artifact/com.sap.cloud.db.jdbc/ngdbc)) on the machine where your self-hosted integration runtime is running. Note down the folder path which you will use to set up the scan.

      > [!Note]
      > The driver should be accessible by the self-hosted integration runtime. By default, self-hosted integration runtime uses [local service account "NT SERVICE\DIAHostService"](manage-integration-runtimes.md#service-account-for-self-hosted-integration-runtime). Make sure it has "Read and execute" and "List folder contents" permission to the driver folder.

### Required permissions for scan

Microsoft Purview supports basic authentication (username and password) for scanning SAP HANA. 

The SAP HANA user you specified must have the permission to select metadata of the schemas you want to import.

```sql
CREATE USER <user> PASSWORD <password> NO FORCE_FIRST_PASSWORD_CHANGE;
GRANT SELECT METADATA ON SCHEMA <schema1> TO <user>;
GRANT SELECT METADATA ON SCHEMA <schema2> TO <user>;
```

And the user must have the permission to select on system table _SYS_REPO.ACTIVE_OBJECT and on system schemas _SYS_BI and _SYS_BIC.

```sql
GRANT SELECT ON _SYS_REPO.ACTIVE_OBJECT TO <user>;
GRANT SELECT ON SCHEMA _SYS_BI TO <user>;
GRANT SELECT ON SCHEMA _SYS_BIC TO <user>;
```

## Register

This section describes how to register an SAP HANA in Microsoft Purview by using [the Microsoft Purview governance portal](https://web.purview.azure.com/).

1. Open the Microsoft Purview governance portal by:
    - Browsing directly to [https://web.purview.azure.com](https://web.purview.azure.com) and selecting your Microsoft Purview account.
    - Opening the [Azure portal](https://portal.azure.com), searching for and selecting the Microsoft Purview account. Selecting the [**the Microsoft Purview governance portal**](https://web.purview.azure.com/) button.
1. Select **Data Map** on the left pane.

1. Select **Register**.

1. In **Register sources**, select **SAP HANA** > **Continue**.    

1. On the **Register sources (SAP HANA)** screen, do the following:

   1. For **Name**, enter a name that Microsoft Purview will list as the data source.

   1. For **Server**, enter the host name or IP address used to connect to an SAP HANA source. For example, `MyDatabaseServer.com` or `192.169.1.2`.

   1. For **Port**, enter the port number used to connect to the database server (39013 by default for SAP HANA).

   1. For **Select a collection**, choose a collection from the list or create a new one. This step is optional.

   :::image type="content" source="media/register-scan-sap-hana/configure-sources.png" alt-text="Screenshot that shows boxes for registering SAP HANA sources." border="true":::

1. Select **Finish**.   

## Scan

Use the following steps to scan SAP HANA databases to automatically identify assets. For more information about scanning in general, see [Scans and ingestion in Microsoft Purview](concept-scans-and-ingestion.md).

### Authentication for a scan

The supported authentication type for an SAP HANA source is **Basic authentication**.

### Create and run scan

1. In the Management Center, select integration runtimes. Make sure that a self-hosted integration runtime is set up. If it isn't set up, use the steps in [Create and manage a self-hosted integration runtime](./manage-integration-runtimes.md).

1. Go to **Sources**.

1. Select the registered SAP HANA source.

1. Select **+ New scan**.

1. Provide the following details:

   1. **Name**: Enter a name for the scan.

   1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

   1. **Credential**: Select the credential to connect to your data source. Make sure to:

      * Select **Basic Authentication** while creating a credential.
      * Provide the user name used to connect to the database server in the User name input field.
      * Store the user password used to connect to the database server in the secret key.

      For more information, see [Credentials for source authentication in Microsoft Purview](manage-credentials.md).

    1. **Database**: Specify the name of the database instance to import.

    1. **Schema**: List subset of schemas to import expressed as a semicolon separated list. For example, `schema1; schema2`. All user schemas are imported if that list is empty. All system schemas and objects are ignored by default.
       
        Acceptable schema name patterns that use SQL `LIKE` expression syntax include the percent sign (%). For example, `A%; %B; %C%; D` means:
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters aren't acceptable.

    1. **Driver location**: Specify the path to the JDBC driver location in your machine where self-host integration runtime is running, e.g. `D:\Drivers\SAPHANA`. It's the path to valid JAR folder location. Make sure the driver is accessible by the self-hosted integration runtime, learn more from [prerequisites section](#prerequisites).

    1. **Maximum memory available**: Maximum memory (in gigabytes) available on the customer's machine for the scanning processes to use. This value is dependent on the size of SAP HANA database to be scanned.

    :::image type="content" source="media/register-scan-sap-hana/scan.png" alt-text="Screenshot that shows boxes for scan details." border="true":::

1. Select **Continue**.

1. For **Scan trigger**, choose whether to set up a schedule or run the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, use the following guides to learn more about Microsoft Purview and your data:

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search the data catalog](how-to-search-catalog.md)
