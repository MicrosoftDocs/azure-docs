---
title: Use R for Apache Spark
description: Learn about using R and Apache Spark to do data preparation and machine learning in Azure Synapse Analytics notebooks.
author: midesa
ms.author: midesa
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: spark
ms.date: 09/27/2022 
---

# Use R for Apache Spark with Azure Synapse Analytics (Preview)

Azure Synapse Analytics provides built-in R support for Apache Spark. As part of this, data scientists can leverage Azure Synapse Analytics notebooks to write and run their R code. This also includes support for [SparkR](https://spark.apache.org/docs/latest/sparkr.html) and [SparklyR](https://spark.rstudio.com/), which allows users to interact with Spark using familiar Spark or R interfaces.

In this article, you will learn how to use R for Apache Spark with Azure Synapse Analytics.

## R Runtime

Azure Synapse Analytics supports an R runtime which features many popular open-source R packages, including TidyVerse. The R runtime is available on all Apache Spark 3 pools. 

To learn more about the libraries installed on each runtime, you can visit the following page:
    - [Azure Synapse Analytics Runtimes](./apache-spark-version-support.md)

## Create and run notebook sessions

An Azure Synapse notebook is a web interface for you to create files that contain live code, visualizations, and narrative text. Notebooks are a good place to validate ideas and use quick experiments to get insights from your data. Notebooks are also widely used in data preparation, data visualization, machine learning, and other big data scenarios. 

To get started with R in Synapse notebooks, you can change the primary language by setting the **language option** to *SparkR (R)*.

   ![Screenshot of the R language option.](./media/apache-spark-data-viz/r-language-option.png#lightbox)

In addition, you can use multiple languages in one notebook by specifying the language magic command at the beginning of a cell.

```r
%%sparkr
# Enter your R code here
```

To learn more about notebooks within Azure Synapse Analytics, you can visit the guide on how to [manage notebooks](./apache-spark-development-using-notebooks.md).

## Install packages

Libraries provide reusable code that you might want to include in your programs or projects. To make third party or locally built code available to your applications, you can install a library onto one of your serverless Apache Spark pools or notebook session.

### Manage R workspace packages

In Synapse, workspace packages can be custom or private **R tar.gz** files. You can upload these packages to your workspace and later assign them to a specific serverless Apache Spark pool. Once assigned, these workspace packages are installed automatically on all Spark pool sessions started on the corresponding pool.

To learn more about how to manage workspace libraries, see the following article:
    - [Manage workspace packages](./apache-spark-manage-workspace-packages.md)

### Manage R sessions

When doing interactive data analysis or machine learning, you might try newer packages or you might need packages that are currently unavailable on your Apache Spark pool. Instead of updating the pool configuration, users can now use session-scoped packages to add, manage, and update session dependencies.

  - When you install session-scoped libraries, only the current notebook has access to the specified libraries.
  - These libraries will not impact other sessions or jobs using the same Spark pool.
  - These libraries are installed on top of the base runtime and pool level libraries.
  - Notebook libraries will take the highest precedence.
  - Session-scoped R libraries do not persist across sessions. These libraries will be installed at the start of each session when the related installation commands are executed
  - Session-scoped R libraries are automatically installed across both the driver and worker nodes

For example, users can install an R library from CRAN and CRAN snapshots. In the example below, *Highcharter* is a popular package for R visualizations. I can install this package on all nodes within my Apache Spark pool using the following command:

```r
install.packages("highcharter", repos = "https://cran.microsoft.com/snapshot/2021-07-16/")
```

To learn more about how to manage session R libraries, you can visit the following article: [manage R session packages](./apache-spark-manage-session-packages.md#session-scoped-r-packages-preview)

## Notebook Utilities

Microsoft Spark Utilities (MSSparkUtils) is a built-in package to help you easily perform common tasks. You can use MSSparkUtils to work with file systems, to get environment variables, to chain notebooks together, and to work with secrets. MSSparkUtils is supported for R notebooks.

To get started, you can run the following commands:

```r
library(notebookutils)
mssparkutils.fs.help()
```

You can learn more about the supported MSSparkUtils commands by visiting the following article: [use Microsoft Spark Utilities](./microsoft-spark-utilities.md)

## Use SparkR

[SparkR](https://spark.apache.org/docs/latest/sparkr.html) is an R package that provides a light-weight frontend to use Apache Spark from R. SparkR provides a distributed data frame implementation that supports operations like selection, filtering, aggregation etc. SparkR also supports distributed machine learning using MLlib.

### Create a SparkR Dataframe from a local R data.frame

The simplest way to create a DataFrame is to convert a local R data.frame into a SparkDataFrame. In this example, we use ```as.DataFrame``` and pass in the local R dataframe to create the SparkDataFrame.  

```r
df <- as.DataFrame(faithful)

# Displays the first part of the SparkDataFrame
head(df)
##  eruptions waiting
##1     3.600      79
##2     1.800      54
```

### Create a SparkR dataframe using the Spark data source API

SparkR supports operating on a variety of data sources through the SparkDataFrame interface. The general method for creating a DataFrame from a data source is ```read.df```. This method takes the path for the file to load and the type of data source. SparkR supports reading CSV, JSON, text, and Parquet files natively.

```r
# Read a csv from ADLSg2
df <- read.df('abfss://<container name>@<storage account name>.dfs.core.windows.net/avocado.csv', 'csv', header="true")
head(df)
```

### Create a SparkR dataframe using Spark SQL

You can also create SparkR DataFrames using Spark SQL queries.

```r
# Register this SparkDataFrame as a temporary view.
createOrReplaceTempView(df, "eruptions")

# SQL statements can be run by using the sql method
sql_df <- sql("SELECT * FROM eruptions")
head(sql_df)
```

### Machine learning

SparkR exposes most of MLLib algorithms. Under the hood, SparkR uses MLlib to train the model. To learn more about which machine learning algorithms are supported, you can visit the [documentation for SparkR and MLlib](https://spark.apache.org/docs/latest/sparkr.html#machine-learning).

```r
# Create the DataFrame
cars <- cbind(model = rownames(mtcars), mtcars)
carsDF <- createDataFrame(cars)

# Fit a linear model over the dataset.
model <- spark.glm(carsDF, mpg ~ wt + cyl)

# Model coefficients are returned in a similar format to R's native glm().
summary(model)
```

## Use SparklyR

[SparklyR](https://spark.rstudio.com/) is an R interface to Apache Spark. It provides a mechanism to interact with Spark using familiar R interfaces.

To establish a ```sparklyr``` connection, you can use the following connection method in ```spark_connect()```.

```r
spark_version <- "<enter Spark version>"
config <- spark_config()
sc <- spark_connect(master = "yarn", version = spark_version, spark_home = "/opt/spark", config = config, method='synapse')
```

## Next steps

- [Create R Visualizations](./apache-spark-data-visualization.md#r-libraries-preview)
