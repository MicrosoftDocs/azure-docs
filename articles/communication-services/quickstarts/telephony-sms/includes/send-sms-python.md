---
title: include file
description: include file
services: azure-communication-services
author: danieldoolabh
manager: nimag

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/03/2020
ms.topic: include
ms.custom: include file
ms.author: dadoolab
---

Get started with Azure Communication Services by using the Communication Services Python SMS client library to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

<!--**TODO: update all these reference links as the resources go live**

[API reference documentation](../../../references/overview.md) | [Library source code](#todo-sdk-repo) | [Package (PiPy)](#todo-nuget) | [Samples](#todo-samples)--> 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- [Python](https://www.python.org/downloads/) 2.7, 3.5, or above.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS enabled telephone number. [Get a phone number](../get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run the `python --version` command to check that Python is installed.
- To view the phone numbers associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Communication Services resource and open the **phone numbers** tab from the left navigation pane.

## Setting up

### Create a new Python application

Open your terminal or command window, create a new directory for your app, and navigate to it.

```console
mkdir sms-quickstart && cd sms-quickstart
```

Use a text editor to create a file called **send-sms.py** in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

```python
import os
from azure.communication.sms import PhoneNumber
from azure.communication.sms import SendSmsOptions
from azure.communication.sms import SmsClient

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

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS client library for Python.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| SmsClient | This class is needed for all SMS functionality. You instantiate it with your subscription information, and use it to send SMS messages. |
| SendSmsOptions | This class provides options to configure delivery reporting. If enable_delivery_report is set to True, then an event will be emitted when delivery was successful |

## Authenticate the client

Instantiate an **SmsClient** with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```python
# This code demonstrates how to fetch your connection string
# from an environment variable.
connection_string = os.getenv('COMMUNICATION_SERVICES_CONNECTION_STRING')

# Create the SmsClient object which will be used to send SMS messages
sms_client = SmsClient.from_connection_string(connection_string)
```

## Send an SMS message

Send an SMS message by calling the Send method. Add this code to the end of `try` block in **send-sms.py**:

```python

# calling send() with sms values
sms_response = sms_client.send(
        from_phone_number=PhoneNumber("<leased-phone-number>"),
        to_phone_numbers=[PhoneNumber("<to-phone-number>")],
        message="Hello World via SMS",
        send_sms_options=SendSmsOptions(enable_delivery_report=True)) # optional property

```

You should replace `<leased-phone-number>` with an SMS enabled phone number associated with your communication service and `<to-phone-number>` with the phone number you wish to send a message to. 

The `send_sms_options` parameter is an optional parameter that you can use to configure Delivery Reporting. This is useful for scenarios where you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure Delivery Reporting for your SMS messages.

## Run the code

Run the application from your application directory with the `python` command.

```console
python send-sms.py
```
