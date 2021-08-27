---
title: Register Erwin Mart and setup scans in Azure Purview
description: This article outlines how to register Erwin Mart in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 7/16/2021
---
# Register and Scan erwin Mart Server (Preview)

This article outlines how to register an Erwin Mart Server in Purview and set up a scan.

## Supported capabilities

The erwin source supports Full scan to extract metadata from an Erwin
Mart server. The metadata include:

1.  Logical only models with Entities, Attributes and Domains OR
2.  Physical only models with Tables, Columns, Data types OR
3.  Logical/Physical models

This data source also fetches Lineage between data assets.

> [!Note]
> Erwin as a source currently supported in preview. Register this source and setup your scans in your non-production Purview accounts and provide us your feedback.

## Prerequisites

1.  Set up the latest [self-hosted integration
    runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see  
    [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md).

    > [!Note]
    > Make sure to run self-hosted integration runtime on the VM where erwin Mart instance is running.

2.  Make sure [JDK
    11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    is installed on your virtual machine where self-hosted integration
    runtime is installed.

3.  Make sure \"Visual C++ Redistributable 2012 Update 4\" is installed
    on the VM where self-hosted integration runtime is running. If you
    don\'t have it installed, download it from
    [here](https://www.microsoft.com/download/details.aspx?id=30679).

4.  Supported erwin Mart versions are 9.x to 2021

## Setting up authentication for a scan

The only supported authentication for an erwin Mart source is **Server Authentication** in the form of username and password

## Register an erwin Mart

To register a new erwin Mart in your data catalog, do the following:

1. Navigate to your Purview account.
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **erwin**. Select **Continue.**
    :::image type="content" source="media/register-scan-erwin-source/register-sources.png" alt-text="register erwin source" border="true":::

On the Register sources (erwin) screen, do the following:

1.  Enter a **Name** that the data source will be listed within the
    Catalog.

2.  Enter the erwin Mart **Server name.** This is the network host name
    used to connect to the erwin Mart server. For example, localhost

3.  Enter the **Port** number used when connecting to erwin Mart. By
    default, this value is 18170.

4.  Enter the **Application name**

    >[!Note]
    > The above details can be found by navigating to your erwin Data Modeler. Click on Mart -\> Connect to see details related to server name, port and application name.

    :::image type="content" source="media/register-scan-erwin-source/erwin-details.png" alt-text="find erwin details" border="true":::
    
5.  Select a collection or create a new one (Optional)

6.  Finish to register the data source.

    :::image type="content" source="media/register-scan-erwin-source/register-erwin.png" alt-text="register source" border="true":::
    

## Creating and running a scan

To create and run a new scan, do the following:

1.  In the Management Center, click on Integration runtimes. Make sure a
    self-hosted integration runtime is set up on the VM where erwin Mart
    instance is running. If it is not set up, use the steps mentioned
    [here](./manage-integration-runtimes.md)
    to setup a self-hosted integration runtime

2.  Navigate to **Sources**.

3.  Select the registered **erwin** Mart.

4.  Select **+ New scan**.

5.  Provide the below details:

    a.  **Name**: The name of the scan

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime.

    c.  **Server name, Port** and **Application name** are auto
        populated based on the values entered during registration.

    d.  **Credential:** Select the credential configured to connect to
        your erwin Mart server. While creating a credential, make sure
        to:
    - Select **Basic Authentication** as the Authentication method
    - Provide your erwin Mart server's username in the User name
            field.
    - Save your user password for server authentication in the
             key vault's secret.

    To understand more on credentials, refer to the link
[here](manage-credentials.md).

    e.  **Use Internet Information Services (IIS)** - Select True or False
    to notify if Microsoft Internet Information Services (IIS) must be
    used when connecting to the erwin Mart server. By default, this
    value is set to False.

    f.  **Use Secure Sockets Layer (SSL)** - Select True or False to Notify
    if Secure Sockets Layer (SSL) must be used when connecting to the
    erwin Mart server. By default, this value is set to False.

    > [!Note]
    > This parameter is only applicable for erwin Mart version 9.1 or later.

    g.  **Browse mode** - Select the mode for browsing erwin Mart. Possible
    options are "Libraries and Models" or "Libraries only".

    h.  **Models** - Scope your scan by providing a semi colon separated
    list of erwin model locator strings. For example,
    mart://Mart/Samples/eMovies;mart://Mart/Erwin_Tutorial/AP_Physical

    i.  **Maximum memory available**: Maximum memory (in GB) available on
    customer's VM to be used by scanning processes. This is dependent on
    the size of erwin Mart to be scanned.
    :::image type="content" source="media/register-scan-erwin-source/setup-scan.png" alt-text="trigger scan" border="true":::
   

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
