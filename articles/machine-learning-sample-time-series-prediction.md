<properties title="Azure Machine Learning Sample: Time series prediction" pageTitle="Machine Learning Sample: Time series prediction | Azure" description="A sample Azure Machine Learning experiment that uses time series data to build a forecasting model with R." metaKeywords="" services="" solutions="" documentationCenter="" authors="garye" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="garye" />

#Azure Machine Learning sample: Time series prediction

*You can find the sample experiment associated with this model in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab. The experiment name is:*

	Time Series Forecasting - Development

##Problem description
 
Demonstrate how to use time series forecasting using the R modules in AzureML.
 
##Data
We use one time series (N1725) from the publically available M3 competition dataset  ([http://forecasters.org/resources/time-series-data/](http://forecasters.org/resources/time-series-data/))
 
##Model
We use 108 time points for training and the remaining 18 points for testing and evaluation.
Also we use a seasonality of 12 for this dataset.
Regarding the models, we compare the following (using the forecast package in R)  

1. 	Seasonal ARIMA 
2. 	Non Seasonal ARIMA
3. 	Seasonal ETS
4. 	Non -Seasonal ETS
5. 	Average of Seasonal ETS and Seasonal ARIMA
 
We compute and report the following metrics:
 
MASE -> Mean absolute scaled error  

sMAPE -> symmetric mean absolute percentage error  

MAPE -> mean absolute percentage error  

ME -> mean error  

RMSE -> root mean squared error  

MAE -> mean absolute error  

MPE -> mean percentage error
 
##Results
 
We find that the average of seasonal ets and seasonal arima performs better than either of the two algorithms individually measured in terms of MASE/sMAPE/MAPE.
 
Method|	ME|	RMSE|	MAE|	MPE|	MAPE|	MASE|	sMAPE|
--|
seasonal arima|	-1.67675|	295.0369|	252.1574|	-1.46028|	9.426425|	0.833983|	4.57093|
non seasonal arima|	-372.175	|553.4165|	454.5151|	-15.7923|	18.20334|	1.50326|	7.990454|
average seasonal arima & ets|	65.01053|	277.4794|	230.3637|	1.40434|	**8.445977**|	**0.761903**|	**4.231599**|
seasonal ets|	131.6978|	322.5491|	255.7482|	4.268956|	9.323395|	0.84586|	4.872235|
non seasonal ets|	-344.703	|533.6355|	438.5099|	-14.7762|	17.53017|	1.450324|	7.741309


