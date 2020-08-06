---
title: Deploy a Data Controller and SQL Managed Instance using Kubernetes tools
description: Deploy a Data Controller and SQL Managed Instance using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Deploy a Data Controller and SQL Managed Instance using Kubernetes tools

Starting with the July 2020 "new version" you can deploy a data controller and SQL managed instance and PostgreSQL Hyperscale instances using Kubernetes native tools like kubectl or oc.  You can do this by creating standard Kubernetes yaml files and applying them to the cluster.  You can edit or delete these objects too.  This is made possible by three new custom resource definitions - one for the data controller, one for SQL managed instance, and one for PostgreSQL Hyperscale.

Two notebooks are provided guide you through the experience of deploying the data controller, then a SQL managed instance using nothing but some .yaml files and kubectl.

- [Deploy data controller with kubectl and yaml files](/notebooks/Evaluation/deploy-data-controller.ipynb)
- [Deploy SQL managed instance with kubectl and yaml files](/notebooks/Evaluation/deploy-sql-mi.ipynb)

If you want to connect your Kubernetes cluster to Azure using Azure Arc enabled Kubernetes, you can also deploy a data controller or SQL managed instance/PostgreSQL instance using the 'GitOps' pattern.  In this pattern you create a configuration policy for your Kubernetes cluster which configures a Flux operator to monitor a git repository.  When yaml files or helm charts are added or updated on that git repository they will be picked up by the Flux operator and applied to the Kubernetes cluster.  By deploying Azure Arc enabled Kubernetes and these policies across many Kubernetes clusters you can enforce desired configuration and deploy applications/updates at scale using policy and git.

Another notebook has been created to walk you through the experience of how to set up Azure Arc enabled Kubernetes and configure it to monitor a git repository that contains a sample SQL managed instance yaml file.  When everything is connected up, a new SQL managed instance will be deployed to your Kubernetes cluster.

- [Deploy a SQL managed instance using Azure Arc enabled Kubernetes and Flux](/notebooks/Evaluation/deploy-sql-mi-through-gitops.ipynb)
