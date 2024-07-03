---
title: "Azure Operator Nexus IP prefixes"
description: Overview of the IP prefix resource in Azure Operator Nexus.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/28/2024
ms.custom: template-concept
---

# Azure Operator Nexus IP prefix resources

An IP prefix resource allows operators to manipulate how the Border Gateway Protocol (BGP) propagates routes based on the IP prefix (IPv4 and IPv6). Operators can use IP prefixes to  block certain prefixes from being propagated up-stream or down-stream, or tag them with specific community or extended community values. IP prefix resources are modeled as Azure Resource Manager (ARM) resources under Microsoft.managednetworkfabric and can be created, read, updated, and deleted by operators. They're used in conditions and actions of RoutePolicy statements.

## Objective

IP prefix resources are used to define match criteria for route policies based on the network prefixes of routes. Network prefixes are the first part of an IP address that indicates the network segment to which the address belongs. For example, the IP prefix 10.10.10.0/28 matches any address where the first 28 bits match with 10.10.10.0. Network prefixes can be used to identify the source or destination of routes, and to apply different rules based on the network segments.

IP prefix resources allow operators to create a list of network prefixes with sequence numbers and actions. The sequence numbers determine the order of evaluation of the network prefixes. The action can be `Permit` or `Deny`, which indicates whether routes with matching network prefixes are allowed or rejected. Route policy statements can reference IP prefix resources, and can combine them with other conditions such as IP communities and IP extended community lists.

## Functionality

The primary purpose of IP prefix resources is to define match criteria and actions for route policies based on the network prefixes of routes. Route policies are rules that determine how routes are imported and exported between different networks, such as the infrastructure network, the workload network, and the external network. By using IP prefix resources, operators can control which routes are allowed or denied.

The conditions of a Route Policy are specified using the IP prefix resource. This resource, modeled as an ARM resource under Microsoft.managednetworkfabric, defines the match conditions and actions for the route policy based on the IP prefix of the routes.

The operator can create different combinations of IP prefix rules to achieve different routing behaviors. For example, the operator can use the `EqualTo` condition to match exact prefixes, or use the `NotEqualTo` condition to match prefixes that aren't equal to the specified prefix. The operator can also use the `Permit` action to allow the matching prefixes, or use the `Deny` action to block the matching prefixes. The sequence number determines the order of evaluation of the rules, from lowest to highest. The operator can use the sequence number to create more specific rules before more general rules, or to create exceptions to the default rules.
