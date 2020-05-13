---
title: Microsoft Azure Data Box Heavy overview | Microsoft Docs in data 
description: Describes Azure Data Box, a hybrid solution that enables you to transfer massive amounts of data into Azure
services: databox
documentationcenter: NA
author: alkohli

ms.service: databox
ms.subservice: heavy
ms.topic: overview
ms.date: 08/28/2019
ms.author: alkohli
---

# What is Azure Data Box Heavy?

Azure Data Box Heavy allows you to send hundreds of terabytes of data to Azure in a quick, inexpensive, and reliable way. The data is transferred to Azure by shipping you a Data Box Heavy device with 1-PB storage capacity, which you fill with your data and send back to Microsoft. The device has a rugged casing to protect and secure your data during transit.

Once the device is received at your datacenter, set it up using the local web UI. Copy the data from your servers to the device and ship the device back to Azure. In the Azure datacenter, your data is uploaded to your Azure Storage account(s). You can track the entire end-to-end process in the Azure portal.


> [!IMPORTANT]
> - To request a device, sign up in the [Azure portal](https://portal.azure.com).


## Use cases

Data Box Heavy is best suited for data sizes in the hundreds of terabytes, where network connectivity is insufficient to upload the data to Azure. The data movement can be one-time, periodic, or an initial bulk data transfer followed by periodic transfers. Here are the various scenarios where Data Box Heavy can be used for data transfer.

 - **One time migration** - when large amount of on-premises data is moved to Azure.
     - Move a media library from offline tapes into Azure to create an online media library.
     - Migrate your VM farm, SQL server, and applications to Azure.
     - Move historical data to Azure for in-depth analysis and report using HDInsight.

 - **Initial bulk transfer** - when an initial bulk transfer is done using Data Box Heavy (seed) followed by incremental transfers over the network.
     - For example, Data Box Heavy and a backup solutions partner are used to move initial large historical backup to Azure. Once complete, the incremental data is transferred via network to Azure storage.

 - **Periodic uploads** - when large amount of data is generated periodically and needs to be moved to Azure. For example in energy exploration, where video content is generated on oil rigs and windmill farms.

## Benefits

Data Box Heavy is designed to move massive amounts of data to Azure with little to no impact on your network. The solution has the following benefits:

- **Speed** - Data Box Heavy uses high-performance 40-Gbps network interfaces.

- **Security** - Data Box Heavy has built-in security protections for the device, data, and the service.
    - The device has a rugged device casing secured by tamper-resistant screws and tamper-evident stickers.
    - The data on the device is secured with an AES 256-bit encryption at all times.
    - The device can only be unlocked with a password provided in the Azure portal.
    - The service is protected by the Azure security features.
    - Once your data is uploaded to Azure, the disks on the device are wiped clean, in accordance with National Institute of Standards and Technology (NIST) 800-88r1 standards.


## Features and specifications

The Data Box Heavy device has the following features in this release.

| Specifications                                          | Description              |
|---------------------------------------------------------|--------------------------|
| Weight                                                  | ~ 500 lbs. <br>Device on locking wheels for transport|
| Dimensions                                              | Width: 26 inches Height: 28 inches Length: 48 inches |
| Rack space                                              | Cannot be rack-mounted|
| Cables required                                         | 4 grounded 120 V / 10 A power cords (NEMA 5-15) included <br> Device supports up to 240 V power and has C-13 power receptacles <br> Use network cables compatible with [Mellanox MCX314A-BCCT](https://store.mellanox.com/products/mellanox-mcx314a-bcct-connectx-3-pro-en-network-interface-card-40-56gbe-dual-port-qsfp-pcie3-0-x8-8gt-s-rohs-r6.html)  |
| Power                                                    | 4 built-in power supply units (PSUs) shared across both the device nodes <br> 1,200 watt typical power draw|
| Storage capacity                                        | ~ 1-PB raw, 70 disks of 14 TB each <br> 770-TB usable capacity|
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

- **Service availability** - For this release, Data Box Heavy is available in the following regions:
    - All public cloud regions in the United States - West Central US, West US2, West US, South Central US, Central US, North Central US, East US, and East US2.
    - European Union - West Europe and North Europe.
    - UK - UK South and UK West.
    - France - France Central and France South.

- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions where the service is available.

For the most up-to-date information on region availability for Data Box Heavy, go to [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all).

## Sign up

Take the following steps to sign up for Data Box Heavy:

1. [Sign into the Azure portal](https://portal.azure.com).
2. Click **+ Create a resource** to create a new resource. Search for **Azure Data Box**. Select **Azure Data Box** service.
3. Click **Create**.
4. Pick the subscription that you want to use for Data Box Heavy. Select the region where you want to deploy the Data Box Heavy resource. In the **Data Box Heavy** option, click **Sign up**.
5. Answer the questions regarding data residence country/region, time-frame, target Azure service for data transfer, network bandwidth, and data transfer frequency. Review Privacy and terms and select the checkbox against Microsoft can use your email address to contact you.

Once you're signed up, you can order a Data Box Heavy.

    
