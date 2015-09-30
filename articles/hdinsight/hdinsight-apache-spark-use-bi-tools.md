<properties 
	pageTitle="Use BI tools with Apache Spark on HDInsight | Microsoft Azure" 
	description="Step-by-step instructions on how to use notebooks with Apache Spark to create schemas on raw data, save them as Hive tables, and then use BI tools on the Hive table for data analytics" 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"
	tags="azure-portal"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/30/2015" 
	ms.author="nitinme"/>


# Use BI tools with Apache Spark on Azure HDInsight

Learn how to use Apache Spark in Azure HDInsight to do the following:

* Take raw sample data and save it as a Hive table
* Use BI tools such as Power BI and Tableau to analyze and visualize the data.

**Prerequisites:**

You must have the following:

- An Azure subscription. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- An Apache Spark cluster. For instructions, see [Provision Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-provision-clusters.md).
- A computer with Microsoft Spark ODBC driver installed (required for Spark on HDInsight to work with Tableau). You can install the driver from [here](http://go.microsoft.com/fwlink/?LinkId=616229).
- BI tools such as [Power BI](http://www.powerbi.com/) or [Tableau Desktop](http://www.tableau.com/products/desktop). You can get a free preview subscription of Power BI from [http://www.powerbi.com/](http://www.powerbi.com/).

##<a name="hivetable"></a>Save raw data as a Hive table

In this section, we use the [Jupyter](https://jupyter.org) notebook associated with an Apache Spark cluster in HDInsight to run jobs that process your raw sample data and save it as a Hive table. The sample data is a .csv file (hvac.csv) available on all clusters by default.

Once your data is saved as a Hive table, in the next section we will connect to the Hive table using BI tools such as Power BI and Tableau.

1. Use the following URL to open a Jupyter notebook. Replace __CLUSTERNAME__ with the name of your Spark cluster.

    https://CLUSTERNAME.azurehdinsight.net/jupyter

    When prompted, enter the admin credentials for your cluster.

    > [AZURE.IMPORTANT] If your HDInsight cluster was created before 1/1/2015, you must launch the notebook from the [Azure Preview Portal](https://portal.azure.com/) by selecting your HDInsight cluster, and then __Quick Links__. From the __Cluster Dashboard__ blade that appears, select the __Jupyter Notebook__ link.
    >
    > You must then follow instructions on the page that is displayed in order to start the Jupyter Notebook.
    >
    > You can also use the portal to access the Jupyter notebook on clusters created after 1/1/2015, but the linked URL will be the same as the one listed above (https://CLUSTERNAME.azurehdinsight.net/jupyter).

2. Create a new notebook. Click **New**, and then click **Python 2**.

	![Create a new Jupyter notebook](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Note.Jupyter.CreateNotebook.png "Create a new Jupyter notebook")

3. A new notebook is created and opened with the name Untitled.pynb. Click the notebook name at the top, and enter a friendly name.

	![Provide a name for the notebook](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Note.Jupyter.Notebook.Name.png "Provide a name for the notebook")

4. Import the required modules and create the Spark and Hive contexts. Paste the following snippet in an empty cell, and then press **SHIFT + ENTER**.

		from pyspark import SparkContext
		from pyspark.sql import *
		from pyspark.sql import HiveContext

		# Create Spark and Hive contexts
		sc = SparkContext('spark://headnodehost:7077', 'pyspark')
		hiveCtx = HiveContext(sc)

	Everytime you run a job in Jupyter, your web browser window title will show a **(Busy)** status along with the notebook title. You will also see a solid circle next to the **Python 2** text in the top-right corner. After the job completes, this will change to a hollow circle.

	 ![Status of a Jupyter notebook job](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Jupyter.Job.Status.png "Status of a Jupyter notebook job")

4. Load sample data into a temporary table. When you provision a Spark cluster in HDInsight, the sample data file, **hvac.csv**, is copied to the associated storage account under **\HdiSamples\SensorSampleData\hvac**.

	In an empty cell, paste the following snippet and press **SHIFT + ENTER**. This snippet registers the data into a Hive table called **hvac**.


		# Create an RDD from sample data
		hvacText = sc.textFile("wasb:///HdiSamples/SensorSampleData/hvac/HVAC.csv")
		
		# Parse the data and create a schema
		hvacParts = hvacText.map(lambda s: s.split(",")).filter(lambda s: s[0] != "Date")
		hvac = hvacParts.map(lambda p: {"Date": str(p[0]), "Time": str(p[1]), "TargetTemp": int(p[2]), "ActualTemp": int(p[3]), "BuildingID": int(p[6])})
		
		# Infer the schema and create a table		
		hvacTable = hiveCtx.inferSchema(hvac)
		hvacTable.registerAsTable("hvactemptable")
		hvacTable.saveAsTable("hvac")

5. Verify that the table was successfully created. In an empty cell in the notebook, copy the following snippet and press **SHIFT + ENTER**.

		hiveCtx.sql("SHOW TABLES").show()

	You will see an output like the following:

		tableName       isTemporary
		hvactemptable   true       
		hivesampletable false      
		hvac            false

	Only the tables that have false under the **isTemporary** column are hive tables that will be stored in the metastore and can be accessed from the BI tools. In this tutorial, we will connect to the **hvac** table we just created.

6. Verify that the table contains the intended data. In an empty cell in the notebook, copy the following snippet and press **SHIFT + ENTER**.

		hiveCtx.sql("SELECT * FROM hvac LIMIT 10").show()
	
7. You can now exit the notebook by restarting the kernel. From the top menu bar, click **Kernel**, click **Restart**, and then click **Restart** again at the prompt.

	![Restart the Jupyter Kernel](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Jupyter.Restart.Kernel.png "Restart the Jupyter Kernel")

##<a name="powerbi"></a>Use Power BI to analyze data in the Hive table

Once you have saved the data as a Hive table, you can use Power BI to connect to the data and visualize it to create reports, dashboards, etc.

1. Sign in to [Power BI](http://www.powerbi.com/).

2. On the Welcome screen, click **Databases & More**.

	![Get data into Power BI](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.PowerBI.Get.Data.png "Get data into Power BI")

3. On the next screen, click **Spark** and then click **Connect**.

4. On the Spark on Azure HDInsight page, provide the values to connect to your Spark cluster and then click **Connect**.

	![Connect to a Spark cluster on HDInsight](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.PowerBI.Connect.Spark.png "Connect to a Spark cluster on HDInsight")

	After the connection is established, Power BI starts importing data from the Spark cluster on HDInsight.

5. Power BI imports the data and displays the new dashboard. A new data set is also added under the **Datasets** heading. Click the Spark tile on the dashboard to open a worksheet to visualize the data.

	![Spark tile on Power BI dashboard](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.PowerBI.Tile.png "Spark tile on Power BI dashboard")

6. Notice that the **Fields** list on the right lists the **hvac** table you created earlier. Expand the table to see the fields in the table, as you defined in notebook earlier.

	  ![List Hive tables](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.PowerBI.Display.Tables.png "List Hive tables")

7. Build a visualization to show the variance between target temperature and actual temperature for each building. To do so, drag-and-drop the **BuildingID** field under **Axis**, and **ActualTemp**/**TargetTemp** fields under **Value**.

	![Create visualizations](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.PowerBI.Visual.1.png "Create visualizations")

	Also, select **Area Map** (shown in red) to visualize your data.

8. By default the visualization shows the sum for **ActualTemp** and **TargetTemp**. For both the fields, from the drop-down, select **Average** to get an average of actual and target temperatures for both buildings.

	![Create visualizations](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.PowerBI.Visual.2.png "Create visualizations")

9. Your data visualization should be similar to the following. Move your cursor over the visualization to get tool tips with relevant data.

	![Create visualizations](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.PowerBI.Visual.3.png "Create visualizations")

10. Click **Save** from the top menu and provide a report name. You can also pin the visual. When you pin a visualization, it will be stored on your dashboard so you can track the latest value at a glance. 

	You can add as many visualizations as you want for the same dataset and pin them to the dashboard for a snapshot of your data. Also, Spark clusters on HDInsight are connected to Power BI with direct connect. This means that Power BI always has the most up-to-date from your cluster so you do not need to schedule refreshes for the dataset.

##<a name="tableau"></a>Use Tableau Desktop to analyze data in the Hive table
	
1. Launch Tableau Desktop. In the left pane, from the list of server to connect to, click **Spark SQL**.

2. In the Spark SQL connection dialog box, provide the values as shown below, and then click **OK**.

	![Connect to a Spark cluster](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Connect.png "Connect to a Spark cluster")

	The authentication drop-down lists **Windows** **Azure HDInsight Service** as an option, only if you installed the [Microsoft Spark ODBC Driver](http://go.microsoft.com/fwlink/?LinkId=616229) on the computer.

3. On the next screen, from the **Schema** drop-down, click the **Find** icon, and then click **default**.

	![Find schema](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Find.Schema.png "Find schema")

4. For the **Table** field, click the **Find** icon again to list all the Hive tables available in the cluster. You should see the **hvac** table you created earlier using the notebook.

	![Find tables](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Find.Table.png "Find tables")

5. Drag and drop the table to the top box on the right. Tableau imports the data and displays the schema as highlighted by the red box.

	![Add tables to Tableau](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Drag.Table.png "Add tables to Tableau")

6. Click the **Sheet1** tab at the bottom left. Make a visualization that shows the average target and actual temperatures for all buildings for each date. Drag **Date** and **Building ID** to **Columns** and **Actual Temp**/**Target Temp** to **Rows**. Under **Marks**, select **Area** to use an area map visualization.

	 ![Add fields for visualization](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Drag.Fields.png "Add fields for visualization")

7. By default, the temperature fields are shown as aggregate. If you want to show the average temperatures instead, you can do so from the drop-down, as shown below.

	![Take average of temperature](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Temp.Avg.png "Take average of temperature")

8. You can also super-impose one temperature map over the other to get a better feel of difference between target and actual temperatures. Move the mouse to the corner of the lower area map till you see the handle shape highlighted in a red circle above. Drag the map to the other map on the top and release the mouse when you see the shape highlighted in red rectangle above.

	![Merge maps](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Merge.png "Merge maps")

	 Your data visualization should change to the following:

	![Visualization](./media/hdinsight-apache-spark-use-bi-tools/HDI.Spark.Tableau.Final.Visual.png "Visualization")
	 
9. Click **Save** to save the worksheet. You can create dashboards and add one or more sheets to it.

##<a name="seealso"></a>See also

* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview.md)
* [Quick Start: Provision Apache Spark on HDInsight and run interactive queries using Spark SQL](hdinsight-apache-spark-zeppelin-notebook-jupyter-spark-sql.md)
* [Use Spark in HDInsight for building machine learning applications](hdinsight-apache-spark-ipython-notebook-machine-learning.md)
* [Use Spark in HDInsight for building real-time streaming applications](hdinsight-apache-spark-csharp-apache-zeppelin-eventhub-streaming.md)
* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)


[hdinsight-versions]: ../hdinsight-component-versioning/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-storage]: ../hdinsight-use-blob-storage/


[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: ../storage-create-storage-account/ 
