---
author: v-demjoh
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 05/18/2020
ms.author: v-demjoh
---


## Run the Speech CLI

Now you're ready to run the Speech CLI to translate speech into text in a different language.

From the command line, change to the directory that contains the Speech CLI binary file, and type:

```bash
spx translate --microphone --target de-DE
```

The Speech CLI will translate natural language spoken English into text printed in German.
Press ENTER to stop the tool.

> [!NOTE]
> The Speech CLI defaults to English. You can choose a different language [from the Speech-to-text table](../../../../language-support.md).
> For example, add `--source ja-JP` to recognize Japanese speech.
