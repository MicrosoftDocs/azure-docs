---
title: Configure network virtual appliance in Azure HDInsight
description: Learn how to configure a number of additional features for your network virtual appliance in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/06/2020
---

# Configure network virtual appliance in Azure HDInsight

> [!Important]
> The following information is **only** required if you wish to configure a network virtual appliance (NVA) other than Azure Firewall.

Azure Firewall is automatically configured to allow traffic for many of the common important scenarios. Using another network virtual appliance will require you to configure a number of additional features. Keep the following factors in mind as you configure your network virtual appliance:

* Service Endpoint capable services should be configured with service endpoints.
* IP Address dependencies are for non-HTTP/S traffic (both TCP and UDP traffic).
* FQDN HTTP/HTTPS endpoints can be placed in your NVA device.
* Wildcard HTTP/HTTPS endpoints are dependencies that can vary based on a number of qualifiers.
* Assign the route table that you create to your HDInsight subnet.

## Service endpoint capable dependencies

| **Endpoint** |
|---|
| Azure SQL |
| Azure Storage |
| Azure Active Directory |

### IP address dependencies

| **Endpoint** | **Details** |
|---|---|
| \*:123 | NTP clock check. Traffic is checked at multiple endpoints on port 123 |
| IPs published [here](hdinsight-management-ip-addresses.md) | These IPs are HDInsight service |
| AAD-DS private IPs for ESP clusters |
| \*:16800 for KMS Windows Activation |
| \*12000 for Log Analytics |

### FQDN HTTP/HTTPS dependencies

> [!Important]
> The list below only gives a few of the most important FQDNs. You can get additional FQDNs (mostly Azure Storage and Azure Service Bus) for configuring your NVA [in this file](https://github.com/Azure-Samples/hdinsight-fqdn-lists/blob/master/HDInsightFQDNTags.json).

| **Endpoint**                                                          |
|---|
| azure.archive.ubuntu.com:80                                           |
| security.ubuntu.com:80                                                |
| ocsp.msocsp.com:80                                                    |
| ocsp.digicert.com:80                                                  |
| wawsinfraprodbay063.blob.core.windows.net:443                         |
| registry-1.docker.io:443                                              |
| auth.docker.io:443                                                    |
| production.cloudflare.docker.com:443                                  |
| download.docker.com:443                                               |
| us.archive.ubuntu.com:80                                              |
| download.mono-project.com:80                                          |
| packages.treasuredata.com:80                                          |
| security.ubuntu.com:80                                                |
| azure.archive.ubuntu.com:80                                           |
| ocsp.msocsp.com:80                                                    |
| ocsp.digicert.com:80                                                  |

## Next steps

* [Use firewall to restrict outbound traffic](./hdinsight-restrict-outbound-traffic.md)
* [Azure HDInsight virtual network architecture](hdinsight-virtual-network-architecture.md)
