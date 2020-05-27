---
title:  Java and Base OS for Spring Microservice Apps
description: Principles for maintaining healthy Java and base operating system for Spring microservice apps
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 05/27/2020
---

# Java and Base OS for Spring Microservice Apps
The following are principles for maintaining healthy Java and base operating system for Spring microservice apps.
## Principles for healthy Java and Base OS
1. Shall be the same base operating system across tiers - Basic | Standard | Premium.
* Currently, apps on Azure Spring Cloud use a mix of Debian 10 and Ubuntu 18.04.
* VMware build service uses Ubuntu 18.04.
2.	Shall be the same base operating system regardless of deployment starting points - source | JAR
* Currently, apps on Azure Spring Cloud use a mix of Debian 10 and Ubuntu 18.04.
3.	Base operating system shall be free of security vulnerabilities.
* Debian 10 base operating system has 147 open CVEs.
* Ubuntu 18.04 base operating system has 132 open CVEs.
4. Shall use JRE-headless.
* Currently, apps on Azure Spring Cloud use JDK. JRE-headless is a smaller image.
5.	Shall use the most recent builds of Java.
* Currently, apps on Azure Spring Cloud use Java 8 build 242. This is an outdated build.
 
Azul Systems will continuously scan for changes to base operating systems and keep the last built images up to date. Azure Spring Cloud looks for changes to images and continuously updates them across deployments.
 
## FAQ for Azure Spring Cloud

1.	Which versions of Java are supported? Major version and build number.
* Support LTS versions - Java 8 and 11.
* Uses the most recent build - for example, right now, Java 8 build 252 and Java 11 build 7.
2.	Who built these Java runtimes?
* Azul Systems.
3.	What is the base operating system for images?
* Ubuntu 20.04 LTS (Focal Fossa). Apps will continue to stay on the most recent LTS version of Ubuntu.
* See http://releases.ubuntu.com/focal/
4.	How often will you update the runtimes?
* Quarterly - to absorb quarterly updates to Java.
* Out of band - to absorb security fixes to base operating systems and Java.
5.	How often will you update security patches? 
* CVE scores < 9 - will update within 24 hours.
* CVE scores >= 9 - will update within hours.
6.	How long will you support Java 8 and 11 LTS versions?
* Java 8 LTS until March 2025.
* Java 11 LTS until September 2026.
* See https://docs.microsoft.com/en-us/azure/developer/java/fundamentals/java-jdk-long-term-support
7.	How can I download a supported Java runtime for local dev? 
* See https://docs.microsoft.com/en-us/azure/developer/java/fundamentals/java-jdk-install
8.	What is your policy for retiring older runtimes? How can developers address their grievances if they are NOT ready to part ways with older runtimes?
* We will provide 12 months notice prior to retiring older runtimes.
9.	How can I get support for issues at the Java runtime level?
* Open a support ticket with Azure Support.
 
## Default deployment on Azure Spring Cloud

    ![Default deployment](media/spring-cloud-principles/spring-cloud-default-deployment.png)
 
Next steps
* [Java long-term support for Azure and Azure Stack](https://docs.microsoft.com/en-us/azure/developer/java/fundamentals/java-jdk-long-term-support)

