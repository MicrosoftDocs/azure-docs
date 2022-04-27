---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 11/17/2021
ms.topic: include
ms.custom: include file
ms.author: tchladek
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 2.7 or 3.6 or later.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

## Final code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/access-tokens-quickstart).

## Set up your environment

### Create a new Python application

1. In a terminal or Command Prompt window, create a new directory for your app, and then open it.

   ```console
   mkdir access-tokens-quickstart && cd access-tokens-quickstart
   ```

1. Use a text editor to create a file called *issue-access-tokens.py* in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the sections that follow.

   ```python
   import os
   from azure.communication.identity import CommunicationIdentityClient, CommunicationUserIdentifier

   try:
      print("Azure Communication Services - Access Tokens Quickstart")
      # Quickstart code goes here
   except Exception as ex:
      print("Exception:")
      print(ex)
   ```

### Install the package

While you're still in the application directory, install the Azure Communication Services Identity SDK for Python package by using the `pip install` command.

```console
pip install azure-communication-identity
```

## Authenticate the client

Instantiate a `CommunicationIdentityClient` with your connection string. The following code, which you add to the `try` block, retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. 

For more information, see the "Store your connection string" section of [Create and manage Communication Services resources](../../create-communication-resource.md#store-your-connection-string).

```python
# This code demonstrates how to retrieve your connection string
# from an environment variable.
connection_string = os.environ["COMMUNICATION_SERVICES_CONNECTION_STRING"]

# Instantiate the identity client
client = CommunicationIdentityClient.from_connection_string(connection_string)
```

Alternatively, if you've already set up an Azure Active Directory (Azure AD) application, you can [authenticate by using Azure AD](../../identity/service-principal.md).

```python
endpoint = os.environ["COMMUNICATION_SERVICES_ENDPOINT"]
client = CommunicationIdentityClient(endpoint, DefaultAzureCredential())
```

## Create an identity

To create access tokens, you need an identity. Azure Communication Services maintains a lightweight identity directory for this purpose. Use the `create_user` method to create a new entry in the directory with a unique `Id`. The identity is required later for issuing access tokens.

```python
identity = client.create_user()
print("\nCreated an identity with ID: " + identity.properties['id'])
```

Store the received identity with mapping to your application's users (for example, by storing it in your application server database).

## Issue access tokens

Use the `get_token` method to issue an access token for your Communication Services identity. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../concepts/authentication.md). You can also construct a new instance of parameter `CommunicationUserIdentifier` based on a string representation of the Azure Communication Service identity.

```python
# Issue an access token with the "voip" scope for an identity
token_result = client.get_token(identity, ["voip"])
expires_on = token_result.expires_on.strftime("%d/%m/%y %I:%M %S %p")

# Print the details to the screen
print("\nIssued an access token with 'voip' scope that expires at " + expires_on + ":")
print(token_result.token)
```

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expires_on` response property indicates the lifetime of the access token.

## Create an identity and issue an access token in the same request

You can use the `create_user_and_token` method to create a Communication Services identity and issue an access token for it at the same time. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../concepts/authentication.md).

```python
# Issue an identity and an access token with the "voip" scope for the new identity
identity_token_result = client.create_user_and_token(["voip"])

# Get the token details from the response
identity = identity_token_result[0]
token = identity_token_result[1].token
expires_on = identity_token_result[1].expires_on.strftime("%d/%m/%y %I:%M %S %p")

# Print the details to the screen
print("\nCreated an identity with ID: " + identity.properties['id'])
print("\nIssued an access token with 'voip' scope that expires at " + expires_on + ":")
print(token)
```

## Refresh access tokens

To refresh an access token, use the `CommunicationUserIdentifier` object to reissue a token by passing in the existing identity:

```python
# The existingIdentity value represents the Communication Services identity that's stored during identity creation
identity = CommunicationUserIdentifier(existingIdentity)
token_result = client.get_token(identity, ["voip"])
```

## Revoke access tokens

You might occasionally need to explicitly revoke an access token. For example, you would do so when application users change the password they use to authenticate to your service. The `revoke_tokens` method invalidates all active access tokens that were issued to the identity.

```python
client.revoke_tokens(identity)
print("\nSuccessfully revoked all access tokens for identity with ID: " + identity.properties['id'])
```

## Delete an identity

When you delete an identity, you revoke all active access tokens and prevent the further issuance of access tokens for the identity. Doing so also removes all persisted content that's associated with the identity.

```python
client.delete_user(identity)
print("\nDeleted the identity with ID: " + identity.properties['id'])
```

## Run the code

From a console prompt, go to the directory that contains the *issue-access-tokens.py* file, and then execute the following `python` command to run the app.

```console
python ./issue-access-tokens.py
```
