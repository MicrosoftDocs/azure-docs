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

<a id="configure-ip-policy"></a> 

## Set IP ranges in Azure portal

To set the IP access control policy in the Azure portal, go to your Azure Cognitive Search service page and select **Networking** on the left navigation pane. Endpoint networking connectivity must be **Public Access**. If your connectivity is set to **Private Access** or **Shared Private Access**, you can only access your search service via a Private Endpoint.

:::image type="content" source="media/service-configure-firewall/azure-portal-firewall.png" alt-text="Screenshot showing how to configure the IP firewall in the Azure portal" border="true":::

The Azure portal provides the ability to specify IP addresses and IP address ranges in the CIDR format. An example of CIDR notation is 8.8.8.0/24, which represents the IPs that range from 8.8.8.0 to 8.8.8.255.

After you enable the IP access control policy for your Azure Cognitive Search service, all requests to the data plane from machines outside the allowed list of IP address ranges are rejected. 

## Allow access from Azure portal

By default, when IP rules are configured, some features of the Azure portal are disabled. You'll be able to view and manage service level information, but portal access to indexes, indexers, and other top-level resources is restricted.

To retain service administration through the portal, select the "Allow access" option under **Exceptions**. Alternatively, use the [VS Code Extension](https://aka.ms/vscode-search) to manage content.

## Allow access from your client

Client applications that push indexing and query requests to the search service must be represented in an IP range. On Azure, you can generally determine the IP address by pinging the FQDN of a service (for example, `ping <your-search-service-name>.search.windows.net` will return the IP address of a search service). 

Providing IP addresses for clients ensures that the request is not rejected outright, but for successful access to content and operations, authorization is also necessary. Use one of the following methodologies to authenticate your request:

+ [Key-based authentication](search-security-api-keys.md), where an admin or query API key is provided on the request
+ [Role-based authorization](search-security-rbac.md), where the caller is a member of a security role on a search service, and the [registered app presents an OAuth token](search-howto-aad.md) from Azure Active Directory.

### Rejected requests

When requests originate from IP addresses that are not in the allowed list, a generic **403 Forbidden** response is returned with no additional details.

## Next steps

If your client application is a static Web app on Azure, learn how to determine its IP range for inclusion in a search service IP firewall rule.

> [!div class="nextstepaction"]
> [Inbound and outbound IP addresses in Azure App Service](../app-service/overview-inbound-outbound-ips.md)