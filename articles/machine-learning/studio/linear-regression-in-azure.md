---
title: Migrating analytics from Excel
titleSuffix: Azure Machine Learning Studio
description: A comparison of linear regression models in Excel and in Azure Machine Learning Studio
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: previous-author=heatherbshapiro, previous-ms.author=hshapiro
ms.date: 03/20/2017
---
# Migrate analytics from Excel to Azure Machine Learning Studio

> *Kate Baroni* and *Ben Boatman* are enterprise solution architects in Microsoft’s Data Insights Center of Excellence. In this article, they describe their experience migrating an existing regression analysis suite to a cloud-based solution using Azure Machine Learning Studio.

## Goal

Our project started with two goals in mind: 

1. Use predictive analytics to improve the accuracy of our organization’s monthly revenue projections 
2. Use Azure Machine Learning Studio to confirm, optimize, increase velocity, and scale of our results. 

Like many businesses, our organization goes through a monthly revenue forecasting process. Our small team of business analysts was tasked with using Azure Machine Learning Studio to support the process and improve forecast accuracy. The team spent several months collecting data from multiple sources and running the data attributes through statistical analysis identifying key attributes relevant to services sales forecasting. The next step was to begin prototyping statistical regression models on the data in Excel. Within a few weeks, we had an Excel regression model that was outperforming the current field and finance forecasting processes. This became the baseline prediction result. 

We then took the next step to moving our predictive analytics over to Studio to find out how Studio could improve on predictive performance.

## Achieving predictive performance parity
Our first priority was to achieve parity between Studio and Excel regression models. Given the same data, and the same split for training and testing data, we wanted to achieve predictive performance parity between Excel and Studio. Initially we failed. The Excel model outperformed the Studio model. The failure was due to a lack of understanding of the base tool setting in Studio. After a sync with the Studio product team, we gained a better understanding of the base setting required for our data sets, and achieved parity between the two models. 

### Create regression model in Excel
Our Excel Regression used the standard linear regression model found in the Excel Analysis ToolPak. 

We calculated *Mean Absolute % Error* and used it as the performance measure for the model. It took 3 months to arrive at a working model using Excel. We brought much of the learning into the Studio experiment which ultimately was beneficial in understanding requirements.

### Create comparable experiment in Studio
We followed these steps to create our experiment in Studio: 

1. Uploaded the dataset as a csv file to Studio (very small file)
2. Created a new experiment and used the [Select Columns in Dataset][select-columns] module to select the same data features used in Excel 
3. Used the [Split Data][split] module (with *Relative Expression* mode) to divide the data into the same training datasets as had been done in Excel 
4. Experimented with the [Linear Regression][linear-regression] module (default options only), documented, and compared the results to our Excel regression model

### Review initial results
At first, the Excel model clearly outperformed the Studio model: 

|  | Excel | Studio |
| --- |:---:|:---:|
| Performance | | |
| <ul style="list-style-type: none;"><li>Adjusted R Square</li></ul> |0.96 |N/A |
| <ul style="list-style-type: none;"><li>Coefficient of <br />Determination</li></ul> |N/A |0.78<br />(low accuracy) |
| Mean Absolute Error |$9.5M |$ 19.4M |
| Mean Absolute Error (%) |6.03% |12.2% |

When we ran our process and results by the developers and data scientists on the Machine Learning team, they quickly provided some useful tips. 

* When you use the [Linear Regression][linear-regression] module in Studio, two methods are provided:
  * Online Gradient Descent: May be more suitable for larger-scale problems
  * Ordinary Least Squares: This is the method most people think of when they hear linear regression. For small datasets, Ordinary Least Squares can be a more optimal choice.
* Consider tweaking the L2 Regularization Weight parameter to improve performance. It is set to 0.001 by default, but for our small data set we set it to 0.005 to improve performance. 

### Mystery solved!
When we applied the recommendations, we achieved the same baseline performance in Studio as with Excel: 

|  | Excel | Studio (Initial) | Studio w/ Least Squares |
| --- |:---:|:---:|:---:|
| Labeled value |Actuals (numeric) |same |same |
| Learner |Excel -> Data Analysis -> Regression |Linear Regression. |Linear Regression |
| Learner options |N/A |Defaults |ordinary least squares<br />L2 = 0.005 |
| Data Set |26 rows, 3 features, 1 label. All numeric. |same |same |
| Split: Train |Excel trained on the first 18 rows, tested on the last 8 rows. |same |same |
| Split: Test |Excel regression formula applied to the last 8 rows |same |same |
| **Performance** | | | |
| Adjusted R Square |0.96 |N/A | |
| Coefficient of Determination |N/A |0.78 |0.952049 |
| Mean Absolute Error |$9.5M |$ 19.4M |$9.5M |
| Mean Absolute Error (%) |<span style="background-color: 00FF00;"> 6.03%</span> |12.2% |<span style="background-color: 00FF00;"> 6.03%</span> |

In addition, the Excel coefficients compared well to the feature weights in the Azure trained model:

|  | Excel Coefficients | Azure Feature Weights |
| --- |:---:|:---:|
| Intercept/Bias |19470209.88 |19328500 |
| Feature A |0.832653063 |0.834156 |
| Feature B |11071967.08 |11007300 |
| Feature C |25383318.09 |25140800 |

