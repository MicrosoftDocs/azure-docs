---
title: Rules Development Guide for AppCAT 7
description: Learn how to write and run custom rules for Azure Migrate application and code assessment tool.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.service: azure
ms.custom: devx-track-java
ms.topic: overview
ms.date: 06/27/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Rules development guide for AppCAT 7

This guide is for engineers, consultants, and others who want to create custom YAML-based rules for Azure Migrate application and code assessment for Java version 7 (AppCAT) tools.

For an overview, see [Overview of Azure Migrate Application and Code Assessment for Java](./java.md) and for details, see the [CLI command guide for AppCAT 7](./appcat-7-cli-guide.md).

AppCAT contains rule-based migration tools that analyze the APIs, technologies, and architectures used by the applications you plan to migrate. In fact, the AppCAT analysis process is implemented using AppCAT rules. AppCAT uses rules internally to extract files from archives, decompile files, scan and classify file types, analyze XML and other file content, analyze the application code, and build the reports.

## Get started with rules

The [AppCAT ruleset project](https://github.com/Azure/appcat-konveyor-rulesets) contributes future rules to aid static code analysis. The project also contributes issues shared by subject matter experts to aid the creation of richer rulesets.

The basic rule format is from the upstream [konveyor ruleset](https://github.com/konveyor/analyzer-lsp/blob/main/docs/rules.md). Be sure to review the documentation about rule metadata before you proceed.

### More rule metadata in AppCAT

AppCAT incorporates the rule metadata described in the [konveyor ruleset](https://github.com/konveyor/analyzer-lsp/blob/main/docs/rules.md), but provides more information about rules to make the report more hierarchical, as described in the following list:

- AppCAT adds three domains for rules:
  - Azure readiness: the goal is to migrate application resources to Azure to work seamlessly with Azure resources.
  - Cloud native: the goal is to optimize applications to follow cloud-friendly principles
  - Java modernization: the goal is to optimize applications by adopting supported Java versions and modern APIs while avoiding security risks from deprecated features.
- AppCAT adds a rule category. You can group different rules into a category if necessary - for example, MySQL/PostgreSQL *database found* can both belong to *database-migration*.

The domain/category metadata is written under the `label` properties for custom rules. Only the rules with such labels are shown in the AppCAT report, as shown in the following example:

```yaml
labels:
  - domain=azure-readiness
  - category=database-migration
```

:::image type="content" source="media/guide/appcat-rule-domain.png" alt-text="Screenshot of the appcat rule domain in static report." lightbox="media/guide/appcat-rule-domain.png":::

### Creating a rule

The following rule example identifies whether the MySQL database is found in the project. If the database is found, the rule recommends migrating it to Azure Database for MySQL.

```yaml
- category: potential
  customVariables: []
  description: MySQL database found
  effort: 3
  labels:
  - konveyor.io/target=azure-aks
  - konveyor.io/source
  - domain=azure-readiness
  - category=database-migration
  links:
  - title: Azure Database for MySQL documentation
    url: https://learn.microsoft.com/azure/mysql
  message: |-
    To migrate a Java application that uses a MySQL database to Azure, you can follow these recommendations:

     * Use a managed **Azure Database for MySQL**: For that create a managed MySQL database in Azure and choose the appropriate pricing tier based on your application's requirements for performance, storage, and availability.

     * **Migrate** the existing MySQL database: For that you can use the Azure Database Migration Service (DMS) to perform an online migration with minimal downtime.

     * Update the application's **database connection** details: Modify the Java application's configuration to point to the newly provisioned Azure Database for MySQL. Update the connection string, hostname, port, username, and password information accordingly.

     * Enable **monitoring and diagnostics**: Utilize Azure Monitor to gain insights into the performance and health of your Java application and the underlying MySQL database. Set up metrics, alerts, and log analytics to proactively identify and resolve issues.

     * Implement **security** measures: Apply security best practices to protect your Java application and the MySQL database. This includes implementing authentication and authorization mechanisms with passwordless connections and leveraging Microsoft Defender for Cloud for threat detection and vulnerability assessments.

     * **Backup** your data: Azure Database for MySQL provides automated backups by default. You can configure the retention period for backups based on your requirements. You can also enable geo-redundant backups, if needed, to enhance data durability and availability.
  ruleID: azure-database-mysql-01000
  when:
    and:
    - or:
      - java.dependency:
          lowerbound: 0.0.0
          nameregex: ([a-zA-Z0-9._-]*)mysql([a-zA-Z0-9._-]*)
      - builtin.filecontent:
          filePattern: build\.gradle$
          pattern: mysql
      - builtin.file:
          pattern: ^([a-zA-Z0-9._-]*)mysql-connector([a-zA-Z0-9._-]*)\.jar$
      - builtin.filecontent:
          filePattern: (/|\\)([a-zA-Z0-9._-]+)\.(xml|properties|yaml|yml)$
          pattern: (?i)jdbc:mysql
      - builtin.filecontent:
          filePattern: (/|\\)([a-zA-Z0-9._-]+)\.(xml|properties|yaml|yml)$
          pattern: (?i)r2dbc:mysql
      - builtin.filecontent:
          filePattern: (/|\\)([a-zA-Z0-9._-]+)\.(xml|properties|yaml|yml)$
          pattern: (?i)r2dbc:pool:mysql
    - not: true
      or:
      - builtin.filecontent:
          filePattern: (/|\\)(application|bootstrap)(-[a-zA-Z0-9]+)*?\.(properties|yaml|yml)$
          pattern: ([a-zA-Z0-9-]+)\.mysql\.database\.azure\.com$
      - java.dependency:
          lowerbound: 0.0.0
          nameregex: ([a-zA-Z0-9._-]*)spring-cloud-azure-starter-jdbc-mysql([a-zA-Z0-9._-]*)
```

The issue appears in the AppCAT report as shown in the following screenshot:

:::image type="content" source="media/guide/appcat-rule-metadata.png" alt-text="Screenshot of the My S Q L database found issue in static report." lightbox="media/guide/appcat-rule-metadata.png":::

### Run a rule

When running rules in the AppCAT CLI, you can choose to run the rules only or run the rules with AppCAT default rulesets together, as shown in the following examples:

```bash
# run appcat rules with default ruleset, it means run your rules with appcat provided rules toger
appcat analyze \
    --input <input> \
    --output <output> \
    --target <target> \
    --rules custom-rule1.yaml,custom-rule2.yaml

# only run your own rules
appcat analyze \
    --input <input> \
    --output <output> \
    --target <target> \
    --rules custom-rule1.yaml,custom-rule2.yaml \
    --enable-default-rulesets=false
```
