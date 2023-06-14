---
title: Troubleshoot AKS-Hybrid cluster provisioning failures for Azure Operator Nexus
description: Troubleshoot Hybrid Azure Kubernetes Service (AKS) clusters provisioning failures. Learn how to debug failure codes.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 05/14/2023
ms.author: v-saambe
author: v-saambe
---

# Troubleshoot AKS-Hybrid cluster provisioning failures

Follow these steps in order to gather the data needed to diagnose AKS-Hybrid creation or management issues.

[How to Connect AKS hybrid cluster using Azure CLI](/azure/AkS/Hybrid/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster)

:::image type="content" source="media/troubleshoot-aks-hybrid-cluster/aks-hybrid-connected-status.png" alt-text="Screenshot of Sample aks hybrid Connected status." lightbox="media/troubleshoot-aks-hybrid-cluster/aks-hybrid-connected-status-expanded.png":::

If Status: isn't `Connected` and Provisioning State: isn't `Succeeded` then the install failed

[How to manage and lifecycle the AKS-Hybrid cluster](./howto-hybrid-aks.md#how-to-manage-and-lifecycle-the-aks-hybrid-cluster)

## Prerequisites

* Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
* Tenant ID
* Subscription ID
* Cluster name and resource group
* Network fabric controller and resource group
* Network fabric instances and resource group
* AKS-Hybrid cluster name and resource group
* Prepare CLI commands, Bicep templates and/or Azure Resource Manager (ARM) templates that are used for resource creation

## What does an unhealthy AKS-Hybrid cluster look like?

There are several different types of failures that end up looking similar to the end user.

In the Azure portal, an unhealthy cluster may show:

* Alert showing "This cluster isn't connected to Azure."
* Status: 'Offline'
* Managed identity certificate expiration time: "Couldn't display date/time, invalid format."

In the CLI, when looking at output, an unhealthy cluster may show:

~~~ Azure CLI
az hybridaks show -g <>--name <>
~~~

-provisioningState: `Failed`

-provisioningState: `Succeeded`, but null values for fields such as 'lastConnectivityTime' and 'managedIdentityCertificateExpirationTime', or an errorMessage field that isn't null

## Basic network requirements

At a minimum, every AKS-Hybrid cluster needs a defaultcninetwork and a cloudservicesnetwork.
Starting from the bottom up, we can consider Managed Network Fabric resources, Network Cloud resources, and AKS-Hybrid resources:

### Network fabric resources

* Each Network Cloud cluster can support up to 200 cloudservicesnetworks.
* The fabric must be configured with an l3isolationdomain and l3 internal network for use with the defaultcninetwork.
  * The vlan range can be > 1000 for defaultcninetwork.
  * The l3isolationdomain must be successfully enabled.

### Network cloud resources

* The cloudservicesnetwork must be created
* Use correct Hybrid AKS extended location, which can be referred from the respective site cluster while creating the AKS-Hybrid resources.
* The defaultcninetwork must be created with an ipv4prefix and vlan that matches an existing l3isolationdomain.
  * The ipv4prefix used must be unique across all defaultcninetworks and layer 3 networks.
* The networks must have Provisioning 'state: Succeeded'.

 [How to connect az network cloud using Azure CLI](./howto-install-cli-extensions.md?tabs=linux#install-networkcloud-cli-extension)

### AKS-Hybrid resources

To be used by a AKS-Hybrid cluster, each Network Cloud network must be "wrapped" in a AKS-Hybrid vnet.

[AKS-Hybrid vnet using Azure CLI](/cli/azure/hybridaks/vnet)

## Common issues

Any of the following problems can cause the AKS-Hybrid cluster to fail to provisioning fully

### AKS-Hybrid clusters may fail or time out when created concurrently

  The Arc Appliance can only handle creating one AKS-Hybrid cluster at a time within an instance. After creating a single AKS-Hybrid cluster, you must wait for its provisioning status to be `Succeeded` and for the cluster status to show as `connected` or `online` in the Azure portal.

  If you have already tried to create several at once and have them in a `failed` state, delete all failed clusters and any partially succeeded clusters. Anything that isn't a fully successful cluster should be deleted. After all clusters and artifacts are deleted, wait a few minutes for the Arc Appliance and cluster operators to reconcile. Then try to create a single new AKS-Hybrid cluster. As mentioned, wait for that to come up successfully and report as connected/online. You should now be able to continue creating AKS-Hybrid clusters, one at a time.

### Case mismatch between AKS-Hybrid vnet and Network Cloud network

To configure an AKS-Hybrid virtual network (vnet), it's necessary for the provided Network Cloud network resource IDs to precisely match the actual Azure Resource Manager (ARM) resource ID, including being case-sensitive. To ensure the IDs have identical uppercase and lowercase letters, it's necessary and important to ensure the correct casing when setting up the network

If using CLI, the--aods-vnet-id* parameter. If using Azure Resource Manager (ARM), Bicep, or a manual "az rest" API call, the value of .properties.infraVnetProfile.networkCloud.networkId

The mixture of upper, lower, and camelCase throughout the Azure Resource Manager (ARM) ID depends on how the network was created.

The most reliable way to obtain the correct value to use when creating the vnet is to query the object for its ID, for example:

 ~~~bash

   az networkcloud cloudservices show -g "example-rg" -n "csn-name" -o tsv --query id
   az networkcloud defaultcninetwork show -g "example-rg" -n "dcn-name" -o tsv --query id
   az networkcloud l3network show -g "example-rg" -n "l3n-name" -o tsv --query id
 ~~~

### l3isolationdomain or l2isolationdomain isn't enabled

At a high level, the steps to create isolation domains are as follows

* Create the l3isolationdomain.
* Add one or more internal networks.
* Add one external network (optional, if northbound connectivity is required).
* Enable the l3isolationdomain using.

 ~~~bash
  az nf l3domain update-admin-state --resource-group "RESOURCE_GROUP_NAME" --resource-name "L3ISOLATIONDOMAIN_NAME" --state "Enable"
  ~~~

It's important to check that the fabric resources do achieve an administrativeState of Enabled, and that the provisioningState is Succeeded. If the 'update-admin-state' step is skipped or unsuccessful, the networks are unable to operate

An approach to confirm the use show commands, for instance:

~~~bash

  az nf l3domain show -g "example-rg" --resource-name "l2domainname" -o table
  az nf l2domain show -g "example-rg" --resource-name "l3domainname" -o table
~~~

### Network Cloud network status is failed

Care must be taken when creating networks to ensure that they come up successfully.

In particular, pay attention to the following constraints when creating defaultcninetworks:

* The ipv4prefix and vlan need to match internal network in the referenced l3isolationdomain.
* The ipv4prefix must be unique across defaultcninetworks (and layer 3 networks) in the Network Cloud cluster.

If using CLI to create these resources, it's useful to use the '--debug' option. The output includes an operation status URL, which can be queried using az rest.

If the resource has already been created, see the section on Surfacing Errors.

### Known errors

Depending on the mechanism used for creation (Azure portal, CLI, Azure Resource Manager (ARM)), it's sometimes hard to see why resources are Failed.

One useful tool to help surface errors is the [az monitor activity-log](/cli/azure/monitor/activity-log) command, which can be used to show activities for a specific resource ID, resource group, or correlation ID. (The information is also present in the Activity sign-in the Azure portal)

For example, to see why a defaultcninetwork failed:

~~~bash
 RESOURCE_ID="/subscriptions/$subscriptionsid/resourceGroups/example-rg/providers/Microsoft.NetworkCloud/defaultcninetworks/example-duplicate-prefix-dcn"
 
 az monitor activity-log list --resource-id "${RESOURCE_ID}" -o tsv --query '[].properties.statusMessage' | jq
~~~

The result:

~~~
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

### Memory saturation on AKS-Hybrid node

There have been incidents where CNF workloads are unable to start due to resource constraints on the AKS-Hybrid node that the CNF workload is scheduled on. It's been seen on nodes that have Azure Arc pods that are consuming many compute resources. To reduce memory saturation, use effective monitoring tools and apply best practices.

For more information, refer [Troubleshoot memory saturation in AKS clusters](/troubleshoot/azure/azure-kubernetes/identify-memory-saturation-aks)

To access further details in the logs, refer [Log Analytic workspace](../../articles/operator-nexus/concepts-observability.md#log-analytic-workspace)

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
