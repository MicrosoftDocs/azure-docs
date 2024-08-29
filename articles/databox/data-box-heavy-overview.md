---
title: Microsoft Azure Data Box Heavy overview | Microsoft Docs in data 
description: Describes Azure Data Box, a hybrid solution that enables you to transfer massive amounts of data into Azure
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: heavy
ms.topic: overview
ms.date: 05/30/2024
ms.author: shaas
---

# What is Azure Data Box Heavy?

Azure Data Box Heavy is a service that allows you to transfer hundreds of terabytes of data to Azure in a quick, inexpensive, and reliable way. 

The transfer process begins when a Data Box Heavy device with 1-PB storage capacity is shipped to your data center. After the device is received, set it up using the local web UI and copy your data to the device and return it to Microsoft. The device has a rugged case that protects and secures your data during transit. Your data is uploaded to your Azure Storage account after the device arrives at the Azure datacenter.

You can track the entire end-to-end process in the Azure portal.

> [!IMPORTANT]
> - To request a device, sign up in the [Azure portal](https://portal.azure.com).

## Use cases

Data Box Heavy is best suited for data sizes in the hundreds of terabytes, and in scenarios where network connectivity is insufficient to upload your data to Azure. The data movement can be one-time, periodic, or an initial bulk data transfer followed by periodic transfers. The following scenarios contain examples illustrating how Data Box Heavy can be used for data transfer.

 - **One time migration** - Appropriate when large amount of on-premises data is moved to Azure.
     - Create an online media library by moving offline tapes into Azure.
     - Migrate your virtual machine (VM) farm, SQL server, and applications to Azure.
     - Move historical data to Azure for in-depth analysis and report using HDInsight.

 - **Initial bulk transfer** - Use Data Box Heavy to complete an initial bulk transfer, or *seed*, followed by incremental transfers over the network.
     - For example, Data Box Heavy and a backup solutions partner are used to move initial large historical backup to Azure. After the initial transfer is complete, the incremental data is transferred via network to Azure storage.

 - **Periodic uploads** - Ideal for transferring large amounts of periodically generated data. For example, a scenario where video content is generated on oil rigs and windmill farms for use in energy exploration.

## Benefits

Data Box Heavy is designed to move massive amounts of data to Azure with little to no impact on your network. The solution has the following benefits:

- **Speed** - Data Box Heavy uses high-performance 40-Gbps network interfaces.

- **Security** - Data Box Heavy has built-in security protections for the device, data, and the service.
    - The device has a rugged device case secured by tamper-resistant screws and tamper-evident stickers.
    - The data on the device is secured with AES 256-bit encryption at all times.
    - The device can only be unlocked with a password provided in the Azure portal.
    - The service is protected by the Azure security features.
    - Once your data is uploaded to Azure, the disks on the device are wiped clean, in accordance with National Institute of Standards and Technology (NIST) 800-88r1 standards.


## Features and specifications

> [!IMPORTANT]
> Azure Data Box cross-region data transfer is in preview status

Previous releases of Data Box, Data Box Disk, and Data Box Heavy didn’t support cross-region data transfer. With the exception of transfers both originating and terminating between the United Kingdom (UK) and the European Union (EU), data couldn’t cross commerce boundaries.

Data Box cross-region data transfer capabilities, now in preview, support offline seamless cross-region data transfers between many regions. This capability allows you to copy your data from a local source and transfer it to a destination within a different country, region, or boundary. It's important to note that the Data Box device isn't shipped across commerce boundaries. Instead, it's transported to an Azure data center within the originating country or region. Data transfer between the source country and the destination region takes place using the Azure network and incurs no additional cost.

Although cross-region data transfer doesn't incur additional costs, the functionality is currently in preview and subject to change. Note, too, that some data transfer scenarios take place over large geographic areas. Higher than normal latencies might be encountered during such transfers.

Cross-region transfers are currently supported between the following countries and regions:

| Source Country |  Destination Region |
|----------------|---------------------|
| US<sup>1</sup> | EU<sup>2</sup>      |
| EU<sup>2</sup> | US<sup>1</sup>      |

<sup>1</sup>US denotes all Azure regions in which Data Box is supported across the United States.<br>
<sup>2</sup>EU denotes all Azure regions in which Data Box is supported across the European Union. 

Data transfers not represented within the preceding table represent unsupported cross-commerce boundary transfer selections. If you need more information, or if your region combination is unsupported, contact the [Azure Data Box team](mailto:azuredbx@microsoft.com).

The Data Box Heavy device has the following features in this release.

| Specifications                                          | Description              |
|---------------------------------------------------------|--------------------------|
| Weight                                                  | ~ 500 lbs. <br>Device on locking wheels for transport|
| Dimensions                                              | Width: 26 inches Height: 28 inches Length: 48 inches |
| Rack space                                              | Can't be rack-mounted|
| Cables required                                         | 4 grounded 120 V / 10 A power cords (NEMA 5-15) included <br> Device supports up to 240V power and has C-13 power receptacles <br> Use network cables compatible with Mellanox MCX314A-BCCT  |
| Power                                                    | 4 built-in power supply units (PSUs) shared across both the device nodes <br> 1,200-watt typical power draw|
| Storage capacity                                        | ~ 1 PB raw, 70 disks of 14 TB each <br> 770-TB usable capacity|
| Number of nodes                                          | 2 independent nodes per device (500 TB each) |
| Network interfaces per node                             | 4 network interfaces per node <br><br> MGMT, DATA3 <ul><li> 2 X 1-GbE interfaces </li><li> MGMT is for management and initial setup, not user configurable </li><li> DATA3 is user-configurable and Dynamic Host Configuration Protocol (DHCP) by default</li></ul>DATA1, DATA2 data interfaces <ul><li>2 X 40-GbE interfaces </li><li> User configurable for DHCP (default) or static</li></ul>|


## Components

The Data Box Heavy includes the following components:

* **Data Box Heavy device** - a physical device with a rugged exterior that stores data securely. This device has a usable storage capacity of 770 TB.
    
* **Data Box service** – an extension of the Azure portal that lets you manage a Data Box Heavy device from a web interface that you can access from different geographical locations. Use the Data Box service to administer your Data Box Heavy device. The service tasks include how to create and manage orders, view and manage alerts, and manage shares.  

* **Local web user interface** – a web-based UI that is used to configure the device so that it can connect to the local network, and then register the device with the Data Box service. Use the local web UI also to shut down and restart the device, view copy logs, and contact Microsoft Support to file a service request.


## The workflow

A typical flow includes the following steps:

1. **Order** - Create an order in the Azure portal, provide shipping information, and the destination Azure storage account for your data. If the device is available, Azure prepares and ships the device with a shipment tracking ID.

2. **Receive** - Once the device is delivered, cable the device for network and power using the specified cables. Turn on and connect to the device. Configure the device network and mount shares on the host computer from where you want to copy the data.

3. **Copy data** - Copy data to Data Box Heavy shares.

4. **Return** - Prepare, turn off, and ship the device back to the Azure datacenter.

5. **Upload** - Data is automatically copied from the device to Azure. The device disks are securely erased as per the National Institute of Standards and Technology (NIST) guidelines.

Throughout this process, you're notified via email on all status changes.

## Region availability

Data Box Heavy can transfer data based on the region in which service is deployed, country/region to which the device is shipped, and the target Azure storage account where you transfer the data.

- **Service availability** - Data Box Heavy is available in the US and EU.


- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions where the service is available.

For the most up-to-date information on region availability for Data Box Heavy, go to [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all).

<!--## Sign up

Take the following steps to sign up for Data Box Heavy:

1. [Sign into the Azure portal](https://portal.azure.com).
2. Click **+ Create a resource** to create a new resource. Search for **Azure Data Box**. Select **Azure Data Box** service.
3. Click **Create**.
4. Pick the subscription that you want to use for Data Box Heavy. Select the region where you want to deploy the Data Box Heavy resource. In the **Data Box Heavy** option, click **Sign up**.
5. Answer the questions regarding data residence country/region, time-frame, target Azure service for data transfer, network bandwidth, and data transfer frequency. Review Privacy and terms and select the checkbox against Microsoft can use your email address to contact you.

Once you're signed up, you can order a Data Box Heavy.-->

    
