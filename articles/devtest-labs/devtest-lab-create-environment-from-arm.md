---
title: Create environments from ARM templates
titleSuffix: Azure DevTest Labs
description: Learn how to create multi-VM, platform-as-a-service (PaaS) environments in Azure DevTest Labs from ARM templates.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/21/2022
ms.custom: engagement-fy23, devx-track-azurepowershell, UpdateFrequency2
---

# Create Azure DevTest Labs environments from ARM templates

In this article, you learn how to create Azure DevTest Labs environments from [Azure Resource Manager (ARM)](../azure-resource-manager/templates/syntax.md) templates. You can use DevTest Labs environments to easily and consistently provision labs with multiple virtual machines (VMs) or platform-as-a-service (PaaS) resources. For example, to create a lab for a multi-tier web application, or a SharePoint farm.

Resources in an environment share the same lifecycle, and you can manage them together. You can track the cost of lab environments and PaaS resources, just as you track costs for individual lab VMs.

You can configure Azure DevTest Labs to use ARM templates from a public or private Git repository. Learn more about [template repositories for labs](#environment-template-repositories).

:::image type="content" source="./media/devtest-lab-create-environment-from-arm/devtest-labs-create-environment-with-arm.png" alt-text="Diagram that shows how to create an environment with Azure DevTest Labs from an ARM template in a public or custom template repository." lightbox="./media/devtest-lab-create-environment-from-arm/devtest-labs-create-environment-with-arm.png":::

If you want to use an ARM template to create an Azure DevTest Labs resource, see the [Quickstart: use an ARM template to create a lab in DevTest Labs](./create-lab-windows-vm-template.md).

## Limitations

Consider these limitations when you create labs from ARM templates in DevTest Labs:

- VM auto-shutdown doesn't apply to PaaS resources.

- Not all lab policies are evaluated when you deploy ARM templates. Policies that aren't evaluated include: number of VMs per lab user, number of premium VMs per user, and number of premium desks per user. For example, your lab policy might limit users to only five VMs apiece. However, a user can deploy an ARM environment template that creates dozens of VMs.

## Create environments from templates

You can create an environment from the Azure DevTest Labs public template repository or you can [add a private template repository](./devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs) to your lab.

Learn how to [configure environments for your lab](#configure-public-environment-settings-for-your-lab). For example, how to configure the template repositories, enable or disable public environments, and selecting specific templates for creating labs.

To create an environment from a template:

1. In the [Azure portal](https://portal.azure.com), select your lab resource.

1. On the lab's **Overview** page, select **Add** from the top toolbar.

1. On the **Choose a base** page, select the ARM environment template to use. The available environment templates appear first in the list of bases.

    :::image type="content" source="media/devtest-lab-create-environment-from-arm/public-environment-templates.png" alt-text="Screenshot that shows public environment templates." lightbox="media/devtest-lab-create-environment-from-arm/public-environment-templates.png":::

1. On the **Add** screen, enter an **Environment name**, and fill the other input fields.

    The number and type of input fields is defined in the ARM template. As necessary, enter values for input fields that the template *azuredeploy.parameters.json* file defines as blank or default.

   - For `secure string` parameters, you can use secrets from Azure Key Vault. To learn how to store secrets in a key vault and use them when creating lab resources, see [Store secrets in Azure Key Vault](devtest-lab-store-secrets-in-key-vault.md).

   - In ARM template files, the `GEN-UNIQUE`, `GEN-UNIQUE-[N]`, `GEN-SSH-PUB-KEY`, and `GEN-PASSWORD` parameter values generate blank input fields for users to input values.

    :::image type="content" source="./media/devtest-lab-create-environment-from-arm/add.png" alt-text="Screenshot that shows the Add pane for a SharePoint environment." lightbox="./media/devtest-lab-create-environment-from-arm/add.png":::

1. Select **Add** to create the environment.

   The environment starts provisioning immediately. You can see the provisioning status under **My environments** on the lab **Overview** page. Provisioning an environment can take a long time.

1. Once the environment creation completes, expand the environment under **My environments** to see the list of VMs and other resources that the template provisioned.

    :::image type="content" source="./media/devtest-lab-create-environment-from-arm/my-vm-list.png" alt-text="Screenshot that shows the list of VMs under an environment." lightbox="./media/devtest-lab-create-environment-from-arm/my-vm-list.png":::

   The deployment creates a new resource group to provision all the environment resources that the ARM template defined. Select the environment name under **My environments** to view the resource group and all the resources the template created.

    :::image type="content" source="./media/devtest-lab-create-environment-from-arm/all-environment-resources.png" alt-text="Screenshot that shows the resource group with all the environment resources." lightbox="./media/devtest-lab-create-environment-from-arm/all-environment-resources.png":::

1. Select an environment VM to see available actions for the VM, such as managing configuration, schedules, and policies.

    :::image type="content" source="./media/devtest-lab-create-environment-from-arm/environment-actions.png" alt-text="Screenshot that shows available actions for an environment VM." lightbox="./media/devtest-lab-create-environment-from-arm/environment-actions.png":::

## Environment template repositories

With Azure DevTest Labs, you can create environments from ARM templates. The ARM templates can come from two sources:

- Azure DevTest Labs has a [public ARM template repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments) that includes pre-authored environment templates for Azure Web Apps, an Azure Service Fabric cluster, and development SharePoint farms. The templates have minimal input parameters, for a smooth getting started experience with PaaS resources. You can use the public environment templates as-is, or customize them to suit your needs.

- You can [store environment templates in your own public or private Git repositories](devtest-lab-use-resource-manager-template.md#store-arm-templates-in-git-repositories), and [connect those repositories to your lab](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs) to make your templates available to all lab users.

> [!TIP]
> To suggest revisions or additions to the public templates, submit a pull request against the open-source [GitHub public template repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments).

## Configure public environment settings for your lab

You can configure your lab to enable the use of templates from the public template repository. If you enable the public template repository for a lab, users can then quickly create an environment by selecting these templates directly in the Azure portal, similar to how they create a VM in a lab. 

In addition, you can select which templates are available for users to create environments from.

### Enable public environments when you create a lab

To enable public environment repository access for a lab when you create a lab:

1. Select the **Basic Settings** tab when you [create a DevTest Labs resource](./devtest-lab-create-lab.md).

1. Select **On** in the **Public environments** field.

    :::image type="content" source="media/devtest-lab-create-environment-from-arm/enable-public-environment-new-lab.png" alt-text="Screenshot that shows enabling public environments for a new lab." lightbox="media/devtest-lab-create-environment-from-arm/enable-public-environment-new-lab.png":::

### Enable or disable public environments for existing labs

For existing labs, or labs that you create with an ARM template, public environments might not be enabled. To enable or disable the public environment repository for existing labs:

1. In the [Azure portal](https://portal.azure.com), select your lab resource.

1. Select **Configuration and policies** in the left navigation.

1. Select **Public environments** under **Virtual machine bases** in the left navigation.

1. Select **Yes** or **No** for **Enable Public Environments for this lab**, to enable or disable public environments for the lab.

1. Select **Save**.

### Select available public environment templates

When you enable public environments, all the environment templates in the repository are available for creating environments. To allow only specific environments for a lab:

1. In the [Azure portal](https://portal.azure.com), select your lab resource.

1. Select **Configuration and policies** in the left navigation.

1. Select **Public environments** under **Virtual machine bases** in the left navigation.

1. Deselect specific environments from the list to make them unavailable to lab users, and then select **Save**.

    :::image type="content" source="media/devtest-lab-create-environment-from-arm/public-environments-page.png" alt-text="Screenshot that shows the list of public environments for a lab." lightbox="media/devtest-lab-create-environment-from-arm/public-environments-page.png":::

### Configure environment user rights

By default, lab users have the **Reader** role in environments, and can't change environment resources. For example, users can't stop or start resources. To give lab users **Contributor** role to allow them to edit environment resources:

1. In the [Azure portal](https://portal.azure.com), select your lab resource.

1. Select **Configuration and policies** in the left navigation.

1. Select **Lab settings** in the left navigation.

1. Under **Environment access** > **Resource group user rights**, select **Contributor**, and then select **Save**.

    :::image type="content" source="./media/devtest-lab-create-environment-from-arm/config-access-rights.png" alt-text="Screenshot that shows configuring lab user Contributor permissions." lightbox="./media/devtest-lab-create-environment-from-arm/config-access-rights.png":::

## Automate environment creation

If you need to create multiple environments for development or testing scenarios, you can automate environment deployment with Azure PowerShell or Azure CLI.

You can use the Azure CLI command [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) to create environments. For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

Lab owners and administrators can use Azure PowerShell to create VMs and environments from ARM templates.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To automate ARM environment template deployment with Azure PowerShell:

1. Have an ARM environment template [checked in to a Git repository](devtest-lab-use-resource-manager-template.md#configure-your-own-template-repositories), and the repository [added to the lab](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs).

1. Save the following PowerShell script to your computer as *deployenv.ps1*. This script calls the ARM template to create the environment in the lab.

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

   # Name of the template (folder name in the Git repository)
   [string] [Parameter(Mandatory=$true)] $TemplateName,

   # Name of the environment to create in the lab
   [string] [Parameter(Mandatory=$true)] $EnvironmentName,

   # The parameters to be passed to the template. Each parameter is prefixed with "-param_".
   # For example, if the template has a parameter named "TestVMName" with a value of "MyVMName",
   # the string in $Params will be "-param_TestVMName MyVMName".
   # This convention allows the script to dynamically handle different templates.
   [Parameter(ValueFromRemainingArguments=$true)]
       $Params
   )

   # Sign in to Azure, or comment out this statement to completely automate environment creation.
   Connect-AzAccount

   # Select the subscription that has the lab.  
   Set-AzContext -SubscriptionId $SubscriptionId | Out-Null

   # Get the user ID to use later in the script.
   $UserId = $((Get-AzADUser -UserPrincipalName ((Get-AzContext).Account).Id).Id)

   # Get the lab location.
   $lab = Get-AzResource -ResourceType "Microsoft.DevTestLab/labs" -Name $LabName
   if ($lab -eq $null) { throw "Unable to find lab $LabName in subscription $SubscriptionId." }

   # Get information about the repository connected to the lab.
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

   # Deploy the environment in the lab by using the New-AzResource command.
   New-AzResource -Location $Lab.Location `
       -ResourceGroupName $lab.ResourceGroupName `
       -Properties $templateProperties `
       -ResourceType 'Microsoft.DevTestLab/labs/users/environments' `
       -ResourceName "$LabName/$UserId/$EnvironmentName" `
       -ApiVersion '2016-05-15' -Force

   Write-Output "Environment $EnvironmentName completed."
   ```

1. Run the script, using your own values to replace the example values for:
   - `SubscriptionId`
   - `LabName`
   - `ResourceGroupName`
   - `RepositoryName`
   - `TemplateName` (template folder in the Git repository)
   - `EnvironmentName`

   ```powershell
   ./deployenv.ps1 -SubscriptionId "000000000-0000-0000-0000-0000000000000" -LabName "mydevtestlab" -ResourceGroupName "mydevtestlabRG000000" -RepositoryName "myRepository" -TemplateName "ARM template folder name" -EnvironmentName "myNewEnvironment"
   ```

## Next steps

- [Public ARM environment template repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments)
- [Azure quickstart template gallery](https://github.com/Azure/azure-quickstart-templates)
