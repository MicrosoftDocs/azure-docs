---
title: Configure the template
description: This how-to article shows you how to configure the template.toml file inside of a Debian package.
author: PatAltimore

ms.author: patricka
ms.date: 12/20/2022
ms.topic: how-to
ms.service: iot-edge
---

# Configure the template

This article shows best practices and options for configuring the `template-toml` file found in a Debian package. Each of the sections of the `template.toml` file has several options and those will be explained.

## Device names

For the **hostname**, replace **my-device** with your device name.

```toml
hostname = "my-device"
```

If you have a nested device, use the **parent_hostname**. Replace **my-parent-device** with the name of your parent device.

```toml
parent_hostname = "my-parent-device"
```

## Trust bundle certificate

If you have any trusted CA certificates required for Edge module communication, use the **trust_bundle_cert** field and replace the URI filepath with your own.

```toml
trust_bundle_cert = "file:///var/secrets/trust-bundle.pem"
```

## Elevated Docker Permissions Flag

Some docker capabilities can be used to gain root access. By default, the **--privileged** flag and all capabilities listed in the **CapAdd** field of the docker **HostConfig** are allowed.

In a future release, this will be disabled by default and the flag will be required to run as privileged.

If no modules require privileged or additional capabilities, use **allow_elevated_docker_permissions** to improve the security of the device.

```toml
allow_elevated_docker_permissions = false
```

## Provisioning

### Optional auto reprovisioning mode

This property specifies the conditions under which the device attempts to automatically reprovision with the cloud. It's ignored if the device has been provisioned manually. One of the following values can be set:

| Mode | What each mode does|
|--------------------------|-|
| Dynamic | Reprovision when the device detects that it may have been moved from one IoT Hub to another. This is the default. |
| AlwaysOnStartup | Reprovision when the device is rebooted or a crash causes the daemon(s) to restart. |
| OnErrorOnly | Never trigger device reprovisioning automatically. Device reprovisioning only occurs as fallback, if the device is unable to connect to IoT Hub during identity provisioning due to connectivity errors. This fallback behavior is implicit in Dynamic and AlwaysOnStartup modes as well. |

For example: 

```toml
auto_reprovisioning_mode = Dynamic
```

## Cloud Timeout and Retry Behavior

These settings control the timeout and retries for cloud operations, such as communication with DPS during provisioning or IoT Hub for module identity creation.

The `cloud_timeout_sec` field is the deadline (in seconds) for a network request (such as an HTTP request) to these cloud services. A response from the cloud must be received before this deadline, or the request will fail as timed out.

The `cloud_retries` field controls how many times a request may be retried should it fail. The client will always send at least one attempt, so its value will be the number of retries after the first attempt should that fail (for example, `cloud_retries = 2` means that the client will make a total of 3 attempts).

```toml
cloud_timeout_sec = 10
cloud_retries = 1
```

## Provisioning configuration

You can provision with a connection string, symmetric key, X.509 certificate, identity certificate private key, or an identity certificate. DPS provisioning is included with various options. Choose one method for your provisioning. Replace the sample values with your own.

### Manual provisioning with connection string

```toml
[provisioning]
source = "manual"
connection_string = "HostName=example.azure-devices.net;DeviceId=my-device;SharedAccessKey=YXppb3QtaWRlbnRpdHktc2VydmljZXxhemlvdC1pZGU="
```

### Manual provisioning with symmetric key

```toml
[provisioning.authentication]
method = "sas"

device_id_pk = { value = "YXppb3QtaWRlbnRpdHktc2VydmljZXxhemlvdC1pZGU=" }     # inline key (base64), or...
device_id_pk = { uri = "file:///var/secrets/device-id.key" }                  # file URI, or...
device_id_pk = { uri = "pkcs11:slot-id=0;object=device%20id?pin-value=1234" } # PKCS#11 URI
```

### Manual provisioning with X.509 certificate

```toml
[provisioning]
source = "manual"
iothub_hostname = "example.azure-devices.net"
device_id = "my-device"

[provisioning.authentication]
method = "x509"
```

### Identity certificate private key

```toml
identity_pk = "file:///var/secrets/device-id.key.pem"              # file URI, or...
identity_pk = "pkcs11:slot-id=0;object=device%20id?pin-value=1234" # PKCS#11 URI
```

### Identity certificate

```toml
identity_cert = "file:///var/secrets/device-id.pem"                # file URI, or...
[provisioning.authentication.identity_cert]                        # dynamically issued via...
method = "est"                                                     # - EST
method = "local_ca"                                                # - a local CA
common_name = "my-device"                                          # with the given common name, or...
subject = { L = "AQ", ST = "Antarctica", CN = "my-device" }        # with the given DN fields
```

