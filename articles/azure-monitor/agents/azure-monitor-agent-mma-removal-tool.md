---
title: MMA Discovery and Removal Utility
description: This article describes a PowerShell script to remove the legacy agent from systems that have migrated to the Azure Monitor Agent.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo
ms.date: 01/09/2024
ms.custom:
# Customer intent: As an Azure account administrator, I want to use the available Azure Monitor tools to migrate from the Log Analytics Agent to the Azure Monitor Agent and track the status of the migration in my account.
---

# MMA Discovery and Removal Utility

After you migrate your machines to the Azure Monitor Agent (AMA), you need to remove the Log Analytics Agent (also called the Microsoft Management Agent or MMA) to avoid duplication of logs. The Azure Tenant Security Solution (AzTS) MMA Discovery and Removal Utility can centrally remove the MMA extension from Azure virtual machines (VMs), Azure virtual machine scale sets, and Azure Arc servers from a tenant.  
> [!NOTE]
> This utility is used to discover and remove MMA extensions. This will not remove OMS extensions, OMS will need to be removed manually by running the purge script here: [Purge the Linux Agent](../agents/agent-linux-troubleshoot.md#purge-and-reinstall-the-linux-agent)

The utility works in two steps:

1. *Discovery*: The utility creates an inventory of all machines that have the MMA installed. We recommend that you don't create any new VMs, virtual machine scale sets, or Azure Arc servers with the MMA extension while the utility is running.  

2. *Removal*: The utility selects machines that have both the MMA and the AMA and removes the MMA extension. You can disable this step and run it after you validate the list of machines. There's an option to remove the extension from machines that have only the MMA, but we recommend that you first migrate all dependencies to the AMA and then remove the MMA.  

## Prerequisites  

Do all the setup steps in [Visual Studio Code](https://code.visualstudio.com/) with the [PowerShell extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell). You need:

- Windows 10 or later, or Windows Server 2019 or later.
- PowerShell 5.0 or later. Check the version by running `$PSVersionTable`.
- PowerShell. The language must be set to `FullLanguage` mode. Check the mode by running `$ExecutionContext.SessionState.LanguageMode` in PowerShell. For more information, see the [PowerShell reference](/powershell/module/microsoft.powershell.core/about/about_language_modes?source=recommendations).
- Bicep. The setup scripts use Bicep to automate the installation. Check the installation by running `bicep --version`. For more information, see [Install Bicep tools](/azure/azure-resource-manager/bicep/install#azure-powershell).
- A [user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview) that has **Reader**, **Virtual Machine Contributor**, and **Azure Arc ScVmm VM Contributor** access on target scopes.
- A new resource group to contain all the Azure resources that the setup automation creates automatically.
- Appropriate permission on the configured scopes. To grant the remediation user-assigned managed identity with the previously mentioned roles on the target scopes, you must have **User Access Administrator** or **Owner** permission. For example, if you're configuring the setup for a particular subscription, you must have the **User Access Administrator** role assignment on that subscription so that the script can provide the permissions for the remediation user-assigned managed identity.

## Resources created
The removal tool will create a resouce group and create the following resouces to manage the removal of agents. Some of these may have an Azure cost.


## Download the deployment package

The deployment package contains:

- Bicep templates, which contain resource configuration details that you create as part of setup.
- Deployment setup scripts, which provide the cmdlet to run the installation.

To install the package:

1. Go to the [AzTS-docs GitHub repository](https://github.com/azsk/AzTS-docs/tree/main/TemplateFiles). Download the deployment package file, *AzTSMMARemovalUtilityDeploymentFiles.zip*, to your local machine.

1. Extract the .zip file to your local folder location.

1. Unblock the files by using this script:

   ``` PowerShell
   Get-ChildItem -Path "<Extracted folder path>" -Recurse | Unblock-File 
   ```

## Set up the utility

### [Single tenant](#tab/single-tenant)

1. Go to the deployment folder and load the consolidated setup script. You must have **Owner** access on the subscription.

   ``` PowerShell
   CD "<LocalExtractedFolderPath>\AzTSMMARemovalUtilityDeploymentFiles"
   . ".\MMARemovalUtilityConsolidatedSetup.ps1"
   ```

1. Sign in to the Azure account by using the following PowerShell command:  

   ``` PowerShell
   $TenantId = "<TenantId>"
   Connect-AzAccount -Tenant $TenantId
   ```

1. Run the setup script to perform the following operations:

   - Install required Az modules.
   - Set up the remediation user-assigned managed identity.
   - Prompt and collect onboarding details for usage telemetry collection based on user preference.
   - Create or update the resource group.
   - Create or update the resources with assigned managed identities.
   - Create or update the monitoring dashboard.
   - Configure target scopes.

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

   The script contains these parameters:

   |Parameter name | Description | Required |
   |:----|:----|:----:|
   |`RemediationIdentityHostSubId`| Subscription ID to create remediation resources. | Yes |
   |`RemediationIdentityHostRGName`| New resource group name to create remediation. Defaults to `AzTS-MMARemovalUtility-RG`.| No |
   |`RemediationIdentityName`| Name of the remediation managed identity.| Yes |
   |`TargetSubscriptionIds`| List of target subscription IDs to run on. | No |
   |`TargetManagementGroupNames`| List of target management group names to run on. | No|
   |`TenantScope`| Tenant scope for assigning roles via your tenant ID.| No|
   |`SubscriptionId`| ID of the subscription where the setup is installed.| Yes|
   |`HostRGName`| Name of the new resource group where the remediation managed identity is created. Default value is `AzTS-MMARemovalUtility-Host-RG`.| No|
   |`Location`| Location domain controller where the setup is created. Default value is `EastUS2`.| No|
   |`AzureEnvironmentName`| Azure environment where the solution is installed: `AzureCloud` or `AzureGovernmentCloud`. Default value is `AzureCloud`.| No|

### [Multitenant](#tab/multitenant)

This section walks you through the steps for setting up the multitenant AzTS MMA Discovery and Removal Utility. This setup might take up to 30 minutes.

#### Load the setup script

Point the current path to the folder that contains the extracted deployment package and run the setup script:

``` PowerShell
CD "<LocalExtractedFolderPath>\AzTSMMARemovalUtilityDeploymentFiles"
. ".\MMARemovalUtilitySetup.ps1"
```

#### Install required Az modules

Az PowerShell modules contain cmdlets to deploy Azure resources. Install the required Az modules by using the following command. For more information about Az modules, see [How to install Azure PowerShell](/powershell/azure/install-az-ps). You must point the current path to the extracted folder location.

``` PowerShell
Set-Prerequisites
```

#### Set up multitenant identity

In this step, you set up a Microsoft Entra application identity by using a service principal. You must sign in to the Microsoft Entra account where you want to install the MMA Discovery and Removal Utility setup by using the PowerShell command.

You perform the following operations:

- Create a multitenant Microsoft Entra application if one isn't provided with a preexisting Microsoft Entra application object ID.
- Create password credentials for the Microsoft Entra application.

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

The script contains these parameters:

|Parameter name| Description | Required |
|:----|:----|:----:|
| `DisplayName` | Display name of the remediation identity.| Yes |
| `ObjectId` | Object ID of the remediation identity. | No |
| `AdditionalOwnerUPNs` | User principal names (UPNs) of the owners for the app to be created. | No |

#### Set up storage

In this step, you set up storage for secrets. You must have **Owner** access on the subscription to create a resource group.

You perform the following operations:

- Create or update the resource group for a key vault.
- Create or update the key vault.
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

The script contains these parameters:

|Parameter name|Description|Required|
|:----|:----|:----|
| `SubscriptionId` | Subscription ID where the key vault is created.| Yes |
| `ResourceGroupName` | Name of the resource group where the key vault is created. It should be a different resource group from the setup resource group. | Yes |
|`Location`| Location domain controller where the key vault is created. For better performance, we recommend creating all the resources related to setup in one location. Default value is `EastUS2`.| No |
|`KeyVaultName`| Name of the key vault that's created.| Yes |
|`AADAppPasswordCredential`| Microsoft Entra application password credentials for the MMA Discovery and Removal Utility.| Yes |

#### Set up installation

In this step, you install the MMA Discovery and Removal Utility. You must have **Owner** access to the subscription where the setup is created. We recommend that you use a new resource group for the utility.

You perform the following operations:

- Prompt and collect onboarding details for usage telemetry collection based on user preference.
- Create the resource group if it doesn't exist.
- Create or update the resources with managed identities.
- Create or update the monitoring dashboard.

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

The script contains these parameters:

| Parameter name | Description | Required |
|:----|:----|:----|
| `SubscriptionId` | ID of the subscription where the setup is created. | Yes |
| `HostRGName` | Name of the resource group where the setup is created. Default value is `AzTS-MMARemovalUtility-Host-RG`.| No |
| `Location` | Location domain controller where the setup is created. For better performance, we recommend hosting the managed identity and the MMA Discovery and Removal Utility in the same location. Default value is `EastUS2`.| No |
| `SupportMultiTenant` | Switch to support multitenant setup. | No |
| `IdentityApplicationId` | Microsoft Entra application ID.| Yes |
| `IdentitySecretUri` | Microsoft Entra application secret URI.| No |

#### Grant an internal remediation identity with access to the key vault

In this step, you create a user-assigned managed identity to enable function apps to read the key vault for authentication. You must have **Owner** access to the resource group.

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

The script contains these parameters:

| Parameter name | Description | Required |
|:----|:----|:----:|
|`SubscriptionId`| ID of the subscription where the setup is created. | Yes |
|`ResourceId`| Resource ID of the existing key vault. | Yes |
|`UserAssignedIdentityObjectId`| Object ID of your managed identity. | Yes |
|`SendAlertsToEmailIds`| User email IDs to whom alerts should be sent.| No; yes if the `DeployMonitoringAlert` switch is enabled |
| `SecretUri` | Key vault secret URI of the MMA Discovery and Removal Utility app's credentials. | No; yes if the `DeployMonitoringAlert` switch is enabled |
| `LAWorkspaceResourceId` | Resource ID of the Log Analytics workspace associated with the key vault.| No; yes if the `DeployMonitoringAlert` switch is enabled.|
| `DeployMonitoringAlert` | Creation of alerts on top of the key vault's auditing logs. | No; yes if the `DeployMonitoringAlert` switch is enabled |

#### Set up a runbook for managing key vault IP ranges

In this step, you create a secure key vault with public network access disabled. IP ranges for function apps must be allowed access to the key vault. You must have **Owner** access to the resource group.

You perform the following operations:  

- Create or update the automation account.
- Grant access for the automation account by using a system-assigned managed identity on the key vault.
- Set up the runbook with a script to fetch the IP ranges that Azure publishes every week.
- Run the runbook one time at the time of setup, and schedule a task to run every week.

``` PowerShell
Set-AzTSMMARemovalUtilityRunbook ` 
    -SubscriptionId <HostingSubId> `
    -ResourceGroupName <HostingRGName> `
    -Location <Location> `
    -FunctionAppUsageRegion <FunctionAppUsageRegion> `
    -KeyVaultResourceId $KeyVault.Outputs.keyVaultResourceId.Value
```

The script contains these parameters:

|Parameter name |Description | Required|
|:----|:----|:----|
|`SubscriptionId`| ID of the subscription that includes the automation account and key vault.| Yes|
|`ResourceGroupName`| Name of resource group that contains the automation account and key vault. | Yes|
|`Location`| Location where your automation account is created. For better performance, we recommend creating all the resources related to setup in the same location. Default value is `EastUS2`.| No|
|`FunctionAppUsageRegion`| Location of dynamic IP addresses that are allowed on the key vault. Default location is `EastUS2`.| Yes|
|`KeyVaultResourceId`| Resource ID of the key vault for allowed IP addresses.| Yes|

#### Set up SPNs and grant required roles for each tenant

In this step, you create service principal names (SPNs) for each tenant and grant permission on each tenant. Setup requires **Reader**, **Virtual Machine Contributor**, and **Azure Arc ScVmm VM Contributor** access on your scopes. Configured scopes can be tenant, management group, or subscription, or they can be both management group and subscription.

For each tenant, perform the steps and make sure you have enough permissions on the other tenant for creating SPNs. You must have **User Access Administrator** or **Owner** permission on the configured scopes. For example, to run the setup on a particular subscription, you must have a **User Access Administrator** role assignment on that subscription to grant the SPN with the required permissions.

``` PowerShell
$TenantId = "<TenantId>"
Disconnect-AzureAD
Connect-AzureAD -TenantId $TenantId
$SPN = Set-AzSKTenantSecuritySolutionMultiTenantIdentitySPN -AppId $Identity.ApplicationId
Grant-AzSKAzureRoleToMultiTenantIdentitySPN -AADIdentityObjectId $SPN.ObjectId `
    -TargetSubscriptionIds @("<SubId1>","<SubId2>","<SubId3>") `
    -TargetManagementGroupNames @("<MGName1>","<MGName2>","<MGName3>")
```

The script contains these parameters for `Set-AzSKTenantSecuritySolutionMultiTenantIdentitySPN`:

|Parameter name | Description | Required |
|:----|:----|:----:|
|`AppId`| Your created application ID.| Yes |

The script contains these parameters for `Grant-AzSKAzureRoleToMultiTenantIdentitySPN`:

|Parameter name | Description | Required|
|:----|:----|:----:|
| `AADIdentityObjectId` | Your identity object.| Yes|
| `TargetSubscriptionIds`| Your list of target subscription IDs to run the setup on. | No |
| `TargetManagementGroupNames` | Your list of target management group names to run the setup on. | No|

#### Configure target scopes

You can configure target scopes by using `Set-AzTSMMARemovalUtilitySolutionScopes`:

``` PowerShell
$ConfiguredTargetScopes = Set-AzTSMMARemovalUtilitySolutionScopes ` 
         -SubscriptionId <HostingSubId> `
         -ResourceGroupName <HostingRGName> `
         -ScopesFilePath <ScopesFilePath>
```

The script contains these parameters:

|Parameter name|Description|Required|
|:----|:----|:----:|
|`SubscriptionId`| ID of your subscription where the setup is installed. | Yes |
|`ResourceGroupName`| Name of your resource group where the setup is installed.| Yes|
|`ScopesFilePath`| File path with target scope configurations.| Yes |

The scope configuration file is a CSV file with a header row and three columns:

| ScopeType | ScopeId | TenantId |
|:---|:---|:---|
| Subscription | `/subscriptions/abb5301a-22a4-41f9-9e5f-99badff261f8` | `72f988bf-86f1-41af-91ab-2d7cd011db47` |
| Subscription | `/subscriptions/71bdd12b-ae1d-499a-a4ea-e32d4c1d9c35` | `e60f12c0-e1dc-4be1-8d86-e979a5527830` |

---

## Run the utility

### [Discovery](#tab/discovery)

``` PowerShell
Update-AzTSMMARemovalUtilityDiscoveryTrigger ` 
    -SubscriptionId <HostingSubId> `
    -ResourceGroupName <HostingRGName> `
    -StartScopeResolverAfterMinutes 60 `
    -StartExtensionDiscoveryAfterMinutes 30 
```

The script contains these parameters:

|Parameter name|Description|Required|
|:----|:----|:----:|
|`SubscriptionId`| ID of the subscription where you installed the utility. | Yes|
|`ResourceGroupName`| Name of the resource group where you installed the utility. | Yes|
|`StartScopeResolverAfterMinutes`| Time, in minutes, to wait before running the resolver. | Yes (mutually exclusive with `-StartScopeResolverImmediately`)|
|`StartScopeResolverImmediately` | Indicator to run the resolver immediately. | Yes (mutually exclusive with `-StartScopeResolverAfterMinutes`) |
|`StartExtensionDiscoveryAfterMinutes` | Time, in minutes, to wait to run discovery (should be after the resolver is done). | Yes (mutually exclusive with `-StartExtensionDiscoveryImmediatley`)|
|`StartExtensionDiscoveryImmediatley` | Indicator to run extension discovery immediately. | Yes (mutually exclusive with `-StartExtensionDiscoveryAfterMinutes`)|

### [Removal](#tab/removal)

By default, the removal phase is disabled. We recommend that you run it after validating the inventory of machines from the discovery step.

``` PowerShell
Update-AzTSMMARemovalUtilityRemovalTrigger ` 
    -SubscriptionId <HostingSubId> `
    -ResourceGroupName <HostingRGName> `
    -StartAfterMinutes 60 `
    -EnableRemovalPhase `
    -RemovalCondition 'CheckForAMAPresence'
```

The script contains these parameters:

| Parameter name | Description | Required |
|:----|:----|:----:|
| `SubscriptionId` | ID of the subscription where you installed the utility. | Yes |
| `ResourceGroupName` | Name of the resource group where you installed the utility.| Yes|
|  `StartAfterMinutes`  | Time, in minutes, to wait before starting removal. | Yes (mutually exclusive with `-StartImmediately`)|
| `StartImmediately` | Indicator to run the removal phase immediately. | Yes (mutually exclusive with `-StartAfterMinutes`) |
| `EnableRemovalPhase` | Indicator to enable the removal phase. | Yes (mutually exclusive with `-DisableRemovalPhase`)|
| `RemovalCondition` |  Indicator that the MMA extension should be removed when the `CheckForAMAPresence` AMA extension is present. It's `SkipAMAPresenceCheck` in all cases, whether an AMA extension is present or not. | No |
| `DisableRemovalPhase`  | Indicator of disabling the removal phase. | Yes (mutually exclusive with `-EnableRemovalPhase`)|  

Here are known issues with removal:

- Removal of the MMA in a virtual machine scale set where the orchestration mode is `Uniform` depends on its upgrade policy. We recommend that you manually upgrade the instance if the policy is set to `Manual`.  
- If you get the following error message, rerun the installation command with the same parameter values:

  `The deployment MMARemovalenvironmentsetup-20233029T103026 failed with error(s). Showing 1 out of 1 error(s). Status Message:  (Code:BadRequest) - We observed intermittent issue with App service deployment.`
  
  The command should proceed without any error in the next attempt.  
- If the progress tile for extension removal shows failures on monitoring dashboards, use the following information to resolve them:  

  | Error code | Description/reason | Next steps|
  |:----|:----|:----|  
  | `AuthorizationFailed` | The remediation identity doesn't have permission to perform an extension deletion operation on VMs, virtual machine scale sets, or Azure Arc servers.| Grant the **VM Contributor** role to the remediation identity on VMs. Grant the **Azure Arc ScVmm VM Contributor** role to the remediation identity on virtual machine scale sets. Then rerun the removal phase.|  
  | `OperationNotAllowed` | Resources are in a deallocated state, or a lock is applied on the resources. | Turn on failed resources and/or remove the lock, and then rerun the removal phase. |  

The utility collects error details in the Log Analytics workspace that you used during setup. Go to the Log Analytics workspace, select **Logs**, and then run the following query:

``` KQL
let timeago = timespan(7d);
InventoryProcessingStatus_CL
| where TimeGenerated > ago(timeago) and Source_s == "AzTS_07_ExtensionRemovalProcessor"
| where ProcessingStatus_s !~ "Initiated"
| summarize arg_max(TimeGenerated,*) by tolower(ResourceId)
| project ResourceId, ProcessingStatus_s, ProcessErrorDetails_s
```

### [Cleanup](#tab/cleanup)

The MMA Discovery and Removal Utility creates resources that you should clean up after you remove the MMA from your infrastructure. Complete the following steps to clean up:  

1. Go to the folder that contains the deployment package and load the cleanup script:

   ``` PowerShell
   CD "<LocalExtractedFolderPath>\AzTSMMARemovalUtilityDeploymentFiles"
   . ".\MMARemovalUtilityCleanUpScript.ps1"
   ```

2. Run the cleanup script:

   ``` PowerShell
   Remove-AzTSMMARemovalUtilitySolutionResources ` 
       -SubscriptionId <HostingSubId> `
       -ResourceGroupName <HostingRGName> `
       [-DeleteResourceGroup `]
       -KeepInventoryAndProcessLogs
   ```

The script contains these parameters:

|Parameter name|Description|Required|
|:----|:----|:----:|
|`SubscriptionId`| ID of the subscription that you're deleting.| Yes|
|`ResourceGroupName`| Name of the resource group that you're deleting.| Yes|
|`DeleteResourceGroup`| Boolean flag to delete an entire resource group.| Yes|
|`KeepInventoryAndProcessLogs`| Boolean flag to exclude the Log Analytics workspace and Application Insights. You can't use it with `DeleteResourceGroup`.| No|

---
