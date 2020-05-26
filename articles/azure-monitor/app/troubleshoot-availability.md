---
title: Troubleshoot your Azure Application Insights availability tests
description: Troubleshoot web tests in Azure Application Insights. Get alerts if a website becomes unavailable or responds slowly.
ms.topic: conceptual
author: lgayhardt
ms.author: lagayhar
ms.date: 04/28/2020

ms.reviewer: sdash
---

# Troubleshooting

This article will help you to troubleshoot common issues that may occur when using availability monitoring.

## SSL/TLS errors

|Symptom/error message| Possible causes|
|--------|------|
|Could not create SSL/TLS Secure Channel  | SSL version. Only TLS 1.0, 1.1, and 1.2 are supported. **SSLv3 is not supported.**
|TLSv1.2 Record Layer: Alert (Level: Fatal, Description: Bad Record MAC)| See StackExchange thread for [more information](https://security.stackexchange.com/questions/39844/getting-ssl-alert-write-fatal-bad-record-mac-during-openssl-handshake).
|URL that is failing is to a CDN (Content Delivery Network) | This may be caused by a misconfiguration on your CDN |  

### Possible workaround

* If the URLs that are experiencing the issue are always to dependent resources, it is recommended to disable **parse dependent requests** for the web test.

## Test fails only from certain locations

|Symptom/error message| Possible causes|
|----|---------|
|A connection attempt failed because the connected party did not properly respond after a period of time  | Test agents in certain locations are being blocked by a firewall.|
|    |Rerouting of certain IP addresses is occurring via (Load Balancers, Geo traffic managers, Azure Express Route.) 
|    |If using Azure ExpressRoute, there are scenarios where packets can be dropped in cases where [Asymmetric Routing occurs](https://docs.microsoft.com/azure/expressroute/expressroute-asymmetric-routing).|

## Test failure with a protocol violation error

|Symptom/error message| Possible causes| Possible Resolutions |
|----|---------|-----|
|The server committed a protocol violation. Section=ResponseHeader Detail=CR must be followed by LF | This occurs when malformed headers are detected. Specifically, some headers might not be using CRLF to indicate the end of line, which violates the HTTP specification. Application Insights enforces this HTTP specification and fails responses with malformed headers.| a. Contact web site host provider / CDN provider to fix the faulty servers. <br> b. In case the failed requests are resources (e.g. style files, images, scripts), you may consider disabling the parsing of dependent requests. Keep in mind, if you do this you will lose the ability to monitor the availability of those files).

> [!NOTE]
> The URL may not fail on browsers that have a relaxed validation of HTTP headers. See this blog post for a detailed explanation of this issue: http://mehdi.me/a-tale-of-debugging-the-linkedin-api-net-and-http-protocol-violations/  

## Common troubleshooting questions

### Site looks okay but I see test failures? Why is Application Insights alerting me?

   * Does your test have **Parse dependent requests** enabled? That results in a strict check on resources such as scripts, images etc. These types of failures may not be noticeable on a browser. Check all the images, scripts, style sheets, and any other files loaded by the page. If any of them fails, the test is reported as failed, even if the main HTML page loads without issue. To desensitize the test to such resource failures, simply uncheck the Parse Dependent Requests from the test configuration.

   * To reduce odds of noise from transient network blips etc., ensure Enable retries for test failures configuration is checked. You can also test from more locations and manage alert rule threshold accordingly to prevent location-specific issues causing undue alerts.

   * Click on any of the red dots from the Availability experience, or any availability failure from the Search explorer to see the details of why we reported the failure. The test result, along with the correlated server-side telemetry (if enabled) should help understand why the test failed. Common causes of transient issues are network or connection issues.

   * Did the test time-out? We abort tests after 2 minutes. If your ping or multi-step test takes longer than 2 minutes, we will report it as a failure. Consider breaking the test into multiple ones that can complete in shorter durations.

   * Did all locations report failure, or only some of them? If only some reported failures, it may be due to network/CDN issues. Again, clicking on the red dots should help understand why the location reported failures.

### I did not get an email when the alert triggered, or resolved or both?

Check the classic alerts configuration to confirm your email is directly listed, or a distribution list you are on is configured to receive notifications. If it is, then check the distribution list configuration to confirm it can receive external emails. Also check if your mail administrator may have any policies configured that may cause this issue.

### I did not receive the webhook notification?

Check to ensure the application receiving the webhook notification is available, and successfully processes the webhook requests. See [this](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-log-webhook) for more information.

### I am getting  403 Forbidden errors, what does this mean?

This error indicates that you need to add firewall exceptions to allow the availability agents to test your target url. For a full list of agent IP addresses to allow, consult the [IP exception article](https://docs.microsoft.com/azure/azure-monitor/app/ip-addresses#availability-tests).

### Intermittent test failure with a protocol violation error?

The error ("protocol violation..CR must be followed by LF") indicates an issue with the server (or dependencies). This happens when malformed headers are set in the response. It can be caused by load balancers or CDNs. Specifically, some headers might not be using CRLF to indicate end of line, which violates the HTTP specification and therefore fail validation at the .NET WebRequest level. Inspect the response to spot headers, which might be in violation.

> [!NOTE]
> The URL may not fail on browsers that have a relaxed validation of HTTP headers. See this blog post for a detailed explanation of this issue: http://mehdi.me/a-tale-of-debugging-the-linkedin-api-net-and-http-protocol-violations/  

### I don't see any related server-side telemetry to diagnose test failures?*

If you have Application Insights set up for your server-side application, that may be because [sampling](../../azure-monitor/app/sampling.md) is in operation. Select a different availability result.

### Can I call code from my web test?

No. The steps of the test must be in the .webtest file. And you can't call other web tests or use loops. But there are several plug-ins that you might find helpful.


### Is there a difference between "web tests" and "availability tests"?

The two terms may be referenced interchangeably. Availability tests is a more generic term that includes the single URL ping tests in addition to the multi-step web tests.

### I'd like to use availability tests on our internal server that runs behind a firewall.

   There are two possible solutions:

   * Configure your firewall to permit incoming requests from the [IP addresses
    of our web test agents](../../azure-monitor/app/ip-addresses.md).
   * Write your own code to periodically test your internal server. Run the code as a background process on a test server behind your firewall. Your test process can send its results to Application Insights by using [TrackAvailability()](https://docs.microsoft.com/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) API in the core SDK package. This requires your test server to have outgoing access to the Application Insights ingestion endpoint, but that is a much smaller security risk than the alternative of permitting incoming requests. The results will appear in the availability web tests blades though the experience will be slightly simplified from what is available for tests created via the portal. Custom availability tests will also appear as availability results in Analytics, Search, and Metrics.

### Uploading a multi-step web test fails

Some reasons this might happen:
   * There's a size limit of 300 K.
   * Loops aren't supported.
   * References to other web tests aren't supported.
   * Data sources aren't supported.

### My multi-step test doesn't complete

There's a limit of 100 requests per test. Also, the test is stopped if it runs longer than two minutes.

### How can I run a test with client certificates?

This is currently not supported.

## Who receives the (classic) alert notifications?

This section only applies to classic alerts and will help you optimize your alert notifications to ensure that only your desired recipients receive notifications. To understand more about the difference between [classic alerts](../platform/alerts-classic.overview.md)and the new alerts experience refer to the [alerts overview article](../platform/alerts-overview.md). To control alert notification in the new alerts experience use [action groups](../platform/action-groups.md).

* We recommend the use of specific recipients for classic alert notifications.

* For alerts on failures from X out of Y locations, the **bulk/group** check-box option, if enabled, sends to users with admin/co-admin roles.  Essentially _all_ administrators of the _subscription_ will receive notifications.

* For alerts on availability metrics the **bulk/group** check-box option if enabled, sends to users with owner, contributor, or reader roles in the subscription. In effect, _all_ users with access to the subscription the Application Insights resource are in scope and will receive notifications. 

> [!NOTE]
> If you currently use the **bulk/group** check-box option, and disable it, you will not be able to revert the change.

Use the new alert experience/near-realtime alerts if you need to notify users based on their roles. With [action groups](../platform/action-groups.md), you can configure email notifications to users with any of the contributor/owner/reader roles (not combined together as a single option).

## Next steps

* [Multi-step web testing](availability-multistep.md)
* [URL ping tests](monitor-web-app-availability.md)
