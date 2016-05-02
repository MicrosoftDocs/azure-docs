<properties
	pageTitle="Advanced data exploration and modeling with Spark | Microsoft Azure"
	description="TBD."
	services="machine-learning"
	documentationCenter=""
	authors="bradsev,deguhath,gokuma"
	manager="paulettm"
	editor="cgronlun"  />

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/02/2016"
	ms.author="deguhath;bradsev" />

# Advanced data exploration and modeling with Spark 

[AZURE.INCLUDE [machine-learning-spark-modeling](../../includes/machine-learning-spark-modeling.md)]

This walkthrough uses HDInsight Spark to do data exploration and binary classification and regression modeling tasks using cross-validation and hyperparameter optimization to train the models on a sample of the NYC taxi trip and fare 2013 dataset. It walks you through the steps of the [Data Science Process](http://aka.ms/datascienceprocess), end-to-end, using an HDInsight Spark cluster for processing and Azure blobs to store the data and the models. The process explores and visualizes data brought in from an Azure Storage Blob and then prepares the data to build predictive models. Python has been used to code the solution and to show the relevant plots. These models are build using the Spark MLlib toolkit to do binary classification and regression modeling tasks.

- The **binary classification** task is to predict whether or not a tip is paid for the trip. 
- The **regression** task is to predict the amount of the tip based on other tip features. 

The modeling steps also contain code showing how to train, evaluate and save each type of model. The topic covers some of the same ground as the [Data exploration and modeling with Spark](machine-learning-data-science-spark-data-exploration-modeling.md) topic, but is said to be "advanced" in that it also uses cross-validation in conjunction with hyperparameter sweeping to train optimally accurate classification and regression models. 

**Cross-validation (CV)** is a technique that assesses how well a model trained on a known set of data will generalize to predicting the features of datasets on which it has not been trained. The general idea behind this technique is that a model is trained on a dataset of known data on and then the accuracy of its predictions is tested against an independent dataset. A common implementation used here is to divide a dataset into K folds and then train the model in a round-robin fashion on all but one of the folds. 

**Hyperparameter optimization** is the problem of choosing a set of hyperparameters for a learning algorithm, usually with the goal of optimizing a measure of the algorithm's performance on an independent data set. **Hyperparameters** are values that must be specified outside of the model training procedure. Assumptions about these values can impact the flexibility and accuracy of the models. Decision trees have hyperparameters, for example, such as the desired depth and number of leaves in the tree. Support Vector Machines (SVMs) require setting a misclassification penalty term. 

A common way to perform hyperparameter optimization used here is a grid search, or a **parameter sweep**. This consist of performing an exhaustive search through the values a specified subset of the hyperparameter space for a learning algorithm. Cross validation can supply a performance metric to sort out the optimal results produced by the grid search algorithm. CV used with hyperparameter sweeping helps limit problems like overfitting a model to training data so that  the model retains the capacity to apply to the general set of data from which the training data was extracted.

The models we use include logistic and linear regression, random forests and gradient boosted trees:

- [Linear regression with SGD](https://spark.apache.org/docs/latest/api/python/pyspark.mllib.html#pyspark.mllib.regression.LinearRegressionWithSGD) is a linear regression model that uses a Stochastic Gradient Descent (SGD) method and for optimization and feature scaling to predict the tip amounts paid. 
- [Logistic regression with LBFGS](https://spark.apache.org/docs/latest/api/python/pyspark.mllib.html#pyspark.mllib.classification.LogisticRegressionWithLBFGS) or "logit" regression, is a regression model that can be used when the dependent variable is categorical to do data classification. LBFGS is a quasi-Newton optimization algorithm that approximates the Broyden–Fletcher–Goldfarb–Shanno (BFGS) algorithm using a limited amount of computer memory and that is widely used in machine learning.
- [Random forests](http://spark.apache.org/docs/latest/mllib-ensembles.html#Random-Forests) are ensembles of decision trees.  They combine many decision trees in order to reduce the risk of overfitting. Random forests are used for regression and classification and can handle categorical features, extend to the multiclass classification setting, do not require feature scaling, and are able to capture non-linearities and feature interactions. Random forests are one of the most successful machine learning models for classification and regression.
- [Gradient boosted trees](http://spark.apache.org/docs/latest/ml-classification-regression.html#gradient-boosted-trees-gbts) (GBTs) are ensembles of decision trees. GBTs train decision trees iteratively to minimize a loss function. GBTs are used for regression and classification and can handle categorical features, do not require feature scaling, and are able to capture non-linearities and feature interactions. They can also be used in a multiclass-classification setting.

Modeling examples using CV and Hyperparameter sweep are shown for the binary classification problem. Simpler examples (without parameter sweeps) are presented in the main topic for regression tasks. But in the appendix, validation using elastic net for linear regression and CV with parameter sweep using for random forest regression are also presented. The **elastic net** is a regularized regression method for fitting linear regression models that linearly combines the L1 and L2 metrics as penalties of the [lasso](https://en.wikipedia.org/wiki/Lasso%20%28statistics%29) and [ridge](https://en.wikipedia.org/wiki/Tikhonov_regularization) methods.   



>[AZURE.NOTE] Although the Spark MLlib toolkit is designed to work on large datasets, for purposes of demonstrating its modeling capabilities, a relatively small sample (~30 Mb using 170K rows, about 0.1% of the original NYC dataset) is used, for convenience. The exercise given here runs efficiently on an HDInsight cluster with 2 worker nodes (in about 10 minutes). The same code, with minor modifications, can be used to process larger data-sets, with appropriate modifications for caching data in memory or changing the cluster size.


## Prerequisites

You need an Azure account and an HDInsight Spark You need an HDInsight 3.4 Spark 1.6 cluster to complete this walkthrough. See the [Overview of Data Science using Spark on Azure HDInsight](machine-learning-data-science-spark-overview.md) for these requirements, for a description of the NYC 2013 Taxi data used here, and for instructions on how execute code from a Jupyter notebook on the Spark cluster. The **machine-learning-data-science-spark-data-exploration-modeling.ipynb** notebook that contains the code samples in this topic are available in [Github](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/Spark/pySpark).


[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]


## Setup: storage locations, libraries and Spark context

Spark is able to read and write to Azure Storage Blob (also known as WASB). So any of your existing data stored there can be processed using Spark and the results stored again in WASB.

To save models or files in WASB, the path needs to be specified properly. The default container attached to the Spark cluster can be referenced using a path beginning with: "wasb///". Other locations are referenced by “wasb://”.

### Set directory paths for storage locations in WASB

The following code sample specifies the location of the data to be read and the path for the model storage directory to which the model output will be saved.

	# SET PATHS TO FILE LOCATIONS: DATA AND MODEL STORAGE

	# LOCATION OF TRAINING DATA
	taxi_train_file_loc = "wasb://mllibwalkthroughs@cdspsparksamples.blob.core.windows.net/Data/NYCTaxi/JoinedTaxiTripFare.Point1Pct.Train.tsv";

	
	# SET THE MODEL STORAGE DIRECTORY PATH 
	# NOTE THAT THE FINAL BACKSLASH IN THE PATH IS NEEDED.
	modelDir = "wasb:///user/remoteuser/NYCTaxi/Models/";

TBD: Explain
Creating SparkContext as 'sc'
Creating HiveContext as 'sqlContext'

	# PRINT START TIME
	import datetime
	datetime.datetime.now()

**OUTPUT**

datetime.datetime(2016, 4, 18, 17, 36, 27, 832799)


### Import libraries

Import necessary libraries with the following code.

	# LOAD PYSPARK LIBRARIES
	import pyspark
	from pyspark import SparkConf
	from pyspark import SparkContext
	from pyspark.sql import SQLContext
	import matplotlib
	import matplotlib.pyplot as plt
	from pyspark.sql import Row
	from pyspark.sql.functions import UserDefinedFunction
	from pyspark.sql.types import *
	import atexit
	from numpy import array
	import numpy as np
	import datetime
	

## Data ingestion: 

This section contains the code for a series of tasks required to ingest the data sample to be modeled. Read in a joined 0.1% sample of the taxi trip and fare file (stored as a .tsv file), format and clean the data, create and cache a data frame in memory, and then register it as a temp-table in SQL-context.

The first step in the data science process is to ingest the data to be analyzed from external sources or systems where is resides into your data exploration and modeling environment. This environment is Spark in this walkthrough. This section contains the code to complete a series of tasks:

- ingest the data sample to be modeled
- read in the input dataset (stored as a .tsv file)
- format and clean the data
- create and cache objects (RDDs or data-frames) in memory
- register it as a temp-table in SQL-context.

Here is the code for data ingestion.


	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# IMPORT FILE FROM PUBLIC BLOB
	taxi_train_file = sc.textFile(taxi_train_file_loc)
	
	# GET SCHEMA OF THE FILE FROM HEADER
	schema_string = taxi_train_file.first()
	fields = [StructField(field_name, StringType(), True) for field_name in schema_string.split('\t')]
	fields[7].dataType = IntegerType() #Pickup hour
	fields[8].dataType = IntegerType() # Pickup week
	fields[9].dataType = IntegerType() # Weekday
	fields[10].dataType = IntegerType() # Passenger count
	fields[11].dataType = FloatType() # Trip time in secs
	fields[12].dataType = FloatType() # Trip distance
	fields[19].dataType = FloatType() # Fare amount
	fields[20].dataType = FloatType() # Surcharge
	fields[21].dataType = FloatType() # Mta_tax
	fields[22].dataType = FloatType() # Tip amount
	fields[23].dataType = FloatType() # Tolls amount
	fields[24].dataType = FloatType() # Total amount
	fields[25].dataType = IntegerType() # Tipped or not
	fields[26].dataType = IntegerType() # Tip class
	taxi_schema = StructType(fields)
	
	# PARSE FIELDS AND CONVERT DATA TYPE FOR SOME FIELDS
	taxi_header = taxi_train_file.filter(lambda l: "medallion" in l)
	taxi_temp = taxi_train_file.subtract(taxi_header).map(lambda k: k.split("\t"))\
	        .map(lambda p: (p[0],p[1],p[2],p[3],p[4],p[5],p[6],int(p[7]),int(p[8]),int(p[9]),int(p[10]),
	                        float(p[11]),float(p[12]),p[13],p[14],p[15],p[16],p[17],p[18],float(p[19]),
	                        float(p[20]),float(p[21]),float(p[22]),float(p[23]),float(p[24]),int(p[25]),int(p[26])))
	
	    
	# CREATE A CLEANED DATA-FRAME BY DROPPING SOME UN-NECESSARY COLUMNS & FILTERING FOR UNDESIRED VALUES OR OUTLIERS
	taxi_df_train_cleaned = taxi_train_df.drop('medallion').drop('hack_license').drop('store_and_fwd_flag').drop('pickup_datetime')\
	    .drop('dropoff_datetime').drop('pickup_longitude').drop('pickup_latitude').drop('dropoff_latitude')\
	    .drop('dropoff_longitude').drop('tip_class').drop('total_amount').drop('tolls_amount').drop('mta_tax')\
	    .drop('direct_distance').drop('surcharge')\
	    .filter("passenger_count > 0 and passenger_count < 8 AND payment_type in ('CSH', 'CRD') AND tip_amount >= 0 AND tip_amount < 30 AND fare_amount >= 1 AND fare_amount < 150 AND trip_distance > 0 AND trip_distance < 100 AND trip_time_in_secs > 30 AND trip_time_in_secs < 7200" )
	
	# CACHE DATA-FRAME IN MEMORY & MATERIALIZE DF IN MEMORY
	taxi_df_train_cleaned.cache()
	taxi_df_train_cleaned.count()
	
	# REGISTER DATA-FRAME AS A TEMP-TABLE IN SQL-CONTEXT
	taxi_df_train_cleaned.registerTempTable("taxi_train")
	
	# PRINT HOW MUCH TIME IT TOOK TO RUN THE CELL
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

Time taken to execute above cell: 9.02 seconds


## Data exploration & visualization 

Once the data has been brought into Spark, the next step in the data science process is to gain deeper understanding of the data through exploration and visualization. In this section we examine the taxi data using SQL queries and plot the target variables and prospective features for visual inspection. Specifically, we plot the frequency of passenger counts in taxi trips, the frequency of tip amounts, and how tips vary by payment amount and type.

### Plot a histogram of passenger count frequencies in the sample of taxi trips

The code uses a SQL squery to sample the data and converts the results to a Pandas data frame to plot.

	# PLOT FREQUENCY OF PASSENGER COUNTS IN TAXI TRIPS

	# SQL SQUERY
	%%sql -q -o sqlResults
	SELECT passenger_count, COUNT(*) as trip_counts FROM taxi_train WHERE passenger_count > 0 and passenger_count < 7 GROUP BY passenger_count
	
	# PLOT PASSENGER NUMBER VS TRIP COUNTS
	%%local
	import matplotlib.pyplot as plt
	%matplotlib inline
	
	x_labels = sqlResults['passenger_count'].values
	fig = sqlResults[['trip_counts']].plot(kind='bar', facecolor='lightblue')
	fig.set_xticklabels(x_labels)
	fig.set_title('Counts of trips by passenger count')
	fig.set_xlabel('Passenger count in trips')
	fig.set_ylabel('Trip counts')
	plt.show()

**OUTPUT**

![Frequency of trips by passenger count](./media/machine-learning-data-science-spark-advanced-data-exploration-modeling/frequency-of-trips-by-passenger-count.png)


### Plot a histogram of tip amounts and how tip amount varies by passenger count and fare amounts.

The code uses a SQL squery to sample the data.

	
	# SQL SQUERY
	%%sql -q -o sqlResults
	    SELECT fare_amount, passenger_count, tip_amount, tipped
	    FROM taxi_train 
	    WHERE passenger_count > 0 
		AND passenger_count < 7
	    AND fare_amount > 0 
		AND fare_amount < 200
	    AND payment_type in ('CSH', 'CRD')
	    AND tip_amount > 0 
		AND tip_amount < 25
	
	# SET CONTEXT
	%%local
	%matplotlib inline
	
	# TIP BY PAYMENT TYPE AND PASSENGER COUNT
	ax1 = resultsPDDF[['tip_amount']].plot(kind='hist', bins=25, facecolor='lightblue')
	ax1.set_title('Tip amount distribution')
	ax1.set_xlabel('Tip Amount ($)')
	ax1.set_ylabel('Counts')
	plt.suptitle('')
	plt.show()
	
	# TIP BY PASSENGER COUNT
	ax2 = resultsPDDF.boxplot(column=['tip_amount'], by=['passenger_count'])
	ax2.set_title('Tip amount ($) by Passenger count')
	ax2.set_xlabel('Passenger count')
	ax2.set_ylabel('Tip Amount ($)')
	plt.suptitle('')
	plt.show()
	
	# TIP AMOUNT BY FARE AMOUNT, POINTS ARE SCALED BY PASSENGER COUNT
	ax = resultsPDDF.plot(kind='scatter', x= 'fare_amount', y = 'tip_amount', c='blue', alpha = 0.10, s=5*(resultsPDDF.passenger_count))
	ax.set_title('Tip amount by Fare amount ($)')
	ax.set_xlabel('Fare Amount')
	ax.set_ylabel('Tip Amount')
	plt.axis([-2, 120, -2, 30])
	plt.show()
	
	# PRINT HOW MUCH TIME IT TOOK TO RUN THE CELL
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 

**OUTPUT:** 

![Tip amount distribution](./media/machine-learning-data-science-spark-advanced-data-exploration-modeling/tip-amount-distribution.png)

![Tip amount by passenger count](./media/machine-learning-data-science-spark-advanced-data-exploration-modeling/tip-amount-by-passenger-count.png)

![Tip amount by fare Amount](./media/machine-learning-data-science-spark-advanced-data-exploration-modeling/tip-amount-by-fare-amount.png)

Time taken to execute above cell: 10.42 seconds


## Feature engineering, transformation and data preparation for modeling

This section describes and provides the code for procedures used to prepare data for use in ML modeling. It shows how to do the following tasks:

- Create a new feature by binning hours into traffic time buckets
- Index and on-hot encode categorical features
- Create labeled point objects for input into ML functions
- Create a random sub-sampling of the data and split it into training and testing sets
- Feature scaling
- Cache objects in memory


### Create a new feature by binning hours into traffic time buckets

This code shows how to create a new feature by binning hours into traffic time buckets and then how to cache the resulting data frame in memory. Where Resilient Distributed Datasets (RDDs) and data-frames are used repeatedly, caching leads to improved execution times. Accordingly, we cache RDDs and data-frames at several stages in the walkthrough.

	# CREATE FOUR BUCKETS FOR TRAFFIC TIMES
	sqlStatement = """
	    SELECT *,
	    CASE
	     WHEN (pickup_hour <= 6 OR pickup_hour >= 20) THEN "Night" 
	     WHEN (pickup_hour >= 7 AND pickup_hour <= 10) THEN "AMRush" 
	     WHEN (pickup_hour >= 11 AND pickup_hour <= 15) THEN "Afternoon"
	     WHEN (pickup_hour >= 16 AND pickup_hour <= 19) THEN "PMRush"
	    END as TrafficTimeBins
	    FROM taxi_train 
	"""
	taxi_df_train_with_newFeatures = sqlContext.sql(sqlStatement)
	
	# CACHE DATA-FRAME IN MEMORY & MATERIALIZE DF IN MEMORY
	taxi_df_train_with_newFeatures.cache()
	taxi_df_train_with_newFeatures.count()

**OUTPUT**

126050


### Index and one-hot encode categorical features

This section shows how to index or encode categorical features for input into the modeling functions. The modeling and predict functions of MLlib require features with categorical input data to be indexed or encoded prior to use. 

Depending on the model, you need to index or encode them in different ways. For example, Logistic and Linear Regression models require one-hot encoding, where, for example, a feature with 3 categories can be expanded into 3 feature columns, with each containing 0 or 1 depending on the category of an observation. MLlib provides [OneHotEncoder](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html#sklearn.preprocessing.OneHotEncoder) function to do one-hot encoding. This encoder maps a column of label indices to a column of binary vectors, with at most a single one-value. This encoding allows algorithms which expect numerical valued features, such as logistic regression, to be applied to categorical features.

Here is the code to index and encode categorical features:


	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.ml.feature import OneHotEncoder, StringIndexer, VectorAssembler, OneHotEncoder, VectorIndexer
	
	# INDEX AND ENCODE VENDOR_ID
	stringIndexer = StringIndexer(inputCol="vendor_id", outputCol="vendorIndex")
	model = stringIndexer.fit(taxi_df_train_with_newFeatures) # Input data-frame is the cleaned one from above
	indexed = model.transform(taxi_df_train_with_newFeatures)
	encoder = OneHotEncoder(dropLast=False, inputCol="vendorIndex", outputCol="vendorVec")
	encoded1 = encoder.transform(indexed)
	
	# INDEX AND ENCODE RATE_CODE
	stringIndexer = StringIndexer(inputCol="rate_code", outputCol="rateIndex")
	model = stringIndexer.fit(encoded1)
	indexed = model.transform(encoded1)
	encoder = OneHotEncoder(dropLast=False, inputCol="rateIndex", outputCol="rateVec")
	encoded2 = encoder.transform(indexed)
	
	# INDEX AND ENCODE PAYMENT_TYPE
	stringIndexer = StringIndexer(inputCol="payment_type", outputCol="paymentIndex")
	model = stringIndexer.fit(encoded2)
	indexed = model.transform(encoded2)
	encoder = OneHotEncoder(dropLast=False, inputCol="paymentIndex", outputCol="paymentVec")
	encoded3 = encoder.transform(indexed)
	
	# INDEX AND TRAFFIC TIME BINS
	stringIndexer = StringIndexer(inputCol="TrafficTimeBins", outputCol="TrafficTimeBinsIndex")
	model = stringIndexer.fit(encoded3)
	indexed = model.transform(encoded3)
	encoder = OneHotEncoder(dropLast=False, inputCol="TrafficTimeBinsIndex", outputCol="TrafficTimeBinsVec")
	encodedFinal = encoder.transform(indexed)
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

Time taken to execute above cell: 2.45 seconds


### Create labeled point objects for input into ML functions

This section contains code that shows how to index categorical text data as a labeled point data type and encode it so that it can be used to train and test MLlib logistic regression and other classification models. Labeled point objects are Resilient Distributed Datasets (RDD) formatted in a way that is needed as input data by most of ML algorithms in MLlib. A [labeled point](https://spark.apache.org/docs/latest/mllib-data-types.html#labeled-point) is a local vector, either dense or sparse, associated with a label/response.


	# FUNCTIONS FOR BINARY CLASSIFICATION

	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.regression import LabeledPoint
	from numpy import array

	# INDEXING CATEGORICAL TEXT FEATURES FOR INPUT INTO TREE-BASED MODELS
	def parseRowIndexingBinary(line):
	    features = np.array([line.paymentIndex, line.vendorIndex, line.rateIndex, line.pickup_hour, line.weekday,
	                         line.passenger_count, line.trip_time_in_secs, line.trip_distance, line.fare_amount])
	    labPt = LabeledPoint(line.tipped, features)
	    return  labPt
	
	# ONE-HOT ENCODING OF CATEGORICAL TEXT FEATURES FOR INPUT INTO LOGISTIC RERESSION MODELS
	def parseRowOneHotBinary(line):
	    features = np.concatenate((np.array([line.pickup_hour, line.weekday, line.passenger_count,
	                                        line.trip_time_in_secs, line.trip_distance, line.fare_amount]), 
	                               line.vendorVec.toArray(), line.rateVec.toArray(), line.paymentVec.toArray()), axis=0)
	    labPt = LabeledPoint(line.tipped, features)
	    return  labPt


	# FUNCTIONS FOR REGRESSION WITH TIP AMOUNT AS TARGET VARIABLE

	# ONE-HOT ENCODING OF CATEGORICAL TEXT FEATURES FOR INPUT INTO TREE-BASED MODELS
	def parseRowIndexingRegression(line):
	    features = np.array([line.paymentIndex, line.vendorIndex, line.rateIndex, line.TrafficTimeBinsIndex, 
	                         line.pickup_hour, line.weekday, line.passenger_count, line.trip_time_in_secs, 
	                         line.trip_distance, line.fare_amount])
	    labPt = LabeledPoint(line.tip_amount, features)
	    return  labPt
	
	# INDEXING CATEGORICAL TEXT FEATURES FOR INPUT INTO LINEAR REGRESSION MODELS
	def parseRowOneHotRegression(line):
	    features = np.concatenate((np.array([line.pickup_hour, line.weekday, line.passenger_count,
	                                        line.trip_time_in_secs, line.trip_distance, line.fare_amount]), 
	                                        line.vendorVec.toArray(), line.rateVec.toArray(), 
	                                        line.paymentVec.toArray(), line.TrafficTimeBinsVec.toArray()), axis=0)
	    labPt = LabeledPoint(line.tip_amount, features)
	    return  labPt


### Create a random sub-sampling of the data and split it into training and testing sets

This code creates a random sampling of the data (25% is used here). Although it is not required for this example due to the size of the dataset, we demonstrate how you can sample here so you know how to use it for your own problem when needed. When samples are large, this can save significant time while training models. Next we split the sample into a training part (75% here) and a testing part (25% here) to use in classification and regression modeling.


	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# SPECIFY SAMPLING AND SPLITTING FRACTIONS
	from pyspark.sql.functions import rand
	
	samplingFraction = 0.25;
	trainingFraction = 0.75; testingFraction = (1-trainingFraction);
	seed = 1234;
	encodedFinalSampled = encodedFinal.sample(False, samplingFraction, seed=seed)
	
	# SPLIT SAMPLED DATA-FRAME INTO TRAIN/TEST, WITH A RANDOM COLUMN ADDED FOR DOING CV (SHOWN LATER)
	# INCLUDE RAND COLUMN FOR CREATING CROSS-VALIDATION FOLDS
	dfTmpRand = encodedFinalSampled.select("*", rand(0).alias("rand"));
	trainData, testData = dfTmpRand.randomSplit([trainingFraction, testingFraction], seed=seed);
	
	# CACHE TRAIN AND TEST DATA
	trainData.cache()
	testData.cache()
	
	# FOR BINARY CLASSIFICATION TRAINING AND TESTING
	indexedTRAINbinary = trainData.map(parseRowIndexingBinary)
	indexedTESTbinary = testData.map(parseRowIndexingBinary)
	oneHotTRAINbinary = trainData.map(parseRowOneHotBinary)
	oneHotTESTbinary = testData.map(parseRowOneHotBinary)
	
	# FOR REGRESSION TRAINING AND TESTING
	indexedTRAINreg = trainData.map(parseRowIndexingRegression)
	indexedTESTreg = testData.map(parseRowIndexingRegression)
	oneHotTRAINreg = trainData.map(parseRowOneHotRegression)
	oneHotTESTreg = testData.map(parseRowOneHotRegression)
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 

**OUTPUT**

Time taken to execute above cell: 0.25 seconds


### Feature scaling

Feature scaling, also known as data normalization, insures that features with widely disbursed values are not given excessive weigh in the objective function. The code for feature scaling uses the [StandardScaler](https://spark.apache.org/docs/latest/api/python/pyspark.mllib.html#pyspark.mllib.feature.StandardScaler) to scale the features to unit variance. It is provided by MLlib for use in linear regression with Stochastic Gradient Descent (SGD), a popular algorithm for training a wide range of other machine learning models such as regularized regressions or support vector machines (SVM).   


>[AZURE.NOTE] We have found the LinearRegressionWithSGD algorithm to be sensitive to feature scaling.   


Here is the code to scale to scale variables for use with the regularized linear SGD algorithm.

	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.regression import LabeledPoint
	from pyspark.mllib.linalg import Vectors
	from pyspark.mllib.feature import StandardScaler, StandardScalerModel
	from pyspark.mllib.util import MLUtils
	
	# SCALE VARIABLES FOR REGULARIZED LINEAR SGD ALGORITHM
	label = oneHotTRAINreg.map(lambda x: x.label)
	features = oneHotTRAINreg.map(lambda x: x.features)
	scaler = StandardScaler(withMean=False, withStd=True).fit(features)
	dataTMP = label.zip(scaler.transform(features.map(lambda x: Vectors.dense(x.toArray()))))
	oneHotTRAINregScaled = dataTMP.map(lambda x: LabeledPoint(x[0], x[1]))
	
	label = oneHotTESTreg.map(lambda x: x.label)
	features = oneHotTESTreg.map(lambda x: x.features)
	scaler = StandardScaler(withMean=False, withStd=True).fit(features)
	dataTMP = label.zip(scaler.transform(features.map(lambda x: Vectors.dense(x.toArray()))))
	oneHotTESTregScaled = dataTMP.map(lambda x: LabeledPoint(x[0], x[1]))
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 

**OUTPUT**

Time taken to execute above cell: 10.46 seconds

### Cache objects in memory

The time taken for training and testing of ML algorithms can be reduced by caching the input data frame objects used for classification, regression and scaled features.

	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# FOR BINARY CLASSIFICATION TRAINING AND TESTING
	indexedTRAINbinary.cache()
	indexedTESTbinary.cache()
	oneHotTRAINbinary.cache()
	oneHotTESTbinary.cache()
	
	# FOR REGRESSION TRAINING AND TESTING
	indexedTRAINreg.cache()
	indexedTESTreg.cache()
	oneHotTRAINreg.cache()
	oneHotTESTreg.cache()
	
	# SCALED FEATURES
	oneHotTRAINregScaled.cache()
	oneHotTESTregScaled.cache()
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 

**OUTPUT** 

Time taken to execute above cell: 0.13 seconds


## Predict whether or not a tip is paid with binary classification models

This section shows how use three models for the binary classification task of predicting whether or not a tip is paid for a taxi trip. The models presented are:

- Logistic regression 
- Random forest
- Gradient Boosting Trees

Each model building code section will be split into steps: 

1. **Model training** data with one parameter set
2. **Model evaluation** on a test data set with metrics
3. **Saving model** in blob for future consumption

We show how to do cross-validation (CV) with parameter sweeping in two ways:

1. Using  **generic** custom code which can be applied to any algorithm in MLlib and to any parameter sets in an algorithm. 
1. Using the **pySpark CrossValidator pipeline function**. Note that although convenient, based on our experience, CrossValidator has a few limitations for Spark 1.5.0: 

	- Pipeline models cannot be saved/persisted for future consumption.
	- Cannot be used for every parameter in a model.
	- Cannot be used for every MLlib algorithm.


### Generic cross validation and hyperparameter sweeping used with the logistic regression algorithm for binary classification

The code in this section shows how to train, evaluate, and save a logistic regression model with [LBFGS](https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm) that predicts whether or not a tip is paid for a trip in the NYC taxi trip and fare dataset. The model is trained using cross validation (CV) and hyperparameter sweeping implemented with custom code that can be applied to any of the learning algorithms in MLlib.   


>[AZURE.NOTE] The execution of this custom CV code can take several minutes.


	# LOGISTIC REGRESSION CLASSIFICATION WITH CV AND HYPERPARAMETER SWEEPING

	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.classification import LogisticRegressionWithLBFGS 
	from pyspark.mllib.evaluation import BinaryClassificationMetrics
	
	# CREATE PARAMETER GRID FOR LOGISTIC REGRESSION PARAMETER SWEEP
	from sklearn.grid_search import ParameterGrid
	grid = [{'regParam': [0.01, 0.1], 'iterations': [5, 10], 'regType': ["l1", "l2"], 'tolerance': [1e-3, 1e-4]}]
	paramGrid = list(ParameterGrid(grid))
	numModels = len(paramGrid)
	
	# SET NUM FOLDS AND NUM PARAMETER SETS TO SWEEP ON
	nFolds = 3;
	h = 1.0 / nFolds;
	metricSum = np.zeros(numModels);
	
	# BEGIN CV WITH PARAMETER SWEEP
	for i in range(nFolds):
	    # Create training and x-validation sets
	    validateLB = i * h
	    validateUB = (i + 1) * h
	    condition = (trainData["rand"] >= validateLB) & (trainData["rand"] < validateUB)
	    validation = trainData.filter(condition)
	    # Create labeled points from data-frames
	    if i > 0:
	        trainCVLabPt.unpersist()
	        validationLabPt.unpersist()
	    trainCV = trainData.filter(~condition)
	    trainCVLabPt = trainCV.map(parseRowOneHotBinary)
	    trainCVLabPt.cache()
	    validationLabPt = validation.map(parseRowOneHotBinary)
	    validationLabPt.cache()
	    # For parameter sets compute metrics from x-validation
	    for j in range(numModels):
	        regt = paramGrid[j]['regType']
	        regp = paramGrid[j]['regParam']
	        iters = paramGrid[j]['iterations']
	        tol = paramGrid[j]['tolerance']
	        # Train logistic regression model with hypermarameter set
	        model = LogisticRegressionWithLBFGS.train(trainCVLabPt, regType=regt, iterations=iters,  
	                                                  regParam=regp, tolerance = tol, intercept=True)
	        predictionAndLabels = validationLabPt.map(lambda lp: (float(model.predict(lp.features)), lp.label))
	        # Use ROC-AUC as accuracy metrics
	        validMetrics = BinaryClassificationMetrics(predictionAndLabels)
	        metric = validMetrics.areaUnderROC
	        metricSum[j] += metric
	
	avgAcc = metricSum / nFolds;
	bestParam = paramGrid[np.argmax(avgAcc)];
	
	# UNPERSIST OBJECTS
	trainCVLabPt.unpersist()
	validationLabPt.unpersist()
	    
	# TRAIN ON FULL TRAIING SET USING BEST PARAMETERS FROM CV/PARAMETER SWEEP
	logitBest = LogisticRegressionWithLBFGS.train(oneHotTRAINbinary, regType=bestParam['regType'], 
	                                              iterations=bestParam['iterations'], 
	                                              regParam=bestParam['regParam'], tolerance = bestParam['tolerance'], 
	                                              intercept=True)
	
	# PRINT ELAPSED TIME	
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

Time taken to execute above cell: 142.78 seconds


**Evaluate binary classification model with standard metrics, and plot ROC curve**

The code in this section shows how to evaluate a logistic regression model against a test data-set, including a plot of the ROC curve.


	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from sklearn.metrics import roc_curve,auc
	from pyspark.mllib.evaluation import BinaryClassificationMetrics
	from pyspark.mllib.evaluation import MulticlassMetrics
	
	# PREDICT ON TEST DATA WITH BEST/FINAL MODEL
	predictionAndLabels = oneHotTESTbinary.map(lambda lp: (float(logitBest.predict(lp.features)), lp.label))
	
	# INSTANTIATE METRICS OBJECT
	metrics = BinaryClassificationMetrics(predictionAndLabels)

	# AREA UNDER PRECISION-RECALL CURVE
	print("Area under PR = %s" % metrics.areaUnderPR)

	# AREA UNDER ROC CURVE
	print("Area under ROC = %s" % metrics.areaUnderROC)
	metrics = MulticlassMetrics(predictionAndLabels)

	# OVERALL STATISTICS
	precision = metrics.precision()
	recall = metrics.recall()
	f1Score = metrics.fMeasure()
	print("Summary Stats")
	print("Precision = %s" % precision)
	print("Recall = %s" % recall)
	print("F1 Score = %s" % f1Score)
	
	# OUTPUT PROBABILITIES AND REGISTER TEMP TABLE
	logitBest.clearThreshold(); # This clears threshold for classification (0.5) and outputs probabilities
	predictionAndLabelsDF = predictionAndLabels.toDF()
	predictionAndLabelsDF.registerTempTable("tmp_results");

	# PRINT ELAPSED TIME	
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

Area under PR = 0.984753146176

Area under ROC = 0.982986767486

Summary Stats

Precision = 0.983655467635

Recall = 0.983655467635

F1 Score = 0.983655467635

Time taken to execute above cell: 2.63 seconds



	# PLOT ROC-CURVE FROM PREDICTED PROBS AND LABELS 

    # SET CONTEXT AND IMPORT LIBRARIES                                
	%%local
	%matplotlib inline
	from sklearn.metrics import roc_curve,auc
	
	#PREDICTIONS
	predictions_pddf = sqlResults.rename(columns={'_1': 'probability', '_2': 'label'})
	prob = predictions_pddf["probability"] 
	fpr, tpr, thresholds = roc_curve(predictions_pddf['label'], prob, pos_label=1);
	roc_auc = auc(fpr, tpr)
	
	# PLOT ROC CURVES
	plt.figure(figsize=(5,5))
	plt.plot(fpr, tpr, label='ROC curve (area = %0.2f)' % roc_auc)
	plt.plot([0, 1], [0, 1], 'k--')
	plt.xlim([0.0, 1.0])
	plt.ylim([0.0, 1.05])
	plt.xlabel('False Positive Rate')
	plt.ylabel('True Positive Rate')
	plt.title('ROC Curve')
	plt.legend(loc="lower right")
	plt.show()
	

**OUTPUT**

![Logistic regression ROC curve for generic approach](./media/machine-learning-data-science-spark-advanced-data-exploration-modeling/logistic-regression-roc-curve.png)


**Persist model in a blob for future consumption**

The code in this section shows how to save the logistic regression model for consumption.

	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.classification import LogisticRegressionModel
	
	# PERSIST MODEL
	datestamp = unicode(datetime.datetime.now()).replace(' ','').replace(':','_');
	logisticregressionfilename = "LogisticRegressionWithLBFGS_" + datestamp;
	dirfilename = modelDir + logisticregressionfilename;
	
	logitBest.save(sc, dirfilename);
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds";


**OUTPUT**

Time taken to execute above cell: 23.4 seconds


### Use MLlib's CrossValidator pipeline function with LogisticRegression (Elastic regression) model

The code in this section shows how to train, evaluate, and save a logistic regression model with [LBFGS](https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm) that predicts whether or not a tip is paid for a trip in the NYC taxi trip and fare dataset. The model is trained using cross validation (CV) and hyperparameter sweeping implemented with the MLlib CrossValidator pipeline function for CV with parameter sweep.   


>[AZURE.NOTE] The execution of this MLlib CV code can take several minutes.


	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.ml.classification import LogisticRegression
	from pyspark.ml import Pipeline
	from pyspark.ml.evaluation import BinaryClassificationEvaluator
	from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
	from sklearn.metrics import roc_curve,auc
	
	# DEFINE ALGORITHM / MODEL
	lr = LogisticRegression()
	
	# DEFINE GRID PARAMETERS
	paramGrid = ParamGridBuilder().addGrid(lr.regParam, (0.01, 0.1))\
	                              .addGrid(lr.maxIter, (5, 10))\
	                              .addGrid(lr.tol, (1e-4, 1e-5))\
	                              .addGrid(lr.elasticNetParam, (0.25,0.75))\
	                              .build()
	
	# DEFINE CV WITH PARAMETER SWEEP
	cv = CrossValidator(estimator= lr,
	                    estimatorParamMaps=paramGrid,
	                    evaluator=BinaryClassificationEvaluator(),
	                    numFolds=3)
	
	# CONVERT TO DATA-FRAME: THIS WILL NOT RUN ON RDDs
	trainDataFrame = sqlContext.createDataFrame(oneHotTRAINbinary, ["features", "label"])
	
	# TRAIN WITH CROSS-VALIDATION
	cv_model = cv.fit(trainDataFrame)
	

	## PREDICT AND EVALUATE ON TEST DATA-SET

	# USE TEST DATASET FOR PREDICTION
	testDataFrame = sqlContext.createDataFrame(oneHotTESTbinary, ["features", "label"])
	test_predictions = cv_model.transform(testDataFrame)
	
	# CONVERT RTO PANDAS DATA-FRAME FOR CALCULATING AND PLOTTING ROC CURVE
	predictions_pddf = test_predictions.toPandas()
	predictions_pddf.dtypes
	prob = [x[1] for x in predictions_pddf["probability"]]
	fpr, tpr, thresholds = roc_curve(predictions_pddf['label'], prob, pos_label=1);
	roc_auc = auc(fpr, tpr)
	
	# PLOT ROC CURVE
	plt.figure(figsize=(5,5))
	plt.plot(fpr, tpr, label='ROC curve (area = %0.2f)' % roc_auc)
	plt.plot([0, 1], [0, 1], 'k--')
	plt.xlim([0.0, 1.0])
	plt.ylim([0.0, 1.05])
	plt.xlabel('False Positive Rate')
	plt.ylabel('True Positive Rate')
	plt.title('ROC Curve')
	plt.legend(loc="lower right")
	plt.show()
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds";

**OUTPUT**

Time taken to execute above cell: 102.37 seconds

usr/hdp/current/spark-client/python/pyspark/ml/classification.py:207: UserWarning: weights is deprecated. Use coefficients instead.
  warnings.warn("weights is deprecated. Use coefficients instead.")


	#QUERY
	%%sql -q -o sqlResults
	SELECT label, prediction, probability from tmp_results

    # SET CONTEXT AND IMPORT LIBRARIES  
	%%local
	from sklearn.metrics import roc_curve,auc
	
	# ROC CURVE
	prob = [x["values"][1] for x in sqlResults["probability"]]
	fpr, tpr, thresholds = roc_curve(sqlResults['label'], prob, pos_label=1);
	roc_auc = auc(fpr, tpr)
	
	#PLOT
	plt.figure(figsize=(5,5))
	plt.plot(fpr, tpr, label='ROC curve (area = %0.2f)' % roc_auc)
	plt.plot([0, 1], [0, 1], 'k--')
	plt.xlim([0.0, 1.0])
	plt.ylim([0.0, 1.05])
	plt.xlabel('False Positive Rate')
	plt.ylabel('True Positive Rate')
	plt.title('ROC Curve')
	plt.legend(loc="lower right")
	plt.show()


**OUTPUT**

![Logistic regression ROC curve using MLlib's CrossValidator](./media/machine-learning-data-science-spark-advanced-data-exploration-modeling/mllib-crossvalidator-roc-curve.png)



### Random forest classification

The code in this section shows how to train evaluate, and save a random forest regression that predicts whether or not a tip is paid for a trip in the NYC taxi trip and fare dataset.


	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.tree import RandomForest, RandomForestModel
	from pyspark.mllib.util import MLUtils
	from pyspark.mllib.evaluation import BinaryClassificationMetrics
	from pyspark.mllib.evaluation import MulticlassMetrics
	
	# SPECIFY NUMBER OF CATEGORIES FOR CATEGORICAL FEATURES. FEATURE #0 HAS 2 CATEGORIES, FEATURE #2 HAS 2 CATEGORIES, AND SO ON
	categoricalFeaturesInfo={0:2, 1:2, 2:6, 3:4}
	
	# TRAIN RANDOMFOREST MODEL
	rfModel = RandomForest.trainClassifier(indexedTRAINbinary, numClasses=2, 
	                                       categoricalFeaturesInfo=categoricalFeaturesInfo,
	                                       numTrees=25, featureSubsetStrategy="auto",
	                                       impurity='gini', maxDepth=5, maxBins=32)
	## UN-COMMENT IF YOU WANT TO PRING TREES
	#print('Learned classification forest model:')
	#print(rfModel.toDebugString())
	
	# PREDICT ON TEST DATA AND EVALUATE
	predictions = rfModel.predict(indexedTESTbinary.map(lambda x: x.features))
	predictionAndLabels = indexedTESTbinary.map(lambda lp: lp.label).zip(predictions)
	
	# AREA UNDER ROC CURVE
	metrics = BinaryClassificationMetrics(predictionAndLabels)
	print("Area under ROC = %s" % metrics.areaUnderROC)
	
	# PERSIST MODEL IN BLOB
	datestamp = unicode(datetime.datetime.now()).replace(' ','').replace(':','_');
	rfclassificationfilename = "RandomForestClassification_" + datestamp;
	dirfilename = modelDir + rfclassificationfilename;
	
	rfModel.save(sc, dirfilename);
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

Area under ROC = 0.984753146176

Time taken to execute above cell: 20.78 seconds


### Gradient boosting trees classification

The code in this section shows how to train evaluate, and save a gradient boosting trees model that predicts whether or not a tip is paid for a trip in the NYC taxi trip and fare dataset.


	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.tree import GradientBoostedTrees, GradientBoostedTreesModel
	
	# SPECIFY NUMBER OF CATEGORIES FOR CATEGORICAL FEATURES. FEATURE #0 HAS 2 CATEGORIES, FEATURE #2 HAS 2 CATEGORIES, AND SO ON
	categoricalFeaturesInfo={0:2, 1:2, 2:6, 3:4}
	
	gbtModel = GradientBoostedTrees.trainClassifier(indexedTRAINbinary, categoricalFeaturesInfo=categoricalFeaturesInfo,
	                                                numIterations=10)
	## UNCOMMENT IF YOU WANT TO PRINT TREE DETAILS
	#print('Learned classification GBT model:')
	#print(bgtModel.toDebugString())
	
	# PREDICT ON TEST DATA AND EVALUATE
	predictions = gbtModel.predict(indexedTESTbinary.map(lambda x: x.features))
	predictionAndLabels = indexedTESTbinary.map(lambda lp: lp.label).zip(predictions)
	
	# Area under ROC curve
	metrics = BinaryClassificationMetrics(predictionAndLabels)
	print("Area under ROC = %s" % metrics.areaUnderROC)
	
	# PERSIST MODEL IN A BLOB
	datestamp = unicode(datetime.datetime.now()).replace(' ','').replace(':','_');
	btclassificationfilename = "GradientBoostingTreeClassification_" + datestamp;
	dirfilename = modelDir + btclassificationfilename;
	
	gbtModel.save(sc, dirfilename)
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 

**OUTPUT**

Area under ROC = 0.984753146176

Time taken to execute above cell: 13.87 seconds


## Predict tip amount with regression models (not using CV)

This section shows how use three models for the regression task of predicting the amount of the tip paid for a taxi trip based on other tip features. The models presented are:

- Regularized linear regression
- Random forest
- Gradient Boosting Trees

These models were described in the introduction. Each model building code section will be split into steps: 

1. **Model training** data with one parameter set
2. **Model evaluation** on a test data set with metrics
3. **Saving model** in blob for future consumption   


>AZURE NOTE: Cross-validation is not used with the three regression models in this section. But an example showing how to use CV with Elastic Net for linear regression is provided in the Appendix of this topic.


>AZURE NOTE: In our experience, there can be issues with convergence of LinearRegressionWithSGD models, and parameters need to be changed/optimized carefully for obtaining a valid model. Scaling of variables significantly helps with convergence. Elastic net regression, shown in the Appendix to this topic, can also be use to improve convergence.


### Linear regression with SGD

The code in this section shows how to use scaled features to train a linear regression that uses stochastic gradient descent (SGD) for optimization, and how to score, evaluate, and save the model in Azure Blob Storage (WASB).


	# LINEAR REGRESSION WITH SGD 

	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.regression import LabeledPoint, LinearRegressionWithSGD, LinearRegressionModel
	from pyspark.mllib.evaluation import RegressionMetrics
	from scipy import stats
	
	# USE SCALED FEATURES TO TRAIN MODEL
	linearModel = LinearRegressionWithSGD.train(oneHotTRAINregScaled, iterations=100, step = 0.1, regType='l2', regParam=0.1, intercept = True)
	
	# SCORE ON SCALED TEST DATA-SET & EVALUATE
	predictionAndLabels = oneHotTESTregScaled.map(lambda lp: (float(linearModel.predict(lp.features)), lp.label))
	testMetrics = RegressionMetrics(predictionAndLabels)
	
	print("RMSE = %s" % testMetrics.rootMeanSquaredError)
	print("R-sqr = %s" % testMetrics.r2)
	
	# SAVE MODEL IN BLOB
	datestamp = unicode(datetime.datetime.now()).replace(' ','').replace(':','_');
	linearregressionfilename = "LinearRegressionWithSGD_" + datestamp;
	dirfilename = modelDir + linearregressionfilename;
	
	linearModel.save(sc, dirfilename)
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 

**OUTPUT**

RMSE = 1.33377864897

R-sqr = 0.585503152994

Time taken to execute above cell: 33.26 seconds


### Random Forest regression

The code in this section shows how to train evaluate, and save a random forest model that predicts tip amount for the NYC taxi trip data.   


>[AZURE.NOTE] Cross-validation with parameter sweeping using custom code is provided in the appendix.


	#PREDICT TIP AMOUNTS USING RANDOM FOREST

	# RECORD START TIME
	timestart= datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.tree import RandomForest, RandomForestModel
	from pyspark.mllib.util import MLUtils
	from pyspark.mllib.evaluation import RegressionMetrics
	
	
	# TRAIN MODEL
	categoricalFeaturesInfo={0:2, 1:2, 2:6, 3:4}
	rfModel = RandomForest.trainRegressor(indexedTRAINreg, categoricalFeaturesInfo=categoricalFeaturesInfo,
	                                    numTrees=25, featureSubsetStrategy="auto",
	                                    impurity='variance', maxDepth=10, maxBins=32)
	# UN-COMMENT IF YOU WANT TO PRING TREES
	#print('Learned classification forest model:')
	#print(rfModel.toDebugString())
	
	# PREDICT AND EVALUATE ON TEST DATA-SET
	predictions = rfModel.predict(indexedTESTreg.map(lambda x: x.features))
	predictionAndLabels = oneHotTESTreg.map(lambda lp: lp.label).zip(predictions)
	
	testMetrics = RegressionMetrics(predictionAndLabels)
	print("RMSE = %s" % testMetrics.rootMeanSquaredError)
	print("R-sqr = %s" % testMetrics.r2)
	
	# SAVE MODEL IN BLOB
	datestamp = unicode(datetime.datetime.now()).replace(' ','').replace(':','_');
	rfregressionfilename = "RandomForestRegression_" + datestamp;
	dirfilename = modelDir + rfregressionfilename;
	
	rfModel.save(sc, dirfilename);
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 

**OUTPUT**

RMSE = 1.00996395626

R-sqr = 0.673021661896

Time taken to execute above cell: 21.85 seconds


### Gradient boosting trees regression

The code in this section shows how to train evaluate, and save a gradient boosting trees model that predicts tip amount for the NYC taxi trip data.


	#PREDICT TIP AMOUNTS USING GRADIENT BOOSTING TREES

	# RECORD START TIME
	timestart= datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.mllib.tree import GradientBoostedTrees, GradientBoostedTreesModel
	from pyspark.mllib.util import MLUtils
	
	# TRAIN MODEL
	categoricalFeaturesInfo={0:2, 1:2, 2:6, 3:4}
	gbtModel = GradientBoostedTrees.trainRegressor(indexedTRAINreg, categoricalFeaturesInfo=categoricalFeaturesInfo, 
	                                                numIterations=10, maxBins=32, maxDepth = 4, learningRate=0.1)
	
	# EVALUATE A TEST DATA-SET
	predictions = gbtModel.predict(indexedTESTreg.map(lambda x: x.features))
	predictionAndLabels = indexedTESTreg.map(lambda lp: lp.label).zip(predictions)
	
	testMetrics = RegressionMetrics(predictionAndLabels)
	print("RMSE = %s" % testMetrics.rootMeanSquaredError)
	print("R-sqr = %s" % testMetrics.r2)
	
	# PLOT SCATTER-PLOT BETWEEN ACTUAL AND PREDICTED TIP VALUES
	test_predictions= sqlContext.createDataFrame(predictionAndLabels)
	test_predictions_pddf = test_predictions.toPandas()
	
	# SAVE MODEL IN BLOB
	datestamp = unicode(datetime.datetime.now()).replace(' ','').replace(':','_');
	btregressionfilename = "GradientBoostingTreeRegression_" + datestamp;
	dirfilename = modelDir + btregressionfilename;
	gbtModel.save(sc, dirfilename)
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

RMSE = 1.01232323826

R-sqr = 0.669483122879

Time taken to execute above cell: 17.32 seconds

	
	# QUERY
	%%sql -q -o sqlResults
	SELECT * from tmp_results

	# SET CONTEXT AND IMPORT LIBRARIES
	%%local
	import numpy as np
	
	# PLOT
	ax = sqlResults.plot(kind='scatter', figsize = (6,6), x='_1', y='_2', color='blue', alpha = 0.25, label='Actual vs. predicted');
	fit = np.polyfit(sqlResults['_1'], sqlResults['_2'], deg=1)
	ax.set_title('Actual vs. Predicted Tip Amounts ($)')
	ax.set_xlabel("Actual")
	ax.set_ylabel("Predicted")
	ax.plot(sqlResults['_1'], fit[0] * sqlResults['_1'] + fit[1], color='magenta')
	plt.axis([-1, 15, -1, 15])
	plt.show(ax)

![Actual-vs-predicted-tip-amounts](./media/machine-learning-data-science-spark-advanced-data-exploration-modeling/actual-vs-predicted-tips.png)


## Appendix: Additional regression tasks using cross validation with parameter sweeps

This appendix contains code showing how to do CV using Elastic net for linear regression and how to do CV with parameter sweep using custom code for random forest regression.


### Cross validation using Elastic net for linear regression

The code in this section shows how to do cross validation using Elastic net for linear regression and how to evaluate the model against test data.

	###  CV USING ELASTIC NET FOR LINEAR REGRESSION

	# RECORD START TIME
	timestart = datetime.datetime.now()
	
	# LOAD PYSPARK LIBRARIES
	from pyspark.ml.regression import LinearRegression
	from pyspark.ml import Pipeline
	from pyspark.ml.evaluation import RegressionEvaluator
	from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
	
	# DEFINE ALGORITHM/MODEL
	lr = LinearRegression()
	
	# DEFINE GRID PARAMETERS
	paramGrid = ParamGridBuilder().addGrid(lr.regParam, (0.01, 0.1))\
	                              .addGrid(lr.maxIter, (5, 10))\
	                              .addGrid(lr.tol, (1e-4, 1e-5))\
	                              .addGrid(lr.elasticNetParam, (0.25,0.75))\
	                              .build() 
	
	# DEFINE PIPELINE 
	# SIMPLY THE MODEL HERE, WITHOUT TRANSFORMATIONS
	pipeline = Pipeline(stages=[lr])
	
	# DEFINE CV WITH PARAMETER SWEEP
	cv = CrossValidator(estimator= lr,
	                    estimatorParamMaps=paramGrid,
	                    evaluator=RegressionEvaluator(),
	                    numFolds=3)
	
	# CONVERT TO DATA FRAME, AS CROSSVALIDATOR WON'T RUN ON RDDS
	trainDataFrame = sqlContext.createDataFrame(oneHotTRAINreg, ["features", "label"])
	
	# TRAIN WITH CROSS-VALIDATION
	cv_model = cv.fit(trainDataFrame)
	

	# EVALUATE MODEL ON TEST SET
	testDataFrame = sqlContext.createDataFrame(oneHotTESTreg, ["features", "label"])
	
	# MAKE PREDICTIONS ON TEST DOCUMENTS
	# cvModel uses the best model found (lrModel).
	predictionAndLabels = cv_model.transform(testDataFrame)
	
	# CONVERT TO DF AND SAVE REGISER DF AS TABLE
	predictionAndLabels.registerTempTable("tmp_results");
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

Time taken to execute above cell: 150.69 seconds

/usr/hdp/current/spark-client/python/pyspark/ml/regression.py:123: UserWarning: weights is deprecated. Use coefficients instead.
  warnings.warn("weights is deprecated. Use coefficients instead.")

	#QUERY
	%%sql -q -o sqlResults
	SELECT label,prediction from tmp_results

	# SET CONTEXT AND IMPORT LIBRARIES
	%%local
	from scipy import stats
	
	#R-SQR TEST METRIC
	corstats = stats.linregress(sqlResults['label'],sqlResults['prediction'])
	r2 = (corstats[2]*corstats[2])
	print("R-sqr = %s" % r2)


**OUTPUT**

R-sqr = 0.564016585075


### Cross validation with parameter sweep using custom code for random forest regression

The code in this section shows how to do cross validation with parameter sweep using custom code for random forest regression and how to evaluate the model against test data.


	# RECORD START TIME
	timestart= datetime.datetime.now()

	# LOAD PYSPARK LIBRARIES
	# GET ACCURARY FOR HYPERPARAMETERS BASED ON CROSS-VALIDATION IN TRAINING DATA-SET
	from pyspark.mllib.tree import RandomForest, RandomForestModel
	from pyspark.mllib.util import MLUtils
	from pyspark.mllib.evaluation import RegressionMetrics
	from sklearn.grid_search import ParameterGrid
	
	## CREATE PARAMETER GRID
	grid = [{'maxDepth': [5,10], 'numTrees': [25,50]}]
	paramGrid = list(ParameterGrid(grid))
	
	## SPECIFY LEVELS OF CATEGORICAL VARIBLES
	categoricalFeaturesInfo={0:2, 1:2, 2:6, 3:4}
	
	# SPECIFY NUMFOLDS AND ARRAY TO HOLD METRICS
	nFolds = 3;
	numModels = len(paramGrid)
	h = 1.0 / nFolds;
	metricSum = np.zeros(numModels);
	
	for i in range(nFolds):
	    # Create training and x-validation sets
	    validateLB = i * h
	    validateUB = (i + 1) * h
	    condition = (trainData["rand"] >= validateLB) & (trainData["rand"] < validateUB)
	    validation = trainData.filter(condition)
	    # Create labeled points from data-frames
	    if i > 0:
	        trainCVLabPt.unpersist()
	        validationLabPt.unpersist()
	    trainCV = trainData.filter(~condition)
	    trainCVLabPt = trainCV.map(parseRowIndexingRegression)
	    trainCVLabPt.cache()
	    validationLabPt = validation.map(parseRowIndexingRegression)
	    validationLabPt.cache()
	    # For parameter sets compute metrics from x-validation
	    for j in range(numModels):
	        maxD = paramGrid[j]['maxDepth']
	        numT = paramGrid[j]['numTrees']
	        # Train logistic regression model with hypermarameter set
	        rfModel = RandomForest.trainRegressor(trainCVLabPt, categoricalFeaturesInfo=categoricalFeaturesInfo,
	                                    numTrees=numT, featureSubsetStrategy="auto",
	                                    impurity='variance', maxDepth=maxD, maxBins=32)
	        predictions = rfModel.predict(validationLabPt.map(lambda x: x.features))
	        predictionAndLabels = validationLabPt.map(lambda lp: lp.label).zip(predictions)
	        # Use ROC-AUC as accuracy metrics
	        validMetrics = RegressionMetrics(predictionAndLabels)
	        metric = validMetrics.rootMeanSquaredError
	        metricSum[j] += metric
	
	avgAcc = metricSum/nFolds;
	bestParam = paramGrid[np.argmin(avgAcc)];
	
	# UNPERSIST OBJECTS
	trainCVLabPt.unpersist()
	validationLabPt.unpersist()
	        
	## TRAIN FINAL MODL WIHT BEST PARAMETERS
	rfModel = RandomForest.trainRegressor(indexedTRAINreg, categoricalFeaturesInfo=categoricalFeaturesInfo,
	                                    numTrees=bestParam['numTrees'], featureSubsetStrategy="auto",
	                                    impurity='variance', maxDepth=bestParam['maxDepth'], maxBins=32)

	# EVALUATE MODEL ON TEST DATA
	predictions = rfModel.predict(indexedTESTreg.map(lambda x: x.features))
	predictionAndLabels = indexedTESTreg.map(lambda lp: lp.label).zip(predictions)
	
	#PRINT TEST METRICS
	testMetrics = RegressionMetrics(predictionAndLabels)
	print("RMSE = %s" % testMetrics.rootMeanSquaredError)
	print("R-sqr = %s" % testMetrics.r2)
	
	# PRINT ELAPSED TIME
	timeend = datetime.datetime.now()
	timedelta = round((timeend-timestart).total_seconds(), 2) 
	print "Time taken to execute above cell: " + str(timedelta) + " seconds"; 


**OUTPUT**

RMSE = 1.00698169839

R-sqr = 0.674480212537

Time taken to execute above cell: 66.47 seconds


### Cleanup objects from memory, and print model locations

Use `unpersist()` to delete objects cached in memory.

	# UNPERSIST OBJECTS CACHED IN MEMORY

	# REMOVE ORIGINAL DFs
	taxi_df_train_cleaned.unpersist()
	taxi_df_train_with_newFeatures.unpersist()
	trainData.unpersist()
	trainData.unpersist()
	
	# FOR BINARY CLASSIFICATION TRAINING AND TESTING
	indexedTRAINbinary.unpersist()
	indexedTESTbinary.unpersist()
	oneHotTRAINbinary.unpersist()
	oneHotTESTbinary.unpersist()
	
	# FOR REGRESSION TRAINING AND TESTING
	indexedTRAINreg.unpersist()
	indexedTESTreg.unpersist()
	oneHotTRAINreg.unpersist()
	oneHotTESTreg.unpersist()
	
	# SCALED FEATURES
	oneHotTRAINregScaled.unpersist()
	oneHotTESTregScaled.unpersist()

	# PRINT MODEL FILE LOCATIONS FOR CONSUMPTION
	print "logisticRegFileLoc = modelDir + \"" + logisticregressionfilename + "\"";
	print "linearRegFileLoc = modelDir + \"" + linearregressionfilename + "\"";
	print "randomForestClassificationFileLoc = modelDir + \"" + rfclassificationfilename + "\"";
	print "randomForestRegFileLoc = modelDir + \"" + rfregressionfilename + "\"";
	print "BoostedTreeClassificationFileLoc = modelDir + \"" + btclassificationfilename + "\"";
	print "BoostedTreeRegressionFileLoc = modelDir + \"" + btregressionfilename + "\"";


**OUTPUT**

logisticRegFileLoc = modelDir + "LogisticRegressionWithLBFGS_2016-04-2523_40_16.087332"

linearRegFileLoc = modelDir + "LinearRegressionWithSGD_2016-04-2523_43_30.058765"

randomForestClassificationFileLoc = modelDir + "RandomForestClassification_2016-04-2523_42_39.585378"

randomForestRegFileLoc = modelDir + "RandomForestRegression_2016-04-2523_43_52.456436"

BoostedTreeClassificationFileLoc = modelDir + "GradientBoostingTreeClassification_2016-04-2523_42_55.680761"

BoostedTreeRegressionFileLoc = modelDir + "GradientBoostingTreeRegression_2016-04-2523_44_10.079694"

## What's next?

Now that you have created regression and classification models with the Spark MlLib, you are ready to learn how to score and evaluate these models.

**Model consumption:** To learn how to score and evaluate the classification and regression models created in this topic, see [Score and evaluate Spark-built machine learning models](machine-learning-data-science-spark-model-consumption.md).