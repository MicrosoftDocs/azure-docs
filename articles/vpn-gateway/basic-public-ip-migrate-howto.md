---
title: How to migrate a Basic SKU public IP address to a Standard SKU for VPN Gateway - Preview
titleSuffix: Azure VPN Gateway
description: Learn how to migrate from a Basic SKU public IP address to a Standard SKU public IP address for VPN Gateway deployment.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 08/25/2025
ms.author: cherylmc
#customer intent: As a cloud network administrator, I want to migrate a Basic SKU public IP address to a Standard SKU for VPN Gateway, so that I can ensure optimal performance and compliance with service standards during our infrastructure upgrade.
---

# How to migrate a Basic SKU public IP address to Standard SKU for VPN Gateway - Preview

This article helps you migrate a Basic SKU public IP address to a Standard SKU for VPN Gateway deployments that use gateway SKUs VpnGw 1-5 for active-passive gateways (not active-active). For more information about Basic SKU migration, see [About migrating a Basic SKU public IP address to Standard SKU for VPN Gateway](basic-public-ip-migrate-about.md).

> [!IMPORTANT]
> Basic SKU public IP address migration for VPN Gateway is currently in PREVIEW. 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

During the public IP address SKU migration process, your Basic SKU public IP address resource is migrated to a Standard SKU public IP address resource. The IP address assigned to your gateway doesn't change.

Additionally, if your VPN Gateway gateway SKU is VpnGw 1-5, your gateway SKU might be migrated to a VPN Gateway AZ SKU (VpnGw 1-5 AZ). For more information, see [About VPN Gateway SKU consolidation and migration](gateway-sku-consolidation.md).

