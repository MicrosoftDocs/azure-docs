> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/use-managed-Identity)

## Setting up

### Create a new Python application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir active-directory-authentication-quickstart && cd active-directory-authentication-quickstart
```

### Install the SDK packages

```console
pip install azure-identity
pip install azure-communication-identity
pip install azure-communication-sms
```

### Create a new file
Open and save a new file within your created folder called `authentication.py`, we'll be placing our code inside this file.

### Use the SDK packages

Add the following `import` statements to the top of your file to use the SDKs that we installed.

```python
from azure.identity import DefaultAzureCredential
from azure.communication.identity import CommunicationIdentityClient
from azure.communication.sms import SmsClient
```

### Create a DefaultAzureCredential

We'll be using the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential). This credential is suitable for production and development environments. As we'll be using it throughout this quickstart we'll create it at the top of the file.

```python
     credential = DefaultAzureCredential()
```

## Create an identity and issue a token with service principals

Now we'll add code which uses the created credential, to issue a VoIP Access Token. We'll call this code later on:

```python
def create_identity_and_get_token(resource_endpoint):
     client = CommunicationIdentityClient(resource_endpoint, credential)
     user, token_response = client.create_user_and_token(scopes=["voip"])

     return token_response
```

### Send an SMS with service principals
As another example of using service principals, we'll add this code which uses the same credential to send an SMS:

```python
def send_sms(resource_endpoint, from_phone_number, to_phone_number, message_content):
     sms_client = SmsClient(resource_endpoint, credential)

     sms_client.send(
          from_=from_phone_number,
          to_=[to_phone_number],
          message=message_content,
          enable_delivery_report=True  # optional property
     )
```

## Write our main code

With our functions created we can now write the main code which will call the functions we've previous written.

```python
# You can find your endpoint and access key from your resource in the Azure portal
# e.g. "https://<RESOURCE_NAME>.communication.azure.com";
endpoint = "https://<RESOURCE_NAME>.communication.azure.com/"

print("Retrieving new Access Token, using Service Principals");
result = create_identity_and_get_token(endpoint);
print(f'Retrieved Access Token: {result.token}');

print("Sending SMS using Service Principals");

# You will need a phone number from your resource to send an SMS.
sms_result = send_sms(endpoint, "<FROM_NUMBER>", "<TO_NUMBER>", "Hello from Service Principals");
print(f'SMS ID: {sms_result[0].message_id}');
print(f'Send Result Successful: {sms_result[0].successful}');
```

The final `authentication.py` file should look something like this:

```python
from azure.identity import DefaultAzureCredential
from azure.communication.identity import CommunicationIdentityClient
from azure.communication.sms import SmsClient

credential = DefaultAzureCredential()

def create_identity_and_get_token(resource_endpoint):
     client = CommunicationIdentityClient(resource_endpoint, credential)
     user, token_response = client.create_user_and_token(scopes=["voip"])

     return token_response

def send_sms(resource_endpoint, from_phone_number, to_phone_number, message_content):
     sms_client = SmsClient(resource_endpoint, credential)

     response = sms_client.send(
          from_=from_phone_number,
          to=[to_phone_number],
          message=message_content,
          enable_delivery_report=True  # optional property
     )
     return response

# You can find your endpoint and access key from your resource in the Azure portal
# e.g. "https://<RESOURCE_NAME>.communication.azure.com";
endpoint = "https://<RESOURCE_NAME>.communication.azure.com/"

print("Retrieving new Access Token, using Service Principals");
result = create_identity_and_get_token(endpoint);
print(f'Retrieved Access Token: {result.token}');

print("Sending SMS using Service Principals");

# You will need a phone number from your resource to send an SMS.
sms_result = send_sms(endpoint, "<FROM_NUMBER>", "<TO_NUMBER>", "Hello from Service Principals");
print(f'SMS ID: {sms_result[0].message_id}');
print(f'Send Result Successful: {sms_result[0].successful}');
```
## Run the program

With everything complete, you can run the file by entering `python authentication.py` from your project's directory. If everything went well you should see something similar to the following.

```Bash
    $ python authentication.py
    Retrieving new Access Token, using Service Principals
    Retrieved Access Token: ey...Q
    Sending SMS using using Service Principals
    SMS ID: Outgoing_2021040602194...._noam
    Send Result Successful: true
```
