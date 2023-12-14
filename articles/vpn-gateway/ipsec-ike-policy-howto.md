---
title: 'Configure custom IPsec/IKE connection policies for S2S VPN & VNet-to-VNet: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to configure IPsec/IKE custom policy for S2S or VNet-to-VNet connections with Azure VPN Gateways using the Azure portal.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 01/30/2023
ms.author: cherylmc

---
# Configure custom IPsec/IKE connection policies for S2S VPN and VNet-to-VNet: Azure portal

This article walks you through the steps to configure IPsec/IKE policy for VPN Gateway Site-to-Site VPN or VNet-to-VNet connections using the Azure portal. The following sections help you create and configure an IPsec/IKE policy, and apply the policy to a new or existing connection.

## <a name ="workflow"></a>Workflow

The instructions in this article help you set up and configure IPsec/IKE policies as shown in the following diagram.

:::image type="content" source="./media/ipsec-ike-policy-howto/policy-diagram.png" alt-text="Diagram shows IPsec/IKE policy." border="false" lightbox="./media/ipsec-ike-policy-howto/policy-diagram.png":::

1. Create a virtual network and a VPN gateway.
1. Create a local network gateway for cross premises connection, or another virtual network and gateway for VNet-to-VNet connection.
1. Create a connection (IPsec or VNet2VNet).
1. Configure/update/remove the IPsec/IKE policy on the connection resources.

## Policy parameters

[!INCLUDE [IPsec policy parameters](../../includes/vpn-gateway-ipsec-policy-parameters-include.md)]

### Cryptographic algorithms & key strengths

The following table lists the supported configurable cryptographic algorithms and key strengths.

[!INCLUDE [Algorithm and keys table](../../includes/vpn-gateway-ipsec-ike-algorithm-include.md)]

[!INCLUDE [Important requirements table](../../includes/vpn-gateway-ipsec-ike-requirements-include.md)]

> [!NOTE]
> IKEv2 Integrity is used for both Integrity and PRF(pseudo-random function). 
> If IKEv2 Encryption  algorithm specified is GCM*, the value passed in IKEv2 Integrity is used for PRF only and implicitly we set IKEv2 Integrity to GCM*. In all other cases, the value passed in IKEv2 Integrity is used for both IKEv2 Integrity and PRF.
>

### Diffie-Hellman groups

The following table lists the corresponding Diffie-Hellman groups supported by the custom policy:

[!INCLUDE [Diffie-Hellman groups](../../includes/vpn-gateway-ipsec-ike-diffie-hellman-include.md)]

