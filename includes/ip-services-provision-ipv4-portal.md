---
 title: include file
 description: include file
 services: virtual-network
 sub-services: ip-services
 author: mbender-ms
 ms.service: azure-virtual-network
 ms.topic: include
 ms.date: 08/06/2024
 ms.author: mbender
 ms.custom: include file
---

# [Unified Model](#tab/azureportal/unified)

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create and provision a unified custom IP address prefix

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. Select **+ Create**.

4. In **Create a custom IP prefix**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myCustomIPPrefix**. |
    | Region | Select **West US 2**. |
    | IP Version | Select IPv4. |
    | IPv4 Prefix (CIDR) | Enter **1.2.3.0/24**. |
    | ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
    | Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
    | Availability Zones | Select **Zone-redundant**. |

    :::image type="content" source="./media/create-custom-ip-address-prefix-portal/create-custom-ip-prefix.png" alt-text="Screenshot of create custom IP prefix page in Azure portal.":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a "Provisioned" state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-custom-ip-address-prefix.md).

## Create a public IP prefix from unified custom IP prefix

When you create a prefix, you must create static IP addresses from the prefix. In this section, you create a static IP address from the prefix you created earlier.

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select **+ Add a public IP prefix**.

5. Enter or select the following information in the **Basics** tab of **Create a public IP prefix**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIPPrefix**. |
    | Region | Select **West US 2**. The region of the public IP prefix must match the region of the custom IP prefix. |
    | IP version | Select **IPv4**. |
    | Prefix ownership | Select **Custom prefix**. |
    | Custom IP prefix | Select **myCustomIPPrefix**. |
    | Prefix size | Select a prefix size. The size can be as large as the custom IP prefix. |

6. Select **Review + create**, and then **Create** on the following page.

7. Repeat steps 1-3 to return to the **Overview** page for **myCustomIPPrefix**. You see **myPublicIPPrefix** listed under the **Associated public IP prefixes** section. You can now allocate standard SKU public IP addresses from this prefix. For more information, see [Create a static public IP address from a prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix).

## Commission the unified custom IP address prefix

When the custom IP prefix is in **Provisioned** state, update the prefix to begin the process of advertising the range from Azure.

1. In the search box at the top of the portal, enter **Custom IP** and select **Custom IP Prefixes**.

2. Verify, and wait if necessary, for **myCustomIPPrefix** to be is listed in a **Provisioned** state.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select the **Commission** dropdown menu and choose **Globally**.

The operation is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix. Initially, the status will show the prefix as **Commissioning**, followed in the future by **Commissioned**. The advertisement rollout isn't completed all at once. The range is partially advertised while still in the **Commissioning** status.

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact. To prevent these issues during initial deployment, you can choose the regional only commissioning option where your custom IP prefix will only be advertised within the Azure region it is deployed in. For more information, see [Manage a custom IP address prefix (BYOIP)](manage-custom-ip-address-prefix.md).

# [Global/Regional Model](#tab/azure-portal/globalregional)

The following steps display the modified steps for provisioning a sample global (parent) IP range (1.2.3.0/4) and regional (child) IP ranges to the US West 2 and US East 2 Regions.

> [!NOTE]
> Clean up or delete steps aren't shown on this page given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

### Provision a global custom IP address prefix

