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
ms.date: 04/10/2019
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

1. Open `connectwithpython.py` and add the following snippet to import the required modules:

    ```
    ## Use this for Azure AD authentication
    from msrestazure.azure_active_directory import AADTokenCredentials

    ## Required for Media Services 
    from azure.mgmt.media import azure_media_services

    import adal
    from azure.mgmt.resource.resources import ResourceManagementClient
    from azure.mgmt.resource.resources.models import ResourceGroup

    ## Use these as needed for your application
    import logging, getpass, pprint, uuid, time
    ```
2. To create the Active Directory credentials that you need to make requests, add following code to `connectwithpython.py`  class and set the values that you got from [Access APIs](access-api-cli-how-to.md)

    ```
    authority_host_uri = 'https://login.microsoftonline.com'
    tenant = '<TENANT>'
    authority_uri = authority_host_uri + '/' + tenant
    RESOURCE = 'https://management.core.windows.net/'
    client_id = '<CLIENT_ID>'
    client_secret = '<CLIENT_SECRET>'
    
    context = adal.AuthenticationContext(authority_uri, api_version=None)
    mgmt_token = context.acquire_token_with_client_credentials(RESOURCE, client_id, client_secret)
    armCreds = AADTokenCredentials(mgmt_token, client_id, resource=RESOURCE)
    ```

## Next steps

- Use [Python SDK](https://aka.ms/ams-v3-python-sdk).
- Review the Media Services [Python ref](https://aka.ms/ams-v3-python-ref) documentation.
