<properties 
	pageTitle="Binomial Distribution Suite | Azure" 
	description="Binomial Distribution Suite" 
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


#Binomial Distribution Suite




The Binomial Distribution Suite is a set of sample web services ([Binomial Generator](https://datamarket.azure.com/dataset/aml_labs/bdg5), [Probability Calculator]( https://datamarket.azure.com/dataset/aml_labs/bdp4), [Quantile Calculator]( https://datamarket.azure.com/dataset/aml_labs/bdq5)) that help in generating and dealing with binomial distributions. The services allow generating a binomial distribution sequence of any length, calculating quantiles out of given probability and calculating probability from a given quantile. Each of the services emits different outputs based on the selected service (see description below). The Binomial Distribution Suite is based on the R functions qbinom, rbinom, and pbinom, which are included in the R stats package. 


[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

>These web services could be consumed by users – potentially directly on the marketplace, through a mobile app, through a website, or even on a local computer, for example. But the purpose of the web service is also to serve as an example of how Azure Machine Learning can be used to create web services on top of R code. With just a few lines of R code and clicks of a button within Azure Machine Learning Studio, an experiment can be created with R code and published as a web service. The web service can then be published to the Azure Marketplace and consumed by users and devices across the world – no infrastructure setup by the author of the web service is required.

##Consumption of web service
The Binomial Distribution Suite includes the following 3 services.

###Binomial Distribution Quantile Calculator
This service accepts 4 arguments of a normal distribution and calculates the associated quantile.
The input arguments are:

- p - A single aggregated probability of multiple trials.  
- size - The number of trials.
- prob - The probability of success in a trial.
- Side - L for the lower side of the distribution, U for the upper side of the distribution. 

The output of the service is the calculated quantile that is associated with the given probability.

###Binomial Distribution Probability Calculator
This service accepts 4 arguments of a binomial distribution and calculates the associated probability.
The input arguments are:

- q - A single quantile of an event with binomial distribution. 
- size - The number of trials.
- prob - The probability of success in a trial.
- side - L for the lower side of the distribution, U for the upper side of the distribution, or E that is equal to a single number of successes.

The output of the service is the calculated probability that is associated with the given quantile.

###Binomial Distribution Generator
This service accepts 3 arguments of a binomial distribution and generates a random sequence of numbers that are binomially distributed. 
The following arguments should be provided to it within the request:

- n - Number of observations. 
- size - Number of trials.
- prob - Probability of success.

The output of the service is a sequence of length n with a binomial distribution based on the size and prob arguments.

>This service, as hosted on the Azure Marketplace, is an OData service; these may be called through POST or GET methods. 

There are multiple ways of consuming the service in an automated fashion (example apps are here: [Generator](http://microsoftazuremachinelearning.azurewebsites.net/BinomialDistributionGenerator.aspx),
[Probability Calculator](http://microsoftazuremachinelearning.azurewebsites.net/BinomialDistributionProbabilityCalculator.aspx),
[Quantile Calculator](http://microsoftazuremachinelearning.azurewebsites.net/BinomialDistributionQuantileCalculator)). 

###Starting C# code for web service consumption:

###Binomial Distribution Quantile Calculator
	public class Input
	{
	        public string p;
	        public string size;
	        public string prob;
	        public string side;
	}
	
    public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
	{
	        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
	        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
	}
	
    void main()
	{
	        var input = new Input() { p = TextBox1.Text, size = TextBox2.Text, prob = TextBox3.Text, side = TextBox4.Text };
	        var json = JsonConvert.SerializeObject(input);
	        var acitionUri = "PutAPIURLHere,e.g.https://api.datamarket.azure.com/..../v1/Score";
	        var httpClient = new HttpClient();
	
	        httpClient.DefaultRequestHeaders.Authorization = CreateBasicHeader("PutEmailAddressHere", "ChangeToAPIKey");
	        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
	
	        var response = httpClient.PostAsync(acitionUri, new StringContent(json));
	        var result = response.Result.Content;
		    var scoreResult = result.ReadAsStringAsync().Result;
	}

###Binomial Distribution Probability Calculator
	public class Input
	{
	        public string q;
	        public string size;
	        public string prob;
	        public string side;
	}
	
    public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
	{
	        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
	        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
	}
	
	void Main()
	{
	        var input = new Input() { q = TextBox1.Text, size = TextBox2.Text, prob = TextBox3.Text, side = TextBox4.Text };
	        var json = JsonConvert.SerializeObject(input);
	        var acitionUri = " PutAPIURLHere,e.g.https://api.datamarket.azure.com/..../v1/Score";
	        var httpClient = new HttpClient();
	
	        httpClient.DefaultRequestHeaders.Authorization = CreateBasicHeader("PutEmailAddressHere", "ChangeToAPIKey");
	        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
	
	        var response = httpClient.PostAsync(acitionUri, new StringContent(json));
	        var result = response.Result.Content;
		    var scoreResult = result.ReadAsStringAsync().Result;
	}


###Binomial Distribution Generator
	public class Input
	{
	        public string n;
	        public string size;
	        public string p;
	}
	
    public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
	{
	        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
	        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
	}
	
	void Main()
	{
	        var input = new Input() { n = TextBox1.Text, size = TextBox2.Text, p = TextBox3.Text };
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

###Binomial Distribution Quantile Calculator

![Create workspace][4]

####Module 1:
    #data schema with example data (replaced with data from web service)
    data.set=data.frame(p=0.1,size=10,prob=.5,side='L');
    maml.mapOutputPort("data.set"); #send data to output port
####Module 2:

    dataset1 <- maml.mapInputPort(1) # class: data.frame
    param = dataset1
    if (param$p < 0 ) {
	print('Bad input: p must be between 0 and 1')
	param$p = 0
    } else if (param$p > 1) {
	print('Bad input: p must be between 0 and 1')
	param$p = 1
    }

    if (param$prob < 0 ) {
	print('Bad input: prob must be between 0 and 1')
	param$prob = 0
    } else if (param$prob > 1) {
	print('Bad input: prob must be between 0 and 1')
	param$prob = 1
    }

    quantile = qbinom(param$p,size=param$size,prob=param$prob)
    df = data.frame(x=1:param$size, prob=dbinom(1:param$size, param$size, prob=param$prob))
    quantile

    if (param$side == 'U'){
	quantile = qbinom(param$p,size=param$size,prob=param$prob,lower.tail = F)
	band=subset(df,x>quantile)
    } else if (param$side =='L') {
	quantile = qbinom(param$p,size=param$size,prob=param$prob,lower.tail = T)
	band=subset(df,x<=quantile)
    } else {
	print("Invalid side choice")
    }

    output = as.data.frame(quantile)
    
	# Select data.frame to be sent to the output Dataset port
    maml.mapOutputPort("output");


###Binomial Distribution Probability Calculator

![Create workspace][5]

####Module 1:

    #data schema with example data (replaced with data from web service)
    data.set=data.frame(q=5,size=10,prob=.5,side='L');
    maml.mapOutputPort("data.set"); #send data to output port


####Module 2:
    dataset1 <- maml.mapInputPort(1) # class: data.frame
    param = dataset1
    prob = pbinom(param$q,size=param$size,prob=param$prob)
    prob.eq = dbinom(param$q,size=param$size,prob=param$prob)
    df = data.frame(x=1:param$size, prob=dbinom(1:param$size, param$size, prob=param$prob))
    prob

    if (param$side == 'U'){
	prob = 1 - prob
	band=subset(df,x>param$q)
    } else if (param$side =='E') {
	prob = prob.eq
	band=subset(df,x==param$q)
    } else if (param$side =='L') {
	prob = prob
	band=subset(df,x<=param$q)
    } else {
	print("Invalid side choice")
    }

    output = as.data.frame(prob)
    
	# Select data.frame to be sent to the output Dataset port
    maml.mapOutputPort("output");

###Binomial Distribution Generator

![Create workspace][6]

####Module 1:

    #data schema with example data (replaced with data from web service)
    data.set=data.frame(n=50,size=10,p=.5);
    maml.mapOutputPort("data.set"); #send data to output port

####Module 2:
    dataset1 <- maml.mapInputPort(1) # class: data.frame
    param = dataset1
    dist = rbinom(param$n,param$size,param$p)

    output = as.data.frame(t(dist))
    
	# Select data.frame to be sent to the output Dataset port
    maml.mapOutputPort("output");

##Limitations 
These are very simple examples surrounding the binomial distribution. As can be seen from the example code above, little error catching is implemented.

##FAQ
For frequently asked questions on consumption of the web service or publishing to the Azure Marketplace, see [here](machine-learning-marketplace-faq.md).


[1]: ./media/machine-learning-r-csharp-binomial-distribution/binomial_1.png

[2]: ./media/machine-learning-r-csharp-binomial-distribution/binomial_2.png

[3]: ./media/machine-learning-r-csharp-binomial-distribution/binomial_3.png

[4]: ./media/machine-learning-r-csharp-binomial-distribution/binomial_4.png

[5]: ./media/machine-learning-r-csharp-binomial-distribution/binomial_5.png

[6]: ./media/machine-learning-r-csharp-binomial-distribution/binomial_6.png
