<properties pageTitle="Step 1: Lexicon Based Sentiment Analysis | Azure" description="Lexicon Based Sentiment Analysis" services="machine-learning" documentationCenter="" authors="jaymathe" manager="paulettm" editor="cgronlun"/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/08/2014" ms.author="jaymathe"/> 



#Lexicon Based Sentiment Analysis 

 


How can you measure user’s opinion and attitude towards brands or topics in online social network, such as Facebook posts, tweets, reviews, and etc. Sentiment analysis provides a method for analyzing such questions.

In particular, there are general two methods for sentiment analysis, one is using supervised learning algorithm, and another can be treated as unsupervised learning. Supervised learning algorithm generally builds a classification model on large annotated corpus, and its accuracy is mainly based on the quality of the annotation and usually the training process will take a long time. Besides that, when we apply the algorithm to another domain, the result is usually not good. Compared to supervised learning, lexicon based unsupervised learning uses a sentiment dictionary, which doesn’t require storing large data corpus and training, which makes the whole process much faster. 

Our [service](https://datamarket.azure.com/dataset/aml_labs/lexicon_based_sentiment_analysis) is built on MPQA lexicon (http://mpqa.cs.pitt.edu/lexicons/subj_lexicon/), which is one of the most commonly used subjectivity lexicon. There are 5097 negative and 2533 positive words in MPQA. And all of these words are annotated as strong or weak polarity. The whole corpus is under GNU General Public License. The web service can be applied to any short sentences such as tweets, Facebook posts and etc. 

>While this web service could be consumed by users – potentially through a mobile app, website, or even on a local computer for example, the purpose of the web service is also to serve as an example of how Azure ML can be used to create web services on top of R code. With just a few lines of R code and clicks of a button within the Azure ML Studio, an experiment can be created with R code and published as a web service. The web service can then be published to the Azure Marketplace and consumed by users and devices across the world with no infrastructure set-up by the author of the web service.

##Consumption of Web Service

The input data can be any text, but the web service works better with short sentences. The output is a numeric value between -1 and 1. Any value below 0 denotes the sentiment of the text is negative, positive if above 0. The absolute value of the result denotes the strength of the associated sentiment. 

>This service as hosted on the Microsoft Azure Marketplace is an OData service; these may be called through POST or GET methods. 

There are multiple ways of consuming the service in an automated fashion (an example app is [here](http://microsoftazuremachinelearning.azurewebsites.net/)).

###Starting C# code for web service consumption:

	    public class ScoreResult
	    {
	        [DataMember]
	        public double result
	        {
	            get;
	            set;
	        }
	}
	void main()
	{
	        using (var wb = new WebClient())
	        {
	            var acitionUri = new Uri("PutAPIURLHere,e.g.https://api.datamarket.azure.com/..../v1/Score");
	            DataServiceContext ctx = new DataServiceContext(acitionUri);
	            var cred = new NetworkCredential("PutEmailAddressHere", "ChangeToAPIKey");
	            var cache = new CredentialCache();
	
	            cache.Add(acitionUri, "Basic", cred);
	            ctx.Credentials = cache;
	            var query = ctx.Execute<ScoreResult>(acitionUri, "POST", true, new BodyOperationParameter("Text", TextBox1.Text));
	            ScoreResult scoreResult = query.ElementAt(0);
	            double result = scoreResult.result;
	    }
	}



The input is “Today is a good day.”, the output is “1” which indicates positive sentiment associated with the input sentence. 

##Creation of Web Service
>This web service was created using Azure ML. For a free trial, as well as introductory videos on creating experiments and [publishing web services](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-publish-web-service-to-azure-marketplace/), please see [azure.com/ml](http://azure.com/ml). Below is a screenshot of the experiment that created the web service and example code for each of the modules within the experiment.


From within Azure ML, a new blank experiment was created. The figure below shows the experiment flow of lexicon based sentiment analysis. The “sent_dict.csv is the MPQA subjectivity lexicon, and is set as one of the input of “Execute R Script”. Another input is a sampled review from Amazon review dataset for test, where we performed selection, column name modification, split operations.  We uses hash package to store the subjectivity lexicon in the memory and accelerate the score computation process. The whole text will be tokenized by “tm” package and compared with the word in the sentiment dictionary. Finally, a score will be calculated by adding the weight of each subjective word in the text. 

###Experiment Flow:

![experimenmt flow][2]


####Module 1:
	
	# Map 1-based optional input ports to variables
    sent_dict_data<- maml.mapInputPort(1) # class: data.frame
    dataset2 <- maml.mapInputPort(2) # class: data.frame
    # install hash package
    install.packages("src/hash_2.2.6.zip", lib = ".", repos = NULL, verbose = TRUE)
    success <- library("hash", lib.loc = ".", logical.return = TRUE, verbose = TRUE)
    library(tm)
    library(stringr)
    #create sentiment dictionary
    negation_word <- c("not","nor", "no")
    result <- c()
    sent_dict <- hash()
    sent_dict <- hash(sent_dict_data$word, sent_dict_data$polarity)
    #  compute sentiment score for each document
    for (m in 1:nrow(dataset2)){
	polarity_ratio <- 0
	polarity_total <- 0
	not <- 0
	sentence <- tolower(dataset2[m,1])
	if (nchar(sentence) > 0){
		token_array <- scan_tokenizer(sentence)
		for (j in 1:length(token_array)){
			word = str_replace_all(token_array[j], "[^[:alnum:]]", "")
		    for (k in 1:length(negation_word)){
		      if (word == negation_word[k]){
		        not <- (not+1) %% 2

			  }
		    }
			if (word != ""){
			    if (!is.null(sent_dict[[word]])){
			      polarity_ratio <- polarity_ratio + (-2*not+1)*sent_dict[[word]]
			      polarity_total <- polarity_total + abs(sent_dict[[word]])
			    }
			}
		  
		}
	}
	if (polarity_total > 0){
		result <- c(result, polarity_ratio/polarity_total)
	}else{
		result<- c(result,0)
	}
    }
    # Sample operation
    data.set <- data.frame(result)
    # Select data.frame to be sent to the output Dataset port
    maml.mapOutputPort("data.set")
	


##Limitations

From algorithm perspective, lexicon based sentiment analysis is a general sentiment analysis tool, which may not perform better than Classification method for specific fields. The negation problem is not well dealt with. We hardcode several negation words in our program, but a better way is using a negation dictionary and build some rules. The web service performs better on short and simple sentences such as tweets, Facebook post, than long and complex sentences such as Amazon Review. 

##FAQ
For Frequently Asked Questions on consumption of the web service or publishing to marketplace, see [here](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-marketplace-faq).

[1]: ./media/machine-learning-r-csharp-lexicon-based-sentiment-analysis/sentiment_analysis_1.png
[2]: ./media/machine-learning-r-csharp-lexicon-based-sentiment-analysis/sentiment_analysis_2.png








