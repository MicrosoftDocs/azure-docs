---
title: 'Tutorial: Use R in a Spark compute context in Azure HDInsight'
description: Tutorial - Get started with R and Spark on ML Services.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: tutorial
ms.date: 06/21/2019
#Customer intent: As a developer, I need understand the spark compute context for ML Services.
---

# Tutorial: Use R in a Spark compute context in Azure HDInsight

This tutorial provides a step-by-step introduction to using the R functions in Apache Spark running on an ML Services cluster in Azure HDInsight.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Download sample data to local storage
> * Copy data to default storage
> * Set up data set
> * Create data source
> * Create compute context for Spark
> * Fit a linear model
> * Use composite XDF files
> * Convert XDF to CSV

## Prerequisites

* An ML Services cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md) and select **ML Services** for **Cluster type**.

## Connect to RStudio Server

RStudio Server runs on the cluster’s edge node. Go to the following URL where `CLUSTERNAME` is the name of the ML Services cluster you created:

```
https://CLUSTERNAME.azurehdinsight.net/rstudio/
```

The first time you sign in you need to authenticate twice. For the first authentication prompt, provide the cluster Admin login and password, default is `admin`. For the second authentication prompt, provide the SSH login and password, default is `sshuser`. Subsequent sign-ins only require the SSH credentials.

## Download sample data

The *Airline 2012 On-Time Data Set* consists of 12 comma-separated files containing information on flight arrival and departure details for all commercial flights within the USA, for the year 2012. This is a big data set with over six million observations.

1. Initialize a few environment variables. Enter the following code in the RStudio Server console:

    ```R
    bigDataDirRoot <- "/tutorial/data" # root directory on cluster default storage
    localDir <- "/tmp/AirOnTimeCSV2012" # directory on edge node
    remoteDir <- "https://packages.revolutionanalytics.com/datasets/AirOnTimeCSV2012" # location of data
    ```

    The variables will appear on the right side of the screen under the **Environment** tab.

    ![RStudio](./media/ml-services-tutorial-spark-compute/rstudio.png)

2.  Create local directory and download sample data. Enter the following code in RStudio:

    ```R
    # Create local directory
    dir.create(localDir)
    
    # Download data to the tmp folder(local)
    download.file(file.path(remoteDir, "airOT201201.csv"), file.path(localDir, "airOT201201.csv"))
    download.file(file.path(remoteDir, "airOT201202.csv"), file.path(localDir, "airOT201202.csv"))
    download.file(file.path(remoteDir, "airOT201203.csv"), file.path(localDir, "airOT201203.csv"))
    download.file(file.path(remoteDir, "airOT201204.csv"), file.path(localDir, "airOT201204.csv"))
    download.file(file.path(remoteDir, "airOT201205.csv"), file.path(localDir, "airOT201205.csv"))
    download.file(file.path(remoteDir, "airOT201206.csv"), file.path(localDir, "airOT201206.csv"))
    download.file(file.path(remoteDir, "airOT201207.csv"), file.path(localDir, "airOT201207.csv"))
    download.file(file.path(remoteDir, "airOT201208.csv"), file.path(localDir, "airOT201208.csv"))
    download.file(file.path(remoteDir, "airOT201209.csv"), file.path(localDir, "airOT201209.csv"))
    download.file(file.path(remoteDir, "airOT201210.csv"), file.path(localDir, "airOT201210.csv"))
    download.file(file.path(remoteDir, "airOT201211.csv"), file.path(localDir, "airOT201211.csv"))
    download.file(file.path(remoteDir, "airOT201212.csv"), file.path(localDir, "airOT201212.csv"))
    ```

    The download should complete in about 9 and a half minutes.

## Copy data to default storage

The HDFS location is specified with the `airDataDir` variable. Enter the following code in RStudio:

```R
# Set directory in bigDataDirRoot to load the data into
airDataDir <- file.path(bigDataDirRoot,"AirOnTimeCSV2012")

# Create directory (default storage)
rxHadoopMakeDir(airDataDir)

# Copy data from local storage to default storage
rxHadoopCopyFromLocal(localDir, bigDataDirRoot)
    
# Optional. Verify files
rxHadoopListFiles(airDataDir)
```

