---
title: Azure HDInsight ID Broker (HIB)
description: Learn about Azure HDInsight ID Broker to simplify authentication for domain-joined Apache Hadoop clusters.
ms.service: hdinsight
ms.topic: how-to
ms.date: 06/05/2023
---

# Azure HDInsight ID Broker (HIB)

This article describes how to set up and use the Azure HDInsight ID Broker feature. You can use this feature to get modern OAuth authentication to Apache Ambari while having multifactor authentication enforcement without needing legacy password hashes in Microsoft Entra Domain Services.

## Overview

HDInsight ID Broker simplifies complex authentication setups in the following scenarios:

* Your organization relies on federation to authenticate users for accessing cloud resources. Previously, to use HDInsight Enterprise Security Package clusters, you had to enable password hash sync from your on-premises environment to Microsoft Entra ID. This requirement might be difficult or undesirable for some organizations.
* Your organization wants to enforce multifactor authentication for web-based or HTTP-based access to Apache Ambari and other cluster resources.

HDInsight ID Broker provides the authentication infrastructure that enables protocol transition from OAuth (modern) to Kerberos (legacy) without needing to sync password hashes to Microsoft Entra Domain Services. This infrastructure consists of components running on a Windows Server virtual machine (VM) with the HDInsight ID Broker node enabled, along with cluster gateway nodes.

Use the following table to determine the best authentication option based on your organization's needs.

|Authentication options |HDInsight configuration | Factors to consider |
|---|---|---|
| Fully OAuth | Enterprise Security Package + HDInsight ID Broker | Most secure option. (Multifactor authentication is supported.) Pass hash sync isn't  required. No ssh/kinit/keytab access for on-premises accounts, which don't have password hash in Microsoft Entra Domain Services. Cloud-only accounts can still ssh/kinit/keytab. Web-based access to Ambari through OAuth. Requires updating legacy apps (for example, JDBC/ODBC) to support OAuth.|
| OAuth + Basic Auth | Enterprise Security Package + HDInsight ID Broker | Web-based access to Ambari through OAuth. Legacy apps continue to use basic auth. Multifactor authentication must be disabled for basic auth access. Pass hash sync isn't required. No ssh/kinit/keytab access for on-premises accounts, which don't have password hash in Microsoft Entra Domain Services. Cloud-only accounts can still ssh/kinit. |
| Fully Basic Auth | Enterprise Security Package | Most similar to on-premises setups. Password hash sync to Microsoft Entra Domain Services is required. On-premises accounts can ssh/kinit or use keytab. Multifactor authentication must be disabled if the backing storage is Azure Data Lake Storage Gen2. |

The following diagram shows the modern OAuth-based authentication flow for all users, including federated users, after HDInsight ID Broker is enabled:

:::image type="content" source="media/identity-broker/identity-broker-architecture.png" alt-text="Diagram that shows authentication flow with HDInsight ID Broker." border="false":::

In this diagram, the client (that is, a browser or app) needs to acquire the OAuth token first. Then it presents the token to the gateway in an HTTP request. If you've already signed in to other Azure services, such as the Azure portal, you can sign in to your HDInsight cluster with a single sign-on experience.

There still might be many legacy applications that only support basic authentication (that is, username and password). For those scenarios, you can still use HTTP basic authentication to connect to the cluster gateways. In this set up, you must ensure network connectivity from the gateway nodes to the Active Directory Federation Services (AD FS) endpoint to ensure a direct line of sight from gateway nodes.

The following diagram shows the basic authentication flow for federated users. First, the gateway attempts to complete the authentication by using [ROPC flow](../../active-directory/develop/v2-oauth-ropc.md). In case there's no password hashes synced to Microsoft Entra ID, it falls back to discovering the AD FS endpoint and completes the authentication by accessing the AD FS endpoint.

:::image type="content" source="media/identity-broker/basic-authentication.png" alt-text="Diagram that shows architecture with basic authentication." border="false":::

## Enable HDInsight ID Broker

To create an Enterprise Security Package cluster with HDInsight ID Broker enabled,

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Follow the basic creation steps for an Enterprise Security Package cluster. For more information, see [Create an HDInsight cluster with Enterprise Security Package](apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp).
1. Select **Enable HDInsight ID Broker**.

The HDInsight ID Broker feature adds one extra VM to the cluster. This VM is the HDInsight ID Broker node, and it includes server components to support authentication. The HDInsight ID Broker node is domain joined to the Microsoft Entra Domain Services domain.

:::image type="content" source="./media/identity-broker/identity-broker-enable.png" alt-text="Diagram that shows option to enable HDInsight ID Broker." border="true":::

### Use Azure Resource Manager templates

If you add a new role called `idbrokernode` with the following attributes to the compute profile of your template, the cluster is created with the HDInsight ID Broker node enabled:

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
            "targetInstanceCount": 2,
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

