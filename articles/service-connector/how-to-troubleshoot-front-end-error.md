---
title: Service Connector troubleshooting guidance
description: This article lists error messages and suggested actions to troubleshooting issues with Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: troubleshooting
ms.date: 10/19/2023
ms.custom: ignite-fall-2021, kr2b-contr-experiment, event-tier1-build-2022, devx-track-azurecli
---

# How to troubleshoot Service Connector

This article lists error messages and suggestions to troubleshoot Service Connector.

## Error message and suggested actions from the Azure portal

| Error message         | Suggested Action                                                                                          |
|-----------------------|-----------------------------------------------------------------------------------------------------------|
| Unknown resource type | Check source and target resource to verify whether the service types are supported by Service Connector.  |
|                       | Check whether the specified source-target connection combination is supported by Service Connector.       |
|                       | Check whether the target resource exists.                                                                 |
|                       | Check the correctness of the target resource ID.                                                          |
| Unsupported resource  | Check whether the authentication type is supported by the specified source-target connection combination. |

## Error type，error message, and suggested actions using Azure CLI

### InvalidArgumentValueError

| Error message                                   | Suggested Action                                                         |
|-------------------------------------------------|--------------------------------------------------------------------------|
| The source resource ID is invalid: `{SourceId}` | Check whether the source resource ID supported by Service Connector.     |
|                                                 | Check the correctness of source resource ID.                             |
| Target resource ID is invalid: `{TargetId}`     | Check whether the target service type is supported by Service Connector. |
|                                                 | Check the correctness of target resource ID.                             |
| Connection ID is invalid: `{ConnectionId}`      | Check the correctness of the connection ID.                              |

#### RequiredArgumentMissingError

| Error message                                                                      | Suggested Action                                                                                                  |
|------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| `{Argument}` shouldn't be blank                                                    | User should provide argument value for interactive input                                                          |
| Required keys missing for parameter `{Parameter}`. All possible keys are: `{Keys}` | Provide value for the authentication information parameter, usually in the form of `--param key1=val1 key2=val2`. |
| Required argument is missing, please provide the arguments: `{Arguments}`          | Provide the required argument.                                                                                    |

#### ValidationError

| Error message                                                                                                              | Suggested Action                                                                                                                                                                              |
|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Only one auth info is needed                                                                                               | User can only provide one authentication information parameter. Check whether it isn't provided or multiple parameters are provided.                                                          |
| Auth info argument should be provided when updating the connection: `{ConnectionName}`                                     | The authentication information should be provided when updating a secret type connection. This error occurs because a user's secret can't be accessed through the Azure Resource Manager API. |
| Either client type or auth info should be specified to update                                                              | Either client type or authentication information should be provided when updating a connection.                                                                                               |
| Usage error: `{} [KEY=VALUE ...]`                                                                                          | Check the available keys and provide values for the auth info parameter, usually in the form of `--param key1=val1 key2=val2`.                                                                |
| Unsupported Key `{Key}` is provided for parameter `{Parameter}`. All possible keys are: `{Keys}`                           | Check the available keys and provide values for the authentication information parameter, usually in the form of `--param key1=val1 key2=val2`.                                               |
| Provision failed, please create the target resource manually and then create the connection. Error details: `{ErrorTrace}` | Retry. Create the target resource manually and then create the connection.                                                                                                                    |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [Known limitations](./known-limitations.md)