The step should complete in about 10 seconds.

## Set up data set

1. Create a file system object that uses the default values. Enter the following code in RStudio:

    ```R
    # Define the HDFS (WASB) file system
    hdfsFS <- RxHdfsFileSystem()
    ```

2. The original CSV files have rather unwieldy variable names, so we supply a `colInfo` list to make them more manageable. Enter the following code in RStudio:

    ```R
    airlineColInfo <- list(
         MONTH = list(newName = "Month", type = "integer"),
        DAY_OF_WEEK = list(newName = "DayOfWeek", type = "factor",
            levels = as.character(1:7),
            newLevels = c("Mon", "Tues", "Wed", "Thur", "Fri", "Sat",
                          "Sun")),
        UNIQUE_CARRIER = list(newName = "UniqueCarrier", type =
                                "factor"),
        ORIGIN = list(newName = "Origin", type = "factor"),
        DEST = list(newName = "Dest", type = "factor"),
        CRS_DEP_TIME = list(newName = "CRSDepTime", type = "integer"),
        DEP_TIME = list(newName = "DepTime", type = "integer"),
        DEP_DELAY = list(newName = "DepDelay", type = "integer"),
        DEP_DELAY_NEW = list(newName = "DepDelayMinutes", type =
                             "integer"),
        DEP_DEL15 = list(newName = "DepDel15", type = "logical"),
        DEP_DELAY_GROUP = list(newName = "DepDelayGroups", type =
                               "factor",
           levels = as.character(-2:12),
           newLevels = c("< -15", "-15 to -1","0 to 14", "15 to 29",
                         "30 to 44", "45 to 59", "60 to 74",
                         "75 to 89", "90 to 104", "105 to 119",
                         "120 to 134", "135 to 149", "150 to 164",
                         "165 to 179", ">= 180")),
        ARR_DELAY = list(newName = "ArrDelay", type = "integer"),
        ARR_DELAY_NEW = list(newName = "ArrDelayMinutes", type =
                             "integer"),  
        ARR_DEL15 = list(newName = "ArrDel15", type = "logical"),
        AIR_TIME = list(newName = "AirTime", type =  "integer"),
        DISTANCE = list(newName = "Distance", type = "integer"),
        DISTANCE_GROUP = list(newName = "DistanceGroup", type =
                             "factor",
         levels = as.character(1:11),
         newLevels = c("< 250", "250-499", "500-749", "750-999",
             "1000-1249", "1250-1499", "1500-1749", "1750-1999",
             "2000-2249", "2250-2499", ">= 2500")))
    
    varNames <- names(airlineColInfo)
    ```

## Create data source

In a Spark compute context, you can create data sources using the following functions:

|Function | Description |
|---------|-------------|
|`RxTextData` | A comma-delimited text data source. |
|`RxXdfData` | Data in the XDF data file format. In RevoScaleR, the XDF file format is modified for Hadoop to store data in a composite set of files rather than a single file. |
|`RxHiveData` | Generates a Hive Data Source object.|
|`RxParquetData` | Generates a Parquet Data Source object.|
|`RxOrcData` | Generates an Orc Data Source object.|

Create an [RxTextData](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxtextdata) object using the files you copied to HDFS. Enter the following code in RStudio:

```R
airDS <- RxTextData( airDataDir,
                        colInfo = airlineColInfo,
                        varsToKeep = varNames,
                        fileSystem = hdfsFS ) 
```

## Create compute context for Spark

To load data and run analyses on worker nodes, you set the compute context in your script to [RxSpark](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxspark). In this context, R functions automatically distribute the workload across all the worker nodes, with no built-in requirement for managing jobs or the queue. The Spark compute context is established through `RxSpark` or `rxSparkConnect()` to create the Spark compute context, and uses `rxSparkDisconnect()` to return to a local compute context. Enter the following code in RStudio:

