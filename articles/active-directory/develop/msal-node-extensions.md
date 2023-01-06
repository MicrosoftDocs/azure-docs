---
title: "Learn about Microsoft Authentication Extensions for Node"
description: The Microsoft Authentication Extensions for Node enables application developers to perform cross-platform token cache serialization and persistence. It gives extra support to the Microsoft Authentication Library for Node (MSAL Node).
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/04/2022
ms.reviewer: j-mantu, samuelkubai, Dickson-Mwendia
ms.author: henrymbugua
#Customer intent: As an application developer, I want to learn how to use the Microsoft Authentication Extensions for Node to perform cross-platform token cache serialization and persistence.
---

# Microsoft Authentication Extensions for Node

The Microsoft Authentication Extensions for Node enables developers to perform cross-platform token cache serialization and persistence to disk. It gives extra support to the Microsoft Authentication Library (MSAL) for Node.

The [MSAL for Node](tutorial-v2-nodejs-webapp-msal.md) supports an in-memory cache by default and provides the ICachePlugin interface to perform cache serialization, but doesn't provide a default way of storing the token cache to disk. The Microsoft Authentication Extensions for Node is the default implementation for persisting cache to disk across different platforms.

The Microsoft Authentication Extensions for Node support the following platforms:

- Windows - Data protection API (DPAPI) is used for protection.
- Mac - The Mac Keychain is used.
- Linux - LibSecret is used for storing to "Secret Service".

## Installation

The `msal-node-extensions` package is available on Node Package Manager (NPM).

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

The following table provides an explanation for all the arguments for the persistence configuration.

| Field Name              | Description                                                                                         | Required For           |
| ----------------------- | --------------------------------------------------------------------------------------------------- | ---------------------- |
| cachePath               | The path to the lock file the library uses to synchronize the reads and the writes          | Windows, Mac, and Linux |
| dataProtectionScope     | Specifies the scope of the data protection on Windows either the current user or the local machine. | Windows                |
| serviceName             | Specifies the service name to be used on Mac and/or Linux                                      | Mac and Linux          |
| accountName             | Specifies the account name to be used on Mac and/or Linux                                      | Mac and Linux          |
| usePlaintextFileOnLinux | The flag to default to plain text on linux if LibSecret fails. Defaults to `false`            | Linux                  |

## Next steps

For more information about Microsoft Authentication Extensions for Node and MSAL Node, see:

- [Microsoft Authentication Extensions for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/extensions/msal-node-extensions)
- [Microsoft Authentication Library for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
