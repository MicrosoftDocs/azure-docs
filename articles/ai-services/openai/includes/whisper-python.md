---
services: ai-services
author: mrbullwinkle
ms.author: mbullwin
ms.service: openai
ms.topic: include
ms.date: 3/19/2024
---

## Python

### Prerequisites

- <a href="https://www.python.org/" target="_blank">Python 3.8 or later version</a>
- The following Python libraries: os

### Set up

Install the OpenAI Python client library with:

# [OpenAI Python 1.x](#tab/python-new)

```console
pip install openai
```

# [OpenAI Python 0.28.1](#tab/python)

[!INCLUDE [Deprecation](../includes/deprecation.md)]

```console
pip install openai==0.28.1
```

---

1. Create a new Python file called quickstart.py. Then open it up in your preferred editor or IDE.

1. Replace the contents of quickstart.py with the following code. Modify the code to add your deployment name:

# [OpenAI Python 1.x](#tab/python-new)

```python
    import os
    from openai import AzureOpenAI
        
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
        api_version="2024-02-01",
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )
    
    deployment_id = "YOUR-DEPLOYMENT-NAME-HERE" #This will correspond to the custom name you chose for your deployment when you deployed a model."
    audio_test_file = "./wikipediaOcelot.wav"
    
    result = client.audio.transcriptions.create(
        file=open(audio_test_file, "rb"),            
        model=deployment_id
    )
    
    print(result)
```

# [OpenAI Python 0.28.1](#tab/python)



```python
    import openai
    import time
    import os
    
    openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
    openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")  # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    openai.api_type = "azure"
    openai.api_version = "2024-02-01"
    
    model_name = "whisper"
    deployment_id = "YOUR-DEPLOYMENT-NAME-HERE" #This will correspond to the custom name you chose for your deployment when you deployed a model."
    audio_language="en"
    
    audio_test_file = "./wikipediaOcelot.wav"
    
    result = openai.Audio.transcribe(
                file=open(audio_test_file, "rb"),            
                model=model_name,
                deployment_id=deployment_id
            )
    
    print(result)
```

---

Run the application with the python command on your quickstart file:


You can get sample audio files from the [Azure AI Speech SDK repository at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/audiofiles).

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

## Output

```python
{"text":"The ocelot, Lepardus paradalis, is a small wild cat native to the southwestern United States, Mexico, and Central and South America. This medium-sized cat is characterized by solid black spots and streaks on its coat, round ears, and white neck and undersides. It weighs between 8 and 15.5 kilograms, 18 and 34 pounds, and reaches 40 to 50 centimeters 16 to 20 inches at the shoulders. It was first described by Carl Linnaeus in 1758. Two subspecies are recognized, L. p. paradalis and L. p. mitis. Typically active during twilight and at night, the ocelot tends to be solitary and territorial. It is efficient at climbing, leaping, and swimming. It preys on small terrestrial mammals such as armadillo, opossum, and lagomorphs."}
```
