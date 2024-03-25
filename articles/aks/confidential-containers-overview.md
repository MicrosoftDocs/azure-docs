---
title: Confidential Containers (preview) with Azure Kubernetes Service (AKS)
description: Learn about Confidential Containers (preview) on an Azure Kubernetes Service (AKS) cluster to maintain security and protect sensitive information.
ms.topic: article
ms.date: 03/18/2024
---

# Confidential Containers (preview) with Azure Kubernetes Service (AKS)

Confidential Containers provide a set of features and capabilities to further secure your standard container workloads to achieve higher data security, data privacy and runtime code integrity goals. Azure Kubernetes Service (AKS) includes Confidential Containers (preview) on AKS.

Confidential Containers builds on Kata Confidential Containers and hardware-based encryption to encrypt container memory. It establishes a new level of data confidentiality by preventing data in memory during computation from being in clear text, readable format. Trust is earned in the container through hardware attestation, allowing access to the encrypted data by trusted entities.

Together with [Pod Sandboxing][pod-sandboxing-overview], you can run sensitive workloads isolated in Azure to protect your data and workloads. What makes a container confidential:

* Transparency: The confidential container environment where your sensitive application is shared, you can see and verify if it's safe. All components of the Trusted Computing Base (TCB) are to be open sourced.
* Auditability: You have the ability to verify and see what version of the CoCo environment package including Linux Guest OS and all the components are current. Microsoft signs to the guest OS and container runtime environment for verifications through attestation. It also releases a secure hash algorithm (SHA) of guest OS builds to build a string audibility and control story.
* Full attestation: Anything that is part of the TEE shall be fully measured by the CPU with ability to verify remotely. The hardware report from AMD SEV-SNP processor shall reflect container layers and container runtime configuration hash through the attestation claims. Application can fetch the hardware report locally including the report that reflects Guest OS image and container runtime.
* Code integrity: Runtime enforcement is always available through customer defined policies for containers and container configuration, such as immutable policies and container signing.
* Isolation from operator: Security designs that assume least privilege and highest isolation shielding from all untrusted parties including customer/tenant admins. It includes hardening existing Kubernetes control plane access (kubelet) to confidential pods.

With other security measures or data protection controls, as part of your overall architecture, these capabilities help you meet regulatory, industry, or governance compliance requirements for securing sensitive information.

This article helps you understand the Confidential Containers feature, and how to implement and configure the following:

* Deploy or upgrade an AKS cluster using the Azure CLI
* Add an annotation to your pod YAML to mark the pod as being run as a confidential container
* Add a [security policy][confidential-containers-security-policy] to your pod YAML
* Enable enforcement of the security policy
* Deploy your application in confidential computing

## Supported scenarios

Confidential Containers (preview) are appropriate for deployment scenarios that involve sensitive data. For example, personally identifiable information (PII) or any data with strong security needed for regulatory compliance. Some common scenarios with containers are:

- Run big data analytics using Apache Spark for fraud pattern recognition in the financial sector.
- Running self-hosted GitHub runners to securely sign code as part of Continuous Integration and Continuous Deployment (CI/CD) DevOps practices.
- Machine Learning inferencing and training of ML models using an encrypted data set from a trusted source. It only decrypts inside a confidential container environment to preserve privacy.
- Building big data clean rooms for ID matching as part of multi-party computation in industries like retail with digital advertising.
- Building confidential computing Zero Trust landing zones to meet privacy regulations for application migrations to cloud.

## Considerations

The following are considerations with this preview of Confidential Containers:

* An increase in pod startup time compared to runc pods and kernel-isolated pods.
* Version 1 container images aren't supported.
* Updates to secrets and ConfigMaps aren't reflected in the guest.
* Ephemeral containers and other troubleshooting methods like `exec` into a container,
log outputs from containers, and `stdio` (ReadStreamRequest and WriteStreamRequest) require a policy modification and redeployment.
* The policy generator tool doesn't support cronjob deployment types.
* Due to container image layer measurements being encoded in the security policy, we don't recommend using the `latest` tag when specifying containers.
* Services, Load Balancers, and EndpointSlices only support the TCP protocol.
* All containers in all pods on the clusters must be configured to `imagePullPolicy: Always`.
* The policy generator only supports pods that use IPv4 addresses.
* ConfigMaps and secrets values can't be changed if setting using the environment variable method after the pod is deployed. The security policy prevents it.
* Pod termination logs aren't supported. While pods write termination logs to `/dev/termination-log` or to a custom location if specified in the pod manifest, the host/kubelet can't read those logs. Changes from guest to that file aren't reflected on the host.

## Resource allocation overview

It's important you understand the memory and processor resource allocation behavior in this release.

* CPU: The shim assigns one vCPU to the base OS inside the pod. If no resource `limits` are specified, the workloads don't have separate CPU shares assigned, the vCPU is then shared with that workload. If CPU limits are specified, CPU shares are explicitly allocated for workloads.
* Memory: The Kata-CC handler uses 2 GB memory for the UVM OS and X MB additional memory where X is the resource `limits` if specified in the YAML manifest (resulting in a 2-GB VM when no limit is given, without implicit memory for containers). The [Kata][kata-technical-documentation] handler uses 256 MB base memory for the UVM OS and X MB additional memory when resource `limits` are specified in the YAML manifest. If limits are unspecified, an implicit limit of 1,792 MB is added resulting in a 2 GB VM and 1,792 MB implicit memory for containers.

In this release, specifying resource requests in the pod manifests aren't supported. The Kata container ignores resource requests from pod YAML manifest, and as a result, containerd doesn't pass the requests to the shim. Use resource `limit` instead of resource `requests` to allocate memory or CPU resources for workloads or containers.

With the local container filesystem backed by VM memory, writing to the container filesystem (including logging) can fill up the available memory provided to the pod. This condition can result in potential pod crashes.

## Next steps

* See the overview of [Confidential Containers security policy][confidential-containers-security-policy] to learn about how workloads and their data in a pod is protected.
* [Deploy Confidential Containers on AKS][deploy-confidential-containers-default-aks] with a default security policy.
* Learn more about [Azure Dedicated hosts][azure-dedicated-hosts] for nodes with your AKS cluster to use hardware isolation and control over Azure platform maintenance events.

<!-- EXTERNAL LINKS -->
[kata-technical-documentation]: https://katacontainers.io/docs/

<!-- INTERNAL LINKS -->
[pod-sandboxing-overview]: use-pod-sandboxing.md
[azure-dedicated-hosts]: ../virtual-machines/dedicated-hosts.md
[deploy-confidential-containers-default-aks]: deploy-confidential-containers-default-policy.md
[confidential-containers-security-policy]: ../confidential-computing/confidential-containers-aks-security-policy.md
