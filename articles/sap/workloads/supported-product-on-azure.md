---
title: 'SAP on Azure: What SAP software is supported on Azure'
description: Explains what SAP software is supported to be deployed on Azure
author: msjuergent
manager: bburns
tags: azure-resource-manager
ms.assetid: d7c59cc1-b2d0-4d90-9126-628f9c7a5538
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/02/2022
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# What SAP software is supported for Azure deployments
This article describes how you can find out what SAP software is supported for Azure deployments and what the necessary operating system releases or DBMS releases are.

Evaluating, whether your current SAP software is supported and what OS and DBMS releases are supported with your SAP software in Azure, you are going to need access to:

- SAP support notes
- SAP Product availability Matrix



## General restrictions for SAP workload
Azure IaaS services that can be used for SAP workload are limited to x86-64 or x64 hardware. There is no Sparc or Power CPU based offers that apply to SAP workload. Customers who run on their applications on operating systems proprietary to hardware architectures like IBM mainframe or AS400, or where the operating systems HP-UX, Solaris or AIX are in use, need to change their SAP applications including DBMS to one of the following operating systems:

- Windows server 64bit for the x86-64 platform
- SUSE linux 64bit for the x86-64 platform
- Red hat Linux 64Bit for the x86-64 platform
- Oracle Linux 64bit for the x86-64 platform

In combination with SAP software, no other OS releases or Linux distributions are supported. Exact details on specific versions and cases are documented later in the document.


## You start here
The starting point for you is [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533). As you go through this SAP note from top to bottom, several areas of supported software and VMs are shown

The first section lists the minimum requirements for operating releases that are supported with SAP software in Azure VMs in general. If you are not reaching those minimum requirements and run older releases of these operating systems, you need to upgrade your OS release to such a minimum release or even more recent releases. It is correct that Azure in general would support older releases of some of those operating systems. But the restrictions or minimum releases as listed are based on tests and qualifications executed and are not going to be extended further back. 


> [!NOTE]
>There are some specific VM types, HANA Large Instances or SAP workloads that are going to require more recent OS releases. Cases like that will be mentioned throughout the document. Cases like that are clearly documented either in SAP notes or other SAP publications.

The section following lists general SAP platforms that are supported with the releases that are supported and more important the SAP kernels that are supported. It lists NetWeaver/ABAP or Java stacks that are supported AND, which need minimum kernel releases. More recent ABAP stacks are supported on Azure, but do not need minimum kernel releases since changes for Azure got implemented from the start of the development of the more recent stacks

You need to check:

- Whether the SAP applications you are running, are covered by the minimum releases stated. If not, you need to define a new target release, check in the SAP Product Availability Matrix, what operating system builds and DBMS combinations are supported with the new target release. So, that you can choose the right operating system release and DBMS release
- Whether you need to update your SAP kernels in a move to Azure
- Whether you need to update SAP Support Packages. Especially Basis Support Packages that can be required for cases where you are required to move to a more recent DBMS release


The next section goes into more details on other SAP products and DBMS releases that are supported by SAP on Azure for Windows and Linux. 

> [!NOTE]
> The minimum releases of the different DBMS is carefully chosen and might not always reflect the whole spectrum of DBMS releases the different DBMS vendors support on Azure in general. Many SAP workload related considerations were taken into account to define those minimum releases. There is no effort to test and qualify older DBMS releases. 

> [!NOTE]
> The minimum releases listed are representing older version of operating systems and database releases. We highly encourage to use most recent operating system releases and database releases. In a lot of cases, more recent operating system and database releases took the usage case of running in public cloud into consideration and adapted code to optimize for running in public cloud or more specifically Azure

