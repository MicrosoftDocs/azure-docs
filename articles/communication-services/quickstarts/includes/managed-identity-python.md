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

The examples below are using the [DefaultAzureCredential](/python/api/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

To register application in the development environment and set up environment variables, see [Authorize access with managed identity](../managed-identity-from-cli.md)

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
