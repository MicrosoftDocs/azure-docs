
The code for all of the functions in a given function app lives in a root folder that contains a host configuration file and one or more subfolders, each of which contain the code for a separate function, as in the following example:

```
wwwroot
 | - host.json
 | - mynodefunction
 | | - function.json
 | | - index.js
 | | - node_modules
 | | | - ... packages ...
 | | - package.json
 | - mycsharpfunction
 | | - function.json
 | | - run.csx
```

The *host.json* file contains some runtime-specific configuration and sits in the root folder of the function app. For information on settings that are available, see [host.json reference](../articles/azure-functions/functions-host-json.md).

Each function has a folder that contains one or more code files, the function.json configuration and other dependencies.

