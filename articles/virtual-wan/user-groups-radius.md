---
title: 'Configure vender-specific attributes for P2S User Groups - RADIUS'
titleSuffix: Azure Virtual WAN
description: Learn how to configure RADIUS/NPS for user groups to assign IP addresses from specific address pools based on identity or authentication credentials.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 05/29/2023
ms.author: cherylmc

---
# RADIUS - Configure NPS for vendor-specific attributes - P2S user groups

The following section describes how to configure Windows Server Network Policy Server (NPS) to authenticate users to respond to Access-Request messages with the Vendor Specific Attribute (VSA) used for user group support in Virtual WAN point-to-site-VPN. The following steps assume that your Network Policy Server is already registered to Active Directory. The steps may vary depending on the vendor/version of your NPS server.

The following steps describe setting up single Network Policy on the NPS server. The NPS server will reply with the specified VSA for all users who match this policy, and the value of this VSA can be used on your point-to-site VPN gateway in Virtual WAN.

## Configure

1. Open the **Network Policy Server** management console, and right click **Network Policies -> New** to create a new Network Policy.

   :::image type="content" source="./media/user-groups-radius/network-policy-server.png" alt-text="Screenshot of new network policy." lightbox="./media/user-groups-radius/network-policy-server.png":::

1. In the wizard, select **Access granted** to ensure your RADIUS server can send Access-Accept messages after authentication users. Then, click **Next**.

1. Name the policy and select **Remote Access Server (VPN-Dial up)** as the network access server type. Then, click **Next**.

   :::image type="content" source="./media/user-groups-radius/policy-name.png" alt-text="Screenshot of policy name field." lightbox="./media/user-groups-radius/policy-name.png":::

1. On the **Specify Conditions** page, click **Add** to select a condition. Then, select **User Groups** as the condition and click **Add**. You may also use other Network Policy conditions that are supported by your RADIUS server vendor.

   :::image type="content" source="./media/user-groups-radius/specify.png" alt-text="Screenshot of specifying conditions for User Groups." lightbox="./media/user-groups-radius/specify.png":::

1. On the **User Groups** page, click **Add Groups** and select the Active Directory groups that will use this policy. Then, click **OK** and **OK** again. You'll see the groups you've added in the **User Groups** window. Click **OK** to return to the **Specify Conditions** page and click **Next**.

1. On the **Specify Access Permission** page, select **Access granted** to ensure your RADIUS server can send Access-Accept messages after authenticating users. Then, click **Next**.

   :::image type="content" source="./media/user-groups-radius/specify-access.png" alt-text="Screenshot of the Specify Access Permission page." lightbox="./media/user-groups-radius/specify-access.png":::

1. For **Configuration Authentication Methods**, make any necessary changes, then click **Next**.
1. For **Configure Constraints** select any necessary settings. Then, click **Next**.
1. On the **Configure Settings** page, for **RADIUS Attributes**, highlight **Vendor Specific** and click **Add**.

   :::image type="content" source="./media/user-groups-radius/configure-settings.png" alt-text="Screenshot of the Configure Settings page." lightbox="./media/user-groups-radius/configure-settings.png":::

1. On the **Add Vendor Specific Attribute** page, scroll to select **Vendor-Specific**.

    :::image type="content" source="./media/user-groups-radius/vendor-specific.png" alt-text="Screenshot of the Add Vendor Specific Attribute page with Vendor-Specific selected." lightbox="./media/user-groups-radius/vendor-specific.png":::

1. Click **Add** to open the **Attribute Information** page. Then, click **Add** to open the **Vendor-Specific Attribute Information** page. Select **Select from list** and select **Microsoft**. Select **Yes. It conforms**. Then, click **Configure Attribute**.

   :::image type="content" source="./media/user-groups-radius/attribute-information.png" alt-text="Screenshot of the Attribute Information page." lightbox="./media/user-groups-radius/attribute-information.png":::

1. On the **Configure VSA (RFC Compliant)** page, select the following values:

   * **Vendor-assigned attribute number**: 65
   * **Attribute format**: Hexadecimal
   * **Attribute value**: Set this to the VSA value you have configured on your VPN server configuration, such as 6a1bd08. The VSA value should begin with **6ad1bd**.

1. Click **OK** and **OK** again to close the windows. On the **Attribute Information** page, you'll see the Vendor and Value listed that you just input. Click **OK** to close the window. Then, click **Close** to return to the **Configure Settings** page.

1. The **Configure Settings** now looks similar to the following screenshot:

   :::image type="content" source="./media/user-groups-radius/vendor-value.png" alt-text="Screenshot of the Configure Settings page with Vendor Specific attributes." lightbox="./media/user-groups-radius/vendor-value.png":::

1. Click **Next** and then **Finish**. You can create multiple network policies on your RADIUS server to send different Access-Accept messages to the Virtual WAN point-to-site VPN gateway based on Active Directory group membership or any other mechanism you would like to support.

## Next steps

* For more information about user groups, see [About user groups and IP address pools for P2S User VPNs](user-groups-about.md).

* To configure user groups, see [Configure user groups and IP address pools for P2S User VPNs](user-groups-create.md).