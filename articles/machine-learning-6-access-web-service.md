<properties title="Access the web service" pageTitle="Access the web service" description="Step 6: Access an active ML API web service" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />  

#Access the web service
To be useful as a web service, users need to be able to send data to the service and receive results. The web service is an Azure web service which can receive and return data in one of two ways:  

-	**Request/Response** – The user sends a single set of credit data to the service using an HTTP protocol, and the service responds with a single set of results.
-	**Batch Execution** – The user sends to the service the URL of an Azure BLOB which contains one or more rows of credit data. The service stores the results in another BLOB and returns the URL of that container.  

On the **DASHBOARD** tab for the web service, there are two links to information that will help a developer write code to access this service. Click the **API help page** link on the **REQUEST/RESPONSE** row and a page opens that contains sample code to use the service’s request/response protocol. Similarly, the link on the **BATCH EXECUTION** row provides example code for making a batch request to the service.  

The API help page includes samples for R, C#, and Python programming languages. For example, here is the R code that you could use to access the web service we published (the actual service URL would be displayed in your sample code):  

	library("RCurl")
	library("RJSONIO")
	
	h = basicTextGatherer()
	req = list(Id="score00001",
	 Instance=list(FeatureVector=list(
	    "row.names"= "0",
	    "Status of checking account"= "0",
	    "Duration in months"= "0",
	    "Credit history"= "0",
	    "Purpose"= "0",
	    "Credit amount"= "0",
	    "Savings account/bond"= "0",
	    "Present employment since"= "0",
	    "Installment rate in percentage of disposable income"= "0",
	    "Personal status and sex"= "0",
	    "Other debtors"= "0",
	    "Present residence since"= "0",
	    "Property"= "0",
	    "Age in years"= "0",
	    "Other installment plans"= "0",
	    "Housing"= "0",
	    "Number of existing credits"= "0",
	    "Job"= "0",
	    "Number of people providing maintenance for"= "0",
	    "Telephone"= "0",
	    "Foreign worker"= "0",
	    "Credit risk"= "0"
	 ),GlobalParameters=fromJSON('{}')))
	
	body = toJSON(req)
	api_key = "abc123" # You can obtain the API key from the publisher of the web service
	
	h$reset()
	curlPerform(url = "http://xxx.cloudapp.net/workspaces/xxx/services/xxx/score",
	            httpheader=c('Content-Type' = "application/json", 'Authorization' = "Bearer " + api_key),
	            postfields=body,
	            writefunction = h$update,
	            verbose = TRUE
	            )
	
	result = h$value()


