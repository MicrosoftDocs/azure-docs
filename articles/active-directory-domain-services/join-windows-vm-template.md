---
title: Use a template to join a Windows Server VM to Azure AD DS | Microsoft Docs
description: Learn how to use Azure Resource Manager templates to join a new or existing Windows Server VM to an Azure Active Directory Domain Services managed domain.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 4eabfd8e-5509-4acd-86b5-1318147fddb5
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 09/17/2019
ms.author: iainfou
---

# Join a Windows Server virtual machine to a managed domain using a Resource Manager template

This article shows you how to join a Windows Server virtual machine to an Azure AD Domain Services managed domain using Resource Manager templates.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, the first tutorial [creates and configures an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance].
* A user account that's a member of the *Azure AD DC administrators* group in your Azure AD tenant.

## Azure Resource Manager template overview

The following JSON example uses the *Microsoft.Compute/virtualMachines/extensions* resource type to install the *JsonADDomainExtension*. Parameters are used that you specify at deployment time. When the extension is deployed, the VM is joined to the specified Azure AD DS managed domain.

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

## Create a Windows Server VM and join to a managed domain

To create a Windows Server VM then join it to an Azure AD DS managed domain, complete the following steps:

1. Browse to the [quickstart template](https://azure.microsoft.com/resources/templates/201-vm-domain-join/). Select the option to **Deploy to Azure**.
1. On the **Custom deployment** page, enter the following information to create and join a Windows Server VM to the Azure AD DS managed domain:

    | Setting                   | Value |
    |---------------------------|-------|
    | Subscription              | Pick the same Azure subscription in which you have enabled Azure AD Domain Services. |
    | Resource group            | Choose the resource group with your existing VM. |
    | Location                  | Select the location of your existing VM. |
    | Existing VNET Name        | The name of the existing virtual network to connect the VM to, such as *myVnet*. |
    | Existing Subnet Name      | The name of the existing virtual network subnet, such as *Workloads*. |
    | DNS Label Prefix          | Enter a DNS name to use for the VM, such as *myvm*. |
    | VM size                   | Specify a VM size, such as *Standard_DS2_v2*. |
    | Domain To Join            | The Azure AD DS managed domain DNS name, such as *contoso.com*. |
    | Domain Username           | The user account in the Azure AD DS managed domain that should be used to join the VM to the managed domain. This account must be a member of the *Azure AD DC administrators* group. |
    | Domain Password           | The password for the user account specified in the previous setting. |
    | Optional OU Path          | The custom OU in which to add the VM. If you don't specify a value for this parameter, the VM is added to the default *AAD DC Computers* OU. |
    | VM Admin Username         | Specify a local administrator account to create on the VM. |
    | VM Admin Password         | Specify a local administrator password for the VM. Create a strong local administrator password to protect against password brute-force attacks. |

1. Review the terms and conditions, then check the box for **I agree to the terms and conditions stated above**. When ready, select **Purchase** to join the VM to the Azure AD DS managed domain.

> [!WARNING]
> **Handle passwords with caution.**
> The template parameter file requests the password for a user account that's a member of the *Azure AD DC administrators* group. Don't manually enter values into this file and leave it accessible on file shares or other shared locations.

It takes a few minutes for the deployment to complete successfully. When finished, the Windows VM is created and joined to the Azure AD DS managed domain. The VM can be managed or signed into using domain accounts.

## Join an existing Windows Server VM to a managed domain

If you have an existing VM, or group of VMs, that you wish to join to an Azure AD DS managed domain, you can use a Resource Manager template to deploy the VM extension. To join an existing Windows Server VM to an Azure AD DS managed domain, complete the following steps:

1. Browse to the [quickstart template](https://azure.microsoft.com/resources/templates/201-vm-domain-join-existing/). Select the option to **Deploy to Azure**.
1. On the **Custom deployment** page, enter the following information to join the VM to the Azure AD DS managed domain:

    | Setting                   | Value |
    |---------------------------|-------|
    | Subscription              | Pick the same Azure subscription in which you have enabled Azure AD Domain Services. |
    | Resource group            | Choose the resource group with your existing VM. |
    | Location                  | Select the location of your existing VM. |
    | VM list                   | Enter the comma-separated list of the existing VM(s) to join to the Azure AD DS managed domain, such as *myVM1,myVM2*. |
    | Domain Join User Name     | The user account in the Azure AD DS managed domain that should be used to join the VM to the managed domain. This account must be a member of the *Azure AD DC administrators* group. |
    | Domain Join User Password | The password for the user account specified in the previous setting. |
    | Optional OU Path          | The custom OU in which to add the VM. If you don't specify a value for this parameter, the VM is added to the default *AAD DC Computers* OU. |

1. Review the terms and conditions, then check the box for **I agree to the terms and conditions stated above**. When ready, select **Purchase** to join the VM to the Azure AD DS managed domain.

> [!WARNING]
> **Handle passwords with caution.**
> The template parameter file requests the password for a user account that's a member of the *Azure AD DC administrators* group. Don't manually enter values into this file and leave it accessible on file shares or other shared locations.

It takes a few moments for the deployment to complete successfully. When finished, the specified Windows VMs are joined to the Azure AD DS managed domain and can be managed or signed into using domain accounts.

## Next steps

You can use either of the following options to perform the steps outlined in this document:

* **Azure PowerShell**: [Install and configure](https://azure.microsoft.com/documentation/articles/powershell-install-configure/)
* **Azure CLI**: [Install and configure](https://azure.microsoft.com/documentation/articles/xplat-cli-install/)

* [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy.md)

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
