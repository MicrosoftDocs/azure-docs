---
title: "Workload management in a multi-cluster environment with GitOps"
description: "This article provides a conceptual overview of the workload management in a multi-cluster environment with GitOps."
ms.date: 02/28/2023
ms.topic: conceptual
author: eedorenko
ms.author: iefedore
---

# Workload management in a multi-cluster environment with GitOps

Developing modern cloud native applications includes building, deploying, configuring and promoting workloads across a fleet of Kubernetes clusters. With the increasing diversity of Kubernetes clusters in the fleet and variety of applications and services, the whole process becomes complex and unscalable for the enterprise organizations. It requires a well defined structure that organizes people, their activities and introduces automated tools.

This conceptual article walks you through a typical business scenario, involved personas and major challenges that the organizations face while managing cloud-native workloads in a multi-cluster environment. It offers an architectural pattern targeting to make this complex process simpler, scalable and observable.

## Scenario overview

There is an organization that develops cloud-native applications. Any application needs a compute to work on. In the cloud native world, a compute is a Kubernetes cluster. An organization may have a single cluster or, which is more common, there are multiple clusters. So they have to decide what applications should work on what clusters, or in other words, schedule them. The result of this decision or scheduling is a model of their cluster fleet, the desired state of the world, if you will. Having that in place, they need somehow to deliver applications to the assigned clusters so they turn the desired state into the reality or, in other words, reconcile it.

Every single application goes through a certain software development lifecycle that promotes it to the production environment. For example, an application is built, deployed to Dev environment, tested and promoted to Stage environment, tested and finally delivered to production. So the application requires and targets different Kubernetes resources to support its lifecycle. Furthermore, the applications normally expect on the clusters some platform services like Prometheus and Fluentbit and infrastructure configurations like networking policy.

Depending on the application, the variety of the cluster types where the application is deployed in its lifecycle may be very diverse. The very same application with different configurations may be hosted on a managed cluster in the cloud, a connected cluster on premises, a fleet of clusters on semi-connected edge devices on factory lines or military drones, an air-gapped cluster on a starship. Besides that, clusters involved in the early lifecycle stages such as Dev and QA are normally managed by the developer, but the actual production clusters and reconciling to them may be managed by the organization's customers. In the latter case, the developer may be only responsible for promoting and scheduling the application across different rings.  

## Challenges at scale

The scenarios described above can be handled manually with a handful of scripts and pipelines in a small organization, operating a single application and a few clusters. In enterprise organizations, it's a real challenge. They operate at scale, producing hundreds of applications, targeting hundreds of cluster types that are backed up by thousands of physical clusters. It would be fair to say, that handling that manually with scripts is simply not feasible. It requires a scalable automated solution with the following capabilities:

- Separation of concerns on scheduling and reconciling
- Promotion of the fleet state through a chain of environments
- Sophisticated, extensible and replaceable scheduler
- Flexibility to use different reconcilers for different cluster types depending on their nature and connectivity

## Scenario personas

Let's clarify what personas are involved in the scenario, what responsibilities they have and how they interact with each other.

### Platform team

Platform team is responsible for managing the fleet of clusters that hosts applications produced by application teams.

#### Key responsibilities

* Define staging environments (Dev, QA, UAT, Prod)
* Define cluster types in the fleet and their distribution across environments
* Provision new clusters
* Manage infrastructure configurations across the fleet
* Maintain platform services used by applications
* Schedule applications and platform services on the clusters

### Application team

Application team is responsible for the software development lifecycle (SDLC) of their applications. They provide Kubernetes manifests that describe how to deploy the application to different targets. They are responsible for owning their CI/CD pipelines that create container images, Kubernetes manifests and promote the deployment artifacts across environment stages. The application team has no knowledge of the clusters that they are deploying to, and primarily understand the success of their application rollout as defined by the success of the pipeline stages. The application team is not aware of the structure of the fleet, global configurations and what other teams do.

