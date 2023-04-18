---
title: include file
description: include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 03/24/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

Get started with Azure Communication Services by using the Communication Services Python Email SDK to send Email messages.

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
            "contentInBase64": "str",  # Base64 encoded contents of the attachment. Required.
            "contentType": "str",  # MIME type of the content being attached. Required.
            "name": "str"  # Name of the attachment. Required.
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
        "NotStarted", "Running", "Succeeded", "Failed", and "Canceled".
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
| Succeeded | The email send operation has completed without error and the email is out for delivery. Any detailed status about the email delivery beyond this stage can be obtained either through Azure Monitor or through Azure Event Grid. [Learn how to subscribe to email events](../handle-email-events.md) |
| Failed | The email send operation wasn't successful and encountered an error. The email wasn't sent. The result contains an error object with more details on the reason for failure or cancellation. |
| Canceled | The email send operation was canceled before it could complete. The email wasn't sent. The result contains an error object with more details on the reason for failure or cancellation.|

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 3.7+.
- An Azure Email Communication Services resource created and ready with a provisioned domain. [Get started with creating an Email Communication Resource](../create-email-communication-resource.md).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Get started by connecting an Email Communication Resource with a Azure Communication Resource](../connect-email-communication-resource.md).

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> We can also send an email from our own verified domain. [Add custom verified domains to Email Communication Service](../add-azure-managed-domains.md).

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

### Option 1: Authenticate using a connection string

Instantiate an **EmailClient** with your connection string. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```python
# Create the EmailClient object that you use to send Email messages.
email_client = EmailClient.from_connection_string(<connection_string>)
```

### Option 2: Authenticate using Azure Active Directory

You can also use Active Directory authentication using [DefaultAzureCredential](../../../concepts/authentication.md).

```python
from azure.communication.email import EmailClient
from azure.identity import DefaultAzureCredential

# To use Azure Active Directory Authentication (DefaultAzureCredential) make sure to have AZURE_TENANT_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET as env variables.
endpoint = "https://<resource-name>.communication.azure.com"
email_client = EmailClient(endpoint, DefaultAzureCredential())
```

### Option 3: Authenticate using AzureKeyCredential

Email clients can also be authenticated using an [AzureKeyCredential](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-core/latest/azure.core.html#azure.core.credentials.AzureKeyCredential). Both the `key` and the `endpoint` can be founded on the "Keys" pane under "Settings" in your Communication Services Resource.

```python
from azure.communication.email import EmailClient
from azure.core.credentials import AzureKeyCredential

key = AzureKeyCredential("<your-key-credential>");
endpoint = "<your-endpoint-uri>";

email_client = EmailClient(endpoint, key);
```

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../quickstarts/identity/service-principal.md).

## Basic email sending 

### Send an email message

To send an email message, you need to:
- Construct the message with the following values:
   - `senderAddress`: A valid sender email address, found in the MailFrom field in the overview pane of the domain linked to your Email Communication Services Resource.
   - `recipients`: An object with a list of email recipients, and optionally, lists of CC & BCC email recipients. 
   - `content`: An object containing the subject, and optionally the plaintext or HTML content, of an email message.
- Call the begin_send method, which returns the result of the operation. 

```python
message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {
                "address": "<emailalias@emaildomain.com>",
                "displayName": "Customer Name"
            }
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
}

poller = email_client.begin_send(message)
print("Result: " + poller.result())

```

Make these replacements in the code:

- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.

### Get the status of the email delivery

We can poll for the status of the email delivery by setting a loop on the operation status object returned from the EmailClient's `begin_send` method:

```python
POLLER_WAIT_TIME = 10

try:
    email_client = EmailClient.from_connection_string(connection_string)

    poller = email_client.begin_send(message);

    time_elapsed = 0
    while not poller.done():
        print("Email send poller status: " + poller.status())

        poller.wait(POLLER_WAIT_TIME)
        time_elapsed += POLLER_WAIT_TIME

        if time_elapsed > 18 * POLLER_WAIT_TIME:
            raise RuntimeError("Polling timed out.")

    if poller.result()["status"] == "Succeeded":
        print(f"Successfully sent the email (operation id: {poller.result()['id']})")
    else:
        raise RuntimeError(str(poller.result()["error"]))

except Exception as ex:
    print(ex)
```

### Run the code

Run the application from your application directory with the `python` command.

```console
python send-email.py
```

If you see that your application is hanging it could be due to email sending being throttled. You can [handle this through logging or by implementing a custom policy](#throw-an-exception-when-email-sending-tier-limit-is-reached).

### Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email)

## Advanced sending

### Send an email message to multiple recipients

We can define multiple recipients by adding more email addresses to the `recipients` object. These addresses can be added as `to`, `cc`, or `bcc` recipient lists accordingly.

```python
message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ],
        "cc": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ],
        "bcc": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
}
```

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email-advanced)


### Send an email message with attachments

We can add an attachment by defining an `attachment` and adding it to the `attachments` of our `message` object. Read the attachment file and encode it using Base64. Decode the bytes as a string and pass it into the `attachment` object.

```python
import base64

with open("<path-to-your-attachment>", "rb") as file:
    file_bytes_b64 = base64.b64encode(file.read())

message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {
                "address": "<recipient1@emaildomain.com>",
                "displayName": "Customer Name"
            }
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
    "attachments": [
        {
            "name": "<your-attachment-name>",
            "contentType": "<your-attachment-mime-type>",
            "contentInBase64": file_bytes_b64.decode()
        }
    ]
}
```

For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email-advanced)

### Throw an exception when email sending tier limit is reached

The Email API has throttling with limitations on the number of email messages that you can send. Email sending has limits applied per minute and per hour as mentioned in [API Throttling and Timeouts](https://learn.microsoft.com/azure/communication-services/concepts/service-limits). When you have reached these limits, additional email sends with `SendAsync` calls will receive an error response of “429: Too Many Requests”. By default, the SDK is configured to retry these requests after waiting a certain period of time. We recommend you [set up logging with the Azure SDK](https://learn.microsoft.com/azure/developer/python/sdk/azure-sdk-logging) to capture these response codes.

Alternatively, you can manually define a custom policy as shown below. This will ensure that 429 response codes throw an exception rather than being retried.

```python
def callback(response):
    if response.http_response.status_code == 429:
        raise Exception(response.http_response)

email_client = EmailClient.from_connection_string(<connection_string>, raw_response_hook=callback)
```
