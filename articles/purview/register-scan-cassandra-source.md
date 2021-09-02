---
title: Register Cassandra as a source and setup scans in Azure Purview
description: This article outlines how to register Cassandra server in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 8/06/2021
---
# Register and Scan a Cassandra source 

This article outlines how to register a Cassandra server in Purview and set up a scan.

## Supported capabilities

The Cassandra source supports Full scan to extract metadata from a
Cassandra server and fetches Lineage between data assets.

## Prerequisites

1.  Set up the latest [self-hosted integration
    runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see 
    [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md).

2.  Make sure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    is installed on your virtual machine where self-hosted integration
    runtime is installed.

3.  Make sure \"Visual C++ Redistributable 2012 Update 4\" is installed
    on the self-hosted integration runtime machine. If you don\'t yet
    have it installed, download it from
    [here](https://www.microsoft.com/download/details.aspx?id=30679).

4.  Supported Cassandra server versions are 3.x to 4.x

## Register a Cassandra server

To register a new Cassandra server in your data catalog, do the
following:

1.  Navigate to your Purview account.
2.  Select **Data Map** on the left navigation.
3.  Select **Register.**
4.  On Register sources, select **Cassandra** . Select **Continue.**
    :::image type="content" source="media/register-scan-cassandra-source/register-sources.png" alt-text="register Cassandra source" border="true":::
   
On the Register sources (Cassandra) screen, do the following:

1. Enter a **Name** that the data source will be listed within the
    Catalog.

2. Enter the server address where Cassandra server is running in the **Host** field. For example, 20.190.193.10

3. Enter the port used by Cassandra server in the **Port** field.
4. Select a collection or create a new one (Optional)

5.  Click on **Register**.
    :::image type="content" source="media/register-scan-cassandra-source/configure-sources.png" alt-text="configure Cassandra source" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:

1.  In the Management Center, click on Integration runtimes. Make sure a
    self-hosted integration runtime is set up. If it is not set up, use
    the steps mentioned
    [here](./manage-integration-runtimes.md)
    to setup a self-hosted integration runtime

2.  Navigate to **Sources**.

3.  Select the registered **Cassandra** server.

4.  Select **+ New scan**.

5.  Provide the below details:

    a.  **Name**: The name of the scan

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime

    c.  **Credential**: While configuring Cassandra credential, make sure
        to:

    - Select **Basic Authentication** as the Authentication method
    - Provide the username on who's behalf the connection is being made in the User name field. 
    - Save Cassandra user's password on whose behalf the connection is being made in the key vault's secret

    To understand more on credentials, refer to the link [here](manage-credentials.md).

    d.  **Keyspaces**: Specify a list of Cassandra keyspaces to be imported. Multiple keypsaces must be semicolon separated. For example, keyspace1; keyspace2. When the list is empty, all available keyspaces are imported.
    Acceptable keyspace name patterns using SQL LIKE expressions syntax include using %, 

    e.g. A%; %B; %C%; D
    - start with A or
    - end with B or
    - contain C or
    - equal D    
Usage of NOT and special characters are not acceptable.
    
    f. **Use Secure Sockets Layer(SSL)** : Select True or False to Notify
    if Secure Sockets Layer (SSL) must be used when connecting to the
    Cassandra server. By default, this value is set to False.

    g. **Maximum memory available**: Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of Cassandra server to be scanned.
        :::image type="content" source="media/register-scan-cassandra-source/scan.png" alt-text="scan Cassandra source" border="true":::

6.  Click on **Test connection.**

7.  Click on **Continue**.

8.  Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

9.  Review your scan and click on **Save and Run**.

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