---
title: Cluster creation fails with DomainNotFound error in Azure HDInsight
description: Troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/23/2023
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

* Deploy an Ubuntu VM in the same subnet and domain join the machine
  * SSH into the machine
  * sudo su
  * Run the [script](./sample-script.md) with username and password
  * The script will ping, create the required configuration files and then domain. If it succeeds, your DNS settings are good.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
