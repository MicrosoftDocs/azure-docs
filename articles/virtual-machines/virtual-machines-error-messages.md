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
