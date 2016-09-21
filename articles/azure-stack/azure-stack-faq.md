<properties
	pageTitle="Frequently asked questions for Azure Stack | Microsoft Azure"
	description="Azure Stack frequently asked questions."
	services="azure-stack"
	documentationCenter=""
	authors="HeathL17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="helaw"/>

# Frequently asked questions for Azure Stack

## Deployment

### Do I need to format my data disks before starting or restarting an installation?

Disks should just be in raw format. However, if your Azure Stack installation fails for some reason and you start over by re-installing the operating system and you get an error saying not enough disks, remember to check if the old storage pool is still presented and delete. To do this do the following:

1. Open Server Manager.
2. Select Storage Pools.
3. See if a storage pool is listed.
4. Right click on storage pool if listed and enable read / write.
5. Right click on Virtual Hard Disk (Lower left corner) and select delete.
6. Right click on Storage Pool and click delete.
7. Launch Azure Stack script again and verify that the disk verification passes.
8. If not collect logs as described below and post a message for help in this group.

This can also be achieved by running the following script:

```
$pools = Get-StoragePool -IsPrimordial $False -ErrorVariable Err -ErrorAction SilentlyContinue
if ($pools -ne $null) {
  $pools| Set-StoragePool -IsReadOnly $False -ErrorVariable Err -ErrorAction SilentlyContinue
  $pools = Get-StoragePool -IsPrimordial $False -ErrorVariable Err -ErrorAction SilentlyContinue
  $pools | Get-VirtualDisk | Remove-VirtualDisk -Confirm:$False
  $pools | Remove-StoragePool -Confirm:$False
}
```

### Can I use all SSD disks for the storage pool in the POC installation?

Per the “hardware” section of the requirements page in the documentation, this is not supported in this release and will be improved in a future release.

### Can I use NVMe data disks for the Microsoft Azure Stack POC?

While Storage Spaces Direct supports NVMe disks, with Azure Stack Technical Preview 2 we are only supporting a subset of the possible drive types and combinations possible for Storage Spaces Direct. 

More specifically, the deployment script does not support NVMe based on the way bus types are discovered. While it is possible to edit the deployment script to make it run, keep in mind we would recommend using the disks/bus types combinations that have been tested for this release.


## PaaS resource providers

### Is there an offline installation method for the Web Apps resource provider?  

Not at this time.

## Tenant

### Can I deploy my own images as a tenant?

Yes, just like in Azure, a tenant can upload images in Azure Stack, in addition to using the images from the service administrator. For an overview, see the [Adding a VM Image](azure-stack-add-vm-image.md). 

## Testing

### Can I use Nested Virtualization to test the Microsoft Azure Stack POC?

It is possible to deploy Microsoft Azure Stack POC TP2 leveraging Nested Virtualization and, just like some of our customers, we’ve also experimented Azure Stack deployments with it. We understand it’s also a way to work around some of the hardware requirements. Please note however that Nested Virtualization is a recently introduced feature and as is documented here is known to have potential performance and stability issues. Additionally, the networking layer in Azure Stack is more complex than a flat network and when you start introducing MAC spoofing and other layers in addition to potential performance impact at the storage layer it becomes complex. In other words, we are definitely open to hear about your feedback and experience leveraging Nested Virtualization with Azure Stack, but remember this is not one of the configurations we’ve thoroughly tested or are fully supporting with this release.

## Virtual machines

### Does Azure Stack support dynamic disks for virtual machines?

Azure Stack does not support dynamic disks.



## Next steps

[Troubleshooting](azure-stack-troubleshooting.md)
