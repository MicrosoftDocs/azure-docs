---
title: Migrating from Azure Container Service (ACS) to Azure Kubernetes Service (AKS)
description: Migrating from Azure Container Service (ACS) to Azure Kubernetes Service (AKS)
services: container-service
author: noelbundick
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 06/13/2018
ms.author: nobun
ms.custom: mvc
---

# Migrer de Azure Container Service (ACS) vers Azure Kubernetes Service (AKS)

L'objectif de ce document est de vous aider à mettre en place et éxécuter un plan de migration entre Azure Container Service avec Kubernetes (ACS) et Azure Kubernetes Service (AKS). Ce guide présente les différences entre ACS et AKS, il fournit un appeçu des étapes de migrations et vous aide à prendre les bonnes décisions.

## Differences entre ACS et AKS

ACS et AKS diffèrent dans certains domaines clés qui ont un impact sur la migration. Vous devriez examiner et prévoir d'aborder les différences suivantes avant toute migration.

* Les nodes AKS utilisent des disques managés
    * Les disques non-managés ont besoins d'être converti en disques managés afin d'être attachés aux nodes AKS
    * Les objets spécifiques `StorageClass` pour les disques Azure ont besoin d'être changés de `unmanaged` vers `managed`
    * Tous `PersistentVolumes` ont besoins d'avoir `kind: Managed`
