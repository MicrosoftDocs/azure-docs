---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 08/07/2023
 ms.author: cherylmc

---
P2S Azure certificate authentication connections use the following items:

* A route-based VPN gateway (not policy-based). For more information about VPN type, see [VPN Gateway settings](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#vpntype).
* The public key (.cer file) for a root certificate, which is uploaded to Azure. Once the certificate is uploaded, it's considered a trusted certificate and is used for authentication.
* A client certificate that is generated from the root certificate. The client certificate installed on each client computer that will connect to the VNet. This certificate is used for client authentication.
* VPN client configuration files. The VPN client is configured using VPN client configuration files. These files contain the necessary information for the client to connect to the VNet. Each client that connects must be configured using the settings in the configuration files.
