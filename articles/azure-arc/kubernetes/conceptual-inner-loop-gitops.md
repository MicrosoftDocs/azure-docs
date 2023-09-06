---
title: "Inner Loop Developer Experience for Teams Adopting GitOps"
ms.date: 08/09/2023
ms.topic: conceptual
author: sudivate
ms.author: sudivate
description: "Learn how an established inner loop can enhance developer productivity and help in a seamless transition for teams adopting GitOps."
---
# Inner Loop Developer Experience for teams adopting GitOps

This article describes how an established inner loop can enhance developer productivity and help in a seamless transition from inner dev loop to outer loop for teams adopting GitOps.

## Inner dev loop frameworks

Building and deploying containers can slow the inner dev experience and impact team productivity. Cloud-native development teams benefit from a robust inner dev loop framework. Inner dev loop frameworks help with the iterative process of writing code, building, and debugging.

Capabilities of inner dev loop frameworks include:

- Automation of repetitive steps such as building code and deploying to target cluster.
- Enhanced ability to work with remote and local clusters, and supporting local tunnel debugging for hybrid setup.
- Ability to configure custom flow for team-based productivity.
- Handling microservice dependencies.
- Hot reloading, port forwarding, log, and terminal access.

Depending on the maturity and complexity of the service, dev teams can choose their cluster setup to accelerate the inner dev loop:

- All local
- All remote
- Hybrid

Many frameworks  support these capabilities. Microsoft offers [Bridge to Kubernetes](/visualstudio/bridge/overview-bridge-to-kubernetes) for [local tunnel debugging](/visualstudio/bridge/bridge-to-kubernetes-vs-code#install-and-use-local-tunnel-debugging). Many other similar market offerings are available, such as DevSpace, Scaffold, and Tilt.

> [!NOTE]
> The market offering [DevSpace](https://github.com/loft-sh/devspace) shouldn't be confused with Microsoft’s offering, [Bridge to Kubernetes](/visualstudio/bridge/overview-bridge-to-kubernetes), which was previously named DevSpace.

## Inner loop to outer loop transition

Once you've evaluated and chosen an inner loop dev framework, you can build a seamless inner loop to outer loop transition.

As described in the example scenario covered in [CI/CD workflow using GitOps](conceptual-gitops-flux2-ci-cd.md), an application developer works on application code within an application repository. This application repository also holds high-level deployment Helm and/or Kustomize templates.

The CI/CD pipelines:

- Generate the low-level manifests from the high-level templates, adding environment-specific values.
- Create a pull request that merges the low-level manifests with the GitOps repo that holds desired state for the specific environment.

Similar low-level manifests can be generated locally for the inner dev loop, using the configuration values local to the developer. Application developers can iterate on the code changes and use the low-level manifests to deploy and debug applications. Generation of the low-level manifests can be integrated into an inner loop workflow, using the developer’s local configuration. Most of the inner loop framework allows configuring custom flows by either extending through custom plugins or injecting script invocation based on hooks.

## Example inner loop workflow built with DevSpace framework

To illustrate the inner loop workflow, we can look at an example scenario. This example uses the DevSpace framework, but the general workflow can be used with other frameworks.

This diagram shows the workflow for the inner loop.

:::image type="content" source="media/dev-inner-loop.png" alt-text="Diagram showing the inner loop flow." lightbox="media/dev-inner-loop.png":::

This diagram shows the workflow for the inner loop to outer loop transition.

:::image type="content" source="media/inner-loop-to-outer-loop.png" alt-text="Diagram showing inner loop to outer loop transition." lightbox="media/inner-loop-to-outer-loop.png":::

In this example, as an application developer, Alice:

- Authors a devspace.yaml file to configure the inner loop.
- Writes and tests application code using the inner loop for efficiency.
- Deploys to staging or prod with outer loop.

Suppose Alice wants to update, run, and debug the application either in local or remote cluster.

1. Alice updates the local configuration for the development environment represented in .env file.
1. Alice runs `devspace use context` and selects the Kubernetes cluster context.
1. Alice selects a namespace to work with by running `devspace use namespace <namespace_name>`.
1. Alice can iterate changes to the application code, and deploys and debugs the application onto the target cluster by running `devspace dev`.
1. Running `devspace dev` generates low-level manifests based on Alice’s local configuration and deploys the application. These low-level manifests are configured with DevSpace hooks in devspace.yaml.
1. Alice doesn't need to rebuild the container every time she makes code changes, since DevSpace enables hot reloading, using file sync to copy her latest changes inside the container.
1. Running `devspace dev` also deploys any dependencies configured in devspace.yaml, such as back-end dependencies to front-end.
1. Alice tests her changes by accessing the application through the forwarding configured through devspace.yaml.
1. Once Alice finalizes her changes, she can purge the deployment by running `devspace purge` and create a new pull request to merge her changes to the dev branch of the application repository.

> [!NOTE]
> Find the sample code for this workflow in our [GitHub repo](https://github.com/Azure/arc-cicd-demo-src).

## Next steps

- Learn about creating connections between your cluster and a Git repository as a [configuration resource with Azure Arc-enabled Kubernetes](./conceptual-gitops-flux2.md).
- Learn more about [CI/CD workflow using GitOps](conceptual-gitops-ci-cd.md).
