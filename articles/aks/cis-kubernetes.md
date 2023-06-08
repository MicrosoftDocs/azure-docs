---
title: Center for Internet Security (CIS) Kubernetes benchmark
description: Learn how AKS applies the CIS Kubernetes benchmark
ms.topic: article
ms.date: 12/20/2022
---

# Center for Internet Security (CIS) Kubernetes benchmark

As a secure service, Azure Kubernetes Service (AKS) complies with SOC, ISO, PCI DSS, and HIPAA standards. This article covers the security hardening applied to AKS based on the CIS Kubernetes benchmark. For more information about AKS security, see [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](./concepts-security.md). For more information on the CIS benchmark, see [Center for Internet Security (CIS) Benchmarks][cis-benchmarks].

## Kubernetes CIS benchmark

The following are the results from the [CIS Kubernetes V1.24 Benchmark v1.0.0][cis-benchmark-kubernetes] recommendations on AKS. These are applicable to AKS 1.21.x through AKS 1.24.x.

*Scored* recommendations affect the benchmark score if they are not applied, while *Not Scored* recommendations don't.

CIS benchmarks provide two levels of security settings:

* *L1*, or Level 1, recommends essential basic security requirements that can be configured on any system and should cause little or no interruption of service or reduced functionality.
* *L2*, or Level 2, recommends security settings for environments requiring greater security that could result in some reduced functionality.

Recommendations can have one of the following statuses:

* *Pass* - The recommendation has been applied.
* *Fail* - The recommendation has not been applied.
* *N/A* - The recommendation relates to manifest file permission requirements that are not relevant to AKS. Kubernetes clusters by default use a manifest model to deploy the control plane pods, which rely on files from the node VM. The CIS Kubernetes benchmark recommends these files must have certain permission requirements. AKS clusters use a Helm chart to deploy control plane pods and don't rely on files in the node VM.
* *Depends on Environment* - The recommendation is applied in the user's specific environment and is not controlled by AKS. *Scored* recommendations affect the benchmark score whether the recommendation applies to the user's specific environment or not.
* *Equivalent Control* - The recommendation has been implemented in a different, equivalent manner.

