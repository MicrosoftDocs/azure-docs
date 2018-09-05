---
title: Create an Apache Spark machine learning pipeline - Azure HDInsight 
description: Use the Apache Spark machine learning library to create data pipelines.
services: hdinsight
ms.service: hdinsight
author: maxluk
ms.author: maxluk
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/19/2018
---
# Create a Spark machine learning pipeline

Apache Spark's scalable machine learning library (MLlib)  brings modeling capabilities to a  distributed environment. The Spark package [`spark.ml`](http://spark.apache.org/docs/latest/ml-pipeline.html) is a  set of high-level APIs built on DataFrames. These APIs help you create and tune practical machine-learning pipelines.  *Spark machine learning*  refers to this MLlib DataFrame-based API, not the  older RDD-based pipeline API.

A machine learning (ML) pipeline is  a complete workflow  combining multiple machine learning algorithms together. There can be many steps required to process and learn from data, requiring  a sequence of algorithms. Pipelines  define the stages and ordering of a machine learning process. In MLlib, stages of a pipeline are represented by a specific sequence of PipelineStages, where a Transformer and an Estimator each perform tasks.

A Transformer is an algorithm that transforms one DataFrame to another by using the `transform()` method. For example, a feature transformer could read one column of a DataFrame, map it to another column, and output a new DataFrame with the mapped column appended to it.

An Estimator is an abstraction of learning algorithms, and is responsible for fitting or training on a dataset to produce a Transformer. An Estimator implements a method named `fit()`, which accepts a DataFrame and produces a DataFrame, which is a Transformer.

Each stateless instance of a Transformer or an Estimator has its own unique identifier, which is used when specifying parameters. Both use a uniform API for specifying these parameters.

## Pipeline example

To demonstrate a practical use of an ML pipeline, this example uses the sample `HVAC.csv` data file that comes pre-loaded on the default storage for your HDInsight cluster, either  Azure Storage or Data Lake Store. To view the contents of the file, navigate to the `/HdiSamples/HdiSamples/SensorSampleData/hvac` directory. `HVAC.csv` contains a set of times with both target and actual temperatures for HVAC (*heating, ventilation, and air conditioning*) systems in various buildings. The goal is to train the model on the data, and produce a forecast temperature for a given building.

The following code:

