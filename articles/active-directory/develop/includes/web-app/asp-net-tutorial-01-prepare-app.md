---
author: henrymbuguakiarie
ms.author: henrymbugua
ms.date: 01/14/2022
ms.service: active-directory
ms.subservice: develop
ms.topic: include
---

In this tutorial, you build a web app that signs in users and calls Microsoft Graph by using the authorization code flow with PKCE. The SPA you build uses the Microsoft Authentication Library (MSAL).

Follow the steps in this tutorial to:

> [!div class="checklist"]
>
> - Learn how the tutorial app works
> - Create application project
> - Install the auth library

## How the tutorial works

## (Optional) Create a new app project

```dotnetcli
dotnet new webapp --auth SingleOrg --aad-instance "https://login.microsoftonline.com/" --client-id ${AZURE_AD_APP_CLIENT_ID_WEBAPP} --tenant-id $(az account show --query tenantId --output tsv) --domain ${AZURE_AD_APP_DOMAIN} --called-api-url "https://graph.microsoft.com/v1.0/me"
```

## Install the auth library

:::code language="aspx-csharp" source="~/ms-identity-docs-code-dotnet/src/sign-in-webapp/Program.cs" id="ms_docref_add_msal":::

## Next steps

In this tutorial, you <!-- $TASKS_COMPLETED_AND_LEARNINGS_HERE -->.

In the next tutorial, you build on these learnings by <!-- $TASKS_AND_LEARNINGS_IN_NEXT_TUTORIAL_HERE -->.

> [!div class="nextstepaction"] 
> [Register your application with Azure AD](../../web-app-tutorial-02-prepare-azure-ad.md)
