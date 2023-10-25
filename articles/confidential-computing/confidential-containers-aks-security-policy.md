---
title: Confidential containers security policy Azure Kubernetes Service 
description: Understand the Security Policy that's implemented to provide self-protection of the container hosted on Azure Kubernetes Service
ms.topic: conceptual
ms.author: magoedte
author: mgoedtel
ms.service: container-instances
services: container-instances
ms.date: 10/25/2023
---

# Confidential containers security policy Azure Kubernetes Service 

As described by the Confidential Computing Consortium (CCC), *"Confidential Computing is the protection of data in use by performing computation in a hardware-based, attested Trusted Execution Environment (TEE)."* AKS Confidential Containers are designed to protect Kubernetes pods data in use from unauthorized access from outside of these pods. Each pod gets executed in a Confidential Virtual Machine (CVM) that is protected by the [AMD SEV-SNP TEE](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/white-papers/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf) by encrypting data in use and preventing the Host Operating System (OS) from accessing that data. Microsoft engineers collaborated with the [Confidential Containers](https://github.com/confidential-containers) (CoCo) and [Kata Containers](https://github.com/kata-containers/) open-source communities on the design and implementation of the Confidential Containers.  

## Security policy overview

One of the main components of the [Kata Containers system architecture](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/history.md#kata-2x-architecture) is the [Kata agent](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md#agent). When using Kata Containers to implement Confidential Containers, the agent is executed inside the hardware-based TEE and therefore is part of the pod's Trusted Computing Base (TCB). As shown in the high-level diagram below, the Kata agent provides a set of [ttrpc](https://github.com/containerd/ttrpc) APIs allowing the system components outside of the TEE to create and manage CVM-based Kubernetes pods. These other components (for example, the Kata Shim) are not part of the pod's TCB, therefore the agent must protect itself from potentially buggy or malicious API calls.

In AKS Confidential Containers, the Kata agent API self-protection is implemented using a Security Policy (also known as the Kata *agent Policy*), specified by the owners of the confidential pods. The Policy document contains rules and data corresponding to each pod, using the industry standard [Rego policy language](https://www.openpolicyagent.org/docs/latest/policy-language/). The enforcement of the Policy inside the CVM is implemented using the [Open Policy agent](https://www.openpolicyagent.org/) – a Graduated project of the [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF).

:::image type="content" source="media/concept-confidential-containers-security-policy/security-policy-architecture-diagram.png" alt-text="Diagram of the AKS Confidental Containers Security Policy model.":::

## Policy contents

The Security Policy describes all the calls to agent’s ttrpc APIs (and the parameters of these API calls) that are expected for creating and managing the Confidential pod. The Policy document of each pod is a text file, using the Rego language. There are three high-level sections of the policy document.

### Data

The Policy data is specific to each pod. It contains, for example:

* A list of Containers that are expected to be created in the pod.
* A list of APIs that are blocked by the Policy by default (for confidentiality reasons). However, a user can choose to enable for their pod, for example an AKS Confidential Containers user could enable the ReadStream API of the agent, to be able to collect pod logs remotely.

Examples of data included in the Policy document for each of the Containers in a pod:

* Image integrity information.
* Command line.
* Storage volumes and mounts.
* Execution security context – e.g., is the root file system read-only?
* Is the process allowed to gain new privileges?
* Environment variables.
* Other fields from the Open Container Initiative (OCI) container runtime configuration.

### Rules

The Policy rules, specified in Rego format, get executed by OPA for each Kata agent API call from outside of the CVM. The agent provides all API inputs to OPA, and OPA uses the rules to check if the inputs are consistent with Policy data. If the API inputs are not allowed by the Policy rules and data, the agent rejects the API call by returning a "blocked by policy" error message. Examples of rules:

* Each container layer is exposed as a read-only [virtio block](https://docs.oasis-open.org/virtio/virtio/v1.1/cs01/virtio-v1.1-cs01.html#x1-2390002) device to the CVM. The integrity of those block devices is protected using the [dm-verity](https://docs.kernel.org/admin-guide/device-mapper/verity.html) technology of the Linux kernel. The expected root value of the dm-verity [hash tree](https://docs.kernel.org/admin-guide/device-mapper/verity.html#hash-tree) is included in the Policy data, and verified at runtime by the Policy rules.
* Container creation is rejected by the rules when an unexpected command line, storage mount, execution security context, or environment variable is detected.

By default, the Policy [rules](https://github.com/microsoft/kata-containers/blob/2795dae5e99bd918b7b8d0a9643e9a857e95813d/src/tools/genpolicy/rules.rego#L37) are common to all pods. The Policy data used by these rules is generated by the tool described below and is specific to each pod.

### Default values

When evaluating the Rego rules using the Policy data and API inputs as parameters, OPA tries to find at least one set of rules that return value true given the input data. If the rules don’t return true, OPA returns to the agent the default value for that API. Examples of default values from the Policy:

* `default CreateContainerRequest := false` – means that any CreateContainer API call will be rejected unless a set of Policy rules explicitly allow that call.

* `default GuestDetailsRequest := true` – means that calls from outside of the TEE to the GuestDetails API are always allowed – because the data returned by this API is not sensitive for Confidentiality of the customer workloads.

## Sending the Policy to Kata agent

All AKS Confidential Containers CVMs start up by using a generic, default Policy that is included in the CVMs root file system. Therefore, a Policy that matches the actual customer workload must be provided to the agent at run time. The policy text is embedded in customer’s YAML file as described above and is provided that way to the agent early during CVM initialization. The Policy annotation travels though the kubelet, containerd, and [Kata shim](https://github.com/kata-containers/kata-containers/blob/main/src/runtime/cmd/containerd-shim-kata-v2) components of the AKS Confidential Containers system. Then the agent working together with OPA enforces the policy for all the calls to its own APIs.

The policy is provided using components that are not part of customer’s TCB, so initially this policy is not trusted. The trustworthiness of the policy must be established through Remote Attestation, as described below.

## Establish trust in the Policy document

Before creating the Pod CVM, the Kata shim computes the SHA256 hash of the Policy document and attaches that hash value to the TEE. That action creates a strong binding between the contents of the Policy and the CVM. This TEE field cannot be modified later by either the software executed inside the CVM, or outside of it.

Upon receiving the Policy, the agent verifies that that the hash of the Policy matches the immutable TEE field above. The agent rejects the incoming Policy if it detects a hash mismatch.

Before handling sensitive information, customers’ workloads must perform Remote Attestation steps, to prove to any Relying Party that the workload is executed using the expected versions of the TEE, OS, agent, OPA, and root file system versions. Attestation is implemented in a Container running inside the CVM, that obtains signed attestation evidence from the AMD SEV-SNP hardware. One of the fields from the attestation evidence is the Policy hash TEE field described above. Therefore, the Attestation service can verify the integrity of the Policy, by comparing the value of this field with the expected hash of the pod Policy.

## Policy enforcement

The Kata agent is responsible for enforcing the Policy. Microsoft contributed to the Kata/CoCo community the agent code responsible for checking the Policy for each agent ttrpc API call. Before carrying out the actions corresponding to the API, the agent uses the OPA REST API to check if the Policy rules and data allow or block the call.

## Next steps

[Deploy a confidential container on AKS](use-confidential-containers.md)
