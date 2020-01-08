---
title: InvalidNetworkConfigurationErrorCode error - Azure HDInsight
description: Various reasons for failed cluster creations with InvalidNetworkConfigurationErrorCode in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/05/2019
---

# Cluster creation fails with InvalidNetworkConfigurationErrorCode in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

If you see error code `InvalidNetworkConfigurationErrorCode` with the description "Virtual Network configuration is not compatible with HDInsight Requirement", it usually indicates a problem with the [virtual network configuration](../hdinsight-plan-virtual-network-deployment.md) for your cluster. Based on the rest of the error description, follow the below sections to resolve your problem.

## "HostName Resolution failed"

### Issue

Error description contains "HostName Resolution failed".

### Cause

This error points to a problem with custom DNS configuration. DNS servers within a virtual network can forward DNS queries to Azure's recursive resolvers to resolve hostnames within that virtual network (see [Name Resolution in Virtual Networks](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) for details). Access to Azure's recursive resolvers is provided via the virtual IP 168.63.129.16. This IP is only accessible from the Azure VMs. So it will not work if you are using an OnPrem DNS server, or your DNS server is an Azure VM, which is not part of the cluster's vNet.

### Resolution

1. Ssh into the VM that is part of the cluster, and run the command `hostname -f`. This will return the host’s fully qualified domain name (referred to as `<host_fqdn>` in the below instructions).

1. Then, run the command `nslookup <host_fqdn>` (for example, `nslookup hn1-hditest.5h6lujo4xvoe1kprq3azvzmwsd.hx.internal.cloudapp.net`). If this command resolves the name to an IP address, it means your DNS server is working correctly. In this case, raise a support case with HDInsight, and we will investigate your issue. In your support case, include the troubleshooting steps you executed. This will help us resolve the issue faster.

1. If the above command does not return an IP address, then run `nslookup <host_fqdn> 168.63.129.16` (for example, `nslookup hn1-hditest.5h6lujo4xvoe1kprq3azvzmwsd.hx.internal.cloudapp.net 168.63.129.16`). If this command is able to resolve the IP, it means that either your DNS server is not forwarding the query to Azure's DNS, or it is not a VM that is part of the same vNet as the cluster.

1. If you do not have an Azure VM that can act as a custom DNS server in the cluster’s vNet, then you need to add this first. Create a VM in the vNet, which will be configured as DNS forwarder.

1. Once you have a VM deployed in your vNet, configure the DNS forwarding rules on this VM. Forward all iDNS name resolution requests to 168.63.129.16, and the rest to your DNS server. [Here](../hdinsight-plan-virtual-network-deployment.md) is an example of this setup for a custom DNS server.

1. Add the IP Address of this VM as first DNS entry for the Virtual Network DNS configuration.

---

## "Failed to connect to Azure Storage Account”

### Issue

Error description contains "Failed to connect to Azure Storage Account” or “Failed to connect to Azure SQL".

### Cause

Azure Storage and SQL do not have fixed IP Addresses, so we need to allow outbound connections to all IPs to allow accessing these services. The exact resolution steps depend on whether you have set up a Network Security Group (NSG) or User-Defined Rules (UDR). Refer to the section on [controlling network traffic with HDInsight with network security groups and user-defined routes](../hdinsight-plan-virtual-network-deployment.md#hdinsight-ip) for details on these configurations.

### Resolution

* If your cluster uses a [Network Security Group (NSG)](../../virtual-network/virtual-network-vnet-plan-design-arm.md).

    Go to the Azure portal and identify the NSG that is associated with the subnet where the cluster is being deployed. In the **Outbound security rules** section, allow outbound access to internet without limitation (note that a smaller **priority** number here means higher priority). Also, in the **subnets** section, confirm if this NSG is applied to the cluster subnet.

* If your cluster uses a [User-defined Routes (UDR)](../../virtual-network/virtual-networks-udr-overview.md).

    Go to the Azure portal and identify the route table that is associated with the subnet where the cluster is being deployed. Once you find the route table for the subnet, inspect the **routes** section in it.

    If there are routes defined, make sure that there are routes for IP addresses for the region where the cluster was deployed, and the **NextHopType** for each route is **Internet**. There should be a route defined for each required IP Address documented in the aforementioned article.

---

### Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, please review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
