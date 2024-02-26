---
title: How to use Delta Lake in Azure HDInsight on AKS with Apache Spark™ cluster.
description: Learn how to use Delta Lake scenario in Azure HDInsight on AKS with Apache Spark™ cluster. 
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/27/2023
---

# Use Delta Lake in Azure HDInsight on AKS with Apache Spark™ cluster (Preview)

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

[Azure HDInsight on AKS](../overview.md) is a managed cloud-based service for big data analytics that helps organizations process large amounts data. This tutorial shows how to use Delta Lake in Azure HDInsight on AKS with Apache Spark™ cluster.

## Prerequisite

1. Create an [Apache Spark™ cluster in Azure HDInsight on AKS](./create-spark-cluster.md)

    :::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/create-spark-cluster.png" alt-text="Screenshot showing  spark cluster creation." lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/create-spark-cluster.png":::

1. Run Delta Lake scenario in Jupyter Notebook. Create a Jupyter notebook and select "Spark" while creating a notebook, since the following example is in Scala.
   
    :::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/delta-lake-scenario.png" alt-text="Screenshot showing how to run delta lake scenario." lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/delta-lake-scenario.png":::

## Scenario

* Read NYC Taxi Parquet Data format - List of Parquet files URLs are provided from [NYC Taxi & Limousine Commission](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page).
* For each url (file) perform some transformation and store in Delta format.
* Compute the average distance, average cost per mile and average cost from Delta Table using incremental load.
* Store computed value from Step#3 in Delta format into the KPI output folder.
* Create Delta Table on Delta Format output folder (auto refresh).
* The KPI output folder has multiple versions of the average distance and the average cost per mile for a trip.

### Provide require configurations for the delta lake

