---
title: Manage compute power in Azure SQL Data Warehouse (Azure portal) | Microsoft Docs
description: Azure portal tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
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
ms.author: elbutter;barbkess

---
# Manage compute power in Azure SQL Data Warehouse (Azure portal)
Scale compute resources in Azure SQL Data Warehouse by using the Azure portal.

## Scale compute power
[!INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change compute resources:

1. Open the [Azure portal][Azure portal], open your database, and click **Scale**.

    ![Click Scale][1]
2. In the Scale blade, move the slider left or right to change the DWU setting.

    ![Move Slider][2]
3. Click **Save**. A confirmation message appears. Click **yes** to confirm or **no** to cancel.

    ![Click Save][3]


## Next steps
For more information, see [Management overview][Management overview].

<!--Image references-->
[1]: ./media/sql-data-warehouse-manage-compute-portal/click-scale.png
[2]: ./media/sql-data-warehouse-manage-compute-portal/move-slider.png
[3]: ./media/sql-data-warehouse-manage-compute-portal/click-save.png


<!--Article references-->
[Management overview]: ./sql-data-warehouse-overview-manage.md
[Manage compute overview]: ./sql-data-warehouse-manage-compute-overview.md

<!--MSDN references-->


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/
