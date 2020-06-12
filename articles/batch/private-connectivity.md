---
title: Use private endpoints with Azure Batch accounts
description: Learn how to connect privately to an Azure Batch account by using private endpoints. 
ms.topic: how-to
ms.date: 06/12/2020
---

# Use private endpoints with Azure Batch accounts

By default, [Azure Batch accounts](accounts.md) have a public endpoint and are publicly accessible. The Batch service offers the ability to create private Batch accounts, disabling the public network access.

By using [Azure Private Link](../private-link/private-link-overview.md), you can connect to an Azure Batch account via a [private endpoint](../private-link/private-endpoint-overview.md). The private endpoint is a set of private IP addresses in a subnet within your virtual network. You can then limit access to an Azure Batch account over private IP addresses.

Private Link allows users to access an Azure Batch account from within the virtual network or from any peered virtual network. Resources mapped to Private Link are also accessible on-premises over private peering through VPN or [Azure ExpressRoute](../expressroute/expressroute-introduction.md).

You can connect to an Azure Batch account configured with Private Link by using the [automatic or manual approval method](../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow).

This article describes the steps to create a private Batch account and access it using a private endpoint.

> [!IMPORTANT]
> Support for private connectivity in Azure Batch is currently in public preview for the West Central US, West US 2, East US, South Central US, US Gov Virginia, and US Gov Arizona regions.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Azure portal

Use the following steps to create a private Batch account using the Azure portal:

1. From the **Create a resource** pane, choose **Batch Service** and then select **Create**.
2. Enter the subscription, resource group, region and Batch account name in the **Basics** tab, then select **Next: Advanced**.
3. In the **Advanced** tab, set **Public network access** to **Disabled**.
4. In **Settings**, select **Private endpoint connections** and then select **+ Private endpoint**.
   :::image type="content" source="media/private-connectivity/private-endpoint-connections.png" alt-text="Private endpoint connections":::
5. In the **Basics** pane, enter or select the subscription, resource group, private endpoint resource name and region details, then select **Next: Resource**.
6. In the **Resource** pane, set the **Resource type** to **Microsoft.Batch/batchAccounts**. Select the private Batch account you want to access, then select **Next: Configuration**.
   :::image type="content" source="media/private-connectivity/create-private-endpoint.png" alt-text="Create a private endpoint - Resource pane":::
7. In the **Configuration** pane, enter or select this information:
   - **Virtual network**: Select your virtual network.
   - **Subnet**: Select your subnet.
   - **Integrate with private DNS zone**:	Select **Yes**. To connect privately with your private endpoint, you need a DNS record. We recommend that you integrate your private endpoint with a private DNS zone. You can also use your own DNS servers or create DNS records by using the host files on your virtual machines.
   - **Private DNS Zone**:	Select privatelink.<region>.batch.azure.com. The private DNS zone is determined automatically. You can't change it by using the Azure portal.
8. Select **Review + create**, then wait for Azure to validate your configuration.
9. When you see the **Validation passed** message, select **Create**.

After the private endpoint is provisioned, you can access the Batch account from VMs in the same virtual network using the private endpoint. To view the IP address from the Azure portal:

1. Select **All resources**.
2. Search for the private endpoint that you created earlier.
3. Select the **Overview** tab to see the DNS settings and IP addresses.

:::image type="content" source="media/private-connectivity/access-private.png" alt-text="Private endpoint DNS settings and IP addresses":::

## Azure Resource Manager template

When [creating a Batch account by using Azure Resource Manager template](quick-create-template.md), modify the template to set **publicNetworkAccess** to **Disabled** as shown below.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "batchAccountName": {
      "type": "string",
      },
    "location": {
      "type": "string",
    }
  },
  "resources": [
    {
      "name": "[parameters('batchAccountName')]",
      "type": "Microsoft.Batch/batchAccounts",
      "apiVersion": "2020-03-01-preview",
      "location": "[parameters('location')]",
      "dependsOn": []
      "properties": {
        "poolAllocationMode": "BatchService"
        "publicNetworkAccess": "Disabled"
      }
    }
  ]
}
```

## Configure DNS zones

Use a [private DNS zone](../dns/private-dns-privatednszone.md) within the subnet where you've created the private endpoint. Configure the endpoints so that each private IP address is mapped to a DNS entry.

When you're creating the private endpoint, you can integrate it with a [private DNS zone](../dns/private-dns-privatednszone.md) in Azure. If you choose to instead use a [custom domain](../dns/dns-custom-domain.md), you must configure it to add DNS records for all private IP addresses reserved for the private endpoint.

## Pricing

For details on costs related to private endpoints, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

## Current limitations and best practices

When creating your private Batch account, keep in mind the following:

- Private endpoint resources must be created in the same subscription as the Batch account.
- To delete the private connection, you must delete the private endpoint resource.
- Once a Batch account is created with public network access, you can't change it to private access only.
- DNS records in the private DNS zone are not removed automatically when you delete a private endpoint or when you remove a region from the Batch account. You must manually remove the DNS records before adding a new private endpoint linked to this private DNS zone. If you don't clean up the DNS records, unexpected data plane issues might happen, such as data outages to regions added after private endpoint removal or region removal.

## Next steps

- Learn how to [create Batch pools in virtual networks](batch-virtual-network.md).
- Learn how to [create Batch pools with specified public IP addresses](create-pool-public-ip.md).
- Learn about [Azure Private Link](../private-link/private-link-overview.md).
