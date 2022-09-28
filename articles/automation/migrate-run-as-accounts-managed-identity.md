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
> Azure Automation Run As Account will retire on **September 30, 2023**, and there will be no support provided beyond this date. From now through **September 30, 2023**, you can continue to use the Azure Automation Run As Account. However, we recommend you to transition to [managed identities](../automation/automation-security-overview.md#managed-identities) before **September 30, 2023**.

See the [Frequently asked questions](automation-managed-identity-faq.md) for more information about migration cadence and support timeline for Run As account creation and certificate renewal.

Run As accounts in Azure Automation provide authentication for managing Azure Resource Manager resources or resources deployed on the classic deployment model. Whenever a Run As account is created, an Azure AD application is registered, and a self-signed certificate will be generated which will be valid for one year. This adds an overhead of renewing the certificate every year before it expires to prevent the Automation account to stop working. 

Automation accounts can now be configured to use [Managed identities](automation-security-overview.md#managed-identities) which is the default option when an Automation account is created. With this feature, Automation account can authenticate to Azure resources without the need to exchange any credentials, hence removing the overhead of renewing the certificate or managing the service principal.

Managed identity can be [system assigned](enable-managed-identity-for-automation.md)
or [user assigned](add-user-assigned-identity.md). However, when a new Automation account is created, a system assigned managed identity is enabled.

## Prerequisites

Ensure the following to migrate from the Run As account to Managed identities:

1. Create a [system-assigned](enable-managed-identity-for-automation.md) or [user-assigned](add-user-assigned-identity.md), or both types of managed identities. To learn more about the differences between the two types of managed identities, see [Managed Identity Types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

    > [!NOTE]
    > - User-assigned identities are supported for cloud jobs only. It isn't possible to use the Automation Account's User Managed Identity on a Hybrid Runbook Worker. To use hybrid jobs, you must create a System-assigned identities. 
    > - There are two ways to use the Managed Identities in Hybrid Runbook Worker scripts. Either the System-assigned Managed Identity for the Automation account **OR** VM Managed Identity for an Azure VM running as a Hybrid Runbook Worker. 
    > - Both the VM's User-assigned Managed Identity or the VM's system assigned Managed Identity will **NOT** work in an Automation account that is configured with an Automation account Managed Identity. When you enable the Automation account Managed Identity, you can only use the Automation Account System-Assigned Managed Identity and not the VM Managed Identity. For more information, see [Use runbook authentication with managed identities](automation-hrw-run-runbooks.md)

1. Assign same role to the managed identity to access the Azure resources matching the Run As account. Follow the steps in [Check role assignment for Azure Automation Run As account](manage-run-as-account.md#check-role-assignment-for-azure-automation-run-as-account). Ensure that you don't assign high privilege permissions like Contributor, Owner and so on to Run as account. Follow the RBAC guidelines to limit the permissions from the default Contributor permissions assigned to Run As account using this [script](manage-run-as-account.md#limit-run-as-account-permissions)
 
   For example, if the Automation account is only required to start or stop an Azure VM, then the permissions assigned to the Run As account needs to be only for starting or stopping the VM. Similarly, assign read-only permissions if a runbook is reading from blob storage. Read more about [Azure Automation security guidelines](../automation/automation-security-guidelines.md#authentication-certificate-and-identities). 

## Migrate from Automation Run As account to Managed Identity

To migrate from an Automation Run As account to a Managed Identity for your runbook authentication, follow the steps below:
   
1. Change the runbook code to use managed identity. We recommend that you test the managed identity to verify if the runbook works as expected by creating a copy of your production runbook to use managed identity. Update your test runbook code to authenticate by using the managed identities. This ensures that you don't override the AzureRunAsConnection in your production runbook and break the existing Automation. After you are sure that the runbook code executes as expected using the Managed Identities, update your production runbook to use managed identities.

   For Managed Identity support, use the Az cmdlet Connect-AzAccount cmdlet. use the Az cmdlet `Connect-AzAccount` cmdlet. See [Connect-AzAccount](https://learn.microsoft.com/powershell/module/az.accounts/Connect-AzAccount?branch=main&view=azps-8.3.0) in the PowerShell reference.

    - If you are using Az modules, update to the latest version following the steps in the [Update Azure PowerShell modules](https://learn.microsoft.com/azure/automation/automation-update-azure-modules?branch=main#update-az-modules)
    -  If you are using AzureRM modules, Update `AzureRM.Profile` to latest version and replace using  `Add-AzureRMAccount` cmdlet with      `Connect-AzureRMAccount –Identity`.
    
    Follow the sample scripts below to know the change required to the runbook code to use Managed Identities

1. Once you are sure that the runbook is executing successfully by using managed identities, you can safely [delete the Run as account](../automation/delete-run-as-account.md) if the Run as account is not used by any other runbook.

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

## Graphical runbooks

### How to check if Run As account is used in Graphical Runbooks

To check if Run As account is used in Graphical Runbooks:

1. Check each of the activities within the runbook to see if they use the Run As Account when calling any logon cmdlets/aliases. For example, `Add-AzRmAccount/Connect-AzRmAccount/Add-AzAccount/Connect-AzAccount`
    
    :::image type="content" source="./media/migrate-run-as-account-managed-identity/check-graphical-runbook-use-run-as-inline.png" alt-text="Screenshot to check if graphical runbook uses Run As." lightbox="./media/migrate-run-as-account-managed-identity/check-graphical-runbook-use-run-as-expanded.png":::

1. Examine the parameters used by the cmdlet.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/activity-parameter-configuration.png" alt-text="Screenshot to examine the parameters used by cmdlet":::

1. For use with the Run As account, it will use the *ServicePrinicipalCertificate* parameter set *ApplicationId* and *Certificate Thumbprint* will be from the RunAsAccountConnection.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/parameter-sets-inline.png" alt-text="Screenshot to check the parameter sets." lightbox="./media/migrate-run-as-account-managed-identity/parameter-sets-expanded.png":::
 

### How to edit graphical Runbook to use managed identity

You must test the managed identity to verify if the Graphical runbook is working as expected by creating a copy of your production runbook to use the managed identity and updating your test graphical runbook code to authenticate by using the managed identity. You can add this functionality to a graphical runbook by adding `Connect-AzAccount` cmdlet.

Listed below is an example to guide on how a graphical runbook that uses Run As account uses managed identities:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the Automation account and select **Process Automation**, **Runbooks**.
1. Here, select a runbook. For example, select *Start Azure V2 VMs* runbook either from the list and select **Edit** or go to **Browse Gallery** and select *start Azure V2 VMs*.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/edit-graphical-runbook-inline.png" alt-text="Screenshot of edit graphical runbook." lightbox="./media/migrate-run-as-account-managed-identity/edit-graphical-runbook-expanded.png":::

1. Replace, Run As connection that uses `AzureRunAsConnection`and connection asset that internally uses PowerShell `Get-AutomationConnection` cmdlet with `Connect-AzAccount` cmdlet.

1. Connect to Azure that uses `Connect-AzAccount` to add the identity support for use in the runbook using `Connect-AzAccount` activity from the `Az.Accounts` cmdlet that uses the PowerShell code to connect to identity.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/add-functionality-inline.png" alt-text="Screenshot of add functionality to graphical runbook." lightbox="./media/migrate-run-as-account-managed-identity/add-functionality-expanded.png":::

1. Select **Code** to enter the following code to pass the identity.

```powershell-interactive
try 
{ 
    Write-Output ("Logging in to Azure...") 
    Connect-AzAccount -Identity 
} 
catch { 
    Write-Error -Message $_.Exception 
    throw $_.Exception 
} 
```

For example, in the runbook `Start Azure V2 VMs` in the runbook gallery, you must replace `Get Run As Connection` and `Connect to Azure` activities with `Connect-AzAccount` cmdlet activity.

For more information, see sample runbook name *AzureAutomationTutorialWithIdentityGraphical* that gets created with the Automation account.


## Next steps

- Review the Frequently asked questions for [Migrating to Managed Identities](automation-managed-identity-faq.md).

- If your runbooks aren't completing successfully, review [Troubleshoot Azure Automation managed identity issues](troubleshoot/managed-identity.md).

- Learn more about system assigned managed identity, see [Using a system-assigned managed identity for an Azure Automation account](enable-managed-identity-for-automation.md)

- Learn more about user assigned managed identity, see [Using a user-assigned managed identity for an Azure Automation account]( add-user-assigned-identity.md)

- For an overview of Azure Automation account security, see [Automation account authentication overview](automation-security-overview.md).

 