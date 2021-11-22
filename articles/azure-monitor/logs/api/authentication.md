---
title: Authentication
description: The Log Analytics API supports using AAD authentication to query your workspace data, or an API key to query sample workspace data.
ms.author: abbyweisberg
ms.date: 11/22/2021
ms.topic: article
---
# Authentication

You must authenticate to access the API. 
- To query your workspaces, you need to use [Azure Active Directory authentication](https://azure.microsoft.com/documentation/articles/active-directory-whatis/).
- To quickly explore the API without using AAD authentication, you can use an API key to query sample data.

## AAD authentication for workspace data

The Log Analytics API supports AAD authentication with three different [AAD OAuth2](/azure/active-directory/develop/active-directory-protocols-oauth-code) flows:
- Authorization code grant
- Implicit grant
- Client credentials grant

The authorization code grant flow and implicit grant flow both require at least a one time user-interactive login to your application. If you need a totally non-interactive flow, you must use client credentials.

Once you have received a token, the process for calling the Log Analytics API is identical for all flows. Requests require the `Authorization: Bearer` header, populated with the token received from the OAuth2 flow.

## API key authentication for sample data

To quickly explore the API without using AAD authentication, we provide a demonstration workspace with sample data, which allows API key authentication. [Learn more about using API key authentication](api-keys.md).
