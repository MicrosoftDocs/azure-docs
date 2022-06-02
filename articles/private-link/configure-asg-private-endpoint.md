---
title: Configure an application security group with a private endpoint
titleSuffix: Azure Private Link
description: Learn how to create a private endpoint with an Application Security Group or apply an ASG to an existing private endpoint.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: how-to 
ms.date: 06/02/2022
ms.custom: template-how-to
---

# Configure an application security group (ASG) with a private endpoint

Azure Private endpoints support application security groups for network security. Private endpoints can be associated with an existing ASG in your current infrastructure along side virtual machines and other network resources.

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    - The example webapp in this article is named **myWebApp1979**. Replace the example with your webapp name.

- An existing Application Security Group in your subscription. For more information about ASGs, see [Application security groups](../virtual-network/application-security-groups.md).
    
    - The example ASG used in this article is named **myASG**. Replace the example with your application security group.

- An existing Azure Virtual Network and subnet in your subscription. For more information about creating a virtual network, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

    - The example virtual network used in this article is named **myVNet**. Replace the example with your virtual network.

## Create private endpoint with an ASG

An ASG can be associated with a private endpoint when it's created. The following procedures demonstrate how to associate an ASG with a private endpoint when it's created.

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

3. Select **+ Create** in **Private endpoints**.

4. In the **Basics** tab of **Create a private endpoint**, enter or select the following information.

    | Value | Setting |
    | ----- | ------- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. </br> In this example, it's **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myPrivateEndpoint**. |
    | Region | Select **East US**. |

5. Select **Next: Resource** at the bottom of the page.

6. In the **Resource** tab, enter or select the following information.

    | Value | Setting |
    | ----- | ------- |
    | Connection method | Select **Connect to an Azure resource in my directory.** |
    | Subscription | Select your subscription |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select **mywebapp1979**. |
    | Target subresource | Select **sites**. |

7. Select **Next: Virtual Network** at the bottom of the page.

8. In the **Virtual Network** tab, enter or select the following information.

    | Value | Setting |
    | ----- | ------- |
    | **Networking** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select your subnet. </br> In this example, it's **myVNet/myBackendSubnet(10.0.0.0/24)**. |
    | Enable network policies for all private endpoints in this subnet. | Leave the default of checked. |
    | **Application security group** |   |
    | Application security group | Select **myASG**. |

    :::image type="content" source="./media/configure-asg-private-endpoint/asg-new-endpoint.png" alt-text="Screenshot of ASG selection when creating a new private endpoint.":::

9. Select **Next: DNS** at the bottom of the page.

10. Select **Next: Tags** at the bottom of the page.

11. Select **Next: Review + create**.

12. Select **Create**.

## Associate an ASG with an existing private endpoint

An ASG can be associated with an existing private endpoint. The following procedures demonstrate how to associate an ASG with an existing private endpoint.

> [!IMPORTANT]
> You must have a previously deployed private endpoint to proceed with the steps in this section. The example endpoint used in this section is named **myPrivateEndpoint**. Replace the example with your private endpoint.

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

3. In **Private endpoints**, select **myPrivateEndpoint**.

4. In **myPrivateEndpoint**, in **Settings**, select **Application security groups**.

5. In **Application security groups**, select **myASG** in the pull-down box.

    :::image type="content" source="./media/configure-asg-private-endpoint/asg-existing-endpoint.png" alt-text="Screenshot of ASG selection when associating with an existing private endpoint.":::

6. Select **Save**.

## Next steps

For more information about Azure Private Link, see:

- [What is Azure Private Link?](private-link-overview.md)


