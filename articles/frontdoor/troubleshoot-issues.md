---
title: Troubleshoot Azure Front Door common issues
description: In this tutorial, you'll learn how to troubleshoot some of the common problems that you might face for your Azure Front Door instance.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 11/12/2021
ms.author: duau
---

# Troubleshoot Azure Front Door common issues

This article describes how to troubleshoot common routing problems that you might face for your Azure Front Door configuration.

## Additional debugging HTTP headers

You can request Front Door to return additional debugging HTTP response headers. For more details, refer to [optional response headers](front-door-http-headers-protocol.md#optional-debug-response-headers).

## 503 response from Azure Front Door after a few seconds

### Symptom

* Regular requests sent to your backend without going through Azure Front Door are succeeding. Going via Azure Front Door results in 503 error responses.
* The failure from Azure Front Door typically shows after about 30 seconds.
* Intermittent 503 errors with log `ErrorInfo: OriginInvalidResponse`.

### Cause

The cause of this problem can be one of three things:
 
* Your origin is taking longer than the timeout configured (default is 30 seconds) to receive the request from Azure Front Door.
* The time it takes to send a response to the request from Azure Front Door is taking longer than the timeout value.
* Client sent a byte range request with `Accept-Encoding header` (compression enabled).

### Troubleshooting steps

* Send the request to your backend directly (without going through Azure Front Door). See how long your backend usually takes to respond.
* Send the request via Azure Front Door and see if you're getting any 503 responses. If not, the problem might not be a timeout issue. Contact support.
* If requests going through Azure Front Door results in a 503 error response code, configure the **Origin response timeout (in seconds)** for the endpoint. You can extend the default timeout to up to 4 minutes (240 seconds). The setting can be configured by going to the *Endpoint manager* and selecting **Edit endpoint**.

    :::image type="content" source="./media/troubleshoot-issues/origin-response-timeout-1.png" alt-text="Screenshot of selecting edit endpoint from Endpoint manager.":::

    Then select **Endpoint properties** to configure the **Origin response timeout**:

    :::image type="content" source="./media/troubleshoot-issues/origin-response-timeout-2.png" alt-text="Screenshot of select endpoint properties and Origin response timeout field." lightbox="./media/troubleshoot-issues/origin-response-timeout-2-expanded.png":::

* If the timeout doesn’t resolve the issue, use a tool like Fiddler or your browser's developer tool to check if the client is sending byte range requests with Accept-Encoding headers, leading to the origin responding with different content lengths. If yes, then you can either disable compression on the Origin/Azure Front Door or create a Rules Set rule to remove `accept-encoding` from the request for byte range requests.

    :::image type="content" source="./media/troubleshoot-issues/remove-encoding-rule.png" alt-text="Screenshot of accept-encoding rule in a Rule Set.":::

## Requests sent to the custom domain return a 400 status code

### Symptom

* You created an Azure Front Door instance, but a request to the domain or frontend host is returning an HTTP 400 status code.
* You created a DNS mapping for a custom domain to the frontend host that you configured. However, sending a request to the custom domain host name returns an HTTP 400 status code. It doesn't appear to route to the backend that you configured.

### Cause

The problem occurs if you didn't configure a routing rule for the custom domain that was added as the frontend host. A routing rule needs to be explicitly added for that frontend host. That's true even if a routing rule has already been configured for the frontend host under the Azure Front Door subdomain (*.azurefd.net).

### Troubleshooting steps

Add a routing rule for the custom domain to direct traffic to the selected origin group.

## Azure Front Door doesn't redirect HTTP to HTTPS

### Symptom

Azure Front Door has a routing rule that redirects HTTP to HTTPS, but accessing the domain still maintains HTTP as the protocol.

### Cause

This behavior can happen if you didn't configure the routing rules correctly for Azure Front Door. Basically, your current configuration isn't specific and might have conflicting rules.

### Troubleshooting steps


## Request to the frontend host name returns a 411 status code

### Symptom

You created an Azure Front Door Standard/Premium instance and configured a frontend host, an origin group with at least one origin in it, and a routing rule that connects the frontend host to the origin group. Your content doesn't seem to be available when a request goes to the configured frontend host because an HTTP 411 status code gets returned.

Responses to these requests might also contain an HTML error page in the response body that includes an explanatory statement. For example: `HTTP Error 411. The request must be chunked or have a content length`.

### Cause

There are several possible causes for this symptom. The overall reason is that your HTTP request isn't fully RFC-compliant. 

An example of noncompliance is a `POST` request sent without either a `Content-Length` or a `Transfer-Encoding` header (for example, using `curl -X POST https://example-front-door.domain.com`). This request doesn't meet the requirements set out in [RFC 7230](https://tools.ietf.org/html/rfc7230#section-3.3.2). Azure Front Door would block it with an HTTP 411 response.

This behavior is separate from the Web Application Firewall (WAF) functionality of Azure Front Door. Currently, there's no way to disable this behavior. All HTTP requests must meet the requirements, even if the WAF functionality isn't in use.

### Troubleshooting steps

- Verify that your requests are in compliance with the requirements set out in the necessary RFCs.

- Take note of any HTML message body that's returned in response to your request. A message body often explains exactly *how* your request is noncompliant.

## Next steps

* Learn how to [create a Front Door](quickstart-create-front-door.md).
* Learn how to [create a Front Door Standard/Premium](standard-premium/create-front-door-portal.md).
