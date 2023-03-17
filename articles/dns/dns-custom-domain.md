---
title: Integrate Azure DNS with your Azure resources - Azure DNS
description: In this article, learn how to use Azure DNS along to provide DNS for your Azure resources.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 12/15/2022
ms.author: greglin
---

# Use Azure DNS to provide custom domain settings for an Azure service

Azure DNS provides naming resolution for any of your Azure resources that support custom domains or that have a fully qualified domain name (FQDN). For example, you have an Azure web app you want your users to access using `contoso.com` or `www.contoso.com` as the FQDN. This article walks you through configuring your Azure service with Azure DNS for using custom domains.

## Prerequisites

To use Azure DNS for your custom domain, you must first delegate your domain to Azure DNS. See [Delegate a domain to Azure DNS](./dns-delegate-domain-azure-dns.md) for instructions on how to configure your name servers for delegation. Once your domain is delegated to your Azure DNS zone, you now can configure your DNS records needed.

You can configure a vanity or custom domain for Azure Function Apps, Public IP addresses, App Service (Web Apps), Blob storage, and Azure CDN.

## Azure Function App

To configure a custom domain for Azure function apps, a CNAME record is created and configured on the function app itself.
 
1. Navigate to **Function App** and select your function app. Select **Custom domains** under *Settings*. Note the **current url** under *assigned custom domains*, this address is used as the alias for the DNS record created.

    :::image type="content" source="./media/dns-custom-domain/function-app.png" alt-text="Screenshot of custom domains for function app.":::

1. Navigate to your DNS Zone and select **+ Record set**. Enter the following information on the **Add record set** page and select **OK** to create it.

    :::image type="content" source="./media/dns-custom-domain/function-app-record.png" alt-text="Screenshot of function app add record set page.":::

    |Property  |Value  |Description  |
    |---------|---------|---------|
    | Name | myfunctionapp | This value along with the domain name label is the FQDN for the custom domain name. |
    | Type | CNAME | Use a CNAME record is using an alias. |
    | TTL | 1 | 1 is used for 1 hour  |
    | TTL unit | Hours | Hours are used as the time measurement  |
    | Alias | contosofunction.azurewebsites.net | The DNS name you're creating the alias for, in this example it's the contosofunction.azurewebsites.net DNS name provided by default to the function app.        |
    
1. Navigate back to your function app, select **Custom domains** under *Settings*. Then select **+ Add custom domain**.

    :::image type="content" source="./media/dns-custom-domain/function-app-add-domain.png" alt-text="Screenshot of add custom domain button for function app.":::    

1. On the **Add custom domain** page, enter the CNAME record in the **Custom domain** text field and select **Validate**. If the record is found, the **Add custom domain** button appears. Select **Add custom domain** to add the alias.

    :::image type="content" source="./media/dns-custom-domain/function-app-cname.png" alt-text="Screenshot of add custom domain page for function app.":::

## Public IP address

To configure a custom domain for services that use a public IP address resource such as Application Gateway, Load Balancer, Cloud Service, Resource Manager VMs, and, Classic VMs, an A record is used.

1. Navigate to the Public IP resource and select **Configuration**. Note the IP address shown.

    :::image type="content" source="./media/dns-custom-domain/public-ip.png" alt-text="Screenshot of public ip configuration page.":::

1. Navigate to your DNS Zone and select **+ Record set**. Enter the following information on the **Add record set** page and select **OK** to create it.

    :::image type="content" source="./media/dns-custom-domain/public-ip-record.png" alt-text="Screenshot of public ip record set page.":::

    | Property | Value | Description |
    | -------- | ----- | ------------|
    | Name | webserver1 | This value along with the domain name label is the FQDN for the custom domain name. |
    | Type | A | Use an A record as the resource is an IP address. |
    | TTL | 1 | 1 is used for 1 hour |
    | TTL unit | Hours | Hours are used as the time measurement |
    | IP Address | `<your ip address>` | The public IP address. |

1. Once the A record is created, run `nslookup` to validate the record resolves.

    :::image type="content" source="./media/dns-custom-domain/public-ip-nslookup.png" alt-text="Screenshot of nslookup in cmd for public ip.":::

## App Service (Web Apps)

The following steps take you through configuring a custom domain for an app service web app.

1. Navigate to **App Service** and select the resource you're configuring a custom domain name, and select **Custom domains** under *Settings*. Note the **current url** under *assigned custom domains*, this address is used as the alias for the DNS record created.

    :::image type="content" source="./media/dns-custom-domain/web-app.png" alt-text="Screenshot of custom domains for web app.":::

1. Navigate to your DNS Zone and select **+ Record set**. Enter the following information on the **Add record set** page and select **OK** to create it.

    :::image type="content" source="./media/dns-custom-domain/web-app-record.png" alt-text="Screenshot of web app record set page.":::

    | Property  | Value | Description |
    |---------- | ----- | ----------- |
    | Name | mywebserver | This value along with the domain name label is the FQDN for the custom domain name. |
    | Type | CNAME | Use a CNAME record is using an alias. If the resource used an IP address, an A record would be used. |
    | TTL | 1 | 1 is used for 1 hour |
    | TTL unit | Hours | Hours are used as the time measurement |
    | Alias | contoso.azurewebsites.net | The DNS name you're creating the alias for, in this example it's the contoso.azurewebsites.net DNS name provided by default to the web app. |

