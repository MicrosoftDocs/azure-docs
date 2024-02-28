---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/08/2024
ms.author: eur
---

Your application must be authenticated to access Azure AI services resources. For production, use a secure way of storing and accessing your credentials. For example, after you [get a key](~/articles/ai-services/multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource) for your Speech resource, write it to a new environment variable on the local machine running the application.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See [Azure AI services security](../../../security-features.md) for more authentication options like [Azure Key Vault](../../../use-key-vault.md). 

To set the environment variables, open a console window, and follow the instructions for your operating system and development environment.

- To set the `OPEN_AI_KEY` environment variable, replace `your-openai-key` with one of the keys for your resource.
- To set the `OPEN_AI_ENDPOINT` environment variable, replace `your-openai-endpoint` with one of the regions for your resource.
- To set the `OPEN_AI_DEPLOYMENT_NAME` environment variable, replace `your-openai-deployment-name` with one of the regions for your resource.
- To set the `SPEECH_KEY` environment variable, replace `your-speech-key` with one of the keys for your resource.
- To set the `SPEECH_REGION` environment variable, replace `your-speech-region` with one of the regions for your resource.

#### [Windows](#tab/windows)

```console
setx OPEN_AI_KEY your-openai-key
setx OPEN_AI_ENDPOINT your-openai-endpoint
setx OPEN_AI_DEPLOYMENT_NAME your-openai-deployment-name
setx SPEECH_KEY your-speech-key
setx SPEECH_REGION your-speech-region
```

> [!NOTE]
> If you only need to access the environment variable in the current running console, set the environment variable with `set` instead of `setx`.

After you add the environment variables, you might need to restart any running programs that need to read the environment variable, including the console window. For example, if Visual Studio is your editor, restart Visual Studio before running the example.

#### [Linux](#tab/linux)

```bash
export OPEN_AI_KEY=your-openai-key
export OPEN_AI_ENDPOINT=your-openai-endpoint
export OPEN_AI_DEPLOYMENT_NAME=your-openai-deployment-name
export SPEECH_KEY=your-speech-key
export SPEECH_REGION=your-speech-region
```

After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/macos)
##### Bash

Edit your *.bash_profile*, and add the environment variables:

```bash
export OPEN_AI_KEY=your-openai-key
export OPEN_AI_ENDPOINT=your-openai-endpoint
export OPEN_AI_DEPLOYMENT_NAME=your-openai-deployment-name
export SPEECH_KEY=your-speech-key
export SPEECH_REGION=your-speech-region
```

After you add the environment variables, run `source ~/.bash_profile` from your console window to make the changes effective.

##### Xcode

For iOS and macOS development, set the environment variables in Xcode. For example, follow these steps to set the environment variable in Xcode 13.4.1.

1. Select **Product** > **Scheme** > **Edit scheme**.
1. Select **Arguments** on the **Run** (Debug Run) page.
1. Under **Environment Variables** select the plus (+) sign to add a new environment variable.
1. Enter `SPEECH_KEY` for the **Name** and enter your Speech resource key for the **Value**.

Repeat the steps to set other required environment variables.

For more configuration options, see the [Xcode documentation](https://help.apple.com/xcode/#/dev745c5c974).
***
