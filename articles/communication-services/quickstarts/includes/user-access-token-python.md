---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: tchladek
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 2.7, 3.5, or above.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting Up

### Create a new Python application

1. Open your terminal or command window create a new directory for your app, and navigate to it.

   ```console
   mkdir access-tokens-quickstart && cd access-tokens-quickstart
   ```

1. Use a text editor to create a file called **issue-access-tokens.py** in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

   ```python
   import os
   from azure.communication.administration import CommunicationIdentityClient

   try:
      print('Azure Communication Services - Access Tokens Quickstart')
      # Quickstart code goes here
   except Exception as ex:
      print('Exception:')
      print(ex)
   ```

### Install the package

While still in the application directory, install the Azure Communication Services Administration client library for Python package by using the `pip install` command.

```console
pip install azure-communication-administration
```

## Authenticate the client

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add this code inside the `try` block:

```python
# This code demonstrates how to fetch your connection string
# from an environment variable.
connection_string = os.environ['COMMUNICATION_SERVICES_CONNECTION_STRING']

# Instantiate the identity client
client = CommunicationIdentityClient.from_connection_string(connection_string)
```

## Create an identity

Azure Communication Services maintains a lightweight identity directory. Use the `create_user` method to create a new entry in the directory with a unique `Id`. You should maintain a mapping between your application's users and Communication Services generated identities (e.g. by storing them in your application server's database).

```python
identity = client.create_user()
print("\nCreated an identity with ID: " + identity.identifier + ":")
```

## Issue access tokens

Use the `issue_token` method to issue an access token for a Communication Services identity. Parameter `scopes` defines set of actions, which are authorized to be performed with the access token. See the [list of supported actions](../concepts/authentication.md). New instance of parameter `communicationUser` can be constructed with the identity's ID, which you are suppose to store and map to your application's users.

```python
# Issue an access token with the "voip" scope for an identity
token_result = client.issue_token(user, ["voip"])
expires_on = token_result.expires_on.strftime('%d/%m/%y %I:%M %S %p')
print("\nIssued an access token with 'voip' scope that expires at " + expires_on + ":")
print(token_result.token)
```

Access tokens are short-lived credentials that need to be reissued in order to prevent your application's users from experiencing service disruptions. The `expires_on` response property indicates the lifetime of the access token.

## Refresh access tokens

To refresh an access token, use the `CommunicationUser` object to re-issue:

```python  
# Value existingIdentity represents identity of Azure Communication Services stored during identity creation
identity = CommunicationUser(existingIdentity)
token_result = client.issue_token( identity, ["voip"])
```

## Revoke access tokens

In some cases, you may need to explicitly revoke access tokens, for example, when a application's user changes the password they use to authenticate to your service. Use the `revoke_tokens` method to invalidate all of a access tokens.

```python  
client.revoke_tokens(identity)
print("\nSuccessfully revoked all access tokens for identity with ID: " + identity.identifier)
```

## Delete an identity

Deleting an identity revokes all active access tokens and prevents you from issuing subsequent access tokens for the identity. It also removes all the persisted content associated with the identity.

```python
client.delete_user(identity)
print("\nDeleted the identity with ID: " + identity.identifier)
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-access-token.py* file, then execute the following `python` command to run the app.

```console
python ./issue-access-token.py
```
