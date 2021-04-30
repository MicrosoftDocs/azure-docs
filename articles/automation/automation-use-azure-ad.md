---
title: Use Azure AD in Azure Automation to authenticate to Azure
description: This article tells how to use Azure AD within Azure Automation as the provider for authentication to Azure. 
services: automation
ms.date: 03/30/2020
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Use Azure AD to authenticate to Azure

The [Azure Active Directory (AD)](../active-directory/fundamentals/active-directory-whatis.md) service enables a number of administrative tasks, such as user management, domain management, and single sign-on configuration. This article describes how to use Azure AD within Azure Automation as the provider for authentication to Azure. 

## Install Azure AD modules

You can enable Azure AD through the following PowerShell modules:

* Azure Active Directory PowerShell for Graph (AzureRM and Az modules). Azure Automation ships with the AzureRM module and its recent upgrade, the Az module. Functionality includes non-interactive authentication to Azure using Azure AD user (OrgId) credential-based authentication. See [Azure AD 2.0.2.76](https://www.powershellgallery.com/packages/AzureAD/2.0.2.76).

* Microsoft Azure Active Directory for Windows PowerShell (MSOnline module). This module enables interactions with Microsoft Online, including Microsoft 365.

>[!NOTE]
>PowerShell Core does not support the MSOnline module. To use the module cmdlets, you must run them from Windows PowerShell. You're encouraged to use the newer Azure Active Directory PowerShell for Graph modules instead of the MSOnline module. 

### Preinstallation

Before installing the Azure AD modules on your computer:

* Uninstall any previous versions of the AzureRM/Az module and the MSOnline module. 

* Uninstall the Microsoft Online Services Sign-In Assistant to ensure correct operation of the new PowerShell modules.  

### Install the AzureRM and Az modules

>[!NOTE]
>To work with these modules, you must use PowerShell version 5.1 or later with a 64-bit version of Windows. 

1. Install Windows Management Framework (WMF) 5.1. See [Install and Configure WMF 5.1](/powershell/scripting/wmf/setup/install-configure).

2. Install AzureRM and/or Az using instructions in [Install Azure PowerShell on Windows with PowerShellGet](/powershell/azure/azurerm/install-azurerm-ps).

### Install the MSOnline module

>[!NOTE]
>To install the MSOnline module, you must be a member of an admin role. See [About admin roles](/microsoft-365/admin/add-users/about-admin-roles).

1. Ensure that the Microsoft .NET Framework 3.5.x feature is enabled on your computer. It's likely that your computer has a newer version installed, but backward compatibility with older versions of the .NET Framework can be enabled or disabled. 

2. Install the 64-bit version of the [Microsoft Online Services Sign-in Assistant](https://www.microsoft.com/Download/details.aspx?id=28177).

3. Run Windows PowerShell as an administrator to create an elevated Windows PowerShell command prompt.

4. Deploy Azure Active Directory from [MSOnline 1.0](http://www.powershellgallery.com/packages/MSOnline/1.0).

5. If you're prompted to install the NuGet provider, type Y and press ENTER.

6. If you're prompted to install the module from [PSGallery](https://www.powershellgallery.com/), type Y and press ENTER.

### Install support for PSCredential

Azure Automation uses the [PSCredential](/dotnet/api/system.management.automation.pscredential) class to represent a credential asset. Your scripts retrieve `PSCredential` objects using the `Get-AutomationPSCredential` cmdlet. For more information, see [Credential assets in Azure Automation](shared-resources/credentials.md).

## Assign a subscription administrator

You must assign an administrator for the Azure subscription. This person has the role of Owner for the subscription scope. See [Role-based access control in Azure Automation](automation-role-based-access-control.md). 

## Change the Azure AD user's password

To change the Azure AD user's password:

1. Log out of Azure.

2. Have the administrator log in to Azure as the Azure AD user just created, using the full user name (including the domain) and a temporary password. 

3. Ask the administrator to change the password when prompted.

## Configure Azure Automation to manage the Azure subscription

For Azure Automation to communicate with Azure AD, you must retrieve the credentials associated with the Azure connection to Azure AD. Examples of these credentials are tenant ID, subscription ID, and the like. For more about the connection between Azure and Azure AD, see [Connect your organization to Azure Active Directory](/azure/devops/organizations/accounts/connect-organization-to-azure-ad).

## Create a credential asset

With the Azure credentials for Azure AD available, it's time to create an Azure Automation credential asset to securely store the Azure AD credentials so that runbooks and Desire State Configuration (DSC) scripts can access them. You can do this using either the Azure portal or PowerShell cmdlets.

### Create the credential asset in Azure portal

You can use the Azure portal to create the credential asset. Do this operation from your Automation account using **Credentials** under **Shared Resources**. See [Credential assets in Azure Automation](shared-resources/credentials.md).

### Create the credential asset with Windows PowerShell

To prepare a new credential asset in Windows PowerShell, your script first creates a `PSCredential` object using the assigned user name and password. The script then uses this object to create the asset through a call to the [New-AzureAutomationCredential](/powershell/module/servicemanagement/azure.service/new-azureautomationcredential) cmdlet. Alternatively, the script can call the [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) cmdlet to prompt the user to type in a name and password. See [Credential assets in Azure Automation](shared-resources/credentials.md). 

## Manage Azure resources from an Azure Automation runbook

You can manage Azure resources from Azure Automation runbooks using the credential asset. Below is an example PowerShell runbook that collects the credential asset to use for stopping and starting virtual machines in an Azure subscription. This runbook first uses `Get-AutomationPSCredential` to retrieve the credential to use to authenticate to Azure. It then calls the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to connect to Azure using the credential. The script uses the [Select-AzureSubscription](/powershell/module/servicemanagement/azure.service/select-azuresubscription) cmdlet to choose the subscription to work with. 

```azurepowershell
Workflow Stop-Start-AzureVM 
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
     
    $credential = Get-AutomationPSCredential -Name 'AzureCredential' 
    Connect-AzAccount -Credential $credential 
    Select-AzureSubscription -SubscriptionId $AzureSubscriptionId 
 
    if($AzureVMList -ne "All") 
    { 
        $AzureVMs = $AzureVMList.Split(",") 
        [System.Collections.ArrayList]$AzureVMsToHandle = $AzureVMs 
    } 
    else 
    { 
        $AzureVMs = (Get-AzVM).Name 
        [System.Collections.ArrayList]$AzureVMsToHandle = $AzureVMs 
 
    } 
 
    foreach($AzureVM in $AzureVMsToHandle) 
    { 
        if(!(Get-AzVM | ? {$_.Name -eq $AzureVM})) 
        { 
            throw " AzureVM : [$AzureVM] - Does not exist! - Check your inputs " 
        } 
    } 
 
    if($Action -eq "Stop") 
    { 
        Write-Output "Stopping VMs"; 
        foreach -parallel ($AzureVM in $AzureVMsToHandle) 
        { 
            Get-AzVM | ? {$_.Name -eq $AzureVM} | Stop-AzVM -Force 
        } 
    } 
    else 
    { 
        Write-Output "Starting VMs"; 
        foreach -parallel ($AzureVM in $AzureVMsToHandle) 
        { 
            Get-AzVM | ? {$_.Name -eq $AzureVM} | Start-AzVM 
        } 
    } 
}
```  

## Next steps

* For details of credential use, see [Manage credentials in Azure Automation](shared-resources/credentials.md).
* For information about modules, see [Manage modules in Azure Automation](shared-resources/modules.md).
* If you need to start a runbook, see [Start a runbook in Azure Automation](start-runbooks.md).
* For PowerShell details, see [PowerShell Docs](/powershell/scripting/overview).
