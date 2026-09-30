---
title: What SAP software is supported on Azure
description: Learn what SAP software is supported for deployment in Azure.
ms.assetid: d7c59cc1-b2d0-4d90-9126-628f9c7a5538
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.date: 02/10/2026
ms.author: juergent
author: msjuergent
manager: bburns
ms.custom: H1Hack27Feb2017, linux-related-content
# Customer intent: As an SAP administrator, I want to verify the supported SAP software and OS/DBMS requirements for deployment on Azure, so that I can ensure my SAP applications run efficiently and comply with the necessary specifications.
---

# What SAP software is supported for Azure deployments

This article describes how you can find out what SAP software is supported for Azure deployments and what the necessary operating system releases or DBMS releases are. When evaluating whether your current SAP software is supported in Azure and which OS and DBMS releases are compatible with it, you need certain information. To perform this evaluation, you must have access to:

- SAP support notes
- SAP Product availability Matrix

## General restrictions for SAP workload

Azure IaaS services that can be used for SAP workload are limited to x86-64 or x64 hardware. There's no Sparc or Power CPU based offers that apply to SAP workload. Customers who run their applications on operating systems tied to proprietary hardware architectures, such as IBM mainframe or AS400, or on HP‑UX, Solaris, or AIX, need to migrate. They must move their SAP applications, including the DBMS, to one of the following operating systems:

- Windows server 64bit for the x86-64 platform
- SUSE linux 64bit for the x86-64 platform
- Red hat Linux 64Bit for the x86-64 platform
- Oracle Linux 64bit for the x86-64 platform

In combination with SAP software, no other OS releases or Linux distributions are supported. Exact details on specific versions and cases are documented later in the document.

## Supported SAP Software on Azure

The starting point for you is [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533). As you go through this SAP note from top to bottom, several areas of supported software and VMs are shown.

The first section lists the minimum requirements for operating releases that are supported with SAP software in Azure VMs in general. If you aren't reaching those minimum requirements and run older releases of these operating systems, you need to upgrade your OS release to such a minimum release or even more recent releases. It's correct that Azure in general would support older releases of some of those operating systems. But the restrictions or minimum releases as listed are based on tests and qualifications executed and aren't going to be extended further back.

> [!NOTE]
> There are some specific VM types, HANA Large Instances, or SAP workloads that are going to require more recent OS releases. Cases like this are mentioned throughout the document, clearly documented either in SAP notes or other SAP publications.

The section following lists general SAP platforms that are supported with the releases that are supported and more important the SAP kernels that are supported. It lists NetWeaver/ABAP or Java stacks that are supported AND, which need minimum kernel releases. More recent ABAP stacks are supported on Azure, but they don't require minimum kernel releases. This is because the Azure‑related changes were implemented from the beginning of the development of these newer stacks.

You need to check:

- Whether the SAP applications you're running, are covered by the minimum releases stated. If not, you need to define a new target release, check in the SAP Product Availability Matrix, what operating system builds and DBMS combinations are supported with the new target release. So, that you can choose the right operating system release and DBMS release.
- Whether you need to update your SAP kernels in a move to Azure.
- Whether you need to update SAP Support Packages. Especially Basis Support Packages that can be required for cases where you're required to move to a more recent DBMS release.

The next section goes into more details on other SAP products and DBMS releases that SAP supports on Azure for Windows and Linux.

> [!NOTE]
>
> * The minimum releases of the different DBMS are carefully chosen and might not always reflect the whole spectrum of DBMS releases the different DBMS vendors support on Azure in general. Many SAP workload related considerations were taken into account to define those minimum releases. There's no effort to test and qualify older DBMS releases.
>
> * The minimum releases listed are representing older version of operating systems and database releases. We highly encourage that you use the most recent operating system and database releases. In many cases, more recent operating system and database releases took the usage case of running in public cloud into consideration and adapted code to optimize for running in public cloud or more specifically Azure.

## Oracle DBMS support

Operating system, Oracle DBMS releases and Oracle functionality supported on Azure are listed in [SAP support note #2039619](https://launchpad.support.sap.com/#/notes/2039619). Essence out of that note can be summarized like:

- Oracle 11g R2 patch set 3 (11.2.0.4) is the minimum Oracle release supported on Azure VMs certified for NetWeaver.
- As guest operating systems only Windows and Oracle Linux qualify. Exact releases of the OS and related minimum DBMS releases are listed in the note.
- The support of Oracle Linux extends to the Oracle DBMS client as well, meaning that all SAP components, like dialog instances of the ABAP or Java Stack need to run on Oracle Linux as well. Only SAP components within such an SAP system that wouldn't connect to the Oracle DBMS would be allowed to run a different Linux operating system.
- Oracle RAC isn't supported.
- Oracle ASM is supported for some of the cases. Details are listed in the note.
- Non-Unicode SAP systems are only supported with application servers running with Windows guest OS. The guest operating system of the DBMS can be Oracle Linux or Windows. Reason for this restriction is apparent when checking the SAP Product Availability Matrix (PAM). For Oracle Linux, SAP never released non-Unicode SAP kernels.

Knowing the DBMS releases supported on the targeted Azure infrastructure, you need to check the SAP Product Availability Matrix. This Matrix confirms whether the required OS and DBMS releases are supported with the SAP product releases you plan to run.

## Oracle Linux

Most prominent asked question around Oracle Linux is whether SAP supports the Red Hat kernel that's integral part of Oracle Linux as well. For details read [SAP support note #1565179](https://launchpad.support.sap.com/#/notes/1565179).

## Other database than SAP HANA

Support of non-HANA databases for SAP workload is documented in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533).

## SAP HANA support

In Azure there are two services, which can be used to run HANA database:

