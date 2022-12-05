---
title: 'Configure user groups and IP address pools for point-to-site User VPNs'
titleSuffix: Azure Virtual WAN
description: Learn how to configure user groups and assign IP addresses from specific address pools based on identity or authentication credentials.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 10/21/2022
ms.author: cherylmc


---
# Configure user groups and IP address pools for P2S User VPNs - Preview

You can configure P2S User VPNs to assign users IP addresses from specific address pools based on their identity or authentication credentials by creating **User Groups**. This article helps you configure user groups, group members, and prioritize groups. For more information about working with user groups, see [About user groups](user-groups-about.md).

## Configuration considerations

[!INCLUDE [User groups preview considerations](../../includes/virtual-wan-user-groups-considerations.md)]

### Additional configuration information

#### Azure Active Directory groups

To create and manage Active Directory groups, see [Manage Azure Active Directory groups and group membership](../active-directory/fundamentals/how-to-manage-groups.md).

* The Azure Active Directory group object ID (and not the group name) needs to be specified as part of the Virtual WAN point-to-site User VPN configuration.
* Azure Active Directory users can be assigned to be part of multiple Active Directory groups, but Virtual WAN considers users to be part of the Virtual WAN user/policy group that has the lowest numerical priority.

#### RADIUS - NPS vendor-specific attributes

For Network Policy Server (NPS) vendor-specific attributes configuration information, see [RADIUS - configure NPS for vendor-specific attributes](user-groups-radius.md).

#### Generating self-signed certificates

To generate self-signed certificates, see [Generate and export certificates for User VPN P2S connections: PowerShell](certificates-point-to-site.md). To generate a certificate with a specific Common Name, change the **Subject** parameter to the appropriate value (example, xx@domain.com) when running the `New-SelfSignedCertificate` PowerShell command.

## Prerequisites

Before beginning, make sure you've configured a virtual WAN that uses one or more authentication methods. For steps, see [Tutorial: Create a Virtual WAN User VPN P2S connection](virtual-wan-point-to-site-portal.md).

## Create a user group

1. In the Azure portal, go to your **Virtual WAN -> User VPN configurations** page.

1. On the **User VPN configurations** page, select the User VPN Configuration that you want to edit, then click **Edit configuration**.

1. On the **Edit User VPN configuration** page, open the **User Groups** tab.

   :::image type="content" source="./media/user-groups-create/enable-user-groups.png" alt-text="Screenshot of enabling User Groups." lightbox="./media/user-groups-create/enable-user-groups.png":::

1. Select **Yes** to enable user groups. When this server configuration is assigned to a P2S VPN gateway, users who are part of the same user groups are assigned IP addresses from the same address pools. Users who are part of different groups are assigned IP addresses from different groups. When you use this feature, you must select **Default** group for one of the groups that you create.

1. To begin creating a new User Group, fill out the name parameter with the name of the first group.

1. Next to the **Group Name**, click **Configure Group** to open the **Configure Group Settings** page.

    :::image type="content" source="./media/user-groups-create/new-group.png" alt-text="Screenshot of creating a new group." lightbox="./media/user-groups-create/new-group.png":::

1. On the **Configure Group Settings** page, fill in the values for each member that you want to include in this group. A group can contain multiple group members.

   * Create a new member by filling in the **Name** field.

   * Select the **Authentication: Setting Type** from the dropdown. The dropdown is automatically populated based on the selected authentication methods for the User VPN configuration.

   * Type the **Value**. For valid values, see [About user groups](user-groups-about.md).

   :::image type="content" source="./media/user-groups-create/group-members.png" alt-text="Screenshot of configuring values for User Group members." lightbox="./media/user-groups-create/group-members.png":::

1. When you're finished creating the settings for the group, click **Add** and **Okay**.

1. Create any additional groups.

1. Select at least one group as default. Users who aren't part of any group specified on a gateway will be assigned to the default group on the gateway. Also note that you can't modify the "default" status of a group after the group has been created.

   :::image type="content" source="./media/user-groups-create/select-default.png" alt-text="Screenshot of selecting the default group." lightbox="./media/user-groups-create/select-default.png":::

