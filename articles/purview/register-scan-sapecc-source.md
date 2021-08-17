---
title: Register SAP ECC source and setup scans in Azure Purview
description: This article outlines how to register SAP ECC source in Azure Purview and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: overview
ms.date: 2/25/2021
---
# Register and scan SAP ECC source

This article outlines how to register an SAP ECC source in Purview and
set up a scan.

## Supported capabilities

The SAP ECC source supports **Full scan** to extract metadata from a SAP ECC
instance and fetches **Lineage** between data assets.

## Prerequisites

1.  Set up the latest [self-hosted integration
    runtime](https://www.microsoft.com/download/details.aspx?id=39717).
    For more information, see [Create and configure a self-hosted
    integration
    runtime](../data-factory/create-self-hosted-integration-runtime.md).

2.  Make sure the [JDK
    11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    is installed on your virtual machine where self-hosted integration
    runtime is installed.

3.  Make sure \"Visual C++ Redistributable 2012 Update 4\" is installed
    on the self-hosted integration runtime machine. If you don\'t yet
    have it installed, download it from
    [here](https://www.microsoft.com/download/details.aspx?id=30679).

4.  Download the 64-bit [SAP Connector for Microsoft .NET
    3.0](https://support.sap.com/en/product/connectors/msnet.html) from
    SAP\'s website and install it on the self-hosted integration runtime
    machine. During installation, make sure you select the **Install    Assemblies to GAC** option in the **Optional setup steps** window.

    :::image type="content" source="media/register-scan-sapecc-source/requirement.png" alt-text="pre-requisite" border="true":::

5.  The connector reads metadata from SAP using the [SAP Java Connector (JCo)](https://support.sap.com/en/product/connectors/jco.html)
    3.0 API. Hence make sure the Java Connector is available on your
    virtual machine where self-hosted integration runtime is installed.
    Make sure that you are using the correct JCo distribution for your
    environment. For example, on a Microsoft Windows machine, make sure
    the sapjco3.jar and sapjco3.dll files are available.

    > [!Note] 
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

6.  Deploy the metadata extraction ABAP function module on the SAP
    server by following the steps mentioned in [ABAP functions deployment guide](abap-functions-deployment-guide.md). You will need an ABAP developer account to create the RFC function module on the SAP server. The user account requires sufficient permissions to connect to the SAP server and execute the following RFC function modules:
    -	STFC_CONNECTION (check connectivity)
    -	RFC_SYSTEM_INFO (check system information)


## Setting up authentication for a scan

The only supported authentication for SAP ECC source is **Basic authentication**.

## Register SAP ECC source

To register a new SAP ECC source in your data catalog, do the following:

1.  Navigate to your Purview account.
2.  Select **Data Map** on the left navigation.
3.  Select **Register**
4.  On Register sources, select **SAP ECC**. Select **Continue.**

    :::image type="content" source="media/register-scan-sapecc-source/register-sapecc.png" alt-text="register SAPECC options" border="true":::

On the **Register sources (SAP ECC)** screen, do the following:

1.  Enter a **Name** that the data source will be listed within the
    Catalog.

2.  Enter the **Application server** name to connect to SAP ECC source.
    It can also be an IP address of the SAP application server host.

3.  Enter the SAP **System number**. This is a two-digit integer between
    00 and 99.

4.  Select a collection or create a new one (Optional)

5.  Finish to register the data source.

    :::image type="content" source="media/register-scan-sapecc-source/register-sapecc-2.png" alt-text="register SAPECC" border="true":::

## Creating and running a scan

To create and run a new scan, do the following:

1.  In the Management Center, click on Integration runtimes. Make sure a
    self-hosted integration runtime is set up. If it is not set up, use
    the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

2.  Navigate to **Sources**

3.  Select the registered SAP ECC source.

4.  Select **+ New scan**

5.  Provide the below details:

    a.  **Name**: The name of the scan

    b.  **Connect via integration runtime**: Select the configured
        self-hosted integration runtime

    c.  **Credential**: Select the credential to connect to your data
        source. Make sure to:

    -   Select Basic Authentication while creating a credential.
    -   Provide a user ID to connect to SAP server in the User name input field.
    -   Store the user password used to connect to SAP server in the secret
    key.

    d.  **Client ID**: Enter the SAP Client ID. This is a three digit
        numeric number from 000 to 999.

    e.  **JCo library path**: The directory path where the JCo libraries
        are located

    f.  **Maximum memory available:** Maximum memory(in GB) available on
        customer's VM to be used by scanning processes. This is
        dependent on the size of SAP ECC source to be scanned.
    > [!Note] 
    > As a thumb rule, please provide 1GB memory for every 1000 tables

    :::image type="content" source="media/register-scan-sapecc-source/scan-sapecc.png" alt-text="scan SAPECC" border="true":::

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
