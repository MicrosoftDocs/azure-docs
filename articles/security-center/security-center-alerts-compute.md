---
title: Native computer alerts in Azure Security Center | Microsoft Docs
description: Azure policy definitions monitored in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''

ms.assetid: 
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 6/25/2019
ms.author: monhaber

---
# Azure native compute alerts in Azure Security Center

This topic presents the alerts available for your Azure services:
* [Azure App Service](#app-services)
* [Containers](#azure-containers) 

## Azure App Service <a name="app-services"></a>

Security Center leverages the scale of the cloud to identify attacks targeting customers applications running over Azure App Service. With web applications being practically in any modern network attackers probe to find these and exploit weaknesses. Before being routed to specific environments, requests to applications running in Azure go through several gateways when they are inspected and logged. This data is then used to identify exploits, attackers, and to learn new patterns that will be used later.

By leveraging the visibility that Azure has as a cloud provider, Security Center analyzes App Service internal logs to identify attack methodology on multiple targets. For example, widespread scanning and distributed attacks. This type of attack typically comes from a small subset of IPs and exhibits patterns of crawling to similar endpoints on multiple hosts, searching for a vulnerable page or plugin. This can be detected using the Cloud but cannot be identified from a standpoint of a single host.

Security Center also has access to the underlying sandboxes and VMs. Together with memory forensics, the infrastructure can tell the story, from a new attack circulating in the wild to compromises in customer machines. Therefore, Security Center can detect attacks against web applications long after being exploited.

Please find alert list below:

|Alert|Description|
|---|---|
|**Suspicious WordPress theme invocation detected**|The Azure App Service activity log indicates a possible code injection activity on your App Service resource. The suspicious activity detected resembles that of a manipulation of WordPress theme to support server-side execution of code, followed by a direct web request to invoke the manipulated theme file. This type of activity was seen in the past as part of an attack campaign over WordPress.|
|**Connection to web page from anomalous IP address detected**|The Azure App Service activity log indicates a connection to a sensitive web page from a source address that never connect to it before. This might indicate that someone is attempting a brute force attack into your web app administration pages. It might also be the result of a new IP address being used by a legitimate user.|
|**An IP that connected to your Azure App Service FTP Interface was found in Threat Intelligence**|Analysis of Azure App Service FTP logs detected a connection from a source address that was found in Threat Intelligence feed. During this connection, a user accessed the provided below pages.|
|**Web fingerprinting detected**|Azure App Service activity log indicates a possible web fingerprinting activity on your App Service resource. The suspicious activity detected is associated with a tool called Blind Elephant. The tool fingerprint web servers and tries to detect the installed applications and version. Attackers often use this tool for probing the web application to find vulnerabilities.|
|**Suspicious access to possibly vulnerable web page detected**|The Azure App Service activity log indicates that a web page that seems to be sensitive was accessed. This suspicious activity originated from a source address whose access pattern resembles that of a web scanner. This kind of activity is often associated with an attempt by an attacker to scan your network to try and gain access to sensitive or vulnerable web pages.|
|**PHP file in upload folder**|The Azure App Service activity log indicates an access to a suspicious PHP page located in the upload folder. This type of folder does not usually contain PHP files. The existence of this type of file might indicate an exploitation taking advantage of arbitrary file upload vulnerabilities.|
|**An attempt to run Linux commands on a Windows App Service**|Analysis of App Service processes detected an attempt to run a Linux command on a Windows App Service. This action was running by the web application. This behavior is often seen during campaigns that exploits a vulnerability in a common web application.|
|**Suspicious PHP execution detected**|Machine logs indicate a that a suspicious PHP process is running. The action included an attempt to run OS commands or PHP code from the command line using the PHP process. While this behavior can be legitimate, in web applications this behavior is also observed in malicious activities such as attempts to infect websites with web shells.|
|**Process execution from temporary folder**|Analysis of App Service processes detected an execution of a process from the app's temporary folder. While this behavior can be legitimate, in web applications this behavior is also observed in malicious activities.|
|**Attempt to run high privilege command detected**|Analysis of App Service processes detected an attempt to run a command that requires high privileges. The command ran in the web application context. While this behavior can be legitimate, in web applications this behavior is also observed in malicious activities.|

> [!NOTE]
> Security Center Threat Detection offering for App Service is currently not available in Azure government and sovereign cloud regions.

For more information about App Service threat detection alerts visit Protect App Service with Azure Security Center, and review how to enable monitoring and protection of your App Service workloads.

## Containers <a name="azure-containers"></a>

Security Center provides real time threat detection for your containers on Linux machines based on auditd framework. The alerts identify several suspicious Docker activities, such as the creation of a privileged container on host, an indication of Secure Shell (SSH) server running inside a Docker container, or the use of crypto miners. 
You can use this information to quickly remediate security issues and improve the security of your containers. Besides Linux detections, Security Center also offers analytics that are more specific for Container’s deployment.
