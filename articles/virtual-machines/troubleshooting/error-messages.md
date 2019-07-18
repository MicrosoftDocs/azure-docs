---
title: Common VM error codes in Azure | Microsoft Docs
description: Understand some of the common error codes encountered when you provision and manage virtual machines in Azure
services: virtual-machines
documentationcenter: ''
author: xujing-ms
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.topic: troubleshooting
ms.workload: infrastructure
ms.date: 5/22/2017
ms.author: xujing

---
# Understand common error messages when you manage virtual machines in Azure

This article describes some of the most common error codes and messages you may encounter when you create or manage virtual machines (VMs) in Azure.

>[!NOTE]
> You can leave comments on this page for feedback or through [Azure feedback](https://feedback.azure.com/forums/216843-virtual-machines) with #azerrormessage tag.

## Error Response Format 
Azure VMs use the following JSON format for error response:

```json
{
  "status": "status code",
  "error": {
    "code":"Top level error code",
    "message":"Top level error message",
    "details":[
     {
      "code":"Inner evel error code",
      "message":"Inner level error message"
     }
    ]
   }
}
```

An error response always includes a status code and an error object. Each error object always contains an error code and a message. If the VM is created with a template, the error object also contains a details section that contains an inner level of error codes and message. Normally, the most inner level of error message is the root failure.


## Common virtual machine management errors

This section lists the common error messages you may encounter when managing VMs:

|  Error Code  |  Error Message  |  
|  :------| :-------------|  
|  AcquireDiskLeaseFailed  |  Failed to acquire lease while creating disk '{0}' using blob with URI {1}. Blob is already in use.  |  
|  AllocationFailed  |  Allocation failed. Please try reducing the VM size or number of VMs, retry later, or try deploying to a different Availability Set or different Azure location.  |  
|  AllocationFailed  |  The VM allocation failed due to an internal error. Please retry later or try deploying to a different location.  |
|  ArtifactNotFound  |  The VM extension with publisher '{0}' and type '{1}' could not be found in location '{2}'.  |
|  ArtifactNotFound  |  Extension with publisher '{0}', type '{1}', and type handler version '{2}' could not be found in the extension repository.  |
|  ArtifactVersionNotFound  |  No version found in the artifact repository that satisfies the requested version '{0}'.  |
|  ArtifactVersionNotFound  |  No version found in the artifact repository that satisfies the requested version '{0}' for VM extension with publisher '{1}' and type '{2}'.  |
|  AttachDiskWhileBeingDetached  |  Cannot attach data disk '{0}' to VM '{1}' because the disk is currently being detached. Please wait until the disk is completely detached and then try again.  |
|  BadRequest  |  Aligned' Availability Sets are not yet supported in this region.  |
|  BadRequest  |  Addition of a VM with managed disks to non-managed Availability Set or addition of a VM with blob based disks to managed Availability Set is not supported. Please create an Availability Set with 'managed' property set in order to add a VM with managed disks to it.  |
|  BadRequest  |  Managed Disks are not supported in this region.  |
|  BadRequest  |  Multiple VMExtensions per handler not supported for OS type '{0}'. VMExtension '{1}' with handler '{2}' already added or specified in input.  |
|  BadRequest  |  Operation '{0}' is not supported on Resource '{1}' with managed disks.  |
|  CertificateImproperlyFormatted  |  The secret's JSON representation retrieved from {0} has a data field which is not a properly formatted PFX file, or the password provided does not decode the PFX file correctly.  |
|  CertificateImproperlyFormatted  |  The data retrieved from {0} is not deserializable into JSON.  |
|  Conflict  |  Disk resizing is allowed only when creating a VM or when the VM is deallocated.  |
|  ConflictingUserInput  |  Disk '{0}' cannot be attached as the disk is already owned by VM '{1}'.  |
|  ConflictingUserInput  |  Source and destination resource groups are the same.  |
|  ConflictingUserInput  |  Source and destination storage accounts for disk {0} are different.  |
|  ContainerAlreadyOnLease  |  There is already a lease on the storage container holding the blob with URI {0}.  |
|  CrossSubscriptionMoveWithKeyVaultResources  |  The Move resources request contains KeyVault resources which are referenced by one or more {0}s in the request. This is not supported currently in Cross subscription Move. Please check the error details for the KeyVault resource Ids.  |
|  DiagnosticsOperationInternalError  |  An internal error occurred while processing diagnostics profile of VM {0}.  |
|  DiskBlobAlreadyInUseByAnotherDisk  |  Blob {0} is already in use by another disk belonging to VM '{1}'. You can examine the blob metadata for the disk reference information.  |
|  DiskBlobNotFound  |  Unable to find VHD blob with URI {0} for disk '{1}'.  |
|  DiskBlobNotFound  |  Unable to find VHD blob with URI {0}.  |
|  DiskEncryptionKeySecretMissingTags  |  {0} secret doesn't have the {1} tags. Please update the secret version, add the required tags and retry.  |
|  DiskEncryptionKeySecretUnwrapFailed  |  Unwrap of secret {0} value using key {1} failed.  |
|  DiskImageNotReady  |  Disk image {0} is in {1} state. Please retry when image is ready.  |
|  DiskPreparationError  |  One or more errors occurred while preparing VM disks. See disk instance view for details.  |
|  DiskProcessingError  |  Disk processing halted as the VM has other disks in failed disks.  |
|  ImageBlobNotFound  |  Unable to find VHD blob with URI {0} for disk '{1}'.  |
|  ImageBlobNotFound  |  Unable to find VHD blob with URI {0}.  |
|  IncorrectDiskBlobType  |  Disk blobs can only be of type page blob. Blob {0} for disk '{1}' is of type block blob.  |
|  IncorrectDiskBlobType  |  Disk blobs can only be of type page blob. Blob {0} is of type '{1}'.  |
|  IncorrectImageBlobType  |  Disk blobs can only be of type page blob. Blob {0} for disk '{1}' is of type block blob.  |
|  IncorrectImageBlobType  |  Disk blobs can only be of type page blob. Blob {0} is of type '{1}'.  |
|  InternalOperationError  |  Could not resolve storage account {0}. Please ensure it was created through the Storage Resource Provider in the same location as the compute resource.  |
|  InternalOperationError  |  {0} goal seeking tasks failed.  |
|  InternalOperationError  |  Error occurred in validating the network profile of VM '{0}'.  |
|  InvalidAccountType  |  The AccountType {0} is invalid.  |
|  InvalidParameter  |  The value of parameter {0} is invalid.  |
|  InvalidParameter  |  The Admin password specified is not allowed.  |
|  InvalidParameter  |  "The supplied password must be between {0}-{1} characters long and must satisfy at least {2} of password complexity requirements from the following: <ol><li> Contains an uppercase character</li><li>Contains a lowercase character</li><li>Contains a numeric digit</li><li>Contains a special character.</li></ol>  |
|  InvalidParameter  |  The Admin Username specified is not allowed.  |
|  InvalidParameter  |  Cannot attach an existing OS disk if the VM is created from a platform or user image.  |
|  InvalidParameter  |  Container name {0} is invalid. Container names must be 3-63 characters in length and may contain only lower-case alphanumeric characters and hyphen. Hyphen must be preceded and followed by an alphanumeric character.  |
|  InvalidParameter  |  Container name {0} in URL {1} is invalid. Container names must be 3-63 characters in length and may contain only lower-case alphanumeric characters and hyphen. Hyphen must be preceded and followed by an alphanumeric character.  |
|  InvalidParameter  |  The blob name in URL {0} contains a slash. This is presently not supported for disks.  |
|  InvalidParameter  |  The URI {0} does not look to be correct blob URI.  |
|  InvalidParameter  |  A disk named '{0}' already uses the same LUN: {1}.  |
|  InvalidParameter  |  A disk named '{0}' already exists.  |
|  InvalidParameter  |  Cannot specify user image overrides for a disk already defined in the specified image reference.  |
|  InvalidParameter  |  A disk named '{0}' already uses the same VHD URL {1}.  |
|  InvalidParameter  |  The specified fault domain count {0} must fall in the range {1} to {2}.  |
|  InvalidParameter  |  The license type {0} is invalid. Valid license types are: Windows_Client or Windows_Server, case sensitive.  |
|  InvalidParameter  |  Linux host name cannot exceed {0} characters in length or contain the following characters: {1}.  |
|  InvalidParameter  |  Destination path for Ssh public keys is currently limited to its default value {0}  due to a known issue in Linux provisioning agent.  |
|  InvalidParameter  |  A disk at LUN {0} already exists.  |
|  InvalidParameter  |  Subscription {0} of the request must match the subscription {1} contained in the managed disk id.  |
|  InvalidParameter  |  Custom data in OSProfile must be in Base64 encoding and with a maximum length of {0} characters.  |
|  InvalidParameter  |  Blob name in URL {0} must end with '{1}' extension.  |
|  InvalidParameter  |  {0}' is not a valid captured VHD blob name prefix. A valid prefix matches regex '{1}'.  |
|  InvalidParameter  |  Certificates cannot be added to your VM if the VM agent is not provisioned.  |
|  InvalidParameter  |  A disk at LUN {0} already exists.  |
|  InvalidParameter  |  Unable to create the VM because the requested size {0} is not available in the cluster where the availability set is currently allocated. The available sizes are: {1}. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  |
|  InvalidParameter  |  The requested VM size {0} is not available in the current region. The sizes available in the current region are: {1}. Find out more on the available VM sizes in each region at https://aka.ms/azure-regions.  |
|  InvalidParameter  |  The requested VM size {0} is not available in the current region. Find out more on the available VM sizes in each region at https://aka.ms/azure-regions.  |
|  InvalidParameter  |  Windows admin user name cannot be more than {0} characters long, end with a period(.), or contain the following characters: {1}.  |
|  InvalidParameter  |  Windows computer name cannot be more than {0} characters long, be entirely numeric, or contain the following characters: {1}.  |
|  MissingMoveDependentResources  |  The move resources request does not contain all the dependent resources. Please check error details for missing resource ids.  |
|  MoveResourcesHaveInvalidState  |  The Move Resources request contains VMs which are associated with invalid storage accounts. Please check details for these resource ids and referenced storage account names.  |
|  MoveResourcesHavePendingOperations  |  The move resources request contains resources for which an operation is pending. Please check details for these resource ids. Retry your operation once the pending operations complete.  |
|  MoveResourcesNotFound  |  The move resources request contains resources that cannot be found. Please check details for these resource ids.  |
|  NetworkingInternalOperationError  |  Unknown network allocation error.  |
|  NetworkingInternalOperationError  |  Unknown network allocation error  |
|  NetworkingInternalOperationError  |  An internal error occurred in processing network profile of the VM.  |
|  NotFound  |  The Availability Set {0} cannot be found.  |
|  NotFound  |  Source Virtual Machine '{0}' specified in the request does not exist in this Azure location.  |
|  NotFound  |  Tenant with id {0} not found.  |
|  NotFound  |  The Image {0} cannot be found.  |
|  NotSupported  |  The license type is {0}, but the image blob {1} is not from on-premises.  |
|  OperationNotAllowed  |  Availability Set {0} cannot be deleted. Before deleting an Availability Set please ensure that it does not contain any VM.  |
|  OperationNotAllowed  |  Changing availability set SKU from 'Aligned' to 'Classic' is not allowed.  |
|  OperationNotAllowed  |  Cannot modify extensions in the VM when the VM is not running.  |
|  OperationNotAllowed  |  The Capture action is only supported on a Virtual Machine with blob based disks. Please use the 'Image' resource APIs to create an Image from a managed Virtual Machine.  |
|  OperationNotAllowed  |  The resource {0} cannot be created from Image {1} until Image has been successfully created.  |
|  OperationNotAllowed  |  Updates to encryptionSettings is not allowed when VM is allocated, Please retry after VM is deallocated  |
|  OperationNotAllowed  |  Addition of a managed disk to a VM with blob based disks is not supported.  |
|  OperationNotAllowed  |  The maximum number of data disks allowed to be attached to a VM of this size is {0}.  |
|  OperationNotAllowed  |  Addition of a blob based disk to VM with managed disks is not supported.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on Image '{1}' since the Image is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete).  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is generalized.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed as Restore point collection '{1}' is marked for deletion.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM extension '{1}' since it is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete).  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed since the Virtual Machines '{1}' are being provisioned using the Image '{2}'.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed since the Virtual Machine ScaleSet '{1}' is currently using the Image '{2}'.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete).  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is either deallocated or marked to be deallocated.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is running. Please power off explicitly in case you shut down the VM from inside the guest operating system.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is not deallocated.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since VM has extension '{2}' in failed state.  |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since another operation is in progress.  |
|  OperationNotAllowed  |  The operation '{0}' requires the Virtual Machine '{1}' to be Generalized.  |
|  OperationNotAllowed  |  The operation requires the VM to be running (or set to run).  |
|  OperationNotAllowed  |  Disk with size {0}GB, which is smaller than the size {1}GB of corresponding disk in Image, is not allowed.  |
|  OperationNotAllowed  |  VM Scale Set extensions of handler '{0}' can be added only at the time of VM Scale Set creation.  |
|  OperationNotAllowed  |  VM Scale Set extensions of handler '{0}' can be deleted only at the time of VM Scale Set deletion.  |
|  OperationNotAllowed  |  VM '{0}' is already using managed disks.  |
|  OperationNotAllowed  |  VM '{0}' belongs to 'Classic' availability set '{1}'. Please update the availability set to use 'Aligned' SKU and then retry the Conversion.  |
|  OperationNotAllowed  |  VM created from Image cannot have blob based disks. All disks have to be managed disks.  |
|  OperationNotAllowed  |  Capture operation cannot be completed because the VM is not generalized.  |
|  OperationNotAllowed  |  Management operations on VM '{0}' are disallowed because VM disks are being converted to managed disks.  |
|  OperationNotAllowed  |  An ongoing operation is changing power state of Virtual Machine {0} to {1}. Please perform operation {2} after some time.  |
|  OperationNotAllowed  |  Unable to add or update the VM. The requested VM size {0} may not be available in the existing allocation unit. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  |
|  OperationNotAllowed  |  Unable to resize the VM because the requested size {0} is not available in the cluster where the availability set is currently allocated. The available sizes are: {1}. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  |
|  OperationNotAllowed  |  Unable to resize the VM because the requested size {0} is not available in the cluster where the VM is currently allocated. To resize your VM to {1} please deallocate (this is Stop operation in the Azure portal) and try the resize operation again. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  |
|  OSProvisioningClientError  |  OS Provisioning failed for VM '{0}' because the guest OS is currently being provisioned.  |
|  OSProvisioningClientError  |  OS provisioning for VM '{0}' failed. Error details: {1} Make sure the image has been properly prepared (generalized). <ul><li>Instructions for Windows: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/  </li></ul> |
|  OSProvisioningClientError  |  SSH host key generation failed. Error details: {0}. To resolve this issue verify if Linux agent is set up properly. <ul><li>You can check the instructions at : https://docs.microsoft.com/azure/virtual-machines/extensions/agent-linux/ </li></ul> |
|  OSProvisioningClientError  |  Username specified for the VM is invalid for this Linux distribution. Error details: {0}.  |
|  OSProvisioningInternalError  |  OS Provisioning failed for VM '{0}' due to an internal error.  |
|  OSProvisioningTimedOut  |  OS Provisioning for VM '{0}' did not finish in the allotted time. The VM may still finish provisioning successfully. Please check provisioning state later.  |
|  OSProvisioningTimedOut  |  OS Provisioning for VM '{0}' did not finish in the allotted time. The VM may still finish provisioning successfully. Please check provisioning state later. Also, make sure the image has been properly prepared (generalized).   <ul><li>Instructions for Windows: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/ </li><li> Instructions for Linux: https://azure.microsoft.com/documentation/articles/virtual-machines-linux-capture-image/</li></ul>  |
|  OSProvisioningTimedOut  |  OS Provisioning for VM '{0}' did not finish in the allotted time. However, the VM guest agent was detected running. This suggests the guest OS has not been properly prepared to be used as a VM image (with CreateOption=FromImage). To resolve this issue, either use the VHD as is with CreateOption=Attach or prepare it properly for use as an image:   <ul><li>Instructions for Windows: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/ </li><li> Instructions for Linux: https://azure.microsoft.com/documentation/articles/virtual-machines-linux-capture-image/</li></ul>  |
|  OverConstrainedAllocationRequest  |  The required VM size is not currently available in the selected location.  |
|  ResourceUpdateBlockedOnPlatformUpdate  |  Resource cannot be updated at this time due to ongoing platform update. Please try again later.  |
|  StorageAccountLimitation  |  Storage account '{0}' does not support page blobs which are required to create disks.  |
|  StorageAccountLimitation  |  Storage account '{0}' has exceeded its allocated quota.  |
|  StorageAccountLocationMismatch  |  Could not resolve storage account {0}. Please ensure it was created through the Storage Resource Provider in the same location as the compute resource.  |
|  StorageAccountNotFound  |  Storage account {0} not found. Ensure storage account is not deleted and belongs to the same Azure location as the VM.  |
|  StorageAccountNotRecognized  |  Please use a storage account managed by Storage Resource Provider. Use of {0} is not supported.  |
|  StorageAccountOperationInternalError  |  Internal error occurred while accessing storage account {0}.  |
|  StorageAccountSubscriptionMismatch  |  Storage account {0} doesn't belong to subscription {1}.  |
|  StorageAccountTooBusy  |  Storage account '{0}' is too busy currently. Consider using another account.  |
|  StorageAccountTypeNotSupported  |  Disk {0} uses {1} which is a Blob storage account. Please retry with General purpose storage account.  |
|  StorageAccountTypeNotSupported  |  Storage account {0} is of {1} type. Boot Diagnostics supports {2} storage account types.  <ul><li>This error occurs if you use the premium storage account for Boot diagnostics. For more information, see [How to use boot diagnostics](boot-diagnostics.md). </li></ul> |
|  SubscriptionNotAuthorizedForImage  |  The subscription is not authorized.  |
|  TargetDiskBlobAlreadyExists  |  Blob {0} already exists. Please provide a different blob URI to create a new blank data disk '{1}'.  |
|  TargetDiskBlobAlreadyExists  |  Capture operation cannot continue because target image blob {0} already exists and the flag to overwrite VHD blobs is not set. Either delete the blob or set the flag to overwrite VHD blobs and retry.  |
|  TargetDiskBlobAlreadyExists  |  Capture operation cannot continue because target image blob {0} has an active lease on it.   |
|  TargetDiskBlobAlreadyExists  |  Blob {0} already exists. Please provide a different blob URI as target for disk '{1}'.  |
|  TooManyVMRedeploymentRequests  |  Too many redeployment requests have been received for VM '{0}' or the VMs in the same availabilityset with this VM. Please retry later.  |
|  VHDSizeInvalid  |  The specified disk size value of {0} for disk '{1}' with blob {2} is invalid. Disk size must be between {3} and {4}.  |
|  VMAgentStatusCommunicationError  |  VM '{0}' has not reported status for VM agent or extensions. Please verify the VM has a running VM agent, and can establish outbound connections to Azure storage.  |
|  VMArtifactRepositoryInternalError  |  An error occurred while communicating with the artifact repository to retrieve VM artifact details.  |
|  VMArtifactRepositoryInternalError  |  An internal error occurred while retrieving the VM artifact data from the artifact repository.  |
|  VMExtensionHandlerNonTransientError  |  Handler '{0}' has reported failure for VM Extension '{1}' with terminal error code '{2}' and error message: '{3}'  |
|  VMExtensionManagementInternalError  |  Internal error occurred while processing VM extension '{0}'.  |
|  VMExtensionManagementInternalError  |  Multiple errors occurred while preparing the VM extensions. See VM extension instance view for details.  |
|  VMExtensionProvisioningError  |  VM has reported a failure when processing extension '{0}'. Error message: "{1}".  |
|  VMExtensionProvisioningError  |  Multiple VM extensions failed to be provisioned on the VM. Please see the VM extension instance view for details.  |
|  VMExtensionProvisioningTimeout  |  Provisioning of VM extension '{0}' has timed out. Extension installation may be taking too long, or extension status could not be obtained.  |
|  VMMarketplaceInvalidInput  |  Creating a virtual machine from a non Marketplace image does not need Plan information, please remove the Plan information in the request. OS disk name is {0}.  |
|  VMMarketplaceInvalidInput  |  The purchase information does not match. Unable to deploy from the Marketplace image. OS disk name is {0}.  |
|  VMMarketplaceInvalidInput  |  Creating a virtual machine from Marketplace image requires Plan information in the request. OS disk name is {0}.  |
|  VMNotFound  |  The VM '{0}' cannot be found.  |
|  VMRedeploymentFailed  |  VM '{0}' redeployment failed due to an internal error. Please retry later.  |
|  VMRedeploymentTimedOut  |  Redeployment of VM '{0}' didn't finish in the allotted time. It might finish successfully in sometime. Else, you can retry the request.  |
|  VMStartTimedOut  |  VM '{0}' did not start in the allotted time. The VM may still start successfully. Please check the power state later.  |


## Next steps
If you need more help, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.