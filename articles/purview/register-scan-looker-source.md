---
title: Register Looker and setup scans in Azure Purview
description: This article outlines how to register a Looker source in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 7/16/2021
---
# Register and Scan Looker(Preview)

This article outlines how to register a Looker Server in Purview and set
up a scan.

## Supported capabilities

The Looker source supports Full scan to extract metadata from a Looker
server. It imported metadata from a Looker server, including database
connections, LookML Models and associated reports (Looks and
Dashboards). This data source also fetches Lineage between data assets.

> [!Note]
> Looker as a source is currently supported in private preview. Register this source and setup your scans in your non-production Purview accounts and provide us your feedback.

## Prerequisites

1.  Set up the latest [self-hosted integration
    runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see 
    [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md).

2.  Make sure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on your virtual machine where self-hosted integration
    runtime is installed.

3.  Make sure \"Visual C++ Redistributable 2012 Update 4\" is installed
    on the VM where self-hosted integration runtime is running. If you
    don\'t have it installed, download it from
    [here](https://www.microsoft.com/download/details.aspx?id=30679).

4.  Supported Looker server version is 7.2

## Setting up authentication for a scan

An API3 key is required to connect to the Looker server. The API3 key
consists in a public client_id and a private client_secret and follows
an OAuth2 authentication pattern.

## Register a Looker server

To register a new Looker server in your data catalog, do the following:

1. Navigate to your Purview account.
2. Select **Data Map** on the left navigation.
3. Select **Register.**
4. On Register sources, select **Looker**. Select **Continue.**
    :::image type="content" source="media/register-scan-looker-source/register-sources.png" alt-text="register looker source" border="true":::


On the Register sources (Looker) screen, do the following:

1. Enter a **Name** that the data source will be listed within the
    Catalog.

2. Enter the Looker API URL in the **Server API URL** field. The
    default port for API requests is port 19999. Also, all Looker API
    endpoints require an HTTPS connection. For example,
    'https://azurepurview.cloud.looker.com'

3. Select a collection or create a new one (Optional)

4. Finish to register the data source.

    :::image type="content" source="media/register-scan-looker-source/scan-source.png" alt-text="scan looker source" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:

1. In the Management Center, click on Integration runtimes. If it is
    not set up, use the steps mentioned
    [here](./manage-integration-runtimes.md)
    to setup a self-hosted integration runtime

2. Navigate to **Sources**.

3. Select the registered **Looker** server.

4. Select **+ New scan**.

5. Provide the below details:

    a.  **Name**: The name of the scan

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime.

    c.  **Server API URL** is auto populated based on the value entered
        during registration.

    d.  **Credential:** While configuring Looker credential, make sure
        to:

    - Select **Basic Authentication** as the Authentication method
    - Provide your Looker API3 key's client ID in the User name field
    - Save your Looker API3 key's client secret in the key vault's secret.

    **Note:** To access client ID and client secret, navigate to Looker -\>Admin -\> Users -\> Click on **Edit** on an user -\> Click on **EditKeys** -\> Use the Client ID and Client Secret or create a new one.
    :::image type="content" source="media/register-scan-looker-source/looker-details.png" alt-text="get looker details" border="true":::
    

    To understand more on credentials, refer to the link [here](manage-credentials.md)

    e.  **Project filter** -- Scope your scan by providing a semi colon
    separated list of Looker projects. This option is used to select
    looks and dashboards by their parent project.

    f.  **Maximum memory available**: Maximum memory (in GB) available on
    customer's VM to be used by scanning processes. This is dependent on
    the size of erwin Mart to be scanned.

    :::image type="content" source="media/register-scan-looker-source/setup-scan.png" alt-text="trigger scan" border="true":::

6. Click on **Test connection.**

7. Click on **Continue**.

8. Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

9. Review your scan and click on **Save and Run**.

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
