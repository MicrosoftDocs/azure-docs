---
title: Migrate from a Run As account to a managed identity.
description: This article describes how to migrate from a Run As account to a managed identity in Azure Site Recovery.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.author: ankitadutta
ms.topic: how-to 
ms.date: 02/21/2023
---

# Migrate from a Run As account to Managed Identities 

> [!IMPORTANT]
> - Azure Automation Run As Account will retire on September 30, 2023 and will be replaced with Managed Identities. Before that date, you'll need to start migrating your runbooks to use [managed identities](/articles/automation/automation-security-overview.md#managed-identities). For more information, see [migrating from an existing Run As accounts to managed identity](/articles/automation/migrate-run-as-accounts-managed-identity?tabs=run-as-account#sample-scripts).
> - Delaying the feature has a direct impact on our support burden, as it would cause upgrades of mobility agent to fail.

This article shows you how to migrate a Managed Identities for Azure Site Recovery applications. Azure Automation Accounts are used by Azure Site Recovery customers to auto-update the agents of their protected virtual machines. Site Recovery creates Azure Automation Run As Accounts when you enable replication via the IaaS VM Blade and Recovery Services Vault. 

On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource in Azure Active Directory (Azure AD) and using it to obtain Azure AD tokens. 

## Prerequisites

Before you migrate from a Run As account to a managed identity:

1. Create a [system-assigned](../automation/enable-managed-identity-for-automation.md) or [user-assigned](../automation/add-user-assigned-identity.md) managed identity, or create both types. To learn more about the differences between them, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

    > [!NOTE]
    > - User-assigned identities are supported for cloud jobs only. It isn't possible to use the Automation account's user-managed identity on a hybrid runbook worker. To use hybrid jobs, you must create system-assigned identities. 
    > - There are two ways to use managed identities in hybrid runbook worker scripts: either the system-assigned managed identity for the Automation account *or* the virtual machine (VM) managed identity for an Azure VM running as a hybrid runbook worker. 
    > - The VM's user-assigned managed identity and the VM's system-assigned managed identity will *not* work in an Automation account that's configured with an Automation account's managed identity. When you enable the Automation account's managed identity, you can use only the Automation account's system-assigned managed identity and not the VM managed identity. For more information, see [Use runbook authentication with managed identities](../automation/automation-hrw-run-runbooks.md).

1. Assign the same role to the managed identity to access the Azure resources that match the Run As account. Follow the steps in [Check the role assignment for the Azure Automation Run As account](../automation/manage-run-as-account.md#check-role-assignment-for-azure-automation-run-as-account).

   Ensure that you don't assign high-privilege permissions like contributor or owner to the Run As account. Follow the role-based access control (RBAC) guidelines to limit the permissions from the default contributor permissions assigned to a Run As account by using [this script](../automation/manage-run-as-account.md#limit-run-as-account-permissions). 

## Benefits of managed identities

Here are some of the benefits of using managed identities:

- You don't need to manage credentials. Credentials aren’t even accessible to you.
- You can use managed identities to authenticate to any resource that supports [Azure AD authentication](../authentication/overview-authentication.md), including your own applications.
- Managed identities can be used at no extra cost.

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

## Migrate from an existing Run As account to a managed identity
 
### Configure managed identities 

You can configure your managed identities through:

- Azure portal
- Azure CLI
- your Azure Resource Manager (ARM) template

> [!NOTE]
> For more information about migration cadence and the support timeline for Run As account creation and certificate renewal, see the [frequently asked questions](../automation/automation-managed-identity-faq.md).


### Portal experience

**To migrate your Azure Automation account authentication type from a Run As to a managed identity authentication, follow these steps:**

1. In the [Azure portal](https://portal.azure.com), navigate and select the recovery services vault that you want to migrate.

1. On the homepage of your recovery services vault page, do the following:
    1. On the left pane, under the **Manage** section, select **Site Recovery infrastructure**.
        :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/manage-section.png" alt-text="Screenshot of the **Site Recovery infrastructure** page.":::
    1. Under the **For Azure virtual machines** section, select **Extension update settings**.
     This page details the authentication type for the automation account that is being used to manage the Site Recovery extensions.

    1. On this page, select the **Migrate** option to migrate the authentication type for your automation accounts to use Managed Identities. 
        
        :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/extension-update-settings.png" alt-text="Screenshot of the Create Recovery Services vault page.":::

1. After the successful migration of your automation account, the authentication type for the linked account details on the **Extension update settings** page is updated.

When you successfully migrate from a Run As to a Managed Identities account, the following changes are reflected on the Automation Run As Accounts :

-	System Assigned Managed Identity is enabled for the account (if not already enabled).
-	The **Contributor** role permission is  assigned to the Recovery Services vault’s subscription.
-	The script that updates the mobility agent to use Managed Identity based authentication is updated.


### Link an existing managed identity account to vault

You can link an existing managed identity Automation account to your Recovery Services vault. To do so, follow these steps:

#### Enable the managed identity for the vault

1. Go to your selected managed identity automation account. Under under **Account settings**, select **Identity**.

   :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/mi-automation-account.png" alt-text="Screenshot that shows the identity settings page.":::

1. Under the **System assigned** section, change the **Status** to **On** and select **Save**.

   An Object ID is generated. The vault is now registered with Azure Active
   Directory.
    :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/enable-managed-identity-in-vault.png" alt-text="Screenshot that shows the system identity settings page.":::

1. Navigate back to your recovery services vault. On the left pane, select the **Access control (IAM)** option.
    :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/add-mi-iam.png" alt-text="Screenshot that shows IAM settings page.":::
1. Select **Add** > **Add role assignment** > **Contributor** to open the **Add role assignment** page.
1. On the **Add role assignment** page, ensure that the **Managed identity** option is selected.
1. Select the **Select members** option. This opens the **Select managed identities** pane. On this pane do the following:
    1. In the **Select** field, paste the name of the managed identity automation account.
    1. In the **Managed identity** field, select **All system-assigned managed identities**.
    1. Select the **Select** option.
        :::image type="content" source="./media/how-to-migrate-from-run-as-to-managed-identities/select-mi.png" alt-text="Screenshot that shows select managed identity settings page.":::
1. Select **Review + assign**.


### Azure CLI sample scripts

The following examples of runbook scripts fetch the Resource Manager resources by using the Run As account (service principal) and the managed identity. You would notice the difference in runbook code at the beginning of the runbook, where it authenticates against the resource.

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
- [Managed identities](../active-directory/managed-identities-azure-resources/overview).
- [Implementing managed identities for Microsoft Azure Resources](https://www.pluralsight.com/courses/microsoft-azure-resources-managed-identities-implementing).
- [FAQ for migrating from a Run As account to a managed identity](../automation/automation-managed-identity-faq).
- [FAQ for Managed Identities](../active-directory/managed-identities-azure-resources/managed-identities-faq.md)