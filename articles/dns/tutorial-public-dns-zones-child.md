---
title: 'Tutorial: Creating an Azure child DNS zones'
titleSuffix: Azure DNS
description: Tutorial on how to create child DNS zones in Azure portal.
author: jonbeck
ms.assetid: be4580d7-aa1b-4b6b-89a3-0991c0cda897
ms.service: dns
ms.topic: tutorial
ms.custom:  
ms.workload: infrastructure-services
ms.date: 04/19/2021
ms.author: jonbeck
---
# Tutorial: Creating a new Child DNS zone

In this tutorial, you learn how to: 

> [!div class="checklist"]
> * Signing in to Azure Portal.
> * Creating child DNS zone via new DNS zone.
> * Creating child DNS zone via parent DNS zone.
> * Verifying NS Delegation for new Child DNS zone.

## Prerequisites

* An Azure account with an active subscription.  If you don't have an account, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Existing parent Azure DNS zone.  

In this tutorial, we'll use contoso.com as the parent zone and subdomain.contoso.com as the child domain name.  Replace *contoso.com* with your parent domain name and *subdomain* with your child domain.  If you haven't created your parent DNS zone, see steps to [create DNS zone using Azure portal](./dns-getstarted-portal.md#create-a-dns-zone). 


## Sign in to Azure portal

Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.
If you don't have an Azure subscription, create a free account before you begin.

There are two ways you can do create your child DNS zone.
1.	Through the "Create DNS zone" portal page.
1.	Through the parent DNS zone's configuration page.

## Create child DNS zone via create DNS zone

In this step, we'll create a new child DNS zone with name **subdomain.contoso.com** and delegate it to existing parent DNS zone **contoso.com**. You'll create the DNS zone using the tabs on the **Create DNS zone** page.
1.	On the Azure portal menu or from the **Home** page, select **Create a resource**. The **New** window appears.
1.	Select **Networking**, then select **DNS zone** and then select **Add** button.

1.	On the **basics** tab, type or select the following values:
    * **Subscription**: Select a subscription to create the zone in.
    * **Resource group**: Enter your existing Resource group or create a new one by selecting **Create new**. Enter *MyResourceGroup*, and select **OK**. The resource group name must be unique within the Azure subscription.
    * Check this checkbox: **This zone is a child of an existing zone already hosted in Azure DNS**
    * **Parent zone subscription**: From this drop down, search or select the subscription name under which parent DNS zone *contoso.com* was created.
    * **Parent zone**: In the search bar type *contoso.com* to load it in dropdown list. Once loaded select *contoso.com* from dropdown list.
    * **Name:** Type *subdomain* for this tutorial example. Notice that your parent DNS zone name *contoso.com* is automatically added as suffix to name when we select parent zone from the above step.

1. Select **Next: Review + create**.
1. On the **Review + create** tab, review the summary, correct any validation errors, and then select **Create**.
It may take a few minutes to create the zone.

    :::image type="content" source="./media/dns-delegate-domain-azure-dns/create-dns-zone-inline.png" alt-text="Screenshot of the create DNS zone page." lightbox="./media/dns-delegate-domain-azure-dns/create-dns-zone-expanded.png":::

## Create child DNS zone via parent DNS zone overview page
You can also create a new child DNS zone and delegate it into the parent DNS zone by using the **Child Zone** button from parent zone overview page. Using this button automatically pre-populates the parent parameters for the child zone automatically. 

1.	In the Azure portal, under **All resources**, open the *contoso.com* DNS zone in the **MyResourceGroup** resource group. You can enter *contoso.com* in the **Filter by name** box to find it more easily.
1.	On DNS zone overview page, select the **+Child Zone** button.

      :::image type="content" source="./media/dns-delegate-domain-azure-dns/create-child-zone-inline.png" alt-text="Screenshot child zone button." border="true" lightbox="./media/dns-delegate-domain-azure-dns/create-child-zone-expanded.png":::

1.	The create DNS zone page will then open. Child zone option is already checked, and parent zone subscription and parent zone gets populated for you on this page.
1.	Type the name as *child* for this tutorial example. Notice that you parent DNS zone name contoso.com is automatically added as prefix to name.
1.	Select **Next: Tags** and then **Next: Review + create**.
1.	On the **Review + create** tab, review the summary, correct any validation errors, and then select **Create**.

    :::image type="content" source="./media/dns-delegate-domain-azure-dns/create-dns-zone-child-inline.png" alt-text="Screenshot of child zone selected" border="true" lightbox="./media/dns-delegate-domain-azure-dns/create-dns-zone-child-expanded.png":::

## Verify child DNS zone
Now that you have a new child DNS zone *subdomain.contoso.com* created. To verify that delegation happened correctly, you'll want to check the nameserver(NS) records for your child zone is in the parent zone as described below.  

**Retrieve name servers of child DNS zone:**

1.	In the Azure portal, under **All resources**, open the *subdomain.contoso.com* DNS zone in the **MyResourceGroup** resource group. You can enter *subdomain.contoso.com* in the **Filter by name** box to find it more easily.
1.	Retrieve the name servers from the DNS zone overview page. In this example, the zone contoso.com has been assigned name servers *ns1-08.azure-dns.com, ns2-08.azure-dns.net, ns3-08.azure-dns.org*, and *ns4-08.azure-dns.info*:

      :::image type="content" source="./media/dns-delegate-domain-azure-dns/create-child-zone-ns-inline.png" alt-text="Screenshot of child zone nameservers" border="true" lightbox="./media/dns-delegate-domain-azure-dns/create-child-zone-ns-expanded.png":::
**Verify the NS record in parent DNS zone:**

Now in this step we go the parent DNS zone *contoso.com* and check that its NS record set entry for the child zones nameservers has been created.

1. In the Azure portal, under **All resources**, open the contoso.com DNS zone in the **MyResourceGroup** resource group. You can enter contoso.com in the **Filter by name** box to find it more easily.
1.	On the *contoso.com* DNS zones overview page, check for the record sets.
1.	You'll find that record set of type NS and name subdomain is already created in parent DNS zone. Check the values for this record set it's similar to the nameserver list we retrieved from child DNS zone in above step.

     :::image type="content" source="./media/dns-delegate-domain-azure-dns/create-child-zone-ns-validate-inline.png" alt-text="Screenshot of Child zone nameservers validation" border="true" lightbox="./media/dns-delegate-domain-azure-dns/create-child-zone-ns-validate-expanded.png":::
## Clean up resources
When you no longer need the resources you created in this tutorial, remove them by deleting the **MyResourceGroup** resource group. Open the **MyResourceGroup** resource group, and select **Delete resource group**.

## Next steps

> [!div class="nextstepaction"]
> [Azure DNS Private Zones scenarios](private-dns-scenarios.md)
