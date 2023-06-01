---
  title: Frequently asked questions about the Azure Linux Container Host for AKS
  description: Find answers to some of the common questions about the Azure Linux Container Host for AKS.
  author: htaubenfeld
  ms.author: htaubenfeld
  ms.service: microsoft-linux
  ms.topic: faq
  ms.date: 05/10/2023
---

# Frequently asked questions about the Azure Linux Container Host for AKS

This article answers common questions about the Azure Linux Container Host.

## General FAQs

### Will the Microsoft Azure Linux source code be released?

Yes. Azure Linux is an open-source project with a thriving community of contributors. You can find the global Azure Linux source code at https://github.com/microsoft/CBL-Mariner.
  
### Does the deprecation of CentOS affect the use of Azure Linux as a container host?

No. Azure Linux isn't a downstream of CentOS, so the deprecation doesn't affect the use of Azure Linux as a container host. Azure Linux is RPM based, so much of the tooling like `dnf` that works on CentOS works for Azure Linux. Additionally, several package names are similar, which simplifies the migration process from CentOS to Azure Linux.

### What is the Service Level Agreement (SLA) for CVEs?

High and critical CVEs are taken seriously and may be released out-of-band as a package update before a new AKS node image is available. Medium and low CVEs are included in the next image release.

For more information on CVEs, see [Azure Linux Container Host for AKS core concepts](./concepts-core.md#cve-infrastructure).
      
### How does Microsoft notify users of new Azure Linux versions?

Azure Linux releases can be tracked alongside AKS releases on the [AKS release tracker](../../articles/aks/release-tracker.md).

### Does the Azure Linux Container Host support AppArmor?

No, the Azure Linux Container Host doesn't support AppArmor. Instead, it supports SELinux, which can be manually configured.

### How does Azure Linux read time for time synchronization on Azure?

For time synchronization, Azure Linux reads the time from the Azure VM host using [chronyd](../../articles/virtual-machines/linux/time-sync.md#chrony) and the /dev/ptp device.

## Cluster FAQs

### Is there a migration tool available to switch from a different distro to Azure Linux on Azure Kubernetes Service (AKS)?
Yes, the migration from another distro to Azure Linux on AKS is straightforward. See our [Tutorial 3 - Migrating to Azure Linux](./tutorial-azure-linux-migration.md) for more information.

### Can an existing AKS cluster be updated to use the Azure Linux Container Host, or does a new cluster with the Azure Linux Container Host need to be created?
An existing AKS cluster can add an Azure Linux node pool with the `az aks nodepool add` command and specifying `--os-sku AzureLinux`. Once a node pool is started, it can coexist with another distro and work will get scheduled between both node pools. For detailed instructions see, [Tutorial 2 - Add an Azure Linux node pool to your existing cluster](./tutorial-azure-linux-add-nodepool.md).

### Can I use a specific Azure Linux version indefinitely?
You can decide to opt out of automatic node image upgrades and manually upgrade your node image to control what version of Azure Linux you use. This way, you can use a specific Azure Linux version for as long as you want.

### I've added a new node pool on an AKS cluster using the Azure Linux Container Host, but the kernel version isn't the same as the one that booted. Is this intended?

The base image that AKS uses to start clusters runs about two weeks behind the latest packages. When the image was built, the latest kernel was booted when the cluster started. However, one of the first things the cluster does is install package updates, which is where the new kernel came from. Most updated packages take effect immediately, but in order for a new kernel to be used the node needs to reboot.

The expected pattern for rebooting is to run a tool like [Kured](https://github.com/weaveworks/kured), which will monitor each node, then gracefully reboot the cluster one machine at a time to bring everything up to date.

## Update FAQs

### What is Azure Linux's release cycle?

Azure Linux releases major image versions every ~two years, using the Linux LTS kernel and regularly updating the new stable packages. Monthly updates with CVE fixes are also made.

### How do upgrades from one major Azure Linux version to another work?
When you are upgrading between major Azure Linux versions, a [SKU migration](./tutorial-azure-linux-migration.md) is required. Moving forward, when the next major version of Azure Linux is released, the osSKU will be a rolling release.

### When will the latest Azure Linux Container Host image/node image be available?

New Azure Linux Container Host base images on AKS are built weekly, but the release cycle may not be as frequent. After spending a week in end-to-end testing, an image version may take a few days to roll out to all regions.

### Is it possible to skip multiple Azure Linux minor versions during an upgrade?
If you choose to manually upgrade your node image instead of using automatic node image upgrades, you can skip Azure Linux minor versions during an upgrade. The next manual node image upgrade you perform will upgrade you to the latest Azure Linux Container Host for AKS image.

### Some packages (CNCF, K8s) have a more aggressive release cycle, and I don't want to be up to a year behind. Does the Azure Linux Container Host have any plans for more frequent upgrades?

The Azure Linux Container Host adopts newer CNCF packages like K8s with higher cadence and doesn't delay them for annual releases. However, major compiler upgrades or deprecating language stacks like Python 2.7x may be held for major releases.