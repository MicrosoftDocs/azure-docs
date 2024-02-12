---
title: Microsoft Sentinel solution for SAP® applications container update script reference | Microsoft Docs
description: Description of command line options available with update deployment script
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.date: 05/24/2023
---

# Update script reference

The SAP data collector agent container uses an update script (available at [Microsoft Sentinel solution for SAP® applications GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP)) to simplify the update process.

This article shows how the script's behavior can be customized by configuring its parameters.

## Script overview

During the update process, the script identifies any containers running the SAP data collector agent, downloads an updated container image from the Azure Container registry, copies mounted directory settings, copies environment variables, renames the existing container with an `-OLD` suffix, and finally creates a container using the updated image. The script then starts the container with an additional `--sapconinstanceupdate` switch that verifies that the updated container can start and connect to the SAP system properly. When the container reports a successful start, the script removes the old container. It then recreates the new container to run without the `--sapconinstanceupdate` switch in order to start in normal operation mode and continue to collect data from the SAP system.

## Parameter reference

#### Confirm all prompts
**Parameter name:** `--confirm-all-prompts`

**Parameter values:** None

**Required:** No

**Explanation:** If `--confirm-all-prompts` switch is specified, script will not pause for any user confirmations. Use `--confirm-all-prompts` switch to achieve a zero-touch deployment

#### Use preview build of the container
**Parameter name:** `--preview`

**Parameter values:** None

**Required:** No

**Explanation:** By default, the container update script deploys the container with `:latest` tag. Public preview features are published to `:latest-preview` tag. To ensure container update script uses public preview version of the container, specify the `--preview` switch.

#### Do not perform a container connectivity test
**Parameter name:** `--no-testrun`

**Parameter values:** None

**Required:** No

**Explanation:** By default, the container update script performs a "test run" of the updated container to verify it can successfully connect to SAP system. To skip this test, specify a `--no-testrun` parameter. In such case, the script will re-create the containers using a new image without validating that containers can successfully start and connect to SAP. Use this switch with caution.

#### Specify a custom SDK location
**Parameter name:** `--sdk`

**Parameter values:** `<SDK file full path>`

**Required:** No

**Explanation:** By default, the update script extracts SDK zip file from an existing container and copies it to the newly created container. If there is a need to update the version of the NetWeaver SDK used together with container update, specify the `--sdk` switch, specifying full path of the SDK.

#### Force container update, even if version is the same
**Parameter name:** `--force`

**Parameter values:** None

**Required:** No

**Explanation:** Update the container, even if the image version used for existing container is the same as image available from Microsoft.

#### Do container selective update
**Parameter name:** `--containername`

**Parameter values:** `Container name`

**Required:** No

**Explanation:** By default, the update script updates all containers running Microsoft Sentinel solution for SAP® applications. To update a single, or multiple containers, specify `--containername <containername>` switch. Switch can be specified multiple times, e.e. `--containername sapcon-A4H --containername sapcon-QQ1 --containername sapcon-QAT`. In such case, only specified containers will be updated. If container name specified does not exist, it will be skipped by the script.

## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
