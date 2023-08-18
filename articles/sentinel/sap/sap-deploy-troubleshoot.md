---
title: Microsoft Sentinel solution for SAP® applications deployment troubleshooting
description: Learn how to troubleshoot specific issues that may occur in your Microsoft Sentinel solution for SAP® applications deployment.
author: limwainstein
ms.author: lwainstein
ms.topic: troubleshooting
ms.date: 01/09/2023
---

# Troubleshooting your Microsoft Sentinel solution for SAP® applications deployment

## Useful Docker commands

When troubleshooting your Microsoft Sentinel for SAP data connector, you may find the following commands useful:

|Function  |Command  |
|---------|---------|
|**Stop the Docker container**     |  `docker stop sapcon-[SID]`       |
|**Start the Docker container**     |`docker start sapcon-[SID]`         |
|**View Docker system logs**     |  `docker logs -f sapcon-[SID]`       |
|**Enter the Docker container**     |   `docker exec -it sapcon-[SID] bash`      |


For more information, see the [Docker CLI documentation](https://docs.docker.com/engine/reference/commandline/docker/).

## Review system logs

We highly recommend that you review the system logs after installing or [resetting the data connector](#reset-the-microsoft-sentinel-for-sap-data-connector).

Run:

```bash
docker logs -f sapcon-[SID]
```

## Enable/disable debug mode printing

**Enable debug mode printing**:

1. On your VM, edit the **/opt/sapcon/[SID]/systemconfig.ini** file.

1. Define the **General** section if it wasn't previously defined. In this section, define `logging_debug = True`.

    For example:

    ```Python
    [General]
    logging_debug = True
    ```

1. Save the file.

The change takes effect two minutes after you save the file. You don't need to restart the Docker container.

**Disable debug mode printing**:

1. On your VM, edit the **/opt/sapcon/[SID]/systemconfig.ini** file.

1. In the **General** section, define `logging_debug = False`.

    For example:

    ```Python
    [General]
    logging_debug = False
    ```

1. Save the file.

The change takes effect two minutes after you save the file. You don't need to restart the Docker container.

## View all container execution logs

Connector execution logs for your Microsoft Sentinel solution for SAP® applications data connector deployment are stored on your VM in **/opt/sapcon/[SID]/log/**. Log filename is **OmniLog.log**. A history of logfiles is kept, suffixed with *.[number]* such as **OmniLog.log.1**, **OmniLog.log.2** etc

## Review and update the Microsoft Sentinel for SAP data connector configuration

If you want to check the Microsoft Sentinel for SAP data connector configuration file and make manual updates, perform the following steps:

1. On your VM, open the **sapcon/[SID]/systemconfig.ini** file.

1. Update the configuration if needed, and save the file.

The change takes effect two minutes after you save the file. You don't need to restart the Docker container.

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

### Missing IP address or transaction code fields in the SAP audit log

This solution allows SAP systems with versions for SAP BASIS 7.5 SP12 and above to reflect additional fields in the `ABAPAuditLog_CL` and `SAPAuditLog` tables. 

If you're using SAP BASIS versions higher than 7.5 SP12 and missing IP address or transaction code fields in the SAP audit log, verify that the SAP system from which you're extracting the data contains the relevant change requests (transports). To learn more, review the [Retrieve additional information from SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#retrieve-additional-information-from-sap-optional) section in the prerequisites.

### No data is showing in the SAP table data log

This solution allows SAP systems with versions for SAP BASIS 7.5 SP12 and above to reflect table data log changes in the `ABAPTableDataLog_CL` table. 

If no data is showing in the `ABAPTableDataLog_CL` table, verify that the SAP system from which you're extracting the data contains the relevant change requests (transports). To learn more, review the [Retrieve additional information from SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#retrieve-additional-information-from-sap-optional) section in the prerequisites.

## Common issues

After having deployed both the Microsoft Sentinel for SAP data connector and security content, you may experience the following errors or issues:

### Corrupt or missing SAP SDK file

This error may occur when the connector fails to boot with PyRfc, or zip-related error messages are shown.

1. Reinstall the SAP SDK.
1. Verify that you're the correct Linux 64-bit version. As of the current date, the release filename is: **nwrfc750P_8-70002752.zip**.

If you'd installed the data connector manually, make sure that you'd copied the SDK file into the Docker container.

Run:

```bash
Docker cp SDK by running docker cp nwrfc750P_8-70002752.zip /sapcon-app/inst/
```

### ABAP runtime errors appear on a large system

If ABAP runtime errors appear on large systems, try setting a smaller chunk size:

1. Edit the **/opt/sapcon/[SID]/systemconfig.ini** file and in the **Connector Configuration** section define `timechunk = 5`.

    For example:

    ```Python
    [Connector Configuration]
    timechunk = 5
    ```

1. save the file.

The change takes effect two minutes after you save the file. You don't need to restart the Docker container.

> [!NOTE]
> The **timechunk** size is defined in minutes.

### Empty or no audit log retrieved, with no special error messages

1. Check that audit logging is enabled in SAP.
1. Verify the **SM19** or **RSAU_CONFIG** transactions.
1. Enable any events as needed.
1. Verify whether messages arrive and exist in the SAP **SM20** or **RSAU_READ_LOG**, without any special errors appearing on the connector log.


### Incorrect Microsoft Sentinel workspace ID or key

If you realize that you've entered an incorrect workspace ID or key in your deployment script, update the credentials stored in Azure key vault.

After verifying your credentials in Azure KeyVault, restart the container:

```bash
docker restart sapcon-[SID]
```

### Incorrect SAP ABAP user credentials in a fixed configuration

A fixed configuration is when the password is stored directly in the **systemconfig.ini** configuration file.

If your credentials there are incorrect, verify your credentials.

Use base64 encryption to encrypt the user and password. You can use online encryption tools to do encrypt your credentials, such as https://www.base64encode.org/.

### Incorrect SAP ABAP user credentials in key vault

Check your credentials and fix them as needed, applying the correct values to the **ABAPUSER** and **ABAPPASS** values in Azure Key Vault.

Then, restart the container:

```bash
docker restart sapcon-[SID]
```


### Missing ABAP (SAP user) permissions

If you get an error message similar to: **..Missing Backend RFC Authorization..**, your SAP authorizations and role weren't applied properly.

1. Ensure that the **MSFTSEN/SENTINEL_CONNECTOR** role was imported as part of a [change request](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) transport, and applied to the connector user.

1. Run the role generation and user comparison process using the SAP transaction PFCG.

### Missing data in your workbooks or alerts

If you find that you're missing data in your Microsoft Sentinel workbooks or alerts, ensure that the **Auditlog** policy is properly enabled on the SAP side, with no errors in the log file. 

Use the **RSAU_CONFIG_LOG** transaction for this step.


### Missing SAP change request

If you see errors that you're missing a required SAP change request, make sure you've imported the correct SAP change request for your system.

For more information, see [ValidateSAP environment validation steps](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps).

### Network connectivity issues

If you're having network connectivity issues to the SAP environment or to Microsoft Sentinel, check your network connectivity to make sure data is flowing as expected.

Common issues include:

- Firewalls between the docker container and the SAP hosts may be blocking traffic. The SAP host receives communication via the following TCP ports, which must be open: **32xx**, **5xx13**, and **33xx**, where **xx** is the SAP instance number.

- Outbound communication from your SAP host to Microsoft Container Registry or Azure requires proxy configuration. This typically impacts the installation and requires you to configure the `HTTP_PROXY` and `HTTPS_PROXY` environmental variables. You can also ingest environment variables into the docker container when you create the container, by adding the `-e` flag to the docker `create` / `run` command.

### Other unexpected issues

If you have unexpected issues not listed in this article, try the following steps:

- [Reset the connector and reload your logs](#reset-the-microsoft-sentinel-for-sap-data-connector)
- [Upgrade the connector](update-sap-data-connector.md) to the latest version.

> [!TIP]
> Resetting your connector and ensuring that you have the latest upgrades are also recommended after any major configuration changes.

### Retrieving an audit log fails with warnings

If you attempt to retrieve an audit log, without the [required change request](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps) deployed or on an older / unpatched version, and the process fails with warnings, verify that the SAP Auditlog can be retrieved using one of the following methods:

- Using a compatibility mode called *XAL* on older versions
- Using a version not recently patched
- Without the required change request installed

While your system should automatically switch to compatibility mode if needed, you may need to switch it manually. To switch to compatibility mode manually:

1. Edit the **/opt/sapcon/[SID]/systemconfig.ini** file

1. In the **Connector Configuration** section defineefine: `auditlogforcexal = True`

    For example:

    ```Python
    [Connector Configuration]
    auditlogforcexal = True
    ```

1. save the file.

The change takes effect two minutes after you save the file. You don't need to restart the Docker container.

### SAPCONTROL or JAVA subsystems unable to connect

Check that the OS user is valid and can run the following command on the target SAP system:

```bash
sapcontrol -nr <SID> -function GetSystemInstanceList
```

### SAPCONTROL or JAVA subsystem fails with timezone-related error message

If your SAPCONTROL or JAVA subsystem fails with a timezone-related error message, such as: **Please check the configuration and network access to the SAP server - 'Etc/NZST'**, make sure that you're using standard timezone codes.

For example, use `javatz = GMT+12` or `abaptz = GMT-3**`.


### Unable to import the change request transports to SAP

If you're not able to import the [required SAP log change requests](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#sap-environment-validation-steps) and are getting an error about an invalid component version, add `ignore invalid component version` when you import the change request.

### Audit log data not ingested past initial load

If the SAP audit log data, visible in either the **RSAU_READ_LOAD** or **SM200** transactions, isn't ingested into Microsoft Sentinel past the initial load, you may have a misconfiguration of the SAP system and the SAP host operating system.

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

1. Update the SAP system and the SAP host operating system to have matching settings, such as the same time zone. For more information, see the [SAP Community Wiki](https://wiki.scn.sap.com/wiki/display/Basis/Time+zone+settings%2C+SAP+vs.+OS+level).

1. Start the container again. Run:

    ```bash
    docker start sapcon-[SID]
    ```

## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications solution data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications solution: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).

