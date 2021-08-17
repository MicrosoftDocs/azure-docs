---
title: Register Hive Metastore database and setup scans in Azure Purview
description: This article outlines how to register Hive Metastore database in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 5/17/2021
---
# Register and Scan Hive Metastore Database

This article outlines how to register a Hive Metastore database in
Purview and set up a scan.

## Supported Capabilities

The Hive Metastore source supports Full scan to extract metadata from a **Hive Metastore database** and fetches Lineage between data assets. The supported platforms are Apache Hadoop, Cloudera, Hortonworks and Databricks.

## Prerequisites

1.  Set up the latest [self-hosted integration
    runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md).

2.  Make sure [JDK
    11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    is installed on your virtual machine where self-hosted integration
    runtime is installed.

3.  Make sure \"Visual C++ Redistributable 2012 Update 4\" is installed
    on the self-hosted integration runtime machine. If you don\'t yet
    have it installed, download it from
    [here](https://www.microsoft.com/download/details.aspx?id=30679).

4.  You will have to manually download the Hive Metastore database's
    JDBC driver on your virtual machine where self-hosted integration
    runtime is running. For example, if the database used is mssql, make
    sure to download [Microsoft's JDBC driver for SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

5.  Supported Hive versions are 2.x to 3.x. Supported Databricks versions are 8.0 and above. 

## Setting up authentication for a scan

The only supported authentication for a Hive Metastore database is **Basic authentication.**

## Register a Hive Metastore database

To register a new Hive Metastore database in your data catalog, do the
following:

1.  Navigate to your Purview account.

2.  Select **Data Map** on the left navigation.

3.  Select **Register**

4.  On Register sources, select Hive **Metastore**. Select **Continue.**

    :::image type="content" source="media/register-scan-hive-metastore-source/register-sources.png" alt-text="register hive source" border="true":::

On the Register sources (Hive Metastore) screen, do the following:

1.  Enter a **Name** that the data source will be listed within the
    Catalog.

2.  Enter the **Hive Cluster URL.** The Cluster URL can be either
    obtained from the Ambari URL or from Databricks workspace URL. For
    example, hive.azurehdinsight.net or adb-19255636414785.5.azuredatabricks.net

3.  Enter the **Hive Metastore Server URL.** For example,
    sqlserver://hive.database.windows.net or jdbc:spark://adb-19255636414785.5.azuredatabricks.net:443

4.  Select a collection or create a new one (Optional)

5.  Finish to register the data source.

       :::image type="content" source="media/register-scan-hive-metastore-source/configure-sources.png" alt-text="configure hive source" border="true":::


## Creating and running a scan

To create and run a new scan, do the following:

1.  In the Management Center, click on Integration runtimes. Make sure a
    self-hosted integration runtime is set up. If it is not set up, use
    the steps mentioned [here](./manage-integration-runtimes.md)
    to setup a self-hosted integration runtime

2.  Navigate to **Sources**.

3.  Select the registered **Hive Metastore** database.

4.  Select **+ New scan**.

5.  Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:

       - Select Basic Authentication while creating a credential.
       - Provide the Metastore username in the User name input field
       - Store the Metastore password in the secret key.

       To understand more on credentials, refer to the link [here](manage-credentials.md). 

       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**

       The username and password can be accessed from the two properties as shown below

       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-credentials.png" alt-text="databricks-username-password-details" border="true":::

    1. **Metastore JDBC Driver Location**: Specify the path to the JDBC driver location on your VM where self-host integration runtime is running. This should be the path to valid JARs folder location.

       If you are scanning Databricks, refer to the section on Databricks below.

       > [!Note]
       > The driver should be accessible to all accounts in the VM. Please do not install in a user account.

    1. **Metastore JDBC Driver Class**: Provide the connection driver class name. For example,\com.microsoft.sqlserver.jdbc.SQLServerDriver.
    
       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**
    
       The driver class can be accessed from the property as shown below.
    :::image type="content" source="media/register-scan-hive-metastore-source/databricks-driver-class-name.png" alt-text="databricks-driver-class-details" border="true":::

    1. **Metastore JDBC URL**: Provide the Connection URL value and define connection to Metastore DB server URL. For example,     `jdbc:sqlserver://hive.database.windows.net;database=hive;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=300`.

       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**
    
       The JDBC URL can be accessed from the Connection URL property as shown below.
       
       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-jdbc-connection.png" alt-text="databricks-jdbc-url-details" border="true":::
    
       > [!NOTE]
       > When you copy the URL from *hive-site.xml*, be sure you remove `amp;` from the string or the scan will fail.

       To this URL, append the path to the location where SSL certificate is placed on your VM. The SSL certificate can be downloaded from [here](../mysql/howto-configure-ssl.md).

       The metastore JDBC URL will be:
    
       `jdbc:mariadb://consolidated-westus2-prod-metastore-addl-1.mysql.database.azure.com:3306/organization1829255636414785?trustServerCertificate=true&amp;useSSL=true&sslCA=D:\Drivers\SSLCert\BaltimoreCyberTrustRoot.crt.pem`

    1. **Metastore database name**: Provide the Hive Metastore Database name.
    
       If you are scanning Databricks, refer to the section on Databricks below.

       **Databricks usage**: Navigate to your Databricks cluster -> Apps -> Launch Web Terminal. Run the cmdlet **cat /databricks/hive/conf/hive-site.xml**

       The database name can be accessed from the JDBC URL property as shown below. For Example: organization1829255636414785
       
       :::image type="content" source="media/register-scan-hive-metastore-source/databricks-data-base-name.png" alt-text="databricks-database-name-details" border="true":::

    1. **Schema**: Specify a list of Hive schemas to import. For example, schema1; schema2. 
    
        All user schemas are imported if that list is empty. All system schemas (for example, SysAdmin) and objects are ignored by default. 

        When the list is empty, all available schemas are imported. Acceptable schema name patterns using SQL LIKE expressions syntax include using %, e.g. A%; %B; %C%; D

        - start with A or    
        - end with B or    
        - contain C or    
        - equal D

        Usage of NOT and special characters are not acceptable.

     1. **Maximum memory available**: Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of Hive Metastore database to be scanned.

        :::image type="content" source="media/register-scan-hive-metastore-source/scan.png" alt-text="scan hive source" border="true":::

6.  Click on **Continue**.

7.  Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

8.  Review your scan and click on **Save and Run**.

## Viewing your scans and scan runs

1. Navigate to the management center. Select **Data sources** under the **Sources and scanning** section.

2. Select the desired data source. You will see a list of existing scans on that data source.

3. Select the scan whose results you are interested to view.

4. This page will show you all of the previous scan runs along with metrics and status for each scan run. It will also display whether your scan was scheduled or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan, and the total scan duration.

## Manage your scans

To manage or delete a scan, do the following:

1. Navigate to the management center. Select **Data sources** under the **Sources and scanning** section then select on the desired data source.

2. Select the scan you would like to manage. You can edit the scan by selecting **Edit**.

3. You can delete your scan by selecting **Delete**.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