Sign in to the [Azure portal](https://portal.azure.com).

## Create and provision a global custom IP address prefix

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. Select **+ Create**.

4. In **Create a custom IP prefix**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myCustomIPGlobalPrefix**. |
    | Region | Select **West US 2**. |
    | IP Version | Select IPv4. |
    | IP prefix range | Select Global. |
    | Global IPv4 Prefix (CIDR) | Enter **1.2.3.0/24**. |
    | ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
    | Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.
The range is pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. You can check the status by reviewing the **Commissioned state** field for the custom IP prefix.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

### Provision regional custom IP address prefixes

After the global custom IP prefix is in a **Provisioned** state, regional custom IP prefixes can be created. These ranges must always be of size /64 to be considered valid. The ranges can be created in any region (it doesn't need to be the same as the global custom IP prefix), keeping in mind any geolocation restrictions associated with the original global range. The "children" custom IP prefixes advertise from the region they're created in. Because the validation is only done for global custom IP prefix provision, no Authorization or Signed message is required (but availability zones can be utilized).

In the same **Create a custom IP prefix** page as before, enter or select the following information:

| Setting | Value |
| ------- | ----- |
| **Project details** |   |
| Subscription | Select your subscription |
| Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
| **Instance details** |   |
| Name | Enter **myCustomIPRegionalPrefix1**. |
| Region | Select **West US 2**. |
| IP Version | Select IPv4. | 
| IP prefix range | Select Regional. |
| Custom IP prefix parent | Select myCustomIPGlobalPrefix (1.2.3.0/24) from the drop-down menu. |
| Regional IPv4 Prefix (CIDR) | Enter **1.2.3.0/25**. |
| ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
| Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
| Availability Zones | Select **Zone-redundant**. |

After creation, go through the flow a second time for another regional prefix in a new region.

| Setting | Value |
| ------- | ----- |
| **Project details** |   |
| Subscription | Select your subscription |
| Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
| **Instance details** |   |
| Name | Enter **myCustomIPRegionalPrefix2**. |
| Region | Select **East US 2**. |
| IP Version | Select IPv4. | 
| IP prefix range | Select Regional. |
| Custom IP prefix parent | Select myCustomIPGlobalPrefix (1.2.3.0/24) from the drop-down menu. |
| Regional IPv4 Prefix (CIDR) | Enter **1.2.3.128/25**. |
| ROA expiration date | Enter your ROA expiration date in the **yyyymmdd** format. |
| Signed message | Paste in the output of **$byoipauthsigned** from the pre-provisioning section. |
| Availability Zones | Select Zone **3**. |

> [!IMPORTANT]
> After the regional custom IP prefix is in a "Provisioned" state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-custom-ip-address-prefix.md).

## Create a public IP prefix from regional custom IP prefix

When you create a prefix, you must create static IP addresses from the prefix. In this section, you create a static IP address from the prefix you created earlier.

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select **+ Add a public IP prefix**.

5. Enter or select the following information in the **Basics** tab of **Create a public IP prefix**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIPPrefix**. |
    | Region | Select **West US 2**. The region of the public IP prefix must match the region of the regional custom IP prefix. |
    | IP version | Select **IPv4**. |
    | Prefix ownership | Select **Custom prefix**. |
    | Custom IP prefix | Select **myCustomIPRegionalPrefix1**. |
    | Prefix size | Select a prefix size. The size can be as large as the regional custom IP prefix. |

6. Select **Review + create**, and then **Create** on the following page.

7. Repeat steps 1-3 to return to the **Overview** page for **myCustomIPPrefix**. You see **myPublicIPPrefix** listed under the **Associated public IP prefixes** section. You can now allocate standard SKU public IP addresses from this prefix. For more information, see [Create a static public IP address from a prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix).

### Commission the custom IP address prefixes

When commissioning custom IP prefixes using this model, the global and regional prefixes are treated separately. In other words, commissioning a regional custom IP prefix isn't connected to commissioning the global custom IP prefix.

:::image type="content" source="./media/create-custom-ip-address-prefix-portal/any-region-prefix-v4.png" alt-text="Diagram of custom IPv4 prefix showing parent prefix and child prefixes across multiple regions.":::

The safest strategy for range migrations is as follows:
1. Provision all required regional custom IP prefixes in their respective regions. Create public IP prefixes and public IP addresses and attach to resources.
2. Commission each regional custom IP prefix and test connectivity to the IPs within the region. Repeat for each regional custom IP prefix.
3. Commission the global custom IP prefix, which advertises the larger range to the Internet. Complete this step only after verifying all regional custom IP prefixes (and derived prefixes/IPs) work as expected.

To commission a custom IP prefix (regional or global) using the portal:

1. In the search box at the top of the portal, enter **Custom IP** and select **Custom IP Prefixes**.

2. Verify the custom IP prefix is in a **Provisioned** state.

3. In **Custom IP Prefixes**, select the desired custom IP prefix.

4. In **Overview** page of the custom IP prefix, select the **Commission** button near the top of the screen. If the range is global, it begins advertising from the Microsoft WAN. If the range is regional, it advertises only from the specific region.

> [!NOTE]
> The estimated time to fully complete the commissioning process for a custom IP global prefix is 3-4 hours. The estimated time to fully complete the commissioning process for a custom IP regional prefix is 30 minutes.

It's possible to commission the global custom IP prefix before the regional custom IP prefixes. Doing this advertises the global range to the Internet before the regional prefixes are ready so it's not recommended for migrations of active ranges. You can decommission a global custom IP prefix while there are still active (commissioned) regional custom IP prefixes. Also, you can decommission a regional custom IP prefix while the global prefix is still active (commissioned).

[!INCLUDE [ip-services-provisioning-note-1](ip-services-provisioning-note-1.md)]
