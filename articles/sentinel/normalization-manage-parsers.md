---
title: Manage Advanced Security Information Model (ASIM) parsers | Microsoft Docs
description: This article explains how to manage Advanced Security Information Model (ASIM) parsers, add a customer parser, and replace a built-in parser.
author: oshezaf
ms.topic: how-to
ms.date: 11/09/2021
ms.author: ofshezaf


#Customer intent: As a security analyst, I want to manage and customize ASIM parsers so that I can normalize and analyze security data from various sources effectively.

--- 

# Manage Advanced Security Information Model (ASIM) parsers

Advanced Security Information Model (ASIM) users use *unifying parsers* instead of table names in their queries, to view data in a normalized format and get all the data relevant to the schema in a single query. Each unifying parser uses multiple source-specific parsers that handle each source's specific details. 

To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

You may need to manage the source-specific parsers used by each unifying parser to:

- **Add a custom, source-specific parser** to a unifying parser.

- **Replace a built-in, source-specific parser** that's used by a unifying parser with a custom, source-specific parser. Replace built-in parsers when you want to:

  - Use a version of the built-in parser other than the one used by default in the unifying parser. 

  - Prevent automated updates by preserving the version of the source-specific parser used by the unifying parser.

  - Use a modified version of a built-in parser.

- **Configure a source-specific parser**, for example to define the sources that send information relevant to the parser.

This article guides you through managing your parsers. 

## Prerequisites

The procedures in this article assume that all source-specific parsers have already been deployed to your Microsoft Sentinel workspace. 

