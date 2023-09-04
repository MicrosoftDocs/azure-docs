---
title: Troubleshoot AKS hybrid cluster provisioning failures for Azure Operator Nexus
description: Troubleshoot Azure Kubernetes Service (AKS) hybrid cluster provisioning failures, and learn how to debug failure codes.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 05/14/2023
ms.author: v-saambe
author: v-saambe
---

# Troubleshoot AKS hybrid cluster provisioning failures

To gather the data needed to diagnose Azure Kubernetes Service (AKS) hybrid cluster creation or management problems for Azure Operator Nexus, you first need to [check the status of your installation](/azure/AkS/Hybrid/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster).

:::image type="content" source="media/troubleshoot-aks-hybrid-cluster/aks-hybrid-connected-status.png" alt-text="Screenshot that shows the connection status and provisioning state of an AKS hybrid cluster." lightbox="media/troubleshoot-aks-hybrid-cluster/aks-hybrid-connected-status-expanded.png":::

If **Status** isn't **Connected** and **Provisioning state** isn't **Succeeded**, the installation failed. This article can help you troubleshoot the failure.

## Prerequisites

* Install the latest version of the
  [appropriate Azure CLI extensions](./howto-install-cli-extensions.md).
* Gather this information:
  * Tenant ID
  * Subscription ID
  * Cluster name and resource group
  * Network fabric controller and resource group
  * Network fabric instances and resource group
  * AKS hybrid cluster name and resource group
* Prepare Azure CLI commands, Bicep templates, and Azure Resource Manager templates (ARM templates) that you use for resource creation.

## What does an unhealthy AKS hybrid cluster look like?

Several types of failures look similar to a user.

In the Azure portal, an unhealthy cluster might show:

* An alert that says "This cluster isn't connected to Azure."
* A status of **Offline**.
* A message that refers to certificate expiration time for a managed identity: "Couldn't display date/time, invalid format."

In the Azure CLI, check the output of the following command:

~~~ Azure CLI
az hybridaks show -g <>--name <>
~~~

An unhealthy cluster might show:

* `provisioningState`: `Failed`.
* `provisioningState`: `Succeeded`, but null values for fields such as `lastConnectivityTime` and `managedIdentityCertificateExpirationTime`, or an `errorMessage` field that isn't null.

## Troubleshoot basic network requirements

At a minimum, every AKS hybrid cluster needs a default Container Network Interface (CNI) network and a cloud services network. Starting from the bottom up, consider managed network fabric resources, network cloud resources, and AKS hybrid resources.

### Network fabric resources

* Each network cloud cluster can support up to 200 cloud services networks.
* The fabric must be configured with a Layer 3 (L3) isolation domain and an L3 internal network for use with the default CNI network.
* The VLAN range can be greater than 1,000 for the default CNI network.
* The L3 isolation domain must be successfully enabled.

### Network cloud resources

* The cloud services network must be created.
* Use the correct hybrid AKS extended location. You can get it from the respective site cluster while you're creating the AKS hybrid resources.
* The default CNI network must be created with an IPv4 prefix and a VLAN that matches an existing L3 isolation domain.
* The IPv4 prefix must be unique across all default CNI networks and Layer 3 networks.
* The networks must have a `provisioningState` value of `Succeeded`.

