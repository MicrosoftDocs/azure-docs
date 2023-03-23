---
title: How to Configure Azure OpenAI Service with Managed Identities
titleSuffix: Azure OpenAI
description: Provides guidance on how to set managed identity with Azure Active Directory
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to 
ms.date: 06/24/2022
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
ms.custom: 
---

# How to Configure Azure OpenAI Service with Managed Identities

More complex security scenarios require Azure role-based access control (Azure RBAC). This document covers how to authenticate to your OpenAI resource using Azure Active Directory (Azure AD).

In the following sections, you'll use  the Azure CLI to assign roles, and obtain a bearer token to call the OpenAI resource. If you get stuck, links are provided in each section with all available options for each command in Azure Cloud Shell/Azure CLI.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to the Azure OpenAI service in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- Azure CLI - [Installation Guide](/cli/azure/install-azure-cli)
- The following Python libraries: os, requests, json

## Sign into the Azure CLI

To sign-in to the Azure CLI, run the following command and complete the sign-in. You may need to do it again if your session has been idle for too long.

```azurecli
az login
```

## Assign yourself to the Cognitive Services User role using azurecli

Assigning yourself to the Cognitive Services User role will allow you to use your account for access to the specific cognitive services resource

Get your user information

```azurecli
export user=$(az account show | jq -r .user.name)
 ```

Assign yourself to “Cognitive Services User” role.

```azurecli
export resourceId=$(az group show -g $myResourceGroupName | jq -r .id)
az role assignment create --role "Cognitive Services User" --assignee $user --scope $resourceId
```

    > [!NOTE]
    > Role assignment change will take ~5 mins to become effective. Therefore, I did this step ahead of time. Skip this if you have already done this previously.

# defining the system message

system_message_template = "<|im_start|>system\n{}\n<|im_end|>"
system_message = system_message_template.format("")

## Acquire and token and make and API call using azcli

Acquire an Azure AD access token. Access tokens expire in one hour. you'll then need to acquire another one.

```azurecli
export accessToken=$(az account get-access-token --resource https://cognitiveservices.azure.com | jq -r .accessToken)
```

Make an API call
Use the access token to authorize your API call by setting the `Authorization` header value.

```bash
curl ${endpoint%/}/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2022-12-01 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken" \
-d '{ "prompt": "Once upon a time" }'
```
## Acquire and token and make and API call using python

Acquire an Azure AD access token. Access tokens expire in one hour. you'll then need to acquire another one.

```python
from azure.identity import DefaultAzureCredential
import openai
# Request credential
default_credential = DefaultAzureCredential()
token = default_credential.get_token("https://cognitiveservices.azure.com/.default")
```

Configure OpenAI API and use the access token to authorize the call bu setting the token as the api_key value

 ```python
import os
import openai
openai.api_type = "azure_ad"
openai.api_base = "https://oai-az-test-02.openai.azure.com/"
openai.api_version = "2022-12-01"
openai.api_key = f"{token.token}"
```

Create a prompt

```python
def create_prompt(system_message, messages):
    prompt = system_message
    message_template = "\n<|im_start|>{}\n{}\n<|im_end|>"
    for message in messages:
        prompt += message_template.format(message['sender'], message['text'])
    prompt += "\n<|im_start|>assistant\n"
    return prompt
```
 Ask a question
 
```python
messages = [{"sender": "user", "text": "Hello world",]

response = openai.Completion.create(
    engine="GPT",
    prompt= create_prompt(system_message, messages),
    temperature=0.7,
    max_tokens=800,
    top_p=0.95,
    frequency_penalty=0,
    presence_penalty=0,      
    stop=["<|im_end|>"])
 
print(response)   
 ``` 


## Authorize access to managed identities

OpenAI supports Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to Cognitive Services resources using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

## Enable managed identities on a VM

Before you can use managed identities for Azure resources to authorize access to Cognitive Services resources from your VM, you must enable managed identities for Azure resources on the VM. To learn how to enable managed identities for Azure Resources, see:

- [Azure portal](../../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

For more information about managed identities, see [Managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md).
