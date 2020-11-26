---
title: Troubleshooting - Azure Monitor Application Insights Java
description: Troubleshooting Azure Monitor Application Insights Java
ms.topic: conceptual
ms.date: 11/25/2020
ms.custom: devx-track-java
---
# Troubleshooting Azure Monitor Application Insights Java

## SSL Certificate Issues

This section covers the steps required to import ApplicationInsights Ingestion Endpoint's SSL Certificate into the Java keystore.

### Some key terminology:
*Keystore* is basically a repository of certificates, public and private keys. Usually JDK distributions have an executable to manage them – *keytool*

The following example is a simple command to import SSL certificates to the keystore:

`keytool -importcert -alias your_ssl_certificate -file “your downloaded SSL certificate name”.cer -keystore “Your KeyStore name” -storepass “Your keystore password” -noprompt`

> [!NOTE]
> If the KeyStore doesn't exist, it'll be automatically generated. There is also an option to set the keystore format through `storetype` argument. If not specified the keystore format defaults to JKS if using JAVA8 or older, else PKCS12.

### Steps to download and add the SSL Certificate:

1.	Open your favorite browser and go to 
    -   https://dc.services.visualstudio.com if not using Connection String to instrument your application.
    -   the `IngestionEndpoint` url present in the Connection String used to instrument your application as shown below

    :::image type="content" source="media/java-ipa/troubleshooting/IngestionEndpointUrl.PNG" alt-text="Application Insights Connection String":::

2.	Click on the 'View site information' (lock) icon on the browser and click on 'Certificate' option as show below

    :::image type="content" source="media/java-ipa/troubleshooting/CertificateIconCapture.PNG" alt-text="SSL Certificate Capture":::

3.	Go to details tab and click copy to file.
4.	Click the next button and select “Base-64 encoded X.509 (.CER)” format and select next.

    :::image type="content" source="media/java-ipa/troubleshooting/CertificateExportWizard.PNG" alt-text="SSL Certificate ExportWizard":::

5.	Specify the file you want to save the SSL certificate to. Finally click next and finish. You should see "The export was successful" message.
6.	Once you have the certificate its time to import the certificate into a Java keystore. Use the below command to import certificates.

> [!NOTE]
> Please make sure to repeat these steps after the current certificate is expired. You can find the expiration information in the "Details" tab of the Certificate popup as shown below

:::image type="content" source="media/java-ipa/troubleshooting/CertificateDetails.PNG" alt-text="SSL Certificate Details":::

