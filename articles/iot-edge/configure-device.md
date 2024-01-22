---
title: Configure Azure IoT Edge device settings
description: This article shows you how to configure Azure IoT Edge device settings and options using the config.toml file.
author: PatAltimore
ms.author: patricka
ms.date: 04/20/2023
ms.topic: how-to
ms.service: iot-edge
services: iot-edge
---

# Configure IoT Edge device settings

This article shows settings and options for configuring the IoT Edge *config.toml* file of an IoT Edge device. IoT Edge uses the *config.toml* file to initialize settings for the device. Each of the sections of the *config.toml* file has several options. Not all options are mandatory, as they apply to specific scenarios.

A template containing all options can be found in the *config.toml.edge.template* file within the */etc/aziot* directory on an IoT Edge device. You can copy the contents of the whole template or sections of the template into your *config.toml* file. Uncomment the sections you need. Be aware not to copy over parameters you have already defined.

## Global parameters

The **hostname**, **parent_hostname**, **trust_bundle_cert**, **allow_elevated_docker_permissions**, and **auto_reprovisioning_mode** parameters must be at the beginning of the configuration file before any other sections. Adding parameters before a collection of settings ensures they're applied correctly. For more information on valid syntax, see [toml.io ](https://toml.io/).

### Hostname

To enable gateway discovery, every IoT Edge gateway (parent) device needs to specify a hostname parameter that its child devices use to find it on the local network. The *edgeHub* module also uses the hostname parameter to match with its server certificate. For more information, see [Why does EdgeGateway need to be told about its own hostname?](iot-edge-certs.md#why-does-edgegateway-need-to-be-told-about-its-own-hostname).

> [!NOTE]
> When the hostname value isn't set, IoT Edge attempts to find it automatically. However, clients in the network may not be able to discover the device if it isn't set.

For **hostname**, replace **fqdn-device-name-or-ip-address** with your device name to override the default hostname of the device. The value can be a fully qualified domain name (FQDN) or an IP address. Use this setting as the gateway hostname on a IoT Edge gateway device.

```toml
hostname = "fqdn-device-name-or-ip-address"
````

### Parent hostname

Parent hostname is used when the IoT Edge device is part of a hierarchy, otherwise known as a *nested edge*. Every downstream IoT Edge device needs to specify a **parent_hostname** parameter to identify its parent. In a hierarchical scenario where a single IoT Edge device is both a parent and a child device, it needs both parameters.

Replace **fqdn-parent-device-name-or-ip-address** with the name of your parent device. Use a hostname shorter than 64 characters, which is the character limit for a server certificate common name.

```toml
parent_hostname = "fqdn-parent-device-name-or-ip-address"
```

For more information about setting the *parent_hostname* parameter, see [Connect Azure IoT Edge devices together to create a hierarchy](how-to-connect-downstream-iot-edge-device.md#update-downstream-configuration-file).

### Trust bundle certificate

To provide a custom certificate authority (CA) certificate as a root of trust for IoT Edge and modules, specify a **trust_bundle_cert** configuration. Replace the parameter value with the file URI to the root CA certificate on your device.

```toml
trust_bundle_cert = "file:///var/aziot/certs/trust-bundle.pem"
```

For more information about the IoT Edge trust bundle, see [Manage trusted root CA](how-to-manage-device-certificates.md#manage-trusted-root-ca-trust-bundle).

### Elevated Docker Permissions

Some docker capabilities can be used to gain root access. By default, the `--privileged` flag and all capabilities listed in the **CapAdd** parameter of the docker **HostConfig** are allowed.

If no modules require privileged or extra capabilities, use **allow_elevated_docker_permissions** to improve the security of the device.

```toml
allow_elevated_docker_permissions = false
```

### Auto reprovisioning mode

The optional **auto_reprovisioning_mode** parameter specifies the conditions that decide when a device attempts to automatically reprovision with Device Provisioning Service. Auto provisioning mode is ignored if the device has been provisioned manually. For more information about setting DPS provisioning mode, see the [Provisioning](#provisioning) section in this article for more information.

One of the following values can be set:

| Mode | Description |
|------|-------------|
| Dynamic | Reprovision when the device detects that it may have been moved from one IoT Hub to another. This mode is *the default*. |
| AlwaysOnStartup | Reprovision when the device is rebooted or a crash causes the daemons to restart. |
| OnErrorOnly | Never trigger device reprovisioning automatically. Device reprovisioning only occurs as fallback, if the device is unable to connect to IoT Hub during identity provisioning due to connectivity errors. This fallback behavior is implicit in Dynamic and AlwaysOnStartup modes as well. |

For example:

```toml
auto_reprovisioning_mode = "Dynamic"
```

For more information about device reprovisioning, see [IoT Hub Device reprovisioning concepts](../iot-dps/concepts-device-reprovision.md).

## Provisioning

You can provision a single device or multiple devices at-scale, depending on the needs of your IoT Edge solution. The options available for authenticating communications between your IoT Edge devices and your IoT hubs depend on what provisioning method you choose. 

You can provision with a connection string, symmetric key, X.509 certificate, identity certificate private key, or an identity certificate. DPS provisioning is included with various options. Choose one method for your provisioning. Replace the sample values with your own.

### Manual provisioning with connection string

```toml
[provisioning]
source = "manual"
connection_string = "HostName=example.azure-devices.net;DeviceId=my-device;SharedAccessKey=<Shared access key>"
```

For more information about retrieving provisioning information, see [Create and provision an IoT Edge device on Linux using symmetric keys](how-to-provision-single-device-linux-symmetric.md#view-registered-devices-and-retrieve-provisioning-information).

### Manual provisioning with symmetric key

```toml
[provisioning]
source = "manual"
iothub_hostname = "example.azure-devices.net"
device_id = "my-device"

[provisioning.authentication]
method = "sas"

device_id_pk = { value = "<Shared access key>" }     # inline key (base64), or...
device_id_pk = { uri = "file:///var/aziot/secrets/device-id.key" }            # file URI, or...
device_id_pk = { uri = "pkcs11:slot-id=0;object=device%20id?pin-value=1234" } # PKCS#11 URI
```

For more information about retrieving provisioning information, see [Create and provision an IoT Edge device on Linux using symmetric keys](how-to-provision-single-device-linux-symmetric.md#view-registered-devices-and-retrieve-provisioning-information).

### Manual provisioning with X.509 certificate

```toml
[provisioning]
source = "manual"
iothub_hostname = "example.azure-devices.net"
device_id = "my-device"

[provisioning.authentication]
method = "x509"
```

For more information about provisioning using X.509 certificates, see [Create and provision an IoT Edge device on Linux using X.509 certificates](how-to-provision-single-device-linux-x509.md).

### DPS provisioning with symmetric key

```toml
[provisioning]
source = "dps"
global_endpoint = "https://global.azure-devices-provisioning.net"
id_scope = "<DPS-ID-SCOPE>"

# (Optional) Use to send a custom payload during DPS registration
payload = { uri = "file:///var/secrets/aziot/identityd/dps-additional-data.json" }

[provisioning.attestation]
method = "symmetric_key"
registration_id = "my-device"

symmetric_key = { value = "<Device symmetric key>" } # inline key (base64), or...
symmetric_key = { uri = "file:///var/aziot/secrets/device-id.key" }                                                          # file URI, or...
symmetric_key = { uri = "pkcs11:slot-id=0;object=device%20id?pin-value=1234" }    
```

For more information about DPS provisioning with symmetric key, see [Create and provision IoT Edge devices at scale on Linux using symmetric key](how-to-provision-devices-at-scale-linux-symmetric.md).

### DPS provisioning with X.509 certificates

```toml
[provisioning]
source = "dps"
global_endpoint = "https://global.azure-devices-provisioning.net/"
id_scope = "<DPS-ID-SCOPE>"

# (Optional) Use to send a custom payload during DPS registration
 payload = { uri = "file:///var/secrets/aziot/identityd/dps-additional-data.json" }

[provisioning.attestation]
method = "x509"
registration_id = "my-device"

# Identity certificate private key
identity_pk = "file:///var/aziot/secrets/device-id.key.pem"        # file URI, or...
identity_pk = "pkcs11:slot-id=0;object=device%20id?pin-value=1234" # PKCS#11 URI

# Identity certificate
identity_cert = "file:///var/aziot/certs/device-id.pem"     # file URI, or...
[provisioning.authentication.identity_cert]                 # dynamically issued via...
method = "est"                                              # - EST
method = "local_ca"                                         # - a local CA
common_name = "my-device"                                   # with the given common name, or...
subject = { L = "AQ", ST = "Antarctica", CN = "my-device" } # with the given DN fields
```
#### (Optional) Enable automatic renewal of the device ID certificate

Autorenewal requires a known certificate issuance method. Set **method** to either `est` or `local_ca`.

>[!IMPORTANT]
> Only enable autorenewal if this device is configured for CA-based DPS enrollment. Using autorenewal for an individual enrollment causes the device to be unable to reprovision.

```toml
[provisioning.attestation.identity_cert.auto_renew]
rotate_key = true
threshold = "80%"
retry = "4%"
```

For more information about DPS provisioning with X.509 certificates, see [Create and provision IoT Edge devices at scale on Linux using X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md).

### DPS provisioning with TPM (Trusted Platform Module)

```toml
[provisioning]
source = "dps"
global_endpoint = "https://global.azure-devices-provisioning.net"
id_scope = "<DPS-ID-SCOPE>"

# (Optional) Use to send a custom payload during DPS registration
payload = { uri = "file:///var/secrets/aziot/identityd/dps-additional-data.json" }

[provisioning.attestation]
method = "tpm"
registration_id = "my-device"
```

If you use DPS provisioning with TPM, and require custom configuration, see the [TPM](#tpm-trusted-platform-module) section.

For more information, see [Create and provision IoT Edge devices at scale with a TPM on Linux](how-to-provision-devices-at-scale-linux-tpm.md).

### Cloud Timeout and Retry Behavior

These settings control the timeout and retries for cloud operations, such as communication with Device Provisioning Service (DPS) during provisioning or IoT Hub for module identity creation.

The **cloud_timeout_sec** parameter is the deadline in seconds for a network request to cloud services. For example, an HTTP request. A response from the cloud service must be received before this deadline, or the request fails as a timeout.

The **cloud_retries** parameter controls how many times a request may be retried after the first try fails. The client always sends at least once, so the value is number of retries after the first try fails. For example, `cloud_retries = 2` means that the client makes a total of three attempts.

```toml
cloud_timeout_sec = 10
cloud_retries = 1
```

## Certificate issuance

If you configured any dynamically issued certs, choose your corresponding issuance method and replace the sample values with your own.

### Cert issuance via EST

```toml
[cert_issuance.est]
trusted_certs = ["file:///var/aziot/certs/est-id-ca.pem",]

[cert_issuance.est.auth]
username = "estuser"
password = "estpwd"
```

### EST ID cert already on device

```toml
identity_cert = "file:///var/aziot/certs/est-id.pem"

identity_pk = "file:///var/aziot/secrets/est-id.key.pem"      # file URI, or...
identity_pk = "pkcs11:slot-id=0;object=est-id?pin-value=1234" # PKCS#11 URI
```

### EST ID cert requested via EST bootstrap ID cert

Authentication with a TLS client certificate that is used once to create the initial EST ID certificate. After the first certificate issuance, an `identity_cert` and `identity_pk` are automatically created and used for future authentication and renewals. The Subject Common Name (CN) of the generated EST ID certificate is always the same as the configured device ID under the provisioning section. These files must be readable by the users *aziotcs* and *aziotks*, respectively.

```toml
bootstrap_identity_cert = "file:///var/aziot/certs/est-bootstrap-id.pem"

bootstrap_identity_pk = "file:///var/aziot/secrets/est-bootstrap-id.key.pem"      # file URI, or...
bootstrap_identity_pk = "pkcs11:slot-id=0;object=est-bootstrap-id?pin-value=1234" # PKCS#11 URI

# The following parameters control the renewal of EST identity certs. These certs are issued by the EST server after initial authentication with the bootstrap cert and managed by Certificates Service.

[cert_issuance.est.identity_auto_renew]
rotate_key = true
threshold = "80%"
retry = "4%"

[cert_issuance.est.urls]
default = "https://example.org/.well-known/est"
```

### Cert issuance via local CA

```toml
[cert_issuance.local_ca]
cert = "file:///var/aziot/certs/local-ca.pem"

pk = "file:///var/aziot/secrets/local-ca.key.pem"      # file URI, or...
pk = "pkcs11:slot-id=0;object=local-ca?pin-value=1234" # PKCS#11 URI
```

## TPM (Trusted Platform Module)

If you need special configuration for the TPM when using DPS TPM provisioning, use these TPM settings.

For acceptable TCTI loader strings, see section 3.5 of [TCG TSS 2.0 TPM Command Transmission Interface (TCTI) API Specification](https://trustedcomputinggroup.org/wp-content/uploads/TCG_TSS_TCTI_v1p0_r18_pub.pdf). 

Setting to an empty string causes the TCTI loader library to try loading a [predefined set of TCTI modules](https://github.com/tpm2-software/tpm2-tss/blob/3.1.1/src/tss2-tcti/tctildr-dl.c#L28-L59) in order.

```toml
[tpm]
tcti = "swtpm:port=2321"
```

The TPM index persists the DPS authentication key. The index is taken as an offset from the base address for persistent objects such as `0x81000000` and must lie in the range from `0x00_00_00` to `0x7F_FF_FF`. The default value is `0x00_01_00`.

```toml
auth_key_index = "0x00_01_00"
```

Use authorization values for endorsement and owner hierarchies, if needed. By default, these values are empty strings.

```toml
[tpm.hierarchy_authorization]
endorsement = "hello"
owner = "world"
```

## PKCS#11

If you used any PKCS#11 URIs, use the following parameters and replace the values with your PKCS#11 configuration.

```toml
[aziot_keys]
pkcs11_lib_path = "/usr/lib/libmypkcs11.so"
pkcs11_base_slot = "pkcs11:slot-id=0?pin-value=1234"
```

## Default Edge Agent

When IoT Edge starts up the first time, it bootstraps a default Edge Agent module. If you need to override the parameters provided to the default Edge Agent module, use this section and replace the values with your own.

> [!NOTE] 
> The `agent.config.createOptions` parameter is specified as a TOML inline table. This format looks like JSON but it's not JSON. For more information, see [Inline Table](https://toml.io/en/v1.0.0#inline-table) of the TOML v1.0.0 documentation.

```toml
[agent]
name = "edgeAgent"
type = "docker"
imagePullPolicy = "..."   # "on-create" or "never". Defaults to "on-create"

[agent.config]
image = "mcr.microsoft.com/azureiotedge-agent:1.4"
createOptions = { HostConfig = { Binds = ["/iotedge/storage:/iotedge/storage"] } }

[agent.config.auth]
serveraddress = "example.azurecr.io"
username = "username"
password = "password"

[agent.env]
RuntimeLogLevel = "debug"
UpstreamProtocol = "AmqpWs"
storageFolder = "/iotedge/storage"
```

## Daemon management and workload API endpoints

If you need to override the management and workload API endpoints, use this section and replace the values with your own.

```toml
[connect]
workload_uri = "unix:///var/run/iotedge/workload.sock"
management_uri = "unix:///var/run/iotedge/mgmt.sock"

[listen]
workload_uri = "unix:///var/run/iotedge/workload.sock"
management_uri = "unix:///var/run/iotedge/mgmt.sock"
```

## Edge Agent watchdog

If you need to override the default Edge Agent watchdog settings, use this section and replace the values with your own.

```toml
[watchdog]
max_retries = "infinite"   # the string "infinite" or a positive integer. Defaults to "infinite"
```

## Edge CA certificate

If you have your own [Edge CA](iot-edge-certs.md#why-does-iot-edge-create-certificates) certificate that issues all your module certificates, use one of these sections and replace the values with your own. 

### Edge CA certificate loaded from a file

```toml
[edge_ca]
cert = "file:///var/aziot/certs/edge-ca.pem"            # file URI

pk = "file:///var/aziot/secrets/edge-ca.key.pem"        # file URI, or...
pk = "pkcs11:slot-id=0;object=edge%20ca?pin-value=1234" # PKCS#11 URI
```

### Edge CA certificate issued over EST

```toml
[edge_ca]
method = "est"
```

For more information about using an EST server, see [Tutorial: Configure Enrollment over Secure Transport Server for Azure IoT Edge](tutorial-configure-est-server.md).

### Optional EST configuration for issuing the Edge CA certificate

If not set, the defaults in [cert_issuance.est] are used.

```toml
common_name = "aziot-edge CA"
expiry_days = 90
url = "https://example.org/.well-known/est"

username = "estuser"
password = "estpwd"
```

### EST ID cert already on device

```toml
identity_cert = "file:///var/aziot/certs/est-id.pem"

identity_pk = "file:///var/aziot/secrets/est-id.key.pem"      # file URI, or...
identity_pk = "pkcs11:slot-id=0;object=est-id?pin-value=1234" # PKCS#11 URI
```

### EST ID cert requested via EST bootstrap ID cert

```toml
bootstrap_identity_cert = "file:///var/aziot/certs/est-bootstrap-id.pem"

bootstrap_identity_pk = "file:///var/aziot/secrets/est-bootstrap-id.key.pem"      # file URI, or...
bootstrap_identity_pk = "pkcs11:slot-id=0;object=est-bootstrap-id?pin-value=1234" # PKCS#11 URI
```

### Edge CA certificate issued from a local CA certificate

Requires [cert_issuance.local_ca] to be set.

```toml
[edge_ca]
method = "local_ca"

# Optional configuration
common_name = "aziot-edge CA"
expiry_days = 90
```

## Edge CA quickstart certificates

If you don't have your own Edge CA certificate used to issue all module certificates, use this section and set the number of days for the lifetime of the autogenerated self-signed Edge CA certificate. Expiration defaults to 90 days.

> [!CAUTION]
> This setting is **NOT recommended for production usage**. Please configure your own Edge CA certificate in the Edge CA certificate sections.

```toml
[edge_ca]
auto_generated_edge_ca_expiry_days = 90
```

## Edge CA certificate autorenewal

This setting manages autorenewal of the Edge CA certificate. Autorenewal applies when the Edge CA is configured as *quickstart* or when the Edge CA has an issuance `method` set. Edge CA certificates loaded from files generally can't be autorenewed as the Edge runtime doesn't have enough information to renew them.

> [!IMPORTANT]
> Renewal of an Edge CA requires all server certificates issued by that CA to be regenerated. This regeneration is done by restarting all modules. The time of Edge CA renewal can't be guaranteed. If random module restarts are unacceptable for your use case, disable autorenewal.

```toml
[edge_ca.auto_renew]
rotate_key = true
threshold = "80%"
retry = "4%"
```

## Image garbage collection

If you need to override the default image garbage collection configuration, use this section and replace the values in this section with your own.

| Parameter | Description |
|--------------------------|
| `enabled` | Runs image garbage collection |
| `cleanup_recurrence` | How often you want the image garbage collection to run |
| `image_age_cleanup_threshold` | The *age* of unused images. Images older than the threshold are removed |
| `cleanup_time` | 24-hour HH:MM format. When the cleanup job runs |

```toml
[image_garbage_collection]
enabled = true
cleanup_recurrence = "1d"
image_age_cleanup_threshold = "7d"
cleanup_time = "00:00"
```

## Moby runtime

If you need to override the default Moby runtime configuration, use this section and replace the values with your own.

```toml
[moby_runtime]
uri = "unix:///var/run/docker.sock"
network = "azure-iot-edge"
```
