---
title: Add Kubernetes to the Azure Stack Marketplace | Microsoft Docs
description: Learn how to add Kubernetes to the Azure Stack Marketplace.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/08/2018
ms.author: mabrigg
ms.reviewer: waltero

---

# Add Kubernetes to the Azure Stack Marketplace

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!note]  
> Kubernetes on Azure Stack is in preview.

You can offer Kubernetes as a Marketplace item to your users. Your users can deploy Kubernetes in a single, coordinated operation.

The following article look at using an Azure Resource Manager template to deploy and provision the resources for a standalone Kubernetes cluster. The Kubernetes Cluster Marketplace item 0.3.0 requires Azure Stack version 1808. Before you start, check your Azure Stack and global Azure tenant settings. Collect the required information about your Azure Stack. Add necessary resources to your tenant and to the Azure Stack Marketplace. The cluster depends on an Ubuntu server, custom script, and the Kubernetes items to be in the marketplace.

## Create a plan, an offer, and a subscription

Create a plan, an offer, and a subscription for the Kubernetes Marketplace item. You can also use an existing plan and offer.

1. Sign in to the [Administration portal.](https://adminportal.local.azurestack.external)

1. Create a plan as the base plan. For instructions, see [Create a plan in Azure Stack](azure-stack-create-plan.md).

1. Create an offer. For instructions, see [Create an offer in Azure Stack](azure-stack-create-offer.md).

1. Select **Offers**, and find the offer you created.

1. Select **Overview** in the Offer blade.

1. Select **Change state**. Select **Public**.

1. Select **+ Create a resource** > **Offers and Plans** > **Subscription** to create a new subscription.

    a. Enter a **Display Name**.

    b. Enter a **User**. Use the Azure AD account associated with your tenant.

    c. **Provider Description**

    d. Set the **Directory tenant** to the Azure AD tenant for your Azure Stack. 

    e. Select **Offer**. Select the name of the offer that you created. Make note of the Subscription ID.

## Add an Ubuntu server image

Add the following Ubuntu Server image to the Marketplace:

1. Sign in to the [Administration portal](https://adminportal.local.azurestack.external).

1. Select **All services**, and then under the **ADMINISTRATION** category, select **Marketplace management**.

1. Select **+ Add from Azure**.

1. Enter `UbuntuServer`.

1. Select the newest version of the server with the following profile:
    - **Publisher**: Canonical
    - **Offer**: UbuntuServer
    - **SKU**: 16.04-LTS

1. Select **Download.**

## Add a custom script for Linux

Add the Kubernetes from the Marketplace:

1. Open the [Administration portal](https://adminportal.local.azurestack.external).

1. Select **ALL services** and then under the **ADMINISTRATION** category, select **Marketplace Management**.

1. Select **+ Add from Azure**.

1. Enter `Custom Script for Linux`.

1. Select the script with the following profile:
    - **Offer**: Custom Script for Linux 2.0
    - **Version**: 2.0.6
    - **Publisher**: Microsoft Corp

    > [!Note]  
    > More than one version of Custom Script for Linux may be listed. You will need to add the version that matches. The Kubernetes requires the exact version of the item.

1. Select **Download.**


## Add Kubernetes to the marketplace

1. Open the [Administration portal](https://adminportal.local.azurestack.external).

1. Select **All services** and then under the **ADMINISTRATION** category, select **Marketplace Management**.

1. Select **+ Add from Azure**.

1. Enter `Kubernetes`.

1. Select `Kubernetes Cluster`.

1. Select **Download.**

    > [!note]  
    > It may take five minutes for the marketplace item to appear in the Marketplace.

    ![Kubernetes](user\media\azure-stack-solution-template-kubernetes-deploy\marketplaceitem.png)

## Update or remove the Kubernetes 

When updating the Kubernetes item, you will need to remove the item that is in the Marketplace. Then you can follow the instruction in this article to add the Kubernetes to the marketplace.

To remove the Kubernetes item:

1. Connect to Azure Stack with PowerShell as an operator. For instruction, see [Connect to Azure Stack with PowerShell as an operator](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-configure-admin).

2. Find the current Kubernetes Cluster item in the gallery.

    ```PowerShell  
    Get-AzsGalleryItem | Select Name
    ```
    
3. Note name of the current item, such as `Microsoft.AzureStackKubernetesCluster.0.2.0`

4. Use the following PowerShell cmdlet to remove the item:

    ```PowerShell  
    $Itemname="Microsoft.AzureStackKubernetesCluster.0.3.0"

    Remove-AzsGalleryItem -Name $Itemname
    ```

## Next steps

[Deploy a Kubernetes to Azure Stack](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy)



[Overview of offering services in Azure Stack](azure-stack-offer-services-overview.md)