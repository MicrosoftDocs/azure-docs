---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/07/2023
ms.author: pafarley
---

## Create environment variables 

In this example, write your credentials to environment variables on the local machine that runs the application.

[!INCLUDE [find key and endpoint](./find-key.md)]

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](../../security-features.md) article for more authentication options like [Azure Key Vault](../../use-key-vault.md).

To set the environment variable for your key and endpoint, open a console window and follow the instructions for your operating system and development environment.

1. To set the `VISION_KEY` environment variable, replace `your-key` with one of the keys for your resource.
2. To set the `VISION_ENDPOINT` environment variable, replace `your-endpoint` with the endpoint for your resource.

#### [Windows](#tab/windows)

```console
setx VISION_KEY your-key
```

```console
setx VISION_ENDPOINT your-endpoint
```

After you add the environment variables, you may need to restart any running programs that will read the environment variables, including the console window.

#### [Linux](#tab/linux)

```bash
export VISION_KEY=your-key
```

```bash
export VISION_ENDPOINT=your-endpoint
```

After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

---
