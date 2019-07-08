---
 title: include file
 description: include file
 services: virtual-machines
 author: axayjo
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/25/2019
 ms.author: akjosh; cynthn
 ms.custom: include file
---


If you run into issues while performing any operations on shared image galleries, image definitions, and image versions, run the failing command again in debug mode. Debug mode is activated by passing the **-debug** switch with CLI and the **-Debug** switch with PowerShell. Once you’ve located the error, follow this document to troubleshoot the errors.


## Unable to create a shared image gallery

Possible causes:

*The gallery name is invalid.*

Allowed characters for Gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes. Change the gallery name and try again. 

*The gallery name is not unique within your subscription.*

Pick another gallery name and try again.


## Unable to create an image definition 

Possible causes:

*image definition name is invalid.*

Allowed characters for image definition are uppercase or lowercase letters, digits, dots, dashes, and periods. Change the image definition name and try again.

*The mandatory properties for creating an image definition are not populated.*

The properties such as name, publisher, offer, sku, and OS type are mandatory. Verify if all the properties are being passed.

Make sure that the **OSType**, either Linux or Windows, of the image definition is the same as the source managed image that you are using to create the image version. 


## Unable to create an image version 

Possible causes:

*Image version name is invalid.*

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion.MinorVersion.Patch*. Change the image version name and try again.

*Source managed image from which the image version is being created is not found.* 

Check if the source image exists and is in the same region as the image version.

*The managed image isn't done being provisioned.*

Make sure the provisioning state of the source managed image is **Succeeded**.

*The target region list does not include the source region.*

The target region list must include the source region of the image version. Make sure you have included the source region in the list of target regions where you want Azure to replicate your image version to.

*Replication to all the target regions not completed.*

Use the **--expand ReplicationStatus** flag to check if the replication to all the specified target regions has been completed. If not, wait up to 6 hours for the job to complete. If it fails, run the command again to create and replicate the image version. If there are a lot of target regions the image version is being replicated to, consider doing the replication in phases.

## Unable to create a VM or a scale set 

Possible causes:

*The user trying to create a VM or virtual machine scale set doesn’t have the read access to the image version.*

Contact the subscription owner and ask them to give read access to the image version or the parent resources (like the shared image gallery or image definition) through [Role Based Access Control](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles) (RBAC). 

*The image version is not found.*

Verify that the region you are trying to create a VM or virtual machine scale in is included in the list of target regions of the image version. If the region is already in the list of target regions, then verify if the replication job has been completed. You can use the **-ReplicationStatus** flag to check if the replication to all the specified target regions has been completed. 

*The VM or virtual machine scale set creation takes a long time.*

Verify that the **OSType** of the image version that you are trying to create the VM or virtual machine scale set from has the same **OSType** of the source managed image that you used to create the image version. 

## Unable to share resources

The sharing of shared image gallery, image definition, and image version resources across subscriptions is enabled using [Role-Based Access Control](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles) (RBAC). 

## Replication is slow

Use the **--expand ReplicationStatus** flag to check if the replication to all the specified target regions has been completed. If not, wait for up to 6 hours for the job to complete. If it fails, trigger the command again to create and replicate the image version. If there are a lot of target regions the image version is being replicated to, consider doing the replication in phases.

## Azure limits and quotas 

[Azure limits and quotas](https://docs.microsoft.com/azure/azure-subscription-service-limits) apply to all shared image gallery, image definition, and image version resources. Make sure you are within the limits for your subscriptions. 



