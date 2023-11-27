---
title: SFTP Ingestion Agents configuration reference for Azure Operator Insights
description: This article documents the complete set of configuration for the SFTP ingestion agent, listing all fields with examples and explanatory comments.
author: rcdun
ms.author: rdunstan
ms.service: operator-insights
ms.topic: conceptual
ms.date: 12/06/2023
---
# SFTP Ingestion Agents configuration reference

This reference provides the complete set of configuration for the agent, listing all fields with examples and explanatory comments.

``` 
# The name of the site this agent lives in. Reserved URL characters must be percent-encoded.
site_id: london-lab01 
# Config for secrets providers. We support reading secrets from Azure Key Vault and from the VM's local filesystem.
# Multiple secret providers can be defined and each must be given a unique name, which is referenced later in the config.
# Two secret providers must be configured for the SFTP agent to run:
  # A secret provider of type `key_vault` which contains details required to connect to the Azure Key Vault and allow connection to the storage account.
  # A secret provider of type `file_system`, which specifies a directory on the VM where secrets for connecting to the SFTP server are stored.
secret_providers: 
  - name: data_product_keyvault 
    provider: 
      type: key_vault 
      vault_name: contoso-dp-kv 
      auth: 
        tenant_id: ad5421f5-99e4-44a9-8a46-cc30f34e8dc7 
        identity_name: 98f3263d-218e-4adf-b939-eacce6a590d2 
        cert_path: /path/to/local/certkey.pkcs
  - name: local_filesystem
    provider:
      # The file system provider specifies a folder in which secrets are stored.
      # Each secret must be an individual file without a file extension, where the secret name is the file name, and the file contains the secret only.
      type: file_system
      # The absolute path to the secrets directory
      secrets_directory: /path/to/secrets/directory
file_sources:
# Source configuration. This specifies which files are ingested from the SFTP server. 
# Multiple sources can be defined here (where they can reference different folders on the same SFTP server). Each source must have a unique identifier where any URL reserved characters in source_id must be percent-encoded.
# A sink must be configured for each source.
- source_id: sftp-source01
  source:
    sftp:
      # The IP address or hostname of the SFTP server.
      host: 192.0.2.0
      # Optional. The port to connect to on the SFTP server. Defaults to 22.
      port: 22
      # The path on the VM to the 'known_hosts' file for the SFTP server.  This file must be in SSH format and contain  details of any public SSH keys used by the SFTP server. This is required by the agent to verify it is connecting to the correct SFTP server.
      known_hosts_file: /path/to/known_hosts
      # The name of the user on the SFTP server which the agent will use to connect.
      user: sftp-user
      auth: 
        # The name of the secret provider configured above which contains the secret for the SFTP user.
        secret_provider: local_filesystem
        # The form of authentication to the SFTP server. This can take the values 'password' or 'ssh_key'. The  appropriate field(s) must be configured below depending on which type is specified.
        type: password
        # Only for use with 'type: password'. The name of the file containing the password in the secrets_directory folder
        secret_name: sftp-user-password
        # Only for use with 'type: ssh_key'. The name of the file containing the SSH key in the secrets_directory folder
        key_secret: sftp-user-ssh-key
        # Optional. Only for use with 'type: ssh_key'. The passphrase for the SSH key. This can be omitted if the key is not protected by a passphrase.
        passphrase_secret_name: sftp-user-ssh-key-passphrase
    # Optional. A regular expression to specify which files in the base_path folder should be ingested. If not specified, the STFP agent will attempt to ingest all files in the base_path folder (subject to exclude_pattern, settling_time_secs and exclude_before_time).
    include_pattern: "*\.csv$"
    # Optional. A regular expression to specify any files in the base_path folder which should not be ingested. Takes priority over include_pattern, so files which match both regular expressions will not be ingested.
    exclude_pattern: '\.backup$'
    # A duration in seconds. During an upload run, any files last modified within the settling time are not selected for upload, as they may still be being modified.
    settling_time_secs: 60
    # A datetime that adheres to the RFC 3339 format. Any files last modified before this datetime will be ignored.
    exclude_before_time: "2022-12-31T21:07:14-05:00"
    # An expression in cron format, specifying when upload runs are scheduled for this source. All times refer to UTC. The cron schedule should include fields for: second, minute, hour, day of month, month, day of week, and year. E.g.:
    # `* /3 * * * * *` for once every 3 minutes
    # `0 30 5 * * * *` for 05:30 every day
    # `0 15 3 * * Fri,Sat *` for 03:15 every Friday and Saturday
    schedule: "*/30 * * * Apr-Jul Fri,Sat,Sun 2025"
  sink: 
    auth:
      type: sas_token 
      # This must reference a secret provider configured above. 
      secret_provider: data_product_keyvault 
      # The name of a secret in the corresponding provider. 
      # This will be the name of a secret in the Key Vault.   
      # This is created by the Data Product and should not be changed. 
      secret_name: adls-sas-token
    # The container within the ingestion account.  This *must* be in 
    # the format Azure Operator Insights expects.  Do not adjust 
    # without consulting your support representative. 
    container_name: edrs
    # Optional. How often, in hours, the sink should refresh its ADLS token. Defaults to 1
    adls_token_cache_period_hours: 1
    # Optional. The maximum number of blobs that can be uploaded to ADLS in parallel. Further blobs will be queued in memory until an upload completes. Defaults to 10.
    # Note: This value is also the maximum number of concurrent SFTP reads for the associated source.  Ensure your SFTP server can handle this many concurrent connections.  If you set this to a value greater than 10 and are using an OpenSSH server, you may need to increase `MaxSessions` and/or `MaxStartups` in `sshd_config`.
    maximum_parallel_uploads: 10
    # Optional. The maximum size of each block that is uploaded to Azure. 
    # Each blob is composed of one or more blocks. Defaults to 32MiB (=33554432 Bytes)
      block_size_in_bytes  : 33554432
```
