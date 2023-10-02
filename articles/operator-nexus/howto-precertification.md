---
title: How to pre-certify network functions on Azure Operator Nexus 
description: Overview of the pre-certification process for network function workloads on Operator Nexus 
author: parikh-vatsal 
ms.author: vatsalparikh
ms.date: 01/30/2023
ms.topic: how-to
ms.service: azure-operator-nexus 
---

# How to pre-certify network functions on Azure Operator Nexus

The precertification of network functions accelerates deployment of network services.
The precertified network functions can be managed like any other Azure resource.
The lifecycle of these precertified network functions is managed by Azure Network Function Manager (ANFM) or an NFM of your choice.

In this section, we'll describe the process and the steps for network function precertification

## Pre-certification of network function for operators

The goal is make available a catalog of network functions that
conform to the Operator Nexus specifications. NF
partners onboarding to precertification program and ANFM service won't be
required to change the commercial licensing arrangement with the operators.

## Pre-certification process

This section outlines the precertification process for Network Function deployment.
Microsoft uses this process with Network Equipment Providers (NEP) that
provide network function(s). This process guides the partner through
onboarding the network function onto Operator Nexus and
certifies the network function deployment methods using Azure deployment
services. The goal of this program is to ensure that the partner's network function
deployment process is predictable and repeatable on the Operator Nexus platform.
Microsoft provides a precertification environment for the partners to validate
the deployment of their network function. As a result, the partners'
network functions will be published in the Microsoft catalog of
network functions. This catalog will be available to operators using the Operator Nexus platform.

If the NF partner is interested in listing their offer in the Azure Marketplace,
Microsoft works with the partner to enable this offering in the marketplace.

### Azure Network Function Manager

The Azure [Network Function Manager (ANFM)](../network-function-manager/overview.md)
provides a cloud native orchestration and managed experience for
precertified network functions (from the Azure Marketplace). The ANFM
provides consistent Azure managed applications experience for network functions.

### Pre-certification steps

Here are the steps of the NF Deployment precertification

<!--- IMG ![Pre-Certification Process](Docs/media/network-function-manager-precert-process.png) IMG --->
:::image type="content" source="media/network-function-manager-precert-process.png" alt-text="Screenshot of Pre-Certification Process.":::

Figure: Pre-Certification (precert) Process

## Prerequisites and process for partner on-boarding to the pre-cert lab

To ensure an efficient and effective onboarding process for the partner there are perquisites to precertification lab entry.

1. The partners start the Azure Marketplace agreement and [create a partner
   center account](/azure/marketplace/create-account).
   The partner can then publish the network function
   offers in the marketplace. The marketplace agreement doesn't have to be
   completed prior to precert lab entry. However, it's an important step before the
   helm charts and images on-boarded to Azure Network Function Manager (ANFM)
   service are added to the precertified catalog.

2. Microsoft will conduct several sessions on key topics with the partner:

   a. Technical discussions describing the Operator Nexus architecture with focus on run time specification:

   - Compute dimensions for Kubernetes master and worker nodes, memory, storage requirements, and compute capabilities
     - NUMA alignment
     - huge page support
     - hyperthreading
   - VM Networking/Kubernetes networking requirements:
     - SR-IOV
     - DPDK
   - Review `cloudinit` support for VM based network functions
   - Tenant Kubernetes cluster support for tenant workloads, CNI versions for Calico and Cultus

   b. The Operator Nexus platform includes a managed fabric automation service. With an agreement from the partner regarding the network function requirements, Microsoft engages with the partner and review:

   - the network fabric architecture
   - and fabric automation APIs for the creation of L2/L3 isolation-domains
   - L3 route policies that will extend the network connectivity from the node to the TOR/CE router.

   The fabric deep dive sessions identify the peering requirements, route policies, and filters that need to be configured in the fabric for testing the network function.

   c. Microsoft will work with the NEPs to onboard the helm charts and container images (CNFs) or VM images (VNFs) to the Azure Network Function Manager service (ANFM). Microsoft will consult with the partner to validate the supported versions of the helm charts for deployment using the ANFM service.

   d. Microsoft will work with the partner to identify test tool requirements for the specific network function and prepare the lab prior to entry. Microsoft will provide basic traffic simulation tools such as Developing Solutions' dsTest or Spirent Landslide in the precert lab. The partners can also deploy other test tools of their choice during the precert testing.

