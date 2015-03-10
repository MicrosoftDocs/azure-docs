<properties 
	pageTitle="Analyzing Customer Churn using Microsoft Machine Learning | Azure" 
	description="Case study of developing an integrated model for analyzing and scoring customer churn" 
	services="machine-learning" 
	documentationCenter="" 
	authors="jeannt" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/06/2014" 
	ms.author="jeannt"/>

# Analyzing Customer Churn by using Azure Machine Learning

##Overview
This topic presents a reference implementation of a customer churn analysis project that is built by using Azure Machine Learning Studio. It discusses associated generic models for holistically solving the problem of industrial customer churn. We also measure the accuracy of models that are built by using Machine Learning, and we assess directions for further development.  

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)] 

##The problem of customer churn
Businesses in the consumer market and in all enterprise sectors have to deal with churn. Sometimes churn is excessive and influences policy decisions. The traditional solution is to predict high-propensity churners and address their needs via a concierge service, marketing campaigns, or by applying special dispensations. These approaches can vary from industry to industry and even from a particular consumer cluster to another within one industry (for example, telecommunications). 

The common factor is that businesses need to minimize these special customer retention efforts. Thus, a natural methodology would be to score every customer with the probability of churn and address the top N ones. The top customers might be the most profitable ones; for example, in more sophisticated scenarios, a profit function is employed during the selection of candidates for special dispensation. However, these considerations are only a part of the holistic strategy for dealing with churn. Businesses also have to take into account risk (and associated risk tolerance), the level and cost of the intervention, and plausible customer segmentation.  

##Industry outlook and approaches
Sophisticated handling of churn is a sign of a mature industry. The classic example is the telecommunications industry where subscribers are known to frequently switch from one provider to another. This voluntary churn is a prime concern. Moreover, providers have accumulated significant knowledge about *churn drivers*, which are the factors that drive customers to switch. 

For instance, handset or device choice is a well-known driver of churn in the mobile phone business. As a result, a popular policy is to subsidize the price of a handset for new subscribers and charging a full price to existing customers for an upgrade. Historically, this policy has led to customers hopping from one provider to another to get a new discount, which in turn, has prompted providers to refine their strategies. 

High volatility in handset offerings is a factor that very quickly invalidates models of churn that are based on current handset models. Additionally, mobile phones are not only telecommunication devices; they are also fashion statements (consider the iPhone), and these social predictors are outside the scope of regular telecommunications data sets. 

The net result for modeling is that you cannot devise a sound policy simply by eliminating known reasons for churn. In fact, a continuous modeling strategy, including classic models that quantify categorical variables (such as decision trees), is **mandatory**.

Using big data sets on their customers, organizations are performing big data analytics (in particular, churn detection based on big data) as an effective approach to the problem. You can find more about the big data approach to the problem of churn in the Recommendations on ETL section.  

##Methodology to model customer churn
A common problem-solving process to solve customer churn is depicted in Figures 1-3:  

1.	A risk model allows you to consider how actions affect probability and risk.
2.	An intervention model allows you to consider how the level of intervention could affect the probability of churn and the amount of customer lifetime value (CLV).
3.	This analysis lends itself to a qualitative analysis that is escalated to a proactive marketing campaign that targets customer segments to deliver the optimal offer.  

![][1]

This forward looking approach is the best way to treat churn, but it comes with complexity: we have to develop a multi-model archetype and trace dependencies between the models. The interaction among models can be encapsulated as shown in the following diagram:  

![][2]
 
*Figure 4: Unified multi-model archetype*  

Interaction between the models is key if we are to deliver a holistic approach to customer retention. Each model necessarily degrades over time; therefore, the architecture is an implicit loop (similar to the archetype set by the CRISP-DM data mining standard, [***3***]).  
 
The overall cycle of risk-decision-marketing segmentation/decomposition is still a generalized structure, which is applicable to many business problems. Churn analysis is simply a strong representative of this group of problems because it exhibits all the traits of a complex business problem that does not allow a simplified predictive solution. The social aspects of the modern approach to churn are not particularly highlighted in the approach, but the social aspects are encapsulated in the modeling archetype, as they would be in any model.  

An interesting addition here is big data analytics. Today's telecommunication and retail businesses collect exhaustive data about their customers, and we can easily foresee that the need for multi-model connectivity will become a common trend, given emerging trends such as the Internet of Things and ubiquitous devices, which allow business to employ smart solutions at multiple layers.  

 
##Implementing the modeling archetype in Machine Learning Studio 
Given the problem just described, how can we implement an integrated modeling and scoring approach? In this section, we will demonstrate how we accomplished this by using Azure Machine Learning Studio.  

