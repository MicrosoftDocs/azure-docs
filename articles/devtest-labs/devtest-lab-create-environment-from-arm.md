---
title: Create environments from ARM templates
titleSuffix: Azure DevTest Labs
description: Create multiple virtual machines in platform-as-a-service (PaaS) environments in Azure DevTest Labs by using Azure Resource Manager (ARM) templates.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/13/2024
ms.custom: engagement-fy23, devx-track-azurepowershell, UpdateFrequency2, devx-track-arm-template
#customer intent: As a developer, I want to use ARM templates in Azure DevTest Labs so that I can create virtual machines or PaaS resources.
---

# Create Azure DevTest Labs environments from ARM templates

In this article, you learn how to create Azure DevTest Labs environments from [Azure Resource Manager (ARM)](../azure-resource-manager/templates/syntax.md) templates. You can use DevTest Labs environments to easily and consistently provision labs with multiple virtual machines (VMs) or platform-as-a-service (PaaS) resources. You might use this approach to create a lab for a multi-tier web application or a SharePoint farm.

Resources in a DevTest Labs environment share the same lifecycle and you can manage them together. You can track the cost of lab environments and PaaS resources in the same way you track costs for individual lab VMs.

You can configure Azure DevTest Labs to use ARM templates from a public or private GitHub repository. The following diagram shows how to create an environment with DevTest Labs from an ARM template in a public or custom template repository. The [template repositories for labs](#explore-template-repositories) section describes this process in detail. 

:::image type="content" source="./media/devtest-lab-create-environment-from-arm/devtest-labs-create-environment-with-arm.png" alt-text="Diagram that shows how to create an environment with DevTest Labs by using an ARM template in a template repository." border="false" lightbox="./media/devtest-lab-create-environment-from-arm/devtest-labs-create-environment-with-arm.png":::

## Prerequisites

- It's helpful to have experience configuring lab environments in DevTest Labs. If you're new to working with labs, start by reviewing the instructions in the [Configure public environment settings](#configure-public-environment-settings) section. You need to understand how to configure template repositories, enable or disable public environments, and select templates to create labs. 

### Limitations

There are a few limitations to keep in mind when you create labs from ARM templates in DevTest Labs:

- DevTest Labs doesn't support the virtual machine (VM) [auto-shutdown feature](/azure/virtual-machines/auto-shutdown-vm) for PaaS resources created from ARM templates.

- DevTest Labs doesn't evaluate all lab policies when you deploy ARM templates. The following policies aren't evaluated:
   - Number of VMs per lab user
   - Number of premium VMs per user
   - Number of premium desks per user

   Suppose you have a lab policy that allows each user to create a maximum of five VMs. In DevTest Labs, each user can deploy an ARM environment template that creates dozens of VMs.

## Create environments from templates

You can create an environment from the Azure DevTest Labs public template repository or you can [add a private template repository](./devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs) to your lab.

Create an environment from a template by following these steps:

1. In the [Azure portal](https://portal.azure.com), go to your DevTest Labs lab resource.

1. On the lab **Overview** page, expand the **My lab** section on the left menu, and select **My environments**.

1. On the **My environments** page, select **Add** on the toolbar.

1. On the **Choose a base** page, select the ARM environment template to use:

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/choose-environment-template.png" alt-text="Screenshot that shows the public environment ARM templates available for the DevTest Labs lab resource." lightbox="media/devtest-lab-create-environment-from-arm/choose-environment-template-large.png":::

1. On the **Add** pane, enter an **Environment name**, and configure the other parameter settings.

   The type and number of parameters is unique for each ARM template. A red asterisk (*) indicates a required setting. You must enter values for all required settings.
   
   Some parameter values in the ARM template file (_azuredeploy.parameters.json_) produce blank setting fields on the **Add** pane (no default value). These parameter values include `GEN-UNIQUE`, `GEN-UNIQUE-[N]`, `GEN-SSH-PUB-KEY`, and `GEN-PASSWORD`.

   :::image type="content" source="./media/devtest-lab-create-environment-from-arm/add-environment.png" alt-text="Screenshot that shows the Add pane with settings to configure for a SharePoint environment." lightbox="./media/devtest-lab-create-environment-from-arm/add-environment-large.png":::

   For _secure string_ parameters like passwords, you can use secrets from Azure Key Vault. To learn how to store secrets in a key vault and use them when you create lab resources, see [Store secrets in Azure Key Vault](devtest-lab-store-secrets-in-key-vault.md).

1. Select **Add** to create the environment. The environment starts provisioning immediately.

   > [!NOTE]
   > The process to provision an environment can take a long time. The total time depends on the number of service instances, VMs, and other resources that DevTest Labs creates as part of the lab environment. 
   
1. To monitor the provisioning status, return to the **My environments** page for the lab:

   :::image type="content" source="./media/devtest-lab-create-environment-from-arm/environment-status.png" alt-text="Screenshot that shows how to see the provisioning status for the lab environment." lightbox="./media/devtest-lab-create-environment-from-arm/environment-status-large.png":::
   
   While provisioning is in progress, the environment status is _Creating_. After provisioning completes, the status changes to _Ready_. You can select **Refresh** on the toolbar to update the page view and check the current status.

1. When the environment is ready, you can expand the environment in the **My environments** list to see the VMs provisioned by the template:

   :::image type="content" source="./media/devtest-lab-create-environment-from-arm/environment-machines.png" alt-text="Screenshot that shows the list of VMs created for the newly provisioned environment." lightbox="./media/devtest-lab-create-environment-from-arm/environment-machines-large.png":::

1. The deployment creates a new resource group to provision all the environment resources defined by the ARM template. Select the environment name in the **My environments** list to view the resource group and all resources created by the template:

   :::image type="content" source="./media/devtest-lab-create-environment-from-arm/environment-resources.png" alt-text="Screenshot that shows the resource group with all the environment resources, including VMs, disks, the virtual network, and more." lightbox="./media/devtest-lab-create-environment-from-arm/environment-resources-large.png":::

1. Select an environment VM in the list to see available actions for the VM, such as managing configuration, schedules, and policies:

   :::image type="content" source="./media/devtest-lab-create-environment-from-arm/machine-actions.png" alt-text="Screenshot that shows available actions for the selected environment VM." lightbox="./media/devtest-lab-create-environment-from-arm/machine-actions-large.png":::

## Explore template repositories

The ARM templates for creating environments in DevTest Labs are available from two sources:

- DevTest Labs has a [public ARM template repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments) that includes preauthored environment templates for Azure Web Apps, an Azure Service Fabric cluster, and development SharePoint farms. The templates have minimal input parameters for a smooth getting-started experience with PaaS resources. You can use the public environment templates as-is or customize them to suit your needs. You can also suggest revisions or additions to a public template by submitting a pull request against the GitHub public template repository.

- You can [store environment templates in your own public or private GitHub repositories](devtest-lab-use-resource-manager-template.md#store-arm-templates-in-git-repositories), and [add those repositories to your lab](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs) to make your templates available to all lab users.

## Configure public environment settings

You can configure your lab to enable the use of templates from the public template GitHub repository. When you enable the public template repository for a lab, users can quickly create a lab environment by selecting these templates directly in the Azure portal, similar to how they create a VM in a lab. In addition, you can select which templates are available for users to create lab environments.

### Set public environment access for new lab

Configure public environment repository access for a new lab by following these steps:

1. During the process to [create a DevTest Labs resource](devtest-lab-create-lab.md), select the **Basic Settings** tab.

1. Set the **Public environments** option to **On**:

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/public-environments-on.png" alt-text="Screenshot that shows how to enable public environment repositories for a lab during the lab creation process." lightbox="media/devtest-lab-create-environment-from-arm/public-environments-on-large.png":::

### Set public environment access for existing labs

For existing labs, or labs that you create with an ARM template, public environments might not be enabled. You can control access to public environment repositories for any existing lab with the **Enable Public Environments for this lab** option.

Follow these steps to enable or disable the public environment repository access for any existing lab:

1. In the [Azure portal](https://portal.azure.com), go to your DevTest Labs lab resource where you want to set public environment access.

1. On your lab **Overview** page, expand the **Settings** section in the left menu, and select **Configuration and policies**.

1. On the **Configuration and policies** page, expand the **Virtual machine bases** section in the left menu, and select **Public environments**.

1. On the **Public environments** page, set the **Enable Public Environments for this lab** option to **Yes**:

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/enable-public-environments.png" alt-text="Screenshot that shows how to enable all public environment repositories for an existing lab resource." lightbox="media/devtest-lab-create-environment-from-arm/enable-public-environments-large.png":::

1. Select **Save**.

#### Select available public environment templates

When you set the **Enable Public Environments for this lab** option to control access to public environments for your lab, all the environment templates are selected by default. The option setting either allows or disallows access to _all_ the environments based on your selection. You can use the selection checkboxes in the list to specify which environments your users can access.

Follow these steps to allow access to only specific environments for the lab:

1. On the **Public environments** page, set the **Enable Public Environments for this lab** option to **Yes**.

1. Deselect specific environments in the list to make them unavailable to lab users:

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/select-public-environments.png" alt-text="Screenshot that shows how to deselect public environment repositories for a lab to disable access for users." lightbox="media/devtest-lab-create-environment-from-arm/select-public-environments-large.png":::

1. Select **Save**.

### Configure environment user rights

By default, lab users are assigned the **Reader** role in public environment repositories. They can't change environment resources, and they can't stop or start resources.

Use the following steps to give lab users the **Contributor** role and allow them to edit environment resources:

1. In the [Azure portal](https://portal.azure.com), go to your DevTest Labs lab resource where you want to adjust user role assignments.

1. On your lab **Overview** page, expand the **Settings** section in the left menu, and select **Configuration and policies**.

1. On the **Configuration and policies** page, expand the **Settings** section in the left menu, and select **Lab settings**.

1. On the **Lab settings** page, set the **Environment access** > **Resource group user rights** option to **Contributor**:

    :::image type="content" source="./media/devtest-lab-create-environment-from-arm/user-access-rights.png" alt-text="Screenshot that shows how to set Contributor role permissions for lab users in DevTest Labs." lightbox="./media/devtest-lab-create-environment-from-arm/user-access-rights-large.png":::

1. Select **Save**.

## Automate environment creation

If you need to create multiple environments for development or testing scenarios, you can automate environment deployment with Azure PowerShell or the Azure CLI.

Lab owners and administrators can use Azure PowerShell to create VMs and environments from ARM templates. You can also automate deployment through the Azure CLI by using the [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command to create environments. For more information, see [Deploy resources with ARM templates and the Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

Automate ARM environment template deployment with Azure PowerShell with these steps:

1. [Store the ARM environment template into a GitHub repository](devtest-lab-use-resource-manager-template.md#configure-your-own-template-repositories).

1. [Add the GitHub ARM template repository to your lab](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs).

1. Save the following PowerShell script to your computer with the filename _deployenv.ps1_. This script calls the ARM template to create the environment in the lab.

   ```powershell
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

1. Update the following placeholders in the script with your own lab values:

   - `SubscriptionId`
   - `LabName`
   - `ResourceGroupName`
   - `RepositoryName`
   - `TemplateName` (template folder in the GitHub repository)
   - `EnvironmentName`

   The following snippet shows how to run the script with example parameter values:
   
   ```powershell
   ./deployenv.ps1 -SubscriptionId "000000000-0000-0000-0000-0000000000000" -LabName "mydevtestlab" -ResourceGroupName "mydevtestlabRG000000" -RepositoryName "myRepository" -TemplateName "ARM template folder name" -EnvironmentName "myNewEnvironment"
   ```

1. Run the script.

## Related content

- [Use ARM templates to create DevTest Labs virtual machines](./devtest-lab-use-resource-manager-template.md)
- [Public ARM environment template repository on GitHub](https://github.com/Azure/azure-devtestlab/tree/master/Environments)
- [Azure Quickstart Templates gallery on GitHub](https://github.com/Azure/azure-quickstart-templates)
