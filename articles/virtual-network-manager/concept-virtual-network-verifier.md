---
title: What is Virtual Network Verifier?
description: Learn how Virtual Network Verifier helps you verify your network policies allow or disallow traffic between your Azure network resources.
author: mbender-ms
ms.author: mbender
ms.topic: concept-article
ms.service: virtual-network-manager
ms.date: 05/20/2024
---

# How does Virtual Network Verifier work?

In Azure Virtual Network Manager, Virtual Network Verifier enables you to check if your network policies allow or disallow traffic between your Azure network resources. It can help you answer simple diagnostic questions to triage why reachability isn't working as expected and prove conformance of your Azure setup to your organization’s security compliance requirements. When you run a reachability analysis in Virtual Network Verifier, it can answer questions such as why two virtual machines can't communicate with each other.

[!INCLUDE [virtual-network-verifier-preview](../../includes/virtual-network-verifier-preview.md)]

## How does Verifier Workspace work?

Virtual Network Verifier is available in every network manager instance through a resource called a verifier workspace, which acts as a container for Virtual Network Verifier's child resources and capabilities. A network manager can have one or more verifier workspaces and these verifier workspaces can be delegated to non-network manager users. A verifier workspace uses the following workflow to gather and analyze network data.

### Create a verifier workspace

A verifier workspace is a child resource of a network manager. Its permissions can be delegated to non-network manager admin users and it's discoverable from the Azure portal. The verifier workspace includes its own child resources of reachability analysis intents and reachability analysis results, and it uses its parent network manager's scope as the boundary to run analysis.

### Delegate a verifier workspace resource

By default, users with permissions to a network manager have permissions to create, delete, and extend permissions of a verifier workspace. A user that doesn't have permission to a verifier workspace's parent network manager can be granted permissions through the verifier workspace's access control by assigning them the role of "Contributor." Granting a user permission to a verifier workspace in this way doesn't give that user access to the rest of the network manager instance.

### Create a reachability analysis intent

Within a verifier workspace, you create a reachability analysis intent to define the traffic path between a source and destination that you want to verify. The reachability analysis intent includes the following fields:

| **Field** | **Description **|
|-------|-------------|
| **Source** | The source of the traffic that can be a virtual machine, subnet, or the internet. |
| **Source ports** | The source ports of the traffic. |
| **Source IP addresses** | The source IP addresses of the traffic. |
| **Destination** | The destination of the traffic that can be a virtual machine, subnet, Cosmos DB, storage account, SQL server, or the internet. |
| **Destination ports** | The destination ports of the traffic. |
| **Destination IP addresses** | The destination IP addresses of the traffic. |
| **Protocol** | The protocol of the traffic. |

You can create multiple reachability analysis intents within a verifier workspace and run them in parallel. Any user with permissions to a given verifier workspace can create, view, and delete its reachability analysis intents.

### Run a reachability analysis

After defining a reachability analysis intent, you need to perform an analysis to get verification results. This static analysis checks if various resources and policy configurations in the network manager's scope preserve reachability between the given source and destination of the reachability analysis intent. Once the analysis is done, it produces a reachability analysis result.

The reachability analysis result is a JSON object that indicates whether packets can reach the reachability analysis intent's destination from its source. It provides details about the path of connectivity, showing where traffic was blocked if the source and destination couldn't connect. It includes information about the resources on the path and their metadata regardless of the reachability analysis result's outcome.

In the Azure portal, this reachability analysis result is visualized to show the forward path of the reachability analysis intent's defined connectivity. Any user with access to the verifier workspace can run a reachability analysis on any reachability analysis intent within that verifier workspace.

## Supported features of the reachability analysis

When run, a reachability analysis evaluates the following features: 
  
  - Network security group (NSG) rules 
  - Application security group (ASG) rules 
  - Azure Virtual Network Manager security admin rules 
  - Azure Virtual Network Manager mesh topology (connected group) 
  - Virtual network peering 
  - Route tables
  - Service endpoints & access control lists 
  - Private endpoints 
  - Virtual WAN

This list is subject to expand.

## Limits

The limitations in the public preview of Virtual Network Verifier are as follows: 
- A reachability analysis can only be run on a single reachability analysis intent.
- Subnets selected as the source and/or destination of a reachability analysis intent must have at least one running virtual machine for a reachability analysis result to be provided.
- Reachability analysis results are based on the evaluation of supported Azure services, resources, and policies listed as supported features here. Actual traffic behavior resulting from services not explicitly listed above can vary from the reachability analysis result.

## Next steps

> [!div class="nextstepaction"]
> [Learn to analyze resource reachability with Virtual Network Verifier in Azure Virtual Network Manager](how-to-verify-reachability-with-virtual-network-verifier.md)
