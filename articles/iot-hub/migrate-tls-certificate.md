---
title: Migrate root certificate to DigiCert Global G2 - Azure IoT Hub | Microsoft Docs
description: All IoT hub instances need to migrate to a new root certificate to maintain device connectivity.
author: kgremban
ms.author: kgremban
manager: lizross
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/19/2022
---

# Migrate IoT Hub resources to a new TLS certificate root

Azure IoT Hub and Device Provisioning Service (DPS) use TLS certificates issued by the Baltimore CyberTrust Root, which expires in 2025. Starting in February 2023 and completing by September 2023, all IoT hubs in the public Azure cloud will migrate to a new TLS certificate issued by the DigiCert Global Root G2.

You should start planning now for the effects of migrating your IoT hubs to the new TLS certificate:

* Any device that doesn't have the DigiCert Global Root G2 in its certificate store won't be able to connect to Azure.
* The IP address of the IoT hub will change.

## Timeline

The IoT Hub team will begin migrating IoT hubs by region on **February 15, 2023**. After all IoT hubs have migrated, then DPS will perform its migration. Both the IoT Hub and DPS migrations will be finished no later than September 2023.

### Request an extension

This TLS certificate migration is critical for the security of our customers as well as Microsoft's infrastructure, and is time-bound by the expiration of the Baltimore CyberTrust Root certificate. Therefore, there's little extra time that we can provide for customers that don't think their devices will be ready by February 2023. If you absolutely can't meet the February 2023 target date, [contact us](mailto:iot-ca-updates@microsoft.com?subject=Baltimore%20Migration:%20Request%20for%20whitelisting%20%3ccustomer%20name%3e%20hubs%20) and provide the details of the IoT hub(s) that need additional time. We can flag them to be migrated at the end of the rollout window.

## Required steps

To prepare for the migration, take the following steps before February 2023:

1. Keep the Baltimore CyberTrust Root in your devices' trusted root store, and add the DigiCert Global Root G2. You can download both certificates from the [DigiCert trusted root authority](https://www.digicert.com/kb/digicert-root-certificates.htm).

   It's important to have both certificates on your devices until the IoT Hub and DPS migration is complete in late 2023. Keeping the Baltimore CyberTrust Root ensures that your devices will stay connected until the migration, and adding the DigiCert Global Root G2 ensures that your devices will seamlessly switch over and reconnect after the migration.

2. Make sure that you aren't pinning any intermediate or leaf certificates, and are using the public roots to perform TLS server validation.

   IoT Hub and DPS occasionally roll over their intermediate certificate authority (CA). In these instances, your devices will lose connectivity if they explicitly look for an intermediate CA or leaf certificate. However, devices that perform validation using the public roots will continue to connect regardless of any changes to the intermediate CA.

For more information about how to validate if your devices are ready for the TLS certificate migration, see the blog post [Azure IoT TLS: Critical changes are almost here](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).

## Optional manual IoT hub migration

If you've prepared your devices and are ready for the TLS certificate migration before February 2023, you can manually migrate your certificates yourself.

This manual migration process, and the ability to revert to the previous TLS certificate, is available only until February 2023. After that, migration will be exclusively handled by Microsoft.

After migrating the root certificate, it will take about 45 minutes for all devices to disconnect and reconnect with the new certificate. This timing is because the Azure IoT SDKs are programmed to reverify their connection every 45 minutes. If you've implemented a different pattern in your solution, then your experience may vary.

>[!NOTE]
>There is no manual migration option for Device Provisioning Service instances. That migration will happen automatically once all IoT hub have migrated. No additional action is required from you beyond having the new root certificate on your devices.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Certificates** in the **Security settings** section of the navigation menu.

1. Select the **TLS certificate** tab and select **Migrate to DigiCert Global G2**.

   :::image type="content" source="./media/migrate-tls-certificate/migrate-to-digicert-global-g2.png" alt-text="In the TLS certificate tab, select 'Migrate to DigiCert Global G2.'":::

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
az iot hub certificate root-authority show --name <iothub_name>
```

>[!TIP]
>In the Azure CLI, the existing Baltimore CyberTrust Root certificate is referred to as `v1`, and the new DigiCert Global Root G2 certificate is referred to as `v2`.

Use the [az iot hub certificate root-authority set](/cli/azure/iot/hub/certificate/root-authority#az-iot-hub-certificate-root-authority-set) command to migrate your IoT hub to the new DigiCert Global Root G2 certificate.

```azurecli-interactive
az iot hub certificate root-authority set --name <iothub_name> --certificate-authority v2
```

Verify that your migration was successful. We recommend using the **connected devices** metric to view devices disconnecting and reconnecting post-migration. 

For more information about monitoring your devices, see [Monitoring IoT Hub](monitor-iot-hub.md).

If you encounter any issues, you can undo the migration and revert to the Baltimore CyberTrust Root certificate by running the previous command again with `--certificate authority v1`.

---

## Frequently asked questions

### My devices uses SAS/X.509/TPM authentication. Will this migration affect my devices?

Migrating the TLS certificate does not affect how devices are authenticated by IoT Hub. This migration does affect how devices authenticate the IoT Hub and DPS endpoints.

IoT Hub and DPS present their server certificate to devices, and devices authenticate that certificate against the root in order to trust their connection to the endpoints. Devices will need to have the new DigiCert Global Root G2 in their trusted certificate stores to be able to verify and connect to Azure after this migration.

### My devices use the Azure IoT SDKs to connect. Do I have to do anything?

Yes, while most Azure IoT SDKs (except the Java V1 device client that packages the Baltimore root along with the SDK) rely on the underlying operating system’s certificate store to retrieve trusted roots for server authentication during the TLS handshake, it's highly recommended to validate your devices against the endpoints made available as described in the validation section of the blog post [Azure IoT TLS: Critical changes are almost here](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).

### My devices connect to a sovereign Azure region. Do I still need to update them?

No, only the [public Azure cloud](https://azure.microsoft.com/global-infrastructure/geographies) is affected by this change. Sovereign clouds are not included in this migration.

### I use IoT Central. Do I need to update my devices?

Yes, IoT Central uses IoT Hub in the backend. The TLS migration will affect your solution, and you need to update your devices to maintain connection.