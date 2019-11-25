---
title: How to use persistent storage in Azure Spring Cloud | Microsoft Docs
description: How to use persistent storage in Azure Spring Cloud
author: jpconnock
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/07/2019
ms.author: jeconnoc

---

# How to use persistent storage in Azure Spring Cloud

Azure Spring Cloud provides two types of storage for your application: persistent and temporary.

By default, Azure Spring Cloud provides temporary storage for each application instance. Temporary storage is limited to 5 GB per instance with the default mount path `/tmp`.

> [!WARNING]
> If you restart an application instance, the associated temporary storage is permanently deleted.

Persistent storage is a file-share container managed by Azure and allocated per application. Data stored in persistent storage is shared by all of an application's instances. An Azure Spring Cloud  instance can have a maximum of 10 applications with persistent disk enabled. Each application is allocated 50 GB of persistent storage. The default mount path for persistent storage is `/persistent`.

> [!WARNING]
> If you disable an applications's persistent storage, all of that storage is deallocated and all data that was stored there is lost.

## Enable persistent storage using the Azure portal

1. From the **Home** page of your Azure portal, select **All Resources**.

    >![Locate the All Resources icon](media/portal-all-resources.jpg)

1. Select the Azure Spring Cloud resource that needs persistent storage. In this example, **jpspring** is selected.

    > ![Locate your application](media/select-service.jpg)

1. Under the **Settings** heading, select **Apps**.

1. The Spring Cloud services appear in a table.  Select the service to which you want to add persistent storage. In this example, the **gateway** service is selected.

    > ![Select your service](media/select-gateway.jpg)

1. From the service's configuration pane, select **Configuration**

1. Select the **Persistent Storage** tab and enable persistent storage.

    > ![Enable persistent storage](media/enable-persistent-storage.jpg)

After persistent storage is enabled, its size and path are shown on the configuration pane.

## Use the Azure CLI to modify persistent storage

If necessary, install the Azure Spring Cloud extension for Azure CLI:

```azurecli
az extension add --name spring-cloud
```

Create an app with persistent disk enabled:

```azurecli
az spring-cloud app create -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
```

Enable persistent storage for an existing app:

```azurecli
az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
```

Disable persistent storage in an existing app:

> [!WARNING]
> If you disable an applications's persistent storage, all of that storage is deallocated and all data that was stored there is permanently lost.

```azurecli
az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage false
```

## Next steps

* Learn about [application and service quotas](spring-cloud-quotas.md).
* Learn how to [manually scale your application](spring-cloud-tutorial-scale-manual.md).
