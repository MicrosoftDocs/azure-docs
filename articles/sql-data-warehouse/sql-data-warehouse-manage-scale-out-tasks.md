<properties
   pageTitle="Pause, resume, and scale-out compute resourcesin Azure SQL Data Warehouse | Microsoft Azure"
   description="Tasks to scale out and scale back compute resources in Azure SQL Data Warehouse by using the Azure portal. See how to pause (suspend) or resume a database and how to increase or decrease the DWU setting for the database."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="04/21/2016"
   ms.author="barbkess;sonyama"/>

# Pause, resume, and scale out compute resources in Azure SQL Data Warehouse

> [AZURE.SELECTOR]
- [Azure portal](sql-data-warehouse-manage-scale-out-tasks.md)
- [PowerShell](sql-data-warehouse-manage-scale-out-tasks-powershell.md)


Elastically scale out compute resources and memory to meet the changing demands of your workload, and save costs by scaling back resources during non-peak times. 

This collection of tasks uses the Azure portal to:

- Pause compute resources
- Resume compute resources
- Change compute resources by adjusting DWUs


## Task #1: Pause compute

[AZURE.INCLUDE [SQL Data Warehouse pause description](../../includes/sql-data-warehouse-pause-description.md)]

To pause a database:

1. Open the [Azure portal][] and open your database. Notice that the Status is **Online**. 

    ![Online status][6]

1. To suspend compute and memory resources, click **Pause**, and then a confirmation message will appear. Click **yes** to confirm or **no** to cancel.

    ![Confirm pause][7]

1. While SQL Data Warehouse is starting the database the status will be **Pausing".
2. When the status is **Paused**, the pause operation is done and you are no longer being charged for DWUs.

    ![Pause status][4]

## Task #2: Resume compute

[AZURE.INCLUDE [SQL Data Warehouse resume description](../../includes/sql-data-warehouse-resume-description.md)]
To resume a database:

1. Open the [Azure portal][] and open your database. Notice that the Status is **Paused**. 

    ![Pause database][4]

1. To resume the database click **Start**, and then a confirmation message will appear. Click **yes** to confirm or **no** to cancel.

    ![Confirm resume][5]

1. While SQL Data Warehouse is starting the database the status will be "Resuming".
2. When the status is **online** the database is ready.

    ![Online status][6]

## Task #3: Scale DWUs

[AZURE.INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change compute resources:

1. Open the [Azure portal][], open your database, and click **Scale**.

    ![Click Scale][1]

1. In the Scale blade, move the slider left or right to change the DWU setting.

    ![Move Slider][2]

1. Click **Save**. A confirmation message will appear. Click **yes** to confirm or **no** to cancel.

    ![Click Save][3]



## Next steps
For more information, see [Management overview][].

<!--Image references-->
[1]: ./media/sql-data-warehouse-manage-scale-out-tasks/click-scale.png
[2]: ./media/sql-data-warehouse-manage-scale-out-tasks/move-slider.png
[3]: ./media/sql-data-warehouse-manage-scale-out-tasks/click-save.png
[4]: ./media/sql-data-warehouse-manage-scale-out-tasks/resume-database.png
[5]: ./media/sql-data-warehouse-manage-scale-out-tasks/resume-confirm.png
[6]: ./media/sql-data-warehouse-manage-scale-out-tasks/pause-database.png
[7]: ./media/sql-data-warehouse-manage-scale-out-tasks/pause-confirm.png

<!--Article references-->
[Management overview]: ./sql-data-warehouse-overview-manage.md

<!--MSDN references-->


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/
