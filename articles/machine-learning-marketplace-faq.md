<properties title="FAQ for publishing and using Machine Learning apps in the Azure Marketplace" pageTitle="FAQ for publishing and using Machine Learning apps in the Azure Marketplace | Azure" description="Frequently Asked Questions" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="jaymathe" manager="paulettm" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/13/2014" ms.author="jaymathe" /> 

#FAQ for publishing and using Machine Learning apps in the Azure Marketplace

##For consuming from Marketplace


###Question 1: I see the following error after entering the input for the web service. Why do I get this error?
The request resulted in a backend time out or backend error. The team is investigating the issue. We are sorry for the inconvenience. (500)
Answer: Your input parameter(s) may not conform to the required format for the specific web service. Please refer to the corresponding documentation link to find the correct format for input parameters and the limitations of this web service.

###Question 2: If I copy the API link for the web service that I see in ‘Explore this dataset’ and paste it in another browser window / tab’, what are the credentials I should use to access the results and how do I see them?
Answer: You should use your Marketplace account as the username and the primary account key as the password. The primary account key can be found on the ‘explore this dataset’ page under the description of the web service (click the ‘show’ button). The result may display in the browser or be available for download depending on which browser you are using.

###Question 3: I see the following error after entering the input for the web service in ‘explore this dataset’. Why do I get this error?
An unexpected error occured while processing your request. Please try again.
Answer: One or more input parameters of your web service may have exceeded the length limit when consuming the web service on the marketplace ‘explore this dataset’ page. The services may be called with a longer input length using HTTP POST methods; sample code is posted under the sample services described here: http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-web-service-examples/.

###

##For publishing from Azure ML on Marketplace

###Question 1: Why are my logos/images/# of transactions not refreshing for my web service? 
Answer: There is a caching of logos/images in the publishing portal and it may take up to 10 days for the new logo/image to update on the portal.

###Question 2: Why is the “Detail Tab” of my web service on the Marketplace offer showing an error?
Answer: There is a known Marketplace issue when connecting to Azure ML for service details. The team is working on resolving this issue.

###Question 3: Why does the R sample code in the Azure ML web services not work for consuming the web services in Marketplace?
Answer: The authentication systems are different when connecting to Azure ML web services directly compared to connecting to these web services through the Marketplace. The services in Marketplace are OData services and can be called with GET or POST methods. 

###Question 4: Why are the support links of my web service offers not updating correctly for some of my offers?
Answer: The support links are global per publisher and not per offer. 

###Question 5: How do I publish a web service with batch input mode in Marketplace?
Answer: The batch input mode is currently not supported in Marketplace web services.

###Question 6: Who should I contact to get help if I have questions about becoming a data publisher or have issues during publishing?
Answer: Please contact the Marketplace team at datamarketbd@microsoft.com for more information.





