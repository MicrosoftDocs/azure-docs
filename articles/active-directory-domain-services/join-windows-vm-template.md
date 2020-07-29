---
title: Use a template to join a Windows VM to Azure AD DS | Microsoft Docs
description: Learn how to use Azure Resource Manager templates to join a new or existing Windows Server VM to an Azure Active Directory Domain Services managed domain.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 4eabfd8e-5509-4acd-86b5-1318147fddb5
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/31/2020
ms.author: iainfou
---

# Join a Windows Server virtual machine to an Azure Active Directory Domain Services managed domain using a Resource Manager template

To automate the deployment and configuration of Azure virtual machines (VMs), you can use a Resource Manager template. These templates let you create consistent deployments each time. Extensions can also be included in templates to automatically configure a VM as part of the deployment. One useful extension joins VMs to a domain, which can be used with Azure Active Directory Domain Services (Azure AD DS) managed domains.

This article shows you how to create and join a Windows Server VM to an Azure AD DS managed domain using Resource Manager templates. You also learn how to join an existing Windows Server VM to an Azure AD DS domain.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, the first tutorial [creates and configures an Azure Active Directory Domain Services managed domain][create-azure-ad-ds-instance].
* A user account that's a part of the managed domain.

## Azure Resource Manager template overview

Resource Manager templates let you define Azure infrastructure in code. The required resources, network connections, or configuration of VMs can all be defined in a template. These templates create consistent, reproducible deployments each time, and can be versioned as you make changes. For more information, see [Azure Resource Manager templates overview][template-overview].

Each resource is defined in a template using JavaScript Object Notation (JSON). The following JSON example uses the *Microsoft.Compute/virtualMachines/extensions* resource type to install the Active Directory domain join extension. Parameters are used that you specify at deployment time. When the extension is deployed, the VM is joined to the specified managed domain.

```json
 {
      "apiVersion": "2015-06-15",
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "[concat(parameters('dnsLabelPrefix'),'/joindomain')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', parameters('dnsLabelPrefix'))]"
      ],
      "properties": {
        "publisher": "Microsoft.Compute",
        "type": "JsonADDomainExtension",
        "typeHandlerVersion": "1.3",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "Name": "[parameters('domainToJoin')]",
          "OUPath": "[parameters('ouPath')]",
          "User": "[concat(parameters('domainToJoin'), '\\', parameters('domainUsername'))]",
          "Restart": "true",
          "Options": "[parameters('domainJoinOptions')]"
        },
        "protectedSettings": {
          "Password": "[parameters('domainPassword')]"
        }
      }
    }
```

This VM extension can be deployed even if you don't create a VM in the same template. The examples in this article show both of the following approaches:

* [Create a Windows Server VM and join to a managed domain](#create-a-windows-server-vm-and-join-to-a-managed-domain)
* [Join an existing Windows Server VM to a managed domain](#join-an-existing-windows-server-vm-to-a-managed-domain)

## Create a Windows Server VM and join to a managed domain

If you need a Windows Server VM, you can create and configure one using a Resource Manager template. When the VM is deployed, an extension is then installed to join the VM to a managed domain. If you already have a VM you wish to join to a managed domain, skip to [Join an existing Windows Server VM to a managed domain](#join-an-existing-windows-server-vm-to-a-managed-domain).

To create a Windows Server VM then join it to a managed domain, complete the following steps:

1. Browse to the [quickstart template](https://azure.microsoft.com/resources/templates/201-vm-domain-join/). Select the option to **Deploy to Azure**.
1. On the **Custom deployment** page, enter the following information to create and join a Windows Server VM to the managed domain:

    | Setting                   | Value |
    |---------------------------|-------|
    | Subscription              | Pick the same Azure subscription in which you have enabled Azure AD Domain Services. |
    | Resource group            | Choose the resource group for your VM. |
    | Location                  | Select the location of for your VM. |
    | Existing VNET Name        | The name of the existing virtual network to connect the VM to, such as *myVnet*. |
    | Existing Subnet Name      | The name of the existing virtual network subnet, such as *Workloads*. |
    | DNS Label Prefix          | Enter a DNS name to use for the VM, such as *myvm*. |
    | VM size                   | Specify a VM size, such as *Standard_DS2_v2*. |
    | Domain To Join            | The managed domain DNS name, such as *aaddscontoso.com*. |
    | Domain Username           | The user account in the managed domain that should be used to join the VM to the managed domain, such as `contosoadmin@aaddscontoso.com`. This account must be a part of the managed domain. |
    | Domain Password           | The password for the user account specified in the previous setting. |
    | Optional OU Path          | The custom OU in which to add the VM. If you don't specify a value for this parameter, the VM is added to the default *AAD DC Computers* OU. |
    | VM Admin Username         | Specify a local administrator account to create on the VM. |
    | VM Admin Password         | Specify a local administrator password for the VM. Create a strong local administrator password to protect against password brute-force attacks. |

1. Review the terms and conditions, then check the box for **I agree to the terms and conditions stated above**. When ready, select **Purchase** to create and join the VM to the managed domain.

> [!WARNING]
> **Handle passwords with caution.**
> The template parameter file requests the password for a user account that's a part of the managed domain. Don't manually enter values into this file and leave it accessible on file shares or other shared locations.

It takes a few minutes for the deployment to complete successfully. When finished, the Windows VM is created and joined to the managed domain. The VM can be managed or signed into using domain accounts.

## Join an existing Windows Server VM to a managed domain

If you have an existing VM, or group of VMs, that you wish to join to a managed domain, you can use a Resource Manager template to just deploy the VM extension.

To join an existing Windows Server VM to a managed domain, complete the following steps:

1. Browse to the [quickstart template](https://azure.microsoft.com/resources/templates/201-vm-domain-join-existing/). Select the option to **Deploy to Azure**.
1. On the **Custom deployment** page, enter the following information to join the VM to the managed domain:

    | Setting                   | Value |
    |---------------------------|-------|
    | Subscription              | Pick the same Azure subscription in which you have enabled Azure AD Domain Services. |
    | Resource group            | Choose the resource group with your existing VM. |
    | Location                  | Select the location of your existing VM. |
    | VM list                   | Enter the comma-separated list of the existing VM(s) to join to the managed domain, such as *myVM1,myVM2*. |
    | Domain Join User Name     | The user account in the managed domain that should be used to join the VM to the managed domain, such as `contosoadmin@aaddscontoso.com`. This account must be a part of the managed domain. |
    | Domain Join User Password | The password for the user account specified in the previous setting. |
    | Optional OU Path          | The custom OU in which to add the VM. If you don't specify a value for this parameter, the VM is added to the default *AAD DC Computers* OU. |

1. Review the terms and conditions, then check the box for **I agree to the terms and conditions stated above**. When ready, select **Purchase** to join the VM to the managed domain.

> [!WARNING]
> **Handle passwords with caution.**
> The template parameter file requests the password for a user account that's a part of the managed domain. Don't manually enter values into this file and leave it accessible on file shares or other shared locations.

It takes a few moments for the deployment to complete successfully. When finished, the specified Windows VMs are joined to the managed domain and can be managed or signed into using domain accounts.

## Next steps

In this article, you used the Azure portal to configure and deploy resources using templates. You can also deploy resources with Resource Manager templates using [Azure PowerShell][deploy-powershell] or the [Azure CLI][deploy-cli].

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[template-overview]: ../azure-resource-manager/templates/overview.md
[deploy-powershell]: ../azure-resource-manager/templates/deploy-powershell.md
[deploy-cli]: ../azure-resource-manager/templates/deploy-cli.md
