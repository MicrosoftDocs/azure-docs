---
title: Connect to and manage HDFS
description: This guide describes how to connect to HDFS in Microsoft Purview, and use Microsoft Purview's features to scan and manage your HDFS source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/03/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Connect to and manage HDFS in Microsoft Purview

This article outlines how to register Hadoop Distributed File System (HDFS), and how to authenticate and interact with HDFS in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|**Full Scan**|**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | No| No | No|

When scanning HDFS source, Microsoft Purview supports extracting technical metadata including HDFS:

- Namenode
- Folders
- Files
- Resource sets

When setting up scan, you can choose to scan the entire HDFS or selective folders. Learn about the supported file format [here](microsoft-purview-connector-overview.md#file-types-supported-for-scanning).

The connector uses *webhdfs* protocol to connect to HDFS and retrieve metadata. MapR Hadoop distribution is not supported.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active [Microsoft Purview account](create-catalog-portal.md).
- You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).
- Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md). The minimal supported Self-hosted Integration Runtime version is 5.20.8235.2.

    * Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).
    * Ensure JRE or OpenJDK is installed on the self-hosted integration runtime machine for parsing Parquet and ORC files. Learn more from [here](manage-integration-runtimes.md#java-runtime-environment-installation).
    * To set up your environment to enable Kerberos authentication, see the [Use Kerberos authentication for the HDFS connector](#use-kerberos-authentication-for-the-hdfs-connector) section.

## Register

This section describes how to register HDFS in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Steps to register

To register a new HDFS source in your data catalog, follow these steps:

1. Navigate to your Microsoft Purview account in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **HDFS**. Select **Continue**.

On the **Register sources (HDFS)** screen, follow these steps:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **Cluster URL** of the HDFS NameNode in the form of `https://<namenode>:<port>` or `http://<namenode>:<port>`, e.g. `https://namenodeserver.com:50470` or `http://namenodeserver.com:50070`.

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-hdfs/register-sources.png" alt-text="Screenshot of HDFS source registration in Purview." border="true":::

## Scan

Follow the steps below to scan HDFS to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Authentication for a scan

The supported authentication type for an HDFS source is **Kerberos authentication**.

### Create and run scan

To create and run a new scan, follow these steps:

1. Make sure a self-hosted integration runtime is set up. If it isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

1. Navigate to **Sources**.

1. Select the registered HDFS source.

1. Select **+ New scan**.

1. On "**Scan *source_name***"" page, provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime. See setup requirements in [Prerequisites](#prerequisites) section.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select **Kerberos Authentication** while creating a credential.
        * Provide the user name in the format of `<username>@<domain>.com` in the User name input field. Learn more from [Use Kerberos authentication for the HDFS connector](#use-kerberos-authentication-for-the-hdfs-connector).
        * Store the user password used to connect to HDFS in the secret key.

       :::image type="content" source="media/register-scan-hdfs/scan.png" alt-text="Screenshot of HDFS scan configurations in Purview." border="true":::

1. Select **Test connection**.

1. Select **Continue**.

1. On "**Scope your scan**" page, select the path(s) that you want to scan.

1. On "**Select a scan rule set**" page, select the scan rule set you want to use for schema extraction and classification. You can choose between the system default, existing custom rule sets, or create a new rule set inline. Learn more from [Create a scan rule set](create-a-scan-rule-set.md).

1. On "**Set a scan trigger**" page, choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Use Kerberos authentication for the HDFS connector

There are two options for setting up the on-premises environment to use Kerberos authentication for the HDFS connector. You can choose the one that better fits your situation.
* Option 1: [Join a self-hosted integration runtime machine in the Kerberos realm](#kerberos-join-realm)
* Option 2: [Enable mutual trust between the Windows domain and the Kerberos realm](#kerberos-mutual-trust)

For either option, make sure you turn on webhdfs for Hadoop cluster:

1. Create the HTTP principal and keytab for webhdfs.

    > [!IMPORTANT]
    > The HTTP Kerberos principal must start with "**HTTP/**" according to Kerberos HTTP SPNEGO specification. Learn more from [here](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#HDFS_Configuration_Options).

    ```bash
    Kadmin> addprinc -randkey HTTP/<namenode hostname>@<REALM.COM>
    Kadmin> ktadd -k /etc/security/keytab/spnego.service.keytab HTTP/<namenode hostname>@<REALM.COM>
    ```

2. HDFS configuration options: add the following three properties in `hdfs-site.xml`.
    ```xml
    <property>
        <name>dfs.webhdfs.enabled</name>
        <value>true</value>
    </property>
    <property>
        <name>dfs.web.authentication.kerberos.principal</name>
        <value>HTTP/_HOST@<REALM.COM></value>
    </property>
    <property>
        <name>dfs.web.authentication.kerberos.keytab</name>
        <value>/etc/security/keytab/spnego.service.keytab</value>
    </property>
    ```

### <a name="kerberos-join-realm"></a>Option 1: Join a self-hosted integration runtime machine in the Kerberos realm

#### Requirements

* The self-hosted integration runtime machine needs to join the Kerberos realm and can’t join any Windows domain.

#### How to configure

**On the KDC server:**

Create a principal, and specify the password.

> [!IMPORTANT]
> The username should not contain the hostname.

```bash
Kadmin> addprinc <username>@<REALM.COM>
```

**On the self-hosted integration runtime machine:**

1.	Run the Ksetup utility to configure the Kerberos Key Distribution Center (KDC) server and realm.

    The machine must be configured as a member of a workgroup, because a Kerberos realm is different from a Windows domain. You can achieve this configuration by setting the Kerberos realm and adding a KDC server by running the following commands. Replace *REALM.COM* with your own realm name.

    ```cmd
    C:> Ksetup /setdomain REALM.COM
    C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
    ```

	After you run these commands, restart the machine.

2.	Verify the configuration with the `Ksetup` command. The output should be like:

    ```cmd
    C:> Ksetup
    default realm = REALM.COM (external)
    REALM.com:
        kdc = <your_kdc_server_address>
    ```

**In your Purview account:**

* Configure a credential with Kerberos authentication type with your Kerberos principal name and password to scan the HDFS. For configuration details, check the credential setting part in [Scan section](#scan).

### <a name="kerberos-mutual-trust"></a>Option 2: Enable mutual trust between the Windows domain and the Kerberos realm

#### Requirements

*	The self-hosted integration runtime machine must join a Windows domain.
*	You need permission to update the domain controller's settings.

#### How to configure

> [!NOTE]
> Replace REALM.COM and AD.COM in the following tutorial with your own realm name and domain controller.

**On the KDC server:**

1. Edit the KDC configuration in the *krb5.conf* file to let KDC trust the Windows domain by referring to the following configuration template. By default, the configuration is located at */etc/krb5.conf*.

   ```config
   [logging]
    default = FILE:/var/log/krb5libs.log
    kdc = FILE:/var/log/krb5kdc.log
    admin_server = FILE:/var/log/kadmind.log
            
   [libdefaults]
    default_realm = REALM.COM
    dns_lookup_realm = false
    dns_lookup_kdc = false
    ticket_lifetime = 24h
    renew_lifetime = 7d
    forwardable = true
            
   [realms]
    REALM.COM = {
     kdc = node.REALM.COM
     admin_server = node.REALM.COM
    }
   AD.COM = {
    kdc = windc.ad.com
    admin_server = windc.ad.com
   }
            
   [domain_realm]
    .REALM.COM = REALM.COM
    REALM.COM = REALM.COM
    .ad.com = AD.COM
    ad.com = AD.COM
            
   [capaths]
    AD.COM = {
     REALM.COM = .
    }
    ```

   After you configure the file, restart the KDC service.

2. Prepare a principal named *krbtgt/REALM.COM\@AD.COM* in the KDC server with the following command:

    ```cmd
    Kadmin> addprinc krbtgt/REALM.COM@AD.COM
    ```

3. In the *hadoop.security.auth_to_local* HDFS service configuration file, add `RULE:[1:$1@$0](.*\@AD.COM)s/\@.*//`.

**On the domain controller:**

1.	Run the following `Ksetup` commands to add a realm entry:

    ```cmd
    C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
    C:> ksetup /addhosttorealmmap HDFS-service-FQDN REALM.COM
    ```

2.	Establish trust from the Windows domain to the Kerberos realm. [password] is the password for the principal *krbtgt/REALM.COM\@AD.COM*.

    ```cmd
    C:> netdom trust REALM.COM /Domain: AD.COM /add /realm /password:[password]
    ```

3.	Select the encryption algorithm that's used in Kerberos.

    1. Select **Server Manager** > **Group Policy Management** > **Domain** > **Group Policy Objects** > **Default or Active Domain Policy**, and then select **Edit**.

    1. On the **Group Policy Management Editor** pane, select **Computer Configuration** > **Policies** > **Windows Settings** > **Security Settings** > **Local Policies** > **Security Options**, and then configure **Network security: Configure Encryption types allowed for Kerberos**.

    1. Select the encryption algorithm you want to use when you connect to the KDC server. You can select all the options.

       :::image type="content" source="media/register-scan-hdfs/config-encryption-types-for-kerberos.png" alt-text="Screenshot of the Network security: Configure encryption types allowed for Kerberos pane.":::

    1. Use the `Ksetup` command to specify the encryption algorithm to be used on the specified realm.

       ```cmd
       C:> ksetup /SetEncTypeAttr REALM.COM DES-CBC-CRC DES-CBC-MD5 RC4-HMAC-MD5 AES128-CTS-HMAC-SHA1-96 AES256-CTS-HMAC-SHA1-96
       ```

4.	Create the mapping between the domain account and the Kerberos principal, so that you can use the Kerberos principal in the Windows domain.

    1. Select **Administrative tools** > **Active Directory Users and Computers**.

    1. Configure advanced features by selecting **View** > **Advanced Features**.

    1. On the **Advanced Features** pane, right-click the account to which you want to create mappings and, on the **Name Mappings** pane, select the **Kerberos Names** tab.

    1. Add a principal from the realm.

       :::image type="content" source="media/register-scan-hdfs/map-security-identity.png" alt-text="Screenshot of the Security Identity Mapping pane.":::

**On the self-hosted integration runtime machine:**

* Run the following `Ksetup` commands to add a realm entry.

   ```cmd
   C:> Ksetup /addkdc REALM.COM <your_kdc_server_address>
   C:> ksetup /addhosttorealmmap HDFS-service-FQDN REALM.COM
   ```

**In your Purview account:**

* Configure a credential with Kerberos authentication type with your Kerberos principal name and password to scan the HDFS. For configuration details, check the credential setting part in [Scan section](#scan).

## Known limitations

Currently, HDFS connector doesn't support custom resource set pattern rule for [advanced resource set](concept-resource-sets.md#advanced-resource-sets), the built-in resource set patterns will be applied.

[Sensitivity label](create-sensitivity-label.md) is not yet supported.

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Search Data Catalog](how-to-search-catalog.md)
- [Data Estate Insights in Microsoft Purview](concept-insights.md)
