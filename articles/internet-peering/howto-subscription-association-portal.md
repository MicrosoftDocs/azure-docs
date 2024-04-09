---
title: Associate your ASN to Azure subscription - Azure portal
titleSuffix: Internet Peering
description: Learn how to associate peer ASN to Azure subscription using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/13/2024

#CustomerIntent: As an administrator, I want to learn how to create a PeerASN resource so I can associate my peer ASN to Azure subscription and submit peering requests.
---

# Associate your ASN with an Azure subscription using the Azure portal

In this article, you learn how to associate your Autonomous System Number (ASN) with an Azure subscription using the Azure portal. To learn how to associate your ASN with an Azure subscription using Azure PowerShell, see [Associate peer ASN to Azure subscription using PowerShell](howto-subscription-association-powershell.md).

As an Internet Service Provider or Internet Exchange Provider, you must associate your peer ASN with an Azure subscription before you submit a peering request.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Peering provider. For more information, see [Register Peering provider](#register-peering-provider).

## Register Peering provider

In this section, you learn how to check if the peering provider is registered in your subscription and how to register it if not registered. Peering provider is required to set up peering. If you previously registered the peering provider, you can skip this section.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***Subscriptions***. Select **Subscriptions** in the search results.

    :::image type="content" source="./media/howto-subscription-association-portal/subscriptions-portal-search.png" alt-text="Screenshot of searching for subscriptions in the Azure portal." lightbox="./media/howto-subscription-association-portal/subscriptions-portal-search.png":::

1. Select the Azure subscription that you want to enable the provider for.

1. Under **Settings**, select **Resource providers**.

1. Enter ***peering*** in the filter box.

1. Confirm the status of the provider is **Registered**. If the status is **NotRegistered**, select the **Microsoft.Peering** provider then select **Register**.

    :::image type="content" source="./media/howto-subscription-association-portal/register-microsoft-peering-provider.png" alt-text="Screenshot shows how to register Peering provider in the Azure portal." lightbox="./media/howto-subscription-association-portal/register-microsoft-peering-provider.png":::

## Create PeerAsn to associate your ASN with Azure Subscription

As an Internet Service Provider or Internet Exchange Provider, you can create a new PeerAsn resource to associate an Autonomous System Number (ASN) with an Azure subscription. You can associate multiple ASNs to a subscription by creating a **PeerAsn** for each ASN you need to associate.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the [Associate a Peer ASN](https://go.microsoft.com/fwlink/?linkid=2129592) page.

1. On the **Associate a Peer ASN**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Name | Enter a name for the PeerASN resource that you're creating. |
    | Subscription | Select your Azure subscription that you want to associate the ASN with. |
    | **Instance details** |  |
    | Peer name | Enter your company name. This name must be as close as possible to your PeeringDB profile. |
    | Peer ASN | Enter your ASN. |

    :::image type="content" source="./media/howto-subscription-association-portal/associate-peer-asn.png" alt-text="Screenshot shows how to associate a peer ASN in the Azure portal." lightbox="./media/howto-subscription-association-portal/associate-peer-asn.png":::

1. Select **Create new** and enter **Email address** and **Phone number** of your Network Operations Center (NOC).

1. Select **Review + create**.

1. Review the settings, and then select **Create**. If deployment fails, contact [Microsoft peering](mailto:peering@microsoft.com).

## View status of a PeerAsn

Once PeerAsn resource is deployed successfully, you must wait for Microsoft to approve the association request. It might take up to 12 hours for approval. Once approved, you receive a notification to the email address you entered during the creation of PeerASN resource.

> [!IMPORTANT]
> Wait for the **ValidationState** to turn **Approved** before submitting a peering request. It may take up to 12 hours for this approval.

## Modify PeerAsn

Modifying a PeerAsn isn't currently supported. If you need to modify a PeerASN, contact [Microsoft peering](mailto:peering@microsoft.com).

## Delete PeerAsn

Deleting a PeerAsn isn't currently supported. If you need to delete a PeerAsn, contact [Microsoft peering](mailto:peering@microsoft.com).

## Related content

- [Create or modify a Direct peering using the Azure portal](howto-direct-portal.md).
- [Create or modify Exchange peering using the Azure portal](howto-exchange-portal.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).