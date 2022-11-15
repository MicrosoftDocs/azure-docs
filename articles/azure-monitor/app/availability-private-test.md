---
title: Private availability testing - Azure Monitor Application Insights
description: Learn how to use availability tests on internal servers that run behind a firewall with private testing.
ms.topic: conceptual
ms.date: 05/14/2021
ms.reviewer: shyamala
---

# Private testing

If you want to use availability tests on internal servers that run behind a firewall, there are two possible solutions: public availability test enablement and disconnected/no ingress scenarios.

## Public availability test enablement

> [!NOTE]
> If you don’t want to allow any ingress to your environment, then use the method in the [Disconnected or no ingress scenarios](#disconnected-or-no-ingress-scenarios) section.

 Ensure you have a public DNS record for your internal website. The test will fail if the DNS cannot be resolved. [Create a custom domain name for internal application.](../../cloud-services/cloud-services-custom-domain-name-portal.md#add-an-a-record-for-your-custom-domain)

Configure your firewall to permit incoming requests from our service.

- [Service tags](../../virtual-network/service-tags-overview.md) are a simple way to enable Azure services without having to authorize individual IPs or maintain an up-to-date list. Service tags can be used across Azure Firewall and Network Security Groups to allow our service access. **ApplicationInsightsAvailability** is the Service tag dedicated to our ping testing service, covering both URL ping tests and Standard availability tests.
    1. If you are using [Azure Network Security Groups](../../virtual-network/network-security-groups-overview.md), go to your Network Security group resource and select **inbound security rules** under *Settings* then select **Add**.

         :::image type="content" source="media/availability-private-test/add.png" alt-text="Screenshot of the inbound security rules tab in the network security group resource.":::

    1. Next, select *Service Tag* as the source and *ApplicationInsightsAvailability* as the source service tag. Use open ports 80 (http) and 443 (https) for incoming traffic from the service tag.

        :::image type="content" source="media/availability-private-test/service-tag.png" alt-text="Screenshot of the Add inbound security rules tab with a source of service tag.":::

- If your endpoints are hosted outside of Azure or Service Tags aren't available for your scenario, then you'll need to individually allowlist the [IP addresses of our web test agents](ip-addresses.md). You can query the IP ranges directly from PowerShell, Azure CLI, or a REST call using the [Service tag API](../../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) You can also download a [JSON file](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) to get a list of current service tags with IP addresses details.
    1. In your Network Security group resource and select **inbound security rules** under *Settings*, then select **Add**.
    1. Next, select *IP Addresses* as your source then add your IP addresses in a comma delimited list in source IP address/CIRD ranges.

         :::image type="content" source="media/availability-private-test/ip-addresses.png" alt-text="Screenshot of the Add inbound security rules tab with a source of IP addresses.":::

## Disconnected or no ingress scenarios

Your test server will need to have outgoing access to the Application Insights ingestion endpoint, which is a significantly lower security risk than the alternative of permitting incoming requests. The results will appear in the availability web tests tab with a simplified experience from what is available for test created via the Azure portal. Custom availability test will also appear as availability results in Analytics, Search, and Metrics.

1. Connect your Application Insights resource and disconnected environment using [Azure Private Link](../logs/private-link-security.md)
1. Write custom code to periodically test your internal server or endpoints. You can run the code using [Azure Functions](availability-azure-functions.md) or a background process on a test server behind your firewall. Your test process can send its results to Application Insights by using the `TrackAvailability()` API in the core SDK package.

## Troubleshooting

Dedicated [troubleshooting article](troubleshoot-availability.md).

## Next steps

* [Azure Private Link](../logs/private-link-security.md)
* [Availability Alerts](availability-alerts.md)
* [URL tests](monitor-web-app-availability.md)
* [Create and run custom availability tests using Azure Functions](availability-azure-functions.md)
