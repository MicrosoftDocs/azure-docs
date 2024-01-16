---
title: Configure multiple IP addresses for ARO cluster load balancers (Preview)
description: Discover how to configure multiple IP addresses for ARO cluster load balancers.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 12/05/2023
#Customer intent: As an ARO SRE, I need to configure multiple outbound IP addresses per ARO cluster load balancers
---
# Configure multiple IP addresses per ARO cluster load balancer (Preview)

ARO public clusters are created with a public load balancer that's used for outbound connectivity from inside the cluster. By default, one public IP address is configured on that public load balancer, and that limits the maximum node count of your cluster to 62. To be able to scale your cluster to the maximum supported number of nodes, you need to assign multiple additional public IP addresses to the load balancer.

You can configure up to 20 IP addresses per cluster.

## Requirements (Preview only)

In order to run the commands in this article, you must first download the aro extension wheel file from [https://aka.ms/az-aroext-latest](https://aka.ms/az-aroext-latest). To install the extension, run the following command:

`az extension add -s <path to downloaded whl file>`

## Create the cluster with multiple IP addresses 

To create a new ARO cluster with multiple managed IPs on the public load balancer, use the following command with the desired number of IPs in the `--load-balancer-managed-outbound-ip-count` parameter. In the example below, seven (7) IP addresses will be created:

```
az aro create --resource-group aroResourceGroup --name aroCluster \ 

              --load-balancer-managed-outbound-ip-count 7 \
```

## Update the number of IP addresses on existing clusters

To update the number of managed IPs on the public load balancer of an existing ARO cluster, use the following command with the desired number of IPs in the `--load-balancer-managed-outbound-ip-count` parameter. In the example below, the number of IPs for the cluster will be updated to four (4):

```
az aro update --resource-group aroResourceGroup --name aroCluster \ 

              --load-balancer-managed-outbound-ip-count 4
```

You can use this update method to either increase or decrease the number of IPs on a cluster to be between 1 and 20.
