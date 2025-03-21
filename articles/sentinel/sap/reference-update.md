---
title: Microsoft Sentinel solution for SAP applications data connector agent update file reference
description: Description of command line options available with update deployment script
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 07/03/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#Customer intent: As an advanced SAP BASIS team member, I want to customize the SAP data collector agent container update script so that I can streamline the update process and ensure compatibility with my SAP system.

---

# Microsoft Sentinel solution for SAP applications data connector agent update file reference

The Microsoft Sentinel SAP data connector agent container users an [update script](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP) to simplify the update process.

This article describes the configurable parameters available in the update script. For more information, see [Update the Microsoft Sentinel for SAP applications data connector agent](update-sap-data-connector.md).

Content in this article is intended for your **SAP BASIS** teams.

## Script process overview

During a Microsoft Sentinel solution for SAP applications data connector agent update process, the update script takes the following actions:

1. Identifies any containers running the SAP data collector agent.
1. Downloads an updated container image from the Azure Container registry.
1. Copies mounted directory settings and environment variables.
1. Renames the existing container with an `-OLD` suffix.
1. Creates a container using the updated image.
1. Starts the container with an extra `--sapconinstanceupdate` switch that verifies that the updated container can start and connect to the SAP system properly.

When the container reports a successful start, the script removes the old container. It then recreates the new container to run without the `--sapconinstanceupdate` switch in order to start in normal operation mode and continue to collect data from the SAP system.

## Confirm all prompts

**Parameter name:** `--confirm-all-prompts`

**Parameter values:** None

**Required:** No

**Explanation:** If the `--confirm-all-prompts` switch is specified, the script doesn't pause for any user confirmations. Use the `--confirm-all-prompts` switch for a zero-touch deployment.


## Don't perform a container connectivity test

**Parameter name:** `--no-testrun`

**Parameter values:** None

**Required:** No

**Explanation:** By default, the container update script performs a test run of the updated container to verify that it can successfully connect to the SAP system. To skip this test, specify a `--no-testrun` parameter. In such cases, the script recreates the containers using a new image, without validating that the containers can successfully start and connect to SAP. 

Use this switch with caution.


## Force container update, even if version is the same

**Parameter name:** `--force`

**Parameter values:** None

**Required:** No

**Explanation:** Update the container, even if the image version used for the existing container is the same as the image available from Microsoft.

## Perform a selective update

**Parameter name:** `--containername`

**Parameter values:** `Container name`

**Required:** No

**Explanation:** By default, the update script updates all containers running Microsoft Sentinel solution for SAP applications. 

To update a single, or multiple containers, specify `--containername <containername>` switch. The switch can be specified multiple times, such as: `--containername sapcon-A4H --containername sapcon-QQ1 --containername sapcon-QAT`. In such cases, only the specified containers are updated. If the specified container name doesn't exist, it's skipped by the script.

## Specify a custom SDK location

**Parameter name:** `--sdk`

**Parameter values:** `<SDK file full path>`

**Required:** No

**Explanation:** By default, the update script extracts SDK zip file from an existing container and copies it to the newly created container. If there's a need to update the version of the NetWeaver SDK used together with container update, specify the `--sdk` switch, specifying full path of the SDK.

## Use the container's preview build

**Parameter name:** `--preview`

**Parameter values:** None

**Required:** No

**Explanation:** By default, the container update script deploys the container with `:latest` tag. Public preview features are published to `:latest-preview` tag. To have the container update script use the public preview version of the container, specify the `--preview` switch instead.

## Related content

For more information, see:

- [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications solution deployment](sap-deploy-troubleshoot.md)
