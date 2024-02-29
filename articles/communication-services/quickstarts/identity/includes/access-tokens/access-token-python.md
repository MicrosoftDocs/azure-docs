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
- [Python](https://www.python.org/downloads/) 3.7+.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../../create-communication-resource.md).

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
   from datetime import timedelta
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

For more information, see the "Store your connection string" section of [Create and manage Communication Services resources](../../../create-communication-resource.md#store-your-connection-string).

```python
# This code demonstrates how to retrieve your connection string
# from an environment variable.
connection_string = os.environ["COMMUNICATION_SERVICES_CONNECTION_STRING"]

# Instantiate the identity client
client = CommunicationIdentityClient.from_connection_string(connection_string)
```

Alternatively, if you've already set up a Microsoft Entra application, you can [authenticate by using Microsoft Entra ID](../../../identity/service-principal.md).

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

## Issue an access token

Use the `get_token` method to issue an access token for your Communication Services identity. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Identity model](../../../../concepts/identity-model.md#access-tokens). You can also construct a new instance of parameter `CommunicationUserIdentifier` based on a string representation of the Azure Communication Service identity.

```python
# Issue an access token with a validity of 24 hours and the "voip" scope for an identity
token_result = client.get_token(identity, ["voip"])
print("\nIssued an access token with 'voip' scope that expires at " + token_result.expires_on + ":")
print(token_result.token)
```

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expires_on` response property indicates the lifetime of the access token.

## Set a custom token expiration time

The default token expiration time is 24 hours, but you can configure it by providing a value between an hour and 24 hours to the optional parameter `token_expires_in`. When requesting a new token, it's recommended that you specify the expected typical length of a communication session for the token expiration time.

```python
# Issue an access token with a validity of an hour and the "voip" scope for an identity
token_expires_in = timedelta(hours=1)
token_result = client.get_token(identity, ["voip"], token_expires_in=token_expires_in)

```

## Create an identity and issue an access token in the same request

You can use the `create_user_and_token` method to create a Communication Services identity and issue an access token for it at the same time. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../../concepts/authentication.md).

```python
# Issue an identity and an access token with a validity of 24 hours and the "voip" scope for the new identity
identity_token_result = client.create_user_and_token(["voip"])

# Get the token details from the response
identity = identity_token_result[0]
token = identity_token_result[1].token
expires_on = identity_token_result[1].expires_on
print("\nCreated an identity with ID: " + identity.properties['id'])
print("\nIssued an access token with 'voip' scope that expires at " + expires_on + ":")
print(token)
```

## Refresh an access token

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

The app's output describes each completed action:

<!---cSpell:disable --->
```console
Azure Communication Services - Access Tokens Quickstart

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Issued an access token with 'voip' scope that expires at 2022-10-11T07:34:29.9028648+00:00:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMF8wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjUzODcyNjkiLCJleHAiOjE2NjUzOTA4NjksImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjY1Mzg3MjY5fQ.kTXpQQtY7w6O82kByljZXrKtBvNNOleDE5m06LapzLeoWfRZCCpJQcDzBoLRA146mOhNzLZ0b5WMNTa5tD-0hWCiicDwgKLMASEGY9g0EvNQOidPff47g2hh6yqi9PKiDPp-t5siBMYqA6Nh6CQ-Oeh-35vcRW09VfcqFN38IgSSzJ7QkqBiY_QtfXz-iaj81Td0287KO4U1y2LJIGiyJLWC567F7A_p1sl6NmPKUmvmwM47tyCcQ1r_lfkRdeyDmcrGgY6yyI3XJZQbpxyt2DZqOTSVPB4PuRl7iyXxvppEa4Uo_y_BdMOOWFe6YTRB5O5lhI8m7Tf0LifisxX2sw

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-1ce9-31b4-54b7-a43a0d006a52

Issued an access token with 'voip' scope that expires at 2022-10-11T07:34:29.9028648+00:00:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMF8wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjUzODcyNjkiLCJleHAiOjE2NjUzOTA4NjksImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjY1Mzg3MjY5fQ.kTXpQQtY7w6O82kByljZXrKtBvNNOleDE5m06LapzLeoWfRZCCpJQcDzBoLRA146mOhNzLZ0b5WMNTa5tD-0hWCiicDwgKLMASEGY9g0EvNQOidPff47g2hh6yqi9PKiDPp-t5siBMYqA6Nh6CQ-Oeh-35vcRW09VfcqFN38IgSSzJ7QkqBiY_QtfXz-iaj81Td0287KO4U1y2LJIGiyJLWC567F7A_p1sl6NmPKUmvmwM47tyCcQ1r_lfkRdeyDmcrGgY6yyI3XJZQbpxyt2DZqOTSVPB4PuRl7iyXxvppEa4Uo_y_BdMOOWFe6YTRB5O5lhI8m7Tf0LifisxX2sw

Successfully revoked all access tokens for identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Deleted the identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502
```
<!---cSpell:enable --->
