---
title: Configure storage for Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Learn how to configure storage for use with the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/15/2024
ms.author: phjensen
---

# Configure storage for Azure Application Consistent Snapshot tool

This article provides a guide for configuring the Azure storage to be used with the Azure Application Consistent Snapshot tool (AzAcSnap).

Select the storage you're using with AzAcSnap.

# [Azure NetApp Files](#tab/azure-netapp-files)

Either set up a system-managed identity (recommended) or generate the service principal's authentication file.

When you're validating communication with Azure NetApp Files, communication might fail or time out. Check that firewall rules aren't blocking outbound traffic from the system running AzAcSnap to the following addresses and TCP/IP ports:

  - (https://)management.azure.com:443
  - (https://)login.microsoftonline.com:443

# [Azure Large Instances (bare metal)](#tab/azure-large-instance)

You'll need to generate your own self-signed certificate and then share the contents of the PEM (Privacy Enhanced Mail) file with Microsoft Operations so it can be installed to the Storage back-end to allow AzAcSnap to securely authenticate with ONTAP.

Combine the PEM and KEY into a single PKCS12 file which is needed by AzAcSnap for certificate-based authentication to ONTAP.

Test the PKCS12 file by using `curl` to connect to one of the nodes.

> Microsoft Operations provides the storage username and storage IP address at the time of provisioning.

---

## Enable communication with storage

This section explains how to enable communication with storage. Use the following tabs to correctly select the storage back end that you're using.

# [Azure NetApp Files (with virtual machine)](#tab/azure-netapp-files)

There are two ways to authenticate to the Azure Resource Manager using either a system-managed identity or a service principal file.  The options are described here.

### Azure system-managed identity

From AzAcSnap 9, it's possible to use a system-managed identity instead of a service principal for operation. Using this feature avoids the need to store service principal credentials on a virtual machine (VM). To set up an Azure managed identity by using Azure Cloud Shell, follow these steps:

1. Within a Cloud Shell session with Bash, use the following example to set the shell variables appropriately and apply them to the subscription where you want to create the Azure managed identity. Set `SUBSCRIPTION`, `VM_NAME`, and `RESOURCE_GROUP` to your site-specific values.

   ```azurecli-interactive
   export SUBSCRIPTION="99z999zz-99z9-99zz-99zz-9z9zz999zz99"
   export VM_NAME="MyVM"
   export RESOURCE_GROUP="MyResourceGroup"
   export ROLE="Contributor"
   export SCOPE="/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}"
   ```

1. Set Cloud Shell to the correct subscription:

   ```azurecli-interactive
   az account set -s "${SUBSCRIPTION}"
   ```

1. Create the managed identity for the virtual machine. The following command sets (or shows if it's already set) the AzAcSnap VM's managed identity:

   ```azurecli-interactive
   az vm identity assign --name "${VM_NAME}" --resource-group "${RESOURCE_GROUP}"
   ```

1. Get the principal ID for assigning a role:

   ```azurecli-interactive
   PRINCIPAL_ID=$(az resource list -n ${VM_NAME} --query [*].identity.principalId --out tsv)
   ```

1. Assign the Contributor role to the principal ID:

   ```azurecli-interactive
   az role assignment create --assignee "${PRINCIPAL_ID}" --role "${ROLE}" --scope "${SCOPE}"
   ```

#### Optional RBAC

It's possible to limit the permissions for the managed identity by using a custom role definition in role-based access control (RBAC). Create a suitable role definition for the virtual machine to be able to manage snapshots. You can find example permissions settings in [Tips and tricks for using the Azure Application Consistent Snapshot tool](azacsnap-tips.md).

Then assign the role to the Azure VM principal ID (also displayed as `SystemAssignedIdentity`):

```azurecli-interactive
az role assignment create --assignee ${PRINCIPAL_ID} --role "AzAcSnap on ANF" --scope "${SCOPE}"
```

### Generate a service principal file

1. In a Cloud Shell session, make sure you're logged on at the subscription where you want to be associated with the service principal by default:

    ```azurecli-interactive
    az account show
    ```

1. If the subscription isn't correct, use the `az account set` command:

    ```azurecli-interactive
    az account set -s <subscription name or id>
    ```

1. Create a service principal by using the Azure CLI, as shown in this example:

    ```azurecli-interactive
    az ad sp create-for-rbac --name "AzAcSnap" --role Contributor --scopes /subscriptions/{subscription-id} --sdk-auth
    ```

    The command should generate output like this example:

    ```output
    {
      "clientId": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "clientSecret": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "subscriptionId": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "tenantId": "00aa000a-aaaa-0000-00a0-00aa000aaa0a",
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/",
      "activeDirectoryGraphResourceId": "https://graph.windows.net/",
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/"
    }
    ```

    This command automatically assigns the RBAC Contributor role to the service principal at the subscription level. You can narrow down the scope to the specific resource group where your tests will create the resources.

1. Cut and paste the output content into a file called `azureauth.json` that's stored on the same system as the `azacsnap` command. Secure the file with appropriate system permissions.

   Make sure the format of the JSON file is exactly as described in the previous step, with the URLs enclosed in double quotation marks (").

# [Azure Large Instances (bare metal)](#tab/azure-large-instance)

> [!IMPORTANT]
> From AzAcSnap 10, communicatoin with Azure Large Instance storage is using the REST API over HTTPS.  Versions prior to AzAcSnap 10 use the CLI over SSH.

### Azure Large Instance REST API over HTTPS

Communication with the storage back end occurs over an encrypted HTTPS channel using certificate-based authentication. The following example steps provide guidance on setup of the PKCS12 certificate for this communication:

1. Generate the PEM and KEY files.

    > The CN equals the SVM username, ask Microsoft Operations for this SVM username.

    In this example we are using `svmadmin01` as our SVM username, modify this as necessary for your installation.
   
    ```bash
    openssl req -x509 -nodes -days 1095 -newkey rsa:2048 -keyout svmadmin01.key -out svmadmin01.pem -subj "/C=US/ST=WA/L=Redmond/O=MSFT/CN=svmadmin01"
    ```
    
    Refer to the following output:

    ```output
    Generating a RSA private key
    ........................................................................................................+++++
    ....................................+++++
    writing new private key to 'svmadmin01.key'
    -----
    ```

1. Output the contents of the PEM file.

   The contents of the PEM file are used for adding the client-ca to the SVM.  

   > ! Send the contents of the PEM file to the Microsoft BareMetal Infrastructure (BMI) administrator.


   ```bash
   cat svmadmin01.pem
   ```

   ```output
   -----BEGIN CERTIFICATE-----
   MIIDgTCCAmmgAwIBAgIUGlEfGBAwSzSFx8s19lsdn9EcXWcwDQYJKoZIhvcNAQEL
   /zANBgkqhkiG9w0BAQsFAAOCAQEAFkbKiQ3AF1kaiOpl8lt0SGuTwKRBzo55pwqf
   PmLUFF2sWuG5Yaw4sGPGPgDrkIvU6jcyHpFVsl6e1tUcECZh6lcK0MwFfQZjHwfs
   MRAwDgYDVQQHDAdSZWRtb25kMQ0wCwYDVQQKDARNU0ZUMRMwEQYDVQQDDApzdm1h
   ZG1pbjAxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuE6H2/DK9xjz
   TY1JSYIeArJ3GQnBz7Fw2KBT+Z9dl2kO8p3hjSE/5W1vY+5NLDjEH6HG1xH12QUO
   y2+NoT2s4KhGgWbHuJHpQqLsNFqaOuLyc3ofK7BPz/9JHz5JKmNu1Fn9Ql8s4FRQ
   4GzXDf4qC+JhQBO3iSvXuwDRfGs9Ja2x1r8yOJEHxmnLgGVw6Q==
   -----END CERTIFICATE-----
   ```

1. Combine the PEM and KEY into a single PKCS12 file (needed for AzAcSnap).

    ```bash
    openssl pkcs12 -export -out svmadmin01.p12 -inkey svmadmin01.key -in svmadmin01.pem
    ```

    >  The file svmadmin01.p12 is used as the value for certificateFile in the aliStorageResource section of the AzAcSnap configuration file.

1. Test the PKCS12 file using curl.

   After getting confirmation from Microsoft Operations they have applied the certificate to the SVM to allow certificate-based login, then test connectivity to the SVM.

   In this example we are using the PKCS12 file called svmadmin01.p12 to connect to the SVM host "X.X.X.X" (this IP address will be provided by Microsoft Operations).

   ```bash
   curl --cert-type P12 --cert svmadmin01.p12 -k 'https://X.X.X.X/api/cluster?fields=version'
   ```

   ```output
   {
     "version": {
       "full": "NetApp Release 9.15.1: Wed Feb 21 05:56:27 UTC 2024",
       "generation": 9,
       "major": 15,
       "minor": 1
     },
     "_links": {
       "self": {
         "href": "/api/cluster"
       }
     }
   }
   ```

### Azure Large Instance CLI over SSH

> [!WARNING]
> These instructions are for versions prior to AzAcSnap 10 and we are no longer updating this section of the content regularly.

Communication with the storage back end occurs over an encrypted SSH channel. The following example steps provide guidance on setup of SSH for this communication:

1. Modify the `/etc/ssh/ssh_config` file.

    Refer to the following output, which includes the `MACs hmac-sha` line:

    ```output
    # RhostsRSAAuthentication no
    # RSAAuthentication yes
    # PasswordAuthentication yes
    # HostbasedAuthentication no
    # GSSAPIAuthentication no
    # GSSAPIDelegateCredentials no
    # GSSAPIKeyExchange no
    # GSSAPITrustDNS no
    # BatchMode no
    # CheckHostIP yes
    # AddressFamily any
    # ConnectTimeout 0
    # StrictHostKeyChecking ask
    # IdentityFile ~/.ssh/identity
    # IdentityFile ~/.ssh/id_rsa
    # IdentityFile ~/.ssh/id_dsa
    # Port 22
    Protocol 2
    # Cipher 3des
    # Ciphers aes128-ctr,aes192-ctr,aes256-ctr,arcfour256,arcfour128,aes128-cbc,3des-
    cbc
    # MACs hmac-md5,hmac-sha1,umac-64@openssh.com,hmac-ripemd
    MACs hmac-sha
    # EscapeChar ~
    # Tunnel no
    # TunnelDevice any:any
    # PermitLocalCommand no
    # VisualHostKey no
    # ProxyCommand ssh -q -W %h:%p gateway.example.com
    ```

1. Use the following example command to generate a private/public key pair. Don't enter a password when you're generating a key.

    ```bash
    ssh-keygen -t rsa –b 5120 -C ""
    ```

1. The output of the `cat /root/.ssh/id_rsa.pub` command is the public key. Send it to Microsoft Operations, so that the snapshot tools can communicate with the storage subsystem.

    ```bash
    cat /root/.ssh/id_rsa.pub
    ```

    ```output
    ssh-rsa
    AAAAB3NzaC1yc2EAAAADAQABAAABAQDoaRCgwn1Ll31NyDZy0UsOCKcc9nu2qdAPHdCzleiTWISvPW
    FzIFxz8iOaxpeTshH7GRonGs9HNtRkkz6mpK7pCGNJdxS4wJC9MZdXNt+JhuT23NajrTEnt1jXiVFH
    bh3jD7LjJGMb4GNvqeiBExyBDA2pXdlednOaE4dtiZ1N03Bc/J4TNuNhhQbdsIWZsqKt9OPUuTfD
    j0XvwUTLQbR4peGNfN1/cefcLxDlAgI+TmKdfgnLXIsSfbacXoTbqyBRwCi7p+bJnJD07zSc9YCZJa
    wKGAIilSg7s6Bq/2lAPDN1TqwIF8wQhAg2C7yeZHyE/ckaw/eQYuJtN+RNBD
    ```



---


## Next steps

- [Configure Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-configure.md)
