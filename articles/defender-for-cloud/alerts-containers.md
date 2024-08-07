---
title: Alerts for containers - Kubernetes clusters
description: This article lists the security alerts for containers and Kubernetes clusters visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for containers - Kubernetes clusters

This article lists the security alerts you might get for containers and Kubernetes clusters from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Alerts for containers and Kubernetes clusters

Microsoft Defender for Containers provides security alerts on the cluster level and on the underlying cluster nodes by monitoring both control plane (API server) and the containerized workload itself. Control plane security alerts can be recognized by a prefix of `K8S_` of the alert type. Security alerts for runtime workload in the clusters can be recognized by the `K8S.NODE_` prefix of the alert type. All alerts are supported on Linux only, unless otherwise indicated.

[Further details and notes](defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters)

### **Exposed Postgres service with trust authentication configuration in Kubernetes detected (Preview)**

(K8S_ExposedPostgresTrustAuth)

**Description**: Kubernetes cluster configuration analysis detected exposure of a Postgres service by a load balancer. The service is configured with trust authentication method, which doesn't require credentials.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: InitialAccess

**Severity**: Medium

### **Exposed Postgres service with risky configuration in Kubernetes detected (Preview)**

(K8S_ExposedPostgresBroadIPRange)

**Description**: Kubernetes cluster configuration analysis detected exposure of a Postgres service by a load balancer with a risky configuration. Exposing the service to a wide range of IP addresses poses a security risk.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: InitialAccess

**Severity**: Medium

### **Attempt to create a new Linux namespace from a container detected**

(K8S.NODE_NamespaceCreation) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container in Kubernetes cluster detected an attempt to create a new Linux namespace. While this behavior might be legitimate, it might indicate that an attacker tries to escape from the container to the node. Some CVE-2022-0185 exploitations use this technique.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PrivilegeEscalation

**Severity**: Informational

### **A history file has been cleared**

(K8S.NODE_HistoryFileCleared) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected that the command history log file has been cleared. Attackers might do this to cover their tracks. The operation was performed by the specified user account.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Medium

### **Abnormal activity of managed identity associated with Kubernetes (Preview)**

(K8S_AbnormalMiActivity)

**Description**: Analysis of Azure Resource Manager operations detected an abnormal behavior of a managed identity used by an AKS addon. The detected activity isn\'t consistent with the behavior of the associated addon. While this activity can be legitimate, such behavior might indicate that the identity was gained by an attacker, possibly from a compromised container in the Kubernetes cluster.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement

**Severity**: Medium

### **Abnormal Kubernetes service account operation detected**

(K8S_ServiceAccountRareOperation)

**Description**: Kubernetes audit log analysis detected abnormal behavior by a service account in your Kubernetes cluster. The service account was used for an operation, which isn't common for this service account. While this activity can be legitimate, such behavior might indicate that the service account is being used for malicious purposes.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement, Credential Access

**Severity**: Medium

### **An uncommon connection attempt detected**

(K8S.NODE_SuspectConnection) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an uncommon connection attempt utilizing a socks protocol. This is very rare in normal operations, but a known technique for attackers attempting to bypass network-layer detections.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution, Exfiltration, Exploitation

**Severity**: Medium

### **Attempt to stop apt-daily-upgrade.timer service detected**

(K8S.NODE_TimerServiceDisabled) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an attempt to stop apt-daily-upgrade.timer service. Attackers have been observed stopping this service to download malicious files and grant execution privileges for their attacks. This activity can also happen if the service is updated through normal administrative actions.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Informational

### **Behavior similar to common Linux bots detected (Preview)**

(K8S.NODE_CommonBot)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected the execution of a process normally associated with common Linux botnets.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution, Collection, Command And Control

**Severity**: Medium

### **Command within a container running with high privileges**