1. Defines a `LabeledDocument`, which stores the `BuildingID`, `SystemInfo` (a system's identifier and age), and a `label` (1.0 if the building is too hot, 0.0 otherwise).
2. Creates a custom parser function `parseDocument` that takes a line (row) of data and determines whether the building is "hot" by comparing the target  temperature to the actual temperature.
3. Applies the parser when extracting the source data.
4. Creates training data.

```python
# The data structure (column meanings) of the data array:
# 0 Date
# 1 Time
# 2 TargetTemp
# 3 ActualTemp
# 4 System
# 5 SystemAge
# 6 BuildingID

LabeledDocument = Row("BuildingID", "SystemInfo", "label")

# Define a function that parses the raw CSV file and returns an object of type LabeledDocument
def parseDocument(line):
    values = [str(x) for x in line.split(',')]
    if (values[3] > values[2]):
        hot = 1.0
    else:
        hot = 0.0        

    textValue = str(values[4]) + " " + str(values[5])

    return LabeledDocument((values[6]), textValue, hot)

# Load the raw HVAC.csv file, parse it using the function
data = sc.textFile("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv")

documents = data.filter(lambda s: "Date" not in s).map(parseDocument)
training = documents.toDF()
```

This example pipeline has three stages: `Tokenizer` and `HashingTF` (both Transformers), and `Logistic Regression` (an Estimator).  The extracted and parsed data in the `training` DataFrame flows through the pipeline when `pipeline.fit(training)` is called.

1. The first stage, `Tokenizer`, splits the `SystemInfo` input column (consisting of  the system identifier and age values) into a `words` output column. This new `words` column is added to the DataFrame. 
2. The second stage, `HashingTF`, converts the new `words` column into feature vectors. This new  `features` column is added to the DataFrame. These first two stages are Transformers. 
3. The third stage, `LogisticRegression`, is an Estimator, and so the pipeline calls the `LogisticRegression.fit()` method to produce a `LogisticRegressionModel`. 

```python
tokenizer = Tokenizer(inputCol="SystemInfo", outputCol="words")
hashingTF = HashingTF(inputCol=tokenizer.getOutputCol(), outputCol="features")
lr = LogisticRegression(maxIter=10, regParam=0.01)

# Build the pipeline with our tokenizer, hashingTF, and logistic regression stages
pipeline = Pipeline(stages=[tokenizer, hashingTF, lr])

model = pipeline.fit(training)
```

To see the new `words` and `features` columns added by the `Tokenizer` and `HashingTF` transformers, and a sample of the `LogisticRegression` estimator, run a `PipelineModel.transform()` method on the original DataFrame. In production code, the next step would be to pass in a test DataFrame to validate the training.

```python
peek = model.transform(training)
peek.show()

# Outputs the following:
+----------+----------+-----+--------+--------------------+--------------------+--------------------+----------+
|BuildingID|SystemInfo|label|   words|            features|       rawPrediction|         probability|prediction|
+----------+----------+-----+--------+--------------------+--------------------+--------------------+----------+
|         4|     13 20|  0.0|[13, 20]|(262144,[250802,2...|[0.11943986671420...|[0.52982451901740...|       0.0|
|        17|      3 20|  0.0| [3, 20]|(262144,[89074,25...|[0.17511205617446...|[0.54366648775222...|       0.0|
|        18|     17 20|  1.0|[17, 20]|(262144,[64358,25...|[0.14620993833623...|[0.53648750722548...|       0.0|
|        15|      2 23|  0.0| [2, 23]|(262144,[31351,21...|[-0.0361327091023...|[0.49096780538523...|       1.0|
|         3|      16 9|  1.0| [16, 9]|(262144,[153779,1...|[-0.0853679939336...|[0.47867095324139...|       1.0|
|         4|     13 28|  0.0|[13, 28]|(262144,[69821,25...|[0.14630166986618...|[0.53651031790592...|       0.0|
|         2|     12 24|  0.0|[12, 24]|(262144,[187043,2...|[-0.0509556393066...|[0.48726384581522...|       1.0|
|        16|     20 26|  1.0|[20, 26]|(262144,[128319,2...|[0.33829638728900...|[0.58377663577684...|       0.0|
|         9|      16 9|  1.0| [16, 9]|(262144,[153779,1...|[-0.0853679939336...|[0.47867095324139...|       1.0|
|        12|       6 5|  0.0|  [6, 5]|(262144,[18659,89...|[0.07513008136562...|[0.51877369045183...|       0.0|
|        15|     10 17|  1.0|[10, 17]|(262144,[64358,25...|[-0.0291988646553...|[0.49270080242078...|       1.0|
|         7|      2 11|  0.0| [2, 11]|(262144,[212053,2...|[0.03678030020834...|[0.50919403860812...|       0.0|
|        15|      14 2|  1.0| [14, 2]|(262144,[109681,2...|[0.06216423725633...|[0.51553605651806...|       0.0|
|         6|       3 2|  0.0|  [3, 2]|(262144,[89074,21...|[0.00565582077537...|[0.50141395142468...|       0.0|
|        20|     19 22|  0.0|[19, 22]|(262144,[139093,2...|[-0.0769288695989...|[0.48077726176073...|       1.0|
|         8|     19 11|  0.0|[19, 11]|(262144,[139093,2...|[0.04988910033929...|[0.51246968885151...|       0.0|
|         6|      15 7|  0.0| [15, 7]|(262144,[77099,20...|[0.14854929135994...|[0.53706918109610...|       0.0|
|        13|      12 5|  0.0| [12, 5]|(262144,[89689,25...|[-0.0519932532562...|[0.48700461408785...|       1.0|
|         4|      8 22|  0.0| [8, 22]|(262144,[98962,21...|[-0.0120753606650...|[0.49698119651572...|       1.0|
|         7|      17 5|  0.0| [17, 5]|(262144,[64358,89...|[-0.0721054054871...|[0.48198145477106...|       1.0|
+----------+----------+-----+--------+--------------------+--------------------+--------------------+----------+

only showing top 20 rows
```

The `model` object can now be used to make predictions. For the  full sample of this machine learning application, and step-by-step instructions for running it, see [Build Apache Spark machine learning applications on Azure HDInsight](apache-spark-ipython-notebook-machine-learning.md).

## See also

* [Data Science using Scala and Spark on Azure](../../machine-learning/team-data-science-process/scala-walkthrough.md)
