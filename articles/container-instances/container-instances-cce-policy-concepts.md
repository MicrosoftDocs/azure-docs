---
title: Confidential containers Azure Confidential Container Instances
description: Learn more about confidential container groups. 
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 02/28/2023
ms.custom: "seodec18, mvc"
---

# Confidential containers on Azure Contain Instances

This article introduces how confidential containers on Azure Container Instances can enable you to secure your workloads running in the cloud. This article will contain a detailed explanation of the  technical features that support confidential containers on Azure Container Instances. 

## Confidential workloads in the cloud

To discuss what is required to run confidential workloads in a cloud environment like Azure, we first need to discuss what is required to run confidential workloads in an environment that you fully control. From that basis, we can build an understanding of the various attributes any confidential solution must provide.

### Isolation and Trust

**Isolation** is a key concept when talking about confidential computing. It is important to ensure that a computational environment is isolated such that is isn't observable or can't be tampered with by external parties.

One might imagine that a server which only we have access to would be a good isolated environment. After all, if no one who "can't be trusted" can access the machine then we should in theory be in good shape. There's a couple very important topics buried in that last sentence: "trust" and "machine access". We'll cover "trust" later. For now, let's talk about what "machine access" means in terms of isolation.

A program running on a machine that is only running a single operating system is isolated on the machine. In practical terms that means that while an attacker can use other processes being run by the operating system (and which can access the memory of the entire machine) to attack that program, they must first gain access to the machine itself. That access could come by accessing it from within a datacenter, or it could come by accessing the machine over a network. Regardless, the machine/operating system is our isolation boundary. If you are on the operating system, you can access the confidential data.

If we want to remove access over the network as a means of traversing the isolation boundary, we can use a technique you may have heard of called **air-gapping**. An air-gapped machine has been disconnected from the network such that its isolation boundary can't be breached over a network and can only be breached "physically" via access to the machine itself. A machine that is air-gapped in this way is often trusted for use with confidential data.

Depending on your background, you may have read the previous paragraph and thought, "that sounds about right", except really, it wasn't. Neither was it all that wrong. Let's leave the topic of isolation for a moment and talk about **trust**. There's a term we use in conversations about computer secrurity: the **Trusted Computing Base** or TCB for short. A trusted computing base is everything that is critical to the security of our system. So, if there is a bug or a vulnerability found in a component on the TCB then all security properties of the system are in jeopardy. Anything that is "in the TCB" is something that if it is compromised then our data might have been compromised as well.

Let's return to our air-gapped computer from above. All of the hardware for the computer is in our TCB, we are relying on it not being compromised, ditto all the firmware, the operating system running on the machine, and all the programs running on the computer. For example, if the computer had WiFi hardware that was off, a compromised operating system could activate that wirelss networking hardware and exfiltrate data from our air-gapped system. It's an amusing aspect of computer security conversations that "trusted" means "the things that can hurt us". In general, the smaller our TCB, the better, because there are fewer things that can be compromised and hurt us.

So, in a standard non-confidential cloud environment, what's in our TCB? Quite a lot actually. A non-exhaustive list includes:

- the hardware and associated firmware we are running on
- all cloud operators who have administrative access to the hardware
- the hypervisor that manages running multiple virtual machines on a single physical machine
- operating system software

That's a lot of stuff we are trusting in and, as we said, it's non-exhaustive.

There's another isolation concept that we need to introduce at this time, the Trusted Execution Environment or TEE. The goal of a TEE is to isolate workloads from the host system in order to protect them against manipulation whilst running. Most CPU architectures provide secure environments, typically called enclaves, which run in parallel with the underlying host operating system. As such, the Trusted Computing Base (TCB) contains the required hardware which provides the needed security capabilities and the software to utilize it to maintain the guarantees of the TEE. By running a program or some set of programs within a TEE, we can isolate the program from the host operating system. TEE's allow us to reduce the size of our TCB which in the backwards world of computer security, "the less we trust, the better it all is". While each TEE architecture has its own idiosyncrasies, there are desirable qualities which increase their utility:

- *Small TCB*: Minimizing the TCB is essential to reduce the attack surface of the TEE.
- *Strong Isolation*: The enclaves must be isolated from the host at all times, including the register state and memory.
- *Attestable State*: The boot-up process and state of the TEE must be verifiable using attestation.

