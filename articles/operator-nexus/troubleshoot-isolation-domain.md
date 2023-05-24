---
title: Troubleshoot Isolation Domain provisioning failures for Azure Operator Nexus
description: Troubleshoot Isolation Domain failures. Learn how to debug failure codes.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 05/24/2023
ms.author: v-saambe
author: v-saambe
---

# Troubleshoot Isolation Domain provisioning failures

Follow these steps in order to gather the data needed to diagnose Isolation Domain creation or management issues by using the Azure Command Line Interface (AzCLI)

## Prerequisites

* Install the latest version of the
    [appropriate CLI extensions](./howto-install-cli-extensions.md)
* Tenant ID
* Subscription ID
* Cluster name and resource group
* Network fabric controller and resource group
* Network fabric instances and resource group
* Setup ManagedNetworkFabric CLI extension using the WHL file

     [How-to-install-ManagedNetworkFabric-CLI-extension](./howto-install-cli-extensions.md#install-managednetworkfabric-cli-extension)

 [How to Sign-in to your Azure account](./howto-configure-isolation-domain.md#prerequisites)

 [How to register providers for Managed Network Fabric](./howto-configure-isolation-domain.md#prerequisites)

 [Parameters-for-Isolation-Domain-management](./howto-configure-isolation-domain.md#configure-l2-isolation-domains)

## Isolation Domain

The use of Isolation Domain allows for the establishment of connectivity between network functions at both layer 2 and layer 3 in the cluster and network fabric. As a result, workloads can communicate within and across racks.

For further instructions, refer [creating L2 and L3 Isolation Domain](./howto-configure-isolation-domain.md)

## Common issues

### For any configuration issues

Contact the network administrators within the organization for more details.

### Error while enabling Isolation Domains  

Fabric ASN value is no longer a mandatory value, which is defined based on SKU used in the payload. Peer ASN value can be set anywhere from 0 - 65535.

For further instructions, refer [enable/disable L3 Isolation-Domain](./howto-configure-isolation-domain.md#change-the-administrative-state-of-an-l3-isolation-domain)

### Vlan ID can't be used from a reserved range ['0', '500'] '-OptionA' peering

When creating an Isolation Domain, it's important to note that VLAN IDs below 500 are reserved for infrastructure purposes and shouldn't be used. Instead, an external network with a vlan ID higher than 500 should be established on the partner end (PE) side to enable customer end(CE)-partner end (PE) peering (option a peering).

For further instructions, refer [External network creation](./howto-configure-isolation-domain.md#create-an-external-network-by-using-option-a)

### Isolation Domain seems to be stuck in disabled state when we try to create external network (option-a)

If there are any modifications made to the IPv6 subnet payload, it's necessary to disable and enable the Isolation Domain to ensure successful provisioning.

### Unable to ping 107.xx.xx.x

The process of disabling and enabling the Isolation Domain can aid in re-establishing successful connectivity.

### Terminal state provisioning error

The issue may be attributed to the failure in creating an external or internal network due to the VLAN ID already being in use.

### Isolation Domain Stuck in deleting state for longer time

Before attempting to delete the Isolation Domain, it's necessary to delete one or two observed dependent consuming resources beforehand.

### Resource operation completed with terminal provisioning state 'Failed'

One potential explanation might involve a loss of access for the resource to retrieve secret or certificate information from the key vault.

### There should be atleast one or more Internal /External networks attached to Isolation Domain

Before enabling isolation, it's necessary to create one or more internal and external networks

To access further details in the logs, refer [Log Analytic workspace](../../articles/operator-nexus/concepts-observability.md#log-analytic-workspace)

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.