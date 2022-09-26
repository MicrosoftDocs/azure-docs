---
title: include file
description: include file
services: container-instances
author: tomvcassidy

ms.service: container-instances
ms.topic: include
ms.date: 06/14/2022
ms.author: tomcassidy
ms.custom: include file
---

## Create Azure context

To use Docker commands to run containers in Azure Container Instances, first log into Azure:

```bash
docker login azure
```

When prompted, enter or select your Azure credentials.


Create an ACI context by running `docker context create aci`. This context associates Docker with an Azure subscription and resource group so you can create and manage container instances. For example, to create a context called *myacicontext*:

```
docker context create aci myacicontext
```

When prompted, select your Azure subscription ID, then select an existing resource group or **create a new resource group**. If you choose a new resource group, it's created with a system-generated name. Azure container instances, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.


Run `docker context ls` to confirm that you added the ACI context to your Docker contexts:

```
docker context ls
```