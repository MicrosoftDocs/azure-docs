---
title: How to use persistent storage in Azure Spring Cloud | Microsoft Docs
description: How to use persistent storage in Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---

# How to use persistent storage in Azure Spring Cloud

Persisted data storage is an essential part of some applications. Azure Spring Cloud has convenient and simple options: persistent storage and temporary storage.

## Temporary Storage

Temporary storage is enabled by default with for each Azure Spring Cloud application instance. Temporary storage is limited to 5GB. Its default mount path is `/tmp`.

> [!WARNING]
> Restarting an application instance will delete its associated temporary storage permanently.

## Persistent Storage

Persistent storage is a file share container managed by Azure that is allocated on a per application scope. All the data is shared across all of a given application's instances. An Azure Spring Cloud service instance can have a maximum of 10 applications with persistent disk enabled and each application is given 50GB of persistent storage.The default mount path for persistent storage is `/persistent`.

### How to enable persistent storage

#### Using the Azure portal

1. Go to your Azure Spring Cloud service page in the Azure portal and click **Application Dashboard**. Then click the application you want to enable persistent storage for.
1. In the **Overview** tab, locate the **Persistent Storage** attribute and click on the **Disabled** hyperlinked text.
1. Click **Enable** to enable persistent storage, and click the **OK** button to apply this change.
> [!WARNING]
> *Disabling* persistent storage will deallocate the storage for that application, permanently losing any data that was stored there. 
1. When persistent storage is enabled, its size and path are shown in **Persistent Storage** attribute of the **Overview** page.

#### Using the Azure CLI

1. Create an app with persistent disk enabled:
```
az spring-cloud app create -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
```
2. Enable persistent storage in an existing app:
```
az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
```
3. Disable persistent storage in an existing app:
> [!WARNING]
> Disabling persistent storage will deallocate the storage for that application, permanently losing any data that was stored there. 

```
az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage false
```