---
title: 'Assign Users IP Addresses from Defined Pools for P2S VPN Connections - Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to assign IP addresses from specific address pools to P2S VPN users based on their identity or authentication credentials using the Azure portal.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 05/05/2026
---

# Assign IP addresses from defined pools to P2S VPN users - Azure portal (Preview)

You can assign users connecting to your Point-to-site (P2S) VPN gateway IP addresses from specific address pools based on identity or authentication credentials. This is accomplished by creating specific policies and associating them with groups. To understand the concepts and terminology for this feature, along with configuration considerations and limitations, see [About User Groups and IP address pools](point-to-site-user-groups-about.md).

This article helps you configure Policy Groups, Group Members, and prioritize groups using the Azure portal.

> [!IMPORTANT]
> This feature is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* **A VPN gateway**. This article assumes you have a VPN gateway. In this article, we configure the gateway for point-to-site (P2S) connections using both certificate authentication and Microsoft Entra authentication to demonstrate the multiple address pool feature. Your gateway must use a SKU other than the Basic SKU to support point-to-site connections. If you need to create a VPN gateway, see the following articles:

  * [Create a VPN gateway using the Azure portal](tutorial-create-gateway-portal.md)
  * [Create a VPN gateway using PowerShell](create-gateway-powershell.md)
  * [Create a VPN gateway using Azure CLI](create-routebased-vpn-gateway-cli.md)

