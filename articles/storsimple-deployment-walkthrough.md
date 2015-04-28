<properties 
   pageTitle="Deploy your on-premises StorSimple device"
   description="Steps and best practices for deploying the StorSimple device and service."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="04/28/2015"
   ms.author="v-sharos" />

# Deploy your on-premises StorSimple device

## Overview

Welcome to Microsoft Azure StorSimple device deployment.

This series of tutorials describes how to configure your StorSimple devices and includes a pre-installation checklist, configuration prerequisites, and detailed configuration steps.

> [AZURE.NOTE] The StorSimple deployment information published on the Microsoft Azure website and in the MSDN Library applies to StorSimple 8000 series devices only. For complete information about the 7000 series devices, go to: [http://onlinehelp.storsimple.com/](http://onlinehelp.storsimple.com). For 7000 series deployment information, see the [StorSimple System Quick Start Guide](http://onlinehelp.storsimple.com/111_Appliance/).

The information in these tutorials assumes that you have reviewed the safety precautions and configuration checklist, and unpacked, racked, and cabled your StorSimple device. If you still need to perform those tasks, go to  [Safety precautions](https://msdn.microsoft.com/library/azure/dn772366.aspx), [Configuration checklist](https://msdn.microsoft.com/library/azure/dn757787.aspx), and [Hardware installation of your device](https://msdn.microsoft.com/library/azure/dn772375.aspx), as appropriate.

You will need administrator privileges to complete the setup and configuration process. We recommend that you review the pre-installation checklist before you begin. The deployment and configuration process can take some time to complete. 

## Pre-installation checklist

The following pre-installation checklist describes the information that you need to collect before you configure the software on your StorSimple device. Preparing this information ahead of time will help streamline the process of deploying the StorSimple device in your environment.

|   | Requirements          | Details                | Values        |
|---| --------------------- | ---------------------- | ------------- |
| 1 | Friendly name for your device | A descriptive name for the device | |
| 2 | Network settings <ol><li>Device IP address</li><li>Network interfaces, 4x1 GbE, 2x10 GbE</li><li>Fixed controller IP</li><li>Subnet masks</li><li>Gateway</li></ol> | Total IPs required: 8 <ol><li>One per device</li><li>One per network interface enabled, total 6</li><li>One per controller, total 2</li><li>One for each IP address</li><li>One per device</li></ol> | |
| 3 | Serial access         | Initial device configuration | Yes/No |
| 4 | DNS server IP addresses | Required to connect to Microsoft Azure: total of 2 required for high availability | |
| 5 | NTP server IP addresses | Required to synchronize time with Azure: 1 required, 1 optional | |
| 6 | Proxy server (optional) | IP address/fully qualified domain name of the proxy server, port to be used | |
| 7 | Azure Storage account   | Access credentials such as account name and access key, per storage account | |
| 8 | Cloud storage encryption key (recommended) | Per volume container | |
| 9 | IQN of host             | Per host | |

## Deployment prerequisites

The following sections explain the configuration prerequisites for your StorSimple Manager service and your StorSimple device.

### For the StorSimple Manager service

Before you begin, make sure that:

- You have your Microsoft account with access credentials.

- You have your Microsoft Azure storage account with access credentials.

- Your Microsoft Azure subscription is enabled for the StorSimple Manager service. Your subscription should be purchased through the [Enterprise Agreement](http://azure.microsoft.com/pricing/enterprise-agreement/).

- You have access to terminal emulation software such as PuTTY.

### For the device in the datacenter

Before configuring the device, make sure that:

- Your device is fully unpacked as described in [Unpack your 8100 device](https://msdn.microsoft.com/library/azure/dn772327.aspx) or [Unpack your 8600 device](https://msdn.microsoft.com/library/azure/dn772418.aspx).

- Your device is mounted on a rack as described in [Rack-mount your 8100 device](https://msdn.microsoft.com/library/azure/dn757749.aspx) or [Rack-mount your 8600 device](https://msdn.microsoft.com/library/azure/dn757745.aspx).

- Your device is fully cabled for power, network, and serial access as described in [Cable your 8100 device](https://msdn.microsoft.com/library/azure/dn757738.aspx) or [Cable your 8600 device](https://msdn.microsoft.com/library/azure/dn757762.aspx).

## Deployment steps

Follow these required steps to configure your StorSimple device and connect it to your StorSimple Manager service:

- Step 1: Create a new service 
- Step 2: Get the service registration key
- Step 3: Configure and register the device through Windows PowerShell for StorSimple 
- Step 4: Complete minimum device setup
- Step 5: Create a volume container 
- Step 6: Create a volume
- Step 7: Mount, initialize, and format a volume 
- Step 8: Take a backup

In addition to the required steps, there are a few optional steps that you might need to complete as you deploy your solution. These optional steps explain how to:

- Configure a new storage account for the service
- Use PuTTY to connect to the device serial console
- Get the IQN of a Windows Server host
- Create a manual backup
- Configure MPIO

The step-by-step deployment instructions indicate when you should perform each of these optional steps.

## Step 1: Create a new service

A StorSimple Manager service can manage multiple StorSimple devices. Perform the following steps to create a new instance of the StorSimple Manager service.

[AZURE.INCLUDE [storsimple-create-new-service](../includes/storsimple-create-new-service.md)]

> [AZURE.IMPORTANT] If you did not enable the automatic creation of a storage account with your service, you will need to create at least one storage account after you have successfully created a service. This storage account will be used when you create a volume container. 
>
> * If you did not create a storage account automatically, go to [Configure a new storage account for the service](#Configure-a-new-storage-account-for-the-service) for detailed instructions. 
> * If you enabled the automatic creation of a storage account, go to Step 2: Get the service registration key.

## Step 2: Get the service registration key

After the StorSimple Manager service is up and running, you will need to get the service registration key. This key is used to register and connect your StorSimple device with the service.

Perform the following steps in the Management Portal.

[AZURE.INCLUDE [storsimple-get-service-registration-key](../includes/storsimple-get-service-registration-key.md)]


## Step 3: Configure and register the device through Windows PowerShell for StorSimple

Use Windows PowerShell for StorSimple to complete the initial setup of your StorSimple device as explained in the following procedure. You will need to use terminal emulation software to complete this step. For more information, see [Use PuTTY to connect to the device serial console](#use-putty-to-connect-to-the-device-serial-console).

[AZURE.INCLUDE [storsimple-configure-and-register-device](../includes/storsimple-configure-and-register-device.md)]

## Step 4: Complete minimum device setup

For the minimum device configuration of your StorSimple device, you are required to: 

- Set up the secondary DNS server.
- Enable iSCSI on at least one network interface.
- Assign fixed IP addresses to both the controllers.

Perform the following steps in the Management Portal to complete the minimum device setup.

[AZURE.INCLUDE [storsimple-complete-minimum-device-setup](../includes/storsimple-complete-minimum-device-setup.md)]

## Step 5: Create a volume container

A volume container has storage account, bandwidth, and encryption settings for all the volumes contained in it. You will need to create a volume container before you can start provisioning volumes on your StorSimple device. 

Perform the following steps in the Management Portal to create a volume container.

[AZURE.INCLUDE [storsimple-create-volume-container](../includes/storsimple-create-volume-container.md)]

## Step 6: Create a volume

After you create a volume container, you can provision a storage volume on the StorSimple device for your servers. Perform the following steps in the Management Portal to create a volume.

> [AZURE.IMPORTANT] Azure StorSimple can create only thinly provisioned volumes.  You cannot create fully provisioned or partially provisioned volumes on an Azure StorSimple system. 

[AZURE.INCLUDE [storsimple-create-volume](../includes/storsimple-create-volume.md)]

## Step 7: Mount, initialize, and format a volume

Perform these steps on your Windows Server host.

[AZURE.INCLUDE [storsimple-mount-initialize-format-volume](../includes/storsimple-mount-initialize-format-volume.md)]

## Step 8: Take a backup

Backups provide point-in-time protection of volumes and improve recoverability while minimizing restore times. You can take two types of backup on your StorSimple device: local snapshots and cloud snapshots. Each of these backup types can be **Scheduled** or **Manual**. 

Perform the following steps in the Management Portal to create a scheduled backup.

[AZURE.INCLUDE [storsimple-take-backup](../includes/storsimple-take-backup.md)]

You can take a manual backup at any time. For procedures, go to [Create a manual backup](#Create-a-manual-backup). 

## Configure a new storage account for the service

This is an optional step that you need to perform only if you did not enable the automatic creation of a storage account with your service. A Microsoft Azure storage account is required to create a StorSimple volume container.

If you need to create an Azure storage account in a different region, see [About Azure Storage Accounts](storage-create-storage-account.md) for step-by-step instructions.

Perform the following steps in the Management Portal, on the **StorSimple Manager service** page.

[AZURE.INCLUDE [storsimple-configure-new-storage-account](../includes/storsimple-configure-new-storage-account.md)]


## Use PuTTY to connect to the device serial console

To connect to Windows PowerShell for StorSimple, you need to use terminal emulation software such as PuTTY. You can use PuTTY when you access the device directly through the serial console or by opening a telnet session from a remote computer.

[AZURE.INCLUDE [Use PuTTY to connect to the device serial console](../includes/storsimple-use-putty.md)]

## Get the IQN of a Windows Server host

Perform the following steps to get the iSCSI Qualified Name (IQN) of a Windows host that is running Windows Server® 2012.

[AZURE.INCLUDE [Create a manual backup](../includes/storsimple-get-iqn.md)]

## Create a manual backup

Perform the following steps in the Management Portal to create an on-demand manual backup for a single volume on your StorSimple device.

[AZURE.INCLUDE [Create a manual backup](../includes/storsimple-create-manual-backup.md)]

## Configure MPIO

Multipath I/O (MPIO) is an optional feature and is not installed on Windows Server by default. It should be installed as a feature through Server Manager. 

> [AZURE.NOTE] MPIO is not supported on a StorSimple virtual device. 

For MPIO installation instructions, go to [Configure MPIO for your StorSimple device](storsimple-configure-mpio-windows-server.md).

## Next steps

Configure a [virtual device](storsimple-virtual-device.md).

Use the [StorSimple Manager service](https://msdn.microsoft.com/library/azure/dn772396.aspx) to manage your StorSimple device.
