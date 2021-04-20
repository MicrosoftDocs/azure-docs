---
title: Application Insights availability overview 
description: Set up recurring web tests to monitor availability and responsiveness of your app or website.
ms.topic: conceptual
ms.date: 04/15/2021

---

# Availability tests overview

After you've deployed your web app/website, you can set up recurring tests to monitor availability and responsiveness. [Application Insights](./app-insights-overview.md) sends web requests to your application at regular intervals from points around the world. It can alert you if your application isn't responding, or if it responds too slowly.

You can set up availability tests for any HTTP or HTTPS endpoint that is accessible from the public internet. You don't have to make any changes to the website you're testing. In fact, it doesn't even have to be a site you own. You can test the availability of a REST API that your service depends on.

## Types of availability tests

There are three types of availability tests:

* [URL ping test](monitor-web-app-availability.md): This category has two simple tests you can create through the portal.
* [Multi-step web test](availability-multistep.md): A recording of a sequence of web requests, which can be played back to test more complex scenarios. Multi-step web tests are created in Visual Studio Enterprise and uploaded to the portal for execution.
* [Custom Track Availability Tests](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability): If you decide to create a custom application to run availability tests, the `TrackAvailability()` method can be used to send the results to Application Insights.

> [!IMPORTANT]
> Both, [URL ping test](monitor-web-app-availability.md) and [multi-step web test](availability-multistep.md) rely on the public internet DNS infrastructure to resolve the domain names of the tested endpoints. This means that if you are using Private DNS, you must either ensure that every domain name of your test is also resolvable by the public domain name servers or, when it is not possible, you can use [custom track availability tests](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) instead.

**You can create up to 100 availability tests per Application Insights resource.**

## Troubleshooting

Dedicated [troubleshooting article](troubleshoot-availability.md).

## Next step

* [Availability Alerts](availability-alerts.md)
* [Multi-step web tests](availability-multistep.md)
* [URL tests](monitor-web-app-availability.md)
* [Create and run custom availability tests using Azure Functions.](availability-azure-functions.md)