#### Key responsibilities

* Develop, build, deploy, test, promote, release, and support their applications
* Maintain and contribute to source and manifests repositories of their applications
* Define and configure application deployment targets
* Communicate to Platform Team, requesting desired compute for the successful SDLC

## High level fLow

The diagram below describes how the personas interact with each other while performing their regular activities:

:::image type="content" source="media/concept-workload-management/high-level-diagram.png" alt-text="Diagram showing how the personas interact with each other.":::

The primary concept of the whole process is separation of concerns. There are workloads, such as applications and platform services, and there is a platform where these workloads are working on. Application team takes care of the workloads (*what*), while the platform team is focused on the platform (*where*).

Application Team runs SDLC of their applications and promotes changes across environments. Application Team doesn't operate with the notion of the cluster. They are not aware on which clusters their application will be deployed in each environment. Application Team operates with the concept of Deployment Target, which is simply a named abstraction within an environment. Examples of deployment targets could be: integration on Dev, functional tests and performance tests on QA, early adopters and external users on Prod and so on. Application Team defines deployment targets for each rollout environment and they know how to configure their application and how to generate manifests for each deployment target. This process is owned by the Application Team, it is automated and exists in the application repositories space. The outcome of the Application Team is generated manifests for each deployment target, stored in a manifests storage, such as a Git repository, Helm Repository, OCI storage.

Platform team has a very limited knowledge about the applications and therefore is not involved in the application configuration and deployment process. Platform team is in charge of platform clusters, grouped in Cluster Types. They describe cluster types with configuration values, such as DNS names, endpoints of external services and so on. Platform team assigns or schedules application deployment targets to various cluster types. With that in place, the application behavior on a physical cluster is determined by the combination of the deployment target configuration values, provided by the Application Team, and cluster type configuration values, provided by the Platform Team. 

The outcome of the Platform Team is saved in the Platform repository. It contains manifests for each cluster type with the information on what workloads should work on it and what platform configuration values should be applied. Clusters can fetch that information from the platform repository with their preferred reconciler and apply the manifests.

Clusters report their compliance state with the platform and application repositories to the Deployment Observability Hub. Platform and Application teams query this information to analyze workload deployment across the clusters historically. It can be used in the dashboards, alerts and in the deployment pipelines to implement progressive rollout.

## Solution architecture

Let's have a look at the high level solution architecture and understand its primary components:

:::image type="content" source="media/concept-workload-management/architecture.png" alt-text="Diagram showing solution architecture.":::

### Control plane

Platform Team models the fleet in the Control Plane. It's designed to be human oriented, easy to understand, update, and review. The control plane operates with the abstractions such as Cluster Types, Environments, Workloads, Scheduling Policies, Configs and Templates. These abstractions are processed by an automated process that assigns deployment targets and configuration values to the cluster types and saves the result the platform GitOps repository. It's important to say that although the entire fleet may consist of thousands of physical clusters, the platform repositories operate at the higher level, grouping the clusters into cluster types. 

The main requirement to the control plane storage is to provide a reliable and secure transaction processing functionality. It's not supposed to be hit with complex queries against a large amount of data. There is various applicable technologies to be used to store the control plane data. This architecture design suggests a Git repository with a set of pipelines to store and promote platform abstractions across environments. It gives a number of benefits:

* All advantages of the GitOps principles, such as version control, change approvals, automation, pull-based reconciliation  
* Git repositories such as GitHub provide out of the box branching, security and PR review functionality
* Easy implementation of the promotional flows with GitHub Actions Workflows or similar orchestrators 
* There is no need to maintain and expose a separate control plane service

### Promotion and scheduling

The Control Plane repository contains two types of data:

* The data that is about to be promoted across environments, such as a list of onboarded workloads and various templates.
* Environment specific configurations, such as included into environment cluster types, config values, scheduling policies. This data is not promoted as it is specific for each environment.

