---
title: Self-hosted integration runtime diagnostic tool
description: Diagnostic tool for self-hosted integration runtime
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.topic: conceptual
ms.custom: [seo-lt-2019, references_regions, devx-track-azurepowershell]
ms.date: 07/28/2021
---

# Diagnostic Tool for self-hosted integration runtime
The self-hosted integration runtime is the compute infrastructure that Azure Data Factory uses to provide data-integration capabilities across different network environments. The installation of a self-hosted integration runtime needs an on-premises machine or a virtual machine inside a private network. Sometimes, it is hard to investigate issues in on-premises machines, like network, firewall, dependency, or OS relative issues. So we introduce a new attached diagnostic tool to troubleshoot problems in on-premises environments.

The tool will run series of test scenarios on the self-hosted integration runtime machine. Every scenario has many typical health check cases, which contain the common issues that users always meet. Customer can trigger “troubleshoot problems” when they meet the problems. The tool will collect the customer environment information and executes every health check cases. 

## Get started 
There are two ways to run this diagnostic tool to detect potential issues:

1. When you install self-hosted integration runtime in on-premises machine and follow the steps on the config manager. you can click **Troubleshoot Problems** when you meet any issues. Or you can also click this button on **Diagnostics** tab at any time when you meet issues after installation.

:::image type="content" source="./media/self-hosted-integration-runtime-diagnostic-tool/troubleshoot-ui.png" alt-text="Troubleshoot-UI":::
   

2. You can also run command line to start this diagnostics tool.

   dmgcmd.exe -ts [AUTH_KEY]

## Diagnostic result
The execution result and detail log messages will be generated as a HTML report. You can review the error and get the suggested mitigation methods or public documents URL from the report.

:::image type="content" source="./media/self-hosted-integration-runtime-diagnostic-tool/diagnostic-process.png" alt-text="Diagnostic-process":::

:::image type="content" source="./media/self-hosted-integration-runtime-diagnostic-tool/diagnostic-report.png" alt-text="Diagnostic-report":::

## Next steps

- Review [integration runtime concepts in Azure Data Factory](./concepts-integration-runtime.md).

- Learn how to [create a self-hosted integration runtime in the Azure portal](./create-self-hosted-integration-runtime.md).