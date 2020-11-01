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

### Message

### Scenarios
Examples:
  - Attestation failure if the user is not assigned with Attestation Reader role
  - Unable to manage attestation policies as the user is not assigned with appropriate roles
  - Unable to manage attestation policy signers as the user is not assigned with appropriate roles

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

  RoleAssignmentId   :/subscriptions/<subscriptionId>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentId>
  
  Scope              : /subscriptions/<subscriptionId>
  
  DisplayName        : <displayName>
  
  SignInName         : <signInName>
  
  RoleDefinitionName : Reader
  
  RoleDefinitionId   : <RoleDefinitionId>
  
  ObjectId           : <Objectid>
  
  ObjectType         : User
  
  CanDelegate        : False
 
- If you don't find an appropriate role assignment in the list, follow the instructions in 
here

## HTTP – 400
