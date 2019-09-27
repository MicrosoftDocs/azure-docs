---
title: Threat detection for cloud native compute in Azure Security Center | Microsoft Docs
description: This topic presents the cloud native compute alerts available in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 5aa5efcf-9f6f-4aa1-9f72-d651c6a7c9cd
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 7/02/2019
ms.author: memildin
---
# Threat detection for cloud native compute in Azure Security Center

As a cloud provider, Azure Security Center uses the unique visibility it has to analyze internal logs and identify attack methodology on multiple targets. This topic presents the alerts available for the following Azure services:

* [Azure App Service](#app-services)
* [Azure Container Service](#azure-containers) 

## Azure App Service <a name="app-services"></a>

Security Center uses the scale of the cloud to identify attacks targeting applications running over App Service. Web applications are common in modern networks, and attackers probe to find these and exploit weaknesses. Before being routed to specific environments, requests to applications running in Azure go through several gateways, where they are inspected and logged. This data is then used to identify exploits and attackers, and to learn new patterns that will be used later.

By using the visibility that Azure has as a cloud provider, Security Center analyzes App Service internal logs to identify attack methodology on multiple targets. For example, methodology includes widespread scanning and distributed attacks. This type of attack typically comes from a small subset of IPs, and exhibits patterns of crawling to similar endpoints on multiple hosts. The attacks are searching for a vulnerable page or plugin, and can't be identified from the standpoint of a single host.

Security Center also has access to the underlying sandboxes and VMs. Together with memory forensics, the infrastructure can tell the story, from a new attack circulating in the wild to compromises in customer machines. Therefore, Security Center can detect attacks against web applications long after being exploited.

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Suspicious WordPress theme invocation detected**|The App Service activity log indicates a possible code injection activity on your App Service resource.<br/> This suspicious activity resembles activity that manipulates a WordPress theme to support server-side execution of code, followed by a direct web request to invoke the manipulated theme file. This type of activity can be part of an attack campaign over WordPress.|
|**Connection to web page from anomalous IP address detected**|The App Service activity log indicates a connection to a sensitive web page from a source address that never connected to it before. This might indicate that someone is attempting a brute force attack into your web app administration pages. It might also be the result of a legitimate user using a new IP address.|
|**An IP that connected to your Azure App Service FTP Interface was found in Threat Intelligence**|App Service FTP logs analysis has detected a connection from a source address that was found in the threat intelligence feed. During this connection, a user accessed the pages listed.|
|**Web fingerprinting detected**|The App Service activity log indicates a possible web fingerprinting activity on your App Service resource. <br/>This suspicious activity is associated with a tool called Blind Elephant. The tool fingerprints web servers and tries to detect the installed applications and their versions. Attackers often use this tool for probing the web applications to find vulnerabilities.|
|**Suspicious access to possibly vulnerable web page detected**|The App Service activity log indicates that a web page that seems to be sensitive was accessed. <br/>This suspicious activity originated from a source address whose access pattern resembles that of a web scanner. This kind of activity is often associated with an attempt by an attacker to scan your network to try and gain access to sensitive or vulnerable web pages.|
|**PHP file in upload folder**|The App Service activity log indicates something has accessed a suspicious PHP page located in the upload folder. <br/>This type of folder doesn't usually contain PHP files. The existence of this type of file might indicate an exploitation taking advantage of arbitrary file upload vulnerabilities.|
|**An attempt to run Linux commands on a Windows App Service**|Analysis of App Service processes detected an attempt to run a Linux command on a Windows App Service. This action was running by the web application. This behavior is often seen during campaigns that exploit a vulnerability in a common web application.|
|**Suspicious PHP execution detected**|Machine logs indicate that a suspicious PHP process is running. The action included an attempt to run operating system commands or PHP code from the command line, by using the PHP process. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities, such as attempts to infect websites with web shells.|
|**Process execution from temporary folder**|App Service processes analysis has detected an execution of a process from the app's temporary folder. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities.|
|**Attempt to run high privilege command detected**|Analysis of App Service processes has detected an attempt to run a command that requires high privileges. The command ran in the web application context. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities.|

> [!NOTE]
> Security Center Threat Detection for App Service is currently not available in Azure government and sovereign cloud regions.

## Azure Container Service <a name="azure-containers"></a>

Security Center provides real-time threat detection for your containers on Linux machines based on the auditd framework. The alerts identify several suspicious Docker activities, such as the creation of a privileged container on a host, an indication of a Secure Shell (SSH) server running inside a Docker container, or the use of crypto miners. 

You can use this information to quickly remediate security issues and improve the security of your containers. Besides Linux detections, Security Center also offers analytics that are more specific for containers deployments.
