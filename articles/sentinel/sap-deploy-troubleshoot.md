---
title: Azure Sentinel SAP solution deployment troubleshooting | Microsoft Docs
description: Learn how to troubleshoot specific issues that may occur in your Azure Sentinel SAP solution deployment.
author: batamig
ms.author: bagold
ms.service: azure-sentinel
ms.topic: troubleshooting
ms.custom: mvc
ms.date: 08/09/2021
ms.subservice: azure-sentinel

---

# Troubleshooting your Azure Sentinel SAP solution deployment

## Useful Docker commands

When troubleshooting your SAP data connector, you may find the following commands useful:

|Function  |Command  |
|---------|---------|
|**Stop the Docker container**     |  `docker stop sapcon-[SID]`       |
|**Start the Docker container**     |`docker start sapcon-[SID]`         |
|**View Docker system logs**     |  `docker logs -f sapcon-[SID]`       |
|**Enter the Docker container**     |   `docker exec -it sapcon-[SID] bash`      |
|     |         |

For more information, see the [Docker CLI documentation](https://docs.docker.com/engine/reference/commandline/docker/).

## Review system logs

We highly recommend that you review the system logs after installing or [resetting the data connector](#reset-the-sap-data-connector).

Run:

```bash
docker logs -f sapcon-[SID]
```

## Enable debug mode printing

**To enable debug mode printing**:

1. Copy the following file to your **sapcon/[SID]** directory, and then rename it as `loggingconfig.yaml`: https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/loggingconfig_DEV.yaml

1. [Reset the SAP data connector](#reset-the-sap-data-connector).

For example, for SID `A4H`:

```bash
wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/loggingconfig_DEV.y
              cp loggingconfig.yaml ~/sapcon/A4H
              docker restart sapcon-A4H
```

**To disable debug mode printing again, run**:

```bash
mv loggingconfig.yaml loggingconfig.old
ls
docker restart sapcon-[SID]
```

## View all Docker execution logs

To view all Docker execution logs for your Azure Sentinel SAP data connector deployment, run one of the following commands:

```bash
docker exec -it sapcon-[SID] bash && cd /sapcon-app/sapcon/logs
```

or

```bash
docker exec –it sapcon-[SID] cat /sapcon-app/sapcon/logs/[FILE_LOGNAME]
```

Output similar to the following should be displayed:

```bash
Logs directory:
root@644c46cd82a9:/sapcon-app# ls sapcon/logs/ -l
total 508
-rwxr-xr-x 1 root root      0 Mar 12 09:22 ' __init__.py'
-rw-r--r-- 1 root root    282 Mar 12 16:01  ABAPAppLog.log
-rw-r--r-- 1 root root   1056 Mar 12 16:01  ABAPAuditLog.log
-rw-r--r-- 1 root root    465 Mar 12 16:01  ABAPCRLog.log
-rw-r--r-- 1 root root    515 Mar 12 16:01  ABAPChangeDocsLog.log
-rw-r--r-- 1 root root    282 Mar 12 16:01  ABAPJobLog.log
-rw-r--r-- 1 root root    480 Mar 12 16:01  ABAPSpoolLog.log
-rw-r--r-- 1 root root    525 Mar 12 16:01  ABAPSpoolOutputLog.log
-rw-r--r-- 1 root root      0 Mar 12 15:51  ABAPTableDataLog.log
-rw-r--r-- 1 root root    495 Mar 12 16:01  ABAPWorkflowLog.log
-rw-r--r-- 1 root root 465311 Mar 14 06:54  API.log # view this log to see submits of data into Azure Sentinel
-rw-r--r-- 1 root root      0 Mar 12 15:51  LogsDeltaManager.log
-rw-r--r-- 1 root root      0 Mar 12 15:51  PersistenceManager.log
-rw-r--r-- 1 root root   4830 Mar 12 16:01  RFC.log
-rw-r--r-- 1 root root   5595 Mar 12 16:03  SystemAdmin.log
```

To copy your logs to the host operating system, run:

```bash
docker cp sapcon-[SID]:/sapcon-app/sapcon/logs /directory
```

For example:

```bash
docker cp sapcon-A4H:/sapcon-app/sapcon/logs /tmp/sapcon-logs-extract
```

## Review and update the SAP data connector configuration

If you want to check the SAP data connector configuration file and make manual updates, perform the following steps:

1. On your VM, in the user's home directory, open the **~/sapcon/[SID]/systemconfig.ini** file.
1. Update the configuration if needed, and then restart the container:

    ```bash
    docker restart sapcon-[SID]
    ```

## Reset the SAP data connector

The following steps reset the connector and re-ingest SAP logs from the last 24 hours.

1.	Stop the connector. Run:

    ```bash
    docker stop sapcon-[SID]
    ```

1.	Delete the **metadata.db** file from the **sapcon/[SID]** directory. Run:

    ```bash
    cd ~/sapcon/<SID>
    ls
    mv metadata.db metadata.old
    ```

    > [!NOTE]
    > The **metadata.db** file contains the last timestamp for each of the logs, and works to prevent duplication.

1. Start the connector again. Run:

    ```bash
    docker start sapcon-[SID]
    ```

Make sure to [Review system logs](#review-system-logs) when you're done.



## Common issues

After having deployed both the SAP data connector and security content, you may experience the following errors or issues:

### Corrupt or missing SAP SDK file

This occurs when the connector fails to boot with PyRfc, or zip-related error messages are shown.

1. Reinstall the SAP SDK.
1. Verify that you're the correct Linux 64-bit version. As of the current date, the release filename is: **nwrfc750P_8-70002752.zip**.

If you'd installed the data connector manually, make sure that you'd copied the SDK file into the Docker container.

Run:

```bash
Docker cp SDK by running docker cp nwrfc750P_8-70002752.zip /sapcon-app/inst/
```

### ABAP runtime errors appear on a large system

If ABAP runtime errors appear on large systems, try setting a smaller chunk size:

1. Edit the **sapcon/SID/systemconfig.ini** file and define `timechunk = 5`.
2. [Reset the SAP data connector](#reset-the-sap-data-connector).

> [!NOTE]
> The **timechunk** size is defined in minutes.

### Empty or no audit log retrieved, with no special error messages

1. Check that audit logging is enabled in SAP.
1. Verify the **SM19** or **RSAU_CONFIG** transactions.
1. Enable any events as needed.
1. Verify whether messages arrive and exist in the SAP **SM20** or **RSAU_READ_LOG**, without any special errors appearing on the connector log.


### Incorrect Azure Sentinel workspace ID or key

If you realize that you've entered an incorrect workspace ID or key in your [deployment script](sap-deploy-solution.md#create-key-vault-for-your-sap-credentials), update the credentials stored in Azure KeyVault.

After verifying your credentials in Azure KeyVault, restart the container:

```bash
docker restart sapcon-[SID]
```

### Incorrect SAP ABAP user credentials in a fixed configuration

A fixed configuration is when the password is stored directly in the **systemconfig.ini** configuration file.

If your credentials there are incorrect, verify your credentials.

Use base64 encryption to encrypt the user and password. You can use online encryption tools to do this, such as https://www.base64encode.org/.

### Incorrect SAP ABAP user credentials in key vault

Check your credentials and fix them as needed, applying the correct values to the **ABAPUSER** and **ABAPPASS** values in Azure Key Vault.

Then, restart the container:

```bash
docker restart sapcon-[SID]
```


### Missing ABAP (SAP user) permissions

If you get an error message similar to: **..Missing Backend RFC Authorization..**, your SAP authorizations and role were not applied properly.

1. Ensure that the **MSFTSEN/SENTINEL_CONNECTOR** role was imported as part of a [change request](sap-solution-detailed-requirements.md#required-sap-log-change-requests) transport, and applied to the connector user.

1. Run the role generation and user comparison process using the SAP transaction PFCG.

### Missing data in your workbooks or alerts

If you find that you're missing data in your Azure Sentinel workbooks or alerts, ensure that the **Auditlog** policy is properly enabled on the SAP side, with no errors in the log file. 

Use the **RSAU_CONFIG_LOG** transaction for this step.


### Missing SAP change request

If you see errors that you're missing a required [SAP change request](sap-solution-detailed-requirements.md#required-sap-log-change-requests), make sure you've imported the correct SAP change request for your system.

For more information, see [Configure your SAP system](sap-deploy-solution.md#configure-your-sap-system).

### Network connectivity issues

If you're having network connectivity issues to the SAP environment or to Azure Sentinel, check your network connectivity to make sure data is flowing as expected.

### Other unexpected issues

If you have unexpected issues not listed in this article, try the following:

- [Reset the connector and reload your logs](#reset-the-sap-data-connector)
- [Upgrade the the connector](sap-deploy-solution.md#update-your-sap-data-connector) to the latest version.

> [!TIP]
> Resetting your connector and ensuring that you have the latest upgrades are also recommended after any major configuration changes.

### Retrieving an audit log fails with warnings

If your attempt to retrieve an audit log, without the [required change request](sap-solution-detailed-requirements.md#required-sap-log-change-requests) deployed or on an older / un-patched version, and the process fails with warnings, verify that the SAP Auditlog can be retrieved using one of the following methods:

- Using a compatibility mode called *XAL* on older versions
- Using a version not recently patched
- Without the required change request installed

While your system should automatically switch to compatibility mode if needed, you may need to switch it manually. To switch to compatibility mode manually:

1. In the **sapcon/SID** directory, edit the **systemconfig.ini** file

1. Define: `auditlogforcexal = True`

1. Restart the Docker container:

    ```bash
    docker restart sapcon-[SID]
    ```

### SAPCONTROL or JAVA subsystems unable to connect

Check that the OS user is valid and can run the following command on the target SAP system:

```bash
sapcontrol -nr <SID> -function GetSystemInstanceList
```

### SAPCONTROL or JAVA subsystem fails with timezone related error message

If your SAPCONTROL or JAVA subsystem fails with a timezone-related error message, such as: **Please check the configuration and network access to the SAP server - 'Etc/NZST'**, make sure that you're using standard timezone codes.

For example, use `javatz = GMT+12` or `abaptz = GMT-3**`.


### Unable to import the change request transports to SAP

If you're not able to import the [required SAP log change requests](sap-solution-detailed-requirements.md#required-sap-log-change-requests) and are getting an error about an invalid component version, add `ignore invalid component version` when you import the change request.

### Audit log data not ingested past initial load

If the SAP audit log data, visible in either the **RSAU_READ_LOAD** or **SM200** transactions, is not ingested into Azure Sentinel past the initial load, you may have a misconfiguration of the SAP system and the SAP host operating system.

- Initial loads are ingested after a fresh installation of the SAP data connector, or after the **metadata.db** file is deleted.
- A sample misconfiguration might be when your SAP system timezone is set to **CET** in the **STZAC** transaction, but the SAP host operating system time zone is set to **UTC**.

To check for misconfigurations, run the **RSDBTIME** report in transaction **SE38**. If you find a mismatch between the SAP system and the SAP host operating system:

1. Stop the Docker container. Run

    ```bash
    docker stop sapcon-[SID]
    ```

1.	Delete the **metadata.db** file from the **sapcon/[SID]** directory. Run:

    ```bash
    rm ~/sapcon/[SID]/metadata.db
    ```

1. Update the SAP system and the SAP host operating system to have matching settings, such as the same time zone. For more information, see the [SAP Community Wiki](https://wiki.scn.sap.com/wiki/display/Basis/Time+zone+settings%2C+SAP+vs.+OS+level).

1. Start the container again. Run:

    ```bash
    docker start sapcon-[SID]
    ```

## Next steps

For more information, see:

- [Deploy SAP continuous threat monitoring (public preview)](sap-deploy-solution.md)
- [Azure Sentinel SAP solution logs reference (public preview)](sap-solution-log-reference.md)
- [Expert configuration options, on-premises deployment and SAPControl log sources](sap-solution-deploy-alternate.md)
- [Azure Sentinel SAP solution: security content reference (public preview)](sap-solution-security-content.md)
- [Azure Sentinel SAP solution detailed SAP requirements (public preview)](sap-solution-detailed-requirements.md)
