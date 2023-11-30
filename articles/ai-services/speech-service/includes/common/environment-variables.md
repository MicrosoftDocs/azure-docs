---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 08/24/2023
ms.author: eur
---

Your application must be authenticated to access Azure AI services resources. For production, use a secure way of storing and accessing your credentials. For example, after you [get a key](~/articles/ai-services/multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource) for your Speech resource, write it to a new environment variable on the local machine that runs the application.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See [Azure AI services security](../../../security-features.md) for more authentication options such as [Azure Key Vault](../../../use-key-vault.md).

To set the environment variable for your Speech resource key, open a console window, and follow the instructions for your operating system and development environment.

- To set the `SPEECH_KEY` environment variable, replace *your-key* with one of the keys for your resource.
- To set the `SPEECH_REGION` environment variable, replace *your-region* with one of the regions for your resource.

#### [Windows](#tab/windows)

```console
setx SPEECH_KEY your-key
setx SPEECH_REGION your-region
```

> [!NOTE]
> If you only need to access the environment variables in the current console, you can set the environment variable with `set` instead of `setx`.

After you add the environment variables, you might need to restart any programs that need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before you run the example.

#### [Linux](#tab/linux)

```bash
export SPEECH_KEY=your-key
export SPEECH_REGION=your-region
```

After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/macos)

##### Bash

Edit your *.bash_profile* file, and add the environment variables:

```bash
export SPEECH_KEY=your-key
export SPEECH_REGION=your-region
```

After you add the environment variables, run `source ~/.bash_profile` from your console window to make the changes effective.

##### Xcode

For iOS and macOS development, you set the environment variables in Xcode. For example, follow these steps to set the environment variable in Xcode 13.4.1.

1. Select **Product** > **Scheme** > **Edit scheme**.
1. Select **Arguments** on the **Run** (Debug Run) page.
1. Under **Environment Variables** select the plus (+) sign to add a new environment variable.
1. Enter `SPEECH_KEY` for the **Name** and enter your Speech resource key for the **Value**.

To set the environment variable for your Speech resource region, follow the same steps. Set `SPEECH_REGION` to the region of your resource. For example, `westus`.

For more configuration options, see [the Xcode documentation](https://help.apple.com/xcode/#/dev745c5c974).
***
