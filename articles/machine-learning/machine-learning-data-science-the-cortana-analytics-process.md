<properties 
	pageTitle="What is the Cortana Analytics Process?  | Microsoft Azure" 
	description="The Cortana Analytics Process is a systematic data science method for building intelligent applications that leverage advanced analytics." 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="bradsev"
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/02/2015" 
	ms.author="bradsev;gopitk" /> 


# What is the Cortana Analytics Process (CAP)?

The Cortana Analytics Process (CAP) is a systematic data science method that outlines a sequence of steps that leverages advanced analytics to build intelligent applications. The CAP steps provide **guidance** on how to define the problem, analyze relevant data, build  and evaluate predictive models, and then deploy those models in intelligent applications. 

Here are the steps in **Cortana Analytics Process**:  

![](http://i.imgur.com/tX3HvK2.png)

The process is **iterative**: the understanding of new and existing or refinements in the model evolves and requires reworking steps previously completed in the sequence. Existing organizational development and project planning processes are **easily adapted** to work with the CAP-defined sequence of steps. 

The steps in the process are described below.  

## Preparation Steps 

## P1. Plan the analytics project 

Start an analytics project by defining your business goals and problems. They are specified in terms of **business requirements**. A central objective of this step is to identify the key business variables (sales forecast or the probability of an order being fraudulent, for example) that the analysis needs to predict to satisfy these requirements. Additional planning is then usually essential to develop an understanding of the **data sources** needed to address the objectives of the project from an analytical perspective. It is not uncommon, for example, to find that existing systems need to collect and log additional kinds of data to address the problem and achieve the project goals.  

## P2. Setup analytics environment 

An analytics environment for the Cortana Analytics Process involves several components: 

- **data workspaces** where the data is staged for analysis and modeling, 
- a **processing infrastructure** for pre-processing, exploring, and modeling the data
- a **runtime infrastructure** to operationalize the analytical models and run the intelligent client applications that consume the models.  

The analytics infrastructure that needs to be setup is often part of an environment that is separate from core operational systems. But it typically leverages data from multiple systems within the enterprise as well as from sources external to the company. The analytics infrastructure can be purely cloud-based, or an on-premises setup, or a hybrid of the two. 

## Analytics Steps:  

## 1. Ingest Data into the analytical environment 

The first step is to bring the relevant data from various sources, either from within or from outside the enterprise, into the analytic environments targeted to process the data. The **format** of the data at source may differ from the format required by the destination. So some data transformation may have to be done by the ingestion tooling.

In addition to the initial ingestion of data, many  intelligent applications are required to refresh the data regularly as part of an ongoing learning process. This can be done by setting up a **data pipeline** or workflow. This forms part of the iterative part of the process that includes rebuilding and re-evaluating the analytical models used by the intelligent application deploying the solution.  


## 2. Explore and pre-process data 

The next step is to obtain a deeper understanding of the data by investigating its **summary statistics** , relationships, and by using techniques such **visualization**. This is also where issues of **data quality** and integrity, such as missing values, data type mismatches, and inconsistent data relationships, are handled. Pre-processing transforms are used to clean up the raw data before further analytics and modeling can take place.  


## 3. Develop Features 

Data scientists, in collaboration with domain experts,  must identify the features that capture the salient properties of the data set and that can best be used to predict the key business variables identified during planning. These new features can be derived from existing data or may require additional data to be collected. This process is known as **feature engineering** and is one of the key steps in building an effective predictive analytics system. This step requires a creative combination of domain expertise and the insights obtained from the data exploration step.


## 4. Create predictive models 

Data scientists build analytical models to predict the key variables identified by the business requirements defined in the planning step using data that has been cleaned and featurized. Machine learning systems support multiple **modeling algorithms** that are applicable to a wide variety of cases. Data scientists must choose the most appropriate model for their prediction task and it is not uncommon that results from multiple models need to be combined to obtain the best results. The parameters required by the models employed are calibrated against a subset of the data known as the **training data set** to optimize their performance. The models are then evaluated for accuracy by testing them with a holdout **validation data set**. 


## 5. Deploy and Consume models 

Once we have a set of models that perform well, they can be **operationalized** for other applications to consume. Depending on the business requirements, predictions are made either in **real time** or on a **batch** basis. To be operationalized, the models have to be exposed with an **open API interface** that is easily consumed from various applications such online website, spreadsheets, dashboards, or line of business and backend applications.

## Summary and next steps

The Cortana Analytics Process is modeled as a sequence of iterated steps that **provide guidance** on the tasks needed to use advanced analytics to build  an intelligent applications. Each step also provides details on how to use various Microsoft technologies to complete the tasks described. 

While CAP does not prescribe specific types of **documentation** artifacts, it is a best practice to document the results of the data exploration, modeling and evaluation, and to save the pertinent code so that the analysis can iterated when required. This also allows reuse of the analytics work when working on other applications involving similar data and prediction tasks.

Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided.

 