To see a complete sample of an ARM template, see the template published [here](https://github.com/Azure-Samples/hdinsight-enterprise-security/tree/main/ESP-HIB-PL-Template).


## Tool integration

HDInsight tools are updated to natively support OAuth. Use these tools for modern OAuth-based access to the clusters. The HDInsight [IntelliJ plug-in](../spark/apache-spark-intellij-tool-plugin.md#integrate-with-hdinsight-identity-broker-hib) can be used for Java-based applications, such as Scala. [Spark and Hive Tools for Visual Studio Code](../hdinsight-for-vscode.md) can be used for PySpark and Hive jobs. The tools support both batch and interactive jobs.

<a name='ssh-access-without-a-password-hash-in-azure-ad-ds'></a>

## SSH access without a password hash in Microsoft Entra Domain Services

|SSH options |Factors to consider |
|---|---|
| Local VM account (for example, sshuser) | You provided this account at the cluster creation time. There's no Kerberos authentication for this account. |
| Cloud-only account (for example, alice@contoso.onmicrosoft.com) | The password hash is available in Microsoft Entra Domain Services. Kerberos authentication is possible via SSH Kerberos. |
| On-premises account (for example, alice@contoso.com) | SSH Kerberos authentication is only possible if a password hash is available in Microsoft Entra Domain Services. Otherwise, this user can't SSH to the cluster. |

To SSH to a domain-joined VM or to run the `kinit` command, you must provide a password. SSH Kerberos authentication requires the hash to be available in Microsoft Entra Domain Services. If you want to use SSH for administrative scenarios only, you can create one cloud-only account and use it to SSH to the cluster. Other on-premises users can still use Ambari or HDInsight tools or HTTP basic auth without having the password hash available in Microsoft Entra Domain Services.

If your organization isn't syncing password hashes to Microsoft Entra Domain Services, as a best practice, create one cloud-only user in Microsoft Entra ID. Then assign it as a cluster admin when you create the cluster, and use that for administration purposes. You can use it to get root access to the VMs via SSH.

To troubleshoot authentication issues, see [this guide](./domain-joined-authentication-issues.md).

## Clients using OAuth to connect to an HDInsight gateway with HDInsight ID Broker

In the HDInsight ID Broker set up, custom apps and clients that connect to the gateway can be updated to acquire the required OAuth token first. For more information, see [How to authenticate .NET applications with Azure services](/dotnet/azure/sdk/authentication). The key values required for authorizing access to an HDInsight gateway are:

* OAuth resource uri: `https://hib.azurehdinsight.net`
* AppId: 7865c1d2-f040-46cc-875f-831a1ef6a28a
* Permission: (name: Cluster.ReadWrite, id: 8f89faa0-ffef-4007-974d-4989b39ad77d)

After you acquire the OAuth token, use it in the authorization header of the HTTP request to the cluster gateway (for example, https://\<clustername\>-int.azurehdinsight.net). A sample curl command to Apache Livy API might look like this example:
    
```bash
curl -k -v -H "Authorization: Bearer Access_TOKEN" -H "Content-Type: application/json" -X POST -d '{ "file":"wasbs://mycontainer@mystorageaccount.blob.core.windows.net/data/SparkSimpleTest.jar", "className":"com.microsoft.spark.test.SimpleFile" }' "https://<clustername>-int.azurehdinsight.net/livy/batches" -H "X-Requested-By:<username@domain.com>"
``` 

For using Beeline and Livy, you can also follow the samples codes provided [here](https://github.com/Azure-Samples/hdinsight-enterprise-security/tree/main/HIB/HIBSamples) to set up your client to use OAuth and connect to the cluster.

## FAQ
<a name='what-app-is-created-by-hdinsight-in-microsoft-azure-active-directory-azure-ad'></a>

### What app is created by HDInsight in Microsoft Entra ID?
For each cluster, a third party application is registered in Microsoft Entra ID with the cluster uri as the identifierUri (like `https://clustername.azurehdinsight.net`).

### Why are users prompted for consent before using HIB enabled clusters?
In Microsoft Entra ID, consent is required for all third party applications before it can authenticate users or access data.

### Can the consent be approved programatically?
Microsoft Graph api allows you to automate the consent, see the [API documentation](/graph/api/resources/oauth2permissiongrant)
The sequence to automate the consent is:

* Register an app and grant Application.ReadWrite.All permissions to the app, to access Microsoft Graph
* After a cluster is created, query for the cluster app based on the identifier uri
* Register consent for the app

When the cluster is deleted, HDInsight delete the app, and there's no need to clean up any consent.

## Next steps

* [Configure an HDInsight cluster with Enterprise Security Package by using Microsoft Entra Domain Services](apache-domain-joined-configure-using-azure-adds.md)
* [Synchronize Microsoft Entra users to an HDInsight cluster](../hdinsight-sync-aad-users-to-cluster.md)
* [Monitor cluster performance](../hdinsight-key-scenarios-to-monitor.md)
