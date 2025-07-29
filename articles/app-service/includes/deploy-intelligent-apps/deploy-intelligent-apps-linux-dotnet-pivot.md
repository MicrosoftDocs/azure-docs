---
author: jefmarti
ms.service: azure-app-service
ms.devlang: dotnet
ms.custom: linux-related-content
ms.topic: article
ms.date: 04/10/2024
ms.author: jefmarti
---

You can create intelligent apps by using Azure App Service with popular AI frameworks like LangChain and Semantic Kernel connected to OpenAI. In this article, you add an Azure OpenAI service using Semantic Kernel to a .NET 8 Blazor web application.  

## Prerequisites

- An [Azure OpenAI resource](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#set-up) or an [OpenAI account](https://platform.openai.com/overview).
- A .NET 8 Blazor web app. Create the application with a [template](https://dotnet.microsoft.com/learn/aspnet/blazor-tutorial/intro).

## 1. Set up Blazor web app

For this Blazor web application, you're building off the Blazor [template](https://dotnet.microsoft.com/learn/aspnet/blazor-tutorial/intro) to create a new razor page that can send and receive requests to an Azure OpenAI or OpenAI service by using Semantic Kernel.

1. Right-click the **Pages** folder found under the **Components** folder and add a new item named `OpenAI.razor`.
1. Add the following code to the `OpenAI.razor` file, and then select **Save**.

```csharp
@page "/openai"
@rendermode InteractiveServer

<PageTitle>OpenAI</PageTitle>

<h3>OpenAI Query</h3>

<input placeholder="Input query" @bind="newQuery" />
<button class="btn btn-primary" @onclick="SemanticKernelClient">Send Request</button>

<br />

<h4>Server response:</h4> <p>@serverResponse</p>

@code {

	public string? newQuery;
  public string? serverResponse;

}
```

Next, add the new page to the navigation so that you can go to the service:

1. Go to the `NavMenu.razor` file under the **Layout** folder
1. Add the following `div` in the `nav` class, and then select **Save**.

```csharp

<div class="nav-item px-3">
    <NavLink class="nav-link" href="openai">
        <span class="bi bi-list-nested-nav-menu" aria-hidden="true"></span> OpenAI
    </NavLink>
</div>
```

After the navigation is updated, you can prepare to build the OpenAI client to handle the requests.

### API keys and endpoints

To make calls to OpenAI with your client, you need to first get the key and endpoint values from Azure OpenAI or OpenAI and add them as secrets that your application uses. Save the values for later use.

To retrieve the key and endpoint values for Azure OpenAI, see [this documentation](/azure/ai-services/openai/quickstart?pivots=programming-language-csharp&tabs=command-line%2Cpython#retrieve-key-and-endpoint). If you're planning to use a [managed identity](../../overview-managed-identity.md) to help secure your app, you need only the `deploymentName` and `endpoint` values. Otherwise, you need each of the following values:

- `deploymentName`
- `endpoint`
- `apiKey`
- `modelId`

To retrieve the API keys for OpenAI, see [this documentation](https://platform.openai.com/docs/api-reference). For this application, you need the following values:

- `apiKey`
- `modelId`

Because you're deploying to App Service, you can put these secrets in Azure Key Vault for protection. Follow the [quickstart](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) to set up your key vault and add the secrets that you saved earlier.
Next, you can use key vault references as app settings in your App Service resource for your application to reference. Follow the instructions in the [documentation](../../app-service-key-vault-references.md?source=recommendations&tabs=azure-cli) to grant your app access to your key vault and to set up key vault references.
Then, go to the portal **Environment Variables** pane in your resource and add the following app settings.

Use the following settings for Azure OpenAI:

| Setting name| Value |
|-|-|-|
| `DEPLOYMENT_NAME` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |
| `ENDPOINT` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |
| `API_KEY` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |
| `MODEL_ID` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |

Use the following settings for OpenAI:

| Setting name| Value |
|-|-|-|
| `OPENAI_API_KEY` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |
| `OPENAI_MODEL_ID` | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |


After your app settings are saved, you can bring them into the code by injecting IConfiguration and referencing the app settings. Add the following code to your `OpenAI.razor` file:

For Azure OpenAI:
```csharp
@inject Microsoft.Extensions.Configuration.IConfiguration _config

@code {

	private async Task SemanticKernelClient()
	{
	    string deploymentName = _config["DEPLOYMENT_NAME"];
		string endpoint = _config["ENDPOINT"];
		string apiKey = _config["API_KEY"];
		string modelId = _config["MODEL_ID"];
  }
```

For OpenAI:
```csharp
@inject Microsoft.Extensions.Configuration.IConfiguration _config

@code {

	private async Task SemanticKernelClient()
	{
		// OpenAI
		string OpenAIModelId = _config["OPENAI_MODEL_ID"];
		string OpenAIApiKey = _config["OPENAI_API_KEY"];
  }
```

## 2. Semantic Kernel

By using Semantic Kernel, an open-source SDK, you can easily develop AI agents that work with your existing code. You can use Semantic Kernel with Azure OpenAI and OpenAI models.

To create the OpenAI client, install Semantic Kernel.

To install Semantic Kernel, browse the NuGet package manager in Visual Studio and install the `Microsoft.SemanticKernel` package. For NuGet package manager instructions, see [this procedure](/nuget/consume-packages/install-use-packages-visual-studio#find-and-install-a-package). For CLI instructions, see [this article](/nuget/consume-packages/install-use-packages-dotnet-cli).
After the Semantic Kernel package is installed, you can now initialize the kernel.

## 3. Initialize the kernel

To initialize the kernel, add the following code to the `OpenAI.razor` file.

```csharp

@code {

		@using Microsoft.SemanticKernel;

		private async Task SemanticKernelClient()
	  {
				var builder = Kernel.CreateBuilder();

				var kernel = builder.Build();
	  }

}
```

In this step, you add the using statement and create the kernel in a method that you can use when you send the request to the service.

## 4. Add your AI service

After the kernel is initialized, you can add your chosen AI service to the kernel. You define your model and pass in your key and endpoint information that the chosen model consumes. If you plan to use a managed identity with Azure OpenAI, add the service by using the example in the next section.

Use the following code for Azure OpenAI:

```csharp
var builder = Kernel.CreateBuilder();
builder.Services.AddAzureOpenAIChatCompletion(
    deploymentName: deploymentName,
		endpoint: endpoint,
		apiKey: apiKey,
    modelId: modelId
);
var kernel = builder.Build();
```

Use the following code for OpenAI:

```csharp

var builder = Kernel.CreateBuilder();
builder.Services.AddOpenAIChatCompletion(
  modelId: OpenAIModelId,             
  apiKey: OpenAIApiKey,                                
);
var kernel = builder.Build();
```

### Secure your app with a managed identity

If you're using Azure OpenAI, we highly recommend that you secure your application by using a [managed identity](../../overview-managed-identity.md) to authenticate your app to your Azure OpenAI resource. This process enables your application to access the Azure OpenAI resource without managing API keys. If you're not using Azure OpenAI, your secrets can remain secure by using Azure Key Vault as outlined previously.

Complete the following tasks to secure your application with a managed identity.

Add the identity package `Azure.Identity`. By using this package, you can use Azure credentials in your app. Install the package by using NuGet package manager and add the using statement to the top of the `OpenAI.razor` file.

```c#
@using Azure.Identity
```

Next, include the default Azure credentials in the chat completions parameters. The `deploymentName` and `endpoint` parameters are still required and should be secured by using the key vault method covered in the previous section.

```c#
var kernel = Kernel.CreateBuilder()
	.AddAzureOpenAIChatCompletion(
		deploymentName: deploymentName,
		endpoint: endpoint,
		credentials: new DefaultAzureCredential()
	)
	.Build();
```

After the credentials are added to the application, you'll need to enable a managed identity in your application and grant access to the resource.

1. In your web app resource, go to the **Identity** pane and turn on **System assigned**, and then select **Save**.
1. After **System assigned** identity is turned on, it registers the web app with Microsoft Entra ID. The web app can be granted permissions to access protected resources.  
1. Go to your Azure OpenAI resource, and then go to **Access control (IAM)** on the left pane.  
1. Find the **Grant access to this resource** card and select **Add role assignment**.
1. Search for the **Cognitive Services OpenAI User** role and select **Next**.
1. On the **Members** tab, find **Assign access to** and choose the **Managed identity** option.
1. Choose **+Select Members** and find your web app.
1. Select **Review + assign**.

Your web app is now added as a cognitive service OpenAI user and can communicate to your Azure OpenAI resource.

## 5. Configure a prompt and create semantic function

Now that your chosen OpenAI service client is created with the correct keys, you can add a function to handle the prompt. With Semantic Kernel, you can handle prompts by using a semantic function, which turns the prompt and the prompt configuration settings into a function the kernel can execute. [Learn more about configuring prompts](/semantic-kernel/prompts/configure-prompts?tabs=Csharp).

First, create a variable that holds the user's prompt. Then, add a function with execution settings to handle and configure the prompt. Add the following code to the `OpenAI.razor` file:

```csharp

@using Microsoft.SemanticKernel.Connectors.OpenAI 

private async Task SemanticKernelClient()
{
     var builder = Kernel.CreateBuilder();
		 builder.Services.AddAzureOpenAIChatCompletion(
					deploymentName: deploymentName,
					endpoint: endpoint,
					APIKey: APIKey,
	        modelId: modelId 
		);
     var kernel = builder.Build();

     var prompt = @"{{$input}} " + newQuery;

     var summarize = kernel.CreateFunctionFromPrompt(prompt, executionSettings: new OpenAIPromptExecutionSettings { MaxTokens = 100, Temperature = 0.2 });

 }

```

Now, invoke the function and return the response. Add the following to the `OpenAI.razor` file:

```csharp

private async Task SemanticKernelClient()
{

     var builder = Kernel.CreateBuilder();
     builder.Services.AddAzureOpenAIChatCompletion(
			    deploymentName: deploymentName,
					endpoint: endpoint,
					APIKey: APIKey,
			    modelId: modelId                  
     );
     var kernel = builder.Build();

     var prompt = @"{{$input}} " + newQuery;

     var summarize = kernel.CreateFunctionFromPrompt(prompt, executionSettings: new OpenAIPromptExecutionSettings { MaxTokens = 100, Temperature = 0.2 }) 

     var result = await kernel.InvokeAsync(summarize);

     serverResponse = result.ToString();

 }
```

Here's the example in its completed form. In this example, use the Azure OpenAI chat completion service *or* the OpenAI chat completion service, not both.  

```csharp
@page "/openai"
@rendermode InteractiveServer
@inject Microsoft.Extensions.Configuration.IConfiguration _config

<PageTitle>OpenAI</PageTitle>

<h3>OpenAI input query: </h3> 
<input class="col-sm-4" @bind="newQuery" />
<button class="btn btn-primary" @onclick="SemanticKernelClient">Send Request</button>

<br />
<br />

<h4>Server response:</h4> <p>@serverResponse</p>

@code {

	@using Microsoft.SemanticKernel;
	@using Microsoft.SemanticKernel.Connectors.OpenAI

	private string? newQuery;
	private string? serverResponse;

	private async Task SemanticKernelClient()
	{
		// Azure OpenAI
		string deploymentName = _config["DEPLOYMENT_NAME"];
		string endpoint = _config["ENDPOINT"];
		string apiKey = _config["API_KEY"];
		string modelId = _config["MODEL_ID"];

		// OpenAI
		// string OpenAIModelId = _config["OPENAI_DEPLOYMENT_NAME"];
		// string OpenAIApiKey = _config["OPENAI_API_KEY"];
        // Semantic Kernel client
		var builder = Kernel.CreateBuilder();
		// Azure OpenAI
		builder.Services.AddAzureOpenAIChatCompletion(
			deploymentName: deploymentName,
		 endpoint: endpoint,
			apiKey: apiKey,
	     modelId: modelId 
		);
		// OpenAI
		// builder.Services.AddOpenAIChatCompletion(
		// 	modelId: OpenAIModelId,
		// 	apiKey: OpenAIApiKey
		// );
		var kernel = builder.Build();

		var prompt = @"{{$input}} " + newQuery;

		var summarize = kernel.CreateFunctionFromPrompt(prompt, executionSettings: new OpenAIPromptExecutionSettings { MaxTokens = 100, Temperature = 0.2 });

		var result = await kernel.InvokeAsync(summarize);

		serverResponse = result.ToString();

	}
}
```

Now, save the application and follow the next steps to deploy it to App Service. If you want to test it locally first, you can swap the config values with the literal string values of your OpenAI service. For example: `string modelId = 'gpt-4-turbo';`.

## 5. Deploy to App Service

You're now ready to deploy to App Service. If you run into any issues, make sure you granted your app access to your key vault and added the app settings with key vault references as your values. App Service resolves the app settings in your application that match what you added in the portal.

### Authentication

We highly recommend that you also add authentication to your web app when using an Azure OpenAI or OpenAI service. This optional step can add a level of security with no other code. [Learn how to enable authentication for your web app](../../scenario-secure-app-authentication-app-service.md).

After the app is deployed, browse to the web app and go to the OpenAI tab. Enter a query to the service and you should see a populated response from the server.
