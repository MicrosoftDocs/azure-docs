---
title: Power Query Activity in Azure Data Factory 
description: Learn how to use the Power Query activity for data wrangling features in a Data Factory pipeline
services: data-factory
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/18/2021
---

# Power query activity in data factory

The Power Query activity allows you to build and execute Power Query mash-ups to execute data wrangling at scale in a Data Factory pipeline. You can create a new Power Query mash-up from the New resources menu option or by adding a Power Activity to your pipeline.

![Screenshot that shows Power Query in the factory resources pane.](media/data-flow/power-query-wrangling.png)

Previously, data wrangling in ADF was authored from the Data Flow menu option. This has been changed to authoring from a new Power Query activity. You can work directly inside of the Power Query mash-up editor to perform interactive data exploration and then save your work. Once complete, you can take your Power Query activity and add it to a pipeline. ADF will automatically scale it out and operationalize your data wrangling using ADF's data flow Spark environment.

## Translation to data flow script

To achieve scale with your Power Query activity, ADF translates your ```M``` script into a data flow script so that you can execute your Power Query at scale using the ADF data flow Spark environment. Author your wrangling data flow using code-free data preparation. For the list of available functions, see [transformation functions](wrangling-functions.md).

## Next steps

Learn more about data wrangling concepts using [Power Query in ADF](wrangling-tutorial.md)
