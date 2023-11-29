---
title: VM Security Options
description: Review Azure CycleCloud VM security options. See options for Confidential VMs, Trusted Launch, and other security features.
author: dougclayton
ms.date: 11/20/2023
ms.author: doclayto
---

# Virtual Machine Security Configuration

CycleCloud 8.5 supports creating VMs with a security type of either [Trusted Launch](https://go.microsoft.com/fwlink/?LinkId=2153371) or [Confidential](https://aka.ms/ConfidentialVM).

> [!NOTE]
> Use of these features may come with some limitations, which include not supporting back up, managed disks, and ephemeral OS disks. In addition, they require specific images and VM sizes. See the documentation above for more information.

These features can be modified in the [cluster form](./create-cluster.md#standard-cluster-sections) or set directly on the [cluster template](cluster-templates.md).

The primary attribute that enables this is `SecurityType`, which can be `TrustedLaunch` or `ConfidentialVM`. 
For example, to make every VM in the cluster use Trusted Launch by default, add this to your template:

``` ini
[[node defaults]]
# Start VMs with TrustedLaunch 
SecurityType = TrustedLaunch
```

*Standard* security is the default so it does not need to be specified. If you have given a value for `SecurityType` and imported your cluster, you can simply comment out or remove that line and re-import the cluster to remove the value. 
If you set a value on `defaults` and want to use Standard security just for some specific node, you can override the value with `undefined()` (note the use of `:=` to enable strict parsing of the value):

``` ini
[[node standard-node]]
# Clear an inherited value
SecurityType := undefined()
```

The use of either Trusted Launch or Confidential VMs enables other security features, both defaulting to true:

* `EnableSecureBoot=true`: Uses *Secure Boot*, which helps protect your VMs against boot kits, rootkits, and kernel-level malware.

* `EnableVTPM=true`: Uses *Virtual Trusted Platform Module* (vTPM), which is TPM2.0 compliant and validates your VM boot integrity apart from securely storing keys and secrets. 

> [!NOTE] 
> These attributes have no effect with the default Standard security type.

In addition, Confidential VMs enable a new [disk encryption scheme](https://learn.microsoft.com/azure/confidential-computing/confidential-vm-overview#confidential-os-disk-encryption).
This scheme protects all critical partitions of the disk and makes the protected disk content accessible only to the VM. Similar to Server-Side Encryption, the default is *Platform-Managed Keys* but you can use *Customer-Managed Keys* instead. 
Use of Customer-Managed Keys for Confidential encryption requires a *Disk Encryption Set* whose encryption type is `ConfidentialVmEncryptedWithCustomerKey`. See [Disk Encryption](./mount-disk.md#disk-encryption) for more.

