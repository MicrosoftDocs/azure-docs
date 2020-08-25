---
title: Known issues - Azure Digital Twins
description: Get help recognizing and mitigating known issues with Azure Digital Twins.
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.service: digital-twins
ms.date: 07/14/2020
---

# Known issues in Azure Digital Twins

This article provides information about known issues associated with Azure Digital Twins.

## "400 Client Error: Bad Request" in Cloud Shell

Commands in Cloud Shell may intermittently fail with the error "400 Client Error: Bad Request for url: http://localhost:50342/oauth2/token" followed by full stack trace.

### Troubleshooting steps

This can be resolved by re-running the `az login` command and completing subsequent login steps.

After this, you should be able to re-run the command.

### Possible causes

This is the result of a known issue in Cloud Shell: [*Getting token from Cloud Shell intermittently fails with 400 Client Error: Bad Request*](https://github.com/Azure/azure-cli/issues/11749).

## Next steps

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)