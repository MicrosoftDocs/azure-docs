---
title: Threat detection for cloud native computing in Azure Security Center | Microsoft Docs
description: This article presents the cloud native compute alerts available in Azure Security Center.
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
ms.date: 11/05/2019
ms.author: memildin
---
# Threat detection for cloud native computing in Azure Security Center

As a native solution, Azure Security Center has unique visibility into internal logs for attack methodology identification across multiple targets. This article presents the alerts available for the following Azure services:

* [Azure App Service](#app-services)
* [Azure Containers](#azure-containers) 

> [!NOTE]
> These services are not currently available in Azure government and sovereign cloud regions.

## Azure App Service <a name="app-services"></a>

Security Center uses the scale of the cloud to identify attacks targeting applications running over App Service. Attackers probe web applications to find and exploit weaknesses. Before being routed to specific environments, requests to applications running in Azure go through several gateways, where they're inspected and logged. This data is then used to identify exploits and attackers, and to learn new patterns that will be used later.

By using the visibility that Azure has as a cloud provider, Security Center analyzes App Service internal logs to identify attack methodology on multiple targets. For example, methodology includes widespread scanning and distributed attacks. This type of attack typically comes from a small subset of IPs, and shows patterns of crawling to similar endpoints on multiple hosts. The attacks are searching for a vulnerable page or plugin, and can't be identified from the standpoint of a single host.

Security Center also has access to the underlying sandboxes and VMs. Together with memory forensics, the infrastructure can tell the story, from a new attack circulating in the wild to compromises in customer machines. Therefore, even if Security Center is deployed after a web app has been exploited, it may be able to detect ongoing attacks.

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Suspicious WordPress theme invocation detected**|The App Service activity log indicates a possible code injection activity on your App Service resource.<br/> This suspicious activity resembles activity that manipulates a WordPress theme to support server-side execution of code, followed by a direct web request to invoke the manipulated theme file. This type of activity can be part of an attack campaign over WordPress.|
|**Connection to web page from anomalous IP address detected**|The App Service activity log indicates a connection to a sensitive web page from a source address that never connected to it before. This connection might indicate that someone is attempting a brute force attack into your web app administration pages. It might also be the result of a legitimate user using a new IP address.|
|**An IP that connected to your Azure App Service FTP Interface was found in Threat Intelligence**|App Service FTP logs analysis has detected a connection from a source address that was found in the threat intelligence feed. During this connection, a user accessed the pages listed.|
|**Web fingerprinting detected**|The App Service activity log indicates a possible web fingerprinting activity on your App Service resource. <br/>This suspicious activity is associated with a tool called Blind Elephant. The tool fingerprints web servers and tries to detect the installed applications and their versions. Attackers often use this tool for probing the web applications to find vulnerabilities.|
|**Suspicious access to possibly vulnerable web page detected**|The App Service activity log indicates that a web page that seems to be sensitive was accessed. <br/>This suspicious activity originated from a source address whose access pattern resembles that of a web scanner. This kind of activity is often associated with an attempt by an attacker to scan your network to try to gain access to sensitive or vulnerable web pages.|
|**PHP file in upload folder**|The App Service activity log indicates something has accessed a suspicious PHP page located in the upload folder. <br/>This type of folder doesn't usually contain PHP files. The existence of this type of file might indicate an exploitation taking advantage of arbitrary file upload vulnerabilities.|
|**An attempt to run Linux commands on a Windows App Service**|Analysis of App Service processes detected an attempt to run a Linux command on a Windows App Service. This action was running by the web application. This behavior is often seen during campaigns that exploit a vulnerability in a common web application.|
|**Suspicious PHP execution detected**|Machine logs indicate that a suspicious PHP process is running. The action included an attempt to run operating system commands or PHP code from the command line, by using the PHP process. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities, such as attempts to infect websites with web shells.|
|**Process execution from temporary folder**|App Service processes analysis has detected an execution of a process from the app's temporary folder. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities.|
|**Attempt to run high privilege command detected**|Analysis of App Service processes has detected an attempt to run a command that requires high privileges. The command ran in the web application context. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities.|

## Azure Containers <a name="azure-containers"></a>

Security Center provides real-time threat detection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

We detect threats at different levels: 

* **Host level** - Security Center's agent (available on the Standard tier, see [pricing](security-center-pricing.md) for details) monitors Linux for suspicious activities. The agent triggers alerts for suspicious activities originating from the node or a container running on it. Examples of such activities include web shell detection and connection with known suspicious IP addresses.

    For a deeper insight into the security of your containerized environment, the agent monitors container-specific analytics. It will trigger alerts for events such as privileged container creation, suspicious access to API servers, and Secure Shell (SSH) servers running inside a Docker container.

    >[!NOTE]
    > If you choose not to install the agents on your hosts, you will only receive a subset of the threat detection benefits and alerts. You'll still receive alerts related to network analysis and communications with malicious servers.

* For **AKS cluster level**, there's threat detection monitoring based on Kubernetes audit logs analysis. To enable this **agentless** monitoring, add the Kubernetes option to your subscription from the **Pricing & settings** page (see [pricing](security-center-pricing.md)). To generate alerts at this level, Security Center monitors your AKS-managed services using the logs retrieved by AKS. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and creation of sensitive mounts.

    >[!NOTE]
    > Security Center generates detection alerts for Azure Kubernetes Service actions and deployments occurring after the Kubernetes option is enabled on the subscription settings. 

Also, our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.


### AKS cluster level alerts

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**PREVIEW - Role binding to the cluster-admin role detected**|Kubernetes audit log analysis detected a new binding to the cluster-admin role resulting in administrator privileges. Unnecessarily providing administrator privileges might result in privilege escalation issues in the cluster.|
|**PREVIEW - Exposed Kubernetes dashboard detected**|Kubernetes audit log analysis detected exposure of the Kubernetes Dashboard by a LoadBalancer service. Exposed dashboards allow unauthenticated access to the cluster management and pose a security threat.|
|**PREVIEW - New high privileges role detected**|Kubernetes audit log analysis detected a new role with high privileges. A binding to a role with high privileges gives the user/group elevated privileges in the cluster. Unnecessarily providing elevated privileges might result in privilege escalation issues in the cluster.|
|**PREVIEW - New container in the kube-system namespace detected**|Kubernetes audit log analysis detected a new container in the kube-system namespace that isn’t among the containers that normally run in this namespace. The kube-system namespaces shouldn't contain user resources. Attackers can use this namespace to hide malicious components.|
|**PREVIEW - Digital currency mining container detected**|Kubernetes audit log analysis detected a container that has an image associated with a digital currency mining tool.|
|**PREVIEW - Privileged container detected**|Kubernetes audit log analysis detected a new privileged container. A privileged container has access to the node’s resources and breaks the isolation between containers. If compromised, an attacker can use the privileged container to gain access to the node.|
|**PREVIEW - Container with a sensitive volume mount detected**|Kubernetes audit log analysis detected a new container with a sensitive volume mount. The volume that was detected is a hostPath type that mounts a sensitive file or folder from the node to the container. If the container gets compromised, the attacker can use this mount to gain access to the node.|



### Host level alerts

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Privileged Container Detected**|Machine logs indicate that a privileged Docker container is running. A privileged container has full access to the host's resources. If compromised, an attacker can use the privileged container to gain access to the host machine.|
|**Privileged command run in container**|Machine logs indicate that a privileged command was run in a Docker container. A privileged command has extended privileges on the host machine.|
|**Exposed Docker daemon detected**|Machine logs indicate that your Docker daemon (dockerd) exposes a TCP socket. By default, Docker configuration doesn't use encryption or authentication when a TCP socket is enabled. Anyone with access to the relevant port can then get full access to the Docker daemon.|
|**SSH server is running inside a container**|Machine logs indicate that an SSH server is running inside a Docker container. While this behavior can be intentional, it frequently indicates that a container is misconfigured or breached.|
|**Container with a miner image detected**|Machine logs indicate execution of a Docker container running an image associated with digital currency mining. This behavior can possibly indicate that your resources are being abused.|
|**Suspicious request to Kubernetes API**|Machine logs indicate that a suspicious request was made to the Kubernetes API. The request was sent from a Kubernetes node, possibly from one of the containers running in the node. Although this behavior can be intentional, it might indicate that the node is running a compromised container.|
|**Suspicious request to the Kubernetes Dashboard**|Machine logs indicate that a suspicious request was made to the Kubernetes Dashboard. The request was sent from a Kubernetes node, possibly from one of the containers running in the node. Although this behavior can be intentional, it might indicate that the node is running a compromised container.|