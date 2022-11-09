---
title: Use simplified compute node communication
description: Learn how the Azure Batch service is simplifying the way Batch pool infrastructure is managed and how to opt in or out of the feature.
ms.topic: how-to
ms.date: 06/02/2022
ms.custom: references_regions
---

# Use simplified compute node communication

An Azure Batch pool contains one or more compute nodes which execute user-specified workloads in the form of Batch tasks. To enable Batch functionality and Batch pool infrastructure management, compute nodes must communicate with the Azure Batch service.

This document describes forthcoming changes with how the Azure Batch service communicates with Batch pool compute nodes, the network configuration changes which may be required, and how to opt your Batch accounts in or out of using the new simplified compute node communication feature during the public preview period.

> [!IMPORTANT]
> Support for simplified compute node communication in Azure Batch is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Opting in isn't required at this time. However, in the future, using simplified compute node communication will be required and defaulted for all Batch accounts.

## Supported regions

Simplified compute node communication in Azure Batch is currently available for the following regions:

- Public: Central US EUAP, East US 2 EUAP, West Central US, North Central US, South Central US, East US, East US 2, West US 2, West US, Central US, West US 3, East Asia, South East Asia, Australia East, Australia Southeast, Brazil Southeast, Brazil South, Canada Central, Canada East, North Europe, West Europe, Central India, South India, Japan East, Japan West, Korea Central, Korea South, Sweden Central, Sweden South, Switzerland North, Switzerland West, UK West, UK South, UAE North, France Central, Germany West Central, Norway East, South Africa North.

- Government: USGov Arizona, USGov Virginia, USGov Texas.

- China: China North 3.

## Compute node communication changes

The Azure Batch service is simplifying the way Batch pool infrastructure is managed on behalf of users. The new communication method reduces the complexity and scope of inbound and outbound networking connections required in baseline operations.

Batch pools in accounts which haven't been opted in to simplified compute node communication require the following networking rules in network security groups (NSGs), user-defined routes (UDRs), and firewalls when [creating a pool in a virtual network](batch-virtual-network.md):

- Inbound:
  - Destination ports 29876, 29877 over TCP from BatchNodeManagement.*region*

- Outbound:
  - Destination port 443 over TCP to Storage.*region*
  - Destination port 443 over TCP to BatchNodeManagement.*region* for certain workloads that require communication back to the Batch Service, such as Job Manager tasks

With the new model, Batch pools in accounts that use simplified compute node communication require the following networking rules in NSGs, UDRs, and firewalls:

- Inbound:
  - None

- Outbound:
  - Destination port 443 over TCP to BatchNodeManagement.*region*

Outbound requirements for a Batch account can be discovered using the [List Outbound Network Dependencies Endpoints API](/rest/api/batchmanagement/batch-account/list-outbound-network-dependencies-endpoints). This API will report the base set of dependencies, depending upon the Batch account pool communication model. User-specific workloads may need additional rules such as opening traffic to other Azure resources (such as Azure Storage for Application Packages, Azure Container Registry, etc.) or endpoints like the Microsoft package repository for virtual file system mounting functionality.

## Benefits of the new model

