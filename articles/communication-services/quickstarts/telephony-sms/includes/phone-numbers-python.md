## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 2.7, 3.5, or above.
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

## Setting up

### Create a new Python application

Open your terminal or command window and create a new directory for your app, then navigate to it.

```console
mkdir phone-numbers-quickstart && cd phone-numbers-quickstart
```

Use a text editor to create a file called phone_numbers_sample.py in the project root directory and add the the following code. We'll be adding the remaining quickstart code in the following sections.

```python
import os
from azure.communication.phonenumbers import PhoneNumbersClient

try:
   print('Azure Communication Services - Phone Numbers Quickstart')
   # Quickstart code goes here
except Exception as ex:
   print('Exception:')
   print(ex)
```

### Install the package

While still in the application directory, install the Azure Communication Services Administration client library for Python package by using the `pip install` command.

```console
pip install azure-communication-phone-numbers
```

## Authenticate the Phone Numbers Client

The `PhoneNumbersClient` is enabled to use Azure Active Directory Authentication. Using the `DefaultAzureCredential` object is the easiest way to get started with AAD and you can install it using the `pip install` command. 

```console
pip install azure-identity
```

Creating a `DefaultAzureCredential` object requires you to have `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` as environment variables with their corresponding values from your registered AAD application.

Once you have installed the `azure-identity` library, we can continue authenticating the client.

```python
import os
from azure.communication.phonenumbers import PhoneNumbersClient
from azure.identity import DefaultAzureCredential

# You can find your endpoint from your resource in the Azure Portal
endpoint = 'https://<RESOURCE_NAME>.communication.azure.com'
try:
    print('Azure Communication Services - Phone Numbers Quickstart')
    credential = DefaultAzureCredential()
    phone_numbers_client = PhoneNumbersClient(endpoint, credential)
except Exception as ex:
    print('Exception:')
    print(ex)
```

Alternatively, using the endpoint and access key from the communication resource to authenticate is also posible.

```python
import os
from azure.communication.phonenumbers import PhoneNumbersClient

# You can find your connection string from your resource in the Azure Portal
connection_string = 'https://<RESOURCE_NAME>.communication.azure.com/;accesskey=<YOUR_ACCESS_KEY>'
try:
    print('Azure Communication Services - Phone Numbers Quickstart')
    credential = DefaultAzureCredential()
    phone_numbers_client = PhoneNumbersClient.from_connection_string(connection_string)
except Exception as ex:
    print('Exception:')
    print(ex)
```

## Functions

Once your `PhoneNumbersClient` has been authenticated, we can start working on the different functions it can do.

### Search for Available Phone Numbers

In order to purchase phone numbers, you must first search for available phone numbers. To search for phone numbers, provide the area code, assignment type, [phone number capabilities](../../../concepts/telephony-sms/plan-solution.md#phone-number-capabilities-in-azure-communication-services), [phone number type](../../../concepts/telephony-sms/plan-solution.md#phone-number-types-in-azure-communication-services), and quantity. Note that for the toll-free phone number type, providing the area code is optional.

```python
import os
from azure.communication.phonenumbers import PhoneNumbersClient, PhoneNumberCapabilityValue, PhoneNumberAssignmentType, PhoneNumberType, PhoneNumberCapabilities
from azure.identity import DefaultAzureCredential

# You can find your endpoint from your resource in the Azure Portal
endpoint = 'https://<RESOURCE_NAME>.communication.azure.com'
try:
    print('Azure Communication Services - Phone Numbers Quickstart')
    credential = DefaultAzureCredential()
    phone_numbers_client = PhoneNumbersClient(endpoint, credential)
    capabilities = PhoneNumberCapabilities(
        calling = PhoneNumberCapabilityValue.INBOUND,
        sms = PhoneNumberCapabilityValue.INBOUND_OUTBOUND
    )
    search_poller = self.phone_number_client.begin_search_available_phone_numbers(
        "US",
        PhoneNumberType.TOLL_FREE,
        PhoneNumberAssignmentType.APPLICATION,
        capabilities,
        area_code="833",
        polling = True
    )
    search_result = search_poller.result()
    print("The phone numbers you reserved were:")
    print(search_result.phone_numbers)
except Exception as ex:
    print('Exception:')
    print(ex)
```

### Purchase Phone Numbers

The result of searching for phone numbers is a `PhoneNumberSearchResult`. This contains a `searchId` which can be passed to the purchase numbers API to acquire the numbers in the search. Note that calling the purchase phone numbers API will result in a charge to your Azure Account.

```python
import os
from azure.communication.phonenumbers import (
    PhoneNumbersClient, 
    PhoneNumberCapabilityValue, 
    PhoneNumberAssignmentType, 
    PhoneNumberType, 
    PhoneNumberCapabilities
)
from azure.identity import DefaultAzureCredential

# You can find your endpoint from your resource in the Azure Portal
endpoint = 'https://<RESOURCE_NAME>.communication.azure.com'
try:
    print('Azure Communication Services - Phone Numbers Quickstart')
    credential = DefaultAzureCredential()
    phone_numbers_client = PhoneNumbersClient(endpoint, credential)
    capabilities = PhoneNumberCapabilities(
        calling = PhoneNumberCapabilityValue.INBOUND,
        sms = PhoneNumberCapabilityValue.INBOUND_OUTBOUND
    )
    search_poller = phone_numbers_client.begin_search_available_phone_numbers(
        "US",
        PhoneNumberType.TOLL_FREE,
        PhoneNumberAssignmentType.APPLICATION,
        capabilities,
        area_code="833",
        polling = True
    )
    search_result = search_poller.result()
    print("The phone numbers you reserved were:")
    print(search_result.phone_numbers)
    purchase_poller = phone_numbers_client.begin_purchase_phone_numbers(search_result.search_id, polling = True)
    purchase_result = purchase_poller.result()
    print("The status of the purchase operation was: " + purchase_poller.status())
except Exception as ex:
    print('Exception:')
    print(ex)
```

### Get phone number(s)

After a purchasing number, you can retrieve it from the client. 

```python
phone_number_information = phone_numbers_client.get_phone_number("+18001234567")
print("Phone number's country code: " + phone_number_information.country_code)
```

You can also retrieve all the acquired phone numbers.

```python
acquired_phone_numbers = phone_numbers_client.list_acquired_phone_numbers()
print('Acquired phone numbers:')
for acquired_phone_number in acquired_phone_numbers:
    print(acquired_phone_number.phone_number)
```

### Update Phone Number Capabilities

You can update the capabilities of a previously acquired phone number.
```python
update_poller = phone_numbers_client.begin_update_phone_number_capabilities(
    "+18001234567",
    PhoneNumberCapabilityValue.OUTBOUND,
    PhoneNumberCapabilityValue.OUTBOUND,
    polling = True
)
update_poller.result()
print('Status of the operation: ' + update_poller.status())
```

### Release Phone Number

You can release a purchased phone number.

```python
release_poller = phone_numbers_client.begin_release_phone_number(phone_number_to_release)
release_poller.result()
print('Status of the operation: ' + release_poller.status())
```

## Run the code

From a console prompt, navigate to the directory containing the phone_numbers_sample.py file, then execute the following python command to run the app.

```console
./phone_numbers_sample.py
```