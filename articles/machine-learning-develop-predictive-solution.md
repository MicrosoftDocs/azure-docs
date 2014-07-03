<properties title="Create your first predictive analytics experiment
" pageTitle="Create your first predictive analytics experiment" description="Walkthrough of how to create a predictive analytics experiment in ML Studio" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

#Developing a Predictive Solution with Azure ML 
Suppose you need to predict an individual’s credit risk based on the information they give on a credit application.  

That’s a complex problem, of course, but let’s simplify the parameters of the question a bit and use it as an example of how you might be able to use Microsoft Azure Machine Learning with ML Studio and ML API service to create such a predictive analytics solution.  

In this walkthrough, we’ll follow the process of developing a predictive analytics model in ML Studio and then publishing it to the ML API service. We’ll start with publicly-available credit risk data, develop and train a predictive model based on that data, and then publish the model as a web service that can be used by others.  

We’ll follow these steps:  

1.	Create an ML workspace
2.	Upload existing data
3.	Create a new experiment
4.	Train and evaluate models
5.	Publish the web service
6.	Access the web service
