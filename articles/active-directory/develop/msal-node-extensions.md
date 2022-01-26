---
title: "Token cache persistence implementation | Azure"
titleSuffix: Microsoft identity platform
description: Learn how to configure token cache persistence implementation using the Microsoft Authentication Extensions for Node.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 01/26/2022
ms.author: henrymbugua
#Customer intent: As an application developer, I want to learn how to use the Microsoft Authentication Extensions for Node library for cache persistence support for public client applications.
---

# Microsoft Authentication Extensions for Node

[Microsoft Authentication Extensions for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/extensions/msal-node-extensions) is a library for token cache persistence support for Public client applications such as desktop applications.

[Microsoft Authentication Library for Node](msal-node-migration.md) (MSAL Node) supports an in-memory cache by default and provides the ICachePlugin interface to perform cache serialization, but does not provide a default way of storing the token cache to disk. Microsoft authentication extensions for node is default implementation for persisting cache to disk across different platforms.

Microsoft authentication extensions for node support the following platforms:

- Windows - DPAPI is used for protection.
- MAC - The MAC KeyChain is used.
- Linux - LibSecret is used for storing to "Secret Service".

## Installation

The `msal-node-extensions` package is available on NPM.

```bash
npm i @azure/msal-node-extensions --save
```

## Configure the token cache

Here's an example of code that uses Microsoft Authentication Extensions for Node to configure the token cache.

```javascript
const {
  DataProtectionScope,
  Environment,
  PersistenceCreator,
  PersistenceCachePlugin,
} = require("@azure/msal-node-extensions");

// You can use the helper functions provided through the Environment class to construct your cache path
// The helper functions provide consistent implementations across Windows, Mac and Linux.
const cachePath = path.join(Environment.getUserRootDirectory(), "./cache.json");

const persistenceConfiguration = {
  cachePath,
  dataProtectionScope: DataProtectionScope.CurrentUser,
  serviceName: "<SERVICE-NAME>",
  accountName: "<ACCOUNT-NAME>",
  usePlaintextFileOnLinux: false,
};

// The PersistenceCreator obfuscates a lot of the complexity by doing the following actions for you :-
// 1. Detects the environment the application is running on and initializes the right persistence instance for the environment.
// 2. Performs persistence validation for you.
// 3. Performs any fallbacks if necessary.
PersistenceCreator.createPersistence(persistenceConfiguration).then(
  async (persistence) => {
    const publicClientConfig = {
      auth: {
        clientId: "<CLIENT-ID>",
        authority: "<AUTHORITY>",
      },

      // This hooks up the cross-platform cache into MSAL
      cache: {
        cachePlugin: new PersistenceCachePlugin(persistence),
      },
    };

    const pca = new msal.PublicClientApplication(publicClientConfig);

    // Use the public client application as required...
  }
);
```

All the arguments for the persistence configuration are explained below:

| Field Name              | Description                                                                                         | Required For           |
| ----------------------- | --------------------------------------------------------------------------------------------------- | ---------------------- |
| cachePath               | This is the path to the lock file the library uses to synchronize the reads and the writes          | Windows, Mac and Linux |
| dataProtectionScope     | Specifies the scope of the data protection on Windows either the current user or the local machine. | Windows                |
| serviceName             | This specifies the service name to be used on Mac and/or Linux                                      | Mac and Linux          |
| accountName             | This specifies the account name to be used on Mac and/or Linux                                      | Mac and Linux          |
| usePlaintextFileOnLinux | This is a flag to default to plain text on linux if libsecret fails. Defaults to `false`            | Linux                  |

