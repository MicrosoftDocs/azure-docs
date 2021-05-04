## Add managed identity to your Communication Services solution

### Install the SDK packages

```console
pip install azure-identity
pip install azure-communication-identity
pip install azure-communication-sms
```

### Use the SDK packages

Add the following `import` to your code to use the Azure Identity.

```python
from azure.identity import DefaultAzureCredential
```

The examples below are using the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

For an easy way to jump into using managed identity authentication, see [Authorize access with managed identity](../managed-identity-from-cli.md)

For a more in-depth look on how the DefaultAzureCredential object works and how you can use it in ways that are not specified in this quickstart, see 
[Azure Identity client library for Python](/python/api/overview/azure/identity-readme)

### Create an identity and issue a token

The following code example shows how to create a service client object with managed identity, then use the client to issue a token for a new user:

```python
from azure.communication.identity import CommunicationIdentityClient

def create_identity_and_get_token(resource_endpoint):
     credential = DefaultAzureCredential()
     client = CommunicationIdentityClient(resource_endpoint, credential)

     user = client.create_user()
     token_response = client.get_token(user, scopes=["voip"])

     return token_response
```

### Send an SMS with Azure managed identity
The following code example shows how to create a service client object with Azure managed identity, then use the client to send an SMS message:

```python
from azure.communication.sms import SmsClient

def send_sms(resource_endpoint, from_phone_number, to_phone_number, message_content):
     credential = DefaultAzureCredential()
     sms_client = SmsClient(resource_endpoint, credential)

     sms_client.send(
          from_=from_phone_number,
          to_=[to_phone_number],
          message=message_content,
          enable_delivery_report=True  # optional property
     )
```

### List all your purchased phone numbers

The following code example shows how to create a service client object with Azure managed identity, then use the client to see all of the purchased phone numbers
the resource has:

```python
from azure.communication.phonenumbers import PhoneNumbersClient

def list_purchased_phone_numbers(resource_endpoint):
     credential = DefaultAzureCredential()
     phone_numbers_client = PhoneNumbersClient(resource_endpoint, credential)

     return phone_numbers_client.list_purchased_phone_numbers()
```