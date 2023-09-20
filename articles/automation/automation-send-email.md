---
title: Send an email from an Azure Automation runbook
description: This article tells how to send an email from within a runbook.
services: automation
ms.subservice: process-automation
ms.date: 09/21/2021
ms.topic: how-to 
ms.custom: devx-track-azurepowershell
#Customer intent: As a developer, I want understand runbooks so that I can use it to automate e-mails.
---

# Send an email from an Automation runbook

You can send an email from a runbook with [SendGrid](https://sendgrid.com/solutions) using PowerShell. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* [A SendGrid account](https://docs.sendgrid.com/for-developers/partners/microsoft-azure-2021#create-a-sendgrid-account).
* SendGrid sender verification. Either [Domain or Single Sender](https://sendgrid.com/docs/for-developers/sending-email/sender-identity/) 
* Your [SendGrid API key](https://docs.sendgrid.com/for-developers/partners/microsoft-azure-2021#to-find-your-sendgrid-api-key).

* An Azure Automation account with at least one user-assigned managed identity. For more information, see [Enable managed identities](./quickstarts/enable-managed-identity.md).
* Az modules: `Az.Accounts` and `Az.KeyVault` imported into the Automation account. For more information, see [Import Az modules](./shared-resources/modules.md#import-az-modules).
* The [Azure Az PowerShell module](/powershell/azure/new-azureps-module-az) installed on your machine. To install or upgrade, see [How to install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell).

## Create an Azure Key Vault

Create an Azure Key Vault and [Key Vault access policy](../key-vault/general/assign-access-policy-portal.md) that allows the credential to get and set key vault secrets in the specified key vault.

1. Sign in to Azure interactively using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet and follow the instructions.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }
    
    # If you have multiple subscriptions, set the one to use
    # Select-AzSubscription -SubscriptionId <SUBSCRIPTIONID>
    ```

1. Provide an appropriate value for the variables below and then execute the script.

    ```powershell
    $resourceGroup = "<Resource group>"
    $automationAccount = "<Automation account>"
    $region = "<Region>"
    $SendGridAPIKey = "<SendGrid API key>"
    $VaultName = "<A universally unique vault name>"

    $userAssignedManagedIdentity = "<User-assigned managed identity>"
    ```

1. Create Key Vault and assign permissions

    ```powershell
    # Create the new key vault
    $newKeyVault = New-AzKeyVault `
        -VaultName $VaultName `
        -ResourceGroupName $resourceGroup `
        -Location $region

    $resourceId = $newKeyVault.ResourceId
    
    # Convert the SendGrid API key into a SecureString
    $Secret = ConvertTo-SecureString -String $SendGridAPIKey `
        -AsPlainText -Force

    Set-AzKeyVaultSecret -VaultName $VaultName `
        -Name 'SendGridAPIKey' `
        -SecretValue $Secret
    
    # Grant Key Vault access to the Automation account's system-assigned managed identity.
    $SA_PrincipalId = (Get-AzAutomationAccount `
        -ResourceGroupName $resourceGroup `
        -Name $automationAccount).Identity.PrincipalId

    Set-AzKeyVaultAccessPolicy `
        -VaultName $vaultName `
        -ObjectId $SA_PrincipalId `
        -PermissionsToSecrets Set, Get

    # Grant Key Vault access to the user-assigned managed identity.
    $UAMI = Get-AzUserAssignedIdentity `
        -ResourceGroupName $resourceGroup `
        -Name $userAssignedManagedIdentity

    Set-AzKeyVaultAccessPolicy `
        -VaultName $vaultName `
        -ObjectId $UAMI.PrincipalId `
        -PermissionsToSecrets Set, Get
    ```

   For other ways to create an Azure Key Vault and store a secret, see [Key Vault quickstarts](../key-vault/index.yml).

## Assign permissions to managed identities

Assign permissions to the appropriate [managed identity](./automation-security-overview.md#managed-identities). The runbook can use either the Automation account system-assigned managed identity or a user-assigned managed identity. Steps are provided to assign permissions to each identity. The steps below use PowerShell. If you prefer using the Portal, see [Assign Azure roles using the Azure portal](./../role-based-access-control/role-assignments-portal.md).

1. Use PowerShell cmdlet [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) to assign a role to the system-assigned managed identity.

    ```powershell
    New-AzRoleAssignment `
        -ObjectId $SA_PrincipalId `
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName "Reader"
    ```

1. Assign a role to a user-assigned managed identity.

    ```powershell
    New-AzRoleAssignment `
        -ObjectId $UAMI.PrincipalId`
        -ResourceGroupName $resourceGroup `
        -RoleDefinitionName "Reader"
    ```

1. For the system-assigned managed identity, show `ClientId` and record the value for later use.

   ```powershell
   $UAMI.ClientId
   ```

## Create the runbook to send an email

After you've created a Key Vault and stored your `SendGrid` API key, it's time to create the runbook that retrieves the API key and sends an email. Let's use a runbook that uses the [system-assigned managed identity](./automation-security-overview.md#managed-identities) to
authenticate with Azure to retrieve the secret from Azure Key Vault. We'll call the runbook **Send-GridMailMessage**. You can modify the PowerShell script used for different scenarios.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Automation account.

1. From your open Automation account page, under **Process Automation**, select **Runbooks**

1. Select **+ Create a runbook**.
    1. Name the runbook `Send-GridMailMessage`.
    1. From the **Runbook type** drop-down list, select **PowerShell**.
    1. Select **Create**.

   ![Create Runbook](./media/automation-send-email/automation-send-email-runbook.png)

1. The runbook is created and the Edit PowerShell Runbook page opens.
   ![Edit the Runbook](./media/automation-send-email/automation-send-email-edit.png)

1. Copy the following PowerShell example into the Edit page. Ensure that the `VaultName` specifies the name you've chosen for your Key Vault.

    ```powershell
    Param(
      [Parameter(Mandatory=$True)]
      [String] $destEmailAddress,
      [Parameter(Mandatory=$True)]
      [String] $fromEmailAddress,
      [Parameter(Mandatory=$True)]
      [String] $subject,
      [Parameter(Mandatory=$True)]
      [String] $content,
      [Parameter(Mandatory=$True)]
      [String] $ResourceGroupName
    )

    # Ensures you do not inherit an AzContext in your runbook
    Disable-AzContextAutosave -Scope Process
    
    # Connect to Azure with system-assigned managed identity
    $AzureContext = (Connect-AzAccount -Identity).context

    # set and store context
    $AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext 

    $VaultName = "<Enter your vault name>"

    $SENDGRID_API_KEY = Get-AzKeyVaultSecret `
        -VaultName $VaultName `
        -Name "SendGridAPIKey" `
        -AsPlainText -DefaultProfile $AzureContext

    $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
    $headers.Add("Authorization", "Bearer " + $SENDGRID_API_KEY)
    $headers.Add("Content-Type", "application/json")

    $body = @{
    personalizations = @(
        @{
            to = @(
                    @{
                        email = $destEmailAddress
                    }
            )
        }
    )
    from = @{
        email = $fromEmailAddress
    }
    subject = $subject
    content = @(
        @{
            type = "text/plain"
            value = $content
        }
    )
    }

    $bodyJson = $body | ConvertTo-Json -Depth 4

    $response = Invoke-RestMethod -Uri https://api.sendgrid.com/v3/mail/send -Method Post -Headers $headers -Body $bodyJson
    ```

1. If you want the runbook to execute with the system-assigned managed identity, leave the code as-is. If you prefer to use a user-assigned managed identity, then:
    1. From line 18, remove `$AzureContext = (Connect-AzAccount -Identity).context`,
    1. Replace it with `$AzureContext = (Connect-AzAccount -Identity -AccountId <ClientId>).context`, and
    1. Enter the Client ID you obtained earlier.

1. Select **Save**, **Publish** and then **Yes** when prompted.

To verify that the runbook executes successfully, you can follow the steps under [Test a runbook](manage-runbooks.md#test-a-runbook) or [Start a runbook](start-runbooks.md).

If you don't initially see your test email, check your **Junk** and **Spam** folders.

## Clean up resources

1. When the runbook is no longer needed, select it in the runbook list and select **Delete**.

1. Delete the Key Vault by using the [Remove-AzKeyVault](/powershell/module/az.keyvault/remove-azkeyvault) cmdlet.

    ```powershell
    $VaultName = "<your KeyVault name>"
    $resourceGroup = "<your ResourceGroup name>"
    Remove-AzKeyVault -VaultName $VaultName -ResourceGroupName $resourceGroup
    ```

## Next steps

* To send runbook job data to your Log Analytics workspace, see [Forward Azure Automation job data to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md).
* To monitor base-level metrics and logs, see [Use an alert to trigger an Azure Automation runbook](automation-create-alert-triggered-runbook.md).
