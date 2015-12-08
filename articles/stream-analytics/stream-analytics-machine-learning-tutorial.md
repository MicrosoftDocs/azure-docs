<properties 
	pageTitle="Stream Analytics and Machine Learning integration tuorial | Microsoft Azure" 
	description="How to leverage UDF and machine learning in stream analytics"
	keywords="data input, streaming data"
	documentationCenter=""
	services="stream-analytics"
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"
/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="12/08/2015" 
	ms.author="jeffstok"
/>

# Introduction to Stream Analytics and Machine Learning integration #

This tutorial is designed to help you quickly setup a simple Stream Analytics and Machine Learning integrated job. At the end of this tutorial,  you will have a Stream Analytics job which reads data from Azure Blob Storage and outputs the data back into the same Blob Storage. Specifically, it will read the data from one container and will output into a different container. To demonstrate the value of Stream Analytics and Machine Learning integration, during the processing, the job will modify the input values by utilizing a simple Machine Learning model, such that f(“foo”) = “foo Hello World!”.

!image

Whilst this is clearly not a realistic use of Machine Learning on Streaming Data, this tutorial will provide the needed information to quickly understanding how can you combine the power of Stream Analytics and Machine Learning. You can replace the Machine Learning model in the tutorial with your own model and use this feature for your scenario.

Additional real world use-cases of this integration will be released in the future.

## Prerequisites

The prerequisites for this tutorial are an active Azure subscription and a CSV file with some data in it. For this tutorial, the CSV file below is being leveraged:

    LicensePlate,Make,Model
    JNB 7001,Honda,CRV
    YXZ 1001,Toyota,Camry
    ABC 1004,Ford,Taurus
    XYZ 1003,Toyota,Corolla
    BNJ 1007,Honda,CRV
    CDE 1007,Toyota,4x4
    BAC 1005,Toyota,Camry
    ZYX 1002,Honda,Accord
    ZXY 1001,Toyota,Camry
    CBA 1008,Ford,Mustang
    DCB 1004,Volvo,S80
    CDB 1003,Volvo,C30
    YZX 1009,Volvo,V70
    BCD 1002,Toyota,Rav4
    CBD 1005,Toyota,Camry
    NJB 1006,Ford,Focus
    PAC 1209,Chevy,Malibu
    EDC 3109,Ford,Focus
    DEC 1008,Toyota,Corolla
    DBC 1006,Honda,Civic
    APC 2019,Honda,Civic
    EDC 1019,Honda,Accord

At a high level, the following steps will be performed:

1.	Upload a CSV file to Blob Storage
2.	Create a Machine Learning workspace via the Azure Management Portal
3.	Create and deploy a Machine Learning model using AzureML Studio
4.	Create a Stream Analytics job which calls the model functions
5.	Start the Stream Analytics job and observe the output

## Upload a CSV file to a Blob Storage

For this step you can use any CSV file including the one I specified in the introduction. To upload the file, you can use any tool you like include writing some code. For simple tasks like this I usually use Visual Studio.

1.	Expand Azure and right click on the **Storage**. Choose **Attach External Storage** and provide **Account Name** and **Account Key**.
2.	Expand the storage you just attached and choose **Create Blob Container** and provide a logical name. Once created, double click on the container to view its contents (which will be empty at this point).
3.	Upload the CSV file by clicking the **Upload Blob** icon and then choose **file from the local disk**.

## Create a Machine Learning workspace

