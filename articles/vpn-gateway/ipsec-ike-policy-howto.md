---
title: 'IPsec/IKE policy for S2S VPN & VNet-to-VNet connections: Azure portal'
titleSuffix: Azure VPN Gateway
description: Configure IPsec/IKE policy for S2S or VNet-to-VNet connections with Azure VPN Gateways using Azure Resource Manager and Azure portal.
services: vpn-gateway
author: yushwang

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/18/2020
ms.author: yushwang

---
# Configure IPsec/IKE policy for S2S VPN or VNet-to-VNet connections: Azure portal

This article walks you through the steps to configure IPsec/IKE policy for VPN Gateway Site-to-Site VPN or VNet-to-VNet connections using the Azure portal. The following sections help you create and configure an IPsec/IKE policy, and apply the policy to a new or existing connection.

## <a name="about"></a>About IPsec and IKE policy parameters

IPsec and IKE protocol standard supports a wide range of cryptographic algorithms in various combinations. Refer to [About cryptographic requirements and Azure VPN gateways](vpn-gateway-about-compliance-crypto.md) to see how this can help ensure cross-premises and VNet-to-VNet connectivity to satisfy your compliance or security requirements.

This article provides instructions to create and configure an IPsec/IKE policy, and apply it to a new or existing VPN Gateway connection.

### Considerations

* IPsec/IKE policy only works on the following gateway SKUs:
  * ***VpnGw1~5 and VpnGw1AZ~5AZ***
  * ***Standard*** and ***HighPerformance***
* You can only specify ***one*** policy combination for a given connection.
* You must specify all algorithms and parameters for both IKE (Main Mode) and IPsec (Quick Mode). Partial policy specification is not allowed.
* Consult with your VPN device vendor specifications to ensure the policy is supported on your on-premises VPN devices. S2S or VNet-to-VNet connections cannot establish if the policies are incompatible.

## <a name ="workflow"></a>Workflow

This section outlines the workflow to create and update IPsec/IKE policy on a S2S VPN or VNet-to-VNet connection:

1. Create a virtual network and a VPN gateway.
2. Create a local network gateway for cross premises connection, or another virtual network and gateway for VNet-to-VNet connection.
3. Create a connection (IPsec or VNet2VNet).
4. Configure/update/remove the IPsec/IKE policy on the connection resources.

The instructions in this article help you set up and configure IPsec/IKE policies as shown in the diagram:

:::image type="content" source="./media/ipsec-ike-policy-howto/policy-diagram.png" alt-text="IPsec/IKE policy diagram" border="false":::

## <a name ="params"></a>Supported cryptographic algorithms & key strengths

### <a name ="table1"></a>Algorithms and keys

The following table lists the supported cryptographic algorithms and key strengths configurable by the customers:

| **IPsec/IKE**    | **Options**    |
| ---              | ---            |
| IKE Encryption   | AES256, AES192, AES128, DES3, DES                  |
| IKE Integrity    | SHA384, SHA256, SHA1, MD5                          |
| DH Group         | DHGroup24, ECP384, ECP256, DHGroup14, DHGroup2048, DHGroup2, DHGroup1, None |
| IPsec Encryption | GCMAES256, GCMAES192, GCMAES128, AES256, AES192, AES128, DES3, DES, None    |
| IPsec Integrity  | GCMASE256, GCMAES192, GCMAES128, SHA256, SHA1, MD5 |
| PFS Group        | PFS24, ECP384, ECP256, PFS2048, PFS2, PFS1, None   |
| QM SA Lifetime   | (**Optional**: default values are used if not specified)<br>Seconds (integer; **min. 300**/default 27000 seconds)<br>KBytes (integer; **min. 1024**/default 102400000 KBytes)    |
| Traffic Selector | UsePolicyBasedTrafficSelectors** ($True/$False; **Optional**, default $False if not specified)    |
| DPD timeout      | Seconds (integer: min. 9/max. 3600; default 45 seconds) |
|  |  |

#### Important requirements

* Your on-premises VPN device configuration must match or contain the following algorithms and parameters that you specify on the Azure IPsec/IKE policy:
  * IKE encryption algorithm (Main Mode / Phase 1)
  * IKE integrity algorithm (Main Mode / Phase 1)
  * DH Group (Main Mode / Phase 1)
  * IPsec encryption algorithm (Quick Mode / Phase 2)
  * IPsec integrity algorithm (Quick Mode / Phase 2)
  * PFS Group (Quick Mode / Phase 2)>    * Traffic Selector (if UsePolicyBasedTrafficSelectors is used)
  * The SA lifetimes are local specifications only, do not need to match.