```R
# Define the Spark compute context
mySparkCluster <- RxSpark()

# Set the compute context
rxSetComputeContext(mySparkCluster)
```

## Fit a linear model

1. Use the [rxLinMod](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxlinmod) function to fit a linear model using your `airDS` data source. Enter the following code in RStudio:

    ```R
    system.time(
         delayArr <- rxLinMod(ArrDelay ~ DayOfWeek, data = airDS,
              cube = TRUE)
    )
    ```
    
    This step should complete in between 2 and 3 minutes.

1. View the results. Enter the following code in RStudio:

    ```R
    summary(delayArr)
    ```

    You should see the following results:

    ```output
    Call:
    rxLinMod(formula = ArrDelay ~ DayOfWeek, data = airDS, cube = TRUE)
    
    Cube Linear Regression Results for: ArrDelay ~ DayOfWeek
    Data: airDataXdf (RxXdfData Data Source)
    File name: /tutorial/data/AirOnTimeCSV2012
    Dependent variable(s): ArrDelay
    Total independent variables: 7 
    Number of valid observations: 6005381
    Number of missing observations: 91381 
     
    Coefficients:
                   Estimate Std. Error t value Pr(>|t|)     | Counts
    DayOfWeek=Mon   3.54210    0.03736   94.80 2.22e-16 *** | 901592
    DayOfWeek=Tues  1.80696    0.03835   47.12 2.22e-16 *** | 855805
    DayOfWeek=Wed   2.19424    0.03807   57.64 2.22e-16 *** | 868505
    DayOfWeek=Thur  4.65502    0.03757  123.90 2.22e-16 *** | 891674
    DayOfWeek=Fri   5.64402    0.03747  150.62 2.22e-16 *** | 896495
    DayOfWeek=Sat   0.91008    0.04144   21.96 2.22e-16 *** | 732944
    DayOfWeek=Sun   2.82780    0.03829   73.84 2.22e-16 *** | 858366
    ---
    Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
    
    Residual standard error: 35.48 on 6005374 degrees of freedom
    Multiple R-squared: 0.001827 (as if intercept included)
    Adjusted R-squared: 0.001826 
    F-statistic:  1832 on 6 and 6005374 DF,  p-value: < 2.2e-16 
    Condition number: 1 
    ```

    Notice that the results indicate we have processed all the data, six million observations, using all the .csv files in the specified directory. Notice also that because we specified `cube = TRUE`, we have an estimated coefficient for each day of the week (and not the intercept).

## Use composite XDF files

As we have seen, you can analyze CSV files directly with R on Hadoop, but the analysis can be done more quickly if the data is stored in a more efficient format. The R .xdf format is extremely efficient, but is modified somewhat for HDFS so that individual files remain within a single HDFS block. (The HDFS block size varies from installation to installation but is typically either 64 MB or 128 MB.) When you use [rxImport](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rximport) on Hadoop, you specify an `RxTextData` data source such as `AirDS` as the inData and an `RxXdfData` data source with fileSystem set to an HDFS file system as the outFile argument to create a set of composite .xdf files. The `RxXdfData` object can then be used as the data argument in subsequent R analyses.

1. Define an `RxXdfData` object. Enter the following code in RStudio:

    ```R
    airDataXdfDir <- file.path(bigDataDirRoot,"AirOnTimeXDF2012")
    
    airDataXdf <- RxXdfData( airDataXdfDir,
                            fileSystem = hdfsFS )
    ```

1. Set a block size of 250000 rows and specify that we read all the data. Enter the following code in RStudio:

    ```R
    blockSize <- 250000
    numRowsToRead = -1
    ```

1. Import the data using `rxImport`. Enter the following code in RStudio:

    ```R
    rxImport(inData = airDS,
             outFile = airDataXdf,
             rowsPerRead = blockSize,
             overwrite = TRUE,
             numRows = numRowsToRead )
    ```
    
    This step should complete in a few minutes.

