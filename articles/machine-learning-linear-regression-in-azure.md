<properties pageTitle="Using Linear Regression in Azure Machine Learning | Azure" 
  description="A comparison of linear regression models in Excel and in Azure Machine Learning Studio" 
  services="machine-learning" 
  documentationCenter="" 
  authors="v-johugh" 
  manager="paulettm" 
  editor="cgronlun"/>

<tags 
  ms.service="machine-learning" 
  ms.workload="data-services" 
  ms.tgt_pltfrm="na" 
  ms.devlang="na" 
  ms.topic="article" 
  ms.date="01/07/2015" 
  ms.author="kbaroni;"/>

#Using linear regression in Azure Machine Learning
Kate Baroni, Benjamin H. Boatman  


Our project started with two goals in mind:  

1. Use predictive analytics to improve the accuracy of our organization’s monthly revenue projections  
2. Use Azure ML to confirm, optimize, increase velocity, and scale of our results.  

Like many businesses, our organization goes through a monthly revenue forecasting process. Our small team of business analysts was tasked with using Machine Learning to support the process and improve forecast accuracy.  The team spent several months collecting data from multiple sources and running the data attributes through statistical analysis identifying key attributes relevant to services sales forecasting.  Next steps was to begin prototyping statistical regression models on the data in Excel.  Within a few weeks we had an Excel regression model that was outperforming the current field and finance forecasting processes. This became the baseline prediction result.  


We then took the next step to moving our predictive analytics over to Azure ML to find out how Azure ML could improve on predictive performance.

Our first priority was to achieve parity between Azure ML and Excel regression models.  Given the exact same data, and the same split for training and testing data we wanted to achieve predictive performance parity between Excel and Azure ML.   Initially we failed. The Excel model outperformed the Azure ML model.   The failure was due to a lack of understanding of the base tool setting in Azure ML. After a sync with the Azure ML product team, we gained a better understanding of the base setting required for our data sets, and achieved parity between the two models.  

##How we achieved predictive performance parity:
##Regression model in Excel
Our Excel Regression used the standard linear regression model found in the Excel Analysis ToolPak. 

We calculated *Mean Absolute % Error* and used it as the performance measure for the model.  It took 3 months to arrive at a working model using Excel.  We brought much of the learning into the Azure ML experiment which ultimately was beneficial in understanding requirements.

##Azure machine learning experiment  
The steps we followed to create our experiment in Azure ML:  

1.	Uploaded the dataset as a csv file to Azure ML (very small file)
2.	Created a new experiment and used the *Project Columns* module to select the same data features used in Excel   
3.	Used the *Split* module (with *Relative Expression* mode) to divide the data into exact same train sets as had been done in Excel  
4.	Experimented with the Linear Regression module (default options only), documented, and compared the results to our Excel regression model

##Initial results
At first, the Excel model clearly outperformed the Azure ML model:  

|   |Excel|Azure ML|
|---|:---:|:---:|
|Performance|	|  |
|<ul style="list-style-type: none;"><li>Adjusted R Square</li></ul>| 0.96 |N/A|
|<ul style="list-style-type: none;"><li>Coefficient of <br />Determination</li></ul>|N/A|	0.78<br />(low accuracy)|
|Mean Absolute Error |	$9.5M|	$ 19.4M|
|Mean Absolute Error (%)|	6.03%|	12.2%

When we ran our process and results by the developers and data scientists on the Azure ML team, they quickly provided some useful tips.  

* When you use the Linear Regression module in Azure ML, two methods are provided:
	*  Online Gradient Descent: May be more suitable for larger-scale problems
	*  Ordinary Least Squares: This is the method most people think of when they hear linear regression. For small datasets, Ordinary Least Squares can be a more optimal choice.
*  Consider tweaking the L2 Regularization Weight parameter to improve performance. It is set to 0.001 by default and for our small data set, we set it to 0.005 to improve performance.    

##Mystery solved!
When we applied the recommendations, we achieved the same baseline performance in Azure ML as with Excel:   

|| Excel|Azure ML (Initial)|Azure ML w/ Least Squares|
|---|:---:|:---:|:---:|
|Labeled value  |Actuals (numeric)|same|same|
|Learner  |Excel -> Data Analysis -> Regression|Linear Regression.|Linear Regression|
|Learner options|N/A|Defaults|ordinary  least squares<br />L2 = 0.005|
|Data Set|26 rows, 3 features, 1 label.   All numeric.|same|same|
|Split: Train|Excel trained on the first 18 rows, tested on the last 8 rows.|same|same|
|Split: Test|Excel regression formula applied to the last 8 rows|same|same|
|**Performance**||||
|Adjusted R Square|0.96|N/A||
|Coefficient of Determination|N/A|0.78|0.952049|
|Mean Absolute Error |$9.5M|$ 19.4M|$9.5M|
|Mean Absolute Error (%)|<span style="background-color: 00FF00;"> 6.03%</span>|12.2%|<span style="background-color: 00FF00;"> 6.03%</span>|

