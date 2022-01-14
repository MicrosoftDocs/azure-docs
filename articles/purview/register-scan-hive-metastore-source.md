---
title: Connect to and manage Hive Metastore databases
description: This guide describes how to connect to Hive Metastore databases in Azure Purview, and how to use Azure Purview to scan and manage your Hive Metastore database source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/11/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Hive Metastore databases in Azure Purview

This article outlines how to register Hive Metastore databases, and how to authenticate and interact with Hive Metastore databases in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata extraction**|  **Full scan**  |**Incremental scan**|**Scoped scan**|**Classification**|**Access policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| Yes** |

\** Lineage is supported if the dataset is used as a source or sink in the [Azure Data Factory Copy activity](how-to-link-azure-data-factory.md).

 The supported Hive versions are 2.x to 3.x. The supported platforms are Apache Hadoop, Cloudera, Hortonworks, and Azure Databricks (versions 8.0 and later).

When scanning Hive metastore source, Azure Purview supports:

- Extracting technical metadata including:

   - Server
   - Databases
   - Tables including the columns, foreign keys, unique constraints, and storage description
   - Views including the columns and storage description
   - Processes

- Fetching static lineage on assets relationships among tables and views.

## Prerequisites

* You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* You must have an active [Azure Purview resource](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in Azure Purview Studio. For more information about permissions, see [Access control in Azure Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [Create and configure a self-hosted integration runtime](manage-integration-runtimes.md).

* Ensure that [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the machine where the self-hosted integration runtime is running.

* Ensure that Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the machine where the self-hosted integration runtime is running. If you don't have this update installed, [download it now](https://www.microsoft.com/download/details.aspx?id=30679).

* Download and install the Hive Metastore database's JDBC driver on the machine where your self-hosted integration runtime is running. For example, if the database is *mssql*, download [Microsoft's JDBC driver for SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).

  > [!Note]
  > The driver should be accessible to all accounts in the machine. Don't install it in a user account.

## Register

This section describes how to register a Hive Metastore database in Azure Purview by using [Azure Purview Studio](https://web.purview.azure.com/).

The only supported authentication for a Hive Metastore database is Basic Authentication.

1. Go to your Azure Purview account.

1. Select **Data Map** on the left pane.

1. Select **Register**.

1. In **Register sources**, select **Hive Metastore** > **Continue**.    

1. On the **Register sources (Hive Metastore)** screen, do the following:

   1. For **Name**, enter a name that Azure Purview will list as the data source.

   1. For **Hive Cluster URL**, enter a value that you get from the Ambari URL or the Azure Databricks workspace URL. For example, enter **hive.azurehdinsight.net** or **adb-19255636414785.5.azuredatabricks.net**.

   1. For **Hive Metastore Server URL**, enter a URL for the server. For example, enter **sqlserver://hive.database.windows.net** or **jdbc:spark://adb-19255636414785.5.azuredatabricks.net:443**.

   1. For **Select a collection**, choose a collection from the list or create a new one. This step is optional.

   :::image type="content" source="media/register-scan-hive-metastore-source/configure-sources.png" alt-text="Screenshot that shows boxes for registering Hive sources." border="true":::

1. Select **Finish**.   

## Scan

Use the following steps to scan Hive Metastore databases to automatically identify assets and classify your data. For more information about scanning in general, see [Scans and ingestion in Azure Purview](concept-scans-and-ingestion.md).

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

       For more information, see [Credentials for source authentication in Azure Purview](manage-credentials.md).

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can also access the username and password from the following two properties:

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-credentials.png" alt-text="Screenshot that shows Azure Databricks username and password examples as property values." border="true":::

    1. **Metastore JDBC Driver Location**: Specify the path to the JDBC driver location on your machine where the self-hosted integration runtime is running. This should be a valid path to the folder for JAR files.

       If you're scanning Azure Databricks, refer to the information on Azure Databricks in the next step.

       > [!Note]
       > The driver should be accessible to all accounts in the machine. Don't install it in a user account.

    1. **Metastore JDBC Driver Class**: Provide the class name for the connection driver. For example, enter **\com.microsoft.sqlserver.jdbc.SQLServerDriver**.

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can access the driver class from the following property:

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-driver-class-name.png" alt-text="Screenshot that shows a driver class as a property value." border="true":::

    1. **Metastore JDBC URL**: Provide the connection URL value and define the connection to the URL of the Metastore database server. For example: `jdbc:sqlserver://hive.database.windows.net;database=hive;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300`.

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can access the JDBC URL from the connection URL property, as shown in the following screenshot:

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-jdbc-connection.png" alt-text="Screenshot that shows an example connection U R L property." border="true":::

       > [!NOTE]
       > When you copy the URL from *hive-site.xml*, remove `amp;` from the string or the scan will fail. Then append the path to your SSL certificate to the URL. This will be the path to the SSL certificate's location on your machine. [Download the SSL certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem).
       >
       > When you enter local file system paths in the Azure Purview Studio scan configuration, remember to change the Windows path separator character from a backslash (`\`) to a forward slash (`/`). For example, if your MariaDB JAR file is *C:\mariadb-jdbc.jar*, change it to *C:/mariadb-jdbc.jar*. Make the same change to the Metastore JDBC URL `sslCA` parameter. For example, if it's placed at local file system path *D:\Drivers\SSLCert\BaltimoreCyberTrustRoot.crt.pem*, change it to *D:/Drivers/SSLCert/BaltimoreCyberTrustRoot.crt.pem*.

       The **Metastore JDBC URL** value will look like this example:

       `jdbc:mariadb://consolidated-westus2-prod-metastore-addl-1.mysql.database.azure.com:3306/organization1829255636414785?trustServerCertificate=true&useSSL=true&sslCA=D:/Drivers/SSLCert/BaltimoreCyberTrustRoot.crt.pem`

    1. **Metastore database name**: Provide the name of the Hive Metastore database.

       **Azure Databricks usage**: Go to your Azure Databricks cluster, select **Apps**, and then select **Launch Web Terminal**. Run the cmdlet `cat /databricks/hive/conf/hive-site.xml`.

       You can access the database name from the JDBC URL property, as shown in the following screenshot.

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-data-base-name.png" alt-text="Screenshot that shows an example database name as a J D B C property." border="true":::

    1. **Schema**: Specify a list of Hive schemas to import. For example: **schema1; schema2**.

        All user schemas are imported if that list is empty. All system schemas (for example, SysAdmin) and objects are ignored by default.

        When the list is empty, all available schemas are imported. Acceptable schema name patterns that use SQL `LIKE` expression syntax include the percent sign (%). For example, `A%; %B; %C%; D` means:

        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of `NOT` and special characters is not acceptable.

    1. **Maximum memory available**: Maximum memory (in gigabytes) available on the customer's machine for the scanning processes to use. This value is dependent on the size of Hive Metastore database to be scanned.

    :::image type="content" source="media/register-scan-hive-metastore-source/scan.png" alt-text="Screenshot that shows boxes for scan details." border="true":::

1. Select **Continue**.

1. For **Scan trigger**, choose whether to set up a schedule or run the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, use the following guides to learn more about Azure Purview and your data:

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search the data catalog](how-to-search-catalog.md)
