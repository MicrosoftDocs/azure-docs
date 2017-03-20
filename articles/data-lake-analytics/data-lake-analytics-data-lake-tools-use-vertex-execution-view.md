---
title: Use the Vertex Execution View in Data Lake Tools for Visual Studio | Microsoft Docs
description: Learn how to use the Vertex Execution View to exam Data Lake Analytics jobs.
services: data-lake-analytics
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: 5366d852-e7d6-44cf-a88c-e9f52f15f7df
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/13/2016
ms.author: jgao

---
# Use the Vertex Execution View in Data Lake Tools for Visual Studio
Learn how to use the Vertex Execution View to exam Data Lake Analytics jobs.

## Prerequisites
* Some basic knowledge of using Data Lake Tools for Visual Studio to develop U-SQL script.  See [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).

## Open the Vertex Execution View
For a certain job, you can click the “Vertex Execution View” link in the bottom left corner. You might be prompted to load profiles first and it can take some time depending on your network connectivity.

![Data Lake Analytics Tools Vertex Execution View](./media/data-lake-analytics-data-lake-tools-use-vertex-execution-view/data-lake-tools-open-vertex-execution-view.png)

## Understand Vertex Execution View
After entering the Vertex Execution View, there are three parts:

![Data Lake Analytics Tools Vertex Execution View](./media/data-lake-analytics-data-lake-tools-use-vertex-execution-view/data-lake-tools-vertex-execution-view.png)

* Vertex selector: On the left is the Vertex selector.  You can select the vertices by features (such as top 10 data read, or choose by stage).
  
    One of the most common used filters is the vertices on critical path. Critical path is the longest path of a U-SQL job. It is useful for optimizing your jobs by checking which vertex takes the longest time.
* The top center pane:
  
    ![Data Lake Analytics Tools Vertex Execution View](./media/data-lake-analytics-data-lake-tools-use-vertex-execution-view/data-lake-tools-vertex-execution-view-pane2.png)
  
    This view also shows the running status of all the vertices. It converts the time accordingly to your local machine, and shows different status in different colors.
* The bottom center pane:
  
    ![Data Lake Analytics Tools Vertex Execution View](./media/data-lake-analytics-data-lake-tools-use-vertex-execution-view/data-lake-tools-vertex-execution-view-pane3.png)
  
  * Process Name: The name of the vertex instance. It is composed of different parts in StageName|VertexName|VertexRunInstance. For example, the SV7_Split[62].v1 vertex stands for the second running instance (.v1, index starting from 0) of Vertex number 62 in Stage SV7_Split.
  * Total Data Read/Written: The data was read/written by this vertex.
  * State/Exit Status: The final status when the vertex is ended.
  * Exit Code/Failure Type: The error when the vertex failed.
  * Creation Reason: Why the vertex was created.
  * Resource Latency/Process Latency/PN Queue Latency: the time taken for the vertex to wait for resources, to process data, and to stay in the queue.
  * Process/Creator GUID: GUID for the current running vertex or its creator.
  * Version: the N-th instance of the running vertex (the system might schedule new instances of a vertex for many reasons, for example failover, compute redundancy, etc.)
  * Version Created Time.
  * Process Create Start Time/Process Queued Time/Process Start Time/Process Complete Time: when the vertex process starts creation; when the vertex process starts to queue; when the certain vertex process starts; when the certain vertex is completed.

## Next steps
* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To view job details, see [Use Job Browser and Job View for Azure Data lake Analytics jobs](data-lake-analytics-data-lake-tools-view-jobs.md)
* To learn Data Lake Tools for Visual Studio code, see [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md).
