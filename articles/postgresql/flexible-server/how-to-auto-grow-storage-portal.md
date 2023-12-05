---
title: Storage Auto-grow - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how you can configure storage autogrow using the Azure portal in Azure Database for PostgreSQL - Flexible Server
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.author: kabharati
author: kabharati

ms.date: 06/24/2022
---

# Storage Autogrow using  Azure portal in Azure Database for PostgreSQL - Flexible Server


[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]


This article describes how you can configure an Azure Database for PostgreSQL server storage to grow without impacting the workload.

For servers with more than 1 TiB of provisioned storage, the storage autogrow mechanism activates when the available space falls to less than 10% of the total capacity or 64 GiB of free space, whichever of the two values is smaller. Conversely, for servers with storage under 1 TB, this threshold is adjusted to 20% of the available free space or 64 GiB, depending on which of these values is smaller.

As an illustration, take a server with a storage capacity of 2 TiB ( greater than 1 TIB). In this case, the autogrow limit is set at 64 GiB. This choice is made because 64 GiB is the smaller value when compared to 10% of 2 TiB, which is roughly 204.8 GiB. In contrast, for a server with a storage size of 128 GiB (less than 1 TiB), the autogrow feature activates when there's only 25.8 GiB of space left. This activation is based on the 20% threshold of the total allocated storage (128 GiB), which is smaller than 64 GiB. 


## Enable storage auto-grow for existing servers

Follow these steps to enable Storage Autogrow on your Azure Database for PostgreSQL Flexible server.

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for PostgreSQL Flexible Server.

2. On the Flexible Server page, select **Compute + storage**

3. In the **Storage Auto-growth** section, checkmark to enable storage autogrow.

4. Select **Save** to apply the changes.

   ![Screenshot showing Storage Autogrowth.](./media/how-to-auto-grow-storage-portal/storage-auto-grow.png)


5. A notification confirms that auto grow was successfully enabled.

  
## Enable storage auto-grow during server provisioning

1. In the Azure portal, during server provisioning, under **Compute + storage** select  **Configure server** 

    ![Screenshot showing configure server during provisioning.](./media/how-to-auto-grow-storage-portal/create-server-storage-auto-grow.png)

2. In the **Storage Auto-growth** section, checkmark to enable storage auto grow. 

   ![Screenshot showing Storage Autogrowth during provisioning.](./media/how-to-auto-grow-storage-portal/server-provisioning-storage-auto-grow.png)

## Next steps


- Learn about [service limits](concepts-limits.md).
