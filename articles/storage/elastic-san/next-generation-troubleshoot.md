---
title: Troubleshoot Azure Elastic SAN Next Generation
description: Troubleshoot Azure Elastic SAN Next Generation provisioning, direct-attach connectivity, performance, autoscale, and snapshot issues.
author: normesta
ms.service: azure-elastic-san
ms.topic: how-to
ms.date: 11/06/2026
ms.author: normesta
# Customer intent: As a cloud storage administrator, I want to troubleshoot Azure Elastic SAN Next Generation issues, so that I can resolve provisioning, connectivity, performance, and data protection problems.
---

# Troubleshoot Azure Elastic SAN Next Generation

This article lists common issues for Azure Elastic SAN Next Generation and provides possible causes and resolutions for portal, provisioning, Direct Attach, performance, autoscale, and snapshot scenarios.

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Before you troubleshoot

- Confirm that you completed the [Elastic SAN Next Generation preview prerequisites](next-generation-create.md#prerequisites).
- Confirm the SAN is Elastic SAN Next Generation (V2).
- An existing Linux or Windows VM in the same region as the volume. For zonal resources, the VM and volume must also be in the same availability zone.
- For Business Critical volumes confirm the required Ultra Disk compatibility to be enabled on the VM.
- Record the UTC time, correlation ID, resource IDs, region, and full error message.

> [!NOTE]
> For General Purpose iSCSI volumes, also see [Troubleshoot Azure Elastic SAN](elastic-san-troubleshoot.md). The existing Elastic SAN troubleshooting article covers host and iSCSI-specific issues such as connection scripts, login failures, network configuration, session limits, CRC protection, and unexpected performance or latency.

## Elastic SAN Next Generation isn't available

### Possible cause

The feature registration might still need approval or you might have selected the wrong subscription.

### Resolution

- Verify `ElasticSanPlusAccess` and `ESANDataDiskAttach` are **Registered**.
- Select the registered subscription.

## Networking or encryption options are unexpected

### Possible cause

Public network rules apply to iSCSI, not Direct Attach. Customer-managed keys aren't ready for Direct Attach.

### Resolution

- Check the connection type.
- For iSCSI, configure network rules and supported customer-managed key settings.
- For General Purpose iSCSI connection failures or host configuration issues, follow [Troubleshoot Azure Elastic SAN](elastic-san-troubleshoot.md).
- For Direct Attach, use platform-managed keys and troubleshoot the Compute attachment instead of iSCSI networking.

## A volume cannot be created

### Possible cause

The request can exceed the SAN's autoscale maximum or total volumes' provisioned capacity exceeds five times of SAN's provisioned capacity. 

### Resolution

- Confirm total volumes' provisioned capacity stays within five times of SAN's provisioned capacity. Increase SAN capacity if needed.
- If SAN capacity is at **Max scale up**, increase the scale-up limit.

## A Direct Attach volume can't be attached to a VM

### Possible cause

The volume might not be ready, the VM and volume placement might be incompatible, or the VM might not have an available LUN or data disk slot. A Business Critical volume also requires an Ultra Disk-compatible VM with Ultra Disk compatibility enabled.

### Resolution

- Confirm `ESANDataDiskAttach` is **Registered**.
- Confirm the volume group uses `DirectAttach`.
- Confirm the volume provisioning state is **Succeeded**.
- Confirm the VM and volume are in the same region and, for zonal resources, the same availability zone.
- Confirm that the VM is compatible with the volumes, and has a free LUN and available data disk capacity.
- For a Business Critical volume, use a VM that supports Ultra Disk. Stop the VM, enable Ultra Disk compatibility, and restart the VM before retrying the attachment.
- For a General Purpose direct attach volume, use a VM that supports Premium SSD v2. 

## An attached volume isn't available in the guest operating system

### Possible cause

The guest operating system didn't mount the volume or make it available. You might also need to partition and format a new volume.

### Resolution

- On Linux, identify the disk and LUN. If the volume already contains data, mount its existing file system without repartitioning or formatting it. If the volume is empty, partition, format, and mount it. For more information, see [Prepare a new empty data disk in Linux](/azure/virtual-machines/linux/attach-disk-portal?tabs=scsi#prepare-a-new-empty-data-disk-in-linux).
- On Windows, use Disk Management to identify the disk by its size and LUN. If the volume already contains data, bring it online and assign a drive letter without initializing or formatting it. If the volume is empty, initialize it, create a simple volume, and format it. For more information, see [Initialize a new data disk](/azure/virtual-machines/windows/attach-disk-ps#initialize-the-disk).

## An attached SAN volume appears on the Disks page

### Possible cause

A known portal issue can show an Elastic SAN volume as a managed disk while **SAN volumes (preview)** also shows it.

### Resolution

- Use **SAN volumes (preview)** for attach and detach operations.
- Don't delete the volume from **Disks** based only on the displayed managed-disk properties.
- Confirm the resource ID uses `Microsoft.ElasticSan`.
- Collect the VM and volume resource IDs if the duplicate display causes a failure.

## A volume can't be safely detached

### Possible cause

An application or service is using the volume, or a Linux file system on the volume is still mounted.

### Resolution

- On Linux, stop applications that use the volume, remove its entry from `/etc/fstab`, and unmount every file system on the volume before retrying. For more information, see [Detach a data disk from a Linux VM](/azure/virtual-machines/linux/detach-disk).
- On Windows, stop applications and services that use the volume before retrying. For more information, see [Detach a data disk from a Windows VM](/azure/virtual-machines/windows/detach-disk).

## A snapshot can't be exported

### Possible cause

You can't export snapshots in the `InstantAccess` state until they transition to `Available` or `AvailableWithInstantAccess`.

### Resolution

- Check the access state and completion percentage.
- Wait for an exportable state.
- Retry the export.
- Collect the snapshot resource ID, creation time, state, and error if progress stops.
