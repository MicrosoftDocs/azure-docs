---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 07/29/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
## Configure logging

The MSAL library generates log messages that can help you diagnose issues. The app can configure logging, and it can give you custom control over the level of detail and whether personal and organizational data is logged. 

We recommend that you create an MSAL logging callback and provide a way for users to submit logs when they have authentication issues. MSAL provides several levels of logging detail:

- Error: Indicates something has gone wrong and an error was generated. Used for debugging and identifying problems.
- Warning: There hasn't necessarily been an error or failure, but it's intended for diagnostics and to help pinpoint problems.
- Info: MSAL logs events that are intended for informational purposes, and not necessarily for debugging.
- Verbose: Default. MSAL logs the full details of library behavior.

By default, the MSAL logger doesn't capture any personal or organizational data. The library gives you the option to enable logging personal and organizational data if you decide to do so.



