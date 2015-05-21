<properties 
	pageTitle="Machine Learning app: Anomaly Detection Service | Azure " 
	description="Anomaly Detection API is an example built with Microsoft Azure Machine Learning that detects anomalies in time series data with numerical values that are uniformly spaced in time." 
	services="machine-learning" 
	documentationCenter="" 
	authors="LuisCabrer" 
	manager="paulettm"
	editor="cgronlun" /> 

<tags 
	ms.service="machine-learning" 
	ms.devlang="na" 
	ms.topic="reference" 
	ms.tgt_pltfrm="na" 
	ms.workload="multiple" 
	ms.date="05/05/2015" 
	ms.author="luisca"/>


# Machine Learning Anomaly Detection Service#

##Overview

Anomaly Detection API is an example built with Azure Machine Learning that detects anomalies in time series data with numerical values that are uniformly spaced in time. 

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)] 

This anomaly detection service can detect the following different types of anomalies on time series data:

1. Positive and negative trends: When monitoring memory usage in computing, for instance, an upward trend is indicative of a memory leak,

2. Increase in the dynamic range of values: As an example, when monitoring the exceptions thrown by a service, any increases in the dynamic range of values could indicate instability in the health of the service, and

3. Spikes and Dips: For instance, when monitoring the number of login failures to a service or number of checkouts in an e-commerce site, spikes or dips could indicate abnormal behavior.


These detectors track changes in values over time and reports ongoing changes in their values. They do not require adhoc threshold tuning and their scores can be used to control false positive rate. The anomaly detection API is useful in several scenarios like service monitoring by tracking KPIs over time, usage metrics such as number of searches, numbers of clicks, performance counters like memory, cpu, file reads, etc. over time. 

##API Definition

The service provides a REST based API over HTTPS that can be consumed in different ways including a web or mobile application, R, Python, Excel, etc. We have an [Azure web application](http://anomalydetection-aml.azurewebsites.net/) that helps run the anomaly detection web service on your data and visualize the results. 

You can also send your time series data to this service via a REST API call, and it runs a combination of the three anomaly types described above. The service runs on the AzureML Machine Learning platform which scales to your business needs seamlessly and provides SLAs of 99.95%.

The figure below shows an example of anomalies detected in a times series using the above framework. The time series has 2 distinct level changes, and 3 spikes. The red dots show the time at which the level change is detected, while the red upward arrows show the detected spikes.


![][1]

##Input

The API takes 2 input parameters 

1. "data" represents input time series in the format: t1=v1;t2=v2;... 

 
	Sample data: 
		
		"9/21/2014 11:05:00 AM=3;9/21/2014 11:10:00 AM=9.09;9/21/2014 11:15:00 AM=0;"

2. "params" set to "SpikeDetector.TukeyThresh=3; SpikeDetector.ZscoreThresh=3" which controls sensitivity of spike detectors. Higher values will catch higher spikes and vice versa. 

	Sample URL with input parameters mentioned above:

		https://api.datamarket.azure.com/data.ashx/aml_labs/anomalydetection/v1/Score?data=%279%2F21%2F2014%2011%3A05%3A00%20AM%3D3%3B9%2F21%2F2014%2011%3A10%3A00%20AM%3D9.09%3B9%2F21%2F2014%2011%3A15%3A00%20AM%3D0%3B%27&params=%27SpikeDetector.TukeyThresh%3D3%3B%20SpikeDetector.ZscoreThresh%3D3%27



###Output###

The API runs these detectors on your time series data and returns the anomaly scores at each point in time. This output can be parsed using a simple parser as shown in [https://adresultparser.codeplex.com/](https://adresultparser.codeplex.com/). This gives sample code that shows how to connect to the API and parse the output. The alerts generated can be visualized on a dashboard and/or passed on to human experts who can take corrective actions.

Sample output for the sample input above: 

	"Time,Data,TSpike,ZSpike,Martingale values,Alert indicator,Martingale values(2),Alert indicator(2),;9/21/2014 11:05:00 AM,3,0,0,-0.687952590518378,0,-0.687952590518378,0,;9/21/2014 11:10:00 AM,9.09,0,0,-1.07030497733224,0,-0.884548154298423,0,;9/21/2014 11:15:00 AM,0,0,0,-1.05186237440962,0,-1.173800281031,0,;"

which is a representation of the following table:

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Time</th>
   <th align="left" valign="middle">Data</th>
   <th align="left" valign="middle">Tspike</th>
   <th align="left" valign="middle">Zspike</th>
   <th align="left" valign="middle">Martingale values</th>
   <th align="left" valign="middle">Alert indicator</th>
   <th align="left" valign="middle">Martingale values (2)</th>
   <th align="left" valign="middle">Alert indicator (2)</th>
   </tr>
<tr>
   <td valign="middle">9/21/2014 11:05</td>
   <td valign="middle">3</td>
   <td valign="middle">0</td>
   <td valign="middle">0</td>
   <td valign="middle">-0.687952591</td>
   <td valign="middle">0</td>
   <td valign="middle">-0.687952591</td>
   <td valign="middle">0</td>
   </tr>
<tr>
<td valign="middle">9/21/2014 11:10</td>
   <td valign="middle">9.09</td>
   <td valign="middle">0</td>
   <td valign="middle">0</td>
   <td valign="middle">-1.070304977</td>
   <td valign="middle">0</td>
   <td valign="middle">-0.884548154</td>
   <td valign="middle">0</td>
    </tr>
<tr>
<td valign="middle">9/21/2014 11:15</td>
   <td valign="middle">0</td>
   <td valign="middle">0</td>
   <td valign="middle">0</td>
   <td valign="middle">-1.051862374</td>
   <td valign="middle">0</td>
   <td valign="middle">-1.1738002814</td>
   <td valign="middle">0</td>
   </tr>
   </table>
   

[1]: ./media/machine-learning-apps-anomaly-detection/anomaly-detection.jpg

 

