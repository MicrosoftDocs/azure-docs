---
title: 'Environment variables'
titleSuffix: Azure OpenAI Service
description: set up environment variables for your key and endpoint
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/28/2023
---


### Environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```cmd
setx AZURE_OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```bash
export AZURE_OPENAI_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE"
export AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE"
```

---
