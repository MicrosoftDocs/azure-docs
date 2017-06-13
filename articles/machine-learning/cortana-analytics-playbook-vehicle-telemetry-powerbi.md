---
title: Power BI Dashboard for vehicle health and driving habits - Azure | Microsoft Docs
description: Use the capabilities of Cortana Intelligence to gain real-time and predictive insights on vehicle health and driving habits.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: jhubbard
editor: cgronlun

ms.assetid: aaeb29a5-4a13-4eab-bbf1-885690d86c56
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/16/2016
ms.author: bradsev

---
# Vehicle telemetry analytics solution template Power BI Dashboard setup instructions
This **menu** links to the chapters in this playbook. 

[!INCLUDE [cap-vehicle-telemetry-playbook-selector](../../includes/cap-vehicle-telemetry-playbook-selector.md)]

The Vehicle Telemetry Analytics solution showcases how car dealerships, automobile manufacturers and insurance companies can leverage the capabilities of Cortana Intelligence to gain real-time and predictive insights on vehicle health and driving habits to drive improvements in the area of customer experience, R&D and marketing campaigns. 
This document contains step by step instructions on how you can configure the Power BI reports and dashboard once the solution is deployed in your subscription. 

## Prerequisites
1. Deploy the [Telemetry Analytics](https://gallery.cortanaintelligence.com/Solution/5bdb23f3abb448268b7402ab8907cc90) solution  
2. [Install Microsoft Power BI Desktop](http://www.microsoft.com/download/details.aspx?id=45331)
3. An [Azure subscription](https://azure.microsoft.com/pricing/free-trial/). If you don't have an Azure subscription, get started with Azure free subscription
4. Microsoft Power BI account

## Cortana Intelligence Suite Components
As part of the Vehicle Telemetry Analytics solution template, the following Cortana Intelligence services are deployed in your subscription.

* **Event Hub** for ingesting millions of vehicle telemetry events into Azure.
* **Stream Analytics** for gaining real-time insights on vehicle health and persists that data into long-term storage for richer batch analytics.
* **Machine Learning** for anomaly detection in real-time and batch processing to gain predictive insights.
* **HDInsight** is leveraged to transform data at scale
* **Data Factory** handles orchestration, scheduling, resource management and monitoring of the batch processing pipeline.

**Power BI** gives this solution a rich dashboard for real-time data and predictive analytics visualizations. 

The solution uses two different data sources: **Simulated vehicle signals and diagnostic dataset** and **vehicle catalog**.

A vehicle telematics simulator is included as part of this solution. It emits diagnostic information and signals corresponding to the state of the vehicle and driving pattern at a given point in time. 

The Vehicle Catalog is a reference dataset containing VIN to model mapping

## Power BI Dashboard Preparation
### Setup Power BI Real-Time Dashboard

**Start the real-time dashboard application**
Once the deployment is completed, you should follow the Manual Operation Instructions

* Download real-time dashboard application RealtimeDashboardApp.zip, and unzip it.
*  In the unzipped folder, open app config file 'RealtimeDashboardApp.exe.config', replace appSettings for Eventhub, Blob Storage, and ML service connections with the values in the Manual Operation Instructions, and save your changes.
* Run application RealtimeDashboardApp.exe. A login window will pop up, provide your valid PowerBI credentials and click the **Accept** button. Then the app will start to run.

   ![Sign-in to Power BI](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/5-sign-into-powerbi.png)
   
   ![Power BI Dashboard permissions](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/6-powerbi-dashboard-permissions.png)

* Login to PowerBI website, and create real-time dashboard.

Now, you are ready to configure the Power BI dashboard with rich visualizations to gain real-time and predictive insights on vehicle health and driving habits. It takes about 45 minutes to an hour to create all the reports and configure the dashboard. 

### Configure Power BI reports
The real-time reports and the dashboard take about 30-45 minutes to complete. 
Browse to [http://powerbi.com](http://powerbi.com) and login.

![Sign-in to Power BI](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/6-1-powerbi-signin.png)

A new dataset is generated in Power BI. Click the **ConnectedCarsRealtime** dataset.

![Selecte connected cars real-time dataset](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/7-select-connected-cars-realtime-dataset.png)

Save the blank report using **Ctrl + s**.

![Save blank report](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/8-save-blank-report.png)

Provide report name *Vehicle Telemetry Analytics Real-time - Reports*.

![Provide report name](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/9-provide-report-name.png)

## Real-time reports
There are three real-time reports in this solution:

1. Vehicles in operation
2. Vehicles Requiring Maintenance
3. Vehicles Health Statistics

You can choose to configure all the three real-time reports or stop after any stage and proceed to the next section of configuring the batch reports. We recommend you to create all the three reports to visualize the full insights of the real-time path of the solution.  

### 1. Vehicles in operation
Double-click **Page 1** and rename it to “Vehicles in operation”  
    ![Connected Cars - Vehicles in operation](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4a.png)  

Select **vin** field from **Fields** and choose visualization type as **“Card”**.  

Card visualization is created as shown in figure.  
    ![Connected Cars - Select vin](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4b.png)

Click the blank area to add new visualization.  

Select **City** and **vin** from fields. Change visualization to **“Map”**. Drag **vin** in values area. Drag **city** from fields to **Legend** area.   
    ![Connected Cars - Card Visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4c.png)

Select **format** section from **Visualizations**, click **Title** and change the **Text** to **“Vehicles in operation by city”**.  
    ![Connected Cars - Vehicles in operation by city](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4d.png)   

Final visualization looks as shown in figure.    
    ![Connected Cars - Final visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4e.png)

Click the blank area to add new visualization.  

Select **City** and **vin**, change visualization type to **Clustered Column Chart**. Ensure **City** field in **Axis area** and **vin** in **Value area**  

Sort chart by **“Count of vin”**  
    ![Connected Cars - Count of vin](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4f.png)  

Change chart **Title** to **“Vehicles in operation by city”**  

Click the **Format** section, then select **Data Colors**,  Click the **“On”** to **Show All**  
    ![Connected Cars - Show all Data Colors](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4g.png)  

Change the color of individual city by clicking on color icon.  
    ![Connected Cars - Change Colors](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4h.png)  

Click the blank area to add new visualization.  

Select **Clustered Column Chart** visualization from visualizations, drag **city** field in **Axis** area, **Model** in **Legend** area and **vin** in **Value** area.  
    ![Connected Cars - Clustered Column Chart](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4i.png)  
    ![Connected Cars - Rendering](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4j.png)

Rearrange all visualization on this page as shown in figure.  
    ![Connected Cars - Visualizations](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4k.png)

You have successfully configured the “Vehicles in operation” real-time report. You can proceed to create the next real-time report or stop here and configure the dashboard. 

### 2. Vehicles Requiring Maintenance
Click ![Add](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4add.png) to add a new report, rename it to **“Vehicles Requiring Maintenance”**

![Connected Cars - Vehicles Requiring Maintenance](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4l.png)  

Select **vin** field and change visualization type to **Card**.  
    ![Connected Cars - Vin Card Visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4m.png)  

We have a field named “MaintenanceLabel” In the dataset. This field can have a value of “0” or “1”.” It is set by the Azure Machine Learning model provisioned as part of solution and integrated with the real-time path. The value “1” indicates a vehicle requires maintenance. 

To add a **Page Level** filter for showing vehicles data, which are requiring maintenance: 

1. Drag the **“MaintenanceLabel”** field into **Page Level Filters**.  
   ![Connected Cars - Page Level Filters](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4n1.png)  
2. Click **Basic Filtering** menu present at bottom of MaintenanceLabel Page Level Filter.  
   ![Connected Cars - Basic Filtering](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4n2.png)  
3. Set its filter value to **“1”**    
   ![Connected Cars - Filter Value](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4n3.png)  

Click the blank area to add new visualization.  

Select **Clustered Column Chart** from visualizations  
![Connected Cars - Vind Card Visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4o.png)  
![Connected Cars - Clustered Column Chart](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4p.png)

Drag field **Model** into **Axis** area, **Vin** to **Value** area. Then sort visualization by **Count of vin**.  Change chart **Title** to **“Vehicles requiring maintenance by model”**  

Drag **vin** fields into **Color Saturation** present at **Fields** ![Fields](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4field.png) section of **Visualization** tab  
![Connected Cars - Color Saturation](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4q.png)  

Change **Data Colors** in visualizations from **Format** section  
Change Minimum color to: **F2C812**  
Change Maximum color to: **FF6300**  
![Connected Cars - Color Changes](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4r.png)  
![Connected Cars - New Visualization Colors](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4s.png)  

Click the blank area to add new visualization.  

Select **Clustered column chart** from visualizations, drag **vin** field into **Value** area, drag **City** field into **Axis** area. Sort chart by **“Count of vin”**. Change chart **Title** to **“Vehicles requiring maintenance by city”**   
![Connected Cars - Vehicles requiring maintenance by city](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4t.png)  

Click the blank area to add new visualization.  

Select **Multi-Row Card** visualization from visualizations, drag **Model** and **vin** into the **Fields** area.  
![Connected Cars - Multi-Row Card](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4u.png)    

Rearranging all of the visualization, the final report looks as follows:  
![Connected Cars - Multi-Row Card](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4v.png)  

You have successfully configured the “Vehicles Requiring Maintenance” real-time report. You can proceed to create the next real-time report or stop here and configure the dashboard. 

### 3. Vehicles Health Statistics
Click ![Add](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4add.png) to add new report, rename it to **“Vehicles Health Statistics”**  

Select **Gauge** visualization from visualizations, then drag the **Speed** field into
**Value, Minimum Value, Maximum Value** areas.  
![Connected Cars - Multi-Row Card](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4w.png)  

Change the default aggregation of **speed** in **Value area** to **Average** 

Change the default aggregation of **speed** in **Minimum area** to **Minimum**

Change the default aggregation of **speed** in **Maximum area** to **Maximum**

![Connected Cars - Multi-Row Card](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4x.png)  

Rename the **Gauge Title** to **“Average speed”** 

![Connected Cars - Gauge](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4y.png)  

Click the blank area to add new visualization.  

Similarly add a **Gauge** for **average engine oil**, **average fuel**, and **average engine temperate**.  

Change the default aggregation of fields in each gauge as per above steps in **“Average speed”** gauge.

![Connected Cars - Gauges](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4z.png)

Click the blank area to add new visualization.

Select **Line and Clustered Column Chart** from visualizations, then drag **City** field into **Shared Axis**, drag **speed**, **tirepressure and engineoil fields** into **Column Values** area, change their aggregation type to **Average**. 

Drag the **engineTemperature** field into **Line Values** area, change the  aggregation type to **Average**. 

![Connected Cars - Visualizations Fields](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4aa.png)

Change the chart **Title** to **“Average speed, tire pressure, engine oil and engine temperature”**.  

![Connected Cars - Visualizations Fields](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4bb.png)

Click the blank area to add new visualization.

Select **Treemap** visualization from visualizations, drag the **Model** field into the **Group** area, and drag the field **MaintenanceProbability** into the **Values** area.

Change the chart **Title** to **“Vehicle models requiring maintenance”**.

![Connected Cars - Change Chart Title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4cc.png)

Click the blank area to add new visualization.

Select **100% Stacked Bar Chart** from visualization, drag the **city** field into the **Axis** area, and drag the **MaintenanceProbability**, **RecallProbability** fields into the **Value** area.

![Connected Cars - Add New Visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4dd.png)

Click **Format**, select **Data Colors**, and set the **MaintenanceProbability** color to the value **“F2C80F”**.

Change the **Title** of the chart to **“Probability of Vehicle Maintenance & Recall by City”**.

![Connected Cars - Add New Visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4ee.png)

Click the blank area to add new visualization.

Select **Area Chart** from visualization from visualizations, drag the **Model** field into the **Axis** area, and drag the **engineOil, tirepressure, speed and MaintenanceProbability** fields into the **Values** area. Change their aggregation type to **“Average”**. 

![Connected Cars - Change Aggregation Type](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4ff.png)

Change the title of the chart to **“Average engine oil, tire pressure, speed and maintenance probability by model”**.

![Connected Cars - Change Chart Title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4gg.png)

Click the blank area to add new visualization:

1. Select **Scatter Chart** visualization from visualizations.
2. Drag the **Model** field into the **Details** and **Legend** area.
3. Drag the **fuel** field into the **X-Axis** area, change the aggregation to **Average**.
4. Drag **engineTemparature** into **Y-Axis area**, change the aggregation to **Average**
5. Drag the **vin** field into the **Size** area.

![Connected Cars - Add new visualization](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4hh.png)

Change the chart **Title** to **“Averages of Fuel, Engine Temperature by Model”**.

![Connected Cars - Change Chart Title](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4ii.png)

The final report will look like as shown below.

![Connected Cars-Final Report](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.4jj.png)

### Pin visualizations from the reports to the real-time dashboard
Create a blank dashboard by clicking on the plus icon next to Dashboards. You can name it “Vehicle Telemetry Analytics Dashboard”

![Connected Cars-Dashboard](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.5.png)

Pin the visualization from the above reports to the dashboard. 

![Connected Cars-Dashboard](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-3.6.png)

The dashboard should look as follows when all the three reports are created and the corresponding visualizations are pinned to the dashboard. If you have not created all the reports, your dashboard could look different. 

![Connected Cars-Dashboard](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/connected-cars-4.0.png)

Congratulations! You have successfully created the real-time dashboard. As you continue to execute CarEventGenerator.exe and RealtimeDashboardApp.exe, you should see live updates on the dashboard. 
It should take about 10 to 15 minutes to complete the following steps.

## Setup Power BI batch processing dashboard
> [!NOTE]
> It takes about two hours (from the successful completion of the deployment) for the end to end batch processing pipeline to finish execution and process a year worth of generated data. So wait for the processing to finish before proceeding with the next steps. 
> 
> 

**Download the Power BI designer file**

* A pre-configured Power BI designer file is included as part of the deployment Manual Operation Instructions
* Look for 2. Setup PowerBI batch processing dashboard
You can download the PowerBI template for batch processing dashboard here called **ConnectedCarsPbiReport.pbix**.
* Save locally

**Configure Power BI reports**

* Open the designer file ‘**ConnectedCarsPbiReport.pbix**’ using Power BI Desktop. If you do not already have, install the Power BI Desktop from [Power BI Desktop install](http://www.microsoft.com/download/details.aspx?id=45331). 
* Click the **Edit Queries**.

![Edit Power BI query](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/10-edit-powerbi-query.png)

* Double-click the **Source**.

![Set Power BI source](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/11-set-powerbi-source.png)

* Update Server connection string with the Azure SQL server that got provisioned as part of the deployment.  Look in the Manual Operation Instructions under 

    4. Azure SQL Database
    
    * Server: somethingsrv.database.windows.net
    * Database: connectedcar
    * Username: username
    * Password: You can manage your SQL server password from Azure portal

* Leave **Database** as *connectedcar*.

![Set Power BI database](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/12-set-powerbi-database.png)

* Click **OK**.
* You will see **Windows credential** tab selected by default, change it to **Database credentials** by clicking on **Database** tab at right.
* Provide the **Username** and **Password** of your Azure SQL Database that was specified during its deployment setup.

![Provide database credentials](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/13-provide-database-credentials.png)

* Click **Connect**
* Repeat the above steps for each of the three remaining queries present at right pane, and then update the data source connection details.
* Click **Close and Load**. Power BI Desktop file datasets are connected to SQL Azure Database tables.
* **Close** Power BI Desktop file.

![Close Power BI desktop](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/14-close-powerbi-desktop.png)

* Click **Save** button to save the changes. 

You have now configured all the reports corresponding to the batch processing path in the solution. 

## Upload to *powerbi.com*
1. Navigate to the Power BI web portal at http://powerbi.com and login.
2. Click **Get Data**  
3. Upload the Power BI Desktop File.  
4. To upload, click **Get Data -> Files Get -> Local file**  
5. Navigate to the **“**ConnectedCarsPbiReport.pbix**”**  
6. Once the file is uploaded, you will be navigated back to your Power BI work space.  

A dataset, report and a blank dashboard will be created for you.  

Pin charts to a new dashboard called **Vehicle Telemetry Analytics Dashboard** in **Power BI**. Click the blank dashboard created above and then navigate to the **Reports** section click the newly uploaded report.  

![Vehicle Telemetry Power BI.com](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard1.png) 

**Note the report has six pages:**  
Page 1: Vehicle density  
Page 2: Real-time vehicle health  
Page 3: Aggressively Driven Vehicles   
Page 4: Recalled vehicles  
Page 5: Fuel Efficiently Driven Vehicles  
Page 6: Contoso Logo  

![Connected Cars Power BI.com](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard2.png)

**From Page 3**, pin the following:  

1. Count of VIN  
   ![Connected Cars Power BI.com](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard3.png) 
2. Aggressively driven vehicles by model – Waterfall chart  
   ![Vehicle Telemetry - Pin Charts 4](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard4.png)

**From Page 5**, pin the following: 

1. Count of vin    
   ![Vehicle Telemetry - Pin Charts 5](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard5.png)  
2. Fuel efficient vehicles by model: Clustered column chart  
   ![Vehicle Telemetry - Pin Charts 6](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard6.png)

**From Page 4**, pin the following:  

1. Count of vin  
   ![Vehicle Telemetry - Pin Charts 7](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard7.png) 
2. Recalled vehicles by city, model: Treemap  
   ![Vehicle Telemetry - Pin Charts 8](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard8.png)  

**From Page 6**, pin the following:  

1. Contoso Motors logo  
   ![Vehicle Telemetry - Pin Charts 9](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard9.png)

**Organize the dashboard**  

1. Navigate to the dashboard
2. Hover over each chart and rename it based on the naming provided in the complete dashboard image below. Also move the charts around to look like the dashboard below.  
   ![Vehicle Telemetry - Organize Dashboard 2](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-organize-dashboard2.png)  
   ![Vehicle Telemetry Power BI.com](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-dashboard.png)
3. If you have created all the reports as mentioned in this document, the final completed dashboard should look like the following figure. 

![Vehicle Telemetry - Organize Dashboard 2](./media/cortana-analytics-playbook-vehicle-telemetry-powerbi-dashboard/vehicle-telemetry-organize-dashboard3.png)

Congratulations! You have successfully created the reports and the dashboard to gain real-time, predictive and batch insights on vehicle health and driving habits.  