Delta Lake with Apache Spark Compatibility matrix - [Delta Lake](https://docs.delta.io/latest/releases.html), change Delta Lake version based on Apache Spark Version.
 ```
%%configure -f
{ "conf": {"spark.jars.packages": "io.delta:delta-core_2.12:1.0.1,net.andreinc:mockneat:0.4.8",
"spark.sql.extensions":"io.delta.sql.DeltaSparkSessionExtension",
"spark.sql.catalog.spark_catalog":"org.apache.spark.sql.delta.catalog.DeltaCatalog"
}
   }
```
:::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/delta-lake-configurations.png" alt-text="Screenshot showing delta lake configurations." border="true" lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/delta-lake-configurations.png":::

### List the data file

> [!NOTE]
> These file URLs are from [NYC Taxi & Limousine Commission](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page).
```
import java.io.File
import java.net.URL
import org.apache.commons.io.FileUtils
import org.apache.hadoop.fs._
    
// data file object is being used for future reference in order to read parquet files from HDFS
case class DataFile(name:String, downloadURL:String, hdfsPath:String)
    
// get Hadoop file system
val fs:FileSystem = FileSystem.get(spark.sparkContext.hadoopConfiguration)
    
val fileUrls= List(
"https://d37ci6vzurychx.cloudfront.net/trip-data/fhvhv_tripdata_2022-01.parquet"
    )
    
// Add a file to be downloaded with this Spark job on every node.
        val listOfDataFile = fileUrls.map(url=>{
        val urlPath=url.split("/") 
        val fileName = urlPath(urlPath.size-1)
        val urlSaveFilePath = s"/tmp/${fileName}"
        val hdfsSaveFilePath = s"/tmp/${fileName}"
        val file = new File(urlSaveFilePath)
        FileUtils.copyURLToFile(new URL(url), file)
        // copy local file to HDFS /tmp/${fileName}
        // use FileSystem.copyFromLocalFile(boolean delSrc, boolean overwrite, Path src, Path dst)
        fs.copyFromLocalFile(true,true,new org.apache.hadoop.fs.Path(urlSaveFilePath),new org.apache.hadoop.fs.Path(hdfsSaveFilePath))
        DataFile(urlPath(urlPath.size-1),url, hdfsSaveFilePath)
})
```

:::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/start-spark-application.png" alt-text="Screenshot showing how to start spark application." border="true" lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/start-spark-application.png":::
    
### Create output directory

The location where you want to create delta format output, change the `transformDeltaOutputPath` and `avgDeltaOutputKPIPath` variable if necessary,
* `avgDeltaOutputKPIPath` - to store average KPI in delta format
* `transformDeltaOutputPath` - store transformed output in delta format
```
import org.apache.hadoop.fs._

// this is used to store source data being transformed and stored delta format
val transformDeltaOutputPath = "/nyctaxideltadata/transform"
// this is used to store Average KPI data in delta format
val avgDeltaOutputKPIPath = "/nyctaxideltadata/avgkpi"
// this is used for POWER BI reporting to show Month on Month change in KPI (not in delta format)
val avgMoMKPIChangePath = "/nyctaxideltadata/avgMoMKPIChangePath"

// create directory/folder if not exist
def createDirectory(dataSourcePath: String) = {
    val fs:FileSystem = FileSystem.get(spark.sparkContext.hadoopConfiguration)
    val path =  new Path(dataSourcePath)
    if(!fs.exists(path) && !fs.isDirectory(path)) {
        fs.mkdirs(path)
    }
}

createDirectory(transformDeltaOutputPath)
createDirectory(avgDeltaOutputKPIPath)
createDirectory(avgMoMKPIChangePath)
```
:::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/create-output-directory.png" alt-text="Screenshot showing how to create output-directory." border="true" lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/create-output-directory.png":::

### Create Delta Format Data From Parquet Format

1. Input data is from `listOfDataFile`, where data downloaded from https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page
1. To demonstrate the Time travel and version, load the data individually
1. Perform transformation and compute following business KPI on incremental load:
    1. The average distance
    1. The average cost per mile
    1. The average cost
1. Save transformed and KPI data in delta format

    ```
    import org.apache.spark.sql.functions.udf
    import org.apache.spark.sql.DataFrame
    
    // UDF to compute sum of value paid by customer
    def totalCustPaid = udf((basePassengerFare:Double, tolls:Double,bcf:Double,salesTax:Double,congSurcharge:Double,airportFee:Double, tips:Double) => {
        val total = basePassengerFare + tolls + bcf + salesTax + congSurcharge + airportFee + tips
        total
    })
    
    // read parquet file from spark conf with given file input
    // transform data to compute total amount
    // compute kpi for the given file/batch data
    def readTransformWriteDelta(fileName:String, oldData:Option[DataFrame], format:String="parquet"):DataFrame = {
        val df = spark.read.format(format).load(fileName)
        val dfNewLoad= df.withColumn("total_amount",totalCustPaid($"base_passenger_fare",$"tolls",$"bcf",$"sales_tax",$"congestion_surcharge",$"airport_fee",$"tips"))
        // union with old data to compute KPI
        val dfFullLoad= oldData match {
            case Some(odf)=>
                    dfNewLoad.union(odf)
            case _ =>
                    dfNewLoad
        }
        dfFullLoad.createOrReplaceTempView("tempFullLoadCompute")
        val dfKpiCompute = spark.sql("SELECT round(avg(trip_miles),2) AS avgDist,round(avg(total_amount/trip_miles),2) AS avgCostPerMile,round(avg(total_amount),2) avgCost FROM tempFullLoadCompute")
        // save only new transformed data
        dfNewLoad.write.mode("overwrite").format("delta").save(transformDeltaOutputPath)
        //save compute KPI
        dfKpiCompute.write.mode("overwrite").format("delta").save(avgDeltaOutputKPIPath)
        // return incremental dataframe for next set of load
        dfFullLoad
    }
    
    // load data for each data file, use last dataframe for KPI compute with the current load
    def loadData(dataFile: List[DataFile], oldDF:Option[DataFrame]):Boolean = {
        if(dataFile.isEmpty) {    
            true
        } else {
            val nextDataFile = dataFile.head
            val newFullDF = readTransformWriteDelta(nextDataFile.hdfsPath,oldDF)
            loadData(dataFile.tail,Some(newFullDF))
        }
    }
    val starTime=System.currentTimeMillis()
    loadData(listOfDataFile,None)
    println(s"Time taken in Seconds: ${(System.currentTimeMillis()-starTime)/1000}")
    ```
    :::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/data-delta-format.png" alt-text="Screenshot showing how to data in delta format." border="true" lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/data-delta-format.png":::
1. Read delta format using Delta Table
    1. read transformed data
    1. read KPI data
    
    ```
    import io.delta.tables._
    val dtTransformed: io.delta.tables.DeltaTable = DeltaTable.forPath(transformDeltaOutputPath)
    val dtAvgKpi: io.delta.tables.DeltaTable = DeltaTable.forPath(avgDeltaOutputKPIPath)
    ```
    :::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/read-kpi-data.png" alt-text="Screenshot showing read KPI data." border="true" lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/read-kpi-data.png":::
1. Print Schema
   1. Print Delta Table Schema for transformed and average KPI data1.

    ```
    // tranform data schema
    dtTransformed.toDF.printSchema
    // Average KPI Data Schema
    dtAvgKpi.toDF.printSchema
    ```
    :::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/print-schema.png" alt-text="Screenshot showing print schema output.":::

1. Display Last Computed KPI from Data Table
    
    `dtAvgKpi.toDF.show(false)`

    :::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/computed-kpi-from-data-table.png" alt-text="Screenshot showing last computed KPI from data table.":::

### Display Computed KPI History

This step displays history of KPI transaction table from `_delta_log`

`dtAvgKpi.history().show(false)`

:::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/computed-kpi-history.png" alt-text="Screenshot showing computed KPI history." border="true" lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/computed-kpi-history.png":::

### Display KPI data after each data load

1. Using Time travel you can view KPI changes after each load
1. You can store all version changes in CSV format at `avgMoMKPIChangePath` , so that Power BI can read these changes

```
val dfTxLog = spark.read.json(s"${transformDeltaOutputPath}/_delta_log/*.json")
dfTxLog.select(col("add")("path").alias("file_path")).withColumn("version",substring(input_file_name(),-6,1)).filter("file_path is not NULL").show(false)
```

:::image type="content" source="./media/azure-hdinsight-spark-on-aks-delta-lake/data-after-each-data-load.png" alt-text="Screenshot KPI data after each data load." border="true" lightbox="./media/azure-hdinsight-spark-on-aks-delta-lake/data-after-each-data-load.png":::

## Reference

* Apache, Apache Spark, Spark, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).

