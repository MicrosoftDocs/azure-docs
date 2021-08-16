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

The MSAL library generates log messages that can help diagnose issues. The app can configure logging, and have custom control over the level of detail and whether or not personal and organizational data is logged. 

We recommend you create an MSAL logging callback and provide a way for users to submit logs when they have authentication issues. MSAL provides several levels of logging detail:

- Error: Indicates something has gone wrong and an error was generated. Used for debugging and identifying problems.
- Warning: There hasn't necessarily been an error or failure, but are intended for diagnostics and pinpointing problems.
- Info: MSAL will log events intended for informational purposes not necessarily intended for debugging.
- Verbose: Default. MSAL logs the full details of library behavior.

By default, the MSAL logger doesn't capture any personal or organizational data. The library provides the option to enable logging personal and organizational data if you decide to do so.



