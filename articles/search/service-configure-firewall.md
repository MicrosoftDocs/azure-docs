---
title: Configure an IP firewall
titleSuffix: Azure Cognitive Search
description: Configure IP control policies to restrict access to your Azure Cognitive Search service to specific IP addresses.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/19/2021
---

# Configure an IP firewall for Azure Cognitive Search

Azure Cognitive Search supports IP rules for inbound access through a firewall, similar to the IP rules you'll find in an Azure virtual network security group. By leveraging IP rules, you can restrict search service access to an approved set of machines and cloud services. Access to data stored in your search service from the approved sets of machines and services will still require the caller to present a valid authorization token.

You can set IP rules in the Azure portal, as described in this article, on search services provisioned at the Basic tier and above. Alternatively, you can use the [Management REST API version 2020-03-13](/rest/api/searchmanagement/), [Azure PowerShell](/powershell/module/az.search), or [Azure CLI](/cli/azure/search).

> [!NOTE]
> To access a search service protected by an IP firewall through the portal, [allow access from a specific client and the portal IP address](#allow-access-from-your-client-and-portal-ip).

<a id="configure-ip-policy"></a> 

## Set IP ranges in Azure portal

To set the IP access control policy in the Azure portal, go to your Azure Cognitive Search service page and select **Networking** on the left navigation pane. Set **Public Network Access** to **Selected Networks**. If your connectivity is set to **Disabled**, you can only access your search service via a private endpoint.

:::image type="content" source="media/service-configure-firewall/azure-portal-firewall.png" alt-text="Screenshot showing how to configure the IP firewall in the Azure portal" border="true":::

The Azure portal provides the ability to specify IP addresses and IP address ranges in the CIDR format. An example of CIDR notation is 8.8.8.0/24, which represents the IPs that range from 8.8.8.0 to 8.8.8.255.

After you enable the IP access control policy for your Azure Cognitive Search service, all requests to the data plane from machines outside the allowed list of IP address ranges are rejected. 

<a id="allow-access-from-your-client-and-portal-ip"></a>

## Azure portal

When IP rules are configured, some features of the Azure portal are disabled. You'll be able to view and manage service level information, but portal access to indexes, indexers, and other top-level resources is restricted. You can restore portal access to the full range of search service operations by allowing access from the portal IP address and your client IP address, as described in the next section.

## Allow access from your client IP address

Add your client IP address to allow access to the service from the portal on your current computer. Navigate to the **Networking** section on the left navigation pane. Change **Public Network Access** to **Selected networks**, and then check **Add your client IP address** under **Firewall**.

   :::image type="content" source="media\service-configure-firewall\azure-portal-firewall.png" alt-text="Screenshot of adding client ip to search service firewall" border="true":::

## Allow access from the Azure portal IP address

To get the portal's IP address, perform `nslookup` (or `ping`) on `stamp2.ext.search.windows.net`, which is the domain of the traffic manager. For nslookup, the IP address is visible in the "Non-authoritative answer" portion of the response.

In the example below, the IP address that you should copy is "52.252.175.48".

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

Services in different regions connect to different traffic managers. Regardless of the domain name, the IP address returned from the ping is the correct one to use when defining an inbound firewall rule for the Azure portal in your region.

For ping, the request will time out, but the IP address will be visible in the response. For example, in the message "Pinging azsyrie.northcentralus.cloudapp.azure.com [52.252.175.48]", the IP address is "52.252.175.48".

Providing IP addresses for clients ensures that the request is not rejected outright, but for successful access to content and operations, authorization is also necessary. Use one of the following methodologies to authenticate your request:

+ [Key-based authentication](search-security-api-keys.md), where an admin or query API key is provided on the request
+ [Role-based authorization](search-security-rbac.md), where the caller is a member of a security role on a search service, and the [registered app presents an OAuth token](search-howto-aad.md) from Azure Active Directory.

### Rejected requests

When requests originate from IP addresses that are not in the allowed list, a generic **403 Forbidden** response is returned with no additional details.

## Next steps

If your client application is a static Web app on Azure, learn how to determine its IP range for inclusion in a search service IP firewall rule.

> [!div class="nextstepaction"]
> [Inbound and outbound IP addresses in Azure App Service](../app-service/overview-inbound-outbound-ips.md)