---
title: Move Azure IoT Hub and Device provisioning Service (DPS) off DigiCert Global Root Certificate Authority (G1) in national clouds
description: Learn why, when, and how to move devices and back-end apps in Azure Government and Azure in China from DigiCert Global Root G1 to IoT Hub and DPS endpoints that chain to DigiCert Global Root G2 and G3.
services: iot-hub
author: jesusbar
ms.author: jesusbar
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/17/2026
ms.custom: references_regions
#customer intent: As a developer or IT admin with devices and apps in Azure Government or Azure in China, I want to move off DigiCert Global Root G1 so that trust-store updates don't break connectivity to IoT Hub and DPS.
---

# Move IoT Hub and DPS off DigiCert Global Root G1 in national clouds

This article applies to Azure IoT Hub and Azure IoT Hub Device Provisioning Service (DPS) in Azure Government and Azure in China. It explains why and when to move devices and back-end apps off DigiCert Global Root CA, also called DigiCert Global Root G1 (G1), which root certificates to trust instead, and how to move without downtime.

In these clouds, IoT Hub and DPS offer endpoints that chain to different root certificates:

- The IoT hub **classic** hostname supports TLS 1.2 only and presents a certificate that chains to G1.
- The IoT hub **device** and **service** hostnames support TLS 1.3 and present certificates that chain to DigiCert Global Root G2 (G2) or DigiCert Global Root G3 (G3). For more information about the classic, device, and service hostnames, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).
- The DPS **global device endpoint** presents a certificate that chains to G1.
- The DPS **instance endpoint**, shown as **Service endpoint** in the Azure portal, presents a certificate that chains to G2. For more information about both DPS endpoints, see [Service operations endpoint](../iot-dps/concepts-service.md#service-operations-endpoint) and [Device provisioning endpoint](../iot-dps/concepts-service.md#device-provisioning-endpoint).

The device and service hostnames reach the same IoT hub as the classic hostname, and the instance endpoint reaches the same DPS instance as the global device endpoint. Device identities, keys, X.509 certificates, shared access signature (SAS) tokens, data, and routes don't change. Only the hostname and the certificate chain change.

> [!NOTE]
> This article covers national clouds only. For global Azure, see [Transport Layer Security (TLS) support in IoT Hub](iot-hub-tls-support.md).

## Why move off G1

- In April 2026, the Mozilla and Google Chrome root programs stopped trusting G1 for TLS server authentication. Operating systems, language runtimes, container base images, platform services, and device firmware that follow these programs remove G1 as they update.
- After such an update, a client that connects to the classic hostname or the DPS global device endpoint can't validate the server certificate, and the TLS connection fails. The failure is in the client's trust store. Your IoT hub, your DPS instance, and their certificates are healthy.
- Clients that connect to the device and service hostnames and to the DPS instance endpoint don't depend on G1, so trust-store updates that remove G1 don't affect them.

## When to move

| Your situation | What to do |
|---|---|
| A. Clients fail with an untrusted root or certificate chain error after an OS, firmware, CA bundle, base image, or runtime update. | Move the affected clients now, starting with [step 1](#step-1-trust-digicert-global-root-g2-and-g3). |
| B.  You plan an OS, firmware, CA bundle, base image, or runtime update. | Move your clients first, and then roll out the update. |
| C.  You're building new devices or apps. | Use the device and service hostnames and the DPS instance endpoint from the start to avoid deploying clients with G1 trust. |
| D.  Some devices can't be changed, for example because their firmware is read-only or they pin certificates. | Keep these devices on the classic hostname and the DPS global device endpoint, keep G1 in their trust store, and make sure that they send SNI (see [Send SNI](#send-sni)). Move them when you update or replace them. |
| E.  Your clients still trust G1, and you don't plan updates. | No immediate action is needed. Plan the move so that a future update doesn't interrupt connectivity. |
> [!IMPORTANT]
>Microsoft currently has no plans to retire DigiCert Global Root G1 from the classic IoT Hub endpoint or the DPS global device endpoint. This change might change in the future. If it does, Microsoft will notify customers in advance.

## Endpoints and certificates in national clouds

| Endpoint | Azure Government | Azure in China | Certificate chain | TLS | Used by |
|---|---|---|---|---|---|
| IoT hub classic hostname | `<hub-name>.azure-devices.us` | `<hub-name>.azure-devices.cn` | G1 (RSA) | TLS 1.2 | Existing devices and back-end apps. Unchanged. |
| IoT hub device hostname | `<hub-name>.device.azure-devices.us` | `<hub-name>.device.azure-devices.cn` | G3 (ECC) when the client advertises ECDSA. G2 (RSA) when it doesn't. | TLS 1.3, or TLS 1.2 with ECDHE cipher suites. SNI required. | Devices and modules only |
| IoT hub service hostname | `<hub-name>.service.azure-devices.us` | `<hub-name>.service.azure-devices.cn` | Same as the device hostname | Same as the device hostname | Back-end apps and tools only. Never devices. |
| DPS global device endpoint | `global.azure-devices-provisioning.us` | `global.azure-devices-provisioning.cn` | G1 (RSA) | TLS 1.3, TLS 1.2 | Devices that provision through the global endpoint. Unchanged. |
| DPS instance endpoint (**Service endpoint** on the DPS **Overview** page) | `<dps-name>.azure-devices-provisioning.us` | `<dps-name>.azure-devices-provisioning.cn` | G2 (RSA only). Never G3. | TLS 1.3, TLS 1.2 | Devices that provision off G1, and back-end apps that call DPS service APIs |

For more information about the IoT hub hostnames, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md). Each endpoint presents the same certificates on port 443 (HTTPS, and MQTT or AMQP over WebSockets), port 8883 (MQTT), and port 5671 (AMQP).

The DPS instance endpoint is the [service operations endpoint](../iot-dps/concepts-service.md#service-operations-endpoint) of your DPS instance. In national clouds, devices can also provision through it to use a certificate chain that doesn't depend on G1. The global device endpoint hostname for each cloud is listed in these references:

| Cloud | DPS global device endpoint | Cloud Reference |
|---|---|---|
| Global Azure | `global.azure-devices-provisioning.net` | [Device provisioning endpoint](../iot-dps/concepts-service.md#device-provisioning-endpoint) |
| Azure Government | `global.azure-devices-provisioning.us` | [What is Azure Government?](../azure-government/documentation-government-welcome.md) |
| Azure China | `global.azure-devices-provisioning.cn` | [What is Azure in China?](../china/overview-operations.md) |

The rest of this article uses Azure Government hostnames in its examples. In Azure China, replace `.us` with `.cn`.

### Find your hostnames

# [Azure portal](#tab/portal)

- **IoT hub:** On the **Overview** page of your IoT hub, the **Essentials** section shows the **Service hostname** and the **Device hostname**.
- **DPS:** On the **Overview** page of your DPS instance, **Service endpoint** shows the instance endpoint, and **Global device endpoint** shows the global device endpoint.

# [Azure CLI](#tab/cli)

```azurecli
az iot hub show --name <hub-name> --resource-group <resource-group> --query "{classic:properties.hostName, device:properties.deviceHostName}"
az iot dps show --name <dps-name> --resource-group <resource-group> --query "{instance:properties.serviceOperationsHostName, global:properties.deviceProvisioningHostName}"
```

---

## Which root certificates to trust: G2, G3, or both

> [!IMPORTANT]
> The endpoint chooses the certificate. Your client can't request one.
>
> - The IoT Hub device and service hostnames default to ECC. When your client's TLS handshake advertises ECDSA signature algorithms, the endpoint presents an ECC certificate that chains to DigiCert Global Root G3. OpenSSL advertises ECDSA by default, so a plain `openssl` test shows G3.
> - When your client doesn't advertise ECDSA (an RSA-only configuration), the same endpoints present an RSA certificate that chains to DigiCert Global Root G2.
> - Your client only advertises what it supports. The endpoint picks the chain.
> - DPS never serves G3. In national clouds, DPS serves G2 (RSA) only on its instance endpoint. The DPS global device endpoint stays on G1.
> - The classic IoT Hub hostname serves G1.
>
> Trust both DigiCert Global Root G2 and DigiCert Global Root G3. That works for every client configuration, and for DPS and IoT Hub together.

In this article, an *RSA-only* client is a client that advertises no ECDSA signature algorithms when it uses TLS 1.3, or offers no ECDHE-ECDSA cipher suites when it uses TLS 1.2. The endpoints behave the same way with TLS 1.3 and TLS 1.2, and on every port.

| Endpoint | Client advertises ECDSA (the default for most TLS stacks) | RSA-only client |
|---|---|---|
| IoT Hub device hostname | ECC certificate, DigiCert Global Root G3 | RSA certificate, DigiCert Global Root G2 |
| IoT Hub service hostname | ECC certificate, DigiCert Global Root G3 | RSA certificate, DigiCert Global Root G2 |
| DPS instance endpoint | RSA certificate, DigiCert Global Root G2 | RSA certificate, DigiCert Global Root G2 |
| DPS global device endpoint | RSA certificate, DigiCert Global Root G1 | RSA certificate, DigiCert Global Root G1 |
| IoT Hub classic hostname | RSA certificate, DigiCert Global Root G1 (see the following note) | RSA certificate, DigiCert Global Root G1 |

> [!NOTE]
> The classic hostname presents its RSA certificate, which chains to G1, to any client that offers RSA cipher suites. The classic hostname also holds an ECC certificate that chains to DigiCert Global Root G3. It presents that certificate only to a TLS 1.2 client that offers ECDHE-ECDSA cipher suites and no RSA cipher suites. To move off G1, use the device and service hostnames.

| Your client trusts | IoT Hub device and service hostnames | DPS instance endpoint | Outcome |
|---|---|---|---|
| DigiCert Global Root G2 and G3 (recommended) | Works, whether or not the client advertises ECDSA | Works | Works for every client configuration |
| G2 only | Works only while the client is locked to RSA. Fails as soon as a library update or configuration change starts advertising ECDSA. | Works | Fragile. Use only with a documented RSA-only lock. |
| G3 only | Works only when the client advertises ECDSA. Fails for RSA-only clients. | Fails, because DPS serves only G2. | Never enough |

| Root certificate | SHA-1 thumbprint | Download |
|---|---|---|
| DigiCert Global Root G2 | `DF3C24F9BFD666761B268073FE06D1CC8D4F82A4` | https://cacerts.digicert.com/DigiCertGlobalRootG2.crt |
| DigiCert Global Root G3 | `7E04DE896A3E666D00E687D33FFAD93BE83D349E` | https://cacerts.digicert.com/DigiCertGlobalRootG3.crt |
| DigiCert Global Root CA (G1). Needed only for the classic hostname and the DPS global device endpoint. | `A8985D3A65E5E5C4B2D7D66D40C6DD2FB19C5436` | https://cacerts.digicert.com/DigiCertGlobalRootCA.crt |

For more information, see [Azure Certificate Authority details](../security/fundamentals/azure-ca-details.md).

- Trust the root certificates. Don't pin intermediate or leaf certificates, because they change. In Azure Government, the chains also include Microsoft TLS intermediate certificates and the cross-signed **Microsoft TLS RSA Root G2** and **Microsoft TLS ECC Root G2** certificates, which chain to G2 and G3.
- Keep G1 trusted until no client uses the classic hostname or the DPS global device endpoint.

### Send SNI

IoT Hub and DPS expect every client to send the Server Name Indication (SNI) TLS extension with the hostname that it connects to. Most TLS stacks send SNI by default, but some embedded TLS adapters and older SDK versions don't.

- **IoT Hub device and service hostnames:** SNI is required. Without SNI, the endpoint presents the classic hostname's certificate, which chains to G1 and doesn't match the device or service hostname, so certificate validation fails.
- **DPS global device endpoint:** With SNI, the endpoint presents its G1 certificate. Without SNI, it presents a certificate that chains to DigiCert Global Root G2. A device that trusts only G1 and doesn't send SNI can't connect to the global device endpoint.
- **DPS instance endpoint:** The endpoint presents the same G2 certificate with or without SNI.

## Prerequisites

- The latest Azure CLI and `azure-iot` extension. The commands in this article require `azure-iot` 1.0.0 or later, which requires Azure CLI 2.73.0 or later.

  ```azurecli
  az cloud set --name AzureUSGovernment    # Azure in China: az cloud set --name AzureChinaCloud
  az login
  az extension add --upgrade --name azure-iot
  ```

- An inventory of everything that uses the classic hostname or the DPS global device endpoint: devices, IoT Edge devices, back-end apps and scripts, DPS enrollments, firewall and proxy rules, and private endpoints.

## Checklist by role

| Developer | IT admin |
|---|---|
| Add G2 and G3 to every trust store that your code uses: device firmware, embedded SDK certificate lists, container images, and app hosts. | Inventory the IoT hubs, DPS instances, devices, IoT Edge devices, and back-end apps that use G1 endpoints. |
| Send SNI. Support TLS 1.3, or TLS 1.2 with ECDHE cipher suites and the P-256 or P-384 curve. | Allow the device and service hostnames and the DPS instance endpoint in firewalls and proxies. |
| Use the device hostname for devices and the service hostname for back-end apps. | Check private endpoints and private DNS for the new hostnames. |
| Accept `.device.` hostnames in any code that validates hostnames. | Link the IoT hub's device hostname in DPS, and then pin and move enrollments in waves. |
| Provision through the DPS instance endpoint, and handle re-registration. | Roll out updates that remove G1 only after clients move. |
| Test ECDSA and RSA-only handshakes before rollout. | Watch connected-device counts and provisioning results in each wave. |

## Plan the move

1. **Trust:** Add G2 and G3 to every client. Keep G1 for now.
1. **Back-end apps:** Move back-end apps to the service hostname.
1. **Devices:** Move devices that connect directly to IoT Hub to the device hostname, in waves.
1. **DPS:** Move devices that use DPS to the instance endpoint, link the IoT hub's device hostname, and move enrollments in waves.
1. **Validate:** Check each wave.
1. **Update:** Roll out OS, firmware, or trust-store updates that remove G1 only after the move.

## Step 1: Trust DigiCert Global Root G2 and G3

Most current operating system and runtime trust stores already include G2 and G3. Check minimal container images, custom trust stores, embedded certificate lists, and IoT Edge trust bundles.

The following commands are examples of how to download the root certificates, check their thumbprints, and add them to a Linux trust store. Your implementation might be different, depending on your operating system, runtime, TLS library, and device platform.

```bash
for r in DigiCertGlobalRootG2 DigiCertGlobalRootG3; do
  curl -fsSL -o "$r.crt" "https://cacerts.digicert.com/$r.crt"
  openssl x509 -inform DER -in "$r.crt" -out "$r.pem"
  openssl x509 -in "$r.pem" -noout -subject -fingerprint -sha1   # Compare with the thumbprints in this article
done

# Debian or Ubuntu
sudo cp DigiCertGlobalRootG2.pem /usr/local/share/ca-certificates/DigiCertGlobalRootG2.crt
sudo cp DigiCertGlobalRootG3.pem /usr/local/share/ca-certificates/DigiCertGlobalRootG3.crt
sudo update-ca-certificates

# Red Hat Enterprise Linux
sudo cp DigiCertGlobalRootG2.pem DigiCertGlobalRootG3.pem /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust
```

Other examples:

- **Java apps that use a custom truststore:** Import both root certificates with `keytool -importcert`.
- **Azure IoT C SDK with embedded certificates (`certs.c`):** When no selection macro is defined, the embedded list includes all root certificates, including G2 and G3. `USE_PORTAL_AZURE_CN_CERT` includes only G1, `USE_AZURE_CLOUD_RSA_CERT` includes G2 but not G3, and `USE_AZURE_CLOUD_ECC_CERT` includes G3 but not G2. Use a configuration that includes both G2 and G3.
- **IoT Edge:** See [step 5](#step-5-move-iot-edge-devices).

## Step 2: Move back-end apps to the service hostname

# [Azure portal](#tab/portal)

1. In your IoT hub, select **Security settings** > **Shared access policies**, and then select the policy that your app uses.
1. Copy the connection string for the **Service endpoint**.

# [Azure CLI](#tab/cli)

```azurecli
az iot hub connection-string show --hub-name <hub-name> --resource-group <resource-group> --policy-name <policy-name> --hostname-type service
```

> [!NOTE]
> Always set `--hostname-type service` for back-end apps. The default, `auto`, returns the device hostname.

---

- Replace the connection string in your app's configuration. For apps that authenticate with Microsoft Entra ID, replace the hostname. Shared access policies and keys don't change.
- Back-end apps that call DPS service APIs already use the DPS instance endpoint. Make sure that they trust G2.
- Never give devices the service hostname.

## Step 3: Move devices that connect directly to IoT Hub

1. Get a connection string that uses the device hostname, or edit the existing one:

   - **Azure CLI:**

     ```azurecli
     az iot hub device-identity connection-string show --hub-name <hub-name> --resource-group <resource-group> --device-id <device-id> --hostname-type device
     ```

     For a module, use `az iot hub module-identity connection-string show` with `--device-id <device-id> --module-id <module-id>`.

   - **Edit the connection string:** Change `HostName=<hub-name>.azure-devices.us` to `HostName=<hub-name>.device.azure-devices.us`. The `DeviceId` and `SharedAccessKey` values don't change.

1. **X.509 devices:** Keep the device certificate, and set the IoT hub hostname in the device configuration to the device hostname.
1. **SAS tokens:** Shared access signature (SAS) tokens don't change between endpoints.
1. **TLS stack:** Make sure that the device's TLS stack:
   - Sends SNI.
   - Offers TLS 1.3, or TLS 1.2 with the ECDHE cipher suites listed in [TLS support](iot-hub-tls-support.md). The device and service hostnames don't accept static RSA key exchange (`TLS_RSA_*`), DHE, or CBC-SHA1 cipher suites.
   - Offers the P-256 or P-384 curve in its supported groups. P-521 also works.
   - Can receive the whole certificate chain. In Azure Government, the RSA certificate chain is about 5.6 KB (three certificates), and the ECC chain is about 3.6 KB.
1. **Network:** Allow the device hostname in outbound firewall and proxy rules that filter by name. If your IoT hub uses private endpoints, see [Update private endpoints for TLS 1.3](iot-hub-tls-1-3-update-private-endpoint.md).
1. **Rollout:** Move devices in waves, and check connected-device counts before you start the next wave.

## Step 4: Move devices that provision through DPS

Two settings change for devices that use DPS: the endpoint that the device provisions through changes from the global device endpoint to the instance endpoint, and the IoT hub hostname that DPS assigns changes from the classic hostname to the device hostname. Use this order:

1. **Check trust.** Ensure that devices trust G2 for DPS, and G2 and G3 for IoT Hub.

1. **Pin enrollments to the classic link.** Enrollments that don't explicitly set their IoT hubs start allocating devices to a newly linked IoT hub immediately. Before you add the device hostname link, set the IoT hubs on every enrollment that stays on the classic hostname for now:

   ```azurecli
   az iot dps enrollment-group update --dps-name <dps-name> --resource-group <resource-group> --enrollment-id <enrollment-group-id> --iot-hubs <hub-name>.azure-devices.us
   az iot dps enrollment update --dps-name <dps-name> --resource-group <resource-group> --enrollment-id <enrollment-id> --iot-hubs <hub-name>.azure-devices.us
   ```

1. **Link the IoT hub's device hostname.** You can't change the hostname of an existing link, so add a second link to the same IoT hub. Both links can exist while you move devices. When enrollments use links with different TLS configurations, the Azure portal shows a warning.

   - **Azure portal:** In your DPS instance, select **Linked IoT hubs** > **+ Add**. Select the subscription and the IoT hub, set **Hostname endpoint** to **Device (TLS 1.3 capable)**, choose the **Authentication type**, and then select **Save**.
   - **Azure CLI:**

     ```azurecli
     az iot dps linked-hub create --dps-name <dps-name> --resource-group <resource-group> --hub-name <hub-name> --hostname-type device
     az iot dps linked-hub list --dps-name <dps-name> --resource-group <resource-group> --output table
     ```

     If the IoT hub is in a different resource group, add `--hub-resource-group <hub-resource-group>`.

1. **Point devices to the instance endpoint.** On each device, change the provisioning endpoint from `global.azure-devices-provisioning.us` to `<dps-name>.azure-devices-provisioning.us`. The ID scope doesn't change.

1. **Check the reprovisioning policy.** Each enrollment that you move must use the `reprovisionandmigratedata` or `reprovisionandresetdata` reprovisioning policy. With `never`, a device that registers again keeps its current IoT hub assignment. To set the policy, add `--reprovision-policy reprovisionandmigratedata` (or `reprovisionandresetdata`) to the update command in the next step. For more information, see [Reprovision devices](../iot-dps/how-to-reprovision.md).

1. **Move enrollments in waves.**

   ```azurecli
   az iot dps enrollment-group update --dps-name <dps-name> --resource-group <resource-group> --enrollment-id <enrollment-group-id> --iot-hubs <hub-name>.device.azure-devices.us
   ```

   For individual enrollments, use `az iot dps enrollment update` with `--enrollment-id <enrollment-id>`.

1. **Have devices register again.** A device gets the new hostname only when it registers with DPS again, for example at restart, on a schedule, or through a direct method that triggers provisioning.

1. **Optional: Remove the classic link** after no enrollment or device needs it:

   ```azurecli
   az iot dps linked-hub delete --dps-name <dps-name> --resource-group <resource-group> --linked-hub <hub-name>.azure-devices.us
   ```

   > [!WARNING]
   > Deleting a link that enrollments still reference can cause provisioning errors.

## Step 5: Move IoT Edge devices

1. **Trust.** IoT Edge modules use the IoT Edge trust bundle, and host-level components use the host OS trust store. Add G2 and G3 to both. The trust bundle can hold several root certificates. If `trust_bundle_cert` already points to a file, append the root certificates to that file, and keep the root certificates that are already in it, such as a parent device's root. For example:

   ```bash
   sudo mkdir -p /var/aziot/certs
   cat DigiCertGlobalRootG2.pem DigiCertGlobalRootG3.pem | sudo tee -a /var/aziot/certs/root-ca.pem > /dev/null
   sudo chown aziotcs:aziotcs /var/aziot/certs/root-ca.pem
   sudo chmod 644 /var/aziot/certs/root-ca.pem
   ```

   At the beginning of `/etc/aziot/config.toml`, before any sections, set:

   ```toml
   trust_bundle_cert = "file:///var/aziot/certs/root-ca.pem"
   ```

   Add both root certificates to the host OS trust store too, as described in [step 1](#step-1-trust-digicert-global-root-g2-and-g3).

1. **Endpoint.**

   - **DPS provisioning:** In the `[provisioning]` section, keep `source = "dps"` and `id_scope`, and set `global_endpoint` to your DPS instance endpoint. The setting keeps the name `global_endpoint`, but its value is the instance endpoint:

     ```toml
     [provisioning]
     source = "dps"
     global_endpoint = "https://<dps-name>.azure-devices-provisioning.us"
     id_scope = "<id-scope>"
     ```

     Leave the attestation settings as they are. Then update the enrollment as described in [step 4](#step-4-move-devices-that-provision-through-dps).

   - **Manual provisioning:** Use the device hostname. With a connection string, set `connection_string = "HostName=<hub-name>.device.azure-devices.us;DeviceId=<device-id>;SharedAccessKey=<key>"`. With X.509, set `iothub_hostname = "<hub-name>.device.azure-devices.us"`.

1. **Reprovisioning.** A device that uses DPS gets the new IoT hub hostname only when it provisions again. For the move, set `auto_reprovisioning_mode` at the beginning of `/etc/aziot/config.toml`, before any sections, so that the device provisions again when IoT Edge restarts:

   ```toml
   auto_reprovisioning_mode = "AlwaysOnStartup"
   ```

   With this mode, the device provisions again on every restart, and each registration is a billable DPS operation. After the device connects to the device hostname, you can set the mode back to your previous value.

1. **Apply the configuration and restart IoT Edge:**

   ```bash
   sudo iotedge config apply
   sudo iotedge system restart
   ```

For more information, see [Manage IoT Edge certificates](../iot-edge/how-to-manage-device-certificates.md) and [Configure IoT Edge device settings](../iot-edge/configure-device.md).

## Validate the move

Use OpenSSL 1.1.1 or later to check which certificate chain each endpoint presents, and whether a client that trusts only G2 and G3 accepts it.

```bash
HOST=<hub-name>.device.azure-devices.us     # Repeat for the service hostname and for <dps-name>.azure-devices-provisioning.us
cat DigiCertGlobalRootG2.pem DigiCertGlobalRootG3.pem > g2g3.pem

# Default handshake (advertises ECDSA)
openssl s_client -connect $HOST:443 -servername $HOST -CAfile g2g3.pem -verify_hostname $HOST </dev/null

# RSA-only, TLS 1.3
openssl s_client -connect $HOST:443 -servername $HOST -CAfile g2g3.pem -verify_hostname $HOST -tls1_3 \
  -sigalgs "rsa_pss_rsae_sha256:rsa_pss_rsae_sha384:rsa_pkcs1_sha256:rsa_pkcs1_sha384" </dev/null

# RSA-only, TLS 1.2
openssl s_client -connect $HOST:443 -servername $HOST -CAfile g2g3.pem -verify_hostname $HOST -tls1_2 \
  -cipher "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384" </dev/null
```

| Test | Device or service hostname | DPS instance endpoint |
|---|---|---|
| Default | Chain ends at DigiCert Global Root G3. `Verify return code: 0 (ok)` | Chain ends at DigiCert Global Root G2. `Verify return code: 0 (ok)` |
| RSA-only, TLS 1.3 | Chain ends at DigiCert Global Root G2. `Verify return code: 0 (ok)` | Chain ends at DigiCert Global Root G2. `Verify return code: 0 (ok)` |
| RSA-only, TLS 1.2 | Chain ends at DigiCert Global Root G2. `Verify return code: 0 (ok)` | Chain ends at DigiCert Global Root G2. `Verify return code: 0 (ok)` |

To test the ports that devices use, replace `443` with `8883` (MQTT) or `5671` (AMQP). The results are the same.

In Azure Government, the chain includes the cross-signed **Microsoft TLS ECC Root G2** certificate, issued by DigiCert Global Root G3, or the cross-signed **Microsoft TLS RSA Root G2** certificate, issued by DigiCert Global Root G2. Then confirm on the device side: the device logs show the new hostname, and IoT Hub shows the device as connected.

## Troubleshoot

| Symptom | Likely cause | Fix |
|---|---|---|
| `unable to get local issuer certificate` (verify error 20), `PKIX path building failed`, or `UntrustedRoot` on the device or service hostname, and the chain shows G3 or **Microsoft TLS ECC Root G2** | The client advertises ECDSA, gets the G3 chain, and doesn't trust G3. | Add DigiCert Global Root G3. |
| The same errors, and the chain shows G2 | An RSA-only client doesn't trust G2. | Add DigiCert Global Root G2. |
| `openssl` works but the device fails, or the reverse | `openssl` advertises ECDSA and gets G3, while the device is RSA-only and gets G2. | Trust G2 and G3 on every client. |
| Untrusted root on the DPS instance endpoint | The client doesn't trust G2. DPS never serves G3. | Add DigiCert Global Root G2. |
| The handshake fails before any certificate error, for example with `handshake failure`, `no shared cipher`, or `protocol version` | The client offers only `TLS_RSA_*`, DHE, or CBC-SHA1 cipher suites, or only TLS 1.0 or 1.1, or doesn't send the P-256 or P-384 curve. | Enable TLS 1.3, or TLS 1.2 with ECDHE cipher suites, and send supported groups. |
| Hostname mismatch on the device or service hostname, and the certificate is issued for `*.azure-devices.us` | The client doesn't send SNI. Without SNI, the endpoint presents the classic hostname's certificate. | Enable SNI. Update TLS adapters or SDK versions that don't send it. |
| A device that trusts only G1 fails on the DPS global device endpoint, while other devices succeed | The device doesn't send SNI, so the endpoint presents a certificate that chains to G2. | Enable SNI. Or trust G2, and move the device to the instance endpoint. |
| The device rejects the hostname before it connects | Device code checks for `<hub-name>.azure-devices.us`. | Accept `<hub-name>.device.azure-devices.us`. |
| Constrained devices fail only with the RSA chain | The certificate chain is larger than the TLS receive buffer. | Increase the buffer. Or let the client advertise ECDSA, and trust G3, so that it receives the smaller ECC chain. |
| A device still connects to the classic hostname after its enrollment changed | The device hasn't registered again, or the enrollment's reprovisioning policy is `never`. | Set a reprovisioning policy that reprovisions, and trigger re-registration. |
| Provisioning fails with an untrusted root after an update removed G1 | The device still uses the DPS global device endpoint. | Use the DPS instance endpoint. |
| Provisioning errors after you deleted the classic link | Enrollments still reference the classic hostname. | Update the enrollments first, and then delete the link. |
| A device can't connect to the service hostname | The service hostname is for back-end apps only. | Use the device hostname. |
| A back-end app fails after you copied an IoT hub connection string from the Azure CLI | The default hostname type, `auto`, returns the device hostname. | Use `--hostname-type service`. |
| A back-end app on Azure App Service or Azure Functions fails with an untrusted root after a platform update | The platform image no longer trusts G1, and the app uses the classic hostname. | Move the app to the service hostname. |
| The new hostname doesn't resolve or connect over Azure Private Link | Private DNS has no record for the device or service hostname, or the private endpoint needs to be reconfigured. | See [Update private endpoints for TLS 1.3](iot-hub-tls-1-3-update-private-endpoint.md). |
| A firewall or proxy blocks the connection | Rules allow only the classic hostname. | Allow the device and service hostnames and the DPS instance endpoint. |
| IoT Edge: edgeAgent rejects the cloud certificate, or modules can't connect after an image or OS update | The trust bundle or the host OS trust store doesn't include G2 or G3. | See [step 5](#step-5-move-iot-edge-devices). |

## Related content

- [IoT Hub endpoints](iot-hub-devguide-endpoints.md)
- [Transport Layer Security (TLS) support in IoT Hub](iot-hub-tls-support.md)
- [Update private endpoints for TLS 1.3](iot-hub-tls-1-3-update-private-endpoint.md)
- [How to link and manage IoT hubs](../iot-dps/how-to-manage-linked-iot-hubs.md)
- [Reprovision devices](../iot-dps/how-to-reprovision.md)
- [TLS support in DPS](../iot-dps/tls-support.md)
- [Manage IoT Edge certificates](../iot-edge/how-to-manage-device-certificates.md)
- [Azure Certificate Authority details](../security/fundamentals/azure-ca-details.md)
