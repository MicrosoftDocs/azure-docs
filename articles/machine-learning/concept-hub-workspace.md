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

A hub is a kind of workspace that can be used by IT security to centrally manage security, connectivity and compute resources for a team. Once setup, they enable developers to create their own workspaces to organize their work, reuse compute resources across workspaces, and connect with shared company resources made available by the administrator.

Workspaces that are created using a hub, referred to as 'project workspaces', obtain the same security settings and shared resource access. They don't require their own security settings or Azure dependent resources. Create as many project workspaces as you need to organize your work, isolate data, or restrict access. 

Create a hub workspace if you or your team are planning for multiple machine learning projects. Use a hub to organize projects in the same data or business domain.

## Fast, but secure, AI exploration without bottleneck on IT

Successfully building AI applications or models often requires prototyping as a steppingstone towards project funding or a full-scale implementation. It may be embodied to prove the feasibility of an idea, assess quality of data or a model, for a particular task.

In the transition from proving feasibility of an idea, to a funded project, many organizations encounter a bottleneck in productivity because a single platform team is responsible for the setup of cloud resources. Such a team may be the only one authorized to configure security, connectivity or other resources that may incur costs. This may cause a huge backlog, resulting in development teams getting blocked on innovating with a new idea.

The goal of hubs is to take away this bottleneck, by letting IT set up a pre-configured, reusable, environment for a team to prototype, build and operate machine learning models.

## Interoperability for ML studio and AI studio

## Set up and secure a hub for your team

Create a hub workspace in [Azure Portal](), or using [Azure Resource Manager templates](). You may customize networking, identity, encryption, monitoring or tags, to meet compliance with your organization’s requirements. 

Project workspaces that are created using a hub, obtain the hub’s security settings and shared resource configuration. This includes the following configurations:

| Configuration | Note |
| ---- | ---- |
| Network settings | One managed virtual network is shared between hub and project workspaces. Create a private link endpoint on the hub workspace, to access both hub and project workspaces. |
| Encryption settings | Encryption settings pass down from hub to project. |
| Connections | Project workspaces can consume shared connections created on the hub. This feature is currently only supported in [AI studio]()  |
| Compute instance | Reuse a compute instance across all project workspaces associated to the same hub. |
| Compute quota | Any compute quota consumed by project workspaces are deducted from the hub workspace quota balance. |
| Storage | Project workspaces have designated containers starting with a prefix {workspaceGUID}, and conditioned [Azure Attribute Based Access] for the workspace identity. |
| Key vault | Project workspaces identities can only access their own secrets. |
| Container registry | Project workspaces images are isolated by naming convention, and can only access their own containers. |
| Application insights | One application insights may be configured as default for all project workspaces. Can be overridden on project workspace-level. |

Data that is uploaded in one project workspace, is stored in isolation from data that is uploaded to another project workspace. While project workspaces reuse hub security settings, they are still top-level Azure resources, which enable you to restrict access to only project members.

## Create a workspace using a hub

## Supported capabilities by workspace kind

## Converting a regular workspace into a hub workspace

This is currently not supported.

## Next steps

To learn more about setting up Azure Machine Learning, see:

+ [Create and manage a workspace](how-to-manage-workspace.md)
+ [Get started with Azure Machine Learning](quickstart-create-resources.md)
