---
title: Create and use ARM templates
description: Learn how to view, edit, save, and store Azure Resource Manager (ARM) virtual machine (VM) templates, connect template repositories to labs, and use templates to create VMs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/07/2025
ms.custom: UpdateFrequency2
---

# Create and use ARM templates in DevTest Labs

This article describes how DevTest Labs users can:

- View, edit, and save Azure Resource Manager (ARM) templates for creating Azure VMs.
- Store ARM templates in source control repositories.
- Connect ARM template repositories to Azure DevTest Labs so other lab users can access the templates.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

ARM templates for VM creation use the [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/2018-09-15/labs/virtualmachines?pivots=deployment-language-arm-template) resource type. Each lab VM created with this resource type appears as a separate item in the lab's **My virtual machines** list.

Lab users can use ARM templates to create and deploy Azure VMs. Users can create their own ARM templates, modify existing ARM templates to meet their needs, or access preconfigured templates from the public [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab).

## Prerequisites

- At least **DevTest Lab User** role in a lab.

## View and save ARM templates for VMs

You can customize and use an ARM template from any available Azure VM base to use for deploying more VMs of the same type.

1. On your lab's **Overview** page, select **Add** on the top toolbar.
1. On the **Choose a base** page, select the VM base you want.
1. On the **Create lab resource** page, configure settings and add desired artifacts to your template VM.
1. On the **Advanced Settings** tab, select **View ARM template**.
1. Copy and save the ARM template to use for creating VMs.
1. Close the ARM template page.
1. If you want to create an instance of the VM immediately, select **Create** at the bottom of the form.

   :::image type="content" source="media/devtest-lab-use-arm-template/devtestlab-lab-copy-rm-template.png" alt-text="Screenshot that shows an ARM template to save for later use.":::

## Edit ARM templates for VMs

To reuse the ARM template to create more VMs, you can update the `parameters` section of your template file. You can also create a *parameters* JSON file that customizes just the parameters, without having to edit the main template file.

:::image type="content" source="media/devtest-lab-use-arm-template/devtestlab-lab-custom-params.png" alt-text="Customize parameters using a JSON file.":::

>[!TIP]
>You can add the `_artifactsLocation` and `_artifactsLocationSasToken` parameters to your parameters section or file to create a URI value for automatically managing nested templates. For more information about nested templates, see [Deploy nested Azure Resource Manager templates for testing environments](deploy-nested-template-environments.md).

### Set VM expiration date

For scenarios such as training, demos, and trials, you can automatically delete VMs after a certain date so they don't keep incurring costs. When you create a lab VM in the Azure portal, you can specify an **Expiration date** on the **Advanced settings** tab.

You can also add an `expirationDate` property to the `parameters` section of your template file. For an example, see [Create a new VM in a lab with a specified expiration date](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates/101-dtl-create-vm-username-pwd-customimage-with-expiration).

### Create multiple VMs at once from the same template

You can specify more than one instance of a template VM to be created at a time. When you create a lab VM in the Azure portal, you can specify **Number of instances** on the **Advanced Settings** tab.

To add or change the number of instances in a reusable JSON template, you can edit or add the `copy/count` value to the `resources` section of the template.

There are two other options for simultaneously creating multiple VMs from the same template:

- Use the [Azure DevOps Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks)
- [Use Windows PowerShell to deploy the generated ARM template](/azure/azure-resource-manager/templates/deploy-powershell)

<a name="configure-your-own-template-repositories"></a>
<a name="create-your-own-template-repositories"></a>
## Store ARM templates in Git repositories

As a best practice for infrastructure as code and configuration as code, store your ARM templates in source control. DevTest Labs can load ARM templates directly from GitHub or Azure Repos source control repositories. You can then use the templates throughout your release cycle, from development through test to production environments.

Use the following file structure to store an ARM template in a source control repository:

- Name the main template file *azuredeploy.json*.
- Name any standalone parameter customization file *azuredeploy.parameters.json*.
- Optionally, define metadata that specifies the template display name and description in a file named *metadata.json*.

  ```json
  {
    "itemDisplayName": "<template name>",
    "description": "<template description>"
  }
  ```

The following screenshot shows a typical ARM template folder structure in a repository.

:::image type="content" source="media/devtest-lab-use-arm-template/repo-structure.png" alt-text="Screenshot that shows key ARM template files in a repository.":::

## Add template repositories to labs

To add your private ARM template repository to the lab so all lab users can access your templates:

1. On the lab's **Overview** page, select **Configuration and policies** from the left navigation.
1. On the **Configuration and policies** page, select **Repositories** under **External resources** in the left navigation.
1. Select **Add** in the top menu bar.

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/public-repo.png" alt-text="Screenshot that shows the Repositories configuration screen.":::

1. In the **Repositories** pane, enter the following information:

   - **Name**: Enter the repository name to use in the lab.
   - **Git clone URL**: Enter the Git HTTPS clone URL from GitHub or Azure Repos.
   - **Branch** (optional): Enter the branch that has your ARM template definitions.
   - **Personal access token**: Enter the personal access token to securely access your repository.
     - To get a token from Azure Repos, select **User settings** > **Personal access tokens**.
     - To get a token from GitHub, under your profile, select **Settings** > **Developer settings** > **Personal access tokens**.
   - **Folder paths**: Enter the folder for your ARM template definitions, relative to the Git clone URI.

1. Select **Save**.

   :::image type="content" source="media/devtest-lab-create-environment-from-arm/repo-values.png" alt-text="Screenshot that shows adding a new template repository to a lab.":::

The repository now appears in the **Repositories** list for the lab. Lab users can use the repository templates to [create multi-VM DevTest Labs environments](devtest-lab-create-environment-from-arm.md). Lab administrators can use the templates to [automate lab deployment and management tasks](devtest-lab-use-arm-and-powershell-for-lab-resources.md#arm-template-automation).

>[!NOTE]
>On the **Repositories** page, the **Public Artifact Repo** and **Public Environment Repo** are available for all labs. These links connect to the [DevTest Labs public GitHub repository](https://github.com/Azure/azure-devtestlab).
>
>If these repos aren't enabled for your lab, a lab owner or contributor can enable them by selecting the checkboxes next to **Public Artifact Repo** and **Public Environment Repo**, and then selecting **Enable** on the top menu bar. For more information, see [Enable and configure public environments](devtest-lab-create-environment-from-arm.md#configure-public-environment-settings).


### Related content

- [Best practices for creating Azure Resource Manager templates](/azure/azure-resource-manager/templates/best-practices)
- [Add a Git repository to store custom artifacts and Resource Manager templates](devtest-lab-add-artifact-repo.md)
- [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md)
- [ARM quickstart templates for DevTest Labs automation](https://github.com/Azure/azure-quickstart-templates)
