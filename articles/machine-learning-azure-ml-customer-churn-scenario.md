<properties title="" pageTitle="Analyzing Customer Churn using Microsoft Machine Learning | Azure" description="Case study of developing an integrated model for analyzing and scoring customer churn" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="" manager="paulettm" editor="cgronlun" videoId="" scriptId=""/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/06/2014" ms.author="barga" />

# Analyzing Customer Churn using Microsoft Azure Machine Learning


This paper presents a reference implementation of a customer churn analysis project built using Azure Machine Learning Studio, and discusses associated generic models for holistically solving the problem of industrial customer churn. We also measure the accuracy of models built using Azure Machine Learning, and assess directions for further development.  

##The Problem of Customer Churn
Businesses in the consumer market and in all enterprise sectors have to deal with churn. Sometimes churn is excessive and influences policy decisions. The traditional solution is to predict high propensity churners and address their needs via a concierge service, marketing campaigns, or by applying special dispensations. These approaches may vary from industry to industry and even from a particular consumer cluster to another within one industry (e.g. telecommunications). The common factor is that businesses need to minimize these special customer retention efforts. Thus, a natural methodology would be to score every customer with the probability of churn and address the top N ones. The top customers might be the most profitable ones; in more sophisticated scenarios, a profit function is employed during the selection of candidates for special dispensation. However, these considerations are only a part of the holistic strategy for dealing with churn. Businesses also have to take into account risk (and associated risk tolerance), the level and cost of the intervention, and plausible customer segmentation.  

##Industry Outlook and Approaches
Sophisticated handling of churn is a sign of a mature industry. The classic example is the telecommunications industry, where subscribers are known to frequently switch from one provider to another. This voluntary churn is a prime concern. Moreover, providers have accumulated significant knowledge about *churn drivers*, which are the factors that drive customers to switch. For instance, handset or device choice is a well-known driver of churn in the mobile phone business. As a result, a popular policy is to subsidize the price of a handset for new subscribers while charging a full price to existing customers on an upgrade. Historically, that policy has led to customers hopping from one provider to another to get a new discount, which, in turn, has prompted providers to refine their strategies. High volatility in handset offerings is a factor that very quickly invalidates models of churn that are based on current handset models. Additionally, mobile phones are not just telecommunication devices, but are also fashion statements (consider the iPhone), and these social predictors are outside the scope of regular telecommunications datasets. The net result for modeling is that you cannot devise a sound policy just by eliminating known reasons for churn. In fact, a continuous modeling strategy, including classic models quantifying categorical variables (e.g. Decision Trees), is **mandatory**.

Using big data sets on their customers, organizations are performing big data analytics, in particular, churn detection based on big data, as an effective approach to the problem. You can find out more about the big data approach to the problem of churn in the section Recommendations on ETL.  

##Methodology to Model Customer Churn
A common problem-solving process to solve customer churn is depicted in diagrams 1-3:  

1.	A risk model allows you to consider how actions affect probability and risk.
2.	An intervention model allows you to consider how the level of intervention could affect the probability of churn and the amount of customer lifetime value (CLV).
3.	This analysis lends to a qualitative analysis that is escalated to a proactive marketing campaign targeting customer segments to deliver the optimal offer.  

![][1]

This forward looking approach is the best way to treat churn, but it comes with complexity: we have to develop a multi-model archetype and trace dependencies between the models. The interaction among models can be encapsulated as shown in the following diagram:  

![][2]
 
*Figure 4: Unified multi-model archetype*  

Interactions between the different models is key if we are to deliver a holistic approach to customer retention.  Each model necessarily degrades over time; therefore, the architecture is an implicit loop (similar to the archetype set by the CRISP-DM data mining standard, [***3***]).  
 
The overall cycle of risk-decision-marketing segmentation/decomposition is still a generalized structure, which is applicable to many business problems. Churn analysis is simply a strong representative of this group of problems, because it exhibits all the traits of a complex business problem that does not allow a simplified predictive solution. The social aspects of the modern approach to churn are not particularly highlighted in the approach, but the social aspects are encapsulated in the modeling archetype, as they would be in any other model.  

