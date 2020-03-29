---
title: Problem installing the Application Proxy Agent Connector | Microsoft Docs
description: How to troubleshoot issues you might face when installing the Application Proxy Agent Connector 
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/21/2018
ms.author: mimart
ms.reviewer: japere

ms.collection: M365-identity-device-management
---

# Problem installing the Application Proxy Agent Connector

Microsoft AAD Application Proxy Connector is an internal domain component that uses outbound connections to establish the connectivity from the cloud available endpoint to the internal domain.

## General Problem Areas with Connector installation

When the installation of a connector fails, the root cause is usually one of the following areas:

1.  **Connectivity** – to complete a successful installation, the new connector needs to register and establish future trust properties. This is done by connecting to the AAD Application Proxy cloud service.

2.  **Trust Establishment** – the new connector creates a self-signed cert and registers to the cloud service.

3.  **Authentication of the admin** – during installation, the user must provide admin credentials to complete the Connector installation.

> [!NOTE]
> The Connector installation logs can be found in the %TEMP% folder and can help provide additional information on what is causing an installation failure.

## Verify connectivity to the Cloud Application Proxy service and Microsoft Login page

**Objective:** Verify that the connector machine can connect to the AAD Application Proxy registration endpoint as well as Microsoft login page.

1.  On the connector server, run a port test by using [telnet](https://docs.microsoft.com/windows-server/administration/windows-commands/telnet) or other port testing tool to verify that ports 443 and 80 are open.

2.  If any of those ports is not successful, verify that the Firewall or backend proxy has access to the required domains and ports see, [Prepare your on-premises environment](application-proxy-add-on-premises-application.md#prepare-your-on-premises-environment).

3.  Open a browser (separate tab) and go to the following web page: `https://login.microsoftonline.com`, make sure that you can login to that page.

## Verify Machine and backend components support for Application Proxy trust cert

**Objective:** Verify that the connector machine, backend proxy and firewall can support the certificate created by the connector for future trust.

>[!NOTE]
>The connector tries to create a SHA512 cert that is supported by TLS1.2. If the machine or the backend firewall and proxy does not support TLS1.2, the installation fails.
>
>

**To resolve the issue:**

1.  Verify the machine supports TLS1.2 – All Windows versions after 2012 R2 should support TLS 1.2. If your connector machine is from a version of 2012 R2 or prior, make sure that the following KBs are installed on the machine: <https://support.microsoft.com/help/2973337/sha512-is-disabled-in-windows-when-you-use-tls-1.2>

2.  Contact your network admin and ask to verify that the backend proxy and firewall do not block SHA512 for outgoing traffic.

## Verify admin is used to install the connector

**Objective:** Verify that the user who tries to install the connector is an administrator with correct credentials. Currently, the user must be at least an application administrator for the installation to succeed.

**To verify the credentials are correct:**

Connect to `https://login.microsoftonline.com` and use the same credentials. Make sure the login is successful. You can check the user role by going to **Azure Active Directory** -&gt; **Users and Groups** -&gt; **All Users**. 

Select your user account, then "Directory Role" in the resulting menu. Verify that the selected role is "Application Administrator". If you are unable to access any of the pages along these steps, you do not have the required role.

## Next steps
[Understand Azure AD Application Proxy connectors](application-proxy-connectors.md)
