---
title: How to use Agent Framework in a .NET app with Azure App Configuration
titleSuffix: Azure App Configuration
description: Learn how to use Agent Framework in a .NET console app with Azure App Configuration.
ms.service: azure-app-configuration
author: MaryanneNjeri
ms.author: mgichohi
ms.topic: how-to
ms.date: 04/22/2026
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
---

# Use Agent Framework in a .NET console app with Azure App Configuration

In this guide, you build an AI agent chat application using Azure App Configuration to load agent YAML specifications that define AI agent behavior, prompts and model configurations. 

The full sample source code is available in the [Azure App Configuration GitHub repository](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetCore/ChatAgent).

## Prerequisites

- Create a _Foundry project_ in Microsoft Foundry and configure the _example agent settings_ discussed in the [Get started](./howto-ai-agent-config.md#example-agent-settings) section.
- [The latest .NET SDK](https://dotnet.microsoft.com/download)


## Console application

In this section, you create a .NET console application and load the agent YAML specification from your App Configuration store.

1. Create a new folder for your project. In the new folder, run the following command to create a new .NET console app project:

    ```dotnetcli
    dotnet new console
    ```

1. Install the following NuGet packages in your project:

    ```dotnetcli
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    dotnet add package Azure.Identity
    dotnet add package Microsoft.Agents.AI --version 1.0.0
    dotnet add package Azure.AI.Projects --version 2.0.0
    dotnet add package Microsoft.Agents.AI.Declarative --version 1.0.0-rc4
    dotnet add package Microsoft.Extensions.AI.OpenAI --version 10.4.1
    ```

1. Open the _Program.cs_ file, and add the following namespaces at the top of the file:

    ```csharp
    using Azure.Core;
    using Azure.Identity;
    using Microsoft.Agents.AI;
    using Microsoft.Extensions.AI;
    using Azure.AI.Projects;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    ```

1. Connect to your App Configuration store by calling the `AddAzureAppConfiguration` method in the _Program.cs_ file.

    You can connect to App Configuration using either Microsoft Entra ID (recommended) or a connection string. In this example, you use Microsoft Entra ID with `AzureCliCredential` to authenticate to your App Configuration store. Follow these [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign the **App Configuration Data Reader** role to the identity represented by `AzureCliCredential`. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```csharp
    TokenCredential credential = new AzureCliCredential();

    // Load configuration from Azure App Configuration
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            Uri endpoint = new(Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT") ??
                throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIGURATION_ENDPOINT' is not set or is empty"));
            options.Connect(endpoint, credential)
                .Select("ChatAgent:*")
        }).Build();
    ```

1. Update the code in _Program.cs_ to initialize `IChatClient`, retrieve the agent specification from the configuration, create the agent from the YAML spec, and handle user interaction:

    ```csharp
    var endpoint = configuration["ChatAgent:ProjectEndpoint"];

    IChatClient chatClient = new AIProjectClient(
        new Uri(endpoint), credential)
        .GetProjectOpenAIClient()
        .GetProjectResponsesClient()
        .AsIChatClient();

    var agentSpec = configuration["ChatAgent:Spec"];

    var agentFactory = new ChatClientPromptAgentFactory(chatClient);

    AIAgent agent = await agentFactory.CreateFromYamlAsync(agentSpec);

    while (true)
    {
        Console.WriteLine("How can I help? (type 'quit' to exit)");

        Console.Write("User: ");

        var userInput = Console.ReadLine();

        if (userInput?.Trim().ToLower() == "quit")
        {
            break;
        }

        var response = await agent.RunAsync(userInput);

        Console.WriteLine($"Agent response: {response}");
        Console.WriteLine("Press enter to continue...");
        Console.ReadLine();
    }

    Console.WriteLine("Goodbye!");
    ```

1. After completing the previous steps, your _Program.cs_ file should now contain the complete implementation as shown below:

    ```csharp
    using Azure.Core;
    using Azure.Identity;
    using Microsoft.Agents.AI;
    using Microsoft.Extensions.AI;
    using Azure.AI.Projects;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;

    TokenCredential credential = new AzureCliCredential();

    // Load configuration from Azure App Configuration
    IConfiguration configuration = new ConfigurationBuilder()
        .AddAzureAppConfiguration(options =>
        {
            Uri endpoint = new(Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT") ??
                throw new InvalidOperationException("The environment variable 'AZURE_APPCONFIGURATION_ENDPOINT' is not set or is empty"));
            options.Connect(endpoint, credential)
                .Select("ChatAgent:*")
        }).Build();

    var endpoint = configuration["ChatAgent:ProjectEndpoint"];

    IChatClient chatClient = new AIProjectClient(
        new Uri(endpoint), credential)
        .GetProjectOpenAIClient()
        .GetProjectResponsesClient()
        .AsIChatClient();

    var agentSpec = configuration["ChatAgent:Spec"];

    var agentFactory = new ChatClientPromptAgentFactory(chatClient);

    AIAgent agent = await agentFactory.CreateFromYamlAsync(agentSpec);

    while (true)
    {
        Console.WriteLine("How can I help? (type 'quit' to exit)");

        Console.Write("User: ");

        var userInput = Console.ReadLine();

        if (userInput?.Trim().ToLower() == "quit")
        {
            break;
        }

        var response = await agent.RunAsync(userInput);

        Console.WriteLine($"Agent response: {response}");
        Console.WriteLine("Press enter to continue...");
        Console.ReadLine();
    }

    Console.WriteLine("Goodbye!");
    ```

## Build and run the app

1. Set the environment variable named **AZURE_APPCONFIGURATION_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIGURATION_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:
    ```powershell
    $Env:AZURE_APPCONFIGURATION_ENDPOINT="<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:
    ```bash
    export AZURE_APPCONFIGURATION_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

1. After the environment variable is properly set, run the following command to build and run the app:

    ```dotnetcli
    dotnet run
    ```

1. Type the message "What is the weather today in Seattle?" when prompted with "How can I help?" and then press the Enter key.

    ```Output
    How can I help? (type 'quit' to exit)
    User: What is the weather today in Seattle?
    Agent response: Seattle weather for today (Thursday, April 9, 2026):

    - Current conditions (as of ~10:48 AM PDT): 55°F, sunny. Wind N 6 mph (gusts 7), humidity 55%, pressure 30.05 in. ([wunderground.com](https://www.wunderground.com/weather/us/wa/seattle))
    - Today’s forecast: Mostly sunny and mild. High around 64–65°F; tonight’s low near 43–44°F. Very low chance of precipitation and light winds. ([wunderground.com](https://www.wunderground.com/weather/us/wa/seattle))

    Want the hour‑by‑hour forecast or weekend outlook?
    Press enter to continue...
    ```

## Next steps

To learn how to use Chat completion configuration in your application, continue to this tutorial.

> [!div class="nextstepaction"]
> [Chat completion configuration](./howto-chat-completion-config.md)