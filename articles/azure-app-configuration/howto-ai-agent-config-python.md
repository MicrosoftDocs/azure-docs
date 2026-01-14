---
title: How to use Agent Framework in a Python app with Azure App Configuration
titleSuffix: Azure App Configuration
description: Learn how to use Agent Framework in a Python app with Azure App Configuration.
ms.service: azure-app-configuration
author: MaryanneNjeri
ms.author: mgichohi
ms.topic: how-to
ms.date: 11/10/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
---

# Use Agent Framework in a Python app with Azure App Configuration

In this guide, you build an AI agent chat application using Azure App Configuration to load agent YAML specifications that define AI agent behavior, prompts and model configurations. 

The full sample source code is available in the [Azure App Configuration GitHub repository](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/ChatAgent).

## Prerequisites

- Create an _Azure AI project_ in Microsoft Foundry and configure the _example agent settings_ discussed in the [Get started](./howto-ai-agent-config.md#example-agent-settings) section.
- Python 3.10 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/).

## Console application

In this section, you create a console application and load the agent YAML specification from your App Configuration store.

1. Create a new folder for your project. In the new folder, install the following packages by using the `pip install` command:

    ```console
    pip install azure-appconfiguration-provider
    pip install agent-framework-declarative --pre
    pip install azure-identity
    ```

1. Create a new file called _app.py_, and add the following import statements:

    ```python
    import asyncio
    import os
    from agent_framework.declarative import AgentFactory
    from azure.identity import DefaultAzureCredential
    from azure.appconfiguration.provider import load
    ```

1. You can connect to Azure App Configuration using either Microsoft Entra ID (recommended) or a connection string. In this example, you use Microsoft Entra ID with `DefaultAzureCredential` to authenticate to your App Configuration store. Follow these [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign the **App Configuration Data Reader** role to the identity represented by `DefaultAzureCredential`. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```python
    async def main():
        endpoint = os.environ["AZURE_APPCONFIGURATION_ENDPOINT"]

        # Connect to Azure App Configuration using Microsoft Entra ID.
        credential = DefaultAzureCredential()

        config = load(endpoint=endpoint, credential=credential)
    ```

1. Update the code in _app.py_ to retrieve the agent specification from the configuration, create the agent from the YAML spec and handle user interaction:

    ```python
    async def main():
        endpoint = os.environ["AZURE_APPCONFIGURATION_ENDPOINT"]

        # Connect to Azure App Configuration using Microsoft Entra ID.
        credential = DefaultAzureCredential()

        config = load(endpoint=endpoint, credential=credential)

        agent_spec = config["ChatAgent:Spec"]
        
        agent = AgentFactory(client_kwargs={"credential": credential, "project_endpoint": config["ChatAgent:ProjectEndpoint"]}).create_agent_from_yaml(agent_spec)

        while True:
            print("How can I help? (type 'quit' to exit)")

            user_input = input("User: ")
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                break
        
            response = await agent.run(user_input)
            print("Agent response: ", response.text)
            input("Press enter to continue...")
            
        print("Exiting... Goodbye...")

    if __name__ == "__main__":
        asyncio.run(main())
    ```

1. After completing the previous steps, your _app.py_ file should now contain the complete implementation as shown below:
    ```python
    import asyncio
    import os
    from agent_framework.declarative import AgentFactory
    from azure.identity import DefaultAzureCredential
    from azure.appconfiguration.provider import load

    async def main():
        endpoint = os.environ["AZURE_APPCONFIGURATION_ENDPOINT"]

        # Connect to Azure App Configuration using Microsoft Entra ID.
        credential = DefaultAzureCredential()

        config = load(endpoint=endpoint, credential=credential)

        agent_spec = config["ChatAgent:Spec"]
        
        agent = AgentFactory(client_kwargs={"credential": credential, "project_endpoint": config["ChatAgent:ProjectEndpoint"]}).create_agent_from_yaml(agent_spec)

        while True:
            print("How can I help? (type 'quit' to exit)")

            user_input = input("User: ")
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                break
        
            response = await agent.run(user_input)
            print("Agent response: ", response.text)
            input("Press enter to continue...")
                
        print("Exiting... Goodbye...")

    if __name__ == "__main__":
        asyncio.run(main())
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

1. After the environment variable is properly set, run the following command to run the app locally:

    ```console
    python app.py
    ```

1. Type the message "What is the weather today in Seattle?" when prompted with "How can I help?" and then press the Enter key.

    ```Output
    How can I help? (type 'quit' to exit)
    User: What is the weather today in Seattle?     
    Agent response: Today in Seattle, expect steady rain throughout the day with patchy fog, and a high temperature around 57°F (14°C). 
    Winds are from the south-southwest at 14 to 17 mph, with gusts as high as 29 mph.
    Flood and wind advisories are in effect due to ongoing heavy rain and saturated conditions. 
    Rain is likely to continue into the night, with a low near 49°F. 
    Please stay aware of weather alerts if you are traveling or in low-lying areas [National Weather Service Seattle](https://forecast.weather.gov/zipcity.php?inputstring=Seattle%2CWA) [The Weather Channel Seattle Forecast](https://weather.com/weather/today/l/Seattle+Washington?canonicalCityId=1138ce33fd1be51ab7db675c0da0a27c).
    Press enter to continue...
    ```

## Next steps

To learn how to use Chat completion configuration in your application, continue to this tutorial.

> [!div class="nextstepaction"]
> [Chat completion configuration](./howto-chat-completion-config.md)