---
title: Collector appliance in Azure Migrate | Microsoft Docs
description: Provides an overview of the Collector appliance and how to configure it.
author: ruturaj
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 09/10/2018
ms.author: ruturajd
services: azure-migrate
---

# Collector appliance

[Azure Migrate](migrate-overview.md) assesses on-premises workloads for migration to Azure. This article provides information about how to use the Collector appliance.

## Overview

An Azure Migrate Collector is a lightweight appliance that can be used to discover your on-premises vCenter environment. This appliance discovers on-premises VMware machines, and sends metadata about them to the Azure Migrate service.

The Collector appliance is an OVF that you can download from the Azure Migrate project. It instantiates a VMware virtual machine with 4 cores, 8 GB RAM, and one disk of 80 GB. The Operating system of the appliance is Windows Server 2012 R2 (64 bit).

You can create the Collector by following the steps here - [How to create the Collector VM](tutorial-assessment-vmware.md#create-the-collector-vm).

## Discovery methods

There are two methods in which you discover your on-premises environment:

a. **One-time discovery:** The collector for this model, communicates with vCenter Server to gather metadata about the VMs. For performance data collection of the VMs, it relies on the historical performance data stored in vCenter Server and collects the performance history of last one month. In this model, Azure Migrate collects average counter (vs. peak counter) for each metric, [learn more] (https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about the performance counters collected by Azure Migrate. Since it is a one-time discovery, the appliance in this case is not continuously connected to the project. Hence, changes in the on-premises environment are not reflected in Azure Migrate once the discovery is complete. If you want the changes to reflect, you have to do a rediscovery of the same environment to the same project.

b. **Continuous discovery:** The collector appliance for this model is continuously connected to the Azure Migrate project. It continuously profiles the on-premises environment to gather real-time utilization data at every 20 seconds. The appliance then rolls-up the 20-second samples and creates a single data point for every 15 minutes by picking the maximum value, which is sent to Azure. This model does not depend on the statistics settings of vCenter Server for performance data collection. You can stop the continuous profiling anytime from the appliance.

> [!NOTE]
> The continuous discovery functionality is in preview.

## Collector communication diagram

![Collector communication diagram](./media/tutorial-assessment-vmware/portdiagram.PNG)


| Component      | To communicate with   | Port required                            | Reason                                   |
| -------------- | --------------------- | ---------------------------------------- | ---------------------------------------- |
| Collector      | Azure Migrate service | TCP 443                                  | Collector should be able to communicate with the service over the SSL port 443 |
| Collector      | vCenter Server        | Default 443                             | Collector should be able to communicate with the vCenter server. It connects to vCenter on 443 by default. If the vCenter listens on a different port, that port should be available as outgoing port on the collector |
| Collector		 | RDP|   | TCP 3389 | For you to be able to RDP into the Collector machine |

## Collector pre-requisites

The Collector needs to pass a few pre-requisite checks to ensure it can connect to the Azure Migrate service and upload the discovered data. This article looks at each of the prerequisites and understands why it is required.

### Internet connectivity

The collector appliance needs to be connected to the internet to send the discovered machines information. You can connect the machine to the internet in one of the two following ways.

1. You can configure the Collector to have direct internet connectivity.
2. You can configure the Collector to connect via a proxy server.
	* If the proxy server requires authentication, you can specify the username and password in the connection settings.
	* The IP address/FQDN of the Proxy server should be of the form http://IPaddress or http://FQDN. Only http proxy is supported.

> [!NOTE]
> HTTPS-based proxy servers are not supported by the collector.

#### Internet connectivity with intercepting proxy

If the proxy server you use to connect to the internet is an intercepting proxy, you are required to import the proxy certificate into your collector VM. Following are steps on how you can import the certificate into the collector VM.

1. In the collector VM, go to **Start Menu** and find and open **Manage computer certificates**.
2. In the Certificates tool, on the left pane, under **Certificates - Local Computer**, find **Trusted Publishers**. Under **Trusted Publishers**, click **Certificates** to see the list of certificates in the pane on the right.

    ![Certificates tool](./media/concepts-intercepting-proxy/certificates-tool.png)

3. Copy your proxy certificate on to the collector VM. You may have to reach out to the network administrator team in your organization to obtain this certificate.
4. Double-click on the certificate to open it. Click **Install Certificate**. This will take you to the Certificate Import wizard.
5. On the Certificate Import Wizard, for Store Location, choose **Local Machine**. **Click Next**.

    ![Certificate store location](./media/concepts-intercepting-proxy/certificate-store-location.png)

6. Choose the option to **Place all certificates in the following store**. Click **Browse** and select **Trusted Publishers** from the list of certificates that come up. Click **Next**.

    ![Certificates store](./media/concepts-intercepting-proxy/certificate-store.png)

7. Click **Finish**. This will import the certificate.
8. Optionally, you can verify the certificate is imported by opening the Certificates tool as in step 1 and 2 above.
9. On the Azure Migrate collector app, verify the internet connectivity prerequisite check is successful.


#### Whitelisting URLs for internet connection

The pre-requisite check is successful if the Collector can connect to the internet via the provided settings. The connectivity check is validated by connecting to a list of URLs as given in the following table. If you are using any URL-based firewall proxy to control outbound connectivity, be sure to whitelist these required URLs:

**URL** | **Purpose**  
--- | ---
*.portal.azure.com | Required to check connectivity with the Azure service and validate time synchronization issues.

Additionally, the check also tries to validate connectivity to the following URLs but does not fail the check if not accessible. Configuring whitelist for the following URLs is optional, but you need to take manual steps to mitigate the pre-requisite check.

**URL** | **Purpose**  | **What if you don't whitelist**
--- | --- | ---
*.oneget.org:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.windows.net:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.windowsazure.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.powershellgallery.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.msecnd.net:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.visualstudio.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.

### Time is in sync with the internet server

The Collector should be in sync with the internet time server to ensure the requests to the service are authenticated. The portal.azure.com url should be reachable from the Collector so that the time can be validated. If the machine is out of sync, you need to change the clock time on the Collector VM to match the current time, as follows:

1. Open an admin command prompt on the VM.
1. To check the time zone, run w32tm /tz.
1. To synchronize the time, run w32tm /resync.

### Collector service should be running

The Azure Migrate Collector service should be running on the machine. This service is started automatically when the machine boots. If the service is not running, you can start the *Azure Migrate Collector* service via control panel. The Collector service is responsible to connect to the vCenter server, collect the machine metadata and performance data, and send it to the service.

### VMware PowerCLI 6.5

The VMware PowerCLI powershell module needs to be installed so that the Collector can communicate with the vCenter server and query for the machine details and their performance data. The powershell module is automatically downloaded and installed as part of the pre-requisite check. Automatic download requires a few URLs whitelisted, failing which you need either provide access by whitelisting them, or installing the module manually.

Install the module manually using the following steps:

1. To install the PowerCli on Collector without internet connection, follow the steps given in [this link](https://blogs.vmware.com/PowerCLI/2017/04/powercli-install-process-powershell-gallery.html) .
2. Once you have installed the PowerShell module on a different computer, which has internet access, copy the files VMware.* from that machine to the Collector machine.
3. Restart the prerequisite checks and confirm that PowerCLI is installed.

## Connecting to vCenter Server

The Collector should connect to the vCenter Server and be able to query for the virtual machines, their metadata, and their performance counters. This data is used by the project to calculate an assessment.

1. To connect to the vCenter Server, a read-only account with permissions as given in the following table can be used to run the discovery.

    |Task  |Required role/account  |Permissions  |
    |---------|---------|---------|
    |Collector appliance-based discovery    | You need at least a read-only user        |Data Center object –> Propagate to Child Object, role=Read-only         |

2. Only those datacenters that are accessible to the vCenter account specified can be accessed for discovery.
3. You need to specify the vCenter FQDN/IP address to connect to the vCenter server. By default, it will connect over the port 443. If you have configured the vCenter to listen on a different port number, you can specify it as part of the server address in the form  IPAddress:Port_Number or FQDN:Port_Number.
4. The statistics settings for vCenter Server should be set to level 3 before you start deployment. If the level is lower than 3, the discovery will complete, but performance data for storage and network won't be collected. The assessment size recommendations in this case will be based on performance data for CPU and memory, and only configuration data for disk and network adapters. [Read more](./concepts-collector.md) on what data is collected and how it impacts the assessment.
5. The Collector should have a network line of sight to the vCenter server.

> [!NOTE]
> Only vCenter Server versions 5.5, 6.0 and 6.5 are officially supported.

> [!IMPORTANT]
> We recommend that you set the highest common level (3) for the statistics level so that all the counters are collected correctly. If you have vCenter set at a lower level, only a few counters might be collected completely, with the rest set to 0. The assessment might then show incomplete data.

### Selecting the scope for discovery

Once connected to the vCenter, you can select a scope to discover. Selecting a scope discovers all the virtual machines from the specified vCenter inventory path.

1. The scope can be either a datacenter, a folder, or a ESXi host.
2. You can only select one scope at a time. To select more virtual machines, you can complete one discovery, and restart the discovery process with a new scope.
3. You can only select a scope that has *less than 1500 virtual machines*.

## Specify migration project

Once the on-premises vCenter is connected, and a scope is specified, you can now specify the migration project details that need to be used for discovery and assessment. Specify the project ID and Key and connect.

## Start discovery and view collection progress

Once the discovery starts, the vCenter virtual machines are discovered, and their metadata and performance data is sent to the server. The progress status also informs you of the following IDs:

1. Collector ID: A unique ID that is given to your Collector machine. This ID does not change for a given machine across different discoveries. You can use this ID in case of failures when reporting the issue to Microsoft Support.
2. Session ID: A unique ID for the running collection job. You can refer to the same session ID in the portal when the discovery job completes. This ID changes for every collection job. In case of failures, you can report this ID to Microsoft Support.

### What data is collected?

The collector appliance discovers the following static metadata about the selected virtual machines.

1. VM Display name (on vCenter)
2. VM’s inventory path (host/folder in vCenter)
3. IP address
4. MAC address
5. Operating system
5. Number of cores, disks, NICs
6. Memory size, Disk sizes
7. And performance counters of the VM, disk and network as listed in the table below.

For on-time discovery model, the following table lists the exact performance counters that are collected, and also lists the assessment results that are impacted if a particular counter is not collected.

For continuous discovery, the same counters are collected at real time (20 seconds interval), so there is no dependency on vCenter statistics level. The appliance then rolls-up the 20-second samples to create a single data point for every 15 minutes by selecting the peak value from the 20-second samples and sends it to Azure.

|Counter                                  |Level    |Per-device level  |Assessment impact                               |
|-----------------------------------------|---------|------------------|------------------------------------------------|
|cpu.usage.average                        | 1       |NA                |Recommended VM size and cost                    |
|mem.usage.average                        | 1       |NA                |Recommended VM size and cost                    |
|virtualDisk.read.average                 | 2       |2                 |Disk size, storage cost, and VM size         |
|virtualDisk.write.average                | 2       |2                 |Disk size, storage cost, and VM size         |
|virtualDisk.numberReadAveraged.average   | 1       |3                 |Disk size, storage cost, and VM size         |
|virtualDisk.numberWriteAveraged.average  | 1       |3                 |Disk size, storage cost, and VM size         |
|net.received.average                     | 2       |3                 |VM size and network cost                        |
|net.transmitted.average                  | 2       |3                 |VM size and network cost                        |

> [!WARNING]
> For one-time discovery, if you have just set a higher statistics level, it will take up to a day to generate the performance counters. So, we recommend that you run the discovery after one day. For the continuous discovery model, wait for at least a day after starting discovery for the appliance to profile the environment and then create assessments.

### Time required to complete the collection

**One-time discovery**

In this model, the collector collects configuration and performance history of VMs from vCenter Server and sends it to the project. The appliance in this case is not continuously connected to the project. Based on the number of virtual machines in the selected scope, it takes up to 15 minutes to send the configuration metadata to the project. Once the configuration metadata is available on the portal, you can see the list of machines in the portal and start creating groups. Once the configuration data is collected, it can take up to one hour for the performance data to be available on the portal, based on the number of virtual machines in the selected scope.

**Continuous discovery**

In this model, the configuration data of the on-premises VMs is available after 1 hour of triggering discovery and performance data starts becoming available after 2 hours. Since this is a continuous model, the collector continuously keeps sending performance data to the Azure Migrate project.

## Locking down the collector appliance
We recommend running continuous Windows updates on the collector appliance. If a collector is not updated for 60 days, the collector will start auto-shutting down the machine. If a discovery is running, the machine will not be turned off, even if it is past its 60-day period. Post the discovery job completes, the machine will be turned off. If you are using the collector for more than 45 days, we recommend keeping the machine updated at all times by running Windows update.

We also recommend the following steps to secure your appliance
1. Do not share or misplace administrator passwords with unauthorized parties.
2. Shut down the appliance when not in use.
3. Place the appliance in a secured network.
4. Once the migration work is complete, delete the appliance instance. Be sure to also delete the disk backing files (VMDKs), as the disks may have vCenter credentials cached on them.

## How to upgrade Collector

You can upgrade the Collector to the latest version without downloading the OVA once again.

1. Download the latest [upgrade package](https://aka.ms/migrate/col/upgrade_9_14) (version 1.0.9.14).
2. To ensure that the downloaded hotfix is secure, open Administrator command window and run the following command to generate the hash for the ZIP file. The generated hash should match with the hash mentioned against the specific version:

	```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```

	(example usage C:\>CertUtil -HashFile C:\AzureMigrate\CollectorUpdate_release_1.0.9.14.zip SHA256)
3. Copy the zip file to the Azure Migrate collector virtual machine (collector appliance).
4. Right-click on the zip file and select Extract All.
5. Right-click on Setup.ps1 and select Run with PowerShell and follow the instructions on screen to install the update.

### List of updates

#### Upgrade to version 1.0.9.14

Hash values for upgrade [package 1.0.9.14](https://aka.ms/migrate/col/upgrade_9_14)

**Algorithm** | **Hash value**
--- | ---
MD5 | c5bf029e9fac682c6b85078a61c5c79c
SHA1 | af66656951105e42680dfcc3ec3abd3f4da8fdec
SHA256 | 58b685b2707f273aa76f2e1d45f97b0543a8c4d017cd27f0bdb220e6984cc90e

#### Upgrade to version 1.0.9.13

Hash values for upgrade [package 1.0.9.13](https://aka.ms/migrate/col/upgrade_9_13)

**Algorithm** | **Hash value**
--- | ---
MD5 | 739f588fe7fb95ce2a9b6b4d0bf9917e
SHA1 | 9b3365acad038eb1c62ca2b2de1467cb8eed37f6
SHA256 | 7a49fb8286595f39a29085534f29a623ec2edb12a3d76f90c9654b2f69eef87e

#### Upgrade to version 1.0.9.11

Hash values for upgrade [package 1.0.9.11](https://aka.ms/migrate/col/upgrade_9_11)

**Algorithm** | **Hash value**
--- | ---
MD5 | 0e36129ac5383b204720df7a56b95a60
SHA1 | aa422ef6aa6b6f8bc88f27727e80272241de1bdf
SHA256 | 5f76dbbe40c5ccab3502cc1c5f074e4b4bcbf356d3721fd52fb7ff583ff2b68f

#### Upgrade to version 1.0.9.7

Hash values for upgrade [package 1.0.9.7](https://aka.ms/migrate/col/upgrade_9_7)

**Algorithm** | **Hash value**
--- | ---
MD5 | 01ccd6bc0281f63f2a672952a2a25363
SHA1 | 3e6c57523a30d5610acdaa14b833c070bffddbff
SHA256 | e3ee031fb2d47b7881cc5b13750fc7df541028e0a1cc038c796789139aa8e1e6

## Next steps

[Set up an assessment for on-premises VMware VMs](tutorial-assessment-vmware.md)
