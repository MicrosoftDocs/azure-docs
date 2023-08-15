---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 06/24/2019
ms.author: aahi
---

## Configure an environment variable for authentication

Your application must be authenticated to access Azure AI services resources. For production, use a secure way of storing and accessing your credentials. For example, after you have a key for your resource, write it to a new environment variable on the local machine running the application.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](../../security-features.md) article for more authentication options like [Azure Key Vault](../../use-key-vault.md). 

To set the environment variable for your resource key, open a console window, and follow the instructions for your operating system and development environment. To set the `COGNITIVE_SERVICE_KEY` environment variable, replace `your-key` with one of the keys for your resource.

#### [Windows](#tab/windows)

```console
setx COGNITIVE_SERVICE_KEY your-key
```

> [!NOTE]
> If you only need to access the environment variable in the current running console, you can set the environment variable with `set` instead of `setx`.

After you add the environment variable, you may need to restart any running consoles or other programs that will need to read the environment variable. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the example. 

#### [Linux](#tab/linux)

```bash
export COGNITIVE_SERVICE_KEY=your-key
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/macos)

##### Bash

Edit your .bash_profile, and add the environment variable:

```bash
export COGNITIVE_SERVICE_KEY=your-key
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective.

##### Xcode

For iOS and macOS development, you set the environment variables in Xcode. For example, follow these steps to set the environment variable in Xcode 13.4.1.

1. Select **Product** > **Scheme** > **Edit scheme**
1. Select **Arguments** on the **Run** (Debug Run) page
1. Under **Environment Variables** select the plus (+) sign to add a new environment variable. 
1. Enter `COGNITIVE_SERVICE_KEY` for the **Name** and enter your resource key for the **Value**.

For more configuration options, see the [Xcode documentation](https://help.apple.com/xcode/#/dev745c5c974).
***

To set the environment variable for your Speech resource region, follow the same steps. Set `COGNITIVE_SERVICE_REGION` to the region of your resource. For example, `westus`.