For more information, see [Develop ASIM parsers](normalization-develop-parsers.md#deploy-parsers).

## Manage built-in unifying parsers

### Set up your workspace

Microsoft Sentinel users cannot edit built-in unifying parsers. Instead, use the following mechanisms to modify the behavior of built-in unifying parsers:

-  **To support adding source-specific parsers**, ASIM uses unifying, custom parsers. These custom parsers are workspace-deployed, and therefore editable. Built-in, unifying parsers automatically pick up these custom parsers, if they exist. 

    You can deploy initial, empty, unifying custom parsers to your Microsoft Sentinel workspace for all supported schemas, or individually for specific schemas. For more information, see [Deploy initial ASIM empty custom unifying parsers](https://aka.ms/ASimDeployEmptyCustomUnifyingParsers) in the Microsoft Sentinel GitHub repository.

- **To support excluding built-in source-specific parsers**, ASIM uses a watchlist. Deploy the watchlist to your Microsoft Sentinel workspace from the Microsoft Sentinel [GitHub](https://aka.ms/DeployASimWatchlists) repository.

- **To define source type for built-in and custom parsers**, ASIM uses a watchlist. Deploy the watchlist to your Microsoft Sentinel workspace from the Microsoft Sentinel [GitHub](https://aka.ms/DeployASimWatchlists) repository.

### Add a custom parser to a built-in unifying parser

To add a custom parser, insert a line to the custom unifying parser to reference the new, custom parser. 

Make sure to add both a filtering custom parser and a parameter-less custom parser. To learn more about how to edit parsers, refer to the document [Functions in Azure Monitor log queries](/azure/azure-monitor/logs/functions#edit-a-function).

The syntax of the line to add is different for each schema:

| Schema | Parser |  Line to add |
| ------ | ---------------------- | ---------------------------------------- |
| AlertEvent | `Im_AlertEventCustom` | `_parser_name_ (starttime, endtime, ipaddr_has_any_prefix, hostname_has_any, username_has_any, attacktactics_has_any, attacktechniques_has_any, threatcategory_has_any, alertverdict_has_any, eventseverity_has_any)` |
| AuditEvent | `Im_AuditEventCustom` | `_parser_name_ (starttime, endtime, srcipaddr_has_any_prefix, eventtype_in, eventresult, actorusername_has_any, operation_has_any, object_has_any, newvalue_has_any)` |
| Authentication | `Im_AuthenticationCustom` | `_parser_name_ (starttime, endtime, targetusername_has_any, actorusername_has_any, srcipaddr_has_any_prefix, srchostname_has_any, targetipaddr_has_any_prefix, dvcipaddr_has_any_prefix, dvchostname_has_any, eventtype_in, eventresultdetails_in, eventresult)` |
| DhcpEvent | `Im_DhcpEventCustom` | `_parser_name_ (starttime, endtime, srcipaddr_has_any_prefix, srchostname_has_any, srcusername_has_any, eventresult)` |
| Dns | `Im_DnsCustom` | `_parser_name_ (starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)` |
| FileEvent | `Im_FileEventCustom` | `_parser_name_ (starttime, endtime, eventtype_in, srcipaddr_has_any_prefix, actorusername_has_any, targetfilepath_has_any, srcfilepath_has_any, hashes_has_any, dvchostname_has_any)` |
| NetworkSession | `Im_NetworkSessionCustom` | `_parser_name_ (starttime, endtime, srcipaddr_has_any_prefix, dstipaddr_has_any_prefix, ipaddr_has_any_prefix, dstportnumber, hostname_has_any, dvcaction, eventresult)` |
| ProcessEvent | `Im_ProcessEventCustom` | `_parser_name_ (starttime, endtime, commandline_has_any, commandline_has_all, commandline_has_any_ip_prefix, actingprocess_has_any, targetprocess_has_any, parentprocess_has_any, targetusername_has, actorusername_has, dvcipaddr_has_any_prefix, dvchostname_has_any, eventtype)` |
| RegistryEvent | `Im_RegistryEventCustom` | `_parser_name_ (starttime, endtime, eventtype_in, actorusername_has_any, registrykey_has_any, registryvalue_has_any, registryvaluedata_has_any, dvchostname_has_any)` |
| UserManagement | `Im_UserManagementCustom` | `_parser_name_ (starttime, endtime, srcipaddr_has_any_prefix, targetusername_has_any, actorusername_has_any, eventtype_in)` |
| WebSession | `Im_WebSessionCustom` | `_parser_name_ (starttime, endtime, srcipaddr_has_any_prefix, ipaddr_has_any_prefix, url_has_any, httpuseragent_has_any, eventresultdetails_in, eventresult)` |

When adding an additional parser to a unifying custom parser that already references parsers, make sure you add a comma at the end of the previous line. 

For example, the following code shows a custom unifying parser after having added the `added_parser`:

```kusto
union isfuzzy=true
existing_parser(starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype),
added_parser(starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)
```

### Use a modified version of a built-in parser

To modify an existing, built-in source-specific parser:

1. Create a custom parser based on the original parser and [add it](#add-a-custom-parser-to-a-built-in-unifying-parser) to the built-in parser. You can use the [workspace deployed version](normalization-about-workspace-parsers.md) of the parser as a starting point.

1. Add a record to the `ASim Disabled Parsers` watchlist.

1. Define the `CallerContext` value as `Exclude<parser name>`, where `<parser name>` is the name of the unifying parsers you want to exclude the parser from.

1. Define the `SourceSpecificParser` value `Exclude<parser name>`, where `<parser name>`is the name of the parser you want to exclude, without a version specifier. 

For example, to exclude the Azure Firewall DNS parser, add the following record to the watchlist:

| CallerContext | SourceSpecificParser | 
| ------------- | ------------- |
| `Exclude_Im_Dns` | `Exclude_Im_Dns_AzureFirewall` |


### Prevent an automated update of a built-in parser

Use the following process to prevent automatic updates for built-in, source-specific parsers:

1. Add the built-in parser version you want to use, such as `_Im_Dns_AzureFirewallV02`, to the custom unifying parser. For more information, see above, [Add a custom parser to a built-in unifying parser](#add-a-custom-parser-to-a-built-in-unifying-parser).

1. Add an exception for the built-in parser. For example, when you want to entirely opt out from automatic updates, and therefore exclude a large number of built-in parsers, add:

  - A record with `Any` as the `SourceSpecificParser` field, to exclude all parsers for the `CallerContext`.
  - A record for  `Any` in the CallerContext and the `SourceSpecificParser` fields to exclude all built-in parsers.
 
  For more information, see [Use a modified version of a built-in parser](#use-a-modified-version-of-a-built-in-parser).

## Configure the sources relevant to a source-specific parser

Some parsers require you to update the list of sources that are relevant to the parser. For example, a parser that uses Syslog data, may not be able to determine what Syslog events are relevant to the parser. Such a parser may use the `Sources_by_SourceType` watchlist to determine which sources send information relevant to the parser. For such parses add a record for each relevant source to the watchlist:
- Set the `SourceType` field to the parser specific value specified in the parser documentation. 
- Set the `Source` field to the identifier of the source used in the events. You may need to query the original table, such as Syslog, to determine the correct value.

If your system does not have the `Sources_by_SourceType` watchlist deployed, deploy the watchlist to your Microsoft Sentinel workspace from the Microsoft Sentinel [GitHub](https://aka.ms/DeployASimWatchlists) repository.

## <a name="next-steps"></a>Next steps

This article discusses managing the Advanced Security Information Model (ASIM) parsers.

Learn more about ASIM parsers:

- [ASIM parsers overview](normalization-parsers-overview.md)
- [Use ASIM parsers](normalization-about-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)
- [The ASIM parsers list](normalization-parsers-list.md)

Learn more about the ASIM in general: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
