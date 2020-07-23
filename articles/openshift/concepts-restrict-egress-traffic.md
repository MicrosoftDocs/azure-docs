---
title: Concepts - Controlling and restricting egress traffic
description: How to control and restrict egress traffic from Azure Red Hat OpenShift 4 clusters
author: sakthi-vetrivel
ms.author: suvetriv
ms.topic: concept
ms.service: container-service
ms.date: 07/23/2020
#Customer intent: As a cluster administrator, I want to be able to restrict and control egress traffic from my cluster.
---

# Controlling and restricting egress traffic in Azure Red Hat OpenShift 4

This article provides the necessary details that allow you to secure outbound traffic from your cluster for standard Azure Red Hat OpenShift 4 clusters.

> [!IMPORTANT]
> The specific network rules, endpoints, ports, and other information provided in this document is subject to change.

## Background

Azure Red Hat OpenShift 4 clusters are deployed on two virtual networks. You create these networks as part of creating your cluster, and they have  **outbound** dependencies on services outside of the virtual networks.

For management and operational purposes, nodes in an Azure Red Hat OpenShift 4 cluster need to access certain ports and fully qualified domain names (FQDNs). These endpoints are required for the nodes to communicate with the API server, or to download and install core Kubernetes cluster components and node security updates. For example, the cluster needs to pull base system container images from Microsoft Container Registry (MCR).

The Azure Red Hat OpenShift 4 outbound dependencies are almost entirely defined with FQDNs, which do not have static addresses behind them. The lack of static addresses means that Network Security Groups can not be used to lock down the outbound traffic from an Azure Red Hat OpenShift 4 cluster. 

By default, Azure Red Hat OpenShift 4 clusters have unrestricted outbound (egress) internet access. This level of network access allows nodes and services you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible to maintain healthy cluster maintenance tasks. The simplest solution to securing outbound addresses lies in use of a firewall device that can control outbound traffic based on domain names. Azure Firewall, for example, can restrict outbound HTTP and HTTPS traffic based on the FQDN of the destination. You can also configure your preferred firewall and security rules to allow these required ports and addresses.

> [!IMPORTANT]
> This document covers only how to lock down the traffic leaving the Azure Red Hat OpenShift 4 subnet. Azure Red Hat OpenShift 4 has no ingress requirements by default.  Blocking **internal subnet traffic** using network security groups (NSGs) and firewalls is not supported. To control and block the traffic within the cluster, use [***Network Policies***][network-policy].

## Required outbound network rules and FQDNs

The following network and FQDN/application rules are required for an Azure Red Hat OpenShift 4 cluster. You can use them if you wish to configure a solution other than Azure Firewall.

* FQDN HTTP/HTTPS endpoints can be placed in your firewall device.
* Wildcard HTTP/HTTPS endpoints are dependencies that can vary with your Azure Red Hat OpenShift 4 cluster based on a number of qualifiers.

### Azure Global required network rules

The required network rules and IP address dependencies are:

| Destination Endpoint                                                             | Protocol | Port    | Use  |
|----------------------------------------------------------------------------------|----------|---------|------|
| **\*.blob.core.windows.net** | https | 443 | Required for cluster logging, cluster registries. |
| **login.microsoft.com** | https | 443 | Required for Azure Active Directory authentication. |
| **api.openshift.com** | https | 443 | Required for OpenShift telemetry. |
| **management.azure.com** | https | 443 | Required for Azure cloud provider. |
| **gcs.ppe.monitoring.core.windows.net** | https | 443 | Required for cluster logging. |
| **quay.io** | https | 443 | Required for Azure Red Hat OpenShift container images and updates. |
| **registry.redhat.io** | https | 443 | Required for ARO container images and updates. |
| **\*.servicebus.windows.net** | https | 443 | Required for cluster logging. |
| **\*.table.core.windows.net** | https | 443 | Required for storage accounts. |
