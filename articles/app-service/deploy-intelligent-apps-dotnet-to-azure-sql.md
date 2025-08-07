---
title: 'Deploy a .NET Blazor app connected to Azure SQL and Azure OpenAI on Azure App Service'
description: Get started connecting Azure SQL to your OpenAI app
author: jeffwmartinez
ms.author: jefmarti
ms.date: 04/17/2025
ms.update-cycle: 180-days
ms.topic: article
ms.custom:
  - devx-track-dotnet
  - linux-related-content
  - build-2025
ms.collection: ce-skilling-ai-copilot
---

# Deploy a .NET Blazor app connected to Azure SQL and Azure OpenAI on Azure App Service

When creating intelligent apps, you may want to ground the context of your app using your own SQL data. With the recent announcement of [Azure SQL vector support (preview)](https://devblogs.microsoft.com/azure-sql/announcing-eap-native-vector-support-in-azure-sql-database/), you can ground the context using the Azure SQL data you already have with new [vector functions](/sql/t-sql/functions/vector-functions-transact-sql) that help manage vector data. 

In this tutorial, you'll create a RAG sample application by setting up a Hybrid vector search against your Azure SQL database using a .NET 8 Blazor app. This example builds from the previous documentation to deploy a [.NET Blazor app with OpenAI](tutorial-ai-openai-chatbot-dotnet.md). If you'd like to deploy the app using an azd template, you can visit the [Azure Samples repo](https://github.com/Azure-Samples/blazor-azure-sql-vector-search?tab=readme-ov-file#deploy-with-azure-developer-cli) with deployment instructions.

## Prerequisites

- An [Azure OpenAI](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Ckeyless%2Ctypescript-keyless%2Cpython#set-up) resource with deployed models
- A .NET 8 or 9 Blazor Web App deployed on App Service
- An Azure SQL database resource with vector embeddings.

## 1. Set up Blazor web app

For this example, we're creating a simple chat box to interact with. If you're using the prerequisite .NET Blazor app from the [previous article](tutorial-ai-openai-chatbot-dotnet.md), you can skip the changes to the *OpenAI.razor* file as the content is the same. However, you need to make sure the following packages are installed:

Install the following packages to interact with Azure OpenAI and Azure SQL.

- `Microsoft.SemanticKernel`
- `Microsoft.Data.SqlClient`

1. Right click on the **Pages** folder found under the **Components** folder and add a new item named *OpenAI.razor*
2. Add the following code to the *OpenAI.razor* file and click **Save**

```csharp
@page "/openai"
@rendermode InteractiveServer
@inject Microsoft.Extensions.Configuration.IConfiguration _config

<PageTitle>OpenAI</PageTitle>

<h3>OpenAI input query: </h3>
<input class="col-sm-4" @bind="userMessage" />
<button class="btn btn-primary" @onclick="SemanticKernelClient">Send Request</button>

<br />
<br />

<h4>Server response:</h4> <p>@serverResponse</p>

@code {

	@using Microsoft.SemanticKernel;
	@using Microsoft.SemanticKernel.ChatCompletion;
	
	}
```

### API keys and endpoints

Using the Azure OpenAI resource requires the use of API keys and endpoint values. See [Use Key Vault references as app settings in Azure App Service and Azure Functions](app-service-key-vault-references.md) to manage and handle your secrets with Azure OpenAI. Although not required, we do recommend using managed identity to secure your client without the need to manage API keys. See the previous [documentation](tutorial-ai-openai-chatbot-dotnet.md) to set up your Azure OpenAI client in the next step to use managed identity with Azure OpenAI.

## 2. Add Azure OpenAI client

After adding the chat interface, we can set up the Azure OpenAI client using Semantic Kernel. Add the following code to create the client that connects to your Azure OpenAI resource. You need to use your Azure OpenAI API keys and endpoint information that were set up and handled in the previous step.

```csharp
@inject Microsoft.Extensions.Configuration.IConfiguration _config

@code {

	@using Microsoft.SemanticKernel;
	@using Microsoft.SemanticKernel.ChatCompletion;

	private string? userMessage;
	private string? serverResponse;

	private async Task SemanticKernelClient()
	{
	
		// App settings
		string deploymentName = _config["DEPLOYMENT_NAME"];
		string endpoint = _config["ENDPOINT"];
		string apiKey = _config["API_KEY"];
		string modelId = _config["MODEL_ID"];

		var builder = Kernel.CreateBuilder();

		// Chat completion service
		builder.Services.AddAzureOpenAIChatCompletion(
			deploymentName: deploymentName,
			endpoint: endpoint,
			apiKey: apiKey,
			modelId: modelId
		);

		var kernel = builder.Build();

		// Create prompt template
		var chat = kernel.CreateFunctionFromPrompt(
            @"{{$history}}
            User: {{$request}}
            Assistant: ");

		ChatHistory chatHistory = new("""You are a helpful assistant that answers questions""");

		var chatResult = kernel.InvokeStreamingAsync<StreamingChatMessageContent>(
				chat,
				new()
					{
						{ "request", userMessage },
						{ "history", string.Join("\n", chatHistory.Select(x => x.Role + ": " + x.Content)) }
					}
			);

		string message = "";
		await foreach (var chunk in chatResult)
		{
			message += chunk;
		}

		// Add messages to chat history
		chatHistory.AddUserMessage(userMessage!);
		chatHistory.AddAssistantMessage(message);

		serverResponse = message;
```

From here, you should have a working chat application that is connected to OpenAI. Next, we'll set up our Azure SQL database to work with our chat application.

## 3. Deploy Azure OpenAI models

In order to prepare your Azure SQL database for vector search, you need to make use of an embedding model to generate embeddings used for searching in addition to your initial deployed language model. For this example, we're using the following models:
- `text-embedding-ada-002` is used to generate the embeddings
- `gpt-3.5-turbo` is used for the language model

These two models need to be deployed before continuing the next step. Visit the [documentation](/azure/ai-studio/how-to/deploy-models-openai) for deploying models with Azure OpenAI using Azure AI Foundry.

## 4. Vectorize your SQL database

To perform a hybrid vector search on your Azure SQL database, you first need to have the appropriate embeddings in your database. There are many ways you can vectorize your database. One option is to use the following [Azure SQL database vectorizer](https://github.com/Azure-Samples/azure-sql-db-vectorizer) to generate embeddings for your SQL database. Vectorize your Azure SQL database before continuing.

## 5. Create procedure to generate embeddings

With [Azure SQL vector support (preview)](https://devblogs.microsoft.com/azure-sql/announcing-eap-native-vector-support-in-azure-sql-database/), you can create a stored procedure that will use a Vector data type to store generated embeddings for search queries. The stored procedure invokes an external REST API endpoint to get the embeddings. See the [documentation](/azure-data-studio/quickstart-sql-database) to use Azure Data Studio to connect to your database before running the query. 

- Use the following to create a stored procedure with your preferred SQL query editor. You need to populate the @url parameter with your Azure OpenAI resource name and populate the rest endpoint with the API key from your text embedding model. You'll notice the model name as part of the @url, which will be populated with your search query.

```sql
CREATE PROCEDURE [dbo].[GET_EMBEDDINGS]
(
    @model VARCHAR(MAX),
    @text NVARCHAR(MAX),
    @embedding VECTOR(1536) OUTPUT
)
AS
BEGIN
    DECLARE @retval INT, @response NVARCHAR(MAX);
    DECLARE @url VARCHAR(MAX);
    DECLARE @payload NVARCHAR(MAX) = JSON_OBJECT('input': @text);

    -- Set the @url variable with proper concatenation before the EXEC statement
    SET @url = 'https://<resourcename>.openai.azure.com/openai/deployments/' + @model + '/embeddings?api-version=2023-03-15-preview';

    EXEC dbo.sp_invoke_external_rest_endpoint 
        @url = @url,
        @method = 'POST',   
        @payload = @payload,   
        @headers = '{"Content-Type":"application/json", "api-key":"<openAIkey>"}', 
        @response = @response OUTPUT;

    -- Use JSON_QUERY to extract the embedding array directly
    DECLARE @jsonArray NVARCHAR(MAX) = JSON_QUERY(@response, '$.result.data[0].embedding');

    
    SET @embedding = CAST(@jsonArray as VECTOR(1536));
END
GO
```

After creating your stored procedure, you should be able to view it under the **Stored Procedures** folder found in the **Programmability** folder of your SQL database. Once created, you can run a test [similarity search](https://devblogs.microsoft.com/azure-sql/announcing-eap-native-vector-support-in-azure-sql-database/#similarity-search-in-azure-sql-db) within your SQL query editor using your text embedding model name. This uses your stored procedure to generate embeddings and use a vector distance function to calculate the vector distance and return results based on the text query. 

## 6. Connect and search your database

Now that your database is set up to create embeddings, we can connect to it in our application and set up the Hybrid vector search query. 

Add the following code to your `OpenAI.razor` file and make sure the connection string is updated to use your deployed Azure SQL database connection string. The code is using a SQL parameter which will securely pass through the user input from the chat app to the query.

```csharp
// Database connection string
var connectionString = _config["AZURE_SQL_CONNSTRING"];

try
{
    await using var connection = new SqlConnection(connectionString);
    Console.WriteLine("\nQuery results:");

    await connection.OpenAsync();

    // Hybrid search query
    var sql =
        @"DECLARE @e VECTOR(1536);
		EXEC dbo.GET_EMBEDDINGS @model = 'text-embedding-ada-002', @text = '@userMessage', @embedding = @e OUTPUT;

			 -- Comprehensive query with multiple filters.
		SELECT TOP(5)
			f.Score,
			f.Summary,
			f.Text,
			VECTOR_DISTANCE('cosine', @e, VectorBinary) AS Distance,
			CASE
				WHEN LEN(f.Text) > 100 THEN 'Detailed Review'
				ELSE 'Short Review'
			END AS ReviewLength,
			CASE
				WHEN f.Score >= 4 THEN 'High Score'
				WHEN f.Score BETWEEN 2 AND 3 THEN 'Medium Score'
				ELSE 'Low Score'
			END AS ScoreCategory
		FROM finefoodembeddings10k$ f
		WHERE
			f.UserId NOT LIKE 'Anonymous%' -- User-based filter to exclude anonymous users
			AND f.Score >= 4 -- Score threshold filter
			AND LEN(f.Text) > 50 -- Text length filter for detailed reviews
            AND (f.Text LIKE '%juice%') -- Inclusion of specific words
		ORDER BY
			Distance,  -- Order by distance
			f.Score DESC, -- Secondary order by review score
			ReviewLength DESC; -- Tertiary order by review length
	";

    // Set SQL Parameter to pass in user message
    SqlParameter param = new SqlParameter();
    param.ParameterName = "@userMessage";
    param.Value = userMessage;
    
    await using var command = new SqlCommand(sql, connection);

    // add parameter to SqlCommand
    command.Parameters.Add(param);

    await using var reader = await command.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
        // write results to console logs
        Console.WriteLine("{0} {1} {2} {3}", "Score: " + reader.GetDouble(0), "Text: " + reader.GetString(1), "Summary: " + reader.GetString(2), "Distance: " + reader.GetDouble(3));
        Console.WriteLine();

        // add results to chat history
        chatHistory.AddSystemMessage(reader.GetString(1) + ", " + reader.GetString(2));
    }
}
catch (SqlException e)
{
    Console.WriteLine($"SQL Error: {e.Message}");
}
catch (Exception e)
{
    Console.WriteLine(e.ToString());
}

Console.WriteLine("Done");
```

The SQL query itself is using a hybrid search which executes the stored procedure set up previously to create embeddings and uses SQL to filter out your desired results. In this example, we're giving the results scores and ordering the output to grab the best results before using them as grounded context to generate a response from.

### Secure your data with Managed Identity

Azure SQL can use Managed Identity with Microsoft Entra to secure your SQL resource by configuring passwordless authentication. Follow the below steps to configure a passwordless connection string that will be used in your application.

1. Navigate to your Azure SQL server resource and click on Microsoft Entra ID under Settings.
2. Then click on +**Set admin** and search and choose yourself to set up Entra ID and click **Save**. Now Entra ID is set up on your SQL server, and accepts Entra ID authentication.
3. Next, go to your database resource and copy the **ADO.NET (Microsoft Entra passwordless authentication)** connection string and add it to your code where you keep your connection string.

At this point, you can test your application locally with your passwordless connection string.

### Grant access to App Service 

Before you can make a call to your database when using managed identity with Azure SQL, you'll first need to grant the database access to App Service. If you have not done so at this point, you'll need to create a web app first before completing the next steps.

Follow these steps to grant access to your web app:

1. Navigate to your web app and click on the **Identity** blade found under Settings.
2. Turn on **System assigned** managed identity if you have not already.
3. Navigate to your database resource and open the query editor found in the left side menu. You may need to sign in to use the editor.
4. Run the following commands to create a user and alter the roles add the web app as a member

```sql
-- Create member, alter roles to your database
CREATE USER "<your-app-name>" FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER "<your-app-name>";
ALTER ROLE db_datawriter ADD MEMBER "<your-app-name>";
ALTER ROLE db_ddladmin ADD MEMBER "<your-app-name>";
GO
```

5. Next, grant the access to use the stored procedure and Azure OpenAI endpoint

```sql
-- Grant access to use stored procedure
GRANT EXECUTE ON OBJECT::[dbo].[GET_EMBEDDINGS]  
  TO "<your-app-name>"  
GO

-- Grant access to use Azure OpenAI endpoint in stored procedure
GRANT EXECUTE ANY EXTERNAL ENDPOINT TO "<your-app-name>";
GO
```

From here, your Azure SQL database is now secure, and you can deploy your application to App Service.

Here's the full example of the added *OpenAI.razor* page:

```csharp
@page "/openai"
@rendermode InteractiveServer
@inject Microsoft.Extensions.Configuration.IConfiguration _config

<PageTitle>OpenAI</PageTitle>

<h3>OpenAI input query: </h3>
<input class="col-sm-4" @bind="userMessage" />
<button class="btn btn-primary" @onclick="SemanticKernelClient">Send Request</button>

<br />
<br />

<h4>Server response:</h4> <p>@serverResponse</p>

@code {

	@using Microsoft.SemanticKernel;
	@using Microsoft.SemanticKernel.ChatCompletion;
	@using Microsoft.Data.SqlClient;

	private string? userMessage;
	private string? serverResponse;

	private async Task SemanticKernelClient()
	{
		// App settings
		string deploymentName = _config["DEPLOYMENT_NAME"];
		string endpoint = _config["ENDPOINT"];
		string apiKey = _config["API_KEY"];
		string modelId = _config["MODEL_ID"];

		// Semantic Kernel builder
		var builder = Kernel.CreateBuilder();

		// Chat completion service
		builder.Services.AddAzureOpenAIChatCompletion(
			deploymentName: deploymentName,
			endpoint: endpoint,
			apiKey: apiKey,
			modelId: modelId
		);

		var kernel = builder.Build();

		// Create prompt template
		var chat = kernel.CreateFunctionFromPrompt(
            @"{{$history}}
            User: {{$request}}
            Assistant: ");

		ChatHistory chatHistory = new("""You are a helpful assistant that answers questions about my data""");

		#region Azure SQL
		// Database connection string
		var connectionString = _config["AZURE_SQL_CONNECTIONSTRING"];

		try
		{
			await using var connection = new SqlConnection(connectionString);
			Console.WriteLine("\nQuery results:");
	
			await connection.OpenAsync();

			// Hybrid search query
			var sql =
					@"DECLARE @e VECTOR(1536);
					EXEC dbo.GET_EMBEDDINGS @model = 'text-embedding-ada-002', @text = '@userMessage', @embedding = @e OUTPUT;

						 -- Comprehensive query with multiple filters.
					SELECT TOP(5)
						f.Score,
						f.Summary,
						f.Text,
						VECTOR_DISTANCE('cosine', @e, VectorBinary) AS Distance,
						CASE
							WHEN LEN(f.Text) > 100 THEN 'Detailed Review'
							ELSE 'Short Review'
						END AS ReviewLength,
						CASE
							WHEN f.Score >= 4 THEN 'High Score'
							WHEN f.Score BETWEEN 2 AND 3 THEN 'Medium Score'
							ELSE 'Low Score'
						END AS ScoreCategory
					FROM finefoodembeddings10k$ f
					WHERE
						f.UserId NOT LIKE 'Anonymous%' -- User-based filter to exclude anonymous users
						AND f.Score >= 4 -- Score threshold filter
						AND LEN(f.Text) > 50 -- Text length filter for detailed reviews
                        AND (f.Text LIKE '%juice%') -- Inclusion of specific words
					ORDER BY
						Distance,  -- Order by distance
						f.Score DESC, -- Secondary order by review score
						ReviewLength DESC; -- Tertiary order by review length
				";

			// Set SQL Parameter to pass in user message
			SqlParameter param = new SqlParameter();
			param.ParameterName = "@userMessage";
			param.Value = userMessage;

			await using var command = new SqlCommand(sql, connection);

			// add parameter to SqlCommand
			command.Parameters.Add(param);

			await using var reader = await command.ExecuteReaderAsync();

			while (await reader.ReadAsync())
			{
				// write results to console logs
				Console.WriteLine("{0} {1} {2} {3}", "Score: " + reader.GetDouble(0), "Text: " + reader.GetString(1), "Summary: " + reader.GetString(2), "Distance: " + reader.GetDouble(3));
				Console.WriteLine();

				// add results to chat history
				chatHistory.AddSystemMessage(reader.GetString(1) + ", " + reader.GetString(2));

			}
		}
		catch (SqlException e)
		{
			Console.WriteLine($"SQL Error: {e.Message}");
		}
		catch (Exception e)
		{
			Console.WriteLine(e.ToString());
		}

		Console.WriteLine("Done");
		#endregion

		var chatResult = kernel.InvokeStreamingAsync<StreamingChatMessageContent>(
				chat,
				new()
					{
						{ "request", userMessage },
						{ "history", string.Join("\n", chatHistory.Select(x => x.Role + ": " + x.Content)) }
					}
			);

		string message = "";
		await foreach (var chunk in chatResult)
		{
			message += chunk;
		}

		// Append messages to chat history
		chatHistory.AddUserMessage(userMessage!);
		chatHistory.AddAssistantMessage(message);

		serverResponse = message;

	}
}

```
