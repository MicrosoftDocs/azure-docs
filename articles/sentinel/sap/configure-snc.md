---
title: Deploy the Microsoft Sentinel for SAP data connector with SNC
description: Deploy the Microsoft Sentinel for SAP data connector to ingest NetWeaver and ABAP logs over a secure connection by using Secure Network Communications (SNC).
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: mvc
ms.date: 05/03/2022

# CustomerIntent: As an SAP admin and Microsoft Sentinel user, I want to know how to use SNC to deploy the Microsoft Sentinel for SAP data connector over a secure connection.
---

# Deploy the Microsoft Sentinel for SAP data connector by using SNC

This article shows you how to deploy the Microsoft Sentinel for SAP data connector to ingest SAP NetWeaver and SAP ABAP logs over a secure connection by using Secure Network Communications (SNC).

The SAP data connector agent typically connects to an SAP ABAP server by using a remote function call (RFC) connection and a username and password for authentication.

However, some environments might require the connection to be made on an encrypted channel, and some environments might require client certificates to be used for authentication. In these cases, you can use SNC from SAP to securely connect your data connector. Complete the steps as they're outlined in this article.

## Prerequisites

To deploy the Microsoft Sentinel for SAP data connector by using SNC, you need:

- The [SAP Cryptographic Library](https://help.sap.com/viewer/d1d04c0d65964a9b91589ae7afc1bd45/5.0.4/en-US/86921b29cac044d68d30e7b125846860.html).
- Network connectivity. SNC uses port 48*xx* (where *xx* is the SAP instance number) to connect to the ABAP server.
- An SAP server configured to support SNC authentication.
- A self-signed or enterprise certificate authority (CA)-issued certificate for user authentication.

> [!NOTE]
> This article describes a sample case for configuring SNC. In a production environment, we strongly recommended that you consult with SAP administrators to create a deployment plan.

## Export the server certificate

To begin, export the server certificate:

1. Sign in to your SAP client and run the **STRUST** transaction.

1. On the left pane, go to **SNC SAPCryptolib** and expand the section.

1. Select the system, and then select a value for **Subject**.

    The server certificate information is shown in the **Certificate** section.

1. Select **Export certificate**.

    ![Screenshot that shows how to export a server certificate.](./media/configure-snc/export-server-certificate.png)

1. In the **Export Certificate** dialog:

   1. For file format, select **Base64**.

   1. Next to **File Path**, select the double boxes icon.

   1. Select a filename to export the certificate to.

   1. Select the green checkmark to export the certificate.

## Import your certificate

This section explains how to import a certificate so that it's trusted by your ABAP server. It's important to understand which certificate needs to be imported into the SAP system. Only public keys of the certificates need to be imported into the SAP system.

- **If the user certificate is self-signed**: Import a user certificate.

- **If the user certificate is issued by an enterprise CA**: Import an enterprise CA certificate. If both root and subordinate CA servers are used, import both the root and the subordinate CA public certificates.

To import your certificate:

1. Run the **STRUST** transaction.

1. Select **Display<->Change**.

1. Select **Import certificate**.

1. In the **Import certificate** dialog:

   1. Next to **File path**, select the double boxes icon and go to the certificate.

   1. Go to the file that contains the certificate (for a public key only) and select the green checkmark to import the certificate.

       The certificate information is displayed in the **Certificate** section.

   1. Select **Add to Certificate List**.

       The certificate appears in the **Certificate List** section.

## Associate the certificate with a user account

To associate the certificate with a user account:

1. Run the **SM30** transaction.

1. In **Table/View**, enter **USRACLEXT**, and then select **Maintain**.

1. Review the output and identify whether the target user already has an associated SNC name. If no SNC name is associated with the user, select **New Entries**.

    ![Screenshot that shows how to create a new entry in the USERACLEXT table.](./media/configure-snc/usraclext-new-entry.png)

1. For **User**, enter the user's username. For **SNC Name**, enter the user's certificate subject name prefixed with **p:**, and then select **Save**.

    ![Screenshot that shows how to create a new user in USERACLEXT table.](./media/configure-snc/usraclext-new-user.png)

## Grant logon rights by using the certificate

To grant logon rights:

1. Run the **SM30** transaction.

1. In **Table/View**, enter **VSNCSYSACL**, and then select **Maintain**.

1. In the informational prompt that appears, confirm that the table is cross-client.

1. In **Determine Work Area: Entry**, enter **E** for **Type of ACL entry**, and then select the green checkmark.

1. Review the output and identify whether the target user already has an associated SNC name. If the user doesn't have an associated SNC name, select **New Entries**.

    ![Screenshot that shows how to create a new entry in the VSNCSYSACL table.](./media/configure-snc/vsncsysacl-new-entry.png)

1. Enter your system ID and user certificate subject name with a **p:** prefix.

    ![Screenshot that shows how to create a new user in the VSNCSYSACL table.](./media/configure-snc/vsncsysacl-new-user.png)

1. Ensure that the checkboxes for **Entry for RFC activated** and **Entry for certificate activated** are selected, and then select **Save**.

## Map users of the ABAP service provider to external user IDs

To map ABAP service provider users to external user IDs:

1. Run the **SM30** transaction.

1. In **Table/View**, enter **VUSREXTID**, and then select **Maintain**.

1. In **Determine Work Area: Entry**, select the **DN** ID type for **Work Area**.

1. Enter the following values:

    - For **External ID**, enter **CN=Sentinel**, **C=US**.
    - For **Seq. No**, enter **000**.
    - For **User**, enter **SENTINEL**.

1. Select **Save**, and then select **Enter**.

    :::image type="content" source="media/configure-snc/vusrextid-table-configuration.png" alt-text="Screenshot that shows how to set up the SAP VUSREXTID table.":::

## Set up the container

> [!NOTE]
> If you set up the SAP data connector agent container by using the UI, don't complete the steps that are described in this section. Instead, continue to set up the connector [on the connector page](deploy-data-connector-agent-container.md).

To set up the container:

1. Transfer the *libsapcrypto.so* and *sapgenpse* files to the system where the container will be created.

1. Transfer the client certificate (both private and public keys) to the system where the container will be created.

    The client certificate and key can be in *.p12*, *.pfx*, or Base64 *.crt* and *.key* format.

1. Transfer the server certificate (public key only) to the system where the container will be created.

    The server certificate must be in Base64 *.crt* format.

1. If the client certificate was issued by an enterprise certification authority, transfer the issuing CA and root CA certificates to the system where the container will be created.

1. Get the kickstart script from the Microsoft Sentinel GitHub repository:

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    ```

1. Change the script's permissions to make it executable:

    ```bash
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```

1. Run the script and specify the following base parameters:

    ```bash
    ./sapcon-sentinel-kickstart.sh \
    --use-snc \
    --cryptolib <path to sapcryptolib.so> \
    --sapgenpse <path to sapgenpse> \
    --server-cert <path to server certificate public key> \
    ```

    If the client certificate is in *.crt* or *.key* format, use the following switches:

    ```bash
    --client-cert <path to client certificate public key> \
    --client-key <path to client certificate private key> \
    ```

    If the client certificate is in *.pfx* or *.p12* format, use these switches:

    ```bash
    --client-pfx <pfx filename>
    --client-pfx-passwd <password>
    ```

    If the client certificate was issued by an enterprise CA, add this switch for **each** CA in the trust chain:

    ```bash
    --cacert <path to ca certificate>
    ```

    For example:

    ```bash
    ./sapcon-sentinel-kickstart.sh \
    --use-snc \
    --cryptolib /home/azureuser/libsapcrypto.so \
    --sapgenpse /home/azureuser/sapgenpse \
    --client-cert /home/azureuser/client.crt \
    --client-key /home/azureuser/client.key \
    --cacert /home/azureuser/issuingca.crt
    --cacert /home/azureuser/rootca.crt
    --server-cert /home/azureuser/server.crt \
    ```

For more information about options that are available in the kickstart script, see [Reference: Kickstart script](reference-kickstart.md).

## Troubleshooting and reference

For troubleshooting information, see these articles:

- [Troubleshoot your Microsoft Sentinel solution for SAP applications deployment](sap-deploy-troubleshoot.md)
- [Microsoft Sentinel solutions](../sentinel-solutions.md)

For reference, see these articles:

- [Microsoft Sentinel solution for SAP applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP applications: Security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

## Related content

- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP change requests and configure authorization](preparing-sap.md)
