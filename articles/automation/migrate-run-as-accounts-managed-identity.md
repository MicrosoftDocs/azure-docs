---
title: Migrate run as accounts to managed identity in Azure Automation account
description: This article describes how to migrate from run as accounts to managed identity.
services: automation
ms.subservice: process-automation
ms.date: 04/27/2022
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Migrate from existing Run As accounts to managed identity

> [!IMPORTANT]
> Azure Automation Run As Account will retire on **September 30, 2023**, and there will be no support provided beyond this date. From now through **September 30, 2023**, you can continue to use the Azure Automation Run As Account. However, we recommend you to transition to [managed identities](/automation-security-overview.md#managed-identities) before **September 30, 2023**. See the official announcement here.

 Run As accounts in Azure Automation provide authentication for managing Azure Resource Manager resources or resources deployed on the classic deployment model. Whenever a Run As account is created, an Azure AD application is registered, and a self-signed certificate will be generated which will be valid for one year. This adds an overhead of renewing the certificate every year before it expires to prevent the Automation account to stop working. 

Automation accounts can now be configured to use [Managed Identity](/automation/automation-security-overview#managed-identities) which is the default option when an Automation account is created. With this feature, Automation account can authenticate to Azure resources without the need to exchange any credentials, hence removing the overhead of renewing the certificate or managing the service principal.

Managed identity can be [system assigned]( /automation/enable-managed-identity-or-automation) or [user assigned](/automation/add-user-assigned-identity). However, when a new Automation account is created, a system assigned managed identity is enabled.

## Prerequisites

Ensure the following to migrate from the Run As account to Managed identities:

1. Create a [system-assigned](enable-managed-identity-for-automation.md) or [user-assigned](add-user-assigned-identity.md), or both types of managed identities. To learn more about the differences between the two types of managed identities, see [Managed Identity Types](/active-directory/managed-identities-azure-resources/overview#managed-identity-types).

    > [!NOTE]
    > - User-assigned identities are supported for cloud jobs only. It isn't possible to use the Automation Account's User Managed Identity on a Hybrid Runbook Worker. To use hybrid jobs, you must create a System-assigned identities. </br>
    > - There are two ways to use the Managed Identities in Hybrid Runbook Worker scripts. Either the System-assigned Managed Identity for the Automation account **OR** VM Managed Identity for an Azure VM running as a Hybrid Runbook Worker. </br>
    > - Both the VM's User-assigned Managed Identity or the VM's system assigned Managed Identity will **NOT** work in an Automation account that is configured with an Automation account Managed Identity. When you enable the Automation account Managed Identity, you can only use the Automation Account System-Assigned Managed Identity and not the VM Managed Identity. 

1. Assign same role to the managed identity to access the Azure resources matching the Run As account. Follow the steps in [Check role assignment for Azure Automation Run As account](/automation/manage-run-as-account#check-role-assignment-for-azure-automation-run-as-account).
Ensure that you don't assign high privilege permissions like Contributor, Owner and so on to Run as account. Follow the RBAC guidelines to limit the permissions from the default Contributor permissions assigned to Run As account using this [script](/azure/automation/manage-runas-account#limit-run-as-account-permissions). 

   For example, if the Automation account is only required to start or stop an Azure VM, then the permissions assigned to the Run As account needs to be only for starting or stopping the VM. Similarly, assign read-only permissions if a runbook is reading from blob storage. Read more about [Azure Automation security guidelines](/azure/automation/automation-security-guidelines#authentication-certificate-and-identities). 

## Migrate from Automation Run As account to Managed Identity

To migrate from an Automation Run As account to a Managed Identity for your runbook authentication, follow the steps below:
   
1. Change the runbook code to use managed identity. We recommend that you test the managed identity to verify if the runbook works as expected by creating a copy of your production runbook to use managed identity. Update your test runbook code to authenticate by using the managed identities. This ensures that you don't override the AzureRunAsConnection in your production runbook and break the existing Automation. After you are sure that the runbook code executes as expected using the Managed Identities, update your production runbook to use managed identities.

    For Managed Identity support, use the Az cmdlet Connect-AzAccount cmdlet. use the Az cmdlet `Connect-AzAccount` cmdlet. See [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) in the PowerShell reference.

    - If you are using Az modules, update to the latest version following the steps in the [Update Azure PowerShell modules](automation-update-azure-modules.md#update-az-modules) article. 
    - If you are using AzureRM modules, Update `AzureRM.Profile` to latest version and replace using  `Add-AzureRMAccount` cmdlet with `Connect-AzureRMAccount –Identity`.
    
    Follow the sample scripts below to know the change required to the runbook code to use Managed Identities

1. Once you are sure that the runbook is executing successfully by using managed identities, you can safely [delete the Run as account](/azure/automation/delete-run-as-account) if the Run as account is not used by any other runbook.

## Sample scripts

Following are the examples of a runbook that fetches the ARM resources using the Run As Account (Service Principal) and  managed identity.

# [Run As account](#tab/run-as-account)

```powershell
  $connectionName = "AzureRunAsConnection"
  try
  {
      # Get the connection "AzureRunAsConnection "
      $servicePrincipalConnection=Get-AutomationConnection -Name $connectionName         

      "Logging in to Azure..."
      Add-AzureRmAccount `
          -ServicePrincipal `
          -TenantId $servicePrincipalConnection.TenantId `
          -ApplicationId $servicePrincipalConnection.ApplicationId `
          -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint 
  }
  catch {
      if (!$servicePrincipalConnection)
      {
          $ErrorMessage = "Connection $connectionName not found."
          throw $ErrorMessage
      } else{
          Write-Error -Message $_.Exception
          throw $_.Exception
      }
  }

  #Get all ARM resources from all resource groups
  $ResourceGroups = Get-AzureRmResourceGroup 

  foreach ($ResourceGroup in $ResourceGroups)
  {    
      Write-Output ("Showing resources in resource group " + $ResourceGroup.ResourceGroupName)
      $Resources = Find-AzureRmResource -ResourceGroupNameContains $ResourceGroup.ResourceGroupName | Select ResourceName, ResourceType
      ForEach ($Resource in $Resources)
      {
          Write-Output ($Resource.ResourceName + " of type " +  $Resource.ResourceType)
      }
      Write-Output ("")
  } 
  ```

# [System-assigned Managed identity](#tab/sa-managed-identity)

>[!NOTE]
> Enable appropriate RBAC permissions to the system identity of this automation account. Otherwise, the runbook may fail.

  ```powershell
  {
      "Logging in to Azure..."
      Connect-AzAccount -Identity
  }
  catch {
      Write-Error -Message $_.Exception
      throw $_.Exception
  }

  #Get all ARM resources from all resource groups
  $ResourceGroups = Get-AzResourceGroup

  foreach ($ResourceGroup in $ResourceGroups)
  {    
      Write-Output ("Showing resources in resource group " + $ResourceGroup.ResourceGroupName)
      $Resources = Get-AzResource -ResourceGroupName $ResourceGroup.ResourceGroupName
      foreach ($Resource in $Resources)
      {
          Write-Output ($Resource.Name + " of type " +  $Resource.ResourceType)
      }
      Write-Output ("")
  }
  ```
# [User-assigned Managed identity](#tab/ua-managed-identity)

```powershell
{ 

    "Logging in to Azure..." 

$identity = Get-AzUserAssignedIdentity -ResourceGroupName <myResourceGroup> -Name <myUserAssignedIdentity> 
Connect-AzAccount -Identity -AccountId $identity.ClientId 
} 
catch { 
    Write-Error -Message $_.Exception 
    throw $_.Exception 
} 
#Get all ARM resources from all resource groups 
$ResourceGroups = Get-AzResourceGroup 
foreach ($ResourceGroup in $ResourceGroups) 
{     
    Write-Output ("Showing resources in resource group " + $ResourceGroup.ResourceGroupName) 
    $Resources = Get-AzResource -ResourceGroupName $ResourceGroup.ResourceGroupName 
    foreach ($Resource in $Resources) 
    { 
        Write-Output ($Resource.Name + " of type " +  $Resource.ResourceType) 
    } 
    Write-Output ("") 
}
```
---

## Next steps

- If your runbooks aren't completing successfully, review [Troubleshoot Azure Automation managed identity issues](troubleshoot/managed-identity.md).

- Learn more about system assigned managed identity, see [Using a system-assigned managed identity for an Azure Automation account](enable-managed-identity-for-automation.md)

- Learn more about user assigned managed identity, see [Using a user-assigned managed identity for an Azure Automation account]( add-user-assigned-identity.md)

- For an overview of Azure Automation account security, see [Automation account authentication overview](automation-security-overview.md).

- Review the Frequently asked questions for [Migrating to Managed Identities](automation-managed-identity-faq.md).


 