> [!NOTE]
> Migration functionality is rolling out to regions. If you don't see the **Migrate** tab in the Azure portal, it means that the migration process isn't available yet in your region. For more information, see the [VPN Gateway - What's New](whats-new.md#upcoming-projected-changes) article.

## Workflow

In the Azure portal, there are three sections for the migration process:

* The first section is used to prepare for the migration.
* The second section is used for two actions:
  * Migrate the public IP address from the Basic SKU public IP address resource to a Standard SKU public IP address resource. The IP address assigned to your gateway doesn't change.
  * Migrate the VPN Gateway gateway SKU from a non-AZ SKU to an AZ SKU. For example, VpnGw2 becomes VpnGw2AZ.
* The third section validates the migration and deletes the old Basic SKU public IP address resource.

## <a name="migrate"></a>Migrate to a Standard SKU public IP address for VPN Gateway

#### [Portal](#tab/portal)

Use the steps in the Azure portal to migrate your Basic SKU public IP address resource to a Standard SKU public IP address resource.

> [!NOTE]
> When you migrate your public IP address Basic SKU to the Standard SKU, your VPN Gateway SKU is also migrated. Non-AZ SKUs become AZ SKUs.

### Prepare for migration

1. In the [Azure portal](https://portal.azure.com/), go to your virtual network gateway resource. In the left pane, under **Settings**, click **Configuration**.
1. On the **Configuration** page, there are two options; Configure, and Migrate. Select **Migrate**.

   :::image type="content" source="./media/basic-public-ip-address-migrate-howto/migrate-prepare.png" alt-text="Screenshot of the migrate tab for migrating a virtual network gateway."lightbox="./media/basic-public-ip-address-migrate-howto/migrate-prepare.png":::

1. The **Migrate** tab lets you prepare for migration, and then migrate. If the environment requires manual preparation steps, you'll see a list of prerequisites that must be met before migration can begin. If these prerequisites aren't met, validation fails and you can't proceed with the migration. You must fix any issues identified in this section before you can proceed with the migration.

Before your initiate migration for your VPN gateway, verify that your gateway subnet has at least three available IP addresses in your current prefix. If your current gateway subnet is /28 or smaller, the migration tool might error out. You need to [add multiple prefixes](../virtual-network/how-to-multiple-prefixes-subnet.md) for the gateway subnet before you can proceed with migration.

1. When all the prerequisites are met, you see the **Prepare** button. Click the **Prepare** button to prepare the new Standard SKU public IP address resources.

   :::image type="content" source="./media/basic-public-ip-address-migrate-howto/prepare.png" alt-text="Screenshot of the prepare step for migrating a virtual network gateway." lightbox="./media/basic-public-ip-address-migrate-howto/prepare.png":::

1. After you click Prepare, you'll see a status indicating that the migration preparation is in progress. When the preparation process is complete, you see a message indicating that the migration is ready to proceed.

### Migrate

1. After the Prepare step completes, the option to **Migrate** your resources is available.

   :::image type="content" source="./media/basic-public-ip-address-migrate-howto/migrate.png" alt-text="Screenshot of the migrate step for migrating a virtual network gateway."lightbox="./media/basic-public-ip-address-migrate-howto/migrate.png":::

1. Click the **Migrate** button to migrate your public IP address SKU and your gateway SKU. You'll have 5 minutes of downtime and can't make any changes to your VPN gateway during this time.

### Validate migration

If your VPN Gateway gateway SKU was VpnGw 1-5, your gateway SKU automatically migrated to an AZ SKU (VpnGw 1-5 AZ) as part of the migration process. In this section, you validate that the migration was successful and that traffic is flowing as expected. If you find that your gateway isn't working as expected, you have the opportunity to abort the migration to roll back any migration changes.

> [!IMPORTANT]
> It's important to validate the migration was successful before you commit the changes in this section. If migration wasn't successful, you have the option to abort and roll back your changes if you haven't committed them in this section.

1. Click the **Gateway Validation** link to go to the VPN gateway resource **Overview** page.
1. Verify that your gateway is receiving and transmitting traffic. An easy way to validate traffic is to check the tunnel ingress and egress graphs on the gateway **Overview** page.
1. If traffic isn't flowing properly or if you need to roll back changes, click **Abort**. This does the following:
   * The Standard SKU public IP address resource is rolled back to the Basic public IP address SKU. The IP address remains the same.
   * The VPN gateway SKU rolls back to a non-AZ SKU. For example, VpnGw2AZ reverts back to VpnGw2. If you accidentally click **Commit**, click **Cancel**, then **Abort** to roll back the changes.
1. If validation is successful and traffic is flowing as expected, then click **Commit** and **Commit changes** to finalize the migration. If you don't commit the changes in this step, your Basic SKU public IP address resource remains in a pending state and won't be deleted.

   :::image type="content" source="./media/basic-public-ip-address-migrate-howto/commit-changes.png" alt-text="Screenshot of the commit changes step for migrating a virtual network gateway."lightbox="./media/basic-public-ip-address-migrate-howto/commit-changes.png":::

### View resources after migration

When the public IP address migration is complete, you can view your resources on the page for your VPN gateway resource:

* To view the gateway SKU, go to the **Overview** page for your VPN gateway.

* To view the public IP address SKU, go to the **Properties** page for your VPN gateway. Click the IP address value to open the Public IP address resource and view the resource SKU.
#### [PowerShell](#tab/powershell)

Use Azure PowerShell to migrate your Basic SKU public IP address resource to a Standard SKU public IP address resource.

> [!NOTE]
> * Migrating your public IP address from Basic SKU to Standard SKU also upgrades your VPN Gateway SKU from a non-AZ to an AZ SKU.
> * Before starting migration, ensure your gateway subnet has at least three available IP addresses in its current prefix. If your subnet is /28 or smaller, the migration tool may fail. [Add multiple prefixes](../virtual-network/how-to-multiple-prefixes-subnet.md) if needed.

### Prepare for migration

Run [Invoke-AzVirtualNetworkGatewayPrepareMigration](/powershell/module/az.network/invoke-azvirtualnetworkgatewaypreparemigration?view=azps-latest) to prepare your gateway for migration.

```azurepowershell-interactive
$gateway = Get-AzVirtualNetworkGateway -Name "ContosoVirtualGateway" -ResourceGroupName "RGName"
$migrationParams = New-AzVirtualNetworkGatewayMigrationParameter -MigrationType UpgradeDeploymentToStandardIP
Invoke-AzVirtualNetworkGatewayPrepareMigration -InputObject $gateway -MigrationParameter $migrationParams
```

### Execute migration

Run [Invoke-AzVirtualNetworkGatewayExecuteMigration](/powershell/module/az.network/invoke-azvirtualnetworkgatewayexecutemigration?view=azps-latest) to start the migration.

```azurepowershell-interactive
$gateway = Get-AzVirtualNetworkGateway -Name "ContosoVirtualGateway" -ResourceGroupName "RGName"
Invoke-AzVirtualNetworkGatewayExecuteMigration -InputObject $gateway
```

### Commit migration

After validating that migration was successful, run [Invoke-AzVirtualNetworkGatewayCommitMigration](/powershell/module/az.network/invoke-azvirtualnetworkgatewaycommitmigration?view=azps-latest) to finalize the migration.

```azurepowershell-interactive
$gateway = Get-AzVirtualNetworkGateway -Name "ContosoVirtualGateway" -ResourceGroupName "RGName"
Invoke-AzVirtualNetworkGatewayCommitMigration -InputObject $gateway
```

### Abort migration

If you need to roll back the migration before committing, run [Invoke-AzVirtualNetworkGatewayAbortMigration](/powershell/module/az.network/invoke-azvirtualnetworkgatewayabortmigration?view=azps-latest).

```azurepowershell-interactive
$gateway = Get-AzVirtualNetworkGateway -Name "ContosoVirtualGateway" -ResourceGroupName "RGName"
Invoke-AzVirtualNetworkGatewayAbortMigration -InputObject $gateway
```

---

## Point-to-Site VPN Gateways using legacy DNS limitation

Point-to-Site VPN Gateways that were originally deployed using legacy cloudapp.NET DNS infrastructure have specific limitations that prevent them from using the standard migration process described in this article. This section helps you identify if your gateway has this limitation and provides guidance on next steps.

### Impact and timeline

VPN Gateways with legacy cloudapp.NET DNS configurations cannot be migrated using the current migration tools. These gateways require a specialized migration approach that is currently under development. 

A guided migration experience for legacy DNS gateways is planned for release, with the timeline to be announced by the end of September 2025. Until this specialized migration becomes available, these gateways will continue to function normally but cannot be upgraded to Standard SKU public IP addresses.

### Important considerations

> [!IMPORTANT]
> If your gateway uses legacy DNS, follow these critical guidelines:
> - **Do NOT** remove your existing Point-to-Site configuration to attempt this migration.
> - **Do NOT** add new Point-to-Site configurations to existing gateways without Point-to-Site until the legacy DNS migration capability is released.
> - Continue using your current gateway configuration until the specialized migration tools become available.

### Check if your gateway uses legacy DNS

Follow these steps to determine if your VPN Gateway uses legacy cloudapp.NET DNS and requires the specialized migration process:

1. In the [Azure portal](https://portal.azure.com/), navigate to your Virtual Network Gateway resource.

1. In the left pane, under **Settings**, select **Point-to-site configuration**.

1. On the Point-to-site configuration page, click **Download VPN Client**.

   :::image type="content" source="./media/basic-public-ip-address-migrate-howto/download-vpn-client.png" alt-text="Screenshot showing Download VPN client option."lightbox="./media/basic-public-ip-address-migrate-howto/download-vpn-client.png":::

1. Save the downloaded ZIP file to your local machine and extract it to a local directory.

1. In the extracted folder, navigate to the **AzureVPN** subfolder.

1. Open the **azurevpnconfig.xml** file using a text editor such as Notepad.

1. In the XML file, locate the following structure:
   ```xml
   <serverlist>
       <serverEntry>
           <fqdn>your-gateway-fqdn-here</fqdn>
       </serverEntry>
   </serverlist>
   ```

1. Check the suffix of the FQDN value:
   - If the FQDN ends with **cloudapp.NET** (for example: `contoso-gateway.cloudapp.NET`), your gateway uses legacy DNS and requires the specialized migration process.
   - If the FQDN has a different suffix, your gateway can use the standard migration process described in this article.

For the latest updates on legacy DNS gateway migration availability, see the [VPN Gateway - What's New](whats-new.md) article.

## Known Issues

* For VpnGw1 CSES to Virtual Machine Scale Sets migration, we are seeing higher CPU utilization due to .NET core optimization. This is a known issue and we recommend to either wait for 10 minutes after prepare stage or upgrade to a higher gateway SKU during the migration process.


## Next steps

* To see the announcement for this migration, see [Basic SKU public IP address retirement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).

* To learn more about the Basic SKU public IP address migration, see [About migrating a Basic SKU public IP address to Standard SKU for VPN Gateway](basic-public-ip-migrate-about.md).

* To learn more about Gateway SKU consolidation and migration, see [About VPN Gateway SKU consolidation and migration](gateway-sku-consolidation.md).
