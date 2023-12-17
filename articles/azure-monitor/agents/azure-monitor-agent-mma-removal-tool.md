---
title: Azure Monitor Agent fMMA legacy agent removal tool
description: This article describes a PowerShell script used to remove MMA agend from systems that have already been migrated to AMA.
ms.topic: conceptual
author: jeffreywolford
ms.author: jeffwo
ms.reviewer: jeffwo
ms.date: 12/16/2023 
ms.custom:
# Customer intent: As an Azure account administrator, I want to use the available Azure Monitor tools to migrate from Log Analytics Agent to Azure Monitor Agent and track the status of the migration in my account.
---

# MMA Discovery and Removal Tool  
After you migrate your machines to AMA you need to remove the MMA agent to avoid duplication of logs. AzTS MMA Discovery and Removal Utility can centrally remove MMA extension from Azure Virtual Machine (VMs), Virtual Machine Scale Sets (VMSS) and Azure Arc Servers from a tenant.  
The utility works in two steps  
1. Discovery – First the utility creates an inventory of all machines that have the MMA agents installed. We recommend that no new VMs, VMSS or Azure Arc Servers with MMA extension are created while the utility is running.  
2. Removal - Second the utility selects machines with both MMA and AMA and removes the MMA extension. You can disable this step and run after validating the list of machines. There is an option remove from machines that only have the MMA agent, but we recommended that you first migrate all dependencies to AMA and then remove MMA.  

