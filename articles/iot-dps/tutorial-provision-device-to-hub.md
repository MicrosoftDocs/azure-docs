<!-------------------
Definition of Tutorial: 
- Prescriptive end-to-end how-to content which describes how to build and manage with a particular 
service.  
- Tutorials should be cross-service and represent the top 80% of use cases for the products. 
- The different tutorials should build upon eachother.  
- The first Tutorial should include Quickstart information to make sure customers 
don't get lost. 
- Rules for screenshots at the end of this template
- Metadata for this article should have ms.topic: tutorial; ms.custom: mvc
-->

*EXAMPLE*:
# Create a serverless API using Azure Functions
<---! # Page heading (H1) - Unique, complements the page title, and 100 characters or fewer including 
spaces --->


In this tutorial you will learn how Azure Functions allows you to build highly-scalable APIs. 
Azure Functions comes with a collection of built-in HTTP triggers and bindings which make it easy 
to author an endpoint in a variety of languages, including Node.JS, C#, and more. 
In this tutorial, you will customize an HTTP trigger to handle specific actions in your API design. 
You will also prepare for growing your API by integrating it with Azure Functions Proxies and 
setting up mock APIs. All of this is accomplished on top of the Functions serverless 
compute environment, so you don't have to worry about scaling resources - you can just focus on 
your API logic.
<---! Intro sentence describing the steps outlined in the article --->

## Prerequisites
<---! Link to the previous Quickstart and provide additional information required for completing the Tutorial
-->

*EXAMPLE*:
[!INCLUDE [Previous quickstart note](../../includes/functions-quickstart-previous-topics.md)]

The resulting function will be used for the rest of this tutorial.


<----! Clean up or delete any Azure work that may incur costs --->

*REQUIRED*:
## Next steps
<---! Summarize what you learned and use the required syntax for formatting consistency: [!div class="checklist"] and [!div class="nextstepaction"] 

*EXAMPLE*:
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Map a subdomain by using a CNAME record
> * Map a root domain by using an A record
> * Map a wildcard domain by using a CNAME record
> * Automate domain mapping with scripts

Advance to the next tutorial to learn how to bind a custom SSL certificate to it.

> [!div class="nextstepaction"]
> [Bind an existing custom SSL certificate to Azure Web Apps](app-service-web-tutorial-custom-ssl.md)

<---! 
Rules for screenshots:
- Use default Public Portal colors
- Browser included in the first shot (especially) but all shots if possible
- Resize the browser to minimize white space
- Include complete blades in the screenshots
- Linux: Safari – consider context in images
Guidelines for outlining areas within screenshots:
	- Red outline #ef4836
	- 3px thick outline
	- Text should be vertically centered within the outline.
	- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->