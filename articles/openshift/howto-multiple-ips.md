---
title: Configure multiple IP addresses for ARO cluster load balancers
description: Discover how to configure multiple IP addresses for ARO cluster load balancers.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 10/25/2023
#Customer intent: As an ARO SRE, I need to configure multiple outbound IP addresses per ARO cluster load balancers
---
# Configure multiple IP addresses per ARO cluster load balancer

Typically, ARO clusters are created with a single public IP address and load balancer, providing a means for outbound connectivity to other services. Alternatively, you can assign multiple additonal public IP addresses to a cluster. Reasons for requiring multiple IPs may include:

- The ability to scale clusters that need the ability to originate internet-bound traffic

- The need for "allow listing" IPs that receive traffic from the cluster

- Configurable egress IPs per namespace

Multiple outbound IPs can be assigned to clusters when they're created, or can be added to existing clusters.

You can configure up to 20 IP addresses per cluster.

## Requirements


## Create the cluster with multiple IP addresses 

To create a new ARO cluster with multiple managed IPs for the service load balancer (SLB), use the following command, being sure to include the desired number of IPs in the               `--load-balancer-managed-outbound-ip-count` parameter. In the example below, seven (7) IP addresses will be created:

```
az aro create --resource-group aroResourceGroup --name aroCluster \ 

              --load-balancer-managed-outbound-ip-count 7 \
```

## Update the number of IP addresses on existing clusters

To update the number of managed IPs for the SLB of an existing cluster, use the following command, being sure to include the desired number of IPs in the               `--load-balancer-managed-outbound-ip-count` parameter. In the example below, the number of IPs for the cluster will be updated to four (4):

```
az aro update --resource-group aroResourceGroup --name aroCluster \ 

              --load-balancer-managed-outbound-ip-count 4
```

You can use this update method to either increase or decrease the number of IPs on a cluster.
