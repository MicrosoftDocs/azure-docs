Get started with the Phone Numbers client library for Python to look up operator information for phone numbers. Use the operator information to determine whether and how to communicate with that phone number. Follow these steps to install the package and look up operator information about a phone number.

> [!NOTE]
> To view the source code for this example, see [Manage Phone Numbers - Python | GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/lookup-phone-numbers-quickstart).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 3.7+.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

### Prerequisite check

In a terminal or command window, run the `python --version` command to check that Python is installed.

## Setting up

To set up an environment for sending lookup queries, take the steps in the following sections.

### Create a new Python application

In a terminal or command window, create a new directory for your app and navigate to it.

```console
mkdir number-lookup-quickstart && cd number-lookup-quickstart
```

Use a text editor to create a file called `number_lookup_sample.py` in the project root directory and add the following code. The remaining quickstart code is added in the following sections.

```python
import os
from azure.communication.phonenumbers import PhoneNumbersClient

try:
   print('Azure Communication Services - Number Lookup Quickstart')
   # Quickstart code goes here
except Exception as ex:
   print('Exception:')
   print(ex)
```

### Install the package

While still in the application directory, install the Azure Communication Services PhoneNumbers client library for Python package by using the `pip install` command.

```console
pip install azure-communication-phonenumbers==1.2.0
```

## Code examples

### Authenticate the client

The client can be authenticated using a connection string acquired from an Azure Communication Services resource in the [Azure portal](https://portal.azure.com). Using a `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable is recommended to avoid putting your connection string in plain text within your code. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```python
# This code retrieves your connection string from an environment variable
connection_string = os.getenv('COMMUNICATION_SERVICES_CONNECTION_STRING')
try:
    phone_numbers_client = PhoneNumbersClient.from_connection_string(connection_string)
except Exception as ex:
    print('Exception:')
    print(ex)
```

Alternatively, the client can be authenticated using Microsoft Entra authentication. Using the `DefaultAzureCredential` object is the easiest way to get started with Microsoft Entra ID and you can install it using the `pip install` command.

```console
pip install azure-identity
```

Creating a `DefaultAzureCredential` object requires you to have `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` already set as environment variables with their corresponding values from your registered Microsoft Entra application.

For a ramp-up on how to get these environment variables, you can learn how to [set up service principals from CLI](/cli/azure/authenticate-azure-cli-service-principal).

Once the `azure-identity` library is installed, you can continue authenticating the client.

```python
from azure.identity import DefaultAzureCredential

# You can find your endpoint from your resource in the Azure portal
endpoint = 'https://<RESOURCE_NAME>.communication.azure.com'
try:
    credential = DefaultAzureCredential()
    phone_numbers_client = PhoneNumbersClient(endpoint, credential)
except Exception as ex:
    print('Exception:')
    print(ex)
```

### Look up phone number formatting

To look up the national and international formatting for a number, call `search_operator_information` from the `PhoneNumbersClient`.

```python
formatting_results = phone_numbers_client.search_operator_information("<target-phone-number>")
```

Replace `<target-phone-number>` with the phone number you're looking up, usually a number you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123.

### Look up operator information for a number

To search for a phone number's operator information, call `search_operator_information` from the `PhoneNumbersClient`, passing `True` for the `include_additional_operator_details` option.

```python
options = { "include_additional_operator_details": True }
operator_results = phone_numbers_client.search_operator_information("<target-phone-number>", options=options)
```

> [!WARNING]
> Using this function incurs a charge to your account.

### Use operator information

You can now use the operator information. For this quickstart guide, we can print some of the details to the console.

First, we can print details about the number format.

```python
formatting_info = formatting_results.values[0]
print(str.format("{0} is formatted {1} internationally, and {2} nationally", formatting_info.phone_number, formatting_info.international_format, formatting_info.national_format))
```

Next, we can print details about the phone number and operator.

```python
operator_information = operator_results.values[0]

number_type = operator_information.number_type if operator_information.number_type else "unknown"
if operator_information.operator_details is None or operator_information.operator_details.name is None:
    operator_name = "an unknown operator"
else:
    operator_name = operator_information.operator_details.name

print(str.format("{0} is a {1} number, operated in {2} by {3}", operator_information.phone_number, number_type, operator_information.iso_country_code, operator_name))
```

You can also use the operator information to determine whether to send an SMS. For more information about sending an SMS, see [Send an SMS message](../../sms/send.md).

## Run the code

Run the application from your terminal or command window with the `python` command.

```console
python number_lookup_sample.py
```

## Sample code

You can download the sample app from [Manage Phone Numbers - Python | GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/lookup-phone-numbers-quickstart).
