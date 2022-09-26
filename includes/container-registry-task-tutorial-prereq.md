---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 05/02/2019
ms.author: danlep
---
## Prerequisites

### Get sample code

This tutorial assumes you've already completed the steps in the [previous tutorial](../articles/container-registry/container-registry-tutorial-quick-task.md), and have forked and cloned the sample repository. If you haven't already done so, complete the steps in the [Prerequisites](../articles/container-registry/container-registry-tutorial-quick-task.md#prerequisites) section of the previous tutorial before proceeding.

### Container registry

You must have an Azure container registry in your Azure subscription to complete this tutorial. If you need a registry, see the [previous tutorial](../articles/container-registry/container-registry-tutorial-quick-task.md), or [Quickstart: Create a container registry using the Azure CLI](../articles/container-registry/container-registry-get-started-azure-cli.md).

### Create a GitHub personal access token

To trigger a task on a commit to a Git repository, ACR Tasks need a [personal access token (PAT)](../articles/container-registry/container-registry-tasks-overview.md#personal-access-token) to access the repository. If you do not already have a PAT, follow these steps to generate one in GitHub:

1. Navigate to the PAT creation page on GitHub at https://github.com/settings/tokens/new
1. Enter a short **description** for the token, for example, "ACR Tasks Demo"
1. Select scopes for ACR to access the repo. To access a public repo as in this tutorial, under **repo**, enable **repo:status** and **public_repo**

   ![Screenshot of the Personal Access Token generation page in GitHub][build-task-01-new-token]

   > [!NOTE]
   > To generate a PAT to access a *private* repo, select the scope for full **repo** control.

1. Select the **Generate token** button (you may be asked to confirm your password)
1. Copy and save the generated token in a **secure location** (you use this token when you define a task in the following section)

   ![Screenshot of the generated Personal Access Token in GitHub][build-task-02-generated-token]

<!-- Images -->
[build-task-01-new-token]: ./media/container-registry-task-tutorial-prereq/build-task-01-new-token.png
[build-task-02-generated-token]: ./media/container-registry-task-tutorial-prereq/build-task-02-generated-token.png