Refer to [RFC3526](https://tools.ietf.org/html/rfc3526) and [RFC5114](https://tools.ietf.org/html/rfc5114) for more details.

## <a name="crossprem"></a>Create S2S VPN connection with custom policy

This section walks you through the steps to create a Site-to-Site VPN connection with an IPsec/IKE policy. The following steps create the connection as shown in the following diagram:

:::image type="content" source="./media/ipsec-ike-policy-howto/site-to-site-diagram.png" alt-text="Site-to-Site policy" border="false" lightbox="./media/ipsec-ike-policy-howto/site-to-site-diagram.png":::

### Step 1: Create the virtual network, VPN gateway, and local network gateway for TestVNet1

Create the following resources.For steps, see [Create a Site-to-Site VPN connection](./tutorial-site-to-site-portal.md).

1. Create the virtual network **TestVNet1** using the following values.

   * **Resource group:** TestRG1
   * **Name:** TestVNet1
   * **Region:** (US) East US
   * **IPv4 address space:** 10.1.0.0/16
   * **Subnet 1 name:** FrontEnd
   * **Subnet 1 address range:** 10.1.0.0/24
   * **Subnet 2 name:** BackEnd
   * **Subnet 2 address range:** 10.1.1.0/24

1. Create the virtual network gateway **VNet1GW** using the following values.

   * **Name:** VNet1GW
   * **Region:** East US
   * **Gateway type:** VPN
   * **VPN type:** Route-based
   * **SKU:** VpnGw2
   * **Generation:** Generation 2
   * **Virtual network:** VNet1
   * **Gateway subnet address range:** 10.1.255.0/27
   * **Public IP address type:** Basic or Standard
   * **Public IP address:** Create new
   * **Public IP address name:** VNet1GWpip
   * **Enable active-active mode:** Disabled
   * **Configure BGP:** Disabled

### Step 2: Configure the local network gateway and connection resources

1. Create the local network gateway resource **Site6** using the following values.

   * **Name:** Site6
   * **Resource Group:** TestRG1
   * **Location:** East US
   * **Local gateway IP address:** 5.4.3.2 (example value only - use the IP address of your on-premises device)
   * **Address Spaces** 10.61.0.0/16, 10.62.0.0/16 (example  value only)

1. From the virtual network gateway, add a connection to the local network gateway using the following values.

   * **Connection name:** VNet1toSite6
   * **Connection type:** IPsec
   * **Local network gateway:** Site6
   * **Shared key:** abc123  (example value - must match the on-premises device key used)
   * **IKE protocol:** IKEv2

### Step 3: Configure a custom IPsec/IKE policy on the S2S VPN connection

Configure a custom IPsec/IKE policy with the following algorithms and parameters:

* IKE Phase 1: AES256, SHA384, DHGroup24
* IKE Phase 2(IPsec): AES256, SHA256, PFS None
* IPsec SA Lifetime in KB: 102400000
* IPsec SA lifetime in seconds: 30000
* DPD timeout: 45 seconds

1. Go to the **Connection** resource you created, **VNet1toSite6**. Open the **Configuration** page. Select **Custom** IPsec/IKE policy to show all configuration options. The following screenshot shows the configuration according to the list:

   :::image type="content" source="./media/ipsec-ike-policy-howto/configuration-connection.png" alt-text="Screenshot shows the Site 6 connection configuration." lightbox="./media/ipsec-ike-policy-howto/configuration-connection.png":::

   If you use GCMAES for IPsec, you must use the same GCMAES algorithm and key length for both IPsec encryption and integrity. For example, the following screenshot specifies GCMAES128 for both IPsec encryption and IPsec integrity:

   :::image type="content" source="./media/ipsec-ike-policy-howto/gcmaes.png" alt-text="Screenshot shows GCMAES for IPsec." lightbox="./media/ipsec-ike-policy-howto/gcmaes.png":::

1. If you want to enable Azure VPN gateway to connect to policy-based on-premises VPN devices, you can select **Enable** for the **Use policy based traffic selectors** option.

1. Once all the options are selected, select **Save** to commit the changes to the connection resource. The policy will be enforced in about a minute.

   > [!IMPORTANT]
   >
   > * Once an IPsec/IKE policy is specified on a connection, the Azure VPN gateway will only send or accept the IPsec/IKE proposal with specified cryptographic algorithms and key strengths on that particular connection. Make sure your on-premises VPN device for the connection uses or accepts the exact policy combination, otherwise the S2S VPN tunnel will not establish.
   >
   > * **Policy-based traffic selector** and **DPD timeout** options can be specified with **Default** policy, without the custom IPsec/IKE policy.
   >

## Create VNet-to-VNet connection with custom policy

The steps to create a VNet-to-VNet connection with an IPsec/IKE policy are similar to that of an S2S VPN connection. You must complete the previous sections in [Create an S2S vpn connection](#crossprem) to create and configure TestVNet1 and the VPN gateway.

:::image type="content" source="./media/ipsec-ike-policy-howto/vnet-policy.png" alt-text="Screenshot shows VNet-to-VNet policy diagram." border="false" lightbox="./media/ipsec-ike-policy-howto/vnet-policy.png":::

### Step 1: Create the virtual network, VPN gateway, and local network gateway for TestVNet2

Use the steps in the [Create a VNet-to-VNet connection](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article to create TestVNet2 and create a VNet-to-VNet connection to TestVNet1.

Example values:

**Virtual network** TestVNet2

* **Resource group:** TestRG2
* **Name:** TestVNet2
* **Region:** (US) West US
* **IPv4 address space:** 10.2.0.0/16
* **Subnet 1 name:** FrontEnd
* **Subnet 1 address range:** 10.2.0.0/24
* **Subnet 2 name:** BackEnd
* **Subnet 2 address range:** 10.2.1.0/24

**VPN gateway:** VNet2GW

* **Name:** VNet2GW
* **Region:** West US
* **Gateway type:** VPN
* **VPN type:** Route-based
* **SKU:** VpnGw2
* **Generation:** Generation 2
* **Virtual network:** TestVNet2
* **Gateway subnet address range:** 10.2.255.0/27
* **Public IP address type:** Basic or Standard
* **Public IP address:** Create new
* **Public IP address name:** VNet2GWpip
* **Enable active-active mode:** Disabled
* **Configure BGP:** Disabled

### Step 2: Configure the VNet-to-VNet connection

1. From the VNet1GW gateway, add a VNet-to-VNet connection to VNet2GW, **VNet1toVNet2**.

1. Next, from the VNet2GW, add a VNet-to-VNet connection to VNet1GW, **VNet2toVNet1**.

1. After you add the connections, you'll see the VNet-to-VNet connections as shown in the following screenshot from the VNet2GW resource:

   :::image type="content" source="./media/ipsec-ike-policy-howto/vnet-connections.png" alt-text="Screenshot shows VNet-to-VNet connections." border="false" lightbox="./media/ipsec-ike-policy-howto/vnet-connections.png":::

### Step 3: Configure a custom IPsec/IKE policy on VNet1toVNet2

1. From the **VNet1toVNet2** connection resource, go to the **Configuration** page.

1. For **IPsec / IKE policy**, select **Custom** to show the custom policy options. Select the cryptographic algorithms with the corresponding key lengths. This policy doesn't need to match the previous policy you created for the VNet1toSite6 connection.

   Example values:

   * IKE Phase 1: AES128, SHA1, DHGroup14
   * IKE Phase 2(IPsec): GCMAES128, GCMAES128, PFS2048
   * IPsec SA Lifetime in KB: 102400000
   * IPsec SA lifetime in seconds: 14400
   * DPD timeout: 45 seconds

1. Select **Save** at the top of the page to apply the policy changes on the connection resource.

### Step 4: Configure a custom IPsec/IKE policy on VNet2toVNet1

1. Apply the same policy to the VNet2toVNet1 connection, VNet2toVNet1. If you don't, the IPsec/IKE VPN tunnel won't connect due to policy mismatch.

   > [!IMPORTANT]
   > Once an IPsec/IKE policy is specified on a connection, the Azure VPN gateway will only send or accept
   > the IPsec/IKE proposal with specified cryptographic algorithms and key strengths on that particular
   > connection. Make sure the IPsec policies for both connections are the same, otherwise the
   > VNet-to-VNet connection will not establish.

1. After you complete these steps, the connection is established in a few minutes, and you'll have the following network topology.

   :::image type="content" source="./media/ipsec-ike-policy-howto/policy-diagram.png" alt-text="Diagram shows IPsec/IKE policy." border="false" lightbox="./media/ipsec-ike-policy-howto/policy-diagram.png":::

## To remove custom policy from a connection

1. To remove a custom policy from a connection, go to the connection resource.
1. On the **Configuration** page, change the IPse /IKE policy from **Custom** to **Default**. This will remove all custom policy previously specified on the connection, and restore the Default IPsec/IKE settings on this connection.
1. Select **Save** to remove the custom policy and restore the default IPsec/IKE settings on the connection.

## IPsec/IKE policy FAQ

To view frequently asked questions, go to the IPsec/IKE policy section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#ipsecike).

## Next steps

See [Connect multiple on-premises policy-based VPN devices](vpn-gateway-connect-multiple-policybased-rm-ps.md) for more details regarding policy-based traffic selectors.
