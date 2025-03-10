---
title: include file
description: Advanced send email Python SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

Get started with Azure Communication Services by using the Communication Services Python Email SDK to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!TIP]
> Jump-start your email sending experience with Azure Communication Services by skipping straight to the [Basic Email Sending](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email) and [Advanced Email Sending](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email-advanced) sample code on GitHub.

## Understanding the email object model

The following JSON message template & response object demonstrate some of the major features of the Azure Communication Services Email SDK for Python.

```python
message = {
    "content": {
        "subject": "str",  # Subject of the email message. Required.
        "html": "str",  # Optional. Html version of the email message.
        "plainText": "str"  # Optional. Plain text version of the email
            message.
    },
    "recipients": {
        "to": [
            {
                "address": "str",  # Email address. Required.
                "displayName": "str"  # Optional. Email display name.
            }
        ],
        "bcc": [
            {
                "address": "str",  # Email address. Required.
                "displayName": "str"  # Optional. Email display name.
            }
        ],
        "cc": [
            {
                "address": "str",  # Email address. Required.
                "displayName": "str"  # Optional. Email display name.
            }
        ]
    },
    "senderAddress": "str",  # Sender email address from a verified domain. Required.
    "attachments": [
        {
            "name": "str"  # Name of the attachment. Required.
            "contentType": "str",  # MIME type of the content being attached. Required.
            "contentInBase64": "str",  # Base64 encoded contents of the attachment. Required.
            "contentId": "str" # Unique identifier (CID) to reference an inline attachment. Optional
        }
    ],
    "userEngagementTrackingDisabled": bool,  # Optional. Indicates whether user engagement tracking should be disabled for this request if the resource-level user engagement tracking setting was already enabled in the control plane.
    "headers": {
        "str": "str"  # Optional. Custom email headers to be passed.
    },
    "replyTo": [
        {
            "address": "str",  # Email address. Required.
            "displayName": "str"  # Optional. Email display name.
        }
    ]
}

response = {
    "id": "str",  # The unique id of the operation. Uses a UUID. Required.
    "status": "str",  # Status of operation. Required. Known values are:
        "NotStarted", "Running", "Succeeded", and "Failed".
    "error": {
        "additionalInfo": [
            {
                "info": {},  # Optional. The additional info.
                "type": "str"  # Optional. The additional info type.
            }
        ],
        "code": "str",  # Optional. The error code.
        "details": [
            ...
        ],
        "message": "str",  # Optional. The error message.
        "target": "str"  # Optional. The error target.
    }
}
```

The `response.status` values are explained further in the following table.

| Status Name | Description |
| ----------- | ------------|
| InProgress | The email send operation is currently in progress and being processed. |
| Succeeded | The email send operation has completed without error and the email is out for delivery. Any detailed status about the email delivery beyond this stage can be obtained either through Azure Monitor or through Azure Event Grid. [Learn how to subscribe to email events](../../handle-email-events.md) |
| Failed | The email send operation wasn't successful and encountered an error. The email wasn't sent. The result contains an error object with more details on the reason for failure. |

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 3.7+.
- An Azure Email Communication Services resource created and ready with a provisioned domain. [Get started with creating an Email Communication Resource](../../create-email-communication-resource.md).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Get started by connecting an Email Communication Resource with a Azure Communication Resource](../../connect-email-communication-resource.md).

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> We can also send an email from our own verified domain. [Add custom verified domains to Email Communication Service](../../add-azure-managed-domains.md).

### Prerequisite check
- In a terminal or command window, run the `python --version` command to check that Python is installed.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/). Locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Set up the application environment

To set up an environment for sending emails, take the steps in the following sections.

### Create a new Python application

1. Open your terminal or command window. Then use the following command to create a virtual environment and activate it. This command creates a new directory for your app.

    ```console
    python -m venv email-quickstart
    ```

1. Navigate to the root directory of the virtual environment and activate it using the following commands.

    ```console
    cd email-quickstart
    .\Scripts\activate
    ```

1. Use a text editor to create a file called **send-email.py** in the project root directory and add the structure for the program, including basic exception handling.

   ```python
   import os
   from azure.communication.email import EmailClient

   try:
       # Quickstart code goes here.
   except Exception as ex:
       print('Exception:')
       print(ex)
   ```

In the following sections, you add all the source code for this quickstart to the **send-email.py** file that you created.

### Install the package

While still in the application directory, install the Azure Communication Services Email SDK for Python package by using the following command.

```console
pip install azure-communication-email
```
## Creating the email client with authentication

There are a few different options available for authenticating an email client:

#### [Connection String](#tab/connection-string)

Instantiate an **EmailClient** with your connection string. Learn how to [manage your resource's connection string](../../../create-communication-resource.md#store-your-connection-string).

```python
# Create the EmailClient object that you use to send Email messages.
email_client = EmailClient.from_connection_string(<connection_string>)
```

<a name='azure-active-directory'></a>

#### [Microsoft Entra ID](#tab/aad)

You can also use Active Directory authentication using [DefaultAzureCredential](../../../../concepts/authentication.md).

```python
from azure.communication.email import EmailClient
from azure.identity import DefaultAzureCredential

# To use Azure Active Directory Authentication (DefaultAzureCredential) make sure to have AZURE_TENANT_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET as env variables.
endpoint = "https://<resource-name>.communication.azure.com"
email_client = EmailClient(endpoint, DefaultAzureCredential())
```

#### [AzureKeyCredential](#tab/azurekeycredential)

Email clients can also be authenticated using an [AzureKeyCredential](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-core/latest/azure.core.html#azure.core.credentials.AzureKeyCredential). Both the `key` and the `endpoint` can be founded on the "Keys" pane under "Settings" in your Communication Services Resource.

```python
from azure.communication.email import EmailClient
from azure.core.credentials import AzureKeyCredential

key = AzureKeyCredential("<your-key-credential>");
endpoint = "<your-endpoint-uri>";

email_client = EmailClient(endpoint, key);
```

---

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../../quickstarts/identity/service-principal.md).
