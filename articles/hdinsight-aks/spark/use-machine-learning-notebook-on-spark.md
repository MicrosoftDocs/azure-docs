---
title: How to use Azure Machine Learning Notebook on Spark
description: Learn how to Azure Machine Learning notebook on Spark
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# How to use Azure Machine Learning Notebook on Spark

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Machine learning is a growing technology, which enables computers to learn automatically from past data. Machine learning uses various algorithms for building mathematical models and making predictions use historical data or information. We have a model defined up to some parameters, and learning is the execution of a computer program to optimize the parameters of the model using the training data or experience. The model may be predictive to make predictions in the future, or descriptive to gain knowledge from data.

The following tutorial notebook shows an example of training machine learning models on tabular data. You can import this notebook and run it yourself.

## Upload the CSV into your storage

1. Find your storage and container name in the portal JSON view

   :::image type="content" source="./media/use-machine-learning-notebook-on-spark/json-view.png" alt-text="Screenshot showing JSON view." lightbox="./media/use-machine-learning-notebook-on-spark/json-view.png":::
   
   :::image type="content" source="./media/use-machine-learning-notebook-on-spark/resource-json.png" alt-text="Screenshot showing resource JSON view." lightbox="./media/use-machine-learning-notebook-on-spark/resource-json.png":::
        
1. Navigate into your primary HDI storage>container>base folder> upload the [CSV](https://github.com/Azure-Samples/hdinsight-aks/blob/main/spark/iris_csv.csv)

    :::image type="content" source="./media/use-machine-learning-notebook-on-spark/navigate-to-storage-container.png" alt-text="Screenshot showing how to navigate to storage and container." lightbox="./media/use-machine-learning-notebook-on-spark/navigate-to-storage-container.png":::

    :::image type="content" source="./media/use-machine-learning-notebook-on-spark/upload-csv.png" alt-text="Screenshot showing how to upload CSV file." lightbox="./media/use-machine-learning-notebook-on-spark/upload-csv.png":::
    
1. Log in to your cluster and open the Jupyter Notebook 

    :::image type="content" source="./media/use-machine-learning-notebook-on-spark/jupyter-notebook.png" alt-text="Screenshot showing Jupyter Notebook." lightbox="./media/use-machine-learning-notebook-on-spark/jupyter-notebook.png":::

1. Import Spark MLlib Libraries to create the pipeline
    ```
    import pyspark
    from pyspark.ml import Pipeline, PipelineModel
    from pyspark.ml.classification import LogisticRegression
    from pyspark.ml.feature import VectorAssembler, StringIndexer, IndexToString
    ```
    :::image type="content" source="./media/use-machine-learning-notebook-on-spark/start-spark-application.png" alt-text="Screenshot showing how to start spark application.":::


1. Read the CSV into a Spark dataframe

    `df = spark.read.("abfss:///iris_csv.csv",inferSchema=True,header=True)`
1. Split the data for training and testing

    `iris_train, iris_test = df.randomSplit([0.7, 0.3], seed=123)`

1. Create the pipeline and train the model

    ```
    assembler = VectorAssembler(inputCols=['sepallength', 'sepalwidth', 'petallength', 'petalwidth'],outputCol="features",handleInvalid="skip")
    indexer = StringIndexer(inputCol="class", outputCol="classIndex", handleInvalid="skip")
    classifier = LogisticRegression(featuresCol="features",
                                    labelCol="classIndex",
                                    maxIter=10,
                                    regParam=0.01)
    
    pipeline = Pipeline(stages=[assembler,indexer,classifier])
    model = pipeline.fit(iris_train)
    
    # Create a test `dataframe` with predictions from the trained model

    test_model = model.transform(iris_test)

    # Taking an output from the test dataframe with predictions
    
    test_model.take(1)
    ```

    :::image type="content" source="./media/use-machine-learning-notebook-on-spark/test-model.png" alt-text="Screenshot showing how to run the test model.":::

1. Evaluate the model accuracy

    ```
    import pyspark.ml.evaluation as ev
    evaluator = ev.MulticlassClassificationEvaluator(labelCol='classIndex')

    print(evaluator.evaluate(test_model,{evaluator.metricName: 'accuracy'}))
    ```
    :::image type="content" source="./media/use-machine-learning-notebook-on-spark/print-output.png" alt-text="Screenshot showing how to print output.":::

