---
title: Use private endpoints with Azure Batch accounts
description: Learn how to connect privately to an Azure Batch account by using private endpoints.
ms.topic: how-to
ms.date: 05/26/2022
ms.custom: references_regions
---

# Use private endpoints with Azure Batch accounts

By default, [Azure Batch accounts](accounts.md) have public endpoints and are publicly accessible. The Batch service offers the ability to create private endpoint for Batch accounts, allowing private network access to the Batch service.

By using [Azure Private Link](../private-link/private-link-overview.md), you can connect to an Azure Batch account via a [private endpoint](../private-link/private-endpoint-overview.md). The private endpoint is a set of private IP addresses in a subnet within your virtual network. You can then limit access to an Azure Batch account over private IP addresses.

Private Link allows users to access an Azure Batch account from within the virtual network or from any peered virtual network. Resources mapped to Private Link are also accessible on-premises over private peering through VPN or [Azure ExpressRoute](../expressroute/expressroute-introduction.md). You can connect to an Azure Batch account configured with Private Link by using the [automatic or manual approval method](../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow).

This article describes the steps to create a private endpoint to access Batch account endpoints.

## Private endpoint sub-resources supported for Batch account

Batch account resource has two endpoints supported to access with private endpoints:

- Account endpoint (sub-resource: **batchAccount**): this is the endpoint for [Batch Service REST API](/rest/api/batchservice/) (data plane), for example managing pools, compute nodes, jobs, tasks, etc.

- Node management endpoint (sub-resource: **nodeManagement**): used by Batch pool nodes to access Batch node management service. This is only applicable when using [simplified compute node communication](simplified-compute-node-communication.md). This feature is in preview.

> [!IMPORTANT]
> - This preview sub-resource is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> - For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Azure portal

Use the following steps to create a private endpoint with your Batch account using the Azure portal:

1. Go to your Batch account in the Azure portal.
2. In **Settings**, select **Networking** and go to the tab **Private Access**. Then, select **+ Private endpoint**.
   :::image type="content" source="media/private-connectivity/private-endpoint-connections.png" alt-text="Screenshot of private endpoint connections.":::
3. In the **Basics** pane, enter or select the subscription, resource group, private endpoint resource name and region details, then select **Next: Resource**.
   :::image type="content" source="media/private-connectivity/create-private-endpoint-basics.png" alt-text="Screenshot of creating a private endpoint - Basics pane.":::
4. In the **Resource** pane, set the **Resource type** to **Microsoft.Batch/batchAccounts**. Select the Batch account you want to access, select the target sub-resource, then select **Next: Configuration**.
   :::image type="content" source="media/private-connectivity/create-private-endpoint.png" alt-text="Screenshot of creating a private endpoint - Resource pane.":::
5. In the **Configuration** pane, enter or select this information:
   - For **Virtual network**, select your virtual network.
   - For **Subnet**, select your subnet.
   - For **Private IP configuration**, select the default **Dynamically allocate IP address**.
   - For **Integrate with private DNS zone**, select **Yes**. To connect privately with your private endpoint, you need a DNS record. We recommend that you integrate your private endpoint with a private DNS zone. You can also use your own DNS servers or create DNS records by using the host files on your virtual machines.
   - For **Private DNS Zone**, select **privatelink.batch.azure.com**. The private DNS zone is determined automatically. You can't change this setting by using the Azure portal.

