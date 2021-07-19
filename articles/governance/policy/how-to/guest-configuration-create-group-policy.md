---
title: How to create Guest Configuration policy definitions from Group Policy baseline for Windows
description: Learn how to convert Group Policy from the Windows Server 2019 Security Baseline into a policy definition.
ms.date: 03/31/2021
ms.topic: how-to
---
# How to create Guest Configuration policy definitions from Group Policy baseline for Windows

Before creating custom policy definitions, it's a good idea to read the conceptual overview
information at [Azure Policy Guest Configuration](../concepts/guest-configuration.md). To learn
about creating custom Guest Configuration policy definitions for Linux, see
[How to create Guest Configuration policies for Linux](./guest-configuration-create-linux.md). To
learn about creating custom Guest Configuration policy definitions for Windows, see
[How to create Guest Configuration policies for Windows](./guest-configuration-create.md).

When auditing Windows, Guest Configuration uses a
[Desired State Configuration](/powershell/scripting/dsc/overview/overview) (DSC) resource module to
create the configuration file. The DSC configuration defines the condition that the machine should
be in. If the evaluation of the configuration is **non-compliant**, the policy effect
*auditIfNotExists* is triggered.
[Azure Policy Guest Configuration](../concepts/guest-configuration.md) only audits settings inside
machines.

> [!IMPORTANT]
> The Guest Configuration extension is required to perform audits in Azure virtual machines. To
> deploy the extension at scale across all Windows machines, assign the following policy
> definitions:
> - [Deploy prerequisites to enable Guest Configuration Policy on Windows VMs.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0ecd903d-91e7-4726-83d3-a229d7f2e293)
>
> Don't use secrets or confidential information in custom content packages.

