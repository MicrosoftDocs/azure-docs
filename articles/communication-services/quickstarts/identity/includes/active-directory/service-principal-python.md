> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/use-managed-Identity)

## Setting up

### Create a new Python application

Let us set up your working directory for the application. For that, open your terminal or command window, create a new directory, and navigate to it:

```console
mkdir active-directory-authentication-quickstart && cd active-directory-authentication-quickstart
```

### Install the SDK packages

Next we need to install the required Azure SDK packages. Run these commands:

```console
pip install azure-identity
pip install azure-communication-identity
pip install azure-communication-sms
```

### Create a new file
Now we need a Python file to hold your code. Open and save a new file called `authentication.py` within your directory.

### Use the SDK packages

Our next goal is to import the necessary Azure SDK modules to work with identity and SMS. Add the following statements at the top of your file:

```python
from azure.identity import DefaultAzureCredential
from azure.communication.identity import CommunicationIdentityClient
from azure.communication.sms import SmsClient
```

### Create a DefaultAzureCredential

We need to initialize a credential for both production and development environments.

Place this line with [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) after previously inserted lines:

```python
     credential = DefaultAzureCredential()
```

## Create an identity and issue a token with service principals

Create an identity and request a Voice over Internet Protocol (VoIP) access token:

```python
def create_identity_and_get_token(resource_endpoint):
     client = CommunicationIdentityClient(resource_endpoint, credential)
     user, token_response = client.create_user_and_token(scopes=["voip"])

     return token_response
```

### Send an SMS with service principals

Alternetively, you can utilize your credential to send a Short Message Service (SMS) as shown in the example below:

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

Now we have all the necessary code blocks to execute the functions to create an identity, obtain an access token, and send an SMS.

Include the main code that calls your functions:

```python
# Retrieve your endpoint and access key from your resource in the Azure portal
# For example: "https://<RESOURCE_NAME>.communication.azure.com"
endpoint = "https://<RESOURCE_NAME>.communication.azure.com/"

print("Retrieving new Access Token, using Service Principals");
result = create_identity_and_get_token(endpoint);
print(f'Retrieved Access Token: {result.token}');

print("Sending SMS using Service Principals");

# Provide a valid phone number from your Azure resource to send an SMS.
sms_result = send_sms(endpoint, "<FROM_NUMBER>", "<TO_NUMBER>", "Hello from Service Principals");
print(f'SMS ID: {sms_result[0].message_id}');
print(f'Send Result Successful: {sms_result[0].successful}');
```

This is how the `authentication.py` looks after all changes you made:

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

It is time to execute your Python script to verify functionality. Run the file from your project's directory with the command:
```console
python authentication.py
``` 
If successful, you see output similar to this:
```Bash
    $ python authentication.py
    Retrieving new Access Token, using Service Principals
    Retrieved Access Token: ...
    Sending SMS using using Service Principals
    SMS ID: ...
    Send Result Successful: true
```