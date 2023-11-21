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
# The name of the site this agent lives in 
site_id: london-lab01 
# The identifier for this agent 
agent_id: mcc-edr-agent01 
# Config for secrets providers. We currently support reading secrets from Azure Key Vault and from the local filesystem. 
# Multiple secret providers can be defined and each must be given 
# a unique name. 
# The name can then be referenced for secrets later in the config. 
secret_providers: 
  - name: dp_keyvault 
    provider: 
      type: key_vault 
      vault_name: contoso-dp-kv 
      auth: 
        tenant_id: ad5421f5-99e4-44a9-8a46-cc30f34e8dc7 
        identity_name: 98f3263d-218e-4adf-b939-eacce6a590d2 
        cert_path: /path/to/local/certkey.pkcs 
# Source configuration. This controls how EDRs are ingested from  
# MCC. 
source: 
  # The TCP port to listen on.  Must match the port MCC is  
  # configured to send to. 
  listen_port: 36001 
  # The maximum amount of data to buffer in memory before     uploading. 
  message_queue_capacity_in_bytes: 33554432 
  # The maximum size of a single blob (file) to  store in the input
  # storage account in Azure. 
  maximum_blob_size_in_bytes: 134217728 
  # Quick check on the maximum RAM that the agent should use.   
  # This is a guide to check the other tuning parameters, rather  
  # than a hard limit. 
  maximum_overall_capacity_in_bytes: 1275068416 
  # The maximum time to wait when no data is received before  
  # uploading pending batched data to Azure.  
  blob_rollover_period_in_seconds: 300 
sink: 
  # The container within the ingestion account.  This *must* be in 
  # the format Azure Operator Insights expects.  Do not adjust 
  # without consulting your support representative. 
  container_name: edrs
  auth:       
    type: sas_token 
    # This must reference a secret provider configured above. 
    secret_provider: dp_keyvault 
    # How often to check for a new ADLS token 
    cache_period_hours: 12 
    # The name of a secret in the corresponding provider. 
    # This will be the name of a secret in the Key Vault.   
    # This is created by the Data Product and should not be changed. 
    secret_name: adls-sas-token   
# The maximum size of each block that is uploaded to Azure. 
# Each blob is composed of one or more blocks.
  block_size_in_bytes  : 33554432
```
