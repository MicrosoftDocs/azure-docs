---
title: 'Tutorial: Create an Azure child DNS zone'
titleSuffix: Azure DNS
description: In this tutorial, you learn how to create child DNS zones in Azure portal.
author: jonbeck
ms.assetid: be4580d7-aa1b-4b6b-89a3-0991c0cda897
ms.service: dns
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 09/27/2022
ms.author: jonbeck
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---
# Tutorial: Create a child DNS zone

You can use Azure DNS to add child DNS zones for your subdomains to the parent DNS zone.

In this tutorial, you learn how to: 

> [!div class="checklist"]
> * Create a child DNS zone via parent DNS zone.
> * Create a child DNS zone via new DNS zone.
> * Verify NS Delegation for the new child DNS zone.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A parent Azure DNS zone. If you don't have one, you can [create a DNS zone](./dns-getstarted-portal.md#create-a-dns-zone).

> [!NOTE]
> In this tutorial, `contoso.com` is used for the parent zone and `subdomain.contoso.com` for the child zone. Replace `contoso.com` with your parent domain name and `subdomain` with your child domain.

There are two ways you can create your child DNS zone:

1.	Through the **Overview** page of the parent DNS zone.
1.	Through the **Create DNS zone** page.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a child DNS zone via parent DNS zone Overview page

You'll create a new child DNS zone and delegate it to the parent DNS zone using the **+ Child Zone** button from parent zone **Overview** page. By using this button to create a child zone, the parent parameters are automatically pre-populated. 

1.	In the Azure portal, enter *contoso.com* in the search box at the top of the portal and then select **contoso.com** DNS zone from the search results.
1.	In the **Overview** page, select the **+ Child zone** button.

      :::image type="content" source="./media/tutorial-public-dns-zones-child/child-zone-button.png" alt-text="Screenshot of Azure D N S zone showing the Add child zone button.":::

1.	In the **Create DNS zone**, enter or select this information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details**  |       |
    | Subscription | Select your Azure subscription.|
    | Resource group | Select an existing resource group for the child zone or create a new one by selecting **Create new**. </br> In this tutorial, the resource group **MyResourceGroup** of the parent DNS zone is selected. |
    | **Instance details** |         |
    | Name | Enter your child zone name. In this tutorial, *subdomain* is used. Notice that the parent DNS zone name `contoso.com` is automatically added as a suffix to **Name**. |
    | Resource group location | The resource group location is selected for you if you select an existing resource group for the child zone. </br> Select the resource group location if you create a new resource group for the child zone. </br> The resource group location doesn't affect your DNS zone service, which is global and not bound to a location. |

    :::image type="content" source="./media/tutorial-public-dns-zones-child/child-zone-via-overview-page.png" alt-text="Screenshot of Create D N S zone page accessed via the Add child zone button.":::

    > [!NOTE]
    > Parent zone information is automatically pre-populated when adding a child zone from the parent zone. 

1.	Select **Review + create**.
1.	Select **Create**. It may take a few minutes to create the child zone.

## Create a child DNS zone via Create DNS zone

You'll create a new child DNS zone and delegate it to the parent DNS zone using the **Create DNS zone** page.

1.	On the Azure portal menu or from the **Home** page, select **Create a resource** and then select **Networking**.
1.	Select **DNS zone** and then select the **Create** button.

1.	In **Create DNS zone**, enter or select this information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details**  |       |
    | Subscription | Select your Azure subscription.|
    | Resource group | Select an existing resource group or create a new one by selecting **Create new**. </br> In this tutorial, the resource group **MyResourceGroup** of the parent DNS zone is selected. |
    | **Instance details** |         |
    | This zone is a child of an existing zone already hosted in Azure DNS | Select this checkbox. |
    | Parent zone subscription | Select your Azure subscription under which parent DNS zone `contoso.com` was created. |
    | Parent zone | In the search bar, enter *contoso.com* to load it in dropdown list. Once loaded, select it from dropdown list. |
    | Name | Enter your child zone name. In this tutorial, *subdomain* is used. Notice that the parent DNS zone name `contoso.com` is automatically added as a suffix to **Name** after you selected parent zone from the previous step. |
    | Resource group location | The resource group location is selected for you if you select an existing resource group for the child zone. </br> Select the resource group location if you create a new resource group for the child zone. </br> The resource group location doesn't affect your DNS zone service, which is global and not bound to a location. |

    :::image type="content" source="./media/tutorial-public-dns-zones-child/child-zone-via-create-dns-zone-page.png" alt-text="Screenshot of Create D N S zone page accessed via the Create button of D N S zone page.":::

1. Select **Review + create**.
1. Select **Create**. It may take a few minutes to create the zone.


## Verify the child DNS zone

After the new child DNS zone `subdomain.contoso.com` created, verify that the delegation configured correctly. You'll need to check that your child zone name server (NS) records are in the parent zone as described below.  

### Retrieve name servers of child DNS zone

1. In the Azure portal, enter *subdomain.contoso.com* in the search box at the top of the portal and then select **subdomain.contoso.com** DNS zone from the search results.

1. Retrieve the name servers from the DNS zone **Overview** page. In this example, the zone `subdomain.contoso.com` has been assigned name servers `ns1-05.azure-dns.com.`, `ns2-05.azure-dns.net.`, `ns3-05.azure-dns.org.`, and `ns4-05.azure-dns.info.`:

      :::image type="content" source="./media/tutorial-public-dns-zones-child/child-zone-name-servers-inline.png" alt-text="Screenshot of child D N S zone Overview page showing its name servers." lightbox="./media/tutorial-public-dns-zones-child/child-zone-name-servers-expanded.png":::

### Check the NS record set in parent DNS zone

After retrieving the name servers from the child DNS zone, check that the parent DNS zone **contoso.com** has the NS record set entry for its child zone name servers.

1. In the Azure portal, enter *contoso.com* in the search box at the top of the portal and then select **contoso.com** DNS zone from the search results.
1.	Check the record sets in **Overview** page of **contoso.com** DNS zone.
1.	You'll find a record set of type **NS** and name **subdomain** created in the parent DNS zone. Compare the name servers in this record set with the ones you retrieved from the **Overview** page of the child DNS zone.

     :::image type="content" source="./media/tutorial-public-dns-zones-child/parent-zone-name-servers-inline.png" alt-text="Screenshot of child zone name servers validation in the parent D N S zone Overview page." lightbox="./media/tutorial-public-dns-zones-child/parent-zone-name-servers-expanded.png":::

## Clean up resources

When no longer needed, you can delete all resources created in this tutorial by following these steps:

1. On the Azure portal menu, select **All resources**.
1. Select **subdomain.contoso.com** DNS zone.
1. On the **Overview** page, select the **Delete zone** button.
1. Enter *subdomain.contoso.com* and select **Delete**.
1. Select **All resources** again from the Azure portal menu.
1. Select **contoso.com** DNS zone.
1. On the **Overview** page, select the **subdomain** record.
1. Select **Delete** and then **Yes**.

## Next steps

In this tutorial, you learned how to create a child zone in Azure DNS for your subdomain. To learn how to create custom DNS records for web apps, continue with the next tutorial:

> [!div class="nextstepaction"]
> [Create custom DNS records for web apps](dns-web-sites-custom-domain.md)
