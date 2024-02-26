---
title: Update Microsoft Sentinel's SAP data connector agent
description: This article shows you how to update an already existing SAP data connector to its latest version.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 12/31/2022
---

# Update Microsoft Sentinel's SAP data connector agent

This article shows you how to update an already existing Microsoft Sentinel for SAP data connector to its latest version.

To get the latest features, you can [enable automatic updates](#automatically-update-the-sap-data-connector-agent-preview) for the SAP data connector agent, or [manually update the agent](#manually-update-sap-data-connector-agent).

Note that the automatic or manual updates described in this article are relevant to the SAP connector agent only, and not to the Microsoft Sentinel Solution for SAP. To successfully update the solution, your agent needs to be up to date. The solution is updated separately.

## Automatically update the SAP data connector agent (Preview)

You can choose to enable automatic updates for the connector agent on [all existing containers](#enable-automatic-updates-on-all-existing-containers) or a [specific container](#enable-automatic-updates-on-a-specific-container).

> [!IMPORTANT]
> Automatically updating the SAP data connector agent is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Enable automatic updates on all existing containers

To enable automatic updates on all existing containers (all containers with a connected SAP agent), run the following command on the collector VM:

```
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh 
```
    
The command creates a cron job that runs daily and checks for updates. If the job detects a new version of the agent, it updates the agent on all containers that exist when you run the command above. If a container is running a Preview version that is newer than the latest version (the version that the job installs), the job doesn't update that container. 

If you add containers after you run the cron job, the new containers are not automatically updated. To update these containers, in the */opt/sapcon/[SID or Agent GUID]/settings.json* file, define the `auto_update` parameter for each of the containers as `true`.

The logs for this update are under *var/log/sapcon-sentinel-register-autoupdate.log/*.

### Enable automatic updates on a specific container

To enable automatic updates on a specific container or containers, run the following command:

```
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh --containername <containername> [--containername <containername>]...
```

The logs for this update are under */var/log/sapcon-sentinel-register-autoupdate.log*. 

### Disable automatic updates

To disable automatic updates for a container or containers, define the `auto_update` parameter for each of the containers as `false`.

## Manually update SAP data connector agent

To manually update the connector agent, make sure that you have the most recent versions of the relevant deployment scripts from the Microsoft Sentinel GitHub repository. 

Run:

```
wget -O sapcon-instance-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-instance-update.sh && bash ./sapcon-instance-update.sh
```

The SAP data connector Docker container on your machine is updated. 

Be sure to check for any other available updates, such as:

- Relevant SAP change requests, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR).
- Microsoft Sentinel solution for SAP® applications security content, in the **Microsoft Sentinel solution for SAP® applications** solution.
- Relevant watchlists, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists).

## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
