---
  title: Frequently asked questions about the Azure Linux Container Host for AKS
  description: Find answers to some of the common questions about the Azure Linux Container Host for AKS.
  author: htaubenfeld
  ms.author: htaubenfeld
  ms.service: microsoft-linux
  ms.topic: faq
  ms.date: 12/12/2023
---

# Frequently asked questions about the Azure Linux Container Host for AKS

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article answers common questions about the Azure Linux Container Host.

## General FAQs

### What is Azure Linux?

The Azure Linux Container Host is an operating system image that's optimized for running container workloads on [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md). Microsoft maintains the Azure Linux Container Host and based it on Azure Linux (also known as *Mariner*), an open-source Linux distribution created by Microsoft.

### What are the benefits of using Azure Linux?

For more information, see the [Azure Linux Container Host key benefits](./intro-azure-linux.md#azure-linux-container-host-key-benefits).

### What's the difference between Azure Linux and Mariner?

Azure Linux and Mariner are the same image with different branding. Please use the Azure Linux OS SKU when referring to the image on AKS.

### Are Azure Linux container images supported on AKS?

The only supported container images are the Microsoft .NET and Open JDK container images based on Azure Linux. All other images are on a best effort community support basis in our [GitHub issues page](https://github.com/microsoft/CBL-Mariner/issues).

### What's the pricing for Azure Linux?

Azure Linux is available at no additional cost. You only pay for the underlying Azure resources, such as virtual machines (VMs) and storage.

### What GPUs does Azure Linux support?

Azure Linux supports the V100 and T4 GPUs.

### What certifications does Azure Linux have?

Azure Linux passes all CIS level 1 benchmarks and offers a FIPS image. For more information, see [Azure Linux Container Host core concepts](./concepts-core.md).

### Is the Microsoft Azure Linux source code released?

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

### How can I get help with Azure Linux?

Submit a [GitHub issue](https://github.com/microsoft/CBL-Mariner/issues/new/choose) to ask a question, provide feedback, or submit a feature request. Please create an [Azure support request](./support-help.md#create-an-azure-support-request) for any issues or bugs.

### How can I stay informed of updates and new releases?

We're hosting public community calls for Azure Linux users to get together and discuss new features, provide feedback, and learn more about how others use Azure Linux. In each session, we will feature a new demo. The schedule for the upcoming community calls is as follows:

| Date | Time | Meeting link |
| --- | --- | --- |
| 1/25/2024 | 8-9 AM PST | [Click to join](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NGM1YWZiMDMtYWZkZi00NzBmLWExNjgtM2RkMjFmYTNiYmU2%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%2230697089-15b8-4c68-b67e-7db9cd4f02ea%22%7d). |
| 3/28/2024 | 8-9 AM PST | [Click to join](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NGM1YWZiMDMtYWZkZi00NzBmLWExNjgtM2RkMjFmYTNiYmU2%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%2230697089-15b8-4c68-b67e-7db9cd4f02ea%22%7d). |
| 5/23/2024 | 8-9 AM PST | [Click to join](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NGM1YWZiMDMtYWZkZi00NzBmLWExNjgtM2RkMjFmYTNiYmU2%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%2230697089-15b8-4c68-b67e-7db9cd4f02ea%22%7d). |
| 7/25/2024 | 8-9 AM PST | [Click to join](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NGM1YWZiMDMtYWZkZi00NzBmLWExNjgtM2RkMjFmYTNiYmU2%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%2230697089-15b8-4c68-b67e-7db9cd4f02ea%22%7d). |
| 9/26/2024 | 8-9 AM PST | [Click to join](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NGM1YWZiMDMtYWZkZi00NzBmLWExNjgtM2RkMjFmYTNiYmU2%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%2230697089-15b8-4c68-b67e-7db9cd4f02ea%22%7d). |

## Cluster FAQs

### Is there a migration tool available to switch from a different distro to Azure Linux on Azure Kubernetes Service (AKS)?

Yes, the migration from another distro to Azure Linux on AKS is straightforward. For more information, see [Tutorial 3 - Migrating to Azure Linux](./tutorial-azure-linux-migration.md).

### Can an existing AKS cluster be updated to use the Azure Linux Container Host, or does a new cluster with the Azure Linux Container Host need to be created?

An existing AKS cluster can add an Azure Linux node pool with the `az aks nodepool add` command and specifying `--os-sku AzureLinux`. Once a node pool starts, it can coexist with another distro and work gets scheduled between both node pools. For detailed instructions see, [Tutorial 2 - Add an Azure Linux node pool to your existing cluster](./tutorial-azure-linux-add-nodepool.md).

### Can I use a specific Azure Linux version indefinitely?

You can decide to opt out of automatic node image upgrades and manually upgrade your node image to control what version of Azure Linux you use. This way, you can use a specific Azure Linux version for as long as you want.

### I added a new node pool on an AKS cluster using the Azure Linux Container Host, but the kernel version isn't the same as the one that booted. Is this intended?

The base image that AKS uses to start clusters runs about two weeks behind the latest packages. When the image was built, the latest kernel was booted when the cluster started. However, one of the first things the cluster does is install package updates, which is where the new kernel came from. Most updated packages take effect immediately, but in order for a new kernel to be used the node needs to reboot.

The expected pattern for rebooting is to run a tool like [Kured](https://github.com/weaveworks/kured), which monitors each node, then gracefully reboots the cluster one machine at a time to bring everything up to date.

## Update FAQs

### What is Azure Linux's release cycle?

Azure Linux releases major image versions every ~two years, using the Linux LTS kernel and regularly updating the new stable packages. Monthly updates with CVE fixes are also made.

### How do upgrades from one major Azure Linux version to another work?

When upgrading between major Azure Linux versions, a [SKU migration](./tutorial-azure-linux-migration.md) is required. In the next major Azure Linux version release, the osSKU will be a rolling release.

### When are the latest Azure Linux Container Host image/node image released?

New Azure Linux Container Host base images on AKS are built weekly, but the release cycle may not be as frequent. We spend a week performing end-to-end testing, and the image version may take a few days to roll out to all regions.

### Is it possible to skip multiple Azure Linux minor versions during an upgrade?

If you choose to manually upgrade your node image instead of using automatic node image upgrades, you can skip Azure Linux minor versions during an upgrade. The next manual node image upgrade you perform upgrades you to the latest Azure Linux Container Host for AKS image.

### Some packages (CNCF, K8s) have a more aggressive release cycle, and I don't want to be up to a year behind. Does the Azure Linux Container Host have any plans for more frequent upgrades?

The Azure Linux Container Host adopts newer CNCF packages like K8s with higher cadence and doesn't delay them for annual releases. However, major compiler upgrades or deprecating language stacks like Python 2.7x may be held for major releases.
