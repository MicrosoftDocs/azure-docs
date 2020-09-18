---
title: Deploy a Data Controller and SQL Managed Instance using Kubernetes tools
description: Deploy a Data Controller and SQL Managed Instance using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Deploy a Data Controller and SQL Managed Instance using Kubernetes tools

You can deploy a data controller, SQL Managed Instance, and PostgreSQL Hyperscale instances using Kubernetes native tools like `kubectl` or `oc`. 

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Steps

To deploy with native tools:

1. Create standard Kubernetes yaml files.
2. Use `kubectl` or `oc` to apply them to the cluster. 

You can also use Kubernetes native tools to edit or delete these objects too.

Azure Arc data services provides custom resource definitions - one for the data controller, one for SQL Managed Instance, and one for PostgreSQL Hyperscale to enable this feature..

## Notebook scenarios

The Azure Arc samples repository in [GitHub]((https://github.com/microsoft/azure_arc) provides notebooks to guide you through the experience of deploying the data controller, then a SQL Managed Instance using nothing but some .yaml files and `kubectl`.

If you want to connect your Kubernetes cluster to Azure using Azure Arc enabled Kubernetes, you can also deploy a data controller or SQL Managed Instance/PostgreSQL instance using the 'GitOps' pattern.  In this pattern, you create a configuration policy for your Kubernetes cluster that configures a Flux operator to monitor a git repository. When yaml files or helm charts are added or updated on that git repository, they will be picked up by the Flux operator and applied to the Kubernetes cluster.  By deploying Azure Arc enabled Kubernetes and these policies across many Kubernetes clusters, you can enforce desired configuration and deploy applications and updates at scale using policy and git.

Another notebook has been created to walk you through the experience of how to set up Azure Arc enabled Kubernetes and configure it to monitor a git repository that contains a sample SQL Managed Instance yaml file. When everything is connected, a new SQL Managed Instance will be deployed to your Kubernetes cluster.

## Next steps

See the **Deploy a SQL Managed Instance using Azure Arc enabled Kubernetes and Flux** notebook in the .