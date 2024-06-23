---
title: Configuration reference for Azure Operator Insights ingestion agent
description: This article documents the complete set of configuration for the Azure Operator Insights ingestion agent.
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: conceptual
ms.date: 12/06/2023
---

# Configuration reference for Azure Operator Insights ingestion agent

This reference provides the complete set of configuration for the [Azure Operator Insights ingestion agent](ingestion-agent-overview.md), listing all fields with explanatory comments.

Configuration comprises three parts:

- Agent ID.
- Secrets providers.
- A list of one or more pipelines, where each pipeline defines an ID, a source, and a sink.

This reference shows two pipelines: one with an MCC EDR source and one with an SFTP pull source.

```yaml
# A unique identifier for this agent instance. Reserved URL characters must be percent-encoded. It's included in the upload path to the Data Product's input storage account.
agent_id: agent01
# Config for secrets providers. We support reading secrets from Azure Key Vault and from the VM's local filesystem.
# Multiple secret providers can be defined and each must be given a unique name, which is referenced later in the config.
# A secret provider of type `key_vault` which contains details required to connect to the Azure Key Vault and allow connection to the Data Product's input storage account. This is always required.
# A secret provider of type `file_system`, which specifies a directory on the VM where secrets are stored. For example for an SFTP pull source, for storing credentials for connecting to an SFTP server.
secret_providers:
  - name: data_product_keyvault_mi
    key_vault:
      vault_name: contoso-dp-kv
      managed_identity:
        object_id: 22330f5b-4d7e-496d-bbdd-84749eeb009b
  - name: data_product_keyvault_sp
    key_vault:
      vault_name: contoso-dp-kv
      service_principal:
        tenant_id: ad5421f5-99e4-44a9-8a46-cc30f34e8dc7
        client_id: 98f3263d-218e-4adf-b939-eacce6a590d2
        cert_path: /path/to/local/certficate.p12
  - name: local_file_system
    # The file system provider specifies a folder in which secrets are stored.
    # Each secret must be an individual file without a file extension, where the secret name is the file name, and the file contains the secret only.
    file_system:
      # The absolute path to the secrets directory
      secrets_directory: /path/to/secrets/directory
pipelines:
  # Pipeline IDs must be unique for a given agent instance. Any URL reserved characters must be percent-encoded.
  - id: mcc-edrs
    source:
      mcc_edrs:
        <mcc edrs source configuration>
    sink:
      <sink configuration>
  - id: contoso-logs
    source:
      sftp_pull:
        <sftp pull source configuration>
    sink:
      <sink configuration>
```

## Sink configuration

All pipelines require sink config, which covers upload of files to the Data Product's input storage account.

```yaml
sink:
  # The container within the Data Product's input storage account. This *must* be exactly the name of the container that Azure Operator Insights expects. See the Data Product documentation for what value is required.
  container_name: example-container
  # Optional A string giving an optional base path to use in the container in the Data Product's input storage account. Reserved URL characters must be percent-encoded. See the Data Product for what value, if any, is required.
  base_path: base-path
  sas_token:
    # This must reference a secret provider configured above.
    secret_provider: data_product_keyvault_mi
    # The name of a secret in the corresponding provider.
    # This will be the name of a secret in the Key Vault.
    # This is created by the Data Product and should not be changed.
    secret_name: input-storage-sas
    # Optional. How often the sink should refresh its SAS token for the Data Product's input storage account. Defaults to 1h.  Examples: 30s, 10m, 1h, 1d.
    cache_period: 1h
  # Optional. The maximum number of blobs that can be uploaded to the Data Product's input storage account in parallel. Further blobs will be queued in memory until an upload completes. Defaults to 10.
  # Note: This value is also the maximum number of concurrent SFTP reads for the SFTP pull source.  Ensure your SFTP server can handle this many concurrent connections.  If you set this to a value greater than 10 and are using an OpenSSH server, you may need to increase `MaxSessions` and/or `MaxStartups` in `sshd_config`.
  maximum_parallel_uploads: 10
  # Optional. The maximum size of each block that is uploaded to the Data Product's input storage account.
  # Each blob is composed of one or more blocks. Defaults to 32 MiB. Units are B, KiB, MiB, GiB, etc.
  block_size: 32 MiB
```

## Source configuration

All pipelines require source config, which covers how the ingestion agent ingests files and where from. There are two supported source types: MCC EDRs and SFTP pull.

Combining different types of source in one agent instance isn't recommended in production, but is supported for lab trials and testing.

### MCC EDR source configuration

