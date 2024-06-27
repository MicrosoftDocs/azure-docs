---
title: Application Insights availability tests 
description: Set up recurring web tests to monitor availability and responsiveness of your app or website.
ms.topic: conceptual
ms.date: 06/18/2024
ms.reviewer: cogoodson
---

# Application Insights availability tests

After you deploy your web app or website, you can set up recurring tests to monitor availability and responsiveness. [Application Insights](./app-insights-overview.md) sends web requests to your application at regular intervals from points around the world. It can alert you if your application isn't responding or responds too slowly.

You can set up availability tests for any HTTP or HTTPS endpoint that's accessible from the public internet. You don't have to make any changes to the website you're testing. In fact, it doesn't even have to be a site that you own. You can test the availability of a REST API that your service depends on.

## Types of tests

> [!IMPORTANT]
> There are two upcoming availability tests retirements. On August 31, 2024 multi-step web tests in Application Insights will be retired. We advise users of these tests to transition to alternative availability tests before the retirement date. Following this date, we will be taking down the underlying infrastructure which will break remaining multi-step tests.
> On September 30, 2026, URL ping tests in Application Insights will be retired. Existing URL ping tests will be removed from your resources. Review the [pricing](https://azure.microsoft.com/pricing/details/monitor/#pricing) for standard tests and [transition](https://aka.ms/availabilitytestmigration) to using them before September 30, 2026 to ensure you can continue to run single-step availability tests in your Application Insights resources.

There are four types of availability tests:

* [Standard test](availability-standard-tests.md): This single request test is similar to the URL ping test. It includes TLS/SSL certificate validity, proactive lifetime check, HTTP request verb (for example, `GET`, `HEAD`, or `POST`), custom headers, and custom data associated with your HTTP request.
* [Custom TrackAvailability test](availability-azure-functions.md): If you decide to create a custom application to run availability tests, you can use the [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) method to send the results to Application Insights.
* Classic tests (**older versions of availability tests**)
    * [URL ping test (deprecated)](monitor-web-app-availability.md): You can create this test through the Azure portal to validate whether an endpoint is responding and measure performance associated with that response. You can also set custom success criteria coupled with more advanced features, like parsing dependent requests and allowing for retries.
    * [Multi-step web test (deprecated)](availability-multistep.md): You can play back this recording of a sequence of web requests to test more complex scenarios. Multi-step web tests are created in Visual Studio Enterprise and uploaded to the portal, where you can run them.

> [!IMPORTANT]
> The older classic tests, [URL ping test](monitor-web-app-availability.md) and [multi-step web test](availability-multistep.md), rely on the DNS infrastructure of the public internet to resolve the domain names of the tested endpoints. If you're using private DNS, you must ensure that the public domain name servers can resolve every domain name of your test. When that's not possible, you can use [custom TrackAvailability tests](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) instead.

You can create up to 100 availability tests per Application Insights resource.

> [!NOTE]
> Availability tests are stored encrypted, according to [Azure data encryption at rest](../../security/fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services) policies.

## TLS support
To provide best-in-class encryption, all availability tests use Transport Layer Security (TLS) 1.2 or higher as the encryption mechanism of choice.

> [!WARNING]
> On 31 October 2024, in alignment with the [Azure wide legacy TLS deprecation](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/) TLS 1.0/1.1 protocol versions and TLS 1.2/1.3 legacy Cipher suites and Elliptical curves will be retired for Application Insights availability tests. 

### Supported TLS configurations
TLS protocol versions 1.2 and 1.3 are supported encryption mechanisms for availability tests. In addition, the following Cipher suites and Elliptical curves are also supported within each version.
> [!NOTE]
> TLS 1.3 is currently only available in these availability test regions: NorthCentralUS, CentralUS, EastUS, SouthCentralUS, WestUS 

#### TLS 1.2
**Cipher suites**
- TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 
- TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 

**Elliptical curves**
- NistP384 
- NistP256 

#### TLS 1.3
**Cipher suites**
- TLS_AES_256_GCM_SHA384 
- TLS_AES_128_GCM_SHA256 

**Elliptical curves:** 
- NistP384 
- NistP256 

### Deprecating TLS configuration
> [!WARNING]
> After 31 October 2024, only the listed Cipher suites and Elliptical curves within the below TLS 1.2 and TLS 1.3 sections will be retired. TLS 1.2/1.3 and the previously mentioned Cipher Suites and Elliptical Curves under section "Supported TLS configurations" will still be supported.

#### TLS 1.0 and TLS 1.1
Protocol versions will no longer be supported

#### TLS 1.2
**Cipher suites**
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA 
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA 
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA 
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA 
- TLS_RSA_WITH_AES_256_GCM_SHA384 
- TLS_RSA_WITH_AES_128_GCM_SHA256 
- TLS_RSA_WITH_AES_256_CBC_SHA256 
- TLS_RSA_WITH_AES_128_CBC_SHA256 
- TLS_RSA_WITH_AES_256_CBC_SHA 
- TLS_RSA_WITH_AES_128_CBC_SHA 

**Elliptical curves:** 
- curve25519 

#### TLS 1.3
**Elliptical curves**
- curve25519 

## Frequently asked questions

This section provides answers to common questions.

### General

#### Can I run availability tests on an intranet server?

Our [web tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) run on points of presence that are distributed around the globe. There are two solutions:
          
* **Firewall door**: Allow requests to your server from [the long and changeable list of web test agents](../ip-addresses.md).
* **Custom code**: Write your own code to send periodic requests to your server from inside your intranet. You could run Visual Studio web tests for this purpose. The tester could send the results to Application Insights by using the `TrackAvailability()` API.

#### What is the user agent string for availability tests?

The user agent string is **Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; AppInsights**

### TLS Support 

#### How does this deprecation impact my web test behavior?
Availability tests act as a distributed client in each of the supported web test locations. Every time a web test is executed the availability test service attempts to reach out to the remote endpoint defined in the web test configuration. A TLS Client Hello message is sent which contains all the currently supported TLS configuration. If the remote endpoint shares a common TLS configuration with the availability test client, then the TLS handshake succeeds. Otherwise, the web test fails with a TLS handshake failure. 

#### How do I ensure my web test isn't impacted?
To avoid any impact, each remote endpoint (including dependent requests) your web test interacts with needs to support at least one combination of the same Protocol Version, Cipher Suite, and Elliptical Curve that availability test does. If the remote endpoint doesn't support the needed TLS configuration, it needs to be updated with support for some combination of the above-mentioned post-deprecation TLS configuration. These endpoints can be discovered through viewing the [Transaction Details](/azure/azure-monitor/app/availability-standard-tests#see-your-availability-test-results) of your web test (ideally for a successful web test execution). 

#### How do I validate what TLS configuration a remote endpoint supports?
There are several tools available to test what TLS configuration an endpoint supports. One way would be to follow the example detailed on this [page](/security/engineering/solving-tls1-problem#appendix-a-handshake-simulation). If your remote endpoint isn't available via the Public internet, you need to ensure you validate the TLS configuration supported on the remote endpoint from a machine that has access to call your endpoint. 

> [!NOTE]
> For steps to enable the needed TLS configuration on your web server, it is best to reach out to the team that owns the hosting platform your web server runs on if the process is not known. 

#### After October 31, 2024, what will the web test behavior be for impacted tests?
There's no one exception type that all TLS handshake failures impacted by this deprecation would present themselves with. However, the most common exception your web test would start failing with would be `The request was aborted: Couldn't create SSL/TLS secure channel`. You should also be able to see any TLS related failures in the TLS Transport [Troubleshooting Step](/troubleshoot/azure/azure-monitor/app-insights/availability/diagnose-ping-test-failure) for the web test result that is potentially impacted. 

#### Can I view what TLS configuration is currently in use by my web test?
The TLS configuration negotiated during a web test execution can't be viewed. As long as the remote endpoint supports common TLS configuration with availability tests, no impact should be seen post-deprecation. 

#### Which components does the deprecation affect in the availability test service?
The TLS deprecation detailed in this document should only affect the availability test web test execution behavior after October 31, 2024. For more information about interacting with the availability test service for CRUD operations, see [Azure Resource Manager TLS Support](/azure/azure-resource-manager/management/tls-support). This resource provides more details on TLS support and deprecation timelines.

#### Where can I get TLS support?
For any general questions around the legacy TLS problem, see [Solving TLS problems](/security/engineering/solving-tls1-problem).

## Troubleshooting

> [!WARNING]
> We have recently enabled TLS 1.3 in availability tests. If you are seeing new error messages as a result, please ensure that clients running on Windows Server 2022 with TLS 1.3 enabled can connect to your endpoint. If you are unable to do this, you may consider temporarily disabling TLS 1.3 on your endpoint so that availability tests will fall back to older TLS versions.  
> For additional information, please check the  [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/troubleshoot-availability).
See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/troubleshoot-availability).

## Next steps

* [Availability alerts](availability-alerts.md)
* [Standard tests](availability-standard-tests.md)
* [Availability tests using Azure Functions](availability-azure-functions.md)
* [Web tests Azure Resource Manager template](/azure/templates/microsoft.insights/webtests?tabs=json)
