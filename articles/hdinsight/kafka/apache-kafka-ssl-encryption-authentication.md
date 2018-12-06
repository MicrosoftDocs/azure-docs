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

This article describes the steps needed to setup SSL Encryption from clients to Kafka brokers and between the Kafka brokers. In addition to encryption, this article also covers the steps needed to setup authentication of clients. 

## Part 1: Server Setup

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
 
## PART2: UPDATE CONFIG TO USE SSL AND RESTART BROKERS:

listeners=PLAINTEXT://localhost:9092,SSL://localhost:9093
security.inter.broker.protocol=SSL
ssl.client.auth=required (Add as custom property)

Add below to kafka-env template:

```config
#Configure Kafka to advertise IP addresses instead of FQDN
IP_ADDRESS=$(hostname -i)
echo advertised.listeners=$IP_ADDRESS
sed -i.bak -e '/advertised/{/advertised@/!d;}' /usr/hdp/current/kafka-broker/conf/server.properties
echo "advertised.listeners=PLAINTEXT://$IP_ADDRESS:9092,SSL://$IP_ADDRESS:9093" >> /usr/hdp/current/kafka-broker/conf/server.properties

echo "ssl.keystore.location=/home/sshuser/ssl/kafka.server.keystore.jks" >> /usr/hdp/current/kafka-broker/conf/server.properties
echo "ssl.keystore.password=serverpassword123" >> /usr/hdp/current/kafka-broker/conf/server.properties
echo "ssl.key.password=serverpassword123" >> /usr/hdp/current/kafka-broker/conf/server.properties
echo "ssl.truststore.location=/home/sshuser/ssl/kafka.server.truststore.jks" >> /usr/hdp/current/kafka-broker/conf/server.properties
echo "ssl.truststore.password=serverpassword123" >> /usr/hdp/current/kafka-broker/conf/server.properties
```

To summarize, these are the changes, that should appear in kafka server.properties:

```bash
advertised.listeners=PLAINTEXT://10.0.0.11:9092,SSL://10.0.0.11:9093
ssl.keystore.location=/home/sshuser/ssl/kafka.server.keystore.jks
ssl.keystore.password=serverpassword123
ssl.key.password=serverpassword123
ssl.truststore.location=/home/sshuser/ssl/kafka.server.truststore.jks
ssl.truststore.password=serverpassword123
```

## PART3: CLIENT SETUP

```bash
$export CLIPASS=clientpassword123
$cd ssl

$keytool -genkey -keystore kafka.client.keystore.jks -validity 365 -storepass $CLIPASS -keypass $CLIPASS -dname "CN=mylaptop1" -alias my-local-pc1 -storetype pkcs12

$keytool -keystore kafka.client.keystore.jks -certreq -file client-cert-sign-request -alias my-local-pc1 -storepass $CLIPASS -keypass $CLIPASS

//Copy the cert to the vm where CA is there and we can sign there
$scp client-cert-sign-request3 sshuser@wn0-umakaf:~/tmp1/client-cert-sign-request
```

NOW SWITCH TO THE CA MACHINE (wn0) to SIGN the client cert
```bash
$cd ssl
$openssl x509 -req -CA ca-cert -CAkey ca-key -in /tmp1/client-cert-sign-request -out /tmp1/client-cert-signed -days 365 -CAcreateserial -passin pass:serverpassword123
//End CA MACHINE
```

GO BACK TO CLIENT (HN1) and navigate to ~/ssl folder

```bash
//copy signed cert to client machine
$scp -i ~/kafka-security.pem sshuser@wn0-umakaf:/tmp1/client-cert-signed .

//copy signed cert to client machine
$scp -i ~/kafka-security.pem sshuser@wn0-umakaf:/home/sshuser/ssl/ca-cert .

//NOW IMPORT CA cert to trust store 
$keytool -keystore kafka.client.truststore.jks -alias CARoot -import -file ca-cert -storepass $CLIPASS -keypass $CLIPASS -noprompt

//Import CA cert to key store
$keytool -keystore kafka.client.keystore.jks -alias CARoot -import -file ca-cert -storepass $CLIPASS -keypass $CLIPASS -noprompt

//Import signed client (cert client-cert-signed1) to keystore
$keytool -keystore kafka.client.keystore.jks -import -file client-cert-signed -alias my-local-pc1 -storepass $CLIPASS -keypass $CLIPASS -noprompt

$cat client-ssl-auth.properties

security.protocol=SSL
ssl.truststore.location=/home/sshuser/ssl/kafka.client.truststore.jks
ssl.truststore.password=clientpassword123
ssl.keystore.location=/home/sshuser/ssl/kafka.client.keystore.jks
ssl.keystore.password=clientpassword123
ssl.key.password=clientpassword123
```
