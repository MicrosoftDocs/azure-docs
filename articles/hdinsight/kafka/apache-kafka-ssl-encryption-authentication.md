---
title: Setup SSL encryption and authentication for Apache Kafka in Azure HDInsight
description: Setup SSL encryption for communication between Kafka clients and Kafka brokers as well as between Kafka brokers. Setup SSL authentication of clients.
services: hdinsight
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/15/2019
ms.author: hrasheed

---
# Setup Secure Sockets Layer (SSL) encryption and authentication for Apache Kafka in Azure HDInsight

This article describes how to setup SSL encryption from Apache Kafka clients to Apache Kafka brokers and also between Apache Kafka brokers. It also gives the steps needed to setup authentication of clients (sometimes referred to as two-way SSL).

## Server setup

The first step is to setup the keystore and truststore on the Kafka brokers and import the Certificate Authority (CA) and broker certificates into these stores.

> [!Note] 
> This guide will use self-signed certificates, but the most secure solution is to use certificates issued by trusted CAs.

1. Create a folder named ssl and export the server password as an environment variable. For the remainder of this guide, replace `<server_password>` with the actual administrator password for the server.

    ```bash
    $export SRVPASS=<server_password>
    $mkdir ssl
    $cd ssl
    ```

2. Next, create a java keystore (kafka.server.keystore.jks) and a CA certificate.

    ```bash
    $keytool -genkey -keystore kafka.server.keystore.jks -validity 365 -storepass $SRVPASS -keypass $SRVPASS -dname "CN=wn0-umakaf.xvbseke35rbuddm4fyvhm2vz2h.cx.internal.cloudapp.net" -storetype pkcs12
    ```

3. Then, create a signing request to get the certificate created in the previous step signed by the CA.

    ```bash
    $keytool -keystore kafka.server.keystore.jks -certreq -file cert-file -storepass $SRVPASS -keypass $SRVPASS
    ```

4. Now, send the signing request to the CA and get this certificate signed. Because we are using a self-signed certificate, we sign the certificate with our CA using the `openssl` command.

    ```bash
    $openssl x509 -req -CA ca-cert -CAkey ca-key -in cert-file -out cert-signed -days 365 -CAcreateserial -passin pass:$SRVPASS
    ```

5. Create a trust store and import the certificate of the CA.

    ```bash
    $keytool -keystore kafka.server.truststore.jks -alias CARoot -import -file ca-cert -storepass $SRVPASS -keypass $SRVPASS -noprompt
    ```

6. Import the public CA certificate into the keystore.

    ```bash
    $keytool -keystore kafka.server.keystore.jks -alias CARoot -import -file ca-cert -storepass $SRVPASS -keypass $SRVPASS -noprompt
    ```

7. Import the signed certificate into the keystore.

    ```bash
    $keytool -keystore kafka.server.keystore.jks -alias CARoot -import -file ca-cert -storepass $SRVPASS -keypass $SRVPASS -noprompt//output is "Certificate reply was added to keystore"
    ```

Importing the signed certificate into the keystore is the final step needed to configure the truststore and keystore for a Kafka broker.

## Update configuration to use SSL and restart brokers

We have setup each Kafka broker with a keystore and truststore, and imported the correct certificates.  Next, modify related Kafka configuration properties using Ambari and then restart the Kafka brokers.

1. Sign in to the Azure portal and select your Azure HDInsight Apache Kafka cluster.
1. Go to the Ambari UI by clicking **Ambari home** under **Cluster dashboards**.
1. Under **Kafka Broker** set the **listeners** property to `PLAINTEXT://localhost:9092,SSL://localhost:9093`
1. Under **Advanced kafka-broker** set the **security.inter.broker.protocol** property to `SSL`

    ![Editing kafka ssl configuration properties in Ambari](./media/apache-kafka-ssl-encryption-authentication/editing-configuration-ambari.png)

1. Under **Custom kafka-broker** set the **ssl.client.auth** property to `required`. This step is only required if you are setting up authentication as well as encryption.

    ![Editing kafka ssl configuration properties in Ambari](./media/apache-kafka-ssl-encryption-authentication/editing-configuration-ambari2.png)

1. Add configuration properties to the Kafka `server.properties` file to advertise IP addresses instead of the Fully Qualified Domain Name (FQDN).

    ```bash
    IP_ADDRESS=$(hostname -i)
    echo advertised.listeners=$IP_ADDRESS
    sed -i.bak -e '/advertised/{/advertised@/!d;}' /usr/hdp/current/kafka-broker/conf/server.properties
    echo "advertised.listeners=PLAINTEXT://$IP_ADDRESS:9092,SSL://$IP_ADDRESS:9093" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.keystore.location=/home/sshuser/ssl/kafka.server.keystore.jks" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.keystore.password=<server_password>" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.key.password=<server_password>" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.truststore.location=/home/sshuser/ssl/kafka.server.truststore.jks" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.truststore.password=<server_password>" >> /usr/hdp/current/kafka-broker/conf/server.properties
    ```

