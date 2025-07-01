---
title: Environment Resource
description: Review Azure CycleCloud environments using Azure Resource Manager. Create or delete an environment for each cluster, use a preexisting environment, and more.
author: KimliW
ms.date: 07/01/2025
ms.author: adjohnso
---

# Environments

An **environment** in Azure CycleCloud is a set of resources created by an external source, such as an [Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview) deployment. ​You can create an environment that pulls in relevant properties from any resource that ARM supports and integrates them with your cluster template. You can also set up dependencies between deployments and nodes that work in either direction.

## Create an environment

When you create a cluster, create a set of resources with `environment`. You can reference your template with:

1. `TemplateURL`, such as `az://storage/container/arm/azure.deploy.json​`
1. `TemplatePath`, such as `arm/azure.deploy.json​`
1. `TemplateContents`, such as `${AzureDeployJsonContents}​`

Chain environment creation together by using the outputs from one environment as the input for the next. The cluster creates environments the first time it starts. The cluster deletes environments when it deletes the cluster.

An example environment might look like this code block:

``` ini
[environment envname]​
Credentials = cloud​
Region = southcentralus​
TemplateURL = az://storage/container/arm/azure.deploy.json​
…​
[[node scheduler]]​
SecurityGroups = ${envname.outputs.schedulerSG}​
```

> [!NOTE]
> Your `TemplatePath` is relative to your locker.

## Create or delete an environment for each cluster

```ini
[environment envname]​
TemplatePath = arm/azure.deploy.json​
```

## Use a pre-existing environment

```ini
[environment envname]​
ManagedLifecycle = false​
Azure.ResourceGroup = preexisting-rg​
```

## Refer to an environment defined in another CycleCloud cluster

```ini
[environmentref envname]​
SourceClusterName = long-running-cluster​
```

In the preceding examples, the first two create a `Cloud.Environment`, but the last example doesn't.
