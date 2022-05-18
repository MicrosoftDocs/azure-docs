---
title: How to use built-in persistent storage in Azure Spring Cloud | Microsoft Docs
description: How to use built-in persistent storage in Azure Spring Cloud
author: karlerickson
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/28/2021
ms.author: karler
ms.custom: devx-track-java, devx-track-azurecli
---

# Use built-in persistent storage in Azure Spring Cloud

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ❌ Enterprise tier

Azure Spring Cloud provides two types of built-in storage for your application: persistent and temporary.

By default, Azure Spring Cloud provides temporary storage for each application instance. Temporary storage is limited to 5 GB per instance with the default mount path /tmp.

> [!WARNING]
> If you restart an application instance, the associated temporary storage is permanently deleted.

Persistent storage is a file-share container managed by Azure and allocated per application. Data stored in persistent storage is shared by all instances of an application. An Azure Spring Cloud instance can have a maximum of 10 applications with persistent storage enabled. Each application is allocated 50 GB of persistent storage. The default mount path for persistent storage is /persistent.

> [!WARNING]
> If you disable an applications's persistent storage, all of that storage is deallocated and all of the stored data is lost.

## Enable or disable built-in persistent storage

You can modify the state of built-in persistent storage using the Azure portal or by using the Azure CLI.

#### [Portal](#tab/azure-portal)

## Enable or disable built-in persistent storage with the portal

The portal can be used to enable or disable built-in persistent storage.

1. From the **Home** page of your Azure portal, select **All Resources**.

    >![Locate the All Resources icon](media/portal-all-resources.jpg)

1. Select the Azure Spring Cloud resource that needs persistent storage. In this example, the selected application is called **upspring**.

    > ![Select your application](media/select-service.jpg)

1. Under the **Settings** heading, select **Apps**.

1. Your Azure Spring Cloud services appear in a table.  Select the service that you want to add persistent storage to. In this example, the **gateway** service is selected.

    > ![Select your service](media/select-gateway.jpg)

1. From the service's configuration page, select **Configuration**

1. Select the **Persistent Storage** tab and select **Enable** to turn on persistent storage, or select **Disable** to turn off persistent storage.

    > ![Enable persistent storage](media/enable-persistent-storage.jpg)

If persistent storage is enabled, its size and path are shown on the **Persistent Storage** tab.

#### [Azure CLI](#tab/azure-cli)
## Use the Azure CLI to enable or disable built-in persistent storage
If necessary, install the Spring Cloud extension for the Azure CLI using this command:

```azurecli
az extension add --name spring-cloud
```

Other operations:

* To create an app with built-in persistent storage enabled:

    ```azurecli
    az spring-cloud app create -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
    ```

* To enable built-in persistent storage for an existing app:

    ```azurecli
    az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
    ```

* To disable built-in persistent storage in an existing app:

    ```azurecli
    az spring-cloud app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage false
    ```

---

> [!WARNING]
> If you disable an applications's persistent storage, all of that storage is deallocated and all of the stored data is permanently lost.

## Next steps

* Learn about [application and service quotas](./quotas.md).
* Learn how to [manually scale your application](./how-to-scale-manual.md).
