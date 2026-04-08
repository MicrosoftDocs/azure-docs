---
title: Configure object REST API in Azure NetApp Files 
description: Learn how to configure object REST API to manage S3 objects in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 02/16/2026
ms.author: anfdocs
---

# Configure object REST API for Azure NetApp Files (preview)

Azure NetApp Files supports access to S3 objects with the [object REST API](object-rest-api-introduction.md) feature. With the object REST API, you can connect to services such as Azure AI Search, Microsoft Fabric, Microsoft Foundry, Azure Databricks, OneLake, and other S3‑compatible clients.

This article describes how to configure object REST API access and walks you through the two supported certificate workflows. Choose the workflow that best matches your security and operational requirements.

## Register the feature 

The object REST API feature in Azure NetApp Files is currently in preview. You must submit a [waitlist request](https://aka.ms/ANF-object-REST-API-signup) to use this feature. Activation takes approximately one week, and you receive an email notification once the enrollment is complete. 

## Create the self-signed certificate

Azure NetApp Files supports two certificate options for object REST API access:

1. **Azure Key Vault–based certificates (recommended)**: Certificates are created and stored in Azure Key Vault and the certificate is retrieved directly from Azure Key Vault during bucket creation. 

1. **Direct certificate upload**: PEM certificates are generated and uploaded manually during bucket creation. 

> [!IMPORTANT]
> The options you select determines the certificate format you must generate (PKCS#12 vs PEM), and how the certificate is supplied during bucket creation.

You must select one of the following options:

### Option 1 (recommended): Azure Key Vault–based certificate

Use this option if you want Azure NetApp Files to read the certificate directly from Azure Key Vault during bucket creation. 

See the [Azure Key Vault documentation for adding a certificate to Key Vault](/azure//key-vault/certificates/quick-create-portal#add-a-certificate-to-key-vault).

When creating the certificate in Azure Key Vault, ensure:

* **Content Type**: PKCS#12 
* **Subject**: IP address or fully qualified domain name (FQDN) of your Azure NetApp Files endpoint using the format `"CN=<IP or FQDN>"`
* **DNS Names**: IP address or FQDN

:::image type="content" source="./media/object-rest-api-access-configure/create-certificate.png" alt-text="Screenshot of create certificate options." lightbox="./media/object-rest-api-access-configure/create-certificate.png":::

Once the certificate is successfully created, click on the certificate from the list and review the properties.

* In the Certificate identifier field, note the URI of the vault “https://<vault_name>.azure.net”
* Note the name of the certificate 

### Required Azure Key Vault permissions

To avoid bucket creation failures, ensure that the Azure NetApp Files service has permission to read the certificate from Azure Key Vault. 

At a minimum, the following permissions must be granted:

* Certificates: Get, List, Update, Create, Import, Manage Certificate Authorities, Get Certificate Authorities, List Certificate Authorities, Set Certificate Authorities, Delete Certificate Authorities   
* Secrets: Get, List, Set, Delete 

> [!NOTE]
> If these permissions are missing, bucket creation fails when Azure NetApp Files attempts to retrieve the certificate.


### Option 2: Direct certificate upload

Use this option if you plan to generate the certificate and upload it manually during bucket creation.

When creating the certificate, ensure:

* **Content Type**: PEM 
* **Subject**: IP address or fully qualified domain name (FQDN) of your Azure NetApp Files endpoint using the format `"CN=<IP or FQDN>"`
* **DNS Names**: IP address or FQDN

## Generate the certificate

Use the provided script to generate a self‑signed PEM certificate. The script creates both the certificate and private key files required for upload. Set the computer name `CN=` to the IP address or fully qualified domain name (FQDN) of your object REST API-enabled endpoint. This script creates a folder that includes the necessary PEM file and private keys. 

Create and run the following script:

```bash
#!/bin/sh
# Define certificate details 
CERT_DAYS=365 
RSA_STR_LEN=2048 
CERT_DIR="./certs" 
KEY_DIR="./certs/private" 
CN="mylocalsite.local" 

# Create directories if they don't exist 
mkdir -p $CERT_DIR 
mkdir -p $KEY_DIR 

# Generate private key 
openssl genrsa -out $KEY_DIR/server-key.pem $RSA_STR_LEN 

# Generate Certificate Signing Request (CSR) 
openssl req -new -key $KEY_DIR/server-key.pem -out $CERT_DIR/server-req.pem -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=$CN" 

# Generate self-signed certificate 
openssl x509 -req -days $CERT_DAYS -in $CERT_DIR/server-req.pem -signkey $KEY_DIR/server-key.pem -out $CERT_DIR/server-cert.pem 

echo "Self-signed certificate created at $CERT_DIR/server-cert.pem"
```
After the certificate is created, you will need to create a bucket.

## Create a bucket

To enable object REST API, you must create a bucket on an Azure NetApp Files volume. 

1. From your NetApp volume, select **Buckets**. 
1. Select **+Create or update bucket**. 
1. In Create or update bucket, provide the following information for the bucket:

    **Bucket configuration**

    * **Name**

        Specify the name for your bucket. Refer to [Naming rules and restrictions for Azure resources](../azure-resource-manager/management/resource-name-rules.md#microsoftnetapp) for naming conventions.
    * **Path**

        The subdirectory path for object REST API. For full volume access, leave this field blank or use `/` for the root directory.
        
    **Protocol access**

    * **NFS volume**

        * **User ID (UID)**

             The UID used to access the bucket.

        * **Group ID (GID)**

            The GID used to access the bucket.

    * **SMB volume**

        * **Username**

             The ID used to read the bucket.

    * **Permissions**   

        Select Read-only or Read and write.

    :::image type="content" source="./media/object-rest-api-access-configure/create-bucket.png" alt-text="Screenshot of create a bucket menu." lightbox="./media/object-rest-api-access-configure/create-bucket.png":::

1. Select **Save**. 

    Additional details are needed to create the first bucket on a set of volumes sharing the same IP address.
    
    **Certificate management**

    * **Fully qualified domain name**

        Enter the endpoint FQDN used by clients to access the buckets. 

    **Certificate source**

    * **Azure Key Vault**

        * **Vault URI**

            Select the name from the drop-down list.

        * **Secret name**

            Enter the name of the certificate.
           
    * **Upload certificate**

        Select the **certificate** option to upload a certificate file directly.      

        If you haven't provided a certificate, upload the PEM file.
        
        * **Certificate source**. 

            Upload the appropriate certificate. Only PEM files are supported.
                     
    **Credentials storage**

    * **Azure Key Vault**

        * **Vault URI**

            Select the name from the drop-down list.

        * **Secret name**

            Enter the name of the secret. The secret name is user-defined and can be any value, that meets the naming guidelines. 
            
    * **Access key**

        When selecting this option, access keys are generated after the bucket is created and are displayed once in the Azure portal. You must manually copy both these values and store them securely.

1. Select **Save** to validate the configuration.

1. Select **Create** to provision the bucket.

After you create a bucket, you need to generate credentials to access the bucket.

## Generate credentials

The credential generation behavior depends on the credential storage option you selected.

1. Navigate to the newly created bucket. 

1. Select **Generate credentials**.

1. Enter the desired access key lifespan in days and then select **Generate credentials**.

    **Azure Key Vault–based credentials**

    * The credentials are generated and stored securely in Azure Key Vault.
    * The credentials and are not displayed in the Azure portal. 
    * You should retrieve the credentials directly from the configured Key Vault.

    After the credentials are generated, perform the following:

    1. Ensure that the secret is created in the specified Key Vault.
    1. Verify the secret:

        1. Navigate to your key vault in the Azure portal.
        1. Select **Objects** then select **Secrets**.
        1. Confirm that <secret_name> has been created.

    **Access key-based credentials**

    When using direct certificate upload:

    * The access key and secret access key are displayed once in the Azure portal.
    * You should copy and store both the values securely. 
    * The credentials cannot be retrieved again after the initial display.

    > [!IMPORTANT]
    > The access key and secret access key are only displayed once. You should copy and store the keys securely. If they are lost, you must generate new credentials.

    **Regenerating credentials**

    After the credentials are set, you can generate new credentials by selecting the three dots (`…`) on the bucket and selecting **Generate credentials**.

    > [!IMPORTANT]
    > Generating new credentials immediately invalidates existing credentials.

## Update bucket access

You can modify a bucket's access management settings.

* User ID / Username
* Group ID
* Permissions

1. From your NetApp volume, select **Buckets**.
1.	Select **+Create or update bucket**.
1.	Enter the name of the bucket you want to modify.
1.	Change the access management settings as required.
1.	Click **Save** to modify the existing bucket.

> [!NOTE]
> You cannot modify a bucket’s path. To update a bucket’s path, delete and re-create the bucket with the new path.


## Delete a bucket

Deleting a bucket permanently removes it and all associated configurations. You can't recover the bucket after deleting it. 

1. In your NetApp account, navigate to **Buckets**. 
1. Select the three dots (`…`) next to the bucket you want to delete. 
1. Select **Delete**. 
1. In the Delete bucket window, select **Delete** to confirm you want to delete the bucket. 

## Next steps 

* [Understand object REST API](object-rest-api-introduction.md)
* [Connect to Azure Databricks](object-rest-api-databricks.md)
* [Connect to an S3 browser](object-rest-api-browser.md)
* [Connect to OneLake](object-rest-api-onelake.md)