### DPS provisioning with symmetric key

```toml
[provisioning]
source = "dps"
global_endpoint = "https://global.azure-devices-provisioning.net"
id_scope = "0ab1234C5D6"

# Use to send a custom payload during DPS registration
payload = { uri = "file:///var/secrets/aziot/identityd/dps-additional-data.json" }

[provisioning.attestation]
method = "symmetric_key"
registration_id = "my-device"

symmetric_key = { value = "YXppb3QtaWRlbnRpdHktc2VydmljZXxhemlvdC1pZGVudGl0eS1zZXJ2aWNlfGF6aW90LWlkZW50aXR5LXNlcg==" } # inline key (base64), or...
symmetric_key = { uri = "file:///var/secrets/device-id.key" }                                                          # file URI, or...
symmetric_key = { uri = "pkcs11:slot-id=0;object=device%20id?pin-value=1234" }    
```

### DPS provisioning with X.509 certificate

```toml
[provisioning]
source = "dps"
global_endpoint = "https://global.azure-devices-provisioning.net/"
id_scope = "0ab1234C5D6"

# Use to send a custom payload during DPS registration
 payload = { uri = "file:///var/secrets/aziot/identityd/dps-additional-data.json" }

[provisioning.attestation]
method = "x509"
registration_id = "my-device"

```

### Enable automatic renewal of the device ID certificate

Auto-renewal requires a known certificate issuance method. This generally means that 'method' is either 'est' or 'local_ca'.

>[!IMPORTANT]
> Only enable auto-renewal if this device is configured for CA-based DPS enrollment. Using auto-renewal for an individual enrollment will cause the device to be unable to reprovision.

```toml
[provisioning.attestation.identity_cert.auto_renew]
rotate_key = true
threshold = "80%"
retry = "4%"
```

### DPS provisioning with TPM

```toml
[provisioning]
source = "dps"
global_endpoint = "https://global.azure-devices-provisioning.net"
id_scope = "0ab1234C5D6"

# Use to send a custom payload during DPS registration
payload = { uri = "file:///var/secrets/aziot/identityd/dps-additional-data.json" }

[provisioning.attestation]
method = "tpm"
registration_id = "my-device"
```

## Certificate issuance

If you configured any dynamically issued certs, choose your corresponding issuance method and replace the sample values with your own.

### Cert issuance via EST

```toml
[cert_issuance.est]
trusted_certs = ["file:///var/secrets/est-id-ca.pem",]

[cert_issuance.est.auth]
username = "estuser"
password = "estpwd"
```

### EST ID cert already on device

```toml
identity_cert = "file:///var/secrets/est-id.pem"

identity_pk = "file:///var/secrets/est-id.key.pem"            # file URI, or...
identity_pk = "pkcs11:slot-id=0;object=est-id?pin-value=1234" # PKCS#11 URI
```

### EST ID cert requested via EST bootstrap ID cert

```toml
bootstrap_identity_cert = "file:///var/secrets/est-bootstrap-id.pem"

bootstrap_identity_pk = "file:///var/secrets/est-bootstrap-id.key.pem"            # file URI, or...
bootstrap_identity_pk = "pkcs11:slot-id=0;object=est-bootstrap-id?pin-value=1234" # PKCS#11 URI

Controls the renewal of EST identity certs. These certs are issued by the EST server after
initial authentication with the bootstrap cert and managed by Certificates Service.
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
cert = "file:///var/secrets/local-ca.pem"

pk = "file:///var/secrets/local-ca.key.pem"            # file URI, or...
pk = "pkcs11:slot-id=0;object=local-ca?pin-value=1234" # PKCS#11 URI
```

## Trusted Platform Module (TPM)

If special configuration is required for the TPM when using DPS TPM provisioning, use any of the following relevant sections.

This is a TCTI loader string. See "TCG TSS 2.0 TPM Command Transmission Interface (TCTI) API Specification" section 3.5 for an overview of acceptable TCTI loader strings. By default, this is "device". Setting this to the empty string will cause the TCTI loader library to try loading a predefined set of TCTI modules in order.

