---
title: VM Security Options
description: Review Azure CycleCloud VM security options. See options for Confidential VMs, Trusted Launch, and other security features.
author: dougclayton
ms.date: 07/01/2025
ms.author: doclayto
---

# Virtual machine security configuration

CycleCloud 8.5 supports creating Vms with a security type of either [Trusted Launch](https://go.microsoft.com/fwlink/?LinkId=2153371) or [Confidential](https://aka.ms/ConfidentialVM).

> [!NOTE]
> Using these features might come with some limitations. These limitations include not supporting backup, managed disks, and ephemeral OS disks. In addition, these features require specific images and VM sizes. For more information, see the documentation in the preceding links.

You can modify these features in the [cluster form](./create-cluster.md#standard-cluster-sections) or set them directly on the [cluster template](cluster-templates.md).

The primary attribute that enables this feature is `SecurityType`, which can be `TrustedLaunch` or `ConfidentialVM`. 
To make every VM in the cluster use Trusted Launch by default, add the following code to your template:

``` ini
[[node defaults]]
# Start VMs with TrustedLaunch 
SecurityType = TrustedLaunch
```

*Standard* security is the default so you don't need to specify it. If you give a value for `SecurityType` and import your cluster, you can comment out or remove that line and re-import the cluster to remove the value. 
If you set a value on `defaults` and want to use Standard security for some specific node, override the value with `undefined()` (use `:=` to enable strict parsing of the value):

``` ini
[[node standard-node]]
# Clear an inherited value
SecurityType := undefined()
```

When you use Trusted Launch or Confidential VMs, you enable other security features that both default to true:

* `EnableSecureBoot=true`: Uses *Secure Boot*, which helps protect your VMs against boot kits, rootkits, and kernel-level malware.

* `EnableVTPM=true`: Uses *Virtual Trusted Platform Module* (vTPM), which is TPM 2.0 compliant and validates your VM boot integrity apart from securely storing keys and secrets. 

> [!NOTE] 
> These attributes have no effect with the default Standard security type.

In addition, Confidential VMs enable a new [disk encryption scheme](/azure/confidential-computing/confidential-vm-overview#confidential-os-disk-encryption).
This scheme protects all critical partitions of the disk and makes the protected disk content accessible only to the VM. Similar to server-side encryption, the default is *Platform-Managed Keys* but you can use *Customer-Managed Keys* instead. 
Use of Customer-Managed Keys for Confidential encryption requires a *Disk Encryption Set* whose encryption type is `ConfidentialVmEncryptedWithCustomerKey`. See [Disk Encryption](./mount-disk.md#disk-encryption) for more.

