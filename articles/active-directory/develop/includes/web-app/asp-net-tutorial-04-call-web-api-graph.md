---
author: henrymbuguakiarie
ms.author: henrymbugua
ms.date: 12/16/2021
ms.service: active-directory
ms.subservice: develop
ms.topic: include
---

In this tutorial, you get access tokens to call the Microsoft Graph API from a web app that uses the Microsoft Authentication Library (MSAL).

Follow the steps in this tutorial to:

> [!div class="checklist"]
>
> - Fetch access tokens
> - Call Microsoft Graph API

## Acquire a token

Before making a REST call to an API, such as Microsoft Graph, you'll need to acquire an access token. Add the following code to index.js

:::code language="aspx-csharp" source="~/ms-identity-docs-code-dotnet/src/sign-in-webapp/Program.cs" id="ms_docref_add_msal":::

## Call Microsoft Graph API

:::code language="aspx-csharp" source="~/ms-identity-docs-code-dotnet/src/sign-in-webapp/Pages/Index.cshtml.cs":::

## Display logged in content

## Display MSAL provider content

## Next steps

In this tutorial, you acquired an access token and called the Microsoft Graph API using a React single-page application.

Now that you have an app that can sign in users and call a web API, $NEXT_STEP_DESCRIPTION_HERE.

> [!div class="nextstepaction"]
> [Authorization basics](../../authorization-basics.md)
