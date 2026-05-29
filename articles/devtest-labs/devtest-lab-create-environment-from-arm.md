---
title: Create environments from ARM templates
titleSuffix: Azure DevTest Labs
description: Create multiple virtual machines in platform-as-a-service (PaaS) environments by using Azure Resource Manager (ARM) templates in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/16/2025
ms.custom:
  - engagement-fy23
  - devx-track-azurepowershell
  - UpdateFrequency2
  - devx-track-arm-template
  - sfi-image-nochange
#customer intent: As a developer, I want to use ARM templates in Azure DevTest Labs so that I can create virtual machines or PaaS resources in DevTest Labs environments.
---
# Create environments from ARM templates

You can use Azure DevTest Labs environments to easily and consistently provision labs with multiple virtual machines (VMs) and platform-as-a-service (PaaS) resources. This article describes how to create DevTest Labs environments from [Azure Resource Manager (ARM)](../azure-resource-manager/templates/syntax.md) templates. You might use this approach to create a lab for a multitier web application or a SharePoint farm.

Resources in a DevTest Labs environment share the same lifecycle. You can manage them together, and track the cost of individual PaaS resources in the lab environment just as you track costs for individual VMs.

You can configure a lab to use ARM environment templates from public or private Git template repositories. The following diagram shows how DevTest Labs uses an ARM template from a public or private repository to deploy an environment containing VMs and other resources.

:::image type="content" source="./media/devtest-lab-create-environment-from-arm/devtest-labs-create-environment-with-arm.png" alt-text="Diagram that shows getting ARM templates from Git repositories and using them to deploy environments with PaaS resources." border="false" lightbox="./media/devtest-lab-create-environment-from-arm/devtest-labs-create-environment-with-arm.png":::

[!INCLUDE [direct-azure-deployment-environments](includes/direct-azure-deployment-environments.md)]

## Prerequisites

