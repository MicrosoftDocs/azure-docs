---
title: Managed identities for Automation accounts
description: Learn how to migrate from Automation Run As Accounts to managed identities.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: conceptual
ms.date: 01/18/2023
ms.author: ankitadutta
ms.custom: template-concept
---


# Manage identities for automation accounts

> [!IMPORTANT]
> - Azure Automation Run As Account will retire on September 30, 2023 and will be replaced with Managed Identities. Before that date, you'll need to start migrating your runbooks to use [managed identities](automation-security-overview.md#managed-identities). For more information, see [migrating from an existing Run As accounts to managed identity](https://learn.microsoft.com/azure/automation/migrate-run-as-accounts-managed-identity?tabs=run-as-account#sample-scripts).
> - Delaying the feature has a direct impact on our support burden, as it would cause upgrades of mobility agent to fail. 


This article explains about Managed Identities for automation accounts in ASR. Azure Automation Accounts are used by Azure Site Recovery (ASR) customers to auto-update the agents of their protected virtual machines. ASR creates Azure Automation Run As Accounts when you enable replication via the IaaS VM Blade and Recovery Services Vault. 


## Managed identities in Azure

On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource 
in Azure Active Directory (Azure AD) and using it to obtain Azure AD tokens. 
 
> [!NOTE]
> Managed identities for Azure is the new name for the service formerly known as *Managed Service Identity* (MSI).

**Here are some of the benefits of using managed identities:**

- You don't need to manage credentials. Credentials aren’t even accessible to you.
- You can use managed identities to authenticate to any resource that supports Azure AD authentication, including your own applications.
- Managed identities for Azure resources are free with Azure AD for Azure subscriptions. There's no extra cost.

### Configure managed identities 

You can configure your managed identities through:

- Azure portal
- Azure CLI
- your Azure Resource Manager (ARM) template

When a managed identity is added, deleted, or modified on a running container app, the app doesn't automatically restart and a new revision isn't created.

> [!NOTE]
> For more information about migration cadence and the support timeline for Run As account creation and certificate renewal, see the [frequently asked questions](automation-managed-identity-faq.md).


## Migrate from an existing Run As account to a managed identity

### Portal experience

<content here>


### Sample scripts

The following examples of runbook scripts fetch the Resource Manager resources by using the Run As account (service principal) and the managed identity.

# [Run As account](#tab/run-as-account)

```powershell-interactive
  $connectionName = "AzureRunAsConnection"
  try
  {
      # Get the connection "AzureRunAsConnection"
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

  #Get all Resource Manager resources from all resource groups
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

# [System-assigned managed identity](#tab/sa-managed-identity)

>[!NOTE]
> Enable appropriate RBAC permissions for the system identity of this Automation account. Otherwise, the runbook might fail.

  ```powershell-interactive
  try
  {
      "Logging in to Azure..."
      Connect-AzAccount -Identity
  }
  catch {
      Write-Error -Message $_.Exception
      throw $_.Exception
  }

  #Get all Resource Manager resources from all resource groups
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
# [User-assigned managed identity](#tab/ua-managed-identity)

```powershell-interactive
try
{ 

    "Logging in to Azure..." 

$identity = Get-AzUserAssignedIdentity -ResourceGroupName <myResourceGroup> -Name <myUserAssignedIdentity> 
Connect-AzAccount -Identity -AccountId $identity.ClientId 
} 
catch { 
    Write-Error -Message $_.Exception 
    throw $_.Exception 
} 
#Get all Resource Manager resources from all resource groups 
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

Learn more about:

- [Managed identities](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview).
- [Connecting from your application to resources without handling credentials](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview-for-developers?tabs=portal%2Cdotnet)
- [Implementing managed identities for Microsoft Azure Resources](https://www.pluralsight.com/courses/microsoft-azure-resources-managed-identities-implementing).
- [Using a system-assigned managed identity for an Azure Automation account](https://learn.microsoft.com/en-us/azure/automation/enable-managed-identity-for-automation).
- [Using a user-assigned managed identity for an Azure Automation account](https://learn.microsoft.com/en-us/azure/automation/add-user-assigned-identity).
- [FAQ for migrating from a Run As account to a managed identity](https://learn.microsoft.com/en-us/azure/automation/automation-managed-identity-faq).

