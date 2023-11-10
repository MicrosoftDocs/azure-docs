---
services: cognitive-services
manager: nitinme
author: mrbullwinkle #travisw
ms.author: mbullwin #travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/09/2023
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]

## Create a Python environment

1. Create a new folder named *openai-python* for your project and a new Python code file named *main.py*. Change into that directory:

   ```cmd
   mkdir openai-python
   cd openai-python
   ```

1. Install the following Python Libraries:

# [OpenAI Python 0.28.1](#tab/python)

```console
pip install openai==0.28.1
pip install python-dotenv
```

# [OpenAI Python 1.x](#tab/python-new)

```console
pip install openai
pip install python-dotenv
```

---
  
## Create the Python app

1. From the project directory, open the *main.py* file and add the following code:

# [OpenAI Python 0.28.1](#tab/python)

   ```python
   import os
   import openai
   import dotenv
   import requests

   dotenv.load_dotenv()

   openai.api_base = os.environ.get("AOAIEndpoint")

   # Azure OpenAI on your own data is only supported by the 2023-08-01-preview API version
   openai.api_version = "2023-08-01-preview"
   openai.api_type = 'azure'
   openai.api_key = os.environ.get("AOAIKey")

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

# [OpenAI Python 1.x](#tab/python-new)

```python
import os
import openai
import dotenv

dotenv.load_dotenv()

endpoint = os.environ.get("AOAIEndpoint")
api_key = os.environ.get("AOAIKey")
deployment = os.environ.get("AOAIDeploymentId")

client = openai.AzureOpenAI(
    base_url=f"{endpoint}/openai/deployments/{deployment}/extensions",
    api_key=api_key,
    api_version="2023-08-01-preview",
)

completion = client.chat.completions.create(
    model=deployment,
    messages=[
        {
            "role": "user",
            "content": "How is Azure machine learning different than Azure OpenAI?",
        },
    ],
    extra_body={
        "dataSources": [
            {
                "type": "AzureCognitiveSearch",
                "parameters": {
                    "endpoint": os.environ["SearchEndpoint"],
                    "key": os.environ["SearchKey"],
                    "indexName": os.environ["SearchIndex"]
                }
            }
        ]
    }
)

print(completion.model_dump_json(indent=2))
```

---

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Execute the following command:

   ```cmd
   python main.py
   ```

   The application prints the response in a JSON format suitable for use in many scenarios. It includes both answers to your query and citations from your uploaded files.

> [!div class="nextstepaction"]
> [I ran into an issue when running the code samples.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=dotnet&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-dotnet-application)