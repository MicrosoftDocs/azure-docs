---
title: How to configure an Application Proxy application | Microsoft Docs
description: Learn how to create and configure an APplication Proxy application in a few simple steps  
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 05/18/2018
ms.author: kenwith
ms.reviewer: asteen
ms.collection: M365-identity-device-management
---

# How to configure an Application Proxy application

This article helps you to understand how to configure an Application Proxy application within Azure AD to expose your on-premises applications to the cloud.

## Recommended documents

To learn about the initial configurations and creation of an Application Proxy application through the Admin Portal, follow the [Publish applications using Azure AD Application Proxy](application-proxy-add-on-premises-application.md).

For details on configuring Connectors, see [Enable Application Proxy in the Azure portal](application-proxy-add-on-premises-application.md).

For information on uploading certificates and using custom domains, see [Working with custom domains in Azure AD Application Proxy](application-proxy-configure-custom-domain.md).

## Create the Application/Setting the URLs

If you are following the steps in the [Publish applications using Azure AD Application Proxy](application-proxy-add-on-premises-application.md) documentation and are getting an error creating the application, see the error details for information and suggestions for how to fix the application. Most error messages include a suggested fix. To avoid common errors, verify:

- You are an administrator with permission to create an Application Proxy application
- The internal URL is unique
- The external URL is unique
- The URLs start with http or https, and end with a “/”
- The URL should be a domain name, not an IP address

The error message should display in the top-right corner when you create the application. You can also select the notification icon to see the error messages.

![Shows where to find the Notification prompt in the Azure portal](./media/application-proxy-config-how-to/error-message.png)

## Configure connectors/connector groups

If you are having difficulty configuring your application because of warning about the connectors and connector groups, see instructions on enabling Application Proxy for details on how to download connectors. If you want to learn more about connectors, see the [connectors documentation](application-proxy-connectors.md).

If your connectors are inactive, this means that they are unable to reach the service. This is often because all the required ports are not open. To see a list of required ports, see the pre-requisites section of the enabling Application Proxy documentation.

## Upload certificates for custom domains

Custom Domains allow you to specify the domain of your external URLs. To use custom domains, you need to upload the certificate for that domain. For information on using custom domains and certificates, see [Working with custom domains in Azure AD Application Proxy](application-proxy-configure-custom-domain.md).

If you are encountering issues uploading your certificate, look for the error messages in the portal for additional information on the problem with the certificate. Common certificate problems include:

- Expired certificate
- Certificate is self-signed
- Certificate is missing the private key

The error message display in the top-right corner as you try to upload the certificate. You can also select the notification icon to see the error messages.

## Next steps

[Publish applications using Azure AD Application Proxy](application-proxy-add-on-premises-application.md)
