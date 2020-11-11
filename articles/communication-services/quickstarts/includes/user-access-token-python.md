---
title: include file
description: include file
services: azure-communication-services
author: matthewrobertson
manager: nimag
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: marobert
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 2.7, 3.5, or above.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting Up

### Create a new Python application

1. Open your terminal or command window create a new directory for your app, and navigate to it.

   ```console
   mkdir user-tokens-quickstart && cd user-tokens-quickstart
   ```

1. Use a text editor to create a file called **issue-tokens.py** in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

   ```python
   import os
   from azure.communication.administration import CommunicationIdentityClient

   try:
      print('Azure Communication Services - User Access Tokens Quickstart')
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

[!INCLUDE [User Access Tokens Object Model](user-access-tokens-object-model.md)]

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

## Create a user

Azure Communication Services maintains a lightweight identity directory. Use the `create_user` method to create a new entry in the directory with a unique `Id`. You should maintain a mapping between your application's users and Communication Services generated identities (e.g. by storing them in your application server's database).

```python
user = client.create_user()
print("\nCreated a user with ID: " + user.identifier + ":")
```

## Issue user access tokens

Use the `issue_token` method to issue an access token for a Communication Services user. If you do not provide the optional `user` parameter a new user will be created and returned with the token.

```python
# Issue an access token with the "voip" scope for a new user
token_result = client.issue_token(user, ["voip"])
expires_on = token_result.expires_on.strftime('%d/%m/%y %I:%M %S %p')
print("\nIssued a token with 'voip' scope that expires at " + expires_on + ":")
print(token_result.token)
```

User access tokens are short-lived credentials that need to be reissued in order to prevent your users from experiencing service disruptions. The `expires_on` response property indicates the lifetime of the token.

## Revoke user access tokens

In some cases, you may need to explicitly revoke user access tokens, for example, when a user changes the password they use to authenticate to your service. This functionality is available via the Azure Communication Services Administration client library.

```python  
client.revoke_tokens(user)
print("\nSuccessfully revoked all tokens for user with ID: " + user.identifier)
```

## Delete a user

Deleting an identity revokes all active tokens and prevents you from issuing subsequent tokens for the identities. It also removes all the persisted content associated with the user.

```python
client.delete_user(user)
print("\nDeleted the user with ID: " + user.identifier)
```

## Run the code

From a console prompt, navigate to the directory containing the *issue-token.py* file, then execute the following `python` command to run the app.

```console
python ./issue-token.py
```
