---
title: Register a Teradata Connector and Setup Scans (Preview)
description: This article outlines how to register a Teradata connector in Babylon and set up a scan.
author: chandrakavya
ms.author: kchandra
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 09/19/2020
---
# Register and scan Teradata source (Preview)

This article outlines how to register a Teradata connector in Babylon and set up a scan.

    [!IMPORTANT]
    This connector is currently in preview. You can try it out and give us feedback.

## Supported Capabilities

This Teradata connector supports the following activities:

- **Full scan** to extract Metadata from a Teradata database stored in
    an on-premises network.

- **Lineage** between data assets.

Specifically, this Teradata connector supports:

- Teradata database versions **12.x to 16.x**

- Scanning by using **Basic database** authentication

## Prerequisites

1. The connector supports data store located only inside an on-premises
    network, an Azure virtual network, or Amazon Virtual Private Cloud.
    Hence you need to set up a [self-hosted integration
    runtime](https://github.com/Azure/Babylon/blob/master/docs/manage-integration-runtimes.md) to
    connect to it.

2. Make sure the Java Runtime Environment (JRE) is installed on your virtual machine where self-hosted integration runtime is installed.
 
3. Make sure "Visual C++ Redistributable 2012 Update 4" is installed on the self-hosted integration runtime machine. If you don't yet have it installed, download it from [here](https://www.microsoft.com/en-sg/download/details.aspx?id=30679).

4. You will have to manually install a driver named Teradata JDBC
    Driver on your on-premises virtual
    machine. The executable JAR file can be downloaded from the [Teradata website](https://downloads.teradata.com/).

        [!Note] The driver should be accessible to all accounts in the VM. Please do not install in a user account.

5. Have Read access to the Teradata source being scanned.

### Feature Flag

Registration and scanning of a Teradata source is available behind a
feature flag. Please append the following to your URL:
*?feature.ext.datasource=%7b"teradata":"true"%7d* 

E.g. full URL [https://web.babylon.azure.com/?feature.ext.datasource=%7b"teradata":"true"%7d](https://web.babylon.azure.com/?feature.ext.datasource=%7b"teradata":"true"%7d)


## Register a Teradata source

1. Navigate to your Babylon catalog.

2. Click on *Manage your data* tile on the home page.
![manage your data](media/register-a-teradata-connector-and-setup-scans/image1.png)

3. Click on *Data sources* under the Sources and scanning section.
    Click on *New* to register a Teradata source. Select *Teradata* and
    click on Continue.

![select Teradata](media/register-a-teradata-connector-and-setup-scans/image2.png)

4. Provide a friendly name and Host name to register. The Host name can be IP address of the source or a fully qualified JDBC connection string or a local host by default. Click *Finish*.

![register Teradata](media/register-a-teradata-connector-and-setup-scans/image3.png)

## Creating and running a scan

1. Under Sources and scanning in the left navigation, click on *Integration runtimes*. Make sure a self-hosted integration runtime is setup. If it is not setup, please use the steps mentioned [here](https://github.com/Azure/Babylon/blob/master/docs/manage-integration-runtimes.md) to create a self-hosted integration runtime for scanning on an on-premises or Azure VM that has access to your on-premises network.

2. Navigate to the management center. Click on Data sources under the Sources and scanning section.
 
3. Navigate to a registered Teradata source. Click on *Set up scan*.

![scan Teradata](media/register-a-teradata-connector-and-setup-scans/image4.png)

4. Provide the below details:

- Name: The name of the scan

- Connect via integration runtime: Select the configured self-hosted integration runtime

- Authentication method: Database authentication is the only option supported for now. This will be selected by default

- User name: A user name to connect to database server. This username should have read access to the server

- Password: The user password used to connect to database server

- Schema: List subset of schemas to import expressed as a semicolon separated list. e.g.schema1; schema2. All user schemas are imported if that list is  empty. All system schemas (e.g. SysAdmin) and objects are ignored by default.

        Acceptable schema name patterns using SQL LIKE expressions syntax include using %, e.g. A%; %B; %C%; D
        - start with A or    
        - end with B or    
        - contain C or    
        - equal D

        Usage of NOT and special characters are not acceptable

- Driver location: Complete path to Teradata driver location on customer’s VM. The Teradata JDBC driver name must be: com.teradata.jdbc.TeraDriver

- Maximum memory available: Maximum memory(in GB) available on customer’s VM to be used by scanning processes. This is dependent on the size of Teradata source to be scanned.

        As a thumb rule, please provide 2GB memory for every 1k tables

![setup scan](media/register-a-teradata-connector-and-setup-scans/image5.png)

5. Click on *Continue.*

6. Choose your scan trigger. You can set up a schedule or ran the scan once.

![setup scan](media/register-a-teradata-connector-and-setup-scans/image6.png)

7. Review your scan and click on *Save and Run.*

## Viewing your scans and scan runs

1. Navigate to the management center. Click on Data sources under the Sources and scanning section click on the Teradata data source.
2. Click on the scan whose results you are interested to view.
3. You can view all the scan runs along with metrics and status for each scan run.

## Manage your scans

1. Navigate to the management center. Click on Data sources under the Sources and scanning section click on the Teradata data source.
2. Select the scan you would like to manage. You can edit the scan by clicking on the edit.
3. You can delete your scan by clicking on delete.

## Functionalities not supported today

Below are the functionalities not supported today. Efforts are underway to have them supported.

- Incremental Scanning
- Classification
- Scoped Scanning
- Test Connection
