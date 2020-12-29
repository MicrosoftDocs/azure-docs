---
title: Troubleshoot Azure Front Door configuration problems
description: In this tutorial, you learn how to self-troubleshoot some of the common problems that you might face for your Azure Front Door instance.
services: frontdoor
documentationcenter: ''
author: duongau
editor: ''
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 09/30/2020
ms.author: duau
---

# Troubleshooting common routing problems

This article describes how to troubleshoot common routing problems that you might face for your Azure Front Door configuration.

## 503 response from Azure Front Door after a few seconds

### Symptom

* Regular requests sent to your backend without going through Azure Front Door are succeeding. Going via Azure Front Door results in 503 error responses.
* The failure from Azure Front Door typically shows after about 30 seconds.

### Cause

The cause of this problem can be one of two things:
 
* Your backend is taking longer than the timeout configured (default is 30 seconds) to receive the request from Azure Front Door.
* The time it takes to send a response to the request from Azure Front Door is taking longer than the timeout value. 

### Troubleshooting steps

* Send the request to your backend directly (without going through Azure Front Door). See how long your backend usually takes to respond.
* Send the request via Azure Front Door and see if you're getting any 503 responses. If not, the problem might not be a timeout issue. Contact support.
* If going through Azure Front Door results in a 503 error response code, configure the `sendReceiveTimeout` field for Azure Front Door. You can extend the default timeout up to 4 minutes (240 seconds). The setting is under `backendPoolSettings` and is called `sendRecvTimeoutSeconds`. 

## Requests sent to the custom domain return a 400 status code

### Symptom

* You created an Azure Front Door instance, but a request to the domain or frontend host is returning an HTTP 400 status code.
* You created a DNS mapping for a custom domain to the frontend host that you configured. However, sending a request to the custom domain host name returns an HTTP 400 status code. It doesn't appear to route to the backend that you configured.

### Cause

The problem occurs if you didn't configure a routing rule for the custom domain that was added as the frontend host. A routing rule needs to be explicitly added for that frontend host. That's true even if a routing rule has already been configured for the frontend host under the Azure Front Door subdomain (*.azurefd.net).

### Troubleshooting steps

Add a routing rule for the custom domain to direct traffic to the selected backend pool.

## Azure Front Door doesn't redirect HTTP to HTTPS

### Symptom

Azure Front Door has a routing rule that redirects HTTP to HTTPS, but accessing the domain still maintains HTTP as the protocol.

### Cause

This behavior can happen if you didn't configure the routing rules correctly for Azure Front Door. Basically, your current configuration isn't specific and might have conflicting rules.

### Troubleshooting steps

## Request to a frontend host name returns a 404 status code

### Symptom

You created an Azure Front Door instance by configuring a frontend host, a backend pool with at least one backend in it, and a routing rule that connects the frontend host to the backend pool. Your content isn't available when you make a request to the configured frontend host. As a result, the request returns an HTTP 404 status code.

### Cause

There are several possible causes for this symptom:

* The backend isn't a public-facing backend and isn't visible to Azure Front Door.
* The backend is misconfigured, causing Azure Front Door to send the wrong request. In other words, your backend accepts only HTTP and you haven't disallowed HTTPS. So Azure Front Door is trying to forward HTTPS requests.
* The backend is rejecting the host header that was forwarded with the request to the backend.
* The configuration for the backend hasn't yet been fully deployed.

### Troubleshooting steps

* Check the deployment time:
   * Ensure that you've waited at least 10 minutes for the configuration to be deployed.

* Check the backend settings:
    * Go to the backend pool that the request should be routing to. (It depends on how you have the routing rule configured.) Verify that the backend host type and backend host name are correct. If the backend is a custom host, ensure that you've spelled it correctly. 

    * Check your HTTP and HTTPS ports. In most cases, 80 and 443 (respectively) are correct and no changes are required. However, there's a chance that your backend isn't configured this way and is listening on a different port.

    * Check the backend host header configured for the backends that the frontend host should be routing to. In most cases, this header should be the same as the backend host name. However, an incorrect value can cause various HTTP 4xx status codes if the backend expects something different. If you enter the IP address of your backend, you might need to set the backend host header to the host name of the backend.

* Check the routing rule settings:
    * Go to the routing rule that should route from the frontend host name in question to a backend pool. Ensure that the accepted protocols are configured correctly when the request is forwarded. The **Accepted protocols** field determines which requests Azure Front Door should accept. The forwarding protocol determines what protocol Azure Front Door should use to forward the request to the backend.
      
      As an example, if the backend accepts only HTTP requests, the following configurations would be valid:
            
      * Accepted protocols are HTTP and HTTPS. The forwarding protocol is HTTP. A match request won't work, because HTTPS is an allowed protocol. If a request came in as HTTPS, Azure Front Door would try to forward it by using HTTPS.

      * The accepted protocol is HTTP. The forwarding protocol is either a match request or HTTP.
    - **Url Rewrite** is disabled by default. This field is used only if you want to narrow the scope of backend-hosted resources that you want to make available. When this field is disabled, Azure Front Door will forward the same request path that it receives. It's possible to misconfigure this field. So when Azure Front Door is requesting a resource from the backend that isn't available, it will return an HTTP 404 status code.

## Request to the frontend host name returns a 411 status code

### Symptom

You created an Azure Front Door instance and configured a frontend host, a backend pool with at least one backend in it, and a routing rule that connects the frontend host to the backend pool. Your content doesn't seem to be available when a request goes to the configured frontend host because an HTTP 411 status code is returned.

Responses to these requests might also contain an HTML error page in the response body that includes an explanatory statement. For example: `HTTP Error 411. The request must be chunked or have a content length`.

### Cause

There are several possible causes for this symptom. The overall reason is that your HTTP request is not fully RFC-compliant. 

An example of noncompliance is a `POST` request sent without either a `Content-Length` or a `Transfer-Encoding` header (for example, using `curl -X POST https://example-front-door.domain.com`). This request doesn't meet the requirements set out in [RFC 7230](https://tools.ietf.org/html/rfc7230#section-3.3.2). Azure Front Door would block it with an HTTP 411 response.

This behavior is separate from the Web Application Firewall (WAF) functionality of Azure Front Door. Currently, there's no way to disable this behavior. All HTTP requests must meet the requirements, even if the WAF functionality is not in use.

### Troubleshooting steps

- Verify that your requests comply with the requirements set out in the necessary RFCs.

- Take note of any HTML message body that's returned in response to your request. A message body often explains exactly *how* your request is noncompliant.
