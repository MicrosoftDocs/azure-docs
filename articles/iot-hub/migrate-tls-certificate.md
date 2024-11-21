---
title: How to migrate hub root certificate
titleSuffix: Azure IoT Hub
description: Migrate all Azure IoT hub instances to use the new DigiCert Global G2 root certificate to maintain device connectivity.
author: kgremban

ms.author: kgremban
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/21/2024
---

# Migrate IoT Hub resources to a new TLS certificate root

Azure IoT Hub and Device Provisioning Service (DPS) use TLS certificates issued by the Baltimore CyberTrust Root, which expires in 2025. Starting in February 2023, all IoT hubs in the global Azure cloud will migrate to a new TLS certificate issued by the DigiCert Global Root G2.

You should start planning now for the effects of migrating your IoT hubs to the new TLS certificate:

* Any device that doesn't have the DigiCert Global Root G2 in its certificate store won't be able to connect to Azure.
* The IP address of the IoT hub will change.

> [!VIDEO 8f4fe09a-3065-4941-9b4d-d9267e817aad]

## Timeline

As of September 30, 2024, the migration is complete for all IoT Hub, IoT Central, and Device Provisioning Service resources.

## Required steps

To prepare for the migration, take the following steps:

1. Keep the Baltimore CyberTrust Root in your devices' trusted root store. Add the DigiCert Global Root G2 and the Microsoft RSA Root Certificate Authority 2017 certificates to your devices. You can download all of these certificates from the [Azure Certificate Authority details](../security/fundamentals/azure-CA-details.md).

   It's important to have all three certificates on your devices until the IoT Hub and DPS migrations are complete. Keeping the Baltimore CyberTrust Root ensures that your devices will stay connected until the migration, and adding the DigiCert Global Root G2 ensures that your devices will seamlessly switch over and reconnect after the migration. The Microsoft RSA Root Certificate Authority 2017 helps prevent future disruptions in case the DigiCert Global Root G2 is retired unexpectedly.

   For more information about IoT Hub's recommended certificate practices, see [TLS support](./iot-hub-tls-support.md).

2. Make sure that you aren't pinning any intermediate or leaf certificates, and are using the public roots to perform TLS server validation.

   IoT Hub and DPS occasionally roll over their intermediate certificate authority (CA). In these instances, your devices will lose connectivity if they explicitly look for an intermediate CA or leaf certificate. However, devices that perform validation using the public roots will continue to connect regardless of any changes to the intermediate CA.

For more information about how to test whether your devices are ready for the TLS certificate migration, see the blog post [Azure IoT TLS: Critical changes are almost here](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).

## Frequently asked questions

### My devices uses SAS/X.509/TPM authentication. Will this migration affect my devices?

Migrating the TLS certificate doesn't affect how devices are authenticated by IoT Hub. This migration does affect how devices authenticate the IoT Hub and DPS endpoints.

IoT Hub and DPS present their server certificate to devices, and devices authenticate that certificate against the root in order to trust their connection to the endpoints. Devices will need to have the new DigiCert Global Root G2 in their trusted certificate stores to be able to verify and connect to Azure after this migration.

### My devices use the Azure IoT SDKs to connect. Do I have to do anything to keep the SDKs working with the new certificate?

It depends.

* **Yes**, if you use the Java V1 device client. This client packages the Baltimore Cybertrust Root certificate along with the SDK. You can either update to Java V2 or manually add the DigiCert Global Root G2 certificate to your source code.
* **No**, if you use the other Azure IoT SDKs. Most Azure IoT SDKs rely on the underlying operating system’s certificate store to retrieve trusted roots for server authentication during the TLS handshake.

Regardless of the SDK used, we highly recommended that all customers validate their devices before migration, as described in the validation section of the blog post [Azure IoT TLS: Critical changes are almost here](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).

### My devices connect to a sovereign Azure region. Do I still need to update them?