3. On reviewing the requirements (2a – 2d) and prior to smoke testing, Microsoft will work with the partners to define Azure Resource Manager (ARM) templates:

   - for network fabric automation components – L2/L3 isolation-domains, L3 route policies if any for the end-to-end test set-up
   - for Kubernetes cluster (CNF), VM instance (VNF), workload networks and management networks that describe subcluster networking
   - onboard the helm charts and images to ANFM service and create a vendor image version for deployment into precert lab
   - for deployment of NFs using ANFM with the user data container pods/ VMs configuration properties
   - for deployment of NEP specific config management application
   - for deployment of other CNF/VNF test tools.

### Operator Nexus technical specification documents provided to NF partners

As a part of technical engagement, the documents that Microsoft will provide to the partner are:

- Operator Nexus runtime specification document and the Azure Resource Manager (ARM) API specification document for creating Kubernetes clusters (CNFs) and VM instances (VNFs) on an Operator Nexus cluster
- Azure Resource Manager API specification document for creating fabric automation components that are required for tenant networking.
- ARM API specification document for onboarding to ANFM service. The specification will also define the customer facing APIs for deployment of network functions using the ANFM service.

### Scheduling/partner engagement

The Network Function deployment pre-certification lab will be a shared
infrastructure where multiple partners will be testing simultaneously. Based
on the available capacity in the lab Microsoft will allocate resources for
various partners to complete the Network Function deployment pre-certification activities in a timely and limited window.

If the partner has a dedicated Operator Nexus environment in their facility, Microsoft will work with them
to enable updated version of Operator Nexus software to complete Network Function deployment pre-certification.

#### Deployment testing

##### Scope of testing in the pre-certification lab

With the ARM templates defined in the previous section, Microsoft will work
with the partners to identify the appropriate lab environment to perform the
testing. Microsoft will enable the appropriate Subscription ID and Resource
Groups so that the partners can deploy all the resources from the Azure
Portal/CLI into the target lab environment. Microsoft will also enable jump box
access for the partners to perform troubleshooting or remote connectivity to
the test tools/config management tools. The following verification will be
performed by the partners and results reviewed by Microsoft:

1. Verify that the resources in the ARM template, corresponding to the tenant
   cluster definition, include:

    - Kubernetes cluster/ VM instance
    - managed fabric resources for isolation-domain and L3 route policies
    - workload networks and management network resources for Kubernetes networks/ VM networks

2. Verify the basic network connectivity between all the end points of test
   set-up is working.
3. After the tenant cluster set-up is validated, verify that the
   ANFM network function is working as designed. Verify that the
   container pods are in a running state.
4. Verify that NF works with supported versions of Kubernetes, CNI versions.
5. Verify that the helm-based upgrade operations on the NF application using
   ANFM service is working as designed.
6. Perform interface testing after the NF has been deployed and configured. This testing will validate that the networking is working as designed. And it validates Kubernetes cluster's internal network and connection to a source/sink (simulator).
7. Perform a low-volume traffic simulation on the application.  
To validate the internal routing,
   deploy the test tool application inside the Operator Nexus cluster.
To test the routing across the CE, based on the  application characteristics,
   deploy the test tool application outside the Operator Nexus cluster.
8. Azure PaaS integration (optional): Microsoft precert environment will be
   connected to an Azure region using ExpressRoute. The NEP partner can also integrate
   Azure PaaS services with their application. They can verify that the PaaS functionality is working as designed.
9. After testing is complete, delete NF resources
   in the ANFM service and verify that the container pods are removed from the
   subcluster.
10. Verify all the tenant cluster and fabric components are deleted. Validate that deleting the network fabric
    resources removes the corresponding configuration on the Network
    devices.

##### Testing tools in pre-certification lab

Microsoft will provide basic traffic simulation tools such as Developing Solutions' dsTest or Spirent Landslide in the precert lab. These tools can be used to validate packet flow patterns for the network function. The partners can also deploy other test tools of their choice during the precert testing.


#### Test results from deployment precertification testing

Microsoft will review the test results, provided by the partner, for the
application being precertified. The
objective of the Network Function Deployment Precertification process is to
ensure that the test cases defined, and test results produced comprehensively
validate the deployment of the application on the Operator Nexus platform. For interface
testing using a test tool such as Spirent, Microsoft will work with the
partners to identify the test scenarios. After the deployment validation and smoke
testing are completed in the precertification lab, Microsoft will review
the test results with the NEPS to confirm that the test results meet the scope
of deployment pre-certification.
Microsoft will then work with the partner to graduate the NF application to the
ANFM service catalog. The partners are free to share the results of the
pre-certification/re-certification testing.

#### Recertification

Microsoft will enable the preview/ update versions of Operator Nexus platform and ANFM
service releases in precert lab. Microsoft will coordinate with partners to
recertify.