| CIS ID | Recommendation description|Scoring Type|Level|Status|
|---|---|---|---|---|
|1|Control Plane Components||||
|1.1|Control Plane Node Configuration Files||||
|1.1.1|Ensure that the API server pod specification file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.2|Ensure that the API server pod specification file ownership is set to root:root|Scored|L1|N/A|
|1.1.3|Ensure that the controller manager pod specification file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.4|Ensure that the controller manager pod specification file ownership is set to root:root|Scored|L1|N/A|
|1.1.5|Ensure that the scheduler pod specification file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.6|Ensure that the scheduler pod specification file ownership is set to root:root|Scored|L1|N/A|
|1.1.7|Ensure that the etcd pod specification file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.8|Ensure that the etcd pod specification file ownership is set to root:root|Scored|L1|N/A|
|1.1.9|Ensure that the Container Network Interface file permissions are set to 600 or more restrictive|Not Scored|L1|N/A|
|1.1.10|Ensure that the Container Network Interface file ownership is set to root:root|Not Scored|L1|N/A|
|1.1.11|Ensure that the etcd data directory permissions are set to 700 or more restrictive|Scored|L1|N/A|
|1.1.12|Ensure that the etcd data directory ownership is set to etcd:etcd|Scored|L1|N/A|
|1.1.13|Ensure that the admin.conf file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.14|Ensure that the admin.conf file ownership is set to root:root|Scored|L1|N/A|
|1.1.15|Ensure that the scheduler.conf file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.16|Ensure that the scheduler.conf file ownership is set to root:root|Scored|L1|N/A|
|1.1.17|Ensure that the controller-manager.conf file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.18|Ensure that the controller-manager.conf file ownership is set to root:root|Scored|L1|N/A|
|1.1.19|Ensure that the Kubernetes PKI directory and file ownership is set to root:root|Scored|L1|N/A|
|1.1.20|Ensure that the Kubernetes PKI certificate file permissions are set to 600 or more restrictive|Scored|L1|N/A|
|1.1.21|Ensure that the Kubernetes PKI key file permissions are set to 600|Scored|L1|N/A|
|1.2|API Server||||
|1.2.1|Ensure that the `--anonymous-auth` argument is set to false|Not Scored|L1|Pass|
|1.2.2|Ensure that the `--token-auth-file` parameter is not set|Scored|L1|Fail|
|1.2.3|Ensure that `--DenyServiceExternalIPs` is not set|Scored|L1|Pass|
|1.2.4|Ensure that the `--kubelet-client-certificate` and `--kubelet-client-key` arguments are set as appropriate|Scored|L1|Pass|
|1.2.5|Ensure that the `--kubelet-certificate-authority` argument is set as appropriate|Scored|L1|Fail|
|1.2.6|Ensure that the `--authorization-mode` argument is not set to AlwaysAllow|Scored|L1|Pass|
|1.2.7|Ensure that the `--authorization-mode` argument includes Node|Scored|L1|Pass|
|1.2.8|Ensure that the `--authorization-mode` argument includes RBAC|Scored|L1|Pass|
|1.2.9|Ensure that the admission control plugin EventRateLimit is set|Not Scored|L1|Fail|
|1.2.10|Ensure that the admission control plugin AlwaysAdmit is not set|Scored|L1|Pass|
|1.2.11|Ensure that the admission control plugin AlwaysPullImages is set|Not Scored|L1|Fail|
|1.2.12|Ensure that the admission control plugin SecurityContextDeny is set if PodSecurityPolicy is not used|Not Scored|L1|Fail|
|1.2.13|Ensure that the admission control plugin ServiceAccount is set|Scored|L1|Pass|
|1.2.14|Ensure that the admission control plugin NamespaceLifecycle is set|Scored|L1|Pass|
|1.2.15|Ensure that the admission control plugin NodeRestriction is set|Scored|L1|Pass|
|1.2.16|Ensure that the `--secure-port` argument is not set to 0|Scored|L1|Pass|
|1.2.17|Ensure that the `--profiling` argument is set to false|Scored|L1|Pass|
|1.2.18|Ensure that the `--audit-log-path` argument is set|Scored|L1|Pass|
|1.2.19|Ensure that the `--audit-log-maxage` argument is set to 30 or as appropriate|Scored|L1|Equivalent Control|
|1.2.20|Ensure that the `--audit-log-maxbackup` argument is set to 10 or as appropriate|Scored|L1|Equivalent Control|
|1.2.21|Ensure that the `--audit-log-maxsize` argument is set to 100 or as appropriate|Scored|L1|Pass|
|1.2.22|Ensure that the `--request-timeout` argument is set as appropriate|Scored|L1|Pass|
|1.2.23|Ensure that the `--service-account-lookup` argument is set to true|Scored|L1|Pass|
|1.2.24|Ensure that the `--service-account-key-file` argument is set as appropriate|Scored|L1|Pass|
|1.2.25|Ensure that the `--etcd-certfile` and `--etcd-keyfile` arguments are set as appropriate|Scored|L1|Pass|
|1.2.26|Ensure that the `--tls-cert-file` and `--tls-private-key-file` arguments are set as appropriate|Scored|L1|Pass|
|1.2.27|Ensure that the `--client-ca-file` argument is set as appropriate|Scored|L1|Pass|
|1.2.28|Ensure that the `--etcd-cafile` argument is set as appropriate|Scored|L1|Pass|
|1.2.29|Ensure that the `--encryption-provider-config` argument is set as appropriate|Scored|L1|Depends on Environment|
|1.2.30|Ensure that encryption providers are appropriately configured|Scored|L1|Depends on Environment|
|1.2.31|Ensure that the API Server only makes use of Strong Cryptographic Ciphers|Not Scored|L1|Pass|
|1.3|Controller Manager||||
|1.3.1|Ensure that the `--terminated-pod-gc-threshold` argument is set as appropriate|Scored|L1|Pass|
|1.3.2|Ensure that the `--profiling` argument is set to false|Scored|L1|Pass|
|1.3.3|Ensure that the `--use-service-account-credentials` argument is set to true|Scored|L1|Pass|
|1.3.4|Ensure that the `--service-account-private-key-file` argument is set as appropriate|Scored|L1|Pass|
|1.3.5|Ensure that the `--root-ca-file` argument is set as appropriate|Scored|L1|Pass|
|1.3.6|Ensure that the RotateKubeletServerCertificate argument is set to true|Scored|L2|Fail|
|1.3.7|Ensure that the `--bind-address` argument is set to 127.0.0.1|Scored|L1|Equivalent Control|
|1.4|Scheduler||||
|1.4.1|Ensure that the `--profiling` argument is set to false|Scored|L1|Pass|
|1.4.2|Ensure that the `--bind-address` argument is set to 127.0.0.1|Scored|L1|Equivalent Control|
|2|etcd||||
|2.1|Ensure that the `--cert-file` and `--key-file` arguments are set as appropriate|Scored|L1|Pass|
|2.2|Ensure that the `--client-cert-auth` argument is set to true|Scored|L1|Pass|
|2.3|Ensure that the `--auto-tls` argument is not set to true|Scored|L1|Pass|
|2.4|Ensure that the `--peer-cert-file` and `--peer-key-file` arguments are set as appropriate|Scored|L1|Pass|
|2.5|Ensure that the `--peer-client-cert-auth` argument is set to true|Scored|L1|Pass|
|2.6|Ensure that the `--peer-auto-tls` argument is not set to true|Scored|L1|Pass|
|2.7|Ensure that a unique Certificate Authority is used for etcd|Not Scored|L2|Pass|
|3|Control Plane Configuration||||
|3.1|Authentication and Authorization||||
|3.1.1|Client certificate authentication should not be used for users|Not Scored|L2|Pass|
|3.2|Logging||||
|3.2.1|Ensure that a minimal audit policy is created|Scored|L1|Pass|
|3.2.2|Ensure that the audit policy covers key security concerns|Not Scored|L2|Pass|
|4|Worker Nodes||||
|4.1|Worker Node Configuration Files||||
|4.1.1|Ensure that the kubelet service file permissions are set to 600 or more restrictive|Scored|L1|Pass|
|4.1.2|Ensure that the kubelet service file ownership is set to root:root|Scored|L1|Pass|
|4.1.3|If a proxy kubeconfig file exists, ensure permissions are set to 600 or more restrictive|Scored|L1|N/A|
|4.1.4|If a proxy kubeconfig file exists, ensure ownership is set to root:root|Scored|L1|N/A|
|4.1.5|Ensure that the `--kubeconfig` kubelet.conf file permissions are set to 600 or more restrictive|Scored|L1|Pass|
|4.1.6|Ensure that the `--kubeconfig` kubelet.conf file ownership is set to root:root|Scored|L1|Pass|
|4.1.7|Ensure that the certificate authorities file permissions are set to 600 or more restrictive|Scored|L1|Pass|
|4.1.8|Ensure that the client certificate authorities file ownership is set to root:root|Scored|L1|Pass|
|4.1.9|If the kubelet config.yaml configuration file is being used, ensure permissions set to 600 or more restrictive|Scored|L1|Pass|
|4.1.10|If the kubelet config.yaml configuration file is being used, ensure file ownership is set to root:root|Scored|L1|Pass|
|4.2|Kubelet||||
|4.2.1|Ensure that the `--anonymous-auth` argument is set to false|Scored|L1|Pass|
|4.2.2|Ensure that the `--authorization-mode` argument is not set to AlwaysAllow|Scored|L1|Pass|
|4.2.3|Ensure that the `--client-ca-file` argument is set as appropriate|Scored|L1|Pass|
|4.2.4|Ensure that the `--read-only-port` argument is set to 0|Scored|L1|Pass|
|4.2.5|Ensure that the `--streaming-connection-idle-timeout` argument is not set to 0|Scored|L1|Pass|
|4.2.6|Ensure that the `--protect-kernel-defaults` argument is set to true|Scored|L1|Pass|
|4.2.7|Ensure that the `--make-iptables-util-chains` argument is set to true|Scored|L1|Pass|
|4.2.8|Ensure that the `--hostname-override` argument is not set|Not Scored|L1|Pass|
|4.2.9|Ensure that the eventRecordQPS argument is set to a level which ensures appropriate event capture|Not Scored|L2|Pass|
|4.2.10|Ensure that the `--tls-cert-file`and `--tls-private-key-file` arguments are set as appropriate|Scored|L1|Pass|
|4.2.11|Ensure that the `--rotate-certificates` argument is not set to false|Scored|L1|Pass|
|4.2.12|Ensure that the RotateKubeletServerCertificate argument is set to true|Scored|L1|Pass|
|4.2.13|Ensure that the Kubelet only makes use of Strong Cryptographic Ciphers|Not Scored|L1|Pass|
|5|Policies||||
|5.1|RBAC and Service Accounts||||
|5.1.1|Ensure that the cluster-admin role is only used where required|Not Scored|L1|Depends on Environment|
|5.1.2|Minimize access to secrets|Not Scored|L1|Depends on Environment|
|5.1.3|Minimize wildcard use in Roles and ClusterRoles|Not Scored|L1|Depends on Environment|
|5.1.4|Minimize access to create pods|Not Scored|L1|Depends on Environment|
|5.1.5|Ensure that default service accounts are not actively used|Scored|L1|Depends on Environment|
|5.1.6|Ensure that Service Account Tokens are only mounted where necessary|Not Scored|L1|Depends on Environment|
|5.2|Pod Security Policies||||
|5.2.1|Minimize the admission of privileged containers|Not Scored|L1|Depends on Environment|
|5.2.2|Minimize the admission of containers wishing to share the host process ID namespace|Scored|L1|Depends on Environment|
|5.2.3|Minimize the admission of containers wishing to share the host IPC namespace|Scored|L1|Depends on Environment|
|5.2.4|Minimize the admission of containers wishing to share the host network namespace|Scored|L1|Depends on Environment|
|5.2.5|Minimize the admission of containers with allowPrivilegeEscalation|Scored|L1|Depends on Environment|
|5.2.6|Minimize the admission of root containers|Not Scored|L2|Depends on Environment|
|5.2.7|Minimize the admission of containers with the NET_RAW capability|Not Scored|L1|Depends on Environment|
|5.2.8|Minimize the admission of containers with added capabilities|Not Scored|L1|Depends on Environment|
|5.2.9|Minimize the admission of containers with capabilities assigned|Not Scored|L2|Depends on Environment|
|5.3|Network Policies and CNI||||
|5.3.1|Ensure that the CNI in use supports Network Policies|Not Scored|L1|Pass|
|5.3.2|Ensure that all Namespaces have Network Policies defined|Scored|L2|Depends on Environment|
|5.4|Secrets Management||||
|5.4.1|Prefer using secrets as files over secrets as environment variables|Not Scored|L1|Depends on Environment|
|5.4.2|Consider external secret storage|Not Scored|L2|Depends on Environment|
|5.5|Extensible Admission Control||||
|5.5.1|Configure Image Provenance using ImagePolicyWebhook admission controller|Not Scored|L2|Depends on Environment|
|5.6|General Policies||||
|5.6.1|Create administrative boundaries between resources using namespaces|Not Scored|L1|Depends on Environment|
|5.6.2|Ensure that the seccomp profile is set to docker/default in your pod definitions|Not Scored|L2|Depends on Environment|
|5.6.3|Apply Security Context to Your Pods and Containers|Not Scored|L2|Depends on Environment|
|5.6.4|The default namespace should not be used|Scored|L2|Depends on Environment|

> [!NOTE]
> In addition to the Kubernetes CIS benchmark, there is an [AKS CIS benchmark][cis-benchmark-aks] available as well.

## Additional notes

* The security hardened OS is built and maintained specifically for AKS and is **not** supported outside of the AKS platform.
* To further reduce the attack surface area, some unnecessary kernel module drivers have been disabled in the OS.

## Next steps  

For more information about AKS security, see the following articles:

* [Azure Kubernetes Service (AKS)](./intro-kubernetes.md)
* [AKS security considerations](./concepts-security.md)
* [AKS best practices](./best-practices.md)

[azure-update-management]: ../automation/update-management/overview.md
[azure-file-integrity-monotoring]: ../security-center/security-center-file-integrity-monitoring.md
[azure-time-sync]: ../virtual-machines/linux/time-sync.md
[auzre-log-analytics-agent-overview]: ../azure-monitor/platform/log-analytics-agent.md
[cis-benchmarks]: /compliance/regulatory/offering-CIS-Benchmark
[cis-benchmark-aks]: https://www.cisecurity.org/benchmark/kubernetes/
[cis-benchmark-kubernetes]: https://www.cisecurity.org/benchmark/kubernetes/
