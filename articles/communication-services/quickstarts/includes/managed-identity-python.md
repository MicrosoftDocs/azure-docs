## Add managed identity to your Communication Services solution

### Install the client library packages

```console
pip install azure-identity
pip install azure-communication-identity
pip install azure-communication-sms
```

### Use the client library packages

Add the following `import` to your code to use the Azure Identity.

```python
from azure.identity import DefaultAzureCredential
```

The examples below are using the [DefaultAzureCredential](/python/api/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

To register application in the development environment and set up environment variables, see [Authorize access with managed identity](../managed-identity-from-cli.md)

### Create an identity and issue a token

The following code example shows how to create a service client object with Azure Active Directory tokens, then use the client to issue a token for a new user:

```python
import azure.communication.identity 

def create_identity_and_get_token(resource_endpoint):
     credential = DefaultAzureCredential()
     client = CommunicationIdentityClient(endpoint, credential)

     user = client.create_user()
     token_response = client.get_token(user, scopes=["voip"])
     
     return token_response
```

### Send an SMS with Azure Active Directory tokens

The following code example shows how to create a service client object with Azure Active Directory tokens, then use the client to send an SMS message:

```python
from azure.communication.sms import (
    PhoneNumberIdentifier,
    SendSmsOptions,
    SmsClient
)

def send_sms(resource_endpoint, from_phone_number, to_phone_number, message_content):
     credential = DefaultAzureCredential()
     sms_client = SmsClient(resource_endpoint, credential)

     sms_client.send(
          from_phone_number=PhoneNumberIdentitifier(from_phone_number),
          to_phone_numbers=[PhoneNumberIdentifier(to_phone_number)],
          message=message_content,
          send_sms_options=SendSmsOptions(enable_delivery_report=True))  # optional property
     )
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about authentication](../../concepts/authentication.md)

You may also want to:

- [Learn more about Azure role-based access control](../../../../articles/role-based-access-control/index.yml)
- [Learn more about Azure identity library for Python](/net/api/overview/azure/identity-readme)
- [Creating user access tokens](../../quickstarts/access-tokens.md)
- [Send an SMS message](../../quickstarts/telephony-sms/send.md)
- [Learn more about SMS](../../concepts/telephony-sms/concepts.md)