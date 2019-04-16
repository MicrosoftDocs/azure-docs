---
title: Connect to Azure Media Services v3 API - Python
description: Learn how to connect to Media Services v3 API with Python.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/15/2019
ms.author: juliako

---
# Connect to Media Services v3 API - Python

This article shows you how to connect to the Azure Media Services v3 Python SDK using the service principal sign in method.

In this article, the Visual Studio Code is used to develop an app.

## Prerequisites

- Follow [Writing Python with Visual Studio Code](https://code.visualstudio.com/docs/python/python-tutorial) to install:

   - Python extension for VS Code
   - Download Python from [python.org](https://www.python.org/downloads/)
   - Make sure to set the `PATH` environment variable
- [Create a Media Services account](create-account-cli-how-to.md). Be sure to remember the resource group name and the Media Services account name.
- Follow the steps in the [Access APIs](access-api-cli-how-to.md) topic. Record the subscription ID, application ID (client ID), the authentication key (secret), and the tenant ID that you need in the lasta later step.

## Install the modules

To work with Data Lake Storage Gen1 using Python, you need to install three modules.

* The `azure-mgmt-resource` module, which includes Azure modules for Active Directory.
* The `azure-mgmt-media` module, which includes the Media Services entities.

Use the following commands to install the modules.

```
pip3 install azure-mgmt-resource
pip3 install azure-mgmt-media==1.1.1
```

## Create a Python project

Follow the steps in [Writing Python with Visual Studio Code](https://code.visualstudio.com/docs/python/python-tutorial) to

1. Start a project
1. Select an interpreter
1. Create a Python source file with `.py` extension. In this example, we call the file `connectwithpython.py`.

## Connect to the Python client

Open `connectwithpython.py` and add the code that doese the following:

   1. Imports the required modules
   2. Creates the Active Directory credentials that you need to connect to Madia Services. 

   The values used to set the credentials are the values that you got from [Access APIs](access-api-cli-how-to.md)
   3. Gets Media Services client.
 
 ```
import adal
from msrestazure.azure_active_directory import AdalAuthentication
from msrestazure.azure_cloud import AZURE_PUBLIC_CLOUD
from azure.mgmt.media import AzureMediaServices

# Tenant ID for your Azure Subscription
TENANT_ID = 'ABCDEFGH-1234-1234-1234-ABCDEFGHIJKL'

# Your Service Principal App ID
CLIENT = 'a2ab11af-01aa-4759-8345-7803287dbd39'

# Your Service Principal Password
KEY = 'password'

# Your Azure Subscription ID
subscription_id = '33333333-3333-3333-3333-333333333333'

LOGIN_ENDPOINT = AZURE_PUBLIC_CLOUD.endpoints.active_directory

RESOURCE = AZURE_PUBLIC_CLOUD.endpoints.active_directory_resource_id

context = adal.AuthenticationContext(LOGIN_ENDPOINT + '/' + TENANT_ID)

credentials = AdalAuthentication(
 context.acquire_token_with_client_credentials,
 RESOURCE,
 CLIENT,
 KEY
)

client = AzureMediaServices(credentials, subscription_id)
 ```

## Next steps

- Use [Python SDK](https://aka.ms/ams-v3-python-sdk).
- Review the Media Services [Python ref](https://aka.ms/ams-v3-python-ref) documentation.
