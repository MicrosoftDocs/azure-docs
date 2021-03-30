## Add managed identity to your Communication Services solution

### Install the SDK packages

```console
pip install azure-identity
pip install azure-communication-identity
```

### Use the SDK packages

Add the following `import` to your code to use the Azure Identity.

```python
from azure.identity import DefaultAzureCredential
```

The examples below are using the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

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