---
title: Troubleshoot Azure Front Door configuration issues
description: In this tutorial, you learn how to self-troubleshoot some of the common issues that you may face for your Front Door.
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

# Troubleshooting common routing issues

This article describes how to troubleshoot some of the common routing issues you may face for your Azure Front Door configuration.

## 503 response from Front Door after a few seconds

### Symptom

* Regular requests sent to your backend without going through Front Door are succeeding, but going via Front Door results in 503 error responses.
* The failure from Front Door shows after a few seconds (typically around after 30 seconds)

### Cause

The cause of this issue can be one of two things:
 
* Your backend is taking longer than the timeout configured (default is 30 seconds) to receive the request from the Front Door.
* The time it takes to send a response to the request from Front Door is taking longer than the timeout value. 

### Troubleshooting steps

* Send the request to your backend directly (without going through Front Door) and see what is the usual time it takes for your backend to respond.
* Send the request via Front Door and see if you're getting any 503 responses. If not, the problem may not be a timeout issue. Contact support.
* If going through the Front Door results in 503 error response code, then configure the `sendReceiveTimeout` field for your Front Door. You can extend the default timeout up to 4 minutes (240 seconds). The setting is under the `backendPoolSettings` and is called `sendRecvTimeoutSeconds`. 

## Requests sent to the custom domain returns 400 Status Code

### Symptom

* You created a Front Door but a request to the domain or frontend host is returning an HTTP 400 status code.
* You created a DNS mapping for a custom domain to the frontend host you configured. However, sending a request to the custom domain hostname returns an HTTP 400 status code. Which doesn't appear to route to the backend you configured.

### Cause

The issue occurs if you didn't configure a routing rule for the custom domain that was added as the frontend host. A routing rule needs to be explicitly added for that frontend host. Even if one has already been configured for the frontend host under the Front Door subdomain (*.azurefd.net).

### Troubleshooting steps

Add a routing rule for the custom domain to direct traffic to the selected backend pool.

## Front Door doesn't redirect HTTP to HTTPS

### Symptom

Your Front Door has a routing rule that says redirect HTTP to HTTPS, but accessing the domain still maintains HTTP as the protocol.

### Cause

This behavior can happen if you didn't configure the routing rules correctly for your Front Door. Basically, your current configuration isn't specific and may have conflicting rules.

### Troubleshooting steps

## Request to Frontend hostname Returns 404 Status Code

### Symptom

 You created a Front Door by configuring a frontend host, a backend pool with at least one backend in it, and a routing rule that connects the frontend host to the backend pool. Your content isn't available when you make a request to the configured frontend host as a result an HTTP 404 status code gets returned.

### Cause

There are several possible causes for this symptom:

* The backend isn't a public facing backend and isn't visible to the Front Door.
* The backend is misconfigured causing the Front Door to send the wrong request. In other words, your backend only accepts HTTP and you have not unchecked allowing HTTPS. So Front Door is attempting to forward HTTPS requests.
* The backend is rejecting the host header that was forwarded with the request to the backend.
* The configuration for the backend hasn't yet been fully deployed.

### Troubleshooting steps

1. Deployment Time
   * Ensure that you've waited ~10 minutes for the configuration to be deployed.

2. Check the Backend Settings
    * Navigate to the backend pool that the request should be routing to (depends on how you have the routing rule configured). Verify that the *backend host type* and backend host name are correct. If the backend is a custom host, ensure that you've spelled it correctly. 

    * Check your HTTP and HTTPS ports. In most cases, 80 and 443 (respectively) are correct and no changes will be required. However, there's a chance that your backend isn't configured this way and is listening on a different port.

        * Check the _Backend host header_ configured for the backends that the Frontend host should be routing to. In most cases, this header should be the same as the *Backend host name*. However, an incorrect value can cause various HTTP 4xx status codes if the backend expects something different. If you input the IP address of your backend, you might need to set the *Backend host header* to the hostname of the backend.

3. Check the Routing Rule Settings:
    * Navigate to the routing rule that should route from the Frontend hostname in question to a backend pool. Ensure that the accepted protocols are configured correctly when forwarding the request. The *accepted protocols* field determines which requests Front Door should accept. The *Forwarding protocol* determines what protocol Front Door should use to forward the request to the backend.
         * As an example, if the backend only accepts HTTP requests the following configurations would be valid:
            * *Accepted protocols* are HTTP and HTTPS. *Forwarding protocol* is HTTP. Match request won't work, since HTTPS is an allowed protocol and if a request came in as HTTPS, Front Door would try to forward it using HTTPS.

            * *Accepted protocols* are HTTP. *Forwarding protocol* is either match request or HTTP.

    - *Url Rewrite* is disabled by default. This field is used only if you want to narrow the scope of backend-hosted resources that you want to make available. When disabled, Front Door will forward the same request path it receives. It's possible to misconfigure this field. So when Front Door is requesting a resource from the backend that isn't available, it will return an HTTP 404 status code.
