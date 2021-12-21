---
title: Create virtual machines from Azure Resource Manager templates
description: Learn how to use Azure Resource Manager (ARM) templates to create virtual machines (VMs) in Azure DevTest Labs.
ms.topic: how-to
ms.date: 12/20/2021
---

# Create virtual machines from ARM templates

This article describes how to save and store Azure Resource Manager (ARM) templates in source control repositories, and how to connect the repositories to DevTest Labs so lab users can access and use the templates.

You can use the ARM templates to create virtual machines (VMs) in Azure DevTest Labs. You can view, edit, and save a VM's ARM template, and use it to create other VMs with the same settings.

## View, edit, and save an ARM template for a VM

You can create, save, and use your own ARM templates. For guidelines and suggestions to help you create reliable, easy-to-use ARM templates, see [Best practices for creating Azure Resource Manager templates](../azure-resource-manager/templates/best-practices.md).

You can also use any available VM base to create an ARM template for customizing and deploying VMs.

1. On your lab's **Overview** page, select **Add** on the top toolbar.
1. On the **Choose a base** page, select the type of VM you want.
1. On the **Create lab resource** page, configure settings and add any artifacts you want for your VM.
1. On the **Advanced Settings** tab, select **View ARM template**.
1. Copy and [save the ARM template](#store-arm-templates-in-git-repositories) to use for creating more VMs.
   ![Screenshot that shows an ARM template to save for later use.](./media/devtest-lab-use-arm-template/devtestlab-lab-copy-rm-template.png)
1. If you want to create a VM now, on the **Basic Settings** tab, select **Create**.

### Set VM expiration date

For scenarios such as training, demos, and trials, you might want to delete VMs automatically after a certain date so they don't keep incurring costs. When you create a lab VM, you can set an expiration date by specifying the **Expiration date** property on the **Advanced settings** tab. For an ARM template that defines the `expirationDate` property, see the public [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates/101-dtl-create-vm-username-pwd-customimage-with-expiration).

<a name="configure-your-own-template-repositories"></a>
<a name="create-your-own-template-repositories"></a>
## Store ARM templates in Git repositories

As a best practice for infrastructure-as-code and configuration-as-code, manage your ARM templates in source control. Azure DevTest Labs can load all your ARM templates directly from your GitHub or Azure Repos repositories. You can then use the ARM templates throughout the release cycle, from development through test to production environments. For more information, see [Add a Git repository to store custom artifacts and Resource Manager templates](devtest-lab-add-artifact-repo.md).

Use the following file structure to store an ARM template in a source control repository:

- Name the main template file *azuredeploy.json*.

- To reuse the ARM template, you must update the `parameters` section of *azuredeploy.json*. You can create a *parameter.json* file that customizes just the parameters, without having to edit the main template file. Name the parameter file *azuredeploy.parameters.json*.

  ![Customize parameters using a JSON file](./media/devtest-lab-use-arm-template/devtestlab-lab-custom-params.png)

  In the parameters file, you can use the parameters `_artifactsLocation` and `_artifactsLocationSasToken` to construct a `parametersLink` URI value for automatically managing nested templates. For more information about nested templates, see [Deploy nested Azure Resource Manager templates for testing environments](deploy-nested-template-environments.md).

- You can define metadata that specifies the template display name and description in a file named *metadata.json*.

  ```json
  {
    "itemDisplayName": "<template name>",
    "description": "<template description>"
  }
  ```

The following screenshot shows a typical ARM template folder structure in a repository.

![Screenshot that shows key ARM template files in a repository.](./media/devtest-lab-create-environment-from-arm/main-template.png)

## Add template repositories to labs

After you create and configure your ARM template and repository, add the repository to your lab so all your lab users can access the templates.

1. On the lab's **Overview** page, select **Configuration and policies** from the left navigation.

1. On the **Configuration and policies** page, select **Repositories** under **External resources** in the left navigation.

   On the **Repositories** screen, the **Public Artifact Repo** and **Public Environment Repo** are automatically present for all labs, and connect to the [DevTest Labs public GitHub repository](https://github.com/Azure/azure-devtestlab). If these repos aren't enabled for your lab, you can enable them by selecting the checkbox next to **Public Artifact Repo** or **Public Environment Repo**, and then selecting **Enable** on the top menu bar. For more information, see [Enable and configure public environments](devtest-lab-create-environment-from-arm.md#enable-and-configure-public-environments).

1. To add your private ARM template repository to the lab, select **Add** in the top menu bar.

   ![Screenshot that shows the Repositories configuration screen.](./media/devtest-lab-create-environment-from-arm/public-repo.png)

1. In the **Repositories** pane, enter the following information:

   - **Name**: Enter a repository name to use in the lab.
   - **Git clone URL**: Enter the Git HTTPS clone URL from GitHub or Azure Repos.
   - **Branch** (optional): Enter the branch that has your ARM template definitions.
   - **Personal access token**: Enter the personal access token to securely access your repository.
     - To get a token from Azure Repos, select **User settings** > **Personal access tokens**.
     - To get your token from GitHub, under your profile, select **Settings** > **Developer settings** > **Personal access tokens**.
   - **Folder paths**: Enter the folder for your ARM template definitions, relative to your Git clone URI.

1. Select **Save**.

   ![Screenshot that shows adding a new template repository to a lab.](./media/devtest-lab-create-environment-from-arm/repo-values.png)

Your repository now appears in the **Repositories** list for your lab. After you add the ARM template repository to the lab, you can use the templates in the repository to create VMs and environments.
### Next steps

- [Use ARM templates to create multi-VM DevTest Labs environments](devtest-lab-create-environment-from-arm.md)
- [Automate ARM template environment creation with Azure PowerShell](devtest-lab-create-environment-from-arm.md#automate-deployment-of-environments)
- [ARM quickstart templates for DevTest Labs automation](https://github.com/Azure/azure-quickstart-templates)