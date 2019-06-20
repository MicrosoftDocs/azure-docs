---
title: About the Collector appliance in Azure Migrate | Microsoft Docs
description: Provides information about the Collector appliance in Azure Migrate.
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: snehaa
services: azure-migrate
---

# About the Collector appliance

 This article provides information about Azure Migrate Collector.

The Azure Migrate Collector is a lightweight appliance that can be used to discover an on-premises vCenter environment for the purposes of assessment with the [Azure Migrate](migrate-overview.md) service, before migration to Azure.  

## Discovery method

Previously, there were two options for the collector appliance, one-time discovery, and continuous discovery. The one-time discovery model is now deprecated as it relied on vCenter Server statistics settings for performance data collection (required statistics settings to be set to level 3) and also collected average counters (instead of peak) which resulted in under-sizing. The continuous discovery model ensures granular data collection and results in accurate sizing due to collection of peak counters. Below is how it works:

The collector appliance is continuously connected to the Azure Migrate project and continuously collects performance data of VMs.

- The collector continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds.
- The appliance rolls up the 20-second samples, and creates a single data point every 15 minutes.
- To create the data point the appliance selects the peak value from the 20-second samples, and sends it to Azure.
- This model doesn't depend on the vCenter Server statistics settings to collect performance data.
- You can stop continuous profiling at anytime from the Collector.

**Quick assessments:** With the continuous discovery appliance, once the discovery is complete (it takes couple of hours depending on the number of VMs), you can immediately create assessments. Since the performance data collection starts when you kick off discovery, if you are looking for quick assessments, you should select the sizing criterion in the assessment as *as on-premises*. For performance-based assessments, it is advised to wait for at least a day after kicking off discovery to get reliable size recommendations.

The appliance only collects performance data continuously, it does not detect any configuration change in the on-premises environment (i.e. VM addition, deletion, disk addition etc.). If there is a configuration change in the on-premises environment, you can do the following to reflect the changes in the portal:

- Addition of items (VMs, disks, cores etc.): To reflect these changes in the Azure portal, you can stop the discovery from the appliance and then start it again. This will ensure that the changes are updated in the Azure Migrate project.

- Deletion of VMs: Due to the way the appliance is designed, deletion of VMs is not reflected even if you stop and start the discovery. This is because data from subsequent discoveries are appended to older discoveries and not overridden. In this case, you can simply ignore the VM in the portal, by removing it from your group and recalculating the assessment.

> [!NOTE]
> The one-time discovery appliance is now deprecated as this method relied on vCenter Server's statistics settings for performance data point availability and collected average performance counters which resulted in under-sizing of VMs for migration to Azure.

## Deploying the Collector

You deploy the Collector appliance using an OVF template:

- You download the OVF template from an Azure Migrate project in the Azure portal. You import the downloaded file to vCenter Server, to set up the Collector appliance VM.
- From the OVF, VMware sets up a VM with 8 cores, 16 GB RAM, and one disk of 80 GB. The operating system is Windows Server 2016 (64 bit).
- When you run the Collector, a number of prerequisite checks run to make sure that the Collector can connect to Azure Migrate.

