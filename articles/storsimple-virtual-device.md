<properties 
   pageTitle="StorSimple virtual device"
   description="Describes how to create, configure, deploy and manage StorSimple virtual device."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="adinah"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/06/2015"
   ms.author="alkohli" />

# StorSimple virtual device

##Overview
The StorSimple virtual device is an additional capability that comes with your Microsoft Azure StorSimple solution. The StorSimple virtual device runs on a virtual machine in a Microsoft Azure virtual network, and you can use it to back up and clone data from your hosts. The following topics will help you learn about, configure, and use the StorSimple virtual device.



- How the virtual device differs from the physical device

- Security considerations for using a virtual device

- Prerequisites for the virtual device

- Create and configure the virtual device

- Work with the virtual device

- Failover to the virtual device

- Shut down or delete the virtual device


## How the virtual device differs from the physical device

The StorSimple virtual device is a software-only version of StorSimple that runs on a single node in a Microsoft Azure Virtual Machine. The virtual device supports disaster recovery scenarios in which your physical device is not available, and is appropriate for use in cloud dev and test scenarios.

### Differences from the physical device

The following are some key differences between the StorSimple virtual device and the physical StorSimple device:

- The virtual device has only one network interface: DATA 0. The physical device has six network interfaces: DATA 0 through DATA 5.
- The virtual device is registered during the configuration step instead of as a separate task.
- The service data encryption key cannot be regenerated from the virtual device. During key rollover, you will regenerate the key on the physical device and then update the virtual device with the new key.
- If updates need to be applied to the virtual device, it will experience some down time, whereas the physical device will not.

## Security considerations for using a virtual device

Keep the following security considerations in mind when you use the StorSimple virtual device:

- The virtual device is secured through your Microsoft Azure subscription. This means that if you are using the virtual device and your Azure subscription is compromised, the data stored on your virtual device is also susceptible.

- The public key of the certificate used to encrypt data stored in Azure StorSimple is securely made available to the Microsoft Azure management portal, and the private key is retained with the StorSimple device. On the StorSimple virtual device, both the public and private keys are stored in Azure. 

- The virtual device is hosted in the Microsoft Azure datacenter.


## Prerequisites for the virtual device

The following sections will help you prepare to use the StorSimple virtual device.

### Azure requirements

Before you provision the virtual device, you need to make the following preparations in your Azure environment:

