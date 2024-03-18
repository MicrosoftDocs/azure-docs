---
title: Process Aqua satellite data using NASA-provided tools - Azure Orbital
description: An end-to-end walk-through of using the Azure Orbital Ground Station (AOGS) to capture and process Aqua satellite imagery.
ms.service: orbital
author: EliotSeattle
ms.author: eliotgra
ms.topic: tutorial 
ms.date: 07/13/2022
ms.custom: template-overview 
---

# Tutorial: Process Aqua satellite data using NASA-provided tools

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

> [!NOTE]
> NASA has deprecated support of the DRL software used to process Aqua satellite imagery. Please see: [DRL Current Status](https://directreadout.sci.gsfc.nasa.gov/home.html). Steps 2, 3, and 4 of this tutorial are no longer relevant but presented for informational purposes only.

This article is a comprehensive walk-through showing how to use the [Azure Orbital Ground Station (AOGS)](https://azure.microsoft.com/services/orbital/) to capture and process satellite imagery. It introduces the AOGS and its core concepts and shows how to schedule contacts. The article also steps through an example in which we collect and process NASA Aqua satellite data in an Azure virtual machine (VM) using NASA-provided tools.

Aqua is a polar-orbiting spacecraft launched by NASA in 2002. Data from all science instruments aboard Aqua is downlinked to the Earth using direct broadcast over the X-band in near real-time. More information about Aqua can be found on the [Aqua Project Science](https://aqua.nasa.gov/) website. 

Using AOGS, we capture the Aqua broadcast when the satellite is within line of sight of a ground station by scheduling a *contact*. A *contact* is time reserved at a ground station to communicate with a satellite. During the contact, the ground station orients its antenna towards Aqua and captures the direct broadcast data. The captured data is sent to an Azure VM as a data stream and processed using the [Real-Time Software Telemetry Processing System](http://directreadout.sci.gsfc.nasa.gov/index.cfm?section=technology&page=NISGS&subpage=NISFES&sub2page=RT-STPS&sub3Page=overview)(RT-STPS) tool provided by the [Direct Readout Laboratory](http://directreadout.sci.gsfc.nasa.gov/)(DRL) which generates a Level-0 product. This Level-0 product is processed further using DRL's [International Planetary Observation Processing Package](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=68)(IPOPP) tool to produce higher level products.

In this tutorial, we will follow these steps to collect and process Aqua data:

> [!div class="checklist"]
> * [Use AOGS to schedule and contact and collect Aqua data](#step-1-use-aogs-to-schedule-a-contact-and-collect-aqua-data).
> * [Install NASA DRL tools](#step-2-install-nasa-drl-tools).
> * [Create Level-0 product using RT-STPS](#step-3-create-level-0-product-using-rt-stps).
> * [Create higher level products using IPOPP](#step-4-create-higher-level-products-using-ipopp).

Optional setup steps for capturing the ground station telemetry are included the guide on [receiving real-time telemetry from the ground stations](receive-real-time-telemetry.md).

## Step 1: Use AOGS to schedule a contact and collect Aqua data

Execute steps listed in [Tutorial: Downlink data from NASA's Aqua public satellite](downlink-aqua.md) 

The above tutorial provides a walkthrough for scheduling a contact with Aqua and collecting the direct broadcast data on an Azure VM.

> [!NOTE]
> In the section [Prepare a virtual machine (VM) to receive the downlinked AQUA data](downlink-aqua.md#prepare-your-virtual-machine-and-network-to-receive-public-satellite-data), use the following values:
>
>   - **Name:** receiver-vm
>   - **Operating System:** Linux (CentOS Linux 7 or higher)
>   - **Size:** Standard_D8s_v5 or higher
>   - **IP Address:** Ensure that the VM has internet access for downloading tools by having one standard public IP address

> [!TIP]
> The Public IP Address here is only for internet connectivity not Contact Data. For more information, see [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md).

At the end of this step, you should have the raw direct broadcast data saved as ```.bin``` files under the ```~/aquadata``` folder on the ```receiver-vm```. 

## Step 2: Install NASA DRL tools
> [!NOTE]
> Due to potential resource contention, DRL recommends installing RT-STPS and IPOPP on separate machines. But for this tutorial, we install both tools on the ```receiver-vm``` because we don't run them at the same time. For production workloads, please follow sizing and isolation recommendations in the user guides available on the DRL website. 

### Increase OS disk size on the receiver-vm

The default disk space allocated to the OS disk of an Azure VM is not sufficient for installing NASA DRL tools. Follow the steps below to increase the size of the OS disk on the ```receiver-vm``` to 1TB.

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
Using NASA DRL tools requires support for running GUI applications. To enable this, install desktop tools and vncserver on the `receiver-vm`:
```bash
sudo yum install tigervnc-server
sudo yum groups install "GNOME Desktop"
```
Start VNC server:
```bash
vncserver
```
Enter a password when prompted.

### Remotely access the VM Desktop
Port forward the vncserver port (5901) over SSH to your local machine:
```bash
ssh -L 5901:localhost:5901 azureuser@receiver-vm
```
> [!NOTE]
> Use either public IP address of VM DNS name to replace receiver-Vm in this command.

1. On your local machine, download and install [TightVNC Viewer](https://www.tightvnc.com/download.php). 
1. Start the TightVNC Viewer and connect to ```localhost:5901```. 
1. Enter the vncserver password you entered in the previous step. 
1. You should see the GNOME Desktop that is running on the VM in the VNC viewer window.

### Download RT-STPS and IPOPP installation files
From the GNOME Desktop, go to **Applications** > **Internet** > **Firefox** to start a browser. 

Log on to the [NASA DRL](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=325&type=software) website and download the **RT-STPS** installation files and the **IPOPP downloader script** under software downloads. The downloaded files will land under ~/Downloads.

> [!NOTE]
> Use the same machine to download and run
> `downloader_DRL-IPOPP_4.1.sh.`

### Install RT-STPS
```bash
tar -xvzf ~/Downloads/RT-STPS_7.0.tar.gz --directory ~/
tar -xvzf ~/Downloads/RT-STPS_7.0_testdata.tar.gz --directory ~/
cd ~/rt-stps
./install.sh
```
Validate your RT-STPS install by processing the test data supplied with the installation:
```bash
cd ~/rt-stps
./bin/batch.sh config/jpss1.xml ./testdata/input/rt-stps_jpss1_testdata.dat
```
Verify that output files exist in the data folder:
```bash
ls -la ~/data/
```
This completes the RT-STPS installation.

### Install IPOPP
Run the IPOPP downloader script to download the IPOPP installation files. 
```bash
cd ~/Downloads
./downloader_DRL-IPOPP_4.1.sh
tar -xvzf ~/Downloads/DRL-IPOPP_4.1.tar.gz --directory ~/
cd ~/IPOPP
./install_ipopp.sh
```

### Configure and start IPOPP services
IPOPP services are configured using its Dashboard GUI.

[Go to the VM Desktop](#remotely-access-the-vm-desktop) and start a new terminal under **Applications** > **Utilities** > **Terminal** 

Start the IPOPP dashboard from the terminal:
```bash
~/drl/tools/dashboard.sh
```
IPOPP starts in the process monitoring mode. Switch to **Configuration Mode** by the using the menu option. 

Enable the following under the **EOS** tab:
* gbad
* MODISL1DB l0l1aqua 
* MODISL1DB l1atob 
* IMAPP

Switch back to **Process Monitoring** mode using the menu option. 

Start IPOPP services:
```bash
~/drl/tools/services.sh start
~/drl/tools/services.sh status
```
This completes the IPOPP installation and configuration.

## Step 3: Create Level-0 product using RT-STPS

Run rt-stps in batch mode to process the ```.bin``` file collected in Step 1
```bash
cd ~/rt-stps
./bin/batch.sh ./config/aqua.xml ~/aquadata/raw-2022-05-29T0957-0700.bin
```
This command produces Level-0 Production Data Set (```.pds```) files under the ```~/rt-stps/data``` directory.

## Step 4: Create higher level products using IPOPP

## Ingest data for processing

Copy the PDS files generated by RT-STPS in the previous step to the IPOPP ingest directory for further processing.

```bash
cp ~/rt-stps/data/* ~/drl/data/dsm/ingest/.
```
Run IPOPP ingest to create the products configured in the dashboard. 
```bash
~/drl/tools/ingest_ipopp.sh
```
You can watch the progress in the dashboard.
```bash
~/drl/tools/dashboard.sh
```
IPOPP will produce output products in the following directory:
```bash
cd ~/drl/data/pub/gsfcdata/aqua/modis/
```

## Next steps

To easily deploy downstream components necessary to receive and process spaceborne earth observation data using Azure Orbital Ground Station, see:
- [Azure Orbital Integration](https://github.com/Azure/azure-orbital-integration)

For an end-to-end implementation that involves extracting, loading, transforming, and analyzing spaceborne data by using geospatial libraries and AI models with Azure Synapse Analytics, see: 

- [Spaceborne data analysis with Azure Synapse Analytics](/azure/architecture/industries/aerospace/geospatial-processing-analytics)

