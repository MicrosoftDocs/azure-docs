---
title: Azure Migrate application and code assessment for Java
description: Learn how to use the Azure Migrate application and code assessment tool to determine readiness to migrate any type of Java application to Azure.
author: KarlErickson
ms.author: antoniomanug
ms.service: azure
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: overview
ms.date: 07/12/2024
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Azure Migrate application and code assessment for Java

This guide describes how to use the Azure Migrate application and code assessment tool for Java to assess and replatform any type of Java application. The tool enables you to evaluate application readiness for replatforming and migration to Azure. This tool is offered as a CLI (command-line interface) and assesses Java application binaries and source code to identify replatforming and migration opportunities for Azure. It helps you modernize and replatform large-scale Java applications by identifying common use cases and code patterns and proposing recommended changes.

The tool discovers application technology usage through static code analysis, provides effort estimation, and accelerates code replatforming, helping you to prioritize and move Java applications to Azure. With a set of engines and rules, it can discover and assess different technologies such as Java 11, Java 17, Jakarta EE, Spring, Hibernate, Java Message Service (JMS), and more. It then helps you replatform the Java application to different Azure targets (Azure App Service, Azure Kubernetes Service, Azure Container Apps, and Azure Spring Apps) with specific Azure replatforming rules.

This tool is open source and is based on [WindUp](https://github.com/windup), a project created by Red Hat and published under the [Eclipse Public License](https://github.com/windup/windup/blob/master/LICENSE).

## When should I use Azure Migrate application and code assessment?

The tool is designed to help organizations modernize their Java applications in a way that reduces costs and enables faster innovation. The tool uses advanced analysis techniques to understand the structure and dependencies of any Java application, and provides guidance on how to refactor and migrate the applications to Azure.

With it, you can perform the following tasks:

* Discover technology usage: Quickly see which technologies an application uses. Discovery is useful if you have legacy applications with not much documentation and want to know which technologies they use.
* Assess the code to a specific target: Assess an application for a specific Azure target. Check the effort and the modifications you have to do to replatform your applications to Azure.

### Supported targets

The tool contains rules for helping you replatform your applications so you can deploy to, and use, different Azure services.

The rules used by Azure Migrate application and code assessment are grouped based on a *target*. A target is where or how the application runs, and general needs and expectations. When assessing an application, you can choose multiple targets. The following table describes the available targets:

| Target                   | Description                                                            | ID                     |
|--------------------------|------------------------------------------------------------------------|------------------------|
| Azure App Service        | Best practices for deploying an app to Azure App Service.              | `azure-appservice`     |
| Azure Spring Apps        | Best practices for deploying an app to Azure Spring Apps.              | `azure-spring-apps`    |
| Azure Kubernetes Service | Best practices for deploying an app to Azure Kubernetes Service.       | `azure-aks`            |
| Azure Container Apps     | Best practices for deploying an app to Azure Container Apps.           | `azure-container-apps` |
| Cloud Readiness          | General best practices for making an application Cloud (Azure) ready.  | `cloud-readiness`      |
| Discovery                | Identifies technology usage such as libraries and frameworks.          | `discovery`            |
| Linux                    | General best practices for making an application Linux ready.          | `linux`                |
| OpenJDK 11               | General best practices for running a Java 8 application with Java 11.  | `openjdk11`            |
| OpenJDK 17               | General best practices for running a Java 11 application with Java 17. | `openjdk17`            |
| OpenJDK 21               | General best practices for running a Java 17 application with Java 21. | `openjdk21`            |

When the tool assesses for Cloud Readiness and related Azure services, it can also report useful information for potential usage of different Azure services. The following list shows a few of the services covered:

* Azure Databases
* Azure Service Bus
* Azure Storage
* Azure Content Delivery Network
* Azure Event Hubs
* Azure Key Vault
* Azure Front Door

## How to use Azure Migrate application and code assessment for Java

To use the `appcat` CLI, you must download the ZIP file described in the next section, and have a compatible JDK 11 or JDK 17 installation on your computer. The `appcat` CLI runs on any Java-compatible environment such as Windows, Linux, or Mac, both for Intel, Arm, and Apple Silicon hardware. We recommend you use the [Microsoft Build of OpenJDK](/java/openjdk). 

### Download

> [!div class="nextstepaction"]
> [Download Azure Migrate application and code assessment for Java 6.3.0.9](https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-6.3.0.9-preview.zip). Updated on 2024-08-06.

See [release notes](#release-notes) for details.

#### Known issues

Certain rules might not be triggered when parsing specific Lambda expressions. For more information, see [the GitHub issue](https://github.com/konveyor/rulesets/issues/102).

Running `appcat` in a non-unicode environment with complex double-byte characters will cause corruption. For workarounds, see [the GitHub issue](https://github.com/Azure/appcat-rulesets/issues/183).

#### Previous releases

 - [Azure Migrate application and code assessment for Java 6.3.0.8](https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-6.3.0.8-preview.zip). Released on March, 2024.
 - [Azure Migrate application and code assessment for Java 6.3.0.7](https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-6.3.0.7-preview.zip). Released on November, 2023.

### Get started with appcat

Unzip the zip file in a folder of your choice. You then get the following directory structure:

```
appcat-cli-<version>    # APPCAT_HOME
  ├── README.md
  ├── bin
  │   ├── appcat
  │   └── appcat.bat
  ├── docs
  │   └── appcat-guide.html
  └── samples
      ├── airsonic.war
      ├── run-assessment
      ├── run-assessment-custom-rules
      ├── run-assessment-exclude-packages
      ├── run-assessment-no-code-report
      ├── run-assessment-openjdk21
      ├── run-assessment-zip-report
      └── run-discovery
```

* *docs*: This directory contains the documentation of `appcat`.
* *bin*: This directory contains the `appcat` CLI executables (for Windows/Linux/Mac).
* *samples*: This directory contains a sample application and several scripts to run `appcat` against the sample application.

To run the tool, open a terminal session and type the following command from the *$APPCAT_HOME/bin* directory:

```bash
./appcat --help
```

To run the tool from anywhere in your computer, configure the directory *$APPCAT_HOME/bin* into your `PATH` environment variable and then restart your terminal session.

## Documentation

The following guides provide the main documentation for `appcat` for Java:

* [CLI Usage Guide](https://azure.github.io/appcat-docs/cli/)
* [Rules Development Guide](https://azure.github.io/appcat-docs/rules-development-guide/)

## Discover technology usage and Cloud readiness without an Azure service in mind

Discovery of technologies and Cloud readiness targets provide great insight into application replatform and modernization to the Cloud. The tool scans the application and its components to gain a comprehensive understanding of its structure, architecture, and dependencies. It also finds potential issues that might be challenging in a Cloud environment. The `discovery` target in particular is used to create a detailed inventory of the application and its components. This inventory serves as the basis for further analysis and planning. For more information, see the [Discovery report](#discovery-report) section.

Use the following command to initiate discovery and cloud readiness:

```bash
./appcat \
    --input ./<my-application-source-path or my-application-jar-war-ear-file> \
    --target discovery cloud-readiness
```

This type of report is useful when you don't have a specific Azure service in mind to deploy your application to. 

The tool always performs the `discovery` whether or not you include that value in the `--target` parameter.

## Assess a Java application

The *assessment* phase is where the `appcat` CLI analyzes the application and its components to determine its suitability for replatorming and to identify any potential challenges or limitations. This phase involves analyzing the application code and checking its compliance with the selected targets.

You can select multiple targets by using a space-delimited list of values with the `--target` argument.

To check the available targets, run the following command:

```bash
./appcat --listTargetTechnologies
```

This command produces output similar to the following example:

```output
Available target technologies:
    azure-aks
    azure-appservice
    azure-container-apps
    azure-spring-apps
    cloud-readiness
    discovery
    linux
    openjdk11
    openjdk17
    openjdk21
```

Then, you can run `appcat` using one or a combination of available targets, as shown in the following example:

```bash
./appcat \
    --input ./<my-application-source-path or my-application-jar-war-ear-file> \
    --target cloud-readiness linux azure-appservice
```

You can also run `appcat` with one of the available OpenJDK targets, as shown in the following example:

```bash
./appcat \
    --input ./<my-application-source-path or my-application-jar-war-ear-file> \
    --target openjdk11
```

For OpenJDK (Java) targets, we recommend you choose only one at a time.

### Recommendation of targets for Azure assessment

Whenever you assess an application for Azure deployment, we recommend you start with the following targets:

- `discovery`
- `cloud-readiness`

Also, specify an Azure service for deployment, such as `azure-appservice` or `azure-container-apps`.

If you intend to move an application from a Windows environment into a Linux VM or container, we recommend you also add the `linux` target.

If you intend to move an application from an older version of the JDK to a newer version, we recommend that you pick the next major version compared to the previous version in use by the application. For example, use `openjdk11` when your application is currently deployed with Java 8.

## Get results from appcat

The outcome of the discovery and assessment phases is a detailed report that provides a roadmap for the replatforming and modernization of the Java application, including recommendations for the Azure service and replatform approach. The report serves as the foundation for the next stages of the replatforming process. It helps organizations learn about the effort required for such transformation, and make decisions about how to modernize their applications for maximum benefits.

The report generated by `appcat` provides a comprehensive overview of the application and its components. You can use this report to gain insights into the structure and dependencies of the application, and to determine its suitability for replatform and modernization.

The following sections provide more information about the report.

### Summary of the analysis

The landing page of the report lists all the technologies that are used in the application. The dashboard provides a summary of the analysis, including the number of transformation incidents, the incidents categories, or the story points.

:::image type="content" source="media/java/report-summary.png" alt-text="Screenshot of the appcat summary report." lightbox="media/java/report-summary.png":::

When you zoom in on the **Incidents by Category** pie chart, you can see the number of incidents by category: **Mandatory**, **Optional**, **Potential**, and **Information**.

The dashboard also shows the *story points*. The story points are an abstract metric commonly used in Agile software development to estimate the level of effort needed to implement a feature or change. `appcat` uses story points to express the level of effort needed to migrate a particular application. Story points don't necessarily translate to work hours, but the value should be consistent across tasks.

:::image type="content" source="media/java/report-summary-incident.png" alt-text="Screenshot of the AppCAT summary incident report." lightbox="media/java/report-summary-incident.png":::

### Discovery report

The discovery report is a report generated during the *Discovery Phase*. It shows the list of technologies used by the application in the *Information* category. This report is just informing you about technology usage that `appcat` discovered.

:::image type="content" source="media/java/report-discovery.png" alt-text="Screenshot of the appcat discovery report." lightbox="media/java/report-discovery.png":::

### Assessment report

The assessment report gives an overview of the transformation issues that would need to be solved to migrate the application to Azure.

These *Issues*, also called *Incidents*, have a severity (*Mandatory*, *Optional*, *Potential*, or *Information*), a level of effort, and a number indicating the story points. The story points are determined by calculating the number of incidents times the effort required to address the issue.

:::image type="content" source="media/java/report-assessment.png" alt-text="Screenshot of the AppCAT assessment report." lightbox="media/java/report-assessment.png":::

### Detailed information for a specific issue

For each incident, you can get more information (the issue detail, the content of the rule, and so on) just by selecting it. You also get the list of all the files affected by this incident.

:::image type="content" source="media/java/report-assessment-detail.png" alt-text="Screenshot of the AppCAT issue detail report." lightbox="media/java/report-assessment-detail.png":::

Then, for each file or class affected by the incident, you can jump into the source code to highlight the line of code that created the issue.

:::image type="content" source="media/java/report-assessment-code.png" alt-text="Screenshot of the AppCAT issue code report." lightbox="media/java/report-assessment-code.png":::

## Custom rules

You can think of `appcat` as a rule engine. It uses rules to extract files from Java archives, decompiles Java classes, scans and classifies file types, analyzes these files, and builds the reports. In `appcat`, the rules are defined in the form of a ruleset. A ruleset is a collection of individual rules that define specific issues or patterns that `appcat` can detect during the analysis.

These rules are defined in XML and use the following rule pattern:

```
when (condition)
    perform (action)
    otherwise (action)
```

`appcat` provides a comprehensive set of standard migration rules. Because applications might contain custom libraries or components, `appcat` enables you to write your own rules to identify the use of components or software that the existing ruleset might cover.

To write a custom rule, you use a rich domain specific language (DLS) expressed in XML. For example, let's say you want a rule that identifies the use of the PostgreSQL JDBC driver in a Java application and suggests the use of the Azure PostgreSQL Flexible Server instead. You need a rule to find the PostgreSQL JDBC driver defined in a Maven *pom.xml* file or a Gradle file, such as the dependency shown in the following example:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

To detect the use of this dependency, the rule uses the following XML tags:

* `ruleset`: The unique identifier of the ruleset. A ruleset is a collection of rules that are related to a specific technology.
* `targetTechnology`: The technology that the rule targets. In this case, the rule is targeting Azure App Services, Azure Kubernetes Service (AKS), Azure Spring Apps, and Azure Container Apps.
* `rule`: The root element of a single rule.
* `when`: The condition that must be met for the rule to be triggered.
* `perform`: The action to be performed when the rule is triggered.
* `hint`: The message to be displayed in the report, its category (Information, Optional, or Mandatory) and the effort needed to fix the problem, ranging from 1 (easy) to 13 (difficult).

The following XML shows the custom rule definition:

```xml
<ruleset id="azure-postgre-flexible-server"
         xmlns="http://windup.jboss.org/schema/jboss-ruleset"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://windup.jboss.org/schema/jboss-ruleset http://windup.jboss.org/schema/jboss-ruleset/windup-jboss-ruleset.xsd">
    <metadata>
        <description>Recommend Azure PostgreSQL Flexible Server.</description>
        <dependencies>
            <addon id="org.jboss.windup.rules,windup-rules-xml,3.0.0.Final"/>
        </dependencies>
        <targetTechnology id="azure-appservice"/>
        <targetTechnology id="azure-aks"/>
        <targetTechnology id="azure-container-apps"/>
        <targetTechnology id="azure-spring-apps"/>
    </metadata>
    <rules>
        <rule id="azure-postgre-flexible-server">
            <when>
                <project>
                    <artifact groupId="org.postgresql" artifactId="postgresql"/>
                </project>
            </when>
            <perform>
                <hint title="Azure PostgreSQL Flexible Server" category-id="mandatory" effort="7">
                    <message>The application uses PostgreSQL. It is recommended to use Azure PostgreSQL Flexible Server instead.</message>
                    <link title="Azure PostgreSQL Flexible Server documentation" href="https://learn.microsoft.com/azure/postgresql/flexible-server/overview"/>
                </hint>
            </perform>
        </rule>
    </rules>
</ruleset>
```

After executing this rule through `appcat`, rerun the analysis to review the generated report. As with other incidents, the assessment report lists the identified issues and affected files related to this rule.

:::image type="content" source="media/java/rule.png" alt-text="Screenshot of the appcat with a rule being executed." lightbox="media/java/rule.png":::

The complete guide for Rules Development is available at [azure.github.io/appcat-docs/rules-development-guide](https://azure.github.io/appcat-docs/rules-development-guide/).

## Release notes

### 6.3.0.9

This release contains fixes to the known issues previously on 6.3.0.8, and includes a set of new rules. See below for details:

- Resolved an issue with the `localhost-java-00001` rule.
- Introduced new rules for identifying technologies such as AWS S3, AWS SQS, Alibaba Cloud OSS, Alibaba Cloud SMS, Alibaba Scheduler X, Alibaba Cloud Seata, and Alibaba Rocket MQ.
- Updated the `azure-file-system-02000` to now support xml file extensions.
- Upgraded various libraries to address security vulnerabilities.

### 6.3.0.8

Previously, a set of targets were enabled by default, making it difficult for certain customers to assess large applications with too many incidents related to less critical issues. To reduce noise in reports, users must now specify multiple targets, with the parameter `--target`, when executing `appcat`, giving them the option to select only the targets that matter.

### 6.3.0.7

GA (Generally Available) release of Azure Migrate application and code assessment.

## License

Azure Migrate application and code assessment for Java is a free, open source tool at no cost, and licensed under the [same license as the upstream WindUp project](https://github.com/windup/windup/blob/master/LICENSE).

## Frequently asked questions

Q: Where can I download the latest version of Azure Migrate application and code assessment for Java?

You can download `appcat` from [aka.ms/appcat/azure-appcat-cli-latest.zip](https://aka.ms/appcat/azure-appcat-cli-latest.zip).

Q: Where can I find more information about Azure Migrate application and code assessment for Java?

When you download `appcat`, you get a *docs* directory with all the information you need to get started.

Q: Where can I find the specific Azure rules?

All the Azure rules are available in the [appcat Rulesets GitHub repository](https://github.com/azure/appcat-rulesets).

Q: Where can I find more information about creating custom rules?

See the [Rules Development Guide](https://azure.github.io/appcat-docs/rules-development-guide/) for Azure Migrate application and code assessment for Java.

Q: Where can I get some help when creating custom rules?

The best way to get help is to [create an issue on the appcat-rulesets GitHub repository](https://github.com/azure/appcat-rulesets/issues).

## Related content

* [CLI usage guide](https://azure.github.io/appcat-docs/cli/)
* [Rules development guide](https://azure.github.io/appcat-docs/rules-development-guide/)
