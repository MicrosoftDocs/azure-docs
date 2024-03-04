---
title: Migrate from a Run As account to Managed identities
description: This article describes how to migrate from a Run As account to managed identities in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 08/04/2023
ms.topic: conceptual 
ms.custom:
---

# Migrate from an existing Run As account to Managed identities

> [!IMPORTANT]
> Azure Automation Run As accounts will retire on *30 September 2023* and completely move to [Managed Identities](automation-security-overview.md#managed-identities). All runbook executions using RunAs accounts, including Classic Run As accounts wouldn't be supported after this date. Starting 01 April 2023, the creation of **new** Run As accounts in Azure Automation will not be possible.

For more information about migration cadence and the support timeline for Run As account creation and certificate renewal, see the [frequently asked questions](automation-managed-identity-faq.md).

Run As accounts in Azure Automation provide authentication for managing resources deployed through Azure Resource Manager or the classic deployment model. Whenever a Run As account is created, an Azure AD application is registered, and a self-signed certificate is generated. The certificate is valid for one month. Renewing the certificate every month before it expires keeps the Automation account working but adds overhead. 

You can now configure Automation accounts to use a [managed identity](automation-security-overview.md#managed-identities), which is the default option when you create an Automation account. With this feature, an Automation account can authenticate to Azure resources without the need to exchange any credentials. A managed identity removes the overhead of renewing the certificate or managing the service principal.

A managed identity can be [system assigned](enable-managed-identity-for-automation.md) or [user assigned](add-user-assigned-identity.md). When a new Automation account is created, a system-assigned managed identity is enabled.

## Prerequisites

Before you migrate from a Run As account or Classic Run As account to a managed identity:

1. Create a [system-assigned](enable-managed-identity-for-automation.md) or [user-assigned](add-user-assigned-identity.md) managed identity, or create both types. To learn more about the differences between them, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

    > [!NOTE]
    > - User-assigned identities are supported for cloud jobs only. It isn't possible to use the Automation account's user-managed identity on a hybrid runbook worker. To use hybrid jobs, you must create system-assigned identities. 
    > - There are two ways to use managed identities in hybrid runbook worker scripts: either the system-assigned managed identity for the Automation account *or* the virtual machine (VM) managed identity for an Azure VM running as a hybrid runbook worker. 
    > - The VM's user-assigned managed identity and the VM's system-assigned managed identity will *not* work in an Automation account that's configured with an Automation account's managed identity. When you enable the Automation account's managed identity, you can use only the Automation account's system-assigned managed identity and not the VM managed identity. For more information, see [Use runbook authentication with managed identities](automation-hrw-run-runbooks.md).

1. Assign the same role to the managed identity to access the Azure resources that match the Run As account. Follow the steps in [Check the role assignment for the Azure Automation Run As account](manage-run-as-account.md#check-role-assignment-for-azure-automation-run-as-account). Use this [script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/AssignMIRunAsRoles.ps1) to enable the System assigned identity in an Automation account and assign the same set of permissions present in Azure Automation Run as account to System Assigned identity of the Automation account.

   Ensure that you don't assign high-privilege permissions like contributor or owner to the Run As account. Follow the role-based access control (RBAC) guidelines to limit the permissions from the default contributor permissions assigned to a Run As account by using [this script](manage-run-as-account.md#limit-run-as-account-permissions). 

   For example, if the Automation account is required only to start or stop an Azure VM, then the permissions assigned to the Run As account need to be only for starting or stopping the VM. Similarly, assign read-only permissions if a runbook is reading from Azure Blob Storage. For more information, see [Azure Automation security guidelines](../automation/automation-security-guidelines.md#authentication-certificate-and-identities). 

1. If you're using Classic Run As accounts, ensure that you have [migrated](../virtual-machines/classic-vm-deprecation.md) resources deployed through classic deployment model to Azure Resource Manager.
1. Use [this script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/Check-AutomationRunAsAccountRoleAssignments.ps1) to find out which Automation accounts are using a Run As account. If your Azure Automation accounts contain a Run As account, it has the built-in contributor role assigned to it by default. You can use the script to check the Azure Automation Run As accounts and determine if their role assignment is the default one or if it has been changed to a different role definition.
1. Use [this script](https://github.com/azureautomation/runbooks/blob/master/Utility/AzRunAs/IdentifyRunAsRunbooks.ps1) to find out if all runbooks in your Automation account are using the Run As account.

## Migrate from an Automation Run As account to a managed identity

To migrate from an Automation Run As account or Classic Run As account to a managed identity for your runbook authentication, follow these steps:
   
1. Change the runbook code to use a managed identity. 

   We recommend that you test the managed identity to verify if the runbook works as expected by creating a copy of your production runbook. Update your test runbook code to authenticate by using the managed identity. This method ensures that you don't override `AzureRunAsConnection` in your production runbook and break the existing Automation instance. After you're sure that the runbook code runs as expected via the managed identity, update your production runbook to use the managed identity.

    For managed identity support, use the `Connect-AzAccount` cmdlet. To learn more about this cmdlet, see [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount?branch=main&view=azps-8.3.0&preserve-view=true) in the PowerShell reference.

    - If you're using `Az` modules, update to the latest version by following the steps in the [Update Azure PowerShell modules](./automation-update-azure-modules.md?branch=main#update-az-modules) article. 
    - If you're using AzureRM modules, update `AzureRM.Profile` to the latest version and replace it by using the `Add-AzureRMAccount` cmdlet with `Connect-AzureRMAccount –Identity`.
    
    To understand the changes to the runbook code that are required before you can use managed identities, use the [sample scripts](#sample-scripts).

1. When you're sure that the runbook is running successfully by using managed identities, you can safely [delete the Run As account](../automation/delete-run-as-account.md) if no other runbook is using that account.

## Sample scripts

The following examples of runbook scripts fetch the Resource Manager resources by using the Run As account (service principal) and the managed identity. You would notice the difference in runbook code at the beginning of the runbook, where it authenticates against the resource. 

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
    Connect-AzAccount -Identity -AccountId <Client Id of myUserAssignedIdentity>
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

---

### View client ID of user assigned identity

1. In your Automation account, under **Account Settings**, select **Identity**. 
1. In **User assigned** tab, select user assigned identity.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/user-assigned-inline.png" alt-text="Screenshot that shows the navigation path to view client ID." lightbox="./media/migrate-run-as-account-managed-identity/user-assigned-expanded.png":::

1. Go to **Overview**> **Essentials**, to view the **Client ID**.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/view-client-id-inline.png" alt-text="Screenshot that shows how to view a client ID." lightbox="./media/migrate-run-as-account-managed-identity/view-client-id-expanded.png":::


## Graphical runbooks

### Check if a Run As account is used in graphical runbooks

1. Check each of the activities within the runbook to see if it uses the Run As account when it calls any logon cmdlets or aliases, such as `Add-AzRmAccount/Connect-AzRmAccount/Add-AzAccount/Connect-AzAccount`.
    
    :::image type="content" source="./media/migrate-run-as-account-managed-identity/check-graphical-runbook-use-run-as-inline.png" alt-text="Screenshot that illustrates checking if a graphical runbook uses a Run As account." lightbox="./media/migrate-run-as-account-managed-identity/check-graphical-runbook-use-run-as-expanded.png":::

1. Examine the parameters that the cmdlet uses.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/activity-parameter-configuration.png" alt-text="Screenshot that shows examining the parameters used by a cmdlet.":::

    For use with the Run As account, the cmdlet uses the `ServicePrinicipalCertificate` parameter set to `ApplicationId`. `CertificateThumbprint` will be from `RunAsAccountConnection`.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/parameter-sets-inline.png" alt-text="Screenshot that shows parameter sets." lightbox="./media/migrate-run-as-account-managed-identity/parameter-sets-expanded.png":::
 
### Edit a graphical runbook to use a managed identity

You must test the managed identity to verify that the graphical runbook is working as expected. Create a copy of your production runbook to use the managed identity, and then update your test graphical runbook code to authenticate by using the managed identity. You can add this functionality to a graphical runbook by adding the `Connect-AzAccount` cmdlet.

The following steps include an example to show how a graphical runbook that uses a Run As account can use managed identities:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the Automation account, and then select **Process Automation** > **Runbooks**.
1. Select a runbook. For example, select the **Start Azure V2 VMs** runbook from the list, and then select **Edit** or go to **Browse Gallery** and select **Start Azure V2 VMs**.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/edit-graphical-runbook-inline.png" alt-text="Screenshot of editing a graphical runbook." lightbox="./media/migrate-run-as-account-managed-identity/edit-graphical-runbook-expanded.png":::

1. Replace the Run As connection that uses `AzureRunAsConnection` and the connection asset that internally uses the PowerShell `Get-AutomationConnection` cmdlet with the `Connect-AzAccount` cmdlet.

1. Select **Delete** to delete the `Get Run As Connection` and `Connect to Azure` activities.
    
    :::image type="content" source="./media/migrate-run-as-account-managed-identity/connect-azure-graphical-runbook-inline.png" alt-text="Screenshot to connect to the Azure activities." lightbox="./media/migrate-run-as-account-managed-identity/connect-azure-graphical-runbook-expanded.png":::
    
    
1. In the left panel, under **RUNBOOK CONTROL**, select **Code** and then select **Add to canvas**.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/add-canvas-graphical-runbook-inline.png" alt-text="Screenshot to select code and add it to the canvas." lightbox="./media/migrate-run-as-account-managed-identity/add-canvas-graphical-runbook-expanded.png":::

1. Edit the code activity, assign any appropriate label name, and select **Author activity logic**.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/author-activity-log-graphical-runbook-inline.png" alt-text="Screenshot to edit code activity." lightbox="./media/migrate-run-as-account-managed-identity/author-activity-log-graphical-runbook-expanded.png":::

1. In the **Code Editor** page, enter the following PowerShell code and select **OK**. 

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
   
1. Connect the new activity to the activities that were connected by **Connect to Azure** earlier and save the runbook.

    :::image type="content" source="./media/migrate-run-as-account-managed-identity/connect-activities-graphical-runbook-inline.png" alt-text="Screenshot to connect new activity to activities." lightbox="./media/migrate-run-as-account-managed-identity/connect-activities-graphical-runbook-expanded.png":::

For example, in the runbook **Start Azure V2 VMs** in the runbook gallery, you must replace the `Get Run As Connection` and `Connect to Azure` activities with the code activity which uses `Connect-AzAccount` cmdlet as described above.
For more information, see the sample runbook name **AzureAutomationTutorialWithIdentityGraphical** that's created with the Automation account.

> [!NOTE]
> AzureRM PowerShell modules are retiring on **29 February 2024**. If you are using AzureRM PowerShell modules in Graphical runbooks, you must upgrade them to use Az PowerShell modules. [Learn more](/powershell/azure/migrate-from-azurerm-to-az?view=azps-9.4.0&preserve-view=true).

## Next steps

- Review the [frequently asked questions for migrating to managed identities](automation-managed-identity-faq.md)

- If your runbooks aren't finishing successfully, review [Troubleshoot Azure Automation managed identity issues](troubleshoot/managed-identity.md).

- To learn more about system-assigned managed identities, see [Using a system-assigned managed identity for an Azure Automation account](enable-managed-identity-for-automation.md).

- To learn more about user-assigned managed identities, see [Using a user-assigned managed identity for an Azure Automation account]( add-user-assigned-identity.md).

- For information about Azure Automation account security, see [Azure Automation account authentication overview](automation-security-overview.md).
