---
title: Troubleshooting Dual Stack Configuration Issues for Nexus Kubernetes Cluster
description: Troubleshooting the configuration of a dual stack IP.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 10/19/2023
ms.author: v-yamohammed
author: v-yamohammed
---
# Troubleshooting dual stack Nexus Kubernetes cluster configuration issues

This guide provides detailed steps for troubleshooting issues related to setting up a dual stack Nexus Kubernetes cluster. If you've created a dual stack cluster but are experiencing issues, this guide will help you identify and resolve potential configuration problems.
   
## Prerequisites

* Install the latest version of the
    [appropriate CLI extensions](./howto-install-cli-extensions.md)
* Tenant ID
* Subscription ID
* Cluster name and resource group
* Cluster extended location name
* VLAN network
* Connected IPV4 and IPV6
* Necessary permissions to make changes to the cluster configuration.


 [How to Sign-in to your Azure account](./howto-configure-isolation-domain.md#prerequisites)

## Dual-Stack Configuration 

Dual-stack configuration involves running both IPv4 and IPv6 protocols on your network. This allows devices that support both protocols to communicate over either IPv4 or IPv6.

## Common Issues

   - A dual stack cluster has been established, yet we're unable to observe the dual stack features, as they remain unseen or inaccessible.

## Configuration Steps

   - **Step 1: Verifying Dual Stack L3 Network**

     Confirm that your network infrastructure fully supports dual stack configurations. Ensure your L3 network is properly configured to handle both IPv4 and IPv6 traffic by using following command to create an L3 network with the specified configurations:

     ```bash
     az networkcloud l3network create --name "<YourL3NetworkName>" \
         --resource-group "<YourResourceGroupName>" \
         --subscription "<YourSubscription>" \
         --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
         --location "<ClusterAzureRegion>" \
         --ip-allocation-type "DualStack" \
         --ipv4-connected-prefix "<YourNetworkIpv4Prefix>" \
         --ipv6-connected-prefix "<YourNetworkIpv6Prefix>" \
         --l3-isolation-domain-id "<YourL3IsolationDomainId>" \
         --vlan <YourNetworkVlan>
     ```

   - **Step 2: Validating Nexus Kubernetes Cluster Configuration:**

   In the `networkConfiguration` section of the Nexus Kubernetes Cluster configuration, ensure you've set dual-stack cluster network assignments for `podCidrs` and `serviceCidrs`. Each of these values should be an array consisting of one IPv4 prefix and one IPv6 prefix. Examine the cluster configuration settings to ensure CIDR assignments are correct. Confirm that the assigned Pod CIDR and Service CIDR ranges are accurately configured for both IPv4 and IPv6 addresses.

   - Example:

     ```json
     "podCidrs": [
         "10.XXX.X.X/16",
         "fdbe:8fbe:17b7:0::/64"
     ],
     "serviceCidrs": [
         "10.XXX.X.X/16",
         "fdbe:8fbe:17b7:ffff::/108"
     ]
     ```

   - **Note:** The prefix length for IPv6 `serviceCidrs` must be >= 108 (for example, /64 won't work).
   
   - **Step 3: Ensuring Proper Peering Configuration:**

   Verify that any peering connections or routes between your cluster and external networks are correctly established for both IPv4 and IPv6 traffic.

   Action: Review and update peering configurations as necessary to accommodate dual stack traffic.

## Sample Output

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

##  Additional Recommendations:

Check for any conflicting configurations or policies that might be affecting dual stack functionality.
Scrutinize logs and error messages for indicators of configuration issues.
Consider consulting relevant documentation or community forums for specific platform-related troubleshooting steps.
When Nexus Kubernetes cluster isn't configured with IPv6 in "podCidrs" and "serviceCidrs," IPv4 peering occurs on CE but not IPv6.

## Conclusion
Setting up a dual-stack configuration involves enabling both IPv4 and IPv6 on your network, and ensuring devices can communicate over both. This allows for a smooth transition to IPv6 while still supporting IPv4 devices. By following the steps outlined in this guide, you should be able to identify and resolve common configuration issues related to setting up a dual stack cluster. If you continue to experience difficulties, consider seeking further assistance from your network administrator or consulting platform-specific support resources.

Remember, specific steps and options may vary depending on your hardware and software. Consult your equipment's documentation for precise instructions.
