---
title: 'Quickstart: Create a public DNS zone and record - Azure portal'
titleSuffix: Azure DNS
description: Use this step-by-step quickstart guide to learn how to create an Azure public DNS zone and record using the Azure portal.
services: dns
author: greg-lindsay
ms.author: greglin
ms.date: 11/20/2023
ms.topic: quickstart
ms.service: dns
ms.custom: mode-ui
#Customer intent: As an administrator or developer, I want to learn how to configure Azure DNS using the Azure portal so I can use Azure DNS for my public zone.
---

# Quickstart: Create an Azure DNS zone and record using the Azure portal

You can configure Azure DNS to resolve host names in your public domain. For example, if you purchased the *contoso.xyz* domain name from a domain name registrar, you can configure Azure DNS to host the *contoso.xyz* domain and resolve *`www.contoso.xyz`* to the IP address of your web server or web app.

In this quickstart, you create a test domain, and then create an address record to resolve *www* to the IP address *10.10.10.10*. 

:::image type="content" source="media/dns-getstarted-portal/environment-diagram.png" alt-text="Diagram of DNS deployment environment using the Azure portal." border="false":::

> [!IMPORTANT]
> The names and IP addresses in this quickstart are examples that do not represent real-world scenarios. The private IP address 10.10.10.10 is used here with a public DNS zone for testing purposes.

You can also perform these steps using [Azure PowerShell](dns-getstarted-powershell.md) or the cross-platform [Azure CLI](dns-getstarted-cli.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For all portal steps, sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites

An Azure account with an active subscription is required. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a DNS zone

A DNS zone contains the DNS entries for a domain. To start hosting your domain in Azure DNS, you create a DNS zone for that domain name. 

**To create the DNS zone:**

1. At the upper left, select **Create a resource**, enter **DNS zone** into **Search services and marketplace** and then select **DNS zone**.
2. On the **DNS zone** page, select **Create**.

   ![A screenshot of the DNS zone marketplace.](./media/dns-getstarted-portal/dns-new-zone.png)

3. On the **Create DNS zone** page, type or select the following values:

   - **Resource group**: Select **Create new**, enter *MyResourceGroup*, and select **OK**. The resource group name must be unique within the Azure subscription. 
   - **Name**: Type *contoso.xyz* for this quickstart example. The DNS zone name can be any value that isn't already configured on the Azure DNS servers. A real-world value would be a domain that you bought from a domain name registrar.
   - **Resource group location**: Select a location for the new resource group. In this example, the location selected is **West US**.

4. Select **Review create** and then select **Create**.

   ![A screenshot showing how to create a DNS zone.](./media/dns-getstarted-portal/dns-create-zone.png)

It may take a few minutes to create the zone.

## Create a DNS record

Next, DNS records are created for your domain inside the DNS zone. A new address record, known as an '**A**' record, is created to resolve a host name to an IPv4 address.

**To create an 'A' record:**

1. In the Azure portal, under **All resources**, open the **contoso.xyz** DNS zone in the **MyResourceGroup** resource group. You can enter *contoso.xyz* in the **Filter by name** box to find it more easily.
2. At the top of the **contoso.xyz** DNS zone page, select **+ Record set**.
3. In the **Add a record set** window, enter or select the following values:

   - **Name**: Type *www*. This record name is the host name that you want to resolve to the specified IP address.
   - **Type**: Select **A**. 'A' records are the most common, but there are other record types for mail servers ('MX'), IP v6 addresses ('AAAA'), and so on. 
   - **TTL**: Type *1*. *Time-to-live* of the DNS request specifies how long DNS servers and clients can cache a response.
   - **TTL unit**: Select **Hours**. The time unit for the **TTL** entry is specified here. 
   - **IP address**: For this quickstart example, type *10.10.10.10*. This value is the IP address that the record name resolves to. In a real-world scenario, you would enter the public IP address for your web server.
4. Select **OK** to create the A record.

Since this quickstart is just for quick testing purposes, there's no need to configure the Azure DNS name servers at a domain name registrar. In a real production domain, you must enable users on the Internet to resolve the host name and connect to your web server or app. To accomplish this task, visit your domain name registrar and replace the name server records with the Azure DNS name servers. For more information, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md#delegate-the-domain).

## Test the name resolution

Now that you have a test DNS zone with a test 'A' record, you can test the name resolution with a tool called *nslookup*. 

**To test DNS name resolution:**

1. On the **contoso.xyz** DNS zone page, copy one of the name server names from the name server list. For example: ns1-32.azure-dns.com.

   [ ![A screenshot of the DNS zone contents.](./media/dns-getstarted-portal/view-zone.png) ](./media/dns-getstarted-portal/view-zone.png#lightbox)

1. Open a command prompt, and run the following command:

   ```
   nslookup www.contoso.xyz <name server name>
   ```

   For example:

   ```
   nslookup www.contoso.xyz ns1-32.azure-dns.com.
   ```

   You should see something like the following screen:

   ![A screenshot of a command prompt window with an nslookup command and values for Server, Address, Name, and Address.](media/dns-getstarted-portal/nslookup.png)

The host name **www\.contoso.xyz** resolves to **10.10.10.10**, just as you configured it. This result verifies that name resolution is working correctly. 

## Clean up resources

When you no longer need the resources you created in this quickstart, remove them by deleting the **MyResourceGroup** resource group. Open the **MyResourceGroup** resource group, and select **Delete resource group**.

## Next steps

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)
