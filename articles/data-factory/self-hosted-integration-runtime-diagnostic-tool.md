---
title: Self-hosted integration runtime diagnostic tool
description: Diagnostic tool for self-hosted integration runtime
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions
ms.date: 07/20/2023
---

# Diagnostic tool for self-hosted integration runtime
The self-hosted integration runtime is the compute infrastructure that Azure Data Factory uses to provide data-integration capabilities across different network environments. The installation of a self-hosted integration runtime needs an on-premises machine or a virtual machine inside a private network. Sometimes, it's hard to investigate issues in on-premises machines, such as network, firewall, dependency, or OS-related issues. This article describes a new diagnostic tool to troubleshoot problems in on-premises environments.

The tool runs a series of test scenarios on the self-hosted integration runtime machine. Every scenario has typical health check cases for common issues. Customers can trigger the "troubleshoot problems" feature if they encounter issues. The tool collects the customer environment information and executes the health check cases. 

## Get started 
There are two ways to run the diagnostic tool to detect possible issues:

- When you install a self-hosted integration runtime in an on-premises machine, you can access the troubleshooting feature from the Configuration Manager. If you encounter issues, select **Troubleshoot Problems** to run the diagnostic tool. You can also select this same option on the **Diagnostics** tab after installation.

   :::image type="content" source="./media/self-hosted-integration-runtime-diagnostic-tool/troubleshoot-ui.png" alt-text="Screenshot that shows how to troubleshoot problems by using the Runtime Configuration Manager.":::
   
- You can also start the diagnostic tool from the command line:

   ```console
   dmgcmd.exe -ts [AUTH_KEY]
   ```

## Diagnostic result
The execution result and detail log messages are generated as a HTML report. You can review the error and get the suggested mitigation methods or public documents URL from the report.

:::image type="content" source="./media/self-hosted-integration-runtime-diagnostic-tool/diagnostic-process.png" alt-text="Screenshot that shows the diagnostic process.":::

:::image type="content" source="./media/self-hosted-integration-runtime-diagnostic-tool/diagnostic-report.png" alt-text="Screenshot that shows the diagnostic result report.":::

## Next steps

- Review [integration runtime concepts in Azure Data Factory](./concepts-integration-runtime.md).

- Learn how to [create a self-hosted integration runtime in the Azure portal](./create-self-hosted-integration-runtime.md).
