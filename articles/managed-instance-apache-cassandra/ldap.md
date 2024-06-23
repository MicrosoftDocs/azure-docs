---
title: How to enable LDAP authentication in Azure Managed Instance for Apache Cassandra
description: Learn how to enable LDAP authentication in Azure Managed Instance for Apache Cassandra
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 05/23/2022
---

# How to enable LDAP authentication in Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra data centers. This article discusses how to enable LDAP authentication to your clusters and data centers. 

> [!IMPORTANT]
> LDAP authentication is in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure Managed Instance for Apache Cassandra cluster. Review how to [create an Azure Managed Instance for Apache Cassandra cluster from the Azure portal](create-cluster-portal.md).

## Deploy an LDAP Server in Azure
In this section, we'll walk through creating a simple LDAP server on a Virtual Machine in Azure. If you already have an LDAP server running, you can skip this section and review [how to enable LDAP authentication](ldap.md#enable-ldap-authentication). 

1. Deploy a Virtual Machine in Azure using Ubuntu Server 18.04 LTS. You can follow instructions [here](visualize-prometheus-grafana.md#deploy-an-ubuntu-server).

1. Give your server a DNS name:

   :::image type="content" source="./media/ldap/dns.jpg" alt-text="Screenshot of virtual machine d n s name in Azure portal." lightbox="./media/ldap/dns.jpg" border="true":::

1. Install Docker on the virtual machine. We recommend [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04) tutorial.

1. In the home directory, copy and paste the following text and hit enter. This command will create a file containing a test LDAP user account.

    ```shell
    mkdir ldap-user && cd ldap-user && cat >> user.ldif <<EOL
    dn: uid=admin,dc=example,dc=org
    uid: admin
    cn: admin
    sn: 3
    objectClass: top
    objectClass: posixAccount
    objectClass: inetOrgPerson
    loginShell: /bin/bash
    homeDirectory: /home/admin
    uidNumber: 14583102
    gidNumber: 14564100
    userPassword: admin
    mail: admin@example.com
    gecos: admin
    EOL 
    ```

1. Navigate back up to home directory

    ```shell
    cd ..
    ```

1. Run the below command, replacing `<dnsname>` with the dns name you created for your LDAP server earlier. This command will deploy an LDAP server with TLS enabled to a Docker container, and will also copy the user file you created earlier to the container.  
    
    ```shell
    sudo docker run --hostname <dnsname>.uksouth.cloudapp.azure.com --name <dnsname> -v $(pwd)/ldap-user:/container/service/slapd/assets/test --detach osixia/openldap:1.5.0
    ```

1. Now copy out the certificates folder from the container (replace `<dnsname>` with the dns name you created for your LDAP server):

    ```shell
    sudo docker cp <dnsname>:/container/service/slapd/assets/certs certs
    ```

1. Verify that dns name is correct:

    ```shell
    openssl x509 -in certs/ldap.crt -text
    ```
   :::image type="content" source="./media/ldap/dns-verify.jpg" alt-text="Screenshot of output from command to verify certificate." lightbox="./media/ldap/dns-verify.jpg" border="true":::

1. Copy the `ldap.crt` file to [clouddrive](../cloud-shell/persisting-shell-storage.md) in Azure CLI for use later. 

1. Add the user to the ldap (replace `<dnsname>` with the dns name you created for your LDAP server):

    ```shell
    sudo docker container exec <dnsname> ldapadd -H ldap://<dnsname>.uksouth.cloudapp.azure.com -D "cn=admin,dc=example,dc=org" -w admin -f /container/service/slapd/assets/test/user.ldif
    ```

## Enable LDAP authentication

> [!IMPORTANT]
> If you skipped the above section because you already have an existing LDAP server, please ensure that it has server SSL certificates enabled. The `subject alternative name (dns name)` specified for the certificate must also match the domain of the server that LDAP is hosted on, or authentication will fail.  

1. Currently, LDAP authentication is a public preview feature. Run the below command to add the required Azure CLI extension:

    ```azurecli-interactive
    az extension add --upgrade --name cosmosdb-preview
    ```

1. Set authentication method to "Ldap" on the cluster, replacing `<resource group>` and `<cluster name>` with the appropriate values:

    ```azurecli-interactive
    az managed-cassandra cluster update -g <resource group> -c <cluster name> --authentication-method "Ldap"
    ```

1. Now set properties at the data center level. Replace `<resource group>` and `<cluster name>` with the appropriate values, and `<dnsname>` with the dns name you created for your LDAP server.

    > [!NOTE]
    > The below command is based on the LDAP setup in the earlier section. If you skipped that section because you already have an existing LDAP server, provide the corresponding values for that server instead. Ensure you have uploaded a certificate file like `ldap.crt` to your [clouddrive](../cloud-shell/persisting-shell-storage.md) in Azure CLI.

    ```azurecli-interactive
    ldap_search_base_distinguished_name='dc=example,dc=org'
    ldap_server_certificates='/usr/csuser/clouddrive/ldap.crt'
    ldap_server_hostname='<dnsname>.uksouth.cloudapp.azure.com'
    ldap_service_user_distinguished_name='cn=admin,dc=example,dc=org'
    ldap_service_user_password='admin'
    
    az managed-cassandra datacenter update -g `<resource group>` -c `<cluster name>` -d datacenter-1 --ldap-search-base-dn $ldap_search_base_distinguished_name --ldap-server-certs $ldap_server_certificates --ldap-server-hostname $ldap_server_hostname --ldap-service-user-dn $ldap_service_user_distinguished_name --ldap-svc-user-pwd $ldap_service_user_password
    ```

1. Once this command has completed, you should be able to use [CQLSH](https://cassandra.apache.org/doc/latest/cassandra/tools/cqlsh.html) (see below) or any Apache Cassandra open-source client driver to connect to your managed instance data center with the user added in the above step:

    ```shell
    export SSL_VALIDATE=false
    cqlsh --debug --ssl <data-node-ip> -u <user> -p <password>
    ```

## Next steps

* [LDAP authentication with Microsoft Entra ID](../active-directory/fundamentals/auth-ldap.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
