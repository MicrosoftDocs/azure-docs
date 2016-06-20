<properties 
	pageTitle="How to use the API Inspector to trace calls in Azure API Management" 
	description="Learn how to trace calls using the API Inspector in Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>

# How to use the API Inspector to trace calls in Azure API Management

API Management provides an API Inspector tool to help you with debugging and troubleshooting your APIs. The API Inspector can be used programmatically and can also be used directly from the developer portal. 

In addition to tracing operations, API Inspector also traces [policy expression](https://msdn.microsoft.com/library/azure/dn910913.aspx) evaluations. For a demonstration, see [Cloud Cover Episode 177: More API Management Features](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 21:00.

This guide provides a walk-through of using API Inspector.

>[AZURE.NOTE] API Inspector traces are only generated and made available for requests containing subscription keys that belong to the [administrator](api-management-howto-create-groups.md) account.

## <a name="trace-call"> </a> Use API Inspector to trace a call

To use API Inspector, add an **ocp-apim-trace: true** request header to your operation call, and then download and inspect the trace using the URL indicated by the **ocp-apim-trace-location** response header. This can be done programatically, and can also be done directly from the developer portal.

This tutorial shows how to use the API Inspector to trace operations using the Basic Calculator API that is configured in the [Manage your first API](api-management-get-started.md) getting started tutorial. If you haven't completed that tutorial it only takes a few moments to import the Basic Calculator API, or you can use another API of your choosing such as the Echo API. Each API Management service instance comes pre-configured with an Echo API that can be used to experiment with and learn about API Management. The Echo API returns back whatever input is sent to it. To use it, you can invoke any HTTP verb, and the return value will simply be what you sent. 



To get started, click **developer portal** in the Azure Classic Portal for your API Management service. Operations can be called directly from the developer portal which provides a convenient way to view and test the operations of an API.

>If you haven't yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

![API Management developer portal][api-management-developer-portal-menu]

Click **APIs** from the top menu, and then click **Basic Calculator**.

![Echo API][api-management-api]

Click **Try it** to try the **Add two integers** operation.

![Try it][api-management-open-console]

Keep the default parameter values, and select the subscription key for the product you want to use from the **subscription-key** drop-down.

By default in the developer portal the **Ocp-Apim-Trace** header is already set to **true**. This header configures whether or not a trace is generated.

![Send][api-management-http-get]

Click **Send** to invoke the operation.

![Send][api-management-send-results]

In the response headers will be an **ocp-apim-trace-location** with a value similar to the following example.

	ocp-apim-trace-location : https://contosoltdxw7zagdfsprykd.blob.core.windows.net/apiinspectorcontainer/ZW3e23NsW4wQyS-SHjS0Og2-2?sv=2013-08-15&sr=b&sig=Mgx7cMHsLmVDv%2B%2BSzvg3JR8qGTHoOyIAV7xDsZbF7%2Bk%3D&se=2014-05-04T21%3A00%3A13Z&sp=r&verify_guid=a56a17d83de04fcb8b9766df38514742

The trace can be downloaded from the specified location and reviewed as demonstrated in the next step.

## <a name="inspect-trace"> </a>Inspect the trace

To review the values in the trace, download the trace file from the **ocp-apim-trace-location** URL. It is a text file in JSON format, and contains entries similar to the following example.

	{
	    "traceId": "abcd8ea63d134c1fabe6371566c7cbea",
	    "traceEntries": {
	        "inbound": [
	            {
	                "source": "handler",
	                "timestamp": "2015-06-23T19:51:35.2998610Z",
	                "elapsed": "00:00:00.0725926",
	                "data": {
	                    "request": {
	                        "method": "GET",
	                        "url": "https://contoso5.azure-api.net/calc/add?a=51&b=49",
	                        "headers": [
	                            {
	                                "name": "Ocp-Apim-Subscription-Key",
	                                "value": "5d7c41af64a44a68a2ea46580d271a59"
	                            },
	                            {
	                                "name": "Connection",
	                                "value": "Keep-Alive"
	                            },
	                            {
	                                "name": "Host",
	                                "value": "contoso5.azure-api.net"
	                            }
	                        ]
	                    }
	                }
	            },
	            {
	                "source": "mapper",
	                "timestamp": "2015-06-23T19:51:35.2998610Z",
	                "elapsed": "00:00:00.0726213",
	                "data": {
	                    "configuration": {
	                        "api": {
	                            "from": "/calc",
	                            "to": {
	                                "scheme": "http",
	                                "host": "calcapi.cloudapp.net",
	                                "port": 80,
	                                "path": "/api",
	                                "queryString": "",
	                                "query": {},
	                                "isDefaultPort": true
	                            }
	                        },
	                        "operation": {
	                            "method": "GET",
	                            "uriTemplate": "/add?a={a}&b={b}"
	                        },
	                        "user": {
	                            "id": 1,
	                            "groups": [
	                                "Administrators",
	                                "Developers"
	                            ]
	                        },
	                        "product": {
	                            "id": 1
	                        }
	                    }
	                }
	            },
	            {
	                "source": "handler",
	                "timestamp": "2015-06-23T19:51:35.2998610Z",
	                "elapsed": "00:00:00.0727522",
	                "data": {
	                    "message": "Request is being forwarded to the backend service.",
	                    "request": {
	                        "method": "GET",
	                        "url": "http://calcapi.cloudapp.net/api/add?a=51&b=49",
	                        "headers": [
	                            {
	                                "name": "Ocp-Apim-Subscription-Key",
	                                "value": "5d7c41af64a44a68a2ea46580d271a59"
	                            },
	                            {
	                                "name": "X-Forwarded-For",
	                                "value": "33.52.215.35"
	                            }
	                        ]
	                    }
	                }
	            }
	        ],
	        "outbound": [
	            {
	                "source": "handler",
	                "timestamp": "2015-06-23T19:51:35.4256650Z",
	                "elapsed": "00:00:00.1960601",
	                "data": {
	                    "response": {
	                        "status": {
	                            "code": 200,
	                            "reason": "OK"
	                        },
	                        "headers": [
	                            {
	                                "name": "Pragma",
	                                "value": "no-cache"
	                            },
	                            {
	                                "name": "Content-Length",
	                                "value": "124"
	                            },
	                            {
	                                "name": "Cache-Control",
	                                "value": "no-cache"
	                            },
	                            {
	                                "name": "Content-Type",
	                                "value": "application/xml; charset=utf-8"
	                            },
	                            {
	                                "name": "Date",
	                                "value": "Tue, 23 Jun 2015 19:51:35 GMT"
	                            },
	                            {
	                                "name": "Expires",
	                                "value": "-1"
	                            },
	                            {
	                                "name": "Server",
	                                "value": "Microsoft-IIS/8.5"
	                            },
	                            {
	                                "name": "X-AspNet-Version",
	                                "value": "4.0.30319"
	                            },
	                            {
	                                "name": "X-Powered-By",
	                                "value": "ASP.NET"
	                            }
	                        ]
	                    }
	                }
	            },
	            {
	                "source": "handler",
	                "timestamp": "2015-06-23T19:51:35.4256650Z",
	                "elapsed": "00:00:00.1961112",
	                "data": {
	                    "message": "Response headers have been sent to the caller. Starting to stream the response body."
	                }
	            },
	            {
	                "source": "handler",
	                "timestamp": "2015-06-23T19:51:35.4256650Z",
	                "elapsed": "00:00:00.1963155",
	                "data": {
	                    "message": "Response body streaming to the caller is complete."
	                }
	            }
	        ]
	    }
	}

## <a name="next-steps"> </a>Next steps

-	Check out the other topics in the [Get started with advanced API configuration][] tutorial.
-	Watch a demo of tracing policy expressions in [Cloud Cover Episode 177: More API Management Features](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/). Fast-forward to 21:00 to see the demo.

>[AZURE.VIDEO episode-177-more-api-management-features-with-vlad-vinogradsky]

[Use API Inspector to trace a call]: #trace-call
[Inspect the trace]: #inspect-trace
[Next steps]: #next-steps

[Configure API settings]: api-management-howto-create-apis.md#configure-api-settings
[Responses]: api-management-howto-add-operations.md#responses
[How create and publish a product]: api-management-howto-add-products.md

[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Get started with advanced API configuration]: api-management-get-started-advanced.md
[Azure Classic Portal]: https://manage.windowsazure.com/


[api-management-developer-portal-menu]: ./media/api-management-howto-api-inspector/api-management-developer-portal-menu.png
[api-management-api]: ./media/api-management-howto-api-inspector/api-management-api.png
[api-management-echo-api-get]: ./media/api-management-howto-api-inspector/api-management-echo-api-get.png
[api-management-developer-key]: ./media/api-management-howto-api-inspector/api-management-developer-key.png
[api-management-open-console]: ./media/api-management-howto-api-inspector/api-management-open-console.png
[api-management-http-get]: ./media/api-management-howto-api-inspector/api-management-http-get.png
[api-management-send-results]: ./media/api-management-howto-api-inspector/api-management-send-results.png




 