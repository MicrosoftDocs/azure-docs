---
title: "Troubleshoot Azure Communication Services direct routing TLS certificate and SIP OPTIONS issues"
ms.author: bobazile
ms.date: 06/22/2023
author: boris-bazilevskiy
manager: rcole
audience: ITPro
ms.topic: troubleshooting
ms.service: azure-communication-services
description: Learn how to troubleshoot Azure Communication Services direct routing connectivity with Session Border Controllers - TLS certificate and SIP OPTIONS issues.
---

# Session Border Controller (SBC) connectivity issues

When you set up a direct routing, you might experience the following Session Border Controller (SBC) connectivity issues:

- Session Initiation Protocol (SIP) OPTIONS aren't received.
- Transport Layer Security (TLS) connections problems occur.
- The SBC doesn't respond.
- The SBC is marked as inactive in the Azure portal.

The following conditions are most likely to cause such issues:

- A TLS certificate experiences problems.
- An SBC isn't configured correctly for direct routing.

This article lists some common issues that are related to SIP OPTIONS and TLS certificates, and provides resolutions that you can try.  

## Overview of the SIP OPTIONS process

- The SBC sends a TLS connection request that includes a TLS certificate to the SIP proxy server Fully Qualified Domain Name (FQDN) (for example, **sip.pstnhub.microsoft.com**).

- The SIP proxy checks the connection request.

  - If the request isn't valid, the TLS connection is closed and the SIP proxy doesn't receive SIP OPTIONS from the SBC.
  - If the request is valid, the TLS connection is established, and the SBC sends SIP OPTIONS to the SIP proxy.

- After SIP proxy receives SIP OPTIONS, it checks the Record-Route to determine whether the SBC FQDN belongs to a known Communication resource. If the FQDN information isn't detected there, the SIP proxy checks the Contact header.

- If the SBC FQDN is detected and recognized, the SIP proxy sends a **200 OK** message by using the same TLS connection.

- The SIP proxy sends SIP OPTIONS to the SBC FQDN that is listed in the Contact header of the SIP options received from the SBC.

- After receiving SIP OPTIONS from the SIP proxy, the SBC responds by sending a **200 OK** message. This step confirms that the SBC is healthy.

- As the final step, the SBC is marked as **Online** in the Azure portal.

## SIP OPTIONS issues

After the TLS connection is successfully established, and the SBC is able to send and receive messages to and from the SIP proxy, there might still be problems that affect the format or content of SIP OPTIONS.

### SBC doesn't receive a "200 OK" response from SIP proxy

This situation might occur if you’re using an older version of TLS. To enforce stricter security, enable TLS 1.2.

Make sure that your SBC certificate isn't self-signed and that you got it from a [trusted Certificate Authority (CA)](../direct-routing-infrastructure.md#sbc-certificates-and-domain-names).

If you’re using TLS version 1.2 or higher, and your SBC certificate is valid, then the issue might occur because the FQDN is misconfigured in your SIP profile and not recognized as belonging to any Communication resource. Check for the following conditions, and fix any errors that you find:

- The FQDN provided by the SBC in the Record-Route or Contact header is different from what is configured in Azure Communication resource.
- The Contact header contains an IP address instead of the FQDN.
- The domain isn’t [fully validated](../../../how-tos/telephony/domain-validation.md). If you add an FQDN that wasn’t validated previously, you must validate it.

### SBC receives "200 OK" response but not SIP OPTIONS

The SBC receives the **200 OK** response from the SIP proxy but not the SIP OPTIONS that were sent from the SIP proxy. If this error occurs, make sure that the FQDN that's listed in the Record-Route or Contact header is correct and resolves to the correct IP address.

