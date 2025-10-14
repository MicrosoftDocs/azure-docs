---
title: Access an Azure NetApp Files object REST API-enabled volume with S3-compatible clients
description: Learn how to access Azure NetApp Files object REST API-enabled volumes from S3-compatible clients
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/13/2025
ms.author: anfdocs
---
# Access an Azure NetApp Files object REST API-enabled volume with S3-compatible clients

You can use Azure NetApp Files' object REST API with an S3-compatible client, taking advantage of secure SSL communication and seamless data management.

You must install a certificate on your machine before accessing the bucket with S3-compatible clients. This document covers accessing the bucket with the S3 Browser and AWS CLI. 

## Install the certificate in the Trusted Root Certification Authorities

Before accessing your object REST API-enabled volume with an S3-compatible client, you must install the certificate. 

1. Open the Edge browser on your client system and navigate to your bucket's URL: `https://<your-bucket-endpoint-IP-or-FQDN>`.
1. Select the lock icon in the address bar then select **Certificate (Valid)**.
1. In the certificate dialog, select the **Details** tab then **Copy to file (or Export)**. Follow the steps in the export wizard, ensuring you choose the DER encoded binary X.509 (.CER) format. Save the .CER file to your local machine. 
1. To install the certificate, select the .CER file on your local machine. 
1. In the Certificate window, select **Install Certificate**. In the installation wizard, choose **Local machine** as your installation destination. Note that this requires administrator privileges.
    In the Certificate Store screen, select **Place all certificates in the following store** then **Browse** and choose **Trusted Root Certification Authorities**.
1. When you complete the steps in the installation wizard, a dialog confirms the certificate was installed successfully. 

## Access files with S3 Browser

1. Download and install [S3 Browser](https://s3browser.com/download.aspx).
2. Add a [new account for S3-compatible storage](https://s3browser.com/s3-compatible-storage.aspx).
    When adding the new account, follow these guidelines:

    * **REST Endpoint**: Enter the endpoint URL for your volume: `https://<your-bucket-endpoint-IP-or-FQDN>`.
    * **Access Key ID**: Use the access key created when you generated the bucket on the NFS volume.
    * **Secret access key**: Use corresponding secret key from when you generated the bucket.
    * Select **Encrypt Access Keys with a Password** and **Use secure transfer (SSL/TLS)**.

1. After adding the account, verify the connection. In the S3 Browser, select your newly added account in the **Accounts** menu. If the connection was successful, you see your buckets and can manage the objects. 

## Access files with the AWS CLI

1. Download the AWS CLI:
    * For Windows, [download the Microsoft Software Installer and run it]( https://aws.amazon.com/cli/).
    *  For Linux, install the AWS CLI with CURL:
    ```curl 
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    ```
1. Verify the installation succeeded with the command `aws --version`. The expected output is:
    ```
    aws-cli/2.x.x Python/3.x.x Linux/…
    ```
1. Configure the AWS CLI with the command `aws configure`.
    When prompted, provide:
    * **AWS access key ID** - Use the access key created when you generated the bucket on the NFS volume.
    * **AWS secret access key** - The corresponding secret key from when you generated the bucket.
    * **Default region name**: us-east-1 
    * **Output**: JSON
    >[!NOTE]
    >When using AWS CLI with Azure NetApp Files buckets, always use us-east-1 as the default region name.
1. List the buckets:
    ```
    aws s3 ls --endpoint-url https://<your-bucket-endpoint-IP-or-FQDN> --no-verify-ssl
    ```
1. List the objects in a bucket:
    ```
    aws s3 ls --endpoint-url https://<your-bucket-endpoint-IP-or-FQDN>(https://<your-bucket-endpoint-IP-or-FQDN>) s3://<bucket-name>/ --no-verify-ssl
    ```
1. Copy an object from a bucket to your local workstation:
    ```
    aws s3 cp --endpoint-url https://<your-bucket-endpoint-IP-or-FQDN> s3://<bucket-name>/<object-name> ./<local-object-name> --no-verify-ssl
    ```

## More information

* [Configure object REST API](object-rest-api-access-configure.md)
* [Understand object REST API](object-rest-api-introduction.md)
* [AWS CLI command reference](https://docs.aws.amazon.com/cli/latest/reference/s3/ls.html)