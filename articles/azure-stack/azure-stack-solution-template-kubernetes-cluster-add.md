---
title: Add a Kubernetes Cluster to the Azure Stack Marketplace | Microsoft Docs
description: Learn how to add a Kubernetes Cluster to the Azure Stack Marketplace.
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
ms.date: 05/08/2018
ms.author: mabrigg
ms.reviewer: waltero

---

# Add a Kubernetes Cluster to the Azure Stack Marketplace

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!note]  
> The Kubernetes Cluster is in private preview. To request access to the Kubernetes Marketplace item needed to perform the instructions in this article. [Submit a request to get access](https://aka.ms/azsk8).

You can offer a Kubernetes Cluster as a Marketplace item to your users. Your users can deploy Kubernetes in a single, coordinated operation.

The following article look at using an Azure Resource Manager template to deploy and provision the resources for a standalone Kubernetes cluster. Before you start, check your Azure Stack and global Azure tenant settings. Collect the required information about your Azure Stack. Add necessary resources to your tenant and to the Azure Stack Marketplace.

## Create a plan, an offer, and a subscription

Create a plan, an offer, and a subscription for the Kubernetes Cluster Marketplace item. You can also use an existing plan and offer.

1. Sign in to the [Administration portal.](https://adminportal.local.azurestack.external)

2. Create a plan as the base plan. For instructions, see [Create a plan in Azure Stack](azure-stack-create-plan.md).

3. Create an offer. For instructions, see [Create an offer in Azure Stack](azure-stack-create-offer.md).

4. Select **Offers**, and find the offer you created.

5. Select **Overview** in the Offer blade.

6. Select **Change state**. Select **Public**.

7. Select **+ New** > **Offers and Plans** > **Subscription** to create a new subscription.

    a. Enter a **Display Name**.

    b. Enter a **User**. Use the Azure AD account associated with your tenant.

    c. **Provider Description**

    d. Set the **Directory tenant** to the Azure AD tenant for your Azure Stack. 

    e. Select **Offer**. Select the name of the offer that you created. Make note of the Subscription ID.

## Add the Kubernetes Cluster to the marketplace

1. Open the [Administration portal](https://adminportal.local.azurestack.external).

2. Select **More services** > **Marketplace Management**.

3. Select **+ Add from Azure**.

4. Enter `Kubernetes Cluster`.

5. Select `Kubernetes Cluster`.

6. Select **Download.**

    > [!note]  
    > It may take five minutes for the marketplace item to appear in the Marketplace.

    ![Kubernetes Cluster](user\media\azure-stack-solution-template-kubernetes-deploy\marketplaceitem.png)

## Next steps

[Overview of offering services in Azure Stack](azure-stack-offer-services-overview.md)

[Deploy a Kubernetes Cluster to Azure Stack](/user/azure-stack-solution-template-kubernetes-deploy.md)