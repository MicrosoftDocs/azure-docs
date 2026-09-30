---
title: Connect Azure Databricks to an Azure NetApp Files object REST API-enabled volume 
description: Learn how to connect Azure Databricks to an Azure NetApp Files volume using object REST API 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/13/2025
ms.author: anfdocs
---

# Connect Azure Databricks to an Azure NetApp Files object REST API-enabled volume 

The [object REST API feature](object-rest-api-introduction.md) enables Azure Databricks to read and write data to Azure NetApp Files volumes, supporting end-to-end data science workflows from ingestion to model deployment.

To connect to Azure Databricks, you configure an initialization (init) script to load the SSL certificate on the Databricks compute endpoints. Using this setup ensures secure communication between Azure Databricks and your Azure NetApp Files object REST API-enabled volume. 

## Before you begin 

Ensure you have: 

- Configured an [Azure NetApp Files object REST API-enabled volume](object-rest-api-access-configure.md)
- An active [Azure Databricks workspace](/azure/databricks/workspace/workspace-browser)

### Create the init script 

The init script runs during cluster startup. For more information about init scripts, see [What are init scripts?](/azure/databricks/init-scripts)

1. Write a bash script to load the SSL certificate. Save the script with an .sh extension. For example:

    ````bash
    #!/bin/bash 

    cat << 'EOF' > /usr/local/share/ca-certificates/myca.crt 

    -----BEGIN CERTIFICATE----- 
    

    -----END CERTIFICATE----- 

    EOF 

    update-ca-certificates 

    PEM_FILE="/etc/ssl/certs/myca.pem" 

    PASSWORD="changeit" 

    JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::") 

    KEYSTORE="$JAVA_HOME/lib/security/cacerts" 

    CERTS=$(grep 'END CERTIFICATE' $PEM_FILE| wc -l) 

    # To process multiple certificates with keytool, you need to extract each one from the PEM file and import it into the Java KeyStore. 

    for N in $(seq 0 $(($CERTS - 1))); do 

    ALIAS="$(basename $PEM_FILE)-$N" 

    echo "Adding to keystore with alias:$ALIAS" 

    cat $PEM_FILE | 

        awk "n==$N { print }; /END CERTIFICATE/ { n++ }" | 

        keytool -noprompt -import -trustcacerts \ 

                -alias $ALIAS -keystore $KEYSTORE -storepass $PASSWORD 

    done 

    echo "export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt" >> /databricks/spark/conf/spark-env.sh 

    echo "export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt" >> /databricks/spark/conf/spark-env.sh 

    #echo "volume IP URL of the bucket >> /etc/hosts 
    ````

1. Use the Databricks CLI or the Databricks UI to upload the bash script to the Databricks File System (DBFS). For more information, see, [work with files on Azure Databricks](/azure/databricks/files/).

### Configure the cluster 

1. Navigate to your Azure Databricks workspace. Open the cluster configuration settings. 
1. In the **Advanced Options** section, add the path to the init script under **Init Scripts**. For example: `dbfs:/path/to/your/script.sh`

    :::image type="content" source="./media/object-rest-api-databricks/create-compute.png" alt-text="Screenshot of Create new compute menu." lightbox="./media/object-rest-api-databricks/create-compute.png":::

1. Select the init.sh script. Select **Add** then **Confirm**. 
1. [To apply the changes and load the SSL certificate, restart the cluster.](/azure/databricks/compute/clusters-manage#cluster-start)
1. [In the logs, validate if the certificate is placed correctly.](/azure/databricks/init-scripts/logs) 

###  Connect to an Azure NetApp Files bucket 

Databricks recommends using secret scopes for storing all credentials. For more information, see [Manage secret scopes](/azure/databricks/security/secrets/#manage-secret-scopes).

1. In your Databricks notebook, configure the Spark session to connect to the Azure NetApp Files bucket. For example: 
    ```
    spark.conf.set("fs.s3a.endpoint", "https://your-s3-endpoint") 
    spark.conf.set("fs.s3a.access.key", "your-access-key") 
    spark.conf.set("fs.s3a.secret.key", "your-secret-key") 
    spark.conf.set("fs.s3a.connection.ssl.enabled", "true") 
    ```
1.  Verify the connection by performing a simple read operation. For example: 
    ```
    df = spark.read.csv("s3a://your-bucket/path/to/data.csv") 
    df.show() 
    ```

    :::image type="content" source="./media/object-rest-api-databricks/read-operation-result.png" alt-text="Screenshot of successful read operation." lightbox="./media/object-rest-api-databricks/read-operation-result.png":::

## More information

* [Configure object REST API](object-rest-api-access-configure.md)
* [Understand object REST API](object-rest-api-introduction.md)
 