The DSC community has published the
[BaselineManagement module](https://github.com/microsoft/BaselineManagement) to convert exported
Group Policy templates to DSC format. Together with the GuestConfiguration cmdlet, the
BaselineManagement module creates Azure Policy Guest Configuration package for Windows from Group
Policy content. For details about using the BaselineManagement module, see the article
[Quickstart: Convert Group Policy into DSC](/powershell/scripting/dsc/quickstarts/gpo-quickstart).

In this guide, we walk through the process to create an Azure Policy Guest Configuration package
from a Group Policy Object (GPO). While the walkthrough outlines conversion of the Windows Server
2019 Security Baseline, the same process can be applied to other GPOs.

## Download Windows Server 2019 Security Baseline and install related PowerShell modules

To install the **DSC**, **GuestConfiguration**, **Baseline Management**, and related Azure modules
in PowerShell:

1. From a PowerShell prompt, run the following command:

   ```azurepowershell-interactive
   # Install the BaselineManagement module, Guest Configuration DSC resource module, and relevant Azure modules from PowerShell Gallery
   Install-Module az.resources, az.policyinsights, az.storage, guestconfiguration, gpregistrypolicyparser, securitypolicydsc, auditpolicydsc, baselinemanagement -scope currentuser -Repository psgallery -AllowClobber
   ```

1. Create a directory for and download the Windows Server 2019 Security Baseline from the Windows
   Security Compliance toolkit.

   ```azurepowershell-interactive
   # Download the 2019 Baseline files from https://docs.microsoft.com/windows/security/threat-protection/security-compliance-toolkit-10
   New-Item -Path 'C:\git\policyfiles\downloads' -Type Directory
   Invoke-WebRequest -Uri 'https://download.microsoft.com/download/8/5/C/85C25433-A1B0-4FFA-9429-7E023E7DA8D8/Windows%2010%20Version%201909%20and%20Windows%20Server%20Version%201909%20Security%20Baseline.zip' -Out C:\git\policyfiles\downloads\Server2019Baseline.zip
   ```

1. Unblock and expand the downloaded Server 2019 Baseline.

   ```azurepowershell-interactive
   Unblock-File C:\git\policyfiles\downloads\Server2019Baseline.zip
   Expand-Archive -Path C:\git\policyfiles\downloads\Server2019Baseline.zip -DestinationPath C:\git\policyfiles\downloads\
   ```

1. Validate the Server 2019 Baseline contents using **MapGuidsToGpoNames.ps1**.

   ```azurepowershell-interactive
   # Show content details of downloaded GPOs
   C:\git\policyfiles\downloads\Scripts\Tools\MapGuidsToGpoNames.ps1 -rootdir C:\git\policyfiles\downloads\GPOs\ -Verbose
   ```

## Convert from Group Policy to Azure Policy Guest Configuration

Next, we convert the downloaded Server 2019 Baseline into a Guest Configuration Package using the
Guest Configuration and Baseline Management modules.

1. Convert the Group Policy to Desired State Configuration using the Baseline Management Module.

   ```azurepowershell-interactive
   ConvertFrom-GPO -Path 'C:\git\policyfiles\downloads\GPOs\{3657C7A2-3FF3-4C21-9439-8FDF549F1D68}\' -OutputPath 'C:\git\policyfiles\' -OutputConfigurationScript -Verbose
   ```

1. Rename, reformat, and run the converted scripts before creating a policy content package.

   ```azurepowershell-interactive
   Rename-Item -Path C:\git\policyfiles\DSCFromGPO.ps1 -NewName C:\git\policyfiles\Server2019Baseline.ps1
   (Get-Content -Path C:\git\policyfiles\Server2019Baseline.ps1).Replace('DSCFromGPO', 'Server2019Baseline') | Set-Content -Path C:\git\policyfiles\Server2019Baseline.ps1
   (Get-Content -Path C:\git\policyfiles\Server2019Baseline.ps1).Replace('PSDesiredStateConfiguration', 'PSDscResources') | Set-Content -Path C:\git\policyfiles\Server2019Baseline.ps1
   C:\git\policyfiles\Server2019Baseline.ps1
   ```

1. Create an Azure Policy Guest Configuration content package.

   ```azurepowershell-interactive
   New-GuestConfigurationPackage -Name Server2019Baseline -Configuration c:\git\policyfiles\localhost.mof -Verbose
   ```

## Create Azure Policy Guest Configuration

1. The next step is to publish the file to Azure Blob Storage. The command
   `Publish-GuestConfigurationPackage` requires the `Az.Storage` module.

   ```azurepowershell-interactive
   Publish-GuestConfigurationPackage -Path ./AuditBitlocker.zip -ResourceGroupName  myResourceGroupName -StorageAccountName myStorageAccountName
   ```

1. Once a Guest Configuration custom policy package has been created and uploaded, create the Guest
   Configuration policy definition. Use the `New-GuestConfigurationPolicy` cmdlet to create the
   Guest Configuration.

   ```azurepowershell-interactive
   $NewGuestConfigurationPolicySplat = @{
        ContentUri = $Uri
        DisplayName = 'Server 2019 Configuration Baseline'
        Description 'Validation of using a completely custom baseline configuration for Windows VMs'
        Path = 'C:\git\policyfiles\policy'  
        Platform = Windows
   }
   New-GuestConfigurationPolicy @NewGuestConfigurationPolicySplat
   ```

1. Publish the policy definitions using the `Publish-GuestConfigurationPolicy` cmdlet. The cmdlet
   only has the **Path** parameter that points to the location of the JSON files created by
   `New-GuestConfigurationPolicy`. To run the Publish command, you need access to create policy
   definitions in Azure. The specific authorization requirements are documented in the
   [Azure Policy Overview](../overview.md#getting-started) page. The best built-in role is
   **Resource Policy Contributor**.

   ```azurepowershell-interactive
   Publish-GuestConfigurationPolicy -Path C:\git\policyfiles\policy\ -Verbose
   ```

## Assign Guest Configuration policy definition

With the policy created in Azure, the last step is to assign the initiative. See how to assign the
initiative with [Portal](../assign-policy-portal.md), [Azure CLI](../assign-policy-azurecli.md), and
[Azure PowerShell](../assign-policy-powershell.md).

> [!IMPORTANT]
> Guest Configuration policy definitions must **always** be assigned using the initiative that
> combines the _AuditIfNotExists_ and _DeployIfNotExists_ policies. If only the _AuditIfNotExists_
> policy is assigned, the prerequisites aren't deployed and the policy always shows that '0' servers
> are compliant.

Assigning a policy definition with _DeployIfNotExists_ effect requires an additional level of
access. To grant the least privilege, you can create a custom role definition that extends
**Resource Policy Contributor**. The following example creates a role named **Resource Policy
Contributor DINE** with the additional permission _Microsoft.Authorization/roleAssignments/write_.

   ```azurepowershell-interactive
   $subscriptionid = '00000000-0000-0000-0000-000000000000'
   $role = Get-AzRoleDefinition "Resource Policy Contributor"
   $role.Id = $null
   $role.Name = "Resource Policy Contributor DINE"
   $role.Description = "Can assign Policies that require remediation."
   $role.Actions.Clear()
   $role.Actions.Add("Microsoft.Authorization/roleAssignments/write")
   $role.AssignableScopes.Clear()
   $role.AssignableScopes.Add("/subscriptions/$subscriptionid")
   New-AzRoleDefinition -Role $role
   ```

## Next steps

- Learn about auditing VMs with [Guest Configuration](../concepts/guest-configuration.md).
- Understand how to [programmatically create policies](./programmatically-create.md).
- Learn how to [get compliance data](./get-compliance-data.md).