- To add or configure template repositories for a lab, at least **Contributor** permissions in the lab.
- To create Azure DevTest environments from available ARM templates, at least **DevTest User** permissions in the lab.
- To run the PowerShell script in [Automate environment creation](#automate-environment-creation), Azure PowerShell with the `Az.Resources` module installed.

## Limitations

Environments created from ARM environment templates in DevTest Labs have the following limitations:

- The [autoshutdown feature](/azure/virtual-machines/auto-shutdown-vm) for VMs isn't supported.
- The following lab policies aren't enforced or evaluated:
  - Number of VMs per lab user
  - Number of premium VMs per user
  - Number of premium disks per user

  For example, even if lab policy only allows each user to create a maximum of five VMs, the user can deploy an ARM environment template that creates dozens of VMs.

## Configure template repositories for labs

You can configure your lab to use ARM environment templates from the DevTest Labs public ARM template repository and from other public or private Git repositories. When you enable lab access to a template repository, lab users can quickly create environments by selecting templates in the Azure portal, similar to creating VMs.

The DevTest Labs [public ARM template repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments) includes preauthored environment templates for Azure Web Apps, an Azure Service Fabric cluster, and development SharePoint farms. For a smooth getting-started experience with PaaS resources, the templates have minimal input parameters.

You can use the public environment templates as-is or customize them to suit your needs. You can also suggest revisions or additions to a public template by submitting a pull request against the GitHub public template repository.

You can also store environment templates in other public or private Git repositories, and add those repositories to your lab to make the templates available to all lab users. For instructions, see [Store ARM templates in Git repositories](devtest-lab-use-resource-manager-template.md#store-arm-templates-in-git-repositories) and [Add template repositories to labs](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs).

### Configure public environment settings

You can enable lab access to the DevTest Labs [public template repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments) for a new or existing lab. When you enable access to the repository, you can select which environment templates to make available to lab users.

<a name="set-public-environment-access-for-new-lab"></a>
#### Configure public environment access for a new lab

To configure public environment repository access when you [create a new lab](devtest-lab-create-lab.md), on the **Basic Settings** tab, set the **Public environments** option to **On** or **Off**. This option is set to **On** by default.

:::image type="content" source="media/devtest-lab-create-environment-from-arm/public-environments-on.png" alt-text="Screenshot that shows how to enable public environment repositories for a lab during the lab creation process." lightbox="media/devtest-lab-create-environment-from-arm/public-environments-on-large.png":::

#### Configure public environment access for an existing lab

To enable or disable public environment repository access for an existing lab:

1. On the [Azure portal](https://portal.azure.com) **Overview** page for your lab, select **Configuration and policies** under **Settings** in the left navigation menu.

1. On the **Configuration and policies** page, expand **Virtual machine bases** in the left menu and select **Public environments**.

1. On the **Public environments** page, set the **Enable Public Environments for this lab** option to **Yes** or **No**.

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/enable-public-environments.png" alt-text="Screenshot that shows how to enable all public environment repositories for an existing lab resource." lightbox="media/devtest-lab-create-environment-from-arm/enable-public-environments-large.png":::

1. Select **Save**.

#### Select available public environment templates

When you enable the public environment repository for a lab, all environment templates in the repository are available to your lab users by default. You can choose to disable access to selected templates. The disabled templates no longer appear in the list of environments users can create.

To disallow access to specific environment templates:

1. On your lab's Azure portal **Configuration and policies** > **Virtual machine bases** > **Public environments** page, deselect the checkboxes next to the environments you want to disable.

1. Select **Save**.

:::image type="content" source="media/devtest-lab-create-environment-from-arm/select-public-environments.png" alt-text="Screenshot that shows how to deselect public environment repositories for a lab to disable access for users." lightbox="media/devtest-lab-create-environment-from-arm/select-public-environments.png":::

<a name="configure-environment-user-rights"></a>
## Configure environment user permissions

By default, lab users are assigned to the **Reader** role in environments they create. Readers can't stop, start, or modify environment resources like SQL servers or databases. To allow lab users to edit resources in their environments, you can grant them **Contributor** role in the resource group for their environment.

1. On the [Azure portal](https://portal.azure.com) **Overview** page for your lab, select **Configuration and policies** under **Settings** in the left navigation menu.

1. On the **Configuration and policies** page, expand **Settings** in the left menu and select **Lab settings**.

1. On the **Lab settings** page under **Environment access**, set the **Resource group user rights** option to **Contributor**.

1. Select **Save**.

:::image type="content" source="./media/devtest-lab-create-environment-from-arm/user-access-rights.png" alt-text="Screenshot that shows how to set Contributor role permissions for lab users in DevTest Labs." lightbox="./media/devtest-lab-create-environment-from-arm/user-access-rights-large.png":::

## Create environments from templates

If your lab is configured to use public or private template repositories, you can create an environment by selecting an available ARM template, similar to creating a virtual machine (VM). Follow these steps to create an environment from a template.

1. On the [Azure portal](https://portal.azure.com) **Overview** page for your lab, select **My environments** under **My Lab** in the left navigation menu.

1. On the **My environments** page, select **Add**.

1. On the **Choose a base** page, select the environment to create.

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/choose-environment-template.png" alt-text="Screenshot that shows the public environment ARM templates available for the DevTest Labs lab resource." lightbox="media/devtest-lab-create-environment-from-arm/choose-environment-template-large.png":::

1. On the **Add** pane, enter an **Environment name** and configure the other parameter settings.

   :::image type="content" source="./media/devtest-lab-create-environment-from-arm/add-environment.png" alt-text="Screenshot that shows the Add pane with settings to configure for a SharePoint environment." lightbox="./media/devtest-lab-create-environment-from-arm/add-environment-large.png":::

   - Each ARM environment template includes unique parameters. When you add an environment, you must enter values for all required parameters, denoted by red asterisks.
   - Some parameter values in an *azuredeploy.parameters.json* ARM template file produce blank setting fields with no default value on the **Add** pane. These values include `GEN-UNIQUE`, `GEN-UNIQUE-[N]`, `GEN-SSH-PUB-KEY`, and `GEN-PASSWORD`.
   - You can use secrets from Azure Key Vault for *secure string* parameters like passwords. For more information, see [Store secrets in Azure Key Vault](devtest-lab-store-secrets-in-key-vault.md).

1. Select **Add**. The environment starts provisioning immediately.

The process to provision an environment can take a long time. The total time depends on the number of service instances, VMs, and other resources that DevTest Labs creates as part of the lab environment. 

You can monitor the provisioning status on the **My environments** page. Select **Refresh** on the toolbar to update the page view and check the current status. While provisioning is in progress, the environment status is **Creating**. After provisioning completes, the status changes to **Ready**. 

:::image type="content" source="./media/devtest-lab-create-environment-from-arm/environment-status.png" alt-text="Screenshot that shows how to see the provisioning status for the lab environment." lightbox="./media/devtest-lab-create-environment-from-arm/environment-status-large.png":::

When the environment is ready, you can expand the environment in the **My environments** list to see the VMs the template provisioned.

:::image type="content" source="./media/devtest-lab-create-environment-from-arm/environment-machines.png" alt-text="Screenshot that shows the list of VMs created for the newly provisioned environment." lightbox="./media/devtest-lab-create-environment-from-arm/environment-machines-large.png":::

The deployment creates a new resource group to provision all the environment resources the ARM template defined. Select the environment in the **My environments** list to view the resource group and all resources the template created.

:::image type="content" source="./media/devtest-lab-create-environment-from-arm/environment-resources.png" alt-text="Screenshot that shows the resource group with all the environment resources, including VMs, disks, the virtual network, and more." lightbox="./media/devtest-lab-create-environment-from-arm/environment-resources-large.png":::

Select a virtual machine (VM) in the list to see VM properties and available actions, such as managing configuration, schedules, and policies.

   :::image type="content" source="./media/devtest-lab-create-environment-from-arm/machine-actions.png" alt-text="Screenshot that shows available actions for the selected environment VM." lightbox="./media/devtest-lab-create-environment-from-arm/machine-actions-large.png":::

## Automate environment creation

If you need to create multiple environments for development or testing scenarios, you can use Azure PowerShell or the Azure CLI to automate environment deployment from ARM templates. The following steps show how to automate ARM environment template deployment using the Azure PowerShell `New-AzResource` command.

You can also automate deployment by using the Azure CLI [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command. For more information, see [Deploy resources with ARM templates and the Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

1. [Store the ARM environment template in a Git repository](devtest-lab-use-resource-manager-template.md#configure-your-own-template-repositories) and [add the repository to your lab](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs).

1. Save the following PowerShell script to your computer as *deployenv.ps1*. This script calls the ARM template to create the environment in the lab.

   ```azurepowershell
   #Requires -Module Az.Resources

   [CmdletBinding()]

   param (
   # ID of the Azure subscription for the lab
   [string] [Parameter(Mandatory=$true)] $SubscriptionId,

   # Name of the lab in which to create the environment
   [string] [Parameter(Mandatory=$true)] $LabName,

   # Name of the template repository connected to the lab
   [string] [Parameter(Mandatory=$true)] $RepositoryName,

   # Name of the template (folder name in the GitHub repository)
   [string] [Parameter(Mandatory=$true)] $TemplateName,

   # Name of the environment to create in the lab
   [string] [Parameter(Mandatory=$true)] $EnvironmentName,

   # The parameters to pass to the template. Each parameter is prefixed with "-param_".
   # For example, if the template has a parameter named "TestVMName" with a value of "MyVMName",
   # the string in $Params is "-param_TestVMName MyVMName".
   # This convention allows the script to dynamically handle different templates.
   [Parameter(ValueFromRemainingArguments=$true)]
       $Params
   )

   # Sign in to Azure, or comment out this statement to completely automate environment creation.
   Connect-AzAccount

   # Select the subscription for your lab.  
   Set-AzContext -SubscriptionId $SubscriptionId | Out-Null

   # Get the user ID to use later in the script.
   $UserId = $((Get-AzADUser -UserPrincipalName ((Get-AzContext).Account).Id).Id)

   # Get the lab location.
   $lab = Get-AzResource -ResourceType "Microsoft.DevTestLab/labs" -Name $LabName
   if ($lab -eq $null) { throw "Unable to find lab $LabName in subscription $SubscriptionId." }

   # Get information about the repository connected to your lab.
   $repository = Get-AzResource -ResourceGroupName $lab.ResourceGroupName `
       -ResourceType 'Microsoft.DevTestLab/labs/artifactsources' `
       -ResourceName $LabName `
       -ApiVersion 2016-05-15 `
       | Where-Object { $RepositoryName -in ($_.Name, $_.Properties.displayName) } `
       | Select-Object -First 1
   if ($repository -eq $null) { throw "Unable to find repository $RepositoryName in lab $LabName." }

   # Get information about the ARM template base for the environment.
   $template = Get-AzResource -ResourceGroupName $lab.ResourceGroupName `
       -ResourceType "Microsoft.DevTestLab/labs/artifactSources/armTemplates" `
       -ResourceName "$LabName/$($repository.Name)" `
       -ApiVersion 2016-05-15 `
       | Where-Object { $TemplateName -in ($_.Name, $_.Properties.displayName) } `
       | Select-Object -First 1
   if ($template -eq $null) { throw "Unable to find template $TemplateName in lab $LabName." }

   # Build the template parameters by using parameter names and values.
   $parameters = Get-Member -InputObject $template.Properties.contents.parameters -MemberType NoteProperty | Select-Object -ExpandProperty Name
   $templateParameters = @()

   # Extract the custom parameters from $Params and format them as name/value pairs.
   $Params | ForEach-Object {
       if ($_ -match '^-param_(.*)' -and $Matches[1] -in $parameters) {
           $name = $Matches[1]                
       } elseif ( $name ) {
           $templateParameters += @{ "name" = "$name"; "value" = "$_" }
           $name = $null #reset name variable
       }
   }

   # Create an object to hold the necessary template properties.
   $templateProperties = @{ "deploymentProperties" = @{ "armTemplateId" = "$($template.ResourceId)"; "parameters" = $templateParameters }; }

   # Deploy the environment in your lab by using the New-AzResource command.
   New-AzResource -Location $Lab.Location `
       -ResourceGroupName $lab.ResourceGroupName `
       -Properties $templateProperties `
       -ResourceType 'Microsoft.DevTestLab/labs/users/environments' `
       -ResourceName "$LabName/$UserId/$EnvironmentName" `
       -ApiVersion '2016-05-15' -Force

   Write-Output "Environment $EnvironmentName completed."
   ```

1. To use the script, run the following command. Update the placeholders in the command with your own lab values.

   ```azurepowershell
   .\DeployLabEnvironment.ps1 `
       -SubscriptionId "<Subscription ID>" `
       -LabName "<LabName>" `
       -ResourceGroupName "<LabResourceGroupName>" `
       -RepositoryName "<TemplateRepoName>" `
       -TemplateName "<TemplateFolderName>" `
       -EnvironmentName "<EnvironmentName>" 
   ```

## Related content

- [Use ARM templates to create DevTest Labs virtual machines](./devtest-lab-use-resource-manager-template.md)
- [Public ARM environment template repository on GitHub](https://github.com/Azure/azure-devtestlab/tree/master/Environments)
- [Azure Quickstart Templates gallery on GitHub](https://github.com/Azure/azure-quickstart-templates)
