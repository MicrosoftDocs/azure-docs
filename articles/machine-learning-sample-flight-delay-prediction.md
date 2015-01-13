<properties title="" pageTitle="Machine Learning Sample: Flight delay prediction | Azure" description="A sample Azure Machine Learning experiment to develop a model that predicts whether a scheduled passenger flight will be delayed by more than 15 minutes." metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="Garyericson" manager="paulettm" editor="cgronlun" videoId="" scriptId=""/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/10/2014" ms.author="garye" />


# Azure Machine Learning sample: Flight delay prediction

>[AZURE.NOTE]
>The [Sample Experiment] and [Sample Datasets] associated with this model are available in ML Studio. See below for more details.
[Sample Experiment]: #sample-experiment
[Sample Datasets]: #sample-datasets


## Problem Description  ##

Predict whether scheduled passenger flight is delayed by more than 15 minutes on arrival using historical on-time performance and weather data. 

## Data ##

**Passenger flight on-time performance data from TranStats data collection from U.S. Department of Transportation:**  [http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time](http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time)  

The dataset covers April-October 2013. Before uploading to AzureML Studio:  

- Dataset was filtered to cover 70 busiest airports in continental US.  
- Following columns were selected: 'Year', 'Month', 'DayofMonth', 'DayOfWeek','Carrier', 'OriginAirportID','DestAirportID','CRSDepTime','DepDelay','DepDel15', 'CRSArrTime','ArrDelay','ArrDel15','Cancelled'  
- Cancelled flights were labeled as delayed by more than 15 mins.  
- Diverted flights were filtered out.  

**Hourly land-based weather observations from NOAA:** http://cdo.ncdc.noaa.gov/qclcd_ascii/  

Weather data covers observations from weather stations associated with each airports, April-October 2013. Before uploading to ML Studio: 

- Weather station IDs were mapped to corresponding airport IDs . 
- Weather stations not associated with the 70 busiest airports were filtered out  
- The Date column was split into separate Year, Month and Day columns  
- Following columns were selected: 'AirportID', 'Year','Month','Day', 'Time', 'TimeZone', 'SkyCondition', 'Visibility','WeatherType','DryBulbFarenheit', 'DryBulbCelsius',  'WetBulbFarenheit',  'WetBulbCelsius',  'DewPointFarenheit','DewPointCelsius',  'RelativeHumidity',  'WindSpeed',  'WindDirection',  'ValueForWindCharacter','StationPressure',  'PressureTendency',  'PressureChange',  'SeaLevelPressure',  'RecordType',  'HourlyPrecip', 'Altimeter'  

## Model ##

**Flight Data Preprocessing**  

First, columns that are possible target leakers: DepDelay, DepDel15, ArrDelay, Cancelled are excluded from the dataset.  

The columns 'DayOfWeek','OriginAirportID' and 'DestAirportID' represent categorical attributes. However, because they are integer-valued, they are initially parsed as continuous numeric, and have to be converted to categorical using Metadata Editor.  

We aim to join the flight records with hourly weather records using scheduled departure time as one of the join keys. To do this, the CSRDepTime column is rounded down to nearest earlier hour.  

**Weather Data Preprocessing**  

First, columns that have large proportion of missing values are excluded. These include  

- All string-valued columns  
- ValueForWindCharacter,WetBulbFarenheit,WetBulbCelsius,PressureTendency,PressureChange,SeaLevelPressure,StationPressure  

Then, Missing Value Scrubber is applied to the remaining colums.  

The time of weather observation is rounded up to the nearest later full hour, so it can be equi-joined with flight scheduled departure time. Note that scheduled flight time and weather observation time are rounded to opposite directions. This is done to ensure that model uses only weather observations that happened in the past relative to flight time.  

**Joining Datasets**

Flight records are joined with weather data at origin of the flight and at the destination of the flight.  

Note the weather data is reported in local time, but the origin and destination may be on different time zones. Therefore, an adjustment to time zone difference is made by subtracting the time zone columns from scheduled departure time and weather observation time.  

**Preparing Training and Validation Samples**  

The training and validation samples are created by splitting the data into April-September records for training, and October records for validation. Year and month columns are then removed from the dataset. 

Furthermore, the training data is quantized by equal-height binning, and the same binning is applied to validation data.  

**Model Training and Validation** 

Two-class boosted decision tree model is trained against the training sample. The model is optimized for best AUC using 10-fold random parameter sweep. For comparison, two-class logistic regression model is optimized in same manner.  

The trained models is then scored against validation set, and Evaluate Model module is used to analyze the quality of models against each other. 

**Post-Processing** 

The ariport IDs are joined with human-readable airport names and locations, to make the results easier to analyze. 

## Results ##

The boosted decision tree model has AUC of 0.697 against the validation set, which is slightly better than logistic regreesion model with AUC of 0.675. 



## Sample Experiment

The following sample experiment associated with this model is available in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab.

> **Sample Experiment - Flight Delay Prediction - Development**

## Sample Datasets

The following sample datasets used by this experiment are available in ML Studio in the module palette under **Saved Datasets**.

<ul>
<li><b>Airport Codes Dataset</b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-airport-codes](../includes/machine-learning-sample-dataset-airport-codes.md)]
<p></p></li>

<li><b>Flight Delays Data</b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-flight-delays-data](../includes/machine-learning-sample-dataset-flight-delays-data.md)]
<p></p></li>

<li><b>Weather Dataset</b><p></p>
[AZURE.INCLUDE [machine-learning-sample-dataset-weather-dataset](../includes/machine-learning-sample-dataset-weather-dataset.md)]
<p></p></li>
</ul>