An interesting addition here is big data analytics. Today's telecommunication and retail businesses collect exhaustive data on their customers, and we can easily foresee that the need for multi-model connectivity will become a common trend, given emerging trends such as the Internet of Things and ubiquitous devices, which allow business to employ smart solutions at multiple layers.  

 
#Implementing the Modeling Archetype in Microsoft Azure ML Studio 
Given the problem just described, how can we implement an integrated modeling and scoring approach? In this section, we will demonstrate how we accomplished this using Microsoft Azure Cloud ML Studio.  

The multi-model approach is a must when designing a global archetype for churn. Even the scoring (predictive) part of the approach should be multi-model.  

The following diagram shows the prototype we created, which employs four different scoring algorithms in Cloud ML Studio to predict churn. The reason for using a multi-model approach is not only to create an ensemble classifier to increase accuracy, but also to protect against over-fitting and to improve prescriptive feature selection.  

![][3]
 
*Figure 5: Prototype of a churn modeling approach*  

The next sections will provide more details about the prototype scoring model that we implemented using Cloud ML Studio.  

##Data Selection and Preparation
The data used to build the models and score customers was obtained from a CRM vertical solution, with the data obfuscated to protect customer privacy. The data itself contains information about 8,000 subscriptions in the U.S., and combines three sources: provisioning data (subscription metadata), activity data (usage of the system), and customer support data. The data does not include any business related information on the customers; for example, it does not include loyalty metadata or credit score.  

For simplicity, ETL and data cleansing processes are out of scope since we assume that data preparation has already been done elsewhere.   

Feature selection for modeling is based on preliminary significance scoring of the set of predictors, included in the process using the random forest module. For the implementation in Cloud ML Studio, we calculated the mean, median, and ranges for representative features. For example, we added aggregates for the qualitative data, such as minimum and max values for user activity.    

We also captured temporal information for the last 6 months. We used only the preceding six months because we analyzed data for one year and established that even if there were statistically significant trends, the effect on churn is greatly diminished after six months.  

The most important point is that the entire process including ETL, feature selection and modeling was implemented in Cloud ML Studio, using data sources in Microsoft Azure.   

The following diagrams illustrate the data that was used:  

![][4]
 
*Figure 6: Excerpt of data source (obfuscated)*  

![][5]

 
*Figure 7: Features extracted from data source*
 
##Algorithms Used in the Prototype

We used the following four machine learning algorithms to build the prototype (no customization):  

1.	Logistic Regression (LR)
2.	Boosted Decision Tree (BT) 
3.	Averaged Perceptron (AP) 
4.	Support Vector Machine (SVM)  


The following diagram illustrates a portion of the experiment design surface, which indicates the sequence in which the models were created:  

![][6]  

 
*Figure 8: Creating ML models in Cloud ML Studio*  

##Scoring Methods
We scored the four models using a labeled training dataset.  

We also submitted the scoring dataset to a comparable model built using the desktop edition of SAS Enterprise Miner 12, and measured the accuracy of the SAS model as well as all four Azure Cloud ML models.  

#Results 
In this section, we present our findings about the accuracy of the models, based on the scoring dataset.  

##Accuracy and Precision of Scoring
Generally, the implementation in Azure Cloud ML is behind SAS in accuracy, by about 10-15% (AUC).  

However, the most important metric in churn is the misclassification rate: that is, of the top N churners as predicted by the classifier, which of them actually did **not** churn, and yet received special treatment?  The following diagram compares this misclassification rate for all models:  

![][7]

 
*Figure 9: Passau prototype area under curve * 

###Using AUC to Compare Results
Area Under Curve (AUC) is a metric that represents a global measure of *separability* between the distributions of scores for positive and negative populations. It is similar to the traditional ROC (Receiver Operator Characteristic) graph, but one important difference is that the AUC metric does not require you to choose a threshold value. Instead, it summarizes the results over **all** possible choices. In contrast, the traditional ROC graph shows the positive rate on the vertical axis and the false positive rate on the horizontal axis, and the classification threshold varies.   

AUC is generally used as a measure of worth for different algorithms (or different systems), because it allows models to be compared by means of their AUC values. This is a popular approach in meteorology, biosciences, and many other industries. Thus, AUC represents a popular tool for assessing classifier performance.  

###Comparing the Misclassification Rates
We compared the misclassification rates on the dataset in question using the CRM data of approximately 8,000 subscriptions.  

-	The SAS misclassification rate was 10-15%.
-	The Azure ML misclassification rate was 15-20% for the top 200-300 churners.  

