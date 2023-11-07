---
title: Quickstart – Azure libraries (SDK) for Python for Azure Managed Confidential Consortium Framework 
description: Learn to use the Azure libraries for Python for Azure Managed Confidential Consortium Framework
author: msftsettiy
ms.author: settiy
ms.date: 09/11/2023
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: devx-track-python, mode-api
---

# Quickstart: Create an Azure Managed CCF resource using the Azure SDK for Python

Azure Managed CCF (Managed CCF) is a new and highly secure service for deploying confidential applications. For more information on Azure Managed CCF, see [About Azure Managed Confidential Consortium Framework](overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[API reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-confidentialledger/latest/azure.confidentialledger.html) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/confidentialledger) | [Package (Python Package Index) Management Library](https://pypi.org/project/azure-mgmt-confidentialledger/)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Python versions supported by the [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python#prerequisites).

## Setup

This quickstart uses the Azure Identity library, along with Azure CLI or Azure PowerShell, to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls. For more information, see [Authenticate the client with Azure Identity client library](/python/api/overview/azure/identity-readme).

### Sign in to Azure

[!INCLUDE [Sign in to Azure](../../includes/confidential-ledger-sign-in-azure.md)]

### Install the packages

In a terminal or command prompt, create a suitable project folder, and then create and activate a Python virtual environment as described on [Use Python virtual environments](/azure/developer/python/configure-local-development-environment?tabs=cmd#use-python-virtual-environments).

Install the Azure Active Directory identity client library:

```terminal
pip install azure-identity
```

Install the Azure confidential ledger management plane client library.

```terminal
pip install azure.mgmt.confidentialledger
```

### Create a resource group

[!INCLUDE [Create resource group](./includes/powershell-resource-group-create.md)]

### Register the resource provider

[!INCLUDE [Register the resource provider](includes/register-provider.md)]

### Create members

[!INCLUDE [Create members](includes/create-member.md)]

## Create the Python application

### Use the Management plane client library

The management plane library (azure.mgmt.confidentialledger) allows operations on Managed CCF resources, such as creation and deletion, listing the resources associated with a subscription, and viewing the details of a specific resource. The following piece of code creates and views the properties of a Managed CCF resource.

```python
from azure.identity import DefaultAzureCredential

# Import the Azure Managed CCF management plane library
from azure.mgmt.confidentialledger import ConfidentialLedger

import os

sub_id = "0000000-0000-0000-0000-000000000001"
client = ConfidentialLedger(credential=DefaultAzureCredential(), subscription_id=sub_id)

# ********** Create a Managed CCF app ********** 
app_properties = {
    "location": "southcentralus",
    "properties": {
      "deploymentType": {
        "appSourceUri": "",
        "languageRuntime": "JS"
      },
      "memberIdentityCertificates": [ # Multiple members can be supplied
        {
          "certificate": "-----BEGIN CERTIFICATE-----\nMIIBvzC...f0ZoeNw==\n-----END CERTIFICATE-----",
          "tags": { "owner": "ITAdmin1" }
        }
      ],
      "nodeCount": 3 # Maximum allowed value is 9
    },
    "tags": { "costcenter": "12345" }
}

result = client.managed_ccf.begin_create("myResourceGroup", "confidentialbillingapp", app_properties).result()

# ********** Retrieve the Managed CCF app details ********** 
confidential_billing_app = client.managed_ccf.get("myResourceGroup", "confidentialbillingapp")

# ********** Delete the Managed CCF app **********
result = client.managed_ccf.begin_delete("myResourceGroup", "confidentialbillingapp").result()
```

## Clean up resources

Other Managed CCF articles can build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you might wish to leave these resources in place.

Otherwise, when you're finished with the resources created in this article, use the Azure CLI [az group delete](/cli/azure/group?#az-group-delete) command to delete the resource group and all its contained resources.

```azurecli
az group delete --resource-group myResourceGroup
```

## Next steps

In this quickstart, you created a Managed CCF resource by using the Azure Python SDK for Confidential Ledger. To learn more about Azure Managed CCF and how to integrate it with your applications, continue on to these articles:

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Azure portal](quickstart-portal.md)
- [Quickstart: Azure CLI](quickstart-cli.md)
- [How to: Activate members](how-to-activate-members.md)
