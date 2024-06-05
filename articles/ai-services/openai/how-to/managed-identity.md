---
title: How to configure Azure OpenAI Service with managed identities
titleSuffix: Azure OpenAI
description: Provides guidance on how to set managed identity with Microsoft Entra ID
ms.service: azure-ai-openai
ms.topic: how-to 
ms.date: 04/03/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-azurecli
---

# How to configure Azure OpenAI Service with managed identities

More complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Microsoft Entra ID.

In the following sections, you'll use the Azure CLI to sign in, and obtain a bearer token to call the OpenAI resource. If you get stuck, links are provided in each section with all available options for each command in Azure Cloud Shell/Azure CLI.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to the Azure OpenAI Service in the desired Azure subscription
-   Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the [Request Access to Azure OpenAI Service form](https://aka.ms/oai/access). Open an issue on this repo to contact us if you have an issue.

- [Custom subdomain names are required to enable features like Microsoft Entra ID for authentication.](
../../cognitive-services-custom-subdomains.md)

- Azure CLI - [Installation Guide](/cli/azure/install-azure-cli)
- The following Python libraries: os, requests, json, openai, azure-identity

## Assign role

Assign yourself either the [Cognitive Services OpenAI User](role-based-access-control.md#cognitive-services-openai-user) or [Cognitive Services OpenAI Contributor](role-based-access-control.md#cognitive-services-openai-contributor) role to allow you to use your account to make Azure OpenAI inference API calls rather than having to use key-based auth. After you make this change it can take up to 5 minutes before the change takes effect.

## Sign into the Azure CLI

To sign-in to the Azure CLI, run the following command and complete the sign-in. You might need to do it again if your session has been idle for too long.

```azurecli
az login
```

## Chat Completions

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)

client = AzureOpenAI(
    api_version="2024-02-15-preview",
    azure_endpoint="https://{your-custom-endpoint}.openai.azure.com/",
    azure_ad_token_provider=token_provider
)

response = client.chat.completions.create(
    model="gpt-35-turbo-0125", # model = "deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)

print(response.choices[0].message.content)
```

## Querying Azure OpenAI with the control plane API

```python
import requests
import json
from azure.identity import DefaultAzureCredential

region = "eastus"
token_credential = DefaultAzureCredential()
subscriptionId = "{YOUR-SUBSCRIPTION-ID}" 


token = token_credential.get_token('https://management.azure.com/.default')
headers = {'Authorization': 'Bearer ' + token.token}

url = f"https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.CognitiveServices/locations/{region}/models?api-version=2023-05-01"

response = requests.get(url, headers=headers)

data = json.loads(response.text)

print(json.dumps(data, indent=4))
```

## Authorize access to managed identities

OpenAI supports Microsoft Entra authentication with [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to Azure AI services resources using Microsoft Entra credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Microsoft Entra authentication, you can avoid storing credentials with your applications that run in the cloud.  

## Enable managed identities on a VM

Before you can use managed identities for Azure resources to authorize access to Azure AI services resources from your VM, you must enable managed identities for Azure resources on the VM. To learn how to enable managed identities for Azure Resources, see:

- [Azure portal](../../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

For more information about managed identities, see [Managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md).
