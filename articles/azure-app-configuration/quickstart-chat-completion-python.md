---
title: Quickstart for using chat completion configuration in a Python app
titleSuffix: Azure App Configuration
description: Learn to implement chat completion configuration in your Python application using Azure App Configuration.
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.custom: devx-track-python, mode-other
ms.topic: quickstart
ms.tgt_pltfrm: Python
ms.date: 03/11/2026
ms.update-cycle: 180-days
ms.author: mametcal
ms.collection: ce-skilling-ai-copilot
---

# Use chat completion configuration in a Python console app

In this guide, you build an AI chat application and iterate on the prompt using chat completion configuration dynamically loaded from Azure App Configuration. 

The full sample source code is available in the [Azure App Configuration GitHub repository](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/ChatApp).

## Prerequisites

- Complete the tutorial to [Create a chat completion configuration](./howto-chat-completion-config.md#create-a-chat-completion-configuration).
- Python 3.9 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/).

## Create a console app

1. Create a new directory for your project and navigate to it:

    ```bash
    mkdir chatapp-quickstart
    cd chatapp-quickstart
    ```

1. Install the required Python packages:

    ```console
    pip install azure-appconfiguration-provider
    pip install azure-identity
    pip install azure-ai-projects
    ```

1. Create a file named `app.py` and add the following import statements:

    ```python
    import os
    from azure.appconfiguration.provider import load, SettingSelector, WatchKey
    from azure.identity import DefaultAzureCredential
    from azure.ai.projects import AIProjectClient
    ```

