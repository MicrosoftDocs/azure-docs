---
title: Availability testing behind firewalls - Azure Monitor Application Insights
description: Learn how to use availability tests on endpoint that are behind a firewall.
ms.topic: conceptual
ms.date: 05/07/2024
ms.reviewer: cogoodson
---

# Testing behind a firewall

To ensure endpoint availability behind firewalls, enable public availability tests or run availability tests in disconnected or no ingress scenarios.

## Public availability test enablement

Ensure your internal website has a public Domain Name System (DNS) record. Availability tests fail if DNS can't be resolved. For more information, see [Create a custom domain name for internal application](../../cloud-services/cloud-services-custom-domain-name-portal.md#add-an-a-record-for-your-custom-domain).

> [!WARNING]
> The IP addresses used by the availability tests service are shared and can expose your firewall-protected service endpoints to other tests. IP address filtering alone doesn't secure your service's traffic, so it's recommended to add extra custom headers to verify the origin of web request. For more information, see [Virtual network service tags](../../virtual-network/service-tags-overview.md#virtual-network-service-tags).

### Authenticate traffic

Set custom headers in [standard availability tests](availability-standard-tests.md) to validate traffic.

1. Generate a token or GUID to identify traffic from your availability tests.
2. Add the custom header "X-Customer-InstanceId" with the value `ApplicationInsightsAvailability:<GUID generated in step 1>` under the "Standard test info" section when creating or updating your availability tests.
3. Ensure your service checks if incoming traffic includes the header and value defined in the previous steps.

    :::image type="content" source="media/availability-private-test/custom-validation-header.png" alt-text="Screenshot that shows custom validation header.":::

Alternatively, set the token as a query parameter. For example, `https://yourtestendpoint/?x-customer-instanceid=applicationinsightsavailability:<your guid>`.

### Configure your firewall to permit incoming requests from Availability Tests

> [!NOTE]
> This example is specific to network security group service tag usage. Many Azure services accept service tags, each requiring different configuration steps.

- To simplify enabling Azure services without authorizing individual IPs or maintaining an up-to-date IP list, use [Service tags](../../virtual-network/service-tags-overview.md). Apply these tags across Azure Firewall and network security groups, allowing the Availability Test service access to your endpoints. The service tag `ApplicationInsightsAvailability` applies to all Availability Tests.

    1. If you're using [Azure network security groups](../../virtual-network/network-security-groups-overview.md), go to your network security group resource and under **Settings**, select **inbound security rules**. Then select **Add**.

         :::image type="content" source="media/availability-private-test/add.png" alt-text="Screenshot that shows the inbound security rules tab in the network security group resource.":::

    2. Next, select **Service Tag** as the source and select **ApplicationInsightsAvailability** as the source service tag. Use open ports 80 (http) and 443 (https) for incoming traffic from the service tag.

        :::image type="content" source="media/availability-private-test/service-tag.png" alt-text="Screenshot that shows the Add inbound security rules tab with a source of service tag.":::

- To manage access when your endpoints are outside Azure or when service tags aren't an option, allowlist the [IP addresses of our web test agents](ip-addresses.md). You can query IP ranges using PowerShell, Azure CLI, or a REST call with the [Service Tag API](../../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api). For a comprehensive list of current service tags and their IP details, download the [JSON file](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).
  
    1. In your network security group resource, under **Settings**, select **inbound security rules**. Then select **Add**.
    2. Next, select **IP Addresses** as your source. Then add your IP addresses in a comma-delimited list in source IP address/CIRD ranges.

         :::image type="content" source="media/availability-private-test/ip-addresses.png" alt-text="Screenshot that shows the Add inbound security rules tab with a source of IP addresses.":::

## Disconnected or no ingress scenarios

1. Connect your Application Insights resource to your internal service endpoint using [Azure Private Link](../logs/private-link-security.md).
2. Write custom code to periodically test your internal server or endpoints. Send the results to Application Insights using the [TrackAvailability()](availability-azure-functions.md) API in the core SDK package.

## Troubleshooting

For more information, see the [troubleshooting article](troubleshoot-availability.md).

## Next steps

* [Azure Private Link](../logs/private-link-security.md)
* [Availability alerts](availability-alerts.md)
* [Availability overview](availability-overview.md)
* [Custom availability tests using Azure Functions](availability-azure-functions.md)