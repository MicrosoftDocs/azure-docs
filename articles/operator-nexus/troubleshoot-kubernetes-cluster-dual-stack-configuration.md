---
title: Troubleshooting dual-stack Nexus Kubernetes Cluster configuration issues
description: Troubleshooting the configuration of a dual-stack IP.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 10/19/2023
ms.author: v-yamohammed
author: yasat93
---
# Troubleshooting dual-stack Nexus Kubernetes Cluster configuration issues

This guide provides detailed steps for troubleshooting issues related to setting up a dual stack Nexus Kubernetes cluster. If you've created a dual stack cluster but are experiencing issues, this guide will help you identify and resolve potential configuration problems.
   
## Prerequisites

* Install the latest version of the
    [az CLI extensions](./howto-install-cli-extensions.md)
* Tenant ID
* Necessary permissions to make changes to the cluster configuration.

## Dual-stack configuration 

Dual-stack configuration involves running both IPv4 and IPv6 protocols on your CNI network. This allows Kubernetes services that support both protocols to communicate over either IPv4 or IPv6.

## Common issues

   - A dual-stack Nexus Kubernetes cluster has been established, yet you're having trouble observing the dual-stack address on the CNI network. Additionally, the Kubernetes services are not receiving dual-stack addresses.

## Configuration steps

   - **Step 1: Verifying dual-stack L3 network**

  Make certain that your Layer 3 (L3) network, serving as the Container Network Interface (CNI), is properly set up to manage both IPv4 and IPv6 traffic. Utilize the `az networkcloud l3network show` command for validation.
   - Example:

   ```
"ipAllocationType": "DualStack",
  "ipv4ConnectedPrefix": "166.XXX.XXX.X/24",
  "ipv6ConnectedPrefix": fda0:XXXX:XXXX:XXX::/64,
```

> [!NOTE]
> If the output only contains an IPv4 address, please consult the [prerequisites for deploying tenant workloads](./quickstarts-tenant-workload-prerequisites.md) to establish a dual-stack network.

   - **Step 2: Validating Nexus Kubernetes Cluster configuration:**

  To ensure proper configuration for dual-stack networking in your Nexus Kubernetes cluster, follow these steps:
  
  1. Execute the command `az networkcloud kubernetescluster show` to retrieve information about your cluster.
  2. Examine the `networkConfiguration` section in the `az networkcloud kubernetescluster show` output.
  3. Confirm that `podCidrs` and `serviceCidrs` are set as arrays, each containing one IPv4 prefix and one IPv6 prefix.
  4. To enable the Kubernetes service to have a dual-stack address, make sure that the IP pool configuration includes both IPv4 and IPv6 addresses. For additional information, refer to the IP address pool configuration section in the how-to available at [IP address pool configuration](howto-kubernetes-service-load-balancer.md#bicep-template-parameters-for-ip-address-pool-configuration) for more details.
  
  By following these steps, you can guarantee the correct setup of dual-stack networking in your Nexus Kubernetes cluster.

   - Example:
     
     ```json
     "podCidrs": [
         "10.XXX.X.X/16",
         "fdbe:8fbe:17b7:0::/64"
     ],
     "serviceCidrs": [
         "10.XXX.X.X/16",
         "fda0:XXXX:XXXX:ffff::/108"
     ]
     ```

> [!NOTE]
> The prefix length for IPv6 `serviceCidrs` must be >= 108 (for example, /64 won't work).
   
   - **Step 3: Ensuring proper peering configuration:**

If the configurations in steps 1 and 2 are correct but traffic issues persist, please ensure that any peering connections or routes between your cluster and external networks are properly established for both IPv4 and IPv6 traffic. When Nexus Kubernetes cluster isn't configured with IPv6 in "podCidrs" and "serviceCidrs," IPv4 peering occurs on CE but not IPv6.

   Action: Review and update peering configurations as necessary to accommodate dual stack traffic.

## Sample output

   - Output without IPv6 configuration:

     ```plaintext
     BGP summary information 
     Router identifier 10.X.XXX.XX, local AS number 65501
     Neighbor Status Codes: m - Under maintenance
       Neighbor      V AS           MsgRcvd   MsgSent  InQ OutQ  Up/Down State   PfxRcd PfxAcc
       107.XXX.XX.X  4 64906         222452    239726    0    0    7d02h Estab(NotNegotiated)
       ...
     ```

   - Output with IPv6 configuration:

     ```plaintext
     BGP summary information
     Router identifier 10.X.XXX.XX, local AS number 65501
     Neighbor Status Codes: m - Under maintenance
       Neighbor                                V AS           MsgRcvd   MsgSent  InQ OutQ  Up/Down State   PfxRcd PfxAcc
       107.XXX.XX.X                            4 64906         246524    265580    0    0    7d20h Estab(NotNegotiated)
       ...
     ```

##  Additional recommendations:

Scrutinize logs and error messages for indicators of configuration issues.

## Conclusion
Setting up a dual-stack configuration involves enabling both IPv4 and IPv6 on your network, and ensuring services can communicate over both. By following the steps outlined in this guide, you should be able to identify and resolve common configuration issues related to setting up a dual stack cluster. If you continue to experience difficulties, consider seeking further assistance from your network administrator or consulting platform-specific support resources.
