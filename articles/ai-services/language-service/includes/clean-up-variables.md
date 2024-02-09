---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 10/21/2022
ms.author: aahi
---

Use the following commands to delete the environment variables you created for this quickstart.

#### [Windows](#tab/windows)

```console
reg delete "HKCU\Environment" /v LANGUAGE_KEY /f
```

```console
reg delete "HKCU\Environment" /v LANGUAGE_ENDPOINT /f
```

#### [Linux](#tab/linux)

```bash
unset LANGUAGE_KEY
```

```bash
unset LANGUAGE_ENDPOINT
```

#### [macOS](#tab/macos)

```bash
unset LANGUAGE_KEY
```

```bash
unset LANGUAGE_ENDPOINT
```

---
