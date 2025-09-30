---
title: Troubleshoot solutions in Microsoft Sentinel
description: Troubleshoot Microsoft Sentinel data ingestion, analytics, packaging, and agent integration issues, and prepare information for Support.
ms.topic: troubleshooting
ms.service: microsoft-sentinel
ms.date: 09/17/2025
ms.author: guywild
author: guywi-ms
#CustomerIntent: As a security engineer, I want to quickly diagnose Microsoft Sentinel solution ingestion, analytics, packaging, and MCP tool issues and know what to collect before opening a support case.
---

# Troubleshoot solutions in Microsoft Sentinel

Use this guide to diagnose issues, validate configurations, and understand support responsibilities for your Microsoft Sentinel solution.

## Before you contact support

Before opening a support case, complete the following checks:

- **Verify data availability:** Confirm that source data is arriving and that expected schemas and tables are present. If you use the Advanced Security Information Model (ASIM), make sure analytics rely on normalized fields.

- **Check platform health:** Review Sentinel health signals at [Auditing and health monitoring in Microsoft Sentinel](health-audit.md) to confirm platform status and identify any issues.

- **Collect diagnostic artifacts:** Gather UTC timestamps, tenant and workspace IDs, solution name and version, failing API calls, and sanitized payloads.

- **Validate packaging:** Confirm that the manifest and schema are correct. Document any required Content Hub dependencies if your app or agent ships through the Security Store.

- **Confirm access and roles:** Verify that role-based access control (RBAC) is configured for service principals and agent identities (user-on-behalf-of versus app identity).


## Information to include when opening a support case

Provide the following details when contacting Microsoft Support:  

- Tenant ID  
- Workspace ID(s)  
- Solution or package name and version  
- Precise UTC timeframe  
- Reproduction steps  
- Sanitized request and response samples  
- Job run IDs  
- Error messages  
- Health query results  
- Roles and permissions involved  

## Support model

> [!IMPORTANT]  
> Independent software vendors should create self-help guides for their solutions. These guides should include common symptoms, checks, solutions, health KQL queries, error codes, and instructions for collecting logs.

**Microsoft Support covers**  
Microsoft Support can assist with:  
- Platform availability and behavior (SIEM and data lake)  
- Onboarding to Microsoft Sentinel  
- Installation of solutions from the Azure Marketplace and Content Hub  

**Independent software vendor (ISV) responsibilities**  
Independent software vendors are responsible for:  
- Custom content such as rules, parsers, and workbooks  
- Code and Model Context Protocol (MCP) tools or agents  
- External dependencies that integrate with Microsoft Sentinel  
- Providing reproducible cases and supporting artifacts to Microsoft Support when issues with ISV content are escalated  


## Troubleshooting common problems

Use the following scenario-based checks and solutions to troubleshoot common issues:

### Data connectors and ingestion not working


|**Checks to perform**  |**Solution**  |
|---------|---------|
| -  Confirm connector prerequisites and permissions. <br>- Validate schema alignment.  <br> - Verify ASIM normalization if applicable.   | - Reapply configuration.  <br> - Correct schema or mapping issues.  <br> - Document any implications for downstream analytics when data is lake-only.  | 



### Analytics rules (SIEM) not firing


|**Checks to perform**  |**Solution**  |
|---------|---------|
|- Confirm data freshness.  <br> - Review rule scheduling and lookback versus latency.  <br>  - Verify that the required parser is installed and enabled. |   - Test the rule with a query.  <br> - Widen the lookback window.  <br> - Reinstall the parser.  <br>- Add a verification workbook.        |



### Jobs and notebooks over the data lake failing


|**Checks to perform**  |**Solution**  |
|---------|---------|
|- Validate explicit workspace and database parameters.  <br> - Review retry and backoff configuration.  <br> - Check job status and terminal states.      |  - Parameterize notebooks.  <br> - Make jobs idempotent.  <br>- Emit structured stage logs.  <br>- Test across multiple workspaces or tenants.       |



### Packaging and publishing issues


|**Checks to perform**  |**Solution**  |
|---------|---------|
|- Confirm manifest fields and versioning.  <br> - Review cross-offer prerequisites (Content Hub versus Security Store).  | - Run local validation.  <br> - Keep directory and filenames stable.  <br> - Document installation, upgrade, and uninstallation flows.  |

### Agentic experiences via Model Context Protocol (MCP) not working in Visual Studio Code

|**Checks to perform**  |**Solution**  |
|---------|---------|
| - Confirm MCP server collections and tool registration.  <br> - Validate endpoint reachability.  <br> - Review token scope and expiry.  <br> - Ensure Visual Studio Code can discover tools.  | - Group tools logically.  <br> - Rotate tokens before they expire.  <br> - Provide example prompts.  <br> - Document known errors with resolutions.  |



## Audit logs

When a solution or package is installed, updated, or deleted, its components are created, updated, or removed as defined in the package configuration. Actions on individual package components are recorded in audit logs.  

For Microsoft Sentinel platform components, see: [Audit log for Microsoft Sentinel data lake](datalake/auditing-lake-activities.md)

For Microsoft Sentinel SIEM components, see: [Audit Microsoft Sentinel queries and activities](audit-sentinel-data.md)


## Related content 

- [Guidance on publishing high quality solutions for Microsoft Sentinel](sentinel-solution-quality-guidance.md)
- [Best practices for partners integrating with Microsoft Sentinel](partner-integrations.md)