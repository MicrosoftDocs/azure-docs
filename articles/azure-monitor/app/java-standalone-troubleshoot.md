---
title: Troubleshooting Azure Monitor Application Insights for Java
description: Learn how to troubleshoot the Java agent for Azure Monitor Application Insights
ms.topic: conceptual
ms.date: 11/30/2020
ms.custom: devx-track-java
---
# Troubleshooting guide: Azure Monitor Application Insights for Java

In this article, we cover some of the common issues that you might face while instrumenting a Java application by using the Java agent for Application Insights. We also cover the steps to resolve these issues. Application Insights is a feature of the Azure Monitor platform service.

## Check the self-diagnostic log file

By default, the Java 3.0 agent for Application Insights produces a log file named `applicationinsights.log` in the same directory that holds the `applicationinsights-agent-3.0.2.jar` file.

This log file is the first place to check for hints to any issues you might be experiencing.

## JVM fails to start

If the JVM fails to start with "Error opening zip file or JAR manifest missing",
try re-downloading the agent jar file because it may have been corrupted during file transfer.

## Upgrade from the Application Insights Java 2.x SDK

If you're already using the Application Insights Java 2.x SDK in your application, you can keep using it. The Java 3.0 agent will detect it. For more information, see [Upgrade from the Java 2.x SDK](./java-standalone-upgrade-from-2x.md).

## Upgrade from Application Insights Java 3.0 Preview

If you're upgrading from the Java 3.0 Preview agent, review all of the [configuration options](./java-standalone-config.md) carefully. The JSON structure has completely changed in the 3.0 general availability (GA) release.

These changes include:

-  The configuration file name has changed from `ApplicationInsights.json` to `applicationinsights.json`.
-  The `instrumentationSettings` node is no longer present. All content in `instrumentationSettings` is moved to the root level. 
-  Configuration nodes like `sampling`, `jmxMetrics`, `instrumentation`, and `heartbeat` are moved out of `preview` to the root level.

## Some logging is not auto-collected

Logging is only captured if it first meets the level that is configured for the logging framework,
and second, also meets the level that is configured for Application Insights.

For example, if your logging framework is configured to log `WARN` (and above) from package `com.example`,
and Application Insights is configured to capture `INFO` (and above),
then Application Insights will only capture `WARN` (and above) from package `com.example`.

The best way to know if a particular logging statement meets the logging frameworks' configured threshold
is to confirm that it is showing up in your normal application log (e.g. file or console).

Also note that if an exception object is passed to the logger, then the log message (and exception object details)
will show up in the Azure portal under the `exceptions` table instead of the `traces` table.

See the [auto-collected logging configuration](./java-standalone-config.md#auto-collected-logging) for more details.

## Import SSL certificates

This section helps you to troubleshoot and possibly fix the exceptions related to SSL certificates when using the Java agent.

There are two different paths below for resolving this issue:
* If using a default Java keystore
* If using a custom Java keystore

If you aren't sure which path to follow, check to see if you have a JVM arg `-Djavax.net.ssl.trustStore=...`.
If you _don't_ have such a JVM arg, then you are probably using the default Java keystore.
If you _do_ have such a JVM arg, then you are probably using a custom keystore,
and the JVM arg will point you to your custom keystore.

### If using the default Java keystore:

Typically the default Java keystore will already have all of the CA root certificates. However there might be some exceptions, such as the ingestion endpoint certificate might be signed by a different root certificate. So we recommend the following three steps to resolve this issue:

1.	Check if the root certificate that was used to sign the Application Insights endpoint is already present in the default keystore. The trusted CA certificates, by default, are stored in `$JAVA_HOME/jre/lib/security/cacerts`. To list certificates in a Java keystore use the following command:
    > `keytool -list -v -keystore $PATH_TO_KEYSTORE_FILE`
 
    You can redirect the output to a temp file like this (will be easy to search later)
    > `keytool -list -v -keystore $JAVA_HOME/jre/lib/security/cacerts > temp.txt`

2. Once you have the list of certificates, follow these [steps](#steps-to-download-ssl-certificate) to download the root certificate that was used to sign the Application Insights endpoint.

    Once you have the certificate downloaded, generate a SHA-1 hash on the certificate using the below command:
    > `keytool -printcert -v -file "your_downloaded_root_certificate.cer"`
 
    Copy the SHA-1 value and check if this value is present in "temp.txt" file you saved previously.  If you are not able to find the SHA-1 value in the temp file, it indicates that the downloaded root cert is missing in default Java keystore.


3. Import the root certificate to the default Java keystore using the following command:
    >   `keytool -import -file "the cert file" -alias "some meaningful name" -keystore "path to cacerts file"`
 
    In this case it will be
 
    > `keytool -import -file "your downloaded root cert file" -alias "some meaningful name" $JAVA_HOME/jre/lib/security/cacerts`


### If using a custom Java keystore:

If you are using a custom Java keystore, you may need to import the Application Insights endpoint(s) root SSL certificate(s) into it.
We recommend the following two steps to resolve this issue:
1. Follow these [steps](#steps-to-download-ssl-certificate) to download the root certificate from the Application Insights endpoint.
2. Use the following command to import the root SSL certificate to the custom Java keystore:
    > `keytool -importcert -alias your_ssl_certificate -file "your downloaded SSL certificate name.cer" -keystore "Your KeyStore name" -storepass "Your keystore password" -noprompt`

### Steps to download SSL certificate

1.	Open your favorite browser and go to the `IngestionEndpoint` URL present in the connection string that's used to instrument your application.

    :::image type="content" source="media/java-ipa/troubleshooting/ingestion-endpoint-snippet.png" alt-text="Screenshot that shows an Application Insights connection string." lightbox="media/java-ipa/troubleshooting/ingestion-endpoint-snippet.png":::

2.	Select the **View site information** (lock) icon in the browser, and then select the **Certificate** option.

    :::image type="content" source="media/java-ipa/troubleshooting/certificate-icon-capture.png" alt-text="Screenshot of the Certificate option in site information." lightbox="media/java-ipa/troubleshooting/certificate-icon-capture.png":::

3.  Instead of downloading the 'leaf' certificate you should download the 'root' certificate as shown below. Later, you have to click on the "Certificate Path" -> Select the Root Certificate -> Click on 'View Certificate'. This will pop up a new certificate menu and you can download the certificate, from the new menu.

    :::image type="content" source="media/java-ipa/troubleshooting/root-certificate-selection.png" alt-text="Screenshot of how to select the root certificate." lightbox="media/java-ipa/troubleshooting/root-certificate-selection.png":::

4.	Go to the **Details** tab and select **Copy to file**.
5.	Select the **Next** button, select **Base-64 encoded X.509 (.CER)** format, and then select **Next** again.

    :::image type="content" source="media/java-ipa/troubleshooting/certificate-export-wizard.png" alt-text="Screenshot of the Certificate Export Wizard, with a format selected." lightbox="media/java-ipa/troubleshooting/certificate-export-wizard.png":::

6.	Specify the file where you want to save the SSL certificate. Then select **Next** > **Finish**. You should see a "The export was successful" message.

> [!WARNING]
> You'll need to repeat these steps to get the new certificate before the current certificate expires. You can find the expiration information on the **Details** tab of the **Certificate** dialog box.
>
> :::image type="content" source="media/java-ipa/troubleshooting/certificate-details.png" alt-text="Screenshot that shows SSL certificate details." lightbox="media/java-ipa/troubleshooting/certificate-details.png":::
