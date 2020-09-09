---
title: Transport layer security in Azure HDInsight
description: Transport layer security (TLS) and secure sockets layer (SSL) are cryptographic protocols that provide communications security over a computer network.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 04/21/2020
---

# Transport layer security in Azure HDInsight

Connections to the HDInsight cluster via the public cluster endpoint `https://CLUSTERNAME.azurehdinsight.net` are proxied through cluster gateway nodes. These connections are secured using a protocol called TLS. Enforcing higher versions of TLS on gateways improves the security for these connections. For more information on why you should use newer versions of TLS, see [Solving the TLS 1.0 Problem](https://docs.microsoft.com/security/solving-tls1-problem).

By default, Azure HDInsight clusters accept TLS 1.2 connections on public HTTPS endpoints, and older versions for backward compatibility. You can control the minimum TLS version supported on the gateway nodes during cluster creation using either the Azure portal, or a Resource Manager template. For the portal, select the TLS version from the **Security + networking** tab during cluster creation. For a Resource Manager template at deployment time, use the **minSupportedTlsVersion** property. For a sample template, see [HDInsight minimum TLS 1.2 Quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-hdinsight-minimum-tls). This property supports three values: "1.0", "1.1" and "1.2", which correspond to TLS 1.0+, TLS 1.1+ and TLS 1.2+ respectively.

> [!IMPORTANT]
> Starting on June 30, 2020, Azure HDInsight will enforce TLS 1.2 or later versions for all HTTPS connections. We recommend that you ensure that all your clients are ready to handle TLS 1.2 or later versions. For more information, see [Azure HDInsight TLS 1.2 Enforcement](https://azure.microsoft.com/updates/azure-hdinsight-tls-12-enforcement/).

## Next steps

* [Plan a virtual network for Azure HDInsight](./hdinsight-plan-virtual-network-deployment.md)
* [Create virtual networks for Azure HDInsight clusters](hdinsight-create-virtual-network.md).
* [Network security groups](../virtual-network/security-overview.md).
