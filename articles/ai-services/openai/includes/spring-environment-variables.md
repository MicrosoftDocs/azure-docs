---
title: 'Spring Environment variables'
titleSuffix: Azure OpenAI Service
description: set up spring ai environment variables for your key and endpoint
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/07/2023
---


### Environment variables

Create and assign persistent environment variables for your key and endpoint.

**NOTE** Spring AI defaults the model name to `gpt-35-turbo`; it is only necessary to provide the SPRING_AI_AZURE_OPENAI_MODEL if you
have deployed a model with a different name.

# [Command Line](#tab/command-line)

```CMD
setx SPRING_AI_AZURE_OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx SPRING_AI_AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

```CMD
setx SPRING_AI_AZURE_OPENAI_MODEL "REPLACE_WITH_YOUR_MODEL_NAME_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('SPRING_AI_AZURE_OPENAI_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SPRING_AI_AZURE_OPENAI_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SPRING_AI_AZURE_OPENAI_MODEL', 'REPLACE_WITH_YOUR_MODEL_NAME_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export SPRING_AI_AZURE_OPENAI_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export SPRING_AI_AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export SPRING_AI_AZURE_OPENAI_MODEL="REPLACE_WITH_YOUR_MODEL_NAME_HERE" >> /etc/environment && source /etc/environment
```

---