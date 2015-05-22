
<properties 
	pageTitle="Enhance your API App for Logic Apps" 
	description="This article demonstrates how to decorate your API App to work nicely with Logic Apps" 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="sameerch"
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="dotnet" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/18/2015" 
	ms.author="sameerch;guayan;tarcher"/>

# Enhance your API App for Logic Apps #

This article demonstrates how to decorate the API Defintion of your API App so that it works well with Logic Apps. This will enhance the end user experience for your API App when it is used in the Logic Apps designer.

Some articles to go through before this to help you get started.

1. [Create an API App](app-service-dotnet-create-api-app.md) - Create a new API app from scratch, or convert an existing Web API project to an API app.
2. [Deploy an API App](app-service-dotnet-deploy-api-app.md) - Deploy an API app to your Azure subscription.
3. [Debug an API App](app-service-dotnet-remotely-debug-api-app.md) - Use Visual Studio to remotely debug an API app running in Azure.
4. [Add triggers to an API App](app-service-api-dotnet-triggers.md) - Add triggers to an API App and consume them from Logic Apps


## Add Display Names ##
The default names of operations, fields and parameters may not be human readable at all - because of limitations imposed by programming languages, etc.  The Logic Apps designer can, where it is available, display a human readable text instead for the names of the operations, fields and parameters.  The logic apps designer will look for the presence of certain properties in the API definition described by the swagger metadata exported by your API App.  The following properties are used as the display name:

* Operations (Action and Triggers)  
  The value of the **summary** property if present, otherwise the value of **operationId** property.

* Parameters (Inputs)  
  The value of the **x-ms-summary** extension property if present, otherwise the value of the **name** property.

* Schema Fields (Output Responses)  
  The value of the **x-ms-summary** extension property if present, otherwise the value of the **name** property.

Avoid using a long text for the above properties.  We recommend you keep the length to 30 characters or less.  *NOTE: The Swagger 2.0 specification allows for upto 120 characters for the **summary** property.*



### Using XML Comments in API Definition generation

