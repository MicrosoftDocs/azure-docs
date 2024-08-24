---
title: Create and associate service endpoint policies - Azure portal
titlesuffix: Azure Virtual Network
description: In this article, learn how to set up and associated service endpoint policies using the Azure portal.
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/20/2024
ms.author: allensu
---

# Create, change, or delete service endpoint policy using the Azure portal

Service endpoint policies enable you to filter virtual network traffic to specific Azure resources, over service endpoints. If you're not familiar with service endpoint policies, see [service endpoint policies overview](virtual-network-service-endpoint-policies-overview.md) to learn more.

 In this tutorial, you learn how to:

> [!div class="checklist"]
* Create a virtual network.
* Add a subnet and enable service endpoint for Azure Storage.
* Create two Azure Storage accounts and allow network access to it from the subnet created above.
* Create a service endpoint policy to allow access only to one of the storage accounts.
* Deploy a virtual machine (VM) to the subnet.
* Confirm access to the allowed storage account from the subnet.
* Confirm access is denied to the non-allowed storage account from the subnet.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure 

Sign in to the [Azure portal](https://portal.azure.com).

## Create a service endpoint policy

1. In the search box in the portal, enter **Resource group**. Select **Resource groups** in the search results.

1. Select **+ Create** to create a new resource group.

1. In the **Basics** tab of **Create a resource group**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Enter **test-rg**. |
    | **Resource details** | |
    | Region | Select **West US 2**. |

1. Select **Review + Create**.

1. Select **Create**.

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Select **+ Create** to create a new service endpoint policy.

1. Enter or select the following information in the **Basics** tab of **Create a service endpoint policy**.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** | |
    | Name | Enter **service-endpoint-policy**. |
    | Location | Select **West US 2**. |

1. Select **Next: Policy definitions**.

1. Select **+ Add a resource** in **Resources**.

1. In **Add a resource**, enter or select the following information:

    | Setting | Value |
    | -------| ------- |
    | Service | Select **Microsoft.Storage**. |
    | Scope | Select **Single account**, **All accounts in subscription**, or **All accounts in resource group**. |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Resource | Select your Azure Storage resource. |

1. Select **Add**.

1. Select **Review + Create**.

1. Select **Create**.

## Associate a service endpoint policy to a subnet

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Select **service-endpoint-policy**.

1. Expand **Settings** and select **Associated subnets**.

1. Select **+ Edit subnet association**.

1. In **Edit subnet association**, select the virtual network and subnet you want to associate with the service endpoint policy.

1. Select **Apply**.

>[!WARNING] 
> Ensure that all the resources accessed from the subnet are added to the policy definition before associating the policy to the given subnet. Once the policy is associated, only access to the *allow listed* resources will be allowed over service endpoints. 
>
> Ensure that no managed Azure services exist in the subnet that is being associated to the service endpoint policy.
>
> Access to Azure Storage resources in all regions will be restricted as per Service Endpoint Policy from this subnet.

## View endpoint policies 

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Expand **Settings** and select **Policy definitions**.

1. View the existing resources and aliases in the policy definition.

1. Select **+ Add a resource** to add more resources to the policy definition. Select an existing resource to modify it's settings.

## Delete an endpoint policy

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Expand **Settings** and select **Associated subnets**.

1. Select **+ Edit subnet association**.

1. In **Edit subnet association**, select the virtual network and subnet you want to disassociate from the service endpoint policy.

1. Select **Apply**.

1. Select **Overview**.

1. Select **Delete**.

1. Select **Yes** to confirm the deletion.

## Next steps
In this tutorial, you created a service endpoint policy and associated it to a subnet. To learn more about service endpoint policies, see [service endpoint policies overview.](virtual-network-service-endpoint-policies-overview.md)
