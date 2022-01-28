---
title: Manage Advanced SIEM Information Model (ASIM) parsers | Microsoft Docs
description: This article explains how to manage Advanced SIEM Information Model (ASIM) parsers, add a customer parser, and replace a built-in parser.
author: oshezaf
ms.topic: how-to
ms.date: 11/09/2021
ms.author: ofshezaf
--- 

# Manage Advanced SIEM Information Model (ASIM) parsers (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Advanced SIEM Information Model (ASIM) users use *unifying parsers* instead of table names in their queries, to view data in a normalized format and get all the data relevant to the schema in a single query. Each unifying parser uses multiple source-specific parsers that handle each source's specific details. 

To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

You may need to manage the source-specific parsers used by each unifying parser to:

- **Add a custom, source-specific parser** to a unifying parser.

- **Replace a built-in, source-specific parser** that's used by a unifying parser with a custom, source-specific parser. Replace built-in parsers when you want to:

  - Use a version of the built-in parser other than the one used by default in the unifying parser. 

  - Prevent automated updates by preserving the version of the source-specific parser used by the unifying parser.

  - Use a modified version of a built-in parser.

This article guides you through managing your parsers, whether using built-in, unifying ASIM parsers or workspace-deployed unifying parsers. 

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

The procedures in this article assume that all source-specific parsers have already been deployed to your Microsoft Sentinel workspace. 