(K8S.NODE_PrivilegedExecutionInContainer) <sup>[1](#footnote1)</sup>

**Description**: Machine logs indicate that a privileged command was run in a Docker container. A privileged command has extended privileges on the host machine.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PrivilegeEscalation

**Severity**: Informational

### **Container running in privileged mode**

(K8S.NODE_PrivilegedContainerArtifacts) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected the execution of a Docker command that is running a privileged container. The privileged container has full access to the hosting pod or host resource. If compromised, an attacker might use the privileged container to gain access to the hosting pod or host.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PrivilegeEscalation, Execution

**Severity**: Informational

### **Container with a sensitive volume mount detected**

(K8S_SensitiveMount)

**Description**: Kubernetes audit log analysis detected a new container with a sensitive volume mount. The volume that was detected is a hostPath type which mounts a sensitive file or folder from the node to the container. If the container gets compromised, the attacker can use this mount for gaining access to the node.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Informational

### **CoreDNS modification in Kubernetes detected**

(K8S_CoreDnsModification) <sup>[2](#footnote2)</sup> <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a modification of the CoreDNS configuration. The configuration of CoreDNS can be modified by overriding its configmap. While this activity can be legitimate, if attackers have permissions to modify the configmap, they can change the behavior of the cluster's DNS server and poison it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement

**Severity**: Low

### **Creation of admission webhook configuration detected**

(K8S_AdmissionController) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a new admission webhook configuration. Kubernetes has two built-in generic admission controllers: MutatingAdmissionWebhook and ValidatingAdmissionWebhook. The behavior of these admission controllers is determined by an admission webhook that the user deploys to the cluster. The usage of such admission controllers can be legitimate, however attackers can use such webhooks for modifying the requests (in case of MutatingAdmissionWebhook) or inspecting the requests and gain sensitive information (in case of ValidatingAdmissionWebhook).

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access, Persistence

**Severity**: Informational

### **Detected file download from a known malicious source**

(K8S.NODE_SuspectDownload) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a download of a file from a source frequently used to distribute malware.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PrivilegeEscalation, Execution, Exfiltration, Command And Control

**Severity**: Medium

### **Detected suspicious file download**

(K8S.NODE_SuspectDownloadArtifacts) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious download of a remote file.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **Detected suspicious use of the nohup command**

(K8S.NODE_SuspectNohup) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious use of the nohup command. Attackers have been seen using the command nohup to run hidden files from a temporary directory to allow their executables to run in the background. It's rare to see this command run on hidden files located in a temporary directory.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, DefenseEvasion

**Severity**: Medium

### **Detected suspicious use of the useradd command**

(K8S.NODE_SuspectUserAddition) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious use of the useradd command.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Digital currency mining container detected**

(K8S_MaliciousContainerImage) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a container that has an image associated with a digital currency mining tool.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Digital currency mining related behavior detected**

(K8S.NODE_DigitalCurrencyMining) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an execution of a process or command normally associated with digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Docker build operation detected on a Kubernetes node**

(K8S.NODE_ImageBuildOnNode) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a build operation of a container image on a Kubernetes node. While this behavior might be legitimate, attackers might build their malicious images locally to avoid detection.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Informational

### **Exposed Kubeflow dashboard detected**

(K8S_ExposedKubeflow)

**Description**: The Kubernetes audit log analysis detected exposure of the Istio Ingress by a load balancer in a cluster that runs Kubeflow. This action might expose the Kubeflow dashboard to the internet. If the dashboard is exposed to the internet, attackers can access it and run malicious containers or code on the cluster. Find more details in the following article: <https://aka.ms/exposedkubeflow-blog>

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Exposed Kubernetes dashboard detected**

(K8S_ExposedDashboard)

**Description**: Kubernetes audit log analysis detected exposure of the Kubernetes Dashboard by a LoadBalancer service. Exposed dashboard allows an unauthenticated access to the cluster management and poses a security threat.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: High

### **Exposed Kubernetes service detected**

(K8S_ExposedService)

**Description**: The Kubernetes audit log analysis detected exposure of a service by a load balancer. This service is related to a sensitive application that allows high impact operations in the cluster such as running processes on the node or creating new containers. In some cases, this service doesn't require authentication. If the service doesn't require authentication, exposing it to the internet poses a security risk.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Exposed Redis service in AKS detected**

(K8S_ExposedRedis)

**Description**: The Kubernetes audit log analysis detected exposure of a Redis service by a load balancer. If the service doesn't require authentication, exposing it to the internet poses a security risk.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Low

### **Indicators associated with DDOS toolkit detected**

(K8S.NODE_KnownLinuxDDoSToolkit) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected file names that are part of a toolkit associated with malware capable of launching DDoS attacks, opening ports and services, and taking full control over the infected system. This could also possibly be legitimate activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, LateralMovement, Execution, Exploitation

**Severity**: Medium

### **K8S API requests from proxy IP address detected**

(K8S_TI_Proxy) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected API requests to your cluster from an IP address that is associated with proxy services, such as TOR. While this behavior can be legitimate, it's often seen in malicious activities, when attackers try to hide their source IP.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Kubernetes events deleted**

(K8S_DeleteEvents) <sup>[2](#footnote2)</sup> <sup>[3](#footnote3)</sup>

**Description**: Defender for Cloud detected that some Kubernetes events have been deleted. Kubernetes events are objects in Kubernetes that contain information about changes in the cluster. Attackers might delete those events for hiding their operations in the cluster.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion

**Severity**: Low

### **Kubernetes penetration testing tool detected**

(K8S_PenTestToolsKubeHunter)

**Description**: Kubernetes audit log analysis detected usage of Kubernetes penetration testing tool in the AKS cluster. While this behavior can be legitimate, attackers might use such public tools for malicious purposes.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Low

### **Microsoft Defender for Cloud test alert (not a threat)**

(K8S.NODE_EICAR) <sup>[1](#footnote1)</sup>

**Description**: This is a test alert generated by Microsoft Defender for Cloud. No further action is needed.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **New container in the kube-system namespace detected**

(K8S_KubeSystemContainer) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a new container in the kube-system namespace that isn't among the containers that normally run in this namespace. The kube-system namespaces shouldn't contain user resources. Attackers can use this namespace for hiding malicious components.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **New high privileges role detected**

(K8S_HighPrivilegesRole) <sup>[3](#footnote3)</sup>

**Description**: Kubernetes audit log analysis detected a new role with high privileges. A binding to a role with high privileges gives the user\group high privileges in the cluster. Unnecessary privileges might cause privilege escalation in the cluster.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, Privilege Escalation

**Severity**: Informational

### **Possible attack tool detected**

(K8S.NODE_KnownLinuxAttackTool) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious tool invocation. This tool is often associated with malicious users attacking others.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution, Collection, Command And Control, Probing

**Severity**: Medium

### **Possible backdoor detected**

(K8S.NODE_LinuxBackdoorArtifact) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious file being downloaded and run. This activity has previously been associated with installation of a backdoor.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, DefenseEvasion, Execution, Exploitation

**Severity**: Medium

### **Possible command line exploitation attempt**

(K8S.NODE_ExploitAttempt) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible exploitation attempt against a known vulnerability.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Possible credential access tool detected**

(K8S.NODE_KnownLinuxCredentialAccessTool) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible known credential access tool was running on the container, as identified by the specified process and commandline history item. This tool is often associated with attacker attempts to access credentials.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **Possible Cryptocoinminer download detected**

(K8S.NODE_CryptoCoinMinerDownload) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected download of a file normally associated with digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: DefenseEvasion, Command And Control, Exploitation

**Severity**: Medium

### **Possible Log Tampering Activity Detected**

(K8S.NODE_SystemLogRemoval) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible removal of files that tracks user's activity during the course of its operation. Attackers often try to evade detection and leave no trace of malicious activities by deleting such log files.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: DefenseEvasion

**Severity**: Medium

### **Possible password change using crypt-method detected**

(K8S.NODE_SuspectPasswordChange) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a password change using the crypt method. Attackers can make this change to continue access and gain persistence after compromise.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **Potential port forwarding to external IP address**

(K8S.NODE_SuspectPortForwarding) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an initiation of port forwarding to an external IP address.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration, Command And Control

**Severity**: Medium

### **Potential reverse shell detected**

(K8S.NODE_ReverseShell) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a potential reverse shell. These are used to get a compromised machine to call back into a machine an attacker owns.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration, Exploitation

**Severity**: Medium

### **Privileged container detected**

(K8S_PrivilegedContainer)

**Description**: Kubernetes audit log analysis detected a new privileged container. A privileged container has access to the node's resources and breaks the isolation between containers. If compromised, an attacker can use the privileged container to gain access to the node.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Privilege Escalation

**Severity**: Informational

### **Process associated with digital currency mining detected**

(K8S.NODE_CryptoCoinMinerArtifacts) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected the execution of a process normally associated with digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution, Exploitation

**Severity**: Medium

### **Process seen accessing the SSH authorized keys file in an unusual way**

(K8S.NODE_SshKeyAccess) <sup>[1](#footnote1)</sup>

**Description**: An SSH authorized_keys file was accessed in a method similar to known malware campaigns. This access could signify that an actor is attempting to gain persistent access to a machine.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Unknown

**Severity**: Informational

### **Role binding to the cluster-admin role detected**

(K8S_ClusterAdminBinding)

**Description**: Kubernetes audit log analysis detected a new binding to the cluster-admin role which gives administrator privileges. Unnecessary administrator privileges might cause privilege escalation in the cluster.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **Security-related process termination detected**

(K8S.NODE_SuspectProcessTermination) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected an attempt to terminate processes related to security monitoring on the container. Attackers will often try to terminate such processes using predefined scripts post-compromise.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Low

### **SSH server is running inside a container**

(K8S.NODE_ContainerSSH) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected an SSH server running inside the container.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Informational

### **Suspicious file timestamp modification**

(K8S.NODE_TimestampTampering) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious timestamp modification. Attackers will often copy timestamps from existing legitimate files to new tools to avoid detection of these newly dropped files.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, DefenseEvasion

**Severity**: Low

### **Suspicious request to Kubernetes API**

(K8S.NODE_KubernetesAPI) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container indicates that a suspicious request was made to the Kubernetes API. The request was sent from a container in the cluster. Although this behavior can be intentional, it might indicate that a compromised container is running in the cluster.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: LateralMovement

**Severity**: Medium

### **Suspicious request to the Kubernetes Dashboard**

(K8S.NODE_KubernetesDashboard) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container indicates that a suspicious request was made to the Kubernetes Dashboard. The request was sent from a container in the cluster. Although this behavior can be intentional, it might indicate that a compromised container is running in the cluster.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: LateralMovement

**Severity**: Medium

### **Potential crypto coin miner started**

(K8S.NODE_CryptoCoinMinerExecution) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a process being started in a way normally associated with digital currency mining.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious password access**

(K8S.NODE_SuspectPasswordFileAccess) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected suspicious attempt to access encrypted user passwords.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Informational

### **Possible malicious web shell detected**

(K8S.NODE_Webshell) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected a possible web shell. Attackers will often upload a web shell to a compute resource they have compromised to gain persistence or for further exploitation.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, Exploitation

**Severity**: Medium

### **Burst of multiple reconnaissance commands could indicate initial activity after compromise**

(K8S.NODE_ReconnaissanceArtifactsBurst) <sup>[1](#footnote1)</sup>

**Description**: Analysis of host/device data detected execution of multiple reconnaissance commands related to gathering system or host details performed by attackers after initial compromise.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Discovery, Collection

**Severity**: Low

### **Suspicious Download Then Run Activity**

(K8S.NODE_DownloadAndRunCombo) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a file being downloaded then run in the same command. While this isn't always malicious, this is a very common technique attackers use to get malicious files onto victim machines.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution, CommandAndControl, Exploitation

**Severity**: Medium

### **Access to kubelet kubeconfig file detected**

(K8S.NODE_KubeConfigAccess) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running on a Kubernetes cluster node detected access to kubeconfig file on the host. The kubeconfig file, normally used by the Kubelet process, contains credentials to the Kubernetes cluster API server. Access to this file is often associated with attackers attempting to access those credentials, or with security scanning tools which check if the file is accessible.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **Access to cloud metadata service detected**

(K8S.NODE_ImdsCall) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container detected access to the cloud metadata service for acquiring identity token. The container doesn't normally perform such operation. While this behavior might be legitimate, attackers might use this technique to access cloud resources after gaining initial access to a running container.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: CredentialAccess

**Severity**: Medium

### **MITRE Caldera agent detected**

(K8S.NODE_MitreCalderaTools) <sup>[1](#footnote1)</sup>

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a suspicious process. This is often associated with the MITRE 54ndc47 agent, which could be used maliciously to attack other machines.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, PrivilegeEscalation, DefenseEvasion, CredentialAccess, Discovery, LateralMovement, Execution, Collection, Exfiltration, Command And Control, Probing, Exploitation

**Severity**: Medium

<sup><a name="footnote1"></a>1</sup>: **Preview for non-AKS clusters**: This alert is generally available for AKS clusters, but it is in preview for other environments, such as Azure Arc, EKS, and GKE.

<sup><a name="footnote2"></a>2</sup>: **Limitations on GKE clusters**: GKE uses a Kubernetes audit policy that doesn't support all alert types. As a result, this security alert, which is based on Kubernetes audit events, is not supported for GKE clusters.

<sup><a name="footnote3"></a>3</sup>: This alert is supported on Windows nodes/containers.

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
