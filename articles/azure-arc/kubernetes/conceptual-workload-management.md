---
title: "Workload management in a multi-cluster environment with GitOps"
description: "This article provides a conceptual overview of the workload management in a multi-cluster environment with GitOps."
ms.date: 03/29/2023
ms.topic: conceptual
author: eedorenko
ms.author: iefedore
---

# Workload management in a multi-cluster environment with GitOps

Developing modern cloud-native applications often includes building, deploying, configuring, and promoting workloads across a group of Kubernetes clusters. With the increasing diversity of Kubernetes cluster types, and the variety of applications and services, the process can become complex and unscalable. Enterprise organizations can be more successful in these efforts by having a well defined structure that organizes people and their activities, and by using automated tools.

This article walks you through a typical business scenario, outlining the involved personas and major challenges that organizations often face while managing cloud-native workloads in a multi-cluster environment. It also suggests an architectural pattern that can make this complex process simpler, observable, and more scalable.

## Scenario overview

This article describes an organization that develops cloud-native applications. Any application needs a compute resource to work on. In the cloud-native world, this compute resource is a Kubernetes cluster. An organization may have a single cluster or, more commonly, multiple clusters. So the organization must decide which applications should work on which clusters. In other words, they must schedule the applications across clusters. The result of this decision, or scheduling, is a model of the desired state of the clusters in their environment. Having that in place, they need somehow to deliver applications to the assigned clusters so that they can turn the desired state into the reality, or, in other words, reconcile it.

Every application goes through a software development lifecycle that promotes it to the production environment. For example, an application is built, deployed to Dev environment, tested and promoted to Stage environment, tested, and finally delivered to production. For a cloud-native application, the application requires and targets different Kubernetes cluster resources throughout its lifecycle. In addition, applications normally require clusters to provide some platform services, such as Prometheus and Fluentbit, and infrastructure configurations, such as networking policy.

Depending on the application, there may be a great diversity of cluster types to which the application is deployed. The same application with different configurations could be hosted on a managed cluster in the cloud, on a connected cluster in an on-premises environment, on a group of clusters on semi-connected edge devices on factory lines or military drones, and on an air-gapped cluster on a starship. Another complexity is that clusters in early lifecycle stages such as Dev and QA are normally managed by the developer, while reconciliation to actual production clusters may be managed by the organization's customers. In the latter case, the developer may be responsible only for promoting and scheduling the application across different rings.  

## Challenges at scale

In a small organization with a single application and only a few operations, most of these processes can be handled manually with a handful of scripts and pipelines. But for enterprise organizations operating on a larger scale, it can be a real challenge. These organizations often produce hundreds of applications that target hundreds of cluster types, backed up by thousands of physical clusters. In these cases, handling such operations manually with scripts isn't feasible.

The following capabilities are required to perform this type of workload management at scale in a multi-cluster environment:

- Separation of concerns on scheduling and reconciling
- Promotion of the multi-cluster state through a chain of environments
- Sophisticated, extensible and replaceable scheduler
- Flexibility to use different reconcilers for different cluster types depending on their nature and connectivity

## Scenario personas

Before we describe the scenario, let's clarify which personas are involved, what responsibilities they have, and how they interact with each other.

### Platform team

The platform team is responsible for managing the clusters that host applications produced by application teams.

Key responsibilities of the platform team are:

* Define staging environments (Dev, QA, UAT, Prod).
* Define cluster types and their distribution across environments.
* Provision new clusters.
* Manage infrastructure configurations across the clusters.
* Maintain platform services used by applications.
* Schedule applications and platform services on the clusters.

### Application team

The application team is responsible for the software development lifecycle (SDLC) of their applications. They provide Kubernetes manifests that describe how to deploy the application to different targets. They're responsible for owning CI/CD pipelines that create container images and Kubernetes manifests and promote deployment artifacts across environment stages.

Typically, the application team has no knowledge of the clusters that they are deploying to. They aren't aware of the structure of the multi-cluster environment, global configurations, or tasks performed by other teams. The application team primarily understands the success of their application rollout as defined by the success of the pipeline stages.

Key responsibilities of the application team are:

* Develop, build, deploy, test, promote, release, and support their applications.
* Maintain and contribute to source and manifests repositories of their applications.
* Define and configure application deployment targets.
* Communicate to platform team, requesting desired compute resources for successful SDLC operations.

## High level flow

This diagram shows how the platform and application team personas interact with each other while performing their regular activities.

:::image type="content" source="media/concept-workload-management/high-level-diagram.png" alt-text="Diagram showing how the personas interact with each other." lightbox="media/concept-workload-management/high-level-diagram.png":::

The primary concept of this whole process is separation of concerns. There are workloads, such as applications and platform services, and there is a platform where these workloads run. The application team takes care of the workloads (*what*), while the platform team is focused on the platform (*where*).

The application team runs SDLC operations on their applications and promotes changes across environments. They don't know which clusters their application will be deployed on in each environment. Instead, the application team operates with the concept of *deployment target*, which is simply a named abstraction within an environment. For example, deployment targets could be integration on Dev, functional tests and performance tests on QA, early adopters, external users on Prod, and so on. 

The application team defines deployment targets for each rollout environment, and they know how to configure their application and how to generate manifests for each deployment target. This process is automated and exists in the application repositories space. This results in generated manifests for each deployment target, stored in a manifests storage such as a Git repository, Helm Repository, or OCI storage.

The platform team has limited knowledge about the applications, so they aren't involved in the application configuration and deployment process. The platform team is in charge of platform clusters, grouped in cluster types. They describe cluster types with configuration values such as DNS names, endpoints of external services, and so on. The platform team assigns or schedules application deployment targets to various cluster types. With that in place, application behavior on a physical cluster is determined by the combination of the deployment target configuration values (provided by the application team), and cluster type configuration values (provided by the platform team).

