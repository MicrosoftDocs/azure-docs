<properties
   pageTitle="Deploy an on-premises StorSimple device | Microsoft Azure"
   description="Describes the steps and best practices for deploying the StorSimple device and service. (Applies to Microsoft Azure StorSimple version .3 and earlier.)"
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/26/2016"
   ms.author="alkohli" />

# Deploy your on-premises StorSimple device

> [AZURE.SELECTOR]
- [Update 2](../articles/storsimple/storsimple-deployment-walkthrough-u2.md)
- [Update 1](../articles/storsimple/storsimple-deployment-walkthrough-u1.md)
- [GA Release](../articles/storsimple/storsimple-deployment-walkthrough.md)

## Overview

Welcome to Microsoft Azure StorSimple device deployment. These deployment tutorials apply to StorSimple 8000 Series Release Version, StorSimple 8000 Series Update 0.1, StorSimple 8000 Series Update 0.2, and StorSimple 8000 Series Update 0.3. This series of tutorials describes how to configure your StorSimple device, and includes a configuration checklist, configuration prerequisites, and detailed configuration steps.


The information in these tutorials assumes that you have reviewed the safety precautions, and unpacked, racked, and cabled your StorSimple device. If you still need to perform those tasks, start with reviewing the [safety precautions](storsimple-safety.md). Depending on your device model, you can then unpack, rack mount, and cable by following the instructions in:

- [Unpack, rack mount, and cable your 8100](storsimple-8100-hardware-installation.md)
- [Unpack, rack mount, and cable your 8600](storsimple-8600-hardware-installation.md)

You will need administrator privileges to complete the setup and configuration process. We recommend that you review the configuration checklist before you begin. The deployment and configuration process can take some time to complete.

