---
title: Create and manage ARM VM templates
description: Learn how to view, edit, store, and access Azure Resource Manager (ARM) virtual machine (VM) templates, and how lab admins can add template repositories to labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/10/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab user, I want to know how to create, manage, and access ARM templates, so I can use the templates to create VMs.
---

# Create and manage ARM VM templates in DevTest Labs

This article describes how DevTest Labs users can:

- View, edit, and save Azure Resource Manager (ARM) templates for creating Azure VMs.
- Store the ARM templates in source control repositories.
- Connect the ARM template repositories to Azure DevTest Labs so other lab users can access the templates.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

ARM templates for VM creation use the [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/2018-09-15/labs/virtualmachines?pivots=deployment-language-arm-template) resource type. Each lab VM created with this resource type appears as a separate item in the lab's **My virtual machines** list.

Lab users can create their own ARM templates, modify existing ARM templates to meet their needs, or access preconfigured templates from their own or others' private repositories or the public [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab) to use in creating VMs.

## Prerequisites

- To view or save ARM templates while creating VMs, at least **DevTest Lab User** role in a lab.
- To enable public repositories or add private template repositories to labs, at least **Contributor** role in the lab.

<a name="view-edit-and-save-arm-templates-for-vms"></a>
## View and save ARM templates for VMs

You can customize and use an ARM template from any available Azure VM base to use for deploying more VMs of the same type. To customize and save an ARM template in the Azure portal:

1. On your lab's **Overview** page, select **Add** on the top toolbar.
1. On the **Choose a base** page, select the VM base you want.
1. On the **Create lab resource** tabs, configure settings and add desired artifacts to your template VM.
1. On the **Advanced Settings** tab, select **View ARM template** under **Automation** at the bottom of the form.
1. Copy and save the contents of the **View Azure Resource Manager template** page as a file named *azuredeploy.json*, and then close the page.

   :::image type="content" source="media/devtest-lab-use-arm-template/devtestlab-lab-copy-rm-template.png" alt-text="Screenshot that shows an ARM template to save for later use.":::
   
1. If you want to create the VM immediately, select **Create** at the bottom of the **Create lab resource** page.

For more information on creating lab VMs, see [Create lab virtual machines in Azure DevTest Labs](devtest-lab-add-vm.md).

<a name="set-vm-expiration-date"></a>
## Edit ARM templates for VMs

When you reuse the ARM template to create more VMs, you can edit the `parameters` in your template file. You can create and edit a separate file called *azuredeploy.parameters.json* to update only the parameters without having to edit the main template file.

For example, in training, demo, and trial scenarios, you can automatically delete VMs after a certain date so they don't keep incurring costs. When you create a lab VM in the Azure portal, you specify the **Expiration date** on the **Advanced settings** tab.

You can add an `expirationDate` property to your ARM template `parameters` section or file. For an example template, see [Create a new VM in a lab with a specified expiration date](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates/101-dtl-create-vm-username-pwd-customimage-with-expiration).

The following example `parameters` section includes an `expirationDate` parameter.

```json
  "parameters": {
    "newVMName": {
      "type": "string",
      "defaultValue": "vm01"
    },
    "labName": {
      "type": "string",
      "defaultValue": "Contoso1"
    },
    "size": {
      "type": "string",
      "defaultValue": "Standard_D2s_v3"
    },
    "userName": {
      "type": "string",
      "defaultValue": "labuser"
    },
    "hibernationEnabled": {
      "type": "bool"
    },
    "expirationDate": {
      "type": "string",
      "defaultValue": "2025-03-15T07:00:00.000Z"
    },
    "password": {
      "type": "securestring",
      "defaultValue": "[[[user/VmPassword]]"
    }
  }
```

>[!TIP]
>To create a URI value for automatically managing *nested templates*, you can add the `_artifactsLocation` and `_artifactsLocationSasToken` parameters to your `parameters` section or file. For more information about nested templates, see [Deploy nested Azure Resource Manager templates for testing environments](deploy-nested-template-environments.md).

### Create multiple VMs at once

In the Azure portal, you can create more than one instance of a VM at a time by specifying **Number of instances** on the **Advanced Settings** tab of the VM creation screen. In the ARM template, the `copy` parameter in the `resources` section determines the number of instances to create.

```json
      "copy": {
        "name": "[parameters('newVMName')]",
        "count": 2
      },
```

