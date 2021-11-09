---
title: Authorization
description: The Log Analytics API supports using authentication to query your workspace data, or an API key to query sample workspace data.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Authorization

The Log Analytics API supports using [Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-whatis/) authentication to query your workspace data, or an API key to query sample workspace data.

## AAD authentication to your data

To query your own workspaces, you will need to use AAD authentication. The Log Analytics API supports AAD authentication with three different OAuth2 flows: client credentials, authorization flow, and implicit If you are unfamiliar with OAuth2 take a moment to familiarize yourself with [AAD's OAuth2 support](/azure/active-directory/develop/active-directory-protocols-oauth-code). If making automated calls from an application without user interaction, use client credentials. After receiving a token, the process for calling the Log Analytics API is identical for all flows. Requests require the `Authorization: Bearer` header, populated with the token received from the OAuth2 flow of your choice.

## API key authentication to sample data

To quickly explore the API without needing to use AAD authentication, we provide a demonstration workspace with sample data, which allows API key authentication. To learn more about using API key authentication see [this](api-keys.md).
