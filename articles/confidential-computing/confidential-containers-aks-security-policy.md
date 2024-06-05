---
title: Security policy for Confidential Containers on Azure Kubernetes Service 
description: Understand the security policy implemented to provide self-protection of the container hosted on Azure Kubernetes Service
ms.topic: conceptual
ms.author: magoedte
author: mgoedtel
ms.service: container-instances
services: container-instances
ms.date: 11/13/2023
---

# Security policy for Confidential Containers on Azure Kubernetes Service

As described by the Confidential Computing Consortium (CCC), *"Confidential Computing is the protection of data in use by performing computation in a hardware-based, attested Trusted Execution Environment (TEE)."* AKS Confidential Containers are designed to protect Kubernetes pods data in use from unauthorized access from outside of these pods. Each pod is executed in a Confidential Virtual Machine (CVM) protected by the [AMD SEV-SNP TEE](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/white-papers/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf) by encrypting data in use and prevent access to the data by the Host Operating System (OS). Microsoft engineers collaborated with the [Confidential Containers](https://github.com/confidential-containers) (CoCo) and [Kata Containers](https://github.com/kata-containers/) open-source communities on the design and implementation of the Confidential Containers.  

## Security policy overview

One of the main components of the [Kata Containers system architecture](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/history.md#kata-2x-architecture) is the [Kata agent](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md#agent). When using Kata Containers to implement Confidential Containers, the agent is executed inside the hardware-based TEE and therefore is part of the pod's Trusted Computing Base (TCB). As shown in the following diagram, the Kata agent provides a set of [ttrpc](https://github.com/containerd/ttrpc) APIs allowing the system components outside of the TEE to create and manage CVM-based Kubernetes pods. These other components (for example, the Kata Shim) aren't part of the pod's TCB. Therefore, the agent must protect itself from potentially buggy or malicious API calls.

:::image type="content" source="media/confidential-containers-security-policy/security-policy-architecture-diagram.png" alt-text="Diagram of the AKS Confidential Containers security policy model.":::

In AKS Confidential Containers, the Kata agent API self-protection is implemented using a security policy (also known as the Kata *Agent Policy*), specified by the owners of the confidential pods. The policy document contains rules and data corresponding to each pod, using the industry standard [Rego policy language](https://www.openpolicyagent.org/docs/latest/policy-language/). The enforcement of the policy inside the CVM is implemented using the [Open Policy Agent](https://www.openpolicyagent.org/) (OPA) – a graduated project of the [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF).

## Policy contents

The security policy describes all the calls to agent’s ttrpc APIs (and the parameters of these API calls) that are expected for creating and managing the Confidential pod. The policy document of each pod is a text file, using the Rego language. There are three high-level sections of the policy document.

### Data

The policy data is specific to each pod. It contains, for example:

* A list of Containers expected to be created in the pod.
* A list of APIs blocked by the policy by default (for confidentiality reasons).

Examples of data included in the policy document for each of the containers in a pod:

* Image integrity information.
* Commands executed in the container.
* Storage volumes and mounts.
* Execution security context. For example, is the root file system read-only?
* Is the process allowed to gain new privileges?
* Environment variables.
* Other fields from the Open Container Initiative (OCI) container runtime configuration.

### Rules

The policy rules, specified in Rego format, get executed by OPA for each Kata agent API call from outside of the CVM. The agent provides all API inputs to OPA, and OPA uses the rules to check if the inputs are consistent with policy data. If the policy rules and data doesn't allow API inputs, the agent rejects the API call by returning a "blocked by policy" error message. Here are some rule examples:

* Each container layer is exposed as a read-only [virtio block](https://docs.oasis-open.org/virtio/virtio/v1.1/cs01/virtio-v1.1-cs01.html#x1-2390002) device to the CVM. The integrity of those block devices is protected using the [dm-verity](https://docs.kernel.org/admin-guide/device-mapper/verity.html) technology of the Linux kernel. The expected root value of the dm-verity [hash tree](https://docs.kernel.org/admin-guide/device-mapper/verity.html#hash-tree) is included in the policy data, and verified at runtime by the policy rules.
* Rules reject Container creation when an unexpected command line, storage mount, execution security context, or environment variable is detected.

By default, policy [rules](https://github.com/microsoft/kata-containers/blob/2795dae5e99bd918b7b8d0a9643e9a857e95813d/src/tools/genpolicy/rules.rego#L37) are common to all pods. The *genpolicy* tool generates the policy data and is specific to each pod.

### Default values

When evaluating the Rego rules using the policy data and API inputs as parameters, OPA tries to find at least one set of rules that returns a `true` value based on the input data. If the rules don’t return `true`, OPA returns to the agent the default value for that API. Examples of default values from the Policy:

* `default CreateContainerRequest := false` – means that any CreateContainer API call is rejected unless a set of Policy rules explicitly allow that call.

* `default GuestDetailsRequest := true` – means that calls from outside of the TEE to the GuestDetails API are always allowed because the data returned by this API isn't sensitive for confidentiality of the customer workloads.

## Sending the policy to Kata agent

All AKS Confidential Containers CVMs start up using a generic, default policy included in the CVMs root file system. Therefore, a Policy that matches the actual customer workload must be provided to the agent at run time. The policy text is embedded in your YAML manifest file as described earlier, and is provided this way to the agent early during CVM initialization. The policy annotation travels through the kubelet, containerd, and [Kata shim](https://github.com/kata-containers/kata-containers/blob/main/src/runtime/cmd/containerd-shim-kata-v2) components of the AKS Confidential Containers system. Then the agent working together with OPA enforces the policy for all the calls to its own APIs.

The policy is provided using components that aren't part of your TCB, so initially this policy isn't trusted. The trustworthiness of the policy must be established through Remote Attestation, as described in the following section.

## Establish trust in the policy document

Before creating the Pod CVM, the Kata shim computes the SHA256 hash of the Policy document and attaches that hash value to the TEE. That action creates a strong binding between the contents of the Policy and the CVM. This TEE field isn't modifiable later by either the software executed inside the CVM, or outside of it.

Upon receiving the policy, the agent verifies the hash of the policy matches the immutable TEE field. The agent rejects the incoming Policy if it detects a hash mismatch.

Before handling sensitive information, your workloads must perform Remote Attestation steps to prove to any Relying Party that the workload is executed using the expected versions of the TEE, OS, agent, OPA, and root file system versions. Attestation is implemented in a Container running inside the CVM that obtains signed attestation evidence from the AMD SEV-SNP hardware. One of the fields from the attestation evidence is the policy hash TEE field described earlier. Therefore, the Attestation service can verify the integrity of the policy, by comparing the value of this field with the expected hash of the pod policy.

## Policy enforcement

The Kata agent is responsible for enforcing the policy. Microsoft contributed to the Kata and CoCo community the agent code responsible for checking the policy for each agent ttrpc API call. Before carrying out the actions corresponding to the API, the agent uses the OPA REST API to check if the policy rules and data allow or block the call.

## Next steps

[Deploy a confidential container on AKS](../aks/deploy-confidential-containers-default-policy.md)