<a name="configure-your-own-template-repositories"></a>
<a name="create-your-own-template-repositories"></a>
## Store ARM templates in Git repositories

As a best practice for infrastructure as code and configuration as code, store your ARM templates in source control. DevTest Labs can load ARM templates directly from GitHub or Azure Repos source control repositories. You can then use the templates throughout your release cycle, from development through test to production environments.

Use the following file structure to store an ARM template in a source control repository:

- Name the main template file *azuredeploy.json*.
- Name any standalone parameter customization file *azuredeploy.parameters.json*.
- Optionally, define metadata that specifies the template display name and description in a file named *metadata.json*, as follows:

  ```json
  {
    "itemDisplayName": "<template name>",
    "description": "<template description>"
  }
  ```

The following screenshot shows a typical ARM template folder structure in a repository.

:::image type="content" source="media/devtest-lab-use-arm-template/repo-structure.png" alt-text="Screenshot that shows key ARM template files in a repository.":::

## Add template repositories to labs

To see and access the template repositories available to your lab:

1. On the lab's **Overview** page, select **Configuration and policies** from the left navigation.
1. On the **Configuration and policies** page, select **Repositories** under **External resources** in the left navigation.

The **Public Artifact Repo** and **Public Environment Repo** at the [DevTest Labs public GitHub repository](https://github.com/Azure/azure-devtestlab) are available for all labs. If these repos aren't enabled for your lab, a lab owner or contributor can enable them by selecting the checkboxes next to **Public Artifact Repo** and **Public Environment Repo**, and then selecting **Enable** on the top menu bar. For more information, see [Enable and configure public environments](devtest-lab-create-environment-from-arm.md#configure-public-environment-settings).

If you're a lab owner or contributor, you can add a private ARM template repository to the lab so all lab users can access the templates.

1. On the **Repositories** page, select **Add** in the top menu bar.

   :::image type="content" source="media/devtest-lab-use-arm-template/public-repo.png" alt-text="Screenshot that shows the Repositories configuration screen.":::

1. In the **Repositories** pane, enter the following information:

   - **Name**: Enter the repository name.
   - **Git clone URL**: Enter the Git HTTPS clone URL from GitHub or Azure Repos.
   - **Branch** (optional): Enter the branch that has your ARM template definitions.
   - **Personal access token**: Enter the personal access token to securely access your repository.
     - To get a token from Azure Repos, at upper right select **User settings** > **Personal access tokens**.
     - To get a token from GitHub, under your profile, select **Settings** > **Developer settings** > **Personal access tokens**.
   - **Folder paths**: Enter the folder for the ARM template definitions, relative to the Git clone URI.

1. Select **Save**.

   :::image type="content" source="media/devtest-lab-use-arm-template/repo-values.png" alt-text="Screenshot that shows settings for adding a new template repository to a lab.":::

The repository now appears in the **Repositories** list for the lab. Lab users can use the repository templates to [create multi-VM DevTest Labs environments](devtest-lab-create-environment-from-arm.md). Lab administrators can use the templates to [automate lab deployment and management tasks](devtest-lab-use-arm-and-powershell-for-lab-resources.md#arm-template-automation).

## Deploy VMs by using ARM templates

To create and deploy Azure VMs by using ARM templates, you can use any of the following methods:

- [Azure portal](/azure/azure-resource-manager/templates/deploy-portal)
- [Azure CLI](/azure/azure-resource-manager/templates/deploy-cli)
- [PowerShell](/azure/azure-resource-manager/templates/deploy-powershell)
- [REST API](/azure/azure-resource-manager/templates/deploy-rest)
- [Button in GitHub repository](/azure/azure-resource-manager/templates/deploy-to-azure-button)
- [Azure Cloud Shell](/azure/azure-resource-manager/templates/deploy-cloud-shell)
- [Azure Pipelines DevTest Labs Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks)

For more information about deployment, see [Template deployment process](/azure/azure-resource-manager/templates/overview#template-deployment-process).

## Related content

- [Best practices for creating ARM templates](/azure/azure-resource-manager/templates/best-practices)
- [Add a Git repository to store custom artifacts and ARM templates](devtest-lab-add-artifact-repo.md)
- [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md)
- [ARM quickstart templates for DevTest Labs automation](https://github.com/Azure/azure-quickstart-templates)
