---
title: Discover servers and workloads by importing inventory exports (preview)
description: Learn how to use file import in Azure Catalyst to upload inventory exports from your CMDB, ServiceNow, Dynatrace, Ansible, or other tools, review and correct the AI-generated proposal, and save it to your project inventory.
ms.service: azure-migrate
ms.topic: how-to
ms.date: 11/10/2026
author: anjalimishra
---

# Discover servers and workloads by importing inventory exports (preview)

This article explains how to discover servers, databases, and web apps in Azure Catalyst by using **file import**. If you already have inventory exports from a configuration management database (CMDB) or tools such as ServiceNow, Dynatrace, or Ansible, upload these files in their original structure.

Azure Catalyst uses AI to analyze your files and generate a proposed inventory that maps your source data to the Azure Catalyst inventory schema. You can upload each file in its original format, without reformatting it to fit a template. Before saving anything to your project, review the proposal, correct values or mapping logic if needed, and then save it to inventory.

After you save the inventory, you can use it to build business cases, create assessments, and plan migration waves, in the same way as inventory discovered by other methods.

> [!IMPORTANT]
> AI-powered import of inventory exports is in preview. Feature availability, supported inputs, and portal labels are subject to change.

## When to use this method

Use file import with inventory exports when:

- Your organization prefers discovery without installing tools or running automated scans, for data sovereignty, regulatory, or security reasons.
- You want to discover your estate without sharing credentials to on-premises servers.
- Your inventory already exists in a CMDB or in tools such as ServiceNow, Dynatrace, or Ansible.
- You want a quick first inventory to start a business case before you decide on a deployed discovery method.

> [!NOTE]
> If you need continuous discovery, performance history, installed software, or detailed database configuration, use the [Azure Catalyst appliance](tutorial-discover-vmware.md) or the [Azure Catalyst Collector](how-to-discover-using-collector.md). You can add either method to the same project later.

## How it differs from CSV template and RVTools import

File import offers more than one import type. The following table compares importing inventory exports with the fixed-format options.

| Capability | CSV template or RVTools import | Inventory exports from ServiceNow, Dynatrace, Ansible, and other tools |
| --- | --- | --- |
| Input | Follows the Azure Catalyst CSV template or an RVTools XLSX export | Exports from your tools, in their own structure |
| Preparation | Reformat data manually to fit the template | Upload exports as they are, with an optional context file |
| Mapping | Fixed columns | AI maps source columns and values to the Azure Catalyst inventory schema |
| Workload scope | Servers | Servers, databases, and web apps, where the source data contains them |
| Multiple sources | One file per import | Multiple exports interpreted together in one upload |
| Review before saving | Data is imported as provided | Review, refine, and confirm the proposal with Copilot, or edit the downloadable review files |

## Prerequisites

