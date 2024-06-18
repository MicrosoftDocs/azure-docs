---
title: Configure network access
titleSuffix: Azure AI Search
description: Configure IP control policies to restrict network access to your Azure AI Search service to specific IP addresses.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 06/18/2024
---

# Configure network access and firewall rules for Azure AI Search

As soon as you install Azure AI Search, you can set up network access to limit access to an approved set of devices and cloud services. There are two mechanisms:

+ Inbound rules listing the IP addresses, ranges, or subnets from which requests are admitted
+ Exceptions to network rules, where requests are admitted with no checks, as long as the request originates from a trusted service

This article explains how to configure network access to a search service's public endpoint. To block *all* access through the public endpoint, use [private endpoints](service-create-private-endpoint.md) and an Azure virtual network.

Network access rules are scoped to data plane operations. Data plane operations include creating or querying indexes, and all other actions described by the [Search REST APIs](/rest/api/searchservice/). Control plane operations target service administration. Those operations target resource provider endpoints, which are subject to the [network protections supported by Azure Resource Manager](/security/benchmark/azure/baselines/azure-resource-manager-security-baseline).

This article assumes the Azure portal for network access configuration. You can also use the [Management REST API](/rest/api/searchmanagement/), [Azure PowerShell](/powershell/module/az.search), or the [Azure CLI](/cli/azure/search).

<!-- Azure AI Search supports IP rules for inbound access through a firewall, similar to the IP rules found in an Azure virtual network security group. By applying IP rules, you can restrict service access to an approved set of devices and cloud services. An IP rule only allows the request through. Access to data and operations will still require the caller to present a valid authorization token. -->

<!--  Your firewall configuration also enables trusted Azure platform services to access the storage account.

Turning on firewall rules for your storage account blocks incoming requests for data by default, unless the requests originate from a service that operates within an Azure virtual network or from allowed public IP addresses. Requests that are blocked include those from other Azure services, from the Azure portal, and from logging and metrics services. -->

<!-- ## Limitations of firewall rules

The Import data and Import and vectorize data wizards in the Azure portal require public endpoint connections. -->

## Prerequisites

+ A search service, any region, at the Basic tier or higher

+ Owner or Contributor permissions

<a id="configure-ip-policy"></a> 

## Configure network access in Azure portal

1. Sign in to Azure portal and go to your Azure AI Search service page.

1. Under **Settings**, select **Networking** on the left navigation pane. If you don't see this option, check your service tier. Networking options are available on Basic tier and higher.

1. Choose **Selected IP addresses**. Avoid the **Disabled** option unless you're configuring a [private endpoint](service-create-private-endpoint.md).

   :::image type="content" source="media/service-configure-firewall/azure-portal-firewall.png" alt-text="Screenshot showing the network access options in the Azure portal.":::

1. More settings become available when you choose this option. 
1
   :::image type="content" source="media/service-configure-firewall/azure-portal-firewall-all.png" alt-text="Screenshot showing how to configure the IP firewall in the Azure portal.":::

1. Under **Firewall**, select **Add your client IP address** to create an inbound rule for the public IP address of your system.

1. Add other client IP addresses for other devices and services that send requests to a search service.

   The Azure portal supports IP addresses and IP address ranges in the CIDR format. An example of CIDR notation is 8.8.8.0/24, which represents the IPs that range from 8.8.8.0 to 8.8.8.255.

   If your search client is a static web app on Azure, see [Inbound and outbound IP addresses in Azure App Service](/azure/app-service/overview-inbound-outbound-ips#find-outbound-ips). For Azure functions, see [IP addresses in Azure Functions](/azure/azure-functions/ip-addresses).

1. Under **Exceptions**, select **Allow Azure services on the trusted services list to access this search service**. These services must be configured to run under a managed identity (system or user-assigned, but usually system):

   + `Microsoft.CognitiveServices` for Azure OpenAI and Azure AI services
   + `Microsoft.MachineLearningServices` for Azure Machine Learning

   You take a dependency on [Microsoft Entra ID authentication and role assignments](#grant-access-to-trusted-azure-services) if you choose the trusted service exception.

   Workflows for this network exception are requests originating *from* Azure AI Studio, Azure OpenAI Studio, or other AML features *to* Azure AI Search. These requests occur in "use your own data" scenarios for retrieval augmented generation (RAG) and playground environments. 

1. **Save** your changes.

After you enable the IP access control policy for your Azure AI Search service, all requests to the data plane from machines outside the allowed list of IP address ranges are rejected.

### Rejected requests

When requests originate from IP addresses that aren't in the allowed list, a generic **403 Forbidden** response is returned with no other details.

<a id="allow-access-from-your-client-and-portal-ip"></a>

## Allow access from the Azure portal IP address

When IP rules are configured, some features of the Azure portal are disabled. You can view and manage service level information, but portal access to the import wizards, indexes, indexers, and other top-level resources are restricted. 

You can restore portal access to the full range of search service operations by adding the portal IP address.

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

For ping, the request times out, but the IP address is visible in the response. For example, in the message `"Pinging azsyrie.northcentralus.cloudapp.azure.com [52.252.175.48]"`, the IP address is `52.252.175.48`.

## Grant access to trusted Azure services

Did you select the trusted services exception? If yes, your Azure resource must have a managed identity (either system or user-assigned), and you must use role-based access controls. 

Restated, workflows for this network exception are requests originating *from* Azure AI Studio, Azure OpenAI Studio, or other AML features *to* Azure AI Search, typically in "use your own data" scenarios for retrieval augmented generation (RAG) and playground environments. 

The following articles provide instructions for creating managed identities for Azure OpenAI, Azure Machine Learning, and Azure AI services:

+ [How to configure Azure OpenAI Service with managed identities](/azure/ai-services/openai/how-to/managed-identity)
+ [How to set up authentication between Azure Machine Learning and other services](/azure/machine-learning/how-to-identity-based-service-authentication).

For Azure AI services:

1. [Find your multiservice account](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.CognitiveServices%2Faccounts/).

1. On the leftmost pane, under **Resource management**, select **Identity** and then set **System-assigned** to **On**.

Once your Azure resource has a managed identity, [assign roles on Azure AI Search](search-security-rbac.md) to give it permissions to data and operations. We recommend Search Index Data Reader.

> [!NOTE]
> This article covers the trusted exception for admitting requests to your search service, but Azure AI Search is itself on the trusted services list of other Azure resources. Specifically, you can use the trusted service exception for [connections from Azure AI Search to Azure Storage](search-indexer-howto-access-trusted-service-exception.md).

## Next steps

Once a request is allowed through the firewall, it must be authenticated and authorized. You have two options:

+ [Key-based authentication](search-security-api-keys.md), where an admin or query API key is provided on the request. This is the default.
+ [Role-based access control (RBAC)](search-security-rbac.md) using Microsoft Entra ID, where the caller is a member of a security role on a search service. This is the most secure option. It uses Microsoft Entra ID for authentication and role assignments on Azure AI Search for permissions to data and operations.

[**Enable role-based access control**](search-security-enable-roles.md) on your search service to use RBAC.
