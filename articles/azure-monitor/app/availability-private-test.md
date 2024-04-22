---
title: Availability testing behind firewalls - Azure Monitor Application Insights
description: Learn how to use availability tests on endpoint that are behind a firewall.
ms.topic: conceptual
ms.date: 02/15/2024
ms.reviewer: cogoodson
---

# Testing behind a firewall

To run availability tests on firewall-protected endpoints, it's possible to enable public availability tests or use disconnected/no ingress scenarios.

## Public availability test enablement

Make sure your internal website has a public Domain Name System (DNS) record. If the DNS can't be resolved, the test fails. For more information, see [Create a custom domain name for internal application](
https://microsoft.sharepoint-df.com/teams/GenevaSynthetics-MSRC85155SecurityIncident/cloud-services/cloud-services-custom-domain-name-portal.md#add-an-a-record-for-your-custom-domain).

> [!WARNING]
> The IP addresses that the availability tests service uses are shared across all tests and might unintentionally expose your firewall-protected service endpoints to other tests. IP address filtering alone doesn't secure your service's traffic and tt's recommended to add extra custom headers to your tests to verify the web request's origin. For more info and best practices, see [Azure Service Tags](https://learn.microsoft.com/azure/virtual-network/service-tags-overview).

### Authenticate traffic

You can set custom headers in [standard availability tests](availability-standard-tests.md) to validate traffic.


1. Generate a token or GUID to use as the value to identify traffic originating from your availability tests.
1. When creating or updating your availability tests, under the "Standard test info" section, add custom header "X-ApplicationInsightsAvailability-TokenId" with value generated in previous step.
1. Update your service to check if incoming traffic includes the header and value defined in steps 1 and 2.

    :::image type="content" source="media/availability-private-test/customvalidationheader.png" alt-text="Screenshot that shows custom validation header.":::

Alternately, you can also set the token in query parameter (e.g., https://mytestendpoint/?x-azure-appinsightsavailability-tokenid=your-token-id-value)

### Configure your firewall to permit incoming requests from Availability Tests

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

## Disconnected or no ingress scenarios

1. Connect your Application Insights resource and your internal service endpoint using [Azure Private Link](../logs/private-link-security.md). 
1. Write custom code to periodically test your internal server or endpoints and send its results to Application Insights by using the [TrackAvailability()](availability-azure-functions.md) API in the core SDK package.

## Troubleshooting

For more information, see the [troubleshooting article](troubleshoot-availability.md).

## Next steps

* [Azure Private Link](../logs/private-link-security.md)
* [Availability alerts](availability-alerts.md)
* [Availability overview](availability-overview.md)
* [Create and run custom availability tests by using Azure Functions](availability-azure-functions.md)
