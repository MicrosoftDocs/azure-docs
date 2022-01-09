---
title: Manage ASIM parsers | Microsoft Docs
description: This article explains how to manage ASIM parsers, add a customer parser, and replace a built-in parser.
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
--- 

# Manage ASIM parsers (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

ASIM users use unifying parsers instead of table names in their queries. Using unifying parsers enables viewing data in a normalized format and getting all the data relevant to the schema in a single query. Each unifying parser uses multiple source-specific parsers that handle each source's specific details. 

You may need to manage the source-specific parsers used by each unifying parser to:

- Add a custom source-specific parser to a unifying parser.

- Replace a built-in source-specific parser used by a unifying parser with a custom source-specific parser to:
  - Use a version of the built-in parser other than the one used by default in the unifying parser. 
  - Fix the version of the source-specific parser used by the unifying parser to prevent automated updates.
  - Use a modified version of the built-in parser.

This document will guide you how to perform these tasks, whether using built-in unifying ASIM parsers or workspace deployed unifying parsers. The procedures below assume that all source-specific parsers have already been deployed to the workspace as outlined in the document [Develop ASIM parsers](normalization-develop-parsers.md#deploy-parsers).

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Managing built-in unifying parsers

### Setup

The user cannot edit built-in unifying parsers. The following mechanisms enable users to influence the built-in unifying parsers behavior:

-  To enable adding source-specific parsers, ASIM uses custom unifying parsers. These parsers are workspace deployed and are picked up automatically by the built-in unifying parsers if they exist. You can [deploy initial empty custom unifying parsers](https://aka.ms/ASimDeployEmptyCustomUnifyingParsers) for all supported schemas, or individually for specific schemas.

- To enable excluding built-in source-specific parsers, ASIM uses a watchlist. Deploy the watchlist from [GitHub](https://aka.ms/DeployASimExceptionWatchlist).

### Adding a custom parser to a built-in unifying parser

To add a custom parser, insert a line to the custom unifying parser referencing the new custom parser. Make sure to add both a filtering custom parser and a parameter-less custom parser. To learn more about how to edit parsers, refer to the document [Functions in Azure Monitor log queries](/azure/azure-monitor/logs/functions#edit-a-function).

The syntax of the line to add is different for each schema:

| Schema | Custom source&#8209;agnostic filtering  parser | Format of line to add | Custom source&#8209;agnostic Parameter-less parser |  Format of line to add |
| ------ | ---------------------------------------- | --------------------- | ---------------- | --------------------- | 
| DNS    | Im_DnsCustom | _parser_name_ (starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype) | ASim_DnsCustom | _parser_name_ |
| | | | |  

When adding an additional parser to a custom unifying parser that already references parsers, make sure you add a comma at the end of the previous line. 

For example, the custom unifying parser after adding `added_parser` is:

```KQL
union isfuzzy=true
existing_parser(starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype),
added_parser(starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype)
```

### Use a modified version of a built-in parser

To modify an existing built-in source-specific parser
- Create a custom parser based on the original parser and add it as outlined above. 
 
- Add a record to the watchlist `ASim Disabled Parsers`. Set the CallerContext field based on the table below and the SourceSpecificParser field with the name of the original parser name without the version specifier. For example, to exclude the Azure Firewall DNS parser, add the following records to the watchlist

| CallerContext | SourceSpecificParser | 
| ------------- | ------------- |
| _Im_Dns | _Im_Dns_AzureFirewall |
| _ASim_Dns | _ASim_Dns_AzureFilewall | 
|||
 

### Prevent automated update of a built-in parser

To fix the version used for a built-in source-specific parser:
- Add the built-in parser version you want to use to the custom unifying parser as outlined above for custom parsers, for example, `_Im_Dns_AzureFirewallV02`.
- Add an exception for the built-in parser as outlined above. When excluding a large number of built-in parsers, for example, to opt out entirely from automatic updates, you can add:
  - A record with `Any` as the SourceSpecificParser field to exclude all parsers for the CallerContext.
  - A record for  `Any` in the CallerContext and the SourceSpecificParser fields to exclude all built-in parsers.
 

## Managing workspace-deployed unifying parsers

### Adding a custom parser to a workspace-deployed unifying parser

To add a custom parser, insert a line to the union statement in the workspace-deployed unifying parser referencing the new custom parser. Make sure to add both a filtering custom parser and a parameter-less custom parser. The syntax of the line to add is different for each schema:

| Schema |  Filtering  parser | Parameter-less parser |
| ------ | -------------- | --------------------- |
| **Authentication**  | **Name:** ImAuthentication<br><br>**Line to add:**<br> _parser_name_ (starttime, endtime, targetusername_has) | **Name:** ASimAuthentication<br><br> **Line to add:** _parser_name_ |
| **DNS**   |  **Name:** ImDns<br><br>**Line to add:**<br> _parser_name_ (starttime, endtime, srcipaddr, domain_has_any, responsecodename, response_has_ipv4, response_has_any_prefix, eventtype) | **Name:** ASimDns<br><br>**Line to add:** _parser_name_ |
| **File Event** | | **Name:** imFileEvent<br><br>**Line to add:** _parser_name_ |
| **Network Session** | **Name:** imNetworkSession<br><br>**Line to add:**<br> _parser_name_ (starttime, endtime, srcipaddr_has_any_prefix, dstipaddr_has_any_prefix, dstportnumber, url_has_any, httpuseragent_has_any, hostname_has_any, dvcaction, eventresult) | **Name:** ASimNetworkSession<br><br>**Line to add:** _parser_name_ |
| **Process Event** | | **Names:**<br> - imProcess<br> - imProcessCreate<br> - imProcessTerminat<br><br>**Line to add:**  _parser_name_ |
| **Registry Event** | | **Name:** imRegistry<br><br>**Line to add:** _parser_name_ |
| **Web Session** | **Name:** imWebSession<br><br>**Line to add:**<br> _parser_name_ parser (starttime, endtime, srcipaddr_has_any, url_has_any, httpuseragent_has_any, eventresultdetails_in, eventresult) | **Name:** ASimWebSession<br><br>**Line to add:**  _parser_name_ | 
| |  |  

When adding an additional parser to a unifying parser, make sure you add a comma at the end of the previous line.

For example, the DNS filtering unifying parser after adding `added_parser` is:

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

Since workspace-deployed parsers can be edited, you can directly modify the parser. Instead, you can create a parser based on the original, comment out the original, and add your modified version to the workspace-deployed unifying parser.

For example, the DNS filtering unifying parser after adding replacing the vimDnsAzureFirewall with a modified version:

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

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced SIEM Information Model overview](normalization.md)
- [Use ASIM parsers](normalization-about-parsers.md)
- [Develop ASIM parsers](normalization-develop-parsers.md)
