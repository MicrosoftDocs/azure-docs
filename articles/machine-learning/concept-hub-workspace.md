---
title: 'What are hub workspaces?'
titleSuffix: Azure Machine Learning
description: Hubs provide a central way to govern security, connectivity, and compute resources for a team with multiple workspaces. Project workspaces that are created using a hub obtain the same security settings and shared resource access.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: deeikele
author: deeikele
ms.reviewer: larryfr
ms.date: 05/09/2024
monikerRange: 'azureml-api-2 || azureml-api-1'
#Customer intent: As an IT administrator, I want to understand the purpose of a hub workspace for Azure Machine Learning.
---


# What is an Azure Machine Learning hub workspace? (preview)

A hub is a kind of workspace that can be used by IT security to centrally manage security, connectivity, compute resources and quota for a team. Once setup, a hub enables developers to create their own workspaces to organize their work while staying compliant with IT setup requirements. Sharing and reuse of configurations through a hub workspace yields better cost efficiency when deploying Azure Machine Learning at scale.

Workspaces that are created using a hub, referred to as 'project workspaces', obtain the same security settings and shared resource access. They don't require their own security settings or Azure [associated resources](concept-workspace.md#associated-resources). Create as many project workspaces as you need to organize your work, isolate data, or restrict access. 

Create a hub workspace if you or your team are planning for multiple machine learning projects. Use a hub to organize your work in the same data or business domain.

![Diagram showing hub and project workspace relation](media/concept-hub-workspace/hub-workspace-relation.png)

## Fast, but secure, AI exploration without bottleneck on IT

Successfully building machine learning models often requires heavy prototyping as steppingstone for a full-scale implementation. It may be embodied to prove the feasibility of an idea, assess quality of data or a model, for a particular task.

In the transition from proving feasibility of an idea, to a funded project, many organizations encounter a bottleneck in productivity because a single platform team is responsible for the setup of cloud resources. Such a team may be the only one authorized to configure security, connectivity or other resources that may incur costs. This may cause a huge backlog, resulting in development teams getting blocked to start innovating with a new idea.

The goal of hubs is to take away this bottleneck, by letting IT set up a secure, pre-configured and reusable environment for a team to prototype, build and operate machine learning models.

## Interoperability between ML studio and AI studio

Hubs can be used as your team's collaboration environment for both ML studio and [AI studio](../ai-studio/what-is-ai-studio.md). Use ML Studio for training and operationalizing custom machine learning models. Use AI studio as experience for building and operating AI applications reponsibly.

| Workspace Kind | ML Studio | AI Studio |
| --- | --- | --- |
| Default | Supported | - |
| Hub | Supported | Supported |
| Project | Supported | Supported |

## Set up and secure a hub for your team

Create a hub workspace in [Azure Portal](how-to-manage-hub-workspace-portal.md), or using [Azure Resource Manager templates](how-to-manage-hub-workspace-template.md). You may customize networking, identity, encryption, monitoring or tags, to meet compliance with your organization’s requirements. 

Project workspaces that are created using a hub, obtain the hub’s security settings and shared resource configuration. This includes the following configurations:

| Configuration | Note |
| ---- | ---- |
| Network settings | One [managed virtual network](how-to-managed-network.md) is shared between hub and project workspaces. Create a single private link endpoint on the hub workspace, to access content in hub and project workspaces. |
| Encryption settings | Encryption settings pass down from hub to project. |
| Encryption storage resource | When bringing your customer-managed keys for encryption, hub and project workspaces share the same [managed resource group]() for storing encrypted service data. |
| Connections | Project workspaces can consume shared connections created on the hub. This feature is currently only supported in [AI studio]()  |
| Compute instance | Reuse a compute instance across all project workspaces associated to the same hub. |
| Compute quota | Any compute quota consumed by project workspaces are deducted from the hub workspace quota balance. |
| Storage | Project workspaces have designated containers starting with a prefix {workspaceGUID}, and conditioned [Azure Attribute Based Access] for the workspace identity. |
| Key vault | Project workspaces identities can only access their own secrets. |
| Container registry | Project workspaces images are isolated by naming convention, and can only access their own containers. |
| Application insights | One application insights may be configured as default for all project workspaces. Can be overridden on project workspace-level. |

Data that is uploaded in one project workspace, is stored in isolation from data that is uploaded to another project workspace. While project workspaces reuse hub security settings, they are still top-level Azure resources, which enable you to restrict access to only project members.

## Create a project workspace using a hub

Once a hub is created, there are multiple ways to create a project workspace using it:

1. [Using ML Studio](how-to-manage-workspace.md?view=azureml-api-2&tabs=mlstudio)
1. [Using AI Studio](../ai-studio/how-to/create-projects.md)
2. [Using Azure SDK](how-to-manage-workspace.md?view=azureml-api-2&tabs=python)
4. [Using automation templates](how-to-create-workspace-template.md)

![Create workspace using hub in ML studio](media/concept-hub-workspace/project-workspace-create.png)

## Default project resource group

To create project workspaces using a hub, users must have a role assignment on the hub workspace resource using a role that includes the **Microsoft.MachineLearningServices/workspaces/hubs/join/action** action. Azure AI developer role is an example built-in role that supports this action.

Optionally, when creating a hub as an administrator, you may specify a default project resource group to allow users to create project workspaces in a self-service manner. If this default resource group is set, users who use the SDK/CLI/Studio experience can create workspaces in this particular resource group without needing further Azure RBAC permissions on a resource group-scope. The creating user, will become an owner on the project workspace Azure resource. 

Project workspaces can be created in other resource groups than the default project resource group. For this, users need Microsoft.MachineLearning/Workspaces/write permissions.

## Supported capabilities by workspace kind

Features that are supported using hub/project workspaces differ from regular workspaces. The following support matrix provides an overview.

| Feature | Default workspace | Hub workspace | Project workspace | Note |
|--|--|--|--|--|
|Self-serve create project workspaces from Studio| - | X | X | - |
|Create shared connections on hub | |X|X| Only in AI studio |
|Consume shared connections from hub | |X|X| - |
|Reuse compute instance across workspaces|-|X|X|
|Share compute quota across workspaces|-|X|X||
|Build GenAI apps in AI studio|-|X|X||
|Single private link endpoint across workspaces|-|X|X||
|Managed virtual network|X|X|X|-|
|BYO virtual network|X|-|-|Use alternative [managed virtual network](how-to-managed-network.md)|
|Compute clusters|X|-|-|Use alternative [serverless compute](how-to-use-serverless-compute.md)|
|Parallel run step|X|-|-|-|

## Converting a regular workspace into a hub workspace

This is currently not supported.

## Next steps

To learn more about setting up Azure Machine Learning, see:

+ [Create and manage a workspace](how-to-manage-workspace.md)
+ [Get started with Azure Machine Learning](quickstart-create-resources.md)

To learn more about hub workspace support in AI Studio, see:

+ [How to configure a managed network for hubs](../ai-studio/how-to/configure-managed-network)
