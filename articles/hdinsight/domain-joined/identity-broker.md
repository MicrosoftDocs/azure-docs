---
title: Use ID Broker (preview) for credential management- Azure HDInsight
description: Learn about HDInsight ID Broker to simplify authentication for domain-joined Apache Hadoop clusters.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: how-to
ms.date: 09/23/2020
---

# Azure HDInsight ID Broker (preview)

This article describes how to set up and use the HDInsight ID Broker (HIB) feature in Azure HDInsight. You can use this feature to get modern OAuth authentication to Apache Ambari while having Multi-Factor Authentication(MFA) enforcement without needing legacy password hashes in Azure Active Directory Domain Services (AAD-DS).

## Overview

HIB simplifies complex authentication setups in the following scenarios:

* Your organization relies on federation to authenticate users for accessing cloud resources. Previously, to use HDInsight Enterprise Security Package (ESP) clusters, you had to enable password hash sync from your on-premises environment to Azure Active Directory (Azure AD). This requirement might be difficult or undesirable for some organizations.

* Your organization would like to enforce MFA for web/HTTP based access to Apache Ambari and other cluster resources.

HIB provides the authentication infrastructure that enables protocol transition from OAuth (modern) to Kerberos (legacy) without needing to sync password hashes to AAD-DS. This infrastructure consists of components running on a Windows Server VM (ID Broker node), along with cluster gateway nodes.

Use the following table to determine the best authentication option based on your organization needs:

|Authentication options |HDInsight Configuration | Factors to consider |
|---|---|---|
| Fully OAuth | ESP + HIB | 1.	Most Secure option (MFA is supported) 2.	Pass hash sync is NOT required. 3.	No ssh/kinit/keytab access for on-prem accounts, which don't have password hash in AAD-DS. 4.	Cloud only accounts can still ssh/kinit/keytab. 5. Web-based access to Ambari through Oauth 6.	Requires updating legacy apps (JDBC/ODBC, etc.) to support OAuth.|
| OAuth + Basic Auth | ESP + HIB | 1. Web-based access to Ambari through Oauth 2. Legacy apps continue to use basic auth. 3. MFA must be disabled for basic auth access. 4. Pass hash sync is NOT required. 5. No ssh/kinit/keytab access for on-prem accounts, which don't have password hash in AAD-DS. 6. Cloud only accounts can still ssh/kinit. |
| Fully Basic Auth | ESP | 1. Most similar to on-prem setups. 2. Password hash sync to AAD-DS is required. 3. On-prem accounts can ssh/kinit or use keytab. 4. MFA must be disabled if the backing storage is ADLS Gen2 |

The following diagram shows the modern OAuth based authentication flow for all users, including federated users, after ID Broker is enabled:

:::image type="content" source="media/identity-broker/identity-broker-architecture.png" alt-text="Authentication flow with ID Broker":::

In this diagram, the client (i.e. browser or apps) need to acquire the OAuth token first and then present the token to gateway in an HTTP request. If you've already signed in to other Azure services, such as the Azure portal, you can sign in to your HDInsight cluster with a single sign-on (SSO) experience.

There still may be many legacy applications that only support basic authentication (i.e. username/password). For those scenarios, you can still use HTTP basic authentication to connect to the cluster gateways. In this setup, you must ensure network connectivity from the gateway nodes to the federation endpoint (AD FS endpoint) to ensure a direct line of sight from gateway nodes. 

The following diagram shows the basic authentication flow for federated users. First, the gateway attempts to complete the authentication using [ROPC flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth-ropc) and in case there is no password hashes synced to Azure AD, then it falls back to discovering AD FS endpoint and complete the authentication by accessing the AD FS endpoint.

:::image type="content" source="media/identity-broker/basic-authentication.png" alt-text="Architecture with basic authentication":::


## Enable HDInsight ID Broker

To create an ESP cluster with ID Broker enabled, take the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Follow the basic creation steps for an ESP cluster. For more information, see [Create an HDInsight cluster with ESP](apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp).
1. Select **Enable HDInsight ID Broker**.

The ID Broker feature will add one extra VM to the cluster. This VM is the ID Broker node and includes server components to support authentication. The ID Broker node is domain joined to the Azure AD DS domain.

