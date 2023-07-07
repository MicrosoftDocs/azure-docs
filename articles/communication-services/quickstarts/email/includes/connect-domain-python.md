---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: yogeshmo
ms.date: 05/24/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource ready to provision domains. [Get started creating an Email Communication Resource](../create-email-communication-resource.md).
- An [Azure Managed Domain](../add-azure-managed-domains.md) or [Custom Domain](../add-custom-verified-domains.md) provisioned and ready to send emails. This domain must be fully verified before attempting to link it to the Communication Service resource.
- An Azure Communication Services Resource. [Create a Communication Services Resources.](../../create-communication-resource.md)
- We're using a [service principal for authentication](../../../../active-directory/develop/howto-create-service-principal-portal.md). Set the values of the client ID, tenant ID and client secret of the Azure Active Directory application as the following environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET`.

## Install the required packages

```console
pip install azure-mgmt-communication
pip install azure-identity
```

## Initialize the management client

Replace the field in the sample code with the subscription ID of the subscription your Domain and Email resources are in. Run the code sample to initialize the management client.

```python
from azure.mgmt.communication import CommunicationServiceManagementClient
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
subscription_id = "<your-subscription-id>"

client = CommunicationServiceManagementClient(credential, subscription_id)
```

## Connect an email domain to a Communication Service Resource

Replace the `<resource-group-name>`, `<azure-communication-services-resource-name>`, and `<linked-domain-resource-id>` in the sample code.

The linked domain resource ID should be in the following format. 

```
/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Communication/emailServices/<email-service-name>/domains/<domain-name>
```

If you are using an Azure Managed Domain, the `domain-name` is "AzureManagedDomain". The `email-service-name` should be the same email service that you used to provision the domain.

Once these values are populated, run the sample code.

```python

response = client.communication_services.begin_create_or_update(
    resource_group_name="<resource-group-name>",
    communication_service_name="<azure-communication-services-resource-name>",
    parameters={
        "location": "Global",
        "properties": {
            "dataLocation": "United States",
            "linkedDomains": [
                "<linked-domain-resource-id>"
            ],
        }
    },
).result()
```

## Disconnect an email domain from the Communication Service Resource

Replace the `<resource-group-name>` and `<azure-communication-services-resource-name>` in the sample code. 

Once these values are populated run the sample code.
```python

response = client.communication_services.begin_create_or_update(
    resource_group_name="<resource-group-name>",
    communication_service_name="<azure-communication-services-resource-name>",
    parameters={
        "location": "Global",
        "properties": {
            "dataLocation": "United States"
        }
    },
).result()
```

