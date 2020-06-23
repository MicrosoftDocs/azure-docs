---
title: Recover a deleted dashboard in the Azure portal | Microsoft Docs
description: If you delete a published dashboard in the Azure portal, you can recover the dashboard.
services: azure-portal
author: mgblythe
ms.author: mblythe
ms.date: 01/21/2020
ms.topic: troubleshooting

ms.service: azure-portal
manager:  mtillman
---

# Recover a deleted dashboard in the Azure portal

If you're in the public Azure cloud, and you delete a _published_ dashboard in the Azure portal, you can recover that dashboard within 14 days of the delete. If you're in an Azure government cloud or the dashboard isn't published, you cannot recover it, and you must rebuild it. For more information about publishing a dashboard, see [Publish dashboard](azure-portal-dashboard-share-access.md#publish-dashboard). Follow these steps to recover a published dashboard:

1. From the Azure portal menu, select **Resource groups**, then select the resource group where you published the dashboard (by default, it's named **dashboards**).

1. Under **Activity log**, expand the **Delete Dashboard** operation. Select the **Change history** tab, then select **\<deleted resource\>**.

    ![Screenshot of change history tab](media/recover-shared-deleted-dashboard/change-history-tab.png)

1. Select and copy the contents of the left pane, then save to a text file with a _.json_ file extension. The portal uses the JSON file to re-create the dashboard.

    ![Screenshot of change history diff](media/recover-shared-deleted-dashboard/change-history-diff.png)

1. From the Azure portal menu, select **Dashboards**, then select **Upload**.

    ![Screenshot of dashboard upload](media/recover-shared-deleted-dashboard/dashboard-upload.png)

1. Select the JSON file you saved. The portal re-creates the dashboard with the same name and elements as the deleted dashboard.

1. Select **Share** to publish the dashboard and re-establish the appropriate access control.

    ![Screenshot of dashboard share](media/recover-shared-deleted-dashboard/dashboard-share.png)
