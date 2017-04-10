---
title: Manage compute power in Azure SQL Data Warehouse (Azure portal) | Microsoft Docs
description: Azure portal tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs.
services: sql-data-warehouse
documentationcenter: NA
author: barbkess
manager: jhubbard
editor: ''

ms.assetid: 233b0da5-4abd-4d1d-9586-4ccc5f50b071
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: manage
ms.date: 10/31/2016
ms.author: barbkess

---
# Manage compute power in Azure SQL Data Warehouse (Azure portal)
> [!div class="op_single_selector"]
> * [Overview](sql-data-warehouse-manage-compute-overview.md)
> * [Portal](sql-data-warehouse-manage-compute-portal.md)
> * [PowerShell](sql-data-warehouse-manage-compute-powershell.md)
> * [REST](sql-data-warehouse-manage-compute-rest-api.md)
> * [TSQL](sql-data-warehouse-manage-compute-tsql.md)
>
>


## Scale compute power
[!INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change compute resources:

1. Open the [Azure portal][Azure portal], open your database, and click **Scale**.

    ![Click Scale][1]
2. In the Scale blade, move the slider left or right to change the DWU setting.

    ![Move Slider][2]
3. Click **Save**. A confirmation message appears. Click **yes** to confirm or **no** to cancel.

    ![Click Save][3]

<a name="pause-compute-bk"></a>

## Pause compute
[!INCLUDE [SQL Data Warehouse pause description](../../includes/sql-data-warehouse-pause-description.md)]

To pause a database:

1. Open the [Azure portal][Azure portal] and open your database. Notice that the Status is **Online**.

    ![Online status][6]
2. To suspend compute and memory resources, click **Pause**, and then a confirmation message appears. Click **yes** to confirm or **no** to cancel.

    ![Confirm pause][7]
3. While SQL Data Warehouse is starting the database, the status is **Pausing**.
4. When the status is **Paused**, the pause operation is done and you are no longer being charged for DWUs.

    ![Pause status][4]

<a name="resume-compute-bk"></a>

## Resume compute
[!INCLUDE [SQL Data Warehouse resume description](../../includes/sql-data-warehouse-resume-description.md)]

To resume a database:

1. Open the [Azure portal][Azure portal] and open your database. Notice that the Status is **Paused**.

    ![Pause database][4]
2. To resume the database click **Start**, and then a confirmation message appears. Click **yes** to confirm or **no** to cancel.

    ![Confirm resume][5]
3. While SQL Data Warehouse is starting the database, the status is "Resuming".
4. When the status is **online**, the database is ready.

    ![Online status][6]

<a name="next-steps-bk"></a>

## Next steps
For more information, see [Management overview][Management overview].

<!--Image references-->
[1]: ./media/sql-data-warehouse-manage-compute-portal/click-scale.png
[2]: ./media/sql-data-warehouse-manage-compute-portal/move-slider.png
[3]: ./media/sql-data-warehouse-manage-compute-portal/click-save.png
[4]: ./media/sql-data-warehouse-manage-compute-portal/resume-database.png
[5]: ./media/sql-data-warehouse-manage-compute-portal/resume-confirm.png
[6]: ./media/sql-data-warehouse-manage-compute-portal/pause-database.png
[7]: ./media/sql-data-warehouse-manage-compute-portal/pause-confirm.png

<!--Article references-->
[Management overview]: ./sql-data-warehouse-overview-manage.md
[Manage compute overview]: ./sql-data-warehouse-manage-compute-overview.md

<!--MSDN references-->


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/
