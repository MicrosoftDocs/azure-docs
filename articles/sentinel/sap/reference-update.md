---
title: Continuous Threat Monitoring for SAP container update script reference | Microsoft Docs
description: Description of command line options available with update deployment script
author: MSFTandrelom
ms.author: andrelom
ms.topic: reference
ms.date: 03/02/2022
---

# Update script reference

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Script overview

Update script (available at [Microsoft Azure Sentinel SAP Continuous Threat Monitoring GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP)) is used to simplify update of the Continuous Threat Monitoring for SAP container.
During the update process, script identifies all containers that are running Continuous Threat Monitoring for SAP, downloads an updated container image from Azure Container registry, copies mounted directory settings, copies environment variables, renames the existing container to `-OLD` suffix, then creates a container using updated image. Container is then started with an additional `--sapconinstanceupdate` switch, that validates that updated container can strart and connect to SAP correctly. Once container reports that this is successful, old container is removed and a new container is recreated to run without the `--sapconinstanceupdate` switch, so it starts in normal operation mode and continues to collect data from the SAP system. Script behavior can be customized with a number of parameters listed below:

## Parameter reference

#### Confirm all prompts
Parameter name: `--confirm-all-prompts`

Parameter values: None

Required?: No

Explanation: If `--confirm-all-prompts` switch is specified, script will not pause for any user confirmations. Use `--confirm-all-prompts` switch to achieve a zero-touch deployment

#### Use preview build of the container
Parameter name: `--preview`

Parameter values: None

Required?: No

Explanation: By default, container update script deploys the container with :latest tag. Public preview features are published to :latest-preview tag. To ensure container update script uses public preview version of the container, specify the `--preview` switch.

#### Do not perform a container connectivity test
Parameter name: `--no-testrun`

Parameter values: None

Required?: No

Explanation: By default, container update script performs a "test run" of the updated container to verify it can successfully connect to SAP system. To skip this test, specify a `--no-testrun` parameter. In such case, the script will re-create the containers using a new image without validating that containers can successfully start and connect to SAP. Use this switch with caution.

#### Specify a custom SDK location
Parameter name: `--sdk`

Parameter values: `<SDK file full path>`

Required?: No

Explanation: By default, update script extracts SDK zip file from an existing container and copies it to the newly created container. If there is a need to update the version of the NetWeaver SDK used together with container update, specify the `--sdk` switch, specifying full path of the SDK.

#### Force container update, even if version is the same
Parameter name: `--force`

Parameter values: None

Required?: No

Explanation: Update the container, even if the image version used for existing container is the same as image available from Microsoft.

#### Do container selective update
Parameter name: `--containername`

Parameter values: `Container name`

Required?: No

Explanation: By default, update script updates all containers running Continuous Threat Monitoring for SAP. To update a single, or multiple containers, specify `--containername <containername>` switch. Switch can be specified multiple times, e.e. `--containername sapcon-A4H --containername sapcon-QQ1 --containername sapcon-QAT`. In such case, only specified containers will be updated. If container name specified does not exist, it will be skipped by the script.

## Next steps

Learn more about the Microsoft Sentinel SAP solutions:

- [Deploy Continuous Threat Monitoring for SAP](deployment-overview.md)
- [Prerequisites for deploying SAP continuous threat monitoring](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy and configure the SAP data connector agent container](deploy-data-connector-agent-container.md)
- [Deploy SAP security content](deploy-sap-security-content.md)
- [Deploy the Microsoft Sentinel SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel SAP solution deployment](sap-deploy-troubleshoot.md)
- [Configure SAP Transport Management System](configure-transport.md)

Reference files:

- [Microsoft Sentinel SAP solution data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel SAP solution: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
