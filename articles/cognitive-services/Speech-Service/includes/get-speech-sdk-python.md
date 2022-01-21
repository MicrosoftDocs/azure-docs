---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: eur
---

The Python Speech SDK is available as a Python Package Index (PyPI) module. For more information, see <a href="https://pypi.org/project/azure-cognitiveservices-speech/" target="_blank">azure-cognitiveservices-speech </a>. The Python Speech SDK is compatible with Windows, Linux, and macOS. Install a version of [Python from 3.6 to 3.9](https://www.python.org/downloads/).

Before you install the Python Speech SDK, make sure to satisfy the [system requirements and prerequisites](~/articles/cognitive-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-python#prerequisites). 

To install the Speech SDK, run this command in a terminal.

```console
pip install azure-cognitiveservices-speech
```

If you're on macOS and run into install issues, you may need to run this command first.

```console
python3 -m pip install --upgrade pip
```

Now you can import the Speech SDK into your Python project.

```Python
import azure.cognitiveservices.speech as speechsdk
```
