---
title: Troubleshoot the Microsoft Sentinel solution for SAP applications data connector agent
description: Learn how to troubleshoot specific issues that might occur in your Microsoft Sentinel solution for SAP applications data connector agent deployment.
author: batamig
ms.author: bagol
ms.topic: troubleshooting
ms.date: 11/07/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#Customer intent: As an SAP BASIS team member, I want to troubleshoot issues with my Microsoft Sentinel for SAP applications data connector agent so that I can ensure accurate and timely data ingestion and monitoring.

---

# Troubleshooting your Microsoft Sentinel solution for SAP applications deployment

This article includes troubleshooting steps to help you ensure accurate and timely data ingestion and monitoring for your SAP environment with Microsoft Sentinel and the data connector agent.

Selected troubleshooting procedures are only relevant when your data connector agent is [deployed via the command line](deploy-command-line.md). If you used the recommended procedure to [deploy the agent from the portal](deploy-data-connector-agent-container.md), use the portal to make any configuration changes.

> [!NOTE]
> This article is relevant only for the data connector agent, and isn't relevant for the [SAP agentless solution](deployment-overview.md#data-connector) (limited preview).
>

## Useful Docker commands

When troubleshooting your Microsoft Sentinel for SAP data connector, you might find the following commands useful:

| Function  | Command  |
| --------- | -------- |
| **Stop the Docker container**  | `docker stop sapcon-[SID]`          |
| **Start the Docker container** | `docker start sapcon-[SID]`         |
| **View Docker system logs**    | `docker logs -f sapcon-[SID]`       |
| **Enter the Docker container** | `docker exec -it sapcon-[SID] bash` |


