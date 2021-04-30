---
title: Connect to Azure Media Services v3 API - Python
description: This article demonstrates how to connect to Media Services v3 API with Python.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 11/18/2020
ms.author: inhenkel
ms.custom: devx-track-python

---
# Connect to Media Services v3 API - Python

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to connect to the Azure Media Services v3 Python SDK using the service principal sign in method.

## Prerequisites

- Download Python from [python.org](https://www.python.org/downloads/)
- Make sure to set the `PATH` environment variable
- [Create a Media Services account](./account-create-how-to.md). Be sure to remember the resource group name and the Media Services account name.
- Follow the steps in the [Access APIs](./access-api-howto.md) topic, selecting the Service principal authentication method. Record the subscription ID (`SubscriptionId`), application client ID (`AadClientId`), the authentication key (`AadSecret`), and the tenant ID (`AadTenantId`) that you need in the later steps.

> [!IMPORTANT]
> Review [naming conventions](media-services-apis-overview.md#naming-conventions).

## Install the modules

To work with Azure Media Services using Python, you need to install these modules.

* The `azure-mgmt-resource` module, which includes Azure modules for Active Directory.
* The `azure-mgmt-media` module, which includes the Media Services entities.

    Make sure to get [the latest version of the Media Services SDK for Python](https://pypi.org/project/azure-mgmt-media/).

Open a command-line tool and use the following commands to install the modules.

```
pip3 install azure-mgmt-resource
pip3 install azure-mgmt-media==3.0.0
```

## Connect to the Python client

1. Create a file with a `.py` extension
1. Open the file in your favorite editor
1. Add the code that follows to the file. The code imports the required modules and creates the Active Directory credentials object you need to connect to Media Services.

      Set the variables' values to the values you got from [Access APIs](./access-api-howto.md). Update the `ACCOUNT_NAME` and `RESOUCE_GROUP_NAME` variables to the Media Services account name and Resource Group names used when creating those resources.

      ```
      import adal
      from azure.mgmt.media import AzureMediaServices
      from msrestazure.azure_active_directory import AdalAuthentication
      from msrestazure.azure_cloud import AZURE_PUBLIC_CLOUD

      RESOURCE = "https://management.core.windows.net/"
      # Tenant ID for your Azure Subscription (AadTenantId)
      TENANT_ID = "00000000-0000-0000-000000000000"
      # Your Service Principal App ID (AadClientId)
      CLIENT = "00000000-0000-0000-000000000000"
      # Your Service Principal Password (AadSecret)
      KEY = "00000000-0000-0000-000000000000"
      # Your Azure Subscription ID (SubscriptionId)
      SUBSCRIPTION_ID = "00000000-0000-0000-000000000000"
      # Your Azure Media Service (AMS) Account Name
      ACCOUNT_NAME = "amsaccount"
      # Your Resource Group Name
      RESOUCE_GROUP_NAME = "amsResourceGroup"

      LOGIN_ENDPOINT = AZURE_PUBLIC_CLOUD.endpoints.active_directory
      RESOURCE = AZURE_PUBLIC_CLOUD.endpoints.active_directory_resource_id

      context = adal.AuthenticationContext(LOGIN_ENDPOINT + "/" + TENANT_ID)
      credentials = AdalAuthentication(
          context.acquire_token_with_client_credentials, RESOURCE, CLIENT, KEY
      )

      # The AMS Client
      # You can now use this object to perform different operations to your AMS account.
      client = AzureMediaServices(credentials, SUBSCRIPTION_ID)

      print("signed in")

      # Now that you are authenticated, you can manipulate the entities.
      # For example, list assets in your AMS account
      print(client.assets.list(RESOUCE_GROUP_NAME, ACCOUNT_NAME).get(0))
      ```

1. Run the file

## Next steps

- Use [Python SDK](https://aka.ms/ams-v3-python-sdk).
- Review the Media Services [Python ref](/python/api/overview/azure/mediaservices/management) documentation.
