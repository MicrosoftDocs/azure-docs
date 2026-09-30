---
title: 'Tutorial: Create Custom Azure DNS Records For a Web App'
description: Learn to create custom DNS records in Azure DNS for web apps. Configure A, TXT, and CNAME records to enable custom domains. Includes PowerShell, CLI, and portal steps.
services: dns
author: asudbring
ms.service: azure-dns
ms.topic: tutorial
ms.date: 08/04/2025
ms.author: allensu 
ms.custom:
  - devx-track-azurepowershell
  - sfi-image-nochange
#Customer intent: As an experienced network administrator, I want to create DNS records in Azure DNS, so I can host a web app in a custom domain.
# Customer intent: "As a network administrator, I want to create custom DNS records in Azure DNS for my web app, so that I can allow users to access it via a personalized domain name."
---

# Create DNS records in a custom domain for a web app 

Configure Azure DNS to host custom domains for your web apps and enable users to access them via personalized domain names. You can create Azure DNS records that allow users to access your web app using either `www.contoso.com` or `contoso.com` as a fully qualified domain name (FQDN).

To add a custom domain to your web app, you have to create three records:

* A root **`A`** record pointing to contoso.com
* A root **`TXT`** record for verification
* A **`CNAME`** record for the www name that points to the A record

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an A and TXT record for your custom domain
> * Create a CNAME record for your custom domain
> * Test the new records
> * Add custom host names to your web app
> * Test the custom host names

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

* A domain name that you can host in Azure DNS. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

* A web app. If you don't have one, you can [create a web app](/azure/app-service/quickstart-dotnetcore?tabs=net80&pivots=development-environment-azure-portal) for this tutorial.

* An Azure DNS zone with delegation in your registrar to Azure DNS. If you don't have one, you can [create a DNS zone](./dns-getstarted-powershell.md), then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

### [Portal](#tab/azure-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

### [PowerShell](#tab/azure-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this tutorial run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

---

## Create the A record

An A record is used to map a name to its IP address. In the following example, assign "\@" as an A record using your web app IPv4 address. \@ typically represents the root domain.

### Get the IPv4 address of your web app

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **App Services**, and select it from the results.

1. Select your web app from the list.

1. In the left navigation of the App Services page in the Azure portal, expand **Settings**, then select **Custom domains**, then copy the IP address of your web app:

:::image type="content" source="./media/dns-web-sites-custom-domain/app-service-custom-domains.png" alt-text="Screenshot of Azure App Service Custom domains page showing the web app IP address.":::

# [PowerShell](#tab/azure-powershell)

To get the IP address of your web app, use:

```azurepowershell
$params = @{
    ResourceGroupName = "<your web app resource group>"
    Name = "contoso"
}
$webapp = Get-AzWebApp @params
($webapp.OutboundIpAddresses -split ',')[0].Trim()
```

# [Azure CLI](#tab/azure-cli)

To get the IP address of your web app, use:

```azurecli
# Get the inbound IP address
az webapp show \
    --resource-group "test-rg" \
    --name "web-app" \
    --query "outboundIpAddresses" \
    --output tsv | cut -d',' -f2
```

---

### Create the A record

# [Portal](#tab/azure-portal)

1. In the search box at the top of the portal, enter **DNS zones**, and select it from the results.

1. Select your DNS zone from the list.

1. Select **+ Record sets** at the top of the **Overview** page of your DNS zone.

1. Select **+ Add**.

1. On the **Add record set** page, enter the following information:

   | Setting | Value |
   |---------|-------|
   | **Name** | **@** (represents the root domain) |
   | **Type** | **A** |
   | **TTL** | **600** |
   | **TTL unit** | **Seconds** |
   | **IP address** | Enter the IP address of your web app (copied from the previous step) |

1. Select **Add** to create the record.

# [PowerShell](#tab/azure-powershell)

To create the A record, use:

```azurepowershell
$recordParams = @{
    Name = "@"
    RecordType = "A"
    ZoneName = "contoso.com"
    ResourceGroupName = "test-rg"
    Ttl = 600
    DnsRecords = (New-AzDnsRecordConfig -IPv4Address "<ip of web app service>")
}
New-AzDnsRecordSet @recordParams
```

# [Azure CLI](#tab/azure-cli)

To create the A record, use:

```azurecli
# Create the A record set
az network dns record-set a create \
    --resource-group test-rg \
    --zone-name contoso.com \
    --name "@" \
    --ttl 600

# Add the IP address to the A record set
az network dns record-set a add-record \
    --resource-group test-rg \
    --zone-name contoso.com \
    --record-set-name "@" \
    --ipv4-address "<ip of web app service>"
```

---

> [!IMPORTANT]
> The A record must be manually updated if the underlying IP address for the web app changes.

## Create the TXT record

App Services uses this record only at configuration time to verify that you own the custom domain. You can delete this TXT record after your custom domain is validated and configured in App Service.

> [!NOTE]
> If you want to verify the domain name, but not route production traffic to the web app, you only need to specify the TXT record for the verification step. Verification doesn't require an A or CNAME record in addition to the TXT record.

# [Portal](#tab/azure-portal)

1. In the search box at the top of the portal, enter **DNS zones**, and select it from the results.

1. Select your DNS zone from the list.

