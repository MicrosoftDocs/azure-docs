---
title: Troubleshoot isolation domain provisioning failures for Azure Operator Nexus
description: Troubleshoot isolation domain failures, and learn how to debug failure codes.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 05/24/2023
ms.author: v-saambe
author: v-saambe
---

# Troubleshoot isolation domain provisioning failures

The use of isolation domains allows for the establishment of connectivity between network functions at both Layer 2 and Layer 3 in the cluster and network fabric. As a result, workloads can communicate within and across racks.

Use the information in this article to gather the data that you need to diagnose problems with isolation domain creation or management in Azure Operator Nexus by using the Azure CLI.

For more information, see [Configure L2 and L3 isolation domains by using a managed network fabric](./howto-configure-isolation-domain.md).

## Prerequisites

* Install the latest version of the [appropriate Azure CLI extensions](./howto-install-cli-extensions.md), including setting up the `ManagedNetworkFabric` Azure CLI extension by using a WHL file.
* Gather this information:
  * Tenant ID
  * Subscription ID
  * Cluster name and resource group
  * Network fabric controller and resource group
  * Network fabric instances and resource group

## Configuration problems

If you're having general configuration problems, contact the network administrators within the organization for more details.

## Error while enabling isolation domains  

The fabric ASN value is no longer a mandatory value, which is defined based on the SKU that the payload uses. The peer ASN value can be anywhere from 0 through 65535.

For further instructions, see [Change the administrative state of an L3 isolation domain](./howto-configure-isolation-domain.md#change-the-administrative-state-of-an-l3-isolation-domain).

## Reserved range for VLAN IDs (Option A)

When you're creating an isolation domain, VLAN IDs below 500 are reserved for infrastructure purposes and shouldn't be used. Instead, establish an external network with a VLAN ID higher than 500 on the partner end (PE) side to enable peering between the customer end (CE) and the PE (Option A peering).

For further instructions, see [Create external networks](./howto-configure-isolation-domain.md#create-an-external-network-with-option-a).

## Isolation domain stuck in a disabled state (Option A)

If you're using Option A, your isolation domain might get stuck in a disabled state when you try to create an external network. If you make any modifications to the IPv6 subnet payload, you must disable and enable the isolation domain to ensure successful provisioning.

## Inability to ping an IP address

If you can't ping 107.xx.xx.x, the process of disabling and enabling the isolation domain can help you re-establish successful connectivity.

## Terminal state provisioning error

If you get a terminal state provisioning error, the reason might be a failure in creating an external or internal network because the VLAN ID is already in use.

## Isolation domain stuck in a deleting state

If your isolation domain is stuck in a deleting state for longer than normal, make sure that you first deleted one or two observed dependent consuming resources. That's a requirement before you try to delete an isolation domain.

## Terminal provisioning state of Failed after a resource operation

If you get a terminal provisioning state of `Failed` after finishing a resource operation, one potential explanation is a loss of access for the resource to retrieve secret or certificate information from the key vault.

## No network attached to the isolation domain

Before you enable isolation, it's necessary to create one or more internal or external networks.

To access further details in the logs, see [Log Analytics workspace](../../articles/operator-nexus/concepts-observability.md#log-analytic-workspace).

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