1. To verify that the previous changes have been made correctly, you can optionally check that the following lines are present in the Kafka `server.properties` file.

    ```bash
    advertised.listeners=PLAINTEXT://10.0.0.11:9092,SSL://10.0.0.11:9093
    ssl.keystore.location=/home/sshuser/ssl/kafka.server.keystore.jks
    ssl.keystore.password=<server_password>
    ssl.key.password=<server_password>
    ssl.truststore.location=/home/sshuser/ssl/kafka.server.truststore.jks
    ssl.truststore.password=<server_password>
    ```

1. Restart all Kafka brokers.

## Client setup (with authentication)

> [!Note]
> The following steps are required only if you are setting up both SSL encryption **and** authentication. If you are only setting up encryption, please proceed to [Client setup without authentication](apache-kafka-ssl-encryption-authentication.md#client-setup-without-authentication)

1. Export the client password. Replace `<client_password>` with the actual administrator password on the Kafka client machine.

    ```bash
    $export CLIPASS=<client_password>
    $cd ssl
    ```

1. Create a java keystore and get a signed certificate for the broker. Then copy the certificate to the VM where the CA is running.

    ```bash
    $keytool -genkey -keystore kafka.client.keystore.jks -validity 365 -storepass $CLIPASS -keypass $CLIPASS -dname "CN=mylaptop1" -alias my-local-pc1 -storetype pkcs12

    $keytool -keystore kafka.client.keystore.jks -certreq -file client-cert-sign-request -alias my-local-pc1 -storepass $CLIPASS -keypass $CLIPASS

    $scp client-cert-sign-request3 sshuser@wn0-umakaf:~/tmp1/client-cert-sign-request
    ```

1. Switch to the CA machine (wn0) to sign the client certificate.

    ```bash
    $cd ssl
    $openssl x509 -req -CA ca-cert -CAkey ca-key -in /tmp1/client-cert-sign-request -out /tmp1/client-cert-signed -days 365 -CAcreateserial -passin pass:<server_password>
    ```

1. Go to the client machine (hn1) and navigate to the `~/ssl` folder. Copy the signed cert to client machine.

    ```bash
    #copy signed cert to client machine
    $scp -i ~/kafka-security.pem sshuser@wn0-umakaf:/tmp1/client-cert-signed

    #copy signed cert to client machine
    $scp -i ~/kafka-security.pem sshuser@wn0-umakaf:/home/sshuser/ssl/ca-cert

    #Import CA cert to trust store 
    $keytool -keystore kafka.client.truststore.jks -alias CARoot -import -file ca-cert -storepass $CLIPASS -keypass $CLIPASS -noprompt

    #Import CA cert to key store
    $keytool -keystore kafka.client.keystore.jks -alias CARoot -import -file ca-cert -storepass $CLIPASS -keypass $CLIPASS -noprompt

    #Import signed client (cert client-cert-signed1) to keystore
    $keytool -keystore kafka.client.keystore.jks -import -file client-cert-signed -alias my-local-pc1 -storepass $CLIPASS -keypass $CLIPASS -noprompt
    ```

1. View the file `client-ssl-auth.properties` with the command `$cat client-ssl-auth.properties`. It should have the following lines:

    ```bash
    security.protocol=SSL
    ssl.truststore.location=/home/sshuser/ssl/kafka.client.truststore.jks
    ssl.truststore.password=<client_password>
    ssl.keystore.location=/home/sshuser/ssl/kafka.client.keystore.jks
    ssl.keystore.password=<client_password>
    ssl.key.password=<client_password>
    ```

## Client setup (without authentication)

1. Export the client password. Replace `<client_password>` with the actual administrator password on the Kafka client machine.

    ```bash
    $export CLIPASS=<client_password>
    $cd ssl
    ```

1. Go to the client machine (hn1) and navigate to the `~/ssl` folder. Copy the signed cert to client machine.

    ```bash
    #copy signed cert to client machine
    $scp -i ~/kafka-security.pem sshuser@wn0-umakaf:/home/sshuser/ssl/ca-cert .

    #NOW IMPORT CA cert to trust store
    $keytool -keystore kafka.client.truststore.jks -alias CARoot -import -file ca-cert -storepass $CLIPASS -keypass $CLIPASS -noprompt

    #Import CA cert to key store
    $keytool -keystore kafka.client.keystore.jks -alias CARoot -import -file ca-cert -storepass $CLIPASS -keypass $CLIPASS -noprompt
    ```

1. View the file `client-ssl-auth.properties` with the command `$cat client-ssl-auth.properties`. It should have the following lines:

    ```bash
    security.protocol=SSL
    ssl.truststore.location=/home/sshuser/ssl/kafka.client.truststore.jks
    ssl.truststore.password=<client_password>
    ```

## Next steps

* [What is Apache Kafka on HDInsight?](/../azure/hdinsight/kafka/apache-kafka-introduction)