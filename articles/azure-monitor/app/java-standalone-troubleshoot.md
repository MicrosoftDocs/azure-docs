---
title: Troubleshooting - Azure Monitor Application Insights Java
description: Troubleshooting Azure Monitor Application Insights Java
ms.topic: conceptual
ms.date: 11/30/2020
ms.custom: devx-track-java
---
# Troubleshooting Azure Monitor Application Insights Java

In this article, we covered some of the common issues a user might face while instrumenting java application using the java agent along with the steps to resolve these issues.

## Self-diagnostic log file

By default, Application Insights Java 3.0 will produce a log file named `applicationinsights.log` in the same directory where the `applicationinsights-agent-3.0.0.jar` file is located.

This log file is the first place to check for hints to any issues you may be experiencing.

## Upgrade from Application Insights Java 2.x SDK

See [Upgrade from 2.x SDK](./java-standalone-upgrade-from-2x.md).

## Upgrade from 3.0 Preview

If upgrading from 3.0 Preview, please review all of the [configuration options](./java-standalone-config.md) carefully, as the json structure has completely changed in the 3.0 GA release.

These changes include:

1.  The configuration file name itself has changed from `ApplicationInsights.json` to `applicationinsights.json`.
2.  The `instrumentationSettings` node is no longer present. All content in `instrumentationSettings` is moved to the root level. 
3.  Configuration nodes like `sampling`, `jmxMetrics`, `instrumentation` and `heartbeat` are moved out of `preview` to the root level.

## SSL certificate issues

If you are using the default Java keystore, it will already have all of the CA root certificates and you should not need to import any further SSL certificates.

If you are using a custom Java keystore, you may need to import the Application Insights Endpoint SSL Certificates into it.

### Some key terminology:
*Keystore* is a repository of certificates, public and private keys. Usually JDK distributions have an executable to manage them – `keytool`.

The following example is a simple command to import an SSL certificate to the keystore:

`keytool -importcert -alias your_ssl_certificate -file "your downloaded SSL certificate name".cer -keystore "Your KeyStore name" -storepass "Your keystore password" -noprompt`

### Steps to download and add the SSL Certificate:

1.	Open your favorite browser and go to the `IngestionEndpoint` url present in the Connection String used to instrument your application as shown below

    :::image type="content" source="media/java-ipa/troubleshooting/ingestion-endpoint-url.png" alt-text="Application Insights Connection String":::

2.	Click on the 'View site information' (lock) icon on the browser and click on 'Certificate' option as show below

    :::image type="content" source="media/java-ipa/troubleshooting/certificate-icon-capture.png" alt-text="SSL Certificate Capture":::

3.	Go to details tab and click copy to file.
4.	Click the next button and select “Base-64 encoded X.509 (.CER)” format and select next.

    :::image type="content" source="media/java-ipa/troubleshooting/certificate-export-wizard.png" alt-text="SSL Certificate ExportWizard":::

5.	Specify the file you want to save the SSL certificate to. Finally click next and finish. You should see "The export was successful" message.
6.	Once you have the certificate its time to import the certificate into a Java keystore. Use the above [command](#some-key-terminology) to import certificates.

> [!WARNING]
> You will need to repeat these steps to get the new certificate before the current certificate expires. You can find the expiration information in the "Details" tab of the Certificate popup as shown below

:::image type="content" source="media/java-ipa/troubleshooting/certificate-details.png" alt-text="SSL Certificate Details":::
