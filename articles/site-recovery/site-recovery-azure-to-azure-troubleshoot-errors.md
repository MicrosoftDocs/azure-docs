---
title: Azure Site Recovery troubleshooting from Azure to Azure | Microsoft Docs
description: Troubleshooting errors when replicating Azure virtual machines
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/13/2017
ms.author: sujayt

---
# Troubleshoot Azure VM replication issues

This article describes how to troubleshoot common issues in Azure Site Recovery when Azure virtual machines are replicated and recovered from one region to another. For more details about supported configurations, see the [support matrix for replicating Azure VMs](site-recovery-support-matrix-to-azure.md).

## Azure resource quota issues (error code 150097)
Your subscription should be enabled to create Azure VMs in the target region that you plan to use as your disaster recovery region. Also, your subscription should have sufficient quota enabled to create VMs of specific size. By default, Site Recovery picks the same size for the target VM as that of the source VM. If the matching size isn't available, the closest possible size is picked automatically. If there's no matching size that supports source VM configuration, this error message appears:

**Error code** | **Possible causes** | **Recommendation**
--- | --- | ---
150097<br></br>**Message**: Replication couldn't be enabled for the virtual machine VmName. | Your  subscription ID might not be enabled to create any VMs in the target region location.<br></br>Your  subscription ID might not be enabled or doesn't have sufficient quota to create specific VM sizes in the target region location.<br></br>A suitable target VM size that matches the source VM NIC count (2) isn't found for the subscription ID in the target region location.| Contact support to enable VM creation for the required VM sizes in the target location for your subscription. After it's enabled, retry the failed operation.

### Fix the problem
Contact Azure support to enable your subscription to create VMs of the required sizes in the target location.

If the target location has a capacity constraint, disable replication and enable it to a different location where your subscription has sufficient quota to create VMs of the required sizes.

## Trusted root certificates (error code 151066)

Your "enable replication" job might fail if all the latest trusted root certificates aren't present on the VM. Without the certificates, the authentication and authorization of Site Recovery service calls from the VM fail. The error message for the failed "enable replication" Site Recovery job appears:

**Error code** | **Possible cause** | **Recommendations**
--- | --- | ---
151066<br></br>**Message**: Site Recovery configuration failed. | The required trusted root certificates used for authorization and authentication aren't present on the machine. | For a VM running the Windows operating system, ensure that the trusted root certificates are present on the machine. For information, see  [Configure trusted roots and disallowed certificates](https://technet.microsoft.com/library/dn265983.aspx). <br></br>For a VM running the Linux operating system, follow the guidance for trusted root certificates published by the Linux operating system version distributor.

### Fix the problem
**Windows**

Install all the latest Windows updates on the VM so that all the trusted root certificates are present on the machine. If you're in a disconnected environment, follow the standard Windows update process in your organization to get the certificates. If the required certificates aren't present on the VM, the calls to the Site Recovery service fail for security reasons.

Follow the typical Windows update management or certificate update management process in your organization to get all the latest root certificates and the updated certificate revocation list on the VMs.

To verify that the issue is resolved, go to login.microsoftonline.com from a browser in your VM.

**Linux**

Follow the guidance provided by your Linux distributor to get the latest trusted root certificates and the latest certificate revocation list on the VM.

Because SuSE Linux uses symlinks to maintain a certificate list, follow these steps:

1.	Sign in as a root user.

2.	Run this command:

      ``# cd /etc/ssl/certs``

3.	To see if the Symantec root CA certificate is present or not, run this command:

      ``# ls VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem``

4.	If the file isn't found, run these commands:

      ``# wget https://www.symantec.com/content/dam/symantec/docs/other-resources/verisign-class-3-public-primary-certification-authority-g5-en.pem -O VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem``

      ``# c_rehash``

5.	To create a symlink with b204d74a.0 -> VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem, run this command:

      ``# ln -s  VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem b204d74a.0``

6.	Check to see if this command has the following output. If not, you have to create a symlink:

      ``# ls -l | grep Baltimore
      -rw-r--r-- 1 root root   1303 Apr  7  2016 Baltimore_CyberTrust_Root.pem
      lrwxrwxrwx 1 root root     29 May 30 04:47 3ad48a91.0 -> Baltimore_CyberTrust_Root.pem
      lrwxrwxrwx 1 root root     29 May 30 05:01 653b494a.0 -> Baltimore_CyberTrust_Root.pem``

7. If symlink 653b494a.0 isn't present, use this command to create a symlink:

      ``# ln -s Baltimore_CyberTrust_Root.pem 653b494a.0``


## Outbound connectivity for Site Recovery URLs or IP ranges (error code 151037 or 151072)

For Site Recovery replication to work, outbound connectivity to specific URLs or IP ranges is required from the VM. If your VM is behind a firewall or uses network security group (NSG) rules to control outbound connectivity, you might see one of these error messages:

**Error codes** | **Possible causes** | **Recommendations**
--- | --- | ---
151037<br></br>**Message**:  Failed to register Azure virtual machine with Site Recovery. | You're using NSG rules to control outbound access on the VM and the required IP ranges aren't whitelisted for outbound access.<br></br>You're using third-party firewall tools and the required URLs or IP ranges aren't whitelisted.<br></br>The required trusted root certificates used for authorization and authentication aren't present on the machine. | If you use NSG rules to control outbound access on the VM, whitelist the Azure datacenter IP ranges of the location where the VM is running and the target location. For example, if your VM is running in East US and the target region is Central US, you need to whitelist all the East US and Central US IP ranges. For information, see the latest [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).<br></br>If you use third-party firewall tools, whitelist the URLs in the documentation or whitelist the Azure datacenter IP ranges of the location where the VM is running and the target location.<br></br>For a VM running the Windows operating system, ensure that the trusted root certificates are present on the machine. For information, see [Configure trusted roots and disallowed certificates](https://technet.microsoft.com/library/dn265983.aspx).<br></br>For a VM running the Linux operating system, follow the guidance for trusted root certificates published by the Linux operating system version distributor.
151072<br></br>**Message**: Site Recovery configuration failed. | A connection can't be established to Site Recovery service endpoints. | If you use a firewall proxy to control outbound network connectivity on the VM, ensure that the prerequisite URLs or datacenter IP ranges are whitelisted. For information, see [firewall proxy guidance](https://aka.ms/a2a-firewall-proxy-guidance). <br></br>If you use NSG rules to control outbound network connectivity on the VM, ensure that the prerequisite datacenter IP ranges are whitelisted. For information, see [network security group guidance](https://aka.ms/a2a-nsg-guidance).

### Fix the problem
Follow the steps in the [networking guidance document](site-recovery-azure-to-azure-networking-guidance.md) to whitelist [the required URLs](site-recovery-azure-to-azure-networking-guidance.md#outbound-connectivity-for-azure-site-recovery-urls) or the [required IP ranges](site-recovery-azure-to-azure-networking-guidance.md#outbound-connectivity-for-azure-site-recovery-ip-ranges).


## Next steps
- [Replicate Azure virtual machines](site-recovery-replicate-azure-to-azure.md)
