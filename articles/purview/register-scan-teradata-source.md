---
title: Register a Teradata source and setup scans (preview) in Azure Purview
description: This article outlines how to register a Teradata source in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 2/25/2021
---
# Register and scan Teradata source (preview)

This article outlines how to register a Teradata source in Purview and
set up a scan.

## Supported capabilities

The Teradata source supports **Full scan** to extract metadata from a
Teradata database and fetches **Lineage** between data assets.

## Prerequisites

1.  Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see [Create and configure a self-hosted    integration runtime](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime).

2.  Make sure the [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    is installed on your virtual machine where self-hosted integration
    runtime is installed.

3.  Make sure \"Visual C++ Redistributable 2012 Update 4\" is installed
    on the self-hosted integration runtime machine. If you don\'t yet
    have it installed, download it from
    [here](https://www.microsoft.com/download/details.aspx?id=30679).

4.  You will have to manually download Teradata's JDBC Driver on your
    virtual machine where self-hosted integration runtime is running.
    The executable JAR file can be downloaded from the Teradata
    [website](https://downloads.teradata.com/).

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Please do not install in a user account.

5.  Supported Teradata database versions are 12.x to 16.x. Make sure to
    have Read access to the Teradata source being scanned.

## Setting up authentication for a scan

The only supported authentication for a Teradata source is **Basic authentication**.

## Register a Teradata source

To register a new Teradata source in your data catalog, do the
following:

1.  Navigate to your Purview account.
2.  Select **Sources** on the left navigation.
3.  Select **Register**
4.  On Register sources, select **Teradata**. Select **Continue**

    :::image type="content" source="media/register-scan-teradata-source/register-sources.png" alt-text="register Teradata options" border="true":::

On the **Register sources (Teradata)** screen, do the following:

1.  Enter a **Name** that the data source will be listed with in the
    Catalog.

2.  Enter the **Host** name to connect to a Teradata source. It can also
    be an IP address or a fully qualified connection string to the
    server.

3.  Select a collection or create a new one (Optional)

4.  Finish to register the data source.

    :::image type="content" source="media/register-scan-teradata-source/register-sources-2.png" alt-text="register Teradata" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:

1.  In the Management Center, click on **Integration runtimes**. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](https://docs.microsoft.com/azure/purview/manage-integration-runtimes) to setup a self-hosted integration runtime

2.  Navigate to the **Sources**

3.  Select the registered Teradata source.

4.  Select **+ New scan**

5.  Provide the below details:

    a.  **Name**: The name of the scan

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime.

    c.  **Credential**: Select the credential to connect to your data
        source. Make sure to:

    -   Select Basic Authentication while creating a credential.
    -   Provide a user name to connect to database server in the User name input field
    -   Store the database server password in the secret key.

        To understand more on credentials, refer to the link [here](https://docs.microsoft.com/azure/purview/manage-credentials)

6.  **Schema**: List subset of schemas to import expressed as a
    semicolon separated list. e.g., schema1; schema2. All user schemas
    are imported if that list is empty. All system schemas (for example,
    SysAdmin) and objects are ignored by default. When the list is
    empty, all available schemas are imported.

    Acceptable schema name patterns using SQL LIKE expressions syntax include using %, e.g. A%; %B; %C%; D
    - start with A or    
    - end with B or    
    - contain C or    
    - equal D

    Usage of NOT and special characters are not acceptable

7.  **Driver location**: Specify the path to the JDBC driver location in
    your VM where self-host integration runtime is running. This should
    be the path to valid JAR folder location.

8.  **Maximum memory available:** Maximum memory (in GB) available on
    customer's VM to be used by scanning processes. This is dependent on
    the size of Teradata source to be scanned.

    > [!Note] 
    > As a thumb rule, please provide 2GB memory for every 1000 tables

    :::image type="content" source="media/register-scan-teradata-source/setup-scan.png" alt-text="setup scan" border="true":::

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