No, only the [global Azure cloud](https://azure.microsoft.com/global-infrastructure/geographies) is affected by this change. Sovereign clouds aren't included in this migration.

### I use IoT Central. Do I need to update my devices?

Yes, IoT Central uses both IoT Hub and DPS in the backend. The TLS migration will affect your solution, and you need to update your devices to maintain connection.

You can migrate your application from the Baltimore CyberTrust Root to the DigiCert Global G2 Root on your own schedule. We recommend the following process:

1. **Keep the Baltimore CyberTrust Root on your device until the transition period is completed on September 30, 2024** (necessary to prevent connection interruption). 
2. **In addition** to the Baltimore Root, ensure the DigiCert Global G2 Root is added to your trusted root store.
3. Make sure you aren’t pinning any intermediate or leaf certificates and are using the public roots to perform TLS server validation.
4. In your IoT Central application you can find the Root Certification settings under **Settings** > **Application** > **Baltimore Cybertrust Migration**.  
   1. Select **DigiCert Global G2 Root** to migrate to the new certificate root.
   2. Click **Save** to initiate the migration.
   3. If needed, you can migrate back to the Baltimore root by selecting **Baltimore CyberTrust Root** and saving the changes. This option is available until 15 August 2023 and will then be disabled.

### How long will it take my devices to reconnect?

Several factors can affect device reconnection behavior.

Devices are configured to reverify their connection at a specific interval. The default in the Azure IoT SDKs is to reverify every 45 minutes. If you've implemented a different pattern in your solution, then your experience might vary.

Also, as part of the migration, your IoT hub might get a new IP address. If your devices use a DNS server to connect to IoT hub, it can take up to an hour for DNS servers to refresh with the new address. For more information, see [IoT Hub IP addresses](iot-hub-understand-ip-address.md).

### When can I remove the Baltimore Cybertrust Root from my devices?

You can remove the Baltimore root certificate once all stages of the migration are complete. If you only use IoT Hub, then you can remove the old root certificate after the IoT Hub migration is scheduled to complete on October 15, 2023. If you use Device Provisioning Service or IoT Central, then you need to keep both root certificates on your device until the DPS migration is scheduled to complete on September 30, 2024.

## Troubleshoot

If you're experiencing general connectivity issues with IoT Hub, check out these troubleshooting resources:

* [Connection and retry patterns with device SDKs](../iot/concepts-manage-device-reconnections.md#connection-and-retry).
* [Understand and resolve Azure IoT Hub error codes](troubleshoot-error-codes.md).

If you're watching Azure Monitor after migrating certificates, you should look for a DeviceDisconnect event followed by a DeviceConnect event, as demonstrated in the following screenshot:

:::image type="content" source="./media/migrate-tls-certificate/monitor-device-disconnect-connect.png" alt-text="Screenshot of Azure Monitor logs showing DeviceDisconnect and DeviceConnect events.":::

If your device disconnects but doesn't reconnect after the migration, try the following steps:

* Check that your DNS resolution and handshake request completed without any errors.

* Verify that the device has both the DigiCert Global Root G2 certificate and the Baltimore certificate installed in the certificate store.

* Use the following Kusto query to identify connection activity for your devices. For more information, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).

  ```kusto
  AzureDiagnostics
  | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
  | where Category == "Connections"
  | extend parsed_json = parse_json(properties_s)
  | extend SDKVersion = tostring(parsed_json.sdkVersion), DeviceId = tostring(parsed_json.deviceId), Protocol = tostring(parsed_json.protocol)
  | distinct TimeGenerated, OperationName, Level, ResultType, ResultDescription, DeviceId, Protocol, SDKVersion
  ```

* Use the **Metrics** tab of your IoT hub in the Azure portal to track the device reconnection process. Ideally, you should see no change in your devices before and after you complete this migration. One recommended metric to watch is **Connected Devices**, but you can use whatever charts you actively monitor.
