---
title: Virtual Machine certification - issues and solutions 
description: This article will walk you through common error messages encountered in images, and their related solutions.  
author: v-miegge 
ms.author: v-krmall
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: troubleshooting
ms.date: 06/16/2020
---

# Virtual Machine certification - issues and solutions

While publishing your virtual machine (VM) images to Azure Marketplace, the Azure team validates the VM image to ensure its bootability, security, and Azure compatibility. If any of the high quality tests fail, the publishing will fail with a message containing the error.

This article will walk you through common error messages encountered in images, and their related solutions:

> [!NOTE]
> If you have questions or feedback for improvement, reach out to [Partner Center Support](https://partner.microsoft.com/en-US/support/v2/?stage=1).

## Approved base image

When you submit a request for re-publishing your image with updates performed on it, the part-number verification test case may fail. In that instance, your image won't be approved.

This failure will occur when you have used a base image which belongs to another publisher and you have updated the image. In this situation, you will not be allowed to publish your image.

To fix this issue, retrieve your latest image from Azure Marketplace and perform changes on that image. See the following to view approved base images where you can search for your image:

- [Linux-Images](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros?toc=/azure/virtual-machines/linux/toc.json)
- [Windows-Images](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-create-vhd#select-an-approved-base)

## VM extension failure

To check whether your image supports VM Extension or not, follow these steps:

Enable VM Extensions:

1. Select the Linux VM.
2. Go to the **Diagnostics** setting.
3. Enable Base matrices by updating the **Storage account**.
4. Select **Save**.

   (IMAGE)

   Check whether VM Extensions are properly activated:

5. Go to the **VM extensions** tab of the VM and verify the **Linux Diagnostics Extension**.
6. If the Status is **Provisioning Succeeded** then the Extensions test case has passed.
7. If the Status is **Provisioning Failed** then the Extensions test case has failed and you need to set the Hardened flag.

   (IMAGE)

   If the VM extension fails, go to [Use Linux Diagnostic Extension to monitor metrics and logs](https://docs.microsoft.com/azure/virtual-machines/extensions/diagnostics-linux) to enable it. If you don't want the VM extension to be enabled, reach out to the support team and ask them to disable the extension.

## Virtual Machine provisioning issue

Check that the provisioning process is rigorously followed for the VM before submitting your offer. To view the json format for provisioning the VM, go to [Azure virtual machine (VM) image certification](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-deploy-json-template).

Provisioning issues can include the following failure scenarios:

|S.NO|error|reason|solution|
|---|---|---|---|
|1|Invalid virtual hard disk (VHD)|If the specified cookie value in the VHD footer isn't correct, then the VHD will be considered invalid.|Recreate the image and submit the request.|
|2|Invalid Blob Type|VM provisioning failed as the used block is a blob type instead of a page type.|Recreate the image and submit the request.|
|3|Provisioning timeout or not properly generalized|There is an issue with VM generalization.|Recreate the image with generalization and submit the request.|

> [!NOTE]
> Follow these links for documentation related to VM generalization:
> - [Linux](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-configure-vm#generalize-the-image)
> - [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource#generalize-the-windows-vm-using-sysprep)

## Software compliance for Windows

If your windows image request is rejected due to software compliance, then you may have created a Windows image with the SQL server installed, instead of taking the relevant SQL version base image from Azure Marketplace.

Don't create your own windows image with SQL server installed in it. Instead, use the approved SQL base images (Enterprise/Standard/web) from Azure Marketplace.

If you are trying to install Visual studio or any office licensed product, then get prior approval by reaching out to the support team.

For more information, visit [Create your Azure Virtual Machine technical assets](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-create-vhd#select-an-approved-base) to select an approved base.

## Tool kit test case execution failed

The Microsoft Certification toolkit will help you to execute test cases verify that your VHD/Image is compatible with the Azure environment.

Download the [Microsoft Certification toolkit](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-certify-vm).

## Linux test cases

The following are the Linux test cases that the toolkit will execute. Test validation is stated in the description.

|S.No|test cases|description|
|---|---|---|
|1|Bash History|Bash history files should be cleared before creating the VM image.|
|2|Linux Agent Version|Azure Linux Agent 2.2.41 and beyond should be installed.|
|3|Required Kernel Parameters|Verifies the following kernel parameters are set: <br>console=ttyS0<br>earlyprintk=ttyS0<br>rootdelay=300|
|4|Swap Partition on OS Disk|Verifies that swap partitions aren't created on the OS disk.|
|5|Root Partition on OS Disk|Create single root partition for the OS disk.|
|6|OpenSSL Version|The OpenSSL Version should be greater or equal to v0.9.8.|
|7|Python Version|Python version 2.6+ is highly recommended.|
|8|Client Alive Interval|Set ClientAliveInterval to 180. On the application need, it can be set between 30 to 235. If you are enabling the SSH for your end-users, this value must be set as explained.|
|9|OS Architecture|Only 64-bit operating systems are supported.|
|10|Auto Update|Identifies whether Linux Agent Auto Update is enabled.|

### Common errors encountered while executing the previous test cases

These are the common errors encountered while executing the previous test cases.
 
|S.NO|test case|error|solution|
|---|---|---|---|
|1|Linux Agent Version Test Case|The minimum Linux agent version is 2.241 or higher. This has been mandatory since May 1st 2020|The image must be updated with the required version to [submit the request](https://support.microsoft.com/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support).|
|2|Bash History Test Case|You'll see an error if the size of the bash history in your submitted image is more than 1 KB. The size is restricted to 1 KB to ensure that any potentially sensitive information isn't captured in your bash history file.|To resolve this problem, mount the VHD to any other working VM and make any changes (for example, delete the .bash history files) you want to reduce the size to less than or equal to 1KB.|
|3|Required Kernel Parameter Test Case|You'll receive this error when the value for **console** isn't set to **ttyS0**. Check by executing the command:<br>`cat /proc/cmdline`|Set the value for **console** to **ttyS0** and re-submit the request.|
|4|ClientAlive Interval Test Case|If the toolkit result gives you a failed result for this test case, there is an inappropriate value for **ClientAliveInterval**.|Set the value for **ClientAliveInterval** to less than or equal to 235, then re-submit the request.|

### Windows test cases

The following are the Windows test cases that the toolkit will execute. Test validation is stated in the description.

|S.No|test cases|description|
|---|---|---|---|
|1|OS Architecture|Azure only supports 64bit operating systems.|
|2|User account dependency|Application execution should not be dependant on the administrator account.|
|3|Failover Cluster|Windows Server Failover Clustering feature isn't yet supported. the application should not be dependent on this feature.|
|4|IPV6|IPv6 isn't yet supported in the Azure environment. The application should not be dependent on this feature.|
|5|DHCP|Dynamic Host Configuration Protocol Server role isn't yet supported. The application should not be dependent on this feature.|
|6|Hyper-V|Hyper-V Server role isn't yet supported. The application should not be dependent on this feature.|
|7|Remote Access|Remote Access (Direct Access) Server role isn't yet supported. The application should not be dependent on this feature.|
|8|Rights Management Services|Rights Management Services. The server role isn't yet supported. The application should not be dependent on this feature.|
|9|Windows Deployment Services|Windows Deployment Services. The server role isn't yet supported. The application should not be dependent on this feature.|
|10|BitLocker Drive Encryption|BitLocker Drive Encryption isn't supported on the operating system hard disk, but may be used on data disks.|
|11|Internet Storage Name Server|Internet Storage Name Server feature isn't yet supported. The application should not be dependent on this feature.|
|12|Multipath I/O|Multipath I/O. This server feature isn't yet supported. The application should not be dependent on this feature.|
|13|Network Load Balancing|Network Load Balancing. This server feature isn't yet supported. The application should not be dependent on this feature.|
|14|Peer Name Resolution Protocol|Peer Name Resolution Protocol. This server feature isn't yet supported. The application should not be dependent on this feature.|
|15|SNMP Services|The SNMP Services feature isn't yet supported. The application should not be dependent on this feature.|
|16|Windows Internet Name Service|Windows Internet Name Service. This server feature isn't yet supported. The application should not be dependent on this feature.|
|17|Wireless LAN Service|Wireless LAN Service. This server feature isn't yet supported. The application should not be dependent on this feature.|

If you encounter any failures with the above test cases, refer to the **Description** column in the previous table for the solution. If you require more information, reach out to support team. 

## Data disk size verification

If the size of any request submitted with the data disk is greater than 1023 GB, that request won't be approved. This applies to both Linux & Windows.

Re-submit the request with a size less than or equal to 1023 GB.

## OS disk size validation

Refer to the following rules for limitations on OS disk size. When you submit any request, verify that the OS disk size is within the limitation for Linux or Windows.

|OS|recommended VHD size|
|---|---|
|Linux|30GB to 1023GB|
|Windows|30GB to 250GB|

As VMs allow access to the underlying operating system, ensure that the VHD size is sufficiently large for the VHD. Because disks aren’t completely expandable without downtime, use a disk size between 30-50GB.

|VHD size|actual occupied size|solution|
|---|---|---|
|>500TIB|n/a|Reach out to the support team for an exception approval.|
|250-500TiB|>200GiB different from blob size|Reach out to the support team for an exception approval.|

> [!NOTE]
> Larger disk sizes incur higher costs and will incur a delay during provisioning and replication steps. Because of this delay and cost, the support team may seek justification for the exception approval.

## WannaCry patch verification test for Windows

To prevent a potential attack related to WannaCry virus, ensure that all the windows image requests are updated with the latest patch.

To check the Windows Server patched version, refer to the following table for the OS detail and the minimum version it will support. 

The image file version can be verified from `C:\windows\system32\drivers\srv.sys` or `srv2.sys`.

> [!NOTE]
> WindowsServer2019 does not have any mandatory version requirements.

|OS|version|
|---|---|
|WindowsServer2008R2|6.1.7601.23689|
|WindowsServer2012|6.2.9200.22099|
|WindowsServer2012R2|6.3.9600.18604|
|WindowsServer2016|10.0.14393.953|
|WindowsServer2019|NA|

## SACK vulnerability patch verification

When you submit a Linux image, your request may be rejected due to kernel version issues.

Update the kernel with an approved version and resubmit the request. You can find the approved kernel version in the following table. The version number should be equal to or greater than the one listed below.

If your image in not installed with one of the following kernel versions, update your image with the correct patches. You can find more information from the following links. Request the necessary approval from the support team after the image is updated with these required patches:

• CVE-2019-11477 
• CVE-2019-11478 
• CVE-2019-11479

|OS family|version|kernel|
|---|---|---|
|Ubuntu|14.04 LTS|4.4.0-151| 
||14.04 LTS|4.15.0-1049-*-azure|
||16.04 LTS|4.15.0-1049|
||18.04 LTS|4.18.0-1023|
||18.04 LTS|5.0.0-1025|
||18.10|4.18.0-1023|
||19.04|5.0.0-1010|
||19.04|5.3.0-1004|
|RHEL and Cent OS|6.10|2.6.32-754.15.3|
||7.2|3.10.0-327.79.2|
||7.3|3.10.0-514.66.2|
||7.4|3.10.0-693.50.3|
||7.5|3.10.0-862.34.2|
||7.6|3.10.0-957.21.3|
||7.7|3.10.0-1062.1.1|
||8.0|4.18.0-80.4.2|
||8.1|4.18.0-147|
||"7-RAW" (7.6)||
||"7-LVM" (7.6)|3.10.0-957.21.3|
||RHEL-SAP 7.4|TBD|
||RHEL-SAP 7.5|TBD|
|SLES|SLES11SP4 (including SAP)|3.0.101-108.95.2|
||SLES12SP1 for SAP|3.12.74-60.64.115.1|
||SLES12SP2 for SAP|4.4.121-92.114.1|
||SLES12SP3|4.4180-4.31.1 (kernel-azure)|
||SLES12SP3 for SAP|4.4.180-94.97.1|
||SLES12SP4|4.12.14-6.15.2 (kernel-azure)|
||SLES12SP4 for SAP|4.12.14-95.19.1|
||SLES15|4.12.14-5.30.1 (kernel-azure)|
||SLES15 for SAP|4.12.14-5.30.1 (kernel-azure)|
||SLES15SP1|4.12.14-5.30.1 (kernel-azure)|
|Oracle|6.10|UEK2 2.6.39-400.312.2<br>UEK3 3.8.13-118.35.2<br>RHCK 2.6.32-754.15.3 
||7.0-7.5|UEK3 3.8.13-118.35.2<br>UEK4 4.1.12-124.28.3<br>RHCK follows RHEL above|
||7.6|RHCK 3.10.0-957.21.3<br>UEK5 4.14.35-1902.2.0|
|CoreOS Stable 2079.6.0|4.19.43*|
||Beta 2135.3.1|4.19.50*|
||Alpha 2163.2.1|4.19.50*|
|Debian|jessie (security)|3.16.68-2|
||jessie backports|4.9.168-1+deb9u3|
||stretch (security)|4.9.168-1+deb9u3|
||Debian GNU/Linux 10 (buster)|Debian 6.3.0-18+deb9u1|
||buster, sid (stretch backports)|4.19.37-5|

## Image size should be in multiples of megabytes

All VHDs on Azure must have a virtual size aligned to multiple of 1 MB. If your VHD does not adhere to the recommended virtual size then your request might get rejected.

follow guidelines, when you are converting from a raw disk to VHD and must ensure that the raw disk size is a multiple of 1 MB. For more information, see [Information for Non-endorsed Distributions](https://docs.microsoft.com/azure/virtual-machines/linux/create-upload-generic)

## VM access denied

If you encounter access denied issue while executing the test cases on VM then it may be due to insufficient privileges to execute the test cases.

Check whether proper access is enabled for the account on which the self-test cases are executing. if they are not, enable access to execute the test cases. If you don't want to enable access, you may share the self-test case results with the support team.

## Download failure
    
Refer to the following table for any issues when downloading the VM image using SAS URL.

|S.NO|error|reason|solution|
|---|---|---|---|
|1|Blob Not Found|The VHD may either be deleted or moved from the specified location|| 
|2|Blob in Use|The VHD is use by another internal process|The VHD should be in a used state when downloading using SAS URL.|
|3|Invalid SAS URL|The associated SAS URL for that VHD is incorrect.|Get the correct SAS URL.|
|4|Invalid Signature|The associated SAS URL for that VHD is incorrect.|Get the correct SAS URL.|
|6|HTTP Conditional Header|Invalid SAS URL.|Get the correct SAS URL.|
|7|Invalid VHD Name|Check whether any special characters such as **%** or **“ “** exist in the VHD name|Rename the VHD file by removing special characters|

## First 1MB partition

When submitting the VHD, ensure that the first 1MB partition of the VHD is empty. Otherwise, your request will fail.

## Default credentials

Always ensure that default credentials aren't sent with the submitted VHD. Adding default credentials makes the VHD more vulnerable to security threats. Instead, create your own credentials when submitting the VHD.
  
## DataDisk mapped incorrectly

When a request is submitted with multiple data disks, but their order isn't in sequence, this is considered a mapping issue. For example, if there are three data disks, the numbering order must be **0, 1, 2**. Any order other than this will be treated as a mapping issue.

Re-submit the request with proper sequencing of data disks.

## Incorrect OS mapping

When an image is created, it may be mapped or assigned to the wrong OS label. For example, when **Windows** is selected as a part of the OS name while creating the image, the OS disk should only be installed with Windows. The same applies to Linux.

## VM not generalized

If all images taken from Azure Marketplace are to be reused, then the operating system VHD must be generalized.

Linux:

The following process generalizes a Linux VM and redeploys it as a separate VM.

In the SSH window, enter the following command: `sudo waagent -deprovision+user`

Windows:

Windows images are generalized with `sysreptool`.

You can find more information on this tool at [Sysprep (System Preparation) Overview]( https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview)

## DataDisk error

Refer the following table for solutions to errors related to the data disk.

|Error|reason|solution|
|---|---|---|
|`DataDisk- InvalidUrl:`|This error may be due to an invalid number specified for LUN while submitting the offer.|Verify that the LUN number sequence for the data disk is in Partner center.|
|`DataDisk- NotFound:`|This error may be due to a data disk not being located at a specified SAS URL|Verify the data disk is located at SAS URL specified in the request.|

## Remote Access issue

If the RDP option isn't enabled for the Windows image, you will receive this error. 

Enable RDP access for Windows images before submitting.
