---
title: Secure traffic through Azure HDInsight clusters using Azure Private Link (preview)
description: Learn which IP addresses you must allow inbound traffic from, in order to properly configure network security groups and user-defined routes for virtual networking with Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/08/2020
---

# Secure traffic through Azure HDInsight clusters using Azure Private Link (preview)

With Azure Private Link, you can access your Azure HDInsight clusters over a private endpoint in your virtual network. The default HDInsight cluster architecture has two public basic load balancers: one load balancer on the cluster head nodes and the other on the cluster gateways. The cluster also has a basic internal load balancer with a private IP address for accessing the gateway nodes.



