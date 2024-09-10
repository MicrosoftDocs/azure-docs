---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-enabled Kubernetes cluster access to Azure resources.
author: asergaz
ms.author: sergaz
ms.subservice: orchestrator
ms.topic: how-to
ms.date: 03/21/2024
ms.custom: ignite-2023, devx-track-azurecli

#CustomerIntent: As an IT professional, I want to manage secrets in Azure IoT Operations, by leveraging Key Vault and Secret Synchronization Controller to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.
---

# Manage secrets for your Azure IoT Operations Preview deployment

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Secrets management in Azure IoT Operations Preview uses Azure Key Vault as the managed vault solution on the cloud and uses [Secret Synchronization Controller](#TODO-ADD-LINK) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.

## Prerequisites

* An Arc-enabled Kubernetes cluster with Azure IoT Operations deployed. For more information, see [Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](howto-deploy-iot-operations.md).

## Enable Workload Identity on your cluster

A workload identity is an identity you assign to a software workload (such as an application, service, script, or container) to authenticate and access other services and resources. To learn more, see [What are workload identities?](/entra/workload-id/workload-identities-overview).

The workload identity feature needs to be enabled on your cluster, so that the [Secret Synchronization Controller](#TODO-ADD-LINK) and Azure IoT Operations can access Microsoft Entra ID protected resources.

If you deployed Azure IoT Operations with the advanced security settings, the workload identity feature is already enabled on your cluster. If you deployed with the default settings, you need to enable the workload identity feature on your cluster.

To enable workload identity on your cluster:

1. Use the [az connectedk8s update](/cli/azure/connectedk8s#az-connectedk8s-update) command to update a connected kubernetes cluster with oidc issuer and the workload identity webhook:

   ```azurecli
   az connectedk8s update -g <RESOURCE_GROUP> -n <CLUSTER_NAME>  --subscription <SUBSCRIPTION_ID> --enable-oidc-issuer --enable-workload-identity
   ```

1. Restart the [kube-apiserver](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/). The following command runs on Ubuntu Linux with K3s clusters:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart k3s 
   ```
   
   > [!NOTE]
   > The process for updating the api server configuration differs based on the specific cluster implementation, look up for documentation on how to update the api server based on your specific K8s flavor.
 

## Set up secret management 

### Create an Azure Key Vault

### Create a user assigned managed identity

### Create a federated identity credential for secrets 

## Add and use secrets

## Manage Synced Secrets