> [AZURE.NOTE] The StorSimple deployment information published on the Microsoft Azure website applies to StorSimple 8000 series devices only. For complete information about the 5000 and 7000 series devices, go to: [http://onlinehelp.storsimple.com/](http://onlinehelp.storsimple.com). For 5000 and 7000 series deployment information, see the [StorSimple System Quick Start Guide](http://onlinehelp.storsimple.com/111_Appliance/).

## Deployment steps

Perform these required steps to configure your StorSimple device and connect it to your StorSimple Manager service. In addition to the required steps, there are optional steps and procedures you may need during the deployment. The step-by-step deployment instructions indicate when you should perform each of these optional steps.


| Step                                                                                   | Description                                                                                                                                                   |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **PREREQUISITES**                                                                      | These need to be completed in preparation for the upcoming deployment.                                                                                        |
| Deployment configuration checklist.                                                     | Use this checklist to gather and record information prior to and during the deployment.                                                                       |
| Deployment prerequisites.                                                               | These  validate the environment is ready for deployment.                                                                                                     |
|                                                                                        |                                                                                                                                                               |
| **STEP-BY-STEP DEPLOYMENT**                                                                   | These steps are required to deploy your StorSimple device in production.                                                                                      |
| Step 1: Create a new service.                                                         | Set up cloud management and storage for your   StorSimple device. Skip this step if you have an existing service for other StorSimple devices.                |
| Step 2: Get the service registration key.                                               | Use this key to register & connect your StorSimple device with the management service.                                                                         |
| Step 3: Configure and register the device through Windows PowerShell for StorSimple.    | Connect the device to your network and register it with Azure to complete   the setup using the management service.                                            |
| Step 4: Complete minimum device setup</br>Optional: Update your StorSimple device.      | Use the management service to complete the device setup and enable it to provide storage.                                                                      |
| Step 5: Create a volume container.                                                      | Create a container to provision volumes. A volume container has storage   account, bandwidth, and encryption settings for all the volumes contained in it.    |
| Step 6: Create a volume.                                                                | Provision storage volume(s) on the StorSimple device for your servers.                                                                                        |
| Step 7: Mount, initialize, and format a volume.</br>Optional: Configure MPIO.            | Connect your servers to the iSCSI storage provided by the device. Optionally configure MPIO to ensure that your servers can tolerate link, network, and interface failure.                                                                                                                                                              |
| Step 8: Take a backup.                                                                  | Set up your backup policy to protect your data                                                                                                                 |
|                                                                                        |                                                                                                                                                               |
| **OTHER PROCEDURES**                                                                   | You may need to refer to these procedures as you deploy your solution.                                                                                     	 |
| Configure a new storage account for the service.                                      |                                                                                                                                                               |
| Use PuTTY to connect to the device serial console.                                    |                                                                                                                                                               |
| Get the IQN of a Windows Server host.                                                   |                                                                                                                                                               |
| Create a manual backup.                                                                 |


## Deployment configuration checklist

The following deployment configuration checklist describes the information that you need to collect before and as you configure the software on your StorSimple device. Preparing some of this information ahead of time will help streamline the process of deploying the StorSimple device in your environment. Use this checklist to also note down the configuration details as you deploy your device.

| Stage                                  | Parameter                                         | Details                                                                                                                                                                | Values |
|----------------------------------------|---------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| **Cable your device**                      | Serial access                                     | Initial device configuration                                                                  | Yes/No |
|   |   |  |  |
| **Configure and register device**          | Data 0 network settings                           | Data 0 IP Address:</br>Subnet mask:</br>Gateway:</br>Primary DNS server:</br>Primary NTP server:</br>Web proxy server IP/FQDN (optional):</br>Web proxy port:|        |
|                                        | Device administrator password                   	 | Password must be between 8 and 15 characters containing lowercase, uppercase, numeric and special characters. |        |
|                                        | StorSimple Snapshot Manager password              | Password must be 14 or 15 characters containing lowercase, uppercase, numeric and special characters.|        |
|                                        | Service Registration Key                          | This key is generated from the Azure classic portal.    |        |
|                                        | Service Data Encryption Key                       | This key is created when the device is registered with the management service via the Windows PowerShell for StorSimple. Copy this key and save it in a safe location.|  |
|   |   |  |  |
| **Complete minimum device setup**          | Friendly name for your device                     | This is a descriptive name for the device. |        |
|                                        | Timezone                                          | Your device will use this time zone for all scheduled operations.  |        |
|                                        | Secondary DNS server                              | This is a required configuration.                                  |        |
|                                        | Network interface: Data 0 controller fixed IPs    							      | These IP’s should be routable to the Internet.</br>Controller 0 fixed IP address:</br>Controller 1 fixed IP address:|
|   |   |  |  |
| **Additional network interface settings**  | Network interface: Data 1</br>If iSCSI enabled, do not configure the Gateway.      | Purpose: Cloud/iSCSI/Not used</br>IP address:</br>Subnet mask:</br>Gateway:|
|                                        | Network interface: Data 2</br>If iSCSI enabled, do not configure the Gateway.      | Purpose: Cloud/iSCSI/Not used</br>IP address:</br>Subnet mask:</br>Gateway:|
|                                        | Network interface: Data 3</br>If iSCSI enabled, do not configure the Gateway.      | Purpose: Cloud/iSCSI/Not used</br>IP address:</br>Subnet mask:</br>Gateway:|
|                                        | Network interface: Data 4</br>If iSCSI enabled, do not configure the Gateway.      | Purpose: Cloud/iSCSI/Not used</br>IP address:</br>Subnet mask:</br>Gateway:|
|                                        | Network interface: Data 5</br>If iSCSI enabled, do not configure the Gateway.      | Purpose: Cloud/iSCSI/Not used</br>IP address:</br>Subnet mask:</br>Gateway:|
|   |   |  |  |
| **Create a volume container**                      | Volume container name:                            | Name for the container                                                                                                                                                 |        |
|                                        | Azure storage account:                            | Storage account name & access key to associate with this volume container                                                                                              |        |
|                                        | Cloud storage encryption key:                     | Encryption key for storage in each container                                                                                                                           |        |
|   |   |  |  |
| **Create a volume**                        | Details for each volume                           | Volume name:                                                                                                                                                           |        |
|                                        |                                                   | Size:                                                                                                                                                                  |        |
|                                        |                                                   | Usage type:                                                                                                                                                            |        |
|                                        |                                                   | ACR name:                                                                                                                                                              |        |
|                                        |                                                   | Default backup policy:                                                                                                                                                 |        |
|   |   |  |  |
| **Mount, initialize, and format a volume** | Details for each host server connecting to the storage | Windows Server name:                                                                                                                                                   |        |
|                                        |                                                   | Windows Server IQN:                                                                                                                                                    |        |
|                                        |                                                   | Windows Server volume name:                                                                                                                                                   |        |
|                                        |                                                   | NTFS mount point/Drive letter:                                                                                                                                      |        |

## Deployment prerequisites

The following sections explain the configuration prerequisites for your StorSimple Manager service, your StorSimple device, and the network in your datacenter.

### For the StorSimple Manager service

Before you begin, make sure that:

- You have your Microsoft account with access credentials.

- You have your Microsoft Azure storage account with access credentials.

- Your Microsoft Azure subscription is enabled for the StorSimple Manager service. Your subscription should be purchased through the [Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/).

- You have access to terminal emulation software such as PuTTY.

### For the device in the datacenter

Before configuring the device, make sure that:

- Your device is fully unpacked, mounted on a rack and fully cabled for power, network, and serial access as described in:

	-  [Unpack, rack mount, and cable your 8100 device](storsimple-8100-hardware-installation.md)
	-  [Unpack, rack mount, and cable your 8600 device](storsimple-8600-hardware-installation.md)


### For the network in the datacenter

Before you begin, make sure that:

- The ports in your datacenter firewall are opened to allow for iSCSI and cloud traffic as described in [Networking requirements for your StorSimple device](storsimple-system-requirements.md#networking-requirements-for-your-storsimple-device).
- The device in your datacenter can connect to outside network. Run the following [Windows PowerShell 4.0](http://www.microsoft.com/download/details.aspx?id=40855) cmdlets (tabulated below) to validate the connectivity to the outside network. Perform this validation on a computer (in datacenter network) that has connectivity to Azure and where you will deploy your StorSimple device.  

| For this parameter…       | To check the validity…                                                                                                                                                                                | Run these commands/cmdlets.                                                                                                                                                             |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **IP**</br>**Subnet**</br>**Gateway** | Is this a valid IPv4 or IPv6 address?</br>Is this a valid subnet?</br>Is this a valid gateway?</br>Is this a duplicate IP on network?                                                                          | `ping ip`</br>`arp -a`</br>The `ping` and `arp` commands should fail indicating that there is no device in the datacenter network that is using this IP.
|                           |                                                                                                                                                                    |                                                                                                                                                                                         |
| **DNS**                       | Is this a valid DNS and can resolve Azure URLs?                                                                                                                    | `Resolve-DnsName -Name www.bing.com -Server <DNS server IP address>` </br>An alternative command that can be used is:</br>`nslookup --dns-ip=<DNS server IP address> www.bing.com`      |
|                           | Check if port 53 is open. This is applicable only if you are using an external DNS for your device. Internal DNS should automatically resolve the external URLs.  | `Test-Port -comp dc1 -port 53 -udp -UDPtimeout 10000`  </br>[More information on this cmdlet](http://learn-powershell.net/2011/02/21/querying-udp-ports-with-powershell/)|
|                           |                                                                                                                                                                    |                                                                                                                                                                                         |
| **NTP**                       | We trigger a time sync as soon as NTP server is input. Check UDP port 123 is open when you input `time.windows.com` or public time servers). | [Download and use this script](https://gallery.technet.microsoft.com/scriptcenter/Get-Network-NTP-Time-with-07b216ca).                                                                                                                                                           |
|                           |                                                                                                                                                                    |                                                                                                                                                                                         |
| **Proxy (optional)**          | Is this a valid proxy URI and port? </br> Is the authentication mode correct?                                                                                                                                | <code>wget http://bing.com &#124; % {$_.StatusCode}</code></br>This command should be run immediately after configuring web proxy. If a status code of 200 is returned, it indicates that the connection is successful.                                                                                                                                 |
|                           | Is traffic routable through proxy?                                                                                                                                 | Run the DNS validation, NTP check or HTTP check once after configuring proxy on your device. This will give a clear picture if traffic is getting blocked at proxy or elsewhere.                                                                                   								     |
|                           |                                                                                                                                                                    |                                                                                                                                                                                         |
| **Registration**              | Check if outbound TCP ports 443, 80, 9354 are open.                                                                                                                |  `Test-NetConnection -Port   443 -InformationLevel Detailed`</br>[More information for Test-NetConnection cmdlet](https://technet.microsoft.com/library/dn372891.aspx)                                                                           |

## Step-by-step deployment

Use the following step-by-step instructions to deploy your StorSimple device in the datacenter.

## Step 1: Create a new service

A StorSimple Manager service can manage multiple StorSimple devices. For the deployment of your first StorSimple device, you will need to create a new StorSimple Manager service.

> [AZURE.IMPORTANT] Skip this step if you have an existing StorSimple Manager service and you intend to deploy your StorSimple device with that service.

Perform the following steps to create a new instance of the StorSimple Manager service.

[AZURE.INCLUDE [storsimple-create-new-service](../../includes/storsimple-create-new-service.md)]

> [AZURE.IMPORTANT] If you did not enable the automatic creation of a storage account with your service, you will need to create at least one storage account after you have successfully created a service. This storage account will be used when you create a volume container.
>
> If you did not create a storage account automatically, go to [Configure a new storage account for the service](#configure-a-new-storage-account-for-the-service) for detailed instructions.
> If you enabled the automatic creation of a storage account, go to [Step 2: Get the service registration key](#step-2:-get-the-service-registration-key).

## Step 2: Get the service registration key

After the StorSimple Manager service is up and running, you will need to get the service registration key. This key is used to register and connect your StorSimple device with the service.

Perform the following steps in the Azure classic portal.

[AZURE.INCLUDE [storsimple-get-service-registration-key](../../includes/storsimple-get-service-registration-key.md)]


## Step 3: Configure and register the device through Windows PowerShell for StorSimple

> [AZURE.IMPORTANT] Prior to performing this configuration, unplug all the network interfaces other than DATA 0 on both (active and passive) the controllers.

Use Windows PowerShell for StorSimple to complete the initial setup of your StorSimple device as explained in the following procedure. You will need to use terminal emulation software to complete this step. For more information, see [Use PuTTY to connect to the device serial console](#use-putty-to-connect-to-the-device-serial-console).

[AZURE.INCLUDE [storsimple-configure-and-register-device](../../includes/storsimple-configure-and-register-device.md)]

## Step 4: Complete minimum device setup

For the minimum device configuration of your StorSimple device, you are required to:

- Set up the secondary DNS server.
- Enable iSCSI on at least one network interface.
- Assign fixed IP addresses to both the controllers.

Perform the following steps in the Azure classic portal to complete the minimum device setup.

[AZURE.INCLUDE [storsimple-complete-minimum-device-setup](../../includes/storsimple-complete-minimum-device-setup.md)]

After the device configuration is complete, you must scan for updates and if available, install updates. The updates may take several hours to complete. Follow the instructions in [Scan for and apply updates](#scan-for-and-apply-updates).


## Step 5: Create a volume container

A volume container has storage account, bandwidth, and encryption settings for all the volumes contained in it. You will need to create a volume container before you can start provisioning volumes on your StorSimple device.

Perform the following steps in the Azure classic portal to create a volume container.

[AZURE.INCLUDE [storsimple-create-volume-container](../../includes/storsimple-create-volume-container.md)]

## Step 6: Create a volume

After you create a volume container, you can provision a storage volume on the StorSimple device for your servers. Perform the following steps in the Azure classic portal to create a volume.

> [AZURE.IMPORTANT] StorSimple Manager can create only thinly provisioned volumes.  You cannot create fully or partially provisioned volumes.

[AZURE.INCLUDE [storsimple-create-volume](../../includes/storsimple-create-volume.md)]

## Step 7: Mount, initialize, and format a volume

> [AZURE.IMPORTANT]

> - For the high availability of your StorSimple solution, we recommend that you configure MPIO on your Windows Server host (optional) prior to configuring iSCSI on your Windows Server host. MPIO configuration on host servers will ensure that the servers can tolerate a link, network, or interface failure.

> - For MPIO and iSCSI installation and configuration instructions, go to [Configure MPIO for your StorSimple device](storsimple-configure-mpio-windows-server.md). These will also include the steps to mount, initialize and format StorSimple volumes.

If you decide not to configure MPIO, perform the following steps to mount, initialize, and format your StorSimple volumes.

[AZURE.INCLUDE [storsimple-mount-initialize-format-volume](../../includes/storsimple-mount-initialize-format-volume.md)]

## Step 8: Take a backup

Backups provide point-in-time protection of volumes and improve recoverability while minimizing restore times. You can take two types of backup on your StorSimple device: local snapshots and cloud snapshots. Each of these backup types can be **Scheduled** or **Manual**.

Perform the following steps in the Azure classic portal to create a scheduled backup.

[AZURE.INCLUDE [storsimple-take-backup](../../includes/storsimple-take-backup.md)]

You can take a manual backup at any time. For procedures, go to [Create a manual backup](#Create-a-manual-backup).

## Configure a new storage account for the service

This is an optional step that you need to perform only if you did not enable the automatic creation of a storage account with your service. A Microsoft Azure storage account is required to create a StorSimple volume container.

If you need to create an Azure storage account in a different region, see [About Azure Storage Accounts](../storage/storage-create-storage-account.md) for step-by-step instructions.

Perform the following steps in the Azure classic portal, on the **StorSimple Manager service** page.

[AZURE.INCLUDE [storsimple-configure-new-storage-account](../../includes/storsimple-configure-new-storage-account.md)]


## Use PuTTY to connect to the device serial console

To connect to Windows PowerShell for StorSimple, you need to use terminal emulation software such as PuTTY. You can use PuTTY when you access the device directly through the serial console or by opening a telnet session from a remote computer.

[AZURE.INCLUDE [Use PuTTY to connect to the device serial console](../../includes/storsimple-use-putty.md)]

## Scan for and apply updates

Updating your device can take anywhere from 1-4 hours. Perform the following steps to scan for and apply updates on your device.

> [AZURE.NOTE] If you have a gateway configured on a network interface other than Data 0, you will need to disable Data 2 and Data 3 network interfaces before installing the update. Go to **Devices > Configure** and disable Data 2 and Data 3 interfaces. You should re-enable these interfaces after the device is updated.

#### To update your device
1.	On the device **Quick Start** page, click **Devices**. Select the physical device, click **Maintenance** and then click **Scan Updates**.  
2.	A job to scan for available updates is created. If updates are available, the **Scan Updates** changes to **Install Updates**. Click **Install Updates**. You may be requested to disable Data 2 and Data 3 prior to installing the updates. You must disable these network interfaces or the updates may fail.
3.	An update job will be created. Monitor the status of your update by navigating to **Jobs**.

	> [AZURE.NOTE] When the update job starts, it immediately displays the status as 50 percent. The status then changes to 100 percent only after the update job is complete. There is no real time status for the updates process.

4.	After the device is successfully updated, enable Data 2 and Data 3 network interfaces if these were disabled.



## Get the IQN of a Windows Server host

Perform the following steps to get the iSCSI Qualified Name (IQN) of a Windows host that is running Windows Server 2012.

[AZURE.INCLUDE [Create a manual backup](../../includes/storsimple-get-iqn.md)]


## Create a manual backup

Perform the following steps in the Azure classic portal to create an on-demand manual backup for a single volume on your StorSimple device.

[AZURE.INCLUDE [Create a manual backup](../../includes/storsimple-create-manual-backup.md)]


## Next steps

- Configure a [virtual device](storsimple-virtual-device-u2.md).

- Use the [StorSimple Manager service](https://msdn.microsoft.com/library/azure/dn772396.aspx) to manage your StorSimple device.