* **Permissions for Entra**. If you plan to use Microsoft Entra authentication, you need to have the appropriate permissions in Microsoft Entra to be able to view group Object IDs and assign users to groups. For more information about Microsoft Entra permissions, see [Microsoft Entra built-in roles](https://learn.microsoft.com/entra/identity/role-based-access-control/permissions-reference). For this exercise, we use 2 Microsoft Entra groups with their Object IDs to configure the policy groups and members for this feature. We don't walk through the steps to create Microsoft Entra ID groups or assign users to groups in this article, but you can find more information about managing Microsoft Entra groups in the [Enterprise user management documentation](https://learn.microsoft.com/entra/identity/users/).

## Workflow

This article uses the following workflow to help you set up user groups and IP address pools for your P2S VPN Gateway connection.

* Consider configuration requirements.
* Choose an authentication mechanism.
* Configure the VPN gateway.
* Create groups.
* Associate address pools.
* Apply the configuration settings.

## Configuration requirements

This section lists configuration requirements and limitations for user groups and IP address pools.

[!INCLUDE [User groups configuration considerations](../../includes/virtual-wan-user-groups-considerations.md)]

* Address pools can't overlap with address pools used in other connection configurations (same or different gateways).
* Address pools also can't overlap with virtual network address spaces, virtual hub address spaces, or on-premises addresses.
* Address pools can't be smaller than /24. For example, you can't assign a range of /25 or /26.

## Choose the authentication type

You can create multiple user groups, each with different authentication types. The authentication type is used to match users to a specific user group when they connect to the VPN gateway. The following authentication types are supported:

* **Microsoft Entra authentication**: Microsoft Entra authentication allows user groups to be defined by Microsoft Entra group Object IDs.

   * You can use existing Microsoft Entra groups or create new groups to be used for the VPN gateway configuration.

   * To create and manage Microsoft Entra groups, see [Manage Microsoft Entra groups and group membership](../active-directory/fundamentals/how-to-manage-groups.md).

   :::image type="content" source="./media/point-to-site-user-groups-create/groups.png" alt-text="Diagram of Microsoft Entra groups and Object IDs." lightbox="./media/point-to-site-user-groups-create/groups.png":::

   * The Microsoft Entra user group **object ID** (and not the group name) needs to be specified as part of the point-to-site configuration. For this example, we'll use:

     * Engineering group as **{ObjectId1}**
     * Finance group as **{ObjectId2}**

   * Microsoft Entra users can be assigned to be part of multiple Active Directory groups, and VPN Gateway considers users to be part of the VPN user/policy. If a user belongs to multiple groups, the group that has the lowest numerical priority is selected in the point-to-site connection.

* **RADIUS - NPS vendor-specific attributes**: For Network Policy Server (NPS) vendor-specific attributes configuration information, see [RADIUS - configure NPS for vendor-specific attributes](point-to-site-user-groups-radius.md).

* **Certificate authentication**: Certificate-based authentication allows user groups to be defined by the Common Name (CN) field in digital certificate. To generate self-signed certificates, see [Generate and export certificates for point-to-site using PowerShell](vpn-gateway-certificates-point-to-site.md). 

   To generate a certificate with a specific Common Name, change the **Subject** parameter to the appropriate value (example, xx@domain.com) when running the `New-SelfSignedCertificate` PowerShell command.

   For example, you can generate certificates with the following **Subject**:

   | Digital certificate field | Value | Description |
   | ---  | --- | --- |
   | **Subject** | CN= cert@marketing.contoso.com | digital certificate for Marketing department |
   | **Subject** | CN= cert@sale.contoso.com | digital certificate for Sale department |

   * The multiple address pool feature with digital certificate authentication applies to a specific user group based on the **Subject** field. The selection criteria don't work with Subject Alternative Name (SAN) certificates.

   * If you want to specify a SAN in their certificates, it must be the same as the Subject for the multipool feature to function correctly. Discrepancy between the Subject and SAN results in issues.

   * Export the certificates in .cer format (without private key) and save to a location where you can access them. You'll need to open the .cer file and copy the public certificate data to be used in the next steps when configuring the gateway.

## Configure the VPN gateway

The following configuration sets up the VPN gateway to use client address pool and authentication options required for policy groups and IP address pools for P2S connections. The configuration also includes steps to create policy members, create virtual network gateway policy groups, and create VPN client connection configurations.

The following steps use these authentication options:

* **Azure certificate**. For information about certificate authentication values, see [Configure server settings for P2S VPN Gateway certificate authentication](point-to-site-certificate-gateway.md). This type of authentication is available for IKEv2 and OpenVPN tunnel types only.

* **Microsoft Entra**. For information about Microsoft Entra authentication values, see [Configure P2S VPN Gateway for Microsoft Entra authentication](point-to-site-entra-gateway.md). This type of authentication is available for OpenVPN tunnel types only.

1. In the Azure portal, go to your VPN gateway. Under **Settings**, select **Point-to-site configuration**. Configure the values for **Address pool**, **Tunnel type**, **IPsec/IKE policy**, and **Authentication type** as shown in the following example.

   * For **Address pool**,  specify values in the format **x.x.x.0/24** to connect VPN clients that **don't** belong to the multiple address pool configuration.

   * For **Authentication type**, select both Azure certificate and Microsoft Entra authentication types to enable the use of both authentication mechanisms and the multiple address pool feature.

   * For **Tunnel type**, select the tunnel type that works best for your scenario. For example, IKEv2 and OpenVPN. SSTP isn't supported for this scenario.

1. Open the certificate with a text editor, such as Notepad. When copying the certificate data, make sure that you copy the text as one continuous line, excluding the header and the footer lines (-----BEGIN CERTIFICATE----- and -----END CERTIFICATE-----). The copied data should look similar to the following value:

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/certificate.png" alt-text="Screenshot of data in the certificate." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/certificate-expand.png":::

1. Next, go to the **Virtual network gateway -> Point-to-site configuration** page **Root certificate** section. This section is only visible if you selected **Azure certificate** for the authentication type. Complete the values as shown in the following example.

   :::image type="content" source="media/point-to-site-user-groups-create-portal/public-certificate-data.png" alt-text="Azure portal showing address pool and authentication options." lightbox="media/point-to-site-user-groups-create-portal/public-certificate-data.png":::

   * For the Root certificates **Name** field, enter a name for the root certificate. This name is used to identify the certificate in the portal and doesn't need to match any value in the certificate itself.
   * For **Public certificate data** field, paste the data you copied from the .cer file in the previous step.
   * For **{TenantID}** use the corresponding Microsoft Entra Tenant ID (without curly brackets).
   * For **{AudienceID}** with the corresponding value for the Microsoft-registered Azure VPN Client App ID. You can also use [custom audience](point-to-site-entra-register-custom-app.md) in this field.
   * For **Issuer URI** enter the value in the format of `https://sts.windows.net/{TenantID}/` where {TenantID} is your Microsoft Entra Tenant ID without curly brackets.

1. After entering the values, select **Save** to save the configuration.

## Configure policy groups and policy members

In this section, we create four policy groups (user groups) and four policy members (group members). A single member is associated with each policy group.

**Policy groups (user groups)** are a logical representation of a group of users that should be assigned IP addresses from the same address pool. Policy groups consist of policy members. A single group can have multiple members. 

**Policy members (group members)** are based on authentication type and attribute value. Policy members don't correspond to individual users, but rather define the criteria used to determine which group a connecting user is a part of. The attribute value is used to match policy members when they connect to the VPN gateway. For more information about these concepts, see [About user groups and IP address pools for P2S connections](point-to-site-user-groups-about.md).

In the following table, each policy group is assigned a policy member, a numerical [group priority](point-to-site-user-groups-about.md#group-priority), and the [default policy group](point-to-site-user-groups-about.md#default-policy-group) is also defined. 

The default policy group is the group that users are assigned to when they connect if they don't match any of the other policy groups configured on the gateway. In this example, policyGroup1 is selected as the default policy group.

**Scenario table**

|Policy group name|Default policy|Priority|Policy member object |
|-----------------|--------------|--------|---------------------|
|policyGroup1     |true          |0       |member1              |
|policyGroup2     |false         |1       |member2              |
|policyGroup3     |false         |2       |member3              |
|policyGroup4     |false         |3       |member4              |

The policy groups are responsible for authorizing connections. These connections use either digital certificates that specify the following values in the Common Name (CN) field, or Microsoft Entra groups that specify the group Object IDs.

Putting the details together, the policy groups and members are configured with the following authentication types and attribute values for this exercise:

| Member Name | Authentication Type         | Attribute Value       |
|-------------|---------------------------- |-----------------------|
| member1     | Certificate: Group ID       | marketing.contoso.com |
| member2     | Certificate: Group ID       | sale.contoso.com      |
| member3     | Azure AD: Group ID          | {ObjectId1}           |
| member4     | Azure AD: Group ID          | {ObjectId2}           |

The breakdown values of the policy groups and members are as follows:

* Two policy groups of client certificates with Common Names.

  * `yourServiceName@marketing.contoso.com`
  * `yourServiceName@sale.contoso.com`

  Policy group associated with a member:

  * policyGroup1: marketing.contoso.com with member1
  * policyGroup2: sale.contoso.com with member2

* Two policy groups created in Microsoft Entra (Replace ObjectId1/ObjectId2 with your Object ID value).

  * Engineering group `{ObjectId1}`
  * Finance `{ObjectId2}`

  Policy group associated with a member:

  * policyGroup3: {ObjectId1}, with member3
  * policyGroup4: {ObjectId2}, with member4

Before you start creating the policy groups and members in the portal, you must first enable the **User Groups** feature.

### Enable User Groups

By default, the option for User Groups is disabled. Before you proceed to the next sections, you must enable this feature.

Go to your **VPN gateway -> Settings -> Point-to-site configuration**. On the **User Groups** tab, select **Enable**.

:::image type="content" source="media/point-to-site-user-groups-create-portal/enable-user-groups.png" alt-text="Enable User Groups." lightbox="media/point-to-site-user-groups-create-portal/enable-user-groups.png":::

### Create policy groups and members

In this section, you create policy groups and policy members based on the authentication type and attribute value.

* **member1** and **member2** are based on digital certificate authentication (authentication type: **CertificateGroupID**).
* **member3** and **member4** are based on Microsoft Entra authentication (authentication type: **AADGroupID**).

   * **{ObjectId1}** and **{ObjectId2}** are the values representing the two different groups ID in your Microsoft Entra tenant.

Use the table to refer to authentication types and attribute values when you create your policy members.

|Member Name | Authentication Type | Attribute Value       |
| ---        | ---                 | ---                   |
|member1     | CertificateGroupId  | marketing.contoso.com |
|member2     | CertificateGroupId  | sale.contoso.com      |
|member3     | AADGroupID          | {ObjectId1}           |
|member4     | AADGroupID          | {ObjectId2}           |

#### Configure certificate authentication policy groups

1. Specify the group name in the portal. On the **Point-to-site configuration** page **User Groups** tab, for the **Group Name** value, specify the name **policyGroup1**.

   :::image type="content" source="media/point-to-site-user-groups-create-portal/group-name.png" alt-text="Specify group name." lightbox="media/point-to-site-user-groups-create-portal/group-name.png":::

1. Click **Configure Group** to open the **Configure Group Settings** page. 
1. On the **Configure Group Settings** page, define the authentication and attribute value for **policyGroup1**. For example, if you're using certificate authentication, specify the authentication type as **Certificate: GroupID** and the attribute **Value** as the Common Name value of the certificate (in this case, marketing.contoso.com).

   :::image type="content" source="media/point-to-site-user-groups-create-portal/group-settings-certificate.png" alt-text="Configure group settings for policygoup 1." lightbox="media/point-to-site-user-groups-create-portal/group-settings-certificate.png":::

1. Click **Add** to add the settings to **policyGroup1**.
1. Repeat the previous steps to create **policyGroup2** with its respective settings (Certificate: GroupID with attribute value sale.contoso.com).

   :::image type="content" source="media/point-to-site-user-groups-create-portal/group-settings-policy-2-certificate.png" alt-text="Configure group settings for policygroup2." lightbox="media/point-to-site-user-groups-create-portal/group-settings-policy-2-certificate.png":::

1. The Azure portal displays the default group selection message:

   :::image type="content" source="media/point-to-site-user-groups-create-portal/default-group-selection.png" alt-text="Azure portal showing default group selection message." lightbox="media/point-to-site-user-groups-create-portal/default-group-selection.png":::

#### Configure Microsoft Entra authentication policy groups

1. Repeat the steps in the previous section to create **policyGroup3** and **policyGroup4** with the following settings:

   * For **policyGroup3**, specify the authentication type as **AAD: GroupID** and the attribute value as the Object ID of the Microsoft Entra group representing the Engineering department (**{ObjectId1}**).
   * For **policyGroup4**, specify the authentication type as **AAD: GroupID** and the attribute value as the Object ID of the Microsoft Entra group representing the Finance department (**{ObjectId2}**).

   > [!NOTE]
   > In the example, the curly brackets {} are used to indicate placeholders. For example {ObjectId1},  replace {ObjectId1} with the actual `Entra Object ID` value, and don't include the curly brackets in the final value.

   :::image type="content" source="media/point-to-site-user-groups-create-portal/member-3.png" alt-text="Configure group settings for Microsoft Entra authentication." lightbox="media/point-to-site-user-groups-create-portal/member-3.png":::

1. The portal should look similar to this example after you create the four policy groups and members:

   :::image type="content" source="media/point-to-site-user-groups-create-portal/member-4.png" alt-text="Azure portal showing four groups created." lightbox="media/point-to-site-user-groups-create-portal/member-4.png":::

## Associate an address pool to each policy group

The VPN configuration defines four distinct address pools, each linked to a specific policy group. When a user connects to the VPN, the gateway evaluates the user's credentials against the policy groups in order of priority. If a user's credentials match a policy group, they're assigned an IP address from the address pool associated with that policy group. If there's no match, the user is assigned an IP address from the default address pool.

Each policy group is assigned a unique address pool:

| Address Pool | PolicyGroup                          |
|--------------|------------------------------------  |
| x.x.1.0/24   | policyGroup1: marketing.contoso.com  |
| x.x.2.0/24   | policyGroup2: sale.contoso.com       |
| x.x.3.0/24   | policyGroup3: Engineering {ObjectId1}|
| x.x.4.0/24   | policyGroup4: Finance {ObjectId2}    |

1. On the **User Groups** tab of the **Point-to-site configuration** page, under Address Pools, click **Configure** to configure the address pools for each policy group. In this example, the address pool for PolicyGroup1 is 192.169.1.0/24.

   :::image type="content" source="media/point-to-site-user-groups-create-portal/address-pool.png" alt-text="Configure address pools for each policy group." lightbox="media/point-to-site-user-groups-create-portal/address-pool.png":::

1. Repeat the same steps to configure the address pools for the other three policy groups. 

   > [!NOTE]
   > At a minimum, a policy group must have at least one client address pool. However, you can assign more than one client address pool to a policy. A configuration with a policy group without a client address pool fails. The client address pool assigned to different group address pools can't overlap and needs to be unique.

1. After you configure the address pools, select a **Default policy** (for example, policyGroup1). Select the flag button in one of the policyGroups. The default policy is the policy group that users are assigned to when they connect if they don't match any of the other policy groups configured on the gateway.

## Apply the configuration to the gateway

At this point, the multiple address pool settings are similar to this logical structure.

| Default policy | Priority | Policy group name | Policy member | Authentication type | Group configuration value | VPN Client address pool |
| --- | --- | --- | --- | --- | --- | --- |
| X | 0 | policyGroup1 | member1 | CertificateGroupId  | marketing.contoso.com  | x.x.1.0/24 |
|   | 1 | policyGroup2 | member2 | CertificateGroupId  | sale.contoso.com       | x.x.2.0/24 |
|   | 2 | policyGroup3 | member3 | AADGroupID          | {ObjectId1}            | x.x.3.0/24 |
|   | 3 | policyGroup4 | member4 | AADGroupID          | {ObjectId2}            | x.x.4.0/24 |

1. Click **Save** to apply the configuration to the gateway. After the configuration is applied, when users connect to the VPN gateway, they're assigned an IP address from the address pool associated with the policy group that matches their authentication credentials or identity.

1. During the configuration commit process for all multi-group address pools, the VPN gateway shows an **Updating** status.

   :::image type="content" source="media/point-to-site-user-groups-create-portal/save-configuration.png" alt-text="Save the configuration." lightbox="media/point-to-site-user-groups-create-portal/save-configuration.png":::

## If things go wrong

[!INCLUDE [Troubleshooting policy groups and IP address pools for P2S connections](../networking/includes/vpn-gateway/policy-groups-ts.md)]

## Next steps

* [About user groups and IP address pools for point-to-site](point-to-site-user-groups-about.md)
