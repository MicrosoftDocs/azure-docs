---
title: "CI/CD Workflow using GitOps - Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 02/25/2021
ms.topic: conceptual
author: tcare
ms.author: tcare
description: "This article provides a conceptual overview of a CI/CD workflow using GitOps"
keywords: "GitOps, Kubernetes, K8s, Azure, Helm, Arc, AKS, Azure Kubernetes Service, containers, CI, CD, Azure DevOps"
---
# Overview

Modern Kubernetes deployments are growing in complexity and house multiple applications, clusters, and environments. Managing these complex setups can be improved using GitOps, an approach to track the desired state of the Kubernetes environments declaratively with Git. Using Git to track cluster state improves accountability, makes it easier to investigate faults, and enables automation to manage environments using common Git tooling.

This article provides a conceptual overview of how to use Azure Arc, Azure Repos, and Azure Pipelines to make GitOps a reality in the full lifecycle of an application change. It covers an end-to-end example following a single change in an application from a developer to GitOps controlled Kubernetes environments.

## Architecture

Consider an application that is deployed to one or more Kubernetes environments.

![GitOps CI/CD architecture](./media/gitops-arch.png)
### Application repo
The application repo contains the application code that developers work on during their inner loop. Deployment templates for the application live in this repo in a generic form such as Helm and/or Kustomize. Environment-specific values are not stored. Changes to this repo invoke a PR or CI pipeline that starts the process towards deployment.
### Container Registry
The container registry holds all the images used in the Kubernetes environments, both first-party and third-party. Along with human readable tags, first-party application images should be tagged with the Git commit used to build the image. Third-party images should be cached for security, speed, and resilience. Make sure to have a plan for timely testing and integration of security updates. For more information, see the [ACR Consume and maintain public content](https://docs.microsoft.com/azure/container-registry/tasks-consume-public-content) guide for an example.
### PR Pipeline
Pull requests to the application repo are gated on a successful run of the PR pipeline. This pipeline runs the basic quality gates such as linting and unit tests on the application code. In addition to testing the application, the pipeline lints Dockerfiles and Helm templates used for deployment to a Kubernetes environment. Docker images should be built and tested, but not pushed. The pipeline should be relatively short in duration to allow for rapid iteration.
### CI Pipeline
The application CI pipeline runs all the steps of the PR pipeline and expands the testing and deployment checks. The pipeline can be run for each commit, or at a regular cadence with a group of commits. Application testing that is too long for a PR pipeline should be performed at this stage. Docker images should be pushed to the Container Registry after building in preparation for deployment. A set of testing values is sufficient to allow the substituted template to be linted. Images used at service runtime should be linted, built, and tested at this point. In the CI build specifically, artifacts are published for the CD step to consume in preparation for deployment.
### Flux
Flux is a service that runs in each cluster and is responsible for maintaining the desired state. The service frequently polls the GitOps repo for changes to its cluster and applies them.
### CD Pipeline
The CD pipeline is automatically triggered by successful CI builds. It utilizes the previously published templates, substitutes environment values, and opens a pull request to the GitOps repo to request a change to the desired state of one or more Kubernetes clusters. If appropriate, cluster administrators review the state change PR and approve the merge to the GitOps repo. The pipeline then awaits for the PR to successfully complete, which allows Flux to pick up the state change.
### GitOps repo
The GitOps repo represents the current desired state of all environments across clusters. Any change to this repo is picked up by the Flux service in each cluster and deployed. Pull requests are created with changes to the desired state, reviewed and merged. They contain changes to both deployment templates and the resulting rendered Kubernetes manifests. The low-level rendered manifests allow for careful inspection of changes that may not be obvious at the template level. This avoids any surprises that are not immediately obvious behind the template substitution.
### Kubernetes clusters
One or more Azure Arc-enabled Kubernetes clusters serve the different environments needed by the application. For example, if there is both a dev and QA environment, a single cluster might suffice if different namespaces are used. In other cases, having a second cluster provides easier separation of environments and more fine grained control.
## Example workflow
Alice is a developer who works on an application. Alice writes application code, defines how it is run in a Docker container, and defines the templates that run the container and dependent services in a Kubernetes cluster. Alice knows the application needs to be able to run in multiple environments, but does not necessarily know the specific settings for each environment.

Suppose Alice wants to make an application change that alters the Docker image used in the application deployment template.

1. Alice makes the change to the deployment template, pushes it to a remote branch on the application repo and opens a pull request for review by her.
2. Alice asks her team to review the change, and the PR pipeline runs validation. After a successful pipeline run, the team signs off and the change is merged.
3. The CI pipeline then validates Alice's change and successfully completes. The change is safe to deploy to the cluster, and the artifacts are saved to the CI pipeline run.
4. Alice's change merges triggers the CD pipeline to start running. The CD pipeline picks up the artifacts stored by Alice's CI run. The templates are substituted and compared against the existing cluster state in the GitOps repo. The CD pipeline creates a pull request to the GitOps repo with the desired changes to the cluster state.
5. After Alice's GitOps pull request is approved, the change is merged into the target branch corresponding to the environment.
6. Within minutes, Flux notices a change in the GitOps repo and pulls Alice's change. Because of the Docker image change, the application pod needs updating. Flux applies the change to the cluster.
8. The CD pipeline waits for a final success or failure notification from the GitOps Connector and reflects the outcome in the pipeline.
9. Alice tests the application endpoint to verify the deployment successfully completed.
10. If more environments are targeted for deployment, the CD pipeline iterates by creating a PR for the next environment and repeats steps 4-9. Additional approval may be needed for riskier deployments or environments, such as a security-related change or a production environment.
11. Once all the environments have been deployed to successfully, the pipeline completes.

## Next steps
[Configurations and GitOps with Azure Arc enabled Kubernetes](./conceptual-configurations.md)