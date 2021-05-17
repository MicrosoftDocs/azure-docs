---
title: Register Oracle source and setup scans (preview) in Azure Purview
description: This article outlines how to register Oracle source in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 2/25/2021
---
# Register and Scan Oracle source (preview)

This article outlines how to register an Oracle data base in Purview and set up a scan.

## Supported capabilities

The Oracle source supports **Full scan** to extract metadata from an Oracle database and fetches **Lineage** between data assets.

## Prerequisites

1.  Set up the latest [self-hosted integration
    runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see [Create and configure a self-hosted
    integration
    runtime](../data-factory/create-self-hosted-integration-runtime.md).

2.  Make sure [JDK
    11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    is installed on your virtual machine where self-hosted integration
    runtime is installed.

3.  Make sure \"Visual C++ Redistributable 2012 Update 4\" is installed
    on the self-hosted integration runtime machine. If you don\'t yet
    have it installed, download it from
    [here](https://www.microsoft.com/download/details.aspx?id=30679).

4.  You will have to manually download an Oracle JDBC driver from [here](https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html) on your virtual machine where self-hosted integration runtime is running.

    > [!Note] 
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

5.  Supported Oracle database versions are 6i to 19c.

6.  User permission: A read-only access to system tables is required. 
The user should have permission to create a session as well as role SELECT\_CATALOG\_ROLE assigned. Alternatively, the user may have SELECT permission granted for every individual system table that this connector queries metadata from:
       > grant create session to \[user\];\
        grant select on all\_users to \[user\];\
        grant select on dba\_objects to \[user\];\
        grant select on dba\_tab\_comments to \[user\];\
        grant select on dba\_external\_locations to \[user\];\
        grant select on dba\_directories to \[user\];\
        grant select on dba\_mviews to \[user\];\
        grant select on dba\_clu\_columns to \[user\];\
        grant select on dba\_tab\_columns to \[user\];\
        grant select on dba\_col\_comments to \[user\];\
        grant select on dba\_constraints to \[user\];\
        grant select on dba\_cons\_columns to \[user\];\
        grant select on dba\_indexes to \[user\];\
        grant select on dba\_ind\_columns to \[user\];\
        grant select on dba\_procedures to \[user\];\
        grant select on dba\_synonyms to \[user\];\
        grant select on dba\_views to \[user\];\
        grant select on dba\_source to \[user\];\
        grant select on dba\_triggers to \[user\];\
        grant select on dba\_arguments to \[user\];\
        grant select on dba\_sequences to \[user\];\
        grant select on dba\_dependencies to \[user\];\
        grant select on V\_\$INSTANCE to \[user\];\
        grant select on v\_\$database to \[user\];
    
## Setting up authentication for a scan

The only supported authentication for an Oracle source is **Basic authentication**.

## Register an Oracle source

To register a new Oracle source in your data catalog, do the following:

1.  Navigate to your Purview account.
2.  Select **Sources** on the left navigation.
3.  Select **Register**
4.  On Register sources, select **Oracle**. Select **Continue**.

    :::image type="content" source="media/register-scan-oracle-source/register-sources.png" alt-text="register sources" border="true":::

On the **Register sources (Oracle)** screen, do the following:

1.  Enter a **Name** that the data source will be listed within the Catalog.

2.  Enter the **Host** name to connect to an Oracle source. This can
    either be:
    - A host name used by JDBC to connect to the database server. For
        for example, MyDatabaseServer.com or
    - IP address. For for example,192.169.1.2 or
    - Its fully qualified JDBC connection string. For for example,\
        jdbc:oracle:thin:@(DESCRIPTION=(LOAD\_BALANCE=on)(ADDRESS=(PROTOCOL=TCP)(HOST=oracleserver1)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=oracleserver2)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=oracleserver3)(PORT=1521))(CONNECT\_DATA=(SERVICE\_NAME=orcl)))

3.  Enter the **Port number** used by JDBC to connect to the database
    server (1521 by default for Oracle).

4.  Enter the **Oracle service name** used by JDBC to connect to the
    database server.

5.  Select a collection or create a new one (Optional)

6.  Finish to register the data source.

    :::image type="content" source="media/register-scan-oracle-source/register-sources-2.png" alt-text="register sources options" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:

1.  In the Management Center, click on Integration runtimes. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

2.  Navigate to **Sources**.

3.  Select the registered Oracle source.

4.  Select **+ New scan**.

5.  Provide the below details:

    a.  **Name**: The name of the scan

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime

    c.  **Credential**: Select the credential to connect to your data source. Make sure to:
    - Select Basic Authentication while creating a credential.        
    - Provide the user name used by JDBC to connect to the database server in the User name input field        
    - Store the user password used by JDBC to connect to the database server in the secret key.

    d.  **Schema**: List subset of schemas to import expressed as a
        semicolon separated list. For example, schema1; schema2. All user
        schemas are imported if that list is empty. All system schemas
        (for example, SysAdmin) and objects are ignored by default. When
        the list is empty, all available schemas are imported.
        Acceptable schema name patterns using SQL LIKE expressions syntax include using %, for example. A%; %B; %C%; D
       -   start with A or        
       -   end with B or        
       -   contain C or        
       -   equal D

    Usage of NOT and special characters are not acceptable.

6.  **Driver location**: Specify the path to the JDBC driver location in
    your VM where self-host integration runtime is running. This should
    be the path to valid JAR folder location.

7.  **Maximum memory available**: Maximum memory (in GB) available on
    customer's VM to be used by scanning processes. This is dependent on
    the size of SAP S/4HANA source to be scanned.

    :::image type="content" source="media/register-scan-oracle-source/scan.png" alt-text="scan oracle" border="true":::

8.  Click on **Continue**.

9.  Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

10.  Review your scan and click on **Save and Run**.

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