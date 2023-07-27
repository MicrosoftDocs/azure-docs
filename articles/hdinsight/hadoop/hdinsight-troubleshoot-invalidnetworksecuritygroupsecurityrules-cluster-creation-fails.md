---
title: InvalidNetworkSecurityGroupSecurityRules error - Azure HDInsight
description: Cluster Creation Fails with the ErrorCode InvalidNetworkSecurityGroupSecurityRules
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 07/25/2023
---

# Scenario: InvalidNetworkSecurityGroupSecurityRules - cluster creation fails in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

You receive error code `InvalidNetworkSecurityGroupSecurityRules` with a description similar to "The security rules in the Network Security Group configured with subnet does not allow required inbound and/or outbound connectivity."

## Cause

Likely an issue with the inbound [network security group](../../virtual-network/virtual-network-vnet-plan-design-arm.md) rules configured for your cluster.

## Resolution

Go to the Azure portal and identify the NSG that is associated with the subnet where the cluster is being deployed. In the **Inbound security rules** section, make sure the rules allow inbound access to port 443 for the IP addresses mentioned [here](../control-network-traffic.md).

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
