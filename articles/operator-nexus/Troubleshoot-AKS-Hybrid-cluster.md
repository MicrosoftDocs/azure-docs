---
title: Troubleshoot AKS-Hybrid cluster provisioning  failures for Azure Operator Nexus
description: Troubleshoot Hybrid Azure Kubernetes Service (AKS) clusters provisioning  failures. Learn how to debug failure codes.
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

:::image type="content" source="media/AKS-Hybrid-connected-status.png" alt-text="Connected status":::

If Status: isn't `Connected` and Provisioning State: isn't `Succeeded` then the install failed

[How to manage and lifecycle the AKS-Hybrid cluster](./howto-hybrid-aks.md#how-to-manage-and-lifecycle-the-aks-hybrid-cluster)


## Prerequisites
 1. Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
 1. Tenant ID
 1. Subscription ID
 1. Cluster name and resource group
 1. Network fabric controller and resource group
 1. Network fabric instances and resource group
 1. AKS-Hybrid cluster name and resource group
 1. CLI, Bicep or ARM template used to create or attempt creation

## What does an unhealthy AKS-Hybrid cluster look like?

There are several different types of failures that end up looking similar to the end user.

In the Azure portal, an unhealthy cluster may show:

- Alert showing "This cluster isn't connected to Azure."
- Status: 'Offline'
- Managed identity certificate expiration time: "Couldn't display date/time, invalid format."

In the CLI, when looking at "az hybridaks show -g <> --name <>" output, an unhealthy cluster may show:

- provisioningState: `Failed`
-provisioningState: `Succeeded`, but null values for fields such as 'lastConnectivityTime' and 'managedIdentityCertificateExpirationTime', or an errorMessage field that isn't null


## Basic network requirements 

At a minimum, every AKS-Hybrid cluster needs a defaultcninetwork and a cloudservicesnetwork.
Starting from the bottom up, we can consider Managed Network Fabric resources, Network Cloud resources, and AKS-Hybrid resources:

### Network fabric resources

 - the fabric is preconfigured with the vlans that is required for cloudservicesnetworks in the range 300-349
 - the fabric must be configured with an l3isolationdomain and l3 internalnetwork for use with the defaultcninetwork
   - the vlan must be in the range 500-599 (this limitation is intended to be removed in a future release)
   - the l3isolationdomain must be successfully enabled

### Network cloud resources 

 - the cloudservicesnetwork must be created
 - extended-location of the cluster associated with the cluster should be matches with cluster.
 - the defaultcninetwork must be created with an ipv4prefix and vlan that matches an existing l3isolationdomain
   - the ipv4prefix used must be unique across all defaultcninetworks and l3networks
 - the networks must have Provisioning state: Succeeded

 [How to connect az networkcloud using Azure CLI](./howto-install-cli-extensions.md?tabs=linux#install-networkcloud-cli-extension)

### AKS-Hybrid resources 

To be used by a AKS-Hybrid cluster, each Network Cloud network must be "wrapped" in a hybridaks vnet.

[How to connect az hybridaks vnet using Azure CLI](/cli/azure/hybridaks/vnet)

## Common Issues

Any of the following problems can cause the AKS-Hybrid cluster to fail to provisioning fully 

### Several AKS-Hybrid clusters fail or time out when created close together

  The Arc Appliance can only handle creating one AKS-Hybrid cluster at a time within an instance. After creating a single AKS-Hybrid cluster, you must wait for its provisioning status to be `Succeeded` and for the cluster status to show as `connected` or `online` in the Azure portal. See the picture at the top of the "AKS-Hybrid Cluster Triage" document for an example of a successful cluster. Only then is it safe to create another AKS-Hybrid cluster.

  If you have already tried to create several at once and have them in a `failed` state, delete all failed clusters and any partially succeeded clusters. Anything that isn't a fully successful cluster should be deleted. Additionally, you should check for and delete any leftover artifacts from failed clusters. After all clusters and artifacts are deleted, wait a few minutes for the Arc Appliance and cluster operators to reconcile and register the current undercloud cluster state. Then try to create a single new AKS-Hybrid cluster. As mentioned, wait for that to come up successfully and report as connected/online. You should now be able to continue creating AKS-Hybrid clusters, one at a time.

### Case mis-match between AKS-Hybrid vnet and Network Cloud network

To set up an AKS-Hybrid virtual network (vnet), the provided Network Cloud network resource IDs must exactly (that is, case-sensitively) match the actual ARM resource ID. (this limitation is intended to be removed in a future release)

If using CLI, the--aods-vnet-id* parameter. If using ARM, Bicep, or a manual "az rest" API call, the value of .properties.infraVnetProfile.networkCloud.networkId

The mixture of upper, lower, and camelCase throughout the ARM ID depends on how the network was created.

The most reliable way to obtain the correct value to use when creating the vnet is to query the object for its ID, for example:


 ```bash
   az networkcloud cloudservices show -g "example-rg" -n "csn-name" -o tsv --query id
   az networkcloud defaultcninetwork show -g "example-rg" -n "dcn-name" -o tsv --query id
   az networkcloud l3network show -g "example-rg" -n "l3n-name" -o tsv --query id
 ```

### l3isolationdomain or l2isolationdomain isn't enabled

At a high level, the steps to create isolation domains are as follows

- create the l3isolationdomain
- add one or more internal networks
- add one external network (optional, if northbound connectivity is required)
- enable the l3isolationdomain using 
 ```bash
  az nf l3domain update-admin-state--state Enable
  ```

It's important to check that the fabric resources do achieve an administrativeState of Enabled, and that the provisioningState is Succeeded. If the 'update-admin-state' step is skipped or unsuccessful, the networks are unable to operate

An approach to confirm the use show commands, for instance:

```bash

  az nf l3domain show -g "example-rg" --resource-name "l2domainname" -o table
  az nf l2domain show -g "example-rg" --resource-name "l3domainname" -o table
```
### Network Cloud network status is failed

Care must be taken when creating networks to ensure that they come up successfully.

In particular, pay attention to the following constraints when creating defaultcninetworks:

  - the ipv4prefix and vlan need to match internalnetwork in the referenced l3isolationdomain
  - the ipv4prefix must be unique across defaultcninetworks (and l3networks) in the Network Cloud cluster

If using CLI to create these resources, it's useful to use the '--debug' option. The output includes an operation status URL, which can be queried using az rest.

If the resource has already been created, see the section on Surfacing Errors.

### Known Errors

Depending on the mechanism used for creation (Azure portal, CLI, ARM), it's sometimes hard to see why resources are Failed.

One useful tool to help surface errors is the [az monitor activity-log](/cli/azure/monitor/activity-log) command, which can be used to show activities for a specific resource ID, resource group, or correlation ID. (The information is also present in the Activity sign-in the Azure portal)

For example, to see why a defaultcninetwork failed:

```bash
 RESOURCE_ID="/subscriptions/$subscriptionsid/resourceGroups/example-rg/providers/Microsoft.NetworkCloud/defaultcninetworks/example-duplicate-prefix-dcn"
 
 az monitor activity-log list --resource-id "${RESOURCE_ID}" -o tsv --query '[].properties.statusMessage' | jq
```

The result:
```
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

```
### OOM on AKS-Hybrid node

There have been incidents where CNF workloads are unable to start due to resource constraints on the AKS-Hybrid node that the CNF workload is scheduled on. It's been seen on nodes that have Azure Arc pods that are consuming many compute resources. At the moment, article of discussion on how to properly mitigate this issue.
 

To access further details in the logs, refer [Log Analytic workspace](../../articles/operator-nexus/concepts-observability.md#log-analytic-workspace)

 If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

