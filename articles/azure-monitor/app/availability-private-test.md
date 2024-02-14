---
title: Availability testing behind firewalls - Azure Monitor Application Insights
description: Learn how to use availability tests on endpoint that run behind a firewall.
ms.topic: conceptual
ms.date: 03/22/2023
ms.reviewer: shyamala
---

# Testing behind a firewall

If you want to use availability tests on endpoints that run behind a firewall, you have two possible solutions: public availability test enablement and disconnected/no ingress scenarios.

## Disconnected or no ingress scenarios

> [!NOTE]
> To use this method, your test server must have outgoing access to the Application Insights ingestion endpoint. 

1. Connect your Application Insights resource and your internal service endpoint using [Azure Private Link](../logs/private-link-security.md).
1. Write custom code to periodically test your internal server or endpoints and send its results to Application Insights by using the [TrackAvailability()](availability-azure-functions.md) API in the core SDK package.


## Public availability test enablement

Ensure you have a public DNS record for your internal website. The test will fail if the DNS can't be resolved. For more information, see [Create a custom domain name for internal application](../../cloud-services/cloud-services-custom-domain-name-portal.md#add-an-a-record-for-your-custom-domain).

Configure your firewall to permit incoming requests from our service.

> [!WARNING]
> Only use service tags for public endpoints.  IP addresses used for service tags are shared across all Availability Tests and may unintentionally make your private endpoints accessible to other Availability Tests.

> [!NOTE]
> The example below is specific to network security group service tag usage. Many Azure services can accept service tags, and will have different steps to configure.
 
- [Service tags](../../virtual-network/service-tags-overview.md) are a simple way to enable Azure services without having to authorize individual IPs or maintain an up-to-date list. Service tags can be used across Azure Firewall and network security groups to allow Availability Test service to access you endpoints. The service tag **ApplicationInsightsAvailability** is used for all Availability Tests.
    1. If you're using [Azure network security groups](../../virtual-network/network-security-groups-overview.md), go to your network security group resource and under **Settings**, select **inbound security rules**. Then select **Add**.

         :::image type="content" source="media/availability-private-test/add.png" alt-text="Screenshot that shows the inbound security rules tab in the network security group resource.":::

    1. Next, select **Service Tag** as the source and select **ApplicationInsightsAvailability** as the source service tag. Use open ports 80 (http) and 443 (https) for incoming traffic from the service tag.

        :::image type="content" source="media/availability-private-test/service-tag.png" alt-text="Screenshot that shows the Add inbound security rules tab with a source of service tag.":::

- If your endpoints are hosted outside of Azure or service tags aren't available for your scenario, you'll need to individually allowlist the [IP addresses of our web test agents](ip-addresses.md). You can query the IP ranges directly from PowerShell, the Azure CLI, or a REST call by using the [Service Tag API](../../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api). You can also download a [JSON file](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) to get a list of current service tags with IP address details.
  
    1. In your network security group resource, under **Settings**, select **inbound security rules**. Then select **Add**.
    1. Next, select **IP Addresses** as your source. Then add your IP addresses in a comma-delimited list in source IP address/CIRD ranges.

         :::image type="content" source="media/availability-private-test/ip-addresses.png" alt-text="Screenshot that shows the Add inbound security rules tab with a source of IP addresses.":::

## Troubleshooting

For more information, see the [troubleshooting article](troubleshoot-availability.md).

## Next steps

* [Azure Private Link](../logs/private-link-security.md)
* [Availability alerts](availability-alerts.md)
* [Availability overview](availability-overview.md)
* [Create and run custom availability tests by using Azure Functions](availability-azure-functions.md)
