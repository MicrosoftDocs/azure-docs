
The code for all the functions in a specific function app is located in a root folder that contains a host configuration file and one or more subfolders. Each subfolder contains the code for a separate function, as in the following example:

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

The host.json file contains some runtime-specific configurations, and sits in the root folder of the function app. For information about settings that are available, see the [host.json reference](../articles/azure-functions/functions-host-json.md).

Each function has a folder that contains one or more code files, the function.json configuration, and other dependencies.