1. Click the arrows to adjust the group priority order.

   :::image type="content" source="./media/user-groups-create/adjust-order.png" alt-text="Screenshot of adjusting the priority order." lightbox="./media/user-groups-create/adjust-order.png":::

1. Click **Review + create** to create and configure. After you create the User VPN configuration, configure the gateway server configuration settings to use the user groups feature.

## Configure gateway settings

1. In the portal, go to your virtual hub and click **User VPN (Point to site)**.

1. On the point to site page, click the **Gateway scale units** link to open the **Edit User VPN gateway**. Adjust the **Gateway scale units** value from the dropdown to determine gateway throughput.

1. For **Point to site server configuration**, select the User VPN configuration that you configured for user groups. If you haven't yet configured these settings, see [Create user groups](user-groups-create.md).

1. Create a new point to site configuration by typing a new **Configuration Name**.
1. Select one or more groups to be associated with this configuration. All the users who are part of groups that are associated with this configuration will be assigned IP addresses from the same IP address pools.

   Across all configurations for this gateway, you must have exactly one default user group selected.

   :::image type="content" source="./media/user-groups-create/select-groups.png" alt-text="Screenshot of Edit User VPN gateway page with groups selected." lightbox="./media/user-groups-create/select-groups.png":::

1. For **Address Pools**, click **Configure** to open the **Specify Address Pools** page. On this page, associate new address pools with this configuration. Users who are members of groups associated to this configuration will be assigned IP addresses from the specified pools. Based on the number of **Gateway Scale Units** associated to the gateway, you may need to specify more than one address pool. Click **Add** and **Okay** to save your address pools.

   :::image type="content" source="./media/user-groups-create/address-pools.png" alt-text="Screenshot of Specify Address Pools page." lightbox="./media/user-groups-create/address-pools.png":::

1. You'll need one configuration for each set of groups that should be assigned IP addresses from different address pools. Repeat the steps to create more configurations. See [Configuration considerations](#configuration-considerations) for requirements and limitations regarding address pools and groups.

1. After you've created the configurations that you need, click **Edit**, and then **Confirm** to save your settings.

   :::image type="content" source="./media/user-groups-create/confirm.png" alt-text="Screenshot of Confirm settings." lightbox="./media/user-groups-create/confirm.png":::

## Troubleshooting

1. Wireshark or another packet capture can be run in NPS mode and decrypt packets using shared key. You can validate packets are being sent from your RADIUS server to the point-to-site VPN gateway with the right RADIUS VSA configured.
1. Set up and check NPS Event logging for authentication whether or not users are matching policies.
1. Every address pool specified on the gateway. Address pools are split into two address pools and assigned to each active-active instance in a point-to-site VPN gateway pair. These split addresses should show up in the effective route table. For example, if you specify 10.0.0.0/24, you should see two /25 routes in the effective route table. If this isn't the case, try changing the address pools defined on the gateway.
1. Make sure all point-to-site VPN connection configurations are associated to the defaultRouteTable and propagate to the same set of route tables. This should be configured automatically if you're using portal, but if you're using REST, PowerShell or CLI, make sure all propagations and associations are set appropriately.
1. If you're using the Azure VPN client, make sure the Azure VPN client installed on user devices are the latest version.
1. If you're using Azure Active Directory authentication, please make sure the tenant URL input in the server configuration (`https://login.microsoftonline.com/<tenant ID>`) does **not** end in a `\`. If the URL is input to end with `\`, the Gateway will not be able to properly process Azure Active Directory user groups and all users will be assigned to the default group. To remediate, please modify the server configuration to remove the trailing `\` and modify the address pools configured on the gateway to apply the changes to the gateway. This is a known issue that will be fixed in a later relase.

## Next steps

* For more information about user groups, see [About user groups and IP address pools for P2S User VPNs](user-groups-about.md).
