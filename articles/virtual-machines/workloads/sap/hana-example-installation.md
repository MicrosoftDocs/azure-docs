---
title: How to install HANA on SAP HANA on Azure (Large Instances) | Microsoft Docs
description: How to install HANA on SAP HANA on Azure (Large Instance).
services: virtual-machines-linux
documentationcenter: 
author: hermanndms
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# Example of an SAP HANA installation on HANA Large Instances

This section illustrates how to install SAP HANA on a HANA Large Instance unit. The start state we have look  like:

- You provided Microsoft all the data to deploy you an SAP HANA Large Instance.
- You received the SAP HANA Large Instance from Microsoft.
- You created an Azure VNet that is connected to your on-premises network.
- You connected the ExpressRotue circuit for HANA Large Instances to the same Azure VNet.
- You installed an Azure VM you use as a jump box for HANA Large Instances.
- You made sure that you can connect from the jump box to your HANA Large Instance unit and vice versa.
- You checked whether all the necessary packages and patches are installed.
- You read the SAP notes and documentations regarding HANA installation on the OS you are using and made sure that the HANA release of choice is supported on the OS release.

What is shown in the next sequences is the download of the HANA installation packages to the jump box VM, in this case running on a Windows OS, the copy of the packages to the HANA Large Instance unit and the sequence of the setup.

## Download of the SAP HANA installation bits
Since the HANA Large Instance units don't have direct connectivity to the internet, you can't directly download the installation packages from SAP to the HANA Large Instance VM. To overcome the missing direct internet connectivity, you need the jump box. You download the packages to the jump box VM.

In order to download the HANA installation packages, you need an SAP S-user or other user, which allows you to access the SAP Marketplace. Go through this sequence of screens after logging in:

Go to [SAP Service Marketplace](https://support.sap.com/en/index.html) > Click Download Software > Installations and Upgrade >By Alphabetical Index >Under H – SAP HANA Platform Edition > SAP HANA Platform Edition 2.0 > Installation > Download the following files

![Download HANA installation](./media/hana-installation/image16_download_hana.PNG)

In the demonstration case, we downloaded SAP HANA 2.0 installation packages. On the Azure jump box VM, you expand the self-extracting archives into the directory as shown below.

![Extract HANA installation](./media/hana-installation/image17_extract_hana.PNG)

As the archives are extracted, copy the directory created by the extraction, in the case above 51052030, to the HANA Large instance unit into the /hana/shared volume into a directory you created.

> [!Important]
> Do Not copy the installation packages into the root or boot LUN since space is limited and needs to be used by other processes as well.


## Install SAP HANA on the HANA Large Instance unit
In order to install SAP HANA, you need to log in as user root. Only root has enough permissions to install SAP HANA.
The first thing you need to do is to set permissions on the directory you copied over into /hana/shared. The permissions need to set like

```
chmod –R 744 <Installation bits folder>
```

If you want to install SAP HANA using the graphical setup, the gtk2 package needs to be installed on the HANA Large Instances. Check whether it is installed with the command

```
rpm –qa | grep gtk2
```

In further steps, we are demonstrating the SAP HANA setup with the graphical user interface. As next step, go into the installation directory and navigate into the sub directory HDB_LCM_LINUX_X86_64. Start

```
./hdblcmgui 
```
out of that directory. Now you are getting guided through a sequence of screens where you need to provide the data for the installation. In the case demonstrated, we are installing the SAP HANA database server and the SAP HANA client components. Therefore our selection is 'SAP HANA Database' as shown below

![Select HANA in installation](./media/hana-installation/image18_hana_selection.PNG)

In the next screen, you choose the option 'Install New System'

![Select HANA new installation](./media/hana-installation/image19_select_new.PNG)

After this step, you need to select between several additional components that can be installed additionally to the SAP HANA database server.

![Select additional HANA components](./media/hana-installation/image20_select_components.PNG)

For the purpose of this documentation, we chose the SAP HANA Client and the SAP HANA Studio. We also installed a scale-up instance. hence in the next screen, you need to choose 'Single-Host System' 

![Select scale-up installation](./media/hana-installation/image21_single_host.PNG)

In the next screen, you need to provide some data

![Provide SAP HANA SID](./media/hana-installation/image22_provide_sid.PNG)

> [!Important]
> As HANA System ID (SID), you need to provide the same SID, as you provided Microsoft when you ordered the HANA Large Instance deployment. Choosing a different SID makes the installation fail due to access permission problems on the different volumes

As installation directory you use the /hana/shared directory. In the next step, you need to provide the locations for the HANA data files and the HANA log files


![Provide HANA Log location](./media/hana-installation/image23_provide_log.PNG)

> [!Note]
> You should define as data and log files the volumes that came already with the mount points that contain the SID you chose in the screen selection before this screen. If the SID does mismatch with the one you typed in, in the screen before, go back and adjust the SID to the value you have on the mount points.

In the next step, review the host name and eventually correct it. 

![Review host name](./media/hana-installation/image24_review_host_name.PNG)

In the next step, you also need to retrieve data you gave to Microsoft when you ordered the HANA Large Instance deployment. 

![Provide system user UID and GID](./media/hana-installation/image25_provide_guid.PNG)

> [!Important]
> You need to provide the same System User ID and ID of User Group as you provided Microsoft as you order the unit deployment. If you fail to give the very same IDs, the installation of SAP HANA on the HANA Large Instance unit fails.

In the next two screens, which we are not showing in this documentation, you need to provide the password for the SYSTEM user of the SAP HANA database and the password for the sapadm user, which is used for the SAP Host Agent that gets installed as part of the SAP HANA database instance.

After defining the password, a confirmation screen is showing up. check all the data listed and continue with the installation. You reach a progress screen that documents the installation progress, like the one below

![Check installation progress](./media/hana-installation/image27_show_progress.PNG)

As the installation finishes, you should a picture like the following one

![Installation is finished](./media/hana-installation/image28_install_finished.PNG)

At this point, the SAP HANA instance should be up and running and ready for usage. You should be able to connect to it from SAP HANA Studio. Also make sure that you check for the latest patches of SAP HANA and apply those patches.


**Next steps**

- Refer [SAP HANA Large Instances high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md).

