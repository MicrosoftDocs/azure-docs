---
title: Enable replication for on-premises machines with private endpoints in Azure Site Recovery 
description: This article describes how to configure replication for on-premises machines with private endpoints by using Site Recovery.
author: mayurigupta13
ms.author: mayg
ms.service: site-recovery
ms.topic: article
ms.date: 07/14/2020
---
# Replicate on-premises machines with private endpoints

Azure Site Recovery allows you to use
[Azure Private Link](../private-link/private-endpoint-overview.md) private endpoints for replicating
your on-premises machines to virtual network in Azure. Support for private endpoint
access to a recovery vault is supported for the following regions:

- Azure commercial: South Central US, West US 2, East US
- Azure Government: US Gov Virginia, US Gov Arizona, US Gov Texas, US DoD East, US DoD Central

This article provides instructions for you to perform the following steps:

- Create an Azure Backup Recovery Services vault to protect your machines.
- Enable a managed identity for the vault and grant the required permissions to access customer
  storage accounts to replicate traffic from on-premises to Azure target locations. Managed identity
  access for storage is necessary when you're setting up Private Link access to the vault.
- Make DNS changes required for private endpoints
- Create and approve private endpoints for a vault inside a virtual network
- Create private endpoints for the storage accounts. You can continue to allow public or firewalled
  access for storage as needed. Creation of a private endpoint for accessing storage isn't mandatory
  for Azure Site Recovery.
  
Below is a reference architecture on how the replication workflow changes for hybrid disaster
recover with private endpoints. Private endpoints can't be created in your on-premises network. In
order to use private links, you need to create an Azure virtual network (called a "bypass network"
in this article), establish private connectivity between on-premises and the bypass network, and
then create private endpoints in the bypass network. The choice of private connectivity is at your
discretion.

:::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/architecture.png" alt-text="Reference architecture for Site Recovery with private endpoints.":::

## Prerequisites and caveats

- Support for private links is enabled for Site Recovery infrastructure with **9.35** version and
  above.
