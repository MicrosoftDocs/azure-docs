---
title: Not sufficient fault domains in region error in Azure HDInsight
description: Cluster creation failed due to not sufficient fault domains in region in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 12/23/2022
---

# Scenario: Cluster creation failed due to `not sufficient fault domains in region` in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Receive error message similar to `not sufficient fault domains in region` when attempting to create Apache Kafka cluster.

## Cause

A fault domain is a logical grouping of underlying hardware in an Azure data center. Each fault domain shares a common power source and network switch. The virtual machines and managed disks that implement the nodes within an HDInsight cluster are distributed across these fault domains. This architecture limits the potential impact of physical hardware failures.

Each Azure region has a specific number of fault domains. For a list of domains and the number of fault domains they contain, refer to documentation on [Availability Sets](../../virtual-machines/availability.md).

In HDInsight, Kafka clusters are required to be provisioned in a region with at least three Fault domains.

## Resolution

If the region you wish to create the cluster does not have sufficient fault domains, reach out to product team to allow provisioning of the cluster even if there are not three fault domains.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
