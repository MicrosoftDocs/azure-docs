---
title: Troubleshoot packet loss between NAKS worker nodes for Azure Operator Nexus
description: Troubleshoot packet loss between NAKS worker nodes, and learn how to debug the issue.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 12/10/2024
ms.author: yinongdai    
author: bearzz23
---
# Troubleshoot packet loss between NAKS worker nodes for Azure Operator Nexus
This guide provides detailed steps for troubleshooting packet loss between NAKS worker nodes.

## Prerequisites

* Command line access to the Nexus Kubernetes Cluster is required
* Necessary permissions to make changes to the Nexus Kubernetes Cluster objects

## Symptoms

Network diagnostic tools, such as iperf, report a high percentage of lost packets during data transfer tests. Detailed logs from networking tools show an abnormal number of dropped or lost packets.
Sample output:
```console
iperf3 -c <server-ip> -u -b 100M -l 1500
Connecting to host <server-ip>, port 5201
[  5] local <client-ip> port 33326 connected to <server-ip> port 5201
[ ID] Interval           Transfer     Bitrate         Total Datagrams
[  5]   0.00-1.00   sec  11.9 MBytes  99.9 Mbits/sec  8326
[  5]   1.00-2.00   sec  11.9 MBytes   100 Mbits/sec  8334
[  5]   2.00-3.00   sec  11.8 MBytes  98.7 Mbits/sec  8242
[  5]   3.00-4.00   sec  12.1 MBytes   101 Mbits/sec  8424
[  5]   4.00-5.00   sec  11.9 MBytes   100 Mbits/sec  8334
[  5]   5.00-6.00   sec  11.9 MBytes   100 Mbits/sec  8333
[  5]   6.00-7.00   sec  11.9 MBytes   100 Mbits/sec  8333
[  5]   7.00-8.00   sec  11.9 MBytes   100 Mbits/sec  8334
[  5]   8.00-9.00   sec  11.9 MBytes   100 Mbits/sec  8333
[  5]   9.00-10.00  sec  11.9 MBytes   100 Mbits/sec  8333
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Jitter    Lost/Total Datagrams
[  5]   0.00-10.00  sec   119 MBytes   100 Mbits/sec  0.000 ms  0/83326 (0%)  sender
[  5]   0.00-10.00  sec   119 MBytes  99.6 Mbits/sec  0.005 ms  291/83326 (0.35%)  receiver
iperf Done.
```

## Troubleshooting steps
The following troubleshooting steps can be used for diagnosing the cluster.

### Gather information
To assist with the troubleshooting process, please gather and provide the following cluster information:

* Subscription ID: the unique identifier of your Azure subscription.
* Tenant ID: the unique identifier of your Microsoft Entra tenant.
* Undercloud Name: the name of the undercloud resource associated with your deployment.
* Undercloud Resource Group: the resource group containing the undercloud resource.
* NAKS Cluster Name: the name of the NAKS cluster experiencing issues.
* NAKS Cluster Resource Group: the resource group containing the NAKS cluster.
* Inter-Switch Devices (ISD) connected to NAKS: the details of the Inter-Switch Devices (ISDs) that are connected to the NAKS cluster.
* Source and Destination IPs: the source and destination IP addresses where packet drops are being observed.

### Verify provisioning status of the Network Fabric
Verify on Azure portal that the NF status is in the provisioned state; the Provisioning State should be 'Succeeded' and Configuration State 'Provisioned'.

### View iperf-client pod events
Use kubectl to inspect events from the iperf-client pod for more detailed information. This can help identify the root cause of the issue with the iperf-client pod.
```console
kubectl get events --namespace default | grep iperf-client
```
Sample output:
```console
NAMESPACE LAST SEEN TYPE REASON OBJECT MESSAGE 
default 5m39s Warning BackOff pod/iperf-client-8f7974984-xr67p Back-off restarting failed container iperf-client in pod iperf-client-8f7974984-xr67p_default(masked-id)
```

### Validate L3 ISD configuration
Confirm that the L3 ISD (Layer 3 Isolation Domain) configuration on the devices is correct. 

## Potential solutions
If the iperf-client pod is constantly being restarted and other resource statuses appear to be healthy, the following remedies can be attempted:

### Adjust network buffer settings
Modify the network buffer settings to improve performance by adjusting the following parameters:
* net.core.rmem_max: Increase the maximum receive buffer size.
* net.core.wmem_max: Increase the maximum send buffer size.
Commands:
```console
sysctl -w net.core.rmem_max=67108864
sysctl -w net.core.wmem_max=67108864
```

### Optimize iperf tool usage
Use iperf tool options to optimize buffer usage and run parallel streams:
* -P: Number of parallel client streams.
* -w: TCP window size.
Example:
```console
iperf3 -c <destination-ip> -u -b 100M -l 1500 -P 4 -w 256k
```

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).