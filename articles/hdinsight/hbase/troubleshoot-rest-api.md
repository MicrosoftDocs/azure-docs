---
title: REST API to query Apache HBase in Azure HDInsight
description: 
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/08/2020
---

# REST API to query Apache HBase in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Using Apache HBase REST interface to query a table under a namespace other than the default results in a runtime error (HTTP status 500).

## Cause

HBase REST API is only supported when using the default namespace. This is a known issue with regards to using HBase namespaces or making calls that refer to specific GETs on columns with column families with REST server on HDInsight. This is because of a security issue with HDInsight Gateway. When using the API to create a table with a namespace, accessing columns via column families, you need specify the `:` character, which is considered a security problem in the IIS Gateway module.

## Mitigation

Bypass the Gateway/REST server by deploying your application on a VM that is located in the same Azure VNet as the HDInsight cluster. Then you can communicate with HBase either directly via RPC (bypassing REST server entirely), or to individual REST servers running on worker nodes bypassing HDInsight Gateways.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
