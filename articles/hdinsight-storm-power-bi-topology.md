<properties
 pageTitle="Write data to Power BI from Apache Storm | Microsoft Azure"
 description="An exmaple of how to write data to Power BI from a C# topology running on an Apache Storm on HDInsight cluster. After writing the data, you will learn how to create a report and real-time dashboard using Power BI."
 services="hdinsight"
 documentationCenter=""
 authors="Blackmist"
 manager="paulettm"
 editor="cgronlun"/>

<tags
 ms.service="hdinsight"
 ms.devlang="dotnet"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="big-data"
 ms.date="04/28/2015"
 ms.author="larryfr"/>

# Use Power BI (preview) to visualize data from an Apache Storm topology

The Power BI preview allows you to visually display data as reports, or dashboards. Using the Power BI REST API, you can easily use data from a topology running on an Apache Storm on HDInsight cluster to Power BI.

In this document, you will learn how to use Power BI to create a report and dashboard from data created by a Storm topology.

## Prerequisites

* A Microsoft Azure subscription

* An Azure Active Directory user with [Power BI](https://powerbi.com) access

* Visual Studio (one of the following versions)

    * Visual Studio 2012 with [update 4](http://www.microsoft.com/download/details.aspx?id=39305)

    * Visual Studio 2013 with [update 4](http://www.microsoft.com/download/details.aspx?id=44921) or [Visual Studio 2013 Community](http://go.microsoft.com/fwlink/?linkid=517284&clcid=0x409)

    * Visual Studio 2015 [CTP6](http://visualstudio.com/downloads/visual-studio-2015-ctp-vs)

* The HDInsight Tools for Visual Studio: See [Get started using the HDInsight Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md) for information on installation information.

## How it works

This example contains a C# Storm topology that randomly generates a sentence, splits the sentence into words, counts the words, and sends the word and count to the Power BI REST API. The [PowerBi.Api.Client](https://github.com/Vtek/PowerBI.Api.Client) Nuget package is used to communicate with Power BI.

The following files in this project implement the Power BI specific functionality:

* **PowerBiBolt.cs**: Implements the Storm bolt, which sends data to Power BI

* **Data.cs**: Describes the data object/row that will be sent to Power BI

> [AZURE.WARNING] Power BI seems to allow the creation of multiple datasets with the same name. This can occur if the dataset does not exist, and your topology creates multiple instances of the Power BI Bolt. To avoid this, either set the parallelism hint of the bolt to 1 (as this example does,) or create the dataset before deploying the topology.
>
> The **CreateDataset** console application included in this solution is provided as an example of how to create the dataset outside of the topology.

## Register a Power BI application

1. Follow the steps in the [Power BI quickstart](https://msdn.microsoft.com/en-US/library/dn931989.aspx) to sign up for Power BI.

2. Follow the steps in [Register an app](https://msdn.microsoft.com/en-US/library/dn877542.aspx) to create an application registration. This will be used when accessing the Power BI REST API.

    > [AZURE.IMPORTANT] Save the **Client ID** for the application registration.

## Download the example

Download the [HDInsight C# Storm Power BI example]](https://github.com/Blackmist/hdinsight-csharp-storm-powerbi). To download it, either fork/clone it using [git](http://git-scm.com/), or use the **Download** link to download a .zip of the archive.

## Configure the sample

1. Open the sample in Visual Studio. From **Solution Explorer**, open the **SCPHost.exe.config** file, and then find the **<OAuth .../>** element. Enter values for the following properties of this element.

    * **Client**: The Client ID for the application registration you created earlier.

    * **User**: An Azure Active Directory account that has access to Power BI.

    * **Password**: The password for the Azure Active Directory account.

2. (Optional). The default dataset name used by this project is **Words**. To change this, right click on the **WordCount** project in **Solution Explorer**, select **Properties**, and then select **Settings**. Change the **DatasetName** entry to the desired value.

2. Save and close the files.

## Deploy the sample

1. From **Solution Explorer**, right-click the **WordCount** project and select **Submit to Storm on HDInsight**. Select the HDInsight cluster from the **Storm Cluster** dropdown dialog.

    > [AZURE.NOTE] It may take a few seconds for the **Storm Cluster** dropdown to populate with server names.
    >
    > If prompted, enter the login credentials for your Azure subscription. If you have more than one subscription, log in to the one that contains your Storm on HDInsight cluster.

2. When the topology has been successfully submitted, the Storm Topologies for the cluster should appear. Select the WordCount topology from the list to view information about the running topology.

    ![The topologies, with the WordCount topology selected](./media/hdinsight-storm-powerbi-topology/topologysummary.png)

    > [AZURE.NOTE] You can also view Storm Topologies from Server Explorer: Expand Azure, HDInsight, right-click a Storm on HDInsight cluster, and then select View Storm Topologies.

3. When viewing the **Topology Summary**, scroll until you see the **Bolts** section. In this section, note the **Executed** column for the **PowerBI** bolt. Use the refresh button at the top of the page to refresh until the value changes to something other than zero. When this number starts to increase, it indicates that items are being written to Power BI.

## Create a report

1. In a browser, visit [https://PowerBI.com](https://powerbi.com). Sign in with your account.

2. On the left side of the page, expand **Datasets**. Select the **Words** entry. This is the dataset created by the example topology.

    ![Words dataset entry](./media/hdinsight-storm-powerbi-topology/words.png)

3. From the **Fields** area, expand **WordCount**. Drag the **Count** and **Word** entries to the middle part of the page. This will create a new chart that displays a bar for each word indicating how many times the word has occurred.

    ![WordCount chart](./media/hdinsight-storm-powerbi-topology/wordcountchart.png)

4. From the upper left of the page, select **Save** to create a new report. Enter **Word Count** as the name of the Report.

5. Select the Power BI logo to return to the dashboard. The **Word Count** report now appears under **Reports**.

## Create a live dashboard

1. Beside **Dashboard**, select the **+** icon to create a new dashboard. Name the new dashboard **Live Word Count**.

2. Select the **Word Count** report you created earlier. When displayed, select the chart, then select the pushpin icon to the upper right of the chart. You should receive a notification that it was pinned to the dashboard.

    ![chart with pushpin displayed](./media/hdinsight-storm-powerbi-topology/pushpin.png)

2. Select the Power BI logo to return to the dashboard. Select the **Live Word Count** dashboard. It now contains the Word Count chart, and the chart updates as new entries are sent to Power BI from the WordCount topology running on HDInsight.

    ![The live dashboard](./media/hdinsight-storm-powerbi-topology/dashboard.png)

## Stop the WordCount topology

The topology will continue to run until you stop it or delete the Storm on HDInsight cluster. Perform the following steps to stop the topology.

1. In Visual Studio, open the **Topology Summary** window for the WordCount topology. If the Topology Summary is not already open, go to **Server Explorer**, expand the **Azure** and **HDInsight** entries, right-click on the Storm on HDInsight cluster and select **View Storm Topologies**. Finally, select the **WordCount** topology.

2. Select the **Kill** button to stop the **WordCount** topology.

    ![Kill button on the toplogy summary](./media/hdinsight-storm-powerbi-topology/killtopology.png)

## Next steps

In this document, you learned how to send data from a Storm topology to Power BI using REST. For information on how to work with other Azure technologies, see the following:

* [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)
