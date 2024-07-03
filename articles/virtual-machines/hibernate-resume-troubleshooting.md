---
title: Troubleshoot hibernation in Azure
description: Learn how to troubleshoot VM hibernation.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: how-to
ms.date: 05/16/2024
ms.author: jainan
ms.reviewer: mattmcinnes
---

# Troubleshooting hibernation in Azure

Hibernating a virtual machine allows you to persist the VM state to the OS disk. This article describes how to troubleshoot issues with the hibernation feature, issues creating hibernation enabled VMs, and issues with hibernating a VM.

For information specific to Linux VMs, check out the [Linux VM hibernation troubleshooting guide](./linux/hibernate-resume-troubleshooting-linux.md).

For information specific to Windows VMs, check out the [Windows VM hibernation troubleshooting guide](./windows/hibernate-resume-troubleshooting-windows.md).

## Unable to create a VM with hibernation enabled
If you're unable to create a VM with hibernation enabled, ensure that you're using a VM size, OS version that supports Hibernation. Refer to the supported VM sizes, OS versions section in the user guide and the limitations section for more details. Here are some common error codes that you might observe:

| ResultCode | Error Message | Action |
|--|--|--|
| OperationNotAllowed | The referenced os disk should support hibernation for a VM with hibernation capability. | Validate that the OS disk has hibernation support enabled. |
| OperationNotAllowed | The referenced platform image should support hibernation for a VM with hibernation capability. | Use a platform image that supports hibernation. |
| OperationNotAllowed | The referenced shared gallery image should support hibernation for a VM with hibernation capability. | Validate that the Shared Gallery Image Definition has hibernation support enabled |
| OperationNotAllowed | Hibernation capability isn't supported for Spot VMs. |  |
| OperationNotAllowed | User VM Image isn't supported for a VM with Hibernation capability. | Use a platform image or Shared Gallery Image if you want to use the hibernation feature |
| OperationNotAllowed | Referencing a Dedicated Host isn't supported for a VM with Hibernation capability. |  |
| OperationNotAllowed | Referencing a Capacity Reservation Group isn't supported for a VM with Hibernation capability. |  |
| OperationNotAllowed | Hibernation can't be enabled on Virtual Machine since the OS Disk Size ({0} bytes) should at least be greater than the VM memory ({1} bytes). | Ensure the OS disk has enough space to be able to persist the RAM contents once the VM is hibernated |
| OperationNotAllowed | Hibernation can't be enabled on Virtual Machines created in an Availability Set. | Hibernation is only supported for standalone VMs & Virtual Machine Scale Sets Flex VMs |


## Unable to hibernate a VM

If you're unable to hibernate a VM, first check whether hibernation is enabled on the VM. For example, using the GET VM API, you can check if hibernation is enabled on the VM

```
    "properties": {
        "vmId": "XXX",
        "hardwareProfile": {
            "vmSize": "Standard_D4s_v5"
        },
        "additionalCapabilities": {
            "hibernationEnabled": true
        },
```
If hibernation is enabled on the VM, check if hibernation is successfully enabled in the guest OS.

For Linux guests, check out the [Linux VM hibernation troubleshooting guide](./linux/hibernate-resume-troubleshooting-linux.md).

For Windows guests, check out the [Windows VM hibernation troubleshooting guide](./windows/hibernate-resume-troubleshooting-windows.md).


## Common error codes
| ResultCode | errorDetails | Action |
|--|--|--|
| InternalOperationError | The fabric operation failed. | This is usually a transient issue. Retry the Hibernate operation after 5mins. |
| OperationNotAllowed | Operation 'HibernateAndDeallocate' isn't allowed on VM 'Z0000ZYH000' since VM has extension 'AzureHibernateExtension' in failed state | Customer issue. Confirm that VM creation with hibernation enabled  succeeded, and that the extension is in a healthy state |
| OperationNotAllowed | The Hibernate-Deallocate Operation can only be triggered on a VM that is successfully provisioned and is running. | Customer error. Ensure that the VM is successfully running before attempting to Hibernate-Deallocate the VM. |
| OperationNotAllowed | The Hibernate-Deallocate Operation can only be triggered on a VM that is enabled for hibernation. Enable the property additionalCapabilities.hibernationEnabled during VM creation, or after stopping and deallocating the VM. | Customer error. |
| VMHibernateFailed | Hibernating the VM 'hiber_vm_res_5' failed due to an internal error. Retry later. | Retry after 5mins. If it continues to fail after multiple retries, check if the guest is correctly configured to support hibernation or contact Azure support. |
| VMHibernateNotSupported | The VM 'Z0000ZYJ000' doesn't support hibernation. Ensure that the VM is correctly configured to support hibernation. | Hibernating a VM immediately after boot isn't supported. Retry hibernating the VM after a few minutes. |


## Unable to resume a VM
Starting a hibernated VM is similar to starting a stopped VM. In addition to commonly seen issues while starting VMs, certain issues are specific to starting a hibernated VM.

| ResultCode | errorDetails |
|--|--|--|
| OverconstrainedResumeFromHibernatedStateAllocationRequest | Allocation failed. VM(s) with the following constraints can't be allocated, because the condition is too restrictive. Remove some constraints and try again. Constraints applied are: Networking Constraints (such as Accelerated Networking or IPv6), Resuming from hibernated state (retry starting the VM after some time or alternatively stop-deallocate the VM and try starting the VM again). |
| AllocationFailed | VM allocation failed from hibernated state due to insufficient capacity. Try again later or alternatively stop-deallocate the VM and try starting the VM. |
