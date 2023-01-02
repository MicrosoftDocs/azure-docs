---
title: include file
description: include file
services: azure-communication-services
author: gistefan
manager: soricos

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 10/08/2021
ms.topic: include
ms.custom: include file
ms.author: gistefan
---

## Set up prerequisites

- [Python](https://www.python.org/downloads/) 3.7+.

## Final code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/manage-teams-identity-mobile-and-desktop).

## Set up

### Create a new Python application

1. Open your terminal or command window create a new directory for your app, and navigate to it.

   ```console
   mkdir communication-access-tokens-quickstart && cd communication-access-tokens-quickstart
   ```

1. Use a text editor to create a file called `exchange-communication-access-tokens.py` in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

   ```python
   import os
   from azure.communication.identity import CommunicationIdentityClient, CommunicationUserIdentifier
   from msal.application import PublicClientApplication

   try:
      print("Azure Communication Services - Access Tokens Quickstart")
      # Quickstart code goes here
   except Exception as ex:
      print(f"Exception: {ex}")
   ```

### Install the package

While still in the application directory, install the Azure Communication Services Identity SDK for Python package by using the `pip install` command.

```console
pip install azure-communication-identity
pip install msal
```

### Step 1: Receive the Azure AD user token and object ID via the MSAL library

The first step in the token exchange flow is getting a token for your Teams user by using [Microsoft.Identity.Client](../../../active-directory/develop/reference-v2-libraries.md). In Azure portal, configure the Redirect URI of your "Mobile and Desktop application" as `http://localhost`. The code below retrieves Azure AD client ID and tenant ID from environment variables named `AAD_CLIENT_ID` and `AAD_TENANT_ID`. It's essential to configure the MSAL client with the correct authority, based on the `AAD_TENANT_ID` environment variable, to be able to retrieve the Object ID (`oid`) claim corresponding with a user in Fabrikam's tenant and initialize the `user_object_id` variable.

```python
# This code demonstrates how to fetch your Azure AD client ID and tenant ID
# from an environment variable.
client_id = os.environ["AAD_CLIENT_ID"]
tenant_id = os.environ["AAD_TENANT_ID"]
authority = "https://login.microsoftonline.com/%s" % tenant_id

# Create an instance of PublicClientApplication
app = PublicClientApplication(client_id, authority=authority)

scopes = [ 
"https://auth.msft.communication.azure.com/Teams.ManageCalls",
"https://auth.msft.communication.azure.com/Teams.ManageChats"
 ]

# Retrieve the AAD token and object ID of a Teams user
result = app.acquire_token_interactive(scopes)
aad_token =  result["access_token"]
user_object_id = result["id_token_claims"]["oid"] 
```

### Step 2: Initialize the CommunicationIdentityClient

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add this code inside the `try` block:

```python
# This code demonstrates how to fetch your connection string
# from an environment variable.
connection_string = os.environ["COMMUNICATION_SERVICES_CONNECTION_STRING"]

# Instantiate the identity client
client = CommunicationIdentityClient.from_connection_string(connection_string)
```

### Step 3: Exchange the Azure AD access token of the Teams User for a Communication Identity access token

Use the `get_token_for_teams_user` method to issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.

```python
# Exchange the Azure AD access token of the Teams User for a Communication Identity access token
token_result = client.get_token_for_teams_user(aad_token, client_id, user_object_id)
print("Token: " + token_result.token)
```

## Run the code

From a console prompt, navigate to the directory containing the *exchange-teams-access-tokens.py* file, then execute the following `python` command to run the app.

```console
python ./exchange-communication-access-tokens.py
```
