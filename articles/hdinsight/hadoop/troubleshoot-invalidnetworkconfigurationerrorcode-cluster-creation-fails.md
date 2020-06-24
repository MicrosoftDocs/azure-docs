---
title: InvalidNetworkConfigurationErrorCode error - Azure HDInsight
description: Various reasons for failed cluster creations with InvalidNetworkConfigurationErrorCode in Azure HDInsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 01/22/2020
---

# Cluster creation fails with InvalidNetworkConfigurationErrorCode in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

If you see error code `InvalidNetworkConfigurationErrorCode` with the description "Virtual Network configuration isn't compatible with HDInsight Requirement", it usually indicates a problem with the [virtual network configuration](../hdinsight-plan-virtual-network-deployment.md) for your cluster. Based on the rest of the error description, follow the below sections to resolve your problem.

## "HostName Resolution failed"

### Issue

Error description contains "HostName Resolution failed".

### Cause

This error points to a problem with custom DNS configuration. DNS servers within a virtual network can forward DNS queries to Azure's recursive resolvers to resolve hostnames within that virtual network (see [Name Resolution in Virtual Networks](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) for details). Access to Azure's recursive resolvers is provided via the virtual IP 168.63.129.16. This IP is only accessible from the Azure VMs. So it won't work if you're using an OnPrem DNS server, or your DNS server is an Azure VM, which isn't part of the cluster's virtual network.

### Resolution

1. Ssh into the VM that is part of the cluster, and run the command `hostname -f`. This will return the host's fully qualified domain name (referred to as `<host_fqdn>` in the below instructions).

1. Then, run the command `nslookup <host_fqdn>` (for example, `nslookup hn1-hditest.5h6lujo4xvoe1kprq3azvzmwsd.hx.internal.cloudapp.net`). If this command resolves the name to an IP address, it means your DNS server is working correctly. In this case, raise a support case with HDInsight, and we'll investigate your issue. In your support case, include the troubleshooting steps you executed. This will help us resolve the issue faster.

1. If the above command doesn't return an IP address, then run `nslookup <host_fqdn> 168.63.129.16` (for example, `nslookup hn1-hditest.5h6lujo4xvoe1kprq3azvzmwsd.hx.internal.cloudapp.net 168.63.129.16`). If this command is able to resolve the IP, it means that either your DNS server isn't forwarding the query to Azure's DNS, or it isn't a VM that is part of the same virtual network as the cluster.

1. If you don't have an Azure VM that can act as a custom DNS server in the cluster’s virtual network, then you need to add this first. Create a VM in the virtual network, which will be configured as DNS forwarder.

1. Once you have a VM deployed in your virtual network, configure the DNS forwarding rules on this VM. Forward all iDNS name resolution requests to 168.63.129.16, and the rest to your DNS server. [Here](../hdinsight-plan-virtual-network-deployment.md) is an example of this setup for a custom DNS server.

1. Add the IP Address of this VM as first DNS entry for the Virtual Network DNS configuration.

---

## "Failed to connect to Azure Storage Account”

### Issue

Error description contains "Failed to connect to Azure Storage Account” or “Failed to connect to Azure SQL".

### Cause

Azure Storage and SQL don't have fixed IP Addresses, so we need to allow outbound connections to all IPs to allow accessing these services. The exact resolution steps depend on whether you have set up a Network Security Group (NSG) or User-Defined Rules (UDR). Refer to the section on [controlling network traffic with HDInsight with network security groups and user-defined routes](../control-network-traffic.md) for details on these configurations.

### Resolution

* If your cluster uses a [Network Security Group (NSG)](../../virtual-network/virtual-network-vnet-plan-design-arm.md).

    Go to the Azure portal and identify the NSG that is associated with the subnet where the cluster is being deployed. In the **Outbound security rules** section, allow outbound access to internet without limitation (note that a smaller **priority** number here means higher priority). Also, in the **subnets** section, confirm if this NSG is applied to the cluster subnet.

* If your cluster uses a [User-defined Routes (UDR)](../../virtual-network/virtual-networks-udr-overview.md).

    Go to the Azure portal and identify the route table that is associated with the subnet where the cluster is being deployed. Once you find the route table for the subnet, inspect the **routes** section in it.

    If there are routes defined, make sure that there are routes for IP addresses for the region where the cluster was deployed, and the **NextHopType** for each route is **Internet**. There should be a route defined for each required IP Address documented in the aforementioned article.

---

## "Virtual network configuration is not compatible with HDInsight requirement"

### Issue

Error descriptions contain messages similar as follows:

```
ErrorCode: InvalidNetworkConfigurationErrorCode
ErrorDescription: Virtual Network configuration is not compatible with HDInsight Requirement. Error: 'Failed to connect to Azure Storage Account; Failed to connect to Azure SQL; HostName Resolution failed', Please follow https://go.microsoft.com/fwlink/?linkid=853974 to fix it.
```

### Cause

Likely an issue with the custom DNS setup.

### Resolution

Validate that 168.63.129.16 is in the custom DNS chain. DNS servers within a virtual network can forward DNS queries to Azure's recursive resolvers to resolve hostnames within that virtual network. For more information, see [Name Resolution in Virtual Networks](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server). Access to Azure's recursive resolvers is provided via the virtual IP 168.63.129.16.

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. Execute the following command:

    ```bash
    cat /etc/resolv.conf | grep nameserver*
    ```

    You should see something like this:

    ```output
    nameserver 168.63.129.16
    nameserver 10.21.34.43
    nameserver 10.21.34.44
    ```

    Based on the result - choose one of the following steps to follow:

#### 168.63.129.16 is not in this list

**Option 1**  
Add 168.63.129.16 as the first custom DNS for the virtual network using the steps described in [Plan a virtual network for Azure HDInsight](../hdinsight-plan-virtual-network-deployment.md). These steps are applicable only if your custom DNS server runs on Linux.

**Option 2**  
Deploy a DNS server VM for the virtual network. This involves the following steps:

* Create a VM in the virtual network, which will be configured as DNS forwarder (it can be a Linux or windows VM).
* Configure DNS forwarding rules on this VM (forward all iDNS name resolution requests to 168.63.129.16, and the rest to your DNS server).
* Add the IP Address of this VM as first DNS entry for Virtual Network DNS configuration.

#### 168.63.129.16 is in the list

In this case, please create a support case with HDInsight, and we'll investigate your issue. Include the result of the below commands in your support case. This will help us investigate and resolve the issue quicker.

From an ssh session on the head node, edit and then run the following:

```bash
hostname -f
nslookup <headnode_fqdn> (e.g.nslookup hn1-hditest.5h6lujo4xvoe1kprq3azvzmwsd.hx.internal.cloudapp.net)
dig @168.63.129.16 <headnode_fqdn> (e.g. dig @168.63.129.16 hn0-hditest.5h6lujo4xvoe1kprq3azvzmwsd.hx.internal.cloudapp.net)
```

---

### Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
