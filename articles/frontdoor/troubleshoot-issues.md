---
title: Troubleshoot Azure Front Door common issues
description: In this article, you learn how to troubleshoot some of the common problems that you might face for your Azure Front Door instance.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 04/04/2023
ms.author: duau
---

# Troubleshoot Azure Front Door common issues

This article describes how to troubleshoot common routing problems that you might face for your Azure Front Door configuration.

## Other debugging HTTP headers

You can request Azure Front Door to return extra debugging HTTP response headers. For more information, see [optional response headers](front-door-http-headers-protocol.md#optional-debug-response-headers).

## 503 or 504 response from Azure Front Door after a few seconds

### Symptom

* Regular requests sent to your backend without going through Azure Front Door are succeeding. Going through the Azure Front Door results in 503 or 504 error responses.
* The failure from Azure Front Door typically appears after about 30 seconds.
* Intermittent 503 errors appear with "ErrorInfo: OriginInvalidResponse."

### Cause

The cause of this issue can be one of three things:

* Your origin is taking longer than the timeout configured to receive the request from Azure Front Door. The default timeout is 30 seconds.
* The time it takes to send a response to the request from Azure Front Door is taking longer than the timeout value.
* The client sent a byte range request with an **Accept-Encoding** header, which means compression is enabled.

### Troubleshooting steps

* Send the request to your origin directly without going through Azure Front Door. See how long your origin normally takes to respond.
* Send the request through Azure Front Door and see if you're getting any 503 responses. If not, the problem may not be a timeout issue. Create a support request to troubleshoot the issue further.
* If requests going through Azure Front Door result in a 503 error response code then configure the **Origin response timeout** for Azure Front Door. You can increase the default timeout to up to 4 minutes (240 seconds). To configure the setting, go to overview page of the Front Door profile. Select **Origin response timeout** and enter a value between *16* and *240* seconds.
    > [!NOTE]
    > The ability to configure Origin response timeout is only available in Azure Front Door Standard/Premium.

    :::image type="content" source="./media/how-to-configure-endpoints/origin-timeout.png" alt-text="Screenshot of the origin timeout settings on the overview page of the Azure Front Door profile.":::

* If increasing the timeout doesn't resolve the issue, use a tool like Fiddler or your browser's developer tool to check if the client is sending byte range requests with **Accept-Encoding** headers. Using this option leads to the origin responding with different content lengths.

   If the client is sending byte range requests with **Accept-Encoding** headers, you have two options. The first option is to disable compression on the origin or Azure Front Door. The second option is to create a rules set rule to remove **Accept-Encoding** from the request for byte range requests.

    :::image type="content" source="./media/troubleshoot-issues/remove-encoding-rule.png" alt-text="Screenshot that shows the Accept-Encoding rule in a rule set.":::

## 503 responses from Azure Front Door only for HTTPS

### Symptom

* Any 503 responses are returned only for Azure Front Door HTTPS-enabled endpoints.
* Regular requests sent to your backend without going through Azure Front Door are succeeding. Going via Azure Front Door results in 503 error responses.
* Intermittent 503 errors appear with "ErrorInfo: OriginInvalidResponse."

### Cause

The cause of this problem can be one of three things:

* The backend pool is an IP address.
* The backend server returns a certificate that doesn't match the FQDN of the Azure Front Door backend pool.
* The backend pool is an Azure Web Apps server.

### Troubleshooting steps

* The backend pool is an IP address.

   `EnforceCertificateNameCheck` must be disabled.
    
    Azure Front Door has a switch called `EnforceCertificateNameCheck`. By default, this setting is enabled. When enabled, Azure Front Door checks that the backend pool host name FQDN matches the backend server certificate's certificate name or one of the entries in the subject alternative names extension.

    - How to disable `EnforceCertificateNameCheck` from the Azure portal:
    
      In the portal, use a toggle button to turn this setting on or off in the Azure Front Door (classic) **Design** pane.
    
      ![Screenshot that shows the toggle button.](https://user-images.githubusercontent.com/63200992/148067710-1b9b6053-efe3-45eb-859f-f747de300653.png)

      For Azure Front Door Standard and Premium tier, this setting can be found in the origin settings when you add an origin to an origin group or configuring a route.

      :::image type="content" source="./media/troubleshoot-issues/validation-checkbox.png" alt-text="Screenshot of the certificate subject name validation checkbox.":::

* The backend server returns a certificate that doesn't match the FQDN of the Azure Front Door backend pool. To resolve this issue, you have two options:

    - The returned certificate must match the FQDN.
    - `EnforceCertificateNameCheck` must be disabled.
  
* The backend pool is an Azure Web Apps server:

    - Check if the Azure web app is configured with IP-based SSL instead of being SNI based. If the web app is configured as IP based, it should be changed to SNI.
    - If the backend is unhealthy because of a certificate failure, a 503 error message is returned. You can verify the health of the backends on ports 80 and 443. If only 443 is unhealthy, it's likely an issue with SSL. Because the backend is configured to use the FQDN, we know it's sending SNI.

    Use OPENSSL to verify the certificate that's being returned. To do this check, connect to the backend by using `-servername`. It should return the SNI, which needs to match with the FQDN of the backend pool:

    `openssl s_client -connect backendvm.contoso.com:443  -servername backendvm.contoso.com`

## Requests sent to the custom domain return a 400 status code

### Symptom

* You created an Azure Front Door instance. A request to the domain or frontend host returns an HTTP 400 status code.
* You created a DNS mapping for a custom domain to the frontend host that you configured. Sending a request to the custom domain host name returns an HTTP 400 status code. It doesn't appear to route to the backend that you configured.

### Cause

The problem occurs if you didn't configure a routing rule for the custom domain that was added as the frontend host. A routing rule needs to be explicitly added for that frontend host. You need to create the rule even if a routing rule was already configured for the frontend host under the Azure Front Door subdomain, which is ***.azurefd.net**.

### Troubleshooting step

Add a routing rule for the custom domain to direct traffic to the selected origin group.

## Azure Front Door doesn't redirect HTTP to HTTPS

### Symptom

Azure Front Door has a routing rule that redirects HTTP to HTTPS, but accessing the domain still maintains HTTP as the protocol.

### Cause

This behavior can happen if you didn't configure the routing rules correctly for Azure Front Door. Your current configuration isn't specific and might have conflicting rules.

### Troubleshooting steps


## Request to the frontend host name returns a 411 status code

### Symptom

You created an Azure Front Door Standard/Premium instance and configured:

- A frontend host.
- An origin group with at least one origin in it.
- A routing rule that connects the frontend host to the origin group.

Your content doesn't seem to be available when a request goes to the configured frontend host because an HTTP 411 status code gets returned.

Responses to these requests might also contain an HTML error page in the response body that includes an explanatory statement. An example is "HTTP Error 411. The request must be chunked or have a content length."

### Cause

There are several possible causes for this symptom. The overall reason is that your HTTP request isn't fully RFC-compliant.

An example of noncompliance is a `POST` request sent without either a **Content-Length** or a **Transfer-Encoding** header. An example would be using `curl -X POST https://example-front-door.domain.com`. This request doesn't meet the requirements set out in [RFC 7230](https://tools.ietf.org/html/rfc7230#section-3.3.2). Azure Front Door would block it with an HTTP 411 response. Such requests don't get logged.

This behavior is separate from the web application firewall (WAF) functionality of Azure Front Door. Currently, there's no way to disable this behavior. All HTTP requests must meet the requirements, even if the WAF functionality isn't in use.

### Troubleshooting steps

- Verify that your requests are in compliance with the requirements set out in the necessary RFCs.
- Take note of any HTML message body that's returned in response to your request. A message body often explains exactly *how* your request is noncompliant.

## My origin is configured as an IP address.

### Symptom

The origin is configured as an IP address. The origin is healthy, but rejecting requests from Azure Front Door.

### Cause

Azure Front Door users the origin host name as the SNI header during SSL handshake. Since the origin is configured as an IP address, the failure can be caused by one of the following reasons:

* Certificate name check is enabled in the Front Door origin configuration. It's recommended to leave this setting enabled. Certificate name check requires the origin host name to match the certificate name or one of the entries in the subject alternative names extension.
* If certificate name check is disabled, then the cause is likely due to the origin certificate logic rejecting any requests that don't have a valid host header in the request that matches the certificate.

### Troubleshooting steps

Change the origin from an IP address to an FQDN to which a valid certificate is issued that matches the origin certificate.

## Next steps

* Learn how to [create a Front Door](quickstart-create-front-door.md).
* Learn how to [create a Front Door Standard/Premium](standard-premium/create-front-door-portal.md).