In addition, the Excel coefficients compared well to the feature weights in the Azure trained model:

||Excel Coefficients|Azure Feature Weights|
|---|:---:|:---:|
|Intercept/Bias|19470209.88|19328500|
|Feature A|0.832653063|0.834156|
|Feature B|11071967.08|11007300|
|Feature C|25383318.09|25140800|

##Next steps:

##Integration with Excel
We wanted to consume Azure ML web service within Excel.  Our business analysts rely on Excel and we needed a way to call the Azure ML web service with a row of Excel data and have it return the predicted value to Excel.   Our solution was to operationalize our Azure ML regression model by creating a web service from the trained model.  Within a few minutes, the web service was created and we could call it directly from Excel to return a predicted revenue value.    

The *Web Services Dashboard* section includes a downloadable Excel workbook.  The workbook comes pre-formatted with the web service API and schema information embedded.   When you click on *Download Excel Workbook*, it opens and you can save it to your local computer.    

![][1]
 
With the workbook open, copy your predefined parameters into the blue Parameter section as shown below.  Once the parameters are entered, Excel calls out to the AzureML web service and the predicted scored labels will display in the green Predicted Values section.  The workbook will continue to create predictions for parameters based on your trained model for all row items entered under Parameters.   For more information on how to use this feature, see [Consuming an Azure Machine Learning Web Service from Excel](./machine-learning-consuming-from-excel.md). 

![][2]
 
##Further experiments
Now that we had a baseline with our Excel model, we moved ahead to optimize our Azure ML Linear Regression Model.  We used the module *Filter Based Feature Selection* to improve on our selection of initial data elements and it helped us achieve a performance improvement of 4.6% Mean Absolute Error.   For future projects we will use this feature which could save us weeks in iterating through data attributes to find the right set of features to use for modelling.  

Next we plan to include additional algorithms like Bayesian or Boosted Decision Trees in our experiment to compare performance.    

If you want to experiment with regression, a good dataset to try is the Energy Efficiency Regression sample dataset, which has lots of numerical attributes. The dataset is provided as part of the sample datasets in ML Studio.  You can use a variety of learning modules to predict either Heating Load or Cooling Load.  The chart below is a performance comparison of different regression learns against the Energy Efficiency dataset predicting for the target variable Cooling Load: 

|Model|Mean Absolute Error|Root Mean Squared Error|Relative Absolute Error|Relative Squared Error|Coefficient of Determination
|---|---|---|---|---|---
|Boosted Decision Tree|0.930113|1.4239|0.106647|0.021662|0.978338
|Linear Regression (Gradient Descent)|2.035693|2.98006|0.233414|0.094881|0.905119
|Neural Network Regression|1.548195|2.114617|0.177517|0.047774|0.952226
|Linear Regression (Ordinary Least Squares)|1.428273|1.984461|0.163767|0.042074|0.957926  

##Key take aways from running excel regression and Azure machine learning experiment in parallel
Base-lining an Excel model with Azure ML Linear Regression can be helpful for learning Azure ML and discovering opportunities to improve data selection and model performance.         

The *Filter Based Feature Selection* Model accelerates future prediction projects.  Creating an improved model using Azure ML with better overall performance. 

The ability to transfer the predictive analytic forecasting from Azure ML to Excel systemically allows a significant increase in the ability to successfully provide results to a broad business user audience.     


##Resources
Some resources are listed for helping you work with regression:  

* Regression in Excel.  If you’ve never tried regression in Excel, this tutorial makes it easy: [http://www.excel-easy.com/examples/regression.html](http://www.excel-easy.com/examples/regression.html)
* Regression vs forecasting.  Tyler Chessman wrote a blog article explaining how to do time series forecasting in Excel, which contains a good beginner’s description of linear regression. [http://sqlmag.com/sql-server-analysis-services/understanding-time-series-forecasting-concepts](http://sqlmag.com/sql-server-analysis-services/understanding-time-series-forecasting-concepts)  
* 	Ordinary Least Squares Linear Regression: Flaws, Problems and Pitfalls.  For an introduction and discussion of Regression:   [http://www.clockbackward.com/2009/06/18/ordinary-least-squares-linear-regression-flaws-problems-and-pitfalls/ 
](http://www.clockbackward.com/2009/06/18/ordinary-least-squares-linear-regression-flaws-problems-and-pitfalls/ )

[1]: ./media/machine-learning-linear-regression-in-azure/machine-learning-linear-regression-in-azure-1.png
[2]: ./media/machine-learning-linear-regression-in-azure/machine-learning-linear-regression-in-azure-2.png
