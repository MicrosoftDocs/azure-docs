<properties
   pageTitle="Testing Azure Functions | Microsoft Azure"
   description="Test your Azure Functions using Postman, cURL, and Node.js."
   services="functions"
   documentationCenter="na"
   authors="wesmc7777"
   manager="erikre"
   editor=""
   tags=""
   keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture, testing"/>

<tags
   ms.service="functions"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="03/18/2016"
   ms.author="wesmc"/>

# Testing Azure Functions

## Overview

In this tutorial, we will walk through a few different approaches and tools that can be used for testing functions. We will define a very simple function that accepts input through a query string parameter, or the request body. The **HttpTrigger Nodejs Function** template supports a `name` query string parameter. We will also add code to support the parameter along with `address` information for the user in the request body.


## Creating a function for testing

For the purposes of this tutorial, we will use a slightly modified version of the **HttpTrigger Nodejs Function** template that is available when creating a new function.  You can review the [Create your first Azure Function tutorial](https://azure.microsoft.com/) if you need help creating a new function.  Just choose the **HttpTrigger Nodejs Function** template.

This function template by default is basically a hello world function echoing back the name you provide as input in the form of a query string parameter, `name=<your name>`.  We will update the code to also allow you to provide the name and an address as JSON content in the request body. Then the function will echo these back to the client.   

Update the function with the following code which we will use for testing:

	module.exports = function (context, req) {
	    context.log('Node.js HTTP trigger function processed a request. RequestUri=' + req.originalUrl);
	    context.log('Request Headers = ' + JSON.stringify(req.headers));
	
	    // If Query string name parameter not provided, check body
	    if (typeof req.query.name == 'undefined') 
	    {
	        context.log('Name not provided as query string param. Checking body...'); 
	        bodyJSON = req.body;
	        
	        if (typeof bodyJSON == 'Object')
	        {
	            context.log('Request Body Type = Object'); 
	            context.log('Request Body JSON = ' + JSON.stringify(req.body)); 
	        }
	        else if (typeof bodyJSON == 'string')
	        {
	            context.log('Request Body Type = string'); 
	            context.log('Request Body JSON = ' + bodyJSON);
	            bodyJSON = JSON.parse(bodyJSON);
	        }
	        else
	        {
	             context.log('Request Body Type = ' + typeof bodyJSON);
	             context.log('Request Body = ' + bodyJSON);
	        }       
	        
	        if ((typeof bodyJSON != 'undefined') && (typeof bodyJSON.name != 'undefined'))
	        {
	            if (typeof bodyJSON.address != 'undefined')
	                ProcessNewUserInformation(context, bodyJSON.name, bodyJSON.address);    
	            else
	                ProcessNewUserInformation(context, bodyJSON.name);   
	        }
	        else 
	        {
	            context.res = {
	                status: 400,
	                body: "Please pass a name in the request body or query string"
	            }
	        }
	    }
	    else {
	        context.log('Name was provided as a query string param.'); 
	        ProcessNewUserInformation(context, req.query.name);
	    }
	    context.done();
	    
	};
	
	function ProcessNewUserInformation(context, name, address)
	{    
	    context.log('Processing User Information...');            
	    echoString = "Hello " + name;
	    
	    if (typeof address != 'undefined')
	    {
	        echoString += "\n" + "The address you provided is " + address;
	    }
	    
	    context.res = {
	            // status: 200, /* Defaults to 200 */
	            body: echoString
	        };
	}


## Test with a browser

Functions that do not require parameters, or only need query string parameters, can be tested using a browser.

To test the function we defined above, copy the **Function Url** from the portal. It will have the following form:

	https://<Your Function App>.azurewebsites.net/api/<Your Function Name>?code=<your access code>

Append the `name` query string parameter as follows, using an actual name for the `<Enter a name here>` place holder.

	https://<Your Function App>.azurewebsites.net/api/<Your Function Name>?code=<your access code>&name=<Enter a name here>"

Paste the URL into your browser and you should get a response similar to the following.

![](./media/functions-test-a-function/browser-test.png)

In the portal **Logs** window, output similar to the following is logged while executing the function:

	2016-03-23T07:34:59  Welcome, you are now connected to log-streaming service.
	2016-03-23T07:35:09.195 Function started (Id=61a8c5a9-5e44-4da0-909d-91d293f20445)
	2016-03-23T07:35:10.338 Node.js HTTP trigger function processed a request. RequestUri=https://functionsExample.azurewebsites.net/api/WesmcHttpTriggerNodeJS1?code=XXXXXXXXXX==&name=Wes from a browser
	2016-03-23T07:35:10.338 Request Headers = {"cache-control":"max-age=0","connection":"Keep-Alive","accept":"text/html","accept-encoding":"gzip","accept-language":"en-US"}
	2016-03-23T07:35:10.338 Name was provided as a query string param.
	2016-03-23T07:35:10.338 Processing User Information...
	2016-03-23T07:35:10.369 Function completed (Success, Id=61a8c5a9-5e44-4da0-909d-91d293f20445)



## Testing with the Run button

The portal provides a **Run** button which will allow you to do some limited testing. You can provide a request body using the run button but, you can't provide query string parameters or update request headers.

Add a JSON string similar to the following in the **Request body** field then click the **Run** button.

	{
		"name" : "Wes testing Run button",
		"address" : "USA"
	} 

In the portal **Logs** window, output similar to the following is logged while executing the function:

	2016-03-23T08:03:12  Welcome, you are now connected to log-streaming service.
	2016-03-23T08:03:17.357 Function started (Id=753a01b0-45a8-4125-a030-3ad543a89409)
	2016-03-23T08:03:18.697 Node.js HTTP trigger function processed a request. RequestUri=https://functions841def78.azurewebsites.net/api/wesmchttptriggernodejs1
	2016-03-23T08:03:18.697 Request Headers = {"connection":"Keep-Alive","accept":"*/*","accept-encoding":"gzip","accept-language":"en-US"}
	2016-03-23T08:03:18.697 Name not provided as query string param. Checking body...
	2016-03-23T08:03:18.697 Request Body Type = string
	2016-03-23T08:03:18.697 Request Body JSON = {
	"name" : "Wes testing Run button",
	"address" : "USA"
	}
	2016-03-23T08:03:18.697 Processing User Information...
	2016-03-23T08:03:18.744 Function completed (Success, Id=753a01b0-45a8-4125-a030-3ad543a89409)




## Testing with Postman

The recommended tool to test calling your functions is Postman. To install Postman, see [Get Postman](https://www.getpostman.com/). Postman provides control over many more attributes of an HTTP request.

To test the function with a request body in Postman: 

1. Launch Postman from the **Apps** button in the upper left of corner of a Chrome browser.
2. Copy your **Function Url** for your function and paste it into Postman. It includes the access code.
3. Change the HTTP method to **POST**.
4. Click **Body** > **raw** and add JSON request body similar to the following:

		{
		    "name" : "Wes testing with Postman",
		    "address" : "Seattle, W.A. 98101"
		}

5. Click **Send**.

The following image shows testing the simple echo function example in this tutorial. 

![](./media/functions-test-a-function/postman-test.png)

In the portal **Logs** window, output similar to the following is logged while executing the function:

	2016-03-23T08:04:51  Welcome, you are now connected to log-streaming service.
	2016-03-23T08:04:57.107 Function started (Id=dc5db8b1-6f1c-4117-b5c4-f6b602d538f7)
	2016-03-23T08:04:57.763 Node.js HTTP trigger function processed a request. RequestUri=https://functions841def78.azurewebsites.net/api/WesmcHttpTriggerNodeJS1?code=XXXXXXXXXX==
	2016-03-23T08:04:57.763 Request Headers = {"cache-control":"no-cache","connection":"Keep-Alive","accept":"*/*","accept-encoding":"gzip","accept-language":"en-US"}
	2016-03-23T08:04:57.763 Name not provided as query string param. Checking body...
	2016-03-23T08:04:57.763 Request Body Type = object
	2016-03-23T08:04:57.763 Request Body = [object Object]
	2016-03-23T08:04:57.763 Processing User Information...
	2016-03-23T08:04:57.795 Function completed (Success, Id=dc5db8b1-6f1c-4117-b5c4-f6b602d538f7)



## Testing with Node.js code

You can use Node.js code similar to the following to test your Azure Function from Node.JS. Make sure to set the `host` used in the request options as well as your access code (`<your code>`) in the `path`.

	var http = require('http');
	
	var nameData = "name=Wes%20Query%20String%20Test%20From%20Node.js";
	var nameBodyJSON = '{"name" : "Wes testing with Node.JS code","address" : "Dallas, T.X. 75201"}';	
	
	var options = {
	  host: 'functionsExample.azurewebsites.net',
	  //path: '/api/WesmcHttpTriggerNodeJS1/?code=<your code>&' + nameData,
	  path: '/api/WesmcHttpTriggerNodeJS1/?code=<your code>',
	  method: 'POST',
	  headers : {
	      "Content-Type":"application/json",
	      "Content-Length": Buffer.byteLength(nameBodyJSON)
	    }
	};
	
	callback = function(response) {
	  var str = ''
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	
	  response.on('end', function () {
	    console.log(str);
	  });
	}
	
	var req = http.request(options, callback);
	console.log("*** Sending name and address in body ***");
	console.log(nameBodyJSON);
	req.end(nameBodyJSON);


Output:

	C:\Users\Wesley\testing\Node.js>node testHttpTriggerExample.js
	*** Sending name and address in body ***
	{"name" : "Wes testing with Node.JS code","address" : "Dallas, T.X. 75201"}
	Hello Wes testing with Node.JS code
	The address you provided is Dallas, T.X. 75201
		
In the portal **Logs** window, output similar to the following is logged while executing the function:

	2016-03-23T08:08:55  Welcome, you are now connected to log-streaming service.
	2016-03-23T08:08:59.736 Function started (Id=607b891c-08a1-427f-910c-af64ae4f7f9c)
	2016-03-23T08:09:01.153 Node.js HTTP trigger function processed a request. RequestUri=http://functionsExample.azurewebsites.net/api/WesmcHttpTriggerNodeJS1/?code=XXXXXXXXXX==
	2016-03-23T08:09:01.153 Request Headers = {"connection":"Keep-Alive","host":"functionsExample.azurewebsites.net"}
	2016-03-23T08:09:01.153 Name not provided as query string param. Checking body...
	2016-03-23T08:09:01.153 Request Body Type = object
	2016-03-23T08:09:01.153 Request Body = [object Object]
	2016-03-23T08:09:01.153 Processing User Information...
	2016-03-23T08:09:01.215 Function completed (Success, Id=607b891c-08a1-427f-910c-af64ae4f7f9c)