## Next Steps
We wanted to consume the Machine Learning web service within Excel. Our business analysts rely on Excel and we needed a way to call the Machine Learning web service with a row of Excel data and have it return the predicted value to Excel. 

We also wanted to optimize our model, using the options and algorithms available in Studio.

### Integration with Excel
Our solution was to operationalize our Machine Learning regression model by creating a web service from the trained model. Within a few minutes, the web service was created and we could call it directly from Excel to return a predicted revenue value. 

The *Web Services Dashboard* section includes a downloadable Excel workbook. The workbook comes pre-formatted with the web service API and schema information embedded. When you click *Download Excel Workbook*, the workbook opens and you can save it to your local computer. 

![Download Excel workbook from the Web Services Dashboard](./media/linear-regression-in-azure/machine-learning-linear-regression-in-azure-1.png)

With the workbook open, copy your predefined parameters into the blue Parameter section as shown below. Once the parameters are entered, Excel calls out to the Machine Learning web service and the predicted scored labels will display in the green Predicted Values section. The workbook will continue to create predictions for parameters based on your trained model for all row items entered under Parameters. For more information on how to use this feature, see [Consuming an Azure Machine Learning Web Service from Excel](consuming-from-excel.md). 

![Template Excel workbook connecting to the deployed web service](./media/linear-regression-in-azure/machine-learning-linear-regression-in-azure-2.png)

### Optimization and further experiments
Now that we had a baseline with our Excel model, we moved ahead to optimize our Machine Learning Linear Regression Model. We used the module [Filter-Based Feature Selection][filter-based-feature-selection] to improve on our selection of initial data elements and it helped us achieve a performance improvement of 4.6% Mean Absolute Error. For future projects we will use this feature which could save us weeks in iterating through data attributes to find the right set of features to use for modeling. 

Next we plan to include additional algorithms like [Bayesian][bayesian-linear-regression] or [Boosted Decision Trees][boosted-decision-tree-regression] in our experiment to compare performance. 

If you want to experiment with regression, a good dataset to try is the Energy Efficiency Regression sample dataset, which has lots of numerical attributes. The dataset is provided as part of the sample datasets in Studio. You can use a variety of learning modules to predict either Heating Load or Cooling Load. The chart below is a performance comparison of different regression learns against the Energy Efficiency dataset predicting for the target variable Cooling Load: 

| Model | Mean Absolute Error | Root Mean Squared Error | Relative Absolute Error | Relative Squared Error | Coefficient of Determination |
| --- | --- | --- | --- | --- | --- |
| Boosted Decision Tree |0.930113 |1.4239 |0.106647 |0.021662 |0.978338 |
| Linear Regression (Gradient Descent) |2.035693 |2.98006 |0.233414 |0.094881 |0.905119 |
| Neural Network Regression |1.548195 |2.114617 |0.177517 |0.047774 |0.952226 |
| Linear Regression (Ordinary Least Squares) |1.428273 |1.984461 |0.163767 |0.042074 |0.957926 |

## Key Takeaways
We learned a lot by from running Excel regression and Studio experiments in parallel. Creating the baseline model in Excel and comparing it to models using Machine Learning [Linear Regression][linear-regression] helped us learn Studio, and we discovered opportunities to improve data selection and model performance. 

We also found that it is advisable to use [Filter-Based Feature Selection][filter-based-feature-selection] to accelerate future prediction projects. By applying feature selection to your data, you can create an improved model in Studio with better overall performance. 

The ability to transfer the predictive analytic forecasting from Studio to Excel systemically allows a significant increase in the ability to successfully provide results to a broad business user audience. 

## Resources
Here are some resources for helping you work with regression: 

* Regression in Excel. If you’ve never tried regression in Excel, this tutorial makes it easy: [https://www.excel-easy.com/examples/regression.html](https://www.excel-easy.com/examples/regression.html)
* Regression vs forecasting. Tyler Chessman wrote a blog article explaining how to do time series forecasting in Excel, which contains a good beginner’s description of linear regression. [https://www.itprotoday.com/sql-server/understanding-time-series-forecasting-concepts](https://www.itprotoday.com/sql-server/understanding-time-series-forecasting-concepts) 
* Ordinary Least Squares Linear Regression: Flaws, Problems and Pitfalls. For an introduction and discussion of Regression: [https://www.clockbackward.com/2009/06/18/ordinary-least-squares-linear-regression-flaws-problems-and-pitfalls/ 
](https://www.clockbackward.com/2009/06/18/ordinary-least-squares-linear-regression-flaws-problems-and-pitfalls/)

<!-- Module References -->
[bayesian-linear-regression]: https://msdn.microsoft.com/library/azure/ee12de50-2b34-4145-aec0-23e0485da308/
[boosted-decision-tree-regression]: https://msdn.microsoft.com/library/azure/0207d252-6c41-4c77-84c3-73bdf1ac5960/
[filter-based-feature-selection]: https://msdn.microsoft.com/library/azure/918b356b-045c-412b-aa12-94a1d2dad90f/
[linear-regression]: https://msdn.microsoft.com/library/azure/31960a6f-789b-4cf7-88d6-2e1152c0bd1a/
[select-columns]: https://msdn.microsoft.com/library/azure/1ec722fa-b623-4e26-a44e-a50c6d726223/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/

