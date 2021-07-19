---
title: Azure Arc validation test process
description: Learn about details required for the Azure Arc validation process to conform to the Arc-enabled Kubernetes, Data Services, and cluster extensions.
ms.date: 07/19/2021
ms.topic: overview
---

# Azure Arc external partner validation test process

This document provides an overview of the details required for Arc validated external partners (or new partners) to maintain compatibility with the latest updates of Arc-enabled Kubernetes, Arc-enabled Data Services, and the cluster extensions on top of Arc-enabled Kubernetes. It provides the instructions on how to setup the test environment, review the testing strategy, understand how and when to execute the tests, publish results, and resolve failures. The goal is to provide you with a single point of reference to continue testing on an ongoing basis.

## Background and terminology

The conformance tests for Arc-enabled Kubernetes, Data Services, and cluster extensions are orchestrated using [sonobuoy](https://github.com/vmware-tanzu/sonobuoy) (a free of charge open source software provided by VMWare). Sonobuoy executes the tests in a container running on a Kubernetes cluster. This allows sonobuoy plugins to directly run on validated partner environments to ensure that they are conformant with the Arc offerings.  

- Arc platform: Responsible for Arc onboarding K8s clusters, and providing the substrate to deploy Cluster Extensions and Arc for Data Services in directly connected mode.

- Cluster extensions: Other distinct Azure offerings such as Azure Monitor, Azure Defender, etc. packaged and deployed on an Arc connected cluster as extensions.

Conceptual information on the Arc platform and cluster extensions can be found [here](kubernetes/conceptual-agent-architecture.md). 

The Arc platform and each cluster extension has their own sonobuoy plugins responsible for installing the bits on the cluster, running tests, and cleaning up the resources created to leave the cluster in its original state. These plugins are meant to be black boxes for conformance testing in a bid to reduce as much partner effort as possible.

## Testing strategy

This section reviews the testing strategy, and how to run the tests is covered later. There are three components to the testing strategy – partner distro (M), Arc platform (N), and extensions (O). 

- New version **M** available for a partner distribution<sup>1</sup>: The partner team needs to run the tests on this new distribution version for the Arc platform from minor version **N** to **N-2**, with the latest version **O** of each extension on top.

- New version **N** available for the Arc platform: The partner team needs to run the tests for this new Arc platform version on **M** to **M-2** minor version of the distribution with the latest version **O** of each extension on top.

- New version **O** available for the extension: The partner team needs to run the tests on **M** to **M-2** minor version of the distro, with Arc platform minor version **N** to **N-2** with the latest version **O** of each extension on top.

| |Run tests against |K8 distro **M** to **M-2** |Arc platform **N** to **N-2** |All cluster extensions **O** |
|--|----------|----------|----------|----------|
|Updates to|||||
|Distro (M) |||X |X |
|Arc platform (M) ||X ||X |
|Cluster extension (O) ||X |X |X |

The sonobuoy plugins is configurable to pick specific versions of the platform and the extensions to support the testing strategy. 

For the second and third scenarios, communication is provided from Microsoft to partners to run the tests. For the first scenario, the partners need to inform Microsoft that a new version is available and run the tests for it. 

<sup>1</sup> A new version to the distro isn’t limited to the Kubernetes distribution itself in this context. If there’s an update to an OEM solution being consumed for a particular use case, then that also merits running the test matrix.

## Setting up the test environment

As an Arc validated partner, you’ll need to set up your respective test environment with your distro, any specific ISV/IHV/OEM offerings, etc. This setup can be done either on-premises or in Azure, depending on the feasibility of configuration (for instance, it may not be a trivial effort to set up an IHV offerings on Azure). Once your test cluster is setup, these are the prerequisites for running the tests.

1. Setu pthe KUBECONFIG environment variable as the path to your kubeconfig file.
1. Install [sonobuoy](https://github.com/vmware-tanzu/sonobuoy#installation). Run the latest version to ensure that it's correctly installed. We've tested the plugins with sonobuoy version 0.51.0.
1. Download and install [git](https://git-scm.com/downloads).
1. Verify your cluster meets the [network requirements](kubernetes/quickstart-connect-cluster?tabs=azure-cli.md#meet-network-requirements) for the Azure Arc agent to communicate with Azure.

## Running the tests

Arc validated partners are provided with a test suite to run the tests. This test suite exposes the environment variables as inputs to run the tests. You have to run the suite based on the above strategy. The test suite is maintained in a public repository and updated every time there’s an update to the underlying plugins.

## Publish test results

Each partner is provided with a storage account on Azure that includes a pre-created blob container. Sonobuoy allows the retrieval of test results as well as test logs, both of which are stored on the cluster. The following files need to be uploaded to the storage account in the given format: 

- **Logs file**: format should be `*.tar.gz`. This file should contain the logs and results of the test run (Retrieved by the test suite). 

- **Metadata file**: format should be `*.txt`. This file should contain all the infra details: 

   - Upstream K8s version 
   - K8s distro version 
   - Private cloud version (if applicable) 
   - Bare metal Node details (if applicable) 
   - OEM solution details (if applicable) 

The test suite takes the storage account details as well as the metadata file as inputs and automatically pushes the results to your storage account.

## Resolving failures

If tests for any sonobuoy plugin fails, the initial resolution is handled by Microsoft. If we find that the issue was on our side, we will push the required fix and ask you to repeat the testing process. If we find that the issue was with your distro, a fix needs to be pushed and the testing process repeated. Failure to have successful tests across the strategy will be called out as a limitation in the public documentation of the Arc validation program.

## Announcing new versions

As mentioned in the testing strategy section, the test matrix needs to be triggered when there’s an update to a partner offering or the Arc platform or a cluster extension.  

For updates to partner offerings, you needs to notify Microsoft that a new version is available. You should then leverage the test suite for running the tests for the Arc platform and extensions, and run the tests according to the strategy. You then should Microsoft. 

For updates to the Arc platform or cluster extension, Microsoft notifies you. Based on our testing recommendations, you run the tests according to the strategy and notify Microsoft.

## Next steps