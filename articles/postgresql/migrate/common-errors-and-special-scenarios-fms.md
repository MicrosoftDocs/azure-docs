---
title: "Common errors and special scenarios for PostgreSQL Single Server to Flexible using the FMS migration tool"
titleSuffix: 
description: Common errors and special scenarios for PostgreSQL Single Server to Flexible using the FMS migration tool.
author: harmeet-singh
ms.author: hasingh
ms.service: postgresql
ms.topic: conceptual
ms.date: 04/25/2023
ms.custom:
---

# Common errors and special scenarios for PostgreSQL Single Server to Flexible using the FMS migration tool.

## Custom DNS

- Error message
    Connecting to the Source DB server failed. ErrorMessage: Validation of one or more databases failed to run `select 1;` with exception 28000: The public network access on this server is disabled. Use the Private Endpoint inside your virtual network to connect to this server.
    
- Root Cause
   
    The VNet is, by default, not enabled for outbound connections when we use CustomDNS. Migration makes outbound calls, which cause the failure.
    
- Mitigation/Resolution
   
    While Microsoft is working on a fix as part of the product, customers can use one of the following mitigations to unblock:
    Temporarily enable the public network access on the server
    OR
    Reach out to Microsoft, and we enable the server for outbound connections for the selected DNS addresses.
    
## Allow-listing extensions

- Symptom
    Error message appears as "Extensions plpgsql, pg_stat_statements, pg_buffercache aren't allowlisted on target server" or
    
    :::image type="content" source="media/common-errors-and-special-scenarios-fms/allow-list-extensions.png" alt-text="Scenario for allow listing extensions":::
    
- Root Cause
 
    The flexible server doesn't have extensions allow-listed by default and has to be manually allow-listed before migration/use.
    
- Mitigation/Resolution
   
    Customers need to go to the server parameters of the flexible server and allowlist all the extensions they intend to use. At least the ones mentioned in the error message should be allowed to be listed.

## Migrations with TimescaleDB extension

- Error Message 
    EX001: Extension creation failed for one or more extensions:
    Failed to run `CREATE EXTENSION IF NOT EXISTS "{0}" CASCADE;` with exception XX000: extension "timescaledb" must be preloaded.
    
- Root Cause
   
    <!-- TBA -->

- Mitigation/Resolution
   
    <!-- TBA -->

## No pg_hba.conf entry for host

- Error Message
    Connecting to the Source DB server failed. ErrorMessage: Validation of one or more databases failed. Failed to run `select 1;` with exception 28000: no pg_hba.conf entry for host "xx.xx.xx.xx", the user "username," database "postgres," SSL on Parameter name: SourceDBServerResourceId.

- Root Cause
   
    The IP address isn't added to the firewall rules.

- Mitigation/Resolution
   
    Add IP addresses in the Firewall rules in the Networking tab of the Flex Server.

## Migration to Flex server with Burtsable SKU isn't Supported

- Error Message
    Migration to Flex server with Burtsable SKU isn't Supported.

- Root Cause
   
    By Design.

- Mitigation/Resolution
   
    Change the flexible server from Burstable to General Purpose or Memory Optimized by going to compute + storage tab on the left menu.
 
## Cross-region migration isn't supported

- Error Message
    Cross-region migration isn't supported.

- Root Cause
   
    By Design.

- Mitigation/Resolution
   
    This feature is coming soon; in the meantime, only migrations within servers of the same region are supported.

## Next steps

- [Migration tool](concepts-single-to-flexible.md)