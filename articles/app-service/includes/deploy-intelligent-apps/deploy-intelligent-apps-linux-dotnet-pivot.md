---
author: jefmarti
ms.service: azure-app-service
ms.devlang: dotnet
ms.custom: linux-related-content
ms.topic: article
ms.date: 04/10/2024
ms.author: jefmarti
---

You can use Azure App Service to work with popular AI frameworks like LangChain and Semantic Kernel connected to OpenAI for creating intelligent apps. In the following tutorial, we're adding an Azure OpenAI service using Semantic Kernel to a .NET 8 Blazor web application.  

#### Prerequisites

- An [Azure OpenAI resource](../../../ai-services/openai/quickstart.md?pivots=programming-language-csharp&tabs=command-line%2Cpython#set-up) or an [OpenAI account](https://platform.openai.com/overview).
- A .NET 8 Blazor Web App.  Create the application with a template [here](https://dotnet.microsoft.com/learn/aspnet/blazor-tutorial/intro).

### Setup Blazor web app

For this Blazor web application, we're building off the Blazor [template](https://dotnet.microsoft.com/learn/aspnet/blazor-tutorial/intro) and creating a new razor page that can send and receive requests to an Azure OpenAI OR OpenAI service using Semantic Kernel.

1. Right click on the **Pages** folder found under the **Components** folder and add a new item named *OpenAI.razor*
2. Add the following code to the **OpenAI.razor* file and click **Save**

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

Next, we need to add the new page to the navigation so we can navigate to the service.

1. Go to the *NavMenu.razor* file under the **Layout** folder and add the following div in the nav class. Click **Save**

```csharp

<div class="nav-item px-3">
    <NavLink class="nav-link" href="openai">
        <span class="bi bi-list-nested-nav-menu" aria-hidden="true"></span> OpenAI
    </NavLink>
</div>
```

After the Navigation is updated, we can start preparing to build the OpenAI client to handle our requests.

### API keys and endpoints

In order to make calls to OpenAI with your client, you need to first grab the Keys and Endpoint values from Azure OpenAI, or OpenAI and add them as secrets for use in your application. Retrieve and save the values for later use.

For Azure OpenAI, see [this documentation](../../../ai-services/openai/quickstart.md?pivots=programming-language-csharp&tabs=command-line%2Cpython#retrieve-key-and-endpoint) to retrieve the key and endpoint values. If you're planning to use [managed identity](../../overview-managed-identity.md) to secure your app you'll only need the `deploymentName` and `endpoint` values.  Otherwise, you need each of the following:

- `deploymentName`
- `endpoint`
- `apiKey`
- `modelId`

For OpenAI, see this [documentation](https://platform.openai.com/docs/api-reference) to retrieve the API keys. For our application, you need the following values:
- `apiKey`
- `modelId`

Since we are deploying to App Service, we can secure these secrets in **Azure Key Vault** for protection. Follow the [Quickstart](/azure/key-vault/secrets/quick-create-cli#create-a-key-vault) to set up your Key Vault and add the secrets you saved from earlier.
Next, we can use Key Vault references as app settings in our App Service resource to reference in our application. Follow the instructions in the [documentation](../../app-service-key-vault-references.md?source=recommendations&tabs=azure-cli) to grant your app access to your Key Vault and to set up Key Vault references.
Then, go to the portal Environment Variables blade in your resource and add the following app settings:

For Azure OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `DEPOYMENT_NAME` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `ENDPOINT` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `MODEL_ID` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |


For OpenAI, use the following settings:

| Setting name| Value |
|-|-|-|
| `OPENAI_API_KEY` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |
| `OPENAI_MODEL_ID` | @Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/) |


Once your app settings are saved, you can bring them into the code by injecting IConfiguration and referencing the app settings. Add the following code to your *OpenAI.razor* file:

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

### Semantic Kernel

Semantic Kernel is an open-source SDK that enables you to easily develop AI agents to work with your existing code. You can use Semantic Kernel with Azure OpenAI and OpenAI models.

To create the OpenAI client, we'll first start by installing Semantic Kernel.   

To install Semantic Kernel, browse the NuGet package manager in Visual Studio and install the **Microsoft.SemanticKernel** package. For NuGet Package Manager instructions, see [here](/nuget/consume-packages/install-use-packages-visual-studio#find-and-install-a-package). For CLI instructions, see [here](/nuget/consume-packages/install-use-packages-dotnet-cli).
Once the Semantic Kernel package is installed, you can now initialize the kernel. 

### Initialize the kernel

To initialize the Kernel, add the following code to the *OpenAI.razor* file.

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

Here we're adding the using statement and creating the Kernel in a method that we can use when we send the request to the service.

### Add your AI service

Once the Kernel is initialized, we can add our chosen AI service to the kernel. Here we define our model and pass in our key and endpoint information to be consumed by the chosen model. If you plan to use managed identity with Azure OpenAI, add the service using the example in the next section.

For Azure OpenAI, use the following code:

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

For OpenAI, use the following code:

```csharp

var builder = Kernel.CreateBuilder();
builder.Services.AddOpenAIChatCompletion(
  modelId: OpenAIModelId,             
  apiKey: OpenAIApiKey,                                
);
var kernel = builder.Build();
```

### Secure your app with managed identity

If you�re using Azure OpenAI, it's highly recommended to secure your application using [managed identity](../../overview-managed-identity.md) to authenticate your app to your Azure OpenAI resource. This enables your application to access the Azure OpenAI resource without needing to manage API keys. If you're not using Azure OpenAI, your secrets can remain secure using Azure Key Vault outlined above.

Follow the steps below to secure your application with managed identity:

Add the identity package `Azure.Identity`. This package enables using Azure credentials in your app.  Install the package using Nuget package manager and add the using statement to the top of the OpenAI.razor file.

```c#
@using Azure.Identity
```

Next, include the default Azure credentials in the chat completions parameters. The `deploymentName` and `endpoint` parameters are still required and should be secured using the Key Vault method covered in the previous section.

```c#
var kernel = Kernel.CreateBuilder()
	.AddAzureOpenAIChatCompletion(
		deploymentName: deploymentName,
		endpoint: endpoint,
		credentials: new DefaultAzureCredential()
	)
	.Build();
```

Once the credentials are added to the application, you'll then need to enable managed identity in your application and grant access to the resource.

1. In your web app resource, navigate to the **Identity** blade and turn on **System assigned** and click **Save**
2. Once System assigned identity is turned on, it register's the web app with Microsoft Entra ID and the web app can be granted permissions to access protected resources.  
3. Go to your Azure OpenAI resource and navigate to the **Access control (IAM)** blade on the left pane.  
4. Find the Grant access to this resource card and click on **Add role assignment**
5. Search for the **Cognitive Services OpenAI User** role and click **Next**
6. On the **Members** tab, find **Assign access to** and choose the **Managed identity** option
7. Next, click on **+Select Members**  and find your web app
8. Click **Review + assign**

Your web app is now added as a cognitive service OpenAI user and can communicate to your Azure OpenAI resource.

### Configure prompt and create semantic function

Now that our chosen OpenAI service client is created with the correct keys we can add a function to handle the prompt. With Semantic Kernel you can handle prompts by the use of a semantic function, which turn the prompt and the prompt configuration settings into a function the Kernel can execute. Learn more on configuring prompts [here](/semantic-kernel/prompts/configure-prompts?tabs=Csharp).

First, we create a variable that holds the user's prompt. Then add a function with execution settings to handle and configure the prompt. Add the following code to the *OpenAI.razor* file:

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

Lastly, we need to invoke the function and return the response. Add the following to the *OpenAI.razor* file:

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

Here's the example in its completed form. In this example, use the Azure OpenAI chat completion service OR the OpenAI chat completion service, not both.  

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

Now save the application and follow the next steps to deploy it to App Service. If you would like to test it locally first at this step, you can swap out the config values at with the literal string values of your OpenAI service. For example: string modelId = 'gpt-4-turbo';

### Deploy to App Service

If you have followed the steps above, you're ready to deploy to App Service. If you run into any issues remember that you need to have done the following: grant your app access to your Key Vault, add the app settings with key vault references as your values. App Service resolves the app settings in your application that match what you've added in the portal.

### Authentication

Although optional, it's highly recommended that you also add authentication to your web app when using an Azure OpenAI or OpenAI service. This can add a level of security with no other code. Learn how to enable authentication for your web app [here](../../scenario-secure-app-authentication-app-service.md).

Once deployed, browse to the web app and navigate to the OpenAI tab. Enter a query to the service and you should see a populated response from the server. The tutorial is now complete and you now know how to use OpenAI services to create intelligent applications.
