---
title: Connect to and manage Hive Metastore databases
description: This guide describes how to connect to Hive Metastore databases in Azure Purview, and use Purview's features to scan and manage your Hive Metastore database source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Hive Metastore databases in Azure Purview

This article outlines how to register Hive Metastore databases, and how to authenticate and interact with Hive Metastore databases in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | No | No | No| Yes** |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

> [!Important]
> The supported platforms are Apache Hadoop, Cloudera, Hortonworks and Databricks.
> Supported Hive versions are 2.x to 3.x. Supported Databricks versions are 8.0 and above.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](../data-factory/create-self-hosted-integration-runtime.md).

* Ensure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the virtual machine where the self-hosted integration runtime is installed.

* Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

* Download and install Hive Metastore database's JDBC driver on the machine where your self-hosted integration runtime is running. For example, if the database used is mssql, make sure to download [Microsoft's JDBC driver for SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

## Register

This section describes how to register Hive Metastore databases in Azure Purview using the [Purview Studio](https://web.purview.azure.com/).

The only supported authentication for a Hive Metastore database is **Basic authentication.**

### Steps to register

1. Navigate to your Purview account.

1. Select **Data Map** on the left navigation.

1. Select **Register**

1. On Register sources, select Hive **Metastore**. Select **Continue.**

    :::image type="content" source="media/register-scan-hive-metastore-source/register-sources.png" alt-text="register hive source" border="true":::

On the Register sources (Hive Metastore) screen, do the following:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **Hive Cluster URL.** The Cluster URL can be either obtained from the Ambari URL or from Databricks workspace URL. For example, hive.azurehdinsight.net or adb-19255636414785.5.azuredatabricks.net

1. Enter the **Hive Metastore Server URL.** For example, sqlserver://hive.database.windows.net or jdbc:spark://adb-19255636414785.5.azuredatabricks.net:443

1. Select a collection or create a new one (Optional).

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-hive-metastore-source/configure-sources.png" alt-text="configure hive source" border="true":::

## Scan

Follow the steps below to scan Hive Metastore databases to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md) to set up a self-hosted integration runtime.

1. Navigate to **Sources**.

1. Select the registered **Hive Metastore** database.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:

       * Select Basic Authentication while creating a credential.
       * Provide the Metastore username in the User name input field
       * Store the Metastore password in the secret key.

       To understand more on credentials, refer to the link [here](manage-credentials.md).

       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**

       The username and password can be accessed from the two properties as shown below:

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-credentials.png" alt-text="databricks-username-password-details" border="true":::

    1. **Metastore JDBC Driver Location**: Specify the path to the JDBC driver location on your VM where self-host integration runtime is running. This should be the path to valid JARs folder location.

       If you are scanning Databricks, refer to the section on Databricks below.

       > [!Note]
       > The driver should be accessible to all accounts in the VM. Please do not install in a user account.

    1. **Metastore JDBC Driver Class**: Provide the connection driver class name. For example,\com.microsoft.sqlserver.jdbc.SQLServerDriver.

       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**

       The driver class can be accessed from the property as shown below.

        :::image type="content" source="media/register-scan-hive-metastore-source/databricks-driver-class-name.png" alt-text="databricks-driver-class-details" border="true":::

    1. **Metastore JDBC URL**: Provide the Connection URL value and define connection to Metastore DB server URL. For example: `jdbc:sqlserver://hive.database.windows.net;database=hive;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300`.

       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**

       The JDBC URL can be accessed from the Connection URL property as shown below.

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-jdbc-connection.png" alt-text="databricks-jdbc-url-details" border="true":::

       > [!NOTE]
       > When you copy the URL from *hive-site.xml*, remove `amp;` from the string or the scan will fail. Then append the path to your SSL certificate to the URL. This will be the path to the SSL certificate's location on your VM. [Download the SSL certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem).
       >
       > When you enter local file system paths in the Purview Studio scan configuration, remember to change the Windows path separator character from `\` to `/`. For example, if your MariaDB JAR file is *C:\mariadb-jdbc.jar*, change it to *C:/mariadb-jdbc.jar*. Make the same change to the Metastore JDBC URL `sslCA` parameter. For example, if it is placed at local file system path *D:\Drivers\SSLCert\BaltimoreCyberTrustRoot.crt.pem*, change it to *D:/Drivers/SSLCert/BaltimoreCyberTrustRoot.crt.pem*.


       The **Metastore JDBC URL** will look like this example:

       `jdbc:mariadb://consolidated-westus2-prod-metastore-addl-1.mysql.database.azure.com:3306/organization1829255636414785?trustServerCertificate=true&useSSL=true&sslCA=D:/Drivers/SSLCert/BaltimoreCyberTrustRoot.crt.pem`

    1. **Metastore database name**: Provide the Hive Metastore Database name.

       If you are scanning Databricks, refer to the section on Databricks below.

       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**

       The database name can be accessed from the JDBC URL property as shown below. For Example: organization1829255636414785

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-data-base-name.png" alt-text="databricks-database-name-details" border="true":::

    1. **Schema**: Specify a list of Hive schemas to import. For example, schema1; schema2.

        All user schemas are imported if that list is empty. All system schemas (for example, SysAdmin) and objects are ignored by default.

        When the list is empty, all available schemas are imported. Acceptable schema name patterns using SQL LIKE expressions syntax include using %. For example: A%; %B; %C%; D

        * Start with A or
        * end with B or
        * contain C or
        * equal D

        Usage of NOT and special characters are not acceptable.

    1. **Maximum memory available**: Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of Hive Metastore database to be scanned.

        :::image type="content" source="media/register-scan-hive-metastore-source/scan.png" alt-text="scan hive source" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

## Next steps

Now that you have registered your source, follow the below guides to learn more about Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
