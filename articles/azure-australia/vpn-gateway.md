---
title: Azure VPN Gateway in Azure Australia
description: Implementing VPN Gateway in Azure Australia to be compliant with the ISM and effectively protect Australian Government agencies
author: galey801
ms.service: azure-australia
ms.topic: article
ms.date: 07/22/2019
ms.author: grgale
---

# Azure VPN Gateway in Azure Australia

A critical service with any public cloud is the secure connection of cloud resources and services to existing on-premises systems.  The service that provides this capability in Azure is the Azure VPN Gateway (VPN Gateway). This article outlines the key considerations with configuring the VPN Gateway to comply with the Australian Signals Directorate’s (ASD) [Information Security Manual Controls](https://acsc.gov.au/infosec/ism/) (ISM).

A VPN Gateway is used to send encrypted traffic between a virtual network in Azure and another network.  There are three scenarios addressed by VPN Gateways:

- **Site-to-Site** (S2S)
- **Point-to-Site** (P2S)
- **VNet-to-VNet**

This article will focus on S2S VPN Gateways. Diagram 1 shows an example Site-to-Site VPN gateway configuration.

![VPN Gateway with multi-site connections](media/vpngateway-multisite-connection-diagram.png)

*Diagram 1 – Azure Site-to-Site VPN Gateway*

## Key design considerations

There are three networking options to connect Azure to Australian Government customers:

- **ICON**
- **ExpressRoute**
- **Public internet**

The Australian Cyber Security Centre’s [Consumer Guide for Azure](https://servicetrust.microsoft.com/viewpage/Australia)  recommends that VPN Gateway (or equivalent PROTECTED certified third-party service) is used in conjunction with the three networking options to ensure that the connections comply with the ISM controls for encryption and integrity.

### Encryption and integrity

By default, the VPN negotiates the encryption and integrity algorithms and parameters during the connection establishment as part of the IKE handshakes.  During the IKE handshake, the configuration and order of preference will depend on whether the VPN Gateway is the initiator or the responder (NB: this is controlled via the VPN device).  The final configuration of the connection is controlled by the configuration of the VPN Device.  For details of validated VPN devices and their configuration see here: [About VPN Devices](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-devices)

VPN Gateways can control encryption and integrity by configuring a custom IPsec/IKE policy on the connection.

### Resource operations

VPN Gateways create a connection between Azure and non-Azure environments over the public internet.  The ISM has controls that relate to the explicit authorization of connections.  By default, it is possible to use VPN Gateways to create unauthorized tunnels into secure environments.  Therefore, it is critical that organizations use Azure Role Based Access Control (RBAC) to control who can create and modify VPN Gateways and their connections.  Azure has no “built-in” role to manage VPN Gateways therefore this will require a custom role.

Access to “Owner”, “Contributor” and “Network Contributor” roles is tightly controlled.  It is also recommended that Azure AD Privileged Identity Management is used for more granular access control.

### High availability

Azure VPN Gateways can have multiple connections (see Diagram 1) and support multiple on-premises VPN devices to the same on-premises environment.  

Virtual networks in Azure can have multiple VPN Gateways that can be deployed in independent, active-passive, or active-active configurations.

It is recommended that all VPN Gateways are deployed in a [highly available configuration](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-highlyavailable): for example, two on-premises VPN devices connected to two VPN Gateways in either active-passive or active-active  mode (See Diagram 2).

![VPN Gateway redundant connections](media/dual-redundancy.png)

*Diagram 2 – Active-active VPN Gateways and two VPN devices*

### Forced tunneling

Forced tunneling redirects or "forces" all Internet-bound traffic back to the on-premises environment via the VPN Gateway for inspection and auditing. Without forced tunneling, Internet-bound traffic from VMs in Azure traverses the Azure network infrastructure directly out to the public internet, without the option to inspect or audit the traffic.  This is critical when organization is required to use a Secure Internet Gateway (SIG) for an environment.

## Detailed configuration

### Service attributes

VPN Gateways for S2S connections configured for Australian Government need to have following attributes:

|Attribute | MUST|
|--- | --- |
|gatewayType | “VPN”|
|

Attribute settings required to comply with the ISM controls for Protected are:

|Attribute | MUST|
|--- |---|
|vpnType |“RouteBased”|
|vpnClientConfiguration/vpnClientProtocols | “IkeV2”|
|

Azure VPN Gateways support a range of cryptographic algorithms from the IPsec and IKE protocol standards.  The default policy sets maximise interoperability with a wide range of third-party VPN devices.  As a result, it is possible that during the IKE handshake a non-compliant configuration is negotiated.  It is, therefore, highly recommended that [custom IPsec/IKE policy](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-ipsecikepolicy-rm-powershell) parameters are applied to vpnClientConfiguration in VPN Gateways to ensure the connections meet the ISM controls for on-premise environment connections to Azure.  The key attributes are:

|Attribute|SHOULD|MUST|
|---|---|---|
|saLifeTimeSeconds|<14400 secs|>300 secs|
|saDataSizeKilobytes| |>1024 KB|
|ipsecEncryption| |AES256-GCMAES256|
|ipsecIntegrity| |SHA256-GCMAES256|
|ikeEncryption| |AES256-GCMAES256|
|ikeIntegrity| |SHA256-GCMAES256|
|dhGroup|DHGroup14, DHGroup24, ECP256, ECP384|DHGroup2|
|pfsGroup|PFS2048, PFS24, ECP256, ECP384||
|

*For dhGroup and pfsGroup in the above table, ECP256 and ECP384 are preferred even though other settings can be used*

### Related services

When designing and configuring an Azure VPN Gateway there are a number of related services that must also exist and be configured:

|Service | Action Required|
|--- | ---|
|Virtual Network | VPN Gateways are attached to a virtual network.  A virtual network needs to be created prior to the creation of a new VPN Gateway.|
|Public IP Address | S2S VPN Gateways need a public IP address to establish connectivity between the on-premises VPN device and the VPN Gateway.  A public IP address needs to create prior to creating a S2S VPN Gateway.|
|Subnet | A subnet of the virtual network needs to be created for the VPN Gateway.|
|

## Implementation steps using PowerShell

### Role-Based Access Control (RBAC)

1. Create custom role (for example, virtualNetworkGateway contributor).  Create a role to be assigned to users who will be allowed to create and modify VPN Gateways. The custom role should allow the following operations:

   Microsoft.Network/virtualNetworkGateways/*  
   Microsoft.Network/connections/*  
   Microsoft.Network/localnetworkgateways/*  
   Microsoft.Network/virtualNetworks/subnets/*  
   Microsoft.Network/publicIPAddresses/*  
   Microsoft.Network/publicIPPrefixes/*  
   Microsoft.Network/routeTables/*  

2. Add custom role to users who are allowed to create and manage VPN Gateways and connections to on-premises environments.

### Create VPN Gateway

*These steps assume a virtual network has already been created*

1. Create a new Public IP address
2. Create a VPN Gateway subnet
3. Create a VPN Gateway IP config
4. Create a VPN Gateway
5. Create a Local Network Gateway for the on-premises VPN device
6. Create an IPsec Policy (assuming using custom IPsec/IKE policies)
7. Create connection between VPN Gateway and Local Network Gateway using IPsec Policy

### Enforce tunneling

If forced tunneling is required, prior to creating the VPN Gateway:

1. Create route table and route rule(s)
2. Associate route table with the appropriate subnets

After creating the VPN Gateway:

1. Set GatewayDefaultSite to the on-premises environment on the VPN Gateway

### Example PowerShell Script

An example PowerShell Script for creating a custom IPSEC/IKE policy that complies with ISM controls for Australian PROTECTED security classification.

It assumes that the virtual network, VPN Gateway, and Local Gateways exist.

#### Create an IPsec/IKE policy

The following sample script creates an IPsec/IKE policy with the following algorithms and parameters:

- IKEv2: AES256, SHA256, DHGroup ECP256
- IPsec: AES256, SHA256, PFS ECP256, SA Lifetime 14,400 seconds & 102400000 KB

```powershell
$custompolicy = New-AzIpsecPolicy `
                    -IkeEncryption AES256 `
                    -IkeIntegrity SHA256 `
                    -DhGroup ECP256 `
                    -IpsecEncryption AES256 `
                    -IpsecIntegrity SHA256 `
                    -PfsGroup ECP256 `
                    -SALifeTimeSeconds 14400 `
                    -SADataSizeKilobytes 102400000
```

#### Create a S2S VPN connection with the custom IPsec/IKE policy

```powershell
$vpngw = Get-AzVirtualNetworkGateway `
                    -Name "<yourVPNGatewayName>" `
                    -ResourceGroupName "<yourResourceGroupName>"
$localgw = Get-AzLocalNetworkGateway  `
                    -Name "<yourLocalGatewayName>" `
                    -ResourceGroupName "<yourResourceGroupName>"

New-AzVirtualNetworkGatewayConnection `
                    -Name "ConnectionName" `
                    -ResourceGroupName "<yourResourceGroupName>" `
                    -VirtualNetworkGateway1 $vpngw `
                    -LocalNetworkGateway2 $localgw `
                    -Location "Australia Central" `
                    -ConnectionType IPsec `
                    -IpsecPolicies $custompolicy `
                    -SharedKey "AzureA1b2C3"
```

## Next steps

This article covered the specific configuration of VPN Gateway to meet the requirements specified in the Information Security Manual (ISM) for securing Australian Government PROTECTED data while in transit. For detailed steps to configure your VPN Gateway:

- [Azure Virtual Network Gateway Overview](https://docs.microsoft.com/azure/vpn-gateway/)  
- [What is VPN Gateway?](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways)  
- [Create a VNet with a Site-to-Site VPN connection using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell)  
- [Create and manage a VPN gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-tutorial-create-gateway-powershell)