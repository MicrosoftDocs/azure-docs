<properties
	pageTitle="Frequently asked questions for Azure Stack | Microsoft Azure"
	description="Azure Stack frequently asked questions."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/01/2016"
	ms.author="erikje"/>

# Frequently asked questions for Azure Stack


## Deployment

### Do I need to delete TiP accounts in Azure Active Directory (AAD) before restarting a POC installation?

No, new accounts will be created as needed. It is also possible to share the same AAD for several POC installations.

### What are the changes made in Azure Active Directory by the Azure Stack POC deployment script?

The script will create two AAD accounts for every installation. One is used by TiP to simulate service admin role and the other is TiP's tenant admin. For the first installation, it will add three applications, "AzureStack.local-Api", "AzureStack.local-Monitoring" and "AzureStack.local-Portal". If your security department has concerns regarding that, you may create a separate directory or even a use a separate subscription

### Do I need to format my data disks before starting or restarting an installation?

Disks should just be in raw format. However, if your Azure Stack installation fails for some reason and you start over by re-installing the operating system and you get an error saying not enough disks, remember to check if the old storage pool is still presented and delete. To do this do the following.

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

While Storage Spaces Direct supports NVMe disks, with “POC” we are only supporting a subset of the possible drive types and combinations possible for Storage Spaces Direct. 

More specifically, the deployment script does not support NVMe based on the way bus types are discovered. While it is possible to edit the deployment script to make it run, keep in mind we would recommend using the disks/bus types combinations that have been tested for this release.

Note that is only related to  the single-host TP1 “POC” installation. We added a comment to clarify this on User Voice. The limitations and architecture used to run the POC on a single box are not reflective of the architecture and capabilities that will be available as we provide releases of Azure Stack that can run on multiple nodes and scale beyond the single box POC.

### Where can I find the Product Key to enter during Boot from VHD?

You can use [this Datacenter key](https://technet.microsoft.com/library/mt126134.aspx).

This can be done during the first boot from VHD, or after installation (if you opt out during the first boot).

## PaaS resource providers

### Is there an offline installation method for the Web Apps resource provider?  

Not at this time.

## Tenant

### Can I deploy my own images as a tenant?

Yes, just like in Azure, a tenant can upload images in Azure Stack, in addition to using the images from the service administrator. For an overview, see the [Deploying your own images as a tenant blog post](http://www.danielstechblog.de/microsoft-azure-stack-deploying-your-own-images-as-a-tenant/). 

## Testing

### Can I test usage data at this stage with TP1?

In TP1, there is only usage data reported for Storage resources and you can expect to see more services going forward. 

There is a REST API that any Azure Stack subscriber can call to get their own usage data. There are also REST APIs for providers to call to get data for their customers. You can also just call Get-UsageAggregates on PowerShell as an easier way than calling the API directly. It will ask to supply a start time and end time, and will report the data in either hourly or daily aggregation. It is actually consistent with Azure so you can check the online documentation for Azure Usage PowerShell for more instructions.


### Can I use Nested Virtualization to test the Microsoft Azure Stack POC?

It is possible to deploy Microsoft Azure Stack POC TP1 leveraging Nested Virtualization and, just like some of our customers, we’ve also experimented Azure Stack deployments with it. We understand it’s also a way to work around some of the hardware requirements. Please note however that Nested Virtualization is a recently introduced feature and as is documented here is known to have potential performance and stability issues. Additionally, the networking layer in Azure Stack is more complex than a flat network and when you start introducing MAC spoofing and other layers in addition to potential performance impact at the storage layer it becomes complex. In other words, we are definitely open to hear about your feedback and experience leveraging Nested Virtualization with Azure Stack, but remember this is not one of the configurations we’ve thoroughly tested or are fully supporting with this release.

## Virtual machines

### Does Azure Stack support dynamic disks for virtual machines?

Azure Stack does not support dynamic disks.



## Next steps

[Troubleshooting](azure-stack-troubleshooting.md)
