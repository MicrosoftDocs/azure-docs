---
title: Configure OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters (preview)
description: In this how-to article, learn how to configure OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters (preview).
author: johnmarco
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: johnmarc
ms.date: 06/13/2022
topic: how-to
keywords: azure, openshift, aro, red hat, azure CLI, azure portal, ovn, ovn-kubernetes, CNI, Container Network Interface
Customer intent: I need to configure OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters.
---

# Configure OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters (preview)

This article explains how to Configure OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters. 

## About the OVN-Kubernetes default Container Network Interface (CNI) network provider

OVN-Kubernetes Container Network Interface (CNI) for Azure Red Hat OpenShift cluster is now available for preview. 

The OpenShift Container Platform cluster uses a virtualized network for pod and service networks. The OVN-Kubernetes Container Network Interface (CNI) plug-in is a network provider for the default cluster network. OVN-Kubernetes, which is based on the Open Virtual Network (OVN), provides an overlay-based networking implementation. 

A cluster that uses the OVN-Kubernetes network provider also runs Open vSwitch (OVS) on each node. OVN configures OVS on each node to implement the declared network configuration.

> [!IMPORTANT]
> Currently, this Azure Red Hat OpenShift feature is being offered in preview only. Preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they are excluded from the service-level agreements and limited warranty. Azure Red Hat OpenShift previews are partially covered by customer support on a best-effort basis. As such, these features are not meant for production use.

## OVN-Kubernetes features

The OVN-Kubernetes CNI cluster network provider offers the following features:

* Uses OVN to manage network traffic flows. OVN is a community developed, vendor-agnostic network virtualization solution.
* Implements Kubernetes network policy support, including ingress and egress rules.
* Uses the Generic Network Virtualization Encapsulation (Geneve) protocol rather than the Virtual Extensible LAN (VXLAN) protocol to create an overlay network between nodes.

For more information about OVN-Kubernetes CNI network provider, see [About the OVN-Kubernetes default Container Network Interface (CNI) network provider](https://docs.openshift.com/container-platform/4.10/networking/ovn_kubernetes_network_provider/about-ovn-kubernetes.html).

## Prerequisites

Complete the following prerequisites.
### Install and use the preview Azure Command-Line Interface (CLI)

> [!NOTE] 
> The Azure CLI extension is required for the preview feature only. 

If you choose to install and use the CLI locally, ensure you're running Azure CLI version 2.37.0 or later. Run `az --version` to find the version. For details on installing or upgrading Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

1. Use the following URL to download both the Python wheel and the CLI extension: 

    [https://aka.ms/az-aroext-latest.whl](https://aka.ms/az-aroext-latest.whl)

2. Run the following command:

```azurecli-interactive
az extension add --upgrade -s <path to downloaded .whl file>
```

3. Verify the CLI extension is being used:

```azurecli-interactive
az extension list
[
  {
    "experimental": false,
    "extensionType": "whl",
    "name": "aro",
    "path": "<path may differ depending on system>",
    "preview": true,
    "version": "1.0.6"
  }
]
```

4. Run the following command:

```azurecli-interactive
az aro create --help
```

The result should show the `–sdn-type` option, as follows: 

```json
--sdn-type --software-defined-network-type : SDN type either "OpenShiftSDN" (default) or "OVNKubernetes". Allowed values: OVNKubernetes, OpenShiftSDN
```

## Create an Azure Red Hat OpenShift cluster with OVN as the network provider

The process to create an Azure Red Hat OpenShift cluster with OVN is exactly the same as the existing process explained in [Tutorial: Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md), with the following exception. You must also pass in the SDN type of `OVNKubernetes` in step 4 below. 

The following high-level procedure outlines the steps to create an Azure Red Hat OpenShift cluster with OVN as the network provider:

1. Verify your permissions.
2. Register the resource providers.
3. Create a virtual network containing two empty subnets.
4. Create an Azure Red Hat OpenShift cluster by using OVN CNI network provider.
5. Verify the Azure Red Hat OpenShift cluster is using OVN CNI network provider.

## Verify your permissions

Using OVN CNI network provider for Azure Red Hat OpenShift clusters requires you to create a resource group, which will contain the virtual network for the cluster. You must have either Contributor and User Access Administrator permissions or have Owner permissions either directly on the virtual network or on the resource group or subscription containing it.

You'll also need sufficient Azure Active Directory permissions (either a member user of the tenant, or a guest user assigned with role Application administrator) for the tooling to create an application and service principal on your behalf for the cluster. For more information about user roles, see [Member and guest users](../active-directory/fundamentals/users-default-permissions.md#member-and-guest-users) and [Assign administrator and non-administrator roles to users with Azure Active Directory](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md).

## Register the resource providers

If you have multiple Azure subscriptions, you must register the resource providers. For information about the registration procedure, see [Register the resource providers](tutorial-create-cluster.md#register-the-resource-providers).

## Create a virtual network containing two empty subnets

If you have an existing virtual network that meets your needs, you can skip this step. To know the procedure of creating a virtual network, see [Create a virtual network containing two empty subnets](tutorial-create-cluster.md#create-a-virtual-network-containing-two-empty-subnets).

## Create an Azure Red Hat OpenShift cluster by using OVN-Kubernetes CNI network provider

Run the following command to create an Azure Red Hat OpenShift cluster that uses the OVN CNI network provider:

```
az aro create --resource-group $RESOURCEGROUP \
              --name $CLUSTER  \
              --vnet aro-vnet  \
              --master-subnet master-subnet \
              --worker-subnet worker-subnet \
              --sdn-type OVNKubernetes \
              --pull-secret @pull-secret.txt
```

## Verify an Azure Red Hat OpenShift cluster is using the OVN CNI network provider

After the cluster is successfully configured to use the OVN CNI network provider, sign in to your account and run the following command:

```
oc get network.config/cluster -o jsonpath='{.status.networkType}{"\n"}'
```

The value of `status.networkType` must be `OVNKubernetes`.

## Recommended content

[Tutorial: Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md)
