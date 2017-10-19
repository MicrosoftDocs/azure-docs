---
title: 'Join a Windows Server VM to Azure Active Directory Domain Services | Microsoft Docs'
description: Join a Windows Server virtual machine to a managed domain using Azure Resource Manager templates.
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mahesh-unnikrishnan
editor: curtand

ms.assetid: 4eabfd8e-5509-4acd-86b5-1318147fddb5
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/17/2017
ms.author: maheshu
---

# Join a Windows Server virtual machine to a managed domain using a Resource Manager template
This article shows you how to join a Windows Server virtual machine to an Azure AD Domain Services managed domain using Resource Manager templates.

## Before you begin
To perform the tasks listed in this article, you need:
1. A valid **Azure subscription**.
2. An **Azure AD directory** - either synchronized with an on-premises directory or a cloud-only directory.
3. **Azure AD Domain Services** must be enabled for the Azure AD directory. If you haven't done so, follow all the tasks outlined in the [Getting Started guide](active-directory-ds-getting-started.md).
4. Ensure that you have configured the IP addresses of the managed domain as the DNS servers for the virtual network. For more information, see [how to update DNS settings for the Azure virtual network](active-directory-ds-getting-started-dns.md)
5. Complete the steps required to [synchronize passwords to your Azure AD Domain Services managed domain](active-directory-ds-getting-started-password-sync.md).


## Setup Azure PowerShell
Follow the instructions in the [Overview of Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-4.4.0) article to set up Azure PowerShell on your machine.


## Download the Azure quick-start template for domain join
Navigate to the [Azure quick-start template gallery on Github](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-domain-join).

Download the following files to your local machine:
* azuredeploy.json
* azuredeploy.parameters.json


## Customize the quick-start template
This Resource Manager template deploys a Windows Server 2016 virtual machine. If you would like to deploy a different Windows Server version, update the **windowsOSVersion** field in the **azuredeploy.json** file.

Open the **azuredeploy.parameters.json** file in a text editor and customize the following fields:
1. **existingVNETName**: Specify the virtual network in which you have deployed your Azure AD Domain Services managed domain.
2. **existingSubnetName**: Specify the subnet within the virtual network where you would like to deploy this virtual machine. Do not select the gateway subnet in the virtual network. Also, do not select the dedicated subnet in which your managed domain is deployed.
3. **domainToJoin**: Specify the DNS domain name of your managed domain.
4. **domainUsername**: Specify the user account name on your managed domain that should be used to join the VM to the managed domain.
5. **domainPassword**: Specify the password of the domain user account referred to by the 'domainUsername' parameter.
6. **vmAdminUsername**: Specify a local administrator account name for the virtual machine.
7. **vmAdminPassword**: Specify a local administrator password for the virtual machine. Provide a strong local administrator password for the virtual machine to protect against password brute-force attacks.
8. **dnsLabelPrefix**: Specify the hostname for the virtual machine being provisioned. For example, 'contoso-win'.

> [!WARNING]
> **Handle passwords with caution.**
> The template parameter file contains passwords for domain accounts as well as local administrator passwords for the virtual machine. Ensure you do not leave this file lying around on file shares or other shared locations. We recommend you dispose of this file once you are done deploying your virtual machines.
>


## Deploy the virtual machine using PowerShell
Refer to the article that shows how to [deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy.md).

A sample set of instructions to deploy the virtual machine using the domain join template is below:
```
Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionName <yourSubscriptionName>

New-AzureRmResourceGroupDeployment -Name contoso-win -ResourceGroupName ContosoRG -TemplateFile
C:\json-domain-join\azuredeploy.json -TemplateParameterFile C:\json-domain-join\azuredeploy.parameters.json -Verbose
```

After the deployment completes successfully, your newly provisioned Windows virtual machine is joined to the managed domain.


## Related Content
* [Overview of Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-4.4.0)
* [Azure quick-start template - Domain join a VM to an existing domain](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-domain-join)
* [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy.md)