1. Re-estimate the same linear model, using the new, faster data source. Enter the following code in RStudio:

    ```R
    system.time(
         delayArr <- rxLinMod(ArrDelay ~ DayOfWeek, data = airDataXdf,
              cube = TRUE)
    )
    ```
    
    The step should complete in less than a minute.

1. View the results. The results should be the same as from the CSV files. Enter the following code in RStudio:

    ```R
    summary(delayArr)
    ```

## Convert XDF to CSV

### In a Spark context

If you converted your CSV to XDF to take advantage of the efficiency while running analyses, but now wish to convert your data back to CSV you can do so using [rxDataStep](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxdatastep).

To create a folder of CSV files, first create an `RxTextData` object using a directory name as the file argument; this represents the folder in which to create the CSV files. This directory is created when you run the `rxDataStep`. Then, point to this `RxTextData` object in the `outFile` argument of the `rxDataStep`. Each CSV created will be named based on the directory name and followed by a number.

Suppose we want to write out a folder of CSV in HDFS from our `airDataXdf` composite XDF after we performed the logistic regression and prediction, so that the new CSV files contain the predicted values and residuals. Enter the following code in RStudio:

```R
airDataCsvDir <- file.path(bigDataDirRoot,"AirDataCSV2012")
airDataCsvDS <- RxTextData(airDataCsvDir,fileSystem=hdfsFS)
rxDataStep(inData=airDataXdf, outFile=airDataCsvDS)
```

This step should complete in about two and a half minutes.

You notice that the `rxDataStep` wrote out one CSV for every .xdfd file in the input composite XDF file. This is the default behavior for writing CSV from composite XDF to HDFS when the compute context is set to `RxSpark`.

### In a local context

Alternatively, you could switch your compute context back to `local` when you are done performing your analyses and take advantage of two arguments within `RxTextData` that give you slightly more control when writing out CSV files to HDFS: `createFileSet` and `rowsPerOutFile`. When `createFileSet` is set to `TRUE`, a folder of CSV files is written to the directory you specify. When `createFileSet` is set to `FALSE` a single CSV file is written. The second argument, `rowsPerOutFile`, can be set to an integer to indicate how many rows to write to each CSV file when `createFileSet` is `TRUE`.

Enter the following code in RStudio:

```R
rxSetComputeContext("local")
airDataCsvRowsDir <- file.path(bigDataDirRoot,"AirDataCSVRows2012")
airDataCsvRowsDS <- RxTextData(airDataCsvRowsDir, fileSystem=hdfsFS, createFileSet=TRUE, rowsPerOutFile=1000000)
rxDataStep(inData=airDataXdf, outFile=airDataCsvRowsDS)
```

This step should complete in about 10 minutes.

When using an `RxSpark` compute context, `createFileSet` defaults to `TRUE` and `rowsPerOutFile` has no effect. Thus if you wish to create a single CSV or customize the number of rows per file you must perform the `rxDataStep` in a `local` compute context (data can still be in HDFS).

## Final steps

1. Clean up Data. Enter the following code in RStudio:

    ```R
    rxHadoopRemoveDir(airDataDir)
    rxHadoopRemoveDir(airDataXdfDir)
    rxHadoopRemoveDir(airDataCsvDir)
    rxHadoopRemoveDir(airDataCsvRowsDir)
    rxHadoopRemoveDir(bigDataDirRoot)
    ```

1. Stop the remote Spark application. Enter the following code in RStudio:

    ```R
    rxStopEngine(mySparkCluster)
    ```

1. Quit the R session. Enter the following code in RStudio:

    ```R
    quit()
    ```

## Clean up resources

After you complete the tutorial, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

To delete a cluster, see [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](../hdinsight-delete-cluster.md).

## Next steps

In this tutorial, you learned how to use R functions in Apache Spark running on an ML Services cluster in Azure HDInsight. For more information, see the following articles:

* [Compute context options for ML Services on HDInsight](r-server-compute-contexts.md)
* [R Functions for Spark on Hadoop](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/revoscaler-hadoop-functions)