```yaml
source:
  mcc_edrs:
    # The maximum amount of data to buffer in memory before uploading. Units are B, KiB, MiB, GiB, etc.
    message_queue_capacity: 32 MiB
    # Quick check on the maximum RAM that the agent should use.
    # This is a guide to check the other tuning parameters, rather than a hard limit.
    maximum_overall_capacity: 1216 MiB
    listener:
      # The TCP port to listen on.  Must match the port MCC is configured to send to.  Defaults to 36001.
      port: 36001
      # EDRs greater than this size are dropped. Subsequent EDRs continue to be processed.
      # This condition likely indicates MCC sending larger than expected EDRs. MCC is not normally expected
      # to send EDRs larger than the default size. If EDRs are being dropped because of this limit,
      # investigate and confirm that the EDRs are valid, and then increase this value. Units are B, KiB, MiB, GiB, etc.
      soft_maximum_message_size: 20480 B
      # EDRs greater than this size are dropped and the connection from MCC is closed. This condition
      # likely indicates an MCC bug or MCC sending corrupt data. It prevents the agent from uploading
      # corrupt EDRs to Azure. You should not need to change this value. Units are B, KiB, MiB, GiB, etc.
      hard_maximum_message_size: 100000 B
    batching:
      # The maximum size of a single blob (file) to store in the Data Product's input storage account.
      maximum_blob_size: 128 MiB. Units are B, KiB, MiB, GiB, etc.
      # The maximum time to wait when no data is received before uploading pending batched data to the Data Product's input storage account. Examples: 30s, 10m, 1h, 1d.
      blob_rollover_period: 5m
```

### SFTP pull source configuration

This configuration specifies which files are ingested from the SFTP server.

Multiple SFTP pull sources can be defined for one agent instance, where they can reference either different SFTP servers, or different folders on the same SFTP server.

```yaml
source:
  sftp_pull:
    server: Information relating to the SFTP session.
      # The IP address or hostname of the SFTP server.
      host: 192.0.2.0
      # Optional. The port to connect to on the SFTP server. Defaults to 22.
      port: 22
      # The path on the VM to the 'known_hosts' file for the SFTP server. This file must be in SSH format and contain details of any public SSH keys used by the SFTP server. This is required by the agent to verify it is connecting to the correct SFTP server.
      known_hosts_file: /path/to/known_hosts
      # The name of the user on the SFTP server which the agent will use to connect.
      user: sftp-user
      # The form of authentication to the SFTP server. This can take the values 'password' or 'private_key'. The  appropriate field(s) must be configured below depending on which type is specified.
      password:
        # The name of the secret provider configured above which contains the secret for the SFTP user.
        secret_provider: local_file_system
        # Only for use with password authentication. The name of the file containing the password in the secrets_directory folder
        secret_name: sftp-user-password
        # Only for use with private key authentication. The name of the file containing the SSH key in the secrets_directory folder
        key_secret_name: sftp-user-ssh-key
        # Optional. Only for use with private key authentication. The passphrase for the SSH key. This can be omitted if the key is not protected by a passphrase.
        passphrase_secret_name: sftp-user-ssh-key-passphrase
    filtering:
      # The path to a folder on the SFTP server that files will be uploaded to Azure Operator Insights from.
      base_path: /path/to/sftp/folder
      # Optional. A regular expression to specify which files in the base_path folder should be ingested. If not specified, the agent will attempt to ingest all files in the base_path folder (subject to exclude_pattern, settling_time and exclude_before_time).
      include_pattern: ".*\.csv$" # Only include files which end in ".csv"
      # Optional. A regular expression to specify any files in the base_path folder which should not be ingested. Takes priority over include_pattern, so files which match both regular expressions will not be ingested.
      # The exclude_pattern can also be used to ignore whole directories, but the pattern must still match all files under that directory. e.g. `^excluded-dir/.*$` or `^excluded-dir/` but *not* `^excluded-dir$`
      exclude_pattern: "^\.staging/|\.backup$" # Exclude all file paths that start with ".staging/" or end in ".backup"
      # A duration, such as "10s", "5m", "1h".. During an upload run, any files last modified within the settling time are not selected for upload, as they may still be being modified.
      settling_time: 1m
      # Optional. A datetime that adheres to the RFC 3339 format. Any files last modified before this datetime will be ignored.
      exclude_before_time: "2022-12-31T21:07:14-05:00"
    scheduling:
      # An expression in cron format, specifying when upload runs are scheduled for this source. All times refer to UTC. The cron schedule should include fields for: second, minute, hour, day of month, month, day of week, and year. E.g.:
      # `* /3 * * * * *` for once every 3 minutes
      # `0 30 5 * * * *` for 05:30 every day
      # `0 15 3 * * Fri,Sat *` for 03:15 every Friday and Saturday
      cron: "*/30 * * * Apr-Jul Fri,Sat,Sun 2025"
```
