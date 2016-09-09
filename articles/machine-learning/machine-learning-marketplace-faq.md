<properties 
	pageTitle="FAQ: Publish and use Machine Learning apps in Azure Marketplace | Microsoft Azure" 
	description="Frequently Asked Questions" 
	services="machine-learning" 
	documentationCenter="" 
	authors="bharaths" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/06/2016" 
	ms.author="bharaths"/> 

#Publishing and using Machine Learning apps in the Azure Marketplace: FAQ

##Questions about consuming from Marketplace


**1. Why do I get the following error message after I enter input for the web service:**

**The request resulted in a back-end time out or back-end error. The team is investigating the issue. We are sorry for the inconvenience. (500)**

Your input parameter(s) may not conform to the required format for the specific web service. Please refer to the corresponding documentation link to find the correct format for input parameters and the limitations of this web service.


[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

**2. If I copy the API link for the web service that I see on the "Explore this dataset" page and paste it into another browser window, what credentials should I use to access the results, and how do I see them?**

You should use your Marketplace account as the username and the primary account key as the password. The primary account key can be found on the **Explore this dataset** page under the description of the web service (click the **show** button). The result may display in the browser or it may be available to  download, depending on which browser you are using.

**3. Why do I get the following error message after I enter the input for the web service on the "Explore this dataset" page:** 

**An unexpected error occurred while processing your request. Please try again.**

One or more input parameters of your web service may have exceeded the length limit when consuming the web service on the marketplace **Explore this dataset** page. The services can be called with a longer input length by using HTTP POST methods. For examples, see [Sample solutions using R on Machine Learning and published to Marketplace](machine-learning-r-csharp-web-service-examples.md).

**4. Why do I not see anything in the "API EXPLORER" tab int the Store in the Azure Classic Portal?** 

This is a known issue with the Azure Classic Portal Marketplace. The team is working to resolve this issue. 


##Questions about publishing from Azure Machine Learning on Marketplace

**1. Why are my transactions of logos or images not refreshing for my web service?** 

Logos and images are cached in the publishing portal, and it may take up to 10 days for the new logo or image to update on the portal.

**2. Why is the “Detail" tab of my web service on Marketplace showing an error message?**

There is a known Marketplace issue when connecting to Azure Machine Learning for service details. The team is working to resolve this issue.

**3. Why does the R sample code in the Azure Machine Learning web services not work for consuming the web services in Marketplace?**

The authentication systems are different when connecting to Azure Machine Learning web services directly compared to connecting to these web services through the Marketplace. The services in Marketplace are OData services, and they can be called with GET or POST methods. 

**4. Why are the support links of my web service offers not updating correctly for some of my offers?**

The support links are global per publisher, not per offer. 

**5. How do I publish a web service with batch input mode in Marketplace?**

The batch input mode is currently not supported in Marketplace web services.

**6. Who should I contact to get help if I have questions about becoming a data publisher, or if I have issues during publishing?**

Please contact the Azure Marketplace team at <datamarketbd@microsoft.com> for more information.





 
