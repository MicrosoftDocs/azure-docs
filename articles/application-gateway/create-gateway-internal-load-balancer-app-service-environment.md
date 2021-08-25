---
title: Troubleshoot an Application Gateway in Azure – ILB ASE | Microsoft Docs
description: Learn how to troubleshoot an application gateway by using an Internal Load Balancer with an App Service Environment in Azure
services: vpn-gateway
documentationCenter: na
author: genlin
manager: dcscontentpm
editor: ''
tags: ''

ms.service: vpn-gateway
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/09/2020
ms.author: genli
---

# Back-end server certificate is not allow listed for an application gateway using an Internal Load Balancer with an App Service Environment

This article troubleshoots the following issue: A certificate isn't allow listed when you create an application gateway by using an Internal Load Balancer (ILB) together with an App Service Environment (ASE) at the back end when using end-to-end TLS in Azure.

## Symptoms

When you create an application gateway by using an ILB with an ASE at the back end, the back-end server may become unhealthy. This problem occurs if the authentication certificate of the application gateway doesn't match the configured certificate on the back-end server. See the following scenario as an example:

**Application Gateway configuration:**

- **Listener:** Multi-site
- **Port:** 443
- **Hostname:** test.appgwtestase.com
- **SSL Certificate:** CN=test.appgwtestase.com
- **Backend Pool:** IP address or FQDN
- **IP Address:**: 10.1.5.11
- **HTTP Settings:** HTTPS
- **Port:**: 443
- **Custom Probe:** Hostname – test.appgwtestase.com
- **Authentication Certificate:** .cer of test.appgwtestase.com
- **Backend Health:** Unhealthy – Backend server certificate is not allow listed with Application Gateway.

**ASE configuration:**

- **ILB IP:** 10.1.5.11
- **Domain name:** appgwtestase.com
- **App Service:** test.appgwtestase.com
- **SSL Binding:** SNI SSL – CN=test.appgwtestase.com

When you access the application gateway, you receive the following error message because the back-end server is unhealthy:

**502 – Web server received an invalid response while acting as a gateway or proxy server.**

## Solution

When you don't use a host name to access a HTTPS website, the back-end server will return the configured certificate on the default website, in case SNI is disabled. For an ILB ASE, the default certificate comes from the ILB certificate. If there are no configured certificates for the ILB, the certificate comes from the ASE App certificate.

When you use a fully qualified domain name (FQDN) to access the ILB, the back-end server will return the correct certificate that's uploaded in the HTTP settings. If that is not the case    , consider the following options:

- Use FQDN in the back-end pool of the application gateway to point to the IP address of the ILB. This option only works if you have a private DNS zone or a custom DNS configured. Otherwise, you have to create an "A" record for a public DNS.

- Use the uploaded certificate on the ILB or the default certificate (ILB certificate) in the HTTP settings. The application gateway gets the certificate when it accesses the ILB's IP for the probe.

- Use a wildcard certificate on the ILB and the back-end server, so that for all the websites, the certificate is common. However, this solution is possible only in case of subdomains and not if each of the websites require different hostnames.

- Clear the **Use for App service** option for the application gateway in case you are using the IP address of the ILB.

To reduce overhead, you can upload the ILB certificate in the HTTP settings to make the probe path work. (This step is just for allow listing. It won't be used for TLS communication.) You can retrieve the ILB certificate by accessing the ILB with its IP address from your browser on HTTPS then exporting the TLS/SSL certificate in a Base-64 encoded CER format and uploading the certificate on the respective HTTP settings.

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
