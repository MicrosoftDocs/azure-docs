---
title: "Get insights from data"
linkTitle: "Get insights"
majorRevDate: "2023-08-17"
owner: "smohanselvan"
weight: 60
description: >
  Connect Azure IoT Operations data to a Power BI report for insights.
---

This quickstart demonstrates how you can connect your Azure IoT Operations data in the cloud to a Power BI report to derive insights from that data.

## Prerequisites

Before you proceed, make sure you've completed the following prerequisites.

* You have a deployed Azure IoT Operations environment.
* You've completed the previous quickstarts in this set, including adding assets to your Azure IoT Operations project and processing telemetry from your assets.
* You've set up a Fabric lakehouse destination and landed contextualized data to the lakehouse. If you haven't completed this, see [Process telemetry](../process-telemetry/).
* You have access to either a Power BI Pro or Power BI Premium Per User license (free license users will be unable to complete the measure creation step of this quickstart).
* You've downloaded and signed into [Power BI Desktop](https://learn.microsoft.com/power-bi/fundamentals/desktop-what-is-desktop). If you haven't completed this, you can download it here: [Download Power BI tools and apps](https://powerbi.microsoft.com/downloads/).

## Connect your data sources to the Power BI report

### Step 1: Create a new dataset in the lakehouse

Create a new dataset in your lakehouse that contains the contextualized telemetry table you created in the [Process telemetry](../process-telemetry/) section to use for reporting.

1. In the lakehouse menu, select **New Power BI dataset**.

   ![Screenshot of the New Power BI dataset button](new-powerbi-dataset.png)

2. Select *OPCUA*, the contextualized telemetry table from the previous quickstart, and confirm. This action creates a new dataset and opens a new page.

3. In this new page, create four measures. **Measures** in Power BI are custom calculators that perform math or summarize data from your table, to help you find answers from your data. To learn more, see [Create measures for data analysis in Power BI Desktop](https://learn.microsoft.com/power-bi/transform-model/desktop-measures).

   To create a measure, select **New measure** from the menu, enter one line of measure text from the code block below, and select **Commit**. Complete this process four times, once for each line of measure text:

   ```power-bi
   MinTemperature = CALCULATE(MINX(OPCUA, OPCUA[CurrentTemperature]))
   MaxTemperature = CALCULATE(MAXX(OPCUA, OPCUA[CurrentTemperature]))
   MinPressure = CALCULATE(MINX(OPCUA, OPCUA[Pressure]))
   MaxPressure = CALCULATE(MAXX(OPCUA, OPCUA[Pressure]))
   ```

   ![Screenshot of creating a new measure in Power BI](power-bi-new-measure.png)

4. Select the name of the dataset in the top left, and rename it to something memorable. You will use this dataset in the next section:

   ![Screenshot of naming a dataset in Power BI](power-bi-name-dataset.png)

### Step 2: Configure your Power BI report and load Asset Registry data

The next steps will be performed using Power BI Desktop, so make sure you have it installed.

1. Download the following Power BI template: [quickStartTemplate.pbit](quickStartTemplate.pbit). Selecting the link will download it automatically.
2. Open a new instance of Power BI Desktop.
3. Exit the startup screen and select **File** > **Import** > **Power BI template**. Select the file you downloaded to import it.
4. A menu will pop up asking you to input an Azure subscription and resource group. Enter the Azure subscription ID and resource group where you've created your assets and select **Load**. This loads your sample Asset Registry data into Power BI using a custom [Power Query M](https://learn.microsoft.com/powerquery-m/) script.  

   {{% alert title="Note" color="secondary" %}}
   Optional: To view the script, right select **Asset** > **Edit query**.

   ![Screenshot of Edit query in Power BI](power-bi-edit-query.png)

   You'll see a few queries on the new page that comes up (the Transform page). Go through each of them and select **Advanced Editor** in the top menu to view the details of the queries. The most important query is **GetAssetData**.

   ![Screenshot of Advanced editor in Power BI](power-bi-advanced-editor.png)

   When you're finished, exit the Transform page.
   {{% /alert %}}

### Step 3: Configure the remaining Power BI report visuals

1. At this stage, some of the visuals in the Power BI report still display an error. That's because you still need to get the telemetry data. Select **File** > **Options and Settings** > **Data source settings**.  

2. Select **Change source**. A list of data hubs and datasets will be visible. Select the dataset you created in the previous section, choose the *OPCUA* contextualized telemetry table, and select **Submit**.

3. In the left pane menu, select **Model View**.

   ![Screenshot of model view button in Power BI](power-bi-model-view.png)

4. Drag **assetName** in the **Asset** box to **AssetName** in the **OPCUA** box, to create a relationship between the tables.

5. Set **Cardinality** to _One to many (1:*)_, and set **Cross filter direction** to _Both_. Select **OK**.

   ![Screenshot of model view options in Power BI](power-bi-model-view-options.png)

6. Return to the **Report view** using the left pane menu. All the visuals should display data now without error.

   ![Screenshot of Power BI report view](new-powerbi-page1.png)

## View insights

The report is split into two pages, each offering a different view of the asset and telemetry data. On Page 1, you can view each asset and their associated telemetry. On Page 2, you can view multiple assets and their associated telemetry simultaneously, to compare data points at a specified time period. Select your assets with _CTRL+Click_ on the assets you want to view. Explore the various filters for each visual to explore and do more with your data.

With data connected from various sources at the edge being related to one another in Power BI, the visualizations and interactive features in the report allow you to gain deeper insights into asset health, utilization, and operational trends. This can empower you to enhance productivity, improve asset performance, and drive informed decision-making for better business outcomes.