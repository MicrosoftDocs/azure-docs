---
title: 'Configure Device SSO for Windows - Azure VPN Client – Microsoft Entra ID authentication'
description: Learn how to configure the Azure VPN Client to use Device SSO to connect to a virtual network using VPN Gateway point-to-site VPN, OpenVPN protocol connections, and Microsoft Entra ID authentication from a Windows computer. This article applies to P2S gateways configured with the Microsoft-registered App ID.
titleSuffix: Azure VPN Gateway
author: flapinski
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 02/26/2026
ms.author: flapinski
ms.custom: sfi-image-nochange

#Audience and custom App ID values are not sensitive data. Please do not remove. They are required for the configuration.

# Customer intent: "As a network administrator, I want to configure the Azure VPN Client profile with Microsoft Entra ID authentication on Windows, so that I can securely connect to virtual networks via point-to-site VPN and ensure my user can use Device SSO."
---

# Configure Device SSO for Windows - Azure VPN Client – Microsoft Entra ID authentication

This article helps you configure Device Single Sign On (SSO). Device SSO allows users to log into their devices once and use that authentication while using the Azure VPN Client on a Windows computer to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra ID authentication. For more information about point-to-site connections, see [About point-to-site connections](point-to-site-about.md).

## Prerequisites

Configure your VPN gateway for point-to-site VPN connections that specify Microsoft Entra ID authentication. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md). 

Make sure you also followed the necessary steps to configure the Azure VPN Client profile configuration .xml file with the custom audience and Microsoft application ID, as mentioned in [Configure Azure VPN Client – Microsoft Entra ID authentication – Windows](point-to-site-entra-vpn-client-windows.md).

## Workflow
1. Once you downloaded your VPN Profile configuration package, open the .xml file with a text editor.
1. Locate the `aad` section and set the value for `enabledevicesso` to be "true" for the aforementioned Windows Azure VPN Client profile:

   ```xml
   <aad>
      <audience>{customAudienceID}</audience>
      <issuer>https://sts.windows.net/{tenant ID value}/</issuer>
      <tenant>https://login.microsoftonline.com/{tenant ID value}/</tenant>
      <applicationid>c632b3df-fb67-4d84-bdcf-b95ad541b5c8</applicationid> 
      <enabledevicesso>true</enabledevicesso>
   </aad>
   ```

## Next steps
- Continue back in [Configure Azure VPN Client – Microsoft Entra ID authentication – Windows](point-to-site-entra-vpn-client-windows.md#modify) to import your profile settings and connect to Azure.
- Learn more [About point-to-site connections](point-to-site-about.md).
