---
title: Use Azure proximity placement groups with Oracle AI Database@Azure 
description: Learn proximity placement group-specific requirements, resource relationships, Azure design considerations, validation checks, and common troubleshooting actions for Exadata Database Service on Dedicated Infrastructure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: best-practice
ms.date: 09/04/2026
ms.author: jacobjaygbay
# Customer intent:  Use this article to deploy and validate Azure proximity placement groups with Oracle AI Database@Azure for low-latency application and database connectivity.
---

# Use Azure proximity placement groups with Oracle AI Database@Azure


Azure proximity placement groups can help you achieve low network latency by placing Azure compute and networking resources close to Oracle AI Database@Azure infrastructure. This article explains the proximity placement group-specific requirements, resource relationships, Azure design considerations, validation checks, and common troubleshooting actions for Exadata Database Service on Dedicated Infrastructure.

For detailed Oracle resource provisioning steps, use the Oracle documentation links in the [Next steps](#next-steps) section.

Oracle AI Database@Azure runs Oracle database services on Oracle Cloud Infrastructure that's colocated in Microsoft Azure datacenters. This colocation gives applications and Azure services a low-latency path to Oracle databases.

An Azure proximity placement group is a logical resource that asks Azure to place supported compute resources physically close to one another. For Exadata Database Service on Dedicated Infrastructure, the Network Anchor and Exadata infrastructure must use the same Azure proximity placement group. You complete this flow in the Azure portal; no OCI Console action is required.

A proximity placement group is a colocation constraint; it doesn't reserve capacity or guarantee that Azure can allocate every requested virtual machine size. For the general Azure concepts, deployment options, and best practices, see:

[Proximity placement groups - Azure Virtual Machines](/azure/virtual-machines/co-location)

## Resource relationships

The same Azure proximity placement group carries through the Oracle AI Database@Azure provisioning workflow.

The resources use the proximity placement group as follows:

| Resource | Role in the deployment |
|---|---|
| Azure proximity placement group | Provides the shared colocation constraint for the application and Oracle AI Database@Azure resources. |
| Network Anchor | Uses the selected proximity placement group during network provisioning. |
| Exadata infrastructure and VM Cluster | The Exadata infrastructure uses the same proximity placement group as the Network Anchor, and the VM Cluster is created on that infrastructure. |

## Before you begin

Complete the general prerequisites in [Get started with Oracle AI Database@Azure](/azure/oracle/oracle-db/oracle-database-get-started) before using this article.

The following requirements are specific to proximity placement groups. Oracle manages proximity placement group service limits and onboarding controls. For current limits and requirements, see the detailed Oracle documentation.

### Additional proximity placement group-specific requirements

| Requirement | What to prepare |
|---|---|
| Oracle-managed proximity placement group limits | Review the current proximity placement group limits and onboarding requirements in Oracle documentation. Oracle manages these controls. |
| Advanced Networking | Enable Advanced Networking for the Oracle AI Database@Azure subscription. |
| Availability zone and placement | Identify the intended Azure region and, when applicable, a compatible availability zone or placement selection. |
| Azure proximity placement group permissions | Confirm permission to create and read `Microsoft.Compute/proximityPlacementGroups` resources. If you use a custom Oracle resource provider role, include `Microsoft.Compute/proximityPlacementGroups/read`. |
| New or empty proximity placement group | Create a new or empty proximity placement group in the intended Azure subscription, resource group, and region. Don't reuse a group that contains incompatible resources. |
| Network Anchor prerequisites | Prepare an active Resource Anchor, a new virtual network, and a delegated subnet for the Network Anchor. |
| Placement consistency | Use the same proximity placement group for the Network Anchor and Exadata infrastructure. |
| Provisioning sequence | Create the Network Anchor before the Exadata infrastructure and VM Cluster. |

## Validate the proximity placement group configuration

After completing the Network Anchor, Exadata infrastructure, and VM Cluster provisioning steps in Oracle documentation, verify the following proximity placement group associations.

| Check | Expected result |
|---|---|
| Azure proximity placement group | The proximity placement group is deployed in the intended Azure subscription, resource group, and region. |
| Network Anchor | The deployment succeeds and shows the intended proximity placement group association. |
| Exadata infrastructure | The deployment succeeds and shows the same proximity placement group as the Network Anchor. |
| VM Cluster | The VM Cluster is created on the expected Exadata infrastructure and uses the selected Network Anchor. |
| Azure application resources | The resources use the intended proximity placement group and a compatible availability-zone or placement configuration. |
| Deployment completion | All proximity placement group-related deployment operations are completed successfully. |

## Oracle AI Database@Azure proximity placement group considerations

### Capacity and placement

For Oracle AI Database@Azure, the Network Anchor and Exadata infrastructure provisioning flow anchors the proximity placement group to the datacenter used by the Oracle resources. Regional or zonal VM availability doesn't guarantee that a specific size is available in that datacenter.

A proximity placement group doesn't reserve capacity. If an Azure application VM can't be allocated after anchoring, use an acceptable alternative size. If no suitable size is available, contact Oracle Support before changing the Oracle deployment.

Use compatible region and availability-zone settings for the proximity placement group, Network Anchor, Exadata infrastructure, and application VMs.

### Latency and resiliency

For the lowest latency, use proximity placement groups with Accelerated Networking on supported Azure virtual machines. If latency is the primary requirement, keep the application resources in the same proximity placement group and compatible availability zone as the Oracle database infrastructure.

A single proximity placement group is designed for colocation, not multi-zone resiliency. If resiliency across availability zones is the higher priority, design the application tiers accordingly and evaluate the latency trade-off.

### Lifecycle and alignment

In general Azure usage, a proximity placement group becomes associated with a datacenter when you deploy the first resource. Stopping, deallocating, deleting, resizing, or redeploying resources can affect capacity and alignment. For proximity placement group with Oracle AI Database@Azure, the Network Anchor is the first Oracle resource associated with the proximity placement group. Review Oracle guidance before making lifecycle changes to a Network Anchor that uses a proximity placement group.

### Limitations and important behavior

| Limitation or behavior | What it means |
|---|---|
| No capacity reservation | A proximity placement group doesn't reserve capacity, and regional or zonal availability doesn't guarantee a VM size in the Oracle-selected datacenter. |
| Same placement group | The Network Anchor and Exadata infrastructure must use the same proximity placement group. |
| Plan before provisioning | Select the proximity placement group when you create the Network Anchor. You can't add or change the proximity placement group after you create the Network Anchor. |
| New network requirement | Use the new virtual network and delegated subnet associated with the Network Anchor. Proximity placement group isn't supported with a pre-existing Network Anchor. |
| Region and zone boundary | Colocation is limited to a single Azure region. Use compatible availability-zone or placement settings. |
| Existing deployments | For existing Exadata infrastructure, contact Oracle Support to confirm the supported procedure. You can't add or change the proximity placement group on an existing Network Anchor. |
| Empty group | A proximity placement group that isn't empty fails validation. |
| Article scope | This article applies only to Exadata Database Service on Dedicated Infrastructure. Use the Oracle service-specific documentation for other Oracle AI Database@Azure service types. |

## Troubleshoot common issues

If a deployment fails, stop before starting the next provisioning step. Record the timestamp, Azure deployment state, error text, correlation ID, and affected Azure resource ID. Verify the subscription, region, resource group, Resource Anchor, network, delegated subnet, and proximity placement group against the planned deployment configuration. Retry only after the owning support team confirms that the configuration or service issue is resolved.

| Issue | Recommended action |
|---|---|
| The proximity placement group option isn't available | Review the current Oracle-managed proximity placement group limits and onboarding requirements and confirm that the Oracle prerequisites are complete. |
| The Network Anchor can't read the proximity placement group | Verify Azure role permissions. Custom roles used for the Oracle resource provider must include `Microsoft.Compute/proximityPlacementGroups/read`. |
| The proximity placement group is already in use or fails validation | Use a new or empty group that matches the intended subscription, region, and placement configuration. |
| The Network Anchor and Exadata infrastructure show different groups | Stop provisioning and correct the plan. The documented flow requires the same proximity placement group. |
| The deployment reports an allocation or overconstrained error | For an Azure application VM, use an acceptable alternative size. If no suitable size is available, or the Oracle resource deployment fails, contact Oracle Support before changing the deployment or proximity placement group association. |
| An existing deployment needs proximity placement group support | You can't add or change the proximity placement group on an existing Network Anchor. Contact Oracle Support before changing existing Exadata infrastructure. |

Don't use the OCI Console as a workaround for a failed Azure onboarding step unless Oracle documentation or Oracle Support explicitly directs you to do so.

## Next steps

For Azure proximity placement group concepts, alignment, allocation behavior, and best practices, see:

- [Proximity placement groups - Azure Virtual Machines](/azure/virtual-machines/co-location)

For detailed Oracle provisioning and onboarding instructions, see:

- [Create a Network Anchor](https://docs.oracle.com/iaas/Content/database-at-azure/azucr-create-network-anchor.html )
- [Create Exadata infrastructure](https://docs.oracle.com/iaas/Content/database-at-azure/azucr-create-exadata-infrastructure.html )
- [Create an Exadata VM Cluster](https://docs.oracle.com/iaas/Content/database-at-azure/azucr-create-exadata-vm-cluster.html )

---

