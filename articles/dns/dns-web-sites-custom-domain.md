---
title: 'Tutorial: Create custom Azure DNS records for a web app'
description: In this tutorial, you learn how to create custom domain DNS records for web apps using Azure DNS.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: tutorial
ms.date: 09/27/2022
ms.author: greglin 
ms.custom: devx-track-azurepowershell
#Customer intent: As an experienced network administrator, I want to create DNS records in Azure DNS, so I can host a web app in a custom domain.
---

# Tutorial: Create DNS records in a custom domain for a web app 

You can configure Azure DNS to host a custom domain for your web apps. For example, you can create an Azure web app and have your users access it using either `www.contoso.com` or `contoso.com` as a fully qualified domain name (FQDN).

To do this, you have to create three records:

* A root "A" record pointing to contoso.com
* A root "TXT" record for verification
* A "CNAME" record for the www name that points to the A record


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an A and TXT record for your custom domain
> * Create a CNAME record for your custom domain
> * Test the new records
> * Add custom host names to your web app
> * Test the custom host names

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure account with an active subscription.

* A domain name that you can host in Azure DNS. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

* A web app. If you don't have one, you can [create a static HTML web app](../app-service/quickstart-html.md) for this tutorial.

* An Azure DNS zone with delegation in your registrar to Azure DNS. If you don't have one, you can [create a DNS zone](./dns-getstarted-powershell.md), then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the A record

An A record is used to map a name to its IP address. In the following example, assign "\@" as an A record using your web app IPv4 address. \@ typically represents the root domain.

### Get the IPv4 address

In the left navigation of the App Services page in the Azure portal, select **Custom domains**, then copy the IP address of your web app:

:::image type="content" source="./media/dns-web-sites-custom-domain/app-service-custom-domains.png" alt-text="Screenshot of Azure App Service Custom domains page showing the web app I P address.":::

### Create the record

To create the A record, use:

```azurepowershell
New-AzDnsRecordSet -Name "@" -RecordType "A" -ZoneName "contoso.com" `
 -ResourceGroupName "MyAzureResourceGroup" -Ttl 600 `
 -DnsRecords (New-AzDnsRecordConfig -IPv4Address "<ip of web app service>")
```

> [!IMPORTANT]
> The A record must be manually updated if the underlying IP address for the web app changes.

## Create the TXT record

App Services uses this record only at configuration time to verify that you own the custom domain. You can delete this TXT record after your custom domain is validated and configured in App Service.

> [!NOTE]
> If you want to verify the domain name, but not route production traffic to the web app, you only need to specify the TXT record for the verification step.  Verification does not require an A or CNAME record in addition to the TXT record.

To create the TXT record, use:

```azurepowershell
New-AzDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup `
 -Name "@" -RecordType "txt" -Ttl 600 `
 -DnsRecords (New-AzDnsRecordConfig -Value  "contoso.azurewebsites.net")
```

## Create the CNAME record

If your domain is already managed by Azure DNS (see [DNS domain delegation](dns-domain-delegation.md)), you can use the following example to create a CNAME record for contoso.azurewebsites.net. The CNAME created in this example has a "time to live" of 600 seconds in DNS zone named "contoso.com" with the alias for the web app contoso.azurewebsites.net.

```azurepowershell
New-AzDnsRecordSet -ZoneName contoso.com -ResourceGroupName "MyAzureResourceGroup" `
 -Name "www" -RecordType "CNAME" -Ttl 600 `
 -DnsRecords (New-AzDnsRecordConfig -cname "contoso.azurewebsites.net")
```

The following example is the response:

```
    Name              : www
    ZoneName          : contoso.com
    ResourceGroupName : myazureresourcegroup
    Ttl               : 600
    Etag              : 8baceeb9-4c2c-4608-a22c-229923ee185
    RecordType        : CNAME
    Records           : {contoso.azurewebsites.net}
    Tags              : {}
```

## Test the new records

You can validate the records were created correctly by querying the "www.contoso.com"  and "contoso.com" using nslookup, as shown below:

```
PS C:\> nslookup
Default Server:  Default
Address:  192.168.0.1

> www.contoso.com
Server:  default server
Address:  192.168.0.1

Non-authoritative answer:
Name:    <instance of web app service>.cloudapp.net
Address:  <ip of web app service>
Aliases:  www.contoso.com
contoso.azurewebsites.net
<instance of web app service>.vip.azurewebsites.windows.net

> contoso.com
Server:  default server
Address:  192.168.0.1

Non-authoritative answer:
Name:    contoso.com
Address:  <ip of web app service>

> set type=txt
> contoso.com

Server:  default server
Address:  192.168.0.1

Non-authoritative answer:
contoso.com text =

        "contoso.azurewebsites.net"
```
## Add custom host names

Now, you can add the custom host names to your web app:

```azurepowershell
set-AzWebApp `
 -Name contoso `
 -ResourceGroupName <your web app resource group> `
 -HostNames @("contoso.com","www.contoso.com","contoso.azurewebsites.net")
```
## Test the custom host names

Open a browser and browse to `http://www.<your domain name>` and `http://<you domain name>`.

> [!NOTE]
> Make sure you include the `http://` prefix, otherwise your browser may attempt to predict a URL for you!

You should see the same page for both URLs. For example:

:::image type="content" source="./media/dns-web-sites-custom-domain/contoso-web-app.png" alt-text="Screenshot of the contoso Azure App Service Web App accessed via web browser.":::

## Clean up resources

When no longer needed, you can delete all resources created in this tutorial by deleting the resource group **MyAzureResourceGroup**:

1. On the Azure portal menu, select **Resource groups**.
2. Select the **MyAzureResourceGroup** resource group.
3. On the **Overview** page, select **Delete resource group**.
4. Enter *MyAzureResourceGroup* and select **Delete**.

## Next steps

In this tutorial, you learned how to create DNS records in a custom domain for a web app. To learn how to create alias records to reference zone records, continue with the next tutorial:

> [!div class="nextstepaction"]
> [Create alias records for zone records](tutorial-alias-rr.md)
