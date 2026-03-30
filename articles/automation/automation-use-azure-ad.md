---
title: Use Microsoft Entra ID in Azure Automation to authenticate to Azure
description: This article tells how to use Microsoft Entra ID within Azure Automation as the provider for authentication to Azure. 
services: automation
ms.date: 07/08/2025
ms.topic: how-to
ms.custom: devx-track-azurepowershell, no-azure-ad-ps-ref
ms.author: v-rochak2
author: RochakSingh-blr
---

# Use Microsoft Entra ID to authenticate to Azure

The [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) service enables a number of administrative tasks, such as user management, domain management, and single sign-on configuration. This article describes how to use Microsoft Entra ID within Azure Automation as the provider for authentication to Azure. 

<a name='install-azure-ad-modules'></a>

## Install Microsoft Entra modules

You can enable Microsoft Entra ID through the following PowerShell modules:

* Azure Active Directory PowerShell for Graph. Azure Automation ships with the Az module. Functionality includes non-interactive authentication to Azure using Microsoft Entra user (OrgId) credential-based authentication. See [Azure AD 2.0.2.182](https://www.powershellgallery.com/packages/AzureAD/2.0.2.182).

* Microsoft Entra ID for Windows PowerShell. This module enables interactions with Microsoft Online, including Microsoft 365.

### Install support for PSCredential

Azure Automation uses the [PSCredential](/dotnet/api/system.management.automation.pscredential) class to represent a credential asset. Your scripts retrieve `PSCredential` objects using the `Get-AutomationPSCredential` cmdlet. For more information, see [Credential assets in Azure Automation](shared-resources/credentials.md).

## Assign a subscription administrator

You must assign an administrator for the Azure subscription. This person has the role of Owner for the subscription scope. See [Role-based access control in Azure Automation](automation-role-based-access-control.md). 

<a name='change-the-azure-ad-users-password'></a>

## Change the Microsoft Entra user's password

To change the Microsoft Entra user's password:

1. Log out of Azure.

2. Have the administrator log in to Azure as the Microsoft Entra user just created, using the full user name (including the domain) and a temporary password. 

3. Ask the administrator to change the password when prompted.

## Configure Azure Automation to manage the Azure subscription

For Azure Automation to communicate with Microsoft Entra ID, you must retrieve the credentials associated with the Azure connection to Microsoft Entra ID. Examples of these credentials are tenant ID, subscription ID, and the like. For more about the connection between Azure and Microsoft Entra ID, see [Connect your organization to Microsoft Entra ID](/azure/devops/organizations/accounts/connect-organization-to-azure-ad).

## Create a credential asset

With the Azure credentials for Microsoft Entra available, it's time to create an Azure Automation credential asset to securely store the Microsoft Entra credentials so that runbooks and Desire State Configuration (DSC) scripts can access them. You can do this using either the Azure portal or PowerShell cmdlets.

### Create the credential asset in Azure portal

You can use the Azure portal to create the credential asset. Do this operation from your Automation account using **Credentials** under **Shared Resources**. See [Credential assets in Azure Automation](shared-resources/credentials.md).

### Create the credential asset with Windows PowerShell

To prepare a new credential asset in Windows PowerShell, your script first creates a `PSCredential` object using the assigned user name and password. The script then uses this object to create the asset through a call to the [New-AzAutomationCredential](/powershell/module/az.automation/new-azautomationcredential) cmdlet. Alternatively, the script can call the [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) cmdlet to prompt the user to type in a name and password. See [Credential assets in Azure Automation](shared-resources/credentials.md). 


## Manage Azure resources from an Azure Automation runbook

You can manage Azure resources from Azure Automation runbooks using the credential asset. Below is an example PowerShell runbook that collects the credential asset to use for stopping and starting virtual machines in an Azure subscription. This runbook first uses `Get-AutomationPSCredential` to retrieve the credential to use to authenticate to Azure. It then calls the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to connect to Azure using the credential. 

```powershell
Workflow Workflowname
{ 
    Param 
    (    
        [Parameter(Mandatory=$true)][ValidateNotNullOrEmpty()] 
        [String] 
        $AzureSubscriptionId, 
        [Parameter(Mandatory=$true)][ValidateNotNullOrEmpty()] 
        [String] 
        $AzureVMList="All", 
        [Parameter(Mandatory=$true)][ValidateSet("Start","Stop")] 
        [String] 
        $Action 
    ) 
     
    # Ensures you do not inherit an AzContext in your runbook
    Disable-AzContextAutosave -Scope Process

    # Connect to Azure with system-assigned managed identity
    $AzureContext = (Connect-AzAccount -Identity).context

    # set and store context
    $AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext 

    # get credential
    $credential = Get-AutomationPSCredential -Name "AzureCredential"

    # Connect to Azure with credential
    $AzureContext = (Connect-AzAccount -Credential $credential -TenantId $AzureContext.Subscription.TenantId).context 

    # set and store context
    $AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription `
        -TenantId $AzureContext.Subscription.TenantId `
        -DefaultProfile $AzureContext
 
    if($AzureVMList -ne "All") 
    { 
        $AzureVMs = $AzureVMList.Split(",") 
        [System.Collections.ArrayList]$AzureVMsToHandle = $AzureVMs 
    } 
    else 
    { 
        $AzureVMs = (Get-AzVM -DefaultProfile $AzureContext).Name 
        [System.Collections.ArrayList]$AzureVMsToHandle = $AzureVMs 
    } 
 
    foreach($AzureVM in $AzureVMsToHandle) 
    { 
        if(!(Get-AzVM -DefaultProfile $AzureContext | ? {$_.Name -eq $AzureVM})) 
        { 
            throw " AzureVM : [$AzureVM] - Does not exist! - Check your inputs " 
        } 
    } 
 
    if($Action -eq "Stop") 
    { 
        Write-Output "Stopping VMs"; 
        foreach -parallel ($AzureVM in $AzureVMsToHandle) 
        { 
            Get-AzVM -DefaultProfile $AzureContext | ? {$_.Name -eq $AzureVM} | Stop-AzVM -DefaultProfile $AzureContext -Force 
        } 
    } 
    else 
    { 
        Write-Output "Starting VMs"; 
        foreach -parallel ($AzureVM in $AzureVMsToHandle) 
        { 
            Get-AzVM -DefaultProfile $AzureContext | ? {$_.Name -eq $AzureVM} | Start-AzVM -DefaultProfile $AzureContext
        } 
    } 
}
```  

## Using Microsoft Graph with Powershell

See [Get started with the Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/get-started)

## Next steps

* For details of credential use, see [Manage credentials in Azure Automation](shared-resources/credentials.md).
* For information about modules, see [Manage modules in Azure Automation](shared-resources/modules.md).
* If you need to start a runbook, see [Start a runbook in Azure Automation](start-runbooks.md).
* For PowerShell details, see [PowerShell Docs](/powershell/scripting/overview).
