---
title: Configure an IP firewall
titleSuffix: Azure AI Search
description: Configure IP control policies to restrict access to your Azure AI Search service to specific IP addresses.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/11/2024
---

# Configure an IP firewall for Azure AI Search

Azure AI Search supports IP rules for inbound access through a firewall, similar to the IP rules found in an Azure virtual network security group. By applying IP rules, you can restrict service access to an approved set of devices and cloud services. An IP rule only allows the request through. Access to data and operations will still require the caller to present a valid authorization token.

You can set IP rules in the Azure portal, as described in this article, or use the [Management REST API](/rest/api/searchmanagement/), [Azure PowerShell](/powershell/module/az.search), or [Azure CLI](/cli/azure/search).

> [!NOTE]
> To access a search service protected by an IP firewall through the portal, [allow access from a specific client and the portal IP address](#allow-access-from-your-client-and-portal-ip).

## Prerequisites

+ A search service at the Basic tier or higher

<a id="configure-ip-policy"></a> 

## Set IP ranges in Azure portal

1. Sign in to Azure portal and go to your Azure AI Search service page.

1. Select **Networking** on the left navigation pane. 

1. Set **Public Network Access** to **Selected Networks**. If your connectivity is set to **Disabled**, you can only access your search service via a [private endpoint](service-create-private-endpoint.md).

   :::image type="content" source="media/service-configure-firewall/azure-portal-firewall.png" alt-text="Screenshot showing how to configure the IP firewall in the Azure portal." border="true":::

   The Azure portal supports IP addresses and IP address ranges in the CIDR format. An example of CIDR notation is 8.8.8.0/24, which represents the IPs that range from 8.8.8.0 to 8.8.8.255.

1. Select **Add your client IP address** under **Firewall** to create an inbound rule for the IP address of your system.

1. Add other client IP addresses for other machines, devices, and services that will send requests to a search service.

After you enable the IP access control policy for your Azure AI Search service, all requests to the data plane from machines outside the allowed list of IP address ranges are rejected. 

### Rejected requests

When requests originate from IP addresses that aren't in the allowed list, a generic **403 Forbidden** response is returned with no other details.

<a id="allow-access-from-your-client-and-portal-ip"></a>

## Allow access from the Azure portal IP address

When IP rules are configured, some features of the Azure portal are disabled. You can view and manage service level information, but portal access to indexes, indexers, and other top-level resources is restricted. You can restore portal access to the full range of search service operations by allowing access from the portal IP address and your client IP address.

To get the portal's IP address, perform `nslookup` (or `ping`) on `stamp2.ext.search.windows.net`, which is the domain of the traffic manager. For nslookup, the IP address is visible in the "Non-authoritative answer" portion of the response.

In the following example, the IP address that you should copy is `52.252.175.48`.

```bash
$ nslookup stamp2.ext.search.windows.net
Server:  ZenWiFi_ET8-0410
Address:  192.168.50.1

Non-authoritative answer:
Name:    azsyrie.northcentralus.cloudapp.azure.com
Address:  52.252.175.48
Aliases:  stamp2.ext.search.windows.net
          azs-ux-prod.trafficmanager.net
          azspncuux.management.search.windows.net
```

When services run in different regions, they connect to different traffic managers. Regardless of the domain name, the IP address returned from the ping is the correct one to use when defining an inbound firewall rule for the Azure portal in your region.

For ping, the request will time out, but the IP address is visible in the response. For example, in the message `"Pinging azsyrie.northcentralus.cloudapp.azure.com [52.252.175.48]"`, the IP address is `52.252.175.48`.

Providing IP addresses for clients ensures that the request isn't rejected outright, but for successful access to content and operations, authorization is also necessary. Use one of the following methodologies to authenticate your request:

+ [Key-based authentication](search-security-api-keys.md), where an admin or query API key is provided on the request
+ [Role-based authorization](search-security-rbac.md), where the caller is a member of a security role on a search service, and the [registered app presents an OAuth token](search-howto-aad.md) from Microsoft Entra ID.

## Next steps

If your client application is a static Web app on Azure, learn how to determine its IP range for inclusion in a search service IP firewall rule.

> [!div class="nextstepaction"]
> [Inbound and outbound IP addresses in Azure App Service](../app-service/overview-inbound-outbound-ips.md)
