---
title: Govern Hive Metastore databases
description: This guide describes how to connect to Hive Metastore databases in Microsoft Purview, and how to use Microsoft Purview to scan and manage your Hive Metastore database source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 05/04/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Govern Hive Metastore databases in Microsoft Purview

This article outlines how to register Hive Metastore databases, and how to authenticate and interact with Hive Metastore databases in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| [Yes*](#lineage) | No |

\* *Besides the lineage on assets within the data source, lineage is also supported if dataset is used as a source/sink in [Data Factory](how-to-link-azure-data-factory.md) or [Synapse pipeline](how-to-lineage-azure-synapse-analytics.md).*

 The supported Hive versions are 2.x to 3.x. The supported platforms are Apache Hadoop, Cloudera, Hortonworks, and Azure Databricks (versions 8.0 and later).

When scanning Hive metastore source, Microsoft Purview supports:

- Extracting technical metadata including:

   - Server
   - Databases
   - Tables including the columns, foreign keys, unique constraints, and storage description
   - Views including the columns and storage description
   - Processes

- Fetching static lineage on assets relationships among tables and views.

When setting up scan, you can choose to scan an entire Hive metastore database, or scope the scan to a subset of schemas matching the given name(s) or name pattern(s).

## Prerequisites

* You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* You must have an active [Microsoft Purview account](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [Create and configure a self-hosted integration runtime](manage-integration-runtimes.md).

    * Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.

    * Ensure that Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the machine where the self-hosted integration runtime is running. If you don't have this update installed, [download it now](https://www.microsoft.com/download/details.aspx?id=30679).

    * Download the Hive Metastore database's JDBC driver on the machine where your self-hosted integration runtime is running. For example, if the database is *mssql*, download [Microsoft's JDBC driver for SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server). If you scan Azure Databricks's Hive Metastore, download the MariaDB Connector/J version 2.7.5 from [here](https://dlm.mariadb.com/1965742/Connectors/java/connector-java-2.7.5/mariadb-java-client-2.7.5.jar); version 3.0.3 isn't supported. Note down the folder path that you'll use to set up the scan.

        > [!Note]
        > The driver should be accessible by the self-hosted integration runtime. By default, self-hosted integration runtime uses [local service account "NT SERVICE\DIAHostService"](manage-integration-runtimes.md#service-account-for-self-hosted-integration-runtime). Make sure it has "Read and execute" and "List folder contents" permission to the driver folder.

## Register

This section describes how to register a Hive Metastore database in Microsoft Purview by using [the Microsoft Purview governance portal](https://web.purview.azure.com/).

The only supported authentication for a Hive Metastore database is Basic Authentication.

1. Go to your Microsoft Purview account.

1. Select **Data Map** on the left pane.

1. Select **Register**.

1. In **Register sources**, select **Hive Metastore** > **Continue**.    

1. On the **Register sources (Hive Metastore)** screen, do the following:

   1. For **Name**, enter a name that Microsoft Purview will list as the data source.

   1. For **Hive Cluster URL**, enter a value that you get from the Ambari URL or the Azure Databricks workspace URL. For example, enter **hive.azurehdinsight.net** or **adb-19255636414785.5.azuredatabricks.net**.

   1. For **Hive Metastore Server URL**, enter a URL for the server. For example, enter **sqlserver://hive.database.windows.net** or **jdbc:spark://adb-19255636414785.5.azuredatabricks.net:443**.

   1. For **Select a collection**, choose a collection from the list or create a new one. This step is optional.

   :::image type="content" source="media/register-scan-hive-metastore-source/configure-sources.png" alt-text="Screenshot that shows boxes for registering Hive sources." border="true":::

1. Select **Finish**.   

## Scan

> [!TIP]
> To troubleshoot any issues with scanning:
> 1. Confirm you have followed all [**prerequisites**](#prerequisites).
> 1. Review our [**scan troubleshooting documentation**](troubleshoot-connections.md).

Use the following steps to scan Hive Metastore databases to automatically identify assets. For more information about scanning in general, see [Scans and ingestion in Microsoft Purview](concept-scans-and-ingestion.md).

1. In the Management Center, select integration runtimes. Make sure that a self-hosted integration runtime is set up. If it isn't set up, use the steps in [Create and manage a self-hosted integration runtime](./manage-integration-runtimes.md).

1. Go to **Sources**.

1. Select the registered Hive Metastore database.

1. Select **+ New scan**.

1. Provide the following details:

    1. **Name**: Enter a name for the scan.

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:

       * Select Basic Authentication while creating a credential.
       * Provide the Metastore username in the appropriate box.
       * Store the Metastore password in the secret key.

       For more information, see [Credentials for source authentication in Microsoft Purview](manage-credentials.md).

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can also access the username and password from the following two properties:

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-credentials.png" alt-text="Screenshot that shows Azure Databricks username and password examples as property values." border="true":::

    1. **Metastore JDBC Driver Location**: Specify the path to the JDBC driver location in your machine where self-host integration runtime is running, for example, `D:\Drivers\HiveMetastore`. It's the path to valid JAR folder location. Make sure the driver is accessible by the self-hosted integration runtime, learn more from [prerequisites section](#prerequisites).

       > [!Note]
       > If you scan Azure Databricks's Hive Metastore, download the MariaDB Connector/J version 2.7.5 from [here](https://dlm.mariadb.com/1965742/Connectors/java/connector-java-2.7.5/mariadb-java-client-2.7.5.jar). Version 3.0.3 is not supported.

    1. **Metastore JDBC Driver Class**: Provide the class name for the connection driver. For example, enter **\com.microsoft.sqlserver.jdbc.SQLServerDriver**.

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can access the driver class from the following property:

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-driver-class-name.png" alt-text="Screenshot that shows a driver class as a property value." border="true":::

    1. **Metastore JDBC URL**: Provide the connection URL value and define the connection to the URL of the Metastore database server. For example: `jdbc:sqlserver://hive.database.windows.net;database=hive;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300`.

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can access the JDBC URL from the connection URL property, as shown in the following screenshot:

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-jdbc-connection.png" alt-text="Screenshot that shows an example connection U R L property." border="true":::

       > [!NOTE]
       > When you copy the URL from *hive-site.xml*, remove `amp;` from the string or the scan will fail. 
       >
       > [Download the SSL certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) to the self-hosted integration runtime machine, then update the path to the SSL certificate's location on your machine in the URL. 
       >
       > When you enter local file paths in the scan configuration, change the Windows path separator character from a backslash (`\`) to a forward slash (`/`). For example, if you place the SSL certificate at local file path *D:\Drivers\SSLCert\BaltimoreCyberTrustRoot.crt.pem*, change the `serverSslCert` parameter value to *D:/Drivers/SSLCert/BaltimoreCyberTrustRoot.crt.pem*.

       The **Metastore JDBC URL** value will look like this example:
       
       `jdbc:mariadb://consolidated-westus2-prod-metastore-addl-1.mysql.database.azure.com:3306/organizationXXXXXXXXXXXXXXXX?useSSL=true&enabledSslProtocolSuites=TLSv1,TLSv1.1,TLSv1.2&serverSslCert=D:/Drivers/SSLCert/BaltimoreCyberTrustRoot.crt.pem`

    1. **Metastore database name**: Provide the name of the Hive Metastore database.

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can access the database name from the JDBC URL property, as shown in the following screenshot.

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-data-base-name.png" alt-text="Screenshot that shows an example database name as a J D B C property." border="true":::

    1. **Schema**: Specify a list of Hive schemas to import. For example: **schema1; schema2**.

        All user schemas are imported if that list is empty. All system schemas (for example, SysAdmin) and objects are ignored by default.

        Acceptable schema name patterns that use SQL `LIKE` expression syntax include the percent sign (%). For example, `A%; %B; %C%; D` means:

        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of `NOT` and special characters isn't acceptable.

    1. **Maximum memory available**: Maximum memory (in gigabytes) available on the customer's machine for the scanning processes to use. This value is dependent on the size of Hive Metastore database to be scanned.

    :::image type="content" source="media/register-scan-hive-metastore-source/scan.png" alt-text="Screenshot that shows boxes for scan details." border="true":::

1. Select **Continue**.

1. For **Scan trigger**, choose whether to set up a schedule or run the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Lineage

After scanning your Hive Metastore source, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details. 

Go to the asset -> lineage tab, you can see the asset relationship when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported Hive Metastore lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

## Next steps

Now that you've registered your source, use the following guides to learn more about Microsoft Purview and your data:

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search the data catalog](how-to-search-catalog.md)
