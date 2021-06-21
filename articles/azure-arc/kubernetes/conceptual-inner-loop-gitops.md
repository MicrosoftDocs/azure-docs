---
title: "Inner Loop Developer Experience for Teams Adopting GitOps"
services: azure-arc
ms.service: azure-arc
ms.date: 06/18/2021
ms.topic: conceptual
author: sudivate
ms.author: sudivate
description: "This article provides a conceptual overview of Inner Loop Developer Experience for Teams Adopting GitOps "
keywords: "GitOps, Kubernetes, K8s, Azure, Helm, Arc, AKS, Azure Kubernetes Service, containers, CI, CD, Azure DevOps, Inner loop, Dev Experience"
---
# Inner Loop Developer Experience for teams adopting GitOps

## Inner dev loop frameworks

Building and deploying containers can slow down the inner dev experience and impact team productivity. Cloud-native development teams will benefit from a robust inner dev loop framework. Inner dev loop frameworks assist in the iterative process of writing code, building, and debugging.

Inner dev loop frameworks capabilities include:

 
1. Automate repetitive steps like building code, containers, and deploying to target cluster. 
1. Easily working with remote and local clusters, and supporting local tunnel debugging for hybrid setup.
1. Ability to configure custom flow for team-based productivity.  
1. Allow handling of microservice dependencies. 
1. Hot reloading, port forwarding, log, and terminal access. 



Different dev teams, depending on the maturity and complexity of the service might choose a completely local, complete remote, or hybrid cluster setup to speed up the inner dev loop. 

Luckily, there are many frameworks out there that support the listed capabilities. Microsoft offers Bridge to Kubernetes for local tunnel debugging and similar market offerings like DevSpace, Scaffold, and Tilt, among others.

> [!NOTE]
> Note: Don’t confuse the market offering DevSpace with Microsoft’s previously named DevSpace, which is now called Bridge to Kubernetes. 


## Inner Loop to Outer Loop Transition 

Once the team evaluates and chooses an inner loop dev framework the next step is to build a seamless transition from inner loop to outer loop. 

Referring to the process described in [CI/CD workflow](conceptual-gitops-ci-cd.md) using GitOps, an application developer works on application code within an application repository. This repository also holds high-level deployment Helm and/or Kustomize templates. CI\CD pipelines generate the low-level manifests from the high-level templates, adding environment-specific values, and create a pull request that merges the low-level manifests with the GitOps repo that holds desired state for the specific environment. 

Similar low-level manifests can be generated locally for the inner dev loop using the configuration values local to the developer. Application developers can iterate on the code changes and use the low-level manifests to deploy and debug applications. Generation of the low-level manifests can be integrated into an inner loop workflow using the developer’s local configuration. Most of the inner loop framework allows configuring custom flows either by extending through custom plugins or injecting script invocation based on hooks. 

## Example inner loop workflow built with DevSpace framework


### Diagram A: Inner Loop Flow
:::image type="content" source="media/dev-innerloop.PNG" alt-text="Inner Loop Flow":::

### Diagram B: Inner Loop to Outer Loop transition
:::image type="content" source="media/innerloop-to-outerloop.PNG" alt-text="Inner Loop to Outer Loop Transition" :::


## Example workflow
As an application developer, Alice:
- Authors a devspace.yaml to configure the inner loop.
- Write and test application code using the inner loop for efficiency.
- Deploy to staging or prod with outer loop.


Suppose Alice wants to make changes to the application code and run and debug the application either in local or remote cluster.

1. Alice updates the local configuration for the development environment represented in .env file.
1. Alice runs `devspace use context`, selects the Kubernetes cluster context.
1.	Alice selects a namespace she wants to work with by running `devspace use namespace <namespace_name>`.
1.	Alice can iterate through changes to the application code by running `devspace dev` to deploy and debug the application onto target cluster.
1. Running `devspace dev` generates low-level manifests based on Alices’s local configuration and deploys the application. These low-level manifests are configured with devspace hooks in devspace.yaml
1. Alice doesn't need to rebuild the container every time she makes code changes, since DevSpace will enable hot reloading, using file sync to copy her latest changes inside the container.
1. Running `devspace dev` will also deploy any dependencies configured in devspace.yaml, such as back-end dependencies to front-end. 
1. Alice tests her changes by accessing the application through the forwarding configured through devspace.yaml.
1. Once Alice finalizes her changes, she can purge the deployment by running `devspace purge` and create a new pull request to merge her changes to the dev branch of the application repository.

> [!NOTE]
> Find the sample code for above workflow at this [GitHub repo](https://github.com/Azure/arc-cicd-demo-src)