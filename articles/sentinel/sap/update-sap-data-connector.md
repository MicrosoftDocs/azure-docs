---
title: Update Microsoft Sentinel's SAP data connector agent
description: This article shows you how to update an already existing SAP data connector to its latest version.
author: MSFTandrelom
ms.author: andrelom
ms.topic: reference
ms.date: 12/31/2022
---

# Update Microsoft Sentinel's SAP data connector agent

This article shows you how to update an already existing Microsoft Sentinel for SAP data connector to its latest version.

If you have a Docker container already running with an earlier version of the SAP data connector, run the SAP data connector update script to get the latest features available.

You can choose to [enable auto-update](#automatically-update-the-sap-data-connector-agent) the SAP data connector agent when a new version of the SAP agent is available, or [manually update the agent](#manually-update-sap-data-connector-agent).

## Automatically update the SAP data connector agent

You can choose to enable automatic updates for the connector agent on [all existing containers](#enable-automatic-updates-on-all-existing-containers) or a [specific container](#enable-automatic-updates-on-a-specific-container).

### Enable automatic updates on all existing containers

To enable automatic updates on all existing containers, run the following command:

```
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh 
```
    
The command creates a cron job that runs daily and checks for updates. If the job detects a new version of the agent, it updates the agent on all containers that exist when you run the command above. This includes containers in a Preview version. If you add containers  after you run the command, the new containers are not automatically updated. 

To update additional containers, in the */opt/sapcon/[SID or Agent GUID]/settings.json* file, define the `auto_update` parameter for each of the containers as `true`.

The logs for this update are under *var/log/sapcon-sentinel-register-autoupdate.log/*.

### Enable automatic updates on a specific container

To enable automatic updates on a specific container, run the following command on the container on which you want to enable auto-update:

```
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh --containername <containername> [--containername <containername>]...
```

The logs for this update are under */var/log/sapcon-sentinel-register-autoupdate.log*. 


## Manually update SAP data connector agent

Make sure that you have the most recent versions of the relevant deployment scripts from the Microsoft Sentinel GitHub repository. 

Run:

```azurecli
wget -O sapcon-instance-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-instance-update.sh && bash ./sapcon-instance-update.sh
```

The SAP data connector Docker container on your machine is updated. 

Be sure to check for any other available updates, such as:

- Relevant SAP change requests, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR).
- Microsoft Sentinel Solution for SAP security content, in the **Microsoft Sentinel Solution for SAP** solution.
- Relevant watchlists, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists).

## Next steps

Learn more about the Microsoft Sentinel Solution for SAP:

- [Deploy Microsoft Sentinel Solution for SAP](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel Solution for SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy and configure container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy SAP security content](deploy-sap-security-content.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel Solution for SAP deployment](sap-deploy-troubleshoot.md)
- [Configure SAP Transport Management System](configure-transport.md)

Reference files:

- [Microsoft Sentinel Solution for SAP data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel Solution for SAP: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
