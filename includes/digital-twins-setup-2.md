---
author: baanders
description: Azure Digital Twins setup steps (2, client app registration)
ms.service: digital-twins
ms.topic: include
ms.date: 4/22/2020
ms.author: baanders
---

To authenticate against Azure Digital Twins from a client application, you need to set up an **app registration** in [Azure Active Directory](../articles/active-directory/fundamentals/active-directory-whatis.md).

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](../articles/digital-twins-v2/how-to-use-apis-sdks.md). Your client app authenticates against the app registration, and as a result is granted the configured access permissions to the APIs.

To create an app registration, you need to provide the resource IDs for the Azure Digital Twins APIs, and the baseline permissions to the API. In your working directory, open a new file and enter the following JSON snippet to configure these details: 

```json
[{
    "resourceAppId": "https://digitaltwins.azure.net",
    "resourceAccess": [
     {
       "id": "4589bd03-58cb-4e6c-b17f-b580e39652f8",
       "type": "Scope"
     }
    ]
}]
``` 

Save this file as *manifest.json*.

In your Cloud Shell window, click the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="../articles/digital-twins-v2/media/include-setup/upload-extension.png" alt-text="Cloud Shell window showing selection of the Upload option":::
Navigate to the *manifest.json* you just created and hit "Open."

Next, run the following command to create an app registration (replacing placeholders as needed):

```azurecli
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses manifest.json --reply-url http://localhost
```

The output from this command looks something like this.

:::image type="content" source="../articles/digital-twins-v2/media/include-setup/new-app-registration.png" alt-text="New AAD app registration":::

After creating the app registration, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal.

From this overview, select the app registration you just created from the list. This will open up its details in a page like this one:

:::image type="content" source="../articles/digital-twins-v2/media/include-setup/get-authentication-ids.png" alt-text="Azure portal: authentication IDs":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. You will use these values later to authenticate a client app against the Azure Digital Twins APIs.

> [!NOTE]
> Depending on your scenario, you may need to make additional changes to the app registration. Here are some common requirements you may need to meet:
> * Activate public client access
> * Set specific reply URLs for web and desktop access
> * Allow for implicit OAuth2 authentication flows
> * If your Azure subscription is created using a Microsoft account such as Live, Xbox, or Hotmail, you need to set the *signInAudience* on the app registration to support personal accounts.
> The easiest way to set up these settings is to use the [Azure portal](https://portal.azure.com/). For more information about this process, see [Register an application with the Microsoft identity platform](https://docs.microsoft.com/graph/auth-register-app-v2).