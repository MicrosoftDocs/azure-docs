---
title: Troubleshooting - Troubleshoot issues with your Azure Front Door Service configuration | Microsoft Docs
description: In this tutorial, you learn how to self-troubleshoot some of the common issues that you may face for your Front Door.
services: frontdoor
documentationcenter: ''
author: sharad4u
editor: ''
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/22/2018
ms.author: sharadag
---

# Troubleshooting common routing issues
This article describes how to troubleshoot some of the common routing issues you may face for your Azure Front Door Service configuration. 

## Hostname Not Routing to Backend and Returns 400 Status Code


### Symptom
- You have created a Front Door but a request to the Frontend host is returning an HTTP 400 status code.

  - You have created a DNS mapping from a custom domain to the frontend host you have configured. However, sending a request to the custom domain hostname returns an HTTP 400 status code and does not appear to route to the backend(s) you have configured.

### Cause
- This symptom can happen if you have not configured a routing rule for the custom domain that you added as a frontend host. A routing rule needs to be explicitly added for that frontend host, even if one has already been configured for the frontend host under the Front Door subdomain (*.azurefd.net) that your custom domain has a DNS mapping to.

### Troubleshooting Steps
- Add a routing rule from the custom domain to the desired backend pool.

## Request to Frontend hostname Returns 404 Status Code

### Symptom
- You have created a Front Door and configured a frontend host, a backend pool with at least one backend in it, and a routing rule that connects the frontend host to the backend pool. Your content does not seem to be available when sending a request to the configured frontend host because an HTTP 404 status code is returned.

### Cause
There are several possible causes for this symptom:
 - The backend is not a public facing backend and is not visible to the Front Door service.

- The backend is misconfigured, which is causing the Front Door service to send the wrong request (that is, your backend only accepts HTTP but you have not unchecked allowing HTTPS so Front Door is attempting to forward HTTPS requests).
- The backend is rejecting the host header that was forwarded with the request to the backend.
- The configuration for the backend has not yet been fully deployed.

### Troubleshooting Steps
1. Deployment Time
    - Ensure that you have waited ~10 minutes for the configuration to be deployed.

2. Check the Backend Settings
   - Navigate to the backend pool that the request should be routing to (depends on how you have the routing rule configured) and verify that the _backend host type_ and backend host name are correct. If the backend is a custom host, ensure that you have spelled it correctly. 

   - Check your HTTP and HTTPS ports. In most cases, 80 and 443 (respectively), are correct and no changes will be required. However, there is a chance that your backend is not configured this way and is listening on a different port.

     - Check the _Backend host header_ configured for the backends that the Frontend host should be routing to. In most cases, this header should be the same as the _Backend host name_. However, an incorrect value can cause various HTTP 4xx status codes if the backend expects something different. If you input the IP address of your backend, you might need to set the _Backend host header_ to the hostname of the backend.


3. Check the Routing Rule Settings
     - Navigate to the routing rule that should route from the Frontend hostname in question to a backend pool. Ensure that the accepted protocols are correctly configured, or if not, ensure that the protocol Front Door will use when forwarding the request is correctly configured. The _accepted protocols_ determines which requests Front Door should accept and the _Forwarding protocol_ under the _Advanced_ tab determines what protocol Front Door should use to forward the request to the backend.
          - As an example, if the backend only accepts HTTP requests the following configurations would be valid:
               - _Accepted protocols_ are HTTP and HTTPS. _Forwarding protocol_ is HTTP. Match request will not work, since HTTPS is an allowed protocol and if a request came in as HTTPS, Front Door would try to forward it using HTTPS.

               - _Accepted protocols_ are HTTP. _Forwarding protocol_ is either match request or HTTPS.

   - Click on the _Advanced_ tab at the top of the routing rule configuration pane. _Url Rewrite_ is disabled by default and you should only use this field if you want to narrow the scope of backend-hosted resources that you want to make available. When disabled, Front Door will forward the same request path it receives. It is possible that this field is misconfigured and Front Door is requesting a resource from the backend that is not available, thus returning an HTTP 404 status code.

