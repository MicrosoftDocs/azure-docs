---
title: Quickstart – Microsoft Azure Confidential Ledger Python client library
description: Learn to use the Microsoft Azure Confidential Ledger client library for Python
author: msmbaldwin
ms.author: mbaldwin
ms.date: 04/27/2021
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: "devx-track-python, devx-track-azurepowershell"

---

# Quickstart: Microsoft Azure Confidential Ledger client library for Python

Get started with the Microsoft Azure Confidential Ledger client library for Python. Follow the steps below to install the package and try out example code for basic tasks.

Microsoft Azure Confidential Ledger is a new and highly secure service for managing sensitive data records. Based on a permissioned blockchain model, Confidential Ledger offers unique data integrity advantages, such as immutability (making the ledger append-only) and tamperproofing (to ensure all records are kept intact).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[API reference documentation](/python/api/overview/azure/keyvault-secrets-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/confidentialledger) | [Package (Python Package Index) Management Library](https://pypi.org/project/azure-mgmt-confidentialledger/)| [Package (Python Package Index) Client Library](https://pypi.org/project/azure-confidentialledger/)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python 3.6+](/azure/developer/python/configure-local-development-environment)
- [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-az-ps)

## Set up

This quickstart uses the Azure Identity library, along with Azure CLI or Azure PowerShell, to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls. For more information, see [Authenticate the client with Azure Identity client library](/python/api/overview/azure/identity-readme).

### Sign in to Azure

[!INCLUDE [Sign in to Azure](../../includes/confidential-ledger-sign-in-azure.md)]

### Install the packages

In a terminal or command prompt, create a suitable project folder, and then create and activate a Python virtual environment as described on [Use Python virtual environments](/azure/developer/python/configure-local-development-environment?tabs=cmd#use-python-virtual-environments).

Install the Azure Active Directory identity client library:

```terminal
pip install azure-identity
```

Install the Confidential Ledger control plane client library.

```terminal
pip install azure.mgmt.confidentialledger
```

Install the Confidential Ledger data plane client library.

```terminal
pip install azure.confidentialledger 
```

### Create a resource group

[!INCLUDE [Create a resource group](../../includes/confidential-ledger-rg-create.md)]

### Register the microsoft.ConfidentialLedger resource provider

[!INCLUDE [Register the microsoft.ConfidentialLedger resource provider](../../includes/confidential-ledger-register-rp.md)]

## Create your python app

### Initialization

We can now start writing our python application.  First, we'll import the required packages.

```python
# Import the Azure authentication library

from azure.identity import DefaultAzureCredential

## Import the control plane sdk

from azure.mgmt.confidentialledger import ConfidentialLedger as ConfidentialLedgerAPI
from azure.mgmt.confidentialledger.models import ConfidentialLedger

# import the data plane sdk

from azure.confidentialledger import ConfidentialLedgerClient
from azure.confidentialledger.identity_service import ConfidentialLedgerIdentityServiceClient
```

Next, we'll use the [DefaultAzureCredential Class](/python/api/azure-identity/azure.identity.defaultazurecredential) to authenticate the app.

```python
credential = DefaultAzureCredential()
```

We'll finish setup by setting some variables for use in your application: the resource group (myResourceGroup), the name of ledger you want to create, and two urls to be used by the data plane client library.

  > [!Important]
  > Each ledger must have a globally unique name. Replace <your-unique-keyvault-name> with the name of your ledger in the following example.

```python
resource_group = "myResourceGroup"
ledger_name = "<your-unique-ledger-name>"
subscription_id = "<azure-subscription-id>"

identity_url = "https://identity.confidential-ledger.core.azure.com"
ledger_url = "https://" + ledger_name + ".confidential-ledger.azure.com"
```

### Use the control plane client library

The control plane client library (azure.mgmt.confidentialledger) allows operations on ledgers, such as creation, modification, and deletion, listing the ledgers associated with a subscription, and getting the details of a specific ledger.

In our code, we will first create a control plane client by passing the ConfidentialLedgerAPI the credential variable and your Azure subscription ID (both of which are set above).  

```python
confidential_ledger_mgmt = ConfidentialLedgerAPI(
    credential, subscription_id
)
```

We can now create a ledger using `begin_create`. The `begin_create` function requires three parameters: your resource group, a name for the ledger, and a "properties" object.  

Create a `properties` dictionary with the following keys and values, and assign it to a variable.

```python
properties = {
    "location": "eastus",
    "tags": {},
    "properties": {
        "ledgerType": "Public",
        "aadBasedSecurityPrincipals": [],
    },
}

ledger_properties = ConfidentialLedger(**properties)
```

Now pass the resource group, the name of your ledger, and the properties object to `begin_create`.

```python
confidential_ledger_mgmt.ledger.begin_create(resource_group, ledger_name, ledger_properties)
```

To verify that your ledger was successfully created, view its details using the `get` function.

```python
myledger = confidential_ledger_mgmt.ledger.get(resource_group, ledger_name)

print("Here are the details of your newly created ledger:")
print (f"- Name: {myledger.name}")
print (f"- Location: {myledger.location}")
print (f"- ID: {myledger.id}")

```

### Use the data plane client library

Now that we have a ledger, we'll interact with it using the data plane client library (azure.confidentialledger). 

First, we will generate and save a Confidential Ledger certificate.  

```python
identity_client = ConfidentialLedgerIdentityServiceClient(identity_url)
network_identity = identity_client.get_ledger_identity(
     ledger_id=ledger_name
)

ledger_tls_cert_file_name = "networkcert.pem"
with open(ledger_tls_cert_file_name, "w") as cert_file:
    cert_file.write(network_identity.ledger_tls_certificate)
```

Now we can use the network certificate, along with the ledger URL and our credentials, to create a Confidential Ledger client.

```python
ledger_client = ConfidentialLedgerClient(
     endpoint=ledger_url, 
     credential=credential,
     ledger_certificate_path=ledger_tls_cert_file_name
)
```

We are prepared to write to the ledger.  We will do so using the `append_to_ledger` function.

```python
append_result = ledger_client.append_to_ledger(entry_contents="Hello world!")
print(append_result.transaction_id)
```

The print function will return the transaction ID of your write to the ledger, which can be used to retrieve the message you wrote to the ledger.

```python
entry = ledger_client.get_ledger_entry(transaction_id=append_result.transaction_id)
print(entry.contents)
```

The print function will return "Hello world!", as that is the message in the ledger that that corresponds to the transaction ID.

## Full sample code

```python
from azure.identity import DefaultAzureCredential

## Import control plane sdk

from azure.mgmt.confidentialledger import ConfidentialLedger as ConfidentialLedgerAPI
from azure.mgmt.confidentialledger.models import ConfidentialLedger

# import data plane sdk

from azure.confidentialledger import ConfidentialLedgerClient
from azure.confidentialledger.identity_service import ConfidentialLedgerIdentityServiceClient

# Set variables

rg = "myResourceGroup"
ledger_name = "<unique-ledger-name>"
subscription_id = "<azure-subscription-id>"

identity_url = "https://identity.confidential-ledger.core.azure.com"
ledger_url = "https://" + ledger_name + ".eastus.cloudapp.azure.com"

# Authentication

# Need to do az login to get default credential to work

credential = DefaultAzureCredential()

# Control plane (azure.mgmt.confidentialledger)
# 
# initialize endpoint with credential and subscription

confidential_ledger_mgmt = ConfidentialLedgerAPI(
    credential, "<subscription-id>"
)

# Create properties dictionary for begin_create call 

properties = {
    "location": "eastus",
    "tags": {},
    "properties": {
        "ledgerType": "Public",
        "aadBasedSecurityPrincipals": [],
    },
}

ledger_properties = ConfidentialLedger(**properties)

# Create a ledger

foo = confidential_ledger_mgmt.ledger.begin_create(rg, ledger_name, ledger_properties)

# Get the details of the ledger you just created

print(f"{rg} / {ledger_name}")
 
print("Here are the details of your newly created ledger:")
myledger = confidential_ledger_mgmt.ledger.get(rg, ledger_name)

print (f"- Name: {myledger.name}")
print (f"- Location: {myledger.location}")
print (f"- ID: {myledger.id}")

# Data plane (azure.confidentialledger)
#
# Create a CL client

identity_client = ConfidentialLedgerIdentityServiceClient(identity_url)
network_identity = identity_client.get_ledger_identity(
     ledger_id=ledger_name
)

ledger_tls_cert_file_name = "networkcert.pem"
with open(ledger_tls_cert_file_name, "w") as cert_file:
    cert_file.write(network_identity.ledger_tls_certificate)


ledger_client = ConfidentialLedgerClient(
     endpoint=ledger_url, 
     credential=credential,
     ledger_certificate_path=ledger_tls_cert_file_name
)

# Write to the ledger
append_result = ledger_client.append_to_ledger(entry_contents="Hello world!")
print(append_result.transaction_id)

# Read from the ledger
entry = ledger_client.get_ledger_entry(transaction_id=append_result.transaction_id)
print(entry.contents)
```

## Clean up resources

Other Microsoft Azure Confidential Ledger articles can build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

Otherwise, when you're finished with the resources created in this article, use the Azure CLI [az group delete](/cli/azure/group?#az_group_delete) command to delete the resource group and all its contained resources:

```azurecli
az group delete --resource-group myResourceGroup
```

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)