| Requirement | Details |
| --- | --- |
| Azure Catalyst project | Create a new Azure Catalyst project, or use an existing one. |
| Azure permissions | An Azure account with permissions to create or update an Azure Catalyst project. For details, see [Azure Migrate built-in roles](prepare-azure-accounts.md). |
| Inventory exports | One or more source files that represent the workloads you want to import, in a [supported format](#supported-file-inputs). |
| Editing tools | A spreadsheet editor or text editor, if you plan to correct the downloadable review files. |
| Data processing approval | Your organization must allow the exported inventory data to be processed by AI in Azure Catalyst. |

Copilot is optional. You can complete the entire import and review flow with or without Copilot.

## Supported file inputs

| Input | Formats | Purpose |
| --- | --- | --- |
| Inventory exports | .csv, .xlsx, .json | Provide the workload records to import. |
| Context file (optional) | .md, .txt, .pdf, .docx | Explain custom columns, units, match rules, and exceptions. |
| ZIP file (optional) | .zip | Bundle multiple files into one upload. Individual files are also supported. |

Each upload can be up to 500 MB.

## Prepare your files

1. Export inventory data from your source tools by using their standard export options. For example:
    - A CMDB export for identity and operating system details.
    - A ServiceNow, Dynatrace, or Ansible export for compute and storage properties.
    - A database export for engine and host relationships.
1. Keep only the data needed for migration planning, and remove passwords, keys, and other sensitive information.
1. Optionally, create a context file that explains your data. For details, see the next section.

> [!TIP]
> Upload all the exports you want Azure Catalyst to interpret together in the same upload. Azure Catalyst links and merges records from different files when they refer to the same host. If your files identify hosts in different ways, describe how they match in a context file.

### Add a context file (optional)

A context file helps AI understand your data better when your files use custom headers, mixed units, or identifiers that span files. In the context file, describe:

- What nonstandard columns mean.
- The units used in numeric fields.
- How records in different files refer to the same host.
- Which source takes precedence when values conflict.
- Which records to exclude, such as decommissioned or out-of-scope servers.

Example:

```text
The ResourceName column in the CMDB export is the server hostname.
Match ResourceName to HostName in the infrastructure export.
The RAM_GB column contains MB values despite its name.
Use CMDB as the source of truth for operating system values.
Exclude rows where Status is Decommissioned.
Ignore the Notes column.
```

Include the context file in your first upload, along with your exports. After the analysis, make any further corrections by editing the review files or by using Copilot, as described in [Step 2](#step-2-review-and-correct-your-proposal).

## Step 1: Add your files

1. Sign in to the [Azure portal](https://portal.azure.com) and open your Azure Catalyst project.
1. On **Overview**, in the **Inventory** card, select **Start discovery** > **Using file import**.
1. In the file import type dropdown, select **Inventory exports from ServiceNow, Dynatrace, Ansible, etc.**
1. In **Add your files**, select **Browse**, choose your export files and optional context file, or a ZIP file that contains them, and then select **Upload**.
1. Wait while Azure Catalyst analyzes the files and generates the proposed inventory. When the analysis finishes, the proposal appears in **Review and correct your proposal**.

If you start from Copilot in Azure Catalyst, ask Copilot to import inventory files. Copilot opens the same import experience, and you continue with the same steps.

> [!NOTE]
> Uploading files creates a proposal that you can review and refine. The inventory is added to your project only when you select **Save to inventory** in Step 3.

To start over with a different set of files at any point before you save, select **Retry with new files**. Azure Catalyst clears the current proposal and analyzes the new files.

## Step 2: Review and correct your proposal

In **Review and correct your proposal**, check the summary of the analysis:

- The number of files analyzed and rows generated.
- The workload categories that were identified.
- How duplicate records were merged.
- Missing values, such as an operating system or memory size that wasn't in your source data.
- Ambiguous mappings, where a source column or value could match more than one inventory field.
- Unlinked workloads, which are databases or web apps that couldn't be matched to a host server.
- Assumptions about units and which source takes precedence.

Pay particular attention to values that affect sizing and cost, such as CPU, memory, and storage, and to operating system values. Also check for records that should be out of scope. To exclude them, edit the review files or ask Copilot, as described in the following options.

### Understand row types

Each row in the proposal is a workload record.

| Category | Represents | What to verify |
| --- | --- | --- |
| Server | A Windows or Linux server | Identity, operating system, CPU, memory, and storage |
| Database | A SQL Server, MySQL, PostgreSQL, or similar database workload | Engine details and host relationship |
| Web app | An IIS, Tomcat, or similar web workload | Runtime details and host relationship |

For each database or web app, check the adjacent **Server** column to verify which server hosts the workload.

### Choose how to review

If the proposal needs changes, use one of the following options. If the proposal already looks right, go straight to [Step 3: Save to inventory](#step-3-save-to-inventory).

#### Option A: Download and edit the review files

1. Select **Download** to download `azure-migrate-review.zip`.
1. Extract the package. It contains:
    - `AllInventory-<timestamp>.csv`: the proposed inventory, with one row per workload record. The file name includes the date and time of the analysis, for example `AllInventory-2026-10-30T10_57_20.411Z.csv`.
    - `import-logic.txt`: the mapping and conversion rules used to generate the proposal.
1. Correct values or mapping rules:

    | Edit | When to use it | How |
    | --- | --- | --- |
    | Change the mapping logic | To fix a rule that affects many rows, such as a unit conversion, a matching rule, or how an operating system value is interpreted | Edit the rule in `import-logic.txt`. The change applies to every matching row. |
    | Edit values directly | To fix an individual record | Edit the value in the `AllInventory-<timestamp>.csv` file. |

1. In **Add your files**, upload the two edited review files, either individually or in a ZIP file. Azure Catalyst regenerates the proposal based on your corrections.

When the proposal is regenerated, rule changes are applied consistently across the inventory, values you edited directly in the CSV are kept, and rows that were already correct stay unchanged. You can repeat this download, edit, and upload cycle until the proposal meets your planning needs.

#### Option B: Review with Copilot

1. Select **Review with Copilot**.
1. In the Copilot pane, go through the flagged items and the assumptions made during analysis. You can ask Copilot questions about the proposal, such as how a column was mapped or why a record was flagged.
1. If something needs to change, tell Copilot. You can refine individual values or update the mapping logic, for example a unit conversion or how an operating system value is interpreted.
1. Review the changes Copilot proposes, and confirm them in the Copilot pane.

Changes you confirm in Copilot are applied to the proposal and carried into your inventory when you save.

## Step 3: Save to inventory

Before you save, make sure the proposal is final. After you save, the imported metadata can't be changed.

1. Review the latest proposal and its review summary.
1. Select **Save to inventory**. Azure Catalyst saves the proposed inventory exactly as shown in the review summary, including any changes you made in Step 2.
1. Wait for validation and record creation to finish.
1. Open **All inventory** and check that the server, database, and web app counts match the review summary.

## Import more inventory

You can import more data into the same project after you save. For example, import server data first, and then import database data later.

Repeat Steps 1 to 3 with the additional files. Each import that you save adds to the project inventory. It doesn't replace earlier imports.

## Troubleshoot common issues

| Issue | Recommended action |
| --- | --- |
| Unsupported file type | Export the data in a supported format, and then upload it again. |
| Upload is larger than 500 MB | Split the data across smaller uploads, or remove columns and rows that you don't need for migration planning. |
| The ZIP file can't be read | Re-create the ZIP file and upload it again, or upload the files individually. |
| Incorrect numeric values | Fix the conversion rule in `import-logic.txt` to correct all affected rows, or fix individual values in the `AllInventory-<timestamp>.csv` file. You can also ask Copilot to correct them. |
| Unexpected duplicate merges | Refine the matching rules in `import-logic.txt`, or correct the affected records in the `AllInventory-<timestamp>.csv` file. You can also ask Copilot to adjust the matching. |
| Unknown operating system values | Enter verified values in the `AllInventory-<timestamp>.csv` file, update how operating system values are interpreted in `import-logic.txt`, or ask Copilot. You can also keep **Unknown** if that's acceptable for planning. |
| Databases or web apps are missing host links | Fix the values in the **Server** column in the `AllInventory-<timestamp>.csv` file, update the matching rules in `import-logic.txt`, or ask Copilot. To start over with corrected source files instead, select **Retry with new files**. |
| Validation reports errors when you save | Resolve the reported errors, and then select **Save to inventory** again. |
| Copilot is unavailable | Download the review files, make your corrections in `AllInventory-<timestamp>.csv` and `import-logic.txt`, and upload them again. |

## Things to know

- Each upload can be up to 500 MB.
- Imported data is a point-in-time snapshot. To bring in the latest data, export it again and import it.
- The inventory reflects the data in your exports, so richer source data gives you a more complete inventory. Fields that your exports don't include are flagged in the proposal so that you can fill them in.
- Imported metadata can't be changed after you save it to inventory, so complete your review before you save.
- Additional imports are added to the project inventory and don't replace earlier imports.

## Next steps

- [Review the discovered inventory](how-to-review-discovered-inventory.md)
- [Build a business case](how-to-build-a-business-case.md)
- [Create an assessment](how-to-create-assessment.md)
- [Compare discovery approaches](discovery-methods-modes.md)
