---
title: Azure Sentinel SAP solution deployment troubleshooting | Microsoft Docs
description: Learn how to troubleshoot specific issues that may occur in your Azure Sentinel SAP solution deployment.
author: batamig
ms.author: bagold
ms.service: azure-sentinel
ms.topic: tutorial
ms.custom: mvc
ms.date: 07/06/2021
ms.subservice: azure-sentinel

---

# Troubleshooting your Azure Sentinel SAP solution deployment

## Common issues

After having deployed both the SAP data connector and security content, you may experience the following errors or issues:

|Issue  |Workaround  |
|---------|---------|
|Network connectivity issues to the SAP environment or to Azure Sentinel     |  Check your network connectivity as needed.       |
|Incorrect SAP ABAP user credentials     |Check your credentials and fix them by applying the correct values to the **ABAPUSER** and **ABAPPASS** values in Azure Key Vault.         |
|Missing permissions, such as the **/MSFTSEN/SENTINEL_CONNECTOR** role not assigned to the SAP user as needed, or inactive     |Fix this error by assigning the role and ensuring that it's active in your SAP system.         |
|A missing SAP change request     | Make sure that you've imported the correct SAP change request, as described in [Configure your SAP system](sap-deploy-solution.md#configure-your-sap-system).        |
|Incorrect Azure Sentinel workspace ID or key entered in the deployment script     |  To fix this error, enter the correct credentials in Azure KeyVault.       |
|A corrupt or missing SAP SDK file     | Fix this error by reinstalling the SAP SDK and ensuring that you are using the correct Linux 64-bit version.        |
|Missing data in your workbook or alerts     |    Ensure that the **Auditlog** policy is properly enabled on the SAP side, with no errors in the log file. Use the **RSAU_CONFIG_LOG** transaction for this step.     |
| Unexpected issues <br><br>**Note**: Also use these steps after any major configuration changes  | Do one of the following: <br><br>**Try resetting the connector and reloading your logs**. <br>The following steps reset the connector and reload the logs from the last 24 hours.<br> 1. Stop the connector: `docker stop sapcon-SID`<br>2. Delete the **metadata.db** file from the **sapcon/SID** directory. <br>3.  Start the connector again by running `docker start sapcon-SID`. <br>3. [Review your system logs](#review-system-logs).<br><br>**Try upgrading the the connector to the latest version.**<br>For more information, see [Update your SAP data connector](sap-deploy-solution.md#update-your-sap-data-connector). |
|   Empty or no audit log retrieved, with no special error messages   |  1. Check that audit logging is enabled in SAP. <br>2. Verify transactions **SM19** and **RASU_CONFIG**. <br>3. Enable any events as needed. <br>4. Verify whether messages arrive and exist in the SAP **SM20** or **RSAU_READ_LOG**, without any special errors appearing on the connector log. |
|  Retrieving the audit log without the required change request deployed, or on an older / un-patched version, fails with warnings   |    Verify that the SAP Auditlog can be retrieved using a compatible mode called XAL on older versions, a version not recently patched, or without the required change request installed.<br><br>While your system should automatically switch to compatibility mode if needed, you may need to switch it manually. <br><br>**To switch to compatibility mode manually**: <br>In the **sapcon/SID** directory, edit the **systemconfig.ini** file and define: `auditlogforcexal = True` <br><br>For more information, see [Required SAP log change requests](sap-solution-detailed-requirements.md#required-sap-log-change-requests).   |
|     |         |

## Review system logs

We highly recommend that you review the system logs after installing the data connector.

Run:

```bash
docker logs -f sapcon-[SID]
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

## Review and update the SAP data connector configuration

If you want to check the SAP data connector configuration file and make manual updates, perform the following steps:

1. On your VM, in the user's home directory, open the **~/sapcon/[SID]/systemconfig.ini** file.
1. Update the configuration if needed, and then restart the container:

    ```bash
    docker restart sapcon-[SID]
    ```

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
