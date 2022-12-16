# Frequently Asked Questions
**What if my timeseries data does not have regularly spaced observations?**

AutoML's timeseries models all require data with regularly spaced observations in time. Regularly spaced, here, includes cases like monthly or yearly observations where the number of days between observations may vary. Essentially, AutoML just needs to be able to infer a time series frequency. There are two cases where time dependent data may not meet this requirement:

1. The data does have a well defined frequency, but there are missing observations that create gaps in the series. In this case, AutoML will attempt to detect the frequency, fill in new observations for the gaps, and impute missing target and feature values therein. The imputation methods can be optionally configured by the user via SDK settings or through the Web UI. For more details on configuring imputation, see [here](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-auto-train-forecast#customize-featurization)
2. The data does not have a well defined frequency; that is, the duration between observations does not have a discernible pattern. Transactional data, like that from a Point-of-Sales system, is one example. In this case, you can set AutoML to aggregate your data to a chosen frequency. You can choose a regular frequency that best suites the data and the modeling objectives (hourly, daily, monthly, etc.). For more details on aggregation, see [here](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-auto-train-forecast#frequency--target-data-aggregation).

**Why is AutoML so slow?**

We're always working to make it faster and more scalable! But it is true that AutoML does a lot of processing that you might not consider if you were just hacking on your laptop. For example: extensive data validations, complex feature engineering, rolling origin (cross-)validation, and sweeping over a large variety of models. In the case of timeseries data, we do many of these computations per series. If your data contains many series, this can become a large computation. Please see our [Forecasting at scale](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-auto-train-forecast#forecasting-at-scale) documentation for details on how to scale and accelerate your training jobs. Also, read about [the success of our scaling approach](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/automated-machine-learning-on-the-m5-forecasting-competition/ba-p/2933391) on a high-profile competition data set.

**What modelling configuration should one use?**

There are four configurations supported by AutoML forecasting.
1.  Default Auto ML.

    This is recommended if the dataset has less number of time series. This is the first configuration that one should try in Azure Auto ML using a small dataset. Classical models would be trained for each time series. For Machine Learning models, one model would be trained for all the time series.

    This configuration helps in cross learning and forecasting for grains that have less historical data. Availability of meta data can further help in the modelling. Also, it is less computationally expensive. 
    Advantages:
    -   Simple and easy to use.
    -   Less computation time and compute
    -   Cross learning across time series
  
    Disadvantages:

    - Accuracy drops as the number of time series increases.
    - Underfitting time series patterns that are underrepresented in the dataset.
    - If there are unrelated time series in the dataset, the model might learn the noise.

2.  Many Models: 
    
    This allows users to train and manage millions of models in parallel.Separate models are trained for each time series. 
    It is recommended when the number of time series are high and there is no cross learning/ hierarchy in the data.
    
    Advantages:
    - Scalability
    - Good accuracy
  
    Disadvantages:
    - No cross learning across time series
    - For short time series, there can be overfitting issues. However, ROCV should reduce it.

3. Hierarchical Time Series (HTS): 

    If the meta data has a tree like structure, one should use hierarchical time series solution. This is built on top of the Many Models Solution. 
    HTS is not recommended on leaf node as it is equivalent to Many Models Solution. 

4. Deep Learning: 
   
   Applicable for large datasets where there are a minimum of 1000 rows. This is a global model i.e. single model is trained for all the time series in the dataset. It also helps cross learning across time series and does not need external features.

**How to prevent overfitting and data leakage?**

Azure Auto ML uses Rolling Origin Cross Validation which reduces the modelling-based overfitting issues to a great extent. However, there can be overfitting issues due to the data. 
- One needs to make sure that the input data does not contain columns that are derived from target. 
- Using deep learning models for small number of short time series. Many models can overfit the time series that have short history. Increase the cv_step_size and n_cv_folds.
- Also, features available during training but unavailable in the forecast horizon will lead to poor predictions. In our next version, we are proposing a solution for missing features in forecast horizon (Coming soon). (Intro section –links)

**How and where to start? What should be my steps for forecasting using Azure AutoML?**

It is recommended to first go through Set up AutoML (Link). Post that the following notebooks should be executed with the required data in sequence based on the accuracy requirements.
1. Bike share notebook
2. Forecasting Recipes forecasting-recipes-univariate 
3. Advanced modelling parameters  
4. Many models 
5. Deep Learning : forecasting-github-dau


**How to choose the primary metric? Which output metric to look at?**

Forecasting supports spearman_correlation, normalized_root_mean_squared_error (RMSE), r2_score and normalized_mean_absolute_error (MAE). However, R2 not good metric for forecasting and should be avoided.
  
RMSE heavily penalises the outliers. If there are few timestamps with poor forecasts and all other timestamps with great forecasts, RMSE will inflate the error metric. If the use case demands that occasional large mistakes should be avoided, then one should use RMSE. However, if errors should be treated equally, one should use MAE. RMSE optimizes the mean function, whereas MAE optimizes the median


**What action should be taken to improve accuracy?**

It is important to understand which modelling configuration is appropriate for the available data. 
- If the data is extremely granular then aggregating the data at a higher level and generating the forecasts is a good option. Forecasting at lower granularity introduces a lot of noise in the model. 
- Using backtest notebooks to evaluate the forecast quality over several forecasting cycles. This ensures that the poor accuracy is not due to strange behaviours in a single forecast horizon.
- Understanding if the models are underfitting or overfitting by comparing the training and forecast metrics. Post that updating the model parameters appropriately.
- Adding external features based on business understanding.
- Increasing the forecast horizon etc
- Looking at the appropriate forecasting accuracy metric.
- Increase the number of iterations (add the exact parameters)
- Adding complex model parameters

**What action should be taken to speed up the experiments?**
- Remove configs like lags
- Disable classical models etc
- Reduce the number of iterations, 
- Reduce the iteration_timeout_minutes, 
- Reduce experiment_timeout_hours, 
- Reduce Cross validation parameters (if used : cv_step_size and n_cross_validations)
- enable_early_stopping.


**How to resolve memory issues?**

There can be two types of memory issues:
- RAM Out of Memory 
- Disk Out of Memory

RAM Out of Memory can be resolved by upgrading the VM. In SDK we require raw data size to be 10 times smaller than the amount of free memory. So 30 * size of raw data seems to be reasonable, but to add to this, if the data size is the problem it means that user data is at least 467 Mb and one should try the ManyModel solution.

Disk Out of Memory can be resoved by deleting the compute cluster and creating a new one.







**Where to find the output metrics and visualization for the forecasts for various configurations like default AutoML, MM, HTS, TCN etc. Where to find the plots and accuracy metrics at different levels of hierarchy for HTS?**

To be updated

**Where to look for Logs and which logs are important for the customer?** 

User error in main run page—to std error log 
a.	single model: driver log
b.	many model: each node has its own user logs describe  log structure readme.

**What are the advanced forecasting scenarios that are supported?**
To do: forecast notebook and update

**How to export forecasts? (.csv vs UI etc.)**

**What is an experiment/ WS/ sweep job – DNN run inside child run? What is job? Link to Azure**






