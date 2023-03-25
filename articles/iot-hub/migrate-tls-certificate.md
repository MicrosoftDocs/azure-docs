---
title: How to migrate hub root certificate
titleSuffix: Azure IoT Hub
description: Migrate all Azure IoT hub instances to use the new DigiCert Global G2 root certificate to maintain device connectivity.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 03/02/2023
---

# Migrate IoT Hub resources to a new TLS certificate root

Azure IoT Hub and Device Provisioning Service (DPS) use TLS certificates issued by the Baltimore CyberTrust Root, which expires in 2025. Starting in February 2023, all IoT hubs in the global Azure cloud will migrate to a new TLS certificate issued by the DigiCert Global Root G2.

You should start planning now for the effects of migrating your IoT hubs to the new TLS certificate:

* Any device that doesn't have the DigiCert Global Root G2 in its certificate store won't be able to connect to Azure.
* The IP address of the IoT hub will change.

> [!VIDEO 8f4fe09a-3065-4941-9b4d-d9267e817aad]

## Timeline

The IoT Hub team will begin migrating IoT hubs by region on **February 15, 2023** and completing by October 15, 2023. After all IoT hubs have migrated, then DPS will perform its migration between January 15 and February 15, 2024.

The subscription owners of each IoT hub will receive an email notification two weeks before their migration date.

### Request an extension

