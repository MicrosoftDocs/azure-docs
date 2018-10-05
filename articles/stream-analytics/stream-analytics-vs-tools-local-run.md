---
title: Test Azure Stream Analytics queries locally with Visual Studio
description: This article describes how to test queries locally with Azure Stream Analytics Tools for Visual Studio.
services: stream-analytics
author: su-jie
ms.author: sujie
manager: kfile
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/10/2018
---

# Test Stream Analytics queries locally with Visual Studio

You can use Azure Stream Analytics tools for Visual Studio to test your Stream Analytics jobs locally with sample data.

Use this [Quickstart](stream-analytics-quick-create-vs.md) to learn how to create a Stream Analytics job using Visual Studio.

## Test your query

In your Azure Stream Analytics project, double-click **Script.asaql** to open the script in the editor. You can compile the query to see if there are any syntax errors. The query editor supports IntelliSense, syntax coloring, and an error marker.

![Query editor](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-query-01.png)
 
### Add local input

To validate your query against local static data, right-click the input and select **Add local input**.
   
![Add local input](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-add-local-input-01.png)
   
In the pop-up window, select sample data from your local path and **Save**.
   
![Add local input](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-add-local-input-02.png)
   
A file named **local_EntryStream.json** is added automatically to your inputs folder.
   
![Local input folder file list](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-add-local-input-03.png)
   
Select **Run Locally** in the query editor. Or you can press F5.
   
![Run Locally](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-local-run-01.png)
   
The output can be viewed in a table format directly from Visual Studio.

![Output in table format](./media/stream-analytics-vs-tools-local-run/stream-analytics-for-vs-local-result.png)

You can find the output path from the console output. Press any key to open the result folder.
   
![Local run](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-local-run-02.png)
   
Check the results in the local folder.
   
![Local folder result](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-local-run-03.png)
   

### Sample input
You can also collect sample input data from your input sources to a local file. Right-click the input configuration file, and select **Sample Data**. 

![Sample Data](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-sample-data-01.png)

You can only sample data streaming from Event Hubs or IoT Hubs. Other input sources are not supported. In the pop-up dialog box, fill in the local path to save the sample data and select **Sample**.

![Sample data configuration](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-sample-data-02.png)
 
You can see the progress in the **Output** window. 

![Sample data output](./media/stream-analytics-vs-tools-local-run/stream-analytics-tools-for-vs-sample-data-03.png)

## Next steps

* [Use Visual Studio to view Azure Stream Analytics jobs](stream-analytics-vs-tools.md)
* [Quickstart: Create a Stream Analytics job using Visual Studio](stream-analytics-quick-create-vs.md)
* [Tutorial: Deploy an Azure Stream Analytics job with CI/CD using Azure DevOps](stream-analytics-tools-visual-studio-cicd-vsts.md)
* [Continuously integrate and develop with Stream Analytics tools](stream-analytics-tools-for-visual-studio-cicd.md)