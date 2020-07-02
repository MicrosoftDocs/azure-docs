---
title: Configure network virtual appliance in Azure HDInsight
description: Learn how to configure a number of additional features for your network virtual appliance in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 06/30/2020
---

# Configure network virtual appliance in Azure HDInsight

> [!Important]
> The following information is **only** required if you wish to configure a network virtual appliance (NVA) other than Azure Firewall.

Azure Firewall is automatically configured to allow traffic for many of the common important scenarios. Using another network virtual appliance will require you to configure a number of additional features. Keep the following factors in mind as you configure your network virtual appliance:

* Service Endpoint capable services can be configured with service endpoints which results in bypassing the NVA, usually for cost or performance considerations.
* IP Address dependencies are for non-HTTP/S traffic (both TCP and UDP traffic).
* FQDN HTTP/HTTPS endpoints can be whitelisted in your NVA device.
* Assign the route table that you create to your HDInsight subnet.

## Service endpoint capable dependencies

You can optionally enable one or more of the following service endpoints which will result in bypassing the NVA. This option can be useful for large amounts of data transfers to save on cost and also for performance optimizations. 

| **Endpoint** |
|---|
| Azure SQL |
| Azure Storage |
| Azure Active Directory |

### IP address dependencies

| **Endpoint** | **Details** |
|---|---|
| IPs published [here](hdinsight-management-ip-addresses.md) | These IPs are for HDInsight control place and should be included in the UDR to avoid asymmetric routing |
| AAD-DS private IPs | Only needed for ESP clusters|


### FQDN HTTP/HTTPS dependencies

> [!Important]
> The list below only gives a few of the most important FQDNs. You can get entire list of FQDNs (mostly Azure Storage and Azure Service Bus) for configuring your NVA [in this file](https://github.com/Azure-Samples/hdinsight-fqdn-lists/blob/master/HDInsightFQDNTags.json). These dependencies are used by HDInsight control plane operations to create a cluster successfully.

| **Endpoint**                                                          |
|---|
| azure.archive.ubuntu.com:80                                           |
| security.ubuntu.com:80                                                |
| ocsp.msocsp.com:80                                                    |
| ocsp.digicert.com:80                                                  |

## Next steps

* [Use firewall to restrict outbound traffic](./hdinsight-restrict-outbound-traffic.md)
* [Azure HDInsight virtual network architecture](hdinsight-virtual-network-architecture.md)