As you'll see later, a TEE is a key part of how Confidential ACI provides you with a secure environment for doing confidential computation. Also, did you notice we slipped a new term in on you?


### Threat Model

Confidential ACI is designed to resist a strong adversary who controls the entire host system software, including the hypervisor and the host operating system along with all services running within it. 

Such an adversary can:
- tamper with the container's OCI runtime specification
- tamper with block devices storing the read-only container image layers and the writeable scratch layer
- tamper with container definitions, including the overlay filesystem (*i.e.*, changing the order or injecting rogue layers), adding, altering, or removing environment variables, altering the user command, and the mount sources and destinations from the utility VM
- add, delete, and make arbitrary modifications to network messages, *i.e.*, fully control the network
- request execution of arbitrary commands in the utility VM and in individual containers
- request debugging information from the utility VM and running containers, such as access to I/O, the stack, or container properties

These capabilities provide the adversary with the ability to gain access to the address space of the guest operating system. As such, Confidential ACI relies on trusted hardware that provides isolation of the guest's address space from the system software. We also trust the measurements of the guest VM provided by this trusted hardware.

### Security Guarantees

Under the threat model presented above, we wish to provide strong confidentiality and integrity guarantees for the container and for customer data. The provided security guarantees are based on the following principles:

#### Hardware-based Isolation of the utility VM

The memory address space and disks of the VM must be protected from the host and other VMs by hardware-level isolation. Confidential ACI relies on the SEV-SNP hardware guarantee that the memory address space of the utility VM cannot be accessed by host system software.

#### Integrity-protected Filesystems

Any block device or blob storage is mounted in the utility VM as an integrity-protected file system. The file system driver enforces integrity checking upon an access to the file system, ensuring that the host system software cannot tamper with the data and container images. In Confidential ACI, a container file system is expressed as an ordered sequence of layers, where each layer is mounted as a separate device and then assembled into an overlay filesystem. First, Confidential ACI verifies as each layer is mounted that the dm-verity root hash for the device matches a layer that is enumerated in the policy. Second, when the container-shim requests the mounting of an overlay filesystem that assembles multiple layer devices, Confidential ACI verifies that the specific ordering of layers is explicitly laid out in the execution policy for one or more containers.

#### Encrypted Filesystems

