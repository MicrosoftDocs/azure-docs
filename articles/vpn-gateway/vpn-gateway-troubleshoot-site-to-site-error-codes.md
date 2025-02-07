---
title: Troubleshoot Azure site-to-site issues using error codes
titleSuffix: Azure VPN Gateway
description: Common error codes and solutions for Azure VPN Gateway site-to-site connections.
author: fabferri
ms.service: azure-vpn-gateway
ms.topic: troubleshooting
ms.date: 09/20/2024
ms.author: fabferri
---
# Troubleshooting: Azure site-to-site VPN error codes

This article lists common site-to-site error codes that you might experience. It also discusses possible causes and solutions for these problems. If you know the error code, you can search for the solution on this page.

## Negotiation timed out (Error code: 13805, Hex: 0X35ED)

### Symptom

Connectivity failure.

### Cause

Customer's on-premises VPN device isn't responding to the connection requests (IKE protocol messages) from the Azure VPN gateway.

### Solution

To resolve this problem, follow these steps:

1. Check to make sure on-premises IP address is correctly configured on the Local Network Gateway resource in Azure 
1. Check to see if the on-premises VPN device is receiving the IKE messages from Azure VPN gateway.

   * If IKE packets aren't received on the on-premises gateway, check if there's an on-premises firewall dropping the IKE packets.
   * Check on-premises VPN device logs to find why the device isn't responding to the IKE messages from Azure VPN gateway. 
   * Take mitigation steps to ensure that on-premises device responds to Azure VPN Gateway IKE requests. Engage device vendor for help, as needed.

## IKE authentication credentials are unacceptable (Error code: 13801, Hex: 0X35E9)

### Symptom

Connectivity failure.

### Cause

Preshared key mismatch.

### Solution

Check to ensure that preshared key configured on the Azure connection resource matches the preshared key configured on the tunnel of the on-premises VPN device.

## Policy match error (Error code: 13868, Hex: 0X362C) / No policy configured (Error code: 13825, Hex: 0X3601)

### Symptom

Connectivity failure.

### Cause

IKE /IPSec policy mismatch.

### Solution

For custom policy configuration on the connection resource in Azure, check to ensure that the IKE policy that's configured on the tunnel of the on-premises VPN device has the same configuration.

For default policy configuration, check [configuration of IPsec/IKE connection policies](ipsec-ike-policy-howto.md) for site-to-site VPN & VNet-to-VNet to ensure the configuration on the tunnel of the on-premises VPN device has the matching configuration.

## Traffic selectors unacceptable (Error code: 13999, Hex: 0X36AF)

### Symptom

Connectivity failure.

### Cause

Traffic selector configuration mismatch.

### Solution

Check the on-premises device log to find why traffic selector configuration proposed by the Azure VPN gateway isn't accepted by the on-premises device. Use one of the following methods to resolve the issue:

* Fix the traffic selector configuration on the tunnel of the on-premises device.
* Configure policy-based traffic selector on the connection resource in Azure to keep the same configuration as on-premises device traffic selector. For more information, see [Connect VPN gateways to multiple on-premises policy-based VPN devices](vpn-gateway-connect-multiple-policybased-rm-ps.md#create-the-virtual-network-vpn-gateway-and-local-network-gateway).

## Invalid header (Error code: 13824, Hex: 0X3600)/ Invalid payload received (Error code: 13843, Hex: 0X3613)/ Invalid cookie received (13846, Hex: 0X3616)

### Symptom

Connectivity failure.

### Cause

The VPN gateway received unsupported IKE messages/protocols from the on-premises VPN device.

### Solution

1. Ensure on-premises device is among one of the supported devices. See [About VPN devices for connections](vpn-gateway-about-vpn-devices.md#devicetable).

1. Contact your on-premises device vendor for help.

## The recipient cannot handle version of IKE specified in the header (Error code: 13880, Hex: 0X3638)

### Symptom

Connectivity failure.

### Cause

IKE protocol version mismatch 

### Solution

Ensure that IKE protocol version (IKE v1 or IKE v2) is same on the connection resource in Azure and on the tunnel configuration of the on-premises VPN device.

## Failure in Diffie-Hellman computation (Error code: 13822, Hex: 0X35FE)

### Symptom

Connectivity failure.

### Cause

Failure in Diffie-Hellman computation.

### Solution

1. For custom policy configuration on the connection resource in Azure, check to ensure that the DH group configured on the tunnel of the on-premises VPN device has the same configuration.
1. For default DH group configuration, check the [configuration of IPsec/IKE connection policies for S2S VPN & VNet-to-VNet](ipsec-ike-policy-howto.md) to ensure the configuration on the tunnel of the on-premises VPN device has the matching configuration.
1. If this doesn't resolve the issue, engage your VPN device vendor for further investigation.

## The remote computer refused the network connection (Error code: 1225, Hex: 0X4C9)

### Symptom

Connectivity failure.

### Cause

The Azure connection resource is configured as Initiator only mode and might not accept any connection requests from the on-premises device.

### Solution

Update the connection mode property on the connection resource in Azure to **Default** or **Responder only**. For more information, see [Connection mode](vpn-gateway-about-vpn-gateway-settings.md#connectionmode) settings.

## Next steps

For more information about VPN Gateway troubleshooting, see [Troubleshooting site-to-site connections](vpn-gateway-troubleshoot-site-to-site-cannot-connect.md).