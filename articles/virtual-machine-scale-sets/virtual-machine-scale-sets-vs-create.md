---
title: Deploy Virtual Machine Scale Set using Visual Studio | Microsoft Docs
description: Deploy Virtual Machine Scale Sets using Visual Studio and a Resource Manager template
services: virtual-machine-scale-sets
ms.custom: vs-azure
ms.workload: azure-vs
documentationcenter: ''
author: mayanknayar
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: ed0786b8-34b2-49a8-85b5-2a628128ead6
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/13/2017
ms.author: manayar
ms.custom: H1Hack27Feb2017

---
# How to create a Virtual Machine Scale Set with Visual Studio

This article shows you how to deploy an Azure Virtual Machine Scale Set using a Visual Studio Resource Group Deployment.

[Azure Virtual Machine Scale Sets](https://azure.microsoft.com/blog/azure-vm-scale-sets-public-preview/) is an Azure Compute resource to deploy and manage a collection of similar virtual machines with autoscale and load balancing. You can provision and deploy Virtual Machine Scale Sets using [Azure Resource Manager Templates](https://github.com/Azure/azure-quickstart-templates). Azure Resource Manager Templates can be deployed using Azure CLI, PowerShell, REST and also directly from Visual Studio. Visual Studio provides a set of example templates, which can be deployed as part of an Azure Resource Group Deployment project.

Azure Resource Group deployments are a way to group and publish a set of related Azure resources in a single deployment operation. For more information, see [Creating and deploying Azure resource groups through Visual Studio](../vs-azure-tools-resource-groups-deployment-projects-create-deploy.md).

## Prerequisites

To get started deploying Virtual Machine Scale Sets in Visual Studio, you need the following prerequisites:

* Visual Studio 2013 or later
* Azure SDK 2.7, 2.8 or 2.9

>[!NOTE]
>This article uses Visual Studio 2019 with [Azure SDK 2.8](https://azure.microsoft.com/blog/announcing-the-azure-sdk-2-8-for-net/).

## Creating a Project

1. Open Visual Studio and select **Create a new project**.

1. In **Create a new project**, choose **Azure Resource Group** for C# and then select **Next**.

1. In **Configure your new project**, enter a name and select **Create**.

    ![Name and create your project](media\virtual-machine-scale-sets-vs-create\configure-azure-resource-group.png)

1. From the list of templates, choose either the **Linux Virtual Machine Scale Set** or **Windows Virtual Machine Scale Set** template, and select **OK**.

   ![Select a virtual machine template](media\virtual-machine-scale-sets-vs-create\select-vm-template.png)

After your project is created, **Solution Explorer** contains a PowerShell deployment script, an Azure Resource Manager Template, and a parameter file for the Virtual Machine Scale Set.

## Customize your project

Now you can edit the template to customize it for your application's needs, such as adding virtual machine extension properties or editing load-balancing rules. By default the Virtual Machine Scale Set Templates are configured to deploy the AzureDiagnostics extension, which makes it easy to add autoscale rules. It also deploys a load balancer with a public IP address, configured with inbound NAT rules.

The load balancer lets you connect to the virtual machine instances with SSH (Linux) or RDP (Windows). The front-end port range starts at 50000. For linux, this fact means that if you SSH to port 50000, you're routed to port 22 of the first virtual machine in the Scale Set. Connecting to port 50001 is routed to port 22 of the second virtual machine and so on.

 A good way to edit your Templates with Visual Studio is to use the JSON Outline to organize the parameters, variables, and resources. With an understanding of the schema, Visual Studio can point out errors in your Template before you deploy it.

![JSON Explorer][json_explorer]

## Deploy the project

1. Deploy the Azure Resource Manager Template to create the Virtual Machine Scale Set resource. Right-click on the project node and choose **Deploy | New Deployment**.

    ![Deploy Template][5deploy_Template]

2. Select your subscription in the “Deploy to Resource Group” dialog.

    ![Deploy Template][6deploy_Template]

3. From here, you can create an Azure Resource Group to deploy your Template to.

    ![New Resource Group][new_resource]

4. Next, select **Edit Parameters** to enter parameters that are passed to your Template. Provide the username and password for the OS, which is required to create the deployment. If you don't have PowerShell Tools for Visual Studio installed, it is recommended to check **Save passwords** to avoid a hidden PowerShell command-line prompt, or use [keyvault support](https://azure.microsoft.com/blog/keyvault-support-for-arm-templates/).

    ![Edit Parameters][edit_parameters]

5. Now select **Deploy**. The **Output** window shows the deployment progress. The action is executing the **Deploy-AzureResourceGroup.ps1** script.

   ![Output Window][output_window]

## Exploring your Virtual Machine Scale Set

Once the deployment completes, you can view the new Virtual Machine Scale Set in the Visual Studio **Cloud Explorer** (refresh the list). Cloud Explorer lets you manage Azure resources in Visual Studio while developing applications. You can also view your Virtual Machine Scale Set in the [Azure portal](https://portal.azure.com) and [Azure Resource Explorer](https://resources.azure.com/).

![Cloud Explorer][cloud_explorer]

 The portal provides the best way to manage your Azure infrastructure with a web browser. Azure Resource Explorer provides an easy way to explore and debug Azure resources. Azure Resource Explorer offers the instance view and also shows PowerShell commands for the resources you're looking at.

## Next steps

Once you’ve successfully deployed Virtual Machine Scale Sets through Visual Studio, you can further customize your project to suit your application requirements. For example, configure autoscale by adding an **Insights** resource, adding infrastructure to your Template (like standalone virtual machines), or deploying applications using the custom script extension. Good example templates can be found in the [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) GitHub repository (search for "vmss").

[file_new]: ./media/virtual-machine-scale-sets-vs-create/1-FileNew.png
[create_project]: ./media/virtual-machine-scale-sets-vs-create/2-CreateProject.png
[select_Template]: ./media/virtual-machine-scale-sets-vs-create/3b-SelectTemplateLin.png
[solution_explorer]: ./media/virtual-machine-scale-sets-vs-create/4-SolutionExplorer.png
[json_explorer]: ./media/virtual-machine-scale-sets-vs-create/10-JsonExplorer.png
[5deploy_Template]: ./media/virtual-machine-scale-sets-vs-create/5-DeployTemplate.png
[6deploy_Template]: ./media/virtual-machine-scale-sets-vs-create/6-DeployTemplate.png
[new_resource]: ./media/virtual-machine-scale-sets-vs-create/7-NewResourceGroup.png
[edit_parameters]: ./media/virtual-machine-scale-sets-vs-create/8-EditParameter.png
[output_window]: ./media/virtual-machine-scale-sets-vs-create/9-Output.png
[cloud_explorer]: ./media/virtual-machine-scale-sets-vs-create/12-CloudExplorer.png
