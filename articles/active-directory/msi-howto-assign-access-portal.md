---
title: How to assign an MSI access to an Azure resource, using the Azure portal
description: Step by step instructions for assigning an MSI on one resource, access to another resource, using the Azure portal.
services: active-directory
documentationcenter: 
author: bryanla
manager: mbaldwin
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# How to assign a Managed Service Identity (MSI) access to a resource, using the Azure portal

Once you've configured an Azure resource with an MSI, you can give the MSI access to another resource, just like any security principal. This example shows you how to give an Azure virtual machine's MSI access to an Azure storage account, using the Azure portal.

## Use Role Based Access Control (RBAC) to assign the MSI access to another resource

After you've enabled MSI on an Azure resource, [such as an Azure VM](msi-qs-configure-portal-windows-vm.md):

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription under which you have configured the MSI.

2. Navigate to the desired resource on which you want to modify access control. In this example, we are giving an Azure VM access to a storage account, so we navigate to the storage account.

3. Click the "Access control (IAM)" page of the resource, and click "+ Add." Then specify the Role, Assign access to a "Virtual Machine", and specify the corresponding Subscription and Resource Group where the resource resides. Under the search criteria area, you should see the resource show up. Select the resource and hit "Save." : 

   ![Access control (IAM) screenshot](./media/msi-howto-assign-access-portal/assign-access-control-iam-blade-before.png)  

4. You are returned to the main "Access control (IAM)" page, where you see a new entry for the resource's MSI. In this example, the "SimpleWinVM" VM from the Demo Resource Group has been given "Contributor" access to the storage account :

   ![Access control (IAM) screenshot](./media/msi-howto-assign-access-portal/assign-access-control-iam-blade-after.png)

## Troubleshooting

If the MSI for the resource does not show up in the list of available identities, verify that the MSI has been enabled correctly. In our case, we can go back to the Azure VM and:

- look at the "Configuration" page and ensure MSI enabled = "Yes."
- look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](../active-directory/msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md).


