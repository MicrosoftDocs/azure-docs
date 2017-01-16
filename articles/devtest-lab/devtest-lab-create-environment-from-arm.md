---
title: Create multi-VM environments with Azure Resource Manager templates | Microsoft Docs
description: Learn how to create multi-VM environments in Azure DevTest Labs from an Azure Resource Manager (ARM) template
services: devtest-lab,virtual-machines,visual-studio-online
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/03/2017
ms.author: tarcher

---

# Create multiple VM environments with Azure Resource Manager templates

The [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040) enables you to easily [create and add a VM to a lab](./devtest-lab-add-vm-with-artifacts.md). This works well for one-off VM creation. However, for scenarios such as a multi-tier Web app or a SharePoint farm, a mechanism is needed to allow for the creation of multiple identical VMs in a single step. By leveraging Azure Resource Manager templates, you can now define the infrastructure and configuration of your Azure solution and repeatedly deploy multiple VMs in a consistent state. This feature provides the following benefits:

- Azure Resource Manager templates are loaded directly from your source control repository (GitHub or Team Services Git).
- Once configured, users can create an environment by simply picking an Azure Resource Manager template from the Azure portal as what they can do with other types of [VM bases](./devtest-lab-comparing-vm-base-image-types.md).
- Azure PaaS resources can be provisioned in an environment from an Azure Resource Manager template in addition to IaasS VMs.
- The cost of environments can be tracked in the lab in addition to individual VMs created by other types of bases.

## Configure Azure Resource Manager template repositories

As one of the best practices with infrastructure-as-code and configuration-as-code, environment templates should be managed in source control. Azure DevTest Labs follows this practice and loads all Azure Resource Manager templates directly from your GitHub or VSTS Git repositories. There are a couple of rules to organize your Azure Resource Manager templates in a repository:

- The master file of ARM templates for DevTest Labs must be named `azuredeploy.json`. 
- If you want to use parameter values defined in a parameter file, the parameter file is must be named `azuredeploy.parameters.json`.
- Metadata can be defined to specify the template display name and description. This metadata must be in a file named `metadata.json`. The following example metadata file illustrates how to specify the display name and description: 

```json
{
 
"itemDisplayName": "<your template name>",
 
"description": "<description of the template>"
 
}
```

The following steps guide you through adding a repository to your lab using the Azure portal. 

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **More Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the desired lab.   
1. On the lab's blade, select **Configuration**.
1. From the **Configuration** settings list, select **Repositories**. The **Repositories** blade lists the repositories that have been added to the lab. A repository named `Public Repo` is automatically generated for all labs, and connects to the [DevTest Labs GitHub repo](https://github.com/Azure/azure-devtestlab) that contains several VM artifacts for your use.
1. Select **Add+** to add your Azure Resource Manager template repository.
1. A second **Repositories** blade will open that contains several fields:
	- **Name** - Enter the repository name that will be used in the lab.
	- **Git clone URI** - Enter the GIT HTTPS clone URL from GitHub or Visual Studio Team Services.  
	- **Branch** - Enter the branch name to access your Azure Resource Manager template definitions. 
	- **Personal access token** - The personal access token is used to securely access your repository. To get your token from Visual Studio Team Services, select **&lt;YourName> > My profile > Security > Public access token**. To get your token from GitHub, select your avator followed by selecting **Settings > Public access token**. 
	- **Folder paths** - Using one of the two input fields, enter the folder path that starts with a forward slash - / - and is relative to your Git clone URI to either your artifact definitions (first input field) or your Azure Resource Manager template definitions.   
1. Once all the required fields are entered and pass the validation, select **Save**.

The next section will walk you through creating environments from an Azure Resource Manager template.

## Create an environment from an Azure Resource Manager template

Once an Azure Resource Manager template repository has been configured in the lab, your lab users can create an environment using Azure portal with the following steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **More Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the desired lab.   
1. On the lab's blade, select **Add+**.
1.  

## Next steps


