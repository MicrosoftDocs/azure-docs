---
title: Configure object REST API in Azure NetApp Files 
description: Learn how to configure object REST API to manage S3 objects in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/29/2025
ms.author: anfdocs
---

# Configure object REST API in Azure NetApp Files (preview)

Azure NetApp Files supports access to S3 objects with the [object REST API](object-rest-api-introduction.md) feature. With the object REST API feature, you can connect to services including Azure AI Search, Azure AI Foundry, Azure Databricks, OneLake, and others.

## Register the feature 

The object REST API feature in Azure NetApp Files is currently in preview. You must submit a [waitlist request](https://aka.ms/ANF-object-REST-API-signup) to use the object REST API feature. Activation takes approximately one week. An email notification is sent to confirm your enrollment in the preview. 

## Create the self-signed certificate

You must generate a PEM-formatted SSL certificate. You can create the SSL certificate in the Azure portal or with a script.  

<!-- DNS? -->

### [Portal](#tab/portal)

See the [Azure Key Vault documentation for adding a certificate to Key Vault](/azure//key-vault/certificates/quick-create-portal#add-a-certificate-to-key-vault). 

When creating the certificate, ensure:

* the **Content Type** is set to PEM
* the **Subject** field is set to the IP address or fully qualified domain name (FQDN) of your Azure NetApp Files endpoint using the format `"CN=<IP or FQDN>"`
* the **DNS Names** entry specifies the IP address or FQDN

:::image type="content" source="./media/object-rest-api-access-configure/create-certificate.png" alt-text="Screenshot of create certificate options." lightbox="./media/object-rest-api-access-configure/create-certificate.png":::

### [Script](#tab/script)

This script creates a certificate locally. Set the computer name `CN=` to the IP address or fully qualified domain name (FQDN) of your object REST API-enabled endpoint. This script creates a folder that includes the necessary PEM file and private keys. 

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
--- 

## Create a bucket

To enable object REST API, you must create a bucket. 

1. From your NetApp volume, select **Buckets**. 
1. To create a bucket, select **+Create**. 
1. Provide the following information for the bucket:
    * **Name**

        Specify the name for your bucket. Refer to [Naming rules and restrictions for Azure resources](../azure-resource-manager/management/resource-name-rules.md#microsoftnetapp) for naming conventions.
    * **Path**

        The subdirectory path for object REST API. For full volume access, leave this field blank or use `/` for the root directory.
        
    * **User ID (UID)**

        The UID used to read the bucket.

    * **Group ID (GID)**

        The GID used to read the bucket.

    * **Permissions**

        Select Read or Read-Write. 

    :::image type="content" source="./media/object-rest-api-access-configure/create-bucket.png" alt-text="Screenshot of create a bucket menu." lightbox="./media/object-rest-api-access-configure/create-bucket.png":::

1. If you haven't provided a certificate, upload your PEM file. 

    To upload a certificate, provide the following information:

    * **Fully qualified domain name**

        Enter the fully qualified domain name. 

    * **Certificate source**

        Upload the appropriate certificate. Only PEM files are supported. 

    Select **Save**. 

1. Select **Create**. 

After you create a bucket, you need to generate credentials to access the bucket.

## Update bucket access

You can modify a bucket's access management settings.

1. From your NetApp volume, select **Buckets**.
1.	Select **+Create**.
1.	Enter the name of the bucket you want to modify.
1.	Change the access management settings as required.
1.	You can modify the User ID, Group ID, Username (for SMB or dual-protocol volumes), and Permissions.
1.	Click **Save** to modify the existing bucket.

> [!NOTE]
> You cannot modify a bucket’s path. To update a bucket’s path, delete and re-create the bucket with the new path.

## Generate credentials

1. Navigate to your newly created bucket. Select **Generate keys**.
1. Enter the desired Access key lifespan in days then select **Generate keys**. After you select **Generate keys**, the portal displays the access key and secret access key. 
    >[!IMPORTANT]
    >The access key and secret access key are only displayed once. Store the keys securely. Do not share the keys.
1. After you set the credentials, you can generate a new access key and secret access key by selecting the `...` menu then selecting **Generate access keys**. Generating new keys immediately invalidates the existing keys. 

## Delete a bucket

Deleting a bucket is a permanent operation. You can't recover the bucket after deleting it. 

1. In your NetApp account, navigate to **Buckets**. 
1. Select the checkbox next to the bucket you want to delete. 
1. Select **Delete**. 
1. In the modal, select **Delete** to confirm you want to delete the bucket. 

## Next steps 

* [Understand object REST API](object-rest-api-introduction.md)
* [Connect to Azure Databricks](object-rest-api-databricks.md)
* [Connect to an S3 browser](object-rest-api-browser.md)
* [Connect to OneLake](object-rest-api-onelake.md)
