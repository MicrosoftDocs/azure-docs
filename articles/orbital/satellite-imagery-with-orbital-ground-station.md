---
title: Collect and process Aqua satellite data - Azure Orbital
description: An end-to-end walk-through of using the Azure Orbital Ground Station (AOGS) to capture and process Aqua satellite imagery.
ms.service: orbital
author: EliotSeattle
ms.author: eliotgra
ms.topic: tutorial 
ms.date: 07/13/2022
ms.custom: template-overview 
---

# Tutorial: Collect and process Aqua satellite data using Azure Orbital Ground Station (AOGS)

This article is a comprehensive walk-through showing how to use the [Azure Orbital Ground Station (AOGS)](https://azure.microsoft.com/services/orbital/) to capture and process satellite imagery. It introduces the AOGS and its core concepts and shows how to schedule contacts. The article also steps through an example in which we collect and process NASA Aqua satellite data in an Azure virtual machine (VM) using NASA-provided tools.

Aqua is a polar-orbiting spacecraft launched by NASA in 2002. Data from all science instruments aboard Aqua is downlinked to the Earth using direct broadcast over the X-band in near real-time. More information about Aqua can be found on the [Aqua Project Science](https://aqua.nasa.gov/) website. 

Using AOGS, we capture the Aqua broadcast when the satellite is within line of sight of a ground station by scheduling a *contact*. A *contact* is time reserved at a ground station to communicate with a satellite. During the contact, the ground station orients its antenna towards Aqua and captures the direct broadcast data. The captured data is sent to an Azure VM as a data stream and processed using the [Real-Time Software Telemetry Processing System](http://directreadout.sci.gsfc.nasa.gov/index.cfm?section=technology&page=NISGS&subpage=NISFES&sub2page=RT-STPS&sub3Page=overview)(RT-STPS) tool provided by the [Direct Readout Laboratory](http://directreadout.sci.gsfc.nasa.gov/)(DRL) which generates a Level-0 product. This Level-0 product is processed further using DRL's [International Planetary Observation Processing Package](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=68)(IPOPP) tool to produce higher level products.

In this tutorial, we will follow these steps to collect and process Aqua data:

> [!div class="checklist"]
> * [Schedule a contact and collect Aqua direct broadcast data using AOGS](#step-1-schedule-a-contact-and-collect-aqua-direct-broadcast-data-using-aogs).
> * [Process Aqua direct broadcast data using RT-STPS](#step-2-process-aqua-direct-broadcast-data-using-rt-stps).
> * [Create higher level products using IPOPP](#step-3-create-higher-level-products-using-ipopp).

Optional setup steps for capturing the ground station telemetry are included the guide on [receiving real-time telemetry from the ground stations](receive-real-time-telemetry.md).

## Step 1: Schedule a contact and collect Aqua direct broadcast data using AOGS

Follow the steps listed in [Tutorial: Downlink data from NASA's AQUA public satellite](downlink-aqua.md) to schedule a contact with Aqua using AOGS and collect the direct broadcast data on an Azure VM for further processing. 

> [!NOTE]
> In the section [Prepare a virtual machine (VM) to receive the downlinked AQUA data](downlink-aqua.md#prepare-your-virtual-machine-vm-and-network-to-receive-aqua-data), use the following values:
>
>   - **Name:** receiver-vm
>   - **Operating System:** Linux (CentOS Linux 7 or higher)
>   - **Size:** Standard_D8s_v5 or higher
>   - **IP Address:** Ensure that the VM has at least one standard public IP address

At the end of this step, you should have the raw direct broadcast saved as ```.bin``` files under the ```~/aquadata``` folder on the receiver-vm. 

## Step 2: Process Aqua direct broadcast data using RT-STPS

The [Real-time Software Telemetry Processing System](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=69)(RT-STPS) is a NASA-provided software for processing Aqua direct broadcast data. The steps below cover installation of RT-STPS Verson 6.0 on the receiver-vm, and production of Level-0 Production Data Set(PDS) files from the data collected in the previous step. 

Register with the [NASA DRL](https://directreadout.sci.gsfc.nasa.gov/) to download the RT-STPS installation package.

Transfer the installation binaries to the receiver-vm:

```console
ssh azureuser@receiver-vm 'mkdir -p ~/software'
scp RT-STPS_6.0*.tar.gz azureuser@receiver-vm:~/software/.
```

Alternatively, you can upload your installation binaries to a container in Azure Storage and download them to the receiver-vm using [AzCopy](../storage/common/storage-use-azcopy-v10.md)

### Install rt-stps

```console
sudo yum install java-11-openjdk
cd ~/software
tar -xzvf RT-STPS_6.0.tar.gz
cd ./rt-stps
./install.sh
```

### Install rt-stps patches

```console
cd ~/software
tar -xzvf RT-STPS_6.0_PATCH_1.tar.gz
tar -xzvf RT-STPS_6.0_PATCH_2.tar.gz
tar -xzvf RT-STPS_6.0_PATCH_3.tar.gz
cd ./rt-stps
./install.sh
```

### Validate install

```console
cd ~/software
tar -xzvf RT-STPS_6.0_testdata.tar.gz
cd ~/software/rt-stps
rm ./data/*
./bin/batch.sh config/npp.xml ./testdata/input/rt-stps_npp_testdata.dat
# Verify that files exist
ls -la ./data
```

### Create Level-0 product

Run rt-stps in batch mode to process the ```.bin``` file collected in Step 1

```console
cd ~/software/rt-stps
./bin/batch.sh ./config/aqua.xml ~/aquadata/raw-2022-05-29T0957-0700.bin
```

This command produces Level-0 Production Data Set (```.pds```) files under the ```~/software/rt-stps/data``` directory.

## Step 3: Create higher level products using IPOPP

[International Planetary Observation Processing Package (IPOPP)](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=68) is another NASA-provided software to process Aqua Level-0 data into higher level products.
In the steps below, you'll process the Level-0 data generated in the previous step using IPOPP.

> [!NOTE]
> Due to potential resource contention, DRL recommends installing RT-STPS and IPOPP on separate machines. But for this tutorial, we install both on the our receiver-vm because we don't run them at the same time. For production workloads, please follow sizing and isolation recommendations in the user guides available on the DRL website. 

### Increase OS disk size on the receiver-vm

IPOPP installation and subsequent generation of products requires more disk space than what is available on an Azure VM by default. 

Follow the steps below to increase the size of the OS disk on the ```receiver-vm``` to 1TB.

### [Portal](#tab/portal2)

1. Open the [portal](https://portal.azure.com).
1. Navigate to your virtual machine.
1. On the **Overview** page, select **Stop**. 
1. On the **Disks** page, select the OS disk. 
1. On the **Disk** pane, navigate to **Size + performance** page. 
1. Select **Premium SSD(locally redundant storage)** from the **Disk SKU** dropdown. 
1. Select the **P30** Disk Tier (1024GB).
1. Select **Save**.  
1. Navigate back to **Virtual Machine** pane.
1. On the **Overview** page, select **Start** 
---
On the receiver-vm, verify that the root partition now has 1TB available

```bash
lsblk -o NAME,HCTL,SIZE,MOUNTPOINT
```
This should show ~1TB allocated to the root ```/``` mountpoint.

```console
NAME    HCTL        SIZE MOUNTPOINT
sda     0:0:0:0       1T 
├─sda1              500M /boot
├─sda2             1023G /
├─sda14               4M 
└─sda15             495M /boot/efi
```

### Install Desktop and VNC Server

IPOPP installation requires using a browser to sign on to the DRL website to download the installation script. This script must be run from the same host that it was downloaded to. The subsequent IPOPP configuration also requires a GUI. Therefore, we install a full desktop and a vnc server to enable running GUI applications on the receiver-vm.

```bash
sudo yum install tigervnc-server
sudo yum groups install "GNOME Desktop"
```

Start VNC server:

```bash
vncsever
```
Enter a password when prompted. 

Port forward the vncserver port (5901) over ssh:

```bash
ssh -L 5901:localhost:5901 azureuser@receiver-vm
```

Download the [TightVNC](https://www.tightvnc.com/download.php) viewer and connect to ```localhost:5901``` and enter the vncserver password entered in the previous step.  You should see the GNOME desktop running on the VM. 

Start a new terminal, and start the Firefox browser

```bash
firefox
```

[Log on the DRL website](https://directreadout.sci.gsfc.nasa.gov/loginDRL.cfm?cid=320&type=software) and download the downloader script.

```bash
cd ~/Downloads
./downloader_DRL-IPOPP_4.1.sh
```

This script will download \~35G and will take 1 hour or more.

Alternatively, you can upload your installation binaries to a container in Azure Storage and download them to the receiver-vm using [AzCopy](../storage/common/storage-use-azcopy-v10.md)

### Install IPOPP

```bash
cd ~/Downloads
tar -xvzf DRL-IPOPP_4.1.tar.gz --directory ~/
cd ~/IPOPP
./install_ipopp.sh
```

### Start IPOPP services

```bash
cd ~/drl/tools
./services.sh start
```
### Verify service status

```bash
cd ~/drl/tools
./services.sh status
```

### Configure IPOPP services using its dashboard

The above steps start IPOPP services with the default configuration. IPOPP services must be configured using the dashboard GUI. 

To start the dashboard, first port forward the vncserver port (5901) over ssh:

```bash
ssh -L 5901:localhost:5901 azureuser@receiver-vm
```

Using the TightVNC client, connect to localhost:5901 and enter the vncserver password that you previously set. 

On the virtual machine desktop, open a new terminal and start the dashboard:

```bash
cd ~/drl/tools
./dashboard.sh
```
Configure services:

1. IPOPP dashboard starts in process monitoring mode. Switch to **Configuration Mode** by using the menu option. 

1. Aqua related products can be configured from **EOS** tab in configuration mode. Disable all other tabs. We're interested in the MODIS Aerosol L2 (MOD04) product, which is produced by IMAPP SPA. Therefore, enable the following in the **EOS** tab: 

    - gbad 

    - MODISL1DB l0l1aqua 

    - MODISL1DB l1atob 

    - IMAPP 

1. After updating the configuration, switch back to **Process Monitoring** mode using the menu. All tiles will be in OFF mode initially. 

1. When prompted, save changes to the configuration.  

1. Click **Start Services** in the action menu. Note that **Start Services** is only enabled in process monitoring mode.  

1. Click **Check IPOPP Services** in action menu to validate.

## Ingest data for processing

Copy the PDS files generated by RT-STPS to the IPOPP ingest directory for further processing.

```console
cp ~/software/rt-stps/data/* ~/drl/data/dsm/ingest/.
```

Run IPOPP ingest to create the products configured in the dashboard. 

```
~/drl/tools/ingest_ipopp.sh
```

You can watch the progress in the dashboard.

```
~/drl/tools/dashboard.sh
```

IPOPP will produce output products in the following directory:

```
cd ~/drl/data/pub/gsfcdata/aqua/modis/
```

## Next steps

For an end-to-end implementation that involves extracting, loading, transforming, and analyzing spaceborne data by using geospatial libraries and AI models with Azure Synapse Analytics, see: 

- [Spaceborne data analysis with Azure Synapse Analytics](/azure/architecture/industries/aerospace/geospatial-processing-analytics)