In the telecommunications industry, it is important to address only those customers who have the highest risk to churn, by offering them a concierge service or other special treatment. In that respect, the Azure Cloud ML implementation achieves results on par with the SAS model.  

By the same token, accuracy is more important than precision, because we are mostly interested in correctly classifying potential churners.  

The following diagram from Wikipedia depicts the relationship in a lively, easy-to-understand graphic:  

![][8]
 
*Figure 10: Tradeoff between accuracy and precision*

###Accuracy and Precision Results for Boosted Tree Model  

The following chart displays the raw results from scoring using the Azure Cloud ML prototype for the Two-Class Boosted Decision Tree model, which happens to be the most accurate among the four models:  

![][9]

*Figure 11: Boosted tree characteristics*

##Performance Comparison 
We compared the speed at which data was scored using the Azure Cloud ML models and a comparable model created using the desktop edition of SAS Enterprise Miner 12.1.  

The following table summarizes the performance of the algorithms:  

*Table 1. General performance (accuracy) of the algorithms * 

**LR**|	**BT**|	**AP**|	**SVM**|
--|--|--|--|
Average Model|	The Best Model|	Underperforming|	Average Model

The models hosted in Azure Cloud ML outperformed SAS by 15-25% for speed of execution, but accuracy was largely on par.  

#Discussion and Recommendations
In the telecommunications industry, several practices have emerged to analyze churn:  

-	Derive metrics for four fundamental categories:
	-	**Entity (e.g., subscription)**. Provision basic information about the subscription and/or customer that is the subject of churn.
	-	**Activity**. Obtain all possible usage information related to the entity. For example, the number of logins, etc.
	-	**Customer support**. Harvest information from customer support logs to indicate whether the subscription had issues or interactions with customer support. 
	-	**Competitive and business data**. Obtain any information possible on the customer (can be unavailable or hard to track).
-	Use importance to drive feature selection. This implies that boosted/random forest tree is always a promising approach.  

The use of the four categories above creates the illusion that a simple *deterministic* approach, based on indexes formed on reasonable factors per category, should suffice to identify customers at risk for churn. Unfortunately, although this notion seems plausible, it is a false understanding. The reason is that churn is a temporal effect and the factors contributing to churn are usually in transient states. What leads a customer to consider leaving today might be different tomorrow and certainly will be different six months from now. Therefore, a *probabilistic* model is a necessity.  
 
This important observation is often overlooked in business, which generally prefers a BI-oriented approach to analytics, mostly because it is an easier sell and admits straightforward automation.  

However, the promise of self-service analytics using Azure Cloud ML is that the four categories of information, graded by division or department, become a valuable source for machine learning about churn.  
 
Another exciting capability coming in Azure Cloud ML is the ability to add a custom module into the repository of pre-defined modules already available. That capability, essentially, creates an opportunity to select libraries and create templates for vertical markets. It is an important differentiator of Azure Cloud ML in the market place.  

We hope to cover this topic in the future, especially related to Big Data analytics.
  
#Conclusion
This paper describes a sensible approach to tackling a common problem, customer churn, using a generic framework. We considered a prototype for scoring models and implemented it using Microsoft Azure Cloud ML. Finally, we assessed the accuracy and performance of the prototype solution with regard to comparable algorithms in SAS.  

**For more information:**  

Did this paper help you? Please give us your feedback. Tell us on a scale of 1 (poor) to 5 (excellent), how would you rate this paper and why have you given it this rating? For example:  

-	Are you rating it high due to having good examples, excellent screen shots, clear writing, or another reason? 
-	Are you rating it low due to poor examples, fuzzy screen shots, or unclear writing?  

This feedback will help us improve the quality of white papers we release.   

[Send feedback](mailto:sqlfback@microsoft.com).
 
#References
[1] Predictive analytics: beyond the predictions, W. McKnight, Information Management, July/August 2011, p.18-20.  

[2] http://en.wikipedia.org/wiki/Accuracy_and_precision   
 
[3] http://www.the-modeling-agency.com/crisp-dm.pdf   

[4] Big Data Marketing  

[5] http://www.amazon.com/Big-Data-Marketing-Customers-Effectively/dp/1118733894/ref=sr_1_12?ie=UTF8&qid=1387541531&sr=8-12&keywords=customer+churn
 
#Appendix

![][10]
 
*Figure 12 Snapshot of a presentation on churn prototype*
  

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