![Option to enable ID Broker](./media/identity-broker/identity-broker-enable.png)

### Using Azure Resource Manager templates
If you add a new role called `idbrokernode` with the following attributes to the compute profile of your template, then the cluster will get created with the ID broker node enabled:

```json
.
.
.
"computeProfile": {
    "roles": [
        {
            "autoscale": null,
            "name": "headnode",
           ....
        },
        {
            "autoscale": null,
            "name": "workernode",
            ....
        },
        {
            "autoscale": null,
            "name": "idbrokernode",
            "targetInstanceCount": 1,
            "hardwareProfile": {
                "vmSize": "Standard_A2_V2"
            },
            "virtualNetworkProfile": {
                "id": "string",
                "subnet": "string"
            },
            "scriptActions": [],
            "dataDisksGroups": null
        }
    ]
}
.
.
.
```

## Tool integration

HDIsngith tools are updated to natively support OAuth. We highly recommend using these tools for modern OAuth based access to the clusters. The HDInsight [IntelliJ plug-in](https://docs.microsoft.com/azure/hdinsight/spark/apache-spark-intellij-tool-plugin#integrate-with-hdinsight-identity-broker-hib) can be used for JAVA based applications such as Scala. [Spark & Hive Tools for VS Code](https://docs.microsoft.com/azure/hdinsight/hdinsight-for-vscode) can be used of PySpark and Hive jobs. They supports both batch and interactive jobs.

## SSH access without a password hash in Azure AD DS

|SSH options |Factors to consider |
|---|---|
| Local VM account (e.g. sshuser) | 1.	You provided this account at the cluster creation time. 2.	There is no kerberos authication for this account |
| Cloud Only account (e.g. alice@contoso.onmicrosoft.com) | 1. The password hash is available in AAD-DS 2. Kerberos authentication is possible via SSH kerberos |
| On-prem account (e.g. alice@contoso.com) | 1. SSH Kerberos authentication is only possible if password hash is available in AAD-DS otherwise this user cannot SSH to the cluster |

To SSH to a domain-joined VM, or to run the `kinit` command, you need to provide a password. SSH Kerberos authentication requires the hash to be available in AAD-DS. If you want to use SSH for administrative scenarios only, you can create one cloud-only account and use that to SSH to the cluster. Other on-prem users can still use Ambari or HDInsight tools or HTTP basic auth without having the password hash available in AAD-DS.

If your organization is not syncing password hashes to AAD-DS, as a best practice, create one cloud only user in Azure AD and assign it as cluster admin when creating the cluster and use that for administration purposes which includes getting root access to the VMs via SSH.

To troubleshoot authentication issues, please see this [guide](https://docs.microsoft.com/azure/hdinsight/domain-joined/domain-joined-authentication-issues).

## Clients using OAuth to connect to HDInsight gateway with HIB

In the HIB setup, custom apps and clients connecting to the gateway can be updated to acquire the required OAuth token first. You can follow the steps in this [document](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-app) to acquire the token with the following information:

*	OAuth resource uri: `https://hib.azurehdinsight.net` 
*   AppId: 7865c1d2-f040-46cc-875f-831a1ef6a28a
*	Permission: (name: Cluster.ReadWrite, id: 8f89faa0-ffef-4007-974d-4989b39ad77d)

After acquiring the OAuth token, you can use that in the authorization header of the HTTP request to the cluster gateway (e.g. https://<clustername>-int.azurehdinsight.net). For example a sample curl command to Apache Livy API might look like this:
    
```bash
curl -k -v -H "Authorization: Bearer Access_TOKEN" -H "Content-Type: application/json" -X POST -d '{ "file":"wasbs://mycontainer@mystorageaccount.blob.core.windows.net/data/SparkSimpleTest.jar", "className":"com.microsoft.spark.test.SimpleFile" }' "https://<clustername>-int.azurehdinsight.net/livy/batches" -H "X-Requested-By:<username@domain.com>"
``` 

## Next steps

* [Configure an HDInsight cluster with Enterprise Security Package by using Azure Active Directory Domain Services](apache-domain-joined-configure-using-azure-adds.md)
* [Synchronize Azure Active Directory users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md)
* [Monitor cluster performance](../hdinsight-key-scenarios-to-monitor.md)
