---
title: Private Availability Testing - Azure Monitor Application Insights
description: Learn how to use availability tests on internal servers that run behind a firewall with private testing.
ms.topic: conceptual
ms.date: 05/05/2021

---

# Private testing

If you want to use availability tests on internal servers that run behind a firewall, there are two possible solutions: public ping test enablement and disconnected/no ingress scenarios.

## Public ping test enablement

1. Ensure you have a public DNS record for your internal website. The test will fail if the DNS cannot be resolved. [Create a custom domain name for internal application.](../../cloud-services/cloud-services-custom-domain-name-portal.md#add-an-a-record-for-your-custom-domain)
1. Configure your firewall to permit incoming requests from our service.
    1. [Service tags](../../virtual-network/service-tags-overview.md) are a simple way to enable Azure services without having to authorize individual IPs or maintain an up-to-date list. Service tags can be used across Azure Firewall and Network Security Groups to allow our service access.
    1. If your endpoints are hosted outside of Azure or Service Tags aren't available for your scenario, then you'll need to individually allowlist the [IP addresses of our web test agents](ip-addresses.md).

## Disconnected or no ingress scenarios

You'll need to write your own code to periodically test your internal server or endpoints. You can run the code using [Azure Functions](availability-azure-functions.md) or a background process on a test server behind your firewall. Your test process can send its results to Application Insights by using the `TrackAvailability()` API in the core SDK package.

Your test server will need to have outgoing access to the Application Insights ingestion endpoint, which is a significantly lower security risk than the alternative of permitting incoming requests. The results will appear in the availability web tests tab with a simplified experience from what is available for test created via the Azure portal. Custom availability test will also appear as availability results in Analytics, Search, and Metrics.

## Troubleshooting

Dedicated [troubleshooting article](troubleshoot-availability.md).

## Next Steps

* [Availability Alerts](availability-alerts.md)
* [URL tests](monitor-web-app-availability.md)
* [Create and run custom availability tests using Azure Functions](availability-azure-functions.md)