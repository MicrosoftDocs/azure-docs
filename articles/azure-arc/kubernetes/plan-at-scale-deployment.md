---
title: How to plan and deploy Azure Arc enabled Kubernetes
services: azure-arc
ms.service: azure-arc
ms.date: 04/12/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: Onboard large number of clusters to Azure Arc enabled Kubernetes for configuration management
---

# Plan and deploy Azure Arc enabled Kubernetes

Deployment of an IT infrastructure service or business application is a challenge for any company. To prevent any unwelcome surprises or unplanned costs, you need to thoroughly plan for it to ensure you're as ready as possible. Such a plan should identify design and deployment criteria that needs to be met to complete the tasks.

For the deployment to continue smoothly, your plan should establish a clear understanding of:

* Roles and responsibilities.
* Inventory of all Kubernetes clusters
* Meet networking requirements.
* The skill set and training required to enable successful deployment and on-going management.
* Acceptance criteria and how you track its success.
* Tools or methods to be used to automate the deployments.
* Identified risks and mitigation plans to avoid delays and disruptions.
* How to avoid disruption during deployment.
* What's the escalation path when a significant issue occurs?

The purpose of this article is to ensure you're prepared for a successful deployment of Azure Arc enabled Kubernetes across multiple production clusters in your environment.

## Prerequisites

* An existing Kubernetes cluster. If you don't have one, you can create a cluster using one of these options:
    - [Kubernetes in Docker (KIND)](https://kind.sigs.k8s.io/)
    - Create a Kubernetes cluster using Docker for [Mac](https://docs.docker.com/docker-for-mac/#kubernetes) or [Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
    - Self-managed Kubernetes cluster using [Cluster API](https://cluster-api.sigs.k8s.io/user/quick-start.html)

* Your machines have connectivity from your on-premises network or other cloud environment to resources in Azure, either directly or through a proxy server. More details can be found under [network prerequisites](quickstart-connect-cluster.md#meet-network-requirements).

* A `kubeconfig` file pointing to the cluster you want to connect to Azure Arc.
* 'Read' and 'Write' permissions for the user or service principal creating the Azure Arc enabled Kubernetes resource type of `Microsoft.Kubernetes/connectedClusters`.

## Pilot

Before deploying to all production clusters, start by evaluating this deployment process before adopting it broadly in your environment. For a pilot, identify a representative sampling of clusters that aren't critical to your companies ability to conduct business. You'll want to be sure to allow enough time to run the pilot and assess its impact: we recommend approximately 30 days.

Establish a formal plan describing the scope and details of the pilot. The following sample plan should help you get started.

* **Goals** - Describes the business and technical drivers that led to the decision that a pilot is necessary.
* **Selection criteria** - Specifies the criteria used to select which aspects of the solution will be demonstrated via a pilot.
* **Scope** - Covers solution components, expected schedule, duration of the pilot, and number of clusters to target.
* **Success criteria and metrics** - Define the pilot's success criteria and specific measures used to determine level of success.
* **Training plan** - Describes the plan for training system engineers, administrators, etc. who are new to Azure and it services during the pilot.
* **Transition plan** - Describes the strategy and criteria used to guide transition from pilot to production.
* **Rollback** - Describes the procedures for rolling back a pilot to pre-deployment state.
* **Risks** - List all identified risks for conducting the pilot and associated with production deployment.

## Phase 1: Build a foundation

In this phase, system engineers or administrators perform the core activities such creation of resource groups, tags, role assignments so that the Azure Arc enabled Kubernetes resources can then be created and operated.

|Task |Detail |Duration |
|-----|-------|---------|
| [Create a resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) | A dedicated resource group to include only Azure Arc enabled Kubernetes resources and centralize management and monitoring of these resources. | One hour |
| Apply [Tags](../../azure-resource-manager/management/tag-resources.md) to help organize machines. | Evaluate and develop an IT-aligned [tagging strategy](/azure/cloud-adoption-framework/decision-guides/resource-tagging/). This can help reduce the complexity of managing your Azure Arc enabled Kubernetes resources and simplify making management decisions. | One day |
| Identify [configurations](tutorial-use-gitops-connected-cluster.md) for GitOps | Identify the application or baseline configurations such as `PodSecurityPolicy`, `NetworkPolicy` that you want to deploy to your clusters | One day |
| [Develop an Azure Policy](../../governance/policy/overview.md) governance plan | Determine how you'll implement governance of Azure Arc enabled Kubernetes clusters at the subscription or resource group scope with Azure Policy. | One day |
| Configure [Role based access control](../../role-based-access-control/overview.md) (RBAC) | Develop an access plan to identify who has read/write/all permissions on your clusters | One day |

## Phase 2: Deploy Azure Arc enabled Kubernetes

In this phase, we connect your Kubernetes clusters to Azure:

|Task |Detail |Duration |
|-----|-------|---------|
| [Connect your first Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md) | As part of connecting your first cluster to Azure Arc, set up your onboarding environment with all the required tools such as Azure CLI, Helm,  and `connectedk8s` extension for Azure CLI. | 15 minutes |
| [Create service principal](create-onboarding-service-principal.md) | Create a service principal to connect Kubernetes clusters non-interactively using Azure CLI or PowerShell. | One hour |


## Phase 3: Manage and operate

In this phase, we deploy applications and baseline configurations to your Kubernetes clusters.

|Task |Detail |Duration |
|-----|-------|---------|
|[Create configurations](tutorial-use-gitops-connected-cluster.md) on your clusters | Create configurations for deploying your applications on your Azure Arc enabled Kubernetes resource. | 15 minutes |
|[Use Azure Policy](use-azure-policy.md) for at-scale enforcement of configurations | Create policy assignments to automate the deployment of baseline configurations across all your clusters under a subscription or resource group scope. | 15 minutes |
| [Upgrade Azure Arc agents](agent-upgrade.md) | If you have disabled auto-upgrade of agents on your clusters, update your agents manually to the latest version to make sure you have the most recent security and bug fixes. | 15 minutes |

## Next steps

* Use our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* [Create configurations](./tutorial-use-gitops-connected-cluster.md) on your Azure Arc enabled Kubernetes cluster.
* [Use Azure Policy to apply configurations at scale](./use-azure-policy.md).