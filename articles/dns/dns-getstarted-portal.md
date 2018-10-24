---
title: Quickstart - Create a DNS zone and record using the Azure Portal
description: Use this quickstart to learn how to create a DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone and record using the Azure portal.
services: dns
author: vhorne
manager: jeconnoc

ms.service: dns
ms.topic: quickstart
ms.date: 6/13/2018
ms.author: victorh
#Customer intent: As an administrator or developer, I want to learn how to configure Azure DNS so I can connect to my web server using a friendly name.
---

# Quickstart: Configure Azure DNS for name resolution using the Azure Portal

 You can configure Azure DNS to resolve host names in your public domain. For example, if you purchased the contoso.com domain name from a domain name registrar, you can configure Azure DNS to host the contoso.com domain and resolve www.contoso.com to the IP address of your web server or web app.

In this quickstart, you will create a test domain and then create an  address record named 'www' to resolve to the IP address 10.10.10.10.

It is important to know that all the names and IP addresses used in this quickstart are examples only and are not meant to represent a real-world scenario. However, where applicable, real-world scenarios are also described.

<!---
You can also perform these steps using [Azure PowerShell](dns-getstarted-powershell.md) or the cross-platform [Azure CLI](dns-getstarted-cli.md).
--->

A DNS zone is used to contain the DNS entries for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS entry (or record) for your domain is then created inside this DNS zone. The following steps show you how to do this.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a DNS zone

1. Sign in to the Azure portal.
2. In the upper left, click **+ Create a resource**, then **Networking**, and then **DNS zone** to open the **Create DNS zone** page.

    ![DNS zone](./media/dns-getstarted-portal/openzone650.png)

4. On the **Create DNS zone** page, enter the following values and then click **Create**:


   | **Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|contoso.xyz|The name of the DNS zone for this example can be any value you want for this quickstart, as long as it not already configured on the Azure DNS servers. A real-world value would be a domain that you bought from a domain name registrar.|
   |**Subscription**|[Your subscription]|Select a subscription to create the DNS zone in.|
   |**Resource group**|**Create new:** dns-test|Create a resource group. The resource group name must be unique within the subscription you selected. |
   |**Location**|East US||

It may take a few minutes to create the zone.

## Create a DNS record

Now create a new address record ('A' record). 'A' records are used to resolve a host name to an IPv4 address.

1. In the Azure portal **Favorites** pane, click **All resources**. Click the **contoso.xyz** DNS zone in the All resources page. If the subscription you selected already has several resources in it, you can enter **contoso.xyz** in the **Filter by name…** box to easily access the DNS zone.

1. At the top of the **DNS zone** page, select **+ Record set** to open the **Add record set** page.

1. On the **Add record set** page, enter the following values, and click **OK**. In this example, you create an 'A' record.

   |**Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|www|Name of the record. This is the name you want to use for the host you want to resolve to an IP address.|
   |**Type**|A| Type of DNS record to create. 'A' records are the most common, but there are other record types for mail servers (MX), IP v6 addresses (AAAA), and so on. |
   |**TTL**|1|Time-to-live of the DNS request. Specifies how long DNS servers and clients can cache a response.|
   |**TTL unit**|hours|Measurement of time for TTL value.|
   |**IP address**|10.10.10.10| This value is the IP address that the 'A' record resolves to. This is just a test value for this quickstart. For a real-world example, you would enter the public IP address for your web server.|


Since in this quickstart you don't actually purchase a real domain name, there is no need to configure Azure DNS as the name server with your domain name registrar. But in a real-world scenario, you would want anyone on the Internet to be able to resolve your host name to connect to your web server or app. For more information about that real-world scenario, see [Delegate a domain to Azure DNS](dns-delegate-domain-azure-dns.md).


## Test the name resolution

Now that you have a test zone, with a test 'A' record in it, you can test the name resolution with a tool called *nslookup*. 

1. First, you need to note the Azure DNS name servers to use with nslookup. 

   The name servers for your zone are listed on the DNS zone **Overview** page. Copy the name of one of the name servers:

   ![zone](./media/dns-getstarted-portal/viewzonens500.png)

2. Now, open a command prompt and run the following command:

   ```
   nslookup <host name> <name server>
   
   For example:

   nslookup www.contoso.xyz ns1-08.azure-dns.com
   ```

You should see something like to the following screenshot:

![nslookup](media/dns-getstarted-portal/nslookup.PNG)

This verifies that name resolution is working correctly. www.contoso.xyz resolves to 10.10.10.10, just as you configured it!

## Clean up resources

When no longer needed, delete the **dns-test** resource group to delete the resources created in this quickstart. To do so, click the **dns-test** resource group and then click **Delete resource group**.


## Next steps

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)