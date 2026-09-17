---
title: Attest a Linux workload with dm-verity and IMA
description: Learn how to measure a read-only workload image with dm-verity and Linux IMA and use confidential VM attestation to verify the measurements.
author: fmazilu_microsoft
ms.author: fmazilu
ms.service: azure-confidential-computing
ms.topic: how-to
ms.date: 09/14/2026
# Customer intent: As a developer using Linux confidential VMs, I want to verify the identity of a read-only workload image before authorizing access to protected resources.
---

# Attest a Linux workload with dm-verity and IMA

**Applies to:** :heavy_check_mark: Linux VMs

[Guest attestation](guest-attestation-confidential-vms.md) helps you verify that an Azure confidential virtual machine (VM) runs in a hardware-based trusted execution environment. To evaluate a workload image inside the VM, you also need measurements that identify that image.

This article describes how to combine Linux device-mapper verity (dm-verity), Integrity Measurement Architecture (IMA), and the VM's virtual Trusted Platform Module (vTPM). You prepare an approved, read-only workload image, measure its device-mapper configuration, and collect evidence that a relying party can use to compare the measured image with the approved image.

> [!NOTE]
> This procedure covers guest configuration, evidence collection, and verification requirements using Microsoft Azure Attestation (MAA) as the verifier. It doesn't provide a complete MAA client implementation or an attestation policy for extracting a dm-verity root digest. Verifying the VM environment through guest attestation doesn't by itself establish that a workload image is approved.

## How workload measurement works

The following mechanisms serve different purposes:

| Mechanism | Purpose |
| --- | --- |
| dm-verity | Checks filesystem blocks against a Merkle tree rooted in an approved digest and rejects corrupted data. |
| IMA measurement | Records device-mapper configuration changes in a runtime measurement log and extends measurements into a TPM platform configuration register (PCR), typically PCR 10. |
| TPM quote | Signs the selected PCR state and a fresh challenge from the relying party. |
| Confidential VM attestation | Establishes trust in the vTPM attestation key through the VM's hardware-backed evidence. |

dm-verity enforces integrity locally. IMA provides evidence for remote verification. PCR 10 doesn't contain the dm-verity root digest directly. It accumulates measurements from an ordered log that includes the device-mapper configuration.

The relying party uses the verifier's signed results to compare the measured root digest with an independently approved value.

## Prerequisites