* If GCMAES is used as for IPsec Encryption algorithm, you must select the same GCMAES algorithm and key length for IPsec Integrity; for example, using GCMAES128 for both.

* In the [algorithms and keys table](#table1) above:
  * IKE corresponds to Main Mode or Phase 1
  * IPsec corresponds to Quick Mode or Phase 2
  * DH Group specifies the Diffie-Hellmen Group used in Main Mode or Phase 1
  * PFS Group specified the Diffie-Hellmen Group used in Quick Mode or Phase 2

* IKE Main Mode SA lifetime is fixed at 28,800 seconds on the Azure VPN gateways.

* If you set **UsePolicyBasedTrafficSelectors** to $True on a connection, it will configure the Azure VPN gateway to connect to policy-based VPN firewall on premises. If you enable PolicyBasedTrafficSelectors, you need to ensure your VPN device has the matching traffic selectors defined with all combinations of your on-premises network (local network gateway) prefixes to/from the Azure virtual network prefixes, instead of any-to-any. For example, if your on-premises network prefixes are 10.1.0.0/16 and 10.2.0.0/16, and your virtual network prefixes are 192.168.0.0/16 and 172.16.0.0/16, you need to specify the following traffic selectors:
  * 10.1.0.0/16 <====> 192.168.0.0/16
  * 10.1.0.0/16 <====> 172.16.0.0/16
  * 10.2.0.0/16 <====> 192.168.0.0/16
  * 10.2.0.0/16 <====> 172.16.0.0/16

   For more information regarding policy-based traffic selectors, see [Connect multiple on-premises policy-based VPN devices](vpn-gateway-connect-multiple-policybased-rm-ps.md).

* DPD timeout - The default value is 45 seconds on Azure VPN gateways. Setting the timeout to shorter periods will cause IKE to rekey more aggressively, causing the connection to appear to be disconnected in some instances. This may not be desirable if your on-premises locations are farther away from the Azure region where the VPN gateway resides, or the physical link condition could incur packet loss. The general recommendation is to set the timeout between **30 to 45** seconds.

### Diffie-Hellman Groups

The following table lists the corresponding Diffie-Hellman Groups supported by the custom policy:

| **Diffie-Hellman Group**  | **DHGroup**              | **PFSGroup** | **Key length** |
| --- | --- | --- | --- |
| 1                         | DHGroup1                 | PFS1         | 768-bit MODP   |
| 2                         | DHGroup2                 | PFS2         | 1024-bit MODP  |
| 14                        | DHGroup14<br>DHGroup2048 | PFS2048      | 2048-bit MODP  |
| 19                        | ECP256                   | ECP256       | 256-bit ECP    |
| 20                        | ECP384                   | ECP384       | 384-bit ECP    |
| 24                        | DHGroup24                | PFS24        | 2048-bit MODP  |

Refer to [RFC3526](https://tools.ietf.org/html/rfc3526) and [RFC5114](https://tools.ietf.org/html/rfc5114) for more details.

## <a name ="S2S"></a>S2S VPN with IPsec/IKE policy

This section walks you through the steps to create a Site-to-Site VPN connection with an IPsec/IKE policy. The following steps create the connection as shown in the following diagram:

:::image type="content" source="./media/ipsec-ike-policy-howto/site-to-site-diagram.png" alt-text="Site-to-Site policy" border="false":::

### <a name="createvnet1"></a>Step 1 - Create the virtual network, VPN gateway, and local network gateway

Create the following resources, as shown in the screenshots below. For steps, see [Create a Site-to-Site VPN connection](./tutorial-site-to-site-portal.md).

* **Virtual network:**  TestVNet1

   :::image type="content" source="./media/ipsec-ike-policy-howto/testvnet-1.png" alt-text="VNet":::

* **VPN gateway:** VNet1GW

   :::image type="content" source="./media/ipsec-ike-policy-howto/vnet-1-gateway.png" alt-text="Gateway":::

* **Local network gateway:** Site6

   :::image type="content" source="./media/ipsec-ike-policy-howto/lng-site-6.png" alt-text="Site":::

* **Connection:** VNet1 to Site6

    :::image type="content" source="./media/ipsec-ike-policy-howto/connection-site-6.png" alt-text="Connection":::

### <a name="s2sconnection"></a>Step 2 - Configure IPsec/IKE policy on the S2S VPN connection

In this section, configure an IPsec/IKE policy with the following algorithms and parameters:

* IKE:   AES256, SHA384, DHGroup24, DPD timeout 45 seconds
* IPsec: AES256, SHA256, PFS None, SA Lifetime 30000 seconds and 102400000KB

1. Navigate to the connection resource, **VNet1toSite6**, in the Azure portal. Select **Configuration** page and select **Custom** IPsec/IKE policy to show all configuration options. The screenshot below shows the configuration according to the list:

    :::image type="content" source="./media/ipsec-ike-policy-howto/policy-site-6.png" alt-text="Site 6":::

1. If you use GCMAES for IPsec, you must use the same GCMAES algorithm and key length for both IPsec encryption and integrity. For example, the screenshot below specifies GCMAES128 for both IPsec encryption and IPsec integrity:

   :::image type="content" source="./media/ipsec-ike-policy-howto/gcmaes.png" alt-text="GCMAES for IPsec":::

1. You can optionally select **Enable** for the **Use policy based traffic selectors** option to enable Azure VPN gateway to connect to policy-based VPN devices on premises, as described above.

   :::image type="content" source="./media/ipsec-ike-policy-howto/policy-based-selector.png" alt-text="Policy based traffic selector":::

1. Once all the options are selected, select **Save** to commit the changes to the connection resource. The policy will be enforced in about a minute.

> [!IMPORTANT]
>
> * Once an IPsec/IKE policy is specified on a connection, the Azure VPN gateway will only send or accept the IPsec/IKE proposal with specified cryptographic algorithms and key strengths on that particular connection. Make sure your on-premises VPN device for the connection uses or accepts the exact policy combination, otherwise the S2S VPN tunnel will not establish.
>
> * **Policy-based traffic selector** and **DPD timeout** options can be specified with **Default** policy, without the custom IPsec/IKE policy as shown in the screenshot above.
>

## <a name ="vnet2vnet"></a>VNet-to-VNet with IPsec/IKE policy

The steps to create a VNet-to-VNet connection with an IPsec/IKE policy are similar to that of an S2S VPN connection.

:::image type="content" source="./media/ipsec-ike-policy-howto/vnet-policy.png" alt-text="VNet-to-VNet policy diagram" border="false":::

1. Use the steps in the [Create a VNet-to-VNet connection](vpn-gateway-vnet-vnet-rm-ps.md) article to create your VNet-to-VNet connection.

2. After completing the steps, you will see two VNet-to-VNet connections as shown in the screenshot below from the VNet2GW resource:

   :::image type="content" source="./media/ipsec-ike-policy-howto/vnet-vnet-connections.png" alt-text="VNet-to-VNet connections":::

3. Navigate to the connection resource, and go to the **Configuration** page on the portal. Select **Custom** on the **IPsec/IKE policy** to show the custom policy options. Select the cryptographic algorithms with the corresponding key lengths.

   The screenshot shows a different IPsec/IKE policy with the following algorithms and parameters:
   * IKE: AES128, SHA1, DHGroup14, DPD timeout 45 seconds
   * IPsec: GCMAES128, GCMAES128, PFS14, SA Lifetime 14400 seconds & 102400000KB

   :::image type="content" source="./media/ipsec-ike-policy-howto/vnet-vnet-policy.png" alt-text="Connection policy":::

4. Select **Save** to apply the policy changes on the connection resource.

5. Apply the same policy to the other connection resource, VNet2toVNet1. If you don't, the IPsec/IKE VPN tunnel will not connect due to policy mismatch.

   > [!IMPORTANT]
   > Once an IPsec/IKE policy is specified on a connection, the Azure VPN gateway will only send or accept
   > the IPsec/IKE proposal with specified cryptographic algorithms and key strengths on that particular
   > connection. Make sure the IPsec policies for both connections are the same, otherwise the
   > VNet-to-VNet connection will not establish.

6. After completing these steps, the connection is established in a few minutes, and you will have the following network topology:

    :::image type="content" source="./media/ipsec-ike-policy-howto/policy-diagram.png" alt-text="IPsec/IKE policy diagram" border="false":::

## <a name ="deletepolicy"></a>To remove custom IPsec/IKE policy from a connection

1. To remove a custom policy from a connection, navigate to the connection resource and go to the **Configuration** page to see the current policy.

2. Select **Default** on the **IPsec/IKE policy** option. This will remove all custom policy previously specified on the connection, and restore the Default IPsec/IKE settings on this connection:

   :::image type="content" source="./media/ipsec-ike-policy-howto/delete-policy.png" alt-text="Delete policy":::

3. Select **Save** to remove the custom policy and restore the default IPsec/IKE settings on the connection.

## Next steps

See [Connect multiple on-premises policy-based VPN devices](vpn-gateway-connect-multiple-policybased-rm-ps.md) for more details regarding policy-based traffic selectors.