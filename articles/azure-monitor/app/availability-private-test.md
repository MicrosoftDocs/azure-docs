---
title: Private availability testing - Azure Monitor Application Insights
description: Learn how to use availability tests on internal servers that run behind a firewall with private testing.
ms.topic: conceptual
ms.date: 03/22/2023
ms.reviewer: shyamala
---

# Private testing

If you want to use availability tests on internal servers that run behind a firewall, you have two possible solutions: public availability test enablement and disconnected/no ingress scenarios.

## Public availability test enablement

> [!NOTE]
> If you don't want to allow any ingress to your environment, use the method in the [Disconnected or no ingress scenarios](#disconnected-or-no-ingress-scenarios) section.

 Ensure you have a public DNS record for your internal website. The test will fail if the DNS can't be resolved. For more information, see [Create a custom domain name for internal application](../../cloud-services/cloud-services-custom-domain-name-portal.md#add-an-a-record-for-your-custom-domain).

Configure your firewall to permit incoming requests from our service.

- [Service tags](../../virtual-network/service-tags-overview.md) are a simple way to enable Azure services without having to authorize individual IPs or maintain an up-to-date list. Service tags can be used across Azure Firewall and network security groups to allow our service access. The service tag **ApplicationInsightsAvailability** is dedicated to our ping testing service, which covers both URL ping tests and Standard availability tests.
    1. If you're using [Azure network security groups](../../virtual-network/network-security-groups-overview.md), go to your network security group resource and under **Settings**, select **inbound security rules**. Then select **Add**.

         :::image type="content" source="media/availability-private-test/add.png" alt-text="Screenshot that shows the inbound security rules tab in the network security group resource.":::

    1. Next, select **Service Tag** as the source and select **ApplicationInsightsAvailability** as the source service tag. Use open ports 80 (http) and 443 (https) for incoming traffic from the service tag.

        :::image type="content" source="media/availability-private-test/service-tag.png" alt-text="Screenshot that shows the Add inbound security rules tab with a source of service tag.":::

- If your endpoints are hosted outside of Azure or service tags aren't available for your scenario, you'll need to individually allowlist the [IP addresses of our web test agents](ip-addresses.md). You can query the IP ranges directly from PowerShell, the Azure CLI, or a REST call by using the [Service Tag API](../../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api). You can also download a [JSON file](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) to get a list of current service tags with IP address details.
    1. In your network security group resource, under **Settings**, select **inbound security rules**. Then select **Add**.
    1. Next, select **IP Addresses** as your source. Then add your IP addresses in a comma-delimited list in source IP address/CIRD ranges.

         :::image type="content" source="media/availability-private-test/ip-addresses.png" alt-text="Screenshot that shows the Add inbound security rules tab with a source of IP addresses.":::

## Disconnected or no ingress scenarios

To use this method, your test server must have outgoing access to the Application Insights ingestion endpoint. This is a much lower security risk than the alternative of permitting incoming requests. The results will appear in the availability web tests tab with a simplified experience from what is available for tests created via the Azure portal. Custom availability tests will also appear as availability results in **Analytics**, **Search**, and **Metrics**.

1. Connect your Application Insights resource and disconnected environment by using [Azure Private Link](../logs/private-link-security.md).
1. Write custom code to periodically test your internal server or endpoints. You can run the code by using [Azure Functions](availability-azure-functions.md) or a background process on a test server behind your firewall. Your test process can send its results to Application Insights by using the `TrackAvailability()` API in the core SDK package.

## Troubleshooting

For more information, see the [troubleshooting article](troubleshoot-availability.md).

## Next steps

* [Azure Private Link](../logs/private-link-security.md)
* [Availability alerts](availability-alerts.md)
* [Availability overview](availability-overview.md)
* [Create and run custom availability tests by using Azure Functions](availability-azure-functions.md)
