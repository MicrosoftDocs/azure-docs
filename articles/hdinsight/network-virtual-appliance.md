---
title: Configure network virtual appliance in Azure HDInsight
description: Learn how to configure extra features for your network virtual appliance in Azure HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.date: 09/20/2023
---

# Configure network virtual appliance in Azure HDInsight

> [!Important]
> The following information is **only** required if you wish to configure a network virtual appliance (NVA) other than [Azure Firewall](./hdinsight-restrict-outbound-traffic.md).

Azure Firewall FQDN tag is automatically configured to allow traffic for many of the common important FQDNs. Using another network virtual appliance requires you to configure extra features. Keep the following factors in mind as you configure your network virtual appliance:

* Service Endpoint capable services can be configured with service endpoints that results in bypassing the NVA, usually for cost or performance considerations.
* If ResourceProviderConnection is set to *outbound*, you can use private endpoints for the storage and SQL servers for metastores and there is no need to add them to the NVA.
* IP Address dependencies are for non-HTTP/S traffic (both TCP and UDP traffic).
* FQDN HTTP/HTTPS endpoints can be approved in your NVA device.
* Assign the route table that you create to your HDInsight subnet.

## Service endpoint capable dependencies

You can optionally enable one or more of the following service endpoints, which result in bypassing the NVA. This option can be useful for large amounts of data transfers to save on cost and also for performance optimizations. 

| **Endpoint** |
|---|
| Azure SQL |
| Azure Storage |
| Azure Active Directory |

### IP address dependencies

| **Endpoint** | **Details** |
|---|---|
| IPs published [here](hdinsight-management-ip-addresses.md) | These IPs are for HDInsight resource provider and should be included in the UDR to avoid asymmetric routing. This rule is only needed if the ResourceProviderConnection is set to *Inbound*. If the ResourceProviderConnection is set to *Outbound*, then these IPs are not needed in the UDR.  |
| AAD-DS private IPs | Only need for ESP clusters, if the VNETs are not peered.|


### FQDN HTTP/HTTPS dependencies

You can get the list of dependent FQDNs (mostly Azure Storage and Azure Service Bus) for configuring your network virtual appliance [in this repo](https://github.com/Azure-Samples/hdinsight-fqdn-lists/). For the regional list, see [here](https://github.com/Azure-Samples/hdinsight-fqdn-lists/tree/main/Public). These dependencies are used by HDInsight resource provider(RP) to create and monitor/manage clusters successfully. These include telemetry/diagnostic logs, provisioning metadata, cluster-related configurations, scripts, etc. This FQDN dependency list might change with releasing future HDInsight updates.

The following list gives a few FQDNs that may be needed for OS and security patching or certificate validations during the cluster create process and during the lifetime of cluster operations:

| **Runtime Dependencies FQDNs**                                                          |
|---|
| azure.archive.ubuntu.com:80                                           |
| security.ubuntu.com:80                                                |
| ocsp.msocsp.com:80                                                    |
| ocsp.digicert.com:80                                                  |
| microsoft.com/pki/mscorp/cps/default.htm:443                                      |
| microsoft.com:80                                                      |
|login.windows.net:443                                                  |
|login.microsoftonline.com:443                                          |

## Next steps

* [Use firewall to restrict outbound traffic](./hdinsight-restrict-outbound-traffic.md)
* [Azure HDInsight virtual network architecture](hdinsight-virtual-network-architecture.md)