1. Create a function to load configuration from Azure App Configuration.

    You can connect to App Configuration using either Microsoft Entra ID (recommended) or a connection string. In this example, you use Microsoft Entra ID with `DefaultAzureCredential` to authenticate to your App Configuration store. Follow these [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign the **App Configuration Data Reader** role to the identity represented by `DefaultAzureCredential`. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```python
    credential = DefaultAzureCredential()

    def load_azure_app_configuration():
        endpoint = os.environ.get("AZURE_APPCONFIGURATION_ENDPOINT")
        if not endpoint:
            raise ValueError("AZURE_APPCONFIGURATION_ENDPOINT environment variable is not set")

        config = load(
            endpoint=endpoint,
            credential=credential,
            # Load all keys that start with "ChatApp:" and have no label
            selectors=[SettingSelector(key_filter="ChatApp:*")],
            trim_prefixes=["ChatApp:"],
            # Reload configuration if the ChatCompletion key has changed.
            # Use the default refresh interval of 30 seconds. It can be overridden via refresh_interval.
            refresh_on=[WatchKey("ChatApp:ChatCompletion")],
        )
        return config
    ```

1. Create a function to get AI responses from the chat client:

    ```python
    def get_ai_response(client, config, chat_conversation):
        chat_completion_config = config["ChatCompletion"]
        messages = []

        # Add configured messages (system, user, assistant)
        for msg in chat_completion_config["messages"]:
            messages.append({"role": msg["role"], "content": msg["content"]})

        # Add the chat conversation history
        messages.extend(chat_conversation)

        # Create chat completion
        response = client.complete(
            model=chat_completion_config["model"],
            messages=messages,
        )
        return response.choices[0].message.content
    ```

1. Create the main function that configures the chat client and runs the chat loop.

    Create an instance of the `AIProjectClient` to connect to your Azure AI Foundry project. You use `DefaultAzureCredential` to authenticate. Assign the **Cognitive Services OpenAI User** role to the identity represented by `DefaultAzureCredential`. For detailed steps, refer to the [Role-based access control for Azure OpenAI service](/azure/ai-services/openai/how-to/role-based-access-control) guide. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```python
    def main():
        config = load_azure_app_configuration()

        # Create a project client using Microsoft Entra ID
        project_client = AIProjectClient(
            endpoint=config["AzureAIFoundry:Endpoint"],
            credential=credential,
        )
        openai_client = project_client.get_openai_client()

        # Initialize chat conversation
        chat_conversation = []
        print("Chat started! What's on your mind?")

        while True:
            # Refresh the configuration from Azure App Configuration
            config.refresh()

            # Get user input
            user_input = input("You: ")

            # Exit if user input is empty
            if not user_input:
                print("Exiting Chat. Goodbye!")
                break

            # Add user message to chat conversation
            chat_conversation.append({"role": "user", "content": user_input})

            # Get AI response and add it to chat conversation
            response = get_ai_response(openai_client, config, chat_conversation)
            print(f"AI: {response}\n")
            chat_conversation.append({"role": "assistant", "content": response})

    if __name__ == "__main__":
        main()
    ```

1. After completing the previous steps, your `app.py` file should now contain the complete implementation as shown below:

    ```python
    import os
    from azure.appconfiguration.provider import load, SettingSelector, WatchKey
    from azure.identity import DefaultAzureCredential
    from azure.ai.projects import AIProjectClient

    credential = DefaultAzureCredential()


    def load_azure_app_configuration():
        endpoint = os.environ.get("AZURE_APPCONFIGURATION_ENDPOINT")
        if not endpoint:
            raise ValueError("AZURE_APPCONFIGURATION_ENDPOINT environment variable is not set")

        config = load(
            endpoint=endpoint,
            credential=credential,
            # Load all keys that start with "ChatApp:" and have no label
            selectors=[SettingSelector(key_filter="ChatApp:*")],
            trim_prefixes=["ChatApp:"],
            # Reload configuration if the ChatCompletion key has changed.
            # Use the default refresh interval of 30 seconds. It can be overridden via refresh_interval.
            refresh_on=[WatchKey("ChatApp:ChatCompletion")],
        )
        return config


    def get_ai_response(client, config, chat_conversation):
        chat_completion_config = config["ChatCompletion"]
        messages = []

        # Add configured messages (system, user, assistant)
        for msg in chat_completion_config["messages"]:
            messages.append({"role": msg["role"], "content": msg["content"]})

        # Add the chat conversation history
        messages.extend(chat_conversation)

        # Create chat completion
        response = client.chat.completions.create(
            model=chat_completion_config["model"],
            messages=messages,
            max_completion_tokens=chat_completion_config["max_completion_tokens"],
        )
        return response.choices[0].message.content


    def main():
        config = load_azure_app_configuration()

        # Create a project client using Microsoft Entra ID
        project_client = AIProjectClient(
            endpoint=config["AzureAIFoundry:Endpoint"],
            credential=credential,
        )
        openai_client = project_client.get_openai_client()

        # Initialize chat conversation
        chat_conversation = []
        print("Chat started! What's on your mind?")

        while True:
            # Refresh the configuration from Azure App Configuration
            config.refresh()

            # Get user input
            user_input = input("You: ")

            # Exit if user input is empty
            if not user_input:
                print("Exiting Chat. Goodbye!")
                break

            # Add user message to chat conversation
            chat_conversation.append({"role": "user", "content": user_input})

            # Get AI response and add it to chat conversation
            response = get_ai_response(openai_client, config, chat_conversation)
            print(f"AI: {response}\n")
            chat_conversation.append({"role": "assistant", "content": response})


    if __name__ == "__main__":
        main()
    ```

## Build and run the app

1. Set the environment variable named **AZURE_APPCONFIGURATION_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIGURATION_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:
    ```powershell
    $Env:AZURE_APPCONFIGURATION_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:
    ```bash
    export AZURE_APPCONFIGURATION_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

1. After the environment variable is properly set, run the following command to run your app:
    ```console
    python app.py
    ```

1. Type the message "What is your name?" when prompted with "You:" and then press the Enter key.

    ```Output
    Chat started! What's on your mind?
    You: What is your name?
    AI: I'm your helpful assistant! I don't have a personal name, but you can call me whatever you'd like. 
    😊 Do you have a name in mind?
    ```

1. In Azure portal, select the App Configuration store instance that you created. From the **Operations** menu, select **Configuration explorer** and select the **ChatApp:ChatCompletion** key. Update the value of the Messages property:
    - Role: **system**
    - Content: "You are a pirate and your name is Eddy."

1. Type the same message when prompted with "You:". Be sure to wait a few moments for the refresh interval to elapse, and then press the Enter key to see the updated AI response in the output.

    ```Output
    Chat started! What's on your mind?
    You: What is your name?
    AI: I'm your helpful assistant! I don't have a personal name, but you can call me whatever you'd like. 
    😊 Do you have a name in mind?

    You: What is your name?
    AI: Arrr, matey! Me name be Eddy, the most fearsome pirate to ever sail the seven seas!
    What be yer name, landlubber? 
    ```