1. Navigate back to your web app, select **Custom domains** under *Settings*. Then select **+ Add custom domain**.

    :::image type="content" source="./media/dns-custom-domain/web-app-add-domain.png" alt-text="Screenshot of add custom domain button for web app.":::  

1. On the **Add custom domain** page, enter the CNAME record in the **Custom domain** text field and select **Validate**. If the record is found, the **Add custom domain** button appears. Select **Add custom domain** to add the alias.

    :::image type="content" source="./media/dns-custom-domain/web-app-cname.png" alt-text="Screenshot of add custom domain page for web app.":::

1. Once the process is complete, run **nslookup** to validate name resolution is working.

    :::image type="content" source="./media/dns-custom-domain/app-service-nslookup.png" alt-text="Screenshot of nslookup for web app."::: 

To learn more about mapping a custom domain to App Service, visit [map an existing custom DNS name to Azure Web Apps](../app-service/app-service-web-tutorial-custom-domain.md).

To learn how to migrate an active DNS name, see [migrate an active DNS name to Azure App Service](../app-service/manage-custom-dns-migrate-domain.md).

If you need to purchase a custom domain for your App Service, see [buy a custom domain name for Azure Web Apps](../app-service/manage-custom-dns-buy-domain.md).

## Blob storage

The following steps take you through configuring a CNAME record for a blob storage account using the asverify method. This method ensures there's no downtime.

1. Navigate to **Storage Accounts**, select your storage account, and select **Networking** under *Settings*. Then select the **Custom domain** tab. Note the FQDN in step 2, this name is used to create the first CNAME record.

    :::image type="content" source="./media/dns-custom-domain/blob-storage.png" alt-text="Screenshot of custom domains for storage account.":::

1. Navigate to your DNS Zone and select **+ Record set**. Enter the following information on the **Add record set** page and select **OK** to create it.

    :::image type="content" source="./media/dns-custom-domain/storage-account-record.png" alt-text="Screenshot of storage account record set page.":::

    | Property | Value | Description |
    | -------- | ----- | ----------- |
    | Name | asverify.mystorageaccount | This value along with the domain name label is the FQDN for the custom domain name. |
    | Type | CNAME | Use a CNAME record is using an alias. |
    | TTL | 1 | 1 is used for 1 hour |
    | TTL unit | Hours | Hours are used as the time measurement |
    | Alias | asverify.contoso.blob.core.windows.net | The DNS name you're creating the alias for, in this example it's the asverify.contoso.blob.core.windows.net DNS name provided by default to the storage account. |

1. Navigate back to your storage account and select **Networking** and then the **Custom domain** tab. Type in the alias you created without the asverify prefix in the text box, check **Use indirect CNAME validation**, and select **Save**. 

    :::image type="content" source="./media/dns-custom-domain/blob-storage-add-domain.png" alt-text="Screenshot of storage account add custom domain page.":::

1. Return to your DNS zone and create a CNAME record without the asverify prefix.  After that point, you're safe to delete the CNAME record with the asverify prefix.

    :::image type="content" source="./media/dns-custom-domain/storage-account-record-set.png" alt-text="Screenshot of storage account record without asverify prefix.":::

1. Validate DNS resolution by running `nslookup`.

To learn more about mapping a custom domain to a blob storage endpoint visit [Configure a custom domain name for your Blob storage endpoint](../storage/blobs/storage-custom-domain-name.md)

## Azure CDN

The following steps take you through configuring a CNAME record for a CDN endpoint using the cdnverify method. This method ensures there's no downtime.

1. Navigate to your CDN profile and select the endpoint you're working with. Select **+ Custom domain**. Note the **Endpoint hostname** as this value is the record that the CNAME record points to.

    :::image type="content" source="./media/dns-custom-domain/cdn.png" alt-text="Screenshot of CDN custom domain page.":::

1. Navigate to your DNS Zone and select **+ Record set**. Enter the following information on the **Add record set** page and select **OK** to create it.

    :::image type="content" source="./media/dns-custom-domain/cdn-record.png" alt-text="Screenshot of CDN record set page.":::

    | Property | Value | Description |
    | -------- | ----- | ----------- |
    | Name | cdnverify.mycdnendpoint | This value along with the domain name label is the FQDN for the custom domain name. |
    | Type | CNAME | Use a CNAME record is using an alias. |
    | TTL | 1 | 1 is used for 1 hour |
    | TTL unit | Hours | Hours are used as the time measurement |
    | Alias | cdnverify.contoso.azureedge.net | The DNS name you're creating the alias for, in this example it's the cdnverify.contoso.azureedge.net DNS name provided by default to the CDN endpoint. |

1. Navigate back to your CDN endpoint  and select **+ Custom domain**. Enter your CNAME record alias without the cdnverify prefix and select **Add**.

    :::image type="content" source="./media/dns-custom-domain/cdn-add.png" alt-text="Screenshot of add a custom domain page for a CDN endpoint.":::

1. Return to your DNS zone and create a CNAME record without the cdnverify prefix.  After that point, you're safe to delete the CNAME record with the cdnverify prefix.

    :::image type="content" source="./media/dns-custom-domain/cdn-record-set.png" alt-text="Screenshot of CDN record without cdnverify prefix.":::

For more information on CDN and how to configure a custom domain without the intermediate registration step visit [Map Azure CDN content to a custom domain](../cdn/cdn-map-content-to-custom-domain.md).

## Next steps

Learn how to [configure reverse DNS for services hosted in Azure](dns-reverse-dns-for-azure-services.md).