- Azure Virtual Machines
- [HANA Large Instances](/azure/virtual-machines/workloads/sap/hana-overview-architecture)

For running SAP HANA, SAP has more and stronger conditions infrastructure needs to meet than for running NetWeaver or other SAP applications and DBMS. As a result a smaller number of Azure VMs qualify for running the SAP HANA DBMS. The list of supported Azure infrastructure supported for SAP HANA can be found in the so called [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120).

> [!NOTE]
> The units starting with the letter "**S**" are [HANA Large Instances](/azure/virtual-machines/workloads/sap/hana-overview-architecture) units.

> [!NOTE]
> SAP has no specific certification dependent on the SAP HANA major releases. Contrary to common opinion, the column **Certification scenario** in the [HANA  certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120), the column makes **no statement about the HANA major or minor release certified**. You should assume that all listed units can be used for both HANA 1.0 and HANA 2.0. The corresponding HANA 1.0 releases support the certified operating system releases used by those units, which allows the assumption to hold.

For the usage of SAP HANA, different minimum OS releases may apply than for the general NetWeaver cases. You need to check out the supported operating systems for each unit individually as they might vary. You do so by clicking on each unit for more details. One of the details listed is the different operating systems supported for this specific unit.

> [!NOTE]
> Azure HANA Large Instance units are more restrictive with supported operating systems compared to Azure VMs. On the other hand Azure VMs may enforce more recent operating releases as minimum releases, which is especially true for some of the larger VM units that required changes to Linux kernels.

Knowing the supported operating systems for the Azure infrastructure, you need to check [SAP support note #2235581](https://launchpad.support.sap.com/#/notes/2235581). This note provides the exact SAP HANA releases and patch levels supported with the Azure units you're targeting.

> [!IMPORTANT]
> The step of checking the exact SAP HANA releases and patch levels supported is important. In many cases, support of a certain OS release is dependent on a specific patch level of the SAP HANA executables.

Once you know the specific HANA releases you can run on the targeted Azure infrastructure, you need to check the SAP Product Availability Matrix. This shows whether there are any restrictions with the SAP product releases that support the HANA releases you identified.

## Certified Azure VMs and HANA Large Instance units and business transaction throughput

Besides evaluating supported operating system releases, DBMS releases, and required SAP software releases for Azure infrastructure units, you also need to qualify these units by business transaction throughput. This throughput is expressed in the unit "SAP" by SAP. All the SAP sizing depends on SAPS calculations. Evaluating existing SAP systems, you usually can, with the help of your infrastructure provider, calculate the SAPS of the units. For the DBMS layer and for the application layer.

In other cases where new functionality is created, a sizing exercise with SAP can reveal the required SAPS numbers for the application layer and the DBMS layer. As infrastructure provider Microsoft is obliged to provide the SAP throughput characterization of the different units that are either NetWeaver and/or HANA certified.

For Azure VMs, these SAPS throughput numbers are documented in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533).
For Azure HANA Large Instance units, the SAPS throughput numbers are documented in [SAP support note #2316233](https://launchpad.support.sap.com/#/notes/2316233).

For [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533), the following remarks apply:

- **For M-Series Azure VMs and Mv2-Series Azure VMs, different minimum OS releases apply than for other Azure VM types**. The requirement for more recent OS releases is based on changes that operating system vendors needed to include in their releases to support running on specific Azure VM types. These updates also help optimize the performance and throughput of SAP workloads on those VM types.

- There are two tables that specify different VM types. The second table specifies SAPS throughput for Azure VM types that support Azure standard Storage only. DBMS deployment on the units specified in the second table of the note isn't supported.

## Other SAP products supported on Azure

In general the assumption is that with the state of hyperscale clouds like Azure, most of the SAP software should run without functional problems in Azure. Nevertheless and opposite to private cloud visualization, SAP still expresses support for the different SAP products explicitly for the different hyerpscale cloud providers. As a result there are different SAP support notes indicating support for Azure for different SAP products.

For Business Objects BI platform, [SAP support note #2145537](https://launchpad.support.sap.com/#/notes/2145537) gives a list of SAP Business Objects products supported on Azure. If you have questions about components or combinations of software and OS releases that aren't listed or supported, you should open an SAP support request. Make sure the request is created for the specific component where support is needed.

For Business Objects Data Services, [SAP support note #22288344](https://launchpad.support.sap.com/#/notes/2288344) explains minimum support of SAP Data Services running on Azure.

SAP Datahub/Vora support in Azure Kubernetes Services (AKS) is detailed in [SAP support note #2464722](https://launchpad.support.sap.com/#/notes/2464722).

Support for SAP BPC 10.1 SP08 is described in [SAP support note #2451795](https://launchpad.support.sap.com/#/notes/2451795).

> [!NOTE]
> As indicated in the SAP support note, you need to check in the SAP PAM to identify the correct support package level to be supported on Azure.

Support for SAP Hybris Commerce Platform on Azure is detailed in the [Hybris Documentation](https://help.sap.com/viewer/a74589c3a81a4a95bf51d87258c0ab15/1811/en-US/8c71300f866910149b40c88dfc0de431.html). As of supported DBMS for SAP Hybris Commerce Platform, it lists like:

- SQL Server and Oracle on the Windows operating system platform. Same minimum releases apply as for SAP NetWeaver. See [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533) for details.
- SAP HANA on Red Hat and SUSE Linux. SAP HANA certified VM types are required as documented earlier in the [SAP HANA support](#sap-hana-support) section. SAP (Hybris) Commerce Platform is considered OLTP workload.
- SQL Azure DB as of SAP (Hybris) Commerce Platform version 1811.

## Next steps

See next steps in [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
