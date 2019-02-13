---
title: 'Transition from self-signed to public CA certificates for P2S gateways| Azure VPN Gateway | Microsoft Docs'
description: This article helps you successfully transition to the new public CA certificates for P2S gateways.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 02/11/2019
ms.author: cherylmc

---
# Transition from self-signed to public CA certificates for P2S gateways

Azure VPN Gateway no longer issues self-signed certificates to gateways for P2S connections. Issued certificates are now signed by a public Certificate Authority (CA). However, older gateways may still be using self-signed certificates. These self-signed certificates are near their expiration dates and must transition to public CA certificates.

Previously, self-signed certificate for the gateway needed to be updated every 18 months. VPN client configuration files then had to be generated and redeployed to all P2S clients. Moving to public CA certificates eliminates this limitation. In addition to the transition for certificates, this change also provides platform improvements, better metrics, and improved stability.

Only older gateways are affected by this change. If your gateway certificate needs to be transitioned, you will receive communication or toast in the Azure portal. You can check to see if your gateway is affected by using the steps in this article.

>[!IMPORTANT]
>The transition is scheduled for March 12,2019 starting at 18:00 UTC. You can create a support case if you prefer a different time window. You can request one of the following windows:
>
>* 06:00 UTC on 25 Feb
>* 18:00 UTC on 25 Feb
>* 06:00 UTC on 1 Mar
>* 18:00 UTC on 1 Mar
>
>**All remaining gateways will transition on March 12, 2019 starting at 18:00 UTC**.
>

## 1. Verify your certificate

1. Check to see if you are affected by this update. Download your current VPN client configuration using the steps in [this article](point-to-site-vpn-client-configuration-azure-cert.md).

2. Open or extract the zip file and browse to the “Generic” folder. In the Generic folder, you will see two files, one of which is *VPNSettings.xml*.
3. Open *VPNSettings.xml* in any xml viewer/editor. In the xml file, search for the following fields:

  * `<ServerCertRootCn>DigiCert Global Root CA</ServerCertRootCn>`
  * `<ServerCertIssuerCn>DigiCert Global Root CA</ServerCertIssuerCn>`
4. If *ServerCertRotCn* and *ServerCertIssuerCn* are “DigiCert Global Root CA”, you are not affected by this update and you don't need to proceed with steps in this article. However, if they show something else, your gateway certificate is part of the update and will be transitioned.

## 2. Check certificate transition schedule

If your certificate is part of the update, your gateway certificate will be transitioned. Refer to the **Important** note for transition times. After the update, P2S clients won't be able to connect using their old profile. You must generate new VPN client profiles and install them on clients.

## 3. Generate VPN client configuration profile

Once the certificate has been transitioned, download the new VPN profile (VPN client configuration files) from the Azure portal. For steps, see [Create and install VPN client configuration files](point-to-site-vpn-client-configuration-azure-cert.md). You do not need to generate new client certificates.

## 4. Deploy VPN client profile

Deploy the new profile to all point-to-site VPN clients. VPN clients will lose connectivity until the new VPN profile for point-to-site connections is downloaded and deployed to client devices. The client certificates that are already installed on VPN client computers do not need to be reissued.

## 5. Connect the VPN client

Connect to Azure from the VPN client as you normally would.
