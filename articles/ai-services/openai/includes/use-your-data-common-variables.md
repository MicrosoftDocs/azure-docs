---
#services: cognitive-services
manager: nitinme
author: travisw
ms.author: travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/29/2023
---

## Retrieve required variables

To successfully make a call against Azure OpenAI, you need the following variables. This quickstart assumes you've uploaded your data to an Azure blob storage account and have an Azure AI Search index created. See [Add your data using Azure AI studio](../use-your-data-quickstart.md?pivots=programming-language-studio)

|Variable name | Value |
|--------------------------|-------------|
| `AOAIEndpoint`               | This value can be found in the **Keys & Endpoint** section when examining your Azure OpenAI resource from the Azure portal. Alternatively, you can find the value in **Azure AI studio** > **Chat playground** > **Code view**. An example endpoint is: `https://my-resoruce.openai.azure.com`.|
| `AOAIKey` | This value can be found in **Resource management** > **Keys & Endpoint** section when examining your Azure OpenAI resource from the Azure portal. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption. |
| `AOAIDeploymentId` | This value corresponds to the custom name you chose for your deployment when you deployed a model. This value can be found under **Resource Management** > **Deployments** in the Azure portal or alternatively under **Management** > **Deployments** in Azure AI studio.|
| `SearchEndpoint` | This value can be found in the **Overview** section when examining your Azure Cognitive Search resource from the Azure portal. |
| `SearchKey` | This value can be found in the **Settings** > **Keys** section when examining your Azure Cognitive Search resource from the Azure portal. You can use either the primary admin key or secondary admin key. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption. |
| `SearchIndex` | This value corresponds to the name of the index you created to store your data. You can find it in the **Overview** section when examining your Azure Cognitive Search resource from the Azure portal. |

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AOAIEndpoint REPLACE_WITH_YOUR_AOAI_ENDPOINT_VALUE_HERE
```
```CMD
setx AOAIKey REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE
```
```CMD
setx AOAIDeploymentId REPLACE_WITH_YOUR_AOAI_DEPLOYMENT_VALUE_HERE
```
```CMD
setx SearchEndpoint REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_VALUE_HERE
```
```CMD
setx SearchKey REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_KEY_VALUE_HERE
```
```CMD
setx SearchIndex REPLACE_WITH_YOUR_INDEX_NAME_HERE
```


# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AOAIEndpoint', 'REPLACE_WITH_YOUR_AOAI_ENDPOINT_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AOAIKey', 'REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AOAIDeploymentId', 'REPLACE_WITH_YOUR_AOAI_DEPLOYMENT_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SearchEndpoint', 'REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SearchKey', 'REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SearchIndex', 'REPLACE_WITH_YOUR_INDEX_NAME_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
export AOAIEndpoint=REPLACE_WITH_YOUR_AOAI_ENDPOINT_VALUE_HERE
```
```Bash
export AOAIKey=REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE
```
```Bash
export AOAIDeploymentId=REPLACE_WITH_YOUR_AOAI_DEPLOYMENT_VALUE_HERE
```
```Bash
export SearchEndpoint=REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_VALUE_HERE
```
```Bash
export SearchKey=REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_KEY_VALUE_HERE
```
```Bash
export SearchIndex=REPLACE_WITH_YOUR_INDEX_NAME_HERE
```

---

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Set-up)