The multi-model approach is a must when designing a global archetype for churn. Even the scoring (predictive) part of the approach should be multi-model.  

The following diagram shows the prototype we created, which employs four scoring algorithms in Machine Learning Studio to predict churn. The reason for using a multi-model approach is not only to create an ensemble classifier to increase accuracy, but also to protect against over-fitting and to improve prescriptive feature selection.  

![][3]
 
*Figure 5: Prototype of a churn modeling approach*  

The following sections provide more details about the prototype scoring model that we implemented by using Machine Learning Studio.  

###Data selection and preparation
The data used to build the models and score customers was obtained from a CRM vertical solution, with the data obfuscated to protect customer privacy. The data contains information about 8,000 subscriptions in the U.S., and it combines three sources: provisioning data (subscription metadata), activity data (usage of the system), and customer support data. The data does not include any business related information about the customers; for example, it does not include loyalty metadata or credit scores.  

For simplicity, ETL and data cleansing processes are out of scope because we assume that data preparation has already been done elsewhere.   

Feature selection for modeling is based on preliminary significance scoring of the set of predictors, included in the process that uses the random forest module. For the implementation in Machine Learning Studio, we calculated the mean, median, and ranges for representative features. For example, we added aggregates for the qualitative data, such as minimum and maximum values for user activity.    

We also captured temporal information for the most recent six months. We analyzed data for one year and we established that even if there were statistically significant trends, the effect on churn is greatly diminished after six months.  

The most important point is that the entire process, including ETL, feature selection, and modeling was implemented in Machine Learning Studio, using data sources in Microsoft Azure.   

The following diagrams illustrate the data that was used:  

![][4]
 
*Figure 6: Excerpt of data source (obfuscated)*  

![][5]

 
*Figure 7: Features extracted from data source*
 
###Algorithms used in the prototype

We used the following four machine learning algorithms to build the prototype (no customization):  

1.	Logistic regression (LR)
2.	Boosted decision tree (BT) 
3.	Averaged perceptron (AP) 
4.	Support vector machine (SVM)  


The following diagram illustrates a portion of the experiment design surface, which indicates the sequence in which the models were created:  

![][6]  

 
*Figure 8: Creating models in Machine Learning Studio*  

###Scoring methods
We scored the four models by using a labeled training dataset.  

We also submitted the scoring dataset to a comparable model built by using the desktop edition of SAS Enterprise Miner 12. We measured the accuracy of the SAS model and all four Machine Learning Studio models.  

##Results 
In this section, we present our findings about the accuracy of the models, based on the scoring dataset.  

###Accuracy and precision of scoring
Generally, the implementation in Machine Learning is behind SAS in accuracy by about 10-15% (Area Under Curve or AUC).  

However, the most important metric in churn is the misclassification rate: that is, of the top N churners as predicted by the classifier, which of them actually did **not** churn, and yet received special treatment? The following diagram compares this misclassification rate for all the models:  

![][7]

 
*Figure 9: Passau prototype area under curve* 

###Using AUC to compare results
Area Under Curve (AUC) is a metric that represents a global measure of *separability* between the distributions of scores for positive and negative populations. It is similar to the traditional Receiver Operator Characteristic (ROC) graph, but one important difference is that the AUC metric does not require you to choose a threshold value. Instead, it summarizes the results over **all** possible choices. In contrast, the traditional ROC graph shows the positive rate on the vertical axis and the false positive rate on the horizontal axis, and the classification threshold varies.   

AUC is generally used as a measure of worth for different algorithms (or different systems) because it allows models to be compared by means of their AUC values. This is a popular approach in industries such as meteorology and biosciences. Thus, AUC represents a popular tool for assessing classifier performance.  

###Comparing misclassification rates
We compared the misclassification rates on the dataset in question by using the CRM data of approximately 8,000 subscriptions.  

-	The SAS misclassification rate was 10-15%.
-	The Machine Learning Studio misclassification rate was 15-20% for the top 200-300 churners.  

In the telecommunications industry, it is important to address only those customers who have the highest risk to churn by offering them a concierge service or other special treatment. In that respect, the Machine Learning Studio implementation achieves results on par with the SAS model.  

By the same token, accuracy is more important than precision because we are mostly interested in correctly classifying potential churners.  

The following diagram from Wikipedia depicts the relationship in a lively, easy-to-understand graphic:  