For more information, see [tctildr-dl.c](https://github.com/tpm2-software/tpm2-tss/blob/3.1.1/src/tss2-tcti/tctildr-dl.c#L28-L59).

```toml
[tpm]
tcti = "swtpm:port=2321"

# The TPM index at which to persist the DPS authentication key. The index is taken as an offset from the base address for persistent objects (0x81000000), and must lie in the range 0x00_00_00--0x7F_FF_FF. The default value is 0x00_01_00.
auth_key_index = "0x00_01_00"

# Authorization values for use of the endorsement and owner hierarchies, if necessary. By default, these are empty strings.
[tpm.hierarchy_authorization]
endorsement = "hello"
owner = "world"
```

## PKCS#11

If you used any PKCS#11 URIs, use the following fields and replace the values with your PKCS#11 configuration.

```toml
[aziot_keys]
pkcs11_lib_path = "/usr/lib/libmypkcs11.so"
pkcs11_base_slot = "pkcs11:slot-id=0?pin-value=1234"
```

## Default Edge Agent

If you need to override the parameters of the default Edge Agent module, use this section and replace the values with your own.

> [!NOTE] 
> The `agent.config.createOptions` field is specified as a TOML inline table. This format looks similar to JSON but it's not JSON.
For more information, see [Inline Table](https://toml.io/en/v1.0.0#inline-table) of the TOML v1.0.0 documentation.

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
"RuntimeLogLevel" = "debug"
"UpstreamProtocol" = "AmqpWs"
"storageFolder" = "/iotedge/storage"
```

## Daemon management and workload API endpoints

If you need to override the management and workload API endpoints, use this section and replace the values with your own.

```toml
[connect]
workload_uri = "@connect_workload_uri@"
management_uri = "@connect_management_uri@"

[listen]
workload_uri = "@listen_workload_uri@"
management_uri = "@listen_management_uri@"
```

## Edge Agent watchdog

If you need to override the default Edge Agent watchdog settings, use this section and replace the values with your own.

```toml
[watchdog]
max_retries = "infinite"   # the string "infinite" or a positive integer. Defaults to "infinite"
```

## Edge CA certificate

If you have your own Edge CA certificate that will issue all your module certificates, use one of these sections and replace the values with
your own.

### Edge CA certificate loaded from a file

```toml
[edge_ca]
cert = "file:///var/secrets/edge-ca.pem"                # file URI

pk = "file:///var/secrets/edge-ca.key.pem"              # file URI, or...
pk = "pkcs11:slot-id=0;object=edge%20ca?pin-value=1234" # PKCS#11 URI
```

### Edge CA certificate issued over EST

```toml
[edge_ca]
method = "est"
```

### Optional EST configuration for issuing the Edge CA certificate

If not set, the defaults in [cert_issuance.est] will be used.

```toml
common_name = "aziot-edge CA"
expiry_days = 90
url = "https://example.org/.well-known/est"

username = "estuser"
password = "estpwd"
```

### EST ID cert already on device

```toml
identity_cert = "file:///var/secrets/est-id.pem"

identity_pk = "file:///var/secrets/est-id.key.pem"            # file URI, or...
identity_pk = "pkcs11:slot-id=0;object=est-id?pin-value=1234" # PKCS#11 URI
```

### EST ID cert requested via EST bootstrap ID cert

```toml
bootstrap_identity_cert = "file:///var/secrets/est-bootstrap-id.pem"

bootstrap_identity_pk = "file:///var/secrets/est-bootstrap-id.key.pem"            # file URI, or...
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

## Edge CA certificate (Quickstart)

If you don't have your own Edge CA certificate used to issue all module certificates, use this section and set the number of days for the lifetime of the auto-generated self-signed Edge CA certificate. Defaults to 90 days.

> [!CAUTION]
> This setting is NOT recommended for production usage. Please configure your own Edge CA certificate in the Edge CA certificate sections.

```toml
[edge_ca]
auto_generated_edge_ca_expiry_days = 90
```

## Edge CA certificate auto-renewal

Manage auto-renewal of the Edge CA certificate. Generally, this applies when the Edge CA is configured as Quickstart or when the Edge CA has an issuance `method` set. Edge CA certs loaded from files generally cannot be auto-renewed as the Edge runtime won't have enough information to renew them.

Renewal of an Edge CA requires all server certificates issued by that CA to be regenerated. This regeneration is done by restarting all modules. The time of Edge CA renewal cannot be guaranteed, so if random module restarts are unacceptable for your use case, disable auto-renewal.

```toml
[edge_ca.auto_renew]
rotate_key = true
threshold = "80%"
retry = "4%"
```

## Image garbage collection

If you need to override the default image garbage collection configuration, uncomment this section and replace the values in this section with your own.

| Parameter | What it does |
|--------------------------|
| `enabled` | Whether image garbage collection runs or not |
| `cleanup_recurrence` | How frequently you want the image garbage collection to run |
| `image_age_cleanup_threshold` |  The "age" of unused images, after which they will be cleaned up |
| `cleanup_time` | 24-hour HH:MM format dictate when the cleanup job runs |

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
