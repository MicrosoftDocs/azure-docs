---
title: MCC EDR Ingestion Agents configuration reference for Azure Operator Insights
description: This article documents the complete set of configuration for the agent, listing all fields with examples and explanatory comments.
author: HollyCl
ms.author: HollyCl
ms.service: operator-insights
ms.date: 11/02/2023
ms.topic: conceptual

---
# MCC EDR Ingestion Agents configuration reference

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
  container_name: edr
  # Optional. How often, in hours, the agent should refresh its ADLS token. Defaults to 1
  adls_token_cache_period_hours: 1
  auth:       
    type: sas_token 
    # This must reference a secret provider configured above. 
    secret_provider: dp_keyvault 
    # The name of a secret in the corresponding provider. 
    # This will be the name of a secret in the Key Vault.   
    # This is created by the Data Product and should not be changed. 
    secret_name: adls-sas-token   
# Optional. The maximum size of each block that is uploaded to Azure. 
# Each blob is composed of one or more blocks. Defaults to 32MiB (=33554432 bytes)
  block_size_in_bytes  : 33554432
```