Another possible cause for this issue might be firewall rules that are preventing incoming traffic. Make sure that firewall rules are configured to allow incoming connections from all [SIP proxy signaling IP addresses](../direct-routing-infrastructure.md#sip-signaling-fqdns).

### SBC status is intermittently inactive

This issue might occur if:
  
- The SBC is configured to send SIP OPTIONS not to FQDNs but to the specific IP addresses that they resolve to. During maintenance or outages, these IP addresses might change to a different datacenter. Therefore, the SBC is sending SIP OPTIONS to an inactive or unresponsive datacenter. To resolve the issue:

   - Make sure that the SBC is discoverable and configured to send SIP OPTIONS to only FQDNs.
   - Make sure that all devices in the route, such as SBCs and firewalls, are configured to allow communication to and from all Microsoft SIP signaling FQDNs.
   - To provide a failover option when the connection from an SBC is made to a datacenter that's experiencing an issue, the SBC must be configured to use all three SIP proxy FQDNs:

     - sip.pstnhub.microsoft.com
     - sip2.pstnhub.microsoft.com
     - sip3.pstnhub.microsoft.com

     > [!NOTE]
     > Devices that support DNS names can use sip-all.pstnhub.microsoft.com to resolve to all possible IP addresses.

   For more information, see [SIP Signaling: FQDNs](../direct-routing-infrastructure.md#sip-signaling-fqdns).

- The installed root or intermediate certificate isn't part of the SBC certificate chain issuer. When the SBC starts the three-way handshake during the authentication process, the Azure service is unable to validate the certificate chain on the SBC and resets the connection. The SBC may be able to authenticate again as soon as the public root certificate is loaded again on the service cache or the certificate chain is fixed on the SBC. Make sure that the intermediate and root certificates installed on the SBC are correct.
  
  For more information about certificates, see [SBC certificates and domain names](../direct-routing-infrastructure.md#sbc-certificates-and-domain-names).
  
### FQDN doesn’t match the contents of CN or SAN in the provided certificate

This issue occurs if a wildcard doesn't match a lower-level subdomain. For example, the wildcard `\*\.contoso.com` would match `sbc1.contoso.com`, but not `sbc.acs.contoso.com`. You can't have multiple levels of subdomains under a wildcard. If the FQDN doesn’t match the Common Name (CN) or Subject Alternate Name (SAN) in the provided certificate, request a new certificate that matches your domain names.

For more information about certificates, see [SBC certificates and domain names](../direct-routing-infrastructure.md#sbc-certificates-and-domain-names).

## TLS connection issues

If the TLS connection is closed right away and SIP OPTIONS aren't received from the SBC, or if **200 OK** isn't received from the SBC, then the problem might be with the TLS version. The TLS version configured on the SBC should be 1.2 or higher.

### SBC certificate is self-signed or not from a trusted CA

If the SBC certificate is self-signed, it isn't valid. Make sure that the SBC certificate is obtained from a trusted Certificate Authority (CA).

For a list of supported CAs, see [SBC certificates and domain names](../direct-routing-infrastructure.md#sbc-certificates-and-domain-names).

### SBC doesn't trust SIP proxy certificate

If the SBC doesn't trust the SIP proxy certificate, download and install the Baltimore CyberTrust root certificate **and** he DigiCert Global Root G2 certificates on the SBC. To download those certificates, see [Microsoft 365 encryption chains](/microsoft-365/compliance/encryption-office-365-certificate-chains).

For a list of supported CAs, see [SBC certificates and domain names](../direct-routing-infrastructure.md#sbc-certificates-and-domain-names).

### SBC certificate is invalid

If the SBC connection status in the Azure portal indicates that the SBC certificate is expired, request or renew the certificate from a trusted Certificate Authority (CA). Then, install it on the SBC. For a list of supported CAs, see [SBC certificates and domain names](../direct-routing-infrastructure.md#sbc-certificates-and-domain-names).
  
When you renew the SBC certificate, you must remove the TLS connections that were established from the SBC to Microsoft with the old certificate and re-establish them with the new certificate. Doing so ensures that certificate expiration warnings aren't triggered in Azure portal.
To remove the old TLS connections, restart the SBC during a time frame that has low traffic such as a maintenance window. If you can't restart the SBC, contact the vendor for instructions to force the closure of all old TLS connections.

### SBC certificate or intermediary certificates are missing in the SBC TLS "Hello" message

Check that a valid SBC certificate and all required intermediate certificates are installed correctly, and that the TLS connection settings on the SBC are correct.

Sometimes, even if everything looks correct, a closer examination of the packet capture might reveal that the TLS certificate isn't provided to the Microsoft infrastructure.

### SBC connection is interrupted

The TLS connection is interrupted or not set up even though the certificates and SBC settings experience no issues.

One of the intermediary devices (such as a firewall or a router) on the path between the SBC and the Microsoft network might close the TLS connection. Check for any connection issues within your managed network, and fix them.

## Related articles

- [Monitor direct routing](./monitor-direct-routing.md)
- [Plan for Azure direct routing](../direct-routing-infrastructure.md)
- [Pair the Session Border Controller and configure voice routing](../direct-routing-provisioning.md)
- [Outbound call to a phone number](../../../quickstarts/telephony/pstn-call.md)