- A [Linux confidential VM](quick-create-confidential-vm-portal.md) with a vTPM and administrative access. Use a test VM to evaluate the configuration before incorporating it into your guest image.
- A guest kernel configured for IMA, IMA critical-data measurement, device-mapper IMA measurement, and dm-verity. Confirm that the guest exposes the IMA policy and measurement-log interfaces under `securityfs`. Kernel version alone doesn't establish that these features are enabled.
- The [veritysetup utility](https://man7.org/linux/man-pages/man8/veritysetup.8.html), [tpm2-tools](https://github.com/tpm2-software/tpm2-tools), and filesystem utilities installed where you run the corresponding commands.
- A read-only workload filesystem image, such as an unmounted ext4 image, and a separate file for its hash tree.
- A trusted build and signing process for approving workload images. Keep the private signing key outside the VM.
- A [Microsoft Azure Attestation (MAA) provider](/azure/attestation/overview) to act as the verifier. This flow requires validation of confidential VM evidence, TPM quotes, and binary IMA measurement logs, including the `ima-buf` template. MAA is the evidence verifier; the relying party, such as a release broker, validates MAA's signed results and authorizes access.

Review the [guest attestation design](guest-attestation-confidential-virtual-machines-design.md) for the hardware-backed trust chain and attestation key. The quote example in this article assumes that IMA extends PCR 10 in the SHA-256 bank. Select the PCR and bank used by your guest if its configuration differs.

Replace all angle-bracketed placeholders in the commands with your own values.

## Build and approve the workload image

Run this step in your trusted build environment, before deploying the image to the VM.

1. Finish building the workload filesystem and unmount it. Don't modify it after generating the hash tree.

1. Create the hash tree and record the output from `veritysetup format`:

    ```bash
    veritysetup format "<data-image>" "<hash-image>" \
      --no-superblock \
      --format=1 \
      --hash=sha256 \
      --data-block-size=4096 \
      --hash-block-size=4096 \
      --hash-offset=0
    ```

    Use a separate hash-image file that doesn't contain data you need to retain. Record the root hash, salt, and data-block count from the output. This example uses format version 1, SHA-256, 4,096-byte data and hash blocks, and a hash offset of zero bytes.

1. Calculate cryptographic hashes of the completed filesystem image and hash-tree file:

    ```bash
    sha256sum "<data-image>" "<hash-image>"
    ```

1. Create an approval manifest containing the image hashes and sizes, root digest, salt, dm-verity format version, hash algorithm, block sizes, data-block count, and hash offset. Include the expected workload mapping name and your release validity requirements.

1. Sign the manifest through your workload-approval process. Configure the guest's trusted launcher and the verifier with the public key or certificate needed to verify that signature.

A root digest identifies an image; it doesn't establish that the image is approved. The verifier must obtain its approval policy independently of the guest.

## Load the IMA measurement policy

Run the remaining guest-side commands inside the confidential VM, not in Azure Cloud Shell.

1. Mount `securityfs` if it isn't already mounted:

    ```bash
    sudo mountpoint -q /sys/kernel/security || \
      sudo mount -t securityfs securityfs /sys/kernel/security
    ```

1. Create the measurement policy:

    ```bash
    sudo mkdir -p /etc/ima
    sudo tee /etc/ima/workload-policy >/dev/null <<'EOF'
    measure func=CRITICAL_DATA label=device-mapper template=ima-buf
    measure func=BPRM_CHECK mask=MAY_EXEC
    measure func=FILE_MMAP mask=MAY_EXEC
    EOF
    ```

    The `CRITICAL_DATA` rule measures device-mapper configuration. The execution rules add measurements for programs and executable file mappings; they don't replace the device-mapper rule. If your image already has an IMA policy, integrate these rules into that policy rather than replacing it with this example.

1. Load the policy before opening the workload mapping:

    ```bash
    sudo sh -c \
      'cat /etc/ima/workload-policy > /sys/kernel/security/ima/policy'
    ```

> [!IMPORTANT]
> IMA policy is kernel state and must be loaded on every boot. For a deployed image, load it through your trusted boot or initialization process before any workload mappings are created. Unless `CONFIG_IMA_WRITE_POLICY` is enabled, the kernel accepts only one custom policy load per boot. Don't continue if the policy fails to load.

Loading a policy doesn't measure an existing mapping retroactively. If you opened the workload mapping before loading the policy, stop the workload, unmount and close the mapping, and then open it again after the policy is active.

## Verify and activate the approved image

Deploy the filesystem image, hash-tree file, and signed approval manifest to the VM.

1. Verify the manifest signature using the trusted approval key and enforce your release validity requirements. Before using any manifest values, reject invalid signatures, expired approvals, and releases that your policy no longer allows.

1. Verify the complete image files against the hashes and sizes in the signed manifest. Stop if either file doesn't match.

1. Open the dm-verity mapping with the approved parameters. This command uses the format, algorithm, block sizes, and offset from the build example. Replace the root digest, data-block count, and salt with the verified manifest values.

    > [!CAUTION]
    > The `--panic-on-corruption` option causes a guest kernel panic if dm-verity detects corrupted data. Evaluate the availability impact before using this option in production.

    ```bash
    sudo veritysetup open \
      "<data-image>" approved-workload "<hash-image>" "<root-digest>" \
      --no-superblock \
      --format=1 \
      --hash=sha256 \
      --data-block-size=4096 \
      --hash-block-size=4096 \
      --data-blocks="<data-block-count>" \
      --hash-offset=0 \
      --salt="<salt>" \
      --panic-on-corruption
    ```

1. Mount the resulting read-only mapping:

    ```bash
    sudo mkdir -p /opt/approved-workload
    sudo mount -o ro,nodev,nosuid \
      /dev/mapper/approved-workload /opt/approved-workload
    ```

    Start the workload only through your trusted launcher, using files from this mount. Keep writable application data on a separate filesystem.

1. Check for the device-mapper table-load event:

    ```bash
    sudo grep dm_table_load \
      /sys/kernel/security/integrity/ima/ascii_runtime_measurements
    ```

    The event uses the `ima-buf` template and is named `dm_table_load`, not `device-mapper`. Its buffer contains fields such as `name=approved-workload`, `target_name=verity`, and `root_digest=<digest>`. The ASCII log displays the buffer as hexadecimal data. See the Linux kernel [device-mapper IMA documentation](https://docs.kernel.org/admin-guide/device-mapper/dm-ima.html) for the event format.

This local check confirms that a measurement was recorded; it isn't remote verification. A `dm_table_load` event records a table being loaded, not proof that a process is running from it.

## Collect the attestation evidence

Obtain a fresh, unpredictable challenge from the relying party. The relying party must retain the challenge, enforce its expiration, and accept it only once.

1. Use the VM's existing vTPM attestation key to quote PCR 10. In this example, `<nonce-hex>` is the hexadecimal encoding of the relying party's challenge:

    ```bash
    sudo tpm2_readpublic -c 0x81000003 -f pem -o ak-public.pem

    sudo tpm2_quote \
      -c 0x81000003 \
      -l sha256:10 \
      -q "<nonce-hex>" \
      -m quote.msg \
      -s quote.sig \
      -o quote.pcrs \
      -g sha256
    ```

    The attestation-key handle is documented in the [guest attestation design](guest-attestation-confidential-virtual-machines-design.md#azure-reserved-tpm-nv-indexes). Don't substitute a newly created, unendorsed TPM key.

1. Collect the binary IMA log:

    ```bash
    sudo cat /sys/kernel/security/integrity/ima/binary_runtime_measurements \
      > ima-log.bin
    ```

1. Submit the quote, signature, quoted PCR values, attestation-key public material, and binary IMA log to MAA through an attestation client. Include the [vTPM evidence and endorsements](guest-attestation-confidential-virtual-machines-design.md#vtpm-evidence) needed to establish trust in the quoting key, such as its certificate, the hardware report, and the hardware vendor certificate chain.

Include boot PCRs and the corresponding TCG event log when your verifier's policy evaluates guest boot state. The TCG boot log doesn't replace the IMA runtime log.

IMA can append events while you collect the evidence. The verifier must find a log prefix that reproduces the quoted PCR value and evaluate only events covered by that quote. If no matching prefix exists, collect fresh evidence; don't ignore the mismatch.

## Verify the workload evidence

MAA evidence verification and the relying party's authorization logic must together complete the following checks before access is granted:

1. Validate the confidential VM evidence and its trust chain. Confirm that the public key used to verify the quote is the same vTPM attestation key endorsed by that evidence. Apply your policy for the guest boot state, kernel, IMA policy, and trusted launcher.
1. Validate the quote signature, PCR selection, PCR digest, and challenge against the relying party's outstanding request. A quote over other PCRs doesn't authenticate PCR 10.
1. Parse the ordered binary IMA log, validate template and buffer digests, and replay the measurements for the selected PCR bank. Require a match with the quoted PCR 10 value. Replaying supplied digest fields without validating the associated event data isn't sufficient.
1. Have the relying party verify the approval manifest's signature and release validity using its trusted approval key and policy. Require MAA-validated measurements identifying the expected workload mapping with `target_name=verity`. Compare its root digest and security-relevant dm-verity parameters with the verified manifest. Reject configurations that bypass corruption checks.
1. Enforce the expected number and identity of workload mappings. Evaluate subsequent device-mapper events, including table changes, resume, removal, and rename events. Finding an approved root in one historical table-load event doesn't establish that the approved table is active.
1. Reject missing, malformed, unsupported, or ambiguous evidence. If platform and workload evidence are validated separately, require both results to identify the same vTPM attestation key and bind them to the same fresh attestation transaction.

For local troubleshooting of the quote signature and PCR digest, you can use `tpm2_checkquote`. This command doesn't submit evidence to MAA:

```bash
tpm2_checkquote \
  -u ak-public.pem \
  -m quote.msg \
  -s quote.sig \
  -f quote.pcrs \
  -g sha256 \
  -q "<nonce-hex>"
```

Use the public key whose endorsement you validated and the challenge retained by the relying party, not values trusted solely because the guest supplied them. This command doesn't validate the confidential VM trust chain, replay the IMA log, or approve a workload.

## Security considerations

- **Trust the measurement environment.** Hardware isolation doesn't by itself establish that the guest kernel, IMA policy, or workload launcher is approved. Protect these components as part of the guest image and evaluate them through your attestation policy.
- **Distinguish measurement from execution.** A measured dm-verity configuration identifies a table at measurement time. Your trusted launcher must ensure that the intended workload uses that mapping, can't replace it, and can't load unapproved code from writable locations. A fresh quote doesn't guarantee that state remains unchanged afterward.
- **Distinguish measurement from appraisal.** IMA measurement records events; it doesn't reject unsigned executables. IMA appraisal is a separate, optional local control that can enforce file signatures, including for code on writable filesystems. It requires trusted certificates, signed files, appraisal rules, and enforcement configuration. It doesn't replace dm-verity or remote evidence verification.
- **Bind access to the attested guest.** Release secrets or authorize requests only after platform and workload checks succeed. Bind any subsequent protected exchange to the attested guest and intended recipient key; a valid quote alone doesn't secure that exchange.

## Troubleshoot measurement collection

| Symptom | Action |
| --- | --- |
| The IMA policy or log interface is missing. | Confirm that `securityfs` is mounted and the running kernel has the required IMA and device-mapper measurement support. |
| The kernel rejects the policy. | Check the kernel audit messages for the rejected rule. Confirm whether a custom policy was already loaded and whether the kernel allows additional policy writes. |
| No `dm_table_load` event appears. | Confirm that the device-mapper rule was active before opening the mapping. Look for the event name, not the policy label. Don't authorize the workload without its evidence. |
| The log doesn't reproduce the quoted PCR value. | Check the PCR bank, binary log format, and completeness of the log. Account for measurements added during collection and request fresh evidence when needed. |

## Next steps

- [Understand the confidential VM guest attestation design](guest-attestation-confidential-virtual-machines-design.md).
- [Use virtual TPMs in Azure confidential VMs](how-to-leverage-virtual-tpms-in-azure-confidential-vms.md).
- [Learn about TPM attestation and Linux IMA](/azure/attestation/tpm-attestation-concepts).