For more information, see the [Docker CLI documentation](https://docs.docker.com/engine/reference/commandline/docker/).

## Review system logs

We highly recommend that you review the system logs after installing or [resetting the data connector](#reset-the-microsoft-sentinel-for-sap-data-connector).

Run:

```bash
docker logs -f sapcon-[SID]
```

## Enable/disable debug mode printing

This procedure is only supported if you've deployed the [data connector agent from the command line](deploy-command-line.md). 

1. On your data collector agent container virtual machine, edit the [**/opt/sapcon/[SID]/systemconfig.json**](reference-systemconfig-json.md) file.

1. Define the **General** section if it wasn't previously defined. In this section, define `logging_debug = True` to enable debug mode printing, or `logging_debug = False` to disable it.

    For example:

    ```json
    [General]
    logging_debug = True
    ```

1. Save the file.

The change takes effect approximately two minutes after you save the file. You don't need to restart the Docker container.

## View all container execution logs

Connector execution logs for your Microsoft Sentinel solution for SAP applications data connector deployment are stored on your VM in **/opt/sapcon/[SID]/log/**. Log filename is **OmniLog.log**. A history of logfiles is kept, suffixed with *.[number]* such as **OmniLog.log.1**, **OmniLog.log.2**, and so on.

## Review and update the Microsoft Sentinel for SAP agent connector configuration file

This procedure is only supported if you've deployed the [data connector agent from the command line](deploy-command-line.md).  If you [deployed your agent via the portal](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent-from-the-portal-preview), continue to maintain and change configuration settings via the portal.

If you deployed via the command line, perform the following steps:

1. On your VM, open the configuration file: **sapcon/[SID]/systemconfig.json**

1. Update the configuration if needed, and save the file. For more information, see the [Microsoft Sentinel solution for SAP applications `systemconfig.json` file reference](reference-systemconfig-json.md).

The change takes effect approximately two minutes after you save the file. You don't need to restart the Docker container.

## Reset the Microsoft Sentinel for SAP data connector

The following steps reset the connector and reingest SAP logs from the last 30 minutes.

1.	Stop the connector. Run:

    ```bash
    docker stop sapcon-[SID]
    ```

1.	Delete the **metadata.db** file from the **/opt/sapcon/[SID]** directory. Run:

    ```bash
    cd /opt/sapcon/<SID>
    rm metadata.db
    ```

    > [!NOTE]
    > The **metadata.db** file contains the last timestamp for each of the logs, and works to prevent duplication.

1. Start the connector again. Run:

    ```bash
    docker start sapcon-[SID]
    ```

Make sure to [Review system logs](#review-system-logs) when you're done.

## Common issues

After having deployed both the Microsoft Sentinel for SAP data connector and security content, you might experience the following errors or issues:

### Corrupt or missing SAP SDK file

This error might occur when the connector fails to boot with PyRfc, or zip-related error messages are shown.

1. Reinstall the SAP SDK.
1. Verify that you're the correct Linux 64-bit version, such as **nwrfc750P_8-70002752.zip**.

If you'd installed the data connector manually, make sure that you'd copied the SDK file into the Docker container.

Run:

```bash
docker cp nwrfc750P_8-70002752.zip /sapcon-app/inst/
```

### ABAP runtime errors appear on a large system

This procedure is only supported if you've deployed the [data connector agent from the command line](deploy-command-line.md).  

If ABAP runtime errors appear on large systems, try setting a smaller chunk size:

1. Edit the [**/opt/sapcon/[SID]/systemconfig.json**](reference-systemconfig-json.md) file and in the **Connector Configuration** section define `timechunk = 5`.

    For example:

    ```json
    [Connector Configuration]
    timechunk = 5
    ```

1. Save the file.

The change takes effect approximately two minutes after you save the file. You don't need to restart the Docker container.

> [!NOTE]
> The **timechunk** size is defined in minutes.

### Empty or no audit log retrieved, with no special error messages

1. Check that audit logging is enabled in SAP.
1. Verify the **SM19** or **RSAU_CONFIG** transactions.
1. Enable any events as needed.
1. Verify whether messages arrive and exist in the SAP **SM20** or **RSAU_READ_LOG**, without any special errors appearing on the connector log.

### Incorrect workspace ID or key in key vault

If you realize that you entered an incorrect workspace ID or key in your deployment script, update the credentials stored in Azure key vault.

After verifying your credentials in Azure KeyVault, restart the container:

```bash
docker restart sapcon-[SID]
```

### Incorrect SAP ABAP user credentials in key vault

Check your credentials and fix them as needed, applying the correct values to the **ABAPUSER** and **ABAPPASS** values in Azure Key Vault.

Then, restart the container:

```bash
docker restart sapcon-[SID]
```

### Incorrect SAP ABAP user credentials in a fixed configuration

This section is only supported if you've deployed the [data connector agent from the command line](deploy-command-line.md). 

A fixed configuration is when the password is stored directly in the [**systemconfig.json**](reference-systemconfig-json.md) configuration file.

If your credentials there are incorrect, verify your credentials.

Use base64 encryption to encrypt the user and password. You can use online encryption tools to do encrypt your credentials, such as https://www.base64encode.org/.


### Missing ABAP (SAP user) permissions

If you get an error message similar to: **..Missing Backend RFC Authorization..**, your SAP authorizations and role weren't applied properly.

1. Ensure that the **MSFTSEN/SENTINEL_CONNECTOR** role was imported as part of a [change request](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) transport, and applied to the connector user.

1. Run the role generation and user comparison process using the SAP transaction PFCG.

### Missing data in your workbooks or alerts

If you find that you're missing data in your Microsoft Sentinel workbooks or alerts, ensure that the **Auditlog** policy is properly enabled on the SAP side, with no errors in the container log file.

Use the **RSAU_CONFIG_LOG** transaction for this step.

For more information, see the [SAP documentation](https://community.sap.com/t5/application-development-blog-posts/analysis-and-recommended-settings-of-the-security-audit-log-sm19-rsau/ba-p/13297094) and [Collect SAP HANA audit logs in Microsoft Sentinel](collect-sap-hana-audit-logs.md).

We recommend that you configure auditing for *all* messages from the audit log, instead of only specific logs. Ingestion cost differences are generally minimal and the data is useful for Microsoft Sentinel detections and in post-compromise investigations and hunting. For more information, see [Configure SAP auditing](preparing-sap.md#configure-sap-auditing).

### Missing IP address or transaction code fields in the SAP audit log

In SAP systems with versions for SAP BASIS 7.5 SP12 and above, Microsoft Sentinel can reflect extra fields in the `ABAPAuditLog_CL` and `SAPAuditLog` tables. 

If you're using SAP BASIS versions higher than 7.5 SP12 and are missing IP address or transaction code fields in the SAP audit log, verify that the SAP system from which you're extracting the data contains the relevant change requests (transports). For more information, see [Configure support for extra data retrieval (recommended)](preparing-sap.md#configure-support-for-extra-data-retrieval-recommended).

### Missing SAP change request

If you see errors that you're missing a required SAP change request, make sure you've imported the correct SAP change request for your system. For more information, see [SAP prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-prerequisites-for-the-data-connector-agent-container) and [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md).


### No data is showing in the SAP table data log

In SAP systems with versions for SAP BASIS 7.5 SP12 and above, Microsoft Sentinel can reflect table data log changes in the `ABAPTableDataLog_CL` table. 

If no data is showing in the `ABAPTableDataLog_CL` table, verify that the SAP system from which you're extracting the data contains the relevant change requests (transports). For more information, see [Configure support for extra data retrieval (recommended)](preparing-sap.md#configure-support-for-extra-data-retrieval-recommended).

### No records / late records

The data collector agent relies on time zone information to be correct. If you see that there are no records in the SAP audit and change logs, or if records are constantly a few hours behind, check whether the SAP *TZCUSTHELP* report presents any errors. For more information, see [SAP note 481835](<https://me.sap.com/notes/481835/E>).

There might also be issues with the clock on the virtual machine where the data collector agent container is hosted, and any deviation from the clock on the VM from UTC impacts data collection. Even more importantly, the clocks on both the SAP system machines and the data collector agent machines must match.

We recommend that you configure auditing for *all* messages from the audit log, instead of only specific logs. Ingestion cost differences are generally minimal and the data is useful for Microsoft Sentinel detections and in post-compromise investigations and hunting. For more information, see [Configure SAP auditing](preparing-sap.md#configure-sap-auditing).

### Network connectivity issues

If you're having network connectivity issues to the SAP environment or to Microsoft Sentinel, check your network connectivity to make sure data is flowing as expected.

Common issues include:

- Firewalls between the docker container and the SAP hosts might be blocking traffic. The SAP host receives communication via the following TCP ports, which must be open: **32xx**, **5xx13**, and **33xx**, where **xx** is the SAP instance number.

- Outbound communication from your SAP agent host to Microsoft Container Registry or Azure requires proxy configuration. This typically impacts the installation and requires you to configure the `HTTP_PROXY` and `HTTPS_PROXY` environmental variables. You can also ingest environment variables into the docker container when you create the container, by adding the `-e` flag to the docker `create` / `run` command.

### Retrieving an audit log fails with warnings

This section is only supported if you've deployed the [data connector agent from the command line](deploy-command-line.md). 

If you attempt to retrieve an audit log without the [required configurations](preparing-sap.md#configure-sap-auditing) and the process fails with warnings, verify that the SAP Auditlog can be retrieved using one of the following methods:

- Using a compatibility mode called *XAL* on older versions
- Using a version not recently patched
- Without any changes made for connecting to the Microsoft Sentinel data connector agent. For more information, see [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md).

While your system should automatically switch to compatibility mode if needed, you might need to switch it manually. To switch to compatibility mode manually:

1. Edit the [**/opt/sapcon/[SID]/systemconfig.json**](reference-systemconfig-json.md) file.

1. In the **Connector Configuration** section defineefine: `auditlogforcexal = True`

    For example:

    ```json
    [Connector Configuration]
    auditlogforcexal = True
    ```

1. Save the file.

The change takes effect approximately two minutes after you save the file. You don't need to restart the Docker container.

### SAPCONTROL or JAVA subsystems unable to connect

Check that the OS user is valid and can run the following command on the target SAP system:

```bash
sapcontrol -nr <SID> -function GetSystemInstanceList
```

### SAPCONTROL or JAVA subsystem fails with timezone-related error message

If your SAPCONTROL or JAVA subsystem fails with a timezone-related error message, such as: **Please check the configuration and network access to the SAP server - 'Etc/NZST'**, make sure that you're using standard timezone codes.

For example, use `javatz = GMT+12` or `abaptz = GMT-3**`.

### Audit log data not ingested past initial load

If the SAP audit log data, visible in either the **RSAU_READ_LOAD** or **SM200** transactions, isn't ingested into Microsoft Sentinel past the initial load, you might have a misconfiguration of the SAP system and the SAP host operating system.

- Initial loads are ingested after a fresh installation of the Microsoft Sentinel for SAP data connector, or after the **metadata.db** file is deleted.
- A sample misconfiguration might be when your SAP system timezone is set to **CET** in the **STZAC** transaction, but the SAP host operating system time zone is set to **UTC**.

To check for misconfigurations, run the **RSDBTIME** report in transaction **SE38**. If you find a mismatch between the SAP system and the SAP host operating system:

1. Stop the Docker container. Run

    ```bash
    docker stop sapcon-[SID]
    ```

1.	Delete the **metadata.db** file from the **/opt/sapcon/[SID]** directory. Run:

    ```bash
    rm /opt/sapcon/[SID]/metadata.db
    ```

1. Update the SAP system and the SAP host operating system so that they have matching settings, such as the same time zone. For more information, see the [SAP Community Wiki](https://wiki.scn.sap.com/wiki/display/Basis/Time+zone+settings%2C+SAP+vs.+OS+level).

1. Start the container again. Run:

    ```bash
    docker start sapcon-[SID]
    ```

## Other unexpected issues

If you have unexpected issues not listed in this article, try the following steps:

- [Reset the connector and reload your logs](#reset-the-microsoft-sentinel-for-sap-data-connector)
- [Upgrade the connector](update-sap-data-connector.md) to the latest version.

> [!TIP]
> Resetting your connector and ensuring that you have the latest upgrades are also recommended after any major configuration changes.

## Related content

Learn more about the Microsoft Sentinel solution for SAP applications:

- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Connect your SAP system by deploying your data connector agent container](deploy-data-connector-agent-container.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Reference files:

- [Microsoft Sentinel solution for SAP applications solution data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP applications solution: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Microsoft Sentinel solution for SAP applications `systemconfig.json` file reference](reference-systemconfig-json.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).