- For the virtual device, [configure a virtual network on Azure](https://msdn.microsoft.com/library/azure/jj156074.aspx). 
- You can use the default DNS server provided by Azure instead of specifying your own DNS server name. 
- Point-to-site and site-to-site are optional, but not required. If you wish, you can configure these options for more advanced scenarios. 

>[AZURE.IMPORTANT] **Make sure that the virtual network is in the same region as the cloud storage accounts that you are going to be using with the virtual device.**

- Create [Azure Virtual Machines ](https://msdn.microsoft.com/library/azure/jj156003.aspx) (host servers) in the virtual network. These servers must meet the following requirements: 							
	- Be Windows or Linux VMs with iSCSI Initiator software installed
	- Be running in the same virtual network as the virtual device
	- Be able to connect to the iSCSI target of the virtual device through the internal IP address of the virtual device

- Make sure you have configured support for iSCSI and cloud traffic on the same virtual network.

### StorSimple requirements

Make the following updates to your Azure StorSimple service before you create a virtual device:


- Add [access control records](https://msdn.microsoft.com/library/1747f56e-858a-4cfe-a020-949d7db23b8b#sec02) for the VMs that are going to be host servers for your virtual device.

- Make sure that you have a [storage account](https://msdn.microsoft.com/library/1747f56e-858a-4cfe-a020-949d7db23b8b#sec01) in the same region as the virtual device. Storage accounts in different regions may result in poor performance.

- Make sure that you use a different storage account for virtual device creation from the one used for your data. Using the same storage account may result in poor performance.

Make sure that you have the following information before you begin:


- You have your Azure Management Portal account with access credentials.

- You have your Azure storage account access credentials.

- You have a copy of the service data encryption key from your physical device.

- You have a copy of the cloud service encryption key for each volume container.


## Create and configure the virtual device

Before performing these procedures, make sure that you have met the [Prerequisites for the virtual device](https://msdn.microsoft.com/library/dn772572.aspx).

After completing these procedures, you are ready to [Work with the virtual device](https://msdn.microsoft.com/library/dn772527.aspx).

### Create the virtual device

After you have created a virtual network, configured a StorSimple Manager service, and registered your physical StorSimple device with the service, you can use the following steps to create a StorSimple virtual device.

Perform the following steps to create the StorSimple virtual device



1.  In the Management Portal, go to the **StorSimple Manager** service.

- Go to the **Devices** page.

- In the **Create Virtual Device dialog box**, specify the following:

	a. **Name** – A unique name for your virtual device.

	b. **Virtual Network** – The name of the virtual network that you want to use with this virtual device.

	c. **Subnet** – The subnet on the virtual network for use with the virtual device.

	d. **Storage Account for Virtual Device Creation** – The storage account that will be used to hold the image of the virtual device during provisioning. This storage account should be in the same region as the virtual device and virtual network. It should not be used for data storage by either the physical device or the virtual device. By default, a new storage account will be created for this purpose. However, if you know that you already have a storage account that is suitable for this use, you can select it from the list.
	
- Click the check mark to indicate that you understand that the data stored on the virtual device will be hosted in a Microsoft datacenter. When you use only a physical device, your encryption key is kept with your device; therefore, Microsoft cannot decrypt it. When you use a virtual device, both the encryption key and the decryption key are stored in Microsoft Azure. For more information, see [Security considerations for using a virtual device](https://msdn.microsoft.com/library/dn772561.aspx).

### Configure and register the virtual device

Before starting this procedure, make sure that you have a copy of the service data encryption key. The service data encryption key was created when you configured your first StorSimple device and you were instructed to save it in a secure location. If you do not have a copy of the service data encryption key, you must contact Microsoft Support for assistance.

Perform the following steps to configure and register your StorSimple virtual device.


1. Select the **StorSimple virtual device** as your device and double-click it to access the Quick Start.

- Click **complete device setup**. This starts the Configure device wizard.

- Enter the **Service Data Encryption Key** in the space provided.

- Click the check mark to finish the initial configuration and registration of the virtual device. The Snapshot Manager Password and Device Administrator Password are preconfigured with default values and must be changed after the device is registered.

### Modify the device configuration settings

The following section describes the device configuration settings that you need to configure for the StorSimple virtual device.

#### Configure the CHAP initiator

This parameter contains the credentials that your virtual device (target) expects from the initiators (servers) that are attempting to access the volumes. The initiators will provide a CHAP user name and a CHAP password to identify themselves to your device during this authentication.

#### Configure the CHAP target

This parameter contains the credentials that your virtual device uses when a CHAP-enabled initiator requests mutual or bi-directional authentication. Your virtual device will use a Reverse CHAP user name and Reverse CHAP password to identify itself to the initiator during this authentication process. Note that CHAP target settings are global settings. When these are applied, all the volumes connected to the storage virtual device will use CHAP authentication.

#### Configure the StorSimple Snapshot Manager

StorSimple Snapshot Manager software resides on your Windows host and allows administrators to manage backups of your StorSimple device in the form of local and cloud snapshots.

>[AZURE.NOTE] **For the virtual device, your Windows host is an Azure VM.**

When configuring a device in the StorSimple Snapshot Manager, you will be prompted to provide the StorSimple device IP address and password to authenticate your storage device. This password is first configured through the Windows PowerShell interface.

Perform the following steps to configure StorSimple Snapshot Manager when using it with your StorSimple virtual device.

1. On your virtual device, go to **Devices > Configure**.

- Scroll down to the **Snapshot Manager** section. Enter a password that is 14 or 15 characters. Make sure that the password contains a combination of uppercase, lowercase, numeric, and special characters.

- Confirm the password.

- Click **Save** at the bottom of the page.

The StorSimple Snapshot Manager password is now updated and can be used when you authenticate your Windows hosts.

#### Configure the device administrator password

When you use the Windows PowerShell interface to access the virtual device, you will be required to enter a device administrator password. For the security of your data, you are required to change this password before the virtual device can be used.

Perform the following steps to configure the device administrator password for your StorSimple virtual device.

1. On your virtual device, go to **Devices > Configure**.
 
1. Scroll down to the **Device Administrator password** section. Provide an administrator password that contains from 8 to 15 characters. The password must be a combination of uppercase, lowercase, numeric, and special characters.

1. Confirm the password.
 
1. Click **Save** at the bottom of the page.

The device administrator password should now be updated. You will use this modified password to access the the Windows PowerShell interface on your virtual device.

#### Configure remote management 

Remote access to your virtual device via the Windows PowerShell interface is not enabled by default. You need to enable remote management on the virtual device first, and then enable it on the client that will be used to access your virtual device.

You can choose to connect over HTTP or HTTPS. For security reasons, we recommend that you use HTTPS with a self-signed certificate to connect to your virtual device.

Perform the following steps to configure remote management for your StorSimple virtual device.


1. On your virtual device, go to **Devices > Configure**.

2. Scroll down to the **Remote Management** section.

3. Set **Enable Remote Management** to **Yes**.

4. You can now choose to connect using HTTP. The default is to connect over HTTPS. Connecting over HTTP is acceptable only on trusted networks.

5. Click **Download Remote Management Certificate** to download a remote management certificate. You will specify a location in which to save this file. This certificate then needs to be installed on the client or host machine that you will use to connect to the virtual device.

6. Click **Save** at the bottom of the page.


## Work with the StorSimple virtual device

Now that you have created and configured the StorSimple virtual device, you are ready to start working with it. You can work with volume containers, volumes, and backup policies on a virtual device just as you would on a physical StorSimple device; the only difference is that you need to make sure that you select the virtual device from your device list. Refer to the following sections for instructions on associated tasks:


- [Volume containers](https://msdn.microsoft.com/library/dn757817.aspx)

- [Volumes](https://msdn.microsoft.com/library/dn772417.aspx)

- [Backup policies](https://msdn.microsoft.com/library/dn772382.aspx)

The following sections discuss some of the differences you will encounter when working with the virtual device.

### Maintain a StorSimple virtual device

Because it is a software-only device, maintenance for the virtual device is minimal when compared to maintenance for the physical device. You have the following options:

- **Automatic updates** – You can turn automatic updates off or on. When automatic updates are turned on, the virtual device will automatically shut down and restart (if necessary) to apply any updates that have been released. Because there is only a single interface on the virtual device, this means that there will be a slight service interruption when updates are applied.
- **Software updates** – You can view the date that the software was last updated, together with any update status messages. You can use the Scan updates button at the bottom of the page to perform a manual scan if you want to check for new updates.
- **Support package** – You can create and upload a support package to help Microsoft Support troubleshoot issues with your virtual device.

### Storage accounts for a virtual device

Storage accounts are created for use by the StorSimple Manager service, by the virtual device, and by the physical device. When you create your storage accounts, we recommend that you use a region identifier in the friendly name to help ensure that the region is consistent throughout all of the system components. For a virtual device, it is important that all of the components be in the same region to prevent performance issues.

### Deactivate a StorSimple virtual device

Deactivating a virtual device deletes the VM and the resources created when it was provisioned. After the virtual device is deactivated, it cannot be restored to its previous state. Before you deactivate the virtual device, make sure to stop or delete clients and hosts that depend on it.

Deactivating a virtual device results in the following actions:

- The virtual device is removed.

- The OSDisk and Data Disks created for the virtual device are removed.

- The hosted service and virtual network created during provisioning are retained. If you are not using them, you should delete them manually.

- Cloud snapshots created for the virtual device are retained.

As soon as the device is shown as deactivated on the StorSimple Manager service page, you can delete the virtual device from the StorSimple Manager service device list.

### Remotely access a StorSimple virtual device

After you have enabled it on the StorSimple device configuration page, you can use Windows PowerShell remoting to connect to the virtual device from another virtual machine inside the same virtual network; for example, you can connect from the host VM that you configured and used to connect iSCSI. In most deployments, you will have already opened a public endpoint to access your host VM that you can use for accessing the virtual device.

>[AZURE.WARNING] **For enhanced security, we strongly recommend that you use HTTPS when connecting to the endpoints and then delete the endpoints after you have completed your PowerShell remote session.**

You should follow the procedures in [Connecting remotely using Windows PowerShell](https://msdn.microsoft.com/library/dn772393.aspx) to set up remoting for your virtual device.

However, if you want to connect directly to the virtual device from another computer outside the virtual network or outside the Microsoft Azure environment, you need to create additional endpoints as described in the following procedure.

Perform the following steps to create a public endpoint on the virtual device.

1. Sign in to the Management Portal.

- Click **Virtual Machines**, and then select the virtual machine that is being used as your virtual device.

- Click **Endpoints**. The Endpoints page lists all endpoints for the virtual machine.

- Click **Add**. The Add Endpoint dialog box appears. Click the arrow to continue.

- For the **Name**, type the following name for the endpoint: **WinRMHttps**.

- For the **Protocol**, specify **TCP**.

- For the **Public Port**, type the port numbers that you want to use for the connection.

- For the **Private Port**, type **5986**.

- Click the check mark to create the endpoint.

After the endpoint is created, you can view its details to determine the Public Virtual IP (VIP) address. Record this address.

We recommend that you connect from another virtual machine inside the same virtual network because this practice minimizes the number of public endpoints on your virtual network. When you use this method, you simply connect to the virtual machine through a Remote Desktop session and then configure that virtual machine for use as you would any other Windows client on a local network. You do not need to append the public port number because the port will already be known.

### Stop and restart

Unlike the physical StorSimple device, there is no power on or power off button to push on a StorSimple virtual device. However, there may be occasions where you need to stop and restart the virtual device. For example, some updates might require that the VM be restarted to finish the update process. The easiest way for you to start, stop, and restart a virtual device is to use the Virtual Machines Management Console.

When you look at the Management Console, the virtual device status is **Running** because it is started by default after it is created. You can stop and restart a virtual machine at any time.

To stop a virtual device, click its name, and then click **Shutdown**. While the virtual device is shutting down, its status is **Stopping**. After the virtual device is stopped, its status is **Stopped**.

When a virtual device is running and you want to restart it, click its name, and then click **Restart**. While the virtual device is restarting, its status is **Restarting**. When the virtual device is ready for you to use, its status is **Running**.

You can also use the following Windows PowerShell cmdlets to start, stop, and restart the virtual device. An example follows each cmdlet.

`Start-AzureVMC:\PS>Start-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`
    

`Stop-AzureVMC:\PS>Stop-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`

`Restart-AzureVMC:\PS>Restart-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`

### Reset to factory defaults

If you decide that you just want to start over with your virtual device, simply deactivate and delete it and then create a new one. Just like when your physical device is reset, your new virtual device will not have any updates installed; therefore, make sure to check for updates before using it.


## Failover to the virtual device

Disaster recovery (DR) is one of the key scenarios that the StorSimple virtual device was designed for. In this scenario, the physical StorSimple device or entire datacenter might not be available. Fortunately, you can use a virtual device to restore operations in an alternate location. During DR, the volume containers from the source device change ownership and are transferred to the virtual device. The prerequisites for DR are that the virtual device has been created and configured, all the volumes within the volume container have been taken offline, and the volume container has an associated cloud snapshot.

### To restore your physical device to the StorSimple virtual device

1. Verify that the volume container you want to fail over has associated cloud snapshots.

- Open the **Device** page, and then click the **Volume Containers** tab.

- Select a volume container that you would like to fail over to the virtual device. Click the volume container to display the list of volumes within the container. Select a volume and click **Take Offline** to take the volume offline. Repeat this process for all the volumes in the volume container.

- Repeat the previous step for all the volume containers you want to fail over to the virtual device.

- On the **Device** page, select the device that you need to fail over, and then click **Failover** to open the **Device Failover** wizard.

- In **Choose volume container to failover**, select the volume containers you would like to fail over. To be displayed in this list, the volume container must contain a cloud snapshot and be offline. If a volume container that you expected to see is not present, cancel the wizard and verify that it is offline.

- On the next page, in **Choose a target device for the volumes** in the selected containers, select the virtual device from the drop-down list of available devices. Only the devices that have the available capacity are displayed on the list.

- Review all the failover settings on the **Confirm failover** page. If they are correct, click the check icon.

The failover process will begin. When the failover is finished, go to the Devices page and select the virtual device that was used as the target for the failover process. Go to the Volume Containers page. All the volume containers, along with the volumes from the old device should appear.

>[AZURE.NOTE] **The amount of storage supported on the virtual device is 30 TB.**

## Shut down or delete the virtual device

If you previously configured and used a StorSimple virtual device but now want to stop accruing compute charges for its use, you can shut down the virtual device. Shutting down the virtual device doesn’t delete its operating system or data disks in storage. It does stop charges accruing on your subscription, but storage charges for the OS and data disks will continue.

If you delete or shut down the virtual device, it will appear as **Offline** on the Devices page of the StorSimple Manager service. You can choose to deactivate it or delete it as a device if you also wish to delete the backups created by the virtual device. For more information, see [Deactivate](https://msdn.microsoft.com/library/33b7811b-36ba-4609-b165-0796ad456435#BKMK_acis_deactivate).

### To shut down the StorSimple virtual device

1. Sign in to the Management Portal.

2. Click **Virtual Machines**, and then select the virtual device.

3. Click **Shutdown**.

### To delete the StorSimple virtual device

1. Sign in to the Management Portal.

- Click **Virtual Machines**, and then select the virtual device.

- Click **Delete** and choose to delete all the virtual machine disks.