---
title: Major Version Upgrade of a flexible server - Azure portal
description: This article describes how to perform major version upgrade in Azure Database for PostgreSQL Flexible Server through the Azure portal.
ms.author: kabharati
author: rajsell
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 02/13/2023
---

# Major Version Upgrade of a Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides a step-by-step procedure to perform Major Version Upgrade in a flexible server using Azure portal

> [!NOTE]  
> Major Version Upgrade action is irreversible. Please perform a Point-In-Time Recovery (PITR) of your production server and test the upgrade in the non-production environment.

## Follow these steps to upgrade your flexible server to the major version of your choice:



1. In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to upgrade.

2. Select **Overview** from the left pane, and then select **Upgrade**.
   
   :::image type="content" source="media/how-to-perform-major-version-upgrade-portal/upgrade-tab.png" alt-text="Diagram of Upgrade tab to perform in-place major version upgrade.":::


3. You see an option to select the major version of your choice, you have an option to skip versions to directly upgrade to higher versions. Choose the version and click **Upgrade** 

:::image type="content" source="media/how-to-perform-major-version-upgrade-portal/set-postgresql-version.png" alt-text="Diagram of PostgreSQL version to Upgrade."::: 


4. During upgrade, users have to wait for the process to complete. You can resume accessing the server once the server is back online.

:::image type="content" source="media/how-to-perform-major-version-upgrade-portal/deployment-progress.png" alt-text="Diagram of deployment progress for Major Version Upgrade.":::


5. Once the upgrade is successful,you can expand the Deployment details tab and click **Operation details** to see more information about upgrade process like duration, provisioning state etc.


:::image type="content" source="media/how-to-perform-major-version-upgrade-portal/deployment-success.png" alt-text="Diagram of successful deployment of for Major Version Upgrade.":::
 

6. You can click on the **Go to resource** tab to validate your upgrade. You notice that server name remained unchanged and PostgreSQL version upgraded to desired higher version with the latest minor version


:::image type="content" source="media/how-to-perform-major-version-upgrade-portal/upgrade-verification.png" alt-text="Diagram of Upgraded version to Flexible server after Major Version Upgrade.":::

## Next steps

- Learn about [business continuity](./concepts-business-continuity.md).
- Learn about [zone-redundant high availability](./concepts-high-availability.md).
- Learn about [backup and recovery](./concepts-backup-restore.md).