Any block device or blob storage that holds privacy-sensitive data should be mounted as an encrypted filesystem. When an encrypted filesystem is used to protect sensitive data, the filesystem driver decrypts the memory-mapped block upon an access to the filesystem. The decrypted block is stored in hardware-isolated memory space, ensuring that host system software cannot access the plaintext data. The writable scratch space of the container is mounted with [`dm-crypt`](https://gitlab.com/cryptsetup/cryptsetup/-/wikis/DMCrypt) and [`dm-integrity`](https://gitlab.com/cryptsetup/cryptsetup/-/wikis/DMIntegrity), and this is enforced by the execution policy. The encryption key for the writeable scratch space is ephemeral and is provisioned initially in hardware-protected memory and erased once the device is mounted.

#### Measurement

The utility VM, its operating system and the guest agent are crytographically measured during initialization by the TEE and this measurement can be requested over a secure channel at any time by user containers. The AMD SEV-SNP hardware performs the measurement and encodes it in the signed attestation report.

#### Verifiable Execution Policy

Confidential ACI provides users with a mechanism to verify that the active execution policy in a container group is what they expect it to be. The execution policy is defined and measured independently by the user and it is then provided to the Confidential ACI deployment system. The host measures the policy (using SHA-512) and places this measurement in the immutable `host data` of the attestation report. The policy itself is passed to the utility VM by the container-shim, where it is measured again to ensure that its measurement matches the one encoded as `host data` in the report.

#### Remote Attestation

Remote verifiers (tenants, external services, attestation services) need to verify an attestation report so that they can establish trust in a secure communication channel with the container group running within the utility VM.
In particular, remote verifiers need to to verify that the utility VM has booted the expected operating system, the correct guest agent, and further that the guest agent is configured with the expected execution policy.

In Confidential ACI, the utility VM (including privileged containers) can request an attestation report using the secure channel established between the PSP and the utility VM. The requester generates an emphemeral token (TLS public key pair or a sealing/wrapping public key) which is presented as a runtime claim in the report; the token's cryptographic digest is encoded as `report data` in the report. A remote verifier can then verify that:

- the report has been signed by a genuine AMD processor using a key rooted to AMD's root certificate authority
- the `guest launch measurement` and `host data` match the expected VM measurement and the digest of the expected execution policy
- the `report data` matches the hash digest of the runtime claim presented as additional evidence.

Once the verification completes, the remote verifier that trusts the utility VM (including the guest OS, guest agent and the execution policy) trusts that the utility VM and the container group running with it will not reveal the private keys from which the public tokens have been generated, *e.g.*, TLS private key, sealing/wrapping private key. The remote verifer can utilize the runtime claim accordingly. For instance:

- a TLS public key can be used for establishing a TLS connection with the attested container group. As such, the remote verifier can trust there is no replay or man-in-the-middle attack.
- a sealing public key can be used to seal (via encryption) a request or response intended only for the attested containers
- a wrapping public key can be used by a key management service to wrap and release encryption keys required by the VM's container group for decrypting encrypted remote blob storage. As such, the remote verifier can trust that only trustworthy and attested container groups can unwrap the encryption keys.

#### Execution policy

Under the Confidential ACI threat model, the container-shim is not trusted as it could be under the control of an attacker. This implies that any action which the container-shim requests the guest-agent undertake inside the utility VM is suspect. Even if the current state of the container group is valid, there is no guarantee that the host will not compromise it in the future, and thus no way for the attestation report to be used as a gate on access to secure customer data. The attestation report on its own simply records that the utility VM OS, the guest agent, and the container runtime versions in use. It is not able to make any claims about the container group the host will subsequently orchestrate.

For example, the host can start the user container group in a manner which is expected by an attestation service until such time as it acquires some desired secure information, and then load a series of containers which open the container group to a remote code execution attack. The attestation report, obtained during initialization, cannot protect against this. Even updating it via providing additional runtime data to the PSP does not help, because the vulnerability is added by the host after the attestation report has been consumed by the external service.

To address this vulnerability, Confidental ACI requires users to provide an `execution policy`. Execution policies are authored by the user (probably with the help of tooling provided by ACI). An execution policy describes what actions the guest-agent is allowed to take throughout the lifecycle of the container group. The guest-agent consults this policy before taking any of the actions in the enforcement points table below.  Each action has a corresponding enforcement point in the execution policy which will either allow or deny the action.

Confidential ACI execution policies are implemented using the [Rego policy language](https://www.openpolicyagent.org/docs/latest/policy-language/)

| Action                         | Policy Information                                  |
| ------------------------------ | --------------------------------------------------- |
| Mount a device                 | device hash, target path                            |
| Unmount a device               | target path                                         |
| Mount overlay                  | ID, path list, target path                          |
| Unmount overlay                | target path                                         |
| Create container               | ID, command, environment, working directory, mounts |
| Execute process (in container) | ID, command, environment, working directory         |
| Execute process (in UVM)       | command, environment, working directory             |
| Shutdown container             | ID                                                  |
| Signal process                 | ID, signal, command                                 |
| Mount host device              | target path                                         |
| Unmount host device            | target path                                         |
| Mount scratch                  | target path, encryption flag                        |
| Unmount scratch                | target path                                         |
| Get properties                 | &mdash;                                             |
| Dump stacks                    | &mdash;                                             |
| Logging (in the UVM)           | &mdash;                                             |
| Logging (containers)           | &mdash;                                             |

Additional enforcement points can be added over time to lock down existing guest-agent functionality and to account for new guest-agent functionality.

#### Induction

The state machine starts as a system that is fully measured and attested, including the execution policy with all its enforcement points, with the root of trust being the PSP hardware ($n=1$). All possible transitions are described by the execution policy. Regardless of which ($n$) transitions have been taken after that, each of the enforcement point actions cannot break integrity or confidentiality without deliberate modification of the respective enforcement point, which would have had to happen before the initial measurement ($n+1$). Any sequence of such transitions therefore maintains integrity and confidentiality. Our enforcement points are carefully designed to maintain these properties. Note that confidentiality requires acceptance of the utility VM and the execution policy. That is, the end-user must verify that the attestation report they receive from Confidential ACI is bound to a utility VM and an execution policy that uses the end-user's data in a manner they accept.

## AMD Secure Encrypted Virtualization-Secure Nested Paging

In this section we provide an overview of AMD's SEV-SNP technology. To learn more, please refer to the [official specification](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf).

### Platform Security Processor

The Platform Security Processor firmware (PSP) implements the security environment for hardware-isolated VMs. The PSP provides a unique identity to the CPU by deriving the Versioned Chip Endorsement Key (VCEK) from chip-unique secrets and the current TCB version. The PSP also provides ABI functions for managing the platform, the life-cycle of a guest VM, and data structures utilized by the PSP to maintain integrity of memory pages.

### Memory Encryption

AMD Secure Memory Encryption (SME) is a general-purpose mechanism for main memory encryption that is flexible and integrated into the CPU architecture. It is provided via dedicated hardware in the on-die memory controllers that provides an Advanced Encryption Standard (AES) engine. This encrypts data when it is written to DRAM, and then decrypts it when read, providing protection against physical attacks on the memory bus and/or modules. The key used by the AES engine is randomly generated on each system reset and is not visible to any process running on the CPU cores. Instead, the key is managed entirely by the PSP. Each VM has memory encrypted with its own key, and can choose which data memory pages they would like to be private. Private memory is encrypted with a guest-specific key, whereas shared memory may be encrypted with a hypervisor key.

### Secure Nested Paging

The memory encryption provided by AMD-SEV is necessary but not sufficient to protect against runtime manipulation. In particular, it does not protect against *integrity attacks* such as:

- *Replay*": The attacker writes a valid past block of data to a memory page. This is of particular concern if the attacker knows the unencrypted data.
- *Data Corruption*: If the attacker can write to a page then even if it is encrypted they can write random bytes, corrupting the memory.
- *Memory Aliasing*: A malicious hypervisor maps two or more guest pages to the same physical page, such that the guest corrupts its own memory.
- *Memory Re-Mapping*: A malicious hypervisor can also map one guest page to multiple physical pages, so that the guest has an inconsistent view of memory where only a subset of the data it wrote appears.

### Reverse Map Table

The relationship between guest pages and physical pages is maintained by a structure called a Reverse Map Table (RMP). It is shared across the system and contains one entry for every 4k page of DRAM that may be used by VMs. The purpose of the RMP is to track the owner for each page of memory, and control access to memory so that only the owner of the page can write it. The RMP is used in conjunction with standard x86 page tables to enforce memory restrictions and page access rights. When running in an AMD SEV-SNP VM, the RMP check is slightly more complex. AMD-V 2-level paging (also called Nested Paging) is used to translate a Guest Virtual Address (GVA) to a Guest Physical Address (GPA), and then finally to a System Physical Address (SPA). The SPA is used to index the RMP and the entry is checked.

### Page Validation

Each RMP entry contains the GPA at which a particular page of DRAM should be mapped. While the nested page tables ensure that each GPA can only map to one SPA, the hypervisor may change these tables at any time. Thus, inside each RMP entry is a Validated bit, which is automatically cleared to zero by the CPU when a new RMP entry is created for a guest. Pages which have the validated bit cleared are not usable by the hypervisor or as a private guest page. The guest can only use the page after it sets the Validated bit via a new instruction, PVALIDATE. Only the guest is able to use PVALIDATE, and each guest VM can only validate its own memory. If the guest VM only validates the memory corresponding to a GPA once, then the injective mapping between GPAs and SPAs is guaranteed.

### Attestation

The PSP can issue hardware attestation reports capturing various security-related attributes, constructed or specified during initialization and runtime. Among other information, the resulting attestation report contains the `guest launch measurement`, the `host data`, and the `report data`.
The attestation report is signed by the VCEK.

### Initialization

During VM launch, the PSP initializes a cryptographic digest context used to construct the measurement of the guest. The hypervisor can insert data into the the guest's memory address space at the granularity of a page, during which the cryptographic digest context is updated with the data, thereby binding the measurement of the guest with all operations that the hypervisor took on the guest's memory contents. A special page is added by the hypervisor to the guest memory, which is populated by the PSP with an encryption key that establishes a secure communication channel between the PSP and the guest. Once the VM launch completes, the PSP finalizes the cryptographic digest which is encoded as the \textit{guest launch measurement} in the attestation report. The hypervisor may provide 256-bits of arbitrary data to be encoded as `host data` in the attestation report.

### Runtime

The PSP generates attestation reports on behalf of a guest VM. The request and response are submitted via the secure channel established during the guest launch, ensuring that a malicious host cannot impersonate the guest VM. Upon requesting a report, the guest may supply 512-bits of arbitrary data to be encoded in the report as `report data`.