---
title: Collect and process Aqua satellite payload - Azure Orbital
description: An end-to-end walk-through of using the Azure Orbital Ground Station (AOGS) to capture and process satellite imagery.
ms.service: orbital
author: EliotSeattle
ms.author: eliotgra
ms.topic: tutorial 
ms.date: 07/13/2022
ms.custom: template-overview 
---

# Tutorial: Collect and process Aqua satellite payload using Azure Orbital Ground Station (AOGS)

This article is a comprehensive walk-through showing how to use the [Azure Orbital Ground Station (AOGS)](https://azure.microsoft.com/services/orbital/) to capture and process satellite imagery. It introduces the AOGS and its core concepts and shows how to schedule contacts. The article also steps through an example in which we collect and process NASA Aqua satellite data in an Azure virtual machine (VM) using NASA-provided tools.

Aqua is a polar-orbiting spacecraft launched by NASA in 2002. Data from all science instruments aboard Aqua is downlinked to the Earth using direct broadcast over the X-band in near real-time. More information about Aqua can be found on the [Aqua Project Science](https://aqua.nasa.gov/) website. With AOGS, we can capture the Aqua broadcast when the satellite is within line of sight of a ground station.

A *contact* is time reserved at an orbital ground station to communicate with a satellite. During the contact, the ground station orients its antenna towards Aqua and captures the broadcast payload. The captured data is sent to an Azure VM as a data stream that is processed using the [RT-STPS](http://directreadout.sci.gsfc.nasa.gov/index.cfm?section=technology&page=NISGS&subpage=NISFES&sub2page=RT-STPS&sub3Page=overview) (Real-Time Software Telemetry Processing System) provided by [Direct Readout Laboratory](http://directreadout.sci.gsfc.nasa.gov/) at NASA to generate a level 0 product. Further processing of level 0 data is done using IPOPP (International Planetary Observation Processing Package) tool, also provided by DRL.

In this tutorial, you'll follow these steps to process the Aqua data stream:

> [!div class="checklist"]
> * [Prerequisites](#step-1-prerequisites).
> * [Process RAW data using RT-STPS](#step-2-process-raw-data-using-rt-stps).
> * [Prepare a virtual machine (processor-vm) to process higher level products](#step-3-prepare-a-virtual-machine-processor-vm-to-create-higher-level-products).
> * [Create higher level products using IPOPP](#step-4-create-higher-level-products-using-ipopp).

Optional setup steps for capturing the ground station telemetry are included in the [Appendix](#appendix).

## Step 1: Prerequisites

You must first follow the steps listed in [Tutorial: Downlink data from NASA's AQUA public satellite](downlink-aqua.md). 

> [!NOTE]
> In the section [Prepare a virtual machine (VM) to receive the downlinked AQUA data](downlink-aqua.md#prepare-your-virtual-machine-vm-and-network-to-receive-aqua-data), use the following values:
>
>   - **Name:** receiver-vm
>   - **Operating System:** Linux (CentOS Linux 7 or higher)
>   - **Size:** Standard_D8_v5 or higher
>   - **IP Address:** Ensure that the VM has at least one standard public IP address

## Step 2: Process RAW data using RT-STPS

The [Real-time Software Telemetry Processing System (RT-STPS)](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=69) is NASA-provided software for processing the raw Aqua payload. The steps below cover installation of RT-STPS on the receiver-vm, and production of level-0 PDS files for the Aqua payload captured in the previous step. 

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

### Process RAW Aqua data

Run rt-stps in batch mode to process the previously captured Aqua data (.bin files).

```console
cd ~/software/rt-stps
./bin/batch.sh ./config/aqua.xml ~/aquadata/raw-2022-05-29T0957-0700.bin
```

That command creates level-0 product (.PDS files) in the ```~/software/rt-stps/data``` directory.
[AzCopy](../storage/common/storage-use-azcopy-v10.md) the level-0 files to a storage container:

```console
azcopy sync ~/software/rt-stps/data/ "https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]"
```

Download the level-0 PDS files from this storage container for further processing in later steps. 

## Step 3: Prepare a virtual machine (processor-vm) to create higher level products

[International Planetary Observation Processing Package (IPOPP)](https://directreadout.sci.gsfc.nasa.gov/?id=dspContent&cid=68) is another NASA-provided software to process Aqua Level-0 data into higher level products.
In the steps below, you'll process the Aqua PDS files downloaded from the Azure Storage container in the previous step. 
Because IPOPP has higher system requirements than RT-STPS, it should be run on a bigger VM called the "processor-vm".

[Create a virtual machine(VM)](../virtual-machines/linux/quick-create-portal.md) within the virtual network above. Ensure that this VM has the following specifications:

-  **Name:** processor-vm
-  **Size:** Standard D16ds v5
-  **Operating System:** Linux (CentOS Linux 7 or higher)
-  **Disk:** 2 TB Premium SSD data disk

Create a file system on the data disk:

```console
sudo fdisk /dev/sdc
sudo mkfs -t ext4 /dev/sdc1
sudo mount /dev/sdc1 /datadrive
```

IPOPP installation requires using a browser to sign on to the DRL website to download the installation script. This script must be run from the same host that it was downloaded to. IPOPP configuration also requires a GUI. Therefore, we install a full desktop and a vnc server to enable running GUI applications.

### Install Desktop and VNC Server

```console
sudo yum install tigervnc-server
sudo yum groups install "GNOME Desktop"
```

Start VNC server:

```console
vncsever
```
Enter a password when prompted. 

Port forward the vncserver port (5901) over ssh:

```console
ssh -L 5901:localhost:5901 azureuser@processor-vm
```

Download the [TightVNC](https://www.tightvnc.com/download.php) viewer and connect to ```localhost:5901``` and enter the vncserver password entered in the previous step.  You should see the GNOME desktop running on the VM. 

Start a new terminal, and start the Firefox browser

```console
firefox
```

[Log on the DRL website](https://directreadout.sci.gsfc.nasa.gov/loginDRL.cfm?cid=320&type=software) and download the downloader script.

Run the downloader script from the ```/datadrive/ipopp``` directory because
the home directory isn't large enough to hold the downloaded content.

```console
INSTALL_DIR=/datadrive/ipopp
cp ~/Downloads/downloader_DRL-IPOPP_4.1.sh $INSTALL_DIR
cd $INSTALL_DIR
./downloader_DRL-IPOPP_4.1.sh
```

This script will download \~35G and will take 1 hour or more.

### Install IPOPP

```console
tar --C $INSTALL_DIR -xzf DRL-IPOPP_4.1.tar.gz
chmod -R 755 $INSTALL_DIR/IPOPP
$INSTALL_DIR/IPOPP/install_ipopp.sh -installdir $INSTALL_DIR/drl -datadir $INSTALL_DIR/data -ingestdir $INSTALL_DIR/data/ingest
```

### Install patches

```console
$INSTALL_DIR/drl/tools/install_patch.sh $PATCH_FILE_NAME
```
### Start IPOPP services

```console
$INSTALL_DIR/drl/tools/services.sh start
```
### Verify service status

```
$INSTALL_DIR/drl/tools/services.sh status
$INSTALL_DIR/drl/tools/spa_services.sh status
```

## Step 4: Create higher level products using IPOPP

Before we can create level-1 and level-2 products from the PDS files, we need to configure IPOPP. 

### Configure the IPOPP service using the dashboard

IPOPP must be configured with the dashboard GUI. To start the dashboard, first port forward the vncserver port (5901) over ssh:

```console
ssh -L 5901:localhost:5901 azureuser@processor-vm
```

Using the TightVNC client, connect to localhost:5901 and enter the vncserver password. On the virtual machine desktop, open a new terminal and start the dashboard:

```console
cd /datadrive/ipopp
./drl/tools/dashboard.sh & 
```

1. IPOPP Dashboard starts in process monitoring mode. Switch to **Configuration Mode** by using the menu option. 

2. Aqua related products can be configured from EOS tab in configuration mode. Disable all other tabs. We're interested in the MODIS Aerosol L2 (MOD04) product, which is produced by IMAPP SPA. Therefore, enable the following in the **EOS** tab: 

    - gbad 

    - MODISL1DB l0l1aqua 

    - MODISL1DB l1atob 

    - IMAPP 

3. After updating the configuration, switch back to **Process Monitoring** mode using the menu. All tiles will be in OFF mode initially. 

4. When prompted, save changes to the configuration.  

5. Click **Start Services** in the action menu. Note that **Start Services** is only enabled in process monitoring mode.  

6. Click **Check IPOPP Services** in action menu to validate.

## Ingest data for processing

Download the PDS files generated by the RT-STPS tool from your storage container to the IPOPP ingest directory configured during installation.

```console
azcopy cp
"https://[account].blob.core.windows.net/[container]/[path/to/directory]?[SAS]"
"/datadrive/ipopp/drl/data/dsm/ingest" --recursive=true
```

Run the IPOPP ingest to create the products configured in the dashboard. 

```
/datadrive/ipopp/drl/tools/ingest_ipopp.sh
```

You can watch the progress in the dashboard.

```
/datadrive/ipopp/drl/tools/dashboard.sh
```

IPOPP will produce output products in the following directories:

```
/datadrive/ipopp/drl/data/pub/gsfcdata/aqua/modis/level[0,1,2] 
```

## Appendix

### Capture ground station telemetry

Follow steps here to [receive real-time telemetry from the ground stations](receive-real-time-telemetry.md).

## Next steps

For an end-to-end implementation that involves extracting, loading, transforming, and analyzing spaceborne data by using geospatial libraries and AI models with Azure Synapse Analytics, see: 

- [Spaceborne data analysis with Azure Synapse Analytics](/azure/architecture/industries/aerospace/geospatial-processing-analytics)

