---
title: Troubleshoot Azure Automation managed identity issues
description: This article tells how to troubleshoot and resolve issues when using a managed identity with an Automation account.
services: automation
ms.subservice:
ms.date: 10/26/2021
ms.topic: troubleshooting
---

# Troubleshoot Azure Automation managed identity issues

This article discusses solutions to problems that you might encounter when you use a managed identity with your Automation account. For general information about using managed identity with Automation accounts, see [Azure Automation account authentication overview](../automation-security-overview.md#managed-identities).

## Scenario: Managed Identity in a Runbook cannot authenticate against Azure

### Issue
When using a Managed Identity in your runbook, you receive an error as:
`connect-azaccount : ManagedIdentityCredential authentication failed: Failed to get MSI token for account d94c0db6-5540-438c-9eb3-aa20e02e1226 and resource https://management.core.windows.net/. Status: 500 (Internal Server Error)`

### Cause

This can happen either when:

- **Cause 1**:  You use the Automation account System Managed Identity, which has not yet been created and the `Code Connect-AzAccount -Identity` tries to authenticate to Azure and run a runbook in Azure or on a Hybrid Runbook Worker.

- **Cause 2**: The Automation account has a User managed identity assigned and not a System Managed Identity and the - `Code Connect-AzAccount -Identity` tries to authenticate to Azure and run a runbook on an Azure virtual machine Hybrid Runbook Worker using the Azure VM System Managed Identity.


### Resolution

- **Resolution 1**: You must create the Automation Account System Managed Identity and grant it access to the Azure Resources.

- **Resolution 2**: As appropriate for your requirements, you can:

    - Create the Automation Account System Managed Identity and use it to authenticate.</br>
                Or </br> 
    - Delete the Automation Account User Assigned Managed Identity.

## Scenario: Unable to find the user assigned managed identity to add it to the Automation account

### Issue

You want to add a user-assigned managed identity to the Automation account. However, you can't find the account in the Automation blade.

### Cause

This issue occurs when you don't have the following permissions for the user-assigned managed identity to view it in the Automation blade.

- `Microsoft.ManagedIdentity/userAssignedIdentities/*/read`
- `Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action`

>[!NOTE]
> The above permissions are granted by default to Managed Identity Operator and Managed Identity Contributor.

### Resolution
Ensure that you have [Identity Operator role permission](../../role-based-access-control/built-in-roles.md#managed-identity-operator) to add the user-assigned managed identity to your Automation account.


## Scenario: Runbook fails with "this.Client.SubscriptionId cannot be null." error message

### Issue

Your runbook using a managed identity Connect-AzAccount -Identity which attempts to manage Azure objects, fails to work successfully and logs the following error - `this.Client.SubscriptionId cannot be null.`

```error
get-azvm : 'this.Client.SubscriptionId' cannot be null. At line:5 char:1 + get-azvm + ~~~~~~~~ + CategoryInfo : CloseError: (:) [Get-AzVM], ValidationException + FullyQualifiedErrorId : Microsoft.Azure.Commands.Compute.GetAzureVMCommand
```

### Cause

This can happen when the Managed Identity (or other account used in the runbook) has not been granted any permissions to access the subscription.

### Resolution
Grant the Managed Identity (or other account used in the runbook) an appropriate role membership in the subscription. [Learn more](../enable-managed-identity-for-automation.md#assign-role-to-a-system-assigned-managed-identity)

:::image type="content" source="../media/troubleshoot-runbooks/managed-identity-role-assignments.png" alt-text=" Screenshot that shows the assigning of Azure Role assignments.":::

:::image type="content" source="../media/troubleshoot-runbooks/azure-add-role-assignment-inline.png" alt-text="Screenshot that shows how to add role assignment." lightbox="../media/troubleshoot-runbooks/azure-add-role-assignment-expanded.png":::


## Scenario: Fail to get MSI token for account

### Issue

When working with a user-assigned managed identity in your Automation account, you receive an error similar to: `Failed to get MSI token for account a123456b-1234-12a3-123a-aa123456aa0b`.

### Cause

Using a user-assigned managed identity before enabling a system-assigned managed identity for your Automation account.

### Resolution

Enable a system-assigned managed identity for your Automation account. Then use the user-assigned managed identity.  

## Scenario: Attempt to use managed identity with Automation account fails

### Issue

When you try to work with managed identities in your Automation account, you encounter an error like this:

```error
Connect-AzureRMAccount : An error occurred while sending the request. At line:2 char:1 + Connect-AzureRMAccount -Identity + 
CategoryInfo : CloseError: (:) [Connect-AzureRmAccount], HttpRequestException + FullyQualifiedErrorId : Microsoft.Azure.Commands.Profile.ConnectAzureRmAccountCommand
```

### Cause

The most common cause for this is that you didn't enable the identity before trying to use it. To verify this, run the following PowerShell runbook in the affected Automation account.

```powershell
$resource= "?resource=https://management.azure.com/"
$url = $env:IDENTITY_ENDPOINT + $resource
$Headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$Headers.Add("X-IDENTITY-HEADER", $env:IDENTITY_HEADER)
$Headers.Add("Metadata", "True")

try
{
    $Response = Invoke-RestMethod -Uri $url -Method 'GET' -Headers $Headers
}
catch
{
    $StatusCode = $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    
    Write-Output "Request Failed with Status: $StatusCode, Message: $responseBody"
}
```

If the issue is that you didn't enable the identity before trying to use it, you should see a result similar to this:

`Request Failed with Status: 400, Message: {"Message":"No managed identity was found for Automation account xxxxxxxxxxxx"}`

### Resolution

You must enable an identity for your Automation account before you can use the managed identity service. See [Enable a managed identity for your Azure Automation account](../enable-managed-identity-for-automation.md)

## Next steps

If this article doesn't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport). This is the official Microsoft Azure account for connecting the Azure community to the right resources: answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
