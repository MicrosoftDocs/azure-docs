---
title: Environment Resource
description: Review Azure CycleCloud environments using Azure Resource Manager. Create or delete an environment for each cluster, use a preexisting environment, and more.
author: KimliW
ms.date: 04/01/2018
ms.author: adjohnso
---

# Environments

An **environment** in Azure CycleCloud is a set of resources created by an external source, such as an [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) deployment. ​You can create an environment that will pull in relevant properties from any resource that ARM supports, and integrate them with your cluster template. You can also set up dependencies between deployments and nodes that work in either direction.

## Create an Environment

When creating a cluster, create a set of resources using `environment`. You can reference your template using:

1. `TemplateURL`, i.e. `az://storage/container/arm/azure.deploy.json​`
2. `TemplatePath`, i.e. `arm/azure.deploy.json​`
3. `TemplateContents`, i.e. `${AzureDeployJsonContents}​`

Chain together environment creation by using the outputs from one environment as the input to the next. Environments are created the first time the cluster is started, and are not deleted until the cluster is deleted.

An example environment may look like this:

``` ini
[environment envname]​
Credentials = cloud​
Region = southcentralus​
TemplateURL = az://storage/container/arm/azure.deploy.json​
…​
[[node master]]​
SecurityGroups = ${envname.outputs.masterSG}​
```

> [!NOTE]
> `TemplatePath` is relative to your locker.

## Create or Delete an Environment for Each Cluster

```ini
[environment envname]​
TemplatePath = arm/azure.deploy.json​
```

## Use a Pre-Existing Environment

```ini
[environment envname]​
ManagedLifecycle = false​
Azure.ResourceGroup = preexisting-rg​
```

## Refer to an Environment Defined in Another CycleCloud Cluster

```ini
[environmentref envname]​
SourceClusterName = long-running-cluster​
```

In the three examples above, a `Cloud.Environment` will be created for the first two, but not for the last.​