The data to be promoted is stored in the `main` branch. The environment specific data is stored in the corresponding environment branches. For example `dev`, `qa`, `prod`. Transforming data from the control plane to the GitOps repo is a combination of the promotion and scheduling flows. The promotion flow moves the change across the environments horizontally and the scheduling flow does the scheduling and generates manifests vertically for each environment. This concept is shown on the following diagram:

:::image type="content" source="media/concept-workload-management/promotion-flow.png" alt-text="Diagram showing promotion flow.":::

A commit to the `main` branch starts the promotion flow that triggers the scheduling flow for each environment one by one. The scheduling flow takes the base manifests from `main`, applies config values from a corresponding to this environment branch and creates a PR with the resulting manifests to the platform GitOps repository. Once the rollout on this environment is complete and successful, the promotion flow goes ahead and performs the same procedure on the next environment. On every environment the flow promotes the same commit id of the `main` branch, making sure that the content from `main` is getting to the next environment only after success on the previous environment.

A commit to the environment branch in the control plane repository simply starts the scheduling flow for this environment. For example, if you have configured cosmo-db endpoint in the QA environment, you only want to have updates in the QA branch of the platform GitOps repository. You don’t want to touch anything else. The scheduling takes the `main` content, corresponding to the latest commit id promoted to this environment, apply configurations and PR the resulting manifests to the platform GitOps branch.

### Workload assignment

In the platform GitOps repository each workload assignment to a cluster type is represented by a folder that contains the following items:

* A dedicated namespace for this workload in this environment on a cluster of this type
* Platform policies restricting workload permissions
* Consolidated platform config maps with the values that the workload can use
* Reconciler resources, pointing to a Workload Manifests Storage where the actual workload manifests or Helm charts are stored. For example, Flux GitRepository and Flux Kustomization, ArgoCD Application, Zarf descriptors and so on.

### Cluster types and reconcilers

Every single cluster type can use a different reconciler to deliver manifests from the Workload Manifests Storages. Reconciler examples are Flux, ArgoCD, Zarf, Rancher Fleet and so on. Cluster type definition refers to a reconciler, which defines a collection of manifest templates. The scheduler uses these templates to produce reconciler resources such as Flux GitRepository and Flux Kustomization, ArgoCD Application, Zarf descriptors and so on. The very same workload may be scheduled to the cluster types, managed by different reconcilers, for example Flux and ArgoCD. The scheduler generates Flux GitRepository and Flux Kustomization for one cluster and ArgoCD Application for another cluster, but both of them point to the same Workload Manifests Storage containing the workload manifests.

### Platform services

Platform services are workloads, maintained by the Platform Team. For example Prometheus, NGINX, Fluentbit and so on. Just like any workloads, they have their source repositories and manifests storages. The source repositories may contain pointers to the external Helm charts. The CI/CD pipelines pull the charts with the containers and perform all necessary security scanning before submitting them to the manifests storages, from where they are reconciled to the clusters in the fleet. 

### Deployment observability hub

Deployment Observability Hub is a central storage, which is easy to query with complex queries against a large amount of data. It contains deployment data with the historical information on the workload versions and their deployment state across clusters in the fleet. Clusters register themselves in the storage and update their compliance status with the GitOps repositories. Clusters operate at the level of Git commits only. High level information, such as application versions, environments, cluster types is transferred to the central storage from the GitOps repositories. The high level information gets correlated in the central storage with the commit compliance data, coming from the clusters. 

## Next steps

Refer to a sample implementation of the described concept and to a tutorial, walking you through the implementation in a step by step manner: 

> [!div class="nextstepaction"]
> - [Sample implementation: Workload Management in Multi-cluster environment with GitOps](https://github.com/microsoft/kalypso)
> - [Tutorial: Workload Management in Multi-cluster environment with GitOps](tutorial-workload-management.md)