* AKS supporte en ce momement uniquement un seul pool d'agent
* Les nodes Windows sont en ce moment en [private preview](https://azure.microsoft.com/en-us/blog/kubernetes-on-azure/)
* Verifier la liste des régions supportés par AKS [supported regions](https://docs.microsoft.com/azure/aks/container-service-quotas)
* AKS est un service géré avec un plan de contrôle Kubernetes hébergé. Vous devrez peut-être modifier vos applications si vous avez déjà modifié la configuration de vos masters ACS

### Differences entre les versions de Kubernetes

Si vous migrez vers une version plus récente de Kubernetes (ex: 1.7.x à 1.9.x), il y a quelques changements à l'API de k8s qui nécessiteront votre attention.

* [Migrate a ThirdPartyResource to CustomResourceDefinition](https://kubernetes.io/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)
* [Workloads API changes in versions 1.8 and 1.9](https://kubernetes.io/docs/reference/workloads-18-19/).

## Considérations à prendre en compte pour la migration

### Agent Pools

Alors que AKS gère le plan de contrôle Kubernetes, vous définissez toujours la taille et le nombre de nœuds que vous souhaitez inclure dans votre nouveau cluster. En supposant que vous voulez un mappage 1: 1 de ACS à AKS, vous devez capturer vos informations de nœud ACS existantes. Vous utiliserez ces données lors de la création de votre nouveau cluster AKS.

Exemple:

| Name | Count | VM Size | Operating System |
| --- | --- | --- | --- |
| agentpool0 | 3 | Standard_D8_v2 | Linux |
| agentpool1 | 1 | Standard_D2_v2 | Windows |

Because additional virtual machines will be deployed into your subscription during migration, you should verify that your quotas and limits are sufficient for these resources. You can learn more by reviewing [Azure subscription and service limits](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits). To check your current quotas, go to the [subscriptions blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal, select your subscription, then select `Usage + quotas`.

### Réseau

For complex applications, you'll typically migrate over time rather than all at once. That means that the old and new environments may need to communicate over the network. Applications that were previously able to use `ClusterIP` services to communicate may need to be exposed as type `LoadBalancer` and secured appropriately.

To complete the migration, you'll want to point clients to the new services running on AKS. The recommended way to redirect traffic is by updating DNS to point to the Load Balancer that sits in front of your AKS cluster.

### Applications Stateless

Stateless application migration is the most straightforward case. You'll apply your YAML definitions to the new cluster, validate that everything is working as expected, and redirect traffic to make your new cluster active.

### Applications Stateful

Migrating stateful applications requires careful planning to avoid data loss or unexpected downtime.

#### Applications Hautement Disponible

Some stateful applications can be deployed in a high availability configuration and can copy data across replicas. If this describes your current deployment, it may be possible to create a new member on the new AKS cluster, and migrate with minimal impact to downstream callers. The migration steps for this scenario generally are:

1. Create a new secondary replica on AKS
2. Wait for data to replicate
3. Fail over to make secondary replica the new primary
4. Point traffic to the AKS cluster

#### Migrer des volumes persistants

There are several factors to consider if you're migrating existing Persistent Volumes to AKS. Generally, the steps involved are:

1. (Optional) Quiesce writes to the application (requires downtime)
2. Snapshot disks
3. Create new Managed Disks from snapshots
4. Create Persistent Volumes in AKS
5. Update Pod specifications to [use existing volumes](https://docs.microsoft.com/en-us/azure/aks/azure-disk-volume) rather than PersistentVolumeClaims (static provisioning)
6. Deploy application to AKS
7. Validate
8. Point traffic to the AKS cluster

> **Important**: If you choose not to quiesce writes, you'll need to replicate data to the new deployment, as you'll be missing data that was written since the disk snapshot

Open-source tools exist that can help you create Managed Disks and migrate volumes between Kubernetes clusters.

* [noelbundick/azure-cli-disk-extension](https://github.com/noelbundick/azure-cli-disk-copy-extension) - copy and convert disks across Resource Groups and Azure regions
* [yaron2/azure-kube-cli](https://github.com/yaron2/azure-kube-cli) - enumerate ACS Kubernetes volumes and migrate them to an AKS cluster

#### Azure Files

Unlike disks, Azure Files can be mounted to multiple hosts concurrently. Neither Azure nor Kubernetes prevents you from creating a Pod in your AKS cluster that is still being used by your ACS cluster. To prevent data loss and unexpected behavior, you should ensure that both clusters aren't writing to the same files at the same time.

If your application can host multiple replicas pointing to the same file share, you can follow the stateless migration steps and deploy your YAML definitions to your new cluster.

If not, one possible migration approach involves the following steps:

1. Deploy your application to AKS with a replica count of 0
2. Scale the application on ACS to 0 (requires downtime)
3. Scale the application on AKS up to 1
4. Validate
5. Point traffic to the AKS cluster

In cases where you'd like to start with an empty share, then make a copy of the source data, you can use the [`az storage file copy`](https://docs.microsoft.com/en-us/cli/azure/storage/file/copy?view=azure-cli-latest) commands to migrate your data.

### Stratégie de déploiement

The recommended method is to use your existing CI/CD pipeline to deploy a known-good configuration to AKS. You'll clone your existing deploy tasks, and ensure that your `kubeconfig` points to the new AKS cluster.

In cases where that's not possible, you'll need to export resource definition from ACS, and then apply them to AKS. You can use `kubectl` to export objects.

```console
kubectl get deployment -o=yaml --export > deployments.yaml
```

There are also several open-source tools that can help, depending on your needs:

* [heptio/ark](https://github.com/heptio/ark) - requires k8s 1.7
* [yaron2/azure-kube-cli](https://github.com/yaron2/azure-kube-cli)
* [mhausenblas/reshifter](https://github.com/mhausenblas/reshifter)

## Étape de migration

### 1. Créer un cluster AKS

You can follow the docs to [create an AKS cluster](https://docs.microsoft.com/en-us/azure/aks/create-cluster) via the Azure portal, Azure CLI, or Resource Manager template.

> You can find sample Azure Resource Manager templates for AKS at the [Azure/AKS](https://github.com/Azure/AKS/tree/master/examples/vnet) repository on GitHub

### 2. Modifier les applications

Make any necessary modifications to your YAML definitions. Ex: replacing `apps/v1beta1` with `apps/v1` for `Deployments`

### 3. (Optionel) Migrer les volumes

Migrate volumes from your ACS cluster to your AKS cluster. More details can be found in the [Migrating Persistent Volumes](#Migrating-Persistent-Volumes) section.

### 4. Déployer des applications

Use your CI/CD system to deploy applications to AKS or use kubectl to apply the YAML definitions.

### 5. Valider

Validate that your applications are working as expected and that any migrated data has been copied over.

### 6. Rediriger le traffic

Update DNS to point clients to your AKS deployment.

### 7. Taches de post-migrations

If you migrated volumes and chose not to quiesce writes, you'll need to copy that data to the new cluster.