> [!IMPORTANT]
> If you have existing private endpoints created with previous private DNS zone `privatelink.<region>.batch.azure.com`, please follow [Migration with existing Batch account private endpoints](#migration-with-existing-batch-account-private-endpoints).

6. Select **Review + create**, then wait for Azure to validate your configuration.
7. When you see the **Validation passed** message, select **Create**.

> [!NOTE]
> You can also create the private endpoint from **Private Link Center** in Azure portal, or create a new resource by searching **private endpoint**.

## Use the private endpoint

After the private endpoint is provisioned, you can access the Batch account from within the same virtual network using the private endpoint.

- Private endpoint for **batchAccount**: can access Batch account data plane to manage pools/jobs/tasks.

- Private endpoint for **nodeManagement**: Batch pool's compute nodes can connect to and be managed by Batch node management service.

> [!IMPORTANT]
> If [public network access](public-network-access.md) is disabled with Batch account, performing account operations (for example pools, jobs) outside of the virtual network where the private endpoint is provisioned will result in an "AuthorizationFailure" message for Batch account in the Azure Portal.

To view the IP addresses for the private endpoint from the Azure portal:

1. Select **All resources**.
2. Search for the private endpoint that you created earlier.
3. Select the **DNS Configuration** tab to see the DNS settings and IP addresses.

:::image type="content" source="media/private-connectivity/access-private.png" alt-text="Private endpoint DNS settings and IP addresses":::

## Configure DNS zones

Use a [private DNS zone](../dns/private-dns-privatednszone.md) within the subnet where you've created the private endpoint. Configure the endpoints so that each private IP address is mapped to a DNS entry.

When you're creating the private endpoint, you can integrate it with a [private DNS zone](../dns/private-dns-privatednszone.md) in Azure. If you choose to instead use a [custom domain](../dns/dns-custom-domain.md), you must configure it to add DNS records for all private IP addresses reserved for the private endpoint.

## Migration with existing Batch account private endpoints

With the introduction of the new private endpoint sub-resource `nodeManagement` for Batch node management endpoint, the default private DNS zone for Batch account is simplified from `privatelink.<region>.batch.azure.com` to `privatelink.batch.azure.com`. The existing private endpoints for sub-resource `batchAccount` will continue to work, and no action is needed.

However, if you have existing `batchAccount` private endpoints that are enabled with automatic private DNS integration using previous private DNS zone, extra configuration is needed for the new `batchAccount` private endpoint to create in the same virtual network:

- If you don't need the previous private endpoint anymore, delete the private endpoint. Also unlink the previous private DNS zone from your virtual network. No more configuration is needed for the new private endpoint.

- Otherwise, after the new private endpoint is created:

  1. make sure the automatic private DNS integration has a DNS A record created in the new private DNS zone `privatelink.batch.azure.com`. For example, `myaccount.<region>     A  <IPv4 address>`.

  1. Go to previous private DNS zone `privatelink.<region>.batch.azure.com`.

  1. Manually add a DNS CNAME record. For example, `myaccount     CNAME => myaccount.<region>.privatelink.batch.azure.com`.

> [!IMPORTANT]
> This manual mitigation is only needed when you create a new **batchAccount** private endpoint with private DNS integration in the same virtual network which has existing private endpoints.

## Pricing

For details on costs related to private endpoints, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

## Current limitations and best practices

When creating a private endpoint with your Batch account, keep in mind the following:

- Private endpoint resources with the sub-resource **batchAccount** must be created in the same subscription as the Batch account.
- Resource movement is not supported for private endpoints with Batch accounts.
- If a Batch account resource is moved to a different resource group or subscription, the private endpoints can still work, but the association to the Batch account breaks. If you delete the private endpoint resource, its associated private endpoint connection still exists in your Batch account. You can manually remove connection from your Batch account.
- To delete the private connection, either delete the private endpoint resource, or delete the private connection in the Batch account (this action disconnects the related private endpoint resource).
- DNS records in the private DNS zone are not removed automatically when you delete a private endpoint connection from the Batch account. You must manually remove the DNS records before adding a new private endpoint linked to this private DNS zone. If you don't clean up the DNS records, unexpected access issues might happen.

## Next steps

- Learn how to [create Batch pools in virtual networks](batch-virtual-network.md).
- Learn how to [create Batch pools without public IP addresses](simplified-node-communication-pool-no-public-ip.md).
- Learn how to [configure public network access for Batch accounts](public-network-access.md).
- Learn how to [manage private endpoint connections for Batch accounts](manage-private-endpoint-connections.md).
- Learn about [Azure Private Link](../private-link/private-link-overview.md).