[Learn how to connect a network cloud by using the Azure CLI](./howto-install-cli-extensions.md?tabs=linux#install-networkcloud-cli-extension).

### AKS hybrid resources

To be used by an AKS hybrid cluster, each network cloud network must be "wrapped" in an AKS hybrid virtual network. [Learn how to configure an AKS hybrid virtual network by using the Azure CLI](/cli/azure/hybridaks/vnet).

## Troubleshoot common problems

Any of the following problems can cause the AKS hybrid cluster to fail to be fully provisioned.

### AKS hybrid clusters might fail or time out when they're created concurrently

The Azure Arc appliance can handle creating only one AKS hybrid cluster at a time within an instance. After you create a single AKS hybrid cluster, you must wait for its provisioning status to be `Succeeded` and for the cluster status to appear as **Connected** or **Online** in the Azure portal.

If you tried to create several at once and have them in a `Failed` state, delete all failed clusters and any partially succeeded clusters. Anything that isn't a fully successful cluster should be deleted. 

After all clusters and artifacts are deleted, wait a few minutes for the Azure Arc appliance and cluster operators to reconcile. Then try to create a single new AKS hybrid cluster. Wait for that to come up successfully and report as **Connected** or **Online**. You should now be able to continue creating AKS hybrid clusters, one at a time.

### Case mismatch between an AKS hybrid virtual network and a network cloud network

For you to configure an AKS hybrid virtual network, the resource IDs for the network cloud network must precisely match the Azure Resource Manager resource IDs. To ensure that the IDs have identical uppercase and lowercase letters, ensure that you use the correct casing when you're setting up the network.

If you're using the Azure CLI, use the `--aods-vnet-id*` parameter. If you're using Azure Resource Manager, Bicep, or a manual Azure REST API call, use the value of `.properties.infraVnetProfile.networkCloud.networkId`.

The most reliable way to obtain the correct value for creating the virtual network is to query the object for its ID. For example:

~~~bash
az networkcloud cloudservices show -g "example-rg" -n "csn-name" -o tsv --query id
az networkcloud defaultcninetwork show -g "example-rg" -n "dcn-name" -o tsv --query id
az networkcloud l3network show -g "example-rg" -n "l3n-name" -o tsv --query id
~~~

### L3 isolation domain or L2 isolation domain isn't enabled

At a high level, the steps to create isolation domains are:

1. Create the L3 isolation domain.
1. Add one or more internal networks.
1. Add one external network (optional, if northbound connectivity is required).
1. Enable the L3 isolation domain by using the following command:

   ~~~bash
   az networkfabric l3domain update-admin-state --resource-group "RESOURCE_GROUP_NAME" --resource-name "L3ISOLATIONDOMAIN_NAME" --state "Enable"
   ~~~

It's important to check that the fabric resources achieve an `administrativeState` value of `Enabled`, and that the `provisioningState` value is `Succeeded`. If the `update-admin-state` step is skipped or unsuccessful, the networks can't operate. You can use `show` commands to check the values. For example:

~~~bash
az networkfabric l3domain show -g "example-rg" --resource-name "l2domainname" -o table
az networkfabric l2domain show -g "example-rg" --resource-name "l3domainname" -o table
~~~

### Network cloud network status is Failed

When you create networks, ensure that they come up successfully. In particular, pay attention to the following constraints when you're creating default CNI networks:

* The IPv4 prefix and VLAN need to match the internal network in the referenced L3 isolation domain.
* The IPv4 prefix must be unique across default CNI networks (and Layer 3 networks) in the network cloud cluster.

If you're using the Azure CLI to create these resources, the `--debug` option is helpful. The output includes an operation status URL, which you can query by using `az rest`.

Depending on the mechanism used for creation (Azure portal, Azure CLI, Azure Resource Manager), it's sometimes hard to see why resources are `Failed`.

One useful tool to help surface errors is the [az monitor activity-log](/cli/azure/monitor/activity-log) command. You can use it to show activities for a specific resource ID, resource group, or correlation ID. (You can also get this information in the **Activity** area of the Azure portal.)

For example, to see why a default CNI network failed, use the following code:

~~~bash
RESOURCE_ID="/subscriptions/$subscriptionsid/resourceGroups/example-rg/providers/Microsoft.NetworkCloud/defaultcninetworks/example-duplicate-prefix-dcn"
 
az monitor activity-log list --resource-id "${RESOURCE_ID}" -o tsv --query '[].properties.statusMessage' | jq
~~~

Here's the result:

~~~output
{
  "status": "Failed",
  "error": {
    "code": "ResourceOperationFailure",
    "message": "The resource operation completed with terminal provisioning state 'Failed'.",
    "details": [
      {
        "code": "Specified IPv4Connected Prefix 10.0.88.0/24 overlaps with existing prefix 10.0.88.0/24 from example-dcn",
        "message": "admission webhook \"vdefaultcninetwork.kb.io\" denied the request: Specified IPv4Connected Prefix 10.0.88.0/24 overlaps with existing prefix 10.0.88.0/24 from example-dcn"
      }
    ]
  }
}

~~~

### Memory saturation on an AKS hybrid node

There have been incidents where workloads for cloud-native network functions (CNFs) can't start because of resource constraints on the AKS hybrid node that the CNF workload is scheduled on. It has happened on nodes that have Azure Arc pods that are consuming many compute resources. To reduce memory saturation, use effective monitoring tools and apply best practices.

For more information, see [Troubleshoot memory saturation in AKS clusters](/troubleshoot/azure/azure-kubernetes/identify-memory-saturation-aks).

To access further details in the logs, see [Log Analytics workspace](../../articles/operator-nexus/concepts-observability.md#log-analytic-workspace).

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
