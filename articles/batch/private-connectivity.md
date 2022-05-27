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

- Account endpoint (sub-resource: **batchAccount**): this is the endpoint for [Batch service REST API](https://docs.microsoft.com/en-us/rest/api/batchservice/) (data plane), for example managing pools, compute nodes, jobs, tasks, etc.

- (**Preview**) Compute node management endpoint (sub-resource: **nodeManagement**): this is the endpoint for compute nodes in the Batch pool to access Batch compute node management service, so that they can be managed by Batch service.

> [!IMPORTANT]
> - Sub-resource **nodeManagement** is only applicable with Batch accounts using [simplified compute node communication](simplified-compute-node-communication.md).
> - This preview sub-resource is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> - For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Azure portal

Use the following steps to create a private Batch account using the Azure portal:

1. Go to Batch account in Azure portal.
1. In **Settings**, select **Networking** and go to tab **Private Access**, then select **+ Private endpoint**.
   :::image type="content" source="media/private-connectivity/private-endpoint-connections.png" alt-text="Private endpoint connections":::
1. In the **Basics** pane, enter or select the subscription, resource group, private endpoint resource name and region details, then select **Next: Resource**.
   :::image type="content" source="media/private-connectivity/create-private-endpoint-basics.png" alt-text="Create a private endpoint - Basics pane":::
1. In the **Resource** pane, set the **Resource type** to **Microsoft.Batch/batchAccounts**. Select the Batch account you want to access, select the target sub-resource, then select **Next: Configuration**.
   :::image type="content" source="media/private-connectivity/create-private-endpoint-resource.png" alt-text="Create a private endpoint - Resource pane":::
1. In the **Configuration** pane, enter or select this information:
   - **Virtual network**: Select your virtual network.
   - **Subnet**: Select your subnet.
   - **Private IP configuration**: Select default "Dynamically allocate IP address".
   - **Integrate with private DNS zone**:	Select **Yes**. To connect privately with your private endpoint, you need a DNS record. We recommend that you integrate your private endpoint with a private DNS zone. You can also use your own DNS servers or create DNS records by using the host files on your virtual machines.
   - **Private DNS Zone**:	Select `privatelink.batch.azure.com`. The private DNS zone is determined automatically. You can't change it by using the Azure portal.

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
> If public network access is disabled with Batch account, performing account operations (for example pools, jobs) outside of the virtual network where the private endpoint is provisioned will result in an "AuthorizationFailure" message for Batch account in the Azure Portal.

To view the IP addresses for the private endpoint from the Azure portal:

1. Select **All resources**.
2. Search for the private endpoint that you created earlier.
3. Select the **DNS Configuration** tab to see the DNS settings and IP addresses.

:::image type="content" source="media/private-connectivity/access-private.png" alt-text="Private endpoint DNS settings and IP addresses":::

## Configure DNS zones

Use a [private DNS zone](../dns/private-dns-privatednszone.md) within the subnet where you've created the private endpoint. Configure the endpoints so that each private IP address is mapped to a DNS entry.

When you're creating the private endpoint, you can integrate it with a [private DNS zone](../dns/private-dns-privatednszone.md) in Azure. If you choose to instead use a [custom domain](../dns/dns-custom-domain.md), you must configure it to add DNS records for all private IP addresses reserved for the private endpoint.

## Migration with existing Batch account private endpoints

With the introduction of new sub-resource `nodeManagement` of private endpoints for Batch node management endpoint, the default private DNS zone for Batch account is simplified from `privatelink.<region>.batch.azure.com` to `privatelink.batch.azure.com`. The existing private endpoints for sub-resource `batchAccount` will continue to work, no action is needed.

However, if you have existing `batchAccount` private endpoints created before, and also enabled with automatic private DNS integration, follow the steps below to work together with newly created private endpoints in the same virtual network:

- If you don't need previous private endpoint anymore, delete the private endpoint, and also unlink the previous private DNS zone from your virtual network.

- If you want to create new private endpoint with private DNS integration in virtual network which has any existing `batchAccount` private endpoint with previous private DNS zone:
  - After the new private endpoint is created, the automatic private DNS integration should have DNS A record created in the new private DNS zone `privatelink.batch.azure.com` like below:
    `myaccount.<region>     A  <IPv4 address>`

  - Go to previous private DNS zone `privatelink.<region>.batch.azure.com`, and manually add DNS CNAME record like below:
    `myaccount     CNAME => myaccount.<region>.privatelink.batch.azure.com`

> [!IMPORTANT]
> This manual migration is only needed when you create a new private endpoint with private DNS integration in the same virtual network which has existing private endpoints.

## Pricing

For details on costs related to private endpoints, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

## Current limitations and best practices

When creating private endpoint with your Batch account, keep in mind the following:

- Private endpoint resource with sub-resource **batchAccount** must be created in the same subscription as the Batch account.
- Resource movement is not supported for private endpoints of Batch accounts.
- If a Batch account resource is moved to different resource group or subscription, its private endpoints can still work, but the association to Batch account is broken. If you delete the private endpoint resource, its associated private endpoint connection will still exist in your Batch account. You can manually remove it from the Batch account.
- To delete the private connection, you can either delete the private endpoint resource, or delete the private connection in Batch account which will set the related private endpoint resource to Disconnected state.
- DNS records in the private DNS zone are not removed automatically when you delete a private endpoint connection from the Batch account. You must manually remove the DNS records before adding a new private endpoint linked to this private DNS zone. If you don't clean up the DNS records, unexpected access issues might happen.

## Next steps

- Learn how to [create Batch pools in virtual networks](batch-virtual-network.md).
- Learn how to [create Batch pools without public IP addresses](batch-pool-no-public-ip-address.md)
- Learn how to [configure public network access for Batch accounts](public-network-access.md).
- Learn how to [manage private endpoint connections for Batch accounts](manage-private-endpoint-connections.md).
- Learn about [Azure Private Link](../private-link/private-link-overview.md).