## Prerequisites  
You will do all the setup steps in a [Visual Studio Code](https://code.visualstudio.com/) with the [PowerShell Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell). 
 - Windows 10+ or Windows Server 2019+
 - PowerShell 5.0 or higher. Check the version by running `$PSVersionTable` and checking the PSVersion
 - PowerShell. The language must be set to mode `FullLanguage`. Check the mode by running `$ExecutionContext.SessionState.LanguageMode` in PowerShell. You can find more details [here](https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_language_modes?source=recommendations&view=powershell-7.3) 
 - Bicep. The setup scripts us Bicep to automate the installation. Check the installation by running `bicep --version`. See [install in powershell](https://learn.microsoft.com/azure/azure-resource-manager/bicep/install#azure-powershell) 
 - A [User-Assigned Managed Identity (MI)](https: //docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) which has 'Reader', Virtual Machine Contributor' and 'Azure Arc ScVmm VM Contributor' access on target scopes configured. 
 - A new Resource Group to contain all the Azure resources created automatically by the Setup automation.
 - For granting remediation user-assigned MI with above mentioned roles on the target scopes, 
 - You must have User Access Administrator (UAA) or Owner on the configured scopes. For example, the setup is being configured for a subscription 'x', you must UAA role assignment on subscription 'x' so the script can provide the remediated user-assigned MI permissions.


## Download Deployment package
 The package contains:
- Bicep templates which contain resource configuration details that you will create as part of setup. 
- Deployment setup scripts which provides the cmdlet to run installation. 
- Download deployment package zip from [here](https://github.com/azsk/AzTS-docs/raw/main/TemplateFiles/AzTSMMARemovalUtilityDeploymentFiles.zip) to your local machine. 
- Extract zip to local folder location.
- Unblock the files with this script.

  ``` PowerShell
  Get-ChildItem -Path "<Extracted folder path>" -Recurse | Unblock-File 
  ```

## Setup The tool
### [Single Tenant](#tab/Single)
You will perform setup in two steps: 
1. Go to deployment folder and load consolidated setup script. You must have **Owner** access on the subscription. 

  ``` PowerShell
  CD "<LocalExtractedFolderPath>\AzTSMMARemovalUtilityDeploymentFiles"
  . ".\MMARemovalUtilitySetupConsolidated.ps1"
  ```

2. The Install-AzTSMMARemovalUtilitySolutionConsolidated does the following operations:
    - Installs required Az modules.
    - Setup remediation user-assigned managed identity.
    - Prompts and collects onboarding details for usage telemetry collection based on user preference.
    - Creates or updates the RG.
    - Creates or updates the resources with MIs assigned.
    - Creates or updates the monitoring dashboard.
    - Configures target scopes.

You must log in to Azure Account using the following PowerShell command.  

``` PowerShell
$TenantId = "<TenantId>"
Connect-AzAccount -Tenant $TenantId
```
Run the setup script
``` PowerShell
$SetupInstallation = Install-AzTSMMARemovalUtilitySolutionConsolidated `
         -RemediationIdentityHostSubId <MIHostingSubId> `
         -RemediationIdentityHostRGName <MIHostingRGName> `
         -RemediationIdentityName <MIName> `
         -TargetSubscriptionIds @("<SubId1>","<SubId2>","<SubId3>") `
         -TargetManagementGroupNames @("<MGName1>","<MGName2>","<MGName3>") `
         -TenantScope `
         -SubscriptionId <HostingSubId> `
         -HostRGName <HostingRGName> `
         -Location <Location> `
         -AzureEnvironmentName <AzureEnvironmentName>
```

Parameters

|Param Name | Description | Required |
|:----|:----|:----:|
|RemediationIdentityHostSubId| Subscription id to create remediation resources | Yes |
|RemediationIdentityHostRGName| New ResourceGroup name to create remediation. Defaults to 'AzTS-MMARemovalUtility-RG'| No |
|RemediationIdentityName| Name of the remediation MI| Yes |
|TargetSubscriptionIds| List of target subscription id(s) to run on | No |
|TargetManagementGroupNames| List of target management group name(s) to run on | No|
|TenantScope| Activate tenant scope and assigns roles using your tenant id| No|
|SubscriptionId| Subscription id where your setup is installed| Yes|
|HostRGName| New resource group name in which remediation MI is created. Default value is 'AzTS-MMARemovalUtility-Host-RG'| No|
|Location| Location DC where your setup is created. Default value is 'EastUS2'| No|
|AzureEnvironmentName| Azure environment in which solution needs to be installed: AzureCloud, AzureGovernmentCloud. Default value is 'AzureCloud'| No|

### [Multi%20Tenant](#tab/Multi%20Tenant)
In this section, we will walk you through the steps for setting up multi-tenant AzTS MMA Removal Utility. This setup may take up to 30 minutes and has 9 steps

1. Load setup script
Point the current path to the folder containing the extracted deployment package and run the setup script.

  ``` PowerShell
  CD "<LocalExtractedFolderPath>\AzTSMMARemovalUtilityDeploymentFiles"
  . ".\MMARemovalUtilitySetup.ps1"
```

2. Installing required Az modules
Az modules contain cmdlets to deploy Azure resources which are used to create resources. Install the required Az PowerShell Modules using the below commands. For more details of Az Modules refer [link](https://docs.microsoft.com/powershell/azure/install-az-ps). You must point current path to the extracted folder location.

``` PowerShell
Set-Prerequisites
```

3. Setup multi-tenant remediation identity
The Azure Active Directory (AAD) Application identity is used for multi-tenant setup which is used across tenants via service principal associated to the AAD Application. You will perform the following operations. You must login to the Azure Account and Azure Active Directory (AD) where you want to install the Removal Utility setup using the PowerShell command.
    - Creates a new multi-tenant AAD application if not provided with preexisting AAD application objectId.
    - Creates password credentials for the AAD application.

``` PowerShell
Disconnect-AzAccount
Disconnect-AzureAD
$TenantId = "<TenantId>"
Connect-AzAccount -Tenant $TenantId
Connect-AzureAD -TenantId $TenantId
```

``` PowerShell
$Identity = Set-AzTSMMARemovalUtilitySolutionMultiTenantRemediationIdentity `
         -DisplayName <AADAppDisplayName> `
         -ObjectId <PreExistingAADAppId> `
         -AdditionalOwnerUPNs @("<OwnerUPN1>","<OwnerUPN2>")
$Identity.ApplicationId
$Identity.ObjectId
$Identity.Secret
```

Parameters

|Param Name| Description | Required |
|:----|:----|:----:|
| DisplayName | Display Name of the Remediation Identity| Yes |
| ObjectId | Object Id of the Remediation Identity | No |
| AdditionalOwnerUPNs | User Principal Names (UPNs) of the additional owners for the App to be created | No |

4. Setup secrets storage
In this step you will create secrets storage. You must have owner access on the subscription to create a new RG. You will perform the following operations.
    - Creates or updates the resource group for Key Vault.
    - Creates or updates the Key Vault.
    - Store the secret.

``` PowerShell
$KeyVault = Set-AzTSMMARemovalUtilitySolutionSecretStorage ` 
         -SubscriptionId <KVHostingSubId> `
         -ResourceGroupName <KVHostingRGName> `
         -Location <Location> `
         -KeyVaultName <KeyVaultName> `
         -AADAppPasswordCredential $Identity.Secret
$KeyVault.Outputs.keyVaultResourceId.Value
$KeyVault.Outputs.secretURI.Value
$KeyVault.Outputs.logAnalyticsResourceId.Value
```

Parameters

|Param Name|Description|Required?
|:----|:----|:----|
| SubscriptionId | Subscription id where  keyvault is created.| Yes |
| ResourceGroupName | Resource group name where Key Vault is created. Should be in a different RG from the setup RG | Yes |
|Location| Location DC where Key Vault is created. For better performance, we recommend creating all the resources related to setup to be in one location. Default value is 'EastUS2'| No |
|KeyVaultName| Name of the Key Vault that is created.| Yes |
|AADAppPasswordCredential| Removal Utility AAD application's password credentials| Yes |

5. Setup Installation
This step will install the MMA Removal Utility which discovers and removes MMA agents installed on Virtual Machines. You must have owner access to the subscription where the setup will be created. We recommend that you use a new resource group for the tool. You will perform the following operations.
    - Prompts and collects onboarding details for usage telemetry collection based on user preference.
    - Creates the RG if it does not exist.
    - Creates or updates the resources with MIs.
    - Creates or updates the monitoring dashboard.

``` PowerShell
$Solution = Install-AzTSMMARemovalUtilitySolution ` 
         -SubscriptionId <HostingSubId> `
         -HostRGName <HostingRGName> `
         -Location <Location> `
         -SupportMultipleTenant `
         -IdentityApplicationId $Identity.ApplicationId `
         -IdentitySecretUri ('@Microsoft.KeyVault(SecretUri={0})' -f $KeyVault.Outputs.secretURI.Value)
$Solution.Outputs.internalMIObjectId.Value
```

Parameters

| Param Name | Description | Required |
|:----|:----|:----|
| SubscriptionId | Subscription id where setup is created | Yes |
| HostRGName | Resource group name where setup is created Default value is 'AzTS-MMARemovalUtility-Host-RG'| No |
| Location | Location DC where setup is created. For better performance, we recommend hosting the MI and Removal Utility in the same location. Default value is 'EastUS2'| No |
| SupportMultiTenant | Switch to support multi-tenant setup | No |
| IdentityApplicationId | AAD application Id.| Yes |
|I dentitySecretUri | AAD application secret uri| No |

6. Grant internal remediation identity with access to Key Vault
In this step a user assigned managed ident is created to enable function apps to read the Key Vault for authentication. You must have Owner access to the RG.

``` PowerShell
Grant-AzTSMMARemediationIdentityAccessOnKeyVault ` 
    -SubscriptionId <HostingSubId> `
    -ResourceId $KeyVault.Outputs.keyVaultResourceId.Value `
    -UserAssignedIdentityObjectId $Solution.Outputs.internalMIObjectId.Value `
    -SendAlertsToEmailIds @("<EmailId1>","<EmailId2>") `
    -IdentitySecretUri $KeyVault.Outputs.secretURI.Value `
    -LAWorkspaceResourceId $KeyVault.Outputs.logAnalyticsResourceId.Value `
    -DeployMonitoringAlert
```

Parameters

| Param Name | Description | Required |
|:----|:----|:----:|
|SubscriptionId| Subscription id where setup will be created | Yes |
|ResourceId| Resource Id of existing key vault | Yes |
|UserAssignedIdentityObjectId| Object id of your managed identity | Yes |
|SendAlertsToEmailIds| User email Ids to whom alerts should be sent| No, Yes if DeployMonitoringAlert switch is enabled |
| SecretUri | Key Vault SecretUri of the Removal Utility App's credentials | No, Yes if DeployMonitoringAlert switch is enabled |
| LAWorkspaceResourceId | ResourceId of the LA Workspace associated with key vault| No, Yes if DeployMonitoringAlert switch is enabled.|
| DeployMonitoringAlert | Create alerts on top of Key Vault auditing logs | No, Yes if DeployMonitoringAlert switch is enabled |

7. Setup runbook for managing key vault IP ranges
This step creates a secure Key Vault with public network access disabled. IP Ranges for function apps must be allowed access to the Key Valut. You must have owner access to the RG. You will perform the following operations:  
    - Creates or updates the automation account.  
    - Grants access for automation account using system-assigned managed identity on Key Vault.  
    - Setup the runbook with script to fetch the IP ranges published by Azure every week.  
    - Runs the runbook one-time at the time of setup and schedule task to run every week.  

``` 
Set-AzTSMMARemovalUtilityRunbook ` 
    -SubscriptionId <HostingSubId> `
    -ResourceGroupName <HostingRGName> `
    -Location <Location> `
    -FunctionAppUsageRegion <FunctionAppUsageRegion> `
    -KeyVaultResourceId $KeyVault.Outputs.keyVaultResourceId.Value
```

Parameters

|Param Name |Description | Required|
|:----|:----|:----|
|SubscriptionId| Subscription id where the automation account and key vault are present.| Yes|
|ResourceGroupName| Name of resource group where the automation account and key vault are | Yes|
|Location| Location where your automation account will be created. For better performance, we recommend creating all the resources related to setup in the same location. Default value is 'EastUS2'| No|
|FunctionAppUsageRegion| Location of dynamic ip addresses that are allowed on keyvault. Default location is EastUS2| Yes|
|KeyVaultResourceId| Resource id of the keyvault for ip addresses that are allowed.| Yes|

8. Setup SPN and grant required roles for each tenant
In this step you will create SPNs for each tenant and grant permission on each tenant. Setup requires Reader, Virtual Machine Contributor, and Azure Arc ScVmm VM contributor access on you scopes. Scopes Configured can be a Tenant/ManagementGroup(s)/Subscription(s) or both ManagementGroup(s) and Subscription(s).
For each tenant, perform the below steps and make sure you have enough permissions on the other tenant for creating SPNs. You must have **User Access Administrator (UAA) or Owner** on the configured scopes. For example, to running setup on subscription 'X' you have to have UAA role assignment on subscription 'X' to grant the SPN with the required permissions.

``` PowerShell
$TenantId = "<TenantId>"
Disconnect-AzureAD
Connect-AzureAD -TenantId $TenantId
$SPN = Set-AzSKTenantSecuritySolutionMultiTenantIdentitySPN -AppId $Identity.ApplicationId
Grant-AzSKAzureRoleToMultiTenantIdentitySPN -AADIdentityObjectId $SPN.ObjectId `
    -TargetSubscriptionIds @("<SubId1>","<SubId2>","<SubId3>") `
    -TargetManagementGroupNames @("<MGName1>","<MGName2>","<MGName3>")
```

Parameters
For Set-AzSKTenantSecuritySolutionMultiTenantIdentitySPN,

|Param Name | Description | Required |
|:----|:----|:----:|
|AppId| Your application Id that is created| Yes |

For Grant-AzSKAzureRoleToMultiTenantIdentitySPN,

|Param Name | Description | Required|
|:----|:----|:----:|
| AADIdentityObjectId | Your identity object| Yes|
| TargetSubscriptionIds| Your list of target subscription id(s) to run Setup on | No |
| TargetManagementGroupNames | Your list of target management group name(s) to run Setup on | No|

9. Configure target scopes
You can configure target scopes using the `Set-AzTSMMARemovalUtilitySolutionScopes` 

``` PowerShell
$ConfiguredTargetScopes = Set-AzTSMMARemovalUtilitySolutionScopes ` 
         -SubscriptionId <HostingSubId> `
         -ResourceGroupName <HostingRGName> `
         -ScopesFilePath <ScopesFilePath>
```
Parameters

|Param Name|Description|Required|
|:----|:----|:----:|
|SubscriptionId| Your subscription id where setup is installed | Yes |
|ResourceGroupName| Youre resource group name where setup is installed| Yes|
|ScopesFilePath| File path with target scope configurations. See scope configuration below | Yes |

Scope configuration file is a CSV file with a header row and three columns

| ScopeType | ScopeId | TenantId |
|:---|:---|:---|
| Subscription | /subscriptions/abb5301a-22a4-41f9-9e5f-99badff261f8 | 72f988bf-86f1-41af-91ab-2d7cd011db47 |
| Subscription | /subscriptions/71bdd12b-ae1d-499a-a4ea-e32d4c1d9c35 | e60f12c0-e1dc-4be1-8d86-e979a5527830 |

## Run The Tool
### [Discovery](#tab/Discovery)
``` PowerShell
Update-AzTSMMARemovalUtilityDiscoveryTrigger ` 
    -SubscriptionId <HostingSubId> `
    -ResourceGroupName <HostingRGName> `
    -StartScopeResolverAfterMinutes 60 `
    -StartExtensionDiscoveryAfterMinutes 30 
```

Parameters

|Param Name|Description|Required?
|:----|:----|:----:|
|SubscriptionId| Subscription id where you installed the Utility | Yes|
|ResourceGroupName| ResourceGroup name where you installed the Utility | Yes|
|StartScopeResolverAfterMinutes| Time in minutes to wait before running resolver | Yes (Mutually exclusive with param '-StartScopeResolverImmediatley')|
|StartScopeResolverImmediatley | Run resolver immediately | Yes (Mutually exclusive with param '-StartScopeResolverAfterMinutes') |
|StartExtensionDiscoveryAfterMinutes | Time in minutes to wait to run discovery (should be after resolver is done) | Yes (Mutually exclusive with param '-StartExtensionDiscoveryImmediatley')|
|StartExtensionDiscoveryImmediatley | Run extensions discovery immediately | Yes (Mutually exclusive with param '-StartExtensionDiscoveryAfterMinutes')|

### [Removal](#tab/Removal)
By default, the removal phase is disabled. We recommend that you run it after validating the inventory of machines from the discovery step.
``` PowerShell
Update-AzTSMMARemovalUtilityRemovalTrigger ` 
    -SubscriptionId <HostingSubId> `
    -ResourceGroupName <HostingRGName> `
    -StartAfterMinutes 60 `
    -EnableRemovalPhase `
    -RemovalCondition 'CheckForAMAPresence'
```

Parameters

| Param Name | Description | Required?
|:----|:----|:----:|
| SubscriptionId | Subscription id where you installed the Utility | Yes |
| ResourceGroupName | ResourceGroup name where you installed the Utility| Yes|
|  StartAfterMinutes  | Time in minutes to wait before starting removal | Yes (Mutually exclusive with param '-StartImmediately')|
| StartImmediately | Run removal phase immediately | Yes (Mutually exclusive with param '-StartAfterMinutes') |
| EnableRemovalPhase | Enable removal phase | Yes (Mutually exclusive with param '-DisableRemovalPhase')|
| RemovalCondition |  MMA extension should be removed when:</br>ChgeckForAMAPresence AMA extension is present </br> SkipAMAPresenceCheck in all cases whether AMA extension is present or not) | No |
| DisableRemovalPhase  | Disable removal phase | Yes (Mutually exclusive with param '-EnableRemovalPhase')|  

**Know issues**
- Removal of MMA agent in Virtual Machine Scale Set(VMSS) where orchestration mode is 'Uniform' will depend on its upgrade policy. We recommend that you manually upgrade the instance if the policy is set to 'Manual'.  
- If you get the error message, 'The deployment MMARemovalenvironmentsetup-20233029T103026 failed with error(s). Showing 1 out of 1 error(s). Status Message:  (Code:BadRequest) - We have observed this intermittent issue with App service deployment, please re-run the installation command with same parameter values. Command should proceed without any error in next attempt.  
- Extension removal progress tile on Monitoring dashboards shows some failures - Progress tile groups failures by error code, some known error code, reason and next steps to resolve them are listed below:  

| Error Code | Description/Reason | Next steps
|:----|:----|:----|  
| AuthorizationFailed | Remediation Identity does not have permission to perform 'Extension delete' operation on VM(s), VMSS, Azure Arc Servers.| Grant 'VM Contributor' role to Remediation Identity on VM(s) and Grant 'Azure Arc ScVmm VM Contributor' role to Remediation Identity on VMSS and re-run removal phase.|  
| OperationNotAllowed | Resource(s) are in a de-allocated state or a Lock is applied on the resource(s) | Turn on failed resource(s) and/or Remove Lock and re-run removal phase |  

The utility collects error details in the Log Analytics workspace that was used during set up. Go to Log Analytics workspace  > Select Logs and run following query: 

``` KQL
let timeago = timespan(7d);
InventoryProcessingStatus_CL
| where TimeGenerated > ago(timeago) and Source_s == "AzTS_07_ExtensionRemovalProcessor"
| where ProcessingStatus_s !~ "Initiated"
| summarize arg_max(TimeGenerated,*) by tolower(ResourceId)
| project ResourceId, ProcessingStatus_s, ProcessErrorDetails_s
```

## [Clean%20Up](#tab/Clean%20Up)

The utility creates resources that you should clean up once you have remove MMA from your infrastructure. Execute the following steps to clean up.  
 1. Go to the folder containing the deployment package and load the cleanup script  

  ``` PowerShell
  CD "<LocalExtractedFolderPath>\AzTSMMARemovalUtilityDeploymentFiles"
  . ".\MMARemovalUtilityCleanUpScript.ps1"
```

2. run the cleanup script  

``` PowerShell
Remove-AzTSMMARemovalUtilitySolutionResources ` 
    -SubscriptionId <HostingSubId> `
    -ResourceGroupName <HostingRGName> `
    [-DeleteResourceGroup `]
    -KeepInventoryAndProcessLogs
```

Parameters

|Param Name|Description|Required|
|:----|:----|:----:|
|SubscriptionId| Subscription id that the Utility will be deleted| Yes|
|ResourceGroupName| ResourceGroup name which will be deleted| Yes|
|DeleteResourceGroup| Boolean flag to delete entire resource group| Yes|
|KeepInventoryAndProcessLogs| Boolean flag to exclude log analytics workspace and application insights. Can’t be used with DeleteResourceGroup.| No|
