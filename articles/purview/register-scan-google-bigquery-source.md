---
title: Register Google BigQuery project and setup scans in Azure Purview
description: This article outlines how to register Google BigQuery project in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 7/15/2021
---
# Register and Scan Google BigQuery source (Preview)

This article outlines how to register a Google BigQuery project in
Purview and set up a scan.

## Supported capabilities

The BigQuery source supports Full scan to extract metadata from a
BigQuery project and fetches Lineage between data assets.

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

4.  You will have to manually download BigQuery's JDBC driver on your
    virtual machine where self-hosted integration runtime is running
    from
    [here](https://cloud.google.com/bigquery/providers/simba-drivers)

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

5.  Supported Google BigQuery version is 11.0.0

## Register a Google BigQuery project

To register a new Google BigQuery project in your data catalog, do the
following:

1.  Navigate to your Purview account.
2.  Select **Data Map** on the left navigation.
3.  Select **Register.**
4.  On Register sources, select **Google BigQuery** . Select **Continue.**
    :::image type="content" source="media/register-scan-google-bigquery-source/register-sources.png" alt-text="register BigQuery source" border="true":::
   
On the Register sources (Google BigQuery) screen, do the following:

1.  Enter a **Name** that the data source will be listed within the
    Catalog.

2.  Enter the **ProjectID.** This should be a fully qualified project
    Id. For example, mydomain.com:myProject

3.  Select a collection or create a new one (Optional)

4.  Click on **Register**.
    :::image type="content" source="media/register-scan-google-bigquery-source/configure-sources.png" alt-text="configure BigQuery source" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:

1.  In the Management Center, click on Integration runtimes. Make sure a
    self-hosted integration runtime is set up. If it is not set up, use
    the steps mentioned
    [here](./manage-integration-runtimes.md)
    to setup a self-hosted integration runtime

2.  Navigate to **Sources**.

3.  Select the registered **BigQuery** project.

4.  Select **+ New scan**.

5.  Provide the below details:

    a.  **Name**: The name of the scan

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime

    c.  **Credential**: While configuring BigQuery credential, make sure
        to:

    - Select **Basic Authentication** as the Authentication method
    - Provide the email ID of the service account in the User name          field. For example, xyz\@developer.gserviceaccount.com
    - Save your Private key file of the service account in the JSON format in the key vault's secret

    To create a new private key from Google's cloud platform, in the
    navigation menu, click on IAM & Admin -\> Service Accounts -\> Select
    a project -\> Click the email address of the service account that you
    want to create a key for -\> Click the **Keys** tab -\> Click
    the **Add key** drop-down menu, then select Create new key. Now choose
    JSON format.

      > [!Note]
      > The contents of the private key are saved in a temp file on
    the VM when scanning processes are running. This temp file is deleted
    after the scans are successfully completed. In the event of a scan
    failure, the system will continue to retry until success. Please make
    sure access is appropriately restricted on the VM where SHIR is
    running.**

    To understand more on credentials, refer to the link [here](manage-credentials.md).

    d.  **Driver location**: Specify the path to the JDBC driver location in
        your VM where self-host integration runtime is running. This should
        be the path to valid JAR folder location    
    > [!Note]
    > The driver should be accessible to all accounts in the VM.Please do not install in a user account.

    e.  **Dataset**: Specify a list of BigQuery datasets to import. For
        example, dataset1; dataset2. When the list is empty, all available
        datasets are imported.
        Acceptable dataset name patterns using SQL LIKE expressions syntax include using %, 

    e.g. A%; %B; %C%; D
    - start with A or
    - end with B or
    - contain C or
    - equal D    
Usage of NOT and special characters are not acceptable.
    
    f.  **Maximum memory available**: Maximum memory (in GB) available on
        customer's VM to be used by scanning processes. This is dependent on
        the size of Google BigQuery project to be scanned.
        :::image type="content" source="media/register-scan-google-bigquery-source/scan.png" alt-text="scan BigQuery source" border="true":::

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