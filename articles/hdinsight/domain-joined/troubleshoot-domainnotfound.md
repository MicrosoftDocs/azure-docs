---
title: Cluster creation fails with DomainNotFound error in Azure HDInsight
description: Troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 01/23/2020
---

# Scenario: Cluster creation fails with DomainNotFound error in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

HDI Secure (Enterprise Security Package) cluster creation fails with `DomainNotFound` error message.

## Cause

Incorrect DNS settings.

## Resolution

When the domain joined clusters are deployed, HDI creates an internal user name and password in AAD DS (for each cluster) and joins all the cluster nodes to this domain. The domain join is accomplished using Samba tools. Ensure the following prerequisites are met:

* The domain name should resolve through DNS.
* The IP address of the domain controllers should be set in the DNS settings for the virtual network where the cluster is being deployed.
* If the virtual network is peered with the virtual network of AAD DS, then it has to be done manually.
* If you're using DNS forwarders, the domain name must resolve correctly within the virtual network.
* Security policies (NSGs) shouldn't block the domain join.

### Additional debugging steps

* Deploy a windows VM in the same subnet, domain join the machine using a username and password (this can be done through the control panel UI), or

* Deploy a ubuntu VM in the same subnet and domain join the machine
  * SSH into the machine
  * sudo su
  * Run the script with username and password
  * The script will ping, create the required configuration files and then domain. If it succeeds, your DNS settings are good.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
