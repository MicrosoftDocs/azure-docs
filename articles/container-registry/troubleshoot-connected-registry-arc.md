---
title: "Known issues: Connected Registry Arc Extension"
description: "Learn how to troubleshoot the most common problems for a Connected Registry Arc Extension and resolve issues with ease."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: troubleshooting-known-issue #Don't change.
ms.date: 05/09/2024

#customer intent: As a customer, I want to understand the common issues with the Connected Registry Arc Extension and how to troubleshoot them.

---

# Known issues: Connected Registry Arc Extension

This article provides information about known issues with the Connected Registry Arc Extension and how to troubleshoot them.
   
## Possible causes

* Deploying the extension with existing password.
* Deploying the extension with geo-replication.
* Cleaning up the extension deployment leaves some residue behind. 

## Issue: Connected Registry Arc Extension deployment fails with an error message

1. Run the [az acr connected-registry update] command to update the connected registry extension with the debug log level:  

    ```azurecli
    az acr connected-registry update --registry mycloudregistry \ 
    --name myacrregistry \
    --log-level debug   
    ```

2. The following log levels can be applied to aid in troubleshooting:
    
- **Debug** provides detailed information for debugging purposes.

- **Information** provides general information for debugging purposes.

- **Warning** indicates potential problems that aren't yet errors but might become one if no action is taken.

- **Error** logs errors that prevent an operation from completing.

- **None** turns off logging, so no log messages are written.

3. Adjust the log level as needed to troubleshoot the issue.
 
The active selection provides more options to adjust the verbosity of logs when debugging issues with a connected registry. The following options are available:

The connected registry log level is specific to the connected registry's operations and determines the severity of messages that the connected registry handles. This setting is used to manage the logging behavior of the connected registry itself.

- **--log-level** set the log level on the instance. The log level determines the severity of messages that the logger handle. By setting the log level, you can filter out messages that are below a certain severity. For example, if you set the log level to "warning" the logger handles warnings, errors, and critical messages, but it ignores information and debug messages.

The az cli log level controls the verbosity of the output messages during the operation of the Azure CLI. The Azure CLI (az) provides several verbosity options for log levels, which can be adjusted to control the amount of output information during its operation:

- **--verbose** increases the verbosity of the logs. It provides more detailed information than the default setting, which can be useful for identifying issues.

- **--debug** enables full debug logs. Debug logs provide the most detailed information, including all the information provided at the "verbose" level plus more details intended for diagnosing problems.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploying the Connected Registry Arc Extension](quickstart-connected-registry-arc-cli.md)
> [Glossary of terms](connected-registry-glossary.md)