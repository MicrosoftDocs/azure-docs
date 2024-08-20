---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/07/2023
ms.author: pafarley
---

In this example, write your credentials to environment variables on the local machine that runs the application.

[!INCLUDE [find key and endpoint](./find-key.md)]

To set the environment variable for your key and endpoint, open a console window and follow the instructions for your operating system and development environment.

- To set the `FACE_APIKEY` environment variable, replace `<your_key>` with one of the keys for your resource.
- To set the `FACE_ENDPOINT` environment variable, replace `<your_endpoint>` with the endpoint for your resource.

[!INCLUDE [Azure key vault](~/reusable-content/ce-skilling/azure/includes/ai-services/security/azure-key-vault.md)]

#### [Windows](#tab/windows)

```console
setx FACE_APIKEY <your_key>
```

```console
setx FACE_ENDPOINT <your_endpoint>
```

After you add the environment variables, you may need to restart any running programs that will read the environment variables, including the console window.

#### [Linux](#tab/linux)

```bash
export FACE_APIKEY=<your_key>
```

```bash
export FACE_ENDPOINT=<your_endpoint>
```

After you add the environment variables, run `source ~/.bashrc` from your console window to make the changes effective.

---