Azure Batch users who [opt in to the new communication model](#opt-your-batch-account-in-or-out-of-simplified-compute-node-communication) benefit from simplification of networking connections and rules.

Simplified compute node communication helps reduce security risks by removing the requirement to open ports for inbound communication from the internet. Only a single outbound rule to a well-known Service Tag is required for baseline operation.

The new model also provides more fine-grained data exfiltration control, since outbound communication to Storage.*region* is no longer required. You can explicitly lock down outbound communication to Azure Storage if required for your workflow (such as AppPackage storage accounts, other storage accounts for resource files or output files, or other similar scenarios).

Even if your workloads aren't currently impacted by the changes (as described in the next section), you may still want to [opt in to use simplified compute node communication](#opt-your-batch-account-in-or-out-of-simplified-compute-node-communication) now. This will ensure your Batch workloads are ready for any future improvements enabled by this model.

## Scope of impact

In many cases, this new communication model won't directly affect your Batch workloads. However, simplified compute node communication will have an impact for the following cases:

- Users who specify a Virtual Network as part of creating a Batch pool and do one or both of the following:
   - Explicitly disable outbound network traffic rules that are incompatible with simplified compute node communication.
   - Use UDRs and firewall rules that are incompatible with simplified compute node communication.
- Users who enable software firewalls on compute nodes and explicitly disable outbound traffic in software firewall rules which are incompatible with simplified compute node communication.

If either of these cases applies to you, and you would like to opt in to the preview, follow the steps outlined in the next section to ensure that your Batch workloads can still function under the new model.

### Required network configuration changes

For impacted users, the following set of steps is required to migrate to the new communication model:

1. Ensure your networking configuration as applicable to Batch pools (NSGs, UDRs, firewalls, etc.) includes a union of the models (that is, the network rules prior to simplified compute node communication and after). At a minimum, these rules would be:
   - Inbound:
     - Destination ports 29876, 29877 over TCP from BatchNodeManagement.*region*
   - Outbound:
     - Destination port 443 over TCP to Storage.*region*
     - Destination port 443 over TCP to BatchNodeManagement.*region*
1. If you have any additional inbound or outbound scenarios required by your workflow, you'll need to ensure that your rules reflect these requirements.
1. [Opt in to simplified compute node communication](#opt-your-batch-account-in-or-out-of-simplified-compute-node-communication) as described below.
1. Use one of the following options to update your workloads to use the new communication model. Whichever method you use, keep in mind that pools without public IP addresses are unaffected and can't currently use simplified compute node communication. Please see the [Current limitations](#current-limitations) section.
   1. Create new pools and validate that the new pools are working correctly. Migrate your workload to the new pools and delete any earlier pools.
   1. Resize all existing pools to zero nodes and scale back out.
1. After confirming that all previous pools have been either deleted or scaled to zero and back out, query the [List Outbound Network Dependencies Endpoints API](/rest/api/batchmanagement/batch-account/list-outbound-network-dependencies-endpoints) to confirm that no outbound rule to Azure Storage for the region exists (excluding any autostorage accounts if linked to your Batch account).
1. Modify all applicable networking configuration to the Simplified Compute Node Communication rules, at the minimum (please note any additional rules needed as discussed above):
   - Inbound:
     - None
   - Outbound:
     - Destination port 443 over TCP to BatchNodeManagement.*region*

If you follow these steps, but later want to stop using simplified compute node communication, you'll need to do the following:

1. [Opt out of simplified compute node communication](#opt-your-batch-account-in-or-out-of-simplified-compute-node-communication) as described below.
1. Migrate your workload to new pools, or resize existing pools and scale back out (see step 4 above).
1. Confirm that all of your pools are no longer using simplified compute node communication by using the [List Outbound Network Dependencies Endpoints API](/rest/api/batchmanagement/batch-account/list-outbound-network-dependencies-endpoints). You should see an outbound rule to Azure Storage for the region (independent of any autostorage accounts linked to your Batch account).

## Opt your Batch account in or out of simplified compute node communication

To opt a Batch account in or out of simplified compute node communication, [create a new support request in the Azure portal](../azure-portal/supportability/how-to-create-azure-support-request.md).

> [!IMPORTANT]
> When you opt in (or opt out) of simplified compute node communication, the change only impacts future behavior. Any Batch pools  containing non-zero compute nodes that were created before the request are unaffected, and will use whichever model was active before the request. Please see the migration steps for more information on how to migrate existing pools before either opting-in or opting-out.

Use the following options when creating your request.

:::image type="content" source="media/simplified-compute-node-communication/support-request-opt-in.png" alt-text="Screenshot of a support request opting in to simplified compute node communication.":::

1. For **Issue type**, select **Technical**.
1. For **Service type**, select **Batch Service**.
1. For **Resource**, select the Batch account for this request.
1. For **Summary**:
   - To opt in, type "Enable simplified compute node communication".
   - To opt our, type "Disable simplified compute node communication".
1. For **Problem type**, select **Batch Accounts**.
1. For **Problem subtype**, select **Other issues with Batch Accounts**.
1. Select **Next**, then select **Next** again to go to the **Additional details** page.
1. In **Additional details**, you can optionally specify that you want to enable all of the Batch accounts in your subscription, or across multiple subscriptions. If you do so, be sure to include the subscription IDs here.
1. Make any other required selections on the page, then select **Next**.
1. Review your request details, then select **Create** to submit your support request.

After your request has been submitted, you'll be notified once the account has been opted in (or out).

## Current limitations

The following are known limitations for accounts that opt in to simplified compute node communication:

- Limited migration support for previously created pools without public IP addresses ([V1 preview](batch-pool-no-public-ip-address.md)). They can only be migrated if created in a [virtual network](batch-virtual-network.md), otherwise they won't use simplified compute node communication, even if the Batch account has opted in.
- Cloud Service Configuration pools are currently not supported for simplified compute node communication and are generally deprecated. We recommend using Virtual Machine Configuration for your Batch pools. For more information, see [Migrate Batch pool configuration from Cloud Services to Virtual Machine](batch-pool-cloud-service-to-virtual-machine-configuration.md).

## Next steps

- Learn how to [use private endpoints with Batch accounts](private-connectivity.md).
- Learn more about [pools in virtual networks](batch-virtual-network.md).
- Learn how to [create a pool with specified public IP addresses](create-pool-public-ip.md).
- Learn how to [create a pool without public IP addresses](simplified-node-communication-pool-no-public-ip.md).
