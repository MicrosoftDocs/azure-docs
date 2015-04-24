<properties 
	pageTitle="Difference in Proportions Test | Azure" 
	description="Difference in Proportions Test" 
	services="machine-learning" 
	documentationCenter="" 
	authors="jaymathe" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/21/2015" 
	ms.author="jaymathe"/> 


#Difference in Proportions Test


Are two proportions statistically different? Suppose a user wants to compare two movies to determine if one movie has a significantly higher proportion of ‘likes’ when compared to the other. With a large sample, there could be a statistically significant difference between the proportions 0.50 and 0.51. With a small sample, there may not be enough data to determine if these proportions are actually different. 


[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

This [web service]( https://datamarket.azure.com/dataset/aml_labs/prop_test) conducts a hypothesis test of the difference in two proportions based on user input of the number of successes and the total number of trials for the 2 comparison groups. In one possible scenario, this web service could be called from within a movie comparison app, telling the user whether one of the movies is really ‘liked’ more often than the other, based on movie ratings.

>This web service could be consumed by users – potentially through a mobile app, through a website, or even on a local computer, for example. But the purpose of the web service is also to serve as an example of how Azure Machine Learning can be used to create web services on top of R code. With just a few lines of R code and clicks of a button within Azure Machine Learning Studio, an experiment can be created with R code and published as a web service. The web service can then be published to the Azure Marketplace and consumed by users and devices across the world with no infrastructure setup by the author of the web service.


##Consumption of web service

This service accepts 4 arguments and does a hypothesis test of proportions.

The input arguments are:

* Successes1 - Number of success events in sample 1.
* Successes2 - Number of success events in sample 2.
* Total1 -  Size of sample 1.
* Total2 - Size of sample 2.

The output of the service is the result of the hypothesis test along with the chi-square statistic, df, p-value, and proportion in sample 1/2 and confidence interval bounds.

>This service, as hosted on the Azure Marketplace, is an OData service; these may be called through POST or GET methods. 

There are multiple ways of consuming the service in an automated fashion (an example app is [here](http://microsoftazuremachinelearning.azurewebsites.net/DifferenceInProportionsTest.aspx )).

###Starting C# code for web service consumption:

	public class Input
	{
	        public string successes1;
	        public string successes2;
	        public string total1;
	        public string total2;
	}
	
    public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
	{
	        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
	        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
	}

	void Main()
	{
	        var input = new Input() { successes1 = TextBox1.Text, successes2 = TextBox2.Text, total1 = TextBox3.Text, total2 = TextBox4.Text };
	        var json = JsonConvert.SerializeObject(input);
	        var acitionUri = "PutAPIURLHere,e.g.https://api.datamarket.azure.com/..../v1/Score";
	        var httpClient = new HttpClient();
	
	        httpClient.DefaultRequestHeaders.Authorization = CreateBasicHeader("PutEmailAddressHere", "ChangeToAPIKey");
	        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
	
	        var response = httpClient.PostAsync(acitionUri, new StringContent(json));
	        var result = response.Result.Content;
	    	var scoreResult = result.ReadAsStringAsync().Result;
	}


##Creation of web service

>This web service was created using Azure Machine Learning. For a free trial, as well as introductory videos on creating experiments and [publishing web services](machine-learning-publish-a-machine-learning-web-service.md), please see [azure.com/ml](http://azure.com/ml). Below is a screenshot of the experiment that created the web service and example code for each of the modules within the experiment.

From within Azure Machine Learning, a new blank experiment was created with two [Execute R Script][execute-r-script] modules. In the first module the data schema is defined, while the second module uses the prop.test command within R to perform the hypothesis test for 2 proportions. 


###Experiment flow:

![Experiment flow][2]


####Module 1:
	####Schema definition  
	data.set=data.frame(successes1=50,successes2=60,total1=100,total2=100);
	maml.mapOutputPort("data.set"); #send data to output port
	dataset1 = maml.mapInputPort(1) #read data from input port
	

####Module 2:

	test=prop.test(c(dataset1$successes1[1],dataset1$successes2[1]),c(dataset1$total1[1],dataset1$total2[1])) #conduct hypothesis test

	result=data.frame(
	result=ifelse(test$p.value<0.05,"The proportions are different!",
	"The proportions aren't different statistically."),
	ChiSquarestatistic=round(test$statistic,2),df=test$parameter,
	pvalue=round(test$p.value,4),
	proportion1=round(test$estimate[1],4),
	proportion2=round(test$estimate[2],4),
	confintlow=round(test$conf.int[1],4),
	confinthigh=round(test$conf.int[2],4)) 

	maml.mapOutputPort("result"); #output port
	

##Limitations 

This is a very simple example for a test of difference in 2 proportions. As can be seen from the example code above, no error catching is implemented and the service assumes that all the variables are continuous.

##FAQ
For frequently asked questions on consumption of the web service or publishing to the Azure Marketplace, see [here](machine-learning-marketplace-faq.md).

[1]: ./media/machine-learning-r-csharp-difference-in-two-proportions/hyptest-img1.png
[2]: ./media/machine-learning-r-csharp-difference-in-two-proportions/hyptest-img2.png


<!-- Module References -->
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