1.	Login to Azure Management Portal at [https://manage.windowsazure.com](https://manage.windowsazure.com). 
2.	Click **New**, **Data Services**, **Machine Learning**, **Quick Create**.
3.	Fill in the **Quick Create **form by providing the following:  
	a.	**Workspace Name**.  
	b.	**Workspace Owner**. The workspace owner must be a valid Microsoft account (e.g., name@outlook.com).  
	c.	**Location**.  
	d.	**Storage Account**. Here you can either choose an existing Storage Account or create a new one. This storage is internal to AML and hence is of little importance for this exercise.  
4.	Click **Create an ML Workspace** button.
5.	Once created, click on the **workspace** in the list of **workspaces** and navigate to the **Dashboard** tab. In the **Quick Glance** section of the Dashboard click **Sign-in to ML Studio**.

## Create and deploy a Machine Learning model

1.	In ML Studio, click New, Experiment, Blank Experiment. 
2.	Expand Data Input and Output and drag Reader node on to the canvas
3.	Select the Reader node which you just placed on the canvas. You should see the Properties of the Reader on the right side. Fill in the information about your Blob Storage which you configured in the Upload a CSV file to a Blob Storage section.  
	Note: don’t forget to check File has header row check box.
4.	On the left pane, select Data Transformation, Manipulation, Project Columns node and drag it onto the canvas. Connect Reader node with the Project Columns node.
5.	Select Project Columns node to see its Properties on the right pane. Click Launch column selector button. You should see the dialog box shown below. Provide a single name of the column and click the OK button. In my case I chose the “Model” column from my CSV file.
6.	On the left pane, expand Python Language Modules and drag Execute Python Script node to the canvas. Connect Project Columns node with Execute Python Script node.  
    Notice here that I connected Project Columns node to the first port of the three available input ports on the Execute Python Script.
7.	Select newly placed Execute Python Script node to see its Properties on the right pane. Modify Python Script section as follows:  
    a.	Write import pandas right before the definition of the function  
    b.  Delete the body of the function completely and replace it with `return pandas.DataFrame(dataframe1['Model'].apply(lambda x: x + ' Hello World!')),`  

	The only thing you need to change here is the name of the column which we select from dataframe1. In this case I selected the “Model” column. Also, please pay attention of the indentation of the return statement.  

	c.	In the end this is how the script looks. 

8.	On the left pane, expand **Web Service** and drag the **Input node** on the canvas. Connect the **Input node** with the **Execute Python Script** node.
9.	On the left pane, expand **Web Service** and drag **Output** on the canvas. Connect the **Output node** with **Execute Python Script** node.
10.	Click Run button at the bottom  
	It might take up to a minute to run the entire model. You will see how individual nodes are run one after another.  
11.	Click Deploy Web Service button the bottom  
12.	Once the service is deployed you will be navigated to the Web Services tab where you should see the Test button. This step is optional is only needed to make sure that the service which just deployed does what it’s supposed to do. Click on the Test button and a dialog box will prompt you for a sample input. I typed in “foo bar” and pressed OK.  
	This is what I got the test run was complete. The result was “foo bar Hello World!”, exactly what we expected.  
13.	Before we can move on to creating an ASA job we will need to pieces of information, the endpoint URL of the web service that we just deployed and the API Key which we can use to authenticate requests to that endpoint.  
	a.	On the same page where we tested our endpoint there should be an API key field. Copy that API key and store it somewhere temporarily.  
	b.	Click on the Request/Response link.  
	You will be navigated to a helper page of you web service. Copy the Request URI property and store it temporarily.  

## Create an Stream Analytics job which uses the Machine Learning model

1.	Navigate to Azure Management Portal [https://manage.windowsazure.com](https://manage.windowsazure.com).
2.	Click **New**, **Data Services**, **Stream Analytics**, **Quick Create**. Provide **Job Name**, **Region** in which the job should be created and choose a **Regional Monitoring Storage Account**.
3.	Once the job is created, navigate to the **Inputs** tab and click **Add Input**.
4.	On the first page of **Add Input** wizard window select **Data stream** and click next. On the second page select **Blob Storage** as an input and click next.
5.	On the **Blob Storage Settings** page of the wizard provide the same information we used when we were configuring the **Reader** in Machine Learning module. Click **next**.
6.	Choose CSV as **Event Serialization Format**. Take the defaults for the rest of the **Serialization settings**. Click **OK**.
7.	Navigate to the **Outputs** tab and click **Add an Output**.
8.	As with Output, choose **Blob Storage** and provide the same parameters with the exception of the container. In my case for example, my Input was configured to read from container called “cars”, that’s where I uploaded my CSV. For the Output I chose “carsoutput”.
9.	Click **Next** to configure output’s **Serialization settings**. As with Input, choose **CSV** and click **OK**.
10.	Navigate to the **Functions** tab and click **Add a Machine Learning Function**.
11.	On the **Machine Learning Web Service Settings** page, you should be able to find your Machine Learning workspace, web service and the default endpoint. However, you can always choose to provide settings manually and supply the endpoint **URL** and **API key** which was saved at the end of the **Create and Deploy Machine Learning Model** section. Once all the information has been provided, click **OK**.
12.	Navigate to the **Query** tab and modify the query ash shown below:  
	`select Model, helloworld(Model) from input`  
	The query selects the first column to be the unmodified column from the **input**. The second column is modified by invoking the Machine Learning **model**. The value from the **input**, say “Toyota”, will be passed to the Machine Learning model and will return “Toyota Hello World!”. This process will continue for every record of the **input**.  
	Click *Save* to save the query.  

## Start the ASA Job and observe the output

1.	Click **Start** at the bottom of the job. 
2.	On the **Start Query Dialog**, choose **Custom Time** and select a time prior to when the CSV was uploaded to Blob Storage. Click **OK**. 
3.	Navigate to the Blob Storage using the tool used when the CSV file was uploaded. This tutorial used Visual Studio.
4.	In few minutes after the job is started, the output container is created and a CSV file uploaded into it. In our example, it was “carscontainer”.
5.	Double clicking on the file will open the default CSV editor and should show something as below:  
	This step finalizes the exercise described in this article. 

## Conclusion

In this tutorial, an exercise of using a Machine Learning module was demonstrated as a function inside a Stream Analytics job. The processing power of Stream Analytics was extended by Machine Learning modules. Data was read from a Blob Storage, processed using a Machine Learning module, and outputted the result back into the same Blob Storage. 

Note:
1.	The choice of the **Input** and **Output** was fairly basic. The **input** could have been Event Hub and the **output** Power BI as an example. Conceptually, there is no difference.
2.	The same CSV was used as the **input** for a Stream Analytics job and as an **input** for a Machine Learning model. Again this is basic and chosen to demonstrate the concepts covered rather than a true "real world" scenario. The CSV in the Machine Learning module was only needed to define the model and to define the signature of the function. During the runtime of AML Web Service that CSV file and all the transformations that we performed (such as Project Columns) were not used. Hence, to define the AML model, a completely different CSV file with different schema and values could have been leveraged in a more advanced example.