For development using Visual Studio, it is common practice to annotate your API Controllers using [XML comments](https://msdn.microsoft.com/en-us/library/b2s063f7.aspx).  When compiled with [/doc](https://msdn.microsoft.com/en-us/library/3260k4x7.aspx), the compiler will create an XML documentation file.  The swashbuckle toolset included with the API App SDK can incorporate those comments while generating the API metadata.

To enable this, follow the steps below:

1. In Visual Studio, go to Project > {Project Name} Properties. Make sure "XML documentation file" is checked and provide a value there.

2. Edit the SwaggerConfig.cs file and uncomment the line that calls GetXmlCommentsPath:


            GlobalConfiguration.Configuration 
                .EnableSwagger(c =>
                    {
                        ...
                        // If you annonate Controllers and API Types with
                        // Xml comments (http://msdn.microsoft.com/en-us/library/b2s063f7(v=vs.110).aspx), you can incorporate
                        // those comments into the generated docs and UI. You can enable this by providing the path to one or
                        // more Xml comment files.
                        //
                        c.IncludeXmlComments(GetXmlCommentsPath());
                        ...
                    }

3. Provide an implementation for the GetXmlCommentsPath method to return the XML documentation file as provided in Step 1 above.  For example:

        public static string GetXmlCommentsPath()
        {
            return System.String.Format(CultureInfo.InvariantCulture, @"{0}\bin\AzureStorageQueueConnector.xml", System.AppDomain.CurrentDomain.BaseDirectory);
        }


4. Specify XML comments in your code.  The following XML Comments are currently supported:


  * <summary\> - defines the summary of the operation or a brief description of model classes and fields.
  * <remarks\> - defines the description of operations.  Specify any other helpful text here.
  * <param\> - defines the description of parameters


**NOTE**: The XMl documentation comments are not metadata that can be read through Reflection, and will need to be packaged and deployed alongwith your API App.  Also, in Step 1 above, make sure that it is enabled for the configuration (Debug and Release) you will be using to publish your API App.  You can enable it for all configurations.


## Categorize Advanced Operations and Properties

The Logic Apps designer has limited real estate for showing operations, parameters and properties. Besides, it is possible that an API App provides an extensive set of operations or properties.  This can clutter the space on the designer and impacts the user experience.

To overcome this, an API App can classify its operations and properties into various categories.  By using a proper categorization of the operations and properties, an API App can increase the user experience by presenting the most basic and useful operations and properties first.  To achieve this, the logic apps designer look for the presence of a specific custom vendor extension properties in the swagger API definition of your API App. This property is named **x-ms-visibility** and can take the following values:

* empty or "none"  
  These are treated as normal operations and properties.

* "advanced"  
  These operations or properties are treated as advanced.  These are hidden by default but the user can make these visible.

* "internal"  
  These operations or properties are treated as system or internal properties and not meant to be directly used by the user.  These are hidden by the designer, and is available only in the Code view.  For such properties, you may also specify the **x-ms-scheduler-recommendation** extension property to set the value through the Logic Apps designer.  For an example, refer the article on [adding triggers to an API App](app-service-api-dotnet-triggers.md).


## Using Custom Attributes to annotate extension properties

As mentioned above, custom vendor extension properties are used to annotate the API metadata to provide richer information that the Logic Apps designer can use.  If you use static meatdata to describe your API app, you can directly edit the */metadata/apiDefinition.swagger.json* in your project to add the necessary extension properties manually.

For API apps that use dynamic metadata, you can make use of custom attributes to annotate your code.  And then, you can define an operation filter in the SwaggerConfig.cs file to look for the custom attributes and add the necessary vendor extension.  This approach is described in detail below for dynamically generating the **x-ms-summary** extension property.

1. Define an attribute class **CustomSummaryAttribute** which will be used to annotate your code.
	
	    [AttributeUsage(AttributeTargets.All)]
	    public class CustomSummaryAttribute : Attribute
	    {
	        public string SummaryText { get; internal set; }

	        public CustomSummaryAttribute(string summaryText)
	        {
	            this.SummaryText = summaryText;
	        }
	    }

2. Define an operation filter **AddCustomSummaryFilter** that will look for this custom attribute in the operation parameters.

	    public class AddCustomSummaryFilter : IOperationFilter
	    {
	        public void Apply(Operation operation, SchemaRegistry schemaRegistry, System.Web.Http.Description.ApiDescription apiDescription)
	        {
	            if (operation.parameters == null)
	            {
	                // no parameter
	                return;
	            }

	            foreach (var param in operation.parameters)
	            {
	                var summaryAttributes = apiDescription.ParameterDescriptions.First(x => x.Name.Equals(param.name))
	                                        .ParameterDescriptor.GetCustomAttributes<CustomSummaryAttribute>();

	                if (summaryAttributes != null && summaryAttributes.Count > 0)
	                {
	                    // add x-ms-summary extension
	                    if (param.vendorExtensions == null)
	                    {
	                        param.vendorExtensions = new Dictionary<string, object>();
	                    }
	                    param.vendorExtensions.Add("x-ms-summary", summaryAttributes[0].SummaryText);
	                }
	            }
	        }
	    }

3. Edit the SwaggerConfig.cs file and add the filter class defined above:


            GlobalConfiguration.Configuration 
                .EnableSwagger(c =>
                    {
                        ...
                        c.OperationFilter<AddCustomSummaryFilter>();
                        ...
                    }

4. Use the **CustomSummaryAttribute** class to annotate your code.  For example:

        /// <summary>
        /// Send Message
        /// </summary>
        /// <param name="queueName">The name of the Storage Queue</param>
        /// <param name="messageText">The message text to be sent</param>
        public void SendMessage(
            [CustomSummary("Queue Name")] string queueName,
            [CustomSummary("Message Text")] string messageText)
        {
             ...
        }

	When you build the above API app, it would generate the following API metadata:


			...
            "post": {
                ...
                "parameters": [
                    {
                        "name": "queueName",
                        "in": "query",
                        "description": "The name of the Storage Queue",
                        "required": true,
                        "x-ms-summary": "Queue Name",
                        "type": "string"
                    },
                    {
                        "name": "messageText",
                        "in": "query",
                        "description": "The message text to be sent",
                        "required": true,
                        "x-ms-summary": "Message Text",
                        "type": "string"
                    }
                ],
                ...



5. Similarly, you can define schema filter **AddCustomSummarySchemaFilter** to automatically annotate the **x-ms-summary** extension property for your schema models.  For example:

	    public class AddCustomSummarySchemaFilter: ISchemaFilter
	    {
	        public void Apply(Schema schema, SchemaRegistry schemaRegistry, Type type)
	        {
	            SetCustomSummary(schema, type.GetCustomAttribute<CustomSummaryAttribute>());
	
	            if (schema.properties != null)
	            {
	                foreach (var property in schema.properties)
	                {
	                    var summaryAttribute = type.GetProperty(property.Key).GetCustomAttribute<CustomSummaryAttribute>();
	                    SetCustomSummary(property.Value, summaryAttribute);
	                }
	            }
	        }

	        private static void SetCustomSummary(Schema schema, CustomSummaryAttribute summaryAttribute)
	        {
	            if (summaryAttribute != null)
	            {
	                if (schema.vendorExtensions == null)
	                {
	                    schema.vendorExtensions = new Dictionary<string, object>();
	                }
	                schema.vendorExtensions.Add("x-ms-summary", summaryAttribute.SummaryText);
	            }
	        }
	    }


 
## Summary

You have seen how you can enhance the user experience of your API App when it is used in the Logic Apps designer.  As a best practice, it is recommended that you provide proper friendly names for all operations (actions and triggers), parameters and properties.  We also recommend that you provide not more than 5 basic operations.  For input parameters, we recommend you restrict the number of basic properties to not more than 4.  And for properties, we recommend you keep this to 5 or less.  You should mark the rest as advanced as described above.


