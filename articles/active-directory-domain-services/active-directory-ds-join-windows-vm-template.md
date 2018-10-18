---
title: 'Join a Windows Server VM to Azure Active Directory Domain Services | Microsoft Docs'
description: Join a Windows Server virtual machine to a managed domain using Azure Resource Manager templates.
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: 4eabfd8e-5509-4acd-86b5-1318147fddb5
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/22/2018
ms.author: maheshu
---

# Join a Windows Server virtual machine to a managed domain using a Resource Manager template
This article shows you how to join a Windows Server virtual machine to an Azure AD Domain Services managed domain using Resource Manager templates.

[!INCLUDE [active-directory-ds-prerequisites.md](../../includes/active-directory-ds-prerequisites.md)]

## Before you begin
To perform the tasks listed in this article, you need:
1. A valid **Azure subscription**.
2. An **Azure AD directory** - either synchronized with an on-premises directory or a cloud-only directory.
3. **Azure AD Domain Services** must be enabled for the Azure AD directory. If you haven't done so, follow all the tasks outlined in the [Getting Started guide](active-directory-ds-getting-started.md).
4. Ensure that you have configured the IP addresses of the managed domain as the DNS servers for the virtual network. For more information, see [how to update DNS settings for the Azure virtual network](active-directory-ds-getting-started-dns.md)
5. Complete the steps required to [synchronize passwords to your Azure AD Domain Services managed domain](active-directory-ds-getting-started-password-sync.md).


## Install and configure required tools
You can use either of the following options to perform the steps outlined in this document:
* **Azure PowerShell**: [Install and configure](https://azure.microsoft.com/documentation/articles/powershell-install-configure/)
* **Azure CLI**: [Install and configure](https://azure.microsoft.com/documentation/articles/xplat-cli-install/)


## Option 1: Provision a new Windows Server VM and join it to a managed domain
**Quick start template name**: [201-vm-domain-join](https://azure.microsoft.com/resources/templates/201-vm-domain-join/)

To deploy a Windows Server virtual machine and join it to a managed domain, perform the following steps:
1. Navigate to the [quick start template](https://azure.microsoft.com/resources/templates/201-vm-domain-join/).
2. Click **Deploy to Azure**.
3. In the **Custom deployment** page, provide the required information to provision the virtual machine.
4. Select the **Azure subscription** in which to provision the virtual machine. Pick the same Azure subscription in which you have enabled Azure AD Domain Services.
5. Choose an existing **Resource group** or create a new one.
6. Pick a **Location** in which to deploy the new virtual machine.
7. In **Existing VNET Name**, specify the virtual network in which you have deployed your Azure AD Domain Services managed domain.
8. In **Existing Subnet Name**, specify the subnet within the virtual network where you would like to deploy this virtual machine. Do not select the gateway subnet in the virtual network. Also, do not select the dedicated subnet in which your managed domain is deployed.
9. In **DNS Label Prefix**, specify the hostname for the virtual machine being provisioned. For example, 'contoso-win'.
10. Select the appropriate **VM Size** for the virtual machine.
11. In **Domain To Join**, specify the DNS domain name of your managed domain.
12. In **Domain Username**, specify the user account name on your managed domain that should be used to join the VM to the managed domain.
13. In **Domain Password**, specify the password of the domain user account referred to by the 'domainUsername' parameter.
14. Optional: You can specify an **OU Path** to a custom OU, in which to add the virtual machine. If you do not specify a value for this parameter, the virtual machine is added to the default **AAD DC Computers** OU on the managed domain.
15. In the **VM Admin Username** field, specify a local administrator account name for the virtual machine.
16. In the **VM Admin Password** field, specify a local administrator password for the virtual machine. Provide a strong local administrator password for the virtual machine to protect against password brute-force attacks.
17. Click **I agree to the terms and conditions stated above**.
18. Click **Purchase** to provision the virtual machine.

> [!WARNING]
> **Handle passwords with caution.**
> The template parameter file contains passwords for domain accounts as well as local administrator passwords for the virtual machine. Ensure you do not leave this file lying around on file shares or other shared locations. We recommend you dispose of this file once you are done deploying your virtual machines.
>

After the deployment completes successfully, your newly provisioned Windows virtual machine is joined to the managed domain.


## Option 2: Join an existing Windows Server VM to a managed domain
**Quick start template**: [201-vm-domain-join-existing](https://azure.microsoft.com/resources/templates/201-vm-domain-join-existing/)

To join an existing Windows Server virtual machine to a managed domain, perform the following steps:
1. Navigate to the [quick start template](https://azure.microsoft.com/resources/templates/201-vm-domain-join-existing/).
2. Click **Deploy to Azure**.
3. In the **Custom deployment** page, provide the required information to provision the virtual machine.
4. Select the **Azure subscription** in which to provision the virtual machine. Pick the same Azure subscription in which you have enabled Azure AD Domain Services.
5. Choose an existing **Resource group** or create a new one.
6. Pick a **Location** in which to deploy the new virtual machine.
7. In the **VM List** field, specify the names of the existing virtual machines to be joined to the managed domain. Use a comma to separate individual VM names. For example, **contoso-web, contoso-api**.
8. In **Domain Join User Name**, specify the user account name on your managed domain that should be used to join the VM to the managed domain.
9. In **Domain Join User Password**, specify the password of the domain user account referred to by the 'domainUsername' parameter.
10. In **Domain FQDN**, specify the DNS domain name of your managed domain.
11. Optional: You can specify an **OU Path** to a custom OU, in which to add the virtual machine. If you do not specify a value for this parameter, the virtual machine is added to the default **AAD DC Computers** OU on the managed domain.
12. Click **I agree to the terms and conditions stated above**.
13. Click **Purchase** to provision the virtual machine.

> [!WARNING]
> **Handle passwords with caution.**
> The template parameter file contains passwords for domain accounts as well as local administrator passwords for the virtual machine. Ensure you do not leave this file lying around on file shares or other shared locations. We recommend you dispose of this file once you are done deploying your virtual machines.
>

After the deployment completes successfully, the specified Windows virtual machines are joined to the managed domain.


## Related Content
* [Overview of Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-4.4.0)
* [Azure quick-start template - Domain join a new VM](https://azure.microsoft.com/resources/templates/201-vm-domain-join/)
* [Azure quick-start template - Domain join existing VMs](https://azure.microsoft.com/resources/templates/201-vm-domain-join-existing/)
* [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy.md)
