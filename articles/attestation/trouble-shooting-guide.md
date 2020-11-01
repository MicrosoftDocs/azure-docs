---
title: Troubleshoot issues
description: Trouble shooting guide to the commonly observed issues
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: reference
ms.date: 07/20/2020
ms.author: mbaldwin


---

# Microsoft Azure Attestation troubleshooting guide

Error handling in Azure Attestation is implemented following [Microsoft REST API guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses). The error response returned by Azure Attestation APIs contains HTTP status code and name/value pairs with the names “code” and “message”. The value of “code” is human-readable and is an indicator of the type of error. The value of “message” intends to aid the user and provides error details.

If your issue is not addressed in this article, you can also submit an Azure support request on the [Azure support page](https://azure.microsoft.com/support/options/).

Below are some examples of the errors returned by Azure Attestation:

## HTTP – 401 : Unauthorized exception

### HTTP status code
401

### Error code
Unauthorized

### Scenarios
Examples:
  - Attestation failure if the user is not assigned with Attestation Reader role
  - Unable to manage attestation policies as the user is not assigned with appropriate roles
  - Unable to manage attestation policy signers as the user is not assigned with appropriate roles
  
### Message
User with Reader role trying to edit an attestation policy in PowerShell 

  ```powershell
  Set-AzAttestationPolicy : Operation returned HTTP Status Code 401
At line:1 char:1
+ Set-AzAttestationPolicy -Name $attestationProvider -ResourceGroupName ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : CloseError: (:) [Set-AzAttestationPolicy], RestException
    + FullyQualifiedErrorId : Microsoft.Azure.Commands.Attestation.SetAzureAttestationPolicy
  ```

### Troubleshooting steps

In order to view attestation policies/policy signers, an Azure AD user requires the permission for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read

  This permission can be assigned to an AD user through a role such as "Owner" (wildcard permissions) or "Reader" (wildcard permissions) or "Attestation Reader" (specific         permissions for Azure Attestation only).

In order to add/delete policy signers or to configure policies, an Azure AD user requires the following permissions for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/write
- Microsoft.Attestation/attestationProviders/attestation/delete

  These permissions can be assigned to an AD user through a role such as "Owner" (wildcard permissions), "Contributor" (wildcard permissions) or "Attestation Contributor"         (specific permissions for Azure Attestation only).

Customers can choose to use the default provider for attestation, or create their own providers with custom policies. "Owner" (wildcard permissions) or "Reader" (wildcard permissions) or "Attestation Reader" role is required to send attestation requests to custom providers. The default providers are accessible by any Azure AD user.

#### PowerShell

To verify the roles in PowerShell, please run below:
- Launch PowerShell and log into Azure via the "Connect-AzAccount" cmdlet
- Verify your RBAC role assignment settings. 

  ```powershell
  $c = Get-AzContext
  Get-AzRoleAssignment -ResourceGroupName $attestationResourceGroup -ResourceName $attestationProvider -ResourceType Microsoft.Attestation/attestationProviders -SignInName $c.Account.Id
  ```

  You should see something like this:

  ```
  RoleAssignmentId   :/subscriptions/subscriptionId/providers/Microsoft.Authorization/roleAssignments/roleAssignmentId
  
  Scope              : /subscriptions/subscriptionId
  
  DisplayName        : displayName
  
  SignInName         : signInName
  
  RoleDefinitionName : Reader
  
  RoleDefinitionId   : roleDefinitionId
  
  ObjectId           : objectid
  
  ObjectType         : User
  
  CanDelegate        : False
 
  ```

If you don't find an appropriate role assignment in the list, follow the instructions in [here](/azure/role-based-access-control/role-assignments-powershell)

## Az.Attestation installation issues in PowerShell

Unable to install Az or Az.Attestation modules in PowerShell

### Error

WARNING: Unable to resolve package source 'https://www.powershellgallery.com/api/v2' 
PackageManagement\Install-Package : No match was found for the specified search criteria and module name

### Troubleshooting steps

PowerShell Gallery has deprecated Transport Layer Security (TLS) versions 1.0 and 1.1. 

TLS 1.2 or a later version is recommended. 

To continue to interact with the PowerShell Gallery, run the following command before the Install-Module commands

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

## Policy access/configuration issues in PowerShell

User assigned with appropriate roles. But facing authorization issues while managing attestation policies through PowerShell.

### Error
The client with object id <object Id>  does not have authorization to perform action Microsoft.Authorization/roleassignments/write over scope ‘subcriptions/<subscriptionId>resourcegroups/secure_enclave_poc/providers/Microsoft.Authorization/roleassignments/<role assignmentId>’ or the scope is invalid. If access was recently granted, please refresh your credentials

### Troubleshooting steps

Minimum version of Az modules required to support attestation operations are the below: 

 Az 4.5.0 
 
 Az.Accounts 1.9.2  Az.Attestation 0.1.8 

Run the below command to verify the installed version of all Az modules 

```powershell
Get-InstalledModule 
```

If the versions are not matching with the minimum requirement, run Update-Module commands

e.g. - Update-Module -Name Az.Attestation