## Oracle DBMS support
Operating system, Oracle DBMS releases and Oracle functionality supported on Azure are specifically listed in [SAP support note #2039619](https://launchpad.support.sap.com/#/notes/2039619). Essence out of that note can be summarized like:

- Minimum Oracle release supported on Azure VMs that are certified for NetWeaver is Oracle 11g Release 2 Patchset 3  (11.2.0.4)
- As guest operating systems only Windows and Oracle Linux qualify. Exact releases of the OS and related minimum DBMS releases are listed in the note
- The support of Oracle Linux extends to the Oracle DBMS client as well. This means that all SAP components, like dialog instances of the ABAP or Java Stack need to run on Oracle Linux as well. Only SAP components within such an SAP system that would not connect to the Oracle DBMS would be allowed to run a different Linux operating system
- Oracle RAC is not supported 
- Oracle ASM is supported for some of the cases. Details are listed in the note
- Non-Unicode SAP systems are only supported with application servers running with Windows guest OS. The guest operating system of the DBMS can be Oracle Linux or Windows. Reason for this restriction is apparent when checking the SAP Product Availability Matrix (PAM). For Oracle Linux, SAP never released non-Unicode SAP kernels

Knowing the DBMS releases that are supported with the targeted Azure infrastructure you need to check the SAP Product Availability Matrix on whether the OS releases and DBMS required are supported with your SAP product releases you intended to run. 

## Oracle Linux
Most prominent asked question around Oracle Linux is whether SAP supports the Red Hat kernel that is integral part of Oracle Linux as well. For details read [SAP support note #1565179](https://launchpad.support.sap.com/#/notes/1565179).

## Other database than SAP HANA
Support of non-HANA databases for SAP workload is documented in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533).


## SAP HANA support
In Azure there are two services, which can be used to run HANA database:

- Azure Virtual Machines
- [HANA Large Instances](../../virtual-machines/workloads/sap/hana-overview-architecture.md)

For running SAP HANA, SAP has more and stronger conditions infrastructure needs to meet than for running NetWeaver or other SAP applications and DBMS. As a result a smaller number of Azure VMs qualify for running the SAP HANA DBMS. The list of supported Azure infrastructure supported for SAP HANA can be found in the so called [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120). 

> [!NOTE]
> The units starting with the letter 'S' are [HANA Large Instances](../../virtual-machines/workloads/sap/hana-overview-architecture.md) units. 

> [!NOTE]
> SAP has no specific certification dependent on the SAP HANA major releases. Contrary to common opinion, the column **Certification scenario** in the [HANA  certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120), the column makes **no statement about the HANA major or minor release certified**. You need to assume that all the units listed that can be used for HANA 1.0 and HANA 2.0 as long as the certified operating system releases for the specific units are supported by HANA 1.0 releases as well. 

For the usage of SAP HANA, different minimum OS releases may apply than for the general NetWeaver cases. You need to check out the supported operating systems for each unit individually since those might vary. You do so by clicking on each unit. More details will appear. One of the details listed is the different operating systems supported for this specific unit.

> [!NOTE]
> Azure HANA Large Instance units are more restrictive with supported operating systems compared to Azure VMs. On the other hand Azure VMs may enforce more recent operating releases as minimum releases. This is especially true for some of the larger VM units that required changes to Linux kernels

Knowing the supported OS for the Azure infrastructure, you need to check [SAP support note #2235581](https://launchpad.support.sap.com/#/notes/2235581) for the exact SAP HANA releases and patch levels that are supported with the Azure units you are targeting. 

> [!IMPORTANT]
> The step of checking the exact SAP HANA releases and patch levels supported is very important. In a lot of cases, support of a certain OS release is dependent on a specific patch level of the SAP HANA executables.

As you know the specific HANA releases you can run on the targeted Azure infrastructure, you need to check in the SAP Product Availability Matrix to find out whether there are restrictions with the SAP product releases that support the HANA releases you filtered out


## Certified Azure VMs and HANA Large Instance units and business transaction throughput
Besides evaluating supported operating system releases, DBMS releases and dependent support SAP software releases for Azure infrastructure units, you have the need to qualify these units by business transaction throughput, which is expressed in the unit 'SAP' by SAP. All the SAP sizing depends on SAPS calculations. Evaluating existing SAP systems, you usually can, with the help of your infrastructure provider, calculate the SAPS of the units. For the DBMS layer as well as for the application layer. In other cases where new functionality is created, a sizing exercise with SAP can reveal the required SAPS numbers for the application layer and the DBMS layer. As infrastructure provider Microsoft is obliged to provide the SAP throughput characterization of the different units that are either NetWeaver and/or HANA certified.

For Azure VMs, these SAPS throughput numbers are documented in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533). 
For Azure HANA Large Instance units, the SAPS throughput numbers are documented in [SAP support note #2316233](https://launchpad.support.sap.com/#/notes/2316233)

Looking into [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533), the following remarks apply:

- **For M-Series Azure VMs and Mv2-Series Azure VMs, different minimum OS releases apply than for other Azure VM types**. The requirement for more recent OS releases is based on changes the different operating system vendors had to provide in their operating system releases to either enable their operating systems running on the specific Azure VM types or optimize performance and throughput of SAP workload on those VM types
- There are two tables that specify different VM types. The second table specifies SAPS throughput for Azure VM types that support Azure standard Storage only. DBMS deployment on the units specified in the second table of the note is not supported


## Other SAP products supported on Azure
In general the assumption is that with the state of hyperscale clouds like Azure, most of the SAP software should run without functional problems in Azure. Nevertheless and opposite to private cloud visualization, SAP still expresses support for the different SAP products explicitly for the different hyerpscale cloud providers. As a result there are different SAP support notes indicating support for Azure for different SAP products. 

For Business Objects BI platform, [SAP support note #2145537](https://launchpad.support.sap.com/#/notes/2145537) gives a list of SAP Business Objects products supported on Azure. If there are questions around components or combinations of software releases and OS releases that seem not to be listed or supported and which are more recent than the minimum releases listed, you need to open an SAP support request against the component you inquire support for.

For Business Objects Data Services, [SAP support note #22288344](https://launchpad.support.sap.com/#/notes/2288344) explains minimum support of SAP Data Services running on Azure. 

> [!NOTE]
> As indicated in the SAP support note, you need to check in the SAP PAM to identify the correct support package level to be supported on Azure

SAP Datahub/Vora support in Azure Kubernetes Services (AKS) is detailed in [SAP support note #2464722](https://launchpad.support.sap.com/#/notes/2464722)

Support for SAP BPC 10.1 SP08 is described in [SAP support note #2451795](https://launchpad.support.sap.com/#/notes/2451795)

Support for SAP Hybris Commerce Platform on Azure is detailed in the [Hybris Documentation](https://help.sap.com/viewer/a74589c3a81a4a95bf51d87258c0ab15/1811/en-US/8c71300f866910149b40c88dfc0de431.html). As of supported DBMS for SAP Hybris Commerce Platform, it lists like:

- SQL Server and Oracle on the Windows operating system platform. Same minimum releases apply as for SAP NetWeaver. See [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533) for details
- SAP HANA on Red Hat and SUSE Linux. SAP HANA certified VM types are required as documented earlier in [this document](#sap-hana-support). SAP (Hybris) Commerce Platform is considered OLTP workload
- SQL Azure DB as of SAP (Hybris) Commerce Platform version 1811




## Next Steps
Read next steps in the [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
