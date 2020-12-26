---
author: burkeholland
ms.service: static-web-apps
ms.topic: include
ms.date: 05/08/2020
ms.author: buhollan
---

#### Local proxy

You can configure a proxy for the Live Server Visual Studio Code extension that routes all requests to `/api` to the running API endpoint at `http://127.0.0.1:7071/api`.

1. Open the _.vscode/settings.json_ file.

1. Add the following settings to specify a proxy for Live Server.

   ```json
   "liveServer.settings.proxy": {
      "enable": true,
      "baseUri": "/api",
      "proxyUri": "http://127.0.0.1:7071/api"
   }
   ```

   This configuration is best saved in project settings file, as opposed to in the user settings file.

   Using project settings assures the proxy isn't applied to all other projects opened in Visual Studio Code.
