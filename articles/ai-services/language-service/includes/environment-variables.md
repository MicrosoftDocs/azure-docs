---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 12/06/2022
ms.author: aahi
---

### Create environment variables 

Your application must be authenticated to send API requests. For production, use a secure way of storing and accessing your credentials. In this example, you will write your credentials to environment variables on the local machine running the application.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](../../security-features.md) article for more authentication options like [Azure Key Vault](../../use-key-vault.md). 

To set the environment variable for your Language resource key, open a console window, and follow the instructions for your operating system and development environment. 

1. To set the `LANGUAGE_KEY` environment variable, replace `your-key` with one of the keys for your resource.
2. To set the `LANGUAGE_ENDPOINT` environment variable, replace `your-endpoint` with the endpoint for your resource.

#### [Windows](#tab/windows)

```console
setx LANGUAGE_KEY your-key
```

```console
setx LANGUAGE_ENDPOINT your-endpoint
```

> [!NOTE]
> If you only need to access the environment variables in the current running console, you can set the environment variable with `set` instead of `setx`.

After you add the environment variables, you may need to restart any running programs that will need to read the environment variables, including the console window. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the example.

#### [Linux](#tab/linux)

```bash
export LANGUAGE_KEY=your-key
```

```bash
export LANGUAGE_ENDPOINT=your-endpoint
```

After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/macos)

##### Bash

```bash
export LANGUAGE_KEY=your-key
```

```bash
export LANGUAGE_ENDPOINT=your-endpoint
```

After you add the environment variables, run `source ~/.bash_profile` from your console window to make the changes effective.

##### Xcode

For iOS and macOS development, you set the environment variables in Xcode. For example, follow these steps to set the environment variable in Xcode 13.4.1.

1. Select **Product** > **Scheme** > **Edit scheme**
1. Select **Arguments** on the **Run** (Debug Run) page
1. Under **Environment Variables** select the plus (+) sign to add a new environment variable. 
1. Enter `LANGUAGE_KEY` for the **Name** and enter your Language resource key for the **Value**.
1. Perform these steps for your resource endpoint. Name the new environment variable `LANGUAGE_ENDPOINT`.

For more configuration options, see the [Xcode documentation](https://help.apple.com/xcode/#/dev745c5c974).

---
