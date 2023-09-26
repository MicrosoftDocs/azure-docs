---
services: cognitive-services
manager: nitinme
author: travisw
ms.author: travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/29/2023
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]

## Create a new Python environment

1. Create a new folder named *openai-python* for your project and a new Python code file named *main.py*. Change into that directory:

   ```cmd
   mkdir openai-python
   cd openai-python
   ```

1. Install the Python Libraries you'll need.

   ```cmd
   pip install "openai>=0.27.6"
   pip install python-dotenv
   ```

1. From the project directory, open the *Program.cs* file and replace its contents with the following code:

```python
import os
import openai
import dotenv

dotenv.load_dotenv()

openai.api_base = os.environ.get("AOAIEndpoint")

# Azure OpenAI on your own data is only supported by the 2023-08-01-preview API version
openai.api_version = "2023-08-01-preview"

openai.api_type = 'azure'
openai.api_key = os.environ.get("AOAIKey")

import requests

def setup_byod(deployment_id: str) -> None:
    """Sets up the OpenAI Python SDK to use your own data for the chat endpoint.
    
    :param deployment_id: The deployment ID for the model to use with your own data.

    To remove this configuration, simply set openai.requestssession to None.
    """

    class BringYourOwnDataAdapter(requests.adapters.HTTPAdapter):

        def send(self, request, **kwargs):
            request.url = f"{openai.api_base}/openai/deployments/{deployment_id}/extensions/chat/completions?api-version={openai.api_version}"
            return super().send(request, **kwargs)

    session = requests.Session()

    # Mount a custom adapter which will use the extensions endpoint for any call using the given `deployment_id`
    session.mount(
        prefix=f"{openai.api_base}/openai/deployments/{deployment_id}",
        adapter=BringYourOwnDataAdapter()
    )

    openai.requestssession = session

aoai_deployment_id = os.environ.get("AOAIDeploymentId")
setup_byod(aoai_deployment_id)

completion = openai.ChatCompletion.create(
    messages=[{"role": "user", "content": "What are the differences between Azure Machine Learning and Azure AI services?"}],
    deployment_id=os.environ.get("AOAIDeploymentId"),
    dataSources=[  # camelCase is intentional, as this is the format the API expects
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": os.environ.get("SearchEndpoint"),
                "key": os.environ.get("SearchKey"),
                "indexName": os.environ.get("SearchIndex"),
            }
        }
    ]
)
print(completion)
```

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Execute the following command:

   ```cmd
   python main.py
   ```

## Output

```output
Answer from assistant:
===
Azure Machine Learning is a cloud-based service that provides tools and services to build, train, and deploy machine learning models. It offers a collaborative environment for data scientists, developers, and domain experts to work together on machine learning projects. Azure Machine Learning supports various programming languages, frameworks, and libraries, including Python, R, TensorFlow, and PyTorch [^1^].
===
Context information (e.g. citations) from chat extensions:
===
tool: {
  "citations": [
    {
      "content": "...",
      "id": null,
      "title": "...",
      "filepath": "...",
      "url": "...",
      "metadata": {
        "chunking": "orignal document size=1011. Scores=3.6390076 and None.Org Highlight count=38."
      },
      "chunk_id": "2"
    },
    ...
  ],
  "intent": "[\u0022What are the differences between Azure Machine Learning and Azure AI services?\u0022]"
}
===
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code samples.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=dotnet&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-dotnet-application)
