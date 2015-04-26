<properties 
	pageTitle="How to use the API Inspector to trace calls in Azure API Management" 
	description="Learn how to trace calls using the API Inspector in Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="sdanie"/>

# How to use the API Inspector to trace calls in Azure API Management

API Management provides an API Inspector tool to help you with debugging and troubleshooting your APIs. The API Inspector can be used programatically from your applications, and can also be used directly from the developer portal. This guide provides a walk-through of using API Inspector.

## <a name="trace-call"> </a> Use API Inspector to trace a call

To use API Inspector, add an **ocp-apim-trace: true** request header to your operation call, and then download and inspect the trace using the URL indicated by the **ocp-apim-trace-location** response header. This can be done programatically, and can also be done directly from the developer portal.

This tutorial shows how to use the API Inspector to trace operations using the Echo API.

>Each API Management service instance comes pre-configured with an Echo API that can be used to experiment with and learn about API Management. The Echo API returns back whatever input is sent to it. To use it, you can invoke any HTTP verb, and the return value will simply be what you sent. 

To get started, click **Development Portal** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

![API Management developer portal][api-management-developer-portal-menu]

Operations can be called directly from the developer portal, which provides a convenient way to view and test the operations of an API. In this tutorial step you will call the **Get Resource** method of **Echo API**. 

Click **APIs** from the top menu, and then click **Echo API**.

![Echo API][api-management-echo-api]

>If you have only one API configured or visible to your account, then clicking APIs takes you directly to the operations for that API.

Select the **GET Resource** operation, and click **Open Console**.

![Open console][api-management-open-console]

Keep the default parameter values, and select your subscription key from the **subscription-key** drop-down.

Type **ocp-apim-trace: true** in the **Request headers** text box, and click **HTTP Get**.

![HTTP Get][api-management-http-get]

In the response headers will be an **ocp-apim-trace-location** with a value similar to the following example.

	ocp-apim-trace-location : https://contosoltdxw7zagdfsprykd.blob.core.windows.net/apiinspectorcontainer/ZW3e23NsW4wQyS-SHjS0Og2-2?sv=2013-08-15&sr=b&sig=Mgx7cMHsLmVDv%2B%2BSzvg3JR8qGTHoOyIAV7xDsZbF7%2Bk%3D&se=2014-05-04T21%3A00%3A13Z&sp=r&verify_guid=a56a17d83de04fcb8b9766df38514742

The trace can be downloaded from the specified location and reviewed, as demonstrated in the next step.

## <a name="inspect-trace"> </a>Inspect the trace

To review the values in the trace, download the trace file from the **ocp-apim-trace-location** URL. It is a text file in JSON format, and contains entries similar to the following example.

	{
	  "validityGuid":"a43a07a03de04fcb8b1425df38514742",
	  "logEntries":[
		{
			"timestamp":"2014-05-03T21:00:13.2182473Z",
			"source":"Microsoft.WindowsAzure.ApiManagement.Proxy.Gateway.Handlers.DebugLoggingHandler",
			"data":{
			"originalRequest":{
				"method":"GET",
				"url":"https://contosoltd.current.int-azure-api.net/echo/resource?param1=sample&subscription-key=...",
				"headers":[
				{
					"name":"ocp-apim-tracing",
					"value":"true"
				},
				{
					"name":"Host",
					"value":"contosoltd.current.int-azure-api.net"
				}
				]
			}
			}
		},
		{
		  "timestamp":"2014-05-03T21:00:13.2182473Z",
		  "source":"request handler",
		  "data":{
			"configuration":{
			  "api":{
				"from":"echo",
				"to":"http://echoapi.cloudapp.net/api"
			  },
			  "operation":{
				"method":"GET",
				"uriTemplate":"/resource"
			  },
			  "user":{
				"id":1,
				"groups":[
              
				]
			  },
			  "product":{
				"id":1
			  }
			}
		  }
		},
		{
		  "timestamp":"2014-05-03T21:00:13.2182473Z",
		  "source":"backend call handler",
		  "data":{
			"message":"Sending request to the service.",
			"request":{
			  "method":"GET",
			  "url":"http://echoapi.cloudapp.net/api/resource?param1=sample&subscription-key=...",
			  "headers":[
				{
				  "name":"X-Forwarded-For",
				  "value":"138.91.78.77"
				},
				{
				  "name":"ocp-apim-tracing",
				  "value":"true"
				}
			  ]
			}
		  }
		},
		{
		  "timestamp":"2014-05-03T21:00:13.2182473Z",
		  "source":"backend call handler",
		  "data":{
			"status":{
			  "code":200,
			  "reason":"OK"
			},
			"headers":[
			  {
				"name":"Pragma",
				"value":"no-cache"
			  },
			  {
				"name":"Host",
				"value":"echoapi.cloudapp.net"
			  },
			  {
				"name":"X-Forwarded-For",
				"value":"138.91.78.77"
			  },
			  {
				"name":"ocp-apim-tracing",
				"value":"true"
			  },
			  {
				"name":"Content-Length",
				"value":"0"
			  },
			  {
				"name":"Cache-Control",
				"value":"no-cache"
			  },
			  {
				"name":"Expires",
				"value":"-1"
			  },
			  {
				"name":"Server",
				"value":"Microsoft-IIS/8.0"
			  },
			  {
				"name":"X-AspNet-Version",
				"value":"4.0.30319"
			  },
			  {
				"name":"X-Powered-By",
				"value":"Azure API Management - http://api.azure.com/,ASP.NET"
			  },
			  {
				"name":"Date",
				"value":"Sat, 03 May 2014 21:00:17 GMT"
			  }
			]
		  }
		}
	  ]
	}


## <a name="next-steps"> </a>Next steps

-	Check out the other topics in the [Get started with advanced API configuration][] tutorial.

[Use API Inspector to trace a call]: #trace-call
[Inspect the trace]: #inspect-trace
[Next steps]: #next-steps

[Configure API settings]: api-management-howto-create-apis.md#configure-api-settings
[Responses]: api-management-howto-add-operations.md#responses
[How create and publish a product]: api-management-howto-add-products.md

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Get started with advanced API configuration]: api-management-get-started-advanced.md
[Management Portal]: https://manage.windowsazure.com/


[api-management-developer-portal-menu]: ./media/api-management-howto-api-inspector/api-management-developer-portal-menu.png
[api-management-echo-api]: ./media/api-management-howto-api-inspector/api-management-echo-api.png
[api-management-echo-api-get]: ./media/api-management-howto-api-inspector/api-management-echo-api-get.png
[api-management-developer-key]: ./media/api-management-howto-api-inspector/api-management-developer-key.png
[api-management-open-console]: ./media/api-management-howto-api-inspector/api-management-open-console.png
[api-management-http-get]: ./media/api-management-howto-api-inspector/api-management-http-get.png





