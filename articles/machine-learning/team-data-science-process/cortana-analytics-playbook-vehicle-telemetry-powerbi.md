---
title: Power BI dashboard for vehicle health and driving habits - Azure | Microsoft Docs
description: Use the capabilities of Cortana Intelligence to gain real-time and predictive insights on vehicle health and driving habits.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: aaeb29a5-4a13-4eab-bbf1-885690d86c56
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/14/2018
ms.author: bradsev

---
# Vehicle Telemetry Analytics Solution Template Power BI dashboard setup instructions
This menu links to the chapters in this playbook: 

[!INCLUDE [cap-vehicle-telemetry-playbook-selector](../../../includes/cap-vehicle-telemetry-playbook-selector.md)]

The Vehicle Telemetry Analytics Solution showcases how car dealerships, automobile manufacturers, and insurance companies are able use the capabilities of Cortana Intelligence. They can obtain real-time and predictive insights on vehicle health and driving habits to improve customer experience, research and development, and marketing campaigns. 
These step-by-step instructions show how to configure the Power BI reports and dashboard after you deploy the solution in your subscription. 

## Prerequisites
* Deploy the [Vehicle Telemetry Analytics](https://gallery.cortanaintelligence.com/Solution/5bdb23f3abb448268b7402ab8907cc90) Solution. 
* [Install Power BI Desktop](http://www.microsoft.com/download/details.aspx?id=45331).
* Obtain an [Azure subscription](https://azure.microsoft.com/pricing/free-trial/). If you don't have an Azure subscription, get started with the Azure free subscription.
* Open a Power BI account.

## Cortana Intelligence suite components
As part of the Vehicle Telemetry Analytics Solution Template, the following Cortana Intelligence services are deployed in your subscription:

* **Azure Event Hubs** ingests millions of vehicle telemetry events into Azure.
* **Azure Stream Analytics** provides real-time insights on vehicle health and persists that data into long-term storage for richer batch analytics.
* **Azure Machine Learning** detects anomalies in real time, and uses batch processing to provide predictive insights.
* **Azure HDInsight** transforms data at scale.
* **Azure Data Factory** handles orchestration, scheduling, resource management, and monitoring of the batch processing pipeline.

**Power BI** gives this solution a rich dashboard for real-time data and predictive analytics visualizations. 

The solution uses two different data sources:

* Simulated vehicle signals and diagnostic data sets
* Vehicle catalog

A vehicle telematics simulator is included as part of this solution. It emits diagnostic information and signals that correspond to the state of the vehicle and driving patterns at a given point in time. 

The vehicle catalog is a reference data set that maps VINs to models.

## Power BI dashboard preparation
### Set up the Power BI real-time dashboard

#### Start the real-time dashboard application
After the deployment is finished, follow the manual operation instructions.

1. Download the real-time dashboard application RealtimeDashboardApp.zip, and unzip it.

2.  In the unzipped folder, open the app config file RealtimeDashboardApp.exe.config. Replace appSettings for Event Hubs, Azure Blob storage, and Azure Machine Learning service connections with the values in the manual operation instructions. Save your changes.

3. Run the application RealtimeDashboardApp.exe. On the sign-in window, enter your valid Power BI credentials. 

   ![Power BI sign-in window](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/5-sign-into-powerbi.png)
   
4. Select **Accept**. The app starts to run.

   ![Power BI dashboard permissions](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/6-powerbi-dashboard-permissions.png)

5. Sign in to the Power BI website, and create a real-time dashboard.

Now you're ready to configure the Power BI dashboard.  

### Configure Power BI reports
The real-time reports and the dashboard take about 30 to 45 minutes to finish. 

1. Browse to the [Power BI](http://powerbi.com) webpage, and sign in.

    ![Power BI sign-in page](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/6-1-powerbi-signin.png)

2. A new data set is generated in Power BI. Select the **ConnectedCarsRealtime** data set.

    ![ConnectedCarsRealtime data set](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/7-select-connected-cars-realtime-dataset.png)

3. To save the blank report, press Ctrl+S.

    ![Blank report](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/8-save-blank-report.png)

4. Enter the report name **Vehicle Telemetry Analytics Real-time - Reports**.

    ![Report name](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/9-provide-report-name.png)

## Real-time reports
Three real-time reports are in this solution:

* Vehicles in Operation
* Vehicles Requiring Maintenance
* Vehicle Health Statistics

You can configure all three of the real-time reports, or you can stop after any stage. You then can proceed to the next section on how to configure batch reports. We recommend that you create all three reports to visualize the full insights of the real-time path of the solution.  

### Vehicles in Operation report
1. Double-click **Page 1**, and rename it **Vehicles in Operation**.

    ![Vehicles in Operation](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4a.png)  

2. On the **Fields** tab, select **vin**. On the **Visualizations** tab, select the **Card** visualization.  

    The **Card** visualization is created as shown in the following figure:

    ![Select vin](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4b.png)

3. Select the blank area to add a new visualization.  

4. On the **Fields** tab, select **city** and **vin**. On the **Visualizations** tab, select the **Map** visualization. Drag **vin** to the **Values** area. Drag **city** to the **Legend** area. 

    ![Card visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4c.png)

5. On the **Visualizations** tab, select the **Format** section. Select **Title**, and change **Text** to **Vehicles in operation by city**.

    ![Vehicles in operation by city](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4d.png)   

    The final visualization looks like the following example:

    ![Final visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4e.png)

6. Select the blank area to add a new visualization.  

7. On the **Fields** tab, select **city** and **vin**. On the **Visualizations** tab, select the **Clustered Column Chart** visualization. Drag **city** to the **Axis** area. Drag **vin** to the **Value** area.

8. Sort the chart by **Count of vin**.

    ![Count of vin](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4f.png)  

9. Change the chart **Title** to **Vehicles in operation by city**. 

10. Select the **Format** section, and then select **Data Colors**. Change **Show All** to **On**.

    ![Data Colors](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4g.png)  

11. Change the color of an individual city by selecting the color symbol.

    ![Color change](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4h.png)  

12. Select the blank area to add a new visualization.  

13. On the **Visualizations** tab, select the **Clustered Column Chart** visualization. On the **Fields** tab, drag **city** to the **Axis** area. Drag **Model** to the **Legend** area. Drag **vin** to the **Value** area.

    ![Clustered Column Chart](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4i.png)

    The chart looks like the following image:

    ![Rendering](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4j.png)

14. Rearrange all the visualizations so that the page looks like the following example:

    ![Dashboard with visualizations](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4k.png)

You successfully configured the "Vehicles in Operation" real-time report. You can create the next real-time report, or you can stop here and configure the dashboard. 

### Vehicles Requiring Maintenance report

1. Select ![Add](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4add.png) to add a new report. Rename it **Vehicles Requiring Maintenance**.

    ![Vehicles Requiring Maintenance](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4l.png)  

2. On the **Fields** tab, select **vin**. On the **Visualizations** tab, select the **Card** visualization.

    ![Vin Card visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4m.png)  

    The data set contains a field named **MaintenanceLabel**. This field can have a value of "0" or "1." The value is set by the machine learning model that's provisioned as part of the solution. It's integrated with the real-time path. The value "1" indicates that a vehicle requires maintenance. 

3. To add a **Page Level Filter** to show data for the vehicles that require maintenance: 

   a. Drag the **MaintenanceLabel** field to **Page Level Filters**.
  
      ![Page Level Filters](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4n1.png)

    b. At the bottom of **Page Level Filters MaintenanceLabel**, select **Basic Filtering**.

      ![Basic Filtering](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4n2.png) 

    c. Set the filter value to **1**.

      ![Filter value](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4n3.png)  

4. Select the blank area to add a new visualization.  

5. On the **Visualizations** tab, select the **Clustered Column Chart** visualization. 

    ![Vin Card](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4o.png)

    ![Clustered Column Chart](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4p.png)

6. On the **Fields** tab, drag **Model** to the **Axis** area. Drag **vin** to the **Value** area. Then sort the visualization by **Count of vin**. Change the chart **Title** to **Vehicles requiring maintenance by model**. 

7. On the **Fields** ![Fields-image](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4field.png) section of the **Visualizations** tab, drag **vin** to **Color Saturation**.

    ![Color Saturation](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4q.png)  

8. On the **Format** section, change **Data Colors** in the visualization: 

    a. Change the **Minimum** color to **F2C812**.

    b. Change the **Maximum** color to **FF6300**.

    ![New data colors](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4r.png)

    The new visualization colors look like the following example:

    ![New visualization colors](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4s.png)  

9. Select the blank area to add a new visualization.  

10. On the **Visualizations** tab, select **Clustered Column Chart**. Drag **vin** to the **Value** area. Drag **city** to the **Axis** area. Sort the chart by **Count of vin**. Change the chart **Title** to **Vehicles requiring maintenance by city**.

    ![Vehicles requiring maintenance by city](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4t.png)  

11. Select the blank area to add a new visualization.  

12. On the **Visualizations** tab, select the **Multi-Row Card** visualization. Drag **Model** and **vin** to the **Fields** area.

    ![Multi-Row Card](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4u.png)    

13. Rearrange all the visualizations so that the final report looks like the following example: 

    ![Rearranged final report](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4v.png)  

You successfully configured the "Vehicles Requiring Maintenance" real-time report. You can create the next real-time report, or you can stop here and configure the dashboard. 

### Vehicle Health Statistics report

1. Select ![Add](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4add.png) to add a new report. Rename it **Vehicles Health Statistics**. 

2. On the **Visualizations** tab, select the **Gauge** visualization. Drag **speed** to the **Value**, **Minimum Value**, and **Maximum Value** areas.

   ![Vehicles Health Statistics](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4w.png)  

3. In the **Value** area, change the default aggregation of **speed** to **Average**.

4. In the **Minimum Value** area, change the default aggregation of **speed** to **Minimum**.

5. In the **Maximum Value** area, change the default aggregation of **speed** to **Maximum**.

   ![Speed values](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4x.png)  

6. Rename the **Gauge Title** to **Average speed**.

   ![Gauge](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4y.png)  

7. Select the blank area to add a new visualization.  

    Similarly, add a **Gauge** for **Average engine oil**, **Average fuel**, and **Average engine temperature**.  

8. Change the default aggregation of fields in each gauge like you did in the previous steps in the **Average speed** gauge.

    ![Additional gauges](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4z.png)

9. Select the blank area to add a new visualization.

10. On the **Visualizations** tab, select the **Line and Clustered Column Chart** visualization. Drag **city** to **Shared Axis**. Drag **tirepressure**, **engineoil**, and **speed** to the **Column Values** area. Change their aggregation type to **Average**. 

11. Drag **engineTemperature** to the **Line Values** area. Change the aggregation type to **Average**. 

    ![Column and Line Values](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4aa.png)

12. Change the chart **Title** to **Average speed, tire pressure, engine oil, and engine temperature**.  

    ![Line and Clustered Column Chart title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4bb.png)

13. Select the blank area to add a new visualization.

14. On the **Visualizations** tab, select the **Treemap** visualization. Drag **Model** to the **Group** area. Drag **MaintenanceProbability** to the **Values** area.

15. Change the chart **Title** to **Vehicle models requiring maintenance**.

    ![Treemap title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4cc.png)

16. Select the blank area to add a new visualization.

17. On the **Visualizations** tab, select the **100% Stacked Bar Chart** visualization. Drag **city** to the **Axis** area. Drag **MaintenanceProbability** and **RecallProbability** to the **Value** area.

    ![Axis and Value areas](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4dd.png)

18. On the **Format** section, select **Data Colors**. Set the **MaintenanceProbability** color to the value **F2C80F**.

19. Change the chart **Title** to **Probability of Vehicle Maintenance & Recall by City**.

    ![100% Stacked Bar Chart title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4ee.png)

20. Select the blank area to add a new visualization.

21. On the **Visualizations** tab, select the **Area Chart** visualization. Drag **Model** to the **Axis** area. Drag **engineOil**, **tirepressure**, **speed**, and **MaintenanceProbability** to the **Values** area. Change their aggregation type to **Average**. 

    ![Aggregation type](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4ff.png)

22. Change the chart **Title** to **Average engine oil, tire pressure, speed, and maintenance probability by model**.

    ![Area Chart title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4gg.png)

23. Select the blank area to add a new visualization.

24. On the **Visualizations** tab, select the **Scatter Chart** visualization. Drag **Model** to the **Details** and **Legend** areas. Drag **fuel** to the **X-Axis** area. Change the aggregation to **Average**. Drag **engineTemperature** to the **Y-Axis** area. Change the aggregation to **Average**. Drag **vin** to the **Size** area.

    ![Details, Legend, Axis, and Size areas](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4hh.png)

25. Change the chart **Title** to **Average of fuel, Average of engineTemperature, and Count of vin by Model and Model**.

    ![Scatter Chart title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4ii.png)

    The final report looks like the following example:

    ![Final report](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4jj.png)

### Pin visualizations from the reports to the real-time dashboard
1. Create a blank dashboard by selecting the plus symbol next to **Dashboards**. Enter the name **Vehicle Telemetry Analytics Dashboard**.

    ![Dashboard plus symbol](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.5.png)

2. Pin the visualizations from the previous reports to the dashboard. 

    ![Dashboard pin symbol](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.6.png)

    When all three reports are pinned to the dashboard, it should look like the following example. If you didn't create all the reports, your dashboard might look different. 

    ![Dashboard with reports](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-4.0.png)

You successfully created the real-time dashboard. As you continue to execute CarEventGenerator.exe and RealtimeDashboardApp.exe, you see live updates on the dashboard. 
The following steps take about 10 to 15 minutes to complete.

## Set up the Power BI batch processing dashboard
> [!NOTE]
> It takes about two hours (from the successful completion of the deployment) for the end-to-end batch processing pipeline to finish execution and process a year's worth of generated data. Wait for the processing to finish before you proceed with the following steps:
> 
> 

### Download the Power BI designer file

1. A preconfigured Power BI designer file is included as part of the deployment manual operation instructions. Look for "2. Set up the PowerBI batch processing dashboard."

2. Download the Power BI template for batch processing dashboard here called **ConnectedCarsPbiReport.pbix**.

3. Save it locally.

### Configure Power BI reports

1. Open the designer file **ConnectedCarsPbiReport.pbix** by using the Power BI Desktop. If you don't already have it, install the Power BI Desktop from the [Power BI Desktop installation](http://www.microsoft.com/download/details.aspx?id=45331) website.

2. Select **Edit Queries**.

    ![Edit Queries](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/10-edit-powerbi-query.png)

3. Double-click **Source**.

    ![Source](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/11-set-powerbi-source.png)

4. Update the server connection string with the Azure SQL server that got provisioned as part of the deployment. Look in the manual operation instructions under Azure SQL database:

    * Server: somethingsrv.database.windows.net
    * Database: connectedcar
    * Username: username
    * Password: You can manage your SQL Server password from the Azure portal.

5. Leave **Database** as **connectedcar**.

    ![Database](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/12-set-powerbi-database.png)

6. Select **OK**.

7. The **Windows credential** tab is selected by default. Change it to **Database credentials** by selecting the **Database** tab at the right.

8. Enter the **Username** and **Password** of your Azure SQL database that was specified during its deployment setup.

    ![Database credentials](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/13-provide-database-credentials.png)

9. Select **Connect**.

10. Repeat the previous steps for each of the three remaining queries present in the right pane. Then update the data source connection details.

11. Select **Close and Load**. Power BI Desktop file data sets are connected to SQL database tables.

12. Select **Close** to close the Power BI Desktop file.

    ![Close](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/14-close-powerbi-desktop.png)

13. Select **Save** to save the changes. 

You have now configured all the reports that correspond to the batch processing path in the solution. 

## Upload to powerbi.com
1. Go to the [Power BI web portal](http://powerbi.com), and sign in.

2. Select **Get Data**.

3. Upload the Power BI Desktop file. Select **Get Data** > **Files Get** > **Local file**.

4. Go to **ConnectedCarsPbiReport.pbix**.

5. After the file is uploaded, go back to your Power BI work space. A dataset, a report, and a blank dashboard are created for you.  

6. Pin charts to a new dashboard called **Vehicle Telemetry Analytics Dashboard** in Power BI. Select the blank dashboard that was previously created, and then go to the **Reports** section. Select the newly uploaded report.  

    ![New Power BI dashboard](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard1.png) 

    The report has six pages:

    Page 1: Vehicle density  
    Page 2: Real-time vehicle health  
    Page 3: Aggressively driven vehicles   
    Page 4: Recalled vehicles  
    Page 5: Fuel efficiently driven vehicles  
    Page 6: Contoso Motors logo  

    ![Power BI report with six pages](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard2.png)

7. From **Page 3**, pin the following content:  

    a. **Count of vin**  

   ![Page 3 Count of vin](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard3.png)

    b. **Aggressively driven vehicles by model – Waterfall chart** 

   ![Page 3 chart 4](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard4.png)

8. From **Page 5**, pin the following content: 

    a. **Count of vin**

   ![Page 5 chart 5](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard5.png)

    b. **Fuel-efficient vehicles by model: Clustered column chart**

   ![Page 5 chart 6](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard6.png)

9. From **Page 4**, pin the following content:  

    a. **Count of vin** 

   ![Page 4 chart 7](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard7.png) 

    b. **Recalled vehicles by city, model: Treemap**

   ![Page 4 chart 8](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard8.png)  

10. From **Page 6**, pin the following content:  

    * **Contoso Motors logo**

    ![Contoso Motors logo](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard9.png)

### Organize the dashboard  

1. Go to the dashboard.

2. Hover over each chart. Rename each chart based on the naming provided in the following finished dashboard example:

   ![Dashboard organization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-organize-dashboard2.png) 
   
3. Move the charts around to look like the following dashboard example:

    ![Rearranged dashboard](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard.png)

4. After you create all the reports mentioned in this document, the final finished dashboard looks like the following example: 

   ![Final dashboard](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-organize-dashboard3.png)

You have successfully created the reports and the dashboard to gain real-time, predictive, and batch insights on vehicle health and driving habits.  
