---
title: What is network verifier in Azure Virtual Network Manager?
description: Learn how network verifier helps you verify your network policies allow or disallow traffic between your Azure network resources.
author: mbender-ms
ms.author: mbender
ms.topic: concept-article
ms.service: azure-virtual-network-manager
ms.date: 03/13/2025
---

# What is network verifier?

In Azure Virtual Network Manager, network verifier is a tool that enables you to check if your network policies allow or disallow traffic between your Azure network resources. There are several moving parts between connectivity, security, routing, and resource-specific configurations -- so how do you know that what you've set up in your Azure environment is actually achieving the reachability you desire among your network resources? Whether you're diagnosing why reachability isn't working as expected or proving conformance of your Azure setup to your organization’s security compliance requirements, network verifier can provide the answers. When you run a reachability analysis in network verifier, it can answer questions such as why two virtual machines can't communicate with each other by providing the full reachability path and blockers.

[!INCLUDE [virtual-network-verifier-preview](../../includes/virtual-network-verifier-preview.md)]

## How does network verifier work?

Network verifier is available in every network manager instance through a resource called a verifier workspace, which acts as a container for network verifier's child resources and capabilities. A network manager can have one or more verifier workspaces and these verifier workspaces can be delegated to non-network manager users. A verifier workspace uses the following workflow to gather and analyze network data.

### Create a verifier workspace

A verifier workspace is a child resource of a network manager. Its permissions can be delegated to non-network manager admin users and it's discoverable from the Azure portal. The verifier workspace includes its own child resources of reachability analysis intents and reachability analysis results, and it uses its parent network manager's scope as the boundary to run analysis. Any Azure resource, configuration, and rule within this scope can be evaluated in the reachability analysis without needing to elevate user permissions for the subscriptions and management groups of its parent network manager's scope.

### Delegate a verifier workspace resource

By default, users with permissions to a network manager have permissions to create, delete, and extend permissions of a verifier workspace. A user that doesn't have permission to a verifier workspace's parent network manager can be granted permissions through the verifier workspace's access control by assigning them the role of "Contributor." Granting a user permission to a verifier workspace in this way doesn't give that user access to the rest of the network manager instance.

### Create a reachability analysis intent

Within a verifier workspace, you create a reachability analysis intent to define the traffic path between a source and destination that you want to verify. The reachability analysis intent includes the following fields:

| **Field** | **Description **|
|-------|-------------|
| **Source** | The source of the traffic that can be a virtual machine, virtual machine scale sets instance, subnet, or the internet. |
| **Source ports** | The source ports of the traffic. |
| **Source IP addresses** | The source IP addresses of the traffic. |
| **Destination** | The destination of the traffic that can be a virtual machine, virtual machine scale sets instance, subnet, Cosmos DB, storage account, SQL server, or the internet. |
| **Destination ports** | The destination ports of the traffic. |
| **Destination IP addresses** | The destination IP addresses of the traffic. |
| **Protocol** | The protocol of the traffic. |

You can create multiple reachability analysis intents within a verifier workspace and run them in parallel. Any user with permissions to a given verifier workspace can create, view, and delete its reachability analysis intents.

### Run a reachability analysis

After defining a reachability analysis intent, you need to run an analysis to receive the reachability analysis result. This static analysis checks if various resources and policy configurations in the network manager's scope preserve reachability between the given source and destination of the reachability analysis intent. Once the analysis is complete, it produces a reachability analysis result.

The reachability analysis result is a JSON object that details whether packets can reach the reachability analysis intent's destination from its source. It provides details about the path of connectivity, showing where traffic was blocked if the source and destination couldn't connect. It includes information about the resources on the path and their metadata regardless of the reachability analysis result's outcome.

In the Azure portal, this reachability analysis result is visualized to show the forward path of the reachability analysis intent's defined connectivity. Any user with access to the verifier workspace can run a reachability analysis on any reachability analysis intent within that verifier workspace.

## Supported features of the reachability analysis

When run, network verifier's reachability analysis evaluates the following features: 
  
  - Network security group (NSG) rules 
  - Application security group (ASG) rules 
  - Azure Virtual Network Manager security admin rules 
  - Azure Virtual Network Manager mesh topology (connected group) 
  - Virtual network peering 
  - Route tables
  - Service endpoints & access control lists 
  - Private endpoints 
  - Virtual WAN
  - Azure Firewall (static L4 only)

This list is subject to expand.

## When should I use network verifier?

Network verifier is designed to help you validate your Azure network configurations and resources, ensuring they align with your intended reachability and comply with internal standards. This tool proves particularly useful during the design and post-deployment phases of your Azure network setup. When you encounter unexpected traffic allowances or disallowances, network verifier helps you pinpoint the origin of these deviations from your expected reachability within your Azure environment. With its detailed reachability analysis results, network verifier can reconstruct the source-to-destination path taken in the Azure control plane, enabling you to track down where the misconfiguration lies.

Network verifier can help you answer several questions regarding your Azure network resource reachability, including:

- Public internet IP address to/from a given virtual machine, subnet, or other resource
- Validation of security rules enforcing traffic denial and order of evaluation, such as with NSG rules and security admin rules
- Confirmation of reachability to resources behind a private endpoint
- Remodel of theoretical traffic path through a virtual WAN

For more complex troubleshooting scenarios, network verifier serves as an excellent starting point. Its reachability analysis results can guide you toward the next steps in your diagnostic journey, directing you to tools specialized in operational monitoring, network performance, and data path-level network troubleshooting.

## Limits

The limitations of network verifier are as follows: 
- A reachability analysis can only be run on a single reachability analysis intent.
- Subnets selected as the source and/or destination of a reachability analysis intent must have at least one running virtual machine for a reachability analysis result to be provided.
- Reachability analysis results are based on the evaluation of supported Azure services, resources, and policies listed as supported features here. Actual traffic behavior resulting from services not explicitly listed above can vary from the reachability analysis result.

## Next steps

> [!div class="nextstepaction"]
> [Learn to analyze resource reachability with network verifier in Azure Virtual Network Manager](how-to-verify-reachability-with-virtual-network-verifier.md)