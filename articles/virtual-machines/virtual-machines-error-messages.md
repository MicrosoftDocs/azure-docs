---
title: Azure Virtual Machine Error Messages
description: 
services: virtual-machines
documentationcenter: ''
author: xujing-ms
manager: timlt
editor: ''

ms.assetid: ''
ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 3/17/2017
ms.author: xujing

---
# Azure Virtual Machine Error Messages
This article describes the common error codes and messages you encounter when managing an Azure Virtual Machine(VM).  

>[!NOTE]
>Leave comments on this page for error meesgae feedback or through [Azure feedback](https://feedback.azure.com/forums/216843-virtual-machines) with #azerrormessage tag.
>
>

## Error Response Format 
Azure VM uses the following JSON format for error response. The error response consists of a status code, error code, and error message. If the VM deployment is created through a template, then the error is split between a top level error code and inner level error code. The most inner level of error message is often the root cause of failure. 
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

## Common Virtual Machine Management Error

This section lists the common error messages for managing your virtual machine



|  Error Code  |  Error Message  | Description |
|  :------| :-------------|  :--------- |
|  AcquireDiskLeaseFailed  |  Failed to acquire lease while creating disk '{0}' using blob with URI {1}. Blob is already in use.  | test |
|  AllocationFailed  |  Allocation failed. Please try reducing the VM size or number of VMs, retry later, or try deploying to a different Availability Set or different Azure location.  | test |
|  AllocationFailed  |  The VM allocation failed due to an internal error. Please retry later or try deploying to a different location.  | test |
|  ArtifactNotFound  |  The VM extension with publisher '{0}' and type '{1}' could not be found in location '{2}'.  | test |
|  ArtifactNotFound  |  Extension with publisher '{0}', type '{1}', and type handler version '{2}' could not be found in the extension repository.  | test |
|  ArtifactVersionNotFound  |  No version found in the artifact repository that satisfies the requested version '{0}'.  | test |
|  ArtifactVersionNotFound  |  No version found in the artifact repository that satisfies the requested version '{0}' for VM extension with publisher '{1}' and type '{2}'.  | test |
|  AttachDiskWhileBeingDetached  |  Cannot attach data disk '{0}' to VM '{1}' because the disk is currently being detached. Please wait until the disk is completely detached and then try again.  | test |
|  BadRequest  |  Aligned' Availability Sets are not yet supported in this region.  | test |
|  BadRequest  |  Addition of a VM with managed disks to non-managed Availability Set or addition of a VM with blob based disks to managed Availability Set is not supported. Please create an Availability Set with 'managed' property set in order to add a VM with managed disks to it.  | test |
|  BadRequest  |  Managed Disks are not supported in this region.  | test |
|  BadRequest  |  Multiple VMExtensions per handler not supported for OS type '{0}'. VMExtension '{1}' with handler '{2}' already added or specified in input.  | test |
|  BadRequest  |  Operation '{0}' is not supported on Resource '{1}' with managed disks.  | test |
|  CertificateImproperlyFormatted  |  The secret's JSON representation retrieved from {0} has a data field which is not a properly formatted PFX file, or the password provided does not decode the PFX file correctly.  | test |
|  CertificateImproperlyFormatted  |  The data retrieved from {0} is not deserializable into JSON.  | test |
|  Conflict  |  Disk resizing is allowed only when creating a VM or when the VM is deallocated.  | test |
|  ConflictingUserInput  |  Disk '{0}' cannot be attached as the disk is already owned by VM '{1}'.  | test |
|  ConflictingUserInput  |  Source and destination resource groups are the same.  | test |
|  ConflictingUserInput  |  Source and destination storage accounts for disk {0} are different.  | test |
|  ContainerAlreadyOnLease  |  There is already a lease on the storage container holding the blob with URI {0}.  | test |
|  CrossSubscriptionMoveWithKeyVaultResources  |  The Move resources request contains KeyVault resources which are referenced by one or more {0}s in the request. This is not supported currently in Cross subscription Move. Please check the error details for the KeyVault resource Ids.  | test |
|  DiagnosticsOperationInternalError  |  An internal error occurred while processing diagnostics profile of VM {0}.  | test |
|  DiskBlobAlreadyInUseByAnotherDisk  |  Blob {0} is already in use by another disk belonging to VM '{1}'. You can examine the blob metadata for the disk reference information.  | test |
|  DiskBlobNotFound  |  Unable to find VHD blob with URI {0} for disk '{1}'.  | test |
|  DiskBlobNotFound  |  Unable to find VHD blob with URI {0}.  | test |
|  DiskEncryptionKeySecretMissingTags  |  {0} secret doesn't have the {1} tags. Please update the secret version, add the required tags and retry.  | test |
|  DiskEncryptionKeySecretUnwrapFailed  |  Unwrap of secret {0} value using key {1} failed.  | test |
|  DiskImageNotReady  |  Disk image {0} is in {1} state. Please retry when image is ready.  | test |
|  DiskPreparationError  |  One or more errors occurred while preparing VM disks. See disk instance view for details.  | test |
|  DiskProcessingError  |  Disk processing halted as the VM has other disks in failed disks.  | test |
|  ImageBlobNotFound  |  Unable to find VHD blob with URI {0} for disk '{1}'.  | test |
|  ImageBlobNotFound  |  Unable to find VHD blob with URI {0}.  | test |
|  IncorrectDiskBlobType  |  Disk blobs can only be of type page blob. Blob {0} for disk '{1}' is of type block blob.  | test |
|  IncorrectDiskBlobType  |  Disk blobs can only be of type page blob. Blob {0} is of type '{1}'.  | test |
|  IncorrectImageBlobType  |  Disk blobs can only be of type page blob. Blob {0} for disk '{1}' is of type block blob.  | test |
|  IncorrectImageBlobType  |  Disk blobs can only be of type page blob. Blob {0} is of type '{1}'.  | test |
|  InternalOperationError  |  Could not resolve storage account {0}. Please ensure it was created through the Storage Resource Provider in the same location as the compute resource.  | test |
|  InternalOperationError  |  {0} goal seeking tasks failed.  | test |
|  InternalOperationError  |  Error occurred in validating the network profile of VM '{0}'.  | test |
|  InvalidAccountType  |  The AccountType {0} is invalid.  | test |
|  InvalidParameter  |  The value of parameter {0} is invalid.  | test |
|  InvalidParameter  |  The Admin password specified is not allowed.  | test |
|  InvalidParameter  |  "The supplied password must be between {0}-{1} characters long and must satisfy at least {2} of password complexity requirements from the following: <ol><li> Contains an uppercase character</li><li>Contains a lowercase character</li><li>Contains a numeric digit</li><li>Contains a special character.</li></ol>  | test |
|  InvalidParameter  |  The Admin Username specified is not allowed.  | test |
|  InvalidParameter  |  Cannot attach an existing OS disk if the VM is created from a platform or user image.  | test |
|  InvalidParameter  |  Container name {0} is invalid. Container names must be 3-63 characters in length and may contain only lower-case alphanumeric characters and hyphen. Hyphen must be preceeded and followed by an alphanumeric character.  | test |
|  InvalidParameter  |  Container name {0} in URL {1} is invalid. Container names must be 3-63 characters in length and may contain only lower-case alphanumeric characters and hyphen. Hyphen must be preceeded and followed by an alphanumeric character.  | test |
|  InvalidParameter  |  The blob name in URL {0} contains a slash. This is presently not supported for disks.  | test |
|  InvalidParameter  |  The URI {0} does not look to be correct blob URI.  | test |
|  InvalidParameter  |  A disk named '{0}' already uses the same LUN: {1}.  | test |
|  InvalidParameter  |  A disk named '{0}' already exists.  | test |
|  InvalidParameter  |  Cannot specify user image overrides for a disk already defined in the specified image reference.  | test |
|  InvalidParameter  |  A disk named '{0}' already uses the same VHD URL {1}.  | test |
|  InvalidParameter  |  The specified fault domain count {0} must fall in the range {1} to {2}.  | test |
|  InvalidParameter  |  The license type {0} is invalid. Valid license types are: Windows_Client or Windows_Server, case sensitive.  | test |
|  InvalidParameter  |  Linux host name cannot exceed {0} characters in length or contain the following characters: {1}.  | test |
|  InvalidParameter  |  Destination path for Ssh public keys is currently limited to its default value {0}  due to a known issue in Linux provisioning agent.  | test |
|  InvalidParameter  |  A disk at LUN {0} already exists.  | test |
|  InvalidParameter  |  Subscription {0} of the request must match the subscription {1} contained in the managed disk id.  | test |
|  InvalidParameter  |  Custom data in OSProfile must be in Base64 encoding and with a maximum length of {0} characters.  | test |
|  InvalidParameter  |  Blob name in URL {0} must end with '{1}' extension.  | test |
|  InvalidParameter  |  {0}' is not a valid captured VHD blob name prefix. A valid prefix matches regex '{1}'.  | test |
|  InvalidParameter  |  Certificates cannot be added to your VM if the VM agent is not provisioned.  | test |
|  InvalidParameter  |  A disk at LUN {0} already exists.  | test |
|  InvalidParameter  |  Unable to create the VM because the requested size {0} is not available in the cluster where the availability set is currently allocated. The available sizes are: {1}. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  | test |
|  InvalidParameter  |  The requested VM size {0} is not available in the current region. The sizes available in the current region are: {1}. Find out more on the available VM sizes in each region at https://aka.ms/azure-regions.  | test |
|  InvalidParameter  |  The requested VM size {0} is not available in the current region. Find out more on the available VM sizes in each region at https://aka.ms/azure-regions.  | test |
|  InvalidParameter  |  Windows admin user name cannot be more than {0} characters long, end with a period(.), or contain the following characters: {1}.  | test |
|  InvalidParameter  |  Windows computer name cannot be more than {0} characters long, be entirely numeric, or contain the following characters: {1}.  | test |
|  MissingMoveDependentResources  |  The move resources request does not contain all the dependent resources. Please check error details for missing resource ids.  | test |
|  MoveResourcesHaveInvalidState  |  The Move Resources request contains VMs which are associated with invalid storage accounts. Please check details for these resource ids and referenced storage account names.  | test |
|  MoveResourcesHavePendingOperations  |  The move resources request contains resources for which an operation is pending. Please check details for these resource ids. Retry your operation once the pending operations complete.  | test |
|  MoveResourcesNotFound  |  The move resources request contains resources that cannot be found. Please check details for these resource ids.  | test |
|  NetworkingInternalOperationError  |  Unknown network allocation error.  | test |
|  NetworkingInternalOperationError  |  Unknown network allocation error  | test |
|  NetworkingInternalOperationError  |  An internal error occurred in processing network profile of the VM.  | test |
|  NotFound  |  The Availability Set {0} cannot be found.  | test |
|  NotFound  |  Source Virtual Machine '{0}' specified in the request does not exist in this Azure location.  | test |
|  NotFound  |  Tenant with id {0} not found.  | test |
|  NotFound  |  The Image {0} cannot be found.  | test |
|  NotSupported  |  The license type is {0}, but the image blob {1} is not from on-premises.  | test |
|  OperationNotAllowed  |  Availability Set {0} cannot be deleted. Before deleting an Availability Set please ensure that it does not contain any VM.  | test |
|  OperationNotAllowed  |  Changing availability set SKU from 'Aligned' to 'Classic' is not allowed.  | test |
|  OperationNotAllowed  |  Cannot modify extensions in the VM when the VM is not running.  | test |
|  OperationNotAllowed  |  The Capture action is only supported on a Virtual Machine with blob based disks. Please use the 'Image' resource APIs to create an Image from a managed Virtual Machine.  | test |
|  OperationNotAllowed  |  The resource {0} cannot be created from Image {1} until Image has been successfully created.  | test |
|  OperationNotAllowed  |  Updates to encryptionSettings is not allowed when VM is allocated, Please retry after VM is deallocated  | test |
|  OperationNotAllowed  |  Addition of a managed disk to a VM with blob based disks is not supported.  | test |
|  OperationNotAllowed  |  The maximum number of data disks allowed to be attached to a VM of this size is {0}.  | test |
|  OperationNotAllowed  |  Addition of a blob based disk to VM with managed disks is not supported.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on Image '{1}' since the Image is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete).  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is generalized.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed as Restore point collection '{1}' is marked for deletion.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM extension '{1}' since it is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete).  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed since the Virtual Machines '{1}' are being provisioned using the Image '{2}'.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed since the Virtual Machine ScaleSet '{1}' is currently using the Image '{2}'.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete).  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is either deallocated or marked to be deallocated.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is running. Please power off explicitly in case you shut down the VM from inside the guest operating system.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since the VM is not deallocated.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since VM has extension '{2}' in failed state.  | test |
|  OperationNotAllowed  |  Operation '{0}' is not allowed on VM '{1}' since another operation is in progress.  | test |
|  OperationNotAllowed  |  The operation '{0}' requires the Virtual Machine '{1}' to be Generalized.  | test |
|  OperationNotAllowed  |  The operation requires the VM to be running (or set to run).  | test |
|  OperationNotAllowed  |  Disk with size {0}GB, which is smaller than the size {1}GB of corresponding disk in Image, is not allowed.  | test |
|  OperationNotAllowed  |  VM Scale Set extensions of handler '{0}' can be added only at the time of VM Scale Set creation.  | test |
|  OperationNotAllowed  |  VM Scale Set extensions of handler '{0}' can be deleted only at the time of VM Scale Set deletion.  | test |
|  OperationNotAllowed  |  VM '{0}' is already using managed disks.  | test |
|  OperationNotAllowed  |  VM '{0}' belongs to 'Classic' availability set '{1}'. Please update the availability set to use 'Aligned' SKU and then retry the Conversion.  | test |
|  OperationNotAllowed  |  VM created from Image cannot have blob based disks. All disks have to be managed disks.  | test |
|  OperationNotAllowed  |  Capture operation cannot be completed because the VM is not generalized.  | test |
|  OperationNotAllowed  |  Management operations on VM '{0}' are disallowed because VM disks are being converted to managed disks.  | test |
|  OperationNotAllowed  |  An ongoing operation is changing power state of Virtual Machine {0} to {1}. Please perform operation {2} after some time.  | test |
|  OperationNotAllowed  |  Unable to add or update the VM. The requested VM size {0} may not be available in the existing allocation unit. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  | test |
|  OperationNotAllowed  |  Unable to resize the VM because the requested size {0} is not available in the cluster where the availability set is currently allocated. The available sizes are: {1}. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  | test |
|  OperationNotAllowed  |  Unable to resize the VM because the requested size {0} is not available in the cluster where the VM is currently allocated. To resize your VM to {1} please deallocate (this is Stop operation in the Azure portal) and try the resize operation again. Read more on VM resizing strategy at https://aka.ms/azure-resizevm.  | test |
|  OSProvisioningClientError  |  OS Provisioning failed for VM '{0}' because the guest OS is currently being provisioned.  | test |
|  OSProvisioningClientError  |  OS provisioning for VM '{0}' failed. Error details: {1} Make sure the image has been properly prepared (generalized). <ul><li>Instructions for Windows: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/  </li></ul> | test |
|  OSProvisioningClientError  |  SSH host key generation failed. Error details: {0}. To resolve this issue verify if Linux agent is set up properly. <ul><li>You can check the instructions at : https://azure.microsoft.com/documentation/articles/virtual-machines-linux-agent-user-guide/ </li></ul> | test |
|  OSProvisioningClientError  |  Username specified for the VM is invalid for this Linux distribution. Error details: {0}.  | test |
|  OSProvisioningInternalError  |  OS Provisioning failed for VM '{0}' due to an internal error.  | test |
|  OSProvisioningTimedOut  |  OS Provisioning for VM '{0}' did not finish in the allotted time. The VM may still finish provisioning successfully. Please check provisioning state later.  | test |
|  OSProvisioningTimedOut  |  OS Provisioning for VM '{0}' did not finish in the allotted time. The VM may still finish provisioning successfully. Please check provisioning state later. Also, make sure the image has been properly prepared (generalized).   <ul><li>Instructions for Windows: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/ </li><li> Instructions for Linux: https://azure.microsoft.com/documentation/articles/virtual-machines-linux-capture-image/</li></ul>  | test |
|  OSProvisioningTimedOut  |  OS Provisioning for VM '{0}' did not finish in the allotted time. However, the VM guest agent was detected running. This suggests the guest OS has not been properly prepared to be used as a VM image (with CreateOption=FromImage). To resolve this issue, either use the VHD as is with CreateOption=Attach or prepare it properly for use as an image:   <ul><li>Instructions for Windows: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-upload-image/ </li><li> Instructions for Linux: https://azure.microsoft.com/documentation/articles/virtual-machines-linux-capture-image/</li></ul>  | test |
|  OverConstrainedAllocationRequest  |  The required VM size is not currently available in the selected location.  | test |
|  ResourceUpdateBlockedOnPlatformUpdate  |  Resource cannot be updated at this time due to ongoing platform update. Please try again later.  | test |
|  StorageAccountLimitation  |  Storage account '{0}' does not support page blobs which are required to create disks.  | test |
|  StorageAccountLimitation  |  Storage account '{0}' has exceeded its allocated quota.  | test |
|  StorageAccountLocationMismatch  |  Could not resolve storage account {0}. Please ensure it was created through the Storage Resource Provider in the same location as the compute resource.  | test |
|  StorageAccountNotFound  |  Storage account {0} not found. Ensure storage account is not deleted and belongs to the same Azure location as the VM.  | test |
|  StorageAccountNotRecognized  |  Please use a storage account managed by Storage Resource Provider. Use of {0} is not supported.  | test |
|  StorageAccountOperationInternalError  |  Internal error occurred while accessing storage account {0}.  | test |
|  StorageAccountSubscriptionMismatch  |  Storage account {0} doesn't belong to subscription {1}.  | test |
|  StorageAccountTooBusy  |  Storage account '{0}' is too busy currently. Consider using another account.  | test |
|  StorageAccountTypeNotSupported  |  Disk {0} uses {1} which is a Blob storage account. Please retry with General purpose storage account.  | test |
|  StorageAccountTypeNotSupported  |  Storage account {0} is of {1} type. Boot Diagnostics supports {2} storage account types.  | test |
|  SubscriptionNotAuthorizedForImage  |  The subscription is not authorized.  | test |
|  TargetDiskBlobAlreadyExists  |  Blob {0} already exists. Please provide a different blob URI to create a new blank data disk '{1}'.  | test |
|  TargetDiskBlobAlreadyExists  |  Capture operation cannot continue because target image blob {0} already exists and the flag to overwrite VHD blobs is not set. Either delete the blob or set the flag to overwrite VHD blobs and retry.  | test |
|  TargetDiskBlobAlreadyExists  |  Capture operation cannot continue because target image blob {0} has an active lease on it.   | test |
|  TargetDiskBlobAlreadyExists  |  Blob {0} already exists. Please provide a different blob URI as target for disk '{1}'.  | test |
|  TooManyVMRedeploymentRequests  |  Too many redeployment requests have been received for VM '{0}' or the VMs in the same availabilityset with this VM. Please retry later.  | test |
|  VHDSizeInvalid  |  The specified disk size value of {0} for disk '{1}' with blob {2} is invalid. Disk size must be between {3} and {4}.  | test |
|  VMAgentStatusCommunicationError  |  VM '{0}' has not reported status for VM agent or extensions. Please verify the VM has a running VM agent, and can establish outbound connections to Azure storage.  | test |
|  VMArtifactRepositoryInternalError  |  An error occurred while communicating with the artifact repository to retrieve VM artifact details.  | test |
|  VMArtifactRepositoryInternalError  |  An internal error occurred while retrieving the VM artifact data from the artifact repository.  | test |
|  VMExtensionHandlerNonTransientError  |  Handler '{0}' has reported failure for VM Extension '{1}' with terminal error code '{2}' and error message: '{3}'  | test |
|  VMExtensionManagementInternalError  |  Internal error occurred while processing VM extension '{0}'.  | test |
|  VMExtensionManagementInternalError  |  Multiple errors occured while preparing the VM extensions. See VM extension instance view for details.  | test |
|  VMExtensionProvisioningError  |  VM has reported a failure when processing extension '{0}'. Error message: "{1}".  | test |
|  VMExtensionProvisioningError  |  Multiple VM extensions failed to be provisioned on the VM. Please see the VM extension instance view for details.  | test |
|  VMExtensionProvisioningTimeout  |  Provisioning of VM extension '{0}' has timed out. Extension installation may be taking too long, or extension status could not be obtained.  | test |
|  VMMarketplaceInvalidInput  |  Creating a virtual machine from a non Marketplace image does not need Plan information, please remove the Plan information in the request. OS disk name is {0}.  | test |
|  VMMarketplaceInvalidInput  |  The purchase information does not match. Unable to deploy from the Marketplace image. OS disk name is {0}.  | test |
|  VMMarketplaceInvalidInput  |  Creating a virtual machine from Marketplace image requires Plan information in the request. OS disk name is {0}.  | test |
|  VMNotFound  |  The VM '{0}' cannot be found.  | test |
|  VMRedeploymentFailed  |  VM '{0}' redeployment failed due to an internal error. Please retry later.  | test |
|  VMRedeploymentTimedOut  |  Redeployment of VM '{0}' didn't finish in the allotted time. It might finish successfully in sometime. Else, you can retry the request.  | test |
|  VMStartTimedOut  |  VM '{0}' did not start in the allotted time. The VM may still start successfully. Please check the power state later.  | test |