For more information, see [Develop ASIM parsers](normalization-develop-parsers.md#deploy-parsers).

## Manage built-in unifying parsers

### Set up your workspace

Microsoft Sentinel users cannot edit built-in unifying parsers. Instead, use the following mechanisms to modify the behavior of built-in unifying parsers:

-  **To support adding source-specific parsers**, ASIM uses unifying, custom parsers. These custom parsers are workspace-deployed, and therefore editable. Built-in, unifying parsers automatically pick up these custom parsers, if they exist. 

    You can deploy initial, empty, unifying custom parsers to your Microsoft Sentinel workspace for all supported schemas, or individually for specific schemas. For more information, see [Deploy initial ASIM empty custom unifying parsers](https://aka.ms/ASimDeployEmptyCustomUnifyingParsers) in the Microsoft Sentinel GitHub repository.

- **To support excluding built-in source-specific parsers**, ASIM uses a watchlist. Deploy the watchlist to your Microsoft Sentinel workspace from the Microsoft Sentinel [GitHub](https://aka.ms/DeployASimExceptionWatchlist) repository.

### Add a custom parser to a built-in unifying parser

To add a custom parser, insert a line to the custom unifying parser to reference the new, custom parser. 

Make sure to add both a filtering custom parser and a parameter-less custom parser. To learn more about how to edit parsers, refer to the document [Functions in Azure Monitor log queries](../azure-monitor/logs/functions.md#edit-a-function).

The syntax of the line to add is different for each schema:

| Schema | Filtering  parser | Parameter&#8209;less&nbsp;parser | 
| ------ | ---------------------------------------- | --------------------- |
| DNS    | **Name**: `Im_DnsCustom`<br><br> **Line to add**:<br> `_parser_name_ (starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)` | **Name**: `ASim_DnsCustom`<br><br> **Line to add**:<br> `_parser_name_` |
| | |

When adding an additional parser to a unifying custom parser that already references parsers, make sure you add a comma at the end of the previous line. 

For example, the following code shows a custom unifying parser after having added the `added_parser`:

```KQL
union isfuzzy=true
existing_parser(starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype),
added_parser(starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)
```

### Use a modified version of a built-in parser

To modify an existing, built-in source-specific parser:

1. Create a custom parser based on the original parser and [add it](#add-a-custom-parser-to-a-built-in-unifying-parser) to the built-in parser. 

1. Add a record to the `ASim Disabled Parsers` watchlist.

1. Define the `CallerContext` value with the names of any unifying parsers you want to exclude the parser from.

1. Define the `SourceSpecificParser` value with the name of the parser you want to exclude, without a version specifier. 

For example, to exclude the Azure Firewall DNS parser, add the following records to the watchlist:

| CallerContext | SourceSpecificParser | 
| ------------- | ------------- |
| `_Im_Dns` | `_Im_Dns_AzureFirewall` |
| `_ASim_Dns` | `_ASim_Dns_AzureFirewall` | 
| | |

### Prevent an automated update of a built-in parser

Use the following process to prevent automatic updates for built-in, source-specific parsers:

1. Add the built-in parser version you want to use, such as `_Im_Dns_AzureFirewallV02`, to the custom unifying parser. For more information, see above, [Add a custom parser to a built-in unifying parser](#add-a-custom-parser-to-a-built-in-unifying-parser).

1. Add an exception for the built-in parser. For example, when you want to entirely opt out from automatic updates, and therefore exclude a large number of built-in parsers, add:

  - A record with `Any` as the `SourceSpecificParser` field, to exclude all parsers for the `CallerContext`.
  - A record for  `Any` in the CallerContext and the `SourceSpecificParser` fields to exclude all built-in parsers.
 
  For more information, see [Use a modified version of a built-in parser](#use-a-modified-version-of-a-built-in-parser).

## Manage workspace-deployed unifying parsers

### Add a custom parser to a workspace-deployed unifying parser

To add a custom parser, insert a line to the `union` statement in the workspace-deployed unifying parser that references the new custom parser. 

Make sure to add both a filtering custom parser and a parameter-less custom parser. The syntax of the line to add is different for each schema:

| Schema |  Filtering  parser | Parameter&#8209;less&nbsp;parser |
| ------ | -------------- | --------------------- |
| **Authentication**  | **Name:** `ImAuthentication`<br><br>**Line to add:**<br> `_parser_name_ (starttime, endtime, targetusername_has)` | **Name:** `ASimAuthentication`<br><br> **Line to add:** `_parser_name_` |
| **DNS**   |  **Name:** `ImDns`<br><br>**Line to add:**<br> `_parser_name_ (starttime, endtime, srcipaddr, domain_has_any,`<br>` responsecodename, response_has_ipv4, response_has_any_prefix,`<br>` eventtype)` | **Name:** `ASimDns`<br><br>**Line to add:** `_parser_name_` |
| **File Event** | | **Name:** `imFileEvent`<br><br>**Line to add:** `_parser_name_` |
| **Network Session** | **Name:** `imNetworkSession`<br><br>**Line to add:**<br> `_parser_name_ (starttime, endtime, srcipaddr_has_any_prefix, dstipaddr_has_any_prefix, dstportnumber, url_has_any,`<br>` httpuseragent_has_any, hostname_has_any, dvcaction, eventresult)` | **Name:** `ASimNetworkSession`<br><br>**Line to add:** `_parser_name_` |
| **Process Event** | | **Names:**<br> - `imProcess`<br> - `imProcessCreate`<br> - `imProcessTerminate`<br><br>**Line to add:**  `_parser_name_` |
| **Registry Event** | | **Name:** `imRegistry`<br><br>**Line to add:** `_parser_name_` |
| **Web Session** | **Name:** `imWebSession`<br><br>**Line to add:**<br> `_parser_name_ parser (starttime, endtime, srcipaddr_has_any, url_has_any, httpuseragent_has_any, eventresultdetails_in, eventresult)` | **Name:** `ASimWebSession`<br><br>**Line to add:**  `_parser_name_` | 
| |  |  

When adding an additional parser to a unifying parser, make sure you add a comma at the end of the previous line.

For example, the following example shows the DNS filtering unifying parser, after having added the custom `added_parser`:

```KQL
  let Generic=(starttime:datetime=datetime(null), endtime:datetime=datetime(null) , srcipaddr:string='*' , domain_has_any:dynamic=dynamic([]) , responsecodename:string='*', response_has_ipv4:string='*' , response_has_any_prefix:dynamic=dynamic([]) , eventtype:string='lookup' ){
  let DisabledParsers=materialize(_GetWatchlist('ASimDisabledParsers') | where SearchKey in ('Any', 'imDns') | extend SourceSpecificParser=column_ifexists('SourceSpecificParser','') | distinct SourceSpecificParser);
  let imDnsBuiltInDisabled=toscalar('imDnsBuiltIn' in (DisabledParsers) or 'Any' in (DisabledParsers)); 
  union isfuzzy=true
      vimDnsEmpty
    , vimDnsCiscoUmbrella  ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsCiscoUmbrella'   in (DisabledParsers) )))
    , vimDnsInfobloxNIOS   ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsInfobloxNIOS'    in (DisabledParsers) )))
    ...
    , vimDnsAzureFirewall  ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsAzureFirewall'   in (DisabledParsers) )))
    , vimDnsMicrosoftNXlog ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsMicrosoftNXlog'  in (DisabledParsers) ))),
    added_parser ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)
     };
  Generic( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)
```

### Use a modified version of a workspace-deployed parser

Microsoft Sentinel users can directly modify workspace-deployed parsers. Create a parser based on the original, comment out the original, and then add your modified version to the workspace-deployed unifying parser.

For example, the following code shows a DNS filtering unifying parser, having replaced the `vimDnsAzureFirewall` parser with a modified version:

```KQL
  let Generic=(starttime:datetime=datetime(null), endtime:datetime=datetime(null) , srcipaddr:string='*' , domain_has_any:dynamic=dynamic([]) , responsecodename:string='*', response_has_ipv4:string='*' , response_has_any_prefix:dynamic=dynamic([]) , eventtype:string='lookup' ){
  let DisabledParsers=materialize(_GetWatchlist('ASimDisabledParsers') | where SearchKey in ('Any', 'imDns') | extend SourceSpecificParser=column_ifexists('SourceSpecificParser','') | distinct SourceSpecificParser);
  let imDnsBuiltInDisabled=toscalar('imDnsBuiltIn' in (DisabledParsers) or 'Any' in (DisabledParsers)); 
  union isfuzzy=true
      vimDnsEmpty
    , vimDnsCiscoUmbrella  ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsCiscoUmbrella'   in (DisabledParsers) )))
    , vimDnsInfobloxNIOS   ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsInfobloxNIOS'    in (DisabledParsers) )))
    ...
    // , vimDnsAzureFirewall  ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsAzureFirewall'   in (DisabledParsers) )))
    , vimDnsMicrosoftNXlog ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype, (imDnsBuiltInDisabled or('vimDnsMicrosoftNXlog'  in (DisabledParsers) ))),
    modified_vimDnsAzureFirewall ( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)
     };
  Generic( starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)
```

## <a name="next-steps"></a>Next steps

This article discusses managing the Advanced SIEM Information Model (ASIM) parsers.

Learn more about ASIM parsers:

- [ASIM parsers overview](normalization-parsers-overview.md)
- [Use ASIM parsers](normalization-about-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)

Learn more about the ASIM in general: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced SIEM Information Model (ASIM) overview](normalization.md)
- [Advanced SIEM Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced SIEM Information Model (ASIM) content](normalization-content.md)