- Private endpoints can be created only for new Recovery Services vaults that don't have any items
  registered to the vault. As such, private endpoints **must be created before any items are added
  to the vault**. Review the pricing structure for
  [private endpoints](https://azure.microsoft.com/pricing/details/private-link/).
- When a private endpoint is created for a vault, the vault is locked down and **isn't accessible
  from networks other than those networks that have private endpoints**.
- Azure Active Directory currently doesn't support private endpoints. As such, IPs and fully
  qualified domain names required for Azure Active Directory to work in a region need to be allowed
  outbound access from the secured Azure virtual network. You can also use network security group
  tag "Azure Active Directory" and Azure Firewall tags for allowing access to Azure Active
  Directory, as applicable.
- **Five IP addresses are required** in the bypass network where you create your private
  endpoint. When you create a private endpoint for the vault, Site Recovery creates five private
  links for access to its microservices.
- **One additional IP address is required** in the bypass network for private endpoint connectivity
  to a cache storage account. The connectivity method, such as internet or
  [ExpressRoute](../expressroute/index.yml), between on-premises and your storage account endpoint
  is at your description. Establishing a private link is optional. Private endpoints for storage can
  only be created on General Purpose v2 type. Review the pricing structure for
  [data transfer on GPv2](https://azure.microsoft.com/pricing/details/storage/page-blobs/).

 ## Creating and using private endpoints for Site Recovery

 This section talks about the steps involved in creating and using private endpoints for Azure Site
 Recovery inside your virtual networks.

> [!NOTE]
> It's highly recommended that you follow these steps in the same sequence as provided. Failure to
> do so may lead to the vault being rendered unable to use private endpoints and requiring you to
> restart the process with a new vault.

## Create a Recovery Services vault.

A recovery services vault is an entity that contains the replication information of machines and is
used to trigger Site Recovery operations. For steps to create a recovery services vault in the Azure
region where you wish to failover if there is a disaster, see
[Create a Recovery Services vault](./azure-to-azure-tutorial-enable-replication.md#create-a-recovery-services-vault).

## Enable the managed identity for the vault.

A [managed identity](../active-directory/managed-identities-azure-resources/overview.md) allow the
vault to gain access to the customer's storage accounts. Site Recovery needs to access the target
storage and cache/log storage accounts depending on the scenario requirement. Managed identity
access is essential when you're using private links service for the vault.

1. Go to your Recovery Services vault. Select **Identity** under _Settings_.

   :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/enable-managed-identity-in-vault.png" alt-text="Shows the Azure portal and the Recovery Services page.":::

1. Change the **Status** to _On_ and select **Save**.

1. An **Object ID** is generated indicating that the vault is now registered with Azure Active
   Directory.

## Create private endpoints for the Recovery Services vault

You'll need one private endpoint for the vault in the bypass network for the protection of machines
in the on-premises source network. Create the private endpoint using the Private Link Center in the
portal or through [Azure PowerShell](../private-link/create-private-endpoint-powershell.md).

1. In the Azure portal search bar, search for and select "Private Link". This action takes you to
   the Private Link Center.

   :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/search-private-links.png" alt-text="Shows searching the Azure portal for the Private Link Center.":::

1. On the left navigation bar, select **Private Endpoints**. Once on the Private Endpoints page,
   select **\+Add** to start creating a private endpoint for your vault.

   :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/create-private-endpoints.png" alt-text="Shows creating a private endpoint in the Private Link Center.":::

1. Once in the "Create Private Endpoint" experience, you're required to specify details for creating
   your private endpoint connection.

   1. **Basics**: Fill in the basic details for your private endpoints. The region should be the
      same as the bypass network.

      :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/create-private-endpoints-basic-tab.png" alt-text="Shows the Basic tab, project details, subscription, and other related fields for creating a private endpoint in the Azure portal.":::

   1. **Resource**: This tab requires you to mention the platform-as-a-service resource for which
      you want to create your connection. Select _Microsoft.RecoveryServices/vaults_ from the
      **Resource type** for your selected subscription. Then, choose the name of your Recovery
      Services vault for **Resource** and set _Azure Site Recovery_ as the **Target sub-resource**.

      :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/create-private-endpoints-resource-tab.png" alt-text="Shows the Resource tab, resource type, resource, and target sub-resource fields for linking to a private endpoint in the Azure portal.":::

   1. **Configuration**: In configuration, specify the bypass network and subnet where you want the
      private endpoint to be created. Enable integration with private DNS zone by selecting **Yes**.
      Choose an already created DNS zone or create a new one. Selecting **Yes** automatically links
      the zone to the bypass network and adds the DNS records that are required for DNS resolution
      of new IPs and fully qualified domain names created for the private endpoint.

      Ensure that you choose to create a new DNS zone for every new private endpoint connecting to
      the same vault. If you choose an existing private DNS zone, the previous CNAME records are
      overwritten. Refer to
      [Private endpoint guidance](../private-link/private-endpoint-overview.md#private-endpoint-properties)
      before you continue.

      If your environment has a hub and spoke model, you need only one private endpoint and only one
      private DNS zone for the entire setup since all your virtual networks already have peering
      enabled between them. For more information, see
      [Private endpoint DNS integration](../private-link/private-endpoint-dns.md#virtual-network-workloads-without-custom-dns-server).

      To manually create the private DNS zone, follow the steps in
      [Create private DNS zones and add DNS records manually](#create-private-dns-zones-and-add-dns-records-manually).

      :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/create-private-endpoints-configuration-tab.png" alt-text="Shows the Configuration tab with networking and DNS integration fields for configuration of a private endpoint in the Azure portal.":::

   1. **Tags**: Optionally, you can add tags for your private endpoint.

   1. **Review \+ create**: When the validation completes, select **Create** to create the private
      endpoint.

Once the private endpoint is created, five fully qualified domain names are added to the private
endpoint. These links enable the machines in the on-premises network to get access via the bypass
network to all the required Site Recovery microservices in the context of the vault. The same
private endpoint may be used for the protection of any Azure machine in the bypass network and all
peered networks.

The five domain names are formatted with the following pattern:

`{Vault-ID}-asr-pod01-{type}-.{target-geo-code}.siterecovery.windowsazure.com`

## Approve private endpoints for Site Recovery

If the user creating the private endpoint is also the owner of the Recovery Services vault, the
private endpoint created above is auto approved within a few minutes. Otherwise, the owner of the
vault must approve the private endpoint before you to use it. To approve or reject a requested
private endpoint connection, go to **Private endpoint connections** under "Settings" on the recovery
vault page.

You can go to the private endpoint resource to review the status of the connection before
proceeding.

:::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/vault-private-endpoint-connections.png" alt-text="Shows the private endpoint connections page of the vault and the list of connections in the Azure portal.":::

## <a name="create-private-endpoints-for-the-cache-storage-account"></a>(Optional) Create private endpoints for the cache storage account

A private endpoint to Azure Storage may be used. Creating private endpoints for storage access is
_optional_ for Azure Site Recovery replication. When creating a private endpoint for storage, you
need a private endpoint for the cache/log storage account in your bypass virtual network.

> [!NOTE]
> Private endpoint for storage can only be created on a **General Purpose v2** storage accounts. For
> pricing information, see
> [Standard page blob prices](https://azure.microsoft.com/pricing/details/storage/page-blobs/).

Follow the
[guidance for creation of private storage](../private-link/create-private-endpoint-storage-portal.md#create-your-private-endpoint)
to create a storage account with private endpoint. Ensure to select **Yes** to integration with
private DNS zone. Select an already created DNS zone or create a new one.

## Grant required permissions to the vault

Depending on your setup, you may need one or more storage accounts in the target Azure region. Next,
grant the managed identity permissions for all the cache/log storage accounts required by Site
Recovery. In this case, you must create the required storage accounts in advance.

Before enabling replication of virtual machines, the managed identity of the vault must have the
following role permissions depending on the type of storage account:

- Resource Manager based storage accounts (Standard Type):
  - [Contributor](../role-based-access-control/built-in-roles.md#contributor)
  - [Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)
- Resource Manager based storage accounts (Premium Type):
  - [Contributor](../role-based-access-control/built-in-roles.md#contributor)
  - [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner)
- Classic storage accounts:
  - [Classic Storage Account Contributor](../role-based-access-control/built-in-roles.md#classic-storage-account-contributor)
  - [Classic Storage Account Key Operator Service Role](../role-based-access-control/built-in-roles.md#classic-storage-account-key-operator-service-role)

The following steps describe how to add a role-assignment to your storage accounts, one at a time:

1. Go to the storage account and navigate to **Access control (IAM)** on the left side of the page.

1. Once on **Access control (IAM)**, in the "Add a role assignment" box select **Add**.

   :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/storage-role-assignment.png" alt-text="Shows the Access control (IAM) page on a storage account and the 'Add a role assignment' button in the Azure portal.":::

1. In the "Add a role assignment" side page, choose the role from the list above in the **Role**
   drop-down. Enter the **name** of the vault and select **Save**.

   :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/storage-role-assignment-select-role.png" alt-text="Shows the Access control (IAM) page on a storage account and the options to select a Role and which principal to grant that role to in the Azure portal.":::

In addition to these permissions, MS trusted services need to be allowed access as well. Go to
"Firewalls and virtual networks" and select "Allow trusted Microsoft services to access this storage
account" checkbox in **Exceptions**.

## Protect your virtual machines

Once all the above configurations are completed, continue with the setup of your on-premises
infrastructure.

- [Deploy Configuration Server for VMware and physical machines](./vmware-azure-deploy-configuration-server.md)
- OR [Setup Hyper-V environment for replication](./hyper-v-azure-tutorial.md#set-up-the-source-environment)

Once the setup is complete, enable the replication for your source machines. Ensure that the setup
of infrastructure is done only after the private endpoints for the vault are already created in the
bypass network.

## Create private DNS zones and add DNS records manually

If you didn't select the option to integrate with private DNS zone at the time of creating private
endpoint for the vault, follow the steps in this section.

Create one private DNS zone to allow the Site Recovery provider (for Hyper-V machines) or the
Process Server (for VMware/physical machines) to resolve private link fully qualified domain names
to private IPs.

1. Create a private DNS zone

   1. Search for "Private DNS zone" in the **All services** search bar and select "Private DNS
      zones" from the drop-down.

      :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/search-private-dns-zone.png" alt-text="Shows searching for 'private dns zone' on new resources page in the Azure portal.":::

   1. Once on the "Private DNS zones" page, select the **\+Add** button to start creating a new
      zone.

   1. On the "Create private DNS zone" page, fill in the required details. Enter the name of the
      private DNS zone as `privatelink.siterecovery.windowsazure.com`. You can choose any resource
      group and any subscription to create it.

      :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/create-private-dns-zone.png" alt-text="Shows the Basics tab of the Create Private DNS zone page and related project details in the Azure portal.":::

   1. Continue to the **Review \+ create** tab to review and create the DNS zone.

1. Link private DNS zone to your virtual network

   The private DNS zone created above must now be linked to the bypass.

   1. Go to the private DNS zone that you created in the previous step and navigate to **Virtual
      network links** on the left side of the page. Once there, select the **\+Add** button.

   1. Fill in the required details. The **Subscription** and **Virtual network** fields must be
      filled with the corresponding details of the bypass network. The other fields must be left as
      is.

      :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/add-virtual-network-link.png" alt-text="Shows the page to add a virtual network link with the link name, subscription, and related virtual network in the Azure portal.":::

1. Add DNS records

   Once you've created the required private DNS zone and the private endpoint, you need to add DNS
   records to your DNS zone.

   > [!NOTE]
   > In case you are using a custom private DNS zone, make sure that similar entries are made as
   > discussed below.

   This step requires you to make entries for each fully qualified domain name in your private
   endpoint into your private DNS zone.

   1. Go to your private DNS zone and navigate to the **Overview** section on the left side of the
      page. Once there, select **\+Record set** to start adding records.

   1. In the "Add record set" page that opens, add an entry for each fully qualified domain name and
      private IP as an _A_ type record. The list of fully qualified domain names and IPs can be
      obtained from the "Private Endpoint" page in **Overview**. As shown in the example below, the
      first fully qualified domain name from the private endpoint is added to the record set in the
      private DNS zone.

      These fully qualified domain names match the pattern:
      `{Vault-ID}-asr-pod01-{type}-.{target-geo-code}.siterecovery.windowsazure.com`

      :::image type="content" source="./media/hybrid-how-to-enable-replication-private-endpoints/add-record-set.png" alt-text="Shows the page to add a DNS A type record for the fully qualified domain name to the private endpoint in the Azure portal.":::

## Next steps

Now that you've enabled private endpoints for your virtual machine replication, see these other
pages for additional and related information:

- [Deploy an on-premises configuration server](./vmware-azure-deploy-configuration-server.md)
- [Set up disaster recovery of on-premises Hyper-V VMs to Azure](./hyper-v-azure-tutorial.md)