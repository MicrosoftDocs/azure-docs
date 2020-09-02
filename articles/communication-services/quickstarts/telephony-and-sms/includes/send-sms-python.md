---
title: include file
description: include file
services: azure-communication-services
author: Daniel Doolabh
manager: nimag
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: dadoolab
---

Get started with Azure Communication Services by using the Communication Services C# SMS client library to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

<!--**TODO: update all these reference links as the resources go live**

[API reference documentation](../../../references/overview.md) | [Library source code](#todo-sdk-repo) | [Package (PiPy)](#todo-nuget) | [Samples](#todo-samples)--> 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- [Python](https://www.python.org/downloads/) 2.7, 3.5, or above.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-a-communication-resource.md).
- An SMS enabled telephone number. [Get a phone number](../get-a-phone-number.md).

### Prerequisite check

- In a terminal or command window, run the `python --version` command to check that Python is installed.
- To view the phone numbers associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Communication Services resource and open the **phone numbers** tab from the left navigation pane.

## Setting Up

### Create a new Python application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir sms-quickstart && cd sms-quickstart
```

Use a text editor to create a file called **send-sms.py** in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

```python
import os
from azure.communication.sms import SmsClient
from azure.communication.sms.models import SendSmsOptions
from azure.communication.sms.models import SendMessageRequest

try:
    # Quickstart code goes here
except Exception as ex:
    print('Exception:')
    print(ex)
```

### Install the package

While still in the application directory, install the Azure Communication Services SMS client library for Python package by using the `pip install` command.

```console
pip install azure-communication-sms
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS SDK for Python.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| [SmsClient](../../../references/overview.md) | This class is needed for all SMS functionality. You instantiate it with your subscription information, and use it to send SMS messages. |
| [SendSmsOptions](../../../references/overview.md) | This class provides options to configure delivery reporting. If enable_delivery_report is set to True, then an event will be emitted when delivery was successful |
| [SendMessageRequest](../../../references/overview.md) | This class is the model for building the sms request (eg. configure the to and from phone numbers and the sms content) |

## Authenticate the client

Instantiate an **SmsClient** with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../../create-a-communication-resource.md#store-your-connection-string).

```python
# This code demonstrates how to fetch your connection string
# from an environment variable.
connect_str = os.getenv('COMMUNICATION_SERVICES_CONNECTION_STRING')

# Create the SmsClient object which will be used to send SMS messages
sms_client = SmsClient.from_connection_string(connection_string)
```

## Send an SMS message

Send an SMS message by calling the [Send](../../../references/overview.md) method. Add this code to the end of `try` block in **send-sms.py**:

```python

# optional parameter to configure the delivery options
options = SendSmsOptions(enable_delivery_report=True)

# SendMessageRequest object constructed
request = SendMessageRequest(
    from_property="<leased-phone-number>", 
    to=["<to-phone-number>"], 
    message="Hello World via SMS", 
    send_sms_options=options)

# calling send() with constructed request object
smsresponse = sms_client.sms.send(request)

```

You should replace `<leased-phone-number>` with an SMS enabled phone number associated with your communication service and `<to-phone-number>` with the phone number you wish to send a message to. All phone number parameters should adhere to the [E.164 standard](../../../concepts/telephony-and-sms/plan-your-telephony-and-sms-solution.md#optional-reading-international-public-telecommunication-numbering-plan-e164).

The `send_sms_options` parameter is an optional parameter that you can use to configure Delivery Reporting. This is useful for scenarios where you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure Delivery Reporting for your SMS messages.

## Run the code

Run the application from your application directory with the `python` command.

```console
python send-sms.py
```
