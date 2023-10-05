---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 07/29/2021
ms.author: kengaderdus
# Used by Azure AD B2C app integration articles under "App integration".
---
## Configure logging

The MSAL library generates log messages that can help diagnose problems. The app can configure logging. The app can also give you custom control over the level of detail and whether personal and organizational data is logged. 

We recommend that you create an MSAL logging callback and provide a way for users to submit logs when they have authentication problems. MSAL provides these levels of logging detail:

- **Error**: Something has gone wrong, and an error was generated. This level is used for debugging and identifying problems.
- **Warning**: There hasn't necessarily been an error or failure, but the information is intended for diagnostics and pinpointing problems.
- **Info**: MSAL logs events that are intended for informational purposes and not necessarily for debugging.
- **Verbose**: This is the default level. MSAL logs the full details of library behavior.

By default, the MSAL logger doesn't capture any personal or organizational data. The library gives you the option to enable logging of personal and organizational data if you decide to do so.