- [Learn more](tutorial-assessment-vmware.md#create-the-collector-vm) about creating the Collector.


## Collector prerequisites

The Collector must pass a few prerequisite checks to ensure it can connect to the Azure Migrate service over the internet, and upload discovered data.

- **Verify Azure cloud**: The Collector needs to know the Azure cloud to which you are planning to migrate.
    - Select Azure Government if you are planning to migrate to Azure Government cloud.
    - Select Azure Global if you are planning to migrate to commercial Azure cloud.
    - Based on the cloud specified here, the appliance will send discovered metadata to the respective end points.
- **Check internet connection**: The Collector can connect to the internet directly, or via a proxy.
    - The prerequisite check verifies connectivity to [required and optional URLs](#urls-for-connectivity).
    - If you have a direct connection to the internet, no specific action is required, other than making sure that the Collector can reach the required URLs.
    - If you're connecting via a proxy, note the requirements below.
- **Verify time synchronization**: The Collector should synchronized with the internet time server to ensure the requests to the service are authenticated.
    - The portal.azure.com url should be reachable from the Collector so that the time can be validated.
    - If the machine isn't synchronized, you need to change the clock time on the Collector VM to match the current time. To do this open an admin prompt on the VM, run **w32tm /tz** to check the time zone. Run **w32tm /resync** to synchronize the time.
- **Check collector service running**:  The Azure Migrate Collector service should be running on the Collector VM.
    - This service is started automatically when the machine boots.
    - If the service isn't running, start it from the Control Panel.
    - The Collector service connects to vCenter Server, collects the VM metadata and performance data, and sends it to the Azure Migrate service.
- **Check VMware PowerCLI 6.5 installed**: The VMware PowerCLI 6.5 PowerShell module must be installed on the Collector VM, so that it can communicate with vCenter Server.
    - If the Collector can access the URLs required to install the module, it's install automatically during Collector deployment.
    - If the Collector can't install the module during deployment, you must install it manually.
- **Check connection to vCenter Server**: The Collector must be able to vCenter Server and query for VMs, their metadata, and performance counters. [Verify prerequisites](#connect-to-vcenter-server) for connecting.


### Connect to the internet via a proxy

- If the proxy server requires authentication, you can specify the username and password when you set up the Collector.
- The IP address/FQDN of the Proxy server should specified as *http:\//IPaddress* or *http:\//FQDN*.
- Only HTTP proxy is supported. HTTPS-based proxy servers aren't supported by the Collector.
- If the proxy server is an intercepting proxy, you must import the proxy certificate to the Collector VM.
  1. In the collector VM, go to **Start Menu** > **Manage computer certificates**.
  2. In the Certificates tool, under **Certificates - Local Computer**, find **Trusted Publishers** > **Certificates**.

      ![Certificates tool](./media/concepts-intercepting-proxy/certificates-tool.png)

  3. Copy the proxy certificate to the collector VM. You might need to obtain it from your network admin.
  4. Double-click to open the certificate, and click **Install Certificate**.
  5. In the Certificate Import Wizard > Store Location, choose **Local Machine**.

     ![Certificate store location](./media/concepts-intercepting-proxy/certificate-store-location.png)

  6. Select **Place all certificates in the following store** > **Browse** > **Trusted Publishers**. Click **Finish** to import the certificate.

     ![Certificates store](./media/concepts-intercepting-proxy/certificate-store.png)

  7. Check that the certificate is imported as expected, and check that the internet connectivity prerequisite check works as expected.


### URLs for connectivity

The connectivity check is validated by connecting to a list of URLs.

**URL** | **Details**  | **Prerequisite check**
--- | --- | ---
*.portal.azure.com | Applicable to Azure Global. Checks connectivity with the Azure service, and time synchronization. | Access to URL required.<br/><br/> Prerequisites check fails if there's no connectivity.
*.portal.azure.us | Applicable only to Azure Government. Checks connectivity with the Azure service, and time synchronization. | Access to URL required.<br/><br/> Prerequisites check fails if there's no connectivity.
*.oneget.org:443<br/><br/> *.github.com/oneget/oneget<br/><br/> *.windows.net:443<br/><br/> *.windowsazure.com:443<br/><br/> *.azure.microsoft.com<br/><br/> *.azure.microsoft.com/en-us<br/><br/> *.powershellgallery.com:443<br/><br/> *.msecnd.net:443<br/><br/> *.visualstudio.com:443<br/><br/> *.visualstudio.microsoft.com | Used to download the PowerShell vCenter PowerCLI module. | Access to URLs is required.<br/><br/> Prerequisites check won't fail.<br/><br/> Automatic module installation on the Collector VM will fail. You'll need to install the module manually in a machine that has internet connectivity and then copy the modules to the appliance. [Learn more by going to Step#4 in this troubleshooting guide](https://docs.microsoft.com/azure/migrate/troubleshooting-general#error-unhandledexception-internal-error-occurred-systemiofilenotfoundexception).


### Install VMware PowerCLI module manually

1. Install the module using [these steps](https://blogs.vmware.com/PowerCLI/2017/04/powercli-install-process-powershell-gallery.html). These steps describe both online and offline installation.
2. If the Collector VM is offline and install on the module on a different machine with internet access, you need to copy the VMware.* files from that machine to the Collector VM.
3. After installation, you can restart the prerequisites checks to confirm that PowerCLI is installed.

### Connect to vCenter Server

The Collector connects to the vCenter Server and queries for VM metadata, and performance counters. Here's what you need for the connection.

- Only vCenter Server versions 5.5, 6.0, 6.5 and 6.7 are supported.
- You need a read-only account with the permissions summarized below for discovery. Only datacenters accessible with the account can be accessed for discovery.
- By default you connect to vCenter Server with an FQDN or IP address. If vCenter Server listens on a different port, you connect to it using the form *IPAddress:Port_Number* or *FQDN:Port_Number*.
- The Collector should have a network line of sight to the vCenter server.

#### Account permissions

**Account** | **Permissions**
--- | ---
At least a read-only user account | Data Center object –> Propagate to Child Object, role=Read-only   


## Collector communications

The collector communicates as summarized in the following diagram and table.

![Collector communication diagram](./media/tutorial-assessment-vmware/portdiagram.PNG)


**Collector communicates with** | **Port** | **Details**
--- | --- | ---
Azure Migrate service | TCP 443 | Collector communicates with Azure Migrate service over SSL 443.
vCenter Server | TCP 443 | The Collector must be able to communicate with the vCenter Server.<br/><br/> By default, it connects to vCenter on 443.<br/><br/> If vCenter Server listens on a different port, that port should be available as outgoing port on the Collector.
RDP | TCP 3389 |

## Collected metadata

> [!NOTE]
> Metadata discovered by the Azure Migrate collector appliance is used to help you right-size your applications as you migrate them to Azure, perform Azure suitability analysis, application dependency analysis, and cost planning. Microsoft does not use this data in relation to any license compliance audit.

The collector appliance discovers the following configuration metadata for each VM. The configuration data for the VMs is available an hour after you start discovery.

- VM display name (on vCenter Server)
- VM’s inventory path (the host/folder on vCenter Server)
- IP address
- MAC address
- Operating system
- Number of cores, disks, NICs
- Memory size, Disk sizes
- Performance counters of the VM, disk and network.

### Performance counters

 The collector appliance collects the following performance counters for each VM from the ESXi host at an interval of 20 seconds. These counters are vCenter counters and although the terminology says average, the 20-second samples are real time counters. The performance data for the VMs starts becoming available in the portal two hours after you have kicked off the discovery. It is strongly recommended to wait for at least a day before creating performance-based assessments to get accurate right-sizing recommendations. If you are looking for instant gratification, you can create assessments with sizing criterion as *as on-premises* which will not consider the performance data for right-sizing.

**Counter** |  **Impact on assessment**
--- | ---
cpu.usage.average | Recommended VM size and cost  
mem.usage.average | Recommended VM size and cost  
virtualDisk.read.average | Calculates disk size, storage cost, VM size
virtualDisk.write.average | Calculates disk size, storage cost, VM size
virtualDisk.numberReadAveraged.average | Calculates disk size, storage cost, VM size
virtualDisk.numberWriteAveraged.average | Calculates disk size, storage cost, VM size
net.received.average | Calculates VM size                          
net.transmitted.average | Calculates VM size     

The complete list of VMware counters collected by Azure Migrate is available below:

**Category** |  **Metadata** | **vCenter datapoint**
--- | --- | ---
Machine Details | VM ID | vm.Config.InstanceUuid
Machine Details | VM name | vm.Config.Name
Machine Details | vCenter Server ID | VMwareClient.InstanceUuid
Machine Details |  VM description |  vm.Summary.Config.Annotation
Machine Details | License product name | vm.Client.ServiceContent.About.LicenseProductName
Machine Details | Operating system type | vm.Summary.Config.GuestFullName
Machine Details | Operating system version | vm.Summary.Config.GuestFullName
Machine Details | Boot type | vm.Config.Firmware
Machine Details | Number of cores | vm.Config.Hardware.NumCPU
Machine Details | Megabytes of memory | vm.Config.Hardware.MemoryMB
Machine Details | Number of disks | vm.Config.Hardware.Device.ToList().FindAll(x => x is VirtualDisk).count
Machine Details | Disk size list | vm.Config.Hardware.Device.ToList().FindAll(x => x is VirtualDisk)
Machine Details | Network adapters list | vm.Config.Hardware.Device.ToList().FindAll(x => x is VirtualEthernetCard)
Machine Details | CPU utilization | cpu.usage.average
Machine Details | Memory utilization | mem.usage.average
Disk Details (per disk) | Disk key value | disk.Key
Disk Details (per disk) | Disk unit number | disk.UnitNumber
Disk Details (per disk) | Disk controller key value | disk.ControllerKey.Value
Disk Details (per disk) | Gigabytes provisioned | virtualDisk.DeviceInfo.Summary
Disk Details (per disk) | Disk  name | This value is generated using disk.UnitNumber, disk.Key and disk.ControllerKey.Value
Disk Details (per disk) | Number of read operations per second | virtualDisk.numberReadAveraged.average
Disk Details (per disk) | Number of write operations per second | virtualDisk.numberWriteAveraged.average
Disk Details (per disk) | Megabytes per second of read throughput | virtualDisk.read.average
Disk Details (per disk) | Megabytes per second of write throughput | virtualDisk.write.average
Network Adapter Details (per NIC) | Network adapter name | nic.Key
Network Adapter Details (per NIC) | MAC Address | ((VirtualEthernetCard)nic).MacAddress
Network Adapter Details (per NIC) | IPv4 Addresses | vm.Guest.Net
Network Adapter Details (per NIC) | IPv6 Addresses | vm.Guest.Net
Network Adapter Details (per NIC) | Megabytes per second of read throughput | net.received.average
Network Adapter Details (per NIC) | Megabytes per second of write throughput | net.transmitted.average
Inventory Path Details | Name | container.GetType().Name
Inventory Path Details | Type of child object | container.ChildType
Inventory Path Details | Reference details | container.MoRef
Inventory Path Details | Complete inventory path | container.Name with complete path
Inventory Path Details | Parent details | Container.Parent
Inventory Path Details | Folder details for each VM | ((Folder)container).ChildEntity.Type
Inventory Path Details | Datacenter details for each VM Folder | ((Datacenter)container).VmFolder
Inventory Path Details | Datacenter details for each Host Folder | ((Datacenter)container).HostFolder
Inventory Path Details | Cluster details for each Host | ((ClusterComputeResource)container).Host)
Inventory Path Details | Host details for each VM | ((HostSystem)container).Vm


## Securing the Collector appliance

We recommend the following steps to secure the Collector appliance:

- Don't share or misplace administrator passwords with unauthorized parties.
- Shut down the appliance when not in use.
- Place the appliance in a secured network.
- After migration is finished, delete the appliance instance.
- In addition, after migration, also delete the disk backup files (VMDKs), as the disks might have vCenter credentials cached on them.

## OS license in the collector VM

The collector comes with a Windows Server 2016 evaluation license which is valid for 180 days. If the evaluation period is expiring for your collector VM, it is recommended to download a new OVA and create a new appliance.

## Updating the OS of the Collector VM

Although the collector appliance has an evaluation license for 180 days, you need to continuously update the OS on the appliance to avoid auto-shut down of the appliance.

- If the Collector isn't updated for 60 days, it starts shutting down the machine automatically.
- If a discovery is running, the machine won't be turned off, even if 60 days have passed. The machine will be turned off after the discovery completes.
- If you've used the Collector for more than 60 days, we recommend keeping the machine updated at all times by running Windows update.

## Upgrading the Collector appliance version

You can upgrade the Collector to the latest version without downloading the OVA again.

1. Download the [latest listed upgrade package](concepts-collector-upgrade.md)
2. To ensure that the downloaded hotfix is secure, open Administrator command window and run the following command to generate the hash for the ZIP file. The generated hash should match with the hash mentioned against the specific version:

	```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```

	(example usage C:\>CertUtil -HashFile C:\AzureMigrate\CollectorUpdate_release_1.0.9.14.zip SHA256)
3. Copy the zip file to the Azure Migrate collector virtual machine (collector appliance).
4. Right-click on the zip file and select Extract All.
5. Right-click on Setup.ps1 and select Run with PowerShell and follow the instructions on screen to install the update.

## Discovery process

After the appliance is set up, you can run discovery. Here's how that works:

- You run a discovery by scope. All VMs in the specified vCenter inventory path will be discovered.
    - You set one scope at a time.
    - The scope can include 1500 VMs or less.
    - The scope can be a datacenter, folder, or ESXi host.
- After connecting to vCenter Server, you connect by specifying a migration project for the collection.
- VMs are discovered, and their metadata and performance data is sent to Azure. These actions are part of a collection job.
    - The Collector appliance is given a specific Collector ID that's persistent for a given machine across discoveries.
    - A running collection job is given a specific session ID. The ID changes for each collection job, and can be used for troubleshooting.

## Next steps

[Set up an assessment for on-premises VMware VMs](tutorial-assessment-vmware.md)