![][8]
 
*Figure 10: Tradeoff between accuracy and precision*

###Accuracy and precision results for boosted decision tree model  

The following chart displays the raw results from scoring using the Machine Learning prototype for the boosted decision tree model, which happens to be the most accurate among the four models:  

![][9]

*Figure 11: Boosted decision tree model characteristics*

##Performance comparison 
We compared the speed at which data was scored using the Machine Learning Studio models and a comparable model created by using the desktop edition of SAS Enterprise Miner 12.1.  

The following table summarizes the performance of the algorithms:  

*Table 1. General performance (accuracy) of the algorithms* 

**LR**|	**BT**|	**AP**|	**SVM**|
--|--|--|--|
Average Model|	The Best Model|	Underperforming|	Average Model

The models hosted in Machine Learning Studio outperformed SAS by 15-25% for speed of execution, but accuracy was largely on par.  

##Discussion and recommendations
In the telecommunications industry, several practices have emerged to analyze churn, including:  

-	Derive metrics for four fundamental categories:
	-	**Entity (for example, a subscription)**. Provision basic information about the subscription and/or customer that is the subject of churn.
	-	**Activity**. Obtain all possible usage information that is related to the entity, for example, the number of logins.
	-	**Customer support**. Harvest information from customer support logs to indicate whether the subscription had issues or interactions with customer support. 
	-	**Competitive and business data**. Obtain any information possible about the customer (for example, can be unavailable or hard to track).
-	Use importance to drive feature selection. This implies that the boosted decision tree model is always a promising approach.  

The use of the previous four categories creates the illusion that a simple *deterministic* approach, based on indexes formed on reasonable factors per category, should suffice to identify customers at risk for churn. Unfortunately, although this notion seems plausible, it is a false understanding. The reason is that churn is a temporal effect and the factors contributing to churn are usually in transient states. What leads a customer to consider leaving today might be different tomorrow, and it certainly will be different six months from now. Therefore, a *probabilistic* model is a necessity.  
 
This important observation is often overlooked in business, which generally prefers a business intelligence-oriented approach to analytics, mostly because it is an easier sell and admits straightforward automation.  

However, the promise of self-service analytics by using Machine Learning Studio is that the four categories of information, graded by division or department, become a valuable source for machine learning about churn.  
 
Another exciting capability coming in Azure Machine Learning is the ability to add a custom module to the repository of predefined modules that are already available. This capability, essentially, creates an opportunity to select libraries and create templates for vertical markets. It is an important differentiator of Azure Machine Learning in the market place.  

We hope to continue this topic in the future, especially related to big data analytics.
  
##Conclusion
This paper describes a sensible approach to tackling the common problem of customer churn by using a generic framework. We considered a prototype for scoring models and implemented it by using Azure Machine Learning. Finally, we assessed the accuracy and performance of the prototype solution with regard to comparable algorithms in SAS.  

**For more information:**  

Did this paper help you? Please give us your feedback. Tell us on a scale of 1 (poor) to 5 (excellent), how would you rate this paper and why have you given it this rating? For example:  

-	Are you rating it high due to having good examples, excellent screen shots, clear writing, or another reason? 
-	Are you rating it low due to poor examples, fuzzy screen shots, or unclear writing?  

This feedback will help us improve the quality of white papers we release.   

[Send feedback](mailto:sqlfback@microsoft.com).
 
##References
[1] Predictive Analytics: Beyond the Predictions, W. McKnight, Information Management, July/August 2011, p.18-20.  

[2] [Accuracy and precision](http://en.wikipedia.org/wiki/Accuracy_and_precision) on Wikipedia 
 
[3] [CRISP-DM 1.0: Step-by-Step Data Mining Guide](http://www.the-modeling-agency.com/crisp-dm.pdf)   

[4] Big Data Marketing  

[5] [Big Data Marketing: Engage Your Customers More Effectively and Drive Value](http://www.amazon.com/Big-Data-Marketing-Customers-Effectively/dp/1118733894/ref=sr_1_12?ie=UTF8&qid=1387541531&sr=8-12&keywords=customer+churn)
 
##Appendix

![][10]
 
*Figure 12: Snapshot of a presentation on churn prototype*
  

[1]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-1.png
[2]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-2.png
[3]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-3.png
[4]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-4.png
[5]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-5.png
[6]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-6.png
[7]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-7.png
[8]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-8.png
[9]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-9.png
[10]: ./media/machine-learning-azure-ml-customer-churn-scenario/churn-10.png