The platform team uses a separate platform repository that contains manifests for each cluster type. These manifests define the workloads that should run on each cluster type, and which platform configuration values should be applied. Clusters can fetch that information from the platform repository with their preferred reconciler and then apply the manifests.

Clusters report their compliance state with the platform and application repositories to the Deployment Observability Hub. The platform and application teams can query this information to analyze historical workload deployment across clusters. This information can be used in the dashboards, alerts and in the deployment pipelines to implement progressive rollout.

## Solution architecture

Let's have a look at the high level solution architecture and understand its primary components.

:::image type="content" source="media/concept-workload-management/architecture.png" alt-text="Diagram showing solution architecture." lightbox="media/concept-workload-management/architecture.png":::

### Control plane

The platform team models the multi-cluster environment in the control plane. It's designed to be human-oriented and easy to understand, update, and review. The control plane operates with abstractions such as Cluster Types, Environments, Workloads, Scheduling Policies, Configs and Templates. These abstractions are handled by an automated process that assigns deployment targets and configuration values to the cluster types, then saves the result to the platform GitOps repository. Although there may be thousands of physical clusters, the platform repository operates at a higher level, grouping the clusters into cluster types.

The main requirement for the control plane storage is to provide a reliable and secure transaction processing functionality, rather than being hit with complex queries against a large amount of data. Various technologies may be used to store the control plane data.

This architecture design suggests a Git repository with a set of pipelines to store and promote platform abstractions across environments. This design provides a number of benefits:

* All advantages of GitOps principles, such as version control, change approvals, automation, pull-based reconciliation. 
* Git repositories such as GitHub provide out of the box branching, security and PR review functionality.
* Easy implementation of the promotional flows with GitHub Actions Workflows or similar orchestrators.
* No need to maintain and expose a separate control plane service.

### Promotion and scheduling

The control plane repository contains two types of data:

* Data that gets promoted across environments, such as a list of onboarded workloads and various templates.
* Environment-specific configurations, such as included environment cluster types, config values, and scheduling policies. This data isn't promoted, as it's specific to each environment.

The data to be promoted is stored in the `main` branch. Environment-specific data is stored in the corresponding environment branches such as example `dev`, `qa`, and `prod`. Transforming data from the control plane to the GitOps repo is a combination of the promotion and scheduling flows. The promotion flow moves the change across the environments horizontally; the scheduling flow does the scheduling and generates manifests vertically for each environment.

:::image type="content" source="media/concept-workload-management/promotion-flow.png" alt-text="Diagram showing promotion flow." lightbox="media/concept-workload-management/promotion-flow.png":::

A commit to the `main` branch starts the promotion flow that triggers the scheduling flow for each environment one by one. The scheduling flow takes the base manifests from `main`, applies config values from a corresponding to this environment branch, and creates a PR with the resulting manifests to the platform GitOps repository. Once the rollout on this environment is complete and successful, the promotion flow goes ahead and performs the same procedure on the next environment. On each environment, the flow promotes the same commit ID of the `main` branch, making sure that the content from `main` goes to the next environment only after successful deployment to the previous environment.

A commit to the environment branch in the control plane repository starts the scheduling flow for this environment. For example, perhaps you have configured cosmo-db endpoint in the QA environment. You only want to update the QA branch of the platform GitOps repository, without touching anything else. The scheduling takes the `main` content, corresponding to the latest commit ID promoted to this environment, applies configurations, and promotes the resulting manifests to the platform GitOps branch.

### Workload assignment

In the platform GitOps repository, each workload assignment to a cluster type is represented by a folder that contains the following items:

* A dedicated namespace for this workload in this environment on a cluster of this type.
* Platform policies restricting workload permissions.
* Consolidated platform config maps with the values that the workload can use.
* Reconciler resources, pointing to a Workload Manifests Storage where the actual workload manifests or Helm charts are stored. For example, Flux GitRepository and Flux Kustomization, ArgoCD Application, Zarf descriptors, and so on.

### Cluster types and reconcilers

Every cluster type can use a different reconciler (such as Flux, ArgoCD, Zarf, Rancher Fleet, and so on) to deliver manifests from the Workload Manifests Storages. Cluster type definition refers to a reconciler, which defines a collection of manifest templates. The scheduler uses these templates to produce reconciler resources, such as Flux GitRepository and Flux Kustomization, ArgoCD Application, Zarf descriptors, and so on. The same workload may be scheduled to the cluster types, managed by different reconcilers, for example Flux and ArgoCD. The scheduler generates Flux GitRepository and Flux Kustomization for one cluster and ArgoCD Application for another cluster, but both of them point to the same Workload Manifests Storage containing the workload manifests.

### Platform services

Platform services are workloads (such as Prometheus, NGINX, Fluentbit, and so on) maintained by the platform team. Just like any workloads, they have their source repositories and manifests storage. The source repositories may contain pointers to external Helm charts. CI/CD pipelines pull the charts with containers and perform necessary security scans before submitting them to the manifests storage, from where they're reconciled to the clusters.

### Deployment Observability Hub

Deployment Observability Hub is a central storage that is easy to query with complex queries against a large amount of data. It contains deployment data with historical information on workload versions and their deployment state across clusters. Clusters register themselves in the storage and update their compliance status with the GitOps repositories. Clusters operate at the level of Git commits only. High-level information, such as application versions, environments, and cluster type data, is transferred to the central storage from the GitOps repositories. This high-level information gets correlated in the central storage with the commit compliance data sent from the clusters. 

## Next steps

* Walk through a sample implementation to explore [workload management in a multi-cluster environment with GitOps](workload-management.md).
* Explore a [multi-cluster workload management sample repository](https://github.com/microsoft/kalypso).