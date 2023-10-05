Get started with the Phone Numbers client library for Python to look up operator information for phone numbers, which can be used to determine whether and how to communicate with that phone number.  Follow these steps to install the package and look up operator information about a phone number.

> [!NOTE]
> Find the code for this quickstart on [GitHub](https://github.com/Azure/communication-preview/tree/master/samples/NumberLookup).

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

Use a text editor to create a file called number_lookup_sample.py in the project root directory and add the following code. The remaining quickstart code is added in the following sections.

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
pip install azure-communication-phonenumbers==1.2.0b1 
```

## Code examples

### Authenticate the client
The `PhoneNumbersClient` is enabled to use Azure Active Directory Authentication. Using the `DefaultAzureCredential` object is the easiest way to get started with Azure Active Directory and you can install it using the `pip install` command.

```console
pip install azure-identity
```

Creating a `DefaultAzureCredential` object requires you to have `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` already set as environment variables with their corresponding values from your registered Azure AD application.

For a quick ramp-up on how to get these environment variables, you can follow the [Set up service principals from CLI quickstart](../../identity/service-principal-from-cli.md).

Once you have installed the `azure-identity` library, we can continue authenticating the client.

```python
from azure.identity import DefaultAzureCredential

# You can find your endpoint from your resource in the Azure portal
endpoint = 'https://<RESOURCE_NAME>.communication.azure.com'
try:
    print('Azure Communication Services - Number Lookup Quickstart')
    credential = DefaultAzureCredential()
    phone_numbers_client = PhoneNumbersClient(endpoint, credential)
except Exception as ex:
    print('Exception:')
    print(ex)
```

Alternatively, the client can be authenticated using a connection string, also acquired from an Azure Communication Services resource in the [Azure portal](https://portal.azure.com). It's recommended to use a `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable to avoid putting your connection string in plain text within your code. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```python
# This code retrieves your connection string from an environment variable
connection_string = os.getenv('COMMUNICATION_SERVICES_CONNECTION_STRING')
try:
    print('Azure Communication Services - Number Lookup Quickstart')
    phone_numbers_client = PhoneNumbersClient.from_connection_string(connection_string)
except Exception as ex:
    print('Exception:')
    print(ex)
```

### Look up operator information for a number

To search for a phone number's operator information, call `search_operator_information` from the `PhoneNumbersClient`.

```python
results = phone_numbers_client.search_operator_information("<target-phone-number>")
```

Replace `<target-phone-number>` with the phone number you're looking up, usually a number you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123.

### Use operator information

You can now use the operator information.  For this quickstart guide, we can print some of the details to the console.

```python
operator_information = results.values[0]

number_type = operator_information.number_type if operator_information.number_type else "unknown"
if operator_information.operator_details is None or operator_information.operator_details.name is None:
    operator_name = "an unknown operator"
else:
    operator_name = operator_information.operator_details.name

print(str.format("{0} is a {1} number operated by {2}", operator_information.phone_number, number_type, operator_name))
```

You may also use the operator information to determine whether to send an SMS.  For more information on sending an SMS, see the [SMS Quickstart](../../sms/send.md).

## Run the code

Run the application from your terminal or command window with the `python` command.

```console
python number_lookup_sample.py
```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure/communication-preview/tree/master/samples/NumberLookup).