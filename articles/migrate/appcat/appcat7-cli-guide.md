---
title: CLI Command Guide for AppCAT 7
description: Learn how to run the CLI for Azure Migrate application and code assessment tool.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.service: azure
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: overview
ms.date: 05/28/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# CLI Command Guide for AppCAT 7

The guide describes AppCAT CLI command usage.

## Commands

| name | description |
| --- | --- | 
| [appcat analyze](#appcat-analyze) | This subcommand allows running source code analysis on input source code or a binary. |
| [appcat transform](#appcat-transform) | This subcommand allows converting XML rules to YAML. |
| [appcat version](#appcat-version) | This subcommand print the tool version | 

### appcat analyze
The following is a detailed description of the available "appcat analyze" command line parameters.
#### Required Parameters
| Parameter | Description |
| --- | --- |
| --input |   Path to application source code or a binary file for analysis. Use a comma-separated list for multiple values: `--input <input1>,<input2>,...` (default []) |
| --output |  Directory where the analysis results will be stored. |

#### Optional Parameters
| Category | Parameter | Description |
| --- | --- | --- |
| Source & Target Technologies | | |
| | --list-sources | Display available migration source technologies. |
| | --list-targets | Display available migration target technologies. |
| | --source, -s | Specify source technologies for analysis. Use a comma-separated list for multiple values: `--source <source1>,<source2>,...`, Use the `--list-sources` argument to list all available sources. |
| | --target, -t | Specify target technologies for analysis. Use a comma-separated list for multiple values: `--target <target1>,<target2>,...` , Use the `--list-targets` argument to list all available targets. |
| Analysis Options | | |
| | --analyze-known-libraries | Enable analysis of known open-source libraries (specified in maven.default.index of AppCAT) during analyzing source code. (default false) |
| | --custom-maven-settings | Specify the path to a custom Maven settings file. |
| | --dry-run | Only check if the flags are valid, not running the analysis actually. (default false) |
| | --mode, -m | Set the analysis mode. Must be one of 'full' (source + dependencies, to analyze source code and list dependencies) or 'source-only'. (default full) |
| | --packages | Specify application class packages to be evaluated. Use a comma-separated list for multiple values: `--packages <package1>,<package2>,...` (default []) |
| Rule Options | | |
| | --code-snips-number | Limit the displayed number of incidents with code snippets in a file. 0 means no limit so all incidents with code snippets in a file will be displayed; -1 means no code snippet displayed. (default 0) |
| | --enable-default-rulesets | Enable the execution of default rulesets. (default true, use `--enable-default-rulesets=false` to disable) |
| | --label-selector, -l | Apply rules based on a specified label selector expression. Example: `(konveyor.io/target=azure-aks && konveyor.io/source)` |
| | --rules | Specify rule files or directories. Use a comma-separated list for multiple values: `--rules <rule1>,<rule2>,...` (default []) |
| Proxy Settings | | |
| | --http-proxy | Define an HTTP proxy URL for downloading OSS libraries from maven repository. |
| | --https-proxy | Define an HTTPS proxy URL for downloading OSS libraries from maven repository. |
| | --no-proxy | Specify URLs to exclude from proxy usage when downloading OSS libraries from maven repository. |
| Report & Output Formatting | | |
| | --bulk | Combine results when running multiple `analyze` commands in bulk. (default false) |
| | --context-lines-number | Set the number of source code lines included in the output for each detected incident. (default 100) |
| | --incident-selector | Filter incidents based on a custom variable expression. Example: (!package=io.konveyor.demo.config-utils) |
| | --output-format | Choose output format: 'yaml' or 'json'. (default yaml) |
| | --overwrite | Overwrite the existing output directory. (default false) |
| | --skip-static-report | Skip generating a static analysis report. (default false) |

##### Supported Sources
`--list-sources` paramater shows available source technologies.

| Source name   | Description                                                                    | Source       |
|-------------- |--------------------------------------------------------------------------------|--------------|
| Java          | Best practices for migrating Java applications.                                | `java`       |
| Java EE       | Best practices for migrating Java EE technology.                               | `java-ee`    |
| OpenJDK       | Best practices for migrating applications with OpenJDK.                        | `openjdk`    |
| OpenJDK 8     | Best practices for migrating applications with OpenJDK 8.                      | `openjdk8`   |
| OpenJDK 9     | Best practices for migrating applications with OpenJDK 9.                      | `openjdk9`   |
| OpenJDK 10    | Best practices for migrating applications with OpenJDK 10.                     | `openjdk10`  |
| OpenJDK 11    | Best practices for migrating applications with OpenJDK 11.                     | `openjdk11`  |
| OpenJDK 12    | Best practices for migrating applications with OpenJDK 12.                     | `openjdk12`  |
| OpenJDK 13    | Best practices for migrating applications with OpenJDK 13.                     | `openjdk13`  |
| OpenJDK 14    | Best practices for migrating applications with OpenJDK 14.                     | `openjdk14`  |
| OpenJDK 15    | Best practices for migrating applications with OpenJDK 15.                     | `openjdk15`  |
| OpenJDK 16    | Best practices for migrating applications with OpenJDK 16.                     | `openjdk16`  |
| OpenJDK 17    | Best practices for migrating applications with OpenJDK 17.                     | `openjdk17`  |
| OpenJDK 18    | Best practices for migrating applications with OpenJDK 18.                     | `openjdk18`  |
| OpenJDK 19    | Best practices for migrating applications with OpenJDK 19.                     | `openjdk19`  |
| OpenJDK 20    | Best practices for migrating applications with OpenJDK 20.                     | `openjdk20`  |
| OpenJDK 21    | Best practices for migrating applications with OpenJDK 21.                     | `openjdk21`  |
| Oracle JDK    | Best practices for migrating applications with Oracle JDK.                     | `oraclejdk`  |
| Oracle JDK 7  | Best practices for migrating applications with Oracle JDK 7.                   | `oraclejdk7` |
| RMI           | Best practices for migrating Java applications that use RMI technology.        | `rmi`        |
| RPC           | Best practices for migrating Java applications that use RPC technology.        | `rpc`        |
| Spring 5      | Best practices for migrating applications that use Spring 5 technology.        | `spring5`    |
| Spring Boot   | Best practices for migrating Spring Boot technology.                           | `springboot` |
| EAP           | Best practices for migrating Java applications that use JBoss EAP technology.  | `eap`        |
| EAP 7         | Best practices for migrating Java applications that use JBoss EAP 7 technology.| `eap7`       |


##### Support Targets
`--list-targets` paramater shows available target technologies.

| Target name              | Description                                                            | Target                 |
|--------------------------|------------------------------------------------------------------------|------------------------|
| Azure App Service        | Best practices for deploying an app to Azure App Service.              | `azure-appservice`     |
| Azure Kubernetes Service | Best practices for deploying an app to Azure Kubernetes Service.       | `azure-aks`            |
| Azure Container Apps     | Best practices for deploying an app to Azure Container Apps.           | `azure-container-apps` |
| Cloud Readiness          | General best practices for making an application Cloud (Azure) ready.  | `cloud-readiness`      |
| Linux                    | General best practices for making an application Linux ready.          | `linux`                |
| OpenJDK 11               | General best practices for running a Java 8 application with Java 11.  | `openjdk11`            |
| OpenJDK 17               | General best practices for running a Java 11 application with Java 17. | `openjdk17`            |
| OpenJDK 21               | General best practices for running a Java 17 application with Java 21. | `openjdk21`            |

##### Configure Ignore Files
In AppCAT CLI install path, you can configure the `.appcat-ignore` file to exclude specified folders or paths when running `appcat analyze` command.

#### Global Parameters
| Parameter | Description |
| --- | --- |
| --disable-telemetry | Disable telemetry |
| --log-level | Set the log level. (default 4) |
| --no-cleanup | Prevent cleanup of temporary resources after execution. |

#### Examples
- Analyze a source code directory:
```
appcat analyze --input /path/to/source --output /path/to/output
```

- Analyze a source code directory with specific source and target technologies:
```
appcat analyze --input /path/to/source --output /path/to/output --source springboot --target azure-aks,azure-appservice,azure-container-apps
```

- Analyze a source code directory with additional custom rules:
```
appcat analyze --input /path/to/source --output /path/to/output --rules /path/to/rules
```

- Analyze a source code directory using only custom rules (without default rulesets):
```
appcat analyze --input /path/to/source --output /path/to/output --enable-default-rulesets=false --rules /path/to/rules
```

- Analyze and add more application analysis to an existing output directory and static report. 
```
appcat analyze --input=<path-to-source-A>,<path-to-source-B>,<path-to-source-C> --output=<path-to-output-ABC> --target=<target-name>
appcat analyze --bulk --input=<path-to-source-D> --output=<path-to-output-ABC> --target=<target-name>
appcat analyze --bulk --input=<path-to-source-E> --output=<path-to-output-ABC> --target=<target-name>
```

- Analyze a source code directory and keep the detect context lines with custom line number
```
appcat analyze --input /path/to/source --output /path/to/output --context-lines-number <line-number>
``` 

here is a `--context-lines-number 3` example
:::image type="content" source="media/java/appcat-7-cli-command-with-context-line-number.png" alt-text="Screenshot of the appcat report issue code snip difference with --context-lines-number paramter." lightbox="media/java/appcat-7-cli-command-with-context-line-number.png":::


### appcat transform
Convert Windup XML rules to YAML
#### Required Parameters
| Parameter | Description |
| --- | --- |
| --rules |   Convert XML rules to YAML |

#### Global Parameters
| Parameter | Description |
| --- | --- |
| --disable-telemetry | Disable telemetry |
| --log-level | Set the log level. (default 4) |
| --no-cleanup | Prevent cleanup of temporary resources after execution. |

#### Examples
- Convert a windup XML rule to YAML
```
appcat transform rules --input /path/to/rule --output /path/to/outputfolder
```

### appcat version
Print the tool version

#### Example
```
appcat version
```