This TLS certificate migration is critical for the security of our customers and Microsoft's infrastructure, and is time-bound by the expiration of the Baltimore CyberTrust Root certificate. Therefore, there's little extra time that we can provide for customers that don't think their devices will be ready by February 15, 2023. If you absolutely can't meet the February 2023 target date, [fill out this form](https://aka.ms/BaltimoreAllow) with the details of your extension request, and then [email us](mailto:iot-ca-updates@microsoft.com?subject=Requesting%20extension%20for%20Baltimore%20migration) with a message that indicates you've completed the form, along with your company name. We can flag the specific hubs to be migrated later in the rollout window.

> [!NOTE]
> We are collecting this information to help with the Baltimore migration. We will hold onto this information until October 15th, 2023, when this migration is slated to complete. If you would like us to delete this information, please [email us](mailto:iot-ca-updates@microsoft.com) and we can assist you. For any additional questions about the Microsoft privacy policy, see the [Microsoft Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=521839).

## Required steps

To prepare for the migration, take the following steps before February 2023:

1. Keep the Baltimore CyberTrust Root in your devices' trusted root store. Add the DigiCert Global Root G2 and the Microsoft RSA Root Certificate Authority 2017 certificates to your devices. You can download all of these certificates from the [Azure Certificate Authority details](../security/fundamentals/azure-CA-details.md).

   It's important to have all three certificates on your devices until the IoT Hub and DPS migrations are complete. Keeping the Baltimore CyberTrust Root ensures that your devices will stay connected until the migration, and adding the DigiCert Global Root G2 ensures that your devices will seamlessly switch over and reconnect after the migration. The Microsoft RSA Root Certificate Authority 2017 helps prevent future disruptions in case the DigiCert Global Root G2 is retired unexpectedly.

2. Make sure that you aren't pinning any intermediate or leaf certificates, and are using the public roots to perform TLS server validation.

   IoT Hub and DPS occasionally roll over their intermediate certificate authority (CA). In these instances, your devices will lose connectivity if they explicitly look for an intermediate CA or leaf certificate. However, devices that perform validation using the public roots will continue to connect regardless of any changes to the intermediate CA.

For more information about how to test whether your devices are ready for the TLS certificate migration, see the blog post [Azure IoT TLS: Critical changes are almost here](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).

## Optional manual IoT hub migration

If you've prepared your devices and are ready for the TLS certificate migration, you can manually migrate your IoT hub root certificates yourself.

After you migrate to the new root certificate, it will take about 45 minutes for all devices to disconnect and reconnect with the new certificate. This timing is because the Azure IoT SDKs are programmed to reverify their connection every 45 minutes. If you've implemented a different pattern in your solution, then your experience may vary.

>[!NOTE]
>There is no manual migration option for Device Provisioning Service instances. That migration will happen automatically once all IoT hub instances have migrated. No additional action is required from you beyond having the new root certificate on your devices.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Certificates** in the **Security settings** section of the navigation menu.

1. Select the **TLS certificate** tab and select **Migrate to DigiCert Global G2**.

   :::image type="content" source="./media/migrate-tls-certificate/migrate-to-digicert-global-g2.png" alt-text="Screenshot of the TLS certificate tab, select 'Migrate to DigiCert Global G2.'":::

1. A series of checkboxes asks you to verify that you've prepared your devices for the migration. Check each box, confirming that your IoT solution is ready for the migration. Then, select **Update**.

1. Use the **Connected Devices** metric to verify that your devices are successfully reconnecting with the new certificate.

For more information about monitoring your devices, see [Monitoring IoT Hub](monitor-iot-hub.md).

If you encounter any issues, you can undo the migration and revert to the Baltimore CyberTrust Root certificate.

1. Select **Revert to Baltimore root** to undo the migration.

1. Again, a series of checkboxes asks you to verify that you understand how reverting to the Baltimore CyberTrust Root will affect your devices. Check each box, then select **Update**.

# [Azure CLI](#tab/cli)

Use the [az extension update](/cli/azure/extension#az-extension-update) command to make sure you have the latest version of the `azure-iot` extension.

```azurecli-interactive
az extension update --name azure-iot
```

Use the [az iot hub certificate root-authority show](/cli/azure/iot/hub/certificate/root-authority#az-iot-hub-certificate-root-authority-show) command to view the current certificate root-authority for your IoT hub.

```azurecli-interactive
az iot hub certificate root-authority show --hub-name <iothub_name>
```

>[!TIP]
>In the Azure CLI, the existing Baltimore CyberTrust Root certificate is referred to as `v1`, and the new DigiCert Global Root G2 certificate is referred to as `v2`.

Use the [az iot hub certificate root-authority set](/cli/azure/iot/hub/certificate/root-authority#az-iot-hub-certificate-root-authority-set) command to migrate your IoT hub to the new DigiCert Global Root G2 certificate.

```azurecli-interactive
az iot hub certificate root-authority set --hub-name <iothub_name> --certificate-authority v2
```

Verify that your migration was successful. We recommend using the **connected devices** metric to view devices disconnecting and reconnecting post-migration.

For more information about monitoring your devices, see [Monitoring IoT Hub](monitor-iot-hub.md).

If you encounter any issues, you can undo the migration and revert to the Baltimore CyberTrust Root certificate by running the previous command again with `--certificate authority v1`.

---

## Check the migration status of an IoT hub

To know whether an IoT hub has been migrated or not, check the active certificate root for the hub.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Certificates** in the **Security settings** section of the navigation menu.

1. If the **Certificate root** is listed as Baltimore CyberTrust, then the hub has not been migrated yet. If it is listed as DigiCert Global G2, then the migration is complete.

# [Azure CLI](#tab/cli)

Use the [az iot hub certificate root-authority show](/cli/azure/iot/hub/certificate/root-authority#az-iot-hub-certificate-root-authority-show) command to view the current certificate root-authority for your IoT hub.

```azurecli-interactive
az iot hub certificate root-authority show --hub-name <iothub_name>
```

In the Azure CLI, the existing Baltimore CyberTrust Root certificate is referred to as `v1`, and the new DigiCert Global Root G2 certificate is referred to as `v2`. If the certificate root is listed as **v2**, then the IoT hub has been successfully migrated.

---

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
1. **Keep the Baltimore CyberTrust Root on your device until the transition period is completed on 15 February 2024** (necessary to prevent connection interruption). 
2. **In addition** to the Baltimore Root, ensure the DigiCert Global G2 Root is added to your trusted root store. 
3. Make sure you aren’t pinning any intermediate or leaf certificates and are using the public roots to perform TLS server validation. 
4. In your IoT Central application you can find the Root Certification settings under **Settings** > **Application** > **Baltimore Cybertrust Migration**.  
   1. Select **DigiCert Global G2 Root** to migrate to the new certificate root. 
   2. Click **Save** to initiate the migration. 
   3. If needed, you can migrate back to the Baltimore root by selecting **Baltimore CyberTrust Root** and saving the changes. This option is available until 15 May 2023 and will then be disabled as Microsoft will start initiating the migration. 

### How long will it take my devices to reconnect?

Several factors can affect device reconnection behavior.

Devices are configured to reverify their connection at a specific interval. The default in the Azure IoT SDKs is to reverify every 45 minutes. If you've implemented a different pattern in your solution, then your experience may vary.

Also, as part of the migration, your IoT hub may get a new IP address. If your devices use a DNS server to connect to IoT hub, it can take up to an hour for DNS servers to refresh with the new address. For more information, see [IoT Hub IP addresses](iot-hub-understand-ip-address.md).

### When can I remove the Baltimore Cybertrust Root from my devices?

You can remove the Baltimore root certificate once all stages of the migration are complete. If you only use IoT Hub, then you can remove the old root certificate after the IoT Hub migration is scheduled to complete on October 15, 2023. If you use Device Provisioning Service or IoT Central, then you need to keep both root certificates on your device until the DPS migration is scheduled to complete on February 15, 2024.

## Troubleshoot

### Troubleshoot the self-migration tool

If you're using the CLI commands to migrate to a new root certificate and receive an error that `root-authority` isn't a valid command, make sure that you're running the latest version of the **azure-iot** extension.

1. Use `az extension list` to verify that you have the correct extension installed.

   ```azurecli
   az extension list
   ```

   This article uses the newest version of the Azure IoT extension, called `azure-iot`. The legacy version is called `azure-cli-iot-ext`. You should only have one version installed at a time.

   Use `az extension remove --name azure-cli-iot-ext` to remove the legacy version of the extension.

   Use `az extension add --name azure-iot` to add the new version of the extension.

1. Use `az extension update` to install the latest version of the **azure-iot** extension.

   ```azurecli
   az extension update --name azure-iot
   ```

### Troubleshoot device reconnection

If you're experiencing general connectivity issues with IoT Hub, check out these troubleshooting resources:

* [Connection and retry patterns with device SDKs](../iot-develop/how-to-use-reliability-features-in-sdks.md#connection-and-retry).
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
