---
title: Connect to and manage SAP HANA
description: This guide describes how to connect to SAP HANA in Azure Purview, and how to use Azure Purview to scan and manage your SAP HANA source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/11/2022
ms.custom: template-how-to
---

# Connect to and manage SAP HANA in Azure Purview (Preview)

This article outlines how to register SAP HANA, and how to authenticate and interact with SAP HANA in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

> [!IMPORTANT]
> SAP HANA as a source is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported capabilities

|**Metadata extraction**|  **Full scan**  |**Incremental scan**|**Scoped scan**|**Classification**|**Access policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| No |

When scanning SAP HANA source, Azure Purview supports extracting technical metadata including:

- Server
- Databases
- Schemas
- Tables including the columns, foreign keys, indexes, and unique constraints
- Views including the columns
- Stored procedures including the parameter dataset and result set
- Functions including the parameter dataset
- Sequences
- Synonyms

## Prerequisites

* You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* You must have an active [Azure Purview resource](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in Azure Purview Studio. For more information about permissions, see [Access control in Azure Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [Create and configure a self-hosted integration runtime](manage-integration-runtimes.md). The minimal supported Self-hosted Integration Runtime version is 5.13.8013.1.

* Ensure that [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the machine where the self-hosted integration runtime is running.

* Ensure that Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the machine where the self-hosted integration runtime is running. If you don't have this update installed, [download it now](https://www.microsoft.com/download/details.aspx?id=30679).

* Download the SAP HANA JDBC driver ([JAR ngdbc](https://mvnrepository.com/artifact/com.sap.cloud.db.jdbc/ngdbc)) on the machine where your self-hosted integration runtime is running.

  > [!Note]
  > The driver should be accessible to all accounts in the machine. Don't put it in a path under user account.

### Required permissions for scan

Azure Purview supports basic authentication (username and password) for scanning SAP HANA. 

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

This section describes how to register a SAP HANA in Azure Purview by using [Azure Purview Studio](https://web.purview.azure.com/).

1. Go to your Azure Purview account.

1. Select **Data Map** on the left pane.

1. Select **Register**.

1. In **Register sources**, select **SAP HANA** > **Continue**.    

1. On the **Register sources (SAP HANA)** screen, do the following:

   1. For **Name**, enter a name that Azure Purview will list as the data source.

   1. For **Server**, enter the host name or IP address used to connect to a SAP HANA source. For example, `MyDatabaseServer.com` or `192.169.1.2`.

   1. For **Port**, enter the port number used to connect to the database server (39013 by default for SAP HANA).

   1. For **Select a collection**, choose a collection from the list or create a new one. This step is optional.

   :::image type="content" source="media/register-scan-sap-hana/configure-sources.png" alt-text="Screenshot that shows boxes for registering SAP HANA sources." border="true":::

1. Select **Finish**.   

## Scan

Use the following steps to scan SAP HANA databases to automatically identify assets and classify your data. For more information about scanning in general, see [Scans and ingestion in Azure Purview](concept-scans-and-ingestion.md).

### Authentication for a scan

The supported authentication type for a SAP HANA source is **Basic authentication**.

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

      For more information, see [Credentials for source authentication in Azure Purview](manage-credentials.md).

    1. **Database**: Specify the name of the database instance to import.

    1. **Schema**: List subset of schemas to import expressed as a semicolon separated list. For example, `schema1; schema2`. All user schemas are imported if that list is empty. All system schemas and objects are ignored by default. When the list is empty, all available schemas are imported.
       
        Acceptable schema name patterns that use SQL `LIKE` expression syntax include the percent sign (%). For example, `A%; %B; %C%; D` means:
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters are not acceptable.

    1. **Driver location**: Specify the path to the JDBC driver location in your machine where self-host integration runtime is running. This should be the path to valid JAR folder location. Do not include the name of the driver in the path.

    1. **Maximum memory available**: Maximum memory (in gigabytes) available on the customer's machine for the scanning processes to use. This value is dependent on the size of SAP HANA database to be scanned.

    :::image type="content" source="media/register-scan-sap-hana/scan.png" alt-text="Screenshot that shows boxes for scan details." border="true":::

1. Select **Continue**.

1. For **Scan trigger**, choose whether to set up a schedule or run the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, use the following guides to learn more about Azure Purview and your data:

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search the data catalog](how-to-search-catalog.md)
