---
title: Setup SSL Encryption and Authentication for Apache Kafka in Azure HDInsight
description: Setup SSL encryption for communication between clients and Kafka brokers as well as between brokers. Setup SSL authentication of clients.
services: hdinsight
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 12/05/2018
ms.author: hrasheed

---
# Setup SSL Encryption and Authentication for Apache Kafka in Azure HDInsight

This article describes the steps needed to setup SSL Encryption from clients to Kafka brokers and between the Kafka brokers. In addition to encryption, this article also covers the steps needed to setup authentication of clients (this is sometimes referred to as two-way SSL). You can skip the steps highlighted in yellow, if you need to only setup encryption, but no authentication.

## Server Setup

The first part is setting up the keystore and truststore in kafka brokers and importing the Certificate Authority (CA) and broker certificates into these stores.

> [!Note] 
> We will use self-signed certificates for this tutorial, but the most secure solution is to use certificates issued by  trusted CAs.

1. Create a folder named ssl and export the server password as an environment variable.

    ```bash
    $export SRVPASS=serverpassword123
    $mkdir ssl
    $cd ssl
    ```

2. Create a java keystore (kafka.server.keystore.jks).

    ```bash
    $keytool -genkey -keystore kafka.server.keystore.jks -validity 365 -storepass $SRVPASS -keypass $SRVPASS -dname "CN=wn0-umakaf.xvbseke35rbuddm4fyvhm2vz2h.cx.internal.cloudapp.net" -storetype pkcs12
    ```

This step also created a CA certificate. We now need to get a signed certificate for our broker. To do that, we create a certificate and get it signed by a CA.

3. Create signing request.

    ```bash
    $keytool -keystore kafka.server.keystore.jks -certreq -file cert-file -storepass $SRVPASS -keypass $SRVPASS
    ```

4. Send signing request to the CA and get this certificate signed by CA. Since we are using a self-signed cert, we will sign the certificate with our CA using the `openssl` command.

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

This concludes the steps needed to configure the truststore and keystore for a Kafka broker.

## Update configuration to use SSL and restart brokers

Now that we have setup the Kafka brokers with the key store and trust store, and imported the right certificates, now it’s time to tell Kafka brokers to use them. To do so, modify the below Kafka configurations from Ambari and then restart brokers.

1. Under **Kafka Broker**  set the **listeners** property to `PLAINTEXT://localhost:9092,SSL://localhost:9093`
1. Under **Advanced kafka-broker** set the **security.inter.broker.protocol** property to `SSL`

    ![Editing kafka ssl configuration properties in Ambari](./media/apache-kafka-ssl-encryption-authentication/editing-configuration-ambari.png)

1. Note: This step is only required if you are setting up authentication as well. Under **Custom kafka-broker** set the **ssl.client.auth** property to `required`.

    ![Editing kafka ssl configuration properties in Ambari](./media/apache-kafka-ssl-encryption-authentication/editing-configuration-ambari2.png)

1. Add below to kafka-env template

    ```bash
    #Configure Kafka to advertise IP addresses instead of FQDN
    IP_ADDRESS=$(hostname -i)
    echo advertised.listeners=$IP_ADDRESS
    sed -i.bak -e '/advertised/{/advertised@/!d;}' /usr/hdp/current/kafka-broker/conf/server.properties
    ```

    ```bash
    echo "advertised.listeners=PLAINTEXT://$IP_ADDRESS:9092,SSL://$IP_ADDRESS:9093" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.keystore.location=/home/sshuser/ssl/kafka.server.keystore.jks" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.keystore.password=serverpassword123" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.key.password=serverpassword123" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.truststore.location=/home/sshuser/ssl/kafka.server.truststore.jks" >> /usr/hdp/current/kafka-broker/conf/server.properties
    echo "ssl.truststore.password=serverpassword123" >> /usr/hdp/current/kafka-broker/conf/server.properties
    ```

1. To verify that the previous changes have been made correctly, you can optionally check that the following lines are present in the Kafka `server.properties` file.

    ```bash
    advertised.listeners=PLAINTEXT://10.0.0.11:9092,SSL://10.0.0.11:9093
    ssl.keystore.location=/home/sshuser/ssl/kafka.server.keystore.jks
    ssl.keystore.password=serverpassword123
    ssl.key.password=serverpassword123
    ssl.truststore.location=/home/sshuser/ssl/kafka.server.truststore.jks
    ssl.truststore.password=serverpassword123
    ```

1. Restart all Kafka brokers.

## Client Setup (With Authentication)

> [!Note]
> The following steps are required only if you are setting up both SSL encryption **and** authentication. If you are only setting up encryption, please proceed to [Client Setup Without Authentication](apache-kafka-ssl-encryption-authentication.md#client-setup-without-authentication)

1. Export client password

    ```bash
    $export CLIPASS=clientpassword123
    $cd ssl
    ```

1. Create a java keystore and get a signed certificate for our broker. Then copy the certificate to the VM where the CA is running.

    ```bash
    $keytool -genkey -keystore kafka.client.keystore.jks -validity 365 -storepass $CLIPASS -keypass $CLIPASS -dname "CN=mylaptop1" -alias my-local-pc1 -storetype pkcs12

    $keytool -keystore kafka.client.keystore.jks -certreq -file client-cert-sign-request -alias my-local-pc1 -storepass $CLIPASS -keypass $CLIPASS

    $scp client-cert-sign-request3 sshuser@wn0-umakaf:~/tmp1/client-cert-sign-request
    ```

1. Switch to the CA machine (wn0) to sign the client certificate.

    ```bash
    $cd ssl
    $openssl x509 -req -CA ca-cert -CAkey ca-key -in /tmp1/client-cert-sign-request -out /tmp1/client-cert-signed -days 365 -CAcreateserial -passin pass:serverpassword123
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

1. The result of viewing the file `client-ssl-auth.properties` with the command `$cat client-ssl-auth.properties` should contain the following lines.

    ```bash
    security.protocol=SSL
    ssl.truststore.location=/home/sshuser/ssl/kafka.client.truststore.jks
    ssl.truststore.password=clientpassword123
    ssl.keystore.location=/home/sshuser/ssl/kafka.client.keystore.jks
    ssl.keystore.password=clientpassword123
    ssl.key.password=clientpassword123
    ```

## Client Setup (Without Authentication)

1. Export client password

    ```bash
    $export CLIPASS=clientpassword123
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

1. The result of viewing the file `client-ssl-auth.properties` with the command `$cat client-ssl-auth.properties` should contain the following lines.

    ```bash
    security.protocol=SSL
    ssl.truststore.location=/home/sshuser/ssl/kafka.client.truststore.jks
    ssl.truststore.password=clientpassword123
    ```

## Next Steps

* [What is Apache Kafka on HDInsight?](/../azure/hdinsight/kafka/apache-kafka-introduction)