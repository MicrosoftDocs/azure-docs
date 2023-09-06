---
title: Use built-in persistent storage in Azure Spring Apps | Microsoft Docs
description: Learn how to use built-in persistent storage in Azure Spring Apps
author: KarlErickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 10/28/2021
ms.author: karler
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022, engagement-fy23
---

# Use built-in persistent storage in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ❌ Enterprise

Azure Spring Apps provides two types of built-in storage for your application: persistent and temporary.

By default, Azure Spring Apps provides temporary storage for each application instance. Temporary storage is limited to 5 GB per instance with */tmp* as the default mount path.

> [!WARNING]
> If you restart an application instance, the associated temporary storage is permanently deleted.

Persistent storage is a file-share container managed by Azure and allocated per application. All instances of an application share data stored in persistent storage. An Azure Spring Apps instance can have a maximum of 10 applications with persistent storage enabled. Each application is allocated 50 GB of persistent storage. The default mount path for persistent storage is */persistent*.

## Enable or disable built-in persistent storage

You can enable or disable built-in persistent storage using the Azure portal or Azure CLI.

#### [Portal](#tab/azure-portal)

Use the following steps to enable or disable built-in persistent storage using the Azure portal.

1. Go to your Azure Spring Apps instance in the Azure portal.

1. Select **Apps** to view apps for your service instance, and then select an app to display the app's **Overview** page.

   :::image type="content" source="media/how-to-built-in-persistent-storage/app-selected.png" lightbox="media/how-to-built-in-persistent-storage/app-selected.png" alt-text="Screenshot of Azure portal showing the Apps page.":::

1. On the **Overview** page, select **Configuration**.

   :::image type="content" source="media/how-to-built-in-persistent-storage/select-configuration.png" lightbox="media/how-to-built-in-persistent-storage/select-configuration.png" alt-text="Screenshot of Azure portal showing details for an app.":::

1. On the **Configuration** page, select **Persistent Storage**.

   :::image type="content" source="media/how-to-built-in-persistent-storage/select-persistent-storage.png" lightbox="media/how-to-built-in-persistent-storage/select-persistent-storage.png" alt-text="Screenshot of Azure portal showing the Configuration page.":::

1. On the **Persistent Storage** tab, select **Enable** to enable persistent storage, or **Disable** to disable persistent storage.

   :::image type="content" source="media/how-to-built-in-persistent-storage/enable-persistent-storage.png" lightbox="media/how-to-built-in-persistent-storage/enable-persistent-storage.png" alt-text="Screenshot of Azure portal showing the Persistent Storage tab.":::

If persistent storage is enabled, the **Persistent Storage** tab displays the storage size and path.

#### [Azure CLI](#tab/azure-cli)

If necessary, install the Azure Spring Apps extension for the Azure CLI using this command:

```azurecli
az extension add --name spring
```

Other operations:

- To create an app with built-in persistent storage enabled:

  ```azurecli
  az spring app create -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
  ```

- To enable built-in persistent storage for an existing app:

  ```azurecli
  az spring app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage true
  ```

- To disable built-in persistent storage in an existing app:

  ```azurecli
  az spring app update -n <app> -g <resource-group> -s <service-name> --enable-persistent-storage false
  ```

---

> [!WARNING]
> If you disable an application's persistent storage, all of that storage is deallocated and all of the stored data is permanently lost.

## Next steps

- [Quotas and service plans for Azure Spring Apps](./quotas.md)
- [Scale an application in Azure Spring Apps](./how-to-scale-manual.md)
