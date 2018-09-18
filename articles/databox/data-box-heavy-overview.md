---
title: Microsoft Azure Data Box Heavy overview | Microsoft Docs in data 
description: Describes Azure Data Box, a hybrid solution that enables you to transfer massive amounts of data into Azure
services: databox
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: overview
ms.custom:
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 09/24/2018
ms.author: alkohli
---
# What is Azure Data Box Heavy? (Preview)

The Microsoft Azure Data Box hybrid solution lets you send hundreds of terabytes of data into Azure in a quick, inexpensive, and reliable way. The secure data transfer is accelerated by shipping you a proprietary storage device of 1 PB storage capacity via freight. The device has a rugged casing to protect and secure data during the transit.

Data Box Heavy is currently in preview and you can sign up to request for a device via the Azure portal. Once the device is received at your datacenter, you can set it up using the local web UI. Copy the data from your servers to the device and ship the device back to Azure. In the Azure datacenter, your data is automatically uploaded from the device to Azure. The entire process is tracked end-to-end by the Data Box service in the Azure portal.


> [!IMPORTANT]
> - Data Box Heavy is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution. 
> - To request a device, sign up in the [Preview portal](http://aka.ms/).
> - During preview, Data Box Heavy can be shipped to customers in US and European Union. For more information, go to [Region availability](#region-availability).

## Use cases

Data Box Heavy is ideally suited to transfer data sizes larger than 500 TB in scenarios with limited to no network connectivity. The data movement can be one-time, periodic, or an initial bulk data transfer followed by periodic transfers. Here are the various scenarios where Data Box Heavy can be used for data transfer.

 - **One time migration** - when large amount of on-premises data is moved to Azure. 
     - Moving a media library from offline tapes into Azure to create an online media library.
     - Migrating your VM farm, SQL server, and applications to Azure
     - Moving historical data to Azure for in-depth analysis and reporting using HDInsight

 - **Initial bulk transfer** - when an initial bulk transfer is done using Data Box Heavy (seed) followed by incremental transfers over the network. 
     - For example, backup solutions partners such as Commvault and Data Box Heavy are used to move initial large historical backup to Azure. Once complete, the incremental data is transferred via network to Azure storage.

 - **Periodic uploads** - when large amount of data is generated periodically and needs to be moved to Azure. For example in energy exploration, where video content is generated on oil rigs and windmill farms.      

## Benefits

Data Box Heavy is designed to move massive amounts of data to Azure with little to no impact to network. The solution has the following benefits:

- **Speed** - Data Box Heavy uses high performance 40 Gbps network interfaces.

- **Secure** - Data Box Heavy has built-in security protections for the device, data, and the service.
    - The device has a rugged device casing secured by tamper-resistant screws and tamper-evident stickers. 
    - The data on the device is secured with an AES 256-bit encryption at all times.
    - The device can only be unlocked with a password provided in the Azure portal.
    - The service is protected by the Azure security features.
    - Once your data is uploaded to Azure, the disks on the device are wiped clean, in accordance with NIST 800-88r1 standards.


<!--## Features and specifications

The Data Box Heavy device has the following features in this release.

| Specifications                                          | Description              |
|---------------------------------------------------------|--------------------------|
| Weight                                                  | < 50 lbs.                |
| Dimensions                                              | Device - Width: 309.0 mm Height: 430.4 mm Depth: 502.0 mm |            
| Rack space                                              | 7 U when placed in the rack on its side (cannot be rack-mounted)|
| Cables required                                         | 1 X power cable (included) <br> 2 RJ45 cables <br> 2 X SFP+ Twinax copper cables|
| Storage capacity                                        | 100 TB <br> 80 TB usable capacity after RAID 5 protection|
| Network interfaces                                      | 2 X 1 GbE interface - MGMT, DATA 3. <br> MGMT - for management, not user configurable, used for initial setup <br> DATA3 - for data, user configurable, and is dynamic by default <br> MGMT and DATA 3 can also work as 10 GbE <br> 2 X 10 GbE interface - DATA 1, DATA 2 <br> Both are for data, can be configured as dynamic (default) or static |
| Data transfer media                                     | RJ45, SFP+ copper 10 GbE Ethernet  |
| Security                                                | Rugged device casing with tamper-proof custom screws <br> Tamper-evident stickers placed at the bottom of the device|
| Data transfer rate                                      | Up to 80 TB in a day over 10 GbE network interface        |
| Management                                              | Local web UI - one-time initial setup and configuration <br> Azure portal - day-to-day device management        |-->

## Components

The Data Box Heavy includes the following components:

* **Data Box Heavy device** - a physical device with a rugged exterior that stores data securely. This device has a usable storage capacity of 800 TB. 

    
* **Data Box service** – an extension of the Azure portal that lets you manage a Data Box Heavy device from a web interface that you can access from different geographical locations. Use the Data Box service to perform daily administration of your Data Box Heavy device. The service tasks include how to create and manage orders, view and manage alerts, and manage shares.  

* **Local web user interface** – a web-based UI that is used to configure the device so that it can connect to the local network, and then register the device with the Data Box service. Use the local web UI also to shut down and restart the device, view copy logs, and contact Microsoft Support to file a service request.


## The workflow

A typical flow includes the following steps:

1. **Order** - Create an order in the Azure portal, provide shipping information, and the destination Azure storage account for your data. If the device is available, Azure prepares and ships the device with a shipment tracking ID.

2. **Receive** - Once the device is delivered, cable the device for network and power using the specified cables. Turn on and connect to the device. Configure the device network and mount shares on the host computer from where you want to copy the data.

3. **Copy data** - Copy data to Data Box Heavy shares.

4. **Return** - Prepare, turn off, and ship the device back to the Azure datacenter.

5. **Upload** - Data is automatically copied from the device to Azure. The device disks are securely erased as per the National Institute of Standards and Technology (NIST) guidelines.

Throughout this process, you are notified via email on all status changes. 

## Region availability

Data Box Heavy can transfer data based on the region in which service is deployed, country to which the device is shipped, and the target Azure storage account where you transfer the data. 

- **Service availability** - For this release, Data Box Heavy is available in the following regions:
    - All public cloud regions in the United States - West Central US, West US2, West US, South Central US, Central US, North Central US, East US, and East US2.
    - European Union - West Europe and North Europe.
    - UK - UK South and UK West.
    - France - France Central and France South.

- **Destination Storage accounts** - The storage accounts that store the data are available in all Azure regions where the service is available. 

## Sign up

Data Box Heavy is in preview and you need to sign up. Perform the following steps to sign up for Data Box Heavy:

1. Sign into the Azure portal at: https://aka.ms/azuredatabox.
2. Click **+** to create a new resource. Search for **Azure Data Box**. Select **Azure Data Box** service.

    <!--![The Data Box Heavy sign up 1]()-->

3. Click **Create**.

    <!--![The Data Box Heavy sign up 2]()-->

4. Pick the subscription that you want to use for Data Box Heavy preview. Select the region where you want to deploy the Data Box Heavy resource. In the **Data Box Heavy** option, click **Sign up**.

   <!--![The Data Box Heavy sign up 3]()-->

5. Answer the questions regarding data residence country, time-frame, target Azure service for data transfer, network bandwidth, and data transfer frequency. Review Privacy and terms and select the checkbox against Microsoft can use your email address to contact you.

    <!--![The Data Box Heavy sign up 4]()-->

Once you are signed up and enabled for preview, you can order a Data Box Heavy.




