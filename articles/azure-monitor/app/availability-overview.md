---
title: Application Insights availability tests 
description: Set up recurring web tests to monitor availability and responsiveness of your app or website.
ms.topic: conceptual
ms.date: 07/13/2021
ms.reviewer: shyamala
---

# Application Insights availability tests

After you've deployed your web app or website, you can set up recurring tests to monitor availability and responsiveness. [Application Insights](./app-insights-overview.md) sends web requests to your application at regular intervals from points around the world. It can alert you if your application isn't responding or responds too slowly.

You can set up availability tests for any HTTP or HTTPS endpoint that's accessible from the public internet. You don't have to make any changes to the website you're testing. In fact, it doesn't even have to be a site that you own. You can test the availability of a REST API that your service depends on.

## Types of tests

There are four types of availability tests:

* [URL ping test (classic)](monitor-web-app-availability.md): You can create this test through the Azure portal to validate whether an endpoint is responding and measure performance associated with that response. You can also set custom success criteria coupled with more advanced features, like parsing dependent requests and allowing for retries.
* [Standard test](availability-standard-tests.md): This single request test is similar to the URL ping test. It includes TLS/SSL certificate validity, proactive lifetime check, HTTP request verb (for example, `GET`, `HEAD`, or `POST`), custom headers, and custom data associated with your HTTP request.
* [Multi-step web test (classic)](availability-multistep.md): You can play back this recording of a sequence of web requests to test more complex scenarios. Multi-step web tests are created in Visual Studio Enterprise and uploaded to the portal, where you can run them.
* [Custom TrackAvailability test](availability-azure-functions.md): If you decide to create a custom application to run availability tests, you can use the [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) method to send the results to Application Insights.

> [!IMPORTANT]
> Both the [URL ping test](monitor-web-app-availability.md) and the [multi-step web test](availability-multistep.md) rely on the DNS infrastructure of the public internet to resolve the domain names of the tested endpoints. If you're using private DNS, you must ensure that the public domain name servers can resolve every domain name of your test. When that's not possible, you can use [custom TrackAvailability tests](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) instead.

You can create up to 100 availability tests per Application Insights resource.

> [!NOTE]
> Availability tests are stored encrypted, according to [Azure data encryption at rest](../../security/fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services) policies.

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/troubleshoot-availability).

## Next steps

* [Availability alerts](availability-alerts.md)
* [URL tests](monitor-web-app-availability.md)
* [Standard tests](availability-standard-tests.md)
* [Multi-step web tests](availability-multistep.md)
* [Create and run custom availability tests using Azure Functions](availability-azure-functions.md)
* [Web tests Azure Resource Manager template](/azure/templates/microsoft.insights/webtests?tabs=json)