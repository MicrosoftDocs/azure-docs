---
title: Configure service endpoint policies - Azure HDInsight
description: Learn how to configure service endpoint policies for your virtual network so that your Azure HDInsight cluster can store important information in Azure storage.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: how-to
ms.date: 07/15/2020
---

# Configure virtual network service endpoint policies for Azure HDInsight

This article provides information about how to implement service endpoint policies on virtual networks with Azure HDInsight.

## Background

Azure HDInsight allows you to create clusters in your own virtual network. If you need to allow outgoing traffic from your virtual network to other Azure services like storage accounts, you can achieve this with service endpoint policies. The current functionality of service endpoint policies as created through the Azure portal, however, only allows you to create a policy for a single account, all accounts in a subscription, or all accounts in a resource group.

As a managed service, Azure HDInsight collects telemetry about cluster creation, job execution and scaling operations to provide support and troubleshooting assistance. In order for this data to reach HDInsight from your VNET, it is necessary for you to create service endpoint policies that allow outgoing traffic to specific data collection points managed by the HDInsight team. The storage account which you need to allow traffic for are different for each Azure region.

In addition, for new clusters being created in virtual networks, service endpoint policies must be created to allow traffic to HDInsight storage accounts so that cluster nodes can be created with the necessary software and libraries.

## Next steps

* [Azure HDInsight virtual network architecture](hdinsight-virtual-network-architecture.md)
* [Configure network virtual appliance](./network-virtual-appliance.md)
