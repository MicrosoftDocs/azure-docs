---
title: Delete Azure Active Directory Domain Services | Microsoft Docs
description: Learn how to disable, or delete, an Azure Active Directory Domain Services managed domain using the Azure portal
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 89e407e1-e1e0-49d1-8b89-de11484eee46
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/30/2020
ms.author: iainfou

---
# Delete an Azure Active Directory Domain Services managed domain using the Azure portal

If you no longer need a managed domain, you can delete an Azure Active Directory Domain Services (Azure AD DS) managed domain. There's no option to turn off or temporarily disable an Azure AD DS managed domain. Deleting the managed domain doesn't delete or otherwise adversely impact the Azure AD tenant. This article shows you how to use the Azure portal to delete a managed domain.

> [!WARNING]
> **Deletion is permanent and can't be reversed.**
> When you delete a managed domain, the following steps occur:
>   * Domain controllers for the managed domain are de-provisioned and removed from the virtual network.
>   * Data on the managed domain is deleted permanently. This data includes custom OUs, GPOs, custom DNS records, service principals, GMSAs, etc. that you created.
>   * Machines joined to the managed domain lose their trust relationship with the domain and need to be unjoined from the domain.
>       * You can't sign in to these machines using corporate AD credentials. Instead, you must use the local administrator credentials for the machine.

## Delete the managed domain

To delete a managed domain, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**.
1. Select the name of your managed domain, such as *aaddscontoso.com*.
1. On the **Overview** page, select **Delete**. To confirm the deletion, type the domain name of the managed domain again, then select **Delete**.

It can take 15-20 minutes or more to delete the managed domain.

## Next steps

Consider [sharing feedback][feedback] for the features that you would like to see in Azure AD DS.

If you want to get started with Azure AD DS again, see [Create and configure an Azure Active Directory Domain Services managed domain][create-instance].

<!-- INTERNAL LINKS -->
[feedback]: contact-us.md
[create-instance]: tutorial-create-instance.md
