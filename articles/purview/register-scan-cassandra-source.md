---
title: Register and scan a Cassandra source
description: This article describes how to register a Cassandra server in Azure Purview and set up a scan to extract metadata.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-map
ms.topic: overview
ms.date: 09/27/2021
---
# Register and scan a Cassandra source (preview)

This article describes how to register a Cassandra server in Azure Purview and set up a scan.

## Supported capabilities

You can use Purview to do full scans on Cassandra to extract metadata and lineage between data assets. 

## Prerequisites

1.  Set up the latest [self-hosted integration
    runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see 
    [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md).

2.  Ensure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    is installed on the virtual machine where the self-hosted integration
    runtime is installed.

3.  Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed
    on the self-hosted integration runtime machine. If you don't
    have this update installed, [download it](https://www.microsoft.com/download/details.aspx?id=30679).

4.  Ensure your Cassandra server is version 3.*x* or 4.*x*.

## Register a Cassandra server

To register a new Cassandra server in your data catalog:

1.  Go to your Purview account.
2.  Select **Data Map** on the left pane.
3.  Select **Register**.
4.  On the **Register sources** screen, select **Cassandra**, and then select **Continue**:

    :::image type="content" source="media/register-scan-cassandra-source/register-sources.png" alt-text="Screenshot that shows the Register sources screen." border="true":::
   
1. On the **Register sources (Cassandra)** screen:

   1. Enter a **Name**. The data source will use this name in the
    catalog.

   2. In the **Host** box, enter the server address where the Cassandra server is running. For example, 20.190.193.10.

   3. In the **Port** box, enter the port used by the Cassandra server.
   4. Select a collection or create a new one (optional).
    :::image type="content" source="media/register-scan-cassandra-source/configure-sources.png" alt-text="Screenshot that shows the Register sources (Cassandra) screen." border="true":::
   5.  Select **Register**.


## Create and run a scan

To create and run a new scan:

1.  In the Management Center, select **Integration runtimes**. Make sure a
    self-hosted integration runtime is set up. If you don't have one set up, complete
    [these steps to set up a self-hosted integration runtime](./manage-integration-runtimes.md).
    

2.  Go to **Sources**.

3.  Select the registered Cassandra server.

4.  Select **New scan**.

5.  Provide the following details.

    a.  **Name**: Specify a name for the scan.

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime.

    c.  **Credential**: When you configure the Cassandra credentials, be sure
        to:

    - Select **Basic Authentication** as the authentication method.
    - In the **User name** box, provide the name of the user you're making the connection for. 
    - In the key vault's secret, save the password of the Cassandra user you're making the connection for.

    For more information, see [Credentials for source authentication in Purview](manage-credentials.md).

    d.  **Keyspaces**: Specify a list of Cassandra keyspaces to import. Multiple keyspaces must be separated with semicolons. For example, keyspace1; keyspace2. When the list is empty, all available keyspaces are imported.
    
    You can use keyspace name patterns that use SQL LIKE expression syntax, including %. 

    For example: A%; %B; %C%; D

    This expression means:
    - Starts with A or
    - Ends with B or
    - Contains C or
    - Equals D    

    You can't use NOT or special characters.
    
    e. **Use Secure Sockets Layer(SSL)**: Select **True** or **False** to specify whether
    to use Secure Sockets Layer (SSL) when connecting to the
    Cassandra server. By default, this option is set to **False**.

    f. **Maximum memory available**: Specify the maximum memory (in GB) available on your VM to be used for scanning processes. This value depends on the size of Cassandra server to be scanned.
        :::image type="content" source="media/register-scan-cassandra-source/scan.png" alt-text="scan Cassandra source" border="true":::

6.  Select **Test connection.**

7.  Select **Continue**.

8.  Select a **scan trigger**. You can set up a schedule or run the
    scan once.

9.  Review your scan, and then select **Save and Run**.

## View your scans and scan runs

1. Go to the Management Center. Select **Data sources** in the **Sources and scanning** section.

2. Select the data source whose scans you want to view. You'll see a list of existing scans on that data source.

3. Select the scan whose results you want to view.

   The resulting page will show all previous scan runs together with metrics and status for each one. 
   It will also indicate: 
   - Whether your scan was scheduled or manual. 
   - How many assets had classifications applied. 
   - How many total assets were discovered. 
   - The start and end time of the scan.
   - The duration of the scan.

## Manage your scans

To manage or delete a scan:

1. Go to the Management Center. Select **Data sources** in the **Sources and scanning** section. Then select the data source whose scan you want to manage.

2. Select the scan you want to manage. 
   - You can edit the scan by selecting **Edit**.

   - You can delete the scan by selecting **Delete**.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
