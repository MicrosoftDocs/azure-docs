---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/06/2020
ms.author: glenga
---
Functions lets you use keys to make it harder to access your HTTP function endpoints during development. Unless the HTTP access level on an HTTP triggered function is set to `anonymous`, requests must include an API access key in the request. 

While keys provide a default security mechanism, you may want to consider other options to secure an HTTP endpoint in production. For example, it's not a good practice to distribute shared secret in public apps. If your function is being called from a public client, you may want to consider implementing another security mechanism. To learn more, see [Secure an HTTP endpoint in production](../articles/azure-functions/functions-bindings-http-webhook-trigger.md#secure-an-http-endpoint-in-production).

When you renew your function key values, you must manually redistribute the updated key values to all clients that call your function.  

#### Authorization scopes (function-level)

There are two access scopes for function-level keys:

* **Function**: These keys apply only to the specific functions under which they're defined. When used as an API key, these only allow access to that function.

* **Host**: Keys with a host scope can be used to access all functions within the function app. When used as an API key, these allow access to any function within the function app. 

Each key is named for reference, and there's a default key (named "default") at the function and host level. Function keys take precedence over host keys. When two keys are defined with the same name, the function key is always used.

#### Master key (admin-level) 

Each function app also has an admin-level host key named `_master`. In addition to providing host-level access to all functions in the app, the master key also provides administrative access to the runtime REST APIs. This key can't be revoked. When you set an access level of `admin`, requests must use the master key; any other key results in access failure.

[!INCLUDE [functions-master-key-caution](functions-master-key-caution.md)]
