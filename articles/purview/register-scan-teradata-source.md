---
title: Register a Teradata source and setup scans (preview)
description: This article outlines how to register a Teradata source in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 12/06/2020
---
# Register and scan Teradata source (Preview)

This article outlines how to register a Teradata source in Purview and set up a scan.

> [!IMPORTANT]
> This data source is currently in preview. You can try it out and give us feedback.

## Supported capabilities

The Teradata source supports **Full scan** to extract metadata from a Teradata database and fetches **Lineage** between data assets.

## Prerequisites

- The connector supports data store located only inside an on-premises network, an Azure virtual network, or Amazon Virtual Private Cloud. Hence you need to set up a [self-hosted integration
runtime](manage-integration-runtimes.md) to connect to it.

- Make sure the Java Runtime Environment (JRE) is installed on your virtual machine where self-hosted integration runtime is installed.
 
- Make sure "Visual C++ Redistributable 2012 Update 4" is installed on the self-hosted integration runtime machine. If you don't yet have it installed, download it from [here](https://www.microsoft.com/download/details.aspx?id=30679).

- You will have to manually install a driver named Teradata JDBC
    Driver on your on-premises virtual machine. The executable JAR file can be downloaded from the [Teradata website](https://downloads.teradata.com/).

    > [!Note] 
    > The driver should be accessible to all accounts in the VM. Please do not install in a user account.

- Supported Teradata database versions are **12.x to 16.x**. Make sure to have Read access to the Teradata source being scanned.

### Feature flag

Registration and scanning of a Teradata source is available behind a
feature flag. Append the following to your URL:
*?feature.ext.datasource=%7b"teradata":"true"%7d* 

E.g.,  full URL [https://web.purview.azure.com/?feature.ext.datasource=%7b"metadata":"true"%7d](https://web.purview.azure.com/?feature.ext.datasource=%7b"teradata":"true"%7d)

## Setting up authentication for a scan
The only way supported to set up authentication for a Teradata source is **Basic database** authentication

## Register a Teradata source

To register a new Teradata source in your data catalog, do the following:

1. Navigate to your Purview account
2. Select **Sources** on the left navigation
3. Select **Register**
4. On **Register sources**, select **Teradata**
5. Select **Continue**

On the **Register sources (Teradata)** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Enter the **Host** name to connect to a Teradata source. It can also be an IP address or a fully qualified connection string to the server.
3. Select a collection or create a new one (Optional)
4. **Finish** to register the data source.

    :::image type="content" source="media/register-scan-teradata-source/register-sources.png" alt-text="register sources options" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:
1. In the Management Center, click on *Integration runtimes*. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](manage-integration-runtimes.md) to create a self-hosted integration runtime for scanning on an on-premises or Azure VM that has access to your on-premises network.

2. Next, navigate **Sources**

3. Select the registered Teradata source.

4. Select + New scan
 
5. Provide the below details:

    - Name: The name of the scan

    - Connect via integration runtime: Select the configured self-hosted integration runtime

    - Authentication method: Database authentication is the only option supported for now. This will be selected by default

    - User name: A user name to connect to database server. This username should have read access to the server

    - Password: The user password used to connect to database server

    - Schema: List subset of schemas to import expressed as a semicolon separated list. e.g.schema1; schema2. All user schemas are imported if that list is  empty. All system schemas (for example, SysAdmin) and objects are ignored by default.

        Acceptable schema name patterns using SQL LIKE expressions syntax include using %, e.g. A%; %B; %C%; D
        - start with A or    
        - end with B or    
        - contain C or    
        - equal D

        Usage of NOT and special characters are not acceptable

    - Driver location: Complete path to Teradata driver location on customer’s VM. The Teradata JDBC driver name must be: com.teradata.jdbc.TeraDriver

    - Maximum memory available: Maximum memory(in GB) available on customer’s VM to be used by scanning processes. This is dependent on the size of Teradata source to be scanned.

    > [!Note] 
    > As a thumb rule, please provide 2GB memory for every 1000 tables

    :::image type="content" source="media/register-scan-teradata-source/setup-scan.png" alt-text="setup scan" border="true":::

6. Click on *Continue.*

7. Choose your scan trigger. You can set up a schedule or ran the scan once.

    :::image type="content" source="media/register-scan-teradata-source/scan-trigger.png" alt-text="scan trigger" border="true":::

8. Review your scan and click on *Save and Run.*

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
