#Web Search SDK quickstart
The Bing Web Search SDK contains the functionality of the REST API without the complexity of writing web requests and parsing results. 

##Application dependencies
To set up a console application using the Bing Web Search SDK, browse to Manage NuGet Packages option from the Solution Explorer in Visual Studio and add the following packages:
> [!div class="checklist"]
>* Microsoft.Azure.CognitiveServices.Search.WebSearch
>* Microsoft.Rest.ClientRuntime
>* Microsoft.Rest.ClientRuntime.Azure
>* Newtonsoft.Json

![[NuGet packages]]({media\NuGetPkgs.png})

##Web Search client
Create an instance of the `WebSearchAPI`.
