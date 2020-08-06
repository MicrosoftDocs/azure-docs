---
title: Troubleshoot Azure Front Door configuration issues
description: In this tutorial, you learn how to self-troubleshoot some of the common issues that you may face for your Front Door.
services: frontdoor
documentationcenter: ''
author: sharad4u
editor: ''
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 09/22/2018
ms.author: sharadag
---

# Troubleshooting common routing issues

This article describes how to troubleshoot some of the common routing issues you may face for your Azure Front Door configuration.

## 503 response from Front Door after a few seconds

### Symptom

- Regular requests sent to your backend without going through Front Door are succeeding, but going via Front Door results in 503 error responses.

- The failure from Front Door shows after a few seconds (typically around after 30 seconds)

### Cause

This symptom happens when either your backend takes beyond the timeout configuration (default is 30 seconds) to receive the request from Front Door or if it takes beyond this timeout value to send a response to the request from Front Door. 

### Troubleshooting steps

- Send the request to your backend directly (without going through Front Door) and see what is the usual time it takes for your backend to respond.
- Send the request via Front Door and see if you are seeing any 503 responses. If not, then this may not be a timeout issue. Please contact support.
- If going via Front Door results in 503 error response code, then configure the sendReceiveTimeout field for your Front Door to extend the default timeout up to 4 minutes (240 seconds). The setting is under the `backendPoolSettings` and is called `sendRecvTimeoutSeconds`. 

## Requests sent to the custom domain returns 400 Status Code

### Symptom

- You have created a Front Door but a request to the domain or frontend host is returning an HTTP 400 status code.

- You have created a DNS mapping from a custom domain to the frontend host you have configured. However, sending a request to the custom domain hostname returns an HTTP 400 status code and does not appear to route to the backend(s) you have configured.

### Cause

This symptom can happen if you have not configured a routing rule for the custom domain that you added as a frontend host. A routing rule needs to be explicitly added for that frontend host, even if one has already been configured for the frontend host under the Front Door subdomain (*.azurefd.net) that your custom domain has a DNS mapping to.

### Troubleshooting steps

Add a routing rule from the custom domain to the desired backend pool.

## Front Door is not redirecting HTTP to HTTPS

### Symptom

Your Front Door has a routing rule that says redirect HTTP to HTTPS, but accessing the domain still maintains HTTP as the protocol.

### Cause

This behavior can happen if you have not correctly configured the routing rules for your Front Door. Basically, your current configuration isn't specific and may have conflicting rules.

### Troubleshooting steps

## Request to Frontend hostname Returns 404 Status Code

### Symptom

- You have created a Front Door and configured a frontend host, a backend pool with at least one backend in it, and a routing rule that connects the frontend host to the backend pool. Your content does not seem to be available when sending a request to the configured frontend host because an HTTP 404 status code is returned.

### Cause

There are several possible causes for this symptom:

- The backend is not a public facing backend and is not visible to the Front Door.
- The backend is misconfigured, which is causing the Front Door to send the wrong request (that is, your backend only accepts HTTP but you have not unchecked allowing HTTPS so Front Door is attempting to forward HTTPS requests).
- The backend is rejecting the host header that was forwarded with the request to the backend.
- The configuration for the backend has not yet been fully deployed.

### Troubleshooting steps

1. Deployment Time
   - Ensure that you have waited ~10 minutes for the configuration to be deployed.

2. Check the Backend Settings
    - Navigate to the backend pool that the request should be routing to (depends on how you have the routing rule configured) and verify that the _backend host type_ and backend host name are correct. If the backend is a custom host, ensure that you have spelled it correctly. 

    - Check your HTTP and HTTPS ports. In most cases, 80 and 443 (respectively), are correct and no changes will be required. However, there is a chance that your backend is not configured this way and is listening on a different port.

        - Check the _Backend host header_ configured for the backends that the Frontend host should be routing to. In most cases, this header should be the same as the _Backend host name_. However, an incorrect value can cause various HTTP 4xx status codes if the backend expects something different. If you input the IP address of your backend, you might need to set the _Backend host header_ to the hostname of the backend.


3. Check the Routing Rule Settings
    - Navigate to the routing rule that should route from the Frontend hostname in question to a backend pool. Ensure that the accepted protocols are correctly configured, or if not, ensure that the protocol Front Door will use when forwarding the request is correctly configured. The _accepted protocols_ field determines which requests Front Door should accept and the _Forwarding protocol_ determines what protocol Front Door should use to forward the request to the backend.
         - As an example, if the backend only accepts HTTP requests the following configurations would be valid:
            - _Accepted protocols_ are HTTP and HTTPS. _Forwarding protocol_ is HTTP. Match request will not work, since HTTPS is an allowed protocol and if a request came in as HTTPS, Front Door would try to forward it using HTTPS.

            - _Accepted protocols_ are HTTP. _Forwarding protocol_ is either match request or HTTPS.

    - _Url Rewrite_ is disabled by default and you should only use this field if you want to narrow the scope of backend-hosted resources that you want to make available. When disabled, Front Door will forward the same request path it receives. It is possible that this field is misconfigured and Front Door is requesting a resource from the backend that is not available, thus returning an HTTP 404 status code.

