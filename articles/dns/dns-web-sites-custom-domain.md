---
title: 'Tutorial: Create custom Azure DNS records for a web app'
description: In this tutorial, you learn how to create custom domain DNS records for web apps using Azure DNS.
services: dns
author: asudbring
ms.service: azure-dns
ms.topic: tutorial
ms.date: 08/03/2025
ms.author: allensu 
ms.custom: devx-track-azurepowershell
#Customer intent: As an experienced network administrator, I want to create DNS records in Azure DNS, so I can host a web app in a custom domain.
# Customer intent: "As a network administrator, I want to create custom DNS records in Azure DNS for my web app, so that I can allow users to access it via a personalized domain name."
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

### [Portal](#tab/azure-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A domain name that you can host in Azure DNS. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

- A web app. If you don't have one, you can [create a static HTML web app](../app-service/quickstart-html.md) for this tutorial.

- An Azure DNS zone with delegation in your registrar to Azure DNS. If you don't have one, you can create a DNS zone, then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

### [PowerShell](#tab/azure-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A domain name that you can host in Azure DNS. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

- A web app. If you don't have one, you can [create a static HTML web app](../app-service/quickstart-html.md) for this tutorial.

- An Azure DNS zone with delegation in your registrar to Azure DNS. If you don't have one, you can create a DNS zone, then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

- Azure Cloud Shell or Azure PowerShell.

  The steps in this tutorial run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

- A domain name that you can host in Azure DNS. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

- A web app. If you don't have one, you can [create a static HTML web app](../app-service/quickstart-html.md) for this tutorial.

- An Azure DNS zone with delegation in your registrar to Azure DNS. If you don't have one, you can create a DNS zone, then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

---

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

## Create the A record

An A record is used to map a name to its IP address. In the following example, assign "\@" as an A record using your web app IPv4 address. \@ typically represents the root domain.

### Get the IPv4 address

# [Portal](#tab/azure-portal)

In the left navigation of the App Services page in the Azure portal, select **Custom domains**, then copy the IP address of your web app:

:::image type="content" source="./media/dns-web-sites-custom-domain/app-service-custom-domains.png" alt-text="Screenshot of Azure App Service Custom domains page showing the web app IP address.":::

# [PowerShell](#tab/azure-powershell)

To get the IP address of your web app, use:

```azurepowershell
$webAppParams = @{
    Name = "contoso"
    ResourceGroupName = "<your web app resource group>"
}
$webApp = Get-AzWebApp @webAppParams
$inboundIpAddress = $webApp.InboundIpAddress
Write-Output "Web app inbound IP address: $inboundIpAddress"
```

# [Azure CLI](#tab/azure-cli)

To get the IP address of your web app, use:

```azurecli
# Get the inbound IP address
az webapp show \
    --name contoso \
    --resource-group <your web app resource group> \
    --query "inboundIpAddress" \
    --output tsv
```

---

### Create the record

# [Portal](#tab/azure-portal)

1. Navigate to your DNS zone in the Azure portal.
1. Select **+ Record set**.
1. On the **Add record set** page, enter the following information:

   | Setting | Value |
   |---------|-------|
   | **Name** | **@** (represents the root domain) |
   | **Type** | **A** |
   | **TTL** | **600** |
   | **TTL unit** | **Seconds** |
   | **IP address** | Enter the IP address of your web app (copied from the previous step) |

1. Select **OK** to create the record.

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
> If you want to verify the domain name, but not route production traffic to the web app, you only need to specify the TXT record for the verification step.  Verification does not require an A or CNAME record in addition to the TXT record.

# [Portal](#tab/azure-portal)

1. Navigate to your DNS zone in the Azure portal.
1. Select **+ Record set**.
1. On the **Add record set** page, enter the following information:

   | Setting | Value |
   |---------|-------|
   | **Name** | **@** (represents the root domain) |
   | **Type** | **TXT** |
   | **TTL** | **600** |
   | **TTL unit** | **Seconds** |
   | **Value** | Enter your web app's default domain name (for example, **contoso.azurewebsites.net**) |

1. Select **OK** to create the record.

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

If your domain is already managed by Azure DNS (see [DNS domain delegation](dns-domain-delegation.md)), you can use the following example to create a CNAME record for contoso.azurewebsites.net. The CNAME created in this example has a "time to live" of 600 seconds in DNS zone named "contoso.com" with the alias for the web app contoso.azurewebsites.net.

# [Portal](#tab/azure-portal)

1. Navigate to your DNS zone in the Azure portal.
1. Select **+ Record set**.
1. On the **Add record set** page, enter the following information:

   | Setting | Value |
   |---------|-------|
   | **Name** | **www** |
   | **Type** | **CNAME** |
   | **TTL** | **600** |
   | **TTL unit** | **Seconds** |
   | **Alias** | Enter your web app's default domain name (for example, **contoso.azurewebsites.net**) |

1. Select **OK** to create the record.

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

# [Azure CLI](#tab/azure-cli)

```azurecli
# Create the CNAME record set
az network dns record-set cname create \
    --resource-group test-rg \
    --zone-name contoso.com \
    --name "www" \
    --ttl 600

# Add the CNAME record
az network dns record-set cname add-record \
    --resource-group test-rg \
    --zone-name contoso.com \
    --record-set-name "www" \
    --cname "contoso.azurewebsites.net"
```

---

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

# [Portal](#tab/azure-portal)

1. Navigate to your web app in the Azure portal.
1. In the left navigation under **Settings**, select **Custom domains**.
1. Select **+ Add custom domain**.
1. In the **Custom domain** field, enter your domain name (for example, **contoso.com** or **www.contoso.com**).
1. Select **Validate**. Azure will validate that the DNS records you created are properly configured.
1. If validation is successful, select **Add custom domain**.
1. Repeat steps 3-6 for each custom domain you want to add (both **contoso.com** and **www.contoso.com**).

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

Open a browser and browse to `http://www.<your domain name>` and `http://<you domain name>`.

> [!NOTE]
> Make sure you include the `http://` prefix, otherwise your browser may attempt to predict a URL for you!

You should see the same page for both URLs. For example:

:::image type="content" source="./media/dns-web-sites-custom-domain/contoso-web-app.png" alt-text="Screenshot of the contoso Azure App Service Web App accessed via web browser.":::

## Clean up resources

When no longer needed, you can delete all resources created in this tutorial by deleting the resource group **test-rg**:

# [Portal](#tab/azure-portal)

1. On the Azure portal menu, select **Resource groups**.
1. Select the **test-rg** resource group.
1. On the **Overview** page, select **Delete resource group**.
1. Enter *test-rg* and select **Delete**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$resourceGroupParams = @{
    Name = "test-rg"
    Force = $true
}
Remove-AzResourceGroup @resourceGroupParams
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name test-rg --yes --no-wait
```

---

## Next steps

In this tutorial, you learned how to create DNS records in a custom domain for a web app. To learn how to create alias records to reference zone records, continue with the next tutorial:

> [!div class="nextstepaction"]
> [Create alias records for zone records](tutorial-alias-rr.md)
