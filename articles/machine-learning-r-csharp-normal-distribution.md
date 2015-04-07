<properties 
	pageTitle="Normal Distribution Web Service Suite | Azure" 
	description="Normal Distribution Web Service Suite" 
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
	ms.date="04/07/2015" 
	ms.author="jaymathe"/> 

#Normal Distribution Suite



The Normal Distribution Suite is a set of sample web services ([Generator]( https://datamarket.azure.com/dataset/aml_labs/ndg7), [Quantile Calculator]( https://datamarket.azure.com/dataset/aml_labs/ndq5), [Probability Calculator]( https://datamarket.azure.com/dataset/aml_labs/ndp5)) that help in generating and handling normal distributions. The services allow generating a normal distribution sequence of any length, calculating quantiles from a given probability, and calculating probability from a given quantile. Each of the services emits different outputs based on the selected service (see description below). The Normal Distribution Suite is based on the R functions qnorm, rnorm, and pnorm, which are included in R stats package.


[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

>This web service could be consumed by users – potentially through a mobile app, through a website, or even on a local computer, for example. But the purpose of the web service is also to serve as an example of how Azure Machine Learning can be used to create web services on top of R code. With just a few lines of R code and clicks of a button within Azure Machine Learning Studio, an experiment can be created with R code and published as a web service. The web service can then be published to the Azure Marketplace and consumed by users and devices across the world with no infrastructure setup by the author of the web service.  
 

##Consumption of web service
The Normal Distribution Suite includes the following 3 services.

###Normal Distribution Quantile Calculator
This service accepts 4 arguments of a normal distribution and calculates the associated quantile.

The input arguments are:

* p - A single probability of an event with normal distribution. 
* Mean - The normal distribution mean.
* SD - The normal distribution standard deviation. 
* Side - L for the lower side of the distribution and U for the upper side of the distribution.

The output of the service is the calculated quantile that is associated with the given probability.

###Normal Distribution Probability Calculator
This service accepts 4 arguments of a normal distribution and calculates the associated probability.

The input arguments are:

* q - A single quantile of an event with normal distribution. 
* Mean - The normal distribution mean.
* SD - The normal distribution standard deviation. 
* Side - L for the lower side of the distribution and U for the upper side of the distribution.

The output of the service is the calculated probability that is associated with the given quantile.

###Normal Distribution Generator
This service accepts 3 arguments of a normal distribution and generates a random sequence of numbers that are normally distributed. 
The following arguments should be provided to it within the request:

* n - The number of observations. 
* mean - The normal distribution mean.
* sd - The normal distribution standard deviation. 

The output of the service is a sequence of length n with a normal distribution based on the mean and sd arguments.

>This service, as hosted on the Azure Marketplace, is an OData service; these may be called through POST or GET methods. 

There are multiple ways of consuming the service in an automated fashion (example apps are here: [Generator](http://microsoftazuremachinelearning.azurewebsites.net/NormalDistributionGenerator.aspx),
[Probability Calculator](http://microsoftazuremachinelearning.azurewebsites.net/NormalDistributionProbabilityCalculator.aspx),
[Quantile Calculator](http://microsoftazuremachinelearning.azurewebsites.net/NormalDistributionQuantileCalculator.aspx)).

###Starting C# code for web service consumption:

###Normal Distribution Quantile Calculator
	public class Input
	{
	        public string p;
	        public string mean;
	        public string sd;
	        public string side;
	}
	
	public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
	{
	        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
	        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
	}
	
	void Main()
	{
	        var input = new Input() { p = TextBox1.Text, mean = TextBox2.Text, sd = TextBox3.Text, side = TextBox4.Text };
	        var json = JsonConvert.SerializeObject(input);
	        var acitionUri = "PutAPIURLHere,e.g.https://api.datamarket.azure.com/..../v1/Score";
	        var httpClient = new HttpClient();
	
	        httpClient.DefaultRequestHeaders.Authorization = CreateBasicHeader("PutEmailAddressHere", "ChangeToAPIKey");
	        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
	
	        var response = httpClient.PostAsync(acitionUri, new StringContent(json));
	        var result = response.Result.Content;
	    	var scoreResult = result.ReadAsStringAsync().Result;
	}


###Normal Distribution Probability Calculator
	public class Input
	{
	        public string q;
	        public string mean;
	        public string sd;
	        public string side;
	}
	
    public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
	{
	        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
	        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
	}
	
	void Main()
	{
	        var input = new Input() { q = TextBox1.Text, mean = TextBox2.Text, sd = TextBox3.Text, side = TextBox4.Text };
	        var json = JsonConvert.SerializeObject(input);
	        var acitionUri = "PutAPIURLHere,e.g.https://api.datamarket.azure.com/..../v1/Score";
	        var httpClient = new HttpClient();
	
	        httpClient.DefaultRequestHeaders.Authorization = CreateBasicHeader("PutEmailAddressHere", "ChangeToAPIKey");
	        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
	
	        var response = httpClient.PostAsync(acitionUri, new StringContent(json));
	        var result = response.Result.Content;
		    var scoreResult = result.ReadAsStringAsync().Result;
	}

###Normal Distribution Generator
	public class Input
	{
	        public string n;
	        public string mean;
	        public string sd;
	}
	
    public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
	{
	        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
	        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
	}
	
	void Main()
	{
	        var input = new Input() { n = TextBox1.Text, mean = TextBox2.Text, sd = TextBox3.Text };
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
>This web service was created using Azure Machine Learning. For a free trial, as well as introductory videos on creating experiments and [publishing web services](machine-learning-publish-a-machine-learning-web-service.md), please see [azure.com/ml](http://azure.com/ml). 

Below is a screenshot of the experiment that created the web service and example code for each of the modules within the experiment.

###Normal Distribution Quantile Calculator

Experiment flow:

![Experiment flow][2]
 
	#Data schema with example data (replaced with data from web service)
	data.set=data.frame(p=0.1,mean=0,sd=1,side='L');
	maml.mapOutputPort("data.set"); #send data to output port
	
	# Map 1-based optional input ports to variables
	dataset1 <- maml.mapInputPort(1) # class: data.frame

	param = dataset1
	if (param$p < 0 ) {
	print('Bad input: p must be between 0 and 1')
	param$p = 0
	} else if (param$p > 1) {
	print('Bad input: p must be between 0 and 1')
	param$p = 1
	}
	q = qnorm(param$p,mean=param$mean,sd=param$sd)

	if (param$side == 'U'){
	q = 2* param$mean - q
	} else if (param$side =='L') {
	q = q
	} else {
	print("Invalid side choice")
	}

	output = as.data.frame(q)
	
	# Select data.frame to be sent to the output Dataset port
	maml.mapOutputPort("output");
	
###Normal Distribution Probability Calculator
Experiment flow:

![Experiment flow][3]
 
 	#Data schema with example data (replaced with data from web service)
	data.set=data.frame(q=-1,mean=0,sd=1,side='L');
	maml.mapOutputPort("data.set"); #send data to output port
	
	# Map 1-based optional input ports to variables
	dataset1 <- maml.mapInputPort(1) # class: data.frame

	param = dataset1
	prob = pnorm(param$q,mean=param$mean,sd=param$sd)

	if (param$side == 'U'){
	prob = 1 - prob
	} else if (param$side =='B') {
	prob = ifelse(prob<=0.5,prob * 2, 1)
	} else if (param$side =='L') {
	prob = prob
	} else {
	print("Invalid side choice")
	}

	output = as.data.frame(prob)
	
	# Select data.frame to be sent to the output Dataset port
	maml.mapOutputPort("output");
	
###Normal Distribution Generator
Experiment flow:

![Experiment flow][4]

	#Data schema with example data (replaced with data from web service)
	data.set=data.frame(n=50,mean=0,sd=1);
	maml.mapOutputPort("data.set"); #send data to output port
	
	# Map 1-based optional input ports to variables
	dataset1 <- maml.mapInputPort(1) # class: data.frame

	param = dataset1
	dist = rnorm(param$n,mean=param$mean,sd=param$sd)

	output = as.data.frame(t(dist))

	# Select data.frame to be sent to the output Dataset port
	maml.mapOutputPort("output");

##Limitations 

These are very simple examples surrounding the normal distribution. As can be seen from the example code above, little error catching is implemented.

##FAQ
For frequently asked questions on consumption of the web service or publishing to the Azure Marketplace, see [here](machine-learning-marketplace-faq.md).

[1]: ./media/machine-learning-r-csharp-normal-distribution/normal-img1.png
[2]: ./media/machine-learning-r-csharp-normal-distribution/normal-img2.png
[3]: ./media/machine-learning-r-csharp-normal-distribution/normal-img3.png
[4]: ./media/machine-learning-r-csharp-normal-distribution/normal-img4.png
