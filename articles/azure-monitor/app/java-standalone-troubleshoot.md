---
title: Troubleshoot Java for Azure Monitor Application Insights
description: Learn how to troubleshoot the Java agent for Azure Monitor Application Insights
ms.topic: conceptual
ms.date: 11/30/2020
ms.custom: devx-track-java
---
# Troubleshoot Java for Azure Monitor Application Insights

In this article, we cover some of the common issues that you might face while instrumenting a Java application by using the Java agent for Application Insights. We also cover the steps to resolve these issues. Application Insights is a feature of the Azure Monitor platform service.

## Check the self-diagnostic log file

By default, the Java 3.0 agent for Application Insights produces a log file named `applicationinsights.log` in the same directory that holds the `applicationinsights-agent-3.0.0.jar` file.

This log file is the first place to check for hints to any issues you might be experiencing.

## Upgrade from the Application Insights Java 2.x SDK

If you're already using the Application Insights Java 2.x SDK in your application, you can keep using it. The Java 3.0 agent will detect it. For more information, see [Upgrade from the Java 2.x SDK](./java-standalone-upgrade-from-2x.md).

## Upgrade from Application Insights Java 3.0 Preview

If you're upgrading from the Java 3.0 Preview agent, review all of the [configuration options](./java-standalone-config.md) carefully. The JSON structure has completely changed in the 3.0 general availability (GA) release.

These changes include:

-  The configuration file name has changed from `ApplicationInsights.json` to `applicationinsights.json`.
-  The `instrumentationSettings` node is no longer present. All content in `instrumentationSettings` is moved to the root level. 
-  Configuration nodes like `sampling`, `jmxMetrics`, `instrumentation`, and `heartbeat` are moved out of `preview` to the root level.

## Import SSL certificates

If you're using the default Java keystore, it will already have all of the CA root certificates. You shouldn't need to import more SSL certificates.

If you're using a custom Java keystore, you might need to import the Application Insights endpoint SSL certificates into it.

### Key terminology
A *keystore* is a repository of certificates, public keys, and private keys. Usually, Java Development Kit distributions have an executable to manage them: `keytool`.

The following example is a simple command to import an SSL certificate to the keystore:

`keytool -importcert -alias your_ssl_certificate -file "your downloaded SSL certificate name".cer -keystore "Your KeyStore name" -storepass "Your keystore password" -noprompt`

### Steps to download and add an SSL certificate

1.	Open your favorite browser and go to the `IngestionEndpoint` URL present in the connection string that's used to instrument your application.

    :::image type="content" source="media/java-ipa/troubleshooting/ingestion-endpoint-url.png" alt-text="Screenshot that shows an Application Insights connection string.":::

2.	Select the **View site information** (lock) icon in the browser, and then select the **Certificate** option.

    :::image type="content" source="media/java-ipa/troubleshooting/certificate-icon-capture.png" alt-text="Screenshot of the Certificate option in site information.":::

3.	Go to the **Details** tab and select **Copy to file**.
4.	Select the **Next** button, select **Base-64 encoded X.509 (.CER)** format, and then select **Next** again.

    :::image type="content" source="media/java-ipa/troubleshooting/certificate-export-wizard.png" alt-text="Screenshot of the Certificate Export Wizard, with a format selected.":::

5.	Specify the file where you want to save the SSL certificate. Then select **Next** > **Finish**. You should see a "The export was successful" message.
6.	After you have the certificate, it's time to import the certificate into a Java keystore. Use the [preceding command](#key-terminology) to import certificates.

> [!WARNING]
> You'll need to repeat these steps to get the new certificate before the current certificate expires. You can find the expiration information on the **Details** tab of the **Certificate** dialog box.
>
> :::image type="content" source="media/java-ipa/troubleshooting/certificate-details.png" alt-text="Screenshot that shows SSL certificate details.":::