1. Select **+ Record sets** at the top of the **Overview** page of your DNS zone.

1. Select **+ Add**.

1. On the **Add record set** page, enter the following information:

   | Setting | Value |
   |---------|-------|
   | **Name** | **@** (represents the root domain) |
   | **Type** | **TXT** |
   | **TTL** | **600** |
   | **TTL unit** | **Seconds** |
   | **Value** | Enter your web app's default domain name (for example, **contoso.azurewebsites.net**) |

1. Select **Add** to create the record.

# [PowerShell](#tab/azure-powershell)

To create the TXT record, use:

```azurepowershell
$txtRecordParams = @{
    ZoneName = "contoso.com"
    ResourceGroupName = "test-rg"
    Name = "@"
    RecordType = "txt"
    Ttl = 600
    DnsRecords = (New-AzDnsRecordConfig -Value "contoso.azurewebsites.net")
}
New-AzDnsRecordSet @txtRecordParams
```

# [Azure CLI](#tab/azure-cli)

To create the TXT record, use:

```azurecli
az network dns record-set txt add-record \
    --resource-group test-rg \
    --zone-name contoso.com \
    --record-set-name "@" \
    --value "contoso.azurewebsites.net"
```

---

## Create the CNAME record

You can create a CNAME record for contoso.azurewebsites.net if Azure DNS already manages your domain (see [DNS domain delegation](dns-domain-delegation.md)). This example creates a CNAME record with a "time to live" of 600 seconds in the DNS zone named "contoso.com" and sets the alias to contoso.azurewebsites.net.

# [Portal](#tab/azure-portal)

1. In the search box at the top of the portal, enter **DNS zones**, and select it from the results.

1. Select your DNS zone from the list.

1. Select **+ Record sets** at the top of the **Overview** page of your DNS zone.

1. Select **+ Add**.

1. On the **Add record set** page, enter the following information:

   | Setting | Value |
   |---------|-------|
   | **Name** | **www** |
   | **Type** | **CNAME** |
   | **TTL** | **600** |
   | **TTL unit** | **Seconds** |
   | **Alias** | Enter your web app's default domain name (for example, **contoso.azurewebsites.net**) |

1. Select **Add** to create the record.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$cnameRecordParams = @{
    ZoneName = "contoso.com"
    ResourceGroupName = "test-rg"
    Name = "www"
    RecordType = "CNAME"
    Ttl = 600
    DnsRecords = (New-AzDnsRecordConfig -cname "contoso.azurewebsites.net")
}
New-AzDnsRecordSet @cnameRecordParams
```

# [Azure CLI](#tab/azure-cli)

```azurecli
# Create the CNAME record
az network dns record-set cname set-record \
    --resource-group test-rg \
    --zone-name contoso.com \
    --record-set-name "www" \
    --cname "contoso.azurewebsites.net" \
    --ttl 600
```

---

## Test the new records

You can validate that you created the records correctly by querying "www.contoso.com" and "contoso.com" using nslookup, as shown in the following example:

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

Add the custom host names to your web app:

# [Portal](#tab/azure-portal)

1. In the search box at the top of the portal, enter **App Services**, and select it from the results.

1. Select your web app from the list.

1. Expand **Settings** in the left navigation, then select **Custom domains**.

1. Select **+ Add custom domain**.

1. In **+ Add custom domain** dialog, enter the following information:

    | Setting | Value |
    |---------|-------|
    | Domain provider | Select **All other services** |
    | TLS/SSL certificate | Select **None** (you can add an TLS/SSL certificate later) |
    | TLS/SSL type | Select **SNI SSL** |
    | Domain | Enter your domain name (for example, **contoso.com**) |

    The domain validation sees the records you created in the previous steps.

1. Select **Validate**. Azure validates that the DNS records you created are properly configured.

1. Select **Add**.

1. The domain you added is now listed in the **Custom domains** section.

1. Repeat steps 3-8 for each custom domain you want to add (both **contoso.com** and **www.contoso.com**).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$webAppParams = @{
    Name = "contoso"
    ResourceGroupName = "<your web app resource group>"
    HostNames = @("contoso.com","www.contoso.com","contoso.azurewebsites.net")
}
Set-AzWebApp @webAppParams
```

# [Azure CLI](#tab/azure-cli)

```azurecli
# Add contoso.com
az webapp config hostname add \
    --webapp-name contoso \
    --resource-group <your web app resource group> \
    --hostname contoso.com

# Add www.contoso.com
az webapp config hostname add \
    --webapp-name contoso \
    --resource-group <your web app resource group> \
    --hostname www.contoso.com
```

---
## Test the custom host names

Open a browser and browse to `http://www.<your domain name>` and `http://<your domain name>`.

> [!NOTE]
> Make sure you include the `http://` prefix. Your browser might attempt to predict a URL for you.

You should see the same page for both URLs. For example:

:::image type="content" source="./media/dns-web-sites-custom-domain/contoso-web-app.png" alt-text="Screenshot of the contoso Azure App Service Web App accessed via web browser.":::

---

## Next steps

In this tutorial, you learned how to create DNS records in a custom domain for a web app. To learn how to create alias records to reference zone records, continue with the next tutorial:

> [!div class="nextstepaction"]
> [Create alias records for zone records](tutorial-alias-rr.md)
