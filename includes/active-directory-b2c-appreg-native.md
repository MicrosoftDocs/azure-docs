---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 09/27/2019
ms.author: marsma
# Used by articles that register native client applications in the B2C tenant.
---
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *nativeapp1*.
1. For **Native client**, select **Yes**.
1. Enter a **Custom Redirect URI** with a unique scheme. For example, `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`. There are two important considerations when choosing a redirect URI:
    1. **Unique**: The scheme of the redirect URI must be unique for every application. In the example `com.onmicrosoft.contosob2c.exampleapp://oauth/redirect`, `com.onmicrosoft.contosob2c.exampleapp` is the scheme. This pattern should be followed. If two applications share the same scheme, the user is given a choice to choose an application. If the user chooses incorrectly, the sign-in fails.
    1. **Complete**: The redirect URI must have a both a scheme and a path. The path must contain at least one forward slash after the domain. For example, `//oauth/` works while `//oauth` fails. Don't include special characters in the URI, for example, underscores.
1. Select **Create**.
