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

Workspaces that are created using a hub, referred to as 'project workspaces', obtain the same security settings and shared resource access. They don't require their own security settings or Azure dependent resources. Create as many project workspaces as you need to organize your work, isolate data, or restrict access. Create a hub for a team that operates in the same data or business domain. 

## Fast, but secure, AI exploration without bottleneck on IT

Successfully building AI applications or models often requires prototyping as a steppingstone towards project funding or a full-scale implementation. It may be embodied to prove the feasibility of an idea, assess quality of data or a model, for a particular task.

In the transition from proving feasibility of an idea, to a funded project, many organizations encounter a bottleneck in productivity because a single platform team is responsible for the setup of cloud resources. Such a team may be the only one authorized to configure security, connectivity or other resources that may incur costs. This may cause a huge backlog, resulting in development teams getting blocked on innovating with a new idea.

The goal of hubs is to take away this bottleneck, by letting IT set up a pre-configured, reusable, environment for a team to prototype, build and operate AI applications.

## Set up and secure a hub for your team

## Create a workspace using a hub

## Supported capabilities by workspace kind

## Interoperability for ML studio and AI studio

## Converting a regular workspace into a hub workspace

This is currently not supported.

## Next steps

To learn more about setting up Azure Machine Learning, see:

+ [Create and manage a workspace](how-to-manage-workspace.md)
+ [Get started with Azure Machine Learning](quickstart-create-resources.md)
