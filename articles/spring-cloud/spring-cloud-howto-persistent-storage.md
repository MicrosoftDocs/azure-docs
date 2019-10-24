---
title: How to use persistent storage in Azure Spring Cloud | Microsoft Docs
description: How to use persistent storage in Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/07/2019
ms.author: jeconnoc

---

# How to use persistent storage in Azure Spring Cloud

Azure Spring Cloud provides two types of storage for your application:  persistent and temporary.  Azure Spring Cloud enables temporary storage by default for each application instance. Temporary storage is limited to 5GB and its default mount path is `/tmp`.

> [!WARNING]
> Restarting an application instance will delete its associated temporary storage permanently.

Persistent storage is a file share container managed by Azure that is allocated on a per application scope. Data stored in persistent storage is shared across all of the application's instances. An Azure Spring Cloud service instance can have a maximum of 10 applications with persistent disk enabled and each application is given 50GB of persistent storage. The default mount path for persistent storage is `/persistent`.

## Enable persistent storage using the Azure portal

1. In your Azure Spring Cloud service page, select **Application Dashboard**, then select the application that requires persistent storage.
1. In the **Overview** tab, locate the **Persistent Storage** attribute and select **Disabled**.
1. Click **Enable** to enable persistent storage, and select **OK** button to apply the change.

When persistent storage is enabled, its size and path are shown in the **Persistent Storage** attribute of the **Overview** page.

> [!WARNING]
> *Disabling* persistent storage will deallocate the storage for that application.  All data in that storage account will be lost. 

## Enable persistent storage using the Azure CLI

Create an app with persistent disk enabled:
 
```azurecli
az spring-cloud app create -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
```

Enable persistent storage in an existing app:

```azurecli
az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
```

Disable persistent storage in an existing app:

> [!WARNING]
> Disabling persistent storage will deallocate the storage for that application, permanently losing any data that was stored there. 

```azurecli
az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage false
```

## Next steps

Learn about [application and service quotas](spring-cloud-quotas.md), or learn how to [manually scale your application](spring-cloud-tutorial-scale-manual.md).