---
title: Integrate Azure DNS into your custom domain for Azure resources | Microsoft Docs
description: Learn how to use Azure DNS along with a custom domain to provide DNS for your service.
services: dns
documentationcenter: na
author: georgewallace
manager: timlt

ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/07/2017
ms.author: gwallace
---

# Use Azure DNS when setting your custom domain settings for an Azure service

You can use Azure DNS to provide DNS for a custom domain for any of your Azure resources that support custom domains. For example, you are creating an Azure web app and you want your users to access it by either using contoso.com, or www.contoso.com as an FQDN.

## Prerequisites

In order to use Azure DNS for your custom domain, you must first delegate your domain to Azure DNS. Visit [Delegate a domain to Azure DNS](./dns-delegate-domain-azure-dns.md) for instructions on how to configure your name servers for delegation. Once your domain is delegated to your Azure DNS zone, you are able to configure the DNS records needed.

The following resources allow for custom domains:

* Azure Active Directory
* App Service (Web Apps)
* Azure CDN
* Blob storage
* Azure Functions
* Azure IOT
* Public IP address

## Public IP addresses

Navigate to the Public IP resource and click **Configuration**

![public ip blade](./media/dns-custom-domain/publicip.png)

Navigate to your DNS Zone and click **+ Record set**. Fill out the following information on the **Add record set** blade and click **OK** to create it.


|Property  |Value  |Description  |
|---------|---------|---------|
|Name     | mywebserver        | This along with the domain name label is the FQDN for the custom domain name.        |
|Type     | A        | Use an A record as the resource is an IP address.        |
|TTL     | 1        | 1 is used for 1 hour        |
|TTL unit     | Hours        | Hours is used as the time measurement         |
|IP Address     | <your ip address>       | The public IP address .|

![create an a record](./media/dns-custom-domain/arecord.png)

Once the A record is created, run `nslookup` to validate the record resolves.

![public ip dns lookup](./media/dns-custom-domain/publicipnslookup.png)
## Custom domains

For the other resources a CNAME record is created to alias the DNS name.  The follow steps take you through configuring a custom domain for an Azure resource.

## Retrieve the DNS name to alias

Navigate to the resource you are configuring a custom domain name for and click **Custom domains**.

Note the current url on the **Custom domains** blade, this address will be used as the alias for the DNS record created.

![custom domains blade](./media/dns-custom-domain/url.png)

### Create the CNAME record

Navigate to your DNS Zone and click **+ Record set**. Fill out the following information on the **Add record set** blade and click **OK** to create it.


|Property  |Value  |Description  |
|---------|---------|---------|
|Name     | mywebserver        | This along with the domain name label is the FQDN for the custom domain name.        |
|Type     | CNAME        | Use a CNAME record is using an alias. An A record would be used if the resource used an IP address.        |
|TTL     | 1        | 1 is used for 1 hour        |
|TTL unit     | Hours        | Hours is used as the time measurement         |
|Alias     | webserver.azurewebsites.net        | The DNS name you are creating the alias for, in this example its the webserver.azurewebsites.net DNS name provided by default to the web app.        |

Choose a type of **CNAME** and put the address you found in the previous step on your resource and put it in the **Alias** text box.

![create cname record](./media/dns-custom-domain/createcnamerecord.png)

### Configure and validate the CNAME record

Navigate back to your resource that will be configured for the custom domain name and click **Custom domains**, then click **Hostnames**. To add the CNAME record you just created click **+ Add hostname**.

![figure 1](./media/dns-custom-domain/figure1.png)

Once the process is complete, run **nslookup** to validate name resolution is working.

![figure 1](./media/dns-custom-domain/finalnslookup.png)

## Next steps

TODO