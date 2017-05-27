---
title: Multiple IP addresses for Azure virtual machines - Template | Microsoft Docs
description: Learn how to assign multiple IP addresses to a virtual machine using an Azure Resource Manager template.
documentationcenter: ''
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/08/2016
ms.author: jdial

---
# Assign multiple IP addresses to virtual machines using an Azure Resource Manager template

[!INCLUDE [virtual-network-multiple-ip-addresses-intro.md](../../includes/virtual-network-multiple-ip-addresses-intro.md)]

This article explains how to create a virtual machine (VM) through the Azure Resource Manager deployment model using a Resource Manager template. Multiple public and private IP addresses cannot be assigned to the same NIC when deploying a VM through the classic deployment model. To learn more about Azure deployment models, read the [Understand deployment models](../resource-manager-deployment-model.md) article.

[!INCLUDE [virtual-network-multiple-ip-addresses-template-scenario.md](../../includes/virtual-network-multiple-ip-addresses-scenario.md)]

## Template description

Deploying a template enables you to quickly and consistently create Azure resources with different configuration values. Read the [Resource Manager template walkthrough](../azure-resource-manager/resource-manager-template-walkthrough.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article if you're not familiar with Azure Resource Manager templates. The [Deploy a VM with multiple IP addresses](https://azure.microsoft.com/resources/templates/101-vm-multiple-ipconfig) template is utilized in this article.

<a name="resources"></a>Deploying the template creates the following resources:

|Resource|Name|Description|
|---|---|---|
|Network interface|*myNic1*|The three IP configurations described in the scenario section of this article are created and assigned to this NIC.|
|Public IP address resource|2 are created: *myPublicIP* and *myPublicIP2*|These resources are assigned static public IP addresses and are assigned to the  *IPConfig-1* and *IPConfig-2* IP configurations described in the scenario.|
|VM|*myVM1*|A Standard DS3 VM.|
|Virtual network|*myVNet1*|A virtual network with one subnet named *mySubnet*.|
|Storage account|Unique to the deployment|A storage account.|

<a name="parameters"></a>When deploying the template, you must specify values for the following parameters:

|Name|Description|
|---|---|
|adminUsername|Admin username. The username must comply with [Azure username requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json).|
|adminPassword|Admin password The password must comply with [Azure password requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
|dnsLabelPrefix|DNS name for PublicIPAddressName1. The DNS name will resolve to one of the public IP addresses assigned to the VM. The name must be unique within the Azure region (location) you create the VM in.|
|dnsLabelPrefix1|DNS name for PublicIPAddressName2. The DNS name will resolve to one of the public IP addresses assigned to the VM. The name must be unique within the Azure region (location) you create the VM in.|
|OSVersion|The Windows/Linux version for the VM. The operating system is a fully patched image of the given Windows/Linux version selected.|
|imagePublisher|The Windows/Linux image publisher for the selected VM.|
|imageOffer|The Windows/Linux image for the selected VM.|

Each of the resources deployed by the template is configured with several default settings. You can view these settings through either of the following methods:

- **View the template on GitHub:** If you're familiar with templates, you can view the settings within the [template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-multiple-ipconfig/azuredeploy.json).
- **View the settings after deploying:** If you're not familiar with templates, you can deploy the template using steps in one of the following sections and then view the settings after deployment.

You can use the Azure portal, PowerShell, or the Azure command-line interface (CLI) to deploy the template. All methods produce the same result. To deploy the template, complete the steps in one of the following sections :

## Deploy using the Azure portal

To deploy the template using the Azure portal, complete the following steps:

1. Modify the template, if desired. The template deploys the resources and settings listed in the [resources](#resources) section of this article. To learn more about templates and how to author them, read the [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md?toc=%2fazure%2fvirtual-network%2ftoc.json)article.
2. Deploy the template with one of the following methods:
	- **Select the template in the portal:** Complete the steps in the [Deploy resources from custom template](../azure-resource-manager/resource-group-template-deploy-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#deploy-resources-from-custom-template) article. Choose the pre-existing template named *101-vm-multiple-ipconfig*.
	- **Directly:** Click the following button to open the template directly in the portal:
	<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-vm-multiple-ipconfig%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

Regardless of the method you choose, you'll need to supply values for the [parameters](#parameters) listed previously in this article. After the VM is deployed, connect to the VM and add the private IP addresses to the operating system you deployed by completing the steps in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP addresses to the operating system.

## Deploy using PowerShell

To deploy the template using PowerShell, complete the following steps:

1. Deploy the template by completing the steps in the [Deploy a template with PowerShell](../azure-resource-manager/resource-group-template-deploy-cli.md) article. The article describes multiple options for deploying a template. If you choose to deploy using the `-TemplateUri parameter`, the URI for this template is *https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-multiple-ipconfig/azuredeploy.json*. If you choose to deploy using the `-TemplateFile` parameter, copy the contents of the [template file](https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-multiple-ipconfig/azuredeploy.json) from GitHub into a new file on your machine. Modify the template contents, if desired. The template deploys the resources and settings listed in the [resources](#resources) section of this article. To learn more about templates and how to author them, read the [Authoring Azure Resource Manager templates ](../azure-resource-manager/resource-group-authoring-templates.md)article.

	Regardless of the option you choose to deploy the template with, you must supply values for the parameter values listed in the [parameters](#parameters) section of this article. If you choose to supply parameters using a parameters file, copy the contents of the [parameters file](https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-multiple-ipconfig/azuredeploy.parameters.json) from GitHub into a new file on your computer. Modify the values in the file. Use the file you created as the value for the `-TemplateParameterFile` parameter.

	To determine valid values for the OSVersion, ImagePublisher, and imageOffer parameters, complete the steps in the [Navigate and select Windows VM images article](../virtual-machines/windows/cli-ps-findimage.md) article.

	>[!TIP]
	>If you're not sure whether a dnslabelprefix is available, enter the `Test-AzureRmDnsAvailability -DomainNameLabel <name-you-want-to-use> -Location <location>` command to find out. If it is available, the command will return `True`.

2. After the VM is deployed, connect to the VM and add the private IP addresses to the operating system you deployed by completing the steps in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP addresses to the operating system.

## Deploy using the Azure CLI

To deploy the template using the Azure CLI 1.0, complete the following steps:

1. Deploy the template by completing the steps in the [Deploy a template with the Azure CLI](../azure-resource-manager/resource-group-template-deploy-cli.md) article. The article describes multiple options for deploying the template. If you choose to deploy using the `--template-uri` (-f), the URI for this template is *https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-multiple-ipconfig/azuredeploy.json*. If you choose to deploy using the `--template-file` (-f) parameter, copy the contents of the [template file](https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-multiple-ipconfig/azuredeploy.json) from GitHub into a new file on your machine. Modify the template contents, if desired. The template deploys the resources and settings listed in the [resources](#resources) section of this article. To learn more about templates and how to author them, read the [Authoring Azure Resource Manager templates ](../azure-resource-manager/resource-group-authoring-templates.md)article.

	Regardless of the option you choose to deploy the template with, you must supply values for the parameter values listed in the [parameters](#parameters) section of this article. If you choose to supply parameters using a parameters file, copy the contents of the [parameters file](https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-multiple-ipconfig/azuredeploy.parameters.json) from GitHub into a new file on your computer. Modify the values in the file. Use the file you created as the value for the `--parameters-file` (-e) parameter.

	To determine valid values for the OSVersion, ImagePublisher, and imageOffer parameters, complete the steps in the [Navigate and select Windows VM images article](../virtual-machines/windows/cli-ps-findimage.md) article.

2. After the VM is deployed, connect to the VM and add the private IP addresses to the operating system you deployed by completing the steps in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP addresses to the operating system.

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../includes/virtual-network-multiple-ip-addresses-os-config.md)]
