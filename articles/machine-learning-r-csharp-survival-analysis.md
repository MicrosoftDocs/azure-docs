<properties title="" pageTitle="Survival Analysis | Azure" description="Survival Analysis" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="jaymathe" manager="paulettm" editor="cgronlun" videoId="" scriptId=""/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/08/2014" ms.author="jaymathe" /> 


#Survival Analysis 





Under many scenarios, the main outcome under assessment is the time to an event of interest. In other words, the question “when this event will occur” is asked. As examples, consider the situations where the data describes the elapsed time (days, years, mileage, etc.) until the event of interest (disease relapse, PhD degree received, brake pad failed) occurs. Each instance in the data represents a specific object (a patient, a person, a car, etc.).

This [web service]( https://datamarket.azure.com/dataset/aml_labs/survivalanalysis) answers the question “what is the probability the event of interest will occur by time n for object x?” By providing a survival analysis model, this web service enables the users to supply data to train the model and test it. The main theme of the experiment is to model the length of the elapsed time until the event of interest occurs. 

>While this web service could be consumed by users – potentially through a mobile app, website, or even on a local computer for example, the purpose of the web service is also to serve as an example of how Azure ML can be used to create web services on top of R code. With just a few lines of R code and clicks of a button within the Azure ML Studio, an experiment can be created with R code and published as a web service. The web service can then be published to the Azure Marketplace and consumed by users and devices across the world with no infrastructure set-up by the author of the web service.  

##Consumption of Web Service

The input data schema of the web service is shown in the following table. Six pieces of information is needed as the input: training data, testing data, time of interest, the index of "time" dimension, the index of "event" dimension, and the variable types (continuous or factor). The training data is represented with a string, where the rows are separated by comma, and the columns are separated by semicolon. The number of features of the data are flexible. All the elements in the input string must be numeric. In the training data, the “time” dimension indicates the number of time units (days, years, mileage, etc.) elapsed since the starting point of the study (a patient receiving the drug treatment programs, a student starting the PhD study, a car staring to be driven, etc.) until the event of interest (the patient returning to the drug usage again, the student obtaining the PhD degree, the car having brake pad failure, etc.) occurs. The “event” dimension indicates whether the event of interest occurs at the end of the study. “event=1” means that the event of interest occurs at the time indicated by the “time” dimension; while “event=0” means that the event of interest has not occurred yet by the time indicated by the “time” dimension.

- trainingdata: A character string. Rows are separated by comma, and the columns are separated by semicolon. Each row includes “time” dimension, “event” dimension, and predictor variables.
- testingdata: One row of data that contains predictor variables for a particular object.
- time_of_interest: The elapsed time of interest n
- index_time: The column index of the “time” dimension (starting from 1)
- index_event: The column index of the “event” dimension (starting from 1)
- variable_types: A character string with semicolon as separators in it. 0 represents continuous variables and 1 represents factor variables.


The output is the probability of an event occurring by a specific time. 

>This service as hosted on the Microsoft Azure Marketplace is an OData service; these may be called through POST or GET methods. 

There are multiple ways of consuming the service in an automated fashion (an example app is [here](http://microsoftazuremachinelearning.azurewebsites.net/SurvivalAnalysis.aspx)). 

###Starting C# code for web service consumption:

	public class Input{
	public double Recency;
	public double Frequency;
	public double Monetary;
	public double Time;
	public double Class;
	}

	public AuthenticationHeaderValue CreateBasicHeader(string username, string password)
    {
        byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(username + ":" + password);
        System.Diagnostics.Debug.WriteLine("AuthenticationHeaderValue" + new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray)));
        return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
    }
       
	void Main()
	{
  	var input = new Input(){Recency =1, Frequency=0,Monetary=0,Time=1, Class= 0};
	var json = JsonConvert.SerializeObject(input);
	var acitionUri =  "PutAPIURLHere,e.g.https://api.datamarket.azure.com/..../v1/Score";
       
  	var httpClient = new HttpClient();
   	httpClient.DefaultRequestHeaders.Authorization = CreateBasicHeader("PutEmailAddressHere","ChangeToAPIKey");
   	httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
  	var query = httpClient.PostAsync(acitionUri,new StringContent(json));
  	var result = query.Result.Content;
  	var scoreResult = result.ReadAsStringAsync().Result;
  	scoreResult.Dump();
	}


The interpretation of this test is as follows. Assuming the goal of the data is to model the elapsed time until return to the drug usage for the patients who received one of the two treatment programs. The output of the web service reads: for patients being 35 years old, having previous drug treatment 2 times, taking the long residential treatment program, and with both heroin and cocaine usage, the probability of returning to the drug usage is 95.64% by day 500.

##Creation of Web Service

>This web service was created using Azure ML. For a free trial, as well as introductory videos on creating experiments and [publishing web services](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-publish-web-service-to-azure-marketplace/), please see [azure.com/ml](http://azure.com/ml). Below is a screenshot of the experiment that created the web service and example code for each of the modules within the experiment.

From within AzureML, a new blank experiment was created and two “Execute R Scripts” pulled onto the workspace. The data schema was created with a simple ‘Execute R Script’, which defines the input data schema for the web service. This module is then linked to the second ‘Execute R Script’ module, which does major work. This module does data preprocessing, model building, and predictions. In the data preprocessing step, the input data represented by a long string is transformed and converted into a data frame. In the model building step, an external R package “survival_2.37-7.zip” is first installed for conducting survival analysis. Then the “coxph” function is executed after a series data processing tasks. The details of “coxph” function for survival analysis can be read from the R documentation. In the prediction step, a testing instance is supplied into the trained model with the “surfit” function, and the survival curve for this testing instance is produced as “curve” variable. Finally, the probability of the time of interest is obtained. 

###Experiment Flow:

![experiment flow][1]

####Module 1:

    #data schema with example data (replaced with data from web service)
    trainingdata="53;1;29;0;0;3,79;1;34;0;1;2,45;1;27;0;1;1,37;1;24;0;1;1,122;1;30;0;1;1,655;0;41;0;0;1,166;1;30;0;0;3,227;1;29;0;0;3,805;0;30;0;0;1,104;1;24;0;0;1,90;1;32;0;0;1,373;1;26;0;0;1,70;1;36;0;0;1”
    testingdata="35;2;1;1"
    time_of_interest="500"
    index_time="1"
    index_event="2"
    sampleInput=data.frame(trainingdata,testingdata,time_of_interest,index_time,index_event,variable_types)
    maml.mapOutputPort("sampleInput"); #send data to output port
	
####Module 2:

    #read data from input port
    data <- maml.mapInputPort(1) 
    colnames(data) <- c("trainingdata","testingdata","time_of_interest","index_time","index_event","variable_types")
    # preprocessing trainingdata
    traindingdata=data$trainingdata
    y=strsplit(as.character(data$trainingdata),",")
    n_row=length(unlist(y))
    z=sapply(unlist(y), strsplit, ";", simplify = TRUE)
    mydata <- data.frame(matrix(unlist(z), nrow=n_row, byrow=T), stringsAsFactors=FALSE)
    n_col=ncol(mydata)
    # preprocessing testingdata
    testingdata=as.character(data$testingdata)
    testingdata=unlist(strsplit(testingdata,";"))
    # preprocessing other input parameters
    time_of_interest=data$time_of_interest
    time_of_interest=as.numeric(as.character(time_of_interest))
    index_time = data$index_time
    index_event = data$index_event
    variable_types = data$variable_types
    # necessary R packages
    install.packages("src/packages_survival/survival_2.37-7.zip",lib=".",repos=NULL,verbose=TRUE)
    library(survival)
    # prepare to build model
    attach(mydata)

    for (i in 1:n_col){ mydata[,i]=as.numeric(mydata[,i])} 
    d_time=paste("X",index_time,sep = "")
    d_event=paste("X",index_event,sep = "")
    v_time_event <- c(d_time,d_event)
    v_predictors = names(mydata)[!(names(mydata) %in% v_time_event)]

    variable_types = unlist(strsplit(as.character(variable_types),";"))

    len = length(v_predictors)
    c="" # construct the execution string
    for (i in 1:len){
    if(i==len){
    if(variable_types[i]!=0){ c=paste(c, "factor(",v_predictors[i],")",sep="")}
     else{ c=paste(c, v_predictors[i])}
    }else{
    if(variable_types[i]!=0){c=paste(c, "factor(",v_predictors[i],") + ",sep="")}
    else{c=paste(c, v_predictors[i],"+")}
    }
    }
    f=paste("coxph(Surv(",d_time,",",d_event,") ~")
    f=paste(f,c)
    f=paste(f,", data=mydata )")

    # fit a Cox proportional hazards model and get the predicted survival curve for a testing instance 
    fit=eval(parse(text=f))

    testingdata = as.data.frame(matrix(testingdata, ncol=len,byrow = TRUE),stringsAsFactors=FALSE)
    names(testingdata)=v_predictors
    for (i in 1:len){ testingdata[,i]=as.numeric(testingdata[,i])}

    curve=survfit(fit,testingdata)

    # based on user input, find the event occurance probablity
    position_closest=which.min(abs(prob_event$time - time_of_interest))

    if(prob_event[position_closest,"time"]==time_of_interest){# exact match
    output=prob_event[position_closest,"prob"]
    }else{# not exact match
    if(time_of_interest>max(prob_event$time)){
    output=prob_event[position_closest,"prob"]
    }else if(time_of_interest<min(prob_event$time)){
    output=prob_event[position_closest,"prob"]
    }else{output=(prob_event[position_closest,"prob"]+prob_event[position_closest+1,"prob"])/2}
    }
    #pull out results to send to web service
    output=paste(round(100*output, 2), "%") 
    maml.mapOutputPort("output"); #output port




##Limitations

This web service can only take numerical values as feature variables (columns). The “event” column can only take value 0 or 1. The “time” column needs to be a positive integer.

##FAQ
For Frequently Asked Questions on consumption of the web service or publishing to marketplace, see [here](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-marketplace-faq).

[1]: ./media/machine-learning-r-csharp-survival-analysis/survive_img2.png
