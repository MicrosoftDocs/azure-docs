---
title: Transport layer security in Azure HDInsight
description: Transport layer security (TLS) and secure sockets layer (SSL) are cryptographic protocols that provide communications security over a computer network.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 10/16/2023
---

# Transport layer security in Azure HDInsight

Connections to the HDInsight cluster via the public cluster endpoint `https://CLUSTERNAME.azurehdinsight.net` are proxied through cluster gateway nodes. These connections are secured using a protocol called TLS. Enforcing higher versions of TLS on gateways improves the security for these connections.

By default, Azure HDInsight clusters accept TLS 1.2 connections on public HTTPS endpoints. You can control the minimum TLS version supported on the gateway nodes during cluster creation using either the Azure portal, or a Resource Manager template. For the portal, select the TLS version from the **Security + networking** tab during cluster creation. For a Resource Manager template at deployment time, use the **minSupportedTlsVersion** property. For a sample template, see [HDInsight minimum TLS 1.2 Quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.hdinsight/hdinsight-minimum-tls/azuredeploy.json). This property supports one value: "1.2," which correspond to TLS 1.2+.

## Next steps

* [Plan a virtual network for Azure HDInsight](./hdinsight-plan-virtual-network-deployment.md)
* [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md).
* [Network security groups](../virtual-network/network-security-